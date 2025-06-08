import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 بدء إعداد قاعدة البيانات للإنتاج...')

    // إنشاء المستخدمين
    console.log('👥 إنشاء المستخدمين...')

    // تشفير كلمة مرور افتراضية
    const defaultPassword = await bcrypt.hash('123456789', 12)

    const users = await prisma.user.createMany({
      data: [
        {
          firstName: 'أحمد',
          lastName: 'محمد',
          username: 'admin',
          email: 'ahmed@company.com',
          passwordHash: defaultPassword,
          phone: '+966501234567',
          role: 'ADMIN',
          isActive: true,
          mustChangePassword: false
        },
        {
          firstName: 'فاطمة',
          lastName: 'علي',
          username: 'fatima.ali',
          email: 'fatima@company.com',
          passwordHash: defaultPassword,
          phone: '+966501234568',
          role: 'USER',
          isActive: true,
          mustChangePassword: true
        },
        {
          firstName: 'محمد',
          lastName: 'السعد',
          username: 'mohammed.saad',
          email: 'mohammed@company.com',
          passwordHash: defaultPassword,
          phone: '+966501234569',
          role: 'USER',
          isActive: true,
          mustChangePassword: true
        }
      ]
    })

    // إنشاء الأنظمة
    console.log('💼 إنشاء الأنظمة...')
    const systems = await prisma.system.createMany({
      data: [
        {
          name: 'نظام المحاسبة المتقدم',
          slug: 'accounting-system',
          description: 'نظام محاسبة شامل يدعم جميع العمليات المالية والمحاسبية',
          shortDescription: 'نظام محاسبة متكامل للشركات',
          category: 'المحاسبة والمالية',
          features: JSON.stringify([
            'إدارة الحسابات',
            'التقارير المالية',
            'إدارة الفواتير',
            'تتبع المصروفات'
          ]),
          specifications: JSON.stringify({
            benefits: [
              'توفير الوقت',
              'دقة في الحسابات',
              'تقارير تفصيلية',
              'سهولة الاستخدام'
            ],
            targetAudience: [
              'الشركات الصغيرة والمتوسطة',
              'المحاسبين',
              'أصحاب الأعمال'
            ]
          }),
          isActive: true
        },
        {
          name: 'نظام إدارة العملاء (CRM)',
          slug: 'crm-system',
          description: 'نظام شامل لإدارة العلاقات مع العملاء وتتبع المبيعات',
          shortDescription: 'نظام CRM متكامل لإدارة العملاء',
          category: 'إدارة العملاء',
          features: JSON.stringify([
            'إدارة بيانات العملاء',
            'تتبع المبيعات',
            'إدارة الفرص التجارية',
            'التقارير والتحليلات'
          ]),
          specifications: JSON.stringify({
            benefits: [
              'زيادة المبيعات',
              'تحسين خدمة العملاء',
              'تنظيم البيانات',
              'متابعة الفرص'
            ],
            targetAudience: [
              'فرق المبيعات',
              'إدارة التسويق',
              'خدمة العملاء'
            ]
          }),
          isActive: true
        },
        {
          name: 'نظام إدارة المخزون',
          slug: 'inventory-system',
          description: 'نظام متطور لإدارة المخزون والمستودعات',
          shortDescription: 'نظام إدارة مخزون ذكي',
          category: 'إدارة المخزون',
          features: JSON.stringify([
            'تتبع المخزون',
            'إدارة المستودعات',
            'تقارير المخزون',
            'تنبيهات النفاد'
          ]),
          specifications: JSON.stringify({
            benefits: [
              'تحكم أفضل في المخزون',
              'تقليل الفاقد',
              'تحسين الكفاءة',
              'توفير التكاليف'
            ],
            targetAudience: [
              'مديري المخازن',
              'أصحاب المتاجر',
              'الشركات التجارية'
            ]
          }),
          isActive: true
        }
      ]
    })

    // إنشاء بعض العملاء المحتملين التجريبيين
    const leads = await prisma.lead.createMany({
      data: [
        {
          companyName: 'شركة التقنية المتقدمة',
          contactPerson: 'خالد أحمد',
          email: 'khalid@tech-company.com',
          phone: '+966501111111',
          industry: 'التقنية',
          companySize: 'MEDIUM',
          region: 'الرياض',
          city: 'الرياض',
          source: 'WEBSITE',
          status: 'NEW',
          leadScore: 85
        },
        {
          companyName: 'مؤسسة التجارة الذكية',
          contactPerson: 'سارة محمد',
          email: 'sara@smart-trade.com',
          phone: '+966502222222',
          industry: 'التجارة',
          companySize: 'SMALL',
          region: 'مكة المكرمة',
          city: 'جدة',
          source: 'SOCIAL_MEDIA',
          status: 'CONTACTED',
          leadScore: 75
        }
      ]
    })

    return NextResponse.json({
      success: true,
      message: 'تم إعداد قاعدة البيانات بنجاح',
      data: {
        users: users.count,
        systems: systems.count,
        leads: leads.count
      }
    })

  } catch (error) {
    console.error('❌ خطأ في إعداد قاعدة البيانات:', error)
    return NextResponse.json({
      success: false,
      error: 'فشل في إعداد قاعدة البيانات',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
