'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimeLeft, setBlockTimeLeft] = useState(0)

  // تحقق من حالة الحظر عند تحميل الصفحة
  useEffect(() => {
    const attempts = localStorage.getItem('loginAttempts')
    const blockTime = localStorage.getItem('blockTime')

    if (attempts && blockTime) {
      const attemptsCount = parseInt(attempts)
      const blockTimestamp = parseInt(blockTime)
      const currentTime = Date.now()

      if (attemptsCount >= 5 && currentTime < blockTimestamp) {
        setIsBlocked(true)
        setLoginAttempts(attemptsCount)
        setBlockTimeLeft(Math.ceil((blockTimestamp - currentTime) / 1000))

        // عداد تنازلي
        const interval = setInterval(() => {
          const timeLeft = Math.ceil((blockTimestamp - Date.now()) / 1000)
          if (timeLeft <= 0) {
            setIsBlocked(false)
            setLoginAttempts(0)
            localStorage.removeItem('loginAttempts')
            localStorage.removeItem('blockTime')
            clearInterval(interval)
          } else {
            setBlockTimeLeft(timeLeft)
          }
        }, 1000)

        return () => clearInterval(interval)
      }
    }
  }, [])

  // تهيئة تأثير الجزيئات المتحركة
  useEffect(() => {
    if (typeof window !== 'undefined' && window.particlesJS) {
      window.particlesJS('particles-js', {
        particles: {
          number: { value: 50, density: { enable: true, value_area: 800 } },
          color: { value: '#0066cc' },
          shape: { type: 'circle' },
          opacity: { value: 0.3, random: true },
          size: { value: 3, random: true },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#0066cc',
            opacity: 0.2,
            width: 1
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'grab' },
            onclick: { enable: true, mode: 'push' },
            resize: true
          },
          modes: {
            grab: { distance: 140, line_linked: { opacity: 0.5 } },
            push: { particles_nb: 4 }
          }
        },
        retina_detect: true
      })
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // إزالة رسالة الخطأ عند الكتابة
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.username.trim()) {
      newErrors.username = 'يرجى إدخال اسم المستخدم'
    } else if (formData.username.length < 3) {
      newErrors.username = 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل'
    }

    if (!formData.password) {
      newErrors.password = 'يرجى إدخال كلمة المرور'
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isBlocked) {
      return
    }

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // إرسال طلب تسجيل الدخول إلى API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      })

      const result = await response.json()
      const isValid = result.success

      if (isValid) {
        // تسجيل دخول ناجح
        localStorage.removeItem('loginAttempts')
        localStorage.removeItem('blockTime')

        // حفظ بيانات المستخدم
        const userData = {
          id: result.user.id,
          username: result.user.username,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          role: result.user.role,
          loginTime: new Date().toISOString(),
          rememberMe: formData.rememberMe
        }

        if (formData.rememberMe) {
          localStorage.setItem('adminUser', JSON.stringify(userData))
        } else {
          sessionStorage.setItem('adminUser', JSON.stringify(userData))
        }

        // تعيين الكوكيز
        const expires = formData.rememberMe
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 يوم
          : new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 ساعة

        document.cookie = `admin_token=${result.token}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`
        document.cookie = `user_id=${result.user.id}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`
        document.cookie = `must_change_password=${result.user.mustChangePassword}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`

        // التحقق من ضرورة تغيير كلمة المرور
        if (result.user.mustChangePassword) {
          router.push(`/change-password?userId=${result.user.id}&firstLogin=true`)
        } else {
          // توجيه إلى لوحة التحكم
          const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/admin'
          router.push(redirectUrl)
        }
      } else {
        // تسجيل دخول فاشل
        const newAttempts = loginAttempts + 1
        setLoginAttempts(newAttempts)
        localStorage.setItem('loginAttempts', newAttempts.toString())

        if (newAttempts >= 5) {
          // حظر لمدة 15 دقيقة
          const blockTime = Date.now() + (15 * 60 * 1000)
          localStorage.setItem('blockTime', blockTime.toString())
          setIsBlocked(true)
          setBlockTimeLeft(15 * 60)
        }

        setErrors({
          general: result.error || `بيانات تسجيل الدخول غير صحيحة. المحاولات المتبقية: ${5 - newAttempts}`
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ general: 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.' })
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <>
      <style jsx>{`
        .footer-links a {
          color: var(--primary-color) !important;
          text-decoration: none !important;
        }

        .footer-links a:hover {
          color: var(--primary-color) !important;
        }

        .footer-links a:visited {
          color: var(--primary-color) !important;
        }

        .footer-links a:active {
          color: var(--primary-color) !important;
        }
      `}</style>

    <div className="login-page">
      {/* خلفية الجزيئات المتحركة */}
      <div id="particles-js" className="login-particles"></div>

      {/* المحتوى الرئيسي */}
      <div className="login-container">
        {/* شعار الشركة */}
        <div className="login-logo">
          <img src="/logo.svg" alt="Corporate Stack Logo" className="login-logo-image" />
          <h1 className="logo-text">كوربريت ستاك</h1>
          <p className="logo-subtitle">لوحة التحكم الإدارية</p>
        </div>

        {/* نموذج تسجيل الدخول */}
        <div className="login-form-container">
          <div className="login-header">
            <h2 className="login-title">
              <i className="fas fa-sign-in-alt"></i>
              تسجيل الدخول
            </h2>
            <p className="login-description">
              أدخل بيانات تسجيل الدخول للوصول إلى لوحة التحكم
            </p>
          </div>

          {/* رسالة الحظر */}
          {isBlocked && (
            <div className="alert alert-danger">
              <i className="fas fa-lock"></i>
              <div>
                <strong>تم حظر الحساب مؤقتاً</strong>
                <p>تم تجاوز عدد محاولات تسجيل الدخول المسموحة. يرجى المحاولة بعد: {formatTime(blockTimeLeft)}</p>
              </div>
            </div>
          )}

          {/* رسالة خطأ عامة */}
          {errors.general && (
            <div className="alert alert-warning">
              <i className="fas fa-exclamation-triangle"></i>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {/* اسم المستخدم */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                <i className="fas fa-user"></i>
                اسم المستخدم
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`form-input ${errors.username ? 'error' : ''}`}
                placeholder="أدخل اسم المستخدم"
                disabled={isBlocked}
                autoComplete="username"
              />
              {errors.username && (
                <span className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  {errors.username}
                </span>
              )}
            </div>

            {/* كلمة المرور */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <i className="fas fa-lock"></i>
                كلمة المرور
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="أدخل كلمة المرور"
                  disabled={isBlocked}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isBlocked}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              {errors.password && (
                <span className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  {errors.password}
                </span>
              )}
            </div>

            {/* تذكرني */}
            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  disabled={isBlocked}
                />
                <span className="checkbox-custom"></span>
                تذكرني
              </label>

              <Link href="/forgot-password" className="forgot-link">
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* زر تسجيل الدخول */}
            <button
              type="submit"
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || isBlocked}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>


        </div>

        {/* روابط إضافية */}
        <div className="login-footer">
          <Link href="/" className="back-link">
            <i className="fas fa-arrow-right"></i>
            العودة إلى الموقع الرئيسي
          </Link>

          <div className="footer-links">
            <Link
              href="/contact"
              style={{
                color: 'var(--primary-color) !important',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--primary-color)'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--primary-color)'}
            >
              تواصل معنا
            </Link>
            <span>|</span>
            <Link
              href="/about"
              style={{
                color: 'var(--primary-color) !important',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--primary-color)'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--primary-color)'}
            >
              من نحن
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
