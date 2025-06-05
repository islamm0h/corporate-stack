import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/database'
import { startOfDay, endOfDay, subDays, format } from 'date-fns'

// GET /api/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'overview'
    const days = parseInt(searchParams.get('days') || '30')

    switch (type) {
      case 'overview':
        return await getOverviewStats()
      case 'leads':
        return await getLeadsAnalytics(days)
      case 'systems':
        return await getSystemsAnalytics()
      case 'regions':
        return await getRegionsAnalytics()
      case 'trends':
        return await getTrendsAnalytics(days)
      case 'performance':
        return await getPerformanceAnalytics(days)
      default:
        return NextResponse.json(
          { success: false, error: 'نوع التحليل غير مدعوم' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب البيانات التحليلية' },
      { status: 500 }
    )
  }
}

// Overview statistics
async function getOverviewStats() {
  const [
    totalLeads,
    totalSystems,
    totalRequests,
    totalResponses,
    newLeadsToday,
    pendingRequests,
    completedRequests,
    conversionRate
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.system.count({ where: { isActive: true } }),
    prisma.quoteRequest.count(),
    prisma.response.count(),
    prisma.lead.count({
      where: {
        createdAt: {
          gte: startOfDay(new Date()),
          lte: endOfDay(new Date())
        }
      }
    }),
    prisma.quoteRequest.count({
      where: { status: 'PENDING' }
    }),
    prisma.quoteRequest.count({
      where: { status: 'COMPLETED' }
    }),
    getConversionRate()
  ])

  return NextResponse.json({
    success: true,
    data: {
      totalLeads,
      totalSystems,
      totalRequests,
      totalResponses,
      newLeadsToday,
      pendingRequests,
      completedRequests,
      conversionRate,
      timestamp: new Date()
    }
  })
}

// Leads analytics
async function getLeadsAnalytics(days: number) {
  const endDate = new Date()
  const startDate = subDays(endDate, days)

  const [
    leadsByStatus,
    leadsBySource,
    leadsByRegion,
    leadsOverTime,
    topPerformers
  ] = await Promise.all([
    prisma.lead.groupBy({
      by: ['status'],
      _count: { status: true }
    }),
    prisma.lead.groupBy({
      by: ['source'],
      _count: { source: true }
    }),
    prisma.lead.groupBy({
      by: ['region'],
      _count: { region: true },
      where: { region: { not: null } }
    }),
    getLeadsOverTime(startDate, endDate),
    getTopPerformers()
  ])

  return NextResponse.json({
    success: true,
    data: {
      leadsByStatus,
      leadsBySource,
      leadsByRegion,
      leadsOverTime,
      topPerformers
    }
  })
}

// Systems analytics
async function getSystemsAnalytics() {
  const [
    systemsByCategory,
    mostRequestedSystems,
    systemsPerformance
  ] = await Promise.all([
    prisma.system.groupBy({
      by: ['category'],
      _count: { category: true },
      where: { category: { not: null } }
    }),
    prisma.quoteRequest.groupBy({
      by: ['systemId'],
      _count: { systemId: true },
      orderBy: { _count: { systemId: 'desc' } },
      take: 10
    }).then(async (results) => {
      const systemIds = results.map(r => r.systemId).filter(Boolean)
      const systems = await prisma.system.findMany({
        where: { id: { in: systemIds } },
        select: { id: true, name: true, category: true }
      })
      
      return results.map(result => ({
        ...result,
        system: systems.find(s => s.id === result.systemId)
      }))
    }),
    getSystemsPerformance()
  ])

  return NextResponse.json({
    success: true,
    data: {
      systemsByCategory,
      mostRequestedSystems,
      systemsPerformance
    }
  })
}

// Regions analytics
async function getRegionsAnalytics() {
  const [
    leadsByRegion,
    requestsByRegion,
    conversionByRegion
  ] = await Promise.all([
    prisma.lead.groupBy({
      by: ['region'],
      _count: { region: true },
      where: { region: { not: null } }
    }),
    prisma.$queryRaw`
      SELECT l.region, COUNT(qr.id) as request_count
      FROM leads l
      LEFT JOIN quote_requests qr ON l.id = qr.lead_id
      WHERE l.region IS NOT NULL
      GROUP BY l.region
    `,
    getConversionByRegion()
  ])

  return NextResponse.json({
    success: true,
    data: {
      leadsByRegion,
      requestsByRegion,
      conversionByRegion
    }
  })
}

// Trends analytics
async function getTrendsAnalytics(days: number) {
  const endDate = new Date()
  const startDate = subDays(endDate, days)

  const dailyStats = await prisma.dailyStat.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: { date: 'asc' }
  })

  const trends = {
    leads: dailyStats.map(stat => ({
      date: format(stat.date, 'yyyy-MM-dd'),
      total: stat.totalLeads,
      new: stat.newLeads,
      qualified: stat.qualifiedLeads,
      converted: stat.convertedLeads
    })),
    requests: dailyStats.map(stat => ({
      date: format(stat.date, 'yyyy-MM-dd'),
      total: stat.totalRequests,
      pending: stat.pendingRequests,
      completed: stat.completedRequests
    })),
    website: dailyStats.map(stat => ({
      date: format(stat.date, 'yyyy-MM-dd'),
      visits: stat.websiteVisits,
      pageViews: stat.pageViews,
      bounceRate: stat.bounceRate,
      avgSessionDuration: stat.avgSessionDuration
    }))
  }

  return NextResponse.json({
    success: true,
    data: trends
  })
}

// Performance analytics
async function getPerformanceAnalytics(days: number) {
  const endDate = new Date()
  const startDate = subDays(endDate, days)

  const [
    responseTime,
    userActivity,
    systemUsage
  ] = await Promise.all([
    getAverageResponseTime(startDate, endDate),
    getUserActivity(startDate, endDate),
    getSystemUsage(startDate, endDate)
  ])

  return NextResponse.json({
    success: true,
    data: {
      responseTime,
      userActivity,
      systemUsage
    }
  })
}

// Helper functions
async function getConversionRate() {
  const [totalLeads, convertedLeads] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'CLOSED_WON' } })
  ])

  return totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0
}

async function getLeadsOverTime(startDate: Date, endDate: Date) {
  const leads = await prisma.lead.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    select: {
      createdAt: true,
      status: true
    }
  })

  // Group by date
  const grouped = leads.reduce((acc, lead) => {
    const date = format(lead.createdAt, 'yyyy-MM-dd')
    if (!acc[date]) {
      acc[date] = { date, count: 0, qualified: 0, converted: 0 }
    }
    acc[date].count++
    if (lead.status === 'QUALIFIED') acc[date].qualified++
    if (lead.status === 'CLOSED_WON') acc[date].converted++
    return acc
  }, {})

  return Object.values(grouped)
}

async function getTopPerformers() {
  return await prisma.user.findMany({
    where: {
      role: { in: ['ADMIN', 'MANAGER'] }
    },
    include: {
      assignedLeads: {
        select: {
          status: true
        }
      },
      responses: {
        select: {
          status: true
        }
      }
    },
    take: 5
  })
}

async function getSystemsPerformance() {
  return await prisma.system.findMany({
    include: {
      quoteRequests: {
        select: {
          status: true,
          createdAt: true
        }
      }
    }
  })
}

async function getConversionByRegion() {
  return await prisma.$queryRaw`
    SELECT 
      region,
      COUNT(*) as total_leads,
      COUNT(CASE WHEN status = 'CLOSED_WON' THEN 1 END) as converted_leads,
      ROUND(
        (COUNT(CASE WHEN status = 'CLOSED_WON' THEN 1 END)::float / COUNT(*)::float) * 100, 
        2
      ) as conversion_rate
    FROM leads 
    WHERE region IS NOT NULL 
    GROUP BY region
  `
}

async function getAverageResponseTime(startDate: Date, endDate: Date) {
  // This would calculate average time between request and first response
  return await prisma.$queryRaw`
    SELECT 
      AVG(EXTRACT(EPOCH FROM (r.created_at - qr.created_at))/3600) as avg_hours
    FROM quote_requests qr
    JOIN responses r ON qr.id = r.request_id
    WHERE qr.created_at BETWEEN ${startDate} AND ${endDate}
  `
}

async function getUserActivity(startDate: Date, endDate: Date) {
  return await prisma.activityLog.groupBy({
    by: ['userId'],
    _count: { userId: true },
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: {
      _count: {
        userId: 'desc'
      }
    },
    take: 10
  })
}

async function getSystemUsage(startDate: Date, endDate: Date) {
  return await prisma.quoteRequest.groupBy({
    by: ['systemId'],
    _count: { systemId: true },
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: {
      _count: {
        systemId: 'desc'
      }
    }
  })
}
