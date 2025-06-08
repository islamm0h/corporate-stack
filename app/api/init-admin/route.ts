import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

// Helper function to save admin to file
async function saveAdminToFile() {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    const filePath = path.join(dataDir, 'admin.json')
    
    // Check if admin already exists
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const adminData = JSON.parse(fileContent)
      if (adminData.username) {
        return { exists: true, admin: adminData }
      }
    }

    // Create admin data
    const defaultPassword = 'admin123'
    const hashedPassword = await bcrypt.hash(defaultPassword, 12)
    
    const adminData = {
      id: 'admin-' + Date.now(),
      username: 'admin',
      email: 'admin@corporatestack.com',
      firstName: 'مدير',
      lastName: 'النظام',
      passwordHash: hashedPassword,
      role: 'ADMIN',
      isActive: true,
      mustChangePassword: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Save to file
    fs.writeFileSync(filePath, JSON.stringify(adminData, null, 2))

    return { 
      exists: false, 
      admin: adminData,
      credentials: {
        username: 'admin',
        password: defaultPassword
      }
    }

  } catch (error) {
    console.error('Error saving admin to file:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Starting admin initialization...')

    // Try file-based approach first (more reliable)
    const fileResult = await saveAdminToFile()
    
    if (fileResult.exists) {
      return NextResponse.json({
        success: false,
        message: 'المدير موجود بالفعل في النظام',
        admin: {
          username: fileResult.admin.username,
          email: fileResult.admin.email
        }
      })
    }

    // Try to also save to database if available
    try {
      console.log('Attempting to save to database...')
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()

      // Check if any users exist
      const userCount = await prisma.user.count()
      console.log('Existing user count:', userCount)

      if (userCount === 0) {
        // Create admin in database
        await prisma.user.create({
          data: {
            username: fileResult.admin.username,
            email: fileResult.admin.email,
            firstName: fileResult.admin.firstName,
            lastName: fileResult.admin.lastName,
            passwordHash: fileResult.admin.passwordHash,
            role: 'ADMIN',
            isActive: true,
            mustChangePassword: false,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        console.log('Admin saved to database successfully')
      }

      await prisma.$disconnect()
    } catch (dbError) {
      console.log('Database save failed, but file save succeeded:', dbError.message)
    }

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء المدير بنجاح',
      admin: {
        id: fileResult.admin.id,
        username: fileResult.admin.username,
        email: fileResult.admin.email,
        role: fileResult.admin.role
      },
      credentials: fileResult.credentials,
      note: 'تم حفظ بيانات المدير بنجاح. يمكنك الآن تسجيل الدخول.'
    })

  } catch (error) {
    console.error('Admin initialization error:', error)
    return NextResponse.json({
      success: false,
      error: 'فشل في إنشاء المدير',
      details: error.message,
      suggestion: 'تأكد من أن الخادم يعمل بشكل صحيح'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    let hasAdmin = false
    let adminInfo = null

    // Check file first
    const dataDir = path.join(process.cwd(), 'data')
    const filePath = path.join(dataDir, 'admin.json')
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const adminData = JSON.parse(fileContent)
      if (adminData.username) {
        hasAdmin = true
        adminInfo = {
          username: adminData.username,
          email: adminData.email,
          createdAt: adminData.createdAt
        }
      }
    }

    // Also check database if available
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      
      const userCount = await prisma.user.count()
      if (userCount > 0) {
        hasAdmin = true
        const admin = await prisma.user.findFirst({
          where: { role: 'ADMIN' },
          select: {
            username: true,
            email: true,
            createdAt: true
          }
        })
        if (admin) {
          adminInfo = admin
        }
      }

      await prisma.$disconnect()
    } catch (dbError) {
      console.log('Database check failed, using file data')
    }

    return NextResponse.json({
      success: true,
      hasAdmin,
      adminInfo,
      message: hasAdmin ? 'يوجد مدير في النظام' : 'لا يوجد مدير في النظام'
    })

  } catch (error) {
    console.error('Error checking admin status:', error)
    return NextResponse.json({
      success: false,
      error: 'فشل في التحقق من حالة المدير',
      details: error.message
    }, { status: 500 })
  }
}
