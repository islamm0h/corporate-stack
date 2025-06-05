import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import fs from 'fs'
import path from 'path'

// Helper functions
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

async function updateInFile(filename: string, id: string, updateData: any) {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    const filePath = path.join(dataDir, filename)

    if (!fs.existsSync(filePath)) {
      return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf8')
    let data = JSON.parse(fileContent)

    const index = data.findIndex((item: any) => item.id === id)
    if (index === -1) {
      return null
    }

    data[index] = { ...data[index], ...updateData, updatedAt: new Date().toISOString() }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

    return data[index]
  } catch (error) {
    console.error('Error updating file:', error)
    return null
  }
}

// Schema for system update
const updateSystemSchema = z.object({
  name: z.string().min(1, 'اسم النظام مطلوب').optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z.number().positive('السعر يجب أن يكون أكبر من صفر').optional(),
  version: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  status: z.enum(['active', 'inactive', 'maintenance', 'updating']).optional(),
  users: z.number().optional(),
  uptime: z.string().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional()
})

// GET /api/admin/systems/[id] - Get single system
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Try to get data from database first, then fallback to file
    try {
      const prisma = (await import('@/lib/database')).default

      const system = await prisma.system.findUnique({
        where: { id },
        include: {
          systemFiles: {
            select: {
              id: true,
              fileName: true,
              originalName: true,
              fileType: true,
              fileSize: true,
              filePath: true,
              mimeType: true,
              isActive: true,
              sortOrder: true,
              createdAt: true
            },
            orderBy: { sortOrder: 'asc' }
          }
        }
      })

      if (!system) {
        return NextResponse.json(
          { success: false, error: 'النظام غير موجود' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: system
      })

    } catch (dbError) {
      // Fallback to file system
      console.log('Database not available, reading from file')
      const systems = await readFromFile('systems.json')

      const system = systems.find((s: any) => s.id === id)

      if (!system) {
        return NextResponse.json(
          { success: false, error: 'النظام غير موجود' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: system
      })
    }

  } catch (error) {
    console.error('Error fetching system:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب البيانات' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/systems/[id] - Update system
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateSystemSchema.parse(body)

    // Try to update in database first, then fallback to file
    try {
      const prisma = (await import('@/lib/database')).default

      const system = await prisma.system.update({
        where: { id },
        data: validatedData,
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
        }
      })

      console.log('Successfully updated system in database')

      return NextResponse.json({
        success: true,
        data: system,
        message: 'تم تحديث النظام بنجاح'
      })

    } catch (dbError) {
      // Fallback to file system
      console.log('Database not available, updating in file')

      const updatedSystem = await updateInFile('systems.json', id, validatedData)

      if (!updatedSystem) {
        return NextResponse.json(
          { success: false, error: 'النظام غير موجود' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: updatedSystem,
        message: 'تم تحديث النظام بنجاح'
      })
    }

  } catch (error) {
    console.error('Error updating system:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صحيحة', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'فشل في تحديث النظام' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/systems/[id] - Delete system
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Try to delete from database first, then fallback to file
    try {
      const prisma = (await import('@/lib/database')).default

      await prisma.system.delete({
        where: { id }
      })

      console.log('Successfully deleted system from database')

      return NextResponse.json({
        success: true,
        message: 'تم حذف النظام بنجاح'
      })

    } catch (dbError) {
      // Fallback to file system
      console.log('Database not available, deleting from file')

      const dataDir = path.join(process.cwd(), 'data')
      const filePath = path.join(dataDir, 'systems.json')

      if (!fs.existsSync(filePath)) {
        return NextResponse.json(
          { success: false, error: 'النظام غير موجود' },
          { status: 404 }
        )
      }

      const fileContent = fs.readFileSync(filePath, 'utf8')
      let systems = JSON.parse(fileContent)

      const index = systems.findIndex((s: any) => s.id === id)
      if (index === -1) {
        return NextResponse.json(
          { success: false, error: 'النظام غير موجود' },
          { status: 404 }
        )
      }

      systems.splice(index, 1)
      fs.writeFileSync(filePath, JSON.stringify(systems, null, 2))

      return NextResponse.json({
        success: true,
        message: 'تم حذف النظام بنجاح'
      })
    }

  } catch (error) {
    console.error('Error deleting system:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في حذف النظام' },
      { status: 500 }
    )
  }
}
