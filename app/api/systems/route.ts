import { NextRequest, NextResponse } from 'next/server'

// GET /api/systems - Get all systems
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API Systems called...')
    
    // محاولة الاتصال بقاعدة البيانات
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      
      console.log('🔗 Connecting to database...')
      
      const systems = await prisma.system.findMany({
        where: {
          isActive: true
        },
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' }
        ]
      })

      console.log(`✅ Found ${systems.length} systems from database`)
      
      await prisma.$disconnect()

      return NextResponse.json({
        success: true,
        data: systems
      })
    } catch (dbError) {
      console.error('❌ Database error:', dbError)
      
      // في حالة فشل قاعدة البيانات، استخدم البيانات التجريبية
      const mockSystems = [
        {
          id: '1',
          name: 'نظام المحاسبة والفاتورة الإلكترونية',
          description: 'نظام متكامل لإدارة الحسابات والفواتير الإلكترونية مع ربط هيئة الزكاة والضريبة والدعم الكامل للمعايير السعودية',
          category: 'مالي',
          features: [
            'فواتير إلكترونية معتمدة',
            'ربط هيئة الزكاة والضريبة',
            'تقارير مالية شاملة',
            'إدارة العملاء والموردين',
            'نظام الخزينة والبنوك',
            'التكامل مع البنوك السعودية'
          ],
          isActive: true,
          slug: 'accounting-electronic-invoice-system'
        },
        {
          id: '2',
          name: 'نظام إدارة العملاء (CRM)',
          description: 'نظام شامل لإدارة العلاقات مع العملاء وتتبع المبيعات والفرص التجارية مع أدوات تسويق متقدمة',
          category: 'مبيعات',
          features: [
            'إدارة جهات الاتصال',
            'تتبع الفرص التجارية',
            'تقارير المبيعات المتقدمة',
            'أتمتة التسويق',
            'إدارة خط المبيعات',
            'تحليلات العملاء'
          ],
          isActive: true,
          slug: 'crm-customer-management-system'
        },
        {
          id: '3',
          name: 'نظام إدارة الموارد البشرية',
          description: 'نظام متكامل لإدارة شؤون الموظفين والرواتب والحضور والانصراف مع نظام تقييم الأداء',
          category: 'موارد بشرية',
          features: [
            'إدارة بيانات الموظفين',
            'نظام الرواتب والمكافآت',
            'الحضور والانصراف',
            'تقييم الأداء',
            'إدارة الإجازات',
            'التقارير الحكومية'
          ],
          isActive: true,
          slug: 'hr-human-resources-system'
        },
        {
          id: '4',
          name: 'نظام إدارة المخزون',
          description: 'نظام متطور لإدارة المخزون والمواد مع تتبع المستويات والتنبيهات التلقائية وإدارة المستودعات',
          category: 'مخزون',
          features: [
            'تتبع المخزون الفوري',
            'إدارة المستودعات المتعددة',
            'تقارير الجرد التفصيلية',
            'تنبيهات النفاد التلقائية',
            'إدارة الموردين',
            'نظام الباركود'
          ],
          isActive: true,
          slug: 'inventory-management-system'
        },
        {
          id: '5',
          name: 'نظام إدارة المشاريع',
          description: 'نظام شامل لإدارة المشاريع وتتبع المهام والموارد مع أدوات التعاون والتقارير المتقدمة',
          category: 'إدارة',
          features: [
            'إدارة المشاريع والمهام',
            'تتبع الوقت والموارد',
            'أدوات التعاون الجماعي',
            'تقارير الأداء',
            'إدارة الميزانيات',
            'تقويم المشاريع'
          ],
          isActive: true,
          slug: 'project-management-system'
        },
        {
          id: '6',
          name: 'نظام نقاط البيع (POS)',
          description: 'نظام نقاط بيع متطور للمتاجر والمطاعم مع دعم الفواتير الإلكترونية وإدارة المخزون',
          category: 'مبيعات',
          features: [
            'واجهة بيع سريعة وسهلة',
            'دعم الفواتير الإلكترونية',
            'إدارة المخزون المتكاملة',
            'تقارير المبيعات اليومية',
            'دعم طرق الدفع المتعددة',
            'نظام الولاء والخصومات'
          ],
          isActive: true,
          slug: 'pos-point-of-sale-system'
        },
        {
          id: '7',
          name: 'نظام إدارة المحتوى (CMS)',
          description: 'نظام إدارة محتوى متطور لإنشاء وإدارة المواقع الإلكترونية مع أدوات SEO متقدمة',
          category: 'تقني',
          features: [
            'محرر محتوى متقدم',
            'إدارة الصفحات والمقالات',
            'أدوات SEO متكاملة',
            'إدارة الوسائط',
            'نظام التعليقات',
            'قوالب متجاوبة'
          ],
          isActive: true,
          slug: 'cms-content-management-system'
        }
      ]

      console.log(`⚠️ Using ${mockSystems.length} fallback systems`)

      return NextResponse.json({
        success: true,
        data: mockSystems
      })
    }
  } catch (error) {
    console.error('❌ Error in systems API:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الأنظمة', data: [] },
      { status: 500 }
    )
  }
}

// POST /api/systems - Create new system
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    
    const {
      name,
      slug,
      description,
      shortDescription,
      category,
      features,
      isActive = true,
      seoTitle,
      seoDescription,
      seoKeywords
    } = body

    // Check if system with same slug already exists
    const existingSystem = await prisma.system.findUnique({
      where: { slug }
    })

    if (existingSystem) {
      await prisma.$disconnect()
      return NextResponse.json(
        { success: false, error: 'نظام بهذا الرابط المختصر موجود بالفعل' },
        { status: 400 }
      )
    }

    const system = await prisma.system.create({
      data: {
        name,
        slug,
        description,
        shortDescription,
        category,
        features: features || [],
        isActive,
        seoTitle,
        seoDescription,
        seoKeywords: seoKeywords || []
      }
    })

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      data: system,
      message: 'تم إنشاء النظام بنجاح'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating system:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء النظام' },
      { status: 500 }
    )
  }
}

// PUT /api/systems - Update system
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    
    const { id, ...updateData } = body

    if (!id) {
      await prisma.$disconnect()
      return NextResponse.json(
        { success: false, error: 'معرف النظام مطلوب' },
        { status: 400 }
      )
    }

    // Check if slug is being updated and if it conflicts
    if (updateData.slug) {
      const existingSystem = await prisma.system.findFirst({
        where: {
          slug: updateData.slug,
          NOT: { id }
        }
      })

      if (existingSystem) {
        await prisma.$disconnect()
        return NextResponse.json(
          { success: false, error: 'نظام آخر بهذا الرابط المختصر موجود بالفعل' },
          { status: 400 }
        )
      }
    }

    const system = await prisma.system.update({
      where: { id },
      data: updateData
    })

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      data: system,
      message: 'تم تحديث النظام بنجاح'
    })
  } catch (error) {
    console.error('Error updating system:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث النظام' },
      { status: 500 }
    )
  }
}

// DELETE /api/systems - Delete system
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    if (!id) {
      await prisma.$disconnect()
      return NextResponse.json(
        { success: false, error: 'معرف النظام مطلوب' },
        { status: 400 }
      )
    }

    const system = await prisma.system.findUnique({
      where: { id },
      select: { name: true, category: true }
    })

    if (!system) {
      await prisma.$disconnect()
      return NextResponse.json(
        { success: false, error: 'النظام غير موجود' },
        { status: 404 }
      )
    }

    await prisma.system.delete({
      where: { id }
    })

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'تم حذف النظام بنجاح'
    })
  } catch (error) {
    console.error('Error deleting system:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في حذف النظام' },
      { status: 500 }
    )
  }
}
