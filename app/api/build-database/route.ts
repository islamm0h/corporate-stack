import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('Starting database build process...')

    // Test database connection
    console.log('Testing database connection...')
    await prisma.$connect()
    console.log('Database connection successful')

    // Check if database is already set up
    let tablesExist = false
    try {
      const userCount = await prisma.user.count()
      console.log(`Found ${userCount} existing users`)
      tablesExist = true

      if (userCount > 0) {
        const adminUser = await prisma.user.findFirst({
          where: { role: 'ADMIN' }
        })

        if (adminUser) {
          await prisma.$disconnect()
          return NextResponse.json({
            success: true,
            message: 'قاعدة البيانات موجودة ومُعدة مسبقاً',
            status: 'already_exists',
            admin: {
              id: adminUser.id,
              username: adminUser.username,
              email: adminUser.email
            },
            userCount,
            credentials: {
              username: 'admin',
              password: 'admin123',
              note: 'استخدم هذه البيانات لتسجيل الدخول'
            },
            note: 'يمكنك استخدام بيانات تسجيل الدخول الموجودة'
          })
        }
      }
    } catch (error) {
      console.log('Database tables might not exist yet, proceeding with setup...')
      tablesExist = false
    }

    // If tables don't exist, we need to create them first
    if (!tablesExist) {
      console.log('Tables do not exist. Creating schema...')

      // Try to create tables using raw SQL
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
            "role" VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
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

        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "systems" (
            "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            "name" VARCHAR(100) NOT NULL,
            "slug" VARCHAR(100) UNIQUE NOT NULL,
            "description" TEXT,
            "short_description" VARCHAR(255),
            "category" VARCHAR(50),
            "price" DECIMAL(10, 2),
            "currency" VARCHAR(3) DEFAULT 'SAR',
            "features" JSONB,
            "specifications" JSONB,
            "images" JSONB,
            "is_active" BOOLEAN DEFAULT true,
            "is_featured" BOOLEAN DEFAULT false,
            "sort_order" INTEGER DEFAULT 0,
            "seo_title" VARCHAR(255),
            "seo_description" VARCHAR(500),
            "seo_keywords" TEXT[],
            "version" VARCHAR(20) DEFAULT '1.0.0',
            "icon" VARCHAR(50) DEFAULT 'fas fa-cog',
            "color" VARCHAR(20) DEFAULT '#0066cc',
            "status" VARCHAR(20) DEFAULT 'active',
            "users" INTEGER DEFAULT 0,
            "uptime" VARCHAR(10) DEFAULT '99.9%',
            "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )
        `

        console.log('Basic tables created successfully')
      } catch (sqlError) {
        console.log('SQL table creation failed, trying Prisma push...')
        // If raw SQL fails, the tables might already exist or there's a permission issue
      }
    }

    // Push database schema (create tables)
    console.log('Creating database tables...')
    
    // Since we can't run prisma commands directly, we'll try to create a user
    // which will trigger table creation if using Prisma Accelerate
    
    // Clear existing data (if any)
    try {
      await prisma.user.deleteMany({})
      await prisma.lead.deleteMany({})
      await prisma.system.deleteMany({})
      await prisma.quoteRequest.deleteMany({})
      await prisma.response.deleteMany({})
      console.log('Cleared existing data')
    } catch (error) {
      console.log('No existing data to clear or tables not created yet')
    }

    // Create admin user
    console.log('Creating admin user...')
    const password = 'admin123'
    const hashedPassword = await bcrypt.hash(password, 12)

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

    console.log('Admin user created:', adminUser.id)

    // Create sample systems
    console.log('Creating sample systems...')
    const systems = [
      {
        name: 'نظام إدارة علاقات العملاء',
        slug: 'crm',
        description: 'نظام شامل لإدارة علاقات العملاء وتتبع المبيعات والفرص التجارية',
        shortDescription: 'إدارة شاملة لعلاقات العملاء',
        category: 'إدارة',
        features: ['إدارة العملاء', 'تتبع المبيعات', 'التقارير', 'التكامل'],
        isActive: true,
        isFeatured: true,
        sortOrder: 1,
        version: '2.1.0',
        icon: 'fas fa-users',
        color: '#3b82f6',
        status: 'active',
        users: 1250,
        uptime: '99.9%'
      },
      {
        name: 'نظام إدارة الموارد البشرية',
        slug: 'hr',
        description: 'نظام متكامل لإدارة الموارد البشرية والرواتب والحضور والانصراف',
        shortDescription: 'إدارة الموارد البشرية والرواتب',
        category: 'موارد بشرية',
        features: JSON.stringify(['إدارة الموظفين', 'الرواتب', 'الحضور والانصراف', 'التقييم']),
        isActive: true,
        isFeatured: true,
        sortOrder: 2,
        version: '1.8.5',
        icon: 'fas fa-user-tie',
        color: '#10b981',
        status: 'active',
        users: 890,
        uptime: '99.8%'
      },
      {
        name: 'نظام إدارة المخزون',
        slug: 'inventory',
        description: 'نظام متقدم لإدارة المخزون والمستودعات وتتبع المنتجات',
        shortDescription: 'إدارة المخزون والمستودعات',
        category: 'مخزون',
        features: JSON.stringify(['تتبع المخزون', 'إدارة المستودعات', 'التنبيهات', 'التقارير']),
        isActive: true,
        isFeatured: false,
        sortOrder: 3,
        version: '1.5.2',
        icon: 'fas fa-boxes',
        color: '#f59e0b',
        status: 'active',
        users: 650,
        uptime: '99.7%'
      },
      {
        name: 'نظام إدارة المشاريع',
        slug: 'projects',
        description: 'نظام شامل لإدارة المشاريع والمهام والفرق',
        shortDescription: 'إدارة المشاريع والمهام',
        category: 'مشاريع',
        features: JSON.stringify(['تخطيط المشاريع', 'إدارة المهام', 'التعاون', 'التتبع']),
        isActive: true,
        isFeatured: false,
        sortOrder: 4,
        version: '2.0.1',
        icon: 'fas fa-project-diagram',
        color: '#8b5cf6',
        status: 'active',
        users: 420,
        uptime: '99.6%'
      },
      {
        name: 'نظام إدارة الأصول',
        slug: 'assets',
        description: 'نظام لإدارة وتتبع أصول الشركة والصيانة',
        shortDescription: 'إدارة أصول الشركة',
        category: 'أصول',
        features: JSON.stringify(['تسجيل الأصول', 'الصيانة', 'الاستهلاك', 'التقارير']),
        isActive: true,
        isFeatured: false,
        sortOrder: 5,
        version: '1.3.0',
        icon: 'fas fa-building',
        color: '#ef4444',
        status: 'active',
        users: 280,
        uptime: '99.5%'
      }
    ]

    for (const systemData of systems) {
      await prisma.system.create({
        data: systemData
      })
    }

    console.log('Sample systems created')

    // Get final counts
    const finalUserCount = await prisma.user.count()
    const systemCount = await prisma.system.count()

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'تم بناء قاعدة البيانات بنجاح',
      status: 'created',
      database: {
        type: 'PostgreSQL',
        orm: 'Prisma',
        accelerate: true,
        provider: 'Prisma Cloud'
      },
      admin: {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role
      },
      credentials: {
        username: 'admin',
        password: 'admin123',
        note: 'استخدم هذه البيانات لتسجيل الدخول'
      },
      statistics: {
        users: finalUserCount,
        systems: systemCount,
        leads: 0,
        requests: 0
      },
      nextSteps: [
        'اذهب إلى صفحة تسجيل الدخول',
        'استخدم البيانات المعطاة',
        'ابدأ في استخدام النظام'
      ]
    })

  } catch (error) {
    console.error('Database build error:', error)
    
    try {
      await prisma.$disconnect()
    } catch (disconnectError) {
      console.error('Error disconnecting from database:', disconnectError)
    }

    return NextResponse.json({
      success: false,
      error: 'فشل في بناء قاعدة البيانات',
      details: error.message,
      suggestion: 'تأكد من صحة اتصال قاعدة البيانات'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check database status
    await prisma.$connect()
    
    const userCount = await prisma.user.count()
    const systemCount = await prisma.system.count()
    const leadCount = await prisma.lead.count()
    const requestCount = await prisma.quoteRequest.count()

    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      connected: true,
      database: {
        type: 'PostgreSQL',
        orm: 'Prisma',
        accelerate: true,
        provider: 'Prisma Cloud'
      },
      statistics: {
        users: userCount,
        systems: systemCount,
        leads: leadCount,
        requests: requestCount
      },
      admin: {
        exists: !!adminUser,
        username: adminUser?.username,
        email: adminUser?.email
      },
      status: userCount > 0 ? 'ready' : 'needs_setup'
    })

  } catch (error) {
    console.error('Database status check error:', error)
    
    try {
      await prisma.$disconnect()
    } catch (disconnectError) {
      console.error('Error disconnecting from database:', disconnectError)
    }

    return NextResponse.json({
      success: false,
      connected: false,
      error: 'فشل في الاتصال بقاعدة البيانات',
      details: error.message
    }, { status: 500 })
  }
}
