'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const [stats, setStats] = useState({
    happyClients: 1250,
    integratedSystems: 6,
    yearsExperience: 15,
    technicalSupport: 24
  })

  useEffect(() => {
    // تحريك شريط التحميل بسرعة مثالية
    let width = 0
    const interval = setInterval(() => {
      if (width >= 100) {
        clearInterval(interval)
        // بدء تأثير الاختفاء
        setFadeOut(true)
        // إخفاء صفحة التحميل وعرض المحتوى الرئيسي
        setTimeout(() => {
          setShowSplash(false)
        }, 500)
      } else {
        width += 10 // زيادة السرعة إلى 10 لكل خطوة
        setProgress(width)
      }
    }, 100) // 100ms لكل خطوة = إجمالي 1 ثانية

    return () => clearInterval(interval)
  }, [])

  // جلب الإحصائيات الحقيقية
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats?type=counters')
        const result = await response.json()

        if (result.success) {
          setStats(result.data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
        // استخدام القيم الافتراضية في حالة الخطأ
      }
    }

    if (!showSplash) {
      fetchStats()
    }
  }, [showSplash])

  // عرض صفحة التحميل
  if (showSplash) {
    return (
      <div className={`splash-body ${fadeOut ? 'fade-out' : ''}`}>
        <div className="splash-container">
          <div className="logo-container">
            <img src="/logo.svg" alt="كوربريت ستاك" className="logo" />
            <h1 className="company-name">كوربريت ستاك</h1>
            <p className="tagline">
              <span className="colored-tagline">كوربريت ستاك</span> لإدارة{' '}
              <span className="colored-tagline-secondary">أعمالك</span> بكفاءة{' '}
              <span className="colored-tagline-accent">عالية</span>
            </p>
          </div>

          <div className="loading-container">
            <div className="loading-bar">
              <div
                className="loading-progress"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="loading-text">
              جاري تحميل الموقع <span className="loading-dots"></span>
            </div>
          </div>
        </div>

        <div className="splash-footer">
          جميع الحقوق محفوظة &copy; 2025 كوربريت ستاك
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="container header-container">
          <div className="logo">
            <img src="/logo.svg" alt="Corporate Stack Logo" className="logo-image" />
            <div className="logo-text">كوربريت ستاك</div>
          </div>
          <nav className="nav-menu">
            <Link href="/" className="nav-link active">الرئيسية</Link>
            <Link href="/about" className="nav-link">من نحن</Link>
            <Link href="/systems" className="nav-link">الأنظمة</Link>
            <Link href="/contact" className="nav-link">تواصل معنا</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="colored-title">كوربريت ستاك</span> لإدارة{' '}
              <span className="colored-title-secondary">أعمالك</span> بكفاءة{' '}
              <span className="colored-title-accent">عالية</span>
            </h1>
            <p className="hero-subtitle">
              نقدم حلولاً متكاملة لإدارة الأعمال تساعدك على تحسين الكفاءة وزيادة الإنتاجية وتحقيق النمو المستدام.
            </p>
            <div className="hero-buttons">
              <Link
                href="/contact?trial=true"
                className="btn btn-primary btn-free-trial"
              >
                <i className="fas fa-gift"></i> تجربة مجانية 14 يوم
              </Link>
              <Link href="/systems" className="btn btn-secondary">
                <i className="fas fa-th-large"></i> استكشف الأنظمة
              </Link>
              <a href="/contact" className="btn btn-outline">
                <i className="fas fa-headset"></i> تواصل معنا
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section features">
        <div className="container">
          <div className="features-header">
            <div className="features-logo">
              <i className="fas fa-star-of-life"></i>
            </div>
            <h2 className="section-title">مميزات <span className="text-gradient">أنظمتنا</span></h2>
            <p className="section-subtitle">نقدم مجموعة من الميزات المتقدمة التي تساعدك على إدارة أعمالك بكفاءة عالية وتحقيق أهدافك بسهولة.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <i className="fas fa-tachometer-alt"></i>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">سهولة الاستخدام</h3>
                <p className="feature-description">واجهة مستخدم بسيطة وسهلة الاستخدام تمكنك من إدارة أعمالك بكفاءة دون الحاجة إلى تدريب مكثف.</p>
                <div className="feature-badge">سهل</div>
              </div>
            </div>

            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">أمان عالي</h3>
                <p className="feature-description">أنظمة أمان متقدمة لحماية بياناتك ومعلوماتك الحساسة من الاختراق والوصول غير المصرح به.</p>
                <div className="feature-badge">آمن</div>
              </div>
            </div>

            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">تقارير متقدمة</h3>
                <p className="feature-description">تقارير تحليلية متقدمة تساعدك على فهم أداء أعمالك واتخاذ القرارات المناسبة في الوقت المناسب.</p>
                <div className="feature-badge">ذكي</div>
              </div>
            </div>

            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <i className="fas fa-sync-alt"></i>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">تحديثات مستمرة</h3>
                <p className="feature-description">تحديثات دورية لضمان مواكبة أحدث التقنيات والمتطلبات التشريعية والتنظيمية.</p>
                <div className="feature-badge">متجدد</div>
              </div>
            </div>

            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <i className="fas fa-headset"></i>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">دعم فني متميز</h3>
                <p className="feature-description">فريق دعم فني متخصص جاهز لمساعدتك في حل أي مشكلة قد تواجهك على مدار الساعة.</p>
                <div className="feature-badge">24/7</div>
              </div>
            </div>

            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">تطبيقات جوال</h3>
                <p className="feature-description">تطبيقات جوال متوافقة مع أنظمة Android و iOS تمكنك من إدارة أعمالك من أي مكان وفي أي وقت.</p>
                <div className="feature-badge">متنقل</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-container">
            <div className="stat-item animate-on-scroll">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-number" data-suffix="+">{stats.happyClients}</div>
              <div className="stat-title">عميل سعيد</div>
            </div>

            <div className="stat-item animate-on-scroll">
              <div className="stat-icon">
                <i className="fas fa-layer-group"></i>
              </div>
              <div className="stat-number" data-suffix="+">{stats.integratedSystems}</div>
              <div className="stat-title">نظام متكامل</div>
            </div>

            <div className="stat-item animate-on-scroll">
              <div className="stat-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <div className="stat-number" data-suffix="+">{stats.yearsExperience}</div>
              <div className="stat-title">سنوات خبرة</div>
            </div>

            <div className="stat-item animate-on-scroll">
              <div className="stat-icon">
                <i className="fas fa-headset"></i>
              </div>
              <div className="stat-number" data-suffix="/7">{stats.technicalSupport}</div>
              <div className="stat-title">دعم فني متميز</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-container">
            <div className="footer-col">
              <div className="footer-logo">
                <div className="footer-logo-text">كوربريت ستاك</div>
              </div>
              <p className="footer-about">
                نقدم حلولاً متكاملة لإدارة الأعمال تساعدك على تحسين الكفاءة وزيادة الإنتاجية وتحقيق النمو المستدام.
              </p>
            </div>

            <div className="footer-col">
              <h3 className="footer-title">روابط سريعة</h3>
              <ul className="footer-links">
                <li><Link href="/">الرئيسية</Link></li>
                <li><Link href="/about">من نحن</Link></li>
                <li><Link href="/systems">الأنظمة</Link></li>
                <li><Link href="/contact">تواصل معنا</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-title">الأنظمة</h3>
              <ul className="footer-links">
                <li><Link href="/systems/accounting">نظام الحسابات والفاتورة الإلكترونية</Link></li>
                <li><Link href="/systems/crm">نظام إدارة العملاء</Link></li>
                <li><Link href="/systems/hr">نظام إدارة الموارد البشرية</Link></li>
                <li><Link href="/systems/assets">نظام إدارة الأصول</Link></li>
                <li><Link href="/systems/projects">نظام إدارة المشاريع</Link></li>
                <li><Link href="/systems/inventory">نظام إدارة المخزون</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-title">
                <i className="fas fa-headset footer-icon"></i>
                تواصل معنا
              </h3>
              <ul className="footer-contact">
                <li>
                  <i className="fas fa-envelope"></i>
                  <span>info@corporatestack.com</span>
                </li>
                <li>
                  <i className="fas fa-clock"></i>
                  <span>الأحد - الخميس، 9:00 صباحاً - 5:00 مساءً</span>
                </li>
              </ul>
              <div className="footer-social">
                <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>جميع الحقوق محفوظة &copy; 2025 كوربريت ستاك</p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <a href="#" className="back-to-top">
        <i className="fas fa-arrow-up"></i>
      </a>
    </>
  )
}
