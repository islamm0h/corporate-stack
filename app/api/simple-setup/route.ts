import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting simple database setup...')

    // Try the existing setup-database API first
    const setupResponse = await fetch(`${request.nextUrl.origin}/api/setup-database`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reset: false })
    })

    const setupData = await setupResponse.json()

    if (setupData.success) {
      return NextResponse.json({
        success: true,
        message: 'تم إعداد قاعدة البيانات بنجاح',
        method: 'setup-database',
        data: setupData,
        credentials: {
          username: 'admin',
          password: 'admin123',
          note: 'استخدم هذه البيانات لتسجيل الدخول'
        }
      })
    }

    // If setup-database fails, try create-admin
    console.log('Trying create-admin API...')
    const adminResponse = await fetch(`${request.nextUrl.origin}/api/create-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123',
        email: 'admin@corporatestack.com',
        firstName: 'مدير',
        lastName: 'النظام'
      })
    })

    const adminData = await adminResponse.json()

    if (adminData.success) {
      return NextResponse.json({
        success: true,
        message: 'تم إنشاء المدير بنجاح',
        method: 'create-admin',
        data: adminData,
        credentials: {
          username: 'admin',
          password: 'admin123',
          note: 'استخدم هذه البيانات لتسجيل الدخول'
        }
      })
    }

    // If both fail, try force-create-admin
    console.log('Trying force-create-admin API...')
    const forceResponse = await fetch(`${request.nextUrl.origin}/api/force-create-admin`, {
      method: 'POST'
    })

    const forceData = await forceResponse.json()

    if (forceData.success) {
      return NextResponse.json({
        success: true,
        message: 'تم إنشاء المدير بالقوة',
        method: 'force-create-admin',
        data: forceData,
        credentials: {
          username: 'admin',
          password: 'admin123',
          note: 'استخدم هذه البيانات لتسجيل الدخول'
        }
      })
    }

    // If all methods fail
    return NextResponse.json({
      success: false,
      error: 'فشل في جميع طرق الإعداد',
      attempts: {
        setupDatabase: setupData,
        createAdmin: adminData,
        forceCreateAdmin: forceData
      },
      suggestion: 'تحقق من إعدادات قاعدة البيانات'
    }, { status: 500 })

  } catch (error) {
    console.error('Simple setup error:', error)
    return NextResponse.json({
      success: false,
      error: 'فشل في إعداد قاعدة البيانات',
      details: error.message
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check status using existing APIs
    const statusResponse = await fetch(`${request.nextUrl.origin}/api/init-admin`)
    const statusData = await statusResponse.json()

    return NextResponse.json({
      success: true,
      status: statusData.hasAdmin ? 'ready' : 'needs_setup',
      hasAdmin: statusData.hasAdmin,
      adminInfo: statusData.adminInfo,
      message: statusData.message
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'فشل في فحص حالة قاعدة البيانات',
      details: error.message
    }, { status: 500 })
  }
}
