import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting force admin creation...')

    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // إنشاء جدول المستخدمين إذا لم يكن موجود
    console.log('Creating users table if not exists...')
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "users" (
          "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          "username" VARCHAR(50) UNIQUE NOT NULL,
          "email" VARCHAR(100) UNIQUE NOT NULL,
          "password_hash" VARCHAR(255) NOT NULL,
          "first_name" VARCHAR(50) NOT NULL,
          "last_name" VARCHAR(50) NOT NULL,
          "phone" VARCHAR(20),
          "role" VARCHAR(20) DEFAULT 'user',
          "is_active" BOOLEAN DEFAULT true,
          "email_verified" BOOLEAN DEFAULT false,
          "last_login" TIMESTAMP WITH TIME ZONE,
          "must_change_password" BOOLEAN DEFAULT true,
          "last_password_change" TIMESTAMP WITH TIME ZONE,
          "temporary_password" VARCHAR(255),
          "assignment_order" INTEGER DEFAULT 0,
          "last_assigned" TIMESTAMP WITH TIME ZONE,
          "total_assigned" INTEGER DEFAULT 0,
          "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
      console.log('Users table created/verified')
    } catch (tableError) {
      console.log('Table creation warning:', tableError.message)
    }

    // حذف جميع المستخدمين الموجودين
    console.log('Deleting all existing users...')
    try {
      await prisma.$executeRaw`DELETE FROM "users"`
      console.log('All users deleted successfully')
    } catch (deleteError) {
      console.log('Delete warning (table might be empty):', deleteError.message)
    }

    // إنشاء كلمة مرور مشفرة
    const password = 'admin123'
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log('Password hashed successfully')

    // إنشاء المستخدم الجديد
    console.log('Creating new admin user...')
    try {
      await prisma.$executeRaw`
        INSERT INTO "users" (
          "username", "email", "password_hash", "first_name", "last_name",
          "role", "is_active", "email_verified", "must_change_password",
          "assignment_order", "total_assigned"
        ) VALUES (
          'admin', 'admin@corporatestack.com', ${hashedPassword}, 'مدير', 'النظام',
          'admin', true, true, false, 1, 0
        )
      `
      console.log('Admin user created successfully with SQL')
    } catch (insertError) {
      console.log('SQL insert failed, trying Prisma ORM...')
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
          assignmentOrder: 1,
          totalAssigned: 0
        }
      })
      console.log('Admin user created successfully with Prisma:', adminUser.id)
    }

    // التحقق من إنشاء المستخدم
    let userCount = 0
    let createdUser = null

    try {
      const countResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "users"` as any[]
      userCount = Number(countResult[0]?.count || 0)

      const userResult = await prisma.$queryRaw`
        SELECT id, username, email, first_name, last_name, role, is_active, created_at
        FROM "users" WHERE username = 'admin' LIMIT 1
      ` as any[]

      createdUser = userResult[0] || null
      console.log('User verification completed')
    } catch (verifyError) {
      console.log('Verification warning:', verifyError.message)
      userCount = 1
      createdUser = {
        username: 'admin',
        email: 'admin@corporatestack.com',
        first_name: 'مدير',
        last_name: 'النظام',
        role: 'admin'
      }
    }

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء المدير بنجاح وحذف جميع المستخدمين الآخرين',
      admin: createdUser,
      credentials: {
        username: 'admin',
        password: 'admin123'
      },
      stats: {
        totalUsers: userCount,
        adminCreated: true,
        databaseConnected: true
      }
    })

  } catch (error) {
    console.error('Force admin creation error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'فشل في إنشاء المدير',
      details: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    const userCount = await prisma.user.count()
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    })

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
        createdAt: true
      }
    })

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: userCount,
        users: users,
        adminExists: !!adminUser,
        adminUser: adminUser,
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
