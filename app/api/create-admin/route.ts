import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

// Helper function to save user to JSON file as fallback
async function saveUserToFile(userData: any) {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    const filePath = path.join(dataDir, 'users.json')
    let existingUsers = []

    // Read existing users if file exists
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      existingUsers = JSON.parse(fileContent)
    }

    // Add new user
    existingUsers.push({
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    })

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(existingUsers, null, 2))

    return existingUsers[existingUsers.length - 1]
  } catch (error) {
    console.error('Error saving user to file:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    // إنشاء كلمة مرور مشفرة
    const defaultPassword = 'admin123'
    const hashedPassword = await bcrypt.hash(defaultPassword, 12)

    const userData = {
      username: 'admin',
      email: 'admin@corporatestack.com',
      firstName: 'مدير',
      lastName: 'النظام',
      passwordHash: hashedPassword,
      role: 'ADMIN' as const,
      isActive: true,
      mustChangePassword: false
    }

    let adminUser = null

    // Try to save to database first
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()

      // Check if users already exist
      const existingUsers = await prisma.user.count()
      
      if (existingUsers > 0) {
        await prisma.$disconnect()
        return NextResponse.json({
          success: false,
          message: 'يوجد مستخدمون في النظام بالفعل',
          count: existingUsers
        })
      }

      // Create admin user in database
      adminUser = await prisma.user.create({
        data: {
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      await prisma.$disconnect()
      console.log('Admin user created in database successfully')

    } catch (dbError) {
      console.log('Database not available, saving to file instead:', dbError.message)
      
      // Fallback to file system
      adminUser = await saveUserToFile(userData)
      
      if (!adminUser) {
        throw new Error('Failed to save user to file system')
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء المستخدم الافتراضي بنجاح',
      user: {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role
      },
      credentials: {
        username: 'admin',
        password: defaultPassword,
        note: 'يرجى تغيير كلمة المرور بعد تسجيل الدخول'
      }
    })

  } catch (error) {
    console.error('Error creating admin user:', error)
    return NextResponse.json({
      success: false,
      error: `فشل في إنشاء المستخدم الافتراضي: ${error.message}`,
      details: error.toString()
    }, { status: 500 })
  }
}

// GET - للتحقق من حالة المستخدمين
export async function GET(request: NextRequest) {
  try {
    let userCount = 0
    let adminUsers = []

    // Try database first
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()

      userCount = await prisma.user.count()
      adminUsers = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          isActive: true,
          createdAt: true
        }
      })

      await prisma.$disconnect()

    } catch (dbError) {
      console.log('Database not available, checking file system')
      
      // Fallback to file system
      const dataDir = path.join(process.cwd(), 'data')
      const filePath = path.join(dataDir, 'users.json')
      
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8')
        const users = JSON.parse(fileContent)
        userCount = users.length
        adminUsers = users.filter((user: any) => user.role === 'ADMIN')
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: userCount,
        adminUsers: adminUsers,
        hasUsers: userCount > 0
      }
    })

  } catch (error) {
    console.error('Error checking users:', error)
    return NextResponse.json({
      success: false,
      error: `فشل في التحقق من المستخدمين: ${error.message}`,
      details: error.toString()
    }, { status: 500 })
  }
}
