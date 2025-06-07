import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking for today\'s leads...')
    
    // محاولة الاتصال بقاعدة البيانات
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      
      console.log('🔗 Connecting to database for today\'s leads...')
      
      // تحديد بداية ونهاية اليوم
      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
      
      console.log(`📅 Checking leads between ${startOfDay.toISOString()} and ${endOfDay.toISOString()}`)
      
      // جلب العملاء المحتملين لليوم
      const todaysLeads = await prisma.lead.findMany({
        where: {
          createdAt: {
            gte: startOfDay,
            lt: endOfDay
          }
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
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      
      // إحصائيات إضافية
      const totalToday = todaysLeads.length
      const newStatus = todaysLeads.filter(lead => lead.status === 'NEW').length
      const contactedStatus = todaysLeads.filter(lead => lead.status === 'CONTACTED').length
      
      console.log(`✅ Found ${totalToday} leads today: ${newStatus} new, ${contactedStatus} contacted`)
      
      await prisma.$disconnect()

      return NextResponse.json({
        success: true,
        data: {
          leads: todaysLeads,
          stats: {
            total: totalToday,
            new: newStatus,
            contacted: contactedStatus,
            date: today.toISOString().split('T')[0]
          }
        }
      })
      
    } catch (dbError) {
      console.error('❌ Database error:', dbError)
      
      // في حالة فشل قاعدة البيانات، تحقق من الملف المحلي
      const fallbackLeads = await getFallbackTodaysLeads()
      
      console.log(`⚠️ Using fallback data: ${fallbackLeads.length} leads`)

      return NextResponse.json({
        success: true,
        data: {
          leads: fallbackLeads,
          stats: {
            total: fallbackLeads.length,
            new: fallbackLeads.filter(lead => lead.status === 'new').length,
            contacted: fallbackLeads.filter(lead => lead.status === 'contacted').length,
            date: new Date().toISOString().split('T')[0]
          }
        }
      })
    }

  } catch (error) {
    console.error('❌ Error in today\'s leads API:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب عملاء اليوم' },
      { status: 500 }
    )
  }
}

// دالة مساعدة لجلب عملاء اليوم من الملف المحلي
async function getFallbackTodaysLeads() {
  try {
    const fs = await import('fs')
    const path = await import('path')
    const filePath = path.join(process.cwd(), 'data', 'leads.json')
    
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8')
      const leads = JSON.parse(data)
      
      // فلترة العملاء لليوم الحالي
      const today = new Date().toISOString().split('T')[0]
      const todaysLeads = leads.filter((lead: any) => {
        const leadDate = new Date(lead.createdAt || lead.created_at || Date.now())
        const leadDateStr = leadDate.toISOString().split('T')[0]
        return leadDateStr === today
      })
      
      return todaysLeads
    }
    return []
  } catch (error) {
    console.error('Error reading leads file:', error)
    return []
  }
}
