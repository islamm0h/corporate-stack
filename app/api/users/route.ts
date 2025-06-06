import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    await prisma.$connect()
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        emailVerified: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    await prisma.$disconnect()

    // تحويل البيانات إلى الشكل المطلوب
    const formattedUsers = users.map(user => ({
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role.toLowerCase(),
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      lastLogin: user.lastLogin?.toISOString(),
      createdAt: user.createdAt.toISOString(),
      permissions: getDefaultPermissions(user.role.toLowerCase())
    }))

    return NextResponse.json({
      success: true,
      data: formattedUsers
    })

  } catch (error) {
    console.error('Users fetch error:', error)
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: false,
      message: 'فشل في جلب المستخدمين',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// دالة لإرجاع الصلاحيات الافتراضية حسب الدور
function getDefaultPermissions(role: string): string[] {
  switch (role) {
    case 'admin':
      return [
        'users.view', 'users.create', 'users.edit', 'users.delete',
        'leads.view', 'leads.create', 'leads.edit', 'leads.delete',
        'systems.view', 'systems.create', 'systems.edit', 'systems.delete',
        'analytics.view', 'settings.view', 'settings.edit'
      ]
    case 'manager':
      return [
        'users.view', 'leads.view', 'leads.create', 'leads.edit',
        'systems.view', 'analytics.view'
      ]
    case 'user':
      return ['leads.view', 'systems.view']
    default:
      return []
  }
}
