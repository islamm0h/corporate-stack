import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/database'
import { z } from 'zod'

// Schema for lead validation
const leadSchema = z.object({
  companyName: z.string().min(1, 'اسم الشركة مطلوب'),
  contactPerson: z.string().min(1, 'اسم الشخص المسؤول مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.enum(['SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE']).optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  source: z.enum(['WEBSITE', 'SOCIAL_MEDIA', 'REFERRAL', 'ADVERTISING', 'COLD_CALL', 'OTHER']).default('WEBSITE'),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST']).default('NEW'),
  leadScore: z.number().min(0).max(100).default(0),
  notes: z.string().optional(),
  assignedToId: z.string().optional()
})

// GET /api/leads - Get all leads with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const region = searchParams.get('region')
    const source = searchParams.get('source')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (status) where.status = status
    if (region) where.region = region
    if (source) where.source = source
    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { contactPerson: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          quoteRequests: {
            select: {
              id: true,
              requestType: true,
              status: true,
              createdAt: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.lead.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب العملاء المحتملين' },
      { status: 500 }
    )
  }
}

// POST /api/leads - Create new lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = leadSchema.parse(body)

    // Check if lead with same email already exists
    const existingLead = await prisma.lead.findFirst({
      where: { email: validatedData.email }
    })

    if (existingLead) {
      return NextResponse.json(
        { success: false, error: 'عميل محتمل بهذا البريد الإلكتروني موجود بالفعل' },
        { status: 400 }
      )
    }

    const leadData: any = {
      companyName: validatedData.companyName,
      contactPerson: validatedData.contactPerson,
      email: validatedData.email,
      phone: validatedData.phone,
      industry: validatedData.industry,
      companySize: validatedData.companySize,
      region: validatedData.region,
      city: validatedData.city,
      source: validatedData.source,
      status: validatedData.status,
      leadScore: validatedData.leadScore,
      notes: validatedData.notes
    }

    if (validatedData.assignedToId) {
      leadData.assignedToId = validatedData.assignedToId
    }

    const lead = await prisma.lead.create({
      data: leadData,
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: validatedData.assignedToId || null,
        action: 'create_lead',
        entityType: 'lead',
        entityId: lead.id,
        details: {
          companyName: lead.companyName,
          contactPerson: lead.contactPerson,
          email: lead.email
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: lead,
      message: 'تم إنشاء العميل المحتمل بنجاح'
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صحيحة', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating lead:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء العميل المحتمل' },
      { status: 500 }
    )
  }
}

// PUT /api/leads - Update lead
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف العميل المحتمل مطلوب' },
        { status: 400 }
      )
    }

    const validatedData = leadSchema.partial().parse(updateData)

    const updateDataForPrisma: any = {}

    Object.keys(validatedData).forEach(key => {
      if (validatedData[key] !== undefined) {
        updateDataForPrisma[key] = validatedData[key]
      }
    })

    const lead = await prisma.lead.update({
      where: { id },
      data: updateDataForPrisma,
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: validatedData.assignedToId || null,
        action: 'update_lead',
        entityType: 'lead',
        entityId: lead.id,
        details: {
          updatedFields: Object.keys(validatedData),
          companyName: lead.companyName
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: lead,
      message: 'تم تحديث العميل المحتمل بنجاح'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صحيحة', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating lead:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث العميل المحتمل' },
      { status: 500 }
    )
  }
}

// DELETE /api/leads - Delete lead
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف العميل المحتمل مطلوب' },
        { status: 400 }
      )
    }

    const lead = await prisma.lead.findUnique({
      where: { id },
      select: { companyName: true, contactPerson: true }
    })

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'العميل المحتمل غير موجود' },
        { status: 404 }
      )
    }

    await prisma.lead.delete({
      where: { id }
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'delete_lead',
        entityType: 'lead',
        entityId: id,
        details: {
          companyName: lead.companyName,
          contactPerson: lead.contactPerson
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف العميل المحتمل بنجاح'
    })
  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في حذف العميل المحتمل' },
      { status: 500 }
    )
  }
}
