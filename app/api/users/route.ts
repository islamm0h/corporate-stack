import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// دالة لتوليد كلمة مرور مؤقتة
function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  let password = ''
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

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

// إنشاء مستخدم جديد
export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone, role, username } = await request.json()

    // التحقق من البيانات المطلوبة
    if (!firstName || !lastName || !email || !username) {
      return NextResponse.json({
        success: false,
        error: 'الاسم الأول والأخير والبريد الإلكتروني واسم المستخدم مطلوبة'
      }, { status: 400 })
    }

    // التحقق من عدم وجود المستخدم مسبقاً
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'البريد الإلكتروني أو اسم المستخدم موجود مسبقاً'
      }, { status: 400 })
    }

    // توليد كلمة مرور مؤقتة
    const temporaryPassword = generateTemporaryPassword()
    const hashedTempPassword = await bcrypt.hash(temporaryPassword, 12)

    // إنشاء المستخدم
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        username,
        passwordHash: hashedTempPassword, // استخدام passwordHash بدلاً من temporaryPassword
        role: role?.toUpperCase() || 'USER',
        temporaryPassword: hashedTempPassword,
        mustChangePassword: true,
        isActive: true,
        emailVerified: false
      }
    })

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء المستخدم بنجاح',
      data: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        username: newUser.username,
        temporaryPassword, // إرسال كلمة المرور المؤقتة (غير مشفرة) للعرض مرة واحدة
        loginUrl: `/change-password?userId=${newUser.id}&firstLogin=true`
      }
    })

  } catch (error) {
    console.error('User creation error:', error)
    await prisma.$disconnect()

    return NextResponse.json({
      success: false,
      error: 'فشل في إنشاء المستخدم'
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
