import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // أسماء الأشهر بالعربية
    const monthNames = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ]

    // إنشاء قائمة بالأشهر الـ 6 الماضية مع بيانات فارغة
    const monthsData = []
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)

      monthsData.push({
        month: monthNames[monthDate.getMonth()],
        leads: 0,
        requests: 0,
        conversions: 0
      })
    }

    return NextResponse.json({
      success: true,
      data: monthsData
    })

  } catch (error) {
    console.error('Error fetching trends:', error)
    return NextResponse.json({
      success: false,
      error: 'فشل في جلب الاتجاهات الشهرية',
      data: []
    })
  }
}
