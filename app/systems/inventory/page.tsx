'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRequestNumber } from '../../../hooks/useClientOnly'

export default function InventorySystemDetails() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    employees: '',
    message: '',
    terms: false
  })

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    employees?: string;
    message?: string;
    terms?: string;
  }>({})
  const [showModal, setShowModal] = useState(false)
  const { requestNumber, generateRequestNumber } = useRequestNumber()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

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

    if (!formData.company.trim() || formData.company.trim().length < 2) {
      newErrors.company = 'يرجى إدخال اسم الشركة أو المؤسسة'
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(formData.email.trim())) {
      newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح'
    }

    const phonePattern = /^(05|5|\+9665)[0-9]{8}$/
    if (!phonePattern.test(formData.phone.trim().replace(/\s/g, ''))) {
      newErrors.phone = 'يرجى إدخال رقم جوال صحيح'
    }

    if (!formData.employees) {
      newErrors.employees = 'يرجى اختيار عدد الموظفين'
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'يرجى إدخال رسالة تحتوي على 10 أحرف على الأقل'
    }

    if (!formData.terms) {
      newErrors.terms = 'يجب الموافقة على الشروط والأحكام'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/quote-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          systemType: 'نظام إدارة المخزون',
          budgetRange: 'غير محدد',
          timeline: 'غير محدد'
        })
      })

      const result = await response.json()

      if (result.success) {
        generateRequestNumber()
        setShowModal(true)

        // إعادة تعيين النموذج
        setFormData({
          name: '',
          company: '',
          email: '',
          phone: '',
          employees: '',
          message: '',
          terms: false
        })
        setErrors({})
      } else {
        setSubmitError(result.error || 'حدث خطأ في إرسال الطلب')
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

  const systemFeatures = [
    'إدارة المخزون والمستودعات بكفاءة',
    'تتبع المنتجات والكميات في الوقت الفعلي',
    'إدارة عمليات الشراء والبيع والتوريد',
    'تقارير شاملة عن حركة المخزون والجرد'
  ]

  const relatedSystems = [
    {
      id: 1,
      name: 'نظام الحسابات والفاتورة الإلكترونية',
      description: 'نظام متكامل لإدارة الحسابات والفواتير الإلكترونية بكفاءة عالية.',
      icon: 'fas fa-file-invoice-dollar'
    },
    {
      id: 2,
      name: 'نظام إدارة العملاء',
      description: 'نظام متكامل لإدارة بيانات العملاء والتواصل معهم بفعالية.',
      icon: 'fas fa-users'
    }
  ]

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="container header-container">
          <div className="logo">
            <div className="logo-text">كوربريت ستاك</div>
          </div>
          <nav className="nav-menu">
            <Link href="/" className="nav-link">الرئيسية</Link>
            <Link href="/about" className="nav-link">من نحن</Link>
            <Link href="/systems" className="nav-link">الأنظمة</Link>
            <Link href="/contact" className="nav-link">تواصل معنا</Link>
          </nav>
          <div className="header-actions">
            {/* تم إلغاء زر لوحة التحكم */}
          </div>
        </div>
      </header>

      {/* System Header */}
      <section className="system-header">
        <div className="container">
          <div className="system-header-content">
            <i className="fas fa-warehouse system-details-icon"></i>
            <div>
              <h1 className="system-details-title">نظام إدارة المخزون</h1>
              <p className="system-details-description">
                نظام متكامل لإدارة المخزون والمستودعات وتتبع المنتجات والجرد وسلاسل التوريد.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* System Details Section */}
      <section className="system-details-section">
        <div className="container">
          <div className="system-details-container">
            <div className="system-features">
              <h2 className="system-features-title">مميزات النظام</h2>
              <ul className="system-features-list">
                {systemFeatures.map((feature, index) => (
                  <li key={index}>
                    <i className="fas fa-check-circle"></i>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: '40px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--secondary-color)' }}>وصف النظام</h3>
                <p style={{ lineHeight: '1.8', color: 'var(--gray-color)', marginBottom: '20px' }}>
                  نظام إدارة المخزون هو حل شامل ومتطور يساعد الشركات والمؤسسات على إدارة مخزونها ومستودعاتها بكفاءة عالية. يوفر النظام أدوات متقدمة لتتبع المنتجات والكميات في الوقت الفعلي، مما يضمن الحفاظ على مستويات مخزون مثلى وتجنب نفاد المخزون أو الإفراط في التخزين.
                </p>
                <p style={{ lineHeight: '1.8', color: 'var(--gray-color)', marginBottom: '20px' }}>
                  يتميز النظام بواجهة سهلة الاستخدام تمكن مديري المخازن من متابعة جميع عمليات الشراء والبيع والتوريد في مكان واحد. كما يوفر نظام إنذار متقدم ينبه عند وصول المنتجات إلى الحد الأدنى للمخزون، بالإضافة إلى إمكانية إدارة عدة مستودعات وتتبع حركة البضائع بينها.
                </p>
                <p style={{ lineHeight: '1.8', color: 'var(--gray-color)' }}>
                  يدعم النظام إدارة سلاسل التوريد والموردين، مع إمكانية تتبع تواريخ انتهاء الصلاحية للمنتجات وإدارة الدفعات والأرقام التسلسلية. كما يوفر تقارير تفصيلية عن حركة المخزون والجرد وتحليل الأداء، مما يساعد في اتخاذ قرارات مدروسة لتحسين كفاءة إدارة المخزون وتقليل التكاليف.
                </p>
              </div>


            </div>

            <div className="system-sidebar">
              {/* Quote Form */}
              <div className="sidebar-card quote-card">
                <div className="quote-header">
                  <h3 className="sidebar-title">
                    <i className="fas fa-warehouse"></i>
                    طلب عرض سعر
                  </h3>
                  <p>احصل على عرض سعر مخصص لاحتياجات عملك</p>
                </div>

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name">
                      <i className="fas fa-user"></i>
                      الاسم الكامل <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="أدخل اسمك الكامل"
                      className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <small className="error-message">{errors.name}</small>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="company">
                      <i className="fas fa-building"></i>
                      اسم الشركة أو المؤسسة <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="أدخل اسم الشركة أو المؤسسة"
                      className={errors.company ? 'error' : ''}
                    />
                    {errors.company && <small className="error-message">{errors.company}</small>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">
                        <i className="fas fa-envelope"></i>
                        البريد الإلكتروني <span className="required">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="أدخل بريدك الإلكتروني"
                        className={errors.email ? 'error' : ''}
                      />
                      {errors.email && <small className="error-message">{errors.email}</small>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">
                        <i className="fas fa-phone"></i>
                        رقم الجوال <span className="required">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="أدخل رقم جوالك"
                        className={errors.phone ? 'error' : ''}
                      />
                      {errors.phone && <small className="error-message">{errors.phone}</small>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="employees">
                      <i className="fas fa-users"></i>
                      عدد الموظفين <span className="required">*</span>
                    </label>
                    <select
                      id="employees"
                      name="employees"
                      value={formData.employees}
                      onChange={handleInputChange}
                      className={errors.employees ? 'error' : ''}
                    >
                      <option value="">اختر عدد الموظفين</option>
                      <option value="1-10">1-10 موظفين</option>
                      <option value="11-50">11-50 موظف</option>
                      <option value="51-200">51-200 موظف</option>
                      <option value="201-500">201-500 موظف</option>
                      <option value="500+">أكثر من 500 موظف</option>
                    </select>
                    {errors.employees && <small className="error-message">{errors.employees}</small>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">
                      <i className="fas fa-message"></i>
                      متطلبات إضافية <span className="required">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="أدخل أي متطلبات أو استفسارات إضافية"
                      className={errors.message ? 'error' : ''}
                    />
                    {errors.message && <small className="error-message">{errors.message}</small>}
                  </div>

                  <div className="form-group checkbox-group">
                    <div className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        id="terms"
                        name="terms"
                        checked={formData.terms}
                        onChange={handleInputChange}
                        className={errors.terms ? 'error' : ''}
                      />
                      <label htmlFor="terms">
                        أوافق على <a href="#">شروط الخدمة</a> وسياسة الخصوصية <span className="required">*</span>
                      </label>
                    </div>
                    {errors.terms && <small className="error-message">{errors.terms}</small>}
                  </div>

                  {submitError && (
                    <div className="error-message" style={{ marginBottom: '15px', textAlign: 'center' }}>
                      {submitError}
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary submit-btn" disabled={isSubmitting}>
                    <i className={isSubmitting ? "fas fa-spinner fa-spin" : "fas fa-paper-plane"}></i>
                    {isSubmitting ? 'جاري الإرسال...' : 'طلب عرض سعر'}
                  </button>

                  <p className="form-note">
                    سيتم الرد عليك خلال 24 ساعة عمل
                  </p>
                </form>
              </div>

              {/* Related Systems */}
              <div className="sidebar-card">
                <h3 className="sidebar-title">أنظمة ذات صلة</h3>
                <div className="related-systems">
                  {relatedSystems.map((system) => (
                    <Link key={system.id} href={system.id === 1 ? '/systems/accounting' : system.id === 2 ? '/systems/crm' : `/systems/${system.id}`} className="related-system">
                      <div className="related-system-icon">
                        <i className={system.icon}></i>
                      </div>
                      <div className="related-system-info">
                        <div className="related-system-title">{system.name}</div>
                        <div className="related-system-description">{system.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
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
              <p>تم استلام طلبك بنجاح</p>
            </div>

            <div className="modal-body">
              <div className="request-number">
                <p>رقم الطلب</p>
                <div className="number">#{requestNumber}</div>
              </div>
              <p className="modal-message">
                لقد استلمنا طلبك وسيقوم فريقنا بمراجعته والرد عليك في أقرب وقت ممكن.
              </p>
              <div className="email-notice">
                <i className="fas fa-envelope"></i>
                سيتم إرسال تفاصيل الطلب إلى بريدك الإلكتروني
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
