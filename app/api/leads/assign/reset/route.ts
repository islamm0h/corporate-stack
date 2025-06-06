import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// إعادة تعيين ترتيب التوزيع
export async function POST() {
  try {
    await prisma.$connect()

    // إعادة تعيين ترتيب التوزيع لجميع المستخدمين النشطين
    await prisma.user.updateMany({
      where: { isActive: true },
      data: {
        assignmentOrder: 0,
        lastAssigned: null
      }
    })

    // تسجيل النشاط
    await prisma.activityLog.create({
      data: {
        action: 'RESET_ASSIGNMENT_ORDER',
        entityType: 'SYSTEM',
        details: {
          description: 'تم إعادة تعيين ترتيب التوزيع لجميع المستخدمين'
        }
      }
    })

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'تم إعادة تعيين ترتيب التوزيع بنجاح'
    })

  } catch (error) {
    console.error('Error resetting assignment order:', error)
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: false,
      message: 'فشل في إعادة تعيين ترتيب التوزيع',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    }, { status: 500 })
  }
}
