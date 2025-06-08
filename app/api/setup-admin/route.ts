import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // التحقق من وجود مستخدمين مسبقاً
    const existingUsers = await prisma.user.count()

    if (existingUsers > 0) {
      await prisma.$disconnect()
      return NextResponse.json({
        success: false,
        message: 'يوجد مستخدمون في النظام بالفعل',
        count: existingUsers
      })
    }

    // إنشاء كلمة مرور مشفرة
    const defaultPassword = 'admin123'
    const hashedPassword = await bcrypt.hash(defaultPassword, 12)

    // إنشاء المستخدم الافتراضي
    const adminUser = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@corporatestack.com',
        firstName: 'مدير',
        lastName: 'النظام',
        passwordHash: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        mustChangePassword: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء المستخدم الافتراضي بنجاح',
      user: {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role
      },
      credentials: {
        username: 'admin',
        password: defaultPassword,
        note: 'يرجى تغيير كلمة المرور بعد تسجيل الدخول'
      }
    })

  } catch (error) {
    console.error('Error creating admin user:', error)
    return NextResponse.json({
      success: false,
      error: `فشل في إنشاء المستخدم الافتراضي: ${error.message}`,
      details: error.toString()
    }, { status: 500 })
  }
}

// GET - للتحقق من حالة المستخدمين
export async function GET(request: NextRequest) {
  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    const userCount = await prisma.user.count()
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        createdAt: true
      }
    })

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: userCount,
        adminUsers: adminUsers,
        hasUsers: userCount > 0
      }
    })

  } catch (error) {
    console.error('Error checking users:', error)
    return NextResponse.json({
      success: false,
      error: `فشل في التحقق من المستخدمين: ${error.message}`,
      details: error.toString()
    }, { status: 500 })
  }
}
