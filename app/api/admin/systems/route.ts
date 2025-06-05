import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import fs from 'fs'
import path from 'path'

// Helper function to save data to JSON file
async function saveToFile(data: any, filename: string) {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    const filePath = path.join(dataDir, filename)
    let existingData = []
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      existingData = JSON.parse(fileContent)
    }
    
    existingData.push({
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    })
    
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2))
    
    return existingData[existingData.length - 1]
  } catch (error) {
    console.error('Error saving to file:', error)
    return null
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

// Schema for system validation
const systemSchema = z.object({
  name: z.string().min(1, 'اسم النظام مطلوب'),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z.number().positive('السعر يجب أن يكون أكبر من صفر').optional(),
  version: z.string().default('1.0.0'),
  icon: z.string().default('fas fa-cog'),
  color: z.string().default('#0066cc'),
  status: z.enum(['active', 'inactive', 'maintenance', 'updating']).default('active'),
  users: z.number().default(0),
  uptime: z.string().default('99.9%'),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false)
})

// GET /api/admin/systems - Get all systems
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Try to get data from database first, then fallback to file
    let systems = []
    
    try {
      const prisma = (await import('@/lib/database')).default
      
      const where: any = {}

      if (status) {
        where.status = status
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } }
        ]
      }

      const [systemsData, total] = await Promise.all([
        prisma.system.findMany({
          where,
          include: {
            systemFiles: {
              select: {
                id: true,
                fileName: true,
                originalName: true,
                fileType: true,
                fileSize: true,
                createdAt: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.system.count({ where })
      ])

      return NextResponse.json({
        success: true,
        data: {
          systems: systemsData,
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
      systems = await readFromFile('systems.json')
      
      // Apply filters
      if (status) {
        systems = systems.filter((s: any) => s.status === status)
      }
      
      if (search) {
        systems = systems.filter((s: any) => 
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.description?.toLowerCase().includes(search.toLowerCase()) ||
          s.category?.toLowerCase().includes(search.toLowerCase())
        )
      }
      
      // Apply pagination
      const total = systems.length
      const skip = (page - 1) * limit
      const paginatedSystems = systems.slice(skip, skip + limit)
      
      return NextResponse.json({
        success: true,
        data: {
          systems: paginatedSystems,
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
    console.error('Error fetching systems:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب البيانات' },
      { status: 500 }
    )
  }
}

// POST /api/admin/systems - Create new system
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = systemSchema.parse(body)

    // Save to file system as backup storage
    const systemData = {
      ...validatedData,
      slug: validatedData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, ''),
      files: []
    }

    const savedSystem = await saveToFile(systemData, 'systems.json')
    
    if (savedSystem) {
      console.log('Successfully saved system to file:', savedSystem.id)
    }

    // Try to save to database if available
    try {
      const prisma = (await import('@/lib/database')).default
      
      const system = await prisma.system.create({
        data: {
          name: validatedData.name,
          description: validatedData.description || '',
          category: validatedData.category || '',
          price: validatedData.price || 0,
          version: validatedData.version,
          icon: validatedData.icon,
          color: validatedData.color,
          status: validatedData.status,
          users: validatedData.users,
          uptime: validatedData.uptime,
          isActive: validatedData.isActive,
          isFeatured: validatedData.isFeatured,
          slug: systemData.slug,
          features: [],
          specifications: {},
          images: [],
          seoKeywords: []
        }
      })

      console.log('Successfully saved to database')
      
      return NextResponse.json({
        success: true,
        data: system,
        message: 'تم إنشاء النظام بنجاح'
      }, { status: 201 })

    } catch (dbError) {
      console.log('Database not available, data saved to file instead')
      
      return NextResponse.json({
        success: true,
        data: savedSystem,
        message: 'تم إنشاء النظام بنجاح'
      }, { status: 201 })
    }

  } catch (error) {
    console.error('Error creating system:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صحيحة', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء النظام' },
      { status: 500 }
    )
  }
}
