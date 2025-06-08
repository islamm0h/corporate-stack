'use client'

import { useState, useEffect } from 'react'

interface SystemFile {
  id: string
  name: string
  size: string
  type: string
  uploadDate: string
  url?: string
}

interface SystemSEO {
  title: string
  description: string
  keywords: string[]
  metaDescription: string
  slug: string
  focusKeyword: string
}

interface System {
  id: string
  name: string
  description: string
  version: string
  status: string
  category: string
  features: string[]
  seo?: SystemSEO
  files: SystemFile[]
  createdAt: string
  updatedAt: string
}

export default function SystemsManagement() {
  const [systems, setSystems] = useState<System[]>([])
  const [loading, setLoading] = useState(true)
  // جلب الأنظمة من قاعدة البيانات
  useEffect(() => {
    const fetchSystems = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/systems')
        const result = await response.json()

        if (result.success) {
          // تحويل البيانات إلى التنسيق المطلوب
          const formattedSystems = result.data.map((system: any) => ({
            id: system.id,
            name: system.name,
            description: system.description || '',
            version: '1.0.0',
            status: system.isActive ? 'active' : 'inactive',
            category: system.category || 'غير محدد',
            features: system.features || [],
            seo: system.seoTitle ? {
              title: system.seoTitle,
              description: system.seoDescription || '',
              keywords: system.seoKeywords || [],
              metaDescription: system.seoDescription || '',
              slug: system.slug || '',
              focusKeyword: system.seoKeywords?.[0] || ''
            } : undefined,
            files: [],
            createdAt: system.createdAt,
            updatedAt: system.updatedAt
          }))
          setSystems(formattedSystems)
        } else {
          console.error('Error fetching systems:', result.error)
          setSystems([])
        }
      } catch (error) {
        console.error('Error fetching systems:', error)
        setSystems([])
      } finally {
        setLoading(false)
      }
    }

    fetchSystems()
  }, [])

  const [selectedSystem, setSelectedSystem] = useState<string | null>(null)
  const [showAddSystem, setShowAddSystem] = useState(false)
  const [showEditSystem, setShowEditSystem] = useState<string | null>(null)
  const [editingSystem, setEditingSystem] = useState<any>(null)
  const [showFileUpload, setShowFileUpload] = useState<string | null>(null)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  const [newSystem, setNewSystem] = useState({
    name: '',
    description: '',
    category: '',
    features: [''],
    status: 'active',
    version: '1.0.0',
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
    if (type.includes('pdf')) return 'fas fa-file-pdf'
    if (type.includes('image')) return 'fas fa-file-image'
    if (type.includes('video')) return 'fas fa-file-video'
    if (type.includes('audio')) return 'fas fa-file-audio'
    if (type.includes('word') || type.includes('document')) return 'fas fa-file-word'
    if (type.includes('excel') || type.includes('spreadsheet')) return 'fas fa-file-excel'
    if (type.includes('powerpoint') || type.includes('presentation')) return 'fas fa-file-powerpoint'
    if (type.includes('zip') || type.includes('rar') || type.includes('compressed')) return 'fas fa-file-archive'
    if (type.includes('text')) return 'fas fa-file-alt'
    return 'fas fa-file'
  }

  const getFileColor = (type: string) => {
    if (type.includes('pdf')) return '#dc3545'
    if (type.includes('image')) return '#20c997'
    if (type.includes('video')) return '#6f42c1'
    if (type.includes('audio')) return '#fd7e14'
    if (type.includes('word') || type.includes('document')) return '#0d6efd'
    if (type.includes('excel') || type.includes('spreadsheet')) return '#198754'
    if (type.includes('powerpoint') || type.includes('presentation')) return '#fd7e14'
    if (type.includes('zip') || type.includes('rar') || type.includes('compressed')) return '#6c757d'
    if (type.includes('text')) return '#0dcaf0'
    return '#6c757d'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleAddSystem = async () => {
    try {
      const systemToAdd = {
        name: newSystem.name,
        slug: newSystem.seo.slug || newSystem.name.toLowerCase().replace(/\s+/g, '-'),
        description: newSystem.description,
        shortDescription: newSystem.description.substring(0, 255),
        category: newSystem.category,
        features: newSystem.features.filter(f => f.trim() !== ''),
        isActive: newSystem.status === 'active',
        seoTitle: newSystem.seo.title,
        seoDescription: newSystem.seo.description,
        seoKeywords: newSystem.seo.keywords.filter(k => k.trim() !== '')
      }

      const response = await fetch('/api/systems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(systemToAdd),
      })

      const result = await response.json()

      if (result.success) {
        // إعادة جلب الأنظمة لضمان التحديث
        const systemsResponse = await fetch('/api/systems')
        const systemsResult = await systemsResponse.json()
        if (systemsResult.success) {
          setSystems(systemsResult.data)
        }

        setNewSystem({
          name: '',
          description: '',
          category: '',
          features: [''],
          status: 'active',
          version: '1.0.0',
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
        alert('تم إضافة النظام بنجاح!')
      } else {
        alert('فشل في إضافة النظام: ' + result.error)
      }
    } catch (error) {
      console.error('Error adding system:', error)
      alert('حدث خطأ أثناء إضافة النظام')
    }
  }

  const handleDeleteSystem = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا النظام؟')) {
      try {
        const response = await fetch(`/api/systems?id=${id}`, {
          method: 'DELETE',
        })

        const result = await response.json()

        if (result.success) {
          // إعادة جلب الأنظمة لضمان التحديث
          const systemsResponse = await fetch('/api/systems')
          const systemsResult = await systemsResponse.json()
          if (systemsResult.success) {
            // تحويل البيانات إلى التنسيق المطلوب
            const formattedSystems = systemsResult.data.map((system: any) => ({
              id: system.id,
              name: system.name,
              description: system.description || '',
              version: '1.0.0',
              status: system.isActive ? 'active' : 'inactive',
              category: system.category || 'غير محدد',
              features: system.features || [],
              seo: system.seoTitle ? {
                title: system.seoTitle,
                description: system.seoDescription || '',
                keywords: system.seoKeywords || [],
                metaDescription: system.seoDescription || '',
                slug: system.slug || '',
                focusKeyword: system.seoKeywords?.[0] || ''
              } : undefined,
              files: [],
              createdAt: system.createdAt,
              updatedAt: system.updatedAt
            }))
            setSystems(formattedSystems)
          }
          alert('تم حذف النظام بنجاح!')
        } else {
          alert('فشل في حذف النظام: ' + result.error)
        }
      } catch (error) {
        console.error('Error deleting system:', error)
        alert('حدث خطأ أثناء حذف النظام')
      }
    }
  }

  const handleEditSystem = async (systemData: any) => {
    try {
      const response = await fetch('/api/systems', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(systemData),
      })

      const result = await response.json()

      if (result.success) {
        // إعادة جلب الأنظمة لضمان التحديث
        const systemsResponse = await fetch('/api/systems')
        const systemsResult = await systemsResponse.json()
        if (systemsResult.success) {
          // تحويل البيانات إلى التنسيق المطلوب
          const formattedSystems = systemsResult.data.map((system: any) => ({
            id: system.id,
            name: system.name,
            description: system.description || '',
            version: '1.0.0',
            status: system.isActive ? 'active' : 'inactive',
            category: system.category || 'غير محدد',
            features: system.features || [],
            seo: system.seoTitle ? {
              title: system.seoTitle,
              description: system.seoDescription || '',
              keywords: system.seoKeywords || [],
              metaDescription: system.seoDescription || '',
              slug: system.slug || '',
              focusKeyword: system.seoKeywords?.[0] || ''
            } : undefined,
            files: [],
            createdAt: system.createdAt,
            updatedAt: system.updatedAt
          }))
          setSystems(formattedSystems)
        }
        alert('تم تحديث النظام بنجاح!')
        return true
      } else {
        alert('فشل في تحديث النظام: ' + result.error)
        return false
      }
    } catch (error) {
      console.error('Error updating system:', error)
      alert('حدث خطأ أثناء تحديث النظام')
      return false
    }
  }

  const openEditSystem = (system: System) => {
    setEditingSystem({
      id: system.id,
      name: system.name,
      description: system.description,
      category: system.category,
      features: [...system.features],
      status: system.status,
      version: system.version,
      seo: system.seo ? {
        title: system.seo.title,
        description: system.seo.description,
        keywords: [...system.seo.keywords],
        metaDescription: system.seo.metaDescription,
        slug: system.seo.slug,
        focusKeyword: system.seo.focusKeyword
      } : {
        title: '',
        description: '',
        keywords: [''],
        metaDescription: '',
        slug: '',
        focusKeyword: ''
      }
    })
    setShowEditSystem(system.id)
  }

  const handleFileUpload = async (systemId: string, file: any) => {
    try {
      setUploadingFile(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('systemId', systemId)

      const response = await fetch('/api/systems/files', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setSystems(systems.map(system =>
          system.id === systemId
            ? { ...system, files: [...(system.files || []), result.data] }
            : system
        ))
        alert('تم رفع الملف بنجاح!')
      } else {
        alert('فشل في رفع الملف: ' + result.error)
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('حدث خطأ أثناء رفع الملف')
    } finally {
      setUploadingFile(false)
    }
  }

  const handleDeleteFile = async (systemId: string, fileId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الملف؟')) {
      try {
        const response = await fetch(`/api/systems/files/${fileId}`, {
          method: 'DELETE',
        })

        const result = await response.json()

        if (result.success) {
          setSystems(systems.map(system =>
            system.id === systemId
              ? { ...system, files: (system.files || []).filter(f => f.id !== fileId) }
              : system
          ))
          alert('تم حذف الملف بنجاح!')
        } else {
          alert('فشل في حذف الملف: ' + result.error)
        }
      } catch (error) {
        console.error('Error deleting file:', error)
        alert('حدث خطأ أثناء حذف الملف')
      }
    }
  }

  const categories = [...new Set(systems.map(s => s.category))]

  // دالة إضافة الأنظمة الأساسية
  const handleInitializeBasicSystems = async () => {
    if (confirm('هل تريد إضافة الأنظمة الأساسية؟ سيتم إضافة 5 أنظمة أساسية جاهزة للتعديل.')) {
      try {
        const response = await fetch('/api/admin/systems/initialize', {
          method: 'POST',
        })

        const result = await response.json()

        if (result.success) {
          // إعادة جلب الأنظمة لضمان التحديث
          const systemsResponse = await fetch('/api/systems')
          const systemsResult = await systemsResponse.json()
          if (systemsResult.success) {
            // تحويل البيانات إلى التنسيق المطلوب
            const formattedSystems = systemsResult.data.map((system: any) => ({
              id: system.id,
              name: system.name,
              description: system.description || '',
              version: '1.0.0',
              status: system.isActive ? 'active' : 'inactive',
              category: system.category || 'غير محدد',
              features: system.features || [],
              seo: system.seoTitle ? {
                title: system.seoTitle,
                description: system.seoDescription || '',
                keywords: system.seoKeywords || [],
                metaDescription: system.seoDescription || '',
                slug: system.slug || '',
                focusKeyword: system.seoKeywords?.[0] || ''
              } : undefined,
              files: [],
              createdAt: system.createdAt,
              updatedAt: system.updatedAt
            }))
            setSystems(formattedSystems)
          }
          alert(`تم إضافة ${result.count} أنظمة أساسية بنجاح!`)
        } else {
          alert('فشل في إضافة الأنظمة الأساسية: ' + result.error)
        }
      } catch (error) {
        console.error('Error initializing basic systems:', error)
        alert('حدث خطأ أثناء إضافة الأنظمة الأساسية')
      }
    }
  }

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
            <div className="stat-value">{systems.reduce((total, system) => total + (system.files?.length || 0), 0)}</div>
            <div className="stat-label">إجمالي الملفات</div>
          </div>
        </div>
      </div>

      {/* أدوات البحث والفلترة */}
      <div className="data-table-container">
        <div className="data-table-header">
          <h3 className="data-table-title">إدارة الأنظمة</h3>
          <div className="data-table-actions" style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.9rem', padding: '10px 20px' }}
              onClick={handleInitializeBasicSystems}
            >
              <i className="fas fa-download"></i> إضافة الأنظمة الأساسية
            </button>
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
        <div style={{ padding: '30px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-color)' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
              <div>جاري تحميل الأنظمة...</div>
            </div>
          ) : filteredSystems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-color)' }}>
              <i className="fas fa-cogs" style={{ fontSize: '3rem', marginBottom: '15px' }}></i>
              <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px' }}>
                لا توجد أنظمة
              </div>
              <div style={{ marginBottom: '20px' }}>
                {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                  ? 'لا توجد أنظمة تطابق معايير البحث'
                  : 'لا توجد أنظمة في قاعدة البيانات. أضف نظام جديد للبدء.'
                }
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  className="btn btn-secondary"
                  onClick={handleInitializeBasicSystems}
                >
                  <i className="fas fa-download"></i> إضافة الأنظمة الأساسية
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAddSystem(true)}
                >
                  <i className="fas fa-plus"></i> إضافة نظام جديد
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px' }}>
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
                    الملفات ({system.files?.length || 0})
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
                {(system.files && system.files.length > 0) ? (
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
                        <span style={{ color: 'var(--gray-color)' }}>{typeof file.size === 'number' ? formatFileSize(file.size) : file.size}</span>
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
                  style={{ padding: '8px 12px' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedSystem(system.id)
                  }}
                >
                  <i className="fas fa-eye"></i> تفاصيل
                </button>
                <button
                  className="action-btn view"
                  style={{ padding: '8px 12px' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(`/systems/${system.seo?.slug || system.name.toLowerCase().replace(/\s+/g, '-')}`, '_blank')
                  }}
                >
                  <i className="fas fa-external-link-alt"></i> عرض
                </button>
                <button
                  className="action-btn edit"
                  style={{ flex: 1, padding: '8px 12px' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    openEditSystem(system)
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
          )}
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
        <div
          style={{
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
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowFileUpload(null)
            }
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '15px',
              padding: '30px',
              width: '90%',
              maxWidth: '500px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h3 style={{ margin: 0, color: 'var(--secondary-color)' }}>رفع ملف جديد</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowFileUpload(null)
                }}
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
              marginBottom: '20px',
              position: 'relative'
            }}>
              {uploadingFile ? (
                <>
                  <i className="fas fa-spinner fa-spin" style={{
                    fontSize: '3rem',
                    color: 'var(--primary-color)',
                    marginBottom: '15px'
                  }}></i>
                  <div style={{ marginBottom: '10px', color: 'var(--secondary-color)', fontWeight: '600' }}>
                    جاري رفع الملف...
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                    يرجى الانتظار حتى اكتمال الرفع
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
              <input
                type="file"
                multiple
                disabled={uploadingFile}
                onChange={(e) => {
                  if (e.target.files && showFileUpload && !uploadingFile) {
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
                  cursor: uploadingFile ? 'not-allowed' : 'pointer'
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
                onClick={(e) => {
                  e.stopPropagation()
                  setShowFileUpload(null)
                }}
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
                            <div style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>{system.createdAt}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)', marginBottom: '5px' }}>آخر تحديث</div>
                            <div style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>{system.updatedAt}</div>
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
                                  background: 'var(--danger-color)',
                                  color: 'white',
                                  borderRadius: '4px',
                                  fontSize: '0.8rem',
                                  fontWeight: '500'
                                }}>
                                  <i className="fas fa-exclamation-triangle" style={{ marginLeft: '5px', color: 'white' }}></i>
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

      {/* نافذة تعديل النظام */}
      {showEditSystem && editingSystem && (
        <div className="modal-overlay" style={{
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
          <div className="modal-content" style={{
            background: 'white',
            borderRadius: '15px',
            padding: '30px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h3 style={{ margin: 0, color: 'var(--secondary-color)' }}>تعديل النظام</h3>
              <button
                onClick={() => {
                  setShowEditSystem(null)
                  setEditingSystem(null)
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: 'var(--gray-color)',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault()
              const success = await handleEditSystem({
                id: editingSystem.id,
                name: editingSystem.name,
                slug: editingSystem.seo.slug || editingSystem.name.toLowerCase().replace(/\s+/g, '-'),
                description: editingSystem.description,
                shortDescription: editingSystem.description.substring(0, 255),
                category: editingSystem.category,
                features: editingSystem.features.filter((f: string) => f.trim() !== ''),
                isActive: editingSystem.status === 'active',
                seoTitle: editingSystem.seo.title,
                seoDescription: editingSystem.seo.description,
                seoKeywords: editingSystem.seo.keywords.filter((k: string) => k.trim() !== '')
              })
              if (success) {
                setShowEditSystem(null)
                setEditingSystem(null)
              }
            }}>
              {/* نفس محتوى نموذج الإضافة ولكن مع البيانات المحملة */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--secondary-color)' }}>
                    اسم النظام *
                  </label>
                  <input
                    type="text"
                    value={editingSystem.name}
                    onChange={(e) => setEditingSystem({...editingSystem, name: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--secondary-color)' }}>
                    الفئة *
                  </label>
                  <select
                    value={editingSystem.category}
                    onChange={(e) => setEditingSystem({...editingSystem, category: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '1rem'
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
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--secondary-color)' }}>
                  الوصف *
                </label>
                <textarea
                  value={editingSystem.description}
                  onChange={(e) => setEditingSystem({...editingSystem, description: e.target.value})}
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditSystem(null)
                    setEditingSystem(null)
                  }}
                  style={{
                    padding: '12px 24px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '8px',
                    background: 'white',
                    color: 'var(--secondary-color)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'var(--primary-color)',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fas fa-save" style={{ marginLeft: '8px' }}></i>
                  حفظ التغييرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
