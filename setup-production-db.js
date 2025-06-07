const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function setupProductionDatabase() {
  try {
    console.log('🚀 بدء إعداد قاعدة البيانات للإنتاج...')

    // إنشاء الجداول
    console.log('📋 إنشاء الجداول...')
    
    // إنشاء المستخدمين
    console.log('👥 إنشاء المستخدمين...')
    const users = await prisma.user.createMany({
      data: [
        {
          firstName: 'أحمد',
          lastName: 'محمد',
          email: 'ahmed@company.com',
          phone: '+966501234567',
          role: 'admin',
          isActive: true
        },
        {
          firstName: 'فاطمة',
          lastName: 'علي',
          email: 'fatima@company.com',
          phone: '+966501234568',
          role: 'sales',
          isActive: true
        },
        {
          firstName: 'محمد',
          lastName: 'السعد',
          email: 'mohammed@company.com',
          phone: '+966501234569',
          role: 'sales',
          isActive: true
        }
      ],
      skipDuplicates: true
    })

    // إنشاء الأنظمة
    console.log('💼 إنشاء الأنظمة...')
    const systems = await prisma.system.createMany({
      data: [
        {
          name: 'نظام المحاسبة المتقدم',
          description: 'نظام محاسبة شامل يدعم جميع العمليات المالية والمحاسبية',
          category: 'المحاسبة والمالية',
          features: JSON.stringify([
            'إدارة الحسابات',
            'التقارير المالية',
            'إدارة الفواتير',
            'تتبع المصروفات'
          ]),
          benefits: JSON.stringify([
            'توفير الوقت',
            'دقة في الحسابات',
            'تقارير تفصيلية',
            'سهولة الاستخدام'
          ]),
          targetAudience: JSON.stringify([
            'الشركات الصغيرة والمتوسطة',
            'المحاسبين',
            'أصحاب الأعمال'
          ]),
          isActive: true
        },
        {
          name: 'نظام إدارة العملاء (CRM)',
          description: 'نظام شامل لإدارة العلاقات مع العملاء وتتبع المبيعات',
          category: 'إدارة العملاء',
          features: JSON.stringify([
            'إدارة بيانات العملاء',
            'تتبع المبيعات',
            'إدارة الفرص التجارية',
            'التقارير والتحليلات'
          ]),
          benefits: JSON.stringify([
            'زيادة المبيعات',
            'تحسين خدمة العملاء',
            'تنظيم البيانات',
            'متابعة الفرص'
          ]),
          targetAudience: JSON.stringify([
            'فرق المبيعات',
            'إدارة التسويق',
            'خدمة العملاء'
          ]),
          isActive: true
        },
        {
          name: 'نظام إدارة المخزون',
          description: 'نظام متطور لإدارة المخزون والمستودعات',
          category: 'إدارة المخزون',
          features: JSON.stringify([
            'تتبع المخزون',
            'إدارة المستودعات',
            'تقارير المخزون',
            'تنبيهات النفاد'
          ]),
          benefits: JSON.stringify([
            'تحكم أفضل في المخزون',
            'تقليل الفاقد',
            'تحسين الكفاءة',
            'توفير التكاليف'
          ]),
          targetAudience: JSON.stringify([
            'مديري المخازن',
            'أصحاب المتاجر',
            'الشركات التجارية'
          ]),
          isActive: true
        }
      ],
      skipDuplicates: true
    })

    console.log('✅ تم إعداد قاعدة البيانات بنجاح!')
    console.log(`👥 تم إنشاء ${users.count} مستخدم`)
    console.log(`💼 تم إنشاء ${systems.count} نظام`)

  } catch (error) {
    console.error('❌ خطأ في إعداد قاعدة البيانات:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupProductionDatabase()
