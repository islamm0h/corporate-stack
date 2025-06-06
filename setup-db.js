const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...')
    
    await prisma.$connect()
    console.log('✅ Connected to database')

    // تصفير قاعدة البيانات
    console.log('🗑️ Clearing existing data...')
    await prisma.response.deleteMany({})
    await prisma.quoteRequest.deleteMany({})
    await prisma.lead.deleteMany({})
    await prisma.notification.deleteMany({})
    await prisma.system.deleteMany({})
    await prisma.activityLog.deleteMany({})
    await prisma.fileUpload.deleteMany({})
    await prisma.backup.deleteMany({})
    await prisma.dailyStat.deleteMany({})
    await prisma.user.deleteMany({})
    console.log('✅ Database cleared')

    // إنشاء المستخدمين
    console.log('👥 Creating users...')
    const users = [
      {
        email: 'admin@corporatestack.com',
        username: 'admin',
        firstName: 'مدير',
        lastName: 'النظام',
        passwordHash: 'hashed_password_placeholder',
        phone: '+966501234567',
        role: 'ADMIN',
        isActive: true,
        emailVerified: true,
        assignmentOrder: 0,
        totalAssigned: 0
      },
      {
        email: 'manager@corporatestack.com',
        username: 'manager',
        firstName: 'مدير',
        lastName: 'المبيعات',
        passwordHash: 'hashed_password_placeholder',
        phone: '+966501234568',
        role: 'MANAGER',
        isActive: true,
        emailVerified: true,
        assignmentOrder: 0,
        totalAssigned: 0
      },
      {
        email: 'sales1@corporatestack.com',
        username: 'sales1',
        firstName: 'أحمد',
        lastName: 'المبيعات',
        passwordHash: 'hashed_password_placeholder',
        phone: '+966501234569',
        role: 'USER',
        isActive: true,
        emailVerified: true,
        assignmentOrder: 0,
        totalAssigned: 0
      },
      {
        email: 'sales2@corporatestack.com',
        username: 'sales2',
        firstName: 'فاطمة',
        lastName: 'المبيعات',
        passwordHash: 'hashed_password_placeholder',
        phone: '+966501234570',
        role: 'USER',
        isActive: true,
        emailVerified: true,
        assignmentOrder: 0,
        totalAssigned: 0
      }
    ]

    const createdUsers = []
    for (const userData of users) {
      const user = await prisma.user.create({
        data: userData
      })
      createdUsers.push(user)
      console.log(`✅ Created user: ${user.firstName} ${user.lastName}`)
    }

    // إنشاء الأنظمة
    console.log('🏢 Creating systems...')
    const systems = [
      {
        name: 'نظام المحاسبة والفاتورة الإلكترونية',
        slug: 'accounting-system',
        description: 'نظام محاسبي متكامل مع الفاتورة الإلكترونية المعتمدة من هيئة الزكاة والضريبة والجمارك',
        category: 'ACCOUNTING',
        price: 15000,
        features: [
          'إدارة الحسابات والمبيعات',
          'الفاتورة الإلكترونية المعتمدة',
          'التقارير المالية التفصيلية',
          'ربط مع البنوك السعودية'
        ],
        isActive: true
      },
      {
        name: 'نظام إدارة العملاء (CRM)',
        slug: 'crm-system',
        description: 'نظام شامل لإدارة العملاء وتتبع المبيعات وتحسين العلاقات التجارية',
        category: 'CRM',
        price: 12000,
        features: [
          'إدارة بيانات العملاء',
          'تتبع الفرص التجارية',
          'أتمتة المبيعات',
          'تقارير الأداء'
        ],
        isActive: true
      },
      {
        name: 'نظام إدارة المخازن',
        slug: 'inventory-system',
        description: 'حلول متطورة لإدارة المخزون والمستودعات بكفاءة عالية',
        category: 'INVENTORY',
        price: 10000,
        features: [
          'تتبع المخزون الفوري',
          'إدارة المستودعات المتعددة',
          'تنبيهات نفاد المخزون',
          'تقارير الحركة'
        ],
        isActive: true
      },
      {
        name: 'نظام إدارة الموارد البشرية',
        slug: 'hr-system',
        description: 'حلول شاملة لإدارة الموظفين والرواتب والحضور',
        category: 'HR',
        price: 14000,
        features: [
          'إدارة بيانات الموظفين',
          'نظام الحضور والانصراف',
          'حساب الرواتب',
          'إدارة الإجازات'
        ],
        isActive: true
      },
      {
        name: 'نظام التقارير والتحليلات',
        slug: 'analytics-system',
        description: 'أدوات تحليلية متقدمة لاتخاذ قرارات مدروسة',
        category: 'ANALYTICS',
        price: 8000,
        features: [
          'لوحات تحكم تفاعلية',
          'تقارير مخصصة',
          'تحليلات الأداء',
          'التنبؤات المستقبلية'
        ],
        isActive: true
      },
      {
        name: 'نظام التجارة الإلكترونية',
        slug: 'ecommerce-system',
        description: 'منصة متكاملة للبيع عبر الإنترنت مع جميع الأدوات المطلوبة',
        category: 'ECOMMERCE',
        price: 18000,
        features: [
          'متجر إلكتروني متكامل',
          'إدارة المنتجات',
          'نظام الدفع الآمن',
          'تتبع الطلبات'
        ],
        isActive: true
      }
    ]

    for (const systemData of systems) {
      const system = await prisma.system.create({
        data: systemData
      })
      console.log(`✅ Created system: ${system.name}`)
    }

    console.log('✅ Database setup completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`   - Users: ${createdUsers.length}`)
    console.log(`   - Systems: ${systems.length}`)
    
  } catch (error) {
    console.error('❌ Error setting up database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupDatabase()
