import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // التحقق من أن قاعدة البيانات متصلة
    await prisma.$connect()
    
    // تشغيل migrations
    console.log('🔄 Setting up database...')
    
    // إنشاء المستخدم الافتراضي
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@corporatestack.com' },
      update: {},
      create: {
        email: 'admin@corporatestack.com',
        username: 'admin',
        firstName: 'مدير',
        lastName: 'النظام',
        passwordHash: 'hashed_password_placeholder',
        role: 'ADMIN',
        isActive: true
      }
    })

    // إنشاء مستخدم مدير المبيعات
    const managerUser = await prisma.user.upsert({
      where: { email: 'manager@corporatestack.com' },
      update: {},
      create: {
        email: 'manager@corporatestack.com',
        username: 'manager',
        firstName: 'مدير',
        lastName: 'المبيعات',
        passwordHash: 'hashed_password_placeholder',
        role: 'MANAGER',
        isActive: true
      }
    })

    // إنشاء الأنظمة الافتراضية
    const systems = [
      {
        name: 'نظام الحسابات والفاتورة الإلكترونية',
        slug: 'accounting',
        description: 'نظام متكامل لإدارة الحسابات والفواتير الإلكترونية',
        shortDescription: 'نظام شامل للحسابات والفواتير',
        category: 'المحاسبة والمالية',
        price: 2500,
        currency: 'SAR',
        features: ['إدارة الفواتير', 'التقارير المالية', 'الضرائب'],
        specifications: {},
        images: [],
        isActive: true,
        isFeatured: true,
        sortOrder: 1,
        seoTitle: 'نظام الحسابات والفاتورة الإلكترونية',
        seoDescription: 'نظام متكامل لإدارة الحسابات والفواتير الإلكترونية',
        seoKeywords: ['محاسبة', 'فواتير', 'ضرائب']
      },
      {
        name: 'نظام إدارة العملاء (CRM)',
        slug: 'crm',
        description: 'نظام شامل لإدارة العلاقات مع العملاء',
        shortDescription: 'نظام إدارة العملاء المتقدم',
        category: 'إدارة العملاء',
        price: 3000,
        currency: 'SAR',
        features: ['إدارة العملاء', 'المتابعة', 'التقارير'],
        specifications: {},
        images: [],
        isActive: true,
        isFeatured: true,
        sortOrder: 2,
        seoTitle: 'نظام إدارة العملاء CRM',
        seoDescription: 'نظام شامل لإدارة العلاقات مع العملاء',
        seoKeywords: ['crm', 'عملاء', 'مبيعات']
      }
    ]

    for (const systemData of systems) {
      await prisma.system.upsert({
        where: { slug: systemData.slug },
        update: {},
        create: systemData as any
      })
    }

    // إنشاء بعض العملاء المحتملين التجريبيين
    const leads = [
      {
        companyName: 'شركة التقنية المتقدمة',
        contactPerson: 'أحمد محمد',
        email: 'ahmed@tech-advanced.com',
        phone: '+966501234567',
        industry: 'تقنية المعلومات',
        companySize: '50-100',
        region: 'الرياض',
        city: 'الرياض',
        source: 'موقع الويب',
        status: 'جديد',
        leadScore: 85,
        notes: 'مهتم بنظام CRM'
      }
    ]

    for (const leadData of leads) {
      const existingLead = await prisma.lead.findFirst({
        where: { email: leadData.email }
      })
      
      if (!existingLead) {
        await prisma.lead.create({
          data: leadData as any
        })
      }
    }

    // إنشاء الإعدادات الافتراضية
    const settings = [
      {
        category: 'general',
        key: 'site_name',
        value: 'كوربريت ستاك',
        description: 'اسم الموقع',
        isPublic: true
      },
      {
        category: 'general',
        key: 'site_description',
        value: 'حلول إدارة الأعمال المتكاملة',
        description: 'وصف الموقع',
        isPublic: true
      }
    ]

    for (const settingData of settings) {
      await prisma.setting.upsert({
        where: {
          category_key: {
            category: settingData.category,
            key: settingData.key
          }
        },
        update: {},
        create: settingData
      })
    }

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'تم إعداد قاعدة البيانات بنجاح!',
      data: {
        users: 2,
        systems: systems.length,
        leads: leads.length,
        settings: settings.length
      }
    })

  } catch (error) {
    console.error('Database setup error:', error)
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: false,
      message: 'فشل في إعداد قاعدة البيانات',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
