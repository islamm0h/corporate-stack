import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 بدء إدراج البيانات التجريبية...')

  // إنشاء المستخدمين
  const admin = await prisma.user.upsert({
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

  const manager = await prisma.user.upsert({
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

  console.log('✅ تم إنشاء المستخدمين')

  // إنشاء الأنظمة
  const systems = [
    {
      name: 'نظام الحسابات والفاتورة الإلكترونية',
      slug: 'accounting-system',
      description: 'نظام متكامل لإدارة الحسابات والفواتير الإلكترونية',
      category: 'المحاسبة',
      price: 15000,
      features: ['إدارة الفواتير', 'التقارير المالية', 'الضرائب', 'المدفوعات'],
      isActive: true,
      isFeatured: true
    },
    {
      name: 'نظام إدارة العملاء (CRM)',
      slug: 'crm-system',
      description: 'نظام شامل لإدارة العلاقات مع العملاء',
      category: 'إدارة العملاء',
      price: 12000,
      features: ['إدارة العملاء', 'المتابعة', 'التقارير', 'الحملات التسويقية'],
      isActive: true,
      isFeatured: true
    },
    {
      name: 'نظام إدارة الموارد البشرية',
      slug: 'hr-system',
      description: 'نظام متطور لإدارة الموارد البشرية والرواتب',
      category: 'الموارد البشرية',
      price: 18000,
      features: ['إدارة الموظفين', 'الرواتب', 'الإجازات', 'التقييم'],
      isActive: true,
      isFeatured: false
    },
    {
      name: 'نظام إدارة المخزون',
      slug: 'inventory-system',
      description: 'نظام ذكي لإدارة المخزون والمستودعات',
      category: 'إدارة المخزون',
      price: 10000,
      features: ['تتبع المخزون', 'إدارة المستودعات', 'التنبيهات', 'التقارير'],
      isActive: true,
      isFeatured: false
    },
    {
      name: 'نظام إدارة المشاريع',
      slug: 'projects-system',
      description: 'نظام شامل لإدارة المشاريع والمهام',
      category: 'إدارة المشاريع',
      price: 14000,
      features: ['تخطيط المشاريع', 'إدارة المهام', 'التتبع', 'التقارير'],
      isActive: true,
      isFeatured: true
    },
    {
      name: 'نظام إدارة الأصول',
      slug: 'assets-system',
      description: 'نظام متقدم لإدارة وتتبع الأصول',
      category: 'إدارة الأصول',
      price: 16000,
      features: ['تسجيل الأصول', 'الصيانة', 'الاستهلاك', 'التقارير'],
      isActive: true,
      isFeatured: false
    }
  ]

  for (const systemData of systems) {
    await prisma.system.upsert({
      where: { slug: systemData.slug },
      update: {},
      create: systemData
    })
  }

  console.log('✅ تم إنشاء الأنظمة')

  // إنشاء العملاء المحتملين
  const leads = [
    {
      companyName: 'شركة الرياض التجارية',
      contactPerson: 'أحمد محمد',
      email: 'ahmed@riyadh-trade.com',
      phone: '+966501234567',
      industry: 'التجارة',
      companySize: 'MEDIUM',
      region: 'الرياض',
      city: 'الرياض',
      source: 'WEBSITE',
      status: 'NEW',
      leadScore: 75
    },
    {
      companyName: 'مؤسسة جدة للخدمات',
      contactPerson: 'فاطمة أحمد',
      email: 'fatima@jeddah-services.com',
      phone: '+966502345678',
      industry: 'الخدمات',
      companySize: 'SMALL',
      region: 'مكة المكرمة',
      city: 'جدة',
      source: 'SOCIAL_MEDIA',
      status: 'CONTACTED',
      leadScore: 60
    },
    {
      companyName: 'شركة الدمام الصناعية',
      contactPerson: 'محمد علي',
      email: 'mohammed@dammam-industrial.com',
      phone: '+966503456789',
      industry: 'الصناعة',
      companySize: 'LARGE',
      region: 'الشرقية',
      city: 'الدمام',
      source: 'REFERRAL',
      status: 'QUALIFIED',
      leadScore: 85
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

  console.log('✅ تم إنشاء العملاء المحتملين')

  // إنشاء طلبات عروض الأسعار
  const createdLeads = await prisma.lead.findMany()
  const createdSystems = await prisma.system.findMany()

  if (createdLeads.length > 0 && createdSystems.length > 0) {
    await prisma.quoteRequest.create({
      data: {
        leadId: createdLeads[0].id,
        systemId: createdSystems[0].id,
        requestType: 'QUOTE',
        message: 'نحتاج عرض سعر لنظام المحاسبة والفاتورة الإلكترونية',
        budgetRange: '10000-20000',
        timeline: 'شهرين',
        status: 'PENDING',
        priority: 'HIGH'
      }
    })

    await prisma.quoteRequest.create({
      data: {
        leadId: createdLeads[1].id,
        systemId: createdSystems[1].id,
        requestType: 'DEMO',
        message: 'نود مشاهدة عرض توضيحي لنظام إدارة العملاء',
        budgetRange: '5000-15000',
        timeline: 'شهر واحد',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM'
      }
    })
  }

  console.log('✅ تم إنشاء طلبات عروض الأسعار')

  // إنشاء إعدادات النظام
  const settings = [
    {
      category: 'general',
      key: 'site_name',
      value: 'كوربريت ستاك',
      description: 'اسم الموقع'
    },
    {
      category: 'general',
      key: 'site_description',
      value: 'نقدم حلولاً متكاملة لإدارة الأعمال',
      description: 'وصف الموقع'
    },
    {
      category: 'contact',
      key: 'email',
      value: 'info@corporatestack.com',
      description: 'البريد الإلكتروني للتواصل'
    },
    {
      category: 'contact',
      key: 'phone',
      value: '+966501234567',
      description: 'رقم الهاتف للتواصل'
    }
  ]

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: {
        category_key: {
          category: setting.category,
          key: setting.key
        }
      },
      update: {},
      create: setting
    })
  }

  console.log('✅ تم إنشاء إعدادات النظام')

  console.log('🎉 تم إكمال إدراج البيانات التجريبية بنجاح!')
}

main()
  .catch((e) => {
    console.error('❌ خطأ في إدراج البيانات:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
