import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // التحقق من أن قاعدة البيانات متصلة
    await prisma.$connect()
    
    console.log('🔄 Resetting database...')
    
    // حذف جميع البيانات بالترتيب الصحيح (بسبب Foreign Keys)
    
    // حذف Lead Activities أولاً
    await prisma.leadActivity.deleteMany({})
    console.log('✅ Deleted all lead activities')
    
    // حذف Leads
    await prisma.lead.deleteMany({})
    console.log('✅ Deleted all leads')
    
    // حذف System Features
    await prisma.systemFeature.deleteMany({})
    console.log('✅ Deleted all system features')
    
    // حذف Systems
    await prisma.system.deleteMany({})
    console.log('✅ Deleted all systems')
    
    // حذف User Sessions
    await prisma.userSession.deleteMany({})
    console.log('✅ Deleted all user sessions')
    
    // حذف Users
    await prisma.user.deleteMany({})
    console.log('✅ Deleted all users')
    
    // إعادة تعيين Auto-increment counters (إذا كان متاحاً)
    try {
      await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`
      await prisma.$executeRaw`ALTER SEQUENCE "System_id_seq" RESTART WITH 1`
      await prisma.$executeRaw`ALTER SEQUENCE "Lead_id_seq" RESTART WITH 1`
      console.log('✅ Reset auto-increment sequences')
    } catch (error) {
      console.log('⚠️ Could not reset sequences (this is normal for some databases)')
    }

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'تم تصفير قاعدة البيانات بنجاح! 🗑️',
      data: {
        message: 'جميع البيانات تم حذفها. يمكنك الآن البدء من جديد.',
        nextStep: 'استخدم /api/setup-database لإنشاء البيانات الأساسية'
      }
    })

  } catch (error) {
    console.error('Database reset error:', error)
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: false,
      message: 'فشل في تصفير قاعدة البيانات',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET method للتحقق من حالة قاعدة البيانات
export async function GET() {
  try {
    await prisma.$connect()
    
    const userCount = await prisma.user.count()
    const systemCount = await prisma.system.count()
    const leadCount = await prisma.lead.count()
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      message: 'حالة قاعدة البيانات',
      data: {
        users: userCount,
        systems: systemCount,
        leads: leadCount,
        isEmpty: userCount === 0 && systemCount === 0 && leadCount === 0
      }
    })
    
  } catch (error) {
    await prisma.$disconnect()
    return NextResponse.json({
      success: false,
      message: 'فشل في الاتصال بقاعدة البيانات',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
