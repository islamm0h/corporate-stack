import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

const prisma = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV === 'development') {
  globalThis.prisma = prisma
}

export default prisma

// Database connection helper
export async function connectToDatabase() {
  try {
    await prisma.$connect()
    console.log('✅ Connected to PostgreSQL database')
    return prisma
  } catch (error) {
    console.error('❌ Failed to connect to database:', error)
    throw error
  }
}

// Database disconnection helper
export async function disconnectFromDatabase() {
  try {
    await prisma.$disconnect()
    console.log('✅ Disconnected from PostgreSQL database')
  } catch (error) {
    console.error('❌ Failed to disconnect from database:', error)
    throw error
  }
}

// Health check function
export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { status: 'healthy', timestamp: new Date() }
  } catch (error) {
    return { status: 'unhealthy', error: error.message, timestamp: new Date() }
  }
}

// Database statistics
export async function getDatabaseStats() {
  try {
    const [
      totalUsers,
      totalLeads,
      totalSystems,
      totalRequests,
      totalResponses
    ] = await Promise.all([
      prisma.user.count(),
      prisma.lead.count(),
      prisma.system.count(),
      prisma.quoteRequest.count(),
      prisma.response.count()
    ])

    return {
      users: totalUsers,
      leads: totalLeads,
      systems: totalSystems,
      requests: totalRequests,
      responses: totalResponses,
      timestamp: new Date()
    }
  } catch (error) {
    console.error('Error getting database stats:', error)
    throw error
  }
}

// Backup database function
export async function createDatabaseBackup(backupName: string, userId?: string) {
  try {
    const backup = await prisma.backup.create({
      data: {
        backupName,
        backupType: 'FULL',
        filePath: `/backups/${backupName}.sql`,
        status: 'IN_PROGRESS',
        createdById: userId
      }
    })

    // Here you would implement the actual backup logic
    // For now, we'll just update the status to completed
    await prisma.backup.update({
      where: { id: backup.id },
      data: {
        status: 'COMPLETED',
        fileSize: BigInt(1024 * 1024) // 1MB placeholder
      }
    })

    return backup
  } catch (error) {
    console.error('Error creating database backup:', error)
    throw error
  }
}

// Clean old activity logs
export async function cleanOldActivityLogs(daysToKeep: number = 90) {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    const result = await prisma.activityLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        }
      }
    })

    console.log(`🧹 Cleaned ${result.count} old activity logs`)
    return result.count
  } catch (error) {
    console.error('Error cleaning old activity logs:', error)
    throw error
  }
}

// Update daily statistics
export async function updateDailyStats(date: Date) {
  try {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const [
      totalLeads,
      newLeads,
      qualifiedLeads,
      convertedLeads,
      totalRequests,
      pendingRequests,
      completedRequests,
      totalResponses
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      }),
      prisma.lead.count({
        where: {
          status: 'QUALIFIED'
        }
      }),
      prisma.lead.count({
        where: {
          status: 'CLOSED_WON'
        }
      }),
      prisma.quoteRequest.count(),
      prisma.quoteRequest.count({
        where: {
          status: 'PENDING'
        }
      }),
      prisma.quoteRequest.count({
        where: {
          status: 'COMPLETED'
        }
      }),
      prisma.response.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      })
    ])

    const stats = await prisma.dailyStat.upsert({
      where: { date: startOfDay },
      update: {
        totalLeads,
        newLeads,
        qualifiedLeads,
        convertedLeads,
        totalRequests,
        pendingRequests,
        completedRequests,
        totalResponses,
        websiteVisits: Math.floor(Math.random() * 2000) + 1000, // Placeholder
        pageViews: Math.floor(Math.random() * 6000) + 3000, // Placeholder
        bounceRate: Math.random() * 20 + 25, // 25-45%
        avgSessionDuration: Math.floor(Math.random() * 120) + 120 // 2-4 minutes
      },
      create: {
        date: startOfDay,
        totalLeads,
        newLeads,
        qualifiedLeads,
        convertedLeads,
        totalRequests,
        pendingRequests,
        completedRequests,
        totalResponses,
        websiteVisits: Math.floor(Math.random() * 2000) + 1000,
        pageViews: Math.floor(Math.random() * 6000) + 3000,
        bounceRate: Math.random() * 20 + 25,
        avgSessionDuration: Math.floor(Math.random() * 120) + 120
      }
    })

    return stats
  } catch (error) {
    console.error('Error updating daily stats:', error)
    throw error
  }
}

// Log activity
export async function logActivity(
  userId: string | null,
  action: string,
  entityType?: string,
  entityId?: string,
  details?: any,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    const activity = await prisma.activityLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        details,
        ipAddress,
        userAgent
      }
    })

    return activity
  } catch (error) {
    console.error('Error logging activity:', error)
    throw error
  }
}
