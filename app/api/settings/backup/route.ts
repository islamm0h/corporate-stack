import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/database'

// GET /api/settings/backup - Export settings as backup
export async function GET(request: NextRequest) {
  try {
    const settings = await prisma.systemSetting.findMany({
      orderBy: [
        { category: 'asc' },
        { key: 'asc' }
      ]
    })

    const backup = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      settings: settings.reduce((acc, setting) => {
        if (!acc[setting.category]) {
          acc[setting.category] = {}
        }
        acc[setting.category][setting.key] = {
          value: setting.value,
          description: setting.description,
          isPublic: setting.isPublic
        }
        return acc
      }, {})
    }

    return NextResponse.json({
      success: true,
      data: backup
    })
  } catch (error) {
    console.error('Error creating settings backup:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء نسخة احتياطية من الإعدادات' },
      { status: 500 }
    )
  }
}
