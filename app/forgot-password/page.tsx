'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  // تهيئة تأثير الجزيئات المتحركة
  useEffect(() => {
    if (typeof window !== 'undefined' && window.particlesJS) {
      window.particlesJS('particles-js', {
        particles: {
          number: { value: 30, density: { enable: true, value_area: 800 } },
          color: { value: '#0066cc' },
          shape: { type: 'circle' },
          opacity: { value: 0.2, random: true },
          size: { value: 2, random: true },
          line_linked: {
            enable: true,
            distance: 120,
            color: '#0066cc',
            opacity: 0.1,
            width: 1
          },
          move: {
            enable: true,
            speed: 1,
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
            onclick: { enable: false },
            resize: true
          },
          modes: {
            grab: { distance: 100, line_linked: { opacity: 0.3 } }
          }
        },
        retina_detect: true
      })
    }
  }, [])

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('يرجى إدخال البريد الإلكتروني')
      return
    }

    if (!validateEmail(email)) {
      setError('يرجى إدخال بريد إلكتروني صحيح')
      return
    }

    setIsLoading(true)

    try {
      // محاكاة إرسال البريد الإلكتروني
      await new Promise(resolve => setTimeout(resolve, 2000))

      // محاكاة نجاح العملية
      setIsSuccess(true)
    } catch (error) {
      setError('حدث خطأ في إرسال البريد الإلكتروني. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="login-page">
        <div id="particles-js" className="login-particles"></div>

        <div className="login-container">
          <div className="success-container">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>

            <h2 className="success-title">تم إرسال البريد الإلكتروني</h2>

            <p className="success-message">
              تم إرسال رابط استعادة كلمة المرور إلى البريد الإلكتروني:
              <strong>{email}</strong>
            </p>

            <div className="success-instructions">
              <h4>الخطوات التالية:</h4>
              <ol>
                <li>تحقق من صندوق الوارد في بريدك الإلكتروني</li>
                <li>ابحث عن رسالة من &quot;كوربريت ستاك&quot;</li>
                <li>انقر على رابط استعادة كلمة المرور</li>
                <li>اتبع التعليمات لإنشاء كلمة مرور جديدة</li>
              </ol>

              <div className="note">
                <i className="fas fa-info-circle"></i>
                <span>إذا لم تجد الرسالة، تحقق من مجلد الرسائل غير المرغوب فيها</span>
              </div>
            </div>

            <div className="success-actions">
              <Link href="/login" className="btn btn-primary">
                <i className="fas fa-arrow-right"></i>
                العودة إلى تسجيل الدخول
              </Link>

              <button
                onClick={() => {
                  setIsSuccess(false)
                  setEmail('')
                }}
                className="btn btn-outline"
              >
                <i className="fas fa-redo"></i>
                إرسال مرة أخرى
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <div id="particles-js" className="login-particles"></div>

      <div className="login-container">
        {/* شعار الشركة */}
        <div className="login-logo">
          <img src="/logo.svg" alt="Corporate Stack Logo" className="login-logo-image" />
          <h1 className="logo-text">استعادة كلمة المرور</h1>
          <p className="logo-subtitle">كوربريت ستاك - لوحة التحكم</p>
        </div>

        {/* نموذج استعادة كلمة المرور */}
        <div className="login-form-container">
          <div className="login-header">
            <h2 className="login-title">
              <i className="fas fa-unlock-alt"></i>
              نسيت كلمة المرور؟
            </h2>
            <p className="login-description">
              أدخل بريدك الإلكتروني وسنرسل لك رابط لاستعادة كلمة المرور
            </p>
          </div>

          {/* رسالة خطأ */}
          {error && (
            <div className="alert alert-warning">
              <i className="fas fa-exclamation-triangle"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {/* البريد الإلكتروني */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <i className="fas fa-envelope"></i>
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="أدخل بريدك الإلكتروني"
                disabled={isLoading}
                autoComplete="email"
                required
              />
            </div>

            {/* زر الإرسال */}
            <button
              type="submit"
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  إرسال رابط الاستعادة
                </>
              )}
            </button>
          </form>

          {/* معلومات إضافية */}
          <div className="info-box">
            <div className="info-item">
              <i className="fas fa-shield-alt"></i>
              <div>
                <strong>آمان تام</strong>
                <p>رابط الاستعادة صالح لمدة 24 ساعة فقط</p>
              </div>
            </div>

            <div className="info-item">
              <i className="fas fa-clock"></i>
              <div>
                <strong>سرعة في التسليم</strong>
                <p>ستصلك الرسالة خلال دقائق معدودة</p>
              </div>
            </div>
          </div>
        </div>

        {/* روابط إضافية */}
        <div className="login-footer">
          <Link href="/login" className="back-link">
            <i className="fas fa-arrow-right"></i>
            العودة إلى تسجيل الدخول
          </Link>

          <div className="footer-links">
            <Link href="/contact">تواصل معنا</Link>
            <span>|</span>
            <Link href="/">الموقع الرئيسي</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
