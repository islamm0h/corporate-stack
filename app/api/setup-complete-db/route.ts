import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting complete database setup...')

    let setupResults = {
      prismaSetup: { success: false, error: null, adminCreated: false },
      vercelSetup: { success: false, error: null, adminCreated: false },
      finalResult: { success: false, method: null, credentials: null }
    }

    // Try Prisma setup first
    try {
      console.log('Attempting Prisma setup...')
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()

      await prisma.$connect()

      // Create password hash
      const password = 'admin123'
      const hashedPassword = await bcrypt.hash(password, 12)

      // Delete all existing users
      await prisma.user.deleteMany({})

      // Create admin user
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

      await prisma.$disconnect()

      setupResults.prismaSetup = {
        success: true,
        error: null,
        adminCreated: true
      }

      setupResults.finalResult = {
        success: true,
        method: 'Prisma',
        credentials: { username: 'admin', password: 'admin123' }
      }

      console.log('Prisma setup successful')

    } catch (prismaError) {
      console.error('Prisma setup failed:', prismaError)
      setupResults.prismaSetup = {
        success: false,
        error: prismaError.message,
        adminCreated: false
      }
    }

    // If Prisma failed, try Vercel Postgres
    if (!setupResults.prismaSetup.success) {
      try {
        console.log('Attempting Vercel Postgres setup...')
        const { sql } = await import('@vercel/postgres')

        // Create password hash
        const password = 'admin123'
        const hashedPassword = await bcrypt.hash(password, 12)

        // Delete all existing users
        await sql`DELETE FROM users`

        // Create admin user
        await sql`
          INSERT INTO users (
            id,
            username, 
            email, 
            password_hash, 
            first_name, 
            last_name, 
            role, 
            is_active, 
            must_change_password, 
            created_at, 
            updated_at
          ) VALUES (
            gen_random_uuid(),
            'admin',
            'admin@corporatestack.com',
            ${hashedPassword},
            'مدير',
            'النظام',
            'admin',
            true,
            false,
            NOW(),
            NOW()
          )
        `

        setupResults.vercelSetup = {
          success: true,
          error: null,
          adminCreated: true
        }

        setupResults.finalResult = {
          success: true,
          method: 'Vercel Postgres',
          credentials: { username: 'admin', password: 'admin123' }
        }

        console.log('Vercel Postgres setup successful')

      } catch (vercelError) {
        console.error('Vercel Postgres setup failed:', vercelError)
        setupResults.vercelSetup = {
          success: false,
          error: vercelError.message,
          adminCreated: false
        }
      }
    }

    // Return results
    if (setupResults.finalResult.success) {
      return NextResponse.json({
        success: true,
        message: `تم إعداد قاعدة البيانات بنجاح باستخدام ${setupResults.finalResult.method}`,
        method: setupResults.finalResult.method,
        credentials: setupResults.finalResult.credentials,
        setupDetails: setupResults,
        note: 'قاعدة البيانات جاهزة ومربوطة بالكامل مع لوحة التحكم'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'فشل في إعداد قاعدة البيانات بجميع الطرق المتاحة',
        setupDetails: setupResults,
        suggestions: [
          'تأكد من إعداد متغيرات البيئة في Vercel',
          'تحقق من إعدادات قاعدة البيانات',
          'راجع سجلات الأخطاء للتفاصيل'
        ]
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Complete database setup error:', error)
    return NextResponse.json({
      success: false,
      error: 'فشل في إعداد قاعدة البيانات',
      details: error.message
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check current database status
    const response = await fetch(`${request.nextUrl.origin}/api/check-db-connection`)
    const dbStatus = await response.json()

    return NextResponse.json({
      success: true,
      currentStatus: dbStatus,
      message: 'فحص حالة قاعدة البيانات'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'فشل في فحص حالة قاعدة البيانات',
      details: error.message
    }, { status: 500 })
  }
}
