import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // إرجاع قائمة فارغة لأن قاعدة البيانات فارغة
    return NextResponse.json({
      success: true,
      data: []
    })

  } catch (error) {
    console.error('Error fetching system performance:', error)
    return NextResponse.json({
      success: false,
      error: 'فشل في جلب أداء الأنظمة',
      data: []
    })
  }
}
