import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 بدء إعداد قاعدة البيانات للإنتاج...')

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

    // إنشاء بعض العملاء المحتملين التجريبيين
    const leads = await prisma.lead.createMany({
      data: [
        {
          companyName: 'شركة التقنية المتقدمة',
          contactPerson: 'خالد أحمد',
          email: 'khalid@tech-company.com',
          phone: '+966501111111',
          industry: 'التقنية',
          companySize: '50-100',
          region: 'الرياض',
          city: 'الرياض',
          source: 'الموقع الإلكتروني',
          status: 'new',
          leadScore: 85
        },
        {
          companyName: 'مؤسسة التجارة الذكية',
          contactPerson: 'سارة محمد',
          email: 'sara@smart-trade.com',
          phone: '+966502222222',
          industry: 'التجارة',
          companySize: '10-50',
          region: 'مكة المكرمة',
          city: 'جدة',
          source: 'وسائل التواصل الاجتماعي',
          status: 'contacted',
          leadScore: 75
        }
      ],
      skipDuplicates: true
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
