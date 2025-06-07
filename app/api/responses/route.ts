import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // مؤقت: إرجاع بيانات فارغة حتى إضافة جدول Response
    return NextResponse.json({
      success: true,
      data: []
    })

  } catch (error) {
    console.error('Error fetching responses:', error)
    return NextResponse.json({
      success: false,
      error: 'فشل في جلب الردود',
      data: []
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    // مؤقت: إرجاع رسالة نجاح حتى إضافة جدول Response
    return NextResponse.json({
      success: true,
      data: null,
      message: 'تم إنشاء الرد بنجاح (مؤقت)'
    })

  } catch (error) {
    console.error('Error creating response:', error)
    return NextResponse.json({
      success: false,
      error: 'فشل في إنشاء الرد'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
