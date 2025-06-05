'use client'

import { useEffect, useState } from 'react'

interface SplashScreenProps {
  onComplete?: () => void
  autoRedirect?: boolean
  duration?: number
}

export default function SplashScreen({ 
  onComplete, 
  autoRedirect = true, 
  duration = 4000 
}: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('جاري التحميل...')
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // تهيئة تأثير الجزيئات المتحركة
    if (typeof window !== 'undefined' && window.particlesJS) {
      window.particlesJS('splash-particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: '#ffffff' },
          shape: { type: 'circle' },
          opacity: { value: 0.5, random: true },
          size: { value: 3, random: true },
          line_linked: { 
            enable: true, 
            distance: 150, 
            color: '#ffffff', 
            opacity: 0.4, 
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
            onhover: { enable: true, mode: 'repulse' }, 
            onclick: { enable: true, mode: 'push' }, 
            resize: true 
          },
          modes: { 
            repulse: { distance: 100, duration: 0.4 },
            push: { particles_nb: 4 } 
          }
        },
        retina_detect: true
      })
    }

    // محاكاة عملية التحميل
    const loadingSteps = [
      { progress: 20, text: 'تحميل الموارد...' },
      { progress: 40, text: 'تهيئة النظام...' },
      { progress: 60, text: 'تحميل البيانات...' },
      { progress: 80, text: 'إعداد الواجهة...' },
      { progress: 100, text: 'مكتمل!' }
    ]

    let currentStep = 0
    const stepDuration = duration / loadingSteps.length
    
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setProgress(loadingSteps[currentStep].progress)
        setLoadingText(loadingSteps[currentStep].text)
        currentStep++
      } else {
        clearInterval(interval)
        
        if (autoRedirect) {
          setTimeout(() => {
            setIsVisible(false)
            if (onComplete) {
              onComplete()
            }
          }, 1000)
        }
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [duration, autoRedirect, onComplete])

  if (!isVisible) {
    return null
  }

  return (
    <div className="splash-screen">
      {/* خلفية الجزيئات المتحركة */}
      <div id="splash-particles-js" className="splash-particles"></div>
      
      {/* المحتوى الرئيسي */}
      <div className="splash-content">
        {/* الشعار والعنوان */}
        <div className="splash-logo-container">
          <div className="splash-logo">
            <img src="/logo.svg" alt="Corporate Stack Logo" className="splash-logo-image" />
          </div>
          
          <h1 className="splash-title">
            <span className="title-corporate">Corporate</span>
            <span className="title-stack">Stack</span>
          </h1>
          
          <p className="splash-subtitle">حلول متكاملة لإدارة الأعمال</p>
        </div>

        {/* شريط التحميل */}
        <div className="loading-container">
          <div className="loading-bar-container">
            <div className="loading-bar">
              <div 
                className="loading-progress" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="loading-percentage">{progress}%</div>
          </div>
          
          <p className="loading-text">{loadingText}</p>
        </div>

        {/* أيقونات الأنظمة */}
        <div className="systems-preview">
          <div className="system-icon animate-float" style={{ animationDelay: '0s' }}>
            <i className="fas fa-calculator"></i>
            <span>الحسابات</span>
          </div>
          
          <div className="system-icon animate-float" style={{ animationDelay: '0.2s' }}>
            <i className="fas fa-users"></i>
            <span>العملاء</span>
          </div>
          
          <div className="system-icon animate-float" style={{ animationDelay: '0.4s' }}>
            <i className="fas fa-user-tie"></i>
            <span>الموارد البشرية</span>
          </div>
          
          <div className="system-icon animate-float" style={{ animationDelay: '0.6s' }}>
            <i className="fas fa-boxes"></i>
            <span>المخزون</span>
          </div>
          
          <div className="system-icon animate-float" style={{ animationDelay: '0.8s' }}>
            <i className="fas fa-project-diagram"></i>
            <span>المشاريع</span>
          </div>
          
          <div className="system-icon animate-float" style={{ animationDelay: '1s' }}>
            <i className="fas fa-building"></i>
            <span>الأصول</span>
          </div>
        </div>

        {/* معلومات الشركة */}
        <div className="company-info">
          <p className="company-tagline">
            <i className="fas fa-star"></i>
            الحل الأمثل لإدارة أعمالك بكفاءة وذكاء
          </p>
          
          <div className="company-features">
            <span className="feature-badge">
              <i className="fas fa-shield-alt"></i>
              آمن
            </span>
            <span className="feature-badge">
              <i className="fas fa-rocket"></i>
              سريع
            </span>
            <span className="feature-badge">
              <i className="fas fa-cogs"></i>
              متكامل
            </span>
          </div>
        </div>

        {/* تذييل صفحة التحميل */}
        <div className="splash-footer">
          <p>&copy; 2025 Corporate Stack. جميع الحقوق محفوظة</p>
        </div>
      </div>

      {/* تأثيرات بصرية إضافية */}
      <div className="splash-effects">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>
    </div>
  )
}
