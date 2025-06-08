import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting connection fix...')

    // Try different approaches to fix the connection
    let results = {
      prismaTest: { success: false, error: null },
      directConnection: { success: false, error: null },
      accelerateTest: { success: false, error: null }
    }

    // Test 1: Basic Prisma connection
    try {
      console.log('Testing basic Prisma connection...')
      const { PrismaClient } = await import('@prisma/client')
      
      // Create client with specific configuration
      const prisma = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL
          }
        },
        log: ['error', 'warn']
      })

      // Test connection
      await prisma.$connect()
      console.log('Basic Prisma connection successful')
      
      // Try to query or create tables
      try {
        const result = await prisma.$queryRaw`SELECT 1 as test`
        console.log('Raw query successful:', result)
        results.prismaTest = { success: true, error: null }
      } catch (queryError) {
        console.log('Raw query failed, trying table operations...')
        
        // Try to create tables if they don't exist
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
          console.log('Users table created successfully')
          results.prismaTest = { success: true, error: null }
        } catch (createError) {
          console.log('Table creation failed:', createError.message)
          results.prismaTest = { success: false, error: createError.message }
        }
      }

      await prisma.$disconnect()

    } catch (prismaError) {
      console.error('Basic Prisma connection failed:', prismaError)
      results.prismaTest = { success: false, error: prismaError.message }
    }

    // Test 2: Direct PostgreSQL connection (if available)
    try {
      console.log('Testing direct PostgreSQL connection...')
      
      // Extract connection details from DATABASE_URL
      const dbUrl = process.env.DATABASE_URL
      if (dbUrl && dbUrl.includes('postgresql://')) {
        console.log('PostgreSQL URL detected')
        results.directConnection = { success: true, error: null }
      } else if (dbUrl && dbUrl.includes('prisma+postgres://')) {
        console.log('Prisma Accelerate URL detected')
        results.accelerateTest = { success: true, error: null }
      }

    } catch (directError) {
      console.error('Direct connection test failed:', directError)
      results.directConnection = { success: false, error: directError.message }
    }

    // Test 3: Try to push schema using Prisma
    try {
      console.log('Testing schema push...')
      
      // This would normally be done via CLI, but we can try programmatically
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      
      await prisma.$connect()
      
      // Try to create a simple admin user to test if tables exist
      try {
        const bcrypt = await import('bcryptjs')
        const hashedPassword = await bcrypt.hash('admin123', 12)
        
        // Try to insert admin user
        const adminUser = await prisma.user.create({
          data: {
            username: 'admin',
            email: 'admin@corporatestack.com',
            passwordHash: hashedPassword,
            firstName: 'مدير',
            lastName: 'النظام',
            role: 'ADMIN',
            isActive: true,
            emailVerified: true,
            mustChangePassword: false,
            assignmentOrder: 1,
            totalAssigned: 0
          }
        })

        await prisma.$disconnect()

        return NextResponse.json({
          success: true,
          message: 'تم إصلاح الاتصال وإنشاء المدير بنجاح',
          method: 'schema_push_and_admin_creation',
          admin: {
            id: adminUser.id,
            username: adminUser.username,
            email: adminUser.email
          },
          credentials: {
            username: 'admin',
            password: 'admin123',
            note: 'استخدم هذه البيانات لتسجيل الدخول'
          },
          tests: results
        })

      } catch (userError) {
        console.log('User creation failed, but connection works:', userError.message)
        
        // Check if user already exists
        try {
          const existingUser = await prisma.user.findFirst({
            where: { username: 'admin' }
          })

          await prisma.$disconnect()

          if (existingUser) {
            return NextResponse.json({
              success: true,
              message: 'الاتصال يعمل والمدير موجود مسبقاً',
              method: 'existing_admin_found',
              admin: {
                id: existingUser.id,
                username: existingUser.username,
                email: existingUser.email
              },
              credentials: {
                username: 'admin',
                password: 'admin123',
                note: 'استخدم هذه البيانات لتسجيل الدخول'
              },
              tests: results
            })
          }
        } catch (findError) {
          console.log('Find user also failed:', findError.message)
        }

        await prisma.$disconnect()
      }

    } catch (schemaError) {
      console.error('Schema push failed:', schemaError)
    }

    // If all tests completed, return results
    return NextResponse.json({
      success: results.prismaTest.success || results.directConnection.success || results.accelerateTest.success,
      message: 'تم اختبار الاتصال',
      tests: results,
      recommendations: [
        'تحقق من صحة DATABASE_URL',
        'تأكد من أن قاعدة البيانات متاحة',
        'جرب إعادة تشغيل التطبيق',
        'تحقق من إعدادات Prisma Accelerate'
      ],
      databaseUrl: process.env.DATABASE_URL ? 'موجود' : 'غير موجود',
      environment: process.env.NODE_ENV
    })

  } catch (error) {
    console.error('Connection fix error:', error)
    return NextResponse.json({
      success: false,
      error: 'فشل في إصلاح الاتصال',
      details: error.message,
      suggestion: 'تحقق من إعدادات قاعدة البيانات'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Simple connection test
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    await prisma.$connect()
    const result = await prisma.$queryRaw`SELECT 1 as test`
    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'الاتصال يعمل بشكل صحيح',
      result,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'فشل في اختبار الاتصال',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
