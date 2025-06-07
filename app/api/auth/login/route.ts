import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({
        success: false,
        error: 'اسم المستخدم وكلمة المرور مطلوبان'
      }, { status: 400 })
    }

    // البحث عن المستخدم
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: username }
        ],
        isActive: true
      }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'اسم المستخدم أو كلمة المرور غير صحيحة'
      }, { status: 401 })
    }

    // التحقق من كلمة المرور
    let isPasswordValid = false

    // إذا كان المستخدم يجب عليه تغيير كلمة المرور، تحقق من كلمة المرور المؤقتة أولاً
    if (user.mustChangePassword && user.temporaryPassword) {
      isPasswordValid = await bcrypt.compare(password, user.temporaryPassword)
    }

    // إذا لم تنجح كلمة المرور المؤقتة، تحقق من كلمة المرور العادية
    if (!isPasswordValid) {
      isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    }

    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        error: 'اسم المستخدم أو كلمة المرور غير صحيحة'
      }, { status: 401 })
    }

    // إنشاء JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    )

    // تحديث آخر تسجيل دخول
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.toLowerCase(),
        mustChangePassword: user.mustChangePassword,
        lastLogin: user.lastLogin
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في الخادم'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
