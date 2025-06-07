import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const systemId = formData.get('systemId') as string

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'لم يتم اختيار ملف' },
        { status: 400 }
      )
    }

    if (!systemId) {
      return NextResponse.json(
        { success: false, error: 'معرف النظام مطلوب' },
        { status: 400 }
      )
    }

    // التحقق من نوع الملف
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'application/zip',
      'application/x-rar-compressed'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'نوع الملف غير مدعوم' },
        { status: 400 }
      )
    }

    // التحقق من حجم الملف (10MB كحد أقصى)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'حجم الملف كبير جداً (الحد الأقصى 10MB)' },
        { status: 400 }
      )
    }

    // إنشاء مجلد الرفع إذا لم يكن موجوداً
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'systems', systemId)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // إنشاء اسم ملف فريد
    const timestamp = Date.now()
    const originalName = file.name
    const extension = originalName.split('.').pop()
    const fileName = `${timestamp}-${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = join(uploadDir, fileName)

    // حفظ الملف
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // إنشاء بيانات الملف للإرجاع
    const fileData = {
      id: `${systemId}-${timestamp}`,
      name: originalName,
      fileName: fileName,
      size: file.size,
      type: file.type,
      url: `/uploads/systems/${systemId}/${fileName}`,
      uploadDate: new Date().toISOString().split('T')[0],
      systemId: systemId
    }

    // هنا يمكن حفظ بيانات الملف في قاعدة البيانات إذا كان لديك جدول للملفات
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      
      // التحقق من وجود النظام
      const system = await prisma.system.findUnique({
        where: { id: systemId }
      })

      if (!system) {
        await prisma.$disconnect()
        return NextResponse.json(
          { success: false, error: 'النظام غير موجود' },
          { status: 404 }
        )
      }

      // يمكن إضافة جدول للملفات لاحقاً
      // const savedFile = await prisma.systemFile.create({
      //   data: {
      //     systemId,
      //     name: originalName,
      //     fileName,
      //     size: file.size,
      //     type: file.type,
      //     url: fileData.url
      //   }
      // })

      await prisma.$disconnect()
    } catch (dbError) {
      console.error('Database error:', dbError)
      // نتجاهل خطأ قاعدة البيانات ونكمل مع الملف المحفوظ
    }

    return NextResponse.json({
      success: true,
      data: fileData,
      message: 'تم رفع الملف بنجاح'
    })

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في رفع الملف' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const systemId = searchParams.get('systemId')

    if (!systemId) {
      return NextResponse.json(
        { success: false, error: 'معرف النظام مطلوب' },
        { status: 400 }
      )
    }

    // هنا يمكن جلب الملفات من قاعدة البيانات
    // في الوقت الحالي نرجع قائمة فارغة
    return NextResponse.json({
      success: true,
      data: []
    })

  } catch (error) {
    console.error('Error fetching files:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الملفات' },
      { status: 500 }
    )
  }
}
