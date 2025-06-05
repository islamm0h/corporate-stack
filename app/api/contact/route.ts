import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import fs from 'fs'
import path from 'path'

// Schema for contact form validation
const contactSchema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().min(10, 'رقم الهاتف غير صحيح'),
  company: z.string().optional(),
  subject: z.string().min(1, 'الموضوع مطلوب'),
  message: z.string().min(10, 'الرسالة يجب أن تكون 10 أحرف على الأقل'),
  terms: z.boolean().refine(val => val === true, 'يجب الموافقة على الشروط والأحكام')
})

// Helper function to save data to JSON file
async function saveToFile(data: any, filename: string) {
  try {
    const dataDir = path.join(process.cwd(), 'data')

    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    const filePath = path.join(dataDir, filename)
    let existingData = []

    // Read existing data if file exists
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      existingData = JSON.parse(fileContent)
    }

    // Add new data
    existingData.push({
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    })

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2))

    return existingData[existingData.length - 1]
  } catch (error) {
    console.error('Error saving to file:', error)
    return null
  }
}

// POST /api/contact - Handle contact form submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    // Generate request number
    const requestNumber = `REQ-${Date.now().toString().slice(-6)}`

    // Log the contact form submission (for debugging)
    console.log('Contact form submission:', {
      name: validatedData.name,
      email: validatedData.email,
      subject: validatedData.subject,
      company: validatedData.company,
      requestNumber
    })

    // Save to file system as backup storage
    const contactData = {
      requestNumber,
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      company: validatedData.company || 'غير محدد',
      subject: validatedData.subject,
      message: validatedData.message,
      source: 'WEBSITE',
      status: 'NEW',
      type: 'CONTACT_FORM'
    }

    const savedContact = await saveToFile(contactData, 'contacts.json')

    if (savedContact) {
      console.log('Successfully saved contact to file:', savedContact.id)
    }

    // Try to save to database if available
    try {
      const prisma = (await import('@/lib/database')).default

      // Create or find lead
      let lead = await prisma.lead.findFirst({
        where: { email: validatedData.email }
      })

      if (!lead) {
        // Create new lead
        lead = await prisma.lead.create({
          data: {
            companyName: validatedData.company || 'غير محدد',
            contactPerson: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone,
            source: 'WEBSITE',
            status: 'NEW',
            leadScore: 50,
            notes: `رسالة من نموذج الاتصال: ${validatedData.message}`
          }
        })
      }

      // Create quote request
      const quoteRequest = await prisma.quoteRequest.create({
        data: {
          leadId: lead.id,
          requestType: 'INFORMATION',
          message: validatedData.message,
          status: 'PENDING',
          priority: 'MEDIUM'
        }
      })

      console.log('Successfully saved to database')
    } catch (dbError) {
      console.log('Database not available, data saved to file instead')
    }

    return NextResponse.json({
      success: true,
      data: {
        requestNumber,
        leadId: savedContact?.id || 'temp-id',
        requestId: savedContact?.id || 'temp-request-id'
      },
      message: 'تم إرسال رسالتك بنجاح. سنتواصل معك خلال 24 ساعة'
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

    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى' },
      { status: 500 }
    )
  }
}

// Helper function to read data from file
async function readFromFile(filename: string) {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    const filePath = path.join(dataDir, filename)

    if (!fs.existsSync(filePath)) {
      return []
    }

    const fileContent = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error('Error reading from file:', error)
    return []
  }
}

// GET /api/contact - Get contact submissions (for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Try to get data from database first, then fallback to file
    let contacts = []

    try {
      const prisma = (await import('@/lib/database')).default

      const where: any = {
        requestType: 'INFORMATION'
      }

      if (status) {
        where.status = status
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
                source: true,
                status: true
              }
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

    } catch (dbError) {
      // Fallback to file system
      console.log('Database not available, reading from file')
      contacts = await readFromFile('contacts.json')

      // Apply filters
      if (status) {
        contacts = contacts.filter((c: any) => c.status === status)
      }

      if (search) {
        contacts = contacts.filter((c: any) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.company.toLowerCase().includes(search.toLowerCase()) ||
          c.message.toLowerCase().includes(search.toLowerCase())
        )
      }

      // Apply pagination
      const total = contacts.length
      const paginatedContacts = contacts.slice(skip, skip + limit)

      return NextResponse.json({
        success: true,
        data: {
          requests: paginatedContacts.map((contact: any) => ({
            id: contact.id,
            message: contact.message,
            status: contact.status,
            createdAt: contact.createdAt,
            lead: {
              id: contact.id,
              companyName: contact.company,
              contactPerson: contact.name,
              email: contact.email,
              phone: contact.phone,
              source: contact.source,
              status: contact.status
            }
          })),
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      })
    }

  } catch (error) {
    console.error('Error fetching contact submissions:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب البيانات' },
      { status: 500 }
    )
  }
}
