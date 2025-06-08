import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  let prisma: any = null

  try {
    console.log('Starting database admin creation...')

    // Check for Vercel Postgres URL first
    const vercelUrl = process.env.POSTGRES_URL
    const localUrl = process.env.DATABASE_URL

    console.log('Environment check:', {
      hasVercelUrl: !!vercelUrl,
      hasLocalUrl: !!localUrl,
      nodeEnv: process.env.NODE_ENV
    })

    // Try to import and initialize Prisma
    const { PrismaClient } = await import('@prisma/client')

    // Use Vercel URL if available, otherwise fall back to local
    const databaseUrl = vercelUrl || localUrl

    if (!databaseUrl) {
      throw new Error('No database URL found in environment variables')
    }

    prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl
        }
      },
      log: ['error', 'warn'],
    })

    // Test database connection
    console.log('Testing database connection...')
    await prisma.$connect()
    console.log('Database connected successfully')

    // حذف جميع المستخدمين الموجودين
    console.log('Deleting all existing users...')
    const deletedCount = await prisma.user.deleteMany({})
    console.log(`Deleted ${deletedCount.count} users`)

    // إنشاء كلمة مرور مشفرة
    const password = 'admin123'
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log('Password hashed successfully')

    // إنشاء المستخدم الجديد
    console.log('Creating new admin user...')
    const adminUser = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@corporatestack.com',
        firstName: 'مدير',
        lastName: 'النظام',
        passwordHash: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        mustChangePassword: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    console.log('Admin user created successfully with ID:', adminUser.id)

    // التحقق من إنشاء المستخدم
    const verification = await prisma.user.findUnique({
      where: { username: 'admin' }
    })

    const userCount = await prisma.user.count()

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء المدير في قاعدة البيانات بنجاح',
      admin: {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        role: adminUser.role,
        isActive: adminUser.isActive,
        createdAt: adminUser.createdAt
      },
      verification: {
        userExists: !!verification,
        totalUsers: userCount,
        adminId: verification?.id
      },
      credentials: {
        username: 'admin',
        password: 'admin123',
        note: 'استخدم هذه البيانات لتسجيل الدخول'
      }
    })

  } catch (error) {
    console.error('Database admin creation error:', error)

    return NextResponse.json({
      success: false,
      error: 'فشل في إنشاء المدير في قاعدة البيانات',
      details: error.message,
      errorType: error.constructor.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  } finally {
    // Always disconnect
    if (prisma) {
      try {
        await prisma.$disconnect()
        console.log('Database disconnected')
      } catch (disconnectError) {
        console.error('Error disconnecting:', disconnectError)
      }
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    const userCount = await prisma.user.count()
    const adminUser = await prisma.user.findUnique({
      where: { username: 'admin' },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    })

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: userCount,
        adminExists: !!adminUser,
        adminUser: adminUser,
        allUsers: allUsers,
        databaseConnected: true
      }
    })

  } catch (error) {
    console.error('Error checking database:', error)
    return NextResponse.json({
      success: false,
      error: 'فشل في الاتصال بقاعدة البيانات',
      details: error.message,
      databaseConnected: false
    }, { status: 500 })
  }
}
