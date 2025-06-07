import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // التحقق من المسارات المحمية
  const protectedPaths = ['/admin']
  const loginPath = '/login'
  const changePasswordPath = '/change-password'
  const publicAdminPaths = ['/login', '/forgot-password', '/change-password']

  const { pathname } = request.nextUrl

  // التحقق من أن المسار محمي
  const isProtectedPath = protectedPaths.some(path =>
    pathname.startsWith(path) && !publicAdminPaths.includes(pathname)
  )

  if (isProtectedPath) {
    // التحقق من وجود token في الكوكيز أو localStorage (محاكاة)
    const authToken = request.cookies.get('admin_token')?.value
    const userId = request.cookies.get('user_id')?.value
    const mustChangePassword = request.cookies.get('must_change_password')?.value

    // إذا لم يكن هناك token، توجيه إلى صفحة تسجيل الدخول
    if (!authToken) {
      const loginUrl = new URL(loginPath, request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // إذا كان المستخدم يجب عليه تغيير كلمة المرور
    if (mustChangePassword === 'true' && userId) {
      const changePasswordUrl = new URL(changePasswordPath, request.url)
      changePasswordUrl.searchParams.set('userId', userId)
      changePasswordUrl.searchParams.set('firstLogin', 'true')
      return NextResponse.redirect(changePasswordUrl)
    }
  }

  // إذا كان المستخدم مسجل دخول ويحاول الوصول لصفحة تسجيل الدخول
  if (pathname === loginPath) {
    const authToken = request.cookies.get('admin_token')?.value
    const mustChangePassword = request.cookies.get('must_change_password')?.value
    const userId = request.cookies.get('user_id')?.value

    if (authToken) {
      // إذا كان يجب تغيير كلمة المرور، توجيه إلى صفحة تغيير كلمة المرور
      if (mustChangePassword === 'true' && userId) {
        const changePasswordUrl = new URL(changePasswordPath, request.url)
        changePasswordUrl.searchParams.set('userId', userId)
        changePasswordUrl.searchParams.set('firstLogin', 'true')
        return NextResponse.redirect(changePasswordUrl)
      }
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
}
