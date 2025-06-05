import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/database'

// POST /api/settings/restore - Restore settings from backup
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { backup } = body

    if (!backup || !backup.settings) {
      return NextResponse.json(
        { success: false, error: 'بيانات النسخة الاحتياطية غير صحيحة' },
        { status: 400 }
      )
    }

    const updates = []
    
    // Process each category in backup
    for (const [category, categorySettings] of Object.entries(backup.settings)) {
      if (typeof categorySettings === 'object') {
        for (const [key, settingData] of Object.entries(categorySettings)) {
          if (typeof settingData === 'object' && settingData.value !== undefined) {
            updates.push(
              prisma.systemSetting.upsert({
                where: {
                  category_key: { category, key }
                },
                update: {
                  value: settingData.value,
                  description: settingData.description,
                  isPublic: settingData.isPublic || false
                },
                create: {
                  category,
                  key,
                  value: settingData.value,
                  description: settingData.description,
                  isPublic: settingData.isPublic || false
                }
              })
            )
          }
        }
      }
    }

    await Promise.all(updates)

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'restore_settings',
        entityType: 'system_setting',
        details: {
          backupVersion: backup.version,
          backupTimestamp: backup.timestamp,
          settingsCount: updates.length
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم استعادة الإعدادات بنجاح'
    })
  } catch (error) {
    console.error('Error restoring settings:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في استعادة الإعدادات' },
      { status: 500 }
    )
  }
}
