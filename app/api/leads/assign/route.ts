import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// نظام التوزيع بالتناوب (Round Robin)
export async function POST(request: NextRequest) {
  try {
    await prisma.$connect()
    
    const body = await request.json()
    const { leadId, forceUserId } = body

    // إذا تم تحديد مستخدم معين
    if (forceUserId) {
      const updatedLead = await prisma.lead.update({
        where: { id: leadId },
        data: { 
          assignedToId: forceUserId,
          updatedAt: new Date()
        },
        include: {
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      })

      // تحديث إحصائيات المستخدم
      await prisma.user.update({
        where: { id: forceUserId },
        data: {
          lastAssigned: new Date(),
          totalAssigned: { increment: 1 }
        }
      })

      await prisma.$disconnect()
      return NextResponse.json({
        success: true,
        message: 'تم تخصيص العميل المحتمل بنجاح',
        data: updatedLead
      })
    }

    // نظام التوزيع التلقائي بالتناوب
    const nextUser = await getNextUserForAssignment()
    
    if (!nextUser) {
      await prisma.$disconnect()
      return NextResponse.json({
        success: false,
        message: 'لا يوجد مستخدمين متاحين للتخصيص'
      }, { status: 400 })
    }

    // تخصيص العميل المحتمل للمستخدم التالي
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: { 
        assignedToId: nextUser.id,
        updatedAt: new Date()
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    // تحديث إحصائيات المستخدم
    await prisma.user.update({
      where: { id: nextUser.id },
      data: {
        lastAssigned: new Date(),
        totalAssigned: { increment: 1 },
        assignmentOrder: nextUser.assignmentOrder + 1
      }
    })

    // تسجيل النشاط
    await prisma.activityLog.create({
      data: {
        userId: nextUser.id,
        action: 'LEAD_ASSIGNED',
        entityType: 'LEAD',
        entityId: leadId,
        details: {
          leadCompany: updatedLead.companyName,
          assignmentMethod: 'ROUND_ROBIN'
        }
      }
    })

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: `تم تخصيص العميل المحتمل لـ ${nextUser.firstName} ${nextUser.lastName}`,
      data: updatedLead
    })

  } catch (error) {
    console.error('Error assigning lead:', error)
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: false,
      message: 'فشل في تخصيص العميل المحتمل',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    }, { status: 500 })
  }
}

// دالة للحصول على المستخدم التالي في التوزيع
async function getNextUserForAssignment() {
  // الحصول على جميع المستخدمين النشطين مرتبين حسب آخر تخصيص
  const users = await prisma.user.findMany({
    where: { 
      isActive: true,
      role: { in: ['ADMIN', 'MANAGER', 'USER'] }
    },
    orderBy: [
      { lastAssigned: 'asc' }, // الأولوية للذي لم يتم تخصيص عميل له مؤخر<|im_start|>
      { totalAssigned: 'asc' }, // ثم الأقل في إجمالي التخصيصات
      { createdAt: 'asc' } // ثم الأقدم في التسجيل
    ]
  })

  if (users.length === 0) {
    return null
  }

  // إرجاع المستخدم الأول (الأولى بالتخصيص)
  return users[0]
}

// GET - الحصول على إحصائيات التوزيع
export async function GET() {
  try {
    await prisma.$connect()

    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        totalAssigned: true,
        lastAssigned: true,
        assignmentOrder: true,
        _count: {
          select: {
            assignedLeads: true
          }
        }
      },
      orderBy: { assignmentOrder: 'asc' }
    })

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      data: {
        users: users.map(user => ({
          ...user,
          currentAssigned: user._count.assignedLeads
        }))
      }
    })

  } catch (error) {
    console.error('Error fetching assignment stats:', error)
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: false,
      message: 'فشل في جلب إحصائيات التوزيع'
    }, { status: 500 })
  }
}
