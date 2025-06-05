import { NextRequest, NextResponse } from 'next/server'
import { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth } from 'date-fns'
import fs from 'fs'
import path from 'path'

// Helper function to read data from file
async function readFromFile(filename: string) {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    const filePath = path.join(dataDir, filename)

    if (!fs.existsSync(filePath)) {
      return []
    }

    const fileContent = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error('Error reading from file:', error)
    return []
  }
}

// GET /api/dashboard/stats - Get real-time dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'overview'

    switch (type) {
      case 'overview':
        return await getOverviewStats()
      case 'counters':
        return await getCounterStats()
      case 'recent':
        return await getRecentActivity()
      default:
        return NextResponse.json(
          { success: false, error: 'نوع الإحصائيات غير مدعوم' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الإحصائيات' },
      { status: 500 }
    )
  }
}

// Get overview statistics for admin dashboard
async function getOverviewStats() {
  const today = new Date()
  const startToday = startOfDay(today)
  const endToday = endOfDay(today)
  const startMonth = startOfMonth(today)
  const endMonth = endOfMonth(today)

  const [
    totalLeads,
    totalSystems,
    totalRequests,
    totalResponses,
    newLeadsToday,
    newRequestsToday,
    pendingRequests,
    completedRequests,
    monthlyLeads,
    monthlyRequests,
    conversionRate,
    avgResponseTime
  ] = await Promise.all([
    // Total counts
    prisma.lead.count(),
    prisma.system.count({ where: { isActive: true } }),
    prisma.quoteRequest.count(),
    prisma.response.count(),

    // Today's activity
    prisma.lead.count({
      where: {
        createdAt: { gte: startToday, lte: endToday }
      }
    }),
    prisma.quoteRequest.count({
      where: {
        createdAt: { gte: startToday, lte: endToday }
      }
    }),

    // Request status
    prisma.quoteRequest.count({
      where: { status: 'PENDING' }
    }),
    prisma.quoteRequest.count({
      where: { status: 'COMPLETED' }
    }),

    // Monthly stats
    prisma.lead.count({
      where: {
        createdAt: { gte: startMonth, lte: endMonth }
      }
    }),
    prisma.quoteRequest.count({
      where: {
        createdAt: { gte: startMonth, lte: endMonth }
      }
    }),

    // Conversion rate (leads to completed requests)
    getConversionRate(),

    // Average response time
    getAverageResponseTime()
  ])

  return NextResponse.json({
    success: true,
    data: {
      overview: {
        totalLeads,
        totalSystems,
        totalRequests,
        totalResponses,
        newLeadsToday,
        newRequestsToday,
        pendingRequests,
        completedRequests,
        monthlyLeads,
        monthlyRequests,
        conversionRate,
        avgResponseTime
      },
      trends: {
        leadsGrowth: await getGrowthRate('lead', 30),
        requestsGrowth: await getGrowthRate('quoteRequest', 30),
        responseGrowth: await getGrowthRate('response', 30)
      }
    }
  })
}

// Get counter statistics for homepage
async function getCounterStats() {
  let happyClients = 1250 // Default value
  let integratedSystems = 7 // Default value

  try {
    // Try to get data from database first
    const prisma = (await import('@/lib/database')).default

    const [dbHappyClients, dbIntegratedSystems] = await Promise.all([
      // Happy clients (unique leads with positive status)
      prisma.lead.count({
        where: {
          status: {
            in: ['QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON']
          }
        }
      }),

      // Integrated systems (active systems)
      prisma.system.count({
        where: { isActive: true }
      })
    ])

    happyClients = Math.max(dbHappyClients, 1250)
    integratedSystems = Math.max(dbIntegratedSystems, 7)

  } catch (dbError) {
    // Fallback to file system
    console.log('Database not available, using file data for stats')

    const contacts = await readFromFile('contacts.json')
    const quoteRequests = await readFromFile('quote-requests.json')

    // Calculate from file data
    const qualifiedContacts = contacts.filter((c: any) =>
      c.status && ['QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON'].includes(c.status)
    ).length

    happyClients = Math.max(qualifiedContacts + 1200, 1250) // Add base number
    integratedSystems = 7 // Static value
  }

  return NextResponse.json({
    success: true,
    data: {
      happyClients,
      integratedSystems,
      yearsExperience: 15,
      technicalSupport: 24
    }
  })
}

// Get recent activity
async function getRecentActivity() {
  const [recentLeads, recentRequests, recentResponses] = await Promise.all([
    prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        companyName: true,
        contactPerson: true,
        email: true,
        status: true,
        createdAt: true
      }
    }),
    prisma.quoteRequest.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        lead: {
          select: {
            companyName: true,
            contactPerson: true
          }
        },
        system: {
          select: {
            name: true
          }
        }
      }
    }),
    prisma.response.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        request: {
          include: {
            lead: {
              select: {
                companyName: true,
                contactPerson: true
              }
            }
          }
        }
      }
    })
  ])

  return NextResponse.json({
    success: true,
    data: {
      recentLeads,
      recentRequests,
      recentResponses
    }
  })
}

// Helper function to calculate conversion rate
async function getConversionRate() {
  const [totalLeads, convertedLeads] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({
      where: { status: 'CLOSED_WON' }
    })
  ])

  return totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0
}

// Helper function to calculate average response time
async function getAverageResponseTime() {
  const responses = await prisma.response.findMany({
    include: {
      request: {
        select: {
          createdAt: true
        }
      }
    },
    take: 100,
    orderBy: { createdAt: 'desc' }
  })

  if (responses.length === 0) return 0

  const totalHours = responses.reduce((sum, response) => {
    const requestTime = new Date(response.request.createdAt)
    const responseTime = new Date(response.createdAt)
    const diffHours = (responseTime.getTime() - requestTime.getTime()) / (1000 * 60 * 60)
    return sum + diffHours
  }, 0)

  return Math.round(totalHours / responses.length)
}

// Helper function to calculate growth rate
async function getGrowthRate(model: string, days: number) {
  const endDate = new Date()
  const startDate = subDays(endDate, days)
  const previousStartDate = subDays(startDate, days)

  const [currentPeriod, previousPeriod] = await Promise.all([
    (prisma as any)[model].count({
      where: {
        createdAt: { gte: startDate, lte: endDate }
      }
    }),
    (prisma as any)[model].count({
      where: {
        createdAt: { gte: previousStartDate, lt: startDate }
      }
    })
  ])

  if (previousPeriod === 0) return currentPeriod > 0 ? 100 : 0
  return Math.round(((currentPeriod - previousPeriod) / previousPeriod) * 100)
}
