import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/database'
import { z } from 'zod'

// Schema for settings validation
const settingSchema = z.object({
  category: z.string().min(1, 'الفئة مطلوبة'),
  key: z.string().min(1, 'المفتاح مطلوب'),
  value: z.any(),
  description: z.string().optional(),
  isPublic: z.boolean().default(false)
})

// GET /api/settings - Get settings by category or all settings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const publicOnly = searchParams.get('public') === 'true'

    const where: any = {}
    if (category) where.category = category
    if (publicOnly) where.isPublic = true

    const settings = await prisma.systemSetting.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { key: 'asc' }
      ]
    })

    // Group settings by category
    const groupedSettings = settings.reduce((acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = {}
      }
      acc[setting.category][setting.key] = {
        value: setting.value,
        description: setting.description,
        isPublic: setting.isPublic,
        updatedAt: setting.updatedAt
      }
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      data: groupedSettings
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الإعدادات' },
      { status: 500 }
    )
  }
}

// POST /api/settings - Create or update setting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = settingSchema.parse(body)

    const setting = await prisma.systemSetting.upsert({
      where: {
        category_key: {
          category: validatedData.category,
          key: validatedData.key
        }
      },
      update: {
        value: validatedData.value,
        description: validatedData.description,
        isPublic: validatedData.isPublic
      },
      create: {
        category: validatedData.category,
        key: validatedData.key,
        value: validatedData.value,
        description: validatedData.description,
        isPublic: validatedData.isPublic
      }
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'update_setting',
        entityType: 'system_setting',
        entityId: setting.id,
        details: JSON.stringify({
          category: setting.category,
          key: setting.key,
          value: setting.value
        })
      }
    })

    return NextResponse.json({
      success: true,
      data: setting,
      message: 'تم حفظ الإعداد بنجاح'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صحيحة', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error saving setting:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في حفظ الإعداد' },
      { status: 500 }
    )
  }
}

// PUT /api/settings - Bulk update settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { settings } = body

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { success: false, error: 'بيانات الإعدادات غير صحيحة' },
        { status: 400 }
      )
    }

    const updates = []
    
    // Process each category
    for (const [category, categorySettings] of Object.entries(settings)) {
      if (typeof categorySettings === 'object') {
        for (const [key, value] of Object.entries(categorySettings)) {
          updates.push(
            prisma.systemSetting.upsert({
              where: {
                category_key: { category, key }
              },
              update: { value },
              create: {
                category,
                key,
                value,
                isPublic: false
              }
            })
          )
        }
      }
    }

    await Promise.all(updates)

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'bulk_update_settings',
        entityType: 'system_setting',
        details: JSON.stringify({
          categories: Object.keys(settings),
          settingsCount: updates.length
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الإعدادات بنجاح'
    })
  } catch (error) {
    console.error('Error bulk updating settings:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث الإعدادات' },
      { status: 500 }
    )
  }
}

// DELETE /api/settings - Delete setting
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const key = searchParams.get('key')

    if (!category || !key) {
      return NextResponse.json(
        { success: false, error: 'الفئة والمفتاح مطلوبان' },
        { status: 400 }
      )
    }

    const setting = await prisma.systemSetting.findUnique({
      where: {
        category_key: { category, key }
      }
    })

    if (!setting) {
      return NextResponse.json(
        { success: false, error: 'الإعداد غير موجود' },
        { status: 404 }
      )
    }

    await prisma.systemSetting.delete({
      where: {
        category_key: { category, key }
      }
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'delete_setting',
        entityType: 'system_setting',
        entityId: setting.id,
        details: JSON.stringify({
          category: setting.category,
          key: setting.key
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف الإعداد بنجاح'
    })
  } catch (error) {
    console.error('Error deleting setting:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في حذف الإعداد' },
      { status: 500 }
    )
  }
}


