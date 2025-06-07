import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const resolvedParams = await params
    const fileId = resolvedParams.fileId

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: 'معرف الملف مطلوب' },
        { status: 400 }
      )
    }

    // استخراج معرف النظام والتوقيت من معرف الملف
    const parts = fileId.split('-')
    if (parts.length < 2) {
      return NextResponse.json(
        { success: false, error: 'معرف الملف غير صحيح' },
        { status: 400 }
      )
    }

    const systemId = parts[0]
    const timestamp = parts[1]

    // البحث عن الملف في مجلد النظام
    const systemDir = join(process.cwd(), 'public', 'uploads', 'systems', systemId)
    
    if (!existsSync(systemDir)) {
      return NextResponse.json(
        { success: false, error: 'مجلد النظام غير موجود' },
        { status: 404 }
      )
    }

    // البحث عن الملف الذي يبدأ بالتوقيت
    const fs = require('fs')
    const files = fs.readdirSync(systemDir)
    const targetFile = files.find((file: string) => file.startsWith(timestamp + '-'))

    if (!targetFile) {
      return NextResponse.json(
        { success: false, error: 'الملف غير موجود' },
        { status: 404 }
      )
    }

    const filePath = join(systemDir, targetFile)

    // حذف الملف
    await unlink(filePath)

    // هنا يمكن حذف بيانات الملف من قاعدة البيانات إذا كان لديك جدول للملفات
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      
      // يمكن حذف الملف من قاعدة البيانات لاحقاً
      // await prisma.systemFile.delete({
      //   where: { id: fileId }
      // })

      await prisma.$disconnect()
    } catch (dbError) {
      console.error('Database error:', dbError)
      // نتجاهل خطأ قاعدة البيانات لأن الملف تم حذفه من النظام
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف الملف بنجاح'
    })

  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في حذف الملف' },
      { status: 500 }
    )
  }
}
