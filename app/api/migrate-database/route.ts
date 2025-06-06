import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Running database migrations...')
    
    // تشغيل Prisma migrations
    const { stdout, stderr } = await execAsync('npx prisma db push --force-reset')
    
    console.log('Migration stdout:', stdout)
    if (stderr) {
      console.log('Migration stderr:', stderr)
    }

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء جداول قاعدة البيانات بنجاح!',
      data: {
        stdout,
        stderr
      }
    })

  } catch (error) {
    console.error('Migration error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'فشل في إنشاء جداول قاعدة البيانات',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
