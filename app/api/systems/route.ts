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

      // معالجة البيانات لإصلاح مشاكل JSON والترميز
      const processedSystems = systems.map(system => {
        let features = []
        let specifications = {}
        let seoKeywords = []

        // معالجة features
        if (system.features) {
          try {
            if (typeof system.features === 'string') {
              features = JSON.parse(system.features)
            } else if (Array.isArray(system.features)) {
              features = system.features
            }
          } catch (e) {
            console.warn('Failed to parse features for system:', system.name)
            features = []
          }
        }

        // معالجة specifications
        if (system.specifications) {
          try {
            if (typeof system.specifications === 'string') {
              specifications = JSON.parse(system.specifications)
            } else if (typeof system.specifications === 'object') {
              specifications = system.specifications
            }
          } catch (e) {
            console.warn('Failed to parse specifications for system:', system.name)
            specifications = {}
          }
        }

        // معالجة seoKeywords
        if (system.seoKeywords) {
          try {
            if (typeof system.seoKeywords === 'string') {
              seoKeywords = JSON.parse(system.seoKeywords)
            } else if (Array.isArray(system.seoKeywords)) {
              seoKeywords = system.seoKeywords
            }
          } catch (e) {
            console.warn('Failed to parse seoKeywords for system:', system.name)
            seoKeywords = []
          }
        }

        return {
          ...system,
          features,
          specifications,
          seoKeywords
        }
      })

      await prisma.$disconnect()

      return NextResponse.json({
        success: true,
        data: processedSystems
      })
    } catch (dbError) {
      console.error('❌ Database error:', dbError)

      // إرجاع خطأ بدلاً من البيانات الثابتة
      return NextResponse.json({
        success: false,
        error: 'فشل في الاتصال بقاعدة البيانات',
        data: []
      }, { status: 500 })
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
