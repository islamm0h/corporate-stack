import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import fs from 'fs'

// Helper function to save file data to JSON
async function saveFileToJson(fileData: any, filename: string) {
  try {
    const dataDir = path.join(process.cwd(), 'data')

    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }

    const filePath = path.join(dataDir, filename)
    let existingData = []

    if (existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      existingData = JSON.parse(fileContent)
    }

    existingData.push({
      ...fileData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    })

    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2))

    return existingData[existingData.length - 1]
  } catch (error) {
    console.error('Error saving file data to JSON:', error)
    return null
  }
}

// Helper function to validate file type
function validateFileType(mimeType: string, fileType: string): boolean {
  const allowedTypes = {
    pdf: ['application/pdf'],
    image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    video: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo']
  }

  return allowedTypes[fileType as keyof typeof allowedTypes]?.includes(mimeType) || false
}

// Helper function to get file type from mime type
function getFileTypeFromMime(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType === 'application/pdf') return 'pdf'
  return 'unknown'
}

// POST /api/admin/systems/[id]/files - Upload files for system
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: systemId } = await params
    const formData = await request.formData()

    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'لم يتم اختيار أي ملفات' },
        { status: 400 }
      )
    }

    // Validate file count (max 3 videos + unlimited PDFs and images)
    const videoFiles = files.filter(file => file.type.startsWith('video/'))
    if (videoFiles.length > 3) {
      return NextResponse.json(
        { success: false, error: 'يمكن رفع 3 فيديوهات كحد أقصى' },
        { status: 400 }
      )
    }

    const uploadedFiles = []
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'systems', systemId)

    // Create uploads directory if it doesn't exist
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    for (const file of files) {
      // Validate file type
      const fileType = getFileTypeFromMime(file.type)
      if (!validateFileType(file.type, fileType)) {
        return NextResponse.json(
          { success: false, error: `نوع الملف ${file.name} غير مدعوم` },
          { status: 400 }
        )
      }

      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: `حجم الملف ${file.name} كبير جداً (الحد الأقصى 100 ميجابايت)` },
          { status: 400 }
        )
      }

      // Generate unique filename
      const timestamp = Date.now()
      const extension = path.extname(file.name)
      const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}${extension}`
      const filePath = path.join(uploadsDir, fileName)
      const relativePath = `/uploads/systems/${systemId}/${fileName}`

      // Save file to disk
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)

      // Prepare file data
      const fileData = {
        systemId,
        fileName,
        originalName: file.name,
        fileType,
        fileSize: file.size,
        filePath: relativePath,
        mimeType: file.type,
        uploadedBy: null, // Will be set when user authentication is implemented
        isActive: true,
        sortOrder: uploadedFiles.length
      }

      // Save to database or file
      try {
        const prisma = (await import('@/lib/database')).default

        const savedFile = await prisma.systemFile.create({
          data: fileData
        })

        uploadedFiles.push(savedFile)
        console.log('Successfully saved file to database:', savedFile.id)

      } catch (dbError) {
        // Fallback to JSON file
        console.log('Database not available, saving file data to JSON')

        const savedFile = await saveFileToJson(fileData, 'system-files.json')
        if (savedFile) {
          uploadedFiles.push(savedFile)
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        uploadedFiles,
        count: uploadedFiles.length
      },
      message: `تم رفع ${uploadedFiles.length} ملف بنجاح`
    }, { status: 201 })

  } catch (error) {
    console.error('Error uploading files:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في رفع الملفات' },
      { status: 500 }
    )
  }
}

// GET /api/admin/systems/[id]/files - Get files for system
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: systemId } = await params
    const { searchParams } = new URL(request.url)
    const fileType = searchParams.get('type') // pdf, image, video

    // Try to get data from database first, then fallback to file
    try {
      const prisma = (await import('@/lib/database')).default

      const where: any = { systemId }
      if (fileType) {
        where.fileType = fileType
      }

      const files = await prisma.systemFile.findMany({
        where,
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

      const dataDir = path.join(process.cwd(), 'data')
      const filePath = path.join(dataDir, 'system-files.json')

      if (!existsSync(filePath)) {
        return NextResponse.json({
          success: true,
          data: []
        })
      }

      const fileContent = fs.readFileSync(filePath, 'utf8')
      let files = JSON.parse(fileContent)

      // Filter by systemId
      files = files.filter((f: any) => f.systemId === systemId)

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

// DELETE /api/admin/systems/[id]/files - Delete all files for system
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: systemId } = await params

    // Try to delete from database first, then fallback to file
    try {
      const prisma = (await import('@/lib/database')).default

      const deletedFiles = await prisma.systemFile.deleteMany({
        where: { systemId }
      })

      console.log('Successfully deleted files from database')

      return NextResponse.json({
        success: true,
        message: `تم حذف ${deletedFiles.count} ملف بنجاح`
      })

    } catch (dbError) {
      // Fallback to JSON file
      console.log('Database not available, deleting from JSON file')

      const dataDir = path.join(process.cwd(), 'data')
      const filePath = path.join(dataDir, 'system-files.json')

      if (!existsSync(filePath)) {
        return NextResponse.json({
          success: true,
          message: 'لا توجد ملفات للحذف'
        })
      }

      const fileContent = fs.readFileSync(filePath, 'utf8')
      let files = JSON.parse(fileContent)

      const originalCount = files.length
      files = files.filter((f: any) => f.systemId !== systemId)
      const deletedCount = originalCount - files.length

      fs.writeFileSync(filePath, JSON.stringify(files, null, 2))

      return NextResponse.json({
        success: true,
        message: `تم حذف ${deletedCount} ملف بنجاح`
      })
    }

  } catch (error) {
    console.error('Error deleting files:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في حذف الملفات' },
      { status: 500 }
    )
  }
}
