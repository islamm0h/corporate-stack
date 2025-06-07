'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function ContactPage() {
  const searchParams = useSearchParams()
  const [isTrial, setIsTrial] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    terms: false
  })

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
    terms?: string;
  }>({})
  const [showModal, setShowModal] = useState(false)
  const [requestNumber, setRequestNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [mounted, setMounted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      newErrors.name = 'يرجى إدخال الاسم الكامل'
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(formData.email.trim())) {
      newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح'
    }

    const phonePattern = /^(05|5|\+9665)[0-9]{8}$/
    if (!phonePattern.test(formData.phone.trim().replace(/\s/g, ''))) {
      newErrors.phone = 'يرجى إدخال رقم جوال صحيح'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'يرجى اختيار موضوع الرسالة'
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'يرجى إدخال رسالة لا تقل عن 10 أحرف'
    }

    if (!formData.terms) {
      newErrors.terms = 'يجب الموافقة على الشروط والأحكام'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted!', formData)
    setSubmitError('')

    if (!validateForm()) {
      console.log('Form validation failed')
      return
    }

    console.log('Starting form submission...')
    setIsSubmitting(true)

    try {
      console.log('Sending request to API...')
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      console.log('Response received:', response.status)
      const result = await response.json()
      console.log('Result:', result)

      if (result.success) {
        setRequestNumber(result.data.requestNumber)
        setShowModal(true)

        // إعادة تعيين النموذج
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: '',
          terms: false
        })
        setErrors({})
      } else {
        setSubmitError(result.error || 'حدث خطأ في إرسال الرسالة')
        if (result.details) {
          const newErrors: any = {}
          result.details.forEach((detail: any) => {
            newErrors[detail.field] = detail.message
          })
          setErrors(newErrors)
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    // التحقق من طلب التجربة المجانية
    const trial = searchParams.get('trial')
    if (trial === 'true') {
      setIsTrial(true)
      setFormData(prev => ({
        ...prev,
        subject: 'طلب تجربة مجانية لمدة 14 يوم',
        message: 'أرغب في الحصول على تجربة مجانية لمدة 14 يوم لأنظمة Corporate Stack. يرجى التواصل معي لترتيب ذلك.'
      }))
    }
  }, [searchParams])

  // تبسيط تحميل الجزيئات
  useEffect(() => {
    if (!mounted) return

    const loadParticles = () => {
      if (typeof window !== 'undefined' && !window.particlesJS) {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js'
        script.onload = () => {
          if (window.particlesJS) {
            window.particlesJS('particles-js', {
              particles: {
                number: { value: 30, density: { enable: true, value_area: 800 } },
                color: { value: '#0066cc' },
                shape: { type: 'circle' },
                opacity: { value: 0.3 },
                size: { value: 2, random: true },
                move: { enable: true, speed: 1 }
              }
            })
          }
        }
        document.head.appendChild(script)
      }
    }

    const timer = setTimeout(loadParticles, 500)
    return () => clearTimeout(timer)
  }, [mounted])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <>
      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.3;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.7;
          }
        }

        @keyframes pulse-border {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 102, 204, 0.4);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(0, 102, 204, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 102, 204, 0);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .contact-section {
          padding: 80px 0;
        }

        .contact-form input:focus,
        .contact-form textarea:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
        }

        .contact-form input::placeholder,
        .contact-form textarea::placeholder {
          color: #94a3b8;
        }

        @media (max-width: 992px) {
          .contact-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

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
            <Link href="/systems" className="nav-link">الأنظمة</Link>
            <Link href="/contact" className="nav-link active">تواصل معنا</Link>
          </nav>
          <div className="header-actions">
            {!isTrial && (
              <Link
                href="/contact?trial=true"
                className="btn btn-free-trial"
              >
                <i className="fas fa-gift"></i>
                تجربة مجانية
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="page-header" style={{
        backgroundColor: '#ffffff',
        color: 'var(--secondary-color)',
        padding: '60px 0',
        marginTop: 'var(--header-height)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        height: '50vh',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div id="particles-js" style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: 1
        }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            width: '100px',
            height: '100px',
            backgroundColor: 'var(--primary-color)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            position: 'relative',
            animation: 'pulse-border 2s infinite'
          }}>
            <div style={{
              content: '',
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'var(--primary-color)',
              opacity: '0.7',
              animation: 'pulse-ring 2s infinite'
            }}></div>
            <i className="fas fa-headset" style={{
              fontSize: '3rem',
              color: 'white',
              position: 'relative',
              zIndex: 2
            }}></i>
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '15px',
            color: 'var(--secondary-color)'
          }}>
            <span style={{ color: 'var(--primary-color)' }}>
              {isTrial ? 'طلب تجربة مجانية' : 'تواصل'}
            </span> معنا
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'var(--gray-color)',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {isTrial
              ? 'احصل على تجربة مجانية لمدة 14 يوم لجميع أنظمة Corporate Stack. املأ النموذج أدناه وسنتواصل معك خلال 24 ساعة.'
              : 'نحن هنا للإجابة على استفساراتك وتقديم المساعدة. يمكنك التواصل معنا من خلال النموذج أدناه أو عبر معلومات الاتصال المتاحة.'
            }
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" style={{ padding: '80px 0' }}>
        <div className="container">

          {/* تنبيه التجربة المجانية */}
          {isTrial && (
            <div style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '40px',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                animation: 'shine 3s infinite'
              }}></div>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <i className="fas fa-gift" style={{ fontSize: '2rem', marginBottom: '10px', display: 'block' }}></i>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', fontWeight: '700' }}>
                  🎉 تجربة مجانية لمدة 14 يوم
                </h3>
                <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9 }}>
                  تم تعبئة النموذج مسبقاً لطلب التجربة المجانية. أكمل بياناتك وسنتواصل معك خلال 24 ساعة!
                </p>
              </div>
            </div>
          )}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '50px'
          }}>

            {/* Contact Info */}
            <div style={{
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              padding: '40px',
              borderRadius: '10px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                transform: 'translateX(-100%)',
                animation: 'shine 3s infinite'
              }}></div>

              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '30px',
                position: 'relative',
                paddingBottom: '15px'
              }}>
                <i className="fas fa-info-circle"></i> معلومات <span style={{ color: '#ffffff', fontWeight: '700' }}>الاتصال</span>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '50px',
                  height: '3px',
                  backgroundColor: 'white',
                  borderRadius: '3px'
                }}></div>
              </h2>

              <p style={{
                marginBottom: '30px',
                lineHeight: '1.8',
                opacity: '0.9'
              }}>
                نحن نسعى دائماً لتقديم أفضل خدمة لعملائنا. يمكنك التواصل معنا في أي وقت وسنقوم بالرد عليك في أقرب وقت ممكن.
              </p>

              <ul style={{
                listStyle: 'none',
                marginBottom: '30px',
                padding: 0
              }}>
                <li style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  <i className="fas fa-map-marker-alt" style={{
                    fontSize: '1.5rem',
                    color: 'white',
                    opacity: '0.9'
                  }}></i>
                  <span style={{ lineHeight: '1.6' }}>
                    <strong>الإمارات العربية المتحدة</strong><br />
                    مكتب ٥٠١، الطابق الخامس، مكاتب ٢، مجمع الأعمال، مدينة دبي للإنتاج، دبي، الإمارات العربية المتحدة
                  </span>
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  <i className="fas fa-map-marker-alt" style={{
                    fontSize: '1.5rem',
                    color: 'white',
                    opacity: '0.9'
                  }}></i>
                  <span style={{ lineHeight: '1.6' }}>
                    <strong>مصر</strong><br />
                    الطابق الأرضي، القاهرة الجديدة، شارع التسعين، البنفسج، الحي الأول، القاهرة، مصر
                  </span>
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  <i className="fas fa-map-marker-alt" style={{
                    fontSize: '1.5rem',
                    color: 'white',
                    opacity: '0.9'
                  }}></i>
                  <span style={{ lineHeight: '1.6' }}>
                    <strong>البحرين</strong><br />
                    مبنى ١٠٩٥، طريق ١٤٢٥، مجمع ١٠١٤، ص.ب. ١٤، الهملة، البحرين
                  </span>
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  <i className="fas fa-map-marker-alt" style={{
                    fontSize: '1.5rem',
                    color: 'white',
                    opacity: '0.9'
                  }}></i>
                  <span style={{ lineHeight: '1.6' }}>
                    <strong>المملكة العربية السعودية</strong><br />
                    مبنى ٧٠٨٤، طريق الملك فهد، الرياض، المملكة العربية السعودية
                  </span>
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  <i className="fas fa-phone-alt" style={{
                    fontSize: '1.5rem',
                    color: 'white',
                    opacity: '0.9'
                  }}></i>
                  <span style={{ lineHeight: '1.6' }} dir="ltr">+971 4 123 4567</span>
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  <i className="fas fa-envelope" style={{
                    fontSize: '1.5rem',
                    color: 'white',
                    opacity: '0.9'
                  }}></i>
                  <span style={{ lineHeight: '1.6' }}>info@corporatestack.com</span>
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  <i className="fas fa-clock" style={{
                    fontSize: '1.5rem',
                    color: 'white',
                    opacity: '0.9'
                  }}></i>
                  <span style={{ lineHeight: '1.6' }}>ساعات العمل: الأحد - الخميس، 9:00 صباحاً - 5:00 مساءً</span>
                </li>
              </ul>

              <div style={{
                display: 'flex',
                gap: '15px'
              }}>
                <a href="#" style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}>
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}>
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}>
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}>
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div style={{
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '10px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '30px',
                color: 'var(--secondary-color)',
                position: 'relative',
                paddingBottom: '15px'
              }}>
                <i className="fas fa-paper-plane"></i> أرسل <span style={{ color: 'var(--primary-color)', fontWeight: '700' }}>رسالة</span>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '50px',
                  height: '3px',
                  backgroundColor: 'var(--primary-color)',
                  borderRadius: '3px'
                }}></div>
              </h2>

              <form onSubmit={handleSubmit} style={{ marginBottom: 0 }}>
                {submitError && (
                  <div style={{
                    backgroundColor: '#fee2e2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    fontSize: '0.9rem'
                  }}>
                    <i className="fas fa-exclamation-triangle" style={{ marginLeft: '8px' }}></i>
                    {submitError}
                  </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="name" style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: 'var(--secondary-color)'
                  }}>الاسم الكامل</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="أدخل اسمك الكامل"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontFamily: 'Tajawal, sans-serif',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="company" style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: 'var(--secondary-color)'
                  }}>اسم الشركة/المؤسسة</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="أدخل اسم الشركة أو المؤسسة"
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontFamily: 'Tajawal, sans-serif',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="email" style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: 'var(--secondary-color)'
                  }}>البريد الإلكتروني</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="أدخل بريدك الإلكتروني"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontFamily: 'Tajawal, sans-serif',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="phone" style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: 'var(--secondary-color)'
                  }}>رقم الجوال</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="أدخل رقم جوالك"
                    dir="ltr"
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontFamily: 'Tajawal, sans-serif',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="subject" style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: 'var(--secondary-color)'
                  }}>الموضوع</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="أدخل موضوع الرسالة"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontFamily: 'Tajawal, sans-serif',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="message" style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: 'var(--secondary-color)'
                  }}>الرسالة</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="اكتب رسالتك هنا..."
                    required
                    style={{
                      width: '100%',
                      height: '150px',
                      padding: '12px 15px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontFamily: 'Tajawal, sans-serif',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: 'var(--secondary-color)'
                  }}>
                    <input
                      type="checkbox"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: 'var(--primary-color)'
                      }}
                    />
                    <span>
                      أوافق على <a href="#" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>الشروط والأحكام</a> و <a href="#" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>سياسة الخصوصية</a>
                    </span>
                  </label>
                  {errors.terms && (
                    <div style={{
                      color: '#dc2626',
                      fontSize: '0.8rem',
                      marginTop: '5px'
                    }}>
                      {errors.terms}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '15px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isSubmitting ? '#94a3b8' : 'var(--primary-color)',
                    color: 'white',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin" style={{ marginLeft: '8px' }}></i>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane" style={{ marginLeft: '8px' }}></i>
                      إرسال الرسالة
                    </>
                  )}
                </button>
              </form>
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

      {/* Success Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="close-modal" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </div>
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3>شكراً لك!</h3>
              <p>تم استلام رسالتك بنجاح</p>
            </div>

            <div className="modal-body">
              <div className="request-number">
                <p>رقم الرسالة</p>
                <div className="number">#{requestNumber}</div>
              </div>
              <p className="modal-message">
                لقد استلمنا رسالتك وسيقوم فريقنا بمراجعتها والرد عليك خلال 24 ساعة.
              </p>
              <div className="email-notice">
                <i className="fas fa-envelope"></i>
                سيتم إرسال رد تلقائي إلى بريدك الإلكتروني
              </div>
              <div className="response-time" style={{
                backgroundColor: '#e3f2fd',
                border: '1px solid #2196f3',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '15px',
                textAlign: 'center',
                color: '#1976d2'
              }}>
                <i className="fas fa-clock" style={{ marginLeft: '8px' }}></i>
                <strong>وقت الاستجابة المتوقع: خلال 24 ساعة</strong>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setShowModal(false)}>
                حسناً
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


