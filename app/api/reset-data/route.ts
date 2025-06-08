import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

export async function POST(request: NextRequest) {
  try {
    console.log('🗑️ Starting data reset process...')

    // تصفير جميع البيانات ما عدا المستخدمين
    console.log('🗑️ Deleting responses...')
    await prisma.response.deleteMany({})

    console.log('🗑️ Deleting quote requests...')
    await prisma.quoteRequest.deleteMany({})

    console.log('🗑️ Deleting leads...')
    await prisma.lead.deleteMany({})

    console.log('🗑️ Deleting notifications...')
    // await prisma.notification.deleteMany({}) // تعليق مؤقت حتى إضافة جدول الإشعارات

    console.log('🗑️ Deleting systems...')
    await prisma.system.deleteMany({})

    console.log('🗑️ Deleting activity logs...')
    await prisma.activityLog.deleteMany({})

    console.log('🗑️ Deleting file uploads...')
    await prisma.fileUpload.deleteMany({})

    console.log('🗑️ Deleting daily stats...')
    await prisma.dailyStat.deleteMany({})

    // إعادة تعيين إحصائيات المستخدمين فقط (بدون حذف المستخدمين)
    console.log('🔄 Resetting user statistics...')
    await prisma.user.updateMany({
      data: {
        totalAssigned: 0,
        lastAssigned: null,
        assignmentOrder: 0
      }
    })

    console.log('✅ Data reset completed successfully!')

    // إحصائيات ما تم حذفه
    const deletedCounts = {
      responses: 'All',
      quoteRequests: 'All',
      leads: 'All',
      systems: 'All',
      activityLogs: 'All',
      fileUploads: 'All',
      dailyStats: 'All',
      userStatsReset: 'All users statistics reset'
    }

    return NextResponse.json({
      success: true,
      message: 'تم تصفير جميع البيانات بنجاح (ما عدا المستخدمين)',
      data: {
        deleted: deletedCounts,
        preserved: {
          users: 'All users preserved',
          userAccounts: 'All user accounts kept intact'
        },
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Error resetting data:', error)
    
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في تصفير البيانات',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })

  } finally {
    await prisma.$disconnect()
  }
}

// GET method للتحقق من حالة البيانات
export async function GET() {
  try {
    const stats = {
      users: await prisma.user.count(),
      leads: await prisma.lead.count(),
      systems: await prisma.system.count(),
      // quoteRequests: await prisma.quoteRequest.count(), // تعليق مؤقت
      // responses: await prisma.response.count(), // تعليق مؤقت
      // notifications: await prisma.notification.count(), // تعليق مؤقت
      // activityLogs: await prisma.activityLog.count(), // تعليق مؤقت
      // fileUploads: await prisma.fileUpload.count(), // تعليق مؤقت
      // backups: await prisma.backup.count(), // تعليق مؤقت
      // dailyStats: await prisma.dailyStat.count() // تعليق مؤقت
    }

    return NextResponse.json({
      success: true,
      message: 'إحصائيات البيانات الحالية',
      data: stats
    })

  } catch (error) {
    console.error('❌ Error getting data stats:', error)
    
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في جلب الإحصائيات'
    }, { status: 500 })

  } finally {
    await prisma.$disconnect()
  }
}
