import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting working setup using existing APIs...')

    let results = {
      step1: { success: false, method: '', error: null },
      step2: { success: false, method: '', error: null },
      step3: { success: false, method: '', error: null },
      finalResult: { success: false, credentials: null }
    }

    // Step 1: Try force-create-admin API
    try {
      console.log('Step 1: Trying force-create-admin...')
      const forceResponse = await fetch(`${request.nextUrl.origin}/api/force-create-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const forceData = await forceResponse.json()
      console.log('Force create admin result:', forceData.success)

      if (forceData.success) {
        results.step1 = { success: true, method: 'force-create-admin', error: null }
        results.finalResult = { 
          success: true, 
          credentials: { username: 'admin', password: 'admin123' }
        }
        
        return NextResponse.json({
          success: true,
          message: 'تم إنشاء المدير بنجاح باستخدام force-create-admin',
          method: 'force-create-admin',
          credentials: {
            username: 'admin',
            password: 'admin123',
            note: 'استخدم هذه البيانات لتسجيل الدخول'
          },
          steps: results
        })
      } else {
        results.step1 = { success: false, method: 'force-create-admin', error: forceData.error }
      }
    } catch (error) {
      console.log('Force create admin failed:', error.message)
      results.step1 = { success: false, method: 'force-create-admin', error: error.message }
    }

    // Step 2: Try create-admin API
    try {
      console.log('Step 2: Trying create-admin...')
      const createResponse = await fetch(`${request.nextUrl.origin}/api/create-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'admin',
          password: 'admin123',
          email: 'admin@corporatestack.com',
          firstName: 'مدير',
          lastName: 'النظام'
        })
      })

      const createData = await createResponse.json()
      console.log('Create admin result:', createData.success)

      if (createData.success) {
        results.step2 = { success: true, method: 'create-admin', error: null }
        results.finalResult = { 
          success: true, 
          credentials: { username: 'admin', password: 'admin123' }
        }
        
        return NextResponse.json({
          success: true,
          message: 'تم إنشاء المدير بنجاح باستخدام create-admin',
          method: 'create-admin',
          credentials: {
            username: 'admin',
            password: 'admin123',
            note: 'استخدم هذه البيانات لتسجيل الدخول'
          },
          steps: results
        })
      } else {
        results.step2 = { success: false, method: 'create-admin', error: createData.error }
      }
    } catch (error) {
      console.log('Create admin failed:', error.message)
      results.step2 = { success: false, method: 'create-admin', error: error.message }
    }

    // Step 3: Try setup-database API
    try {
      console.log('Step 3: Trying setup-database...')
      const setupResponse = await fetch(`${request.nextUrl.origin}/api/setup-database`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset: false })
      })

      const setupData = await setupResponse.json()
      console.log('Setup database result:', setupData.success)

      if (setupData.success) {
        results.step3 = { success: true, method: 'setup-database', error: null }
        results.finalResult = { 
          success: true, 
          credentials: { username: 'admin', password: 'admin123' }
        }
        
        return NextResponse.json({
          success: true,
          message: 'تم إعداد قاعدة البيانات بنجاح باستخدام setup-database',
          method: 'setup-database',
          credentials: {
            username: 'admin',
            password: 'admin123',
            note: 'استخدم هذه البيانات لتسجيل الدخول'
          },
          steps: results
        })
      } else {
        results.step3 = { success: false, method: 'setup-database', error: setupData.error }
      }
    } catch (error) {
      console.log('Setup database failed:', error.message)
      results.step3 = { success: false, method: 'setup-database', error: error.message }
    }

    // If all methods failed
    return NextResponse.json({
      success: false,
      error: 'فشل في جميع طرق الإعداد',
      message: 'جربت جميع الطرق المتاحة ولم تنجح أي منها',
      steps: results,
      suggestions: [
        'تحقق من أن قاعدة البيانات تدعم إنشاء الجداول',
        'تأكد من صحة إعدادات Prisma',
        'جرب إعادة تشغيل التطبيق',
        'تحقق من سجلات الأخطاء في Vercel'
      ]
    }, { status: 500 })

  } catch (error) {
    console.error('Working setup error:', error)
    return NextResponse.json({
      success: false,
      error: 'فشل في تشغيل الإعداد',
      details: error.message
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if admin exists using existing API
    const checkResponse = await fetch(`${request.nextUrl.origin}/api/init-admin`)
    const checkData = await checkResponse.json()

    return NextResponse.json({
      success: true,
      hasAdmin: checkData.hasAdmin,
      adminInfo: checkData.adminInfo,
      message: checkData.message,
      status: checkData.hasAdmin ? 'ready' : 'needs_setup'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'فشل في فحص حالة النظام',
      details: error.message
    }, { status: 500 })
  }
}
