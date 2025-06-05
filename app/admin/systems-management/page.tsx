'use client'

import { useState } from 'react'

export default function SystemsManagement() {
  const [systems, setSystems] = useState([
    {
      id: 1,
      name: 'نظام المحاسبة والفاتورة الإلكترونية',
      description: 'نظام متكامل لإدارة الحسابات والفواتير الإلكترونية مع ربط هيئة الزكاة والضريبة',
      version: '2.1.5',
      status: 'active',
      category: 'مالي',
      features: ['فواتير إلكترونية', 'ربط الزكاة والضريبة', 'تقارير مالية', 'إدارة العملاء'],
      seo: {
        title: 'نظام المحاسبة والفاتورة الإلكترونية - حلول مالية متكاملة',
        description: 'نظام محاسبة متطور يدعم الفواتير الإلكترونية وربط هيئة الزكاة والضريبة مع تقارير مالية شاملة',
        keywords: ['نظام محاسبة', 'فواتير إلكترونية', 'الزكاة والضريبة', 'تقارير مالية', 'إدارة حسابات', 'نظام مالي'],
        metaDescription: 'احصل على نظام محاسبة متكامل يدعم الفواتير الإلكترونية والربط مع هيئة الزكاة والضريبة',
        slug: 'accounting-electronic-invoice-system',
        focusKeyword: 'نظام محاسبة'
      },
      files: [
        { id: 1, name: 'دليل المستخدم.pdf', size: '2.3 MB', type: 'pdf', uploadDate: '2024-01-10' },
        { id: 2, name: 'عرض تقديمي.pptx', size: '5.1 MB', type: 'presentation', uploadDate: '2024-01-08' },
        { id: 3, name: 'صور النظام.zip', size: '12.5 MB', type: 'images', uploadDate: '2024-01-05' }
      ],
      createdDate: '2023-06-15',
      lastUpdate: '2024-01-10'
    },
    {
      id: 2,
      name: 'نظام إدارة العملاء (CRM)',
      description: 'نظام شامل لإدارة العلاقات مع العملاء وتتبع المبيعات والفرص التجارية',
      version: '1.8.2',
      status: 'active',
      category: 'مبيعات',
      features: ['إدارة جهات الاتصال', 'تتبع الفرص', 'تقارير المبيعات', 'أتمتة التسويق'],
      seo: {
        title: 'نظام إدارة العملاء CRM - إدارة العلاقات والمبيعات',
        description: 'نظام CRM متطور لإدارة العملاء وتتبع المبيعات مع أتمتة التسويق وتقارير شاملة',
        keywords: ['نظام CRM', 'إدارة العملاء', 'تتبع المبيعات', 'أتمتة التسويق', 'إدارة العلاقات', 'نظام مبيعات'],
        metaDescription: 'نظام CRM شامل لإدارة العملاء وتتبع الفرص التجارية مع تقارير مبيعات متقدمة',
        slug: 'crm-customer-management-system',
        focusKeyword: 'نظام CRM'
      },
      files: [
        { id: 4, name: 'دليل التشغيل.pdf', size: '1.8 MB', type: 'pdf', uploadDate: '2024-01-12' },
        { id: 5, name: 'فيديو تعريفي.mp4', size: '45.2 MB', type: 'video', uploadDate: '2024-01-09' }
      ],
      createdDate: '2023-08-20',
      lastUpdate: '2024-01-08'
    },
    {
      id: 3,
      name: 'نظام إدارة الموارد البشرية',
      description: 'نظام متكامل لإدارة شؤون الموظفين والرواتب والحضور والانصراف',
      version: '1.5.7',
      status: 'active',
      category: 'موارد بشرية',
      features: ['إدارة الموظفين', 'نظام الرواتب', 'الحضور والانصراف', 'تقييم الأداء'],
      seo: {
        title: 'نظام إدارة الموارد البشرية - إدارة الموظفين والرواتب',
        description: 'نظام HR متكامل لإدارة الموظفين والرواتب مع نظام الحضور والانصراف وتقييم الأداء',
        keywords: ['نظام HR', 'إدارة الموظفين', 'نظام الرواتب', 'الحضور والانصراف', 'تقييم الأداء', 'موارد بشرية'],
        metaDescription: 'نظام موارد بشرية شامل لإدارة الموظفين والرواتب مع تتبع الحضور وتقييم الأداء',
        slug: 'hr-human-resources-system',
        focusKeyword: 'نظام HR'
      },
      files: [
        { id: 6, name: 'كتيب النظام.pdf', size: '3.2 MB', type: 'pdf', uploadDate: '2024-01-11' }
      ],
      createdDate: '2023-09-10',
      lastUpdate: '2024-01-05'
    },
    {
      id: 4,
      name: 'نظام إدارة المخزون',
      description: 'نظام لإدارة المخزون والمواد مع تتبع المستويات والتنبيهات التلقائية',
      version: '1.9.1',
      status: 'maintenance',
      category: 'مخزون',
      features: ['تتبع المخزون', 'إدارة المستودعات', 'تقارير الجرد', 'تنبيهات النفاد'],
      seo: {
        title: 'نظام إدارة المخزون - تتبع المواد والمستودعات',
        description: 'نظام مخزون متطور لتتبع المواد وإدارة المستودعات مع تنبيهات النفاد وتقارير الجرد',
        keywords: ['نظام مخزون', 'إدارة المستودعات', 'تتبع المواد', 'تقارير الجرد', 'تنبيهات النفاد', 'إدارة المخزون'],
        metaDescription: 'نظام إدارة مخزون شامل لتتبع المواد والمستودعات مع تنبيهات تلقائية وتقارير مفصلة',
        slug: 'inventory-management-system',
        focusKeyword: 'نظام مخزون'
      },
      files: [],
      createdDate: '2023-10-05',
      lastUpdate: '2024-01-07'
    }
  ])

  const [selectedSystem, setSelectedSystem] = useState<number | null>(null)
  const [showAddSystem, setShowAddSystem] = useState(false)
  const [showEditSystem, setShowEditSystem] = useState<number | null>(null)
  const [showFileUpload, setShowFileUpload] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  const [newSystem, setNewSystem] = useState({
    name: '',
    description: '',
    category: '',
    features: [''],
    status: 'active',
    seo: {
      title: '',
      description: '',
      keywords: [''],
      metaDescription: '',
      slug: '',
      focusKeyword: ''
    }
  })

  const filteredSystems = systems.filter(system => {
    const matchesSearch = system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         system.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || system.status === filterStatus
    const matchesCategory = filterCategory === 'all' || system.category === filterCategory

    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط'
      case 'inactive': return 'غير نشط'
      case 'maintenance': return 'صيانة'
      case 'development': return 'تطوير'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'var(--success-color)'
      case 'inactive': return 'var(--danger-color)'
      case 'maintenance': return 'var(--warning-color)'
      case 'development': return 'var(--primary-color)'
      default: return 'var(--gray-color)'
    }
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

  const handleAddSystem = () => {
    const id = Math.max(...systems.map(s => s.id)) + 1
    const systemToAdd = {
      ...newSystem,
      id,
      version: '1.0.0',
      features: newSystem.features.filter(f => f.trim() !== ''),
      seo: {
        ...newSystem.seo,
        keywords: newSystem.seo.keywords.filter(k => k.trim() !== '')
      },
      files: [],
      createdDate: new Date().toISOString().split('T')[0],
      lastUpdate: new Date().toISOString().split('T')[0]
    }
    setSystems([...systems, systemToAdd])
    setNewSystem({
      name: '',
      description: '',
      category: '',
      features: [''],
      status: 'active',
      seo: {
        title: '',
        description: '',
        keywords: [''],
        metaDescription: '',
        slug: '',
        focusKeyword: ''
      }
    })
    setShowAddSystem(false)
  }

  const handleDeleteSystem = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا النظام؟')) {
      setSystems(systems.filter(s => s.id !== id))
    }
  }

  const handleFileUpload = (systemId: number, file: any) => {
    const newFile = {
      id: Date.now(),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
      type: file.type.includes('pdf') ? 'pdf' :
            file.type.includes('presentation') ? 'presentation' :
            file.type.includes('image') ? 'images' :
            file.type.includes('video') ? 'video' : 'document',
      uploadDate: new Date().toISOString().split('T')[0]
    }

    setSystems(systems.map(system =>
      system.id === systemId
        ? { ...system, files: [...system.files, newFile] }
        : system
    ))
  }

  const handleDeleteFile = (systemId: number, fileId: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الملف؟')) {
      setSystems(systems.map(system =>
        system.id === systemId
          ? { ...system, files: system.files.filter(f => f.id !== fileId) }
          : system
      ))
    }
  }

  const categories = [...new Set(systems.map(s => s.category))]

  // دالة حساب النسبة المئوية للكلمات المفتاحية
  const calculateKeywordDensity = (text: string, keyword: string) => {
    if (!text || !keyword) return 0
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

    return words.length > 0 ? ((matches / words.length) * 100).toFixed(1) : 0
  }

  // دالة تحليل SEO
  const analyzeSEO = (system: any) => {
    if (!system.seo) return { score: 0, issues: ['لا توجد بيانات SEO'] }

    const issues = []
    let score = 0

    // فحص العنوان
    if (!system.seo.title) {
      issues.push('العنوان مفقود')
    } else {
      if (system.seo.title.length < 30) issues.push('العنوان قصير جداً (أقل من 30 حرف)')
      if (system.seo.title.length > 60) issues.push('العنوان طويل جداً (أكثر من 60 حرف)')
      else score += 20
    }

    // فحص الوصف
    if (!system.seo.description) {
      issues.push('الوصف مفقود')
    } else {
      if (system.seo.description.length < 120) issues.push('الوصف قصير جداً (أقل من 120 حرف)')
      if (system.seo.description.length > 160) issues.push('الوصف طويل جداً (أكثر من 160 حرف)')
      else score += 20
    }

    // فحص الكلمة المفتاحية الرئيسية
    if (!system.seo.focusKeyword) {
      issues.push('الكلمة المفتاحية الرئيسية مفقودة')
    } else {
      score += 20

      // فحص كثافة الكلمة المفتاحية في العنوان
      const titleDensity = calculateKeywordDensity(system.seo.title, system.seo.focusKeyword)
      if (titleDensity === '0.0') issues.push('الكلمة المفتاحية غير موجودة في العنوان')
      else score += 10

      // فحص كثافة الكلمة المفتاحية في الوصف
      const descDensity = calculateKeywordDensity(system.seo.description, system.seo.focusKeyword)
      if (descDensity === '0.0') issues.push('الكلمة المفتاحية غير موجودة في الوصف')
      else score += 10
    }

    // فحص الكلمات المفتاحية
    if (!system.seo.keywords || system.seo.keywords.length === 0) {
      issues.push('الكلمات المفتاحية مفقودة')
    } else {
      if (system.seo.keywords.length < 3) issues.push('عدد قليل من الكلمات المفتاحية (أقل من 3)')
      if (system.seo.keywords.length > 10) issues.push('عدد كبير من الكلمات المفتاحية (أكثر من 10)')
      else score += 10
    }

    // فحص الرابط
    if (!system.seo.slug) {
      issues.push('الرابط مفقود')
    } else {
      if (system.seo.slug.includes(' ')) issues.push('الرابط يحتوي على مسافات')
      else score += 10
    }

    return { score, issues }
  }

  return (
    <>
      {/* إحصائيات الأنظمة */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-cogs"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{systems.length}</div>
            <div className="stat-label">إجمالي الأنظمة</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{systems.filter(s => s.status === 'active').length}</div>
            <div className="stat-label">أنظمة نشطة</div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-tools"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{systems.filter(s => s.status === 'maintenance').length}</div>
            <div className="stat-label">تحت الصيانة</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-file"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{systems.reduce((total, system) => total + system.files.length, 0)}</div>
            <div className="stat-label">إجمالي الملفات</div>
          </div>
        </div>
      </div>

      {/* أدوات البحث والفلترة */}
      <div className="data-table-container">
        <div className="data-table-header">
          <h3 className="data-table-title">إدارة الأنظمة</h3>
          <div className="data-table-actions">
            <button
              className="btn btn-primary"
              style={{ fontSize: '0.9rem', padding: '10px 20px' }}
              onClick={() => window.location.href = '/admin/systems-management/add'}
            >
              <i className="fas fa-plus"></i> إضافة نظام جديد
            </button>
          </div>
        </div>

        <div style={{ padding: '20px 25px', borderBottom: '1px solid var(--border-color)', background: '#f8fafc' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="البحث في الأنظمة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 15px 10px 40px',
                  border: '2px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              />
              <i className="fas fa-search" style={{
                position: 'absolute',
                right: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--gray-color)'
              }}></i>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '10px 15px',
                border: '2px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="maintenance">صيانة</option>
              <option value="development">تطوير</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                padding: '10px 15px',
                border: '2px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            >
              <option value="all">جميع الفئات</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* عرض الأنظمة */}
        <div style={{ padding: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px' }}>
          {filteredSystems.map((system) => (
            <div key={system.id} style={{
              background: 'white',
              borderRadius: '15px',
              padding: '25px',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={() => setSelectedSystem(selectedSystem === system.id ? null : system.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.08)'
            }}
            >
              {/* شريط الحالة العلوي */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                height: '4px',
                background: getStatusColor(system.status)
              }}></div>

              {/* رأس البطاقة */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '20px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '15px',
                  background: `${getStatusColor(system.status)}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: getStatusColor(system.status),
                  fontSize: '1.8rem'
                }}>
                  <i className="fas fa-cog"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    margin: '0 0 8px 0',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: 'var(--secondary-color)'
                  }}>
                    {system.name}
                  </h4>
                  <p style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    color: 'var(--gray-color)',
                    lineHeight: '1.5'
                  }}>
                    {system.description}
                  </p>
                </div>
              </div>

              {/* معلومات النظام */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)', marginBottom: '5px' }}>
                    الحالة
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    background: `${getStatusColor(system.status)}20`,
                    color: getStatusColor(system.status)
                  }}>
                    {getStatusText(system.status)}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)', marginBottom: '5px' }}>
                    الإصدار
                  </div>
                  <div style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>
                    v{system.version}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)', marginBottom: '5px' }}>
                    الفئة
                  </div>
                  <div style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>
                    {system.category}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)', marginBottom: '5px' }}>
                    نقاط SEO
                  </div>
                  <div style={{
                    fontWeight: '600',
                    color: system.seo ? (analyzeSEO(system).score >= 70 ? 'var(--success-color)' :
                                       analyzeSEO(system).score >= 40 ? 'var(--warning-color)' :
                                       'var(--danger-color)') : 'var(--gray-color)'
                  }}>
                    {system.seo ? `${analyzeSEO(system).score}/100` : 'غير محدد'}
                  </div>
                </div>
              </div>

              {/* تحليل SEO */}
              {system.seo && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)', marginBottom: '8px' }}>
                    تحليل SEO
                  </div>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {system.seo.focusKeyword && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--secondary-color)' }}>
                          كثافة &quot;{system.seo.focusKeyword}&quot; في العنوان:
                        </span>
                        <span style={{
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          color: 'var(--primary-color)'
                        }}>
                          {calculateKeywordDensity(system.seo.title, system.seo.focusKeyword)}%
                        </span>
                      </div>
                    )}
                    {system.seo.focusKeyword && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--secondary-color)' }}>
                          كثافة &quot;{system.seo.focusKeyword}&quot; في الوصف:
                        </span>
                        <span style={{
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          color: 'var(--primary-color)'
                        }}>
                          {calculateKeywordDensity(system.seo.description, system.seo.focusKeyword)}%
                        </span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--secondary-color)' }}>
                        عدد الكلمات المفتاحية:
                      </span>
                      <span style={{
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: 'var(--primary-color)'
                      }}>
                        {system.seo.keywords ? system.seo.keywords.length : 0}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* المميزات */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)', marginBottom: '8px' }}>
                  المميزات الرئيسية
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {system.features.slice(0, 3).map((feature, index) => (
                    <span key={index} style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      background: 'var(--primary-light)',
                      color: 'var(--primary-color)'
                    }}>
                      {feature}
                    </span>
                  ))}
                  {system.features.length > 3 && (
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      background: '#f1f5f9',
                      color: 'var(--gray-color)'
                    }}>
                      +{system.features.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* الملفات */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>
                    الملفات ({system.files.length})
                  </div>
                  <button
                    className="btn btn-outline"
                    style={{ fontSize: '0.7rem', padding: '4px 8px' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowFileUpload(system.id)
                    }}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                {system.files.length > 0 ? (
                  <div style={{ display: 'grid', gap: '5px' }}>
                    {system.files.slice(0, 2).map((file) => (
                      <div key={file.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        background: '#f8fafc',
                        borderRadius: '6px',
                        fontSize: '0.8rem'
                      }}>
                        <i className={getFileIcon(file.type)} style={{ color: getFileColor(file.type) }}></i>
                        <span style={{ flex: 1, color: 'var(--secondary-color)' }}>{file.name}</span>
                        <span style={{ color: 'var(--gray-color)' }}>{file.size}</span>
                      </div>
                    ))}
                    {system.files.length > 2 && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--gray-color)', textAlign: 'center' }}>
                        +{system.files.length - 2} ملف إضافي
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    color: 'var(--gray-color)',
                    fontSize: '0.8rem',
                    padding: '10px',
                    background: '#f8fafc',
                    borderRadius: '6px'
                  }}>
                    لا توجد ملفات
                  </div>
                )}
              </div>

              {/* أزرار الإجراءات */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  className="action-btn view"
                  style={{ flex: 1, padding: '8px 12px' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedSystem(system.id)
                  }}
                >
                  <i className="fas fa-eye"></i> عرض
                </button>
                <button
                  className="action-btn edit"
                  style={{ flex: 1, padding: '8px 12px' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowEditSystem(system.id)
                  }}
                >
                  <i className="fas fa-edit"></i> تعديل
                </button>
                <button
                  className="action-btn delete"
                  style={{ padding: '8px 12px' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteSystem(system.id)
                  }}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* مودال إضافة نظام جديد */}
      {showAddSystem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '30px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h3 style={{ margin: 0, color: 'var(--secondary-color)' }}>إضافة نظام جديد</h3>
              <button
                onClick={() => setShowAddSystem(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: 'var(--gray-color)',
                  cursor: 'pointer'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--secondary-color)' }}>
                  اسم النظام *
                </label>
                <input
                  type="text"
                  value={newSystem.name}
                  onChange={(e) => setNewSystem({...newSystem, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                  placeholder="أدخل اسم النظام"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--secondary-color)' }}>
                  الوصف *
                </label>
                <textarea
                  value={newSystem.description}
                  onChange={(e) => setNewSystem({...newSystem, description: e.target.value})}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    resize: 'vertical'
                  }}
                  placeholder="أدخل وصف النظام"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--secondary-color)' }}>
                  الفئة *
                </label>
                <select
                  value={newSystem.category}
                  onChange={(e) => setNewSystem({...newSystem, category: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="">اختر الفئة</option>
                  <option value="مالي">مالي</option>
                  <option value="مبيعات">مبيعات</option>
                  <option value="موارد بشرية">موارد بشرية</option>
                  <option value="مخزون">مخزون</option>
                  <option value="إدارة">إدارة</option>
                  <option value="تقني">تقني</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--secondary-color)' }}>
                  المميزات
                </label>
                {newSystem.features.map((feature, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const updatedFeatures = [...newSystem.features]
                        updatedFeatures[index] = e.target.value
                        setNewSystem({...newSystem, features: updatedFeatures})
                      }}
                      style={{
                        flex: 1,
                        padding: '10px 15px',
                        border: '2px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                      placeholder="أدخل ميزة"
                    />
                    {newSystem.features.length > 1 && (
                      <button
                        onClick={() => {
                          const updatedFeatures = newSystem.features.filter((_, i) => i !== index)
                          setNewSystem({...newSystem, features: updatedFeatures})
                        }}
                        style={{
                          padding: '10px',
                          background: 'var(--danger-color)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setNewSystem({...newSystem, features: [...newSystem.features, '']})}
                  style={{
                    padding: '8px 15px',
                    background: 'var(--primary-light)',
                    color: 'var(--primary-color)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  <i className="fas fa-plus"></i> إضافة ميزة
                </button>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--secondary-color)' }}>
                  الحالة
                </label>
                <select
                  value={newSystem.status}
                  onChange={(e) => setNewSystem({...newSystem, status: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                  <option value="maintenance">صيانة</option>
                  <option value="development">تطوير</option>
                </select>
              </div>

              {/* حقول SEO */}
              <div style={{
                marginTop: '30px',
                padding: '20px',
                background: '#f8fafc',
                borderRadius: '10px',
                border: '2px solid var(--primary-light)'
              }}>
                <h4 style={{
                  margin: '0 0 20px 0',
                  color: 'var(--primary-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <i className="fas fa-search"></i>
                  إعدادات تحسين محركات البحث (SEO)
                </h4>

                <div style={{ display: 'grid', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--secondary-color)' }}>
                      عنوان SEO
                    </label>
                    <input
                      type="text"
                      value={newSystem.seo.title}
                      onChange={(e) => setNewSystem({
                        ...newSystem,
                        seo: {...newSystem.seo, title: e.target.value}
                      })}
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '2px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                      placeholder="عنوان محسن لمحركات البحث (30-60 حرف)"
                    />
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)', marginTop: '5px' }}>
                      الطول: {newSystem.seo.title.length} حرف
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--secondary-color)' }}>
                      وصف SEO
                    </label>
                    <textarea
                      value={newSystem.seo.description}
                      onChange={(e) => setNewSystem({
                        ...newSystem,
                        seo: {...newSystem.seo, description: e.target.value}
                      })}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '2px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        resize: 'vertical'
                      }}
                      placeholder="وصف محسن لمحركات البحث (120-160 حرف)"
                    />
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)', marginTop: '5px' }}>
                      الطول: {newSystem.seo.description.length} حرف
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--secondary-color)' }}>
                        الكلمة المفتاحية الرئيسية
                      </label>
                      <input
                        type="text"
                        value={newSystem.seo.focusKeyword}
                        onChange={(e) => setNewSystem({
                          ...newSystem,
                          seo: {...newSystem.seo, focusKeyword: e.target.value}
                        })}
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '2px solid var(--border-color)',
                          borderRadius: '8px',
                          fontSize: '0.9rem'
                        }}
                        placeholder="الكلمة المفتاحية الأساسية"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--secondary-color)' }}>
                        رابط الصفحة (Slug)
                      </label>
                      <input
                        type="text"
                        value={newSystem.seo.slug}
                        onChange={(e) => setNewSystem({
                          ...newSystem,
                          seo: {...newSystem.seo, slug: e.target.value.replace(/\s+/g, '-').toLowerCase()}
                        })}
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '2px solid var(--border-color)',
                          borderRadius: '8px',
                          fontSize: '0.9rem'
                        }}
                        placeholder="system-name-url"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--secondary-color)' }}>
                      الكلمات المفتاحية
                    </label>
                    {newSystem.seo.keywords.map((keyword, index) => (
                      <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <input
                          type="text"
                          value={keyword}
                          onChange={(e) => {
                            const updatedKeywords = [...newSystem.seo.keywords]
                            updatedKeywords[index] = e.target.value
                            setNewSystem({
                              ...newSystem,
                              seo: {...newSystem.seo, keywords: updatedKeywords}
                            })
                          }}
                          style={{
                            flex: 1,
                            padding: '10px 15px',
                            border: '2px solid var(--border-color)',
                            borderRadius: '8px',
                            fontSize: '0.9rem'
                          }}
                          placeholder="كلمة مفتاحية"
                        />
                        {newSystem.seo.keywords.length > 1 && (
                          <button
                            onClick={() => {
                              const updatedKeywords = newSystem.seo.keywords.filter((_, i) => i !== index)
                              setNewSystem({
                                ...newSystem,
                                seo: {...newSystem.seo, keywords: updatedKeywords}
                              })
                            }}
                            style={{
                              padding: '10px',
                              background: 'var(--danger-color)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer'
                            }}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => setNewSystem({
                        ...newSystem,
                        seo: {...newSystem.seo, keywords: [...newSystem.seo.keywords, '']}
                      })}
                      style={{
                        padding: '8px 15px',
                        background: 'var(--primary-light)',
                        color: 'var(--primary-color)',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      <i className="fas fa-plus"></i> إضافة كلمة مفتاحية
                    </button>
                  </div>

                  {/* عرض تحليل SEO المباشر */}
                  {(newSystem.seo.title || newSystem.seo.description || newSystem.seo.focusKeyword) && (
                    <div style={{
                      marginTop: '20px',
                      padding: '15px',
                      background: 'white',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)'
                    }}>
                      <h5 style={{ margin: '0 0 15px 0', color: 'var(--secondary-color)' }}>
                        معاينة تحليل SEO
                      </h5>
                      {newSystem.seo.focusKeyword && newSystem.seo.title && (
                        <div style={{ marginBottom: '10px' }}>
                          <span style={{ fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                            كثافة &quot;{newSystem.seo.focusKeyword}&quot; في العنوان:
                          </span>
                          <span style={{
                            fontWeight: '600',
                            color: 'var(--primary-color)',
                            marginRight: '8px'
                          }}>
                            {calculateKeywordDensity(newSystem.seo.title, newSystem.seo.focusKeyword)}%
                          </span>
                        </div>
                      )}
                      {newSystem.seo.focusKeyword && newSystem.seo.description && (
                        <div style={{ marginBottom: '10px' }}>
                          <span style={{ fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                            كثافة &quot;{newSystem.seo.focusKeyword}&quot; في الوصف:
                          </span>
                          <span style={{
                            fontWeight: '600',
                            color: 'var(--primary-color)',
                            marginRight: '8px'
                          }}>
                            {calculateKeywordDensity(newSystem.seo.description, newSystem.seo.focusKeyword)}%
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '30px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddSystem(false)}
                className="btn btn-outline"
                style={{ fontSize: '0.9rem', padding: '10px 20px' }}
              >
                إلغاء
              </button>
              <button
                onClick={handleAddSystem}
                className="btn btn-primary"
                style={{ fontSize: '0.9rem', padding: '10px 20px' }}
                disabled={!newSystem.name || !newSystem.description || !newSystem.category}
              >
                <i className="fas fa-save"></i> حفظ النظام
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال رفع الملفات */}
      {showFileUpload && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h3 style={{ margin: 0, color: 'var(--secondary-color)' }}>رفع ملف جديد</h3>
              <button
                onClick={() => setShowFileUpload(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: 'var(--gray-color)',
                  cursor: 'pointer'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: '10px',
              padding: '40px 20px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <i className="fas fa-cloud-upload-alt" style={{
                fontSize: '3rem',
                color: 'var(--primary-color)',
                marginBottom: '15px'
              }}></i>
              <div style={{ marginBottom: '10px', color: 'var(--secondary-color)', fontWeight: '600' }}>
                اسحب الملفات هنا أو انقر للاختيار
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                يدعم: PDF, DOC, PPT, صور, فيديو
              </div>
              <input
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files && showFileUpload) {
                    Array.from(e.target.files).forEach(file => {
                      handleFileUpload(showFileUpload, file)
                    })
                    setShowFileUpload(null)
                  }
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* عرض الملفات الحالية */}
            {showFileUpload && (
              <div>
                <h4 style={{ marginBottom: '15px', color: 'var(--secondary-color)' }}>الملفات الحالية</h4>
                <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                  {systems.find(s => s.id === showFileUpload)?.files.map((file) => (
                    <div key={file.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px',
                      marginBottom: '8px',
                      background: '#f8fafc',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className={getFileIcon(file.type)} style={{ color: getFileColor(file.type) }}></i>
                        <div>
                          <div style={{ fontWeight: '500', color: 'var(--secondary-color)' }}>{file.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>
                            {file.size} • {file.uploadDate}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteFile(showFileUpload, file.id)}
                        style={{
                          background: 'var(--danger-color)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          cursor: 'pointer'
                        }}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '15px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowFileUpload(null)}
                className="btn btn-outline"
                style={{ fontSize: '0.9rem', padding: '10px 20px' }}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال عرض تفاصيل النظام */}
      {selectedSystem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '30px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            {(() => {
              const system = systems.find(s => s.id === selectedSystem)
              if (!system) return null

              return (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <h3 style={{ margin: 0, color: 'var(--secondary-color)' }}>تفاصيل النظام</h3>
                    <button
                      onClick={() => setSelectedSystem(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        color: 'var(--gray-color)',
                        cursor: 'pointer'
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                    {/* معلومات أساسية */}
                    <div>
                      <h4 style={{ marginBottom: '20px', color: 'var(--secondary-color)' }}>المعلومات الأساسية</h4>
                      <div style={{ display: 'grid', gap: '15px' }}>
                        <div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)', marginBottom: '5px' }}>اسم النظام</div>
                          <div style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>{system.name}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)', marginBottom: '5px' }}>الوصف</div>
                          <div style={{ color: 'var(--secondary-color)', lineHeight: '1.5' }}>{system.description}</div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                          <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)', marginBottom: '5px' }}>الفئة</div>
                            <div style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>{system.category}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)', marginBottom: '5px' }}>نقاط SEO</div>
                            <div style={{
                              fontWeight: '600',
                              color: system.seo ? (analyzeSEO(system).score >= 70 ? 'var(--success-color)' :
                                                 analyzeSEO(system).score >= 40 ? 'var(--warning-color)' :
                                                 'var(--danger-color)') : 'var(--gray-color)'
                            }}>
                              {system.seo ? `${analyzeSEO(system).score}/100` : 'غير محدد'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* معلومات تقنية */}
                    <div>
                      <h4 style={{ marginBottom: '20px', color: 'var(--secondary-color)' }}>المعلومات التقنية</h4>
                      <div style={{ display: 'grid', gap: '15px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                          <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)', marginBottom: '5px' }}>الإصدار</div>
                            <div style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>v{system.version}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)', marginBottom: '5px' }}>الحالة</div>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '500',
                              background: `${getStatusColor(system.status)}20`,
                              color: getStatusColor(system.status)
                            }}>
                              {getStatusText(system.status)}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                          <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)', marginBottom: '5px' }}>تاريخ الإنشاء</div>
                            <div style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>{system.createdDate}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)', marginBottom: '5px' }}>آخر تحديث</div>
                            <div style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>{system.lastUpdate}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* المميزات */}
                  <div style={{ marginBottom: '30px' }}>
                    <h4 style={{ marginBottom: '15px', color: 'var(--secondary-color)' }}>المميزات</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                      {system.features.map((feature, index) => (
                        <div key={index} style={{
                          padding: '10px 15px',
                          background: 'var(--primary-light)',
                          color: 'var(--primary-color)',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          textAlign: 'center'
                        }}>
                          <i className="fas fa-check" style={{ marginLeft: '8px' }}></i>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* معلومات SEO */}
                  {system.seo && (
                    <div style={{ marginBottom: '30px' }}>
                      <h4 style={{ marginBottom: '15px', color: 'var(--secondary-color)' }}>
                        <i className="fas fa-search" style={{ marginLeft: '10px', color: 'var(--primary-color)' }}></i>
                        تحسين محركات البحث (SEO)
                      </h4>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)', marginBottom: '5px' }}>عنوان SEO</div>
                          <div style={{
                            padding: '10px',
                            background: '#f8fafc',
                            borderRadius: '6px',
                            fontSize: '0.9rem',
                            color: 'var(--secondary-color)'
                          }}>
                            {system.seo.title || 'غير محدد'}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)', marginTop: '3px' }}>
                            الطول: {system.seo.title ? system.seo.title.length : 0} حرف
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)', marginBottom: '5px' }}>الكلمة المفتاحية الرئيسية</div>
                          <div style={{
                            padding: '10px',
                            background: '#f8fafc',
                            borderRadius: '6px',
                            fontSize: '0.9rem',
                            color: 'var(--secondary-color)'
                          }}>
                            {system.seo.focusKeyword || 'غير محدد'}
                          </div>
                        </div>
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)', marginBottom: '5px' }}>وصف SEO</div>
                        <div style={{
                          padding: '10px',
                          background: '#f8fafc',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          color: 'var(--secondary-color)',
                          lineHeight: '1.5'
                        }}>
                          {system.seo.description || 'غير محدد'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)', marginTop: '3px' }}>
                          الطول: {system.seo.description ? system.seo.description.length : 0} حرف
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)', marginBottom: '8px' }}>الكلمات المفتاحية</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                            {system.seo.keywords && system.seo.keywords.length > 0 ? (
                              system.seo.keywords.map((keyword, index) => (
                                <span key={index} style={{
                                  padding: '4px 8px',
                                  background: 'var(--primary-light)',
                                  color: 'var(--primary-color)',
                                  borderRadius: '12px',
                                  fontSize: '0.8rem'
                                }}>
                                  {keyword}
                                </span>
                              ))
                            ) : (
                              <span style={{ color: 'var(--gray-color)', fontSize: '0.9rem' }}>لا توجد كلمات مفتاحية</span>
                            )}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)', marginBottom: '8px' }}>رابط الصفحة</div>
                          <div style={{
                            padding: '8px 12px',
                            background: '#f8fafc',
                            borderRadius: '6px',
                            fontSize: '0.9rem',
                            color: 'var(--secondary-color)',
                            fontFamily: 'monospace'
                          }}>
                            {system.seo.slug || 'غير محدد'}
                          </div>
                        </div>
                      </div>

                      {/* تحليل SEO */}
                      <div style={{
                        padding: '15px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)'
                      }}>
                        <h5 style={{ margin: '0 0 15px 0', color: 'var(--secondary-color)' }}>تحليل SEO</h5>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                          <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--secondary-color)', marginBottom: '5px' }}>
                              النقاط الإجمالية
                            </div>
                            <div style={{
                              fontSize: '1.5rem',
                              fontWeight: '600',
                              color: analyzeSEO(system).score >= 70 ? 'var(--success-color)' :
                                     analyzeSEO(system).score >= 40 ? 'var(--warning-color)' :
                                     'var(--danger-color)'
                            }}>
                              {analyzeSEO(system).score}/100
                            </div>
                          </div>

                          {system.seo.focusKeyword && (
                            <div>
                              <div style={{ fontSize: '0.9rem', color: 'var(--secondary-color)', marginBottom: '8px' }}>
                                كثافة الكلمة المفتاحية
                              </div>
                              <div style={{ display: 'grid', gap: '5px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ fontSize: '0.8rem' }}>في العنوان:</span>
                                  <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                                    {calculateKeywordDensity(system.seo.title, system.seo.focusKeyword)}%
                                  </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ fontSize: '0.8rem' }}>في الوصف:</span>
                                  <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                                    {calculateKeywordDensity(system.seo.description, system.seo.focusKeyword)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {analyzeSEO(system).issues.length > 0 && (
                          <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--secondary-color)', marginBottom: '8px' }}>
                              المشاكل المكتشفة:
                            </div>
                            <div style={{ display: 'grid', gap: '5px' }}>
                              {analyzeSEO(system).issues.map((issue, index) => (
                                <div key={index} style={{
                                  padding: '6px 10px',
                                  background: 'var(--danger-light)',
                                  color: 'var(--danger-color)',
                                  borderRadius: '4px',
                                  fontSize: '0.8rem'
                                }}>
                                  <i className="fas fa-exclamation-triangle" style={{ marginLeft: '5px' }}></i>
                                  {issue}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* الملفات */}
                  <div style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h4 style={{ margin: 0, color: 'var(--secondary-color)' }}>الملفات ({system.files.length})</h4>
                      <button
                        className="btn btn-primary"
                        style={{ fontSize: '0.8rem', padding: '8px 15px' }}
                        onClick={() => setShowFileUpload(system.id)}
                      >
                        <i className="fas fa-plus"></i> إضافة ملف
                      </button>
                    </div>
                    {system.files.length > 0 ? (
                      <div style={{ display: 'grid', gap: '10px' }}>
                        {system.files.map((file) => (
                          <div key={file.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '15px',
                            background: '#f8fafc',
                            borderRadius: '10px',
                            border: '1px solid #f1f5f9'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                background: `${getFileColor(file.type)}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: getFileColor(file.type)
                              }}>
                                <i className={getFileIcon(file.type)}></i>
                              </div>
                              <div>
                                <div style={{ fontWeight: '600', color: 'var(--secondary-color)', marginBottom: '3px' }}>
                                  {file.name}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>
                                  {file.size} • تم الرفع في {file.uploadDate}
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                className="action-btn view"
                                style={{ padding: '8px 12px' }}
                              >
                                <i className="fas fa-download"></i>
                              </button>
                              <button
                                className="action-btn delete"
                                style={{ padding: '8px 12px' }}
                                onClick={() => handleDeleteFile(system.id, file.id)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        background: '#f8fafc',
                        borderRadius: '10px',
                        color: 'var(--gray-color)'
                      }}>
                        <i className="fas fa-folder-open" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                        <div>لا توجد ملفات مرفقة</div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setSelectedSystem(null)}
                      className="btn btn-outline"
                      style={{ fontSize: '0.9rem', padding: '10px 20px' }}
                    >
                      إغلاق
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSystem(null)
                        setShowEditSystem(system.id)
                      }}
                      className="btn btn-primary"
                      style={{ fontSize: '0.9rem', padding: '10px 20px' }}
                    >
                      <i className="fas fa-edit"></i> تعديل النظام
                    </button>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </>
  )
}
