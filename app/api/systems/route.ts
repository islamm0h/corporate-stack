import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/database'
import { z } from 'zod'

// Schema for system validation
const systemSchema = z.object({
  name: z.string().min(1, 'اسم النظام مطلوب'),
  slug: z.string().min(1, 'الرابط المختصر مطلوب'),
  description: z.string().optional(),
  shortDescription: z.string().max(255, 'الوصف المختصر يجب أن يكون أقل من 255 حرف').optional(),
  category: z.string().optional(),
  price: z.number().positive('السعر يجب أن يكون أكبر من صفر').optional(),
  currency: z.string().default('SAR'),
  features: z.array(z.string()).optional(),
  specifications: z.record(z.any()).optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().default(0),
  seoTitle: z.string().max(255).optional(),
  seoDescription: z.string().max(500).optional(),
  seoKeywords: z.array(z.string()).optional()
})

// GET /api/systems - Get all systems with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const active = searchParams.get('active')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (category) where.category = category
    if (featured !== null) where.isFeatured = featured === 'true'
    if (active !== null) where.isActive = active === 'true'
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [systems, total] = await Promise.all([
      prisma.system.findMany({
        where,
        include: {
          quoteRequests: {
            select: {
              id: true,
              status: true,
              createdAt: true
            }
          }
        },
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.system.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: systems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching systems:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الأنظمة' },
      { status: 500 }
    )
  }
}

// POST /api/systems - Create new system
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = systemSchema.parse(body)

    // Check if system with same slug already exists
    const existingSystem = await prisma.system.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingSystem) {
      return NextResponse.json(
        { success: false, error: 'نظام بهذا الرابط المختصر موجود بالفعل' },
        { status: 400 }
      )
    }

    const system = await prisma.system.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        shortDescription: validatedData.shortDescription,
        category: validatedData.category,
        price: validatedData.price,
        currency: validatedData.currency,
        features: validatedData.features || [],
        specifications: validatedData.specifications || {},
        images: validatedData.images || [],
        isActive: validatedData.isActive,
        isFeatured: validatedData.isFeatured,
        sortOrder: validatedData.sortOrder,
        seoTitle: validatedData.seoTitle,
        seoDescription: validatedData.seoDescription,
        seoKeywords: validatedData.seoKeywords || []
      }
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'create_system',
        entityType: 'system',
        entityId: system.id,
        details: {
          name: system.name,
          category: system.category,
          price: system.price
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: system,
      message: 'تم إنشاء النظام بنجاح'
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صحيحة', details: error.errors },
        { status: 400 }
      )
    }

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
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف النظام مطلوب' },
        { status: 400 }
      )
    }

    const validatedData = systemSchema.partial().parse(updateData)

    // Check if slug is being updated and if it conflicts
    if (validatedData.slug) {
      const existingSystem = await prisma.system.findFirst({
        where: {
          slug: validatedData.slug,
          NOT: { id }
        }
      })

      if (existingSystem) {
        return NextResponse.json(
          { success: false, error: 'نظام آخر بهذا الرابط المختصر موجود بالفعل' },
          { status: 400 }
        )
      }
    }

    const system = await prisma.system.update({
      where: { id },
      data: validatedData
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'update_system',
        entityType: 'system',
        entityId: system.id,
        details: {
          updatedFields: Object.keys(validatedData),
          name: system.name
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: system,
      message: 'تم تحديث النظام بنجاح'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صحيحة', details: error.errors },
        { status: 400 }
      )
    }

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

    if (!id) {
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
      return NextResponse.json(
        { success: false, error: 'النظام غير موجود' },
        { status: 404 }
      )
    }

    // Check if system has quote requests
    const hasRequests = await prisma.quoteRequest.findFirst({
      where: { systemId: id }
    })

    if (hasRequests) {
      return NextResponse.json(
        { success: false, error: 'لا يمكن حذف النظام لأنه مرتبط بطلبات عروض أسعار' },
        { status: 400 }
      )
    }

    await prisma.system.delete({
      where: { id }
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'delete_system',
        entityType: 'system',
        entityId: id,
        details: {
          name: system.name,
          category: system.category
        }
      }
    })

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
