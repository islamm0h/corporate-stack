import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { userId, currentPassword, newPassword, isFirstLogin } = await request.json()

    if (!userId || !newPassword) {
      return NextResponse.json({
        success: false,
        error: 'معرف المستخدم وكلمة المرور الجديدة مطلوبان'
      }, { status: 400 })
    }

    // التحقق من وجود المستخدم
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'المستخدم غير موجود'
      }, { status: 404 })
    }

    // إذا لم يكن أول تسجيل دخول، تحقق من كلمة المرور الحالية
    if (!isFirstLogin && currentPassword) {
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash)
      if (!isCurrentPasswordValid) {
        return NextResponse.json({
          success: false,
          error: 'كلمة المرور الحالية غير صحيحة'
        }, { status: 400 })
      }
    }

    // إذا كان أول تسجيل دخول، تحقق من كلمة المرور المؤقتة
    if (isFirstLogin && user.temporaryPassword) {
      const isTempPasswordValid = await bcrypt.compare(currentPassword, user.temporaryPassword)
      if (!isTempPasswordValid) {
        return NextResponse.json({
          success: false,
          error: 'كلمة المرور المؤقتة غير صحيحة'
        }, { status: 400 })
      }
    }

    // تشفير كلمة المرور الجديدة
    const saltRounds = 12
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

    // تحديث كلمة المرور في قاعدة البيانات
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: hashedNewPassword,
        mustChangePassword: false,
        lastPasswordChange: new Date(),
        temporaryPassword: null, // إزالة كلمة المرور المؤقتة
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح'
    })

  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في تغيير كلمة المرور'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// API للتحقق من حالة المستخدم
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'معرف المستخدم مطلوب'
      }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        mustChangePassword: true,
        lastPasswordChange: true,
        temporaryPassword: true
      }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'المستخدم غير موجود'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        hasTemporaryPassword: !!user.temporaryPassword
      }
    })

  } catch (error) {
    console.error('Error checking user status:', error)
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في التحقق من حالة المستخدم'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
