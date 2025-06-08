import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

// Helper function to check admin from file
async function checkAdminFromFile(username: string, password: string) {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    const filePath = path.join(dataDir, 'admin.json')

    if (!fs.existsSync(filePath)) {
      return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf8')
    const adminData = JSON.parse(fileContent)

    if (!adminData.username || !adminData.passwordHash) {
      return null
    }

    // Check if username matches
    if (adminData.username !== username && adminData.email !== username) {
      return null
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, adminData.passwordHash)
    if (!isPasswordValid) {
      return null
    }

    return adminData
  } catch (error) {
    console.error('Error checking admin from file:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({
        success: false,
        error: 'اسم المستخدم وكلمة المرور مطلوبان'
      }, { status: 400 })
    }

    let user = null

    // Try database first
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()

      user = await prisma.user.findFirst({
        where: {
          OR: [
            { username },
            { email: username }
          ],
          isActive: true
        }
      })

      await prisma.$disconnect()
    } catch (dbError) {
      console.log('Database not available, checking file system')
    }

    // If no user found in database, check file
    if (!user) {
      const fileAdmin = await checkAdminFromFile(username, password)
      if (fileAdmin) {
        user = fileAdmin
      }
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'اسم المستخدم أو كلمة المرور غير صحيحة'
      }, { status: 401 })
    }

    // التحقق من كلمة المرور (للمستخدمين من قاعدة البيانات فقط)
    let isPasswordValid = false

    // If user came from file, password is already validated
    if (user.passwordHash && !user.createdAt?.includes?.('T')) {
      // This is from file system, password already checked
      isPasswordValid = true
    } else {
      // This is from database, need to check password
      // إذا كان المستخدم يجب عليه تغيير كلمة المرور، تحقق من كلمة المرور المؤقتة أولاً
      if (user.mustChangePassword && user.temporaryPassword) {
        isPasswordValid = await bcrypt.compare(password, user.temporaryPassword)
      }

      // إذا لم تنجح كلمة المرور المؤقتة، تحقق من كلمة المرور العادية
      if (!isPasswordValid) {
        isPasswordValid = await bcrypt.compare(password, user.passwordHash)
      }
    }

    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        error: 'اسم المستخدم أو كلمة المرور غير صحيحة'
      }, { status: 401 })
    }

    // إنشاء JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    )

    // تحديث آخر تسجيل دخول (للمستخدمين من قاعدة البيانات فقط)
    try {
      if (user.id && !user.createdAt?.includes?.('T')) {
        // This is from database, update last login
        const { PrismaClient } = await import('@prisma/client')
        const prisma = new PrismaClient()

        await prisma.user.update({
          where: { id: user.id },
          data: {
            lastLogin: new Date()
          }
        })

        await prisma.$disconnect()
      }
    } catch (updateError) {
      console.log('Could not update last login, but login successful')
    }

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.toLowerCase(),
        mustChangePassword: user.mustChangePassword,
        lastLogin: user.lastLogin
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}
