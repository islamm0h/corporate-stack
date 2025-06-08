'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRequestNumber } from '../../../hooks/useClientOnly'

export default function CRMSystemDetails() {
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
    company?: string;
    email?: string;
    phone?: string;
    employees?: string;
    terms?: string;
  }>({})
  const [showModal, setShowModal] = useState(false)
  const { requestNumber, generateRequestNumber } = useRequestNumber()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [systemFiles, setSystemFiles] = useState<any[]>([])
  const [loadingFiles, setLoadingFiles] = useState(true)

  // جلب ملفات النظام
  useEffect(() => {
    const fetchSystemFiles = async () => {
      try {
        const response = await fetch('/api/systems/crm-system/files')
        const result = await response.json()

        if (result.success) {
          setSystemFiles(result.data)
        }
      } catch (error) {
        console.error('Error fetching system files:', error)
      } finally {
        setLoadingFiles(false)
      }
    }

    fetchSystemFiles()
  }, [])

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
          systemType: 'نظام إدارة العملاء (CRM)',
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
    'إدارة بيانات العملاء بشكل متكامل',
    'متابعة تاريخ التعاملات مع العملاء',
    'إدارة الحملات التسويقية',
    'تحليل سلوك العملاء وتقديم توصيات'
  ]

  const relatedSystems = [
    {
      id: 1,
      name: 'نظام الحسابات والفاتورة الإلكترونية',
      description: 'نظام متكامل لإدارة الحسابات والفواتير الإلكترونية بكفاءة عالية.',
      icon: 'fas fa-file-invoice-dollar'
    },
    {
      id: 4,
      name: 'نظام إدارة الأصول',
      description: 'نظام متكامل لإدارة الأصول والممتلكات وتتبع حالتها وصيانتها.',
      icon: 'fas fa-boxes'
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
            <i className="fas fa-users system-details-icon"></i>
            <div>
              <h1 className="system-details-title">نظام إدارة العملاء</h1>
              <p className="system-details-description">
                نظام متكامل لإدارة بيانات العملاء والتواصل معهم بفعالية.
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
                  نظام إدارة العملاء هو حل متكامل يساعد الشركات على إدارة علاقاتها مع العملاء بكفاءة عالية. يوفر النظام أدوات شاملة لتتبع بيانات العملاء وتاريخ التعاملات والفرص التجارية.
                </p>
                <p style={{ lineHeight: '1.8', color: 'var(--gray-color)', marginBottom: '20px' }}>
                  يتميز النظام بواجهة سهلة الاستخدام تمكن فرق المبيعات والتسويق من إدارة العملاء المحتملين والحاليين بفعالية. كما يوفر تقارير تحليلية متقدمة تساعد في فهم سلوك العملاء واتخاذ قرارات تجارية مدروسة.
                </p>
                <p style={{ lineHeight: '1.8', color: 'var(--gray-color)' }}>
                  يدعم النظام إدارة الحملات التسويقية وتتبع نتائجها، بالإضافة إلى إمكانية التكامل مع قنوات التواصل المختلفة مثل البريد الإلكتروني ووسائل التواصل الاجتماعي.
                </p>
              </div>

              {/* قسم الملفات والوسائط */}
              <SystemFilesSection files={systemFiles} loading={loadingFiles} />
            </div>

            <div className="system-sidebar">
              {/* Quote Form */}
              <div className="sidebar-card quote-card">
                <div className="quote-header">
                  <h3 className="sidebar-title">
                    <i className="fas fa-users"></i>
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
                      متطلبات إضافية
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="أدخل أي متطلبات أو استفسارات إضافية"
                    />
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

                  <button type="submit" className="btn btn-primary submit-btn">
                    <i className="fas fa-paper-plane"></i>
                    طلب عرض سعر
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
                    <Link key={system.id} href={system.id === 1 ? '/systems/accounting' : system.id === 4 ? '/systems/assets' : `/systems/${system.id}`} className="related-system">
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

// مكون عرض ملفات النظام
function SystemFilesSection({ files, loading }: { files: any[], loading: boolean }) {
  if (loading) {
    return (
      <div style={{ marginTop: '40px', textAlign: 'center', padding: '20px' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary-color)' }}></i>
        <p style={{ marginTop: '10px', color: 'var(--gray-color)' }}>جاري تحميل الملفات...</p>
      </div>
    )
  }

  if (!files || files.length === 0) {
    return null
  }

  const videoFiles = files.filter(f => f.fileType === 'video')
  const imageFiles = files.filter(f => f.fileType === 'image')
  const pdfFiles = files.filter(f => f.fileType === 'pdf')

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div style={{ marginTop: '40px' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '25px', color: 'var(--secondary-color)' }}>
        <i className="fas fa-folder-open" style={{ marginLeft: '10px' }}></i>
        ملفات ووسائط النظام
      </h3>

      {/* الفيديوهات */}
      {videoFiles.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{
            fontSize: '1.2rem',
            marginBottom: '15px',
            color: 'var(--secondary-color)',
            borderBottom: '2px solid var(--primary-color)',
            paddingBottom: '8px',
            display: 'inline-block'
          }}>
            <i className="fas fa-video" style={{ marginLeft: '8px' }}></i>
            فيديوهات توضيحية ({videoFiles.length})
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {videoFiles.map((file: any) => (
              <div key={file.id} style={{
                border: '1px solid #ddd',
                borderRadius: '12px',
                padding: '15px',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ marginBottom: '10px' }}>
                  <h5 style={{
                    margin: '0 0 5px 0',
                    fontSize: '1rem',
                    color: 'var(--secondary-color)'
                  }}>
                    {file.originalName}
                  </h5>
                  <p style={{
                    margin: 0,
                    fontSize: '0.8rem',
                    color: 'var(--gray-color)'
                  }}>
                    {formatFileSize(file.fileSize)}
                  </p>
                </div>
                {file.filePath && (
                  <video
                    controls
                    style={{
                      width: '100%',
                      height: '200px',
                      borderRadius: '8px',
                      backgroundColor: '#f5f5f5'
                    }}
                  >
                    <source src={file.filePath} type={file.mimeType} />
                    متصفحك لا يدعم عرض الفيديو
                  </video>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* الصور */}
      {imageFiles.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{
            fontSize: '1.2rem',
            marginBottom: '15px',
            color: 'var(--secondary-color)',
            borderBottom: '2px solid var(--success-color)',
            paddingBottom: '8px',
            display: 'inline-block'
          }}>
            <i className="fas fa-image" style={{ marginLeft: '8px' }}></i>
            صور النظام ({imageFiles.length})
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            {imageFiles.map((file: any) => (
              <div key={file.id} style={{
                border: '1px solid #ddd',
                borderRadius: '12px',
                padding: '10px',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                {file.filePath && (
                  <img
                    src={file.filePath}
                    alt={file.originalName}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '8px'
                    }}
                  />
                )}
                <div style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '3px' }}>
                  {file.originalName}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>
                  {formatFileSize(file.fileSize)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ملفات PDF */}
      {pdfFiles.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{
            fontSize: '1.2rem',
            marginBottom: '15px',
            color: 'var(--secondary-color)',
            borderBottom: '2px solid var(--danger-color)',
            paddingBottom: '8px',
            display: 'inline-block'
          }}>
            <i className="fas fa-file-pdf" style={{ marginLeft: '8px' }}></i>
            ملفات PDF ({pdfFiles.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {pdfFiles.map((file: any) => (
              <div key={file.id} style={{
                border: '1px solid #ddd',
                borderRadius: '12px',
                padding: '20px',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <i className="fas fa-file-pdf" style={{
                  color: 'var(--danger-color)',
                  fontSize: '2.5rem'
                }}></i>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', marginBottom: '5px', fontSize: '1.1rem' }}>
                    {file.originalName}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                    {formatFileSize(file.fileSize)} • {new Date(file.createdAt).toLocaleDateString('ar-SA')}
                  </div>
                </div>
                {file.filePath && (
                  <a
                    href={file.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '12px 20px',
                      border: '2px solid var(--primary-color)',
                      borderRadius: '8px',
                      color: 'var(--primary-color)',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--primary-color)'
                      e.currentTarget.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = 'var(--primary-color)'
                    }}
                  >
                    <i className="fas fa-external-link-alt" style={{ marginLeft: '8px' }}></i>
                    فتح الملف
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
