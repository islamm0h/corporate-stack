const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const systems = [
  {
    name: 'نظام المحاسبة والفاتورة الإلكترونية',
    slug: 'accounting-electronic-invoice-system',
    description: 'نظام متكامل لإدارة الحسابات والفواتير الإلكترونية مع ربط هيئة الزكاة والضريبة والدعم الكامل للمعايير السعودية',
    shortDescription: 'نظام محاسبة متطور يدعم الفواتير الإلكترونية وربط هيئة الزكاة والضريبة',
    category: 'مالي',
    features: [
      'فواتير إلكترونية معتمدة',
      'ربط هيئة الزكاة والضريبة',
      'تقارير مالية شاملة',
      'إدارة العملاء والموردين',
      'نظام الخزينة والبنوك',
      'التكامل مع البنوك السعودية'
    ],
    specifications: {
      'نوع النظام': 'ويب وموبايل',
      'قاعدة البيانات': 'SQL Server / MySQL',
      'اللغات المدعومة': 'العربية والإنجليزية',
      'التكامل': 'API متقدم',
      'الأمان': 'تشفير SSL وحماية متقدمة'
    },
    images: [
      '/images/systems/accounting-dashboard.jpg',
      '/images/systems/accounting-invoice.jpg',
      '/images/systems/accounting-reports.jpg'
    ],
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
    seoTitle: 'نظام المحاسبة والفاتورة الإلكترونية - حلول مالية متكاملة',
    seoDescription: 'نظام محاسبة متطور يدعم الفواتير الإلكترونية وربط هيئة الزكاة والضريبة مع تقارير مالية شاملة وإدارة متكاملة للحسابات',
    seoKeywords: ['نظام محاسبة', 'فواتير إلكترونية', 'الزكاة والضريبة', 'تقارير مالية', 'إدارة حسابات', 'نظام مالي']
  },
  {
    name: 'نظام إدارة العملاء (CRM)',
    slug: 'crm-customer-management-system',
    description: 'نظام شامل لإدارة العلاقات مع العملاء وتتبع المبيعات والفرص التجارية مع أدوات تسويق متقدمة',
    shortDescription: 'نظام CRM متطور لإدارة العملاء وتتبع المبيعات مع أتمتة التسويق',
    category: 'مبيعات',
    features: [
      'إدارة جهات الاتصال',
      'تتبع الفرص التجارية',
      'تقارير المبيعات المتقدمة',
      'أتمتة التسويق',
      'إدارة خط المبيعات',
      'تحليلات العملاء'
    ],
    specifications: {
      'نوع النظام': 'ويب وموبايل',
      'التكامل': 'WhatsApp, Email, SMS',
      'التقارير': 'تقارير تفاعلية ولوحات معلومات',
      'الأمان': 'حماية بيانات العملاء',
      'المستخدمين': 'متعدد المستخدمين مع صلاحيات'
    },
    images: [
      '/images/systems/crm-dashboard.jpg',
      '/images/systems/crm-contacts.jpg',
      '/images/systems/crm-pipeline.jpg'
    ],
    isActive: true,
    isFeatured: true,
    sortOrder: 2,
    seoTitle: 'نظام إدارة العملاء CRM - إدارة العلاقات والمبيعات',
    seoDescription: 'نظام CRM شامل لإدارة العملاء وتتبع الفرص التجارية مع تقارير مبيعات متقدمة وأتمتة التسويق',
    seoKeywords: ['نظام CRM', 'إدارة العملاء', 'تتبع المبيعات', 'أتمتة التسويق', 'إدارة العلاقات', 'نظام مبيعات']
  },
  {
    name: 'نظام إدارة الموارد البشرية',
    slug: 'hr-human-resources-system',
    description: 'نظام متكامل لإدارة شؤون الموظفين والرواتب والحضور والانصراف مع نظام تقييم الأداء',
    shortDescription: 'نظام HR متكامل لإدارة الموظفين والرواتب مع نظام الحضور والانصراف',
    category: 'موارد بشرية',
    features: [
      'إدارة بيانات الموظفين',
      'نظام الرواتب والمكافآت',
      'الحضور والانصراف',
      'تقييم الأداء',
      'إدارة الإجازات',
      'التقارير الحكومية'
    ],
    specifications: {
      'نوع النظام': 'ويب وموبايل',
      'أجهزة البصمة': 'متوافق مع جميع الأجهزة',
      'التقارير': 'تقارير حكومية جاهزة',
      'التكامل': 'البنوك والتأمينات الاجتماعية',
      'اللغات': 'العربية والإنجليزية'
    },
    images: [
      '/images/systems/hr-dashboard.jpg',
      '/images/systems/hr-employees.jpg',
      '/images/systems/hr-payroll.jpg'
    ],
    isActive: true,
    isFeatured: true,
    sortOrder: 3,
    seoTitle: 'نظام إدارة الموارد البشرية - إدارة الموظفين والرواتب',
    seoDescription: 'نظام HR متكامل لإدارة الموظفين والرواتب مع تتبع الحضور وتقييم الأداء والتقارير الحكومية',
    seoKeywords: ['نظام HR', 'إدارة الموظفين', 'نظام الرواتب', 'الحضور والانصراف', 'تقييم الأداء', 'موارد بشرية']
  },
  {
    name: 'نظام إدارة المخزون',
    slug: 'inventory-management-system',
    description: 'نظام متطور لإدارة المخزون والمواد مع تتبع المستويات والتنبيهات التلقائية وإدارة المستودعات',
    shortDescription: 'نظام مخزون متطور لتتبع المواد وإدارة المستودعات مع تنبيهات النفاد',
    category: 'مخزون',
    features: [
      'تتبع المخزون الفوري',
      'إدارة المستودعات المتعددة',
      'تقارير الجرد التفصيلية',
      'تنبيهات النفاد التلقائية',
      'إدارة الموردين',
      'نظام الباركود'
    ],
    specifications: {
      'نوع النظام': 'ويب وموبايل',
      'الباركود': 'قارئ باركود متقدم',
      'التقارير': 'تقارير مخزون شاملة',
      'التنبيهات': 'تنبيهات فورية ومجدولة',
      'التكامل': 'أنظمة المحاسبة والمبيعات'
    },
    images: [
      '/images/systems/inventory-dashboard.jpg',
      '/images/systems/inventory-warehouse.jpg',
      '/images/systems/inventory-reports.jpg'
    ],
    isActive: true,
    isFeatured: false,
    sortOrder: 4,
    seoTitle: 'نظام إدارة المخزون - تتبع المواد والمستودعات',
    seoDescription: 'نظام إدارة مخزون شامل لتتبع المواد والمستودعات مع تنبيهات تلقائية وتقارير مفصلة',
    seoKeywords: ['نظام مخزون', 'إدارة المستودعات', 'تتبع المواد', 'تقارير الجرد', 'تنبيهات النفاد', 'إدارة المخزون']
  },
  {
    name: 'نظام إدارة المشاريع',
    slug: 'project-management-system',
    description: 'نظام شامل لإدارة المشاريع وتتبع المهام والموارد مع أدوات التعاون والتقارير المتقدمة',
    shortDescription: 'نظام إدارة مشاريع متطور لتتبع المهام والموارد مع أدوات التعاون',
    category: 'إدارة',
    features: [
      'إدارة المشاريع والمهام',
      'تتبع الوقت والموارد',
      'أدوات التعاون الجماعي',
      'تقارير الأداء',
      'إدارة الميزانيات',
      'تقويم المشاريع'
    ],
    specifications: {
      'نوع النظام': 'ويب وموبايل',
      'التعاون': 'أدوات تعاون متقدمة',
      'التقارير': 'تقارير أداء شاملة',
      'التنبيهات': 'تنبيهات المواعيد والمهام',
      'التكامل': 'تقويم جوجل وOutlook'
    },
    images: [
      '/images/systems/project-dashboard.jpg',
      '/images/systems/project-tasks.jpg',
      '/images/systems/project-timeline.jpg'
    ],
    isActive: true,
    isFeatured: false,
    sortOrder: 5,
    seoTitle: 'نظام إدارة المشاريع - تتبع المهام والموارد',
    seoDescription: 'نظام إدارة مشاريع شامل لتتبع المهام والموارد مع أدوات التعاون وتقارير الأداء',
    seoKeywords: ['نظام إدارة مشاريع', 'تتبع المهام', 'إدارة الموارد', 'التعاون الجماعي', 'تقارير الأداء', 'إدارة الوقت']
  },
  {
    name: 'نظام نقاط البيع (POS)',
    slug: 'pos-point-of-sale-system',
    description: 'نظام نقاط بيع متطور للمتاجر والمطاعم مع دعم الفواتير الإلكترونية وإدارة المخزون',
    shortDescription: 'نظام نقاط بيع متطور للمتاجر والمطاعم مع الفواتير الإلكترونية',
    category: 'مبيعات',
    features: [
      'واجهة بيع سريعة وسهلة',
      'دعم الفواتير الإلكترونية',
      'إدارة المخزون المتكاملة',
      'تقارير المبيعات اليومية',
      'دعم طرق الدفع المتعددة',
      'نظام الولاء والخصومات'
    ],
    specifications: {
      'نوع النظام': 'ويب وتطبيق سطح المكتب',
      'الأجهزة': 'متوافق مع جميع أجهزة POS',
      'الدفع': 'كاش، فيزا، مدى، STC Pay',
      'الطباعة': 'طابعات حرارية وعادية',
      'التكامل': 'أنظمة المحاسبة والمخزون'
    },
    images: [
      '/images/systems/pos-interface.jpg',
      '/images/systems/pos-payment.jpg',
      '/images/systems/pos-reports.jpg'
    ],
    isActive: true,
    isFeatured: true,
    sortOrder: 6,
    seoTitle: 'نظام نقاط البيع POS - حلول البيع بالتجزئة',
    seoDescription: 'نظام نقاط بيع متطور للمتاجر والمطاعم مع دعم الفواتير الإلكترونية وإدارة المخزون',
    seoKeywords: ['نظام نقاط البيع', 'POS', 'كاشير', 'فواتير إلكترونية', 'إدارة المتاجر', 'نظام مبيعات']
  },
  {
    name: 'نظام إدارة المحتوى (CMS)',
    slug: 'cms-content-management-system',
    description: 'نظام إدارة محتوى متطور لإنشاء وإدارة المواقع الإلكترونية مع أدوات SEO متقدمة',
    shortDescription: 'نظام إدارة محتوى متطور لإنشاء وإدارة المواقع مع أدوات SEO',
    category: 'تقني',
    features: [
      'محرر محتوى متقدم',
      'إدارة الصفحات والمقالات',
      'أدوات SEO متكاملة',
      'إدارة الوسائط',
      'نظام التعليقات',
      'قوالب متجاوبة'
    ],
    specifications: {
      'نوع النظام': 'ويب',
      'التقنية': 'React, Next.js',
      'قاعدة البيانات': 'MySQL, PostgreSQL',
      'الاستضافة': 'سحابية ومحلية',
      'الأمان': 'حماية متقدمة ضد الهجمات'
    },
    images: [
      '/images/systems/cms-editor.jpg',
      '/images/systems/cms-dashboard.jpg',
      '/images/systems/cms-seo.jpg'
    ],
    isActive: true,
    isFeatured: false,
    sortOrder: 7,
    seoTitle: 'نظام إدارة المحتوى CMS - إنشاء وإدارة المواقع',
    seoDescription: 'نظام إدارة محتوى متطور لإنشاء وإدارة المواقع الإلكترونية مع أدوات SEO متقدمة',
    seoKeywords: ['نظام إدارة محتوى', 'CMS', 'إنشاء مواقع', 'إدارة محتوى', 'SEO', 'مواقع إلكترونية']
  }
]

async function seedSystems() {
  try {
    console.log('🌱 بدء إضافة الأنظمة...')

    for (const systemData of systems) {
      // التحقق من وجود النظام
      const existingSystem = await prisma.system.findUnique({
        where: { slug: systemData.slug }
      })

      if (existingSystem) {
        console.log(`⚠️  النظام ${systemData.name} موجود بالفعل`)
        continue
      }

      // إنشاء النظام
      const system = await prisma.system.create({
        data: systemData
      })

      console.log(`✅ تم إنشاء النظام: ${system.name}`)
    }

    console.log('🎉 تم إنشاء جميع الأنظمة بنجاح!')
  } catch (error) {
    console.error('❌ خطأ في إنشاء الأنظمة:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedSystems()
