import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

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

// GET /api/systems/[slug]/files - Get files for system by slug (public endpoint)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const fileType = searchParams.get('type') // pdf, image, video

    // Try to get data from database first, then fallback to file
    try {
      const prisma = (await import('@/lib/database')).default

      // First find the system by slug
      const system = await prisma.system.findUnique({
        where: { slug },
        select: { id: true }
      })

      if (!system) {
        return NextResponse.json(
          { success: false, error: 'النظام غير موجود' },
          { status: 404 }
        )
      }

      const where: any = {
        systemId: system.id,
        isActive: true
      }

      if (fileType) {
        where.fileType = fileType
      }

      const files = await prisma.systemFile.findMany({
        where,
        select: {
          id: true,
          fileName: true,
          originalName: true,
          fileType: true,
          fileSize: true,
          filePath: true,
          mimeType: true,
          sortOrder: true,
          createdAt: true
        },
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' }
        ]
      })

      return NextResponse.json({
        success: true,
        data: files
      })

    } catch (dbError) {
      // Fallback to JSON file
      console.log('Database not available, reading from JSON file')

      // First find the system by slug
      const systems = await readFromFile('systems.json')
      const system = systems.find((s: any) => s.slug === slug)

      if (!system) {
        return NextResponse.json(
          { success: false, error: 'النظام غير موجود' },
          { status: 404 }
        )
      }

      const dataDir = path.join(process.cwd(), 'data')
      const filePath = path.join(dataDir, 'system-files.json')

      if (!fs.existsSync(filePath)) {
        return NextResponse.json({
          success: true,
          data: []
        })
      }

      const fileContent = fs.readFileSync(filePath, 'utf8')
      let files = JSON.parse(fileContent)

      // Filter by systemId
      files = files.filter((f: any) => f.systemId === system.id && f.isActive !== false)

      // Filter by file type if specified
      if (fileType) {
        files = files.filter((f: any) => f.fileType === fileType)
      }

      return NextResponse.json({
        success: true,
        data: files
      })
    }

  } catch (error) {
    console.error('Error fetching files:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الملفات' },
      { status: 500 }
    )
  }
}
