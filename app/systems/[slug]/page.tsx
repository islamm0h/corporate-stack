'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface System {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  category: string
  features: string[]
  specifications?: Record<string, any>
  images?: string[]
  isActive: boolean
  isFeatured?: boolean
  sortOrder?: number
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  createdAt: string
  updatedAt: string
}

export default function SystemDetails() {
  const params = useParams()
  const slug = params.slug as string
  const [system, setSystem] = useState<System | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSystem = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/systems')
        const result = await response.json()

        if (result.success) {
          const foundSystem = result.data.find((s: System) => s.slug === slug)
          if (foundSystem) {
            setSystem(foundSystem)
          } else {
            setError('النظام غير موجود')
          }
        } else {
          setError('فشل في جلب بيانات النظام')
        }
      } catch (error) {
        console.error('Error fetching system:', error)
        setError('حدث خطأ أثناء جلب البيانات')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchSystem()
    }
  }, [slug])

  // دالة لإرجاع أيقونة النظام حسب الفئة
  const getSystemIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'مالي': return 'fas fa-file-invoice-dollar'
      case 'مبيعات': return 'fas fa-users'
      case 'موارد بشرية': return 'fas fa-user-tie'
      case 'مخزون': return 'fas fa-warehouse'
      case 'إدارة': return 'fas fa-tasks'
      case 'تقني': return 'fas fa-code'
      default: return 'fas fa-cog'
    }
  }

  // دالة لإرجاع لون النظام حسب الفئة
  const getSystemColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'مالي': return '#ff6b6b'
      case 'مبيعات': return '#ffd166'
      case 'موارد بشرية': return '#06d6a0'
      case 'مخزون': return '#118ab2'
      case 'إدارة': return '#8338ec'
      case 'تقني': return '#fb8500'
      default: return '#0066cc'
    }
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg-light)'
      }}>
        <div style={{ textAlign: 'center', color: 'var(--gray-color)' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', marginBottom: '20px' }}></i>
          <div style={{ fontSize: '1.2rem' }}>جاري تحميل تفاصيل النظام...</div>
        </div>
      </div>
    )
  }

  if (error || !system) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg-light)'
      }}>
        <div style={{ textAlign: 'center', color: 'var(--gray-color)' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', marginBottom: '20px', color: 'var(--warning-color)' }}></i>
          <div style={{ fontSize: '1.2rem', marginBottom: '20px' }}>{error || 'النظام غير موجود'}</div>
          <Link href="/systems" style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: 'var(--primary-color)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600'
          }}>
            العودة للأنظمة
          </Link>
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
          <nav className="nav-menu" id="navMenu">
            <Link href="/" className="nav-link">الرئيسية</Link>
            <Link href="/about" className="nav-link">من نحن</Link>
            <Link href="/systems" className="nav-link active">الأنظمة</Link>
            <Link href="/contact" className="nav-link">تواصل معنا</Link>
          </nav>
          <div className="header-actions">
            <button
              className="mobile-menu-toggle"
              onClick={() => {
                const navMenu = document.getElementById('navMenu');
                navMenu?.classList.toggle('active');
              }}
            >
              <i className="fas fa-bars"></i>
            </button>
            <Link
              href="/contact?trial=true"
              className="btn btn-free-trial"
            >
              <i className="fas fa-gift"></i>
              تجربة مجانية
            </Link>
          </div>
        </div>
      </header>

      <div style={{ background: 'var(--bg-light)', minHeight: '100vh', marginTop: 'var(--header-height)' }}>
        {/* Page Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
          color: 'white',
          padding: '80px 0 60px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }}></div>

          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 30px',
                fontSize: '3rem',
                color: 'white'
              }}>
                <i className={getSystemIcon(system.category)}></i>
              </div>

              <h1 style={{
                fontSize: '3rem',
                fontWeight: '700',
                margin: '0 0 20px 0',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {system.name}
              </h1>

              <p style={{
                fontSize: '1.3rem',
                opacity: 0.9,
                lineHeight: '1.6',
                margin: '0 0 30px 0'
              }}>
                {system.description}
              </p>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '15px',
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '12px 24px',
                borderRadius: '50px',
                backdropFilter: 'blur(10px)'
              }}>
                <span style={{
                  padding: '6px 16px',
                  background: getSystemColor(system.category),
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  {system.category}
                </span>
                <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  نظام متكامل وموثوق
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container" style={{ padding: '60px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Main Content */}
            <div>
            {/* Features Section */}
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '40px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              marginBottom: '30px'
            }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: 'var(--secondary-color)',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <i className="fas fa-star" style={{ color: 'var(--primary-color)' }}></i>
                المميزات الرئيسية
              </h2>
              
              <div style={{ display: 'grid', gap: '20px' }}>
                {system.features.map((feature, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '20px',
                    background: 'var(--bg-light)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.05)'
                  }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: `${getSystemColor(system.category)}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: getSystemColor(system.category),
                      fontSize: '1.2rem'
                    }}>
                      <i className="fas fa-check"></i>
                    </div>
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: 'var(--secondary-color)'
                    }}>
                      {feature}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications Section */}
            {system.specifications && Object.keys(system.specifications).length > 0 && (
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '40px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                marginBottom: '30px'
              }}>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: 'var(--secondary-color)',
                  marginBottom: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}>
                  <i className="fas fa-cogs" style={{ color: 'var(--primary-color)' }}></i>
                  المواصفات التقنية
                </h2>
                
                <div style={{ display: 'grid', gap: '15px' }}>
                  {Object.entries(system.specifications).map(([key, value]) => (
                    <div key={key} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '15px 20px',
                      background: 'var(--bg-light)',
                      borderRadius: '8px'
                    }}>
                      <span style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>
                        {key}
                      </span>
                      <span style={{ color: 'var(--gray-color)' }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
            {/* CTA Card */}
            <div style={{
              background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
              borderRadius: '15px',
              padding: '30px',
              color: 'white',
              textAlign: 'center',
              marginBottom: '30px'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '15px'
              }}>
                هل تريد هذا النظام؟
              </h3>
              <p style={{
                opacity: 0.9,
                marginBottom: '25px',
                lineHeight: '1.6'
              }}>
                احصل على عرض سعر مخصص لاحتياجاتك
              </p>
              <Link href={`/contact?quote=true&system=${encodeURIComponent(system.name)}&slug=${system.slug}`} style={{
                display: 'inline-block',
                background: 'white',
                color: 'var(--primary-color)',
                padding: '15px 30px',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease'
              }}>
                <i className="fas fa-paper-plane" style={{ marginLeft: '10px' }}></i>
                طلب عرض سعر
              </Link>
            </div>

            {/* Navigation */}
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '25px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}>
              <h4 style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                color: 'var(--secondary-color)',
                marginBottom: '20px'
              }}>
                روابط سريعة
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link href="/systems" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 15px',
                  background: 'var(--bg-light)',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'var(--secondary-color)',
                  transition: 'all 0.3s ease'
                }}>
                  <i className="fas fa-arrow-right"></i>
                  جميع الأنظمة
                </Link>
                <Link href="/contact" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 15px',
                  background: 'var(--bg-light)',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'var(--secondary-color)',
                  transition: 'all 0.3s ease'
                }}>
                  <i className="fas fa-phone"></i>
                  تواصل معنا
                </Link>
                <Link href="/about" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 15px',
                  background: 'var(--bg-light)',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'var(--secondary-color)',
                  transition: 'all 0.3s ease'
                }}>
                  <i className="fas fa-info-circle"></i>
                  من نحن
                </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-container">
            <div className="footer-col">
              <div className="footer-logo">
                <img src="/logo.svg" alt="Corporate Stack Logo" className="footer-logo-image" />
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
                <li><Link href="/systems/accounting-electronic-invoice-system">نظام الحسابات والفاتورة الإلكترونية</Link></li>
                <li><Link href="/systems/crm-customer-management-system">نظام إدارة العملاء</Link></li>
                <li><Link href="/systems/hr-human-resources-system">نظام إدارة الموارد البشرية</Link></li>
                <li><Link href="/systems/inventory-management-system">نظام إدارة المخزون</Link></li>
                <li><Link href="/systems/project-management-system">نظام إدارة المشاريع</Link></li>
                <li><Link href="/systems/pos-point-of-sale-system">نظام نقاط البيع</Link></li>
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
