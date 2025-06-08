import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('Starting table creation process...')

    // Test connection first
    await prisma.$connect()
    console.log('Database connection successful')

    // Create tables using raw SQL
    console.log('Creating users table...')
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

    console.log('Creating systems table...')
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

    console.log('Creating leads table...')
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "leads" (
        "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        "company_name" VARCHAR(100) NOT NULL,
        "contact_person" VARCHAR(100) NOT NULL,
        "email" VARCHAR(100) NOT NULL,
        "phone" VARCHAR(20),
        "industry" VARCHAR(50),
        "company_size" VARCHAR(20),
        "region" VARCHAR(50),
        "city" VARCHAR(50),
        "source" VARCHAR(20) DEFAULT 'website',
        "status" VARCHAR(20) DEFAULT 'new',
        "lead_score" INTEGER DEFAULT 0,
        "notes" TEXT,
        "assigned_to" UUID,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    console.log('Creating quote_requests table...')
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "quote_requests" (
        "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        "lead_id" UUID NOT NULL,
        "system_id" UUID,
        "request_type" VARCHAR(20) DEFAULT 'quote',
        "message" TEXT,
        "budget_range" VARCHAR(50),
        "timeline" VARCHAR(50),
        "requirements" JSONB,
        "status" VARCHAR(20) DEFAULT 'pending',
        "priority" VARCHAR(20) DEFAULT 'medium',
        "assigned_to" UUID,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    console.log('Creating responses table...')
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "responses" (
        "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        "request_id" UUID NOT NULL,
        "user_id" UUID NOT NULL,
        "response_type" VARCHAR(20) DEFAULT 'email',
        "subject" VARCHAR(255),
        "content" TEXT NOT NULL,
        "attachments" JSONB,
        "status" VARCHAR(20) DEFAULT 'sent',
        "follow_up_date" DATE,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    console.log('All tables created successfully!')

    // Now create admin user
    console.log('Creating admin user...')
    const bcrypt = await import('bcryptjs')
    const hashedPassword = await bcrypt.hash('admin123', 12)

    await prisma.$executeRaw`
      INSERT INTO "users" (
        "username", "email", "password_hash", "first_name", "last_name", 
        "role", "is_active", "email_verified", "must_change_password", 
        "assignment_order", "total_assigned"
      ) VALUES (
        'admin', 'admin@corporatestack.com', ${hashedPassword}, 'مدير', 'النظام',
        'admin', true, true, false, 1, 0
      )
      ON CONFLICT (username) DO NOTHING
    `

    // Create sample systems
    console.log('Creating sample systems...')
    await prisma.$executeRaw`
      INSERT INTO "systems" (
        "name", "slug", "description", "short_description", "category",
        "features", "is_active", "is_featured", "sort_order", "version",
        "icon", "color", "status", "users", "uptime"
      ) VALUES 
      (
        'نظام إدارة علاقات العملاء', 'crm', 
        'نظام شامل لإدارة علاقات العملاء وتتبع المبيعات والفرص التجارية',
        'إدارة شاملة لعلاقات العملاء', 'إدارة',
        '["إدارة العملاء", "تتبع المبيعات", "التقارير", "التكامل"]'::jsonb,
        true, true, 1, '2.1.0', 'fas fa-users', '#3b82f6', 'active', 1250, '99.9%'
      ),
      (
        'نظام إدارة الموارد البشرية', 'hr',
        'نظام متكامل لإدارة الموارد البشرية والرواتب والحضور والانصراف',
        'إدارة الموارد البشرية والرواتب', 'موارد بشرية',
        '["إدارة الموظفين", "الرواتب", "الحضور والانصراف", "التقييم"]'::jsonb,
        true, true, 2, '1.8.5', 'fas fa-user-tie', '#10b981', 'active', 890, '99.8%'
      ),
      (
        'نظام إدارة المخزون', 'inventory',
        'نظام متقدم لإدارة المخزون والمستودعات وتتبع المنتجات',
        'إدارة المخزون والمستودعات', 'مخزون',
        '["تتبع المخزون", "إدارة المستودعات", "التنبيهات", "التقارير"]'::jsonb,
        true, false, 3, '1.5.2', 'fas fa-boxes', '#f59e0b', 'active', 650, '99.7%'
      )
      ON CONFLICT (slug) DO NOTHING
    `

    // Get final counts
    const userCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "users"` as any[]
    const systemCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "systems"` as any[]

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الجداول والبيانات بنجاح',
      tables_created: [
        'users', 'systems', 'leads', 'quote_requests', 'responses'
      ],
      data_created: {
        admin_user: 'تم إنشاء المدير',
        sample_systems: 'تم إنشاء 3 أنظمة تجريبية'
      },
      credentials: {
        username: 'admin',
        password: 'admin123',
        note: 'استخدم هذه البيانات لتسجيل الدخول'
      },
      statistics: {
        users: Number(userCount[0]?.count || 0),
        systems: Number(systemCount[0]?.count || 0)
      }
    })

  } catch (error) {
    console.error('Table creation error:', error)
    
    try {
      await prisma.$disconnect()
    } catch (disconnectError) {
      console.error('Error disconnecting:', disconnectError)
    }

    return NextResponse.json({
      success: false,
      error: 'فشل في إنشاء الجداول',
      details: error.message,
      suggestion: 'تأكد من أن قاعدة البيانات تدعم إنشاء الجداول'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await prisma.$connect()
    
    // Check if tables exist
    const tablesExist = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'systems', 'leads', 'quote_requests', 'responses')
    `

    await prisma.$disconnect()

    const tablesArray = Array.isArray(tablesExist) ? tablesExist : []

    return NextResponse.json({
      success: true,
      tables_found: tablesArray,
      tables_count: tablesArray.length,
      all_tables_exist: tablesArray.length >= 5
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'فشل في فحص الجداول',
      details: error.message
    }, { status: 500 })
  }
}
