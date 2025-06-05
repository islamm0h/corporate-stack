'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function About() {
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

      // تهيئة تأثير الجزيئات المتحركة في قسم الرؤية والرسالة
      window.particlesJS('particles-js-2', {
        "particles": {
          "number": {
            "value": 40,
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
            "value": 0.2,
            "random": true,
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
            "color": "#ffffff",
            "opacity": 0.2,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 2,
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
              "enable": false,
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
            }
          }
        },
        "retina_detect": true
      });

      // تهيئة تأثير الجزيئات المتحركة في قسم الإحصائيات
      window.particlesJS('particles-js-3', {
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

      // تنفيذ تأثير ظهور عناصر الخط الزمني عند التمرير
      const timelineItems = document.querySelectorAll('.animate-timeline');

      function showTimelineItems() {
        timelineItems.forEach(item => {
          const itemPosition = item.getBoundingClientRect().top;
          const screenPosition = window.innerHeight / 1.2;

          if (itemPosition < screenPosition) {
            item.classList.add('show');
          }
        });
      }

      // تنفيذ التأثير عند التمرير
      window.addEventListener('scroll', showTimelineItems);

      // تنفيذ التأثير عند تحميل الصفحة
      showTimelineItems();

      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('scroll', showTimelineItems);
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
            <Link href="/about" className="nav-link active">من نحن</Link>
            <Link href="/systems" className="nav-link">الأنظمة</Link>
            <Link href="/contact" className="nav-link">تواصل معنا</Link>
          </nav>
          <div className="header-actions">
            {/* تم إلغاء زر لوحة التحكم */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        {/* Particles.js Container */}
        <div id="particles-js"></div>

        <div className="container">
          <div className="hero-content">
            <div className="title-with-logo">
              <div className="about-header-logo">
                <i className="fas fa-info-circle"></i>
              </div>
              <h1 className="hero-title"><span className="text-primary">تعرف</span> علينا</h1>
            </div>
            <p className="hero-subtitle">نحن شركة رائدة في مجال تطوير الأنظمة المتكاملة لإدارة الأعمال، نسعى دائماً لتقديم أفضل الحلول التقنية لعملائنا.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>من نحن</h2>
              <div className="company-intro">
                <div className="intro-icon">
                  <i className="fas fa-building"></i>
                </div>
                <p className="intro-text">
                  شركة متخصصة في تطوير الأنظمة المتكاملة وحلول الأعمال الرقمية
                </p>
              </div>
              <div className="company-values">
                <div className="value-item">
                  <div className="value-icon">
                    <i className="fas fa-rocket"></i>
                  </div>
                  <div className="value-content">
                    <h3>الابتكار</h3>
                    <p>نسعى دائماً لتقديم حلول مبتكرة تلبي احتياجات عملائنا</p>
                  </div>
                </div>
                <div className="value-item">
                  <div className="value-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div className="value-content">
                    <h3>الموثوقية</h3>
                    <p>نلتزم بتقديم خدمات عالية الجودة يمكن الاعتماد عليها</p>
                  </div>
                </div>
                <div className="value-item">
                  <div className="value-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="value-content">
                    <h3>التعاون</h3>
                    <p>نعمل بروح الفريق لتحقيق أهداف عملائنا</p>
                  </div>
                </div>
              </div>
              <a href="#" className="btn btn-primary">
                <i className="fas fa-handshake"></i> تواصل معنا
              </a>
            </div>
            <div className="about-gallery">
              <div className="gallery-title">
                <i className="fas fa-images"></i>
                <span>معرض الصور</span>
              </div>
              <div className="gallery-container">
                <div className="gallery-item main-image">
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #0066cc, #004c99)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    اجتماع فريق العمل
                  </div>
                  <div className="image-overlay">
                    <div className="image-title">اجتماع فريق العمل</div>
                  </div>
                </div>
                <div className="gallery-item">
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    التخطيط الاستراتيجي
                  </div>
                  <div className="image-overlay">
                    <div className="image-title">التخطيط الاستراتيجي</div>
                  </div>
                </div>
                <div className="gallery-item">
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    تطوير الأعمال
                  </div>
                  <div className="image-overlay">
                    <div className="image-title">تطوير الأعمال</div>
                  </div>
                </div>
                <div className="gallery-item">
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    ورشة عمل ابتكارية
                  </div>
                  <div className="image-overlay">
                    <div className="image-title">ورشة عمل ابتكارية</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-vision">
        {/* Second Particles Container */}
        <div id="particles-js-2" style={{position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 0}}></div>
        <div className="container" style={{position: 'relative', zIndex: 1}}>
          <div className="mission-vision-container">
            <div className="mission-card animate-on-scroll">
              <div className="card-icon">
                <i className="fas fa-bullseye"></i>
              </div>
              <h3 className="card-title"><span className="mission-title-effect">رسالتنا</span></h3>
              <p className="card-text">
                تقديم حلول تقنية متكاملة تساعد الشركات على تحسين أدائها وزيادة إنتاجيتها وتحقيق أهدافها بكفاءة عالية، من خلال توظيف أحدث التقنيات وأفضل الممارسات العالمية في مجال تطوير البرمجيات.
              </p>
            </div>
            <div className="vision-card animate-on-scroll">
              <div className="card-icon">
                <i className="fas fa-eye"></i>
              </div>
              <h3 className="card-title"><span className="vision-title-effect">رؤيتنا</span></h3>
              <p className="card-text">
                أن نكون الشريك التقني الأول للشركات في المنطقة، ونساهم في تحقيق التحول الرقمي الشامل من خلال تقديم حلول تقنية مبتكرة تلبي احتياجات العملاء وتتجاوز توقعاتهم.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <div className="section-header">
            <div className="title-container">
              <h2 className="section-title">
                <i className="fas fa-history timeline-icon"></i>
                <span className="timeline-title-effect">رحلتنا</span>
              </h2>
              <div className="title-particles"></div>
            </div>
            <p className="section-subtitle">تعرف على مسيرة نجاحنا عبر السنوات</p>
          </div>

          <div className="timeline">
            <div className="timeline-line"></div>

            <div className="timeline-item animate-timeline">
              <div className="timeline-dot">
                <i className="fas fa-star"></i>
              </div>
              <div className="timeline-date">2016</div>
              <div className="timeline-content">
                <h3 className="timeline-title">تأسيس الشركة</h3>
                <p className="timeline-text">بدأت رحلتنا بفريق صغير من المطورين المتحمسين وبرؤية كبيرة لتغيير عالم البرمجيات.</p>
              </div>
            </div>

            <div className="timeline-item animate-timeline">
              <div className="timeline-dot">
                <i className="fas fa-rocket"></i>
              </div>
              <div className="timeline-date">2017</div>
              <div className="timeline-content">
                <h3 className="timeline-title">إطلاق أول نظام متكامل</h3>
                <p className="timeline-text">أطلقنا أول نظام متكامل لإدارة الأعمال والذي حقق نجاحاً كبيراً وجذب العديد من العملاء.</p>
              </div>
            </div>

            <div className="timeline-item animate-timeline">
              <div className="timeline-dot">
                <i className="fas fa-award"></i>
              </div>
              <div className="timeline-date">2019</div>
              <div className="timeline-content">
                <h3 className="timeline-title">جائزة أفضل شركة تقنية</h3>
                <p className="timeline-text">حصلنا على جائزة أفضل شركة تقنية ناشئة في المنطقة تقديراً لجهودنا في تطوير حلول مبتكرة.</p>
              </div>
            </div>

            <div className="timeline-item animate-timeline">
              <div className="timeline-dot">
                <i className="fas fa-users"></i>
              </div>
              <div className="timeline-date">2021</div>
              <div className="timeline-content">
                <h3 className="timeline-title">توسع الفريق والخدمات</h3>
                <p className="timeline-text">توسع فريقنا ليضم أكثر من 50 خبيراً في مختلف المجالات، وأطلقنا 3 أنظمة جديدة.</p>
              </div>
            </div>

            <div className="timeline-item animate-timeline">
              <div className="timeline-dot">
                <i className="fas fa-globe"></i>
              </div>
              <div className="timeline-date">2023</div>
              <div className="timeline-content">
                <h3 className="timeline-title">التوسع الإقليمي</h3>
                <p className="timeline-text">افتتحنا مكاتب جديدة في عدة دول بالمنطقة وبدأنا في تقديم خدماتنا لعملاء دوليين.</p>
              </div>
            </div>

            <div className="timeline-item animate-timeline">
              <div className="timeline-dot">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="timeline-date">2025</div>
              <div className="timeline-content">
                <h3 className="timeline-title">نحو المستقبل</h3>
                <p className="timeline-text">نستمر في التطور والابتكار لتقديم أفضل الحلول التقنية التي تلبي احتياجات عملائنا المتغيرة.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Story Section */}
      <section className="success-story-section">
        <div className="container">
          <div className="section-header">
            <div className="title-container">
              <h2 className="section-title">
                <i className="fas fa-trophy success-icon"></i>
                <span className="success-title-effect">قصة نجاحنا</span>
              </h2>
              <div className="title-particles"></div>
            </div>
            <p className="section-subtitle">مسيرة النجاح والتميز في عالم التحول الرقمي</p>
          </div>

          <div className="success-story-content">
            <div className="success-intro">
              <p>تُعد شركة &quot;كوربريت ستاك&quot; (CorporateStack) نموذجاً رائداً للتميز والابتكار في مجال التحول الرقمي بالمنطقة العربية. منذ انطلاقتها في عام 2016، رسمت الشركة مساراً استثنائياً من النجاحات المتتالية، محققةً إنجازات نوعية جعلتها في طليعة شركات التقنية المتخصصة في تطوير الحلول البرمجية المتكاملة.</p>
            </div>

            <div className="success-cards" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px',
              marginBottom: '50px',
              width: '100%'
            }}>
              <div className="success-card" style={{
                backgroundColor: 'white',
                border: '2px solid #0066cc',
                borderRadius: '15px',
                padding: '30px',
                boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
                minHeight: '300px',
                display: 'block',
                visibility: 'visible'
              }}>
                <div className="success-card-icon" style={{
                  width: '70px',
                  height: '70px',
                  backgroundColor: '#e6f0ff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <i className="fas fa-chart-line" style={{ fontSize: '1.8rem', color: '#0066cc' }}></i>
                </div>
                <h3 className="success-card-title" style={{
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  marginBottom: '15px',
                  color: '#1e293b'
                }}>النمو المتسارع</h3>
                <p className="success-card-text" style={{ color: '#64748b', lineHeight: '1.7' }}>
                  شهد عام 2023 قفزة نوعية في مسيرة &quot;كوربريت ستاك&quot; مع تحقيق نمو استثنائي تجاوز 200% في حجم الأعمال، مدعوماً بتوسع محفظة الحلول التقنية وتبني استراتيجيات مبتكرة لتلبية احتياجات السوق المتغيرة، مما عزز من مكانتها كشريك موثوق للتحول الرقمي.
                </p>
              </div>

              <div className="success-card" style={{
                backgroundColor: 'white',
                border: '2px solid #0066cc',
                borderRadius: '15px',
                padding: '30px',
                boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
                minHeight: '300px',
                display: 'block',
                visibility: 'visible'
              }}>
                <div className="success-card-icon" style={{
                  width: '70px',
                  height: '70px',
                  backgroundColor: '#e6f0ff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <i className="fas fa-globe-americas" style={{ fontSize: '1.8rem', color: '#0066cc' }}></i>
                </div>
                <h3 className="success-card-title" style={{
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  marginBottom: '15px',
                  color: '#1e293b'
                }}>التوسع الإقليمي والعالمي</h3>
                <p className="success-card-text" style={{ color: '#64748b', lineHeight: '1.7' }}>
                  امتدت بصمة &quot;كوربريت ستاك&quot; لتشمل أسواقاً إقليمية متعددة، مع افتتاح مقرات استراتيجية في المملكة العربية السعودية والإمارات العربية المتحدة، وإقامة شراكات دولية مع كبرى المؤسسات، مما أتاح لها تقديم خدماتها المتميزة لقاعدة عملاء متنامية عبر الشرق الأوسط وشمال أفريقيا.
                </p>
              </div>
            </div>

            <div className="success-solutions">
              <h3 className="solutions-title">منظومة الحلول المتكاملة</h3>
              <p className="solutions-intro">تقدم &quot;كوربريت ستاك&quot; باقة متكاملة من الأنظمة والحلول التقنية المتطورة التي تغطي مختلف احتياجات الأعمال:</p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                margin: '30px 0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 3px 15px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e6f0ff',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#e6f0ff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '15px',
                    flexShrink: 0
                  }}>
                    <i className="fas fa-building" style={{ fontSize: '1.2rem', color: '#0066cc' }}></i>
                  </div>
                  <div style={{ color: '#1e293b', fontSize: '1rem', fontWeight: '500' }}>
                    نظام إدارة موارد المؤسسات (ERP) المتكامل
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 3px 15px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e6f0ff',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#e6f0ff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '15px',
                    flexShrink: 0
                  }}>
                    <i className="fas fa-users" style={{ fontSize: '1.2rem', color: '#0066cc' }}></i>
                  </div>
                  <div style={{ color: '#1e293b', fontSize: '1rem', fontWeight: '500' }}>
                    منظومة إدارة علاقات العملاء (CRM) الذكية
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 3px 15px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e6f0ff',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#e6f0ff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '15px',
                    flexShrink: 0
                  }}>
                    <i className="fas fa-user-tie" style={{ fontSize: '1.2rem', color: '#0066cc' }}></i>
                  </div>
                  <div style={{ color: '#1e293b', fontSize: '1rem', fontWeight: '500' }}>
                    نظام إدارة الموارد البشرية (HRMS) الشامل
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 3px 15px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e6f0ff',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#e6f0ff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '15px',
                    flexShrink: 0
                  }}>
                    <i className="fas fa-file-invoice-dollar" style={{ fontSize: '1.2rem', color: '#0066cc' }}></i>
                  </div>
                  <div style={{ color: '#1e293b', fontSize: '1rem', fontWeight: '500' }}>
                    حلول الفوترة الإلكترونية المتوافقة مع المتطلبات التشريعية
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 3px 15px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e6f0ff',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#e6f0ff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '15px',
                    flexShrink: 0
                  }}>
                    <i className="fas fa-tasks" style={{ fontSize: '1.2rem', color: '#0066cc' }}></i>
                  </div>
                  <div style={{ color: '#1e293b', fontSize: '1rem', fontWeight: '500' }}>
                    أنظمة متكاملة لإدارة المشاريع والمخزون والأصول
                  </div>
                </div>
              </div>

              <p className="solutions-outro">تتميز جميع حلولنا بالمرونة العالية وقابلية التخصيص والتكامل السلس، مما يجعلها مناسبة للمؤسسات بمختلف أحجامها وقطاعاتها، مع ضمان أعلى معايير الأمان والموثوقية.</p>
            </div>

            <div className="success-cards">
              <div className="success-card animate-on-scroll">
                <div className="success-card-icon">
                  <i className="fas fa-handshake"></i>
                </div>
                <h3 className="success-card-title">الشراكات الاستراتيجية</h3>
                <p className="success-card-text">
                  عززت &quot;كوربريت ستاك&quot; مكانتها من خلال بناء شبكة واسعة من الشراكات الاستراتيجية مع كبرى المؤسسات الإقليمية والعالمية، بما في ذلك شركات الاتصالات الرائدة مثل &quot;أمنية&quot; في الأردن و&quot;موبايلي&quot; في السعودية، مما أتاح لها توسيع نطاق خدماتها وتعزيز قدراتها التنافسية في مختلف الأسواق.
                </p>
              </div>

              <div className="success-card animate-on-scroll">
                <div className="success-card-icon">
                  <i className="fas fa-star"></i>
                </div>
                <h3 className="success-card-title">التميز القطاعي</h3>
                <p className="success-card-text">
                  طورت &quot;كوربريت ستاك&quot; خبرات متخصصة في قطاعات حيوية متعددة، مثل الرعاية الصحية والتعليم والخدمات المالية والمقاولات، من خلال تقديم حلول مبتكرة تلبي الاحتياجات الفريدة لكل قطاع، مما أسهم في تحسين الكفاءة التشغيلية وتعزيز القدرة التنافسية لعملائها في هذه القطاعات.
                </p>
              </div>
            </div>

            <div className="success-conclusion">
              <h3 className="conclusion-title">رؤيتنا المستقبلية</h3>
              <p className="conclusion-text">
                تواصل &quot;كوربريت ستاك&quot; مسيرتها نحو آفاق جديدة من النجاح والريادة، مستندة إلى رؤية استراتيجية طموحة تركز على الابتكار المستمر وتبني أحدث التقنيات مثل الذكاء الاصطناعي وتعلم الآلة وإنترنت الأشياء. نلتزم بتمكين عملائنا من تحقيق التحول الرقمي الشامل وتعزيز قدراتهم التنافسية في عصر الاقتصاد الرقمي، مع الحفاظ على قيمنا الأساسية المتمثلة في الجودة والموثوقية والتميز في خدمة العملاء.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        {/* Third Particles Container */}
        <div id="particles-js-3" style={{position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 1}}></div>
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
