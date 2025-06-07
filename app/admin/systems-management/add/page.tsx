'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddSystemPage() {
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // معلومات أساسية
    name: '',
    description: '',
    category: '',
    status: 'active',
    features: [''],

    // معلومات SEO
    seo: {
      title: '',
      description: '',
      keywords: [''],
      metaDescription: '',
      slug: '',
      focusKeyword: ''
    },

    // ملفات النظام
    files: []
  })

  const [errors, setErrors] = useState<{
    name?: string;
    category?: string;
    description?: string;
    features?: string;
    seoTitle?: string;
    seoDescription?: string;
  }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false)

  const steps = [
    { id: 1, title: 'المعلومات الأساسية', icon: 'fas fa-info-circle' },
    { id: 2, title: 'المميزات والوصف', icon: 'fas fa-list-ul' },
    { id: 3, title: 'تحسين محركات البحث', icon: 'fas fa-search' },
    { id: 4, title: 'الملفات والمرفقات', icon: 'fas fa-file-upload' },
    { id: 5, title: 'المراجعة والحفظ', icon: 'fas fa-check-circle' }
  ]

  // دالة حساب النسبة المئوية للكلمات المفتاحية
  const calculateKeywordDensity = (text: string, keyword: string): string => {
    if (!text || !keyword) return '0.0'
    const words = text.toLowerCase().split(/\s+/)
    const keywordWords = keyword.toLowerCase().split(/\s+/)
    let matches = 0

    for (let i = 0; i <= words.length - keywordWords.length; i++) {
      let match = true
      for (let j = 0; j < keywordWords.length; j++) {
        if (words[i + j] !== keywordWords[j]) {
          match = false
          break
        }
      }
      if (match) matches++
    }

    return words.length > 0 ? ((matches / words.length) * 100).toFixed(1) : '0.0'
  }

  // دالة تحليل SEO
  const analyzeSEO = () => {
    const issues = []
    let score = 0

    // فحص العنوان
    if (!formData.seo.title) {
      issues.push('العنوان مفقود')
    } else {
      if (formData.seo.title.length < 30) issues.push('العنوان قصير جداً (أقل من 30 حرف)')
      if (formData.seo.title.length > 60) issues.push('العنوان طويل جداً (أكثر من 60 حرف)')
      else score += 20
    }

    // فحص الوصف
    if (!formData.seo.description) {
      issues.push('الوصف مفقود')
    } else {
      if (formData.seo.description.length < 120) issues.push('الوصف قصير جداً (أقل من 120 حرف)')
      if (formData.seo.description.length > 160) issues.push('الوصف طويل جداً (أكثر من 160 حرف)')
      else score += 20
    }

    // فحص الكلمة المفتاحية الرئيسية
    if (!formData.seo.focusKeyword) {
      issues.push('الكلمة المفتاحية الرئيسية مفقودة')
    } else {
      score += 20

      // فحص كثافة الكلمة المفتاحية في العنوان
      const titleDensity = calculateKeywordDensity(formData.seo.title, formData.seo.focusKeyword)
      if (titleDensity === '0.0') issues.push('الكلمة المفتاحية غير موجودة في العنوان')
      else score += 10

      // فحص كثافة الكلمة المفتاحية في الوصف
      const descDensity = calculateKeywordDensity(formData.seo.description, formData.seo.focusKeyword)
      if (descDensity === '0.0') issues.push('الكلمة المفتاحية غير موجودة في الوصف')
      else score += 10
    }

    // فحص الكلمات المفتاحية
    const validKeywords = formData.seo.keywords.filter(k => k.trim() !== '')
    if (validKeywords.length === 0) {
      issues.push('الكلمات المفتاحية مفقودة')
    } else {
      if (validKeywords.length < 3) issues.push('عدد قليل من الكلمات المفتاحية (أقل من 3)')
      if (validKeywords.length > 10) issues.push('عدد كبير من الكلمات المفتاحية (أكثر من 10)')
      else score += 10
    }

    // فحص الرابط
    if (!formData.seo.slug) {
      issues.push('الرابط مفقود')
    } else {
      if (formData.seo.slug.includes(' ')) issues.push('الرابط يحتوي على مسافات')
      else score += 10
    }

    return { score, issues }
  }

  const validateStep = (step: number) => {
    const newErrors: any = {}

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'اسم النظام مطلوب'
        if (!formData.category) newErrors.category = 'الفئة مطلوبة'
        break
      case 2:
        if (!formData.description.trim()) newErrors.description = 'الوصف مطلوب'
        if (formData.features.filter(f => f.trim()).length === 0) newErrors.features = 'يجب إضافة ميزة واحدة على الأقل'
        break
      case 3:
        if (!formData.seo.title.trim()) newErrors.seoTitle = 'عنوان SEO مطلوب'
        if (!formData.seo.description.trim()) newErrors.seoDescription = 'وصف SEO مطلوب'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)

    // محاكاة حفظ البيانات
    setTimeout(() => {
      setIsSubmitting(false)
      router.push('/admin/systems-management')
    }, 2000)
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateSEOData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: value
      }
    }))
  }

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }))
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }))
  }

  const addKeyword = () => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: [...prev.seo.keywords, '']
      }
    }))
  }

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: prev.seo.keywords.filter((_, i) => i !== index)
      }
    }))
  }

  const updateKeyword = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: prev.seo.keywords.map((keyword, i) => i === index ? value : keyword)
      }
    }))
  }

  // دالة توليد الكلمات المفتاحية بالذكاء الاصطناعي
  const generateKeywordsWithAI = async () => {
    if (!formData.name || !formData.description || !formData.category) {
      alert('يرجى ملء اسم النظام والوصف والفئة أولاً لتوليد كلمات مفتاحية مناسبة')
      return
    }

    setIsGeneratingKeywords(true)

    try {
      // محاكاة استدعاء API للذكاء الاصطناعي
      await new Promise(resolve => setTimeout(resolve, 2000))

      // توليد كلمات مفتاحية ذكية بناءً على البيانات المدخلة
      const aiGeneratedKeywords = generateSmartKeywords(
        formData.name,
        formData.description,
        formData.category
      )

      // إضافة الكلمات المفتاحية المولدة
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          keywords: [...prev.seo.keywords.filter(k => k.trim() !== ''), ...aiGeneratedKeywords]
        }
      }))

      alert(`تم توليد ${aiGeneratedKeywords.length} كلمة مفتاحية بنجاح!`)
    } catch (error) {
      console.error('Error generating keywords:', error)
      alert('حدث خطأ أثناء توليد الكلمات المفتاحية')
    } finally {
      setIsGeneratingKeywords(false)
    }
  }

  // دالة توليد كلمات مفتاحية ذكية
  const generateSmartKeywords = (name: string, description: string, category: string) => {
    const keywords = []

    // كلمات أساسية من اسم النظام
    const nameWords = name.split(' ').filter(word => word.length > 2)
    keywords.push(...nameWords)

    // كلمات من الفئة
    const categoryKeywords = {
      'مالي': ['محاسبة', 'فواتير إلكترونية', 'مالية', 'ضرائب', 'مدفوعات', 'تقارير مالية', 'هيئة الزكاة', 'قيود محاسبية'],
      'مبيعات': ['مبيعات', 'عملاء', 'فرص تجارية', 'تسويق', 'متابعة العملاء', 'إدارة علاقات', 'CRM', 'خط المبيعات'],
      'موارد بشرية': ['موظفين', 'رواتب', 'حضور وانصراف', 'تقييم أداء', 'إجازات', 'تدريب', 'موارد بشرية', 'شؤون الموظفين'],
      'مخزون': ['مخزون', 'مستودعات', 'جرد', 'مواد', 'توريد', 'باركود', 'إدارة المخزون', 'تتبع المواد'],
      'إدارة': ['مشاريع', 'مهام', 'تخطيط', 'متابعة', 'تقارير', 'إدارة المشاريع', 'تنظيم العمل', 'إدارة الوقت'],
      'تقني': ['برمجة', 'تطوير', 'تقنية', 'نظام', 'تطبيق', 'حلول تقنية', 'برمجيات', 'تطوير الأنظمة']
    }

    if (categoryKeywords[category]) {
      keywords.push(...categoryKeywords[category].slice(0, 4))
    }

    // كلمات عامة للأنظمة
    const systemKeywords = ['نظام', 'برنامج', 'تطبيق', 'حل', 'إدارة', 'تقنية']
    keywords.push(...systemKeywords.slice(0, 3))

    // كلمات من الوصف (استخراج الكلمات المهمة)
    const descriptionWords = description
      .split(' ')
      .filter(word => word.length > 3 && !['هذا', 'ذلك', 'التي', 'الذي', 'يمكن', 'سوف'].includes(word))
      .slice(0, 3)
    keywords.push(...descriptionWords)

    // إزالة التكرارات وتنظيف الكلمات
    const uniqueKeywords = [...new Set(keywords)]
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 1)
      .slice(0, 8) // حد أقصى 8 كلمات

    return uniqueKeywords
  }

  const handleFileUpload = (files: FileList) => {
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
      type: file.type.includes('pdf') ? 'pdf' :
            file.type.includes('presentation') ? 'presentation' :
            file.type.includes('image') ? 'images' :
            file.type.includes('video') ? 'video' : 'document',
      uploadDate: new Date().toISOString().split('T')[0],
      file: file
    }))

    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }))
  }

  const removeFile = (id: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== id)
    }))
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return 'fas fa-file-pdf'
      case 'presentation': return 'fas fa-file-powerpoint'
      case 'images': return 'fas fa-file-image'
      case 'video': return 'fas fa-file-video'
      case 'document': return 'fas fa-file-word'
      default: return 'fas fa-file'
    }
  }

  const getFileColor = (type: string) => {
    switch (type) {
      case 'pdf': return '#dc3545'
      case 'presentation': return '#fd7e14'
      case 'images': return '#20c997'
      case 'video': return '#6f42c1'
      case 'document': return '#0d6efd'
      default: return '#6c757d'
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* رأس الصفحة */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '40px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px'
          }}>
            <button
              onClick={() => router.back()}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                padding: '10px 15px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
              }}
            >
              <i className="fas fa-arrow-right"></i> العودة
            </button>
          </div>

          <div style={{
            width: '80px',
            height: '80px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '2rem'
          }}>
            <i className="fas fa-plus"></i>
          </div>

          <h1 style={{
            margin: '0 0 10px 0',
            fontSize: '2.5rem',
            fontWeight: '700'
          }}>
            إضافة نظام جديد
          </h1>
          <p style={{
            margin: 0,
            fontSize: '1.1rem',
            opacity: 0.9
          }}>
            أضف نظاماً جديداً إلى كتالوج الأنظمة مع تحسين محركات البحث
          </p>
        </div>

        {/* شريط التقدم */}
        <div style={{
          padding: '30px 40px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative'
          }}>
            {/* خط التقدم */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '10%',
              right: '10%',
              height: '4px',
              background: '#e2e8f0',
              borderRadius: '2px',
              zIndex: 1
            }}>
              <div style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #667eea, #764ba2)',
                borderRadius: '2px',
                transition: 'width 0.5s ease'
              }}></div>
            </div>

            {steps.map((step, index) => (
              <div key={step.id} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 2,
                background: 'white',
                padding: '10px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: currentStep >= step.id ?
                    'linear-gradient(135deg, #667eea, #764ba2)' : '#e2e8f0',
                  color: currentStep >= step.id ? 'white' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s ease',
                  marginBottom: '10px'
                }}>
                  <i className={step.icon}></i>
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: currentStep >= step.id ? 'var(--secondary-color)' : '#94a3b8',
                  textAlign: 'center',
                  maxWidth: '120px'
                }}>
                  {step.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* محتوى الخطوات */}
        <div style={{ padding: '40px' }}>
          {/* الخطوة 1: المعلومات الأساسية */}
          {currentStep === 1 && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <div style={{
                textAlign: 'center',
                marginBottom: '40px'
              }}>
                <h2 style={{
                  margin: '0 0 10px 0',
                  color: 'var(--secondary-color)',
                  fontSize: '1.8rem'
                }}>
                  المعلومات الأساسية
                </h2>
                <p style={{
                  margin: 0,
                  color: 'var(--gray-color)',
                  fontSize: '1rem'
                }}>
                  أدخل المعلومات الأساسية للنظام الجديد
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '30px',
                maxWidth: '800px',
                margin: '0 auto'
              }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: '600',
                    color: 'var(--secondary-color)',
                    fontSize: '1rem'
                  }}>
                    اسم النظام *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      updateFormData('name', e.target.value)
                      // تحديث slug تلقائياً
                      updateSEOData('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, ''))
                    }}
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      border: errors.name ? '2px solid var(--danger-color)' : '2px solid var(--border-color)',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      background: '#f8fafc'
                    }}
                    placeholder="أدخل اسم النظام"
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary-color)'
                      e.target.style.background = 'white'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.name ? 'var(--danger-color)' : 'var(--border-color)'
                      e.target.style.background = '#f8fafc'
                    }}
                  />
                  {errors.name && (
                    <div style={{
                      color: 'var(--danger-color)',
                      fontSize: '0.9rem',
                      marginTop: '5px'
                    }}>
                      {errors.name}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: '600',
                    color: 'var(--secondary-color)',
                    fontSize: '1rem'
                  }}>
                    الفئة *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateFormData('category', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      border: errors.category ? '2px solid var(--danger-color)' : '2px solid var(--border-color)',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      background: '#f8fafc',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary-color)'
                      e.target.style.background = 'white'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.category ? 'var(--danger-color)' : 'var(--border-color)'
                      e.target.style.background = '#f8fafc'
                    }}
                  >
                    <option value="">اختر الفئة</option>
                    <option value="مالي">مالي</option>
                    <option value="مبيعات">مبيعات</option>
                    <option value="موارد بشرية">موارد بشرية</option>
                    <option value="مخزون">مخزون</option>
                    <option value="إدارة">إدارة</option>
                    <option value="تقني">تقني</option>
                    <option value="تسويق">تسويق</option>
                    <option value="خدمة عملاء">خدمة عملاء</option>
                  </select>
                  {errors.category && (
                    <div style={{
                      color: 'var(--danger-color)',
                      fontSize: '0.9rem',
                      marginTop: '5px'
                    }}>
                      {errors.category}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: '600',
                    color: 'var(--secondary-color)',
                    fontSize: '1rem'
                  }}>
                    حالة النظام
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => updateFormData('status', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      background: '#f8fafc',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary-color)'
                      e.target.style.background = 'white'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border-color)'
                      e.target.style.background = '#f8fafc'
                    }}
                  >
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                    <option value="maintenance">صيانة</option>
                    <option value="development">تطوير</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* الخطوة 2: المميزات والوصف */}
          {currentStep === 2 && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <div style={{
                textAlign: 'center',
                marginBottom: '40px'
              }}>
                <h2 style={{
                  margin: '0 0 10px 0',
                  color: 'var(--secondary-color)',
                  fontSize: '1.8rem'
                }}>
                  المميزات والوصف
                </h2>
                <p style={{
                  margin: 0,
                  color: 'var(--gray-color)',
                  fontSize: '1rem'
                }}>
                  أضف وصفاً مفصلاً ومميزات النظام
                </p>
              </div>

              <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                display: 'grid',
                gap: '30px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: '600',
                    color: 'var(--secondary-color)',
                    fontSize: '1rem'
                  }}>
                    وصف النظام *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    rows={5}
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      border: errors.description ? '2px solid var(--danger-color)' : '2px solid var(--border-color)',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      background: '#f8fafc',
                      resize: 'vertical',
                      transition: 'all 0.3s ease',
                      lineHeight: '1.6'
                    }}
                    placeholder="أدخل وصفاً مفصلاً للنظام وفوائده..."
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary-color)'
                      e.target.style.background = 'white'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.description ? 'var(--danger-color)' : 'var(--border-color)'
                      e.target.style.background = '#f8fafc'
                    }}
                  />
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '5px'
                  }}>
                    {errors.description && (
                      <div style={{
                        color: 'var(--danger-color)',
                        fontSize: '0.9rem'
                      }}>
                        {errors.description}
                      </div>
                    )}
                    <div style={{
                      color: 'var(--gray-color)',
                      fontSize: '0.9rem',
                      marginRight: 'auto'
                    }}>
                      {formData.description.length} حرف
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: '600',
                    color: 'var(--secondary-color)',
                    fontSize: '1rem'
                  }}>
                    مميزات النظام *
                  </label>
                  <div style={{ display: 'grid', gap: '15px' }}>
                    {formData.features.map((feature, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        gap: '15px',
                        alignItems: 'center'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: 'var(--primary-light)',
                          color: 'var(--primary-color)',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.9rem',
                          fontWeight: '600'
                        }}>
                          {index + 1}
                        </div>
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          style={{
                            flex: 1,
                            padding: '12px 15px',
                            border: '2px solid var(--border-color)',
                            borderRadius: '10px',
                            fontSize: '1rem',
                            background: '#f8fafc',
                            transition: 'all 0.3s ease'
                          }}
                          placeholder="أدخل ميزة من مميزات النظام"
                          onFocus={(e) => {
                            e.target.style.borderColor = 'var(--primary-color)'
                            e.target.style.background = 'white'
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'var(--border-color)'
                            e.target.style.background = '#f8fafc'
                          }}
                        />
                        {formData.features.length > 1 && (
                          <button
                            onClick={() => removeFeature(index)}
                            style={{
                              width: '40px',
                              height: '40px',
                              background: 'var(--danger-color)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.05)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)'
                            }}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={addFeature}
                    style={{
                      marginTop: '15px',
                      padding: '12px 20px',
                      background: 'var(--primary-light)',
                      color: 'var(--primary-color)',
                      border: '2px dashed var(--primary-color)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      width: '100%'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--primary-color)'
                      e.currentTarget.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--primary-light)'
                      e.currentTarget.style.color = 'var(--primary-color)'
                    }}
                  >
                    <i className="fas fa-plus"></i> إضافة ميزة جديدة
                  </button>

                  {errors.features && (
                    <div style={{
                      color: 'var(--danger-color)',
                      fontSize: '0.9rem',
                      marginTop: '10px'
                    }}>
                      {errors.features}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* الخطوة 3: تحسين محركات البحث */}
          {currentStep === 3 && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <div style={{
                textAlign: 'center',
                marginBottom: '40px'
              }}>
                <h2 style={{
                  margin: '0 0 10px 0',
                  color: 'var(--secondary-color)',
                  fontSize: '1.8rem'
                }}>
                  تحسين محركات البحث (SEO)
                </h2>
                <p style={{
                  margin: 0,
                  color: 'var(--gray-color)',
                  fontSize: '1rem'
                }}>
                  حسّن ظهور النظام في نتائج البحث
                </p>
              </div>

              <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                display: 'grid',
                gap: '30px'
              }}>
                {/* عنوان ووصف SEO */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '25px'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '10px',
                      fontWeight: '600',
                      color: 'var(--secondary-color)',
                      fontSize: '1rem'
                    }}>
                      عنوان SEO *
                    </label>
                    <input
                      type="text"
                      value={formData.seo.title}
                      onChange={(e) => updateSEOData('title', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '15px 20px',
                        border: errors.seoTitle ? '2px solid var(--danger-color)' : '2px solid var(--border-color)',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        background: '#f8fafc',
                        transition: 'all 0.3s ease'
                      }}
                      placeholder="عنوان محسن لمحركات البحث (30-60 حرف)"
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--primary-color)'
                        e.target.style.background = 'white'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.seoTitle ? 'var(--danger-color)' : 'var(--border-color)'
                        e.target.style.background = '#f8fafc'
                      }}
                    />
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '5px'
                    }}>
                      {errors.seoTitle && (
                        <div style={{
                          color: 'var(--danger-color)',
                          fontSize: '0.9rem'
                        }}>
                          {errors.seoTitle}
                        </div>
                      )}
                      <div style={{
                        color: formData.seo.title.length >= 30 && formData.seo.title.length <= 60 ? 'var(--success-color)' : 'var(--warning-color)',
                        fontSize: '0.9rem',
                        marginRight: 'auto',
                        fontWeight: '600'
                      }}>
                        {formData.seo.title.length}/60 حرف
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '10px',
                      fontWeight: '600',
                      color: 'var(--secondary-color)',
                      fontSize: '1rem'
                    }}>
                      الكلمة المفتاحية الرئيسية
                    </label>
                    <input
                      type="text"
                      value={formData.seo.focusKeyword}
                      onChange={(e) => updateSEOData('focusKeyword', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '15px 20px',
                        border: '2px solid var(--border-color)',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        background: '#f8fafc',
                        transition: 'all 0.3s ease'
                      }}
                      placeholder="الكلمة المفتاحية الأساسية"
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--primary-color)'
                        e.target.style.background = 'white'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border-color)'
                        e.target.style.background = '#f8fafc'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: '600',
                    color: 'var(--secondary-color)',
                    fontSize: '1rem'
                  }}>
                    وصف SEO *
                  </label>
                  <textarea
                    value={formData.seo.description}
                    onChange={(e) => updateSEOData('description', e.target.value)}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      border: errors.seoDescription ? '2px solid var(--danger-color)' : '2px solid var(--border-color)',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      background: '#f8fafc',
                      resize: 'vertical',
                      transition: 'all 0.3s ease',
                      lineHeight: '1.6'
                    }}
                    placeholder="وصف محسن لمحركات البحث (120-160 حرف)"
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary-color)'
                      e.target.style.background = 'white'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.seoDescription ? 'var(--danger-color)' : 'var(--border-color)'
                      e.target.style.background = '#f8fafc'
                    }}
                  />
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '5px'
                  }}>
                    {errors.seoDescription && (
                      <div style={{
                        color: 'var(--danger-color)',
                        fontSize: '0.9rem'
                      }}>
                        {errors.seoDescription}
                      </div>
                    )}
                    <div style={{
                      color: formData.seo.description.length >= 120 && formData.seo.description.length <= 160 ? 'var(--success-color)' : 'var(--warning-color)',
                      fontSize: '0.9rem',
                      marginRight: 'auto',
                      fontWeight: '600'
                    }}>
                      {formData.seo.description.length}/160 حرف
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: '600',
                    color: 'var(--secondary-color)',
                    fontSize: '1rem'
                  }}>
                    رابط الصفحة (Slug)
                  </label>
                  <input
                    type="text"
                    value={formData.seo.slug}
                    onChange={(e) => updateSEOData('slug', e.target.value.replace(/\s+/g, '-').toLowerCase())}
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      background: '#f8fafc',
                      transition: 'all 0.3s ease',
                      fontFamily: 'monospace'
                    }}
                    placeholder="system-name-url"
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary-color)'
                      e.target.style.background = 'white'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border-color)'
                      e.target.style.background = '#f8fafc'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: '600',
                    color: 'var(--secondary-color)',
                    fontSize: '1rem'
                  }}>
                    الكلمات المفتاحية
                  </label>
                  <div style={{ display: 'grid', gap: '15px' }}>
                    {formData.seo.keywords.map((keyword, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        gap: '15px',
                        alignItems: 'center'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: 'var(--success-light)',
                          color: 'var(--success-color)',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.9rem',
                          fontWeight: '600'
                        }}>
                          <i className="fas fa-key"></i>
                        </div>
                        <input
                          type="text"
                          value={keyword}
                          onChange={(e) => updateKeyword(index, e.target.value)}
                          style={{
                            flex: 1,
                            padding: '12px 15px',
                            border: '2px solid var(--border-color)',
                            borderRadius: '10px',
                            fontSize: '1rem',
                            background: '#f8fafc',
                            transition: 'all 0.3s ease'
                          }}
                          placeholder="كلمة مفتاحية"
                          onFocus={(e) => {
                            e.target.style.borderColor = 'var(--primary-color)'
                            e.target.style.background = 'white'
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'var(--border-color)'
                            e.target.style.background = '#f8fafc'
                          }}
                        />
                        {formData.seo.keywords.length > 1 && (
                          <button
                            onClick={() => removeKeyword(index)}
                            style={{
                              width: '40px',
                              height: '40px',
                              background: 'var(--danger-color)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.05)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)'
                            }}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={{
                    marginTop: '15px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '15px'
                  }}>
                    <button
                      onClick={addKeyword}
                      style={{
                        padding: '12px 20px',
                        background: 'var(--success-light)',
                        color: 'var(--success-color)',
                        border: '2px dashed var(--success-color)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--success-color)'
                        e.currentTarget.style.color = 'white'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--success-light)'
                        e.currentTarget.style.color = 'var(--success-color)'
                      }}
                    >
                      <i className="fas fa-plus"></i> إضافة كلمة مفتاحية
                    </button>

                    <button
                      onClick={generateKeywordsWithAI}
                      disabled={isGeneratingKeywords || !formData.name || !formData.description}
                      style={{
                        padding: '12px 20px',
                        background: isGeneratingKeywords ? '#94a3b8' :
                                   (!formData.name || !formData.description) ? '#e2e8f0' :
                                   'linear-gradient(135deg, #667eea, #764ba2)',
                        color: isGeneratingKeywords ? 'white' :
                               (!formData.name || !formData.description) ? '#94a3b8' : 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: isGeneratingKeywords || (!formData.name || !formData.description) ? 'not-allowed' : 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        if (!isGeneratingKeywords && formData.name && formData.description) {
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isGeneratingKeywords) {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = 'none'
                        }
                      }}
                    >
                      {isGeneratingKeywords ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i> جاري التوليد...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-magic"></i> توليد بالـ AI
                        </>
                      )}
                    </button>
                  </div>

                  {/* إحصائيات الكلمات المفتاحية */}
                  {formData.seo.keywords.filter(k => k.trim() !== '').length > 0 && (
                    <div style={{
                      marginTop: '15px',
                      padding: '15px',
                      background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                      borderRadius: '10px',
                      border: '1px solid #22c55e',
                      fontSize: '0.9rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <i className="fas fa-chart-bar" style={{ color: '#22c55e' }}></i>
                        <strong style={{ color: '#15803d' }}>إحصائيات الكلمات المفتاحية:</strong>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        <div style={{ textAlign: 'center', padding: '8px', background: 'white', borderRadius: '6px' }}>
                          <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#22c55e' }}>
                            {formData.seo.keywords.filter(k => k.trim() !== '').length}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>إجمالي الكلمات</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '8px', background: 'white', borderRadius: '6px' }}>
                          <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#3b82f6' }}>
                            {formData.seo.keywords
                              .filter(k => k.trim() !== '')
                              .filter(k => {
                                const avgDensity = (parseFloat(calculateKeywordDensity(formData.seo.title, k)) +
                                                   parseFloat(calculateKeywordDensity(formData.seo.description, k))) / 2
                                return avgDensity > 1
                              }).length}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>كلمات فعالة</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '8px', background: 'white', borderRadius: '6px' }}>
                          <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#f59e0b' }}>
                            {(formData.seo.keywords
                              .filter(k => k.trim() !== '')
                              .reduce((sum, k) => {
                                const avgDensity = (parseFloat(calculateKeywordDensity(formData.seo.title, k)) +
                                                   parseFloat(calculateKeywordDensity(formData.seo.description, k))) / 2
                                return sum + avgDensity
                              }, 0) / Math.max(formData.seo.keywords.filter(k => k.trim() !== '').length, 1)).toFixed(1)}%
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>متوسط الكثافة</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* نصائح للمستخدم */}
                  <div style={{
                    marginTop: '15px',
                    padding: '15px',
                    background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                    borderRadius: '10px',
                    border: '1px solid #0ea5e9',
                    fontSize: '0.9rem',
                    color: '#0369a1'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <i className="fas fa-lightbulb" style={{ color: '#0ea5e9' }}></i>
                      <strong>نصائح لكلمات مفتاحية أفضل:</strong>
                    </div>
                    <ul style={{ margin: 0, paddingRight: '20px' }}>
                      <li>استخدم كلمات يبحث عنها العملاء المحتملون</li>
                      <li>اختر كلمات متعلقة بمجال عملك ونشاطك</li>
                      <li>تجنب الكلمات العامة جداً أو المحددة جداً</li>
                      <li>استخدم 5-8 كلمات مفتاحية للحصول على أفضل النتائج</li>
                      <li>استخدم زر "توليد بالـ AI" للحصول على اقتراحات ذكية</li>
                    </ul>
                  </div>
                </div>

                {/* تحليل SEO المباشر */}
                {(formData.seo.title || formData.seo.description || formData.seo.focusKeyword) && (
                  <div style={{
                    padding: '25px',
                    background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                    borderRadius: '15px',
                    border: '2px solid var(--primary-light)'
                  }}>
                    <h3 style={{
                      margin: '0 0 20px 0',
                      color: 'var(--secondary-color)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <i className="fas fa-chart-line" style={{ color: 'var(--primary-color)' }}></i>
                      تحليل SEO المباشر
                    </h3>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 2fr',
                      gap: '25px'
                    }}>
                      <div>
                        <div style={{
                          textAlign: 'center',
                          padding: '20px',
                          background: 'white',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                        }}>
                          <div style={{
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            color: analyzeSEO().score >= 70 ? 'var(--success-color)' :
                                   analyzeSEO().score >= 40 ? 'var(--warning-color)' :
                                   'var(--danger-color)',
                            marginBottom: '10px'
                          }}>
                            {analyzeSEO().score}
                          </div>
                          <div style={{
                            fontSize: '1rem',
                            color: 'var(--gray-color)',
                            fontWeight: '600'
                          }}>
                            نقاط SEO من 100
                          </div>
                        </div>
                      </div>

                      <div>
                        {formData.seo.focusKeyword && (
                          <div style={{ marginBottom: '15px' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: 'var(--secondary-color)' }}>
                              كثافة الكلمة المفتاحية &ldquo;{formData.seo.focusKeyword}&rdquo;
                            </h4>
                            <div style={{ display: 'grid', gap: '10px' }}>
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px 15px',
                                background: 'white',
                                borderRadius: '8px'
                              }}>
                                <span>في العنوان:</span>
                                <span style={{
                                  fontWeight: '600',
                                  color: 'var(--primary-color)'
                                }}>
                                  {calculateKeywordDensity(formData.seo.title, formData.seo.focusKeyword)}%
                                </span>
                              </div>
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px 15px',
                                background: 'white',
                                borderRadius: '8px'
                              }}>
                                <span>في الوصف:</span>
                                <span style={{
                                  fontWeight: '600',
                                  color: 'var(--primary-color)'
                                }}>
                                  {calculateKeywordDensity(formData.seo.description, formData.seo.focusKeyword)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* عرض كثافة جميع الكلمات المفتاحية */}
                        {formData.seo.keywords.filter(k => k.trim() !== '').length > 0 && (
                          <div style={{ marginBottom: '15px' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: 'var(--secondary-color)' }}>
                              كثافة الكلمات المفتاحية
                            </h4>
                            <div style={{ display: 'grid', gap: '8px' }}>
                              {formData.seo.keywords
                                .filter(keyword => keyword.trim() !== '')
                                .map((keyword, index) => {
                                  const titleDensity = calculateKeywordDensity(formData.seo.title, keyword)
                                  const descDensity = calculateKeywordDensity(formData.seo.description, keyword)
                                  const avgDensity = ((parseFloat(titleDensity) + parseFloat(descDensity)) / 2).toFixed(1)

                                  return (
                                    <div key={index} style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      padding: '8px 12px',
                                      background: 'white',
                                      borderRadius: '6px',
                                      fontSize: '0.9rem'
                                    }}>
                                      <span style={{
                                        fontWeight: '500',
                                        color: 'var(--secondary-color)'
                                      }}>
                                        &quot;{keyword}&quot;
                                      </span>
                                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>
                                          العنوان: {titleDensity}%
                                        </span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>
                                          الوصف: {descDensity}%
                                        </span>
                                        <span style={{
                                          fontWeight: '600',
                                          color: parseFloat(avgDensity) > 2 ? 'white' :
                                                parseFloat(avgDensity) > 1 ? 'white' :
                                                'white',
                                          padding: '2px 8px',
                                          borderRadius: '12px',
                                          background: parseFloat(avgDensity) > 2 ? 'var(--success-color)' :
                                                     parseFloat(avgDensity) > 1 ? 'var(--warning-color)' :
                                                     'var(--danger-color)',
                                          fontSize: '0.8rem'
                                        }}>
                                          متوسط: {avgDensity}%
                                        </span>
                                      </div>
                                    </div>
                                  )
                                })}
                            </div>

                            {/* مؤشر جودة الكلمات المفتاحية */}
                            <div style={{
                              marginTop: '10px',
                              padding: '10px',
                              background: 'white',
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0'
                            }}>
                              <div style={{
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: 'var(--secondary-color)',
                                marginBottom: '5px'
                              }}>
                                تقييم جودة الكلمات المفتاحية:
                              </div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>
                                <span style={{ color: 'var(--success-color)' }}>• ممتاز (أكثر من 2%)</span> |
                                <span style={{ color: 'var(--warning-color)' }}> جيد (1-2%)</span> |
                                <span style={{ color: 'var(--danger-color)' }}> يحتاج تحسين (أقل من 1%)</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {analyzeSEO().issues.length > 0 && (
                          <div>
                            <h4 style={{ margin: '0 0 10px 0', color: 'var(--danger-color)' }}>
                              المشاكل المكتشفة:
                            </h4>
                            <div style={{ display: 'grid', gap: '8px' }}>
                              {analyzeSEO().issues.map((issue, index) => (
                                <div key={index} style={{
                                  padding: '8px 12px',
                                  background: 'var(--danger-color)',
                                  color: 'white',
                                  borderRadius: '6px',
                                  fontSize: '0.9rem',
                                  fontWeight: '500'
                                }}>
                                  <i className="fas fa-exclamation-triangle" style={{ marginLeft: '8px', color: 'white' }}></i>
                                  {issue}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* أزرار التنقل */}
        <div style={{
          padding: '30px 40px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            style={{
              padding: '12px 25px',
              background: currentStep === 1 ? '#e2e8f0' : 'white',
              color: currentStep === 1 ? '#94a3b8' : 'var(--secondary-color)',
              border: '2px solid ' + (currentStep === 1 ? '#e2e8f0' : 'var(--border-color)'),
              borderRadius: '10px',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            <i className="fas fa-arrow-right"></i> السابق
          </button>

          <div style={{
            display: 'flex',
            gap: '10px'
          }}>
            {steps.map((_, index) => (
              <div key={index} style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: currentStep > index + 1 ? 'var(--success-color)' :
                           currentStep === index + 1 ? 'var(--primary-color)' : '#e2e8f0',
                transition: 'all 0.3s ease'
              }}></div>
            ))}
          </div>

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              style={{
                padding: '12px 25px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              التالي <i className="fas fa-arrow-left"></i>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                padding: '12px 25px',
                background: isSubmitting ? '#94a3b8' : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> جاري الحفظ...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i> حفظ النظام
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
