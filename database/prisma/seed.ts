import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 بدء إدراج البيانات التجريبية...')

  // إنشاء كلمات مرور مشفرة
  const adminPassword = await bcrypt.hash('admin123', 12)
  const managerPassword = await bcrypt.hash('manager123', 12)
  const userPassword = await bcrypt.hash('user123', 12)

  // إنشاء المستخدمين
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cs-leads-system.com' },
    update: {},
    create: {
      email: 'admin@cs-leads-system.com',
      username: 'admin',
      firstName: 'مدير',
      lastName: 'النظام',
      passwordHash: adminPassword,
      role: 'ADMIN',
      isActive: true,
      emailVerified: true,
      mustChangePassword: false,
      assignmentOrder: 1
    }
  })

  const manager = await prisma.user.upsert({
    where: { email: 'manager@cs-leads-system.com' },
    update: {},
    create: {
      email: 'manager@cs-leads-system.com',
      username: 'manager',
      firstName: 'مدير',
      lastName: 'المبيعات',
      passwordHash: managerPassword,
      role: 'MANAGER',
      isActive: true,
      emailVerified: true,
      mustChangePassword: false,
      assignmentOrder: 2
    }
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@cs-leads-system.com' },
    update: {},
    create: {
      email: 'user@cs-leads-system.com',
      username: 'user',
      firstName: 'مستخدم',
      lastName: 'تجريبي',
      passwordHash: userPassword,
      role: 'USER',
      isActive: true,
      emailVerified: true,
      mustChangePassword: true,
      assignmentOrder: 3
    }
  })

  console.log('✅ تم إنشاء المستخدمين')

  // إنشاء الأنظمة
  const systems = [
    {
      name: 'نظام الحسابات والفاتورة الإلكترونية',
      slug: 'accounting-system',
      description: 'نظام متكامل لإدارة الحسابات والفواتير الإلكترونية مع دعم الفاتورة الإلكترونية السعودية',
      shortDescription: 'إدارة الحسابات والفواتير الإلكترونية',
      category: 'المحاسبة',
      price: 15000,
      currency: 'SAR',
      features: JSON.stringify(['إدارة الفواتير', 'التقارير المالية', 'الضرائب', 'المدفوعات']),
      isActive: true,
      isFeatured: true,
      version: '3.2.0',
      icon: 'fas fa-calculator',
      color: '#2ecc71',
      status: 'active',
      users: 245,
      uptime: '99.9%'
    },
    {
      name: 'نظام إدارة العملاء (CRM)',
      slug: 'crm-system',
      description: 'نظام شامل لإدارة العلاقات مع العملاء وتتبع المبيعات',
      shortDescription: 'إدارة العملاء والمبيعات',
      category: 'إدارة العملاء',
      price: 12000,
      currency: 'SAR',
      features: JSON.stringify(['إدارة العملاء', 'المتابعة', 'التقارير', 'الحملات التسويقية']),
      isActive: true,
      isFeatured: true,
      version: '2.8.0',
      icon: 'fas fa-users',
      color: '#3498db',
      status: 'active',
      users: 189,
      uptime: '99.8%'
    },
    {
      name: 'نظام إدارة الموارد البشرية',
      slug: 'hr-system',
      description: 'نظام متطور لإدارة الموارد البشرية والرواتب والحضور والانصراف',
      shortDescription: 'إدارة الموارد البشرية والرواتب',
      category: 'الموارد البشرية',
      price: 18000,
      currency: 'SAR',
      features: JSON.stringify(['إدارة الموظفين', 'الرواتب', 'الإجازات', 'التقييم']),
      isActive: true,
      isFeatured: false,
      version: '4.1.0',
      icon: 'fas fa-user-tie',
      color: '#e74c3c',
      status: 'active',
      users: 156,
      uptime: '99.7%'
    },
    {
      name: 'نظام إدارة المخزون',
      slug: 'inventory-system',
      description: 'نظام ذكي لإدارة المخزون والمستودعات مع تتبع المنتجات',
      shortDescription: 'إدارة المخزون والمستودعات',
      category: 'إدارة المخزون',
      price: 10000,
      currency: 'SAR',
      features: JSON.stringify(['تتبع المخزون', 'إدارة المستودعات', 'التنبيهات', 'التقارير']),
      isActive: true,
      isFeatured: false,
      version: '2.5.0',
      icon: 'fas fa-boxes',
      color: '#f39c12',
      status: 'active',
      users: 98,
      uptime: '99.6%'
    },
    {
      name: 'نظام إدارة المشاريع',
      slug: 'projects-system',
      description: 'نظام شامل لإدارة المشاريع والمهام مع تتبع التقدم',
      shortDescription: 'إدارة المشاريع والمهام',
      category: 'إدارة المشاريع',
      price: 14000,
      currency: 'SAR',
      features: JSON.stringify(['تخطيط المشاريع', 'إدارة المهام', 'التتبع', 'التقارير']),
      isActive: true,
      isFeatured: true,
      version: '3.0.0',
      icon: 'fas fa-project-diagram',
      color: '#9b59b6',
      status: 'active',
      users: 134,
      uptime: '99.8%'
    },
    {
      name: 'نظام إدارة الأصول',
      slug: 'assets-system',
      description: 'نظام متقدم لإدارة وتتبع الأصول والصيانة',
      shortDescription: 'إدارة وتتبع الأصول',
      category: 'إدارة الأصول',
      price: 16000,
      currency: 'SAR',
      features: JSON.stringify(['تسجيل الأصول', 'الصيانة', 'الاستهلاك', 'التقارير']),
      isActive: true,
      isFeatured: false,
      version: '1.9.0',
      icon: 'fas fa-building',
      color: '#34495e',
      status: 'active',
      users: 67,
      uptime: '99.5%'
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
      leadScore: 75,
      notes: 'مهتم بنظام المحاسبة والفاتورة الإلكترونية',
      assignedToId: manager.id
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
      leadScore: 60,
      notes: 'تحتاج نظام إدارة العملاء',
      assignedToId: user.id
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
      leadScore: 85,
      notes: 'يريد نظام شامل لإدارة المشاريع والموارد البشرية',
      assignedToId: admin.id
    },
    {
      companyName: 'شركة المدينة التقنية',
      contactPerson: 'سارة خالد',
      email: 'sara@medina-tech.com',
      phone: '+966504567890',
      industry: 'تقنية المعلومات',
      companySize: 'MEDIUM',
      region: 'المدينة المنورة',
      city: 'المدينة المنورة',
      source: 'ADVERTISING',
      status: 'PROPOSAL',
      leadScore: 90,
      notes: 'عميل محتمل ممتاز، يحتاج عدة أنظمة',
      assignedToId: manager.id
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
        message: 'نحتاج عرض سعر لنظام المحاسبة والفاتورة الإلكترونية مع التدريب والدعم الفني',
        budgetRange: '10000-20000',
        timeline: 'شهرين',
        requirements: JSON.stringify(['تدريب الموظفين', 'دعم فني لمدة سنة', 'تخصيص حسب احتياجاتنا']),
        status: 'PENDING',
        priority: 'HIGH',
        assignedToId: manager.id
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
        requirements: JSON.stringify(['عرض توضيحي مفصل', 'تجربة النظام']),
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        assignedToId: user.id
      }
    })

    await prisma.quoteRequest.create({
      data: {
        leadId: createdLeads[2].id,
        systemId: createdSystems[4].id,
        requestType: 'CONSULTATION',
        message: 'نحتاج استشارة حول أفضل نظام لإدارة المشاريع',
        budgetRange: '15000-25000',
        timeline: 'ثلاثة أشهر',
        requirements: JSON.stringify(['استشارة مجانية', 'تحليل احتياجات', 'خطة تنفيذ']),
        status: 'COMPLETED',
        priority: 'HIGH',
        assignedToId: admin.id
      }
    })
  }

  console.log('✅ تم إنشاء طلبات عروض الأسعار')

  // إنشاء إعدادات النظام
  const settings = [
    {
      category: 'general',
      key: 'site_name',
      value: JSON.stringify('نظام إدارة العملاء المحتملين'),
      description: 'اسم الموقع',
      isPublic: true
    },
    {
      category: 'general',
      key: 'site_description',
      value: JSON.stringify('نظام متكامل لإدارة العملاء المحتملين والمبيعات'),
      description: 'وصف الموقع',
      isPublic: true
    },
    {
      category: 'contact',
      key: 'email',
      value: JSON.stringify('info@cs-leads-system.com'),
      description: 'البريد الإلكتروني للتواصل',
      isPublic: true
    },
    {
      category: 'contact',
      key: 'phone',
      value: JSON.stringify('+966501234567'),
      description: 'رقم الهاتف للتواصل',
      isPublic: true
    },
    {
      category: 'leads',
      key: 'auto_assignment',
      value: JSON.stringify(true),
      description: 'التوزيع التلقائي للعملاء المحتملين',
      isPublic: false
    },
    {
      category: 'email',
      key: 'from_email',
      value: JSON.stringify('noreply@cs-leads-system.com'),
      description: 'البريد الإلكتروني للإرسال',
      isPublic: false
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
