'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface System {
  id: string
  name: string
  description: string
  category: string
  price: number
  features: string[]
  isActive: boolean
}

export default function Systems() {
  const [systems, setSystems] = useState<System[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  // جلب الأنظمة من قاعدة البيانات
  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const response = await fetch('/api/systems')
        const result = await response.json()

        if (result.success) {
          setSystems(result.data)
        } else {
          console.error('Failed to fetch systems:', result.message)
        }
      } catch (error) {
        console.error('Error fetching systems:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSystems()
  }, [])

  // دالة لإرجاع أيقونة النظام حسب الفئة
  const getSystemIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'accounting': return 'fas fa-calculator'
      case 'crm': return 'fas fa-users'
      case 'hr': return 'fas fa-user-tie'
      case 'inventory': return 'fas fa-warehouse'
      case 'analytics': return 'fas fa-chart-line'
      case 'ecommerce': return 'fas fa-shopping-cart'
      default: return 'fas fa-cog'
    }
  }

  useEffect(() => {
    // تهيئة تأثير الجزيئات المتحركة
    if (typeof window !== 'undefined' && window.particlesJS) {
      // تهيئة تأثير الجزيئات المتحركة في قسم البطل
      window.particlesJS('particles-js', {
        "particles": {
          "number": {
            "value": 80,
            "density": {
              "enable": true,
              "value_area": 800
            }
          },
          "color": {
            "value": "#0066cc"
          },
          "shape": {
            "type": "circle",
            "stroke": {
              "width": 0,
              "color": "#000000"
            },
            "polygon": {
              "nb_sides": 5
            }
          },
          "opacity": {
            "value": 0.5,
            "random": false,
            "anim": {
              "enable": false,
              "speed": 1,
              "opacity_min": 0.1,
              "sync": false
            }
          },
          "size": {
            "value": 3,
            "random": true,
            "anim": {
              "enable": false,
              "speed": 40,
              "size_min": 0.1,
              "sync": false
            }
          },
          "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#0066cc",
            "opacity": 0.4,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 3,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
              "enable": false,
              "rotateX": 600,
              "rotateY": 1200
            }
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": true,
              "mode": "grab"
            },
            "onclick": {
              "enable": true,
              "mode": "push"
            },
            "resize": true
          },
          "modes": {
            "grab": {
              "distance": 140,
              "line_linked": {
                "opacity": 1
              }
            },
            "bubble": {
              "distance": 400,
              "size": 40,
              "duration": 2,
              "opacity": 8,
              "speed": 3
            },
            "repulse": {
              "distance": 200,
              "duration": 0.4
            },
            "push": {
              "particles_nb": 4
            },
            "remove": {
              "particles_nb": 2
            }
          }
        },
        "retina_detect": true
      });

      // تهيئة تأثير الجزيئات المتحركة في قسم الإحصائيات
      window.particlesJS('particles-js-stats', {
        "particles": {
          "number": {
            "value": 60,
            "density": {
              "enable": true,
              "value_area": 800
            }
          },
          "color": {
            "value": "#ffffff"
          },
          "shape": {
            "type": "circle",
            "stroke": {
              "width": 0,
              "color": "#000000"
            }
          },
          "opacity": {
            "value": 0.3,
            "random": true,
            "anim": {
              "enable": true,
              "speed": 1,
              "opacity_min": 0.1,
              "sync": false
            }
          },
          "size": {
            "value": 4,
            "random": true,
            "anim": {
              "enable": true,
              "speed": 2,
              "size_min": 0.1,
              "sync": false
            }
          },
          "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.2,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 2,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
              "enable": false,
              "rotateX": 600,
              "rotateY": 1200
            }
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": true,
              "mode": "bubble"
            },
            "onclick": {
              "enable": true,
              "mode": "push"
            },
            "resize": true
          },
          "modes": {
            "grab": {
              "distance": 140,
              "line_linked": {
                "opacity": 0.5
              }
            },
            "bubble": {
              "distance": 200,
              "size": 6,
              "duration": 2,
              "opacity": 0.8,
              "speed": 3
            },
            "push": {
              "particles_nb": 4
            }
          }
        },
        "retina_detect": true
      });

      // تنفيذ عداد الأرقام عند ظهور قسم الإحصائيات في الشاشة
      const statsSection = document.querySelector('.stats-section');
      const statNumbers = document.querySelectorAll('.stat-number');
      let counted = false;

      function animateNumbers() {
        if (counted) return;

        statNumbers.forEach(statNumber => {
          const targetNumber = parseInt(statNumber.textContent || '0');
          const suffix = statNumber.getAttribute('data-suffix');
          let currentNumber = 0;
          const duration = 2000; // مدة العد بالمللي ثانية
          const interval = Math.floor(duration / targetNumber);

          const counter = setInterval(() => {
            currentNumber++;
            if (statNumber.textContent !== null) {
              statNumber.textContent = currentNumber.toString();
            }

            if (currentNumber >= targetNumber) {
              if (statNumber.textContent !== null) {
                statNumber.textContent = targetNumber.toString();
              }
              clearInterval(counter);
              if (suffix) {
                statNumber.setAttribute('data-suffix', suffix);
              }
            }
          }, interval);
        });

        counted = true;
      }

      // تنفيذ عداد الأرقام عند التمرير إلى قسم الإحصائيات
      const handleScroll = () => {
        if (statsSection) {
          const sectionPosition = statsSection.getBoundingClientRect().top;
          const screenPosition = window.innerHeight / 1.3;

          if (sectionPosition < screenPosition) {
            animateNumbers();
          }
        }
      };

      window.addEventListener('scroll', handleScroll);

      // تنفيذ عداد الأرقام إذا كان قسم الإحصائيات مرئياً عند تحميل الصفحة
      if (statsSection && statsSection.getBoundingClientRect().top < window.innerHeight) {
        animateNumbers();
      }

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

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
            <Link href="/" className="nav-link">الرئيسية</Link>
            <Link href="/about" className="nav-link">من نحن</Link>
            <Link href="/systems" className="nav-link active">الأنظمة</Link>
            <Link href="/contact" className="nav-link">تواصل معنا</Link>
          </nav>
          <div className="header-actions">
            {/* تم إلغاء زر لوحة التحكم */}
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="page-header">
        {/* Particles.js Container */}
        <div id="particles-js"></div>

        <div className="container">
          <div className="systems-header-logo">
            <i className="fas fa-cogs"></i>
          </div>
          <h1 className="page-title"><span className="text-primary">أنظمتنا</span> المتكاملة</h1>
          <p className="page-subtitle">مجموعة متكاملة من الأنظمة المصممة خصيصاً لتلبية احتياجات الأعمال المختلفة وتحسين الكفاءة وزيادة الإنتاجية.</p>
        </div>
      </section>

      {/* Systems Section */}
      <section className="systems-section">
        <div className="container">
          <div className="systems-filter">
            <button className="filter-btn active" data-filter="all">
              <i className="fas fa-th-large"></i>
              جميع الأنظمة
            </button>
            <button className="filter-btn" data-filter="accounting">
              <i className="fas fa-calculator"></i>
              المحاسبة
            </button>
            <button className="filter-btn" data-filter="hr">
              <i className="fas fa-users-cog"></i>
              الموارد البشرية
            </button>
            <button className="filter-btn" data-filter="crm">
              <i className="fas fa-user-tie"></i>
              إدارة العملاء
            </button>
            <button className="filter-btn" data-filter="assets">
              <i className="fas fa-cubes"></i>
              إدارة الأصول
            </button>
            <button className="filter-btn" data-filter="projects">
              <i className="fas fa-tasks"></i>
              إدارة المشاريع
            </button>
            <button className="filter-btn" data-filter="inventory">
              <i className="fas fa-warehouse"></i>
              إدارة المخزون
            </button>
          </div>

          <div className="systems-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px',
            marginBottom: '50px'
          }}>
            {/* نظام الحسابات والفاتورة الإلكترونية */}
            <div className="system-card" data-type="accounting" style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.4s ease',
              border: '1px solid rgba(0, 102, 204, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
              <div className="system-card-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
                <i className="fas fa-file-invoice-dollar system-icon" style={{
                  fontSize: '3rem',
                  color: '#ff6b6b',
                  marginBottom: '15px',
                  display: 'block'
                }}></i>
              </div>
              <div className="system-card-body" style={{ flex: 1 }}>
                <h3 className="system-title" style={{
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  marginBottom: '15px',
                  color: 'var(--secondary-color)'
                }}>نظام الحسابات والفاتورة الإلكترونية</h3>
                <p className="system-description" style={{
                  color: 'var(--gray-color)',
                  lineHeight: '1.7',
                  marginBottom: '20px'
                }}>نظام متكامل لإدارة الحسابات والفواتير الإلكترونية بكفاءة عالية وفقًا لمتطلبات هيئة الزكاة والضريبة والجمارك.</p>
              </div>
              <div className="system-card-footer">
                <Link href="/systems/accounting" className="btn btn-primary" style={{
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="fas fa-eye" style={{ marginLeft: '8px' }}></i> عرض التفاصيل
                </Link>
              </div>
            </div>

            {/* نظام إدارة العملاء */}
            <div className="system-card" data-type="crm" style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.4s ease',
              border: '1px solid rgba(0, 102, 204, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
              <div className="system-card-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
                <i className="fas fa-users system-icon" style={{
                  fontSize: '3rem',
                  color: '#ffd166',
                  marginBottom: '15px',
                  display: 'block'
                }}></i>
              </div>
              <div className="system-card-body" style={{ flex: 1 }}>
                <h3 className="system-title" style={{
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  marginBottom: '15px',
                  color: 'var(--secondary-color)'
                }}>نظام إدارة العملاء</h3>
                <p className="system-description" style={{
                  color: 'var(--gray-color)',
                  lineHeight: '1.7',
                  marginBottom: '20px'
                }}>نظام متكامل لإدارة بيانات العملاء والتواصل معهم بفعالية.</p>
              </div>
              <div className="system-card-footer">
                <Link href="/systems/crm" className="btn btn-primary" style={{
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="fas fa-eye" style={{ marginLeft: '8px' }}></i> عرض التفاصيل
                </Link>
              </div>
            </div>

            {/* نظام إدارة الموارد البشرية */}
            <div className="system-card" data-type="hr" style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.4s ease',
              border: '1px solid rgba(0, 102, 204, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
              <div className="system-card-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
                <i className="fas fa-user-tie system-icon" style={{
                  fontSize: '3rem',
                  color: '#4ecdc4',
                  marginBottom: '15px',
                  display: 'block'
                }}></i>
              </div>
              <div className="system-card-body" style={{ flex: 1 }}>
                <h3 className="system-title" style={{
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  marginBottom: '15px',
                  color: 'var(--secondary-color)'
                }}>نظام إدارة الموارد البشرية</h3>
                <p className="system-description" style={{
                  color: 'var(--gray-color)',
                  lineHeight: '1.7',
                  marginBottom: '20px'
                }}>نظام متكامل لإدارة شؤون الموظفين والرواتب والإجازات والتقييمات.</p>
              </div>
              <div className="system-card-footer">
                <Link href="/systems/hr" className="btn btn-primary" style={{
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="fas fa-eye" style={{ marginLeft: '8px' }}></i> عرض التفاصيل
                </Link>
              </div>
            </div>

            {/* نظام إدارة الأصول */}
            <div className="system-card" data-type="assets" style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.4s ease',
              border: '1px solid rgba(0, 102, 204, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
              <div className="system-card-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
                <i className="fas fa-boxes system-icon" style={{
                  fontSize: '3rem',
                  color: '#6a0572',
                  marginBottom: '15px',
                  display: 'block'
                }}></i>
              </div>
              <div className="system-card-body" style={{ flex: 1 }}>
                <h3 className="system-title" style={{
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  marginBottom: '15px',
                  color: 'var(--secondary-color)'
                }}>نظام إدارة الأصول</h3>
                <p className="system-description" style={{
                  color: 'var(--gray-color)',
                  lineHeight: '1.7',
                  marginBottom: '20px'
                }}>نظام متكامل لإدارة الأصول والممتلكات وتتبع حالتها وصيانتها.</p>
              </div>
              <div className="system-card-footer">
                <Link href="/systems/assets" className="btn btn-primary" style={{
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="fas fa-eye" style={{ marginLeft: '8px' }}></i> عرض التفاصيل
                </Link>
              </div>
            </div>

            {/* نظام إدارة المشاريع */}
            <div className="system-card" data-type="projects" style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.4s ease',
              border: '1px solid rgba(0, 102, 204, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
              <div className="system-card-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
                <i className="fas fa-tasks system-icon" style={{
                  fontSize: '3rem',
                  color: '#1a936f',
                  marginBottom: '15px',
                  display: 'block'
                }}></i>
              </div>
              <div className="system-card-body" style={{ flex: 1 }}>
                <h3 className="system-title" style={{
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  marginBottom: '15px',
                  color: 'var(--secondary-color)'
                }}>نظام إدارة المشاريع</h3>
                <p className="system-description" style={{
                  color: 'var(--gray-color)',
                  lineHeight: '1.7',
                  marginBottom: '20px'
                }}>نظام متكامل لإدارة المشاريع وتتبع المهام والموارد والجداول الزمنية.</p>
              </div>
              <div className="system-card-footer">
                <Link href="/systems/projects" className="btn btn-primary" style={{
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="fas fa-eye" style={{ marginLeft: '8px' }}></i> عرض التفاصيل
                </Link>
              </div>
            </div>

            {/* نظام إدارة المخزون */}
            <div className="system-card" data-type="inventory" style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.4s ease',
              border: '1px solid rgba(0, 102, 204, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
              <div className="system-card-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
                <i className="fas fa-warehouse system-icon" style={{
                  fontSize: '3rem',
                  color: '#0891b2',
                  marginBottom: '15px',
                  display: 'block'
                }}></i>
              </div>
              <div className="system-card-body" style={{ flex: 1 }}>
                <h3 className="system-title" style={{
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  marginBottom: '15px',
                  color: 'var(--secondary-color)'
                }}>نظام إدارة المخزون</h3>
                <p className="system-description" style={{
                  color: 'var(--gray-color)',
                  lineHeight: '1.7',
                  marginBottom: '20px'
                }}>نظام متكامل لإدارة المخزون والمستودعات وتتبع المنتجات والجرد وسلاسل التوريد.</p>
              </div>
              <div className="system-card-footer">
                <Link href="/systems/inventory" className="btn btn-primary" style={{
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="fas fa-eye" style={{ marginLeft: '8px' }}></i> عرض التفاصيل
                </Link>
              </div>
            </div>
          </div>

          <div className="pagination" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '50px'
          }}>
            <div className="page-item active" style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>1</div>
            <div className="page-item" style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              color: 'var(--secondary-color)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>2</div>
            <div className="page-item" style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              color: 'var(--secondary-color)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>3</div>
            <div className="page-item" style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              color: 'var(--secondary-color)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}><i className="fas fa-chevron-left"></i></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        {/* Particles Container */}
        <div id="particles-js-stats" style={{position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 1}}></div>
        <div className="container">
          <div className="stats-container">
            <div className="stat-item animate-on-scroll">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-number" data-suffix="+">1000</div>
              <div className="stat-title">عميل سعيد</div>
            </div>

            <div className="stat-item animate-on-scroll">
              <div className="stat-icon">
                <i className="fas fa-layer-group"></i>
              </div>
              <div className="stat-number" data-suffix="+">7</div>
              <div className="stat-title">نظام متكامل</div>
            </div>

            <div className="stat-item animate-on-scroll">
              <div className="stat-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <div className="stat-number" data-suffix="+">10</div>
              <div className="stat-title">سنوات خبرة</div>
            </div>

            <div className="stat-item animate-on-scroll">
              <div className="stat-icon">
                <i className="fas fa-headset"></i>
              </div>
              <div className="stat-number" data-suffix="/7">24</div>
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
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <div className="location-title">الإمارات العربية المتحدة</div>
                    <div className="location-address">مكتب 501، الطابق الخامس، مكاتب 2، مجمع الأعمال، مدينة دبي للإنتاج، دبي</div>
                  </div>
                </li>
                <li>
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <div className="location-title">مصر</div>
                    <div className="location-address">الطابق الأرضي، القاهرة الجديدة، شارع التسعين، البنفسج، الحي الأول، القاهرة</div>
                  </div>
                </li>
                <li>
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <div className="location-title">البحرين</div>
                    <div className="location-address">مبنى 1095، طريق 1425، مجمع 1014، ص.ب. 14، الهملة</div>
                  </div>
                </li>
                <li>
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <div className="location-title">المملكة العربية السعودية</div>
                    <div className="location-address">مبنى 7084، طريق الملك فهد، الرياض</div>
                  </div>
                </li>
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
