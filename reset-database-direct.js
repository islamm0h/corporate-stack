const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMDFKWDFRUVhTSlNIWEY2NTMwMEg5MkFQM1ciLCJ0ZW5hbnRfaWQiOiIxNmViYzE2YmQyNmU2MzlmOGIwZDQ2OGY2MDRiNGMxODJhNTU5YzJjMjJhOTgyZmM0NWRlN2EyZTY3NjAxOGE3IiwiaW50ZXJuYWxfc2VjcmV0IjoiNjlmZDEyNTYtYWE3Yi00NDAzLTljMzEtNDUyMGY5NmZkM2U2In0.lkTKTU5d1RViN4dcSyJYwkSEuVw5SV1RBjshL2IMXTw"
    }
  }
})

async function resetDatabase() {
  try {
    console.log('🗑️ Starting database reset...')
    
    await prisma.$connect()
    console.log('✅ Connected to database')

    // تصفير جميع البيانات ما عدا المستخدمين
    console.log('🗑️ Deleting responses...')
    const deletedResponses = await prisma.response.deleteMany({})
    console.log(`✅ Deleted ${deletedResponses.count} responses`)

    console.log('🗑️ Deleting quote requests...')
    const deletedQuoteRequests = await prisma.quoteRequest.deleteMany({})
    console.log(`✅ Deleted ${deletedQuoteRequests.count} quote requests`)

    console.log('🗑️ Deleting leads...')
    const deletedLeads = await prisma.lead.deleteMany({})
    console.log(`✅ Deleted ${deletedLeads.count} leads`)

    console.log('🗑️ Deleting notifications...')
    const deletedNotifications = await prisma.notification?.deleteMany({}) || { count: 0 }
    console.log(`✅ Deleted ${deletedNotifications.count} notifications`)

    console.log('🗑️ Deleting systems...')
    const deletedSystems = await prisma.system.deleteMany({})
    console.log(`✅ Deleted ${deletedSystems.count} systems`)

    console.log('🗑️ Deleting activity logs...')
    const deletedActivityLogs = await prisma.activityLog.deleteMany({})
    console.log(`✅ Deleted ${deletedActivityLogs.count} activity logs`)

    console.log('🗑️ Deleting file uploads...')
    const deletedFileUploads = await prisma.fileUpload.deleteMany({})
    console.log(`✅ Deleted ${deletedFileUploads.count} file uploads`)

    console.log('🗑️ Deleting backups...')
    const deletedBackups = await prisma.backup.deleteMany({})
    console.log(`✅ Deleted ${deletedBackups.count} backups`)

    console.log('🗑️ Deleting daily stats...')
    const deletedDailyStats = await prisma.dailyStat.deleteMany({})
    console.log(`✅ Deleted ${deletedDailyStats.count} daily stats`)

    // إعادة تعيين إحصائيات المستخدمين فقط (بدون حذف المستخدمين)
    console.log('🔄 Resetting user statistics...')
    const updatedUsers = await prisma.user.updateMany({
      data: {
        totalAssigned: 0,
        lastAssigned: null,
        assignmentOrder: 0
      }
    })
    console.log(`✅ Reset statistics for ${updatedUsers.count} users`)

    console.log('✅ Database reset completed successfully!')

    // إحصائيات نهائية
    const finalStats = {
      users: await prisma.user.count(),
      leads: await prisma.lead.count(),
      systems: await prisma.system.count(),
      quoteRequests: await prisma.quoteRequest.count(),
      responses: await prisma.response.count(),
      activityLogs: await prisma.activityLog.count(),
      fileUploads: await prisma.fileUpload.count(),
      backups: await prisma.backup.count(),
      dailyStats: await prisma.dailyStat.count()
    }

    console.log('📊 Final Statistics:')
    console.log(`   - Users (preserved): ${finalStats.users}`)
    console.log(`   - Leads: ${finalStats.leads}`)
    console.log(`   - Systems: ${finalStats.systems}`)
    console.log(`   - Quote Requests: ${finalStats.quoteRequests}`)
    console.log(`   - Responses: ${finalStats.responses}`)
    console.log(`   - Activity Logs: ${finalStats.activityLogs}`)
    console.log(`   - File Uploads: ${finalStats.fileUploads}`)
    console.log(`   - Backups: ${finalStats.backups}`)
    console.log(`   - Daily Stats: ${finalStats.dailyStats}`)

    console.log('🎉 All data reset successfully (except users)!')

  } catch (error) {
    console.error('❌ Error resetting database:', error)
  } finally {
    await prisma.$disconnect()
    console.log('🔌 Disconnected from database')
  }
}

resetDatabase()
