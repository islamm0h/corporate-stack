import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/database'
import { z } from 'zod'

// Schema for quote request validation
const quoteRequestSchema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  company: z.string().min(2, 'اسم الشركة مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().min(10, 'رقم الهاتف غير صحيح'),
  employees: z.string().optional(),
  systemType: z.string().min(1, 'نوع النظام مطلوب'),
  message: z.string().min(10, 'الرسالة يجب أن تكون 10 أحرف على الأقل'),
  terms: z.boolean().refine(val => val === true, 'يجب الموافقة على الشروط والأحكام'),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),
  requirements: z.array(z.string()).optional()
})

// POST /api/quote-requests - Handle quote request submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = quoteRequestSchema.parse(body)

    // Determine company size based on employees
    let companySize = 'SMALL'
    if (validatedData.employees) {
      const empCount = parseInt(validatedData.employees)
      if (empCount > 500) companySize = 'ENTERPRISE'
      else if (empCount > 100) companySize = 'LARGE'
      else if (empCount > 20) companySize = 'MEDIUM'
    }

    // Create or find lead
    let lead = await prisma.lead.findFirst({
      where: { email: validatedData.email }
    })

    if (!lead) {
      // Create new lead
      lead = await prisma.lead.create({
        data: {
          companyName: validatedData.company,
          contactPerson: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          companySize: companySize as any,
          source: 'WEBSITE',
          status: 'NEW',
          leadScore: 75, // Higher score for quote requests
          notes: `طلب عرض سعر لنظام: ${validatedData.systemType}\nعدد الموظفين: ${validatedData.employees || 'غير محدد'}\nالرسالة: ${validatedData.message}`
        }
      })
    } else {
      // Update existing lead with new information
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          companyName: validatedData.company,
          contactPerson: validatedData.name,
          phone: validatedData.phone,
          companySize: companySize as any,
          leadScore: Math.max(lead.leadScore, 75), // Increase score if higher
          notes: `${lead.notes || ''}\n\n--- طلب جديد ---\nطلب عرض سعر لنظام: ${validatedData.systemType}\nعدد الموظفين: ${validatedData.employees || 'غير محدد'}\nالرسالة: ${validatedData.message}`
        }
      })
    }

    // Find system if exists
    const system = await prisma.system.findFirst({
      where: {
        OR: [
          { name: { contains: validatedData.systemType, mode: 'insensitive' } },
          { category: { contains: validatedData.systemType, mode: 'insensitive' } }
        ]
      }
    })

    // Create quote request
    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        leadId: lead.id,
        systemId: system?.id,
        requestType: 'QUOTE',
        message: validatedData.message,
        budgetRange: validatedData.budgetRange,
        timeline: validatedData.timeline,
        requirements: validatedData.requirements ? {
          systemType: validatedData.systemType,
          employees: validatedData.employees,
          requirements: validatedData.requirements
        } : {
          systemType: validatedData.systemType,
          employees: validatedData.employees
        },
        status: 'PENDING',
        priority: 'HIGH' // Quote requests are high priority
      }
    })

    // Create initial response record
    await prisma.response.create({
      data: {
        requestId: quoteRequest.id,
        userId: null, // System generated
        responseType: 'EMAIL',
        subject: `طلب عرض سعر - ${validatedData.systemType}`,
        content: `تم استلام طلب عرض سعر جديد من ${validatedData.name} - ${validatedData.company}\n\nنوع النظام: ${validatedData.systemType}\nعدد الموظفين: ${validatedData.employees || 'غير محدد'}\nالميزانية المتوقعة: ${validatedData.budgetRange || 'غير محدد'}\nالجدول الزمني: ${validatedData.timeline || 'غير محدد'}\n\nالرسالة:\n${validatedData.message}`,
        status: 'SENT'
      }
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'quote_request_submission',
        entityType: 'quote_request',
        entityId: quoteRequest.id,
        details: JSON.stringify({
          name: validatedData.name,
          company: validatedData.company,
          email: validatedData.email,
          systemType: validatedData.systemType,
          employees: validatedData.employees
        })
      }
    })

    // Generate request number
    const requestNumber = `QUO-${Date.now().toString().slice(-6)}`

    return NextResponse.json({
      success: true,
      data: {
        requestNumber,
        leadId: lead.id,
        requestId: quoteRequest.id,
        systemId: system?.id
      },
      message: 'تم إرسال طلب عرض السعر بنجاح. سنتواصل معك خلال 24 ساعة'
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'بيانات غير صحيحة', 
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    console.error('Error processing quote request:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى' },
      { status: 500 }
    )
  }
}

// GET /api/quote-requests - Get quote requests (for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const systemId = searchParams.get('systemId')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      requestType: 'QUOTE'
    }

    if (status) {
      where.status = status
    }

    if (priority) {
      where.priority = priority
    }

    if (systemId) {
      where.systemId = systemId
    }

    if (search) {
      where.OR = [
        { lead: { contactPerson: { contains: search, mode: 'insensitive' } } },
        { lead: { email: { contains: search, mode: 'insensitive' } } },
        { lead: { companyName: { contains: search, mode: 'insensitive' } } },
        { message: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [requests, total] = await Promise.all([
      prisma.quoteRequest.findMany({
        where,
        include: {
          lead: {
            select: {
              id: true,
              companyName: true,
              contactPerson: true,
              email: true,
              phone: true,
              companySize: true,
              source: true,
              status: true,
              leadScore: true
            }
          },
          system: {
            select: {
              id: true,
              name: true,
              category: true,
              price: true
            }
          },
          responses: {
            select: {
              id: true,
              responseType: true,
              subject: true,
              status: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.quoteRequest.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        requests,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Error fetching quote requests:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب البيانات' },
      { status: 500 }
    )
  }
}
