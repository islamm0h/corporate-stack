import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // التحقق من أن قاعدة البيانات متصلة
    await prisma.$connect()

    // قراءة المعاملات من الطلب
    const body = await request.json().catch(() => ({}))
    const { reset = false } = body

    if (reset) {
      // تصفير قاعدة البيانات
      console.log('🗑️ Resetting database...')

      // حذف البيانات بالترتيب الصحيح (بسبب Foreign Keys)
      await prisma.response.deleteMany({})
      await prisma.quoteRequest.deleteMany({})
      await prisma.lead.deleteMany({})
      await prisma.systemFile.deleteMany({})
      await prisma.system.deleteMany({})
      await prisma.activityLog.deleteMany({})
      await prisma.fileUpload.deleteMany({})
      await prisma.dailyStat.deleteMany({})
      // await prisma.systemSetting.deleteMany({}) // تم تعطيله لأن الجدول غير موجود
      await prisma.user.deleteMany({})

      console.log('✅ Database reset completed')
    }

    // تشغيل migrations
    console.log('🔄 Setting up database...')
    
    // إنشاء المستخدمين الافتراضيين
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
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData as any
      })
      createdUsers.push(user)
    }

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

    // إنشاء عملاء محتملين متنوعين
    const leads = [
      {
        companyName: 'شركة التقنية المتقدمة',
        contactPerson: 'أحمد محمد',
        email: 'ahmed@tech-advanced.com',
        phone: '+966501234567',
        industry: 'تقنية المعلومات',
        companySize: 'MEDIUM',
        region: 'الرياض',
        city: 'الرياض',
        source: 'WEBSITE',
        status: 'NEW',
        leadScore: 85,
        notes: 'مهتم بنظام CRM',
        assignedToId: createdUsers[0].id // توزيع على المدير
      },
      {
        companyName: 'مؤسسة الأعمال الذكية',
        contactPerson: 'فاطمة أحمد',
        email: 'fatima@smart-business.com',
        phone: '+966501234568',
        industry: 'التجارة الإلكترونية',
        companySize: 'SMALL',
        region: 'جدة',
        city: 'جدة',
        source: 'SOCIAL_MEDIA',
        status: 'CONTACTED',
        leadScore: 75,
        notes: 'تحتاج نظام محاسبة',
        assignedToId: createdUsers[1].id // توزيع على مدير المبيعات
      },
      {
        companyName: 'شركة الحلول المتكاملة',
        contactPerson: 'محمد علي',
        email: 'mohammed@integrated-solutions.com',
        phone: '+966501234569',
        industry: 'الخدمات المالية',
        companySize: 'LARGE',
        region: 'الدمام',
        city: 'الدمام',
        source: 'REFERRAL',
        status: 'QUALIFIED',
        leadScore: 90,
        notes: 'يريد نظام شامل',
        assignedToId: createdUsers[2].id // توزيع على أحمد المبيعات
      },
      {
        companyName: 'مجموعة الابتكار التجاري',
        contactPerson: 'سارة خالد',
        email: 'sara@innovation-group.com',
        phone: '+966501234570',
        industry: 'التصنيع',
        companySize: 'ENTERPRISE',
        region: 'الرياض',
        city: 'الرياض',
        source: 'ADVERTISING',
        status: 'PROPOSAL',
        leadScore: 95,
        notes: 'عميل مهم جداً',
        assignedToId: createdUsers[3].id // توزيع على فاطمة المبيعات
      },
      {
        companyName: 'شركة المستقبل للتجارة',
        contactPerson: 'عبدالله سعد',
        email: 'abdullah@future-trade.com',
        phone: '+966501234571',
        industry: 'التجارة',
        companySize: 'MEDIUM',
        region: 'مكة المكرمة',
        city: 'مكة المكرمة',
        source: 'WEBSITE',
        status: 'NEW',
        leadScore: 70,
        notes: 'استفسار عن الأسعار',
        assignedToId: createdUsers[0].id // العودة للمدير (Round Robin)
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

    // تحديث إحصائيات التوزيع للمستخدمين
    const userAssignmentCounts = {}
    leads.forEach(lead => {
      const userId = lead.assignedToId
      userAssignmentCounts[userId] = (userAssignmentCounts[userId] || 0) + 1
    })

    for (const [userId, count] of Object.entries(userAssignmentCounts)) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          totalAssigned: count as number,
          lastAssigned: new Date(),
          assignmentOrder: count as number
        }
      })
    }

    // إنشاء طلبات عروض أسعار
    const quoteRequests = [
      {
        leadId: leads[0].email, // سنحتاج للبحث عن الـ ID الحقيقي
        systemId: systems[0].slug, // سنحتاج للبحث عن الـ ID الحقيقي
        requestType: 'QUOTE',
        message: 'نحتاج عرض سعر لنظام CRM شامل',
        budgetRange: '50000-100000',
        timeline: '3 أشهر',
        status: 'PENDING',
        priority: 'HIGH',
        assignedToId: createdUsers[0].id
      },
      {
        leadId: leads[1].email,
        systemId: systems[1].slug,
        requestType: 'DEMO',
        message: 'نريد عرض تجريبي لنظام المحاسبة',
        budgetRange: '20000-50000',
        timeline: '1 شهر',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        assignedToId: createdUsers[1].id
      }
    ]

    // البحث عن IDs الحقيقية وإنشاء الطلبات
    for (const requestData of quoteRequests) {
      const lead = await prisma.lead.findFirst({
        where: { email: requestData.leadId as string }
      })
      const system = await prisma.system.findFirst({
        where: { slug: requestData.systemId as string }
      })

      if (lead && system) {
        const existingRequest = await prisma.quoteRequest.findFirst({
          where: {
            leadId: lead.id,
            systemId: system.id
          }
        })

        if (!existingRequest) {
          await prisma.quoteRequest.create({
            data: {
              leadId: lead.id,
              systemId: system.id,
              requestType: requestData.requestType as any,
              message: requestData.message,
              budgetRange: requestData.budgetRange,
              timeline: requestData.timeline,
              status: requestData.status as any,
              priority: requestData.priority as any,
              assignedToId: requestData.assignedToId
            }
          })
        }
      }
    }

    console.log('✅ Database setup completed successfully!')

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: reset ? 'تم تصفير وإعداد قاعدة البيانات بنجاح!' : 'تم إعداد قاعدة البيانات بنجاح!',
      data: {
        reset: reset,
        users: createdUsers.length,
        systems: systems.length,
        leads: leads.length,
        quoteRequests: quoteRequests.length,
        summary: {
          totalUsers: createdUsers.length,
          activeUsers: createdUsers.filter(u => u.isActive).length,
          totalSystems: systems.length,
          activeSystems: systems.filter(s => s.isActive).length,
          totalLeads: leads.length,
          distributedLeads: leads.filter(l => l.assignedToId).length,
          totalRequests: quoteRequests.length
        }
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

// GET method للتحقق من حالة قاعدة البيانات
export async function GET() {
  try {
    await prisma.$connect()

    const userCount = await prisma.user.count()
    const systemCount = await prisma.system.count()
    const leadCount = await prisma.lead.count()

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'حالة قاعدة البيانات',
      data: {
        users: userCount,
        systems: systemCount,
        leads: leadCount,
        isEmpty: userCount === 0 && systemCount === 0 && leadCount === 0
      }
    })

  } catch (error) {
    await prisma.$disconnect()
    return NextResponse.json({
      success: false,
      message: 'فشل في الاتصال بقاعدة البيانات',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
