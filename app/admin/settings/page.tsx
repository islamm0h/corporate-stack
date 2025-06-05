'use client'

import { useState, useEffect } from 'react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [isLoading, setIsLoading] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)

  const [settings, setSettings] = useState({
    // الإعدادات العامة
    general: {
      siteName: 'شركة الحلول التقنية المتقدمة',
      siteDescription: 'نقدم أفضل الحلول التقنية والأنظمة المتطورة للشركات والمؤسسات',
      contactEmail: 'info@techsolutions.com',
      contactPhone: '+966501234567',
      address: 'الرياض، المملكة العربية السعودية',
      timezone: 'Asia/Riyadh',
      language: 'ar',
      currency: 'SAR',
      maintenanceMode: false,
      userRegistration: true
    },

    // إعدادات SEO
    seo: {
      homeTitle: 'الحلول التقنية المتقدمة - أنظمة وبرمجيات متطورة',
      homeDescription: 'نقدم أفضل الحلول التقنية والأنظمة المتطورة للشركات مع دعم فني متميز وخدمات احترافية',
      homeKeywords: ['حلول تقنية', 'أنظمة إدارة', 'برمجيات', 'تطوير', 'دعم فني', 'استشارات تقنية'],
      focusKeyword: 'حلول تقنية',
      metaAuthor: 'شركة الحلول التقنية المتقدمة',
      ogImage: '/images/og-image.jpg',
      twitterCard: 'summary_large_image',
      canonicalUrl: 'https://techsolutions.com',
      robotsTxt: 'index, follow',
      sitemapEnabled: true,
      analyticsId: 'G-XXXXXXXXXX',
      searchConsoleId: 'XXXXXXXXXX'
    },

    // إعدادات الأمان
    security: {
      sslEnabled: true,
      sslCertificate: {
        issuer: 'Let\'s Encrypt',
        validFrom: '2024-01-01',
        validTo: '2024-12-31',
        status: 'active'
      },
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: true
      },
      ipWhitelist: ['192.168.1.0/24'],
      bruteForceProtection: true,
      maxLoginAttempts: 5
    },

    // إعدادات النسخ الاحتياطي
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      backupTime: '02:00',
      retentionDays: 30,
      backupLocation: 'cloud',
      cloudProvider: 'aws',
      lastBackup: '2024-01-15 02:00:00',
      backupSize: '2.3 GB',
      backupStatus: 'success'
    },

    // إعدادات الأداء
    performance: {
      cacheEnabled: true,
      cacheExpiry: 3600,
      compressionEnabled: true,
      minifyCSS: true,
      minifyJS: true,
      imageOptimization: true,
      lazyLoading: true,
      cdnEnabled: true,
      cdnProvider: 'cloudflare'
    },

    // إعدادات الإشعارات
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      systemAlerts: true,
      backupAlerts: true,
      securityAlerts: true,
      performanceAlerts: false
    },

    // إعدادات API
    api: {
      apiEnabled: true,
      apiVersion: 'v1',
      rateLimit: 1000,
      rateLimitWindow: 3600,
      apiKey: 'sk_live_xxxxxxxxxxxxxxxxxx',
      webhookUrl: 'https://api.techsolutions.com/webhook',
      corsEnabled: true,
      allowedOrigins: ['https://techsolutions.com', 'https://app.techsolutions.com']
    }
  })

  const tabs = [
    { id: 'general', name: 'الإعدادات العامة', icon: 'fas fa-cog' },
    { id: 'seo', name: 'تحسين محركات البحث', icon: 'fas fa-search' },
    { id: 'security', name: 'الأمان و SSL', icon: 'fas fa-shield-alt' },
    { id: 'backup', name: 'النسخ الاحتياطي', icon: 'fas fa-database' },
    { id: 'performance', name: 'الأداء والتحسين', icon: 'fas fa-tachometer-alt' },
    { id: 'notifications', name: 'الإشعارات', icon: 'fas fa-bell' },
    { id: 'api', name: 'إعدادات API', icon: 'fas fa-code' }
  ]

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

  // دالة تحليل SEO للصفحة الرئيسية
  const analyzeSEO = () => {
    const issues = []
    let score = 0

    // فحص العنوان
    if (!settings.seo.homeTitle) {
      issues.push('عنوان الصفحة الرئيسية مفقود')
    } else {
      if (settings.seo.homeTitle.length < 30) issues.push('العنوان قصير جداً (أقل من 30 حرف)')
      if (settings.seo.homeTitle.length > 60) issues.push('العنوان طويل جداً (أكثر من 60 حرف)')
      else score += 20
    }

    // فحص الوصف
    if (!settings.seo.homeDescription) {
      issues.push('وصف الصفحة الرئيسية مفقود')
    } else {
      if (settings.seo.homeDescription.length < 120) issues.push('الوصف قصير جداً (أقل من 120 حرف)')
      if (settings.seo.homeDescription.length > 160) issues.push('الوصف طويل جداً (أكثر من 160 حرف)')
      else score += 20
    }

    // فحص الكلمة المفتاحية الرئيسية
    if (!settings.seo.focusKeyword) {
      issues.push('الكلمة المفتاحية الرئيسية مفقودة')
    } else {
      score += 20

      // فحص كثافة الكلمة المفتاحية في العنوان
      const titleDensity = calculateKeywordDensity(settings.seo.homeTitle, settings.seo.focusKeyword)
      if (titleDensity === '0.0') issues.push('الكلمة المفتاحية غير موجودة في العنوان')
      else score += 10

      // فحص كثافة الكلمة المفتاحية في الوصف
      const descDensity = calculateKeywordDensity(settings.seo.homeDescription, settings.seo.focusKeyword)
      if (descDensity === '0.0') issues.push('الكلمة المفتاحية غير موجودة في الوصف')
      else score += 10
    }

    // فحص الكلمات المفتاحية
    if (!settings.seo.homeKeywords || settings.seo.homeKeywords.length === 0) {
      issues.push('الكلمات المفتاحية مفقودة')
    } else {
      if (settings.seo.homeKeywords.length < 3) issues.push('عدد قليل من الكلمات المفتاحية (أقل من 3)')
      if (settings.seo.homeKeywords.length > 10) issues.push('عدد كبير من الكلمات المفتاحية (أكثر من 10)')
      else score += 10
    }

    // فحص الإعدادات الإضافية
    if (settings.seo.analyticsId) score += 5
    if (settings.seo.searchConsoleId) score += 5
    if (settings.seo.sitemapEnabled) score += 5
    if (settings.seo.ogImage) score += 5

    return { score, issues }
  }

  const updateSettings = (category: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }))
  }

  const updateKeyword = (index: number, value: string) => {
    const newKeywords = [...settings.seo.homeKeywords]
    newKeywords[index] = value
    updateSettings('seo', 'homeKeywords', newKeywords)
  }

  const addKeyword = () => {
    updateSettings('seo', 'homeKeywords', [...settings.seo.homeKeywords, ''])
  }

  const removeKeyword = (index: number) => {
    const newKeywords = settings.seo.homeKeywords.filter((_, i) => i !== index)
    updateSettings('seo', 'homeKeywords', newKeywords)
  }

  // دالة توليد الكلمات المفتاحية بالذكاء الاصطناعي
  const generateKeywordsWithAI = async () => {
    setIsLoading(true)

    // محاكاة استدعاء API للذكاء الاصطناعي
    setTimeout(() => {
      const aiGeneratedKeywords = [
        'حلول تقنية متطورة',
        'أنظمة إدارة ذكية',
        'برمجيات احترافية',
        'تطوير تطبيقات',
        'استشارات تقنية',
        'دعم فني متخصص',
        'حلول سحابية',
        'أمان المعلومات',
        'تحليل البيانات',
        'ذكاء اصطناعي'
      ]

      // حساب النسبة المئوية لكل كلمة مفتاحية
      const keywordsWithDensity = aiGeneratedKeywords.map(keyword => ({
        keyword,
        titleDensity: calculateKeywordDensity(settings.seo.homeTitle, keyword),
        descriptionDensity: calculateKeywordDensity(settings.seo.homeDescription, keyword),
        relevanceScore: Math.floor(Math.random() * 40) + 60 // نقاط الصلة من 60-100
      }))

      // ترتيب حسب نقاط الصلة
      keywordsWithDensity.sort((a, b) => b.relevanceScore - a.relevanceScore)

      // أخذ أفضل 6 كلمات مفتاحية
      const topKeywords = keywordsWithDensity.slice(0, 6).map(item => item.keyword)

      updateSettings('seo', 'homeKeywords', topKeywords)
      setIsLoading(false)

      // عرض تفاصيل الكلمات المولدة
      setAiKeywordSuggestions(keywordsWithDensity)
      setShowAISuggestions(true)
    }, 3000)
  }

  const [aiKeywordSuggestions, setAiKeywordSuggestions] = useState([])
  const [showAISuggestions, setShowAISuggestions] = useState(false)

  // دالة تطبيق كلمة مفتاحية مقترحة
  const applySuggestedKeyword = (keyword: string) => {
    const currentKeywords = [...settings.seo.homeKeywords]
    if (!currentKeywords.includes(keyword)) {
      currentKeywords.push(keyword)
      updateSettings('seo', 'homeKeywords', currentKeywords)
    }
  }

  // دالة تطبيق جميع الكلمات المفتاحية المقترحة
  const applyAllSuggestions = () => {
    const topKeywords = aiKeywordSuggestions
      .filter(suggestion => suggestion.relevanceScore >= 70)
      .slice(0, 8)
      .map(suggestion => suggestion.keyword)

    updateSettings('seo', 'homeKeywords', topKeywords)
    setShowAISuggestions(false)
  }

  const saveSettings = async () => {
    setIsLoading(true)

    // محاكاة حفظ الإعدادات
    setTimeout(() => {
      setIsLoading(false)
      setLastSaved(new Date())
    }, 2000)
  }

  const createBackup = async () => {
    setIsLoading(true)

    // محاكاة إنشاء نسخة احتياطية
    setTimeout(() => {
      updateSettings('backup', 'lastBackup', new Date().toLocaleString('ar-SA'))
      updateSettings('backup', 'backupStatus', 'success')
      setIsLoading(false)
    }, 3000)
  }

  const testSSL = async () => {
    setIsLoading(true)

    // محاكاة فحص SSL
    setTimeout(() => {
      setIsLoading(false)
      alert('شهادة SSL صالحة وتعمل بشكل صحيح')
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'success':
      case 'enabled':
        return 'var(--success-color)'
      case 'warning':
        return 'var(--warning-color)'
      case 'error':
      case 'disabled':
        return 'var(--danger-color)'
      default:
        return 'var(--gray-color)'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط'
      case 'success': return 'نجح'
      case 'enabled': return 'مفعل'
      case 'warning': return 'تحذير'
      case 'error': return 'خطأ'
      case 'disabled': return 'معطل'
      default: return status
    }
  }

  return (
    <>
      {/* إحصائيات الإعدادات */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-cogs"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">42</div>
            <div className="stat-label">إعدادات نشطة</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-shield-check"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{settings.security.sslEnabled ? '100%' : '85%'}</div>
            <div className="stat-label">مستوى الأمان</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-search"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{analyzeSEO().score}</div>
            <div className="stat-label">نقاط SEO</div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-database"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{settings.backup.retentionDays}</div>
            <div className="stat-label">نسخ احتياطية</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px', height: 'calc(100vh - 200px)' }}>
        {/* الشريط الجانبي للتبويبات */}
        <div style={{
          width: '280px',
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
          height: 'fit-content'
        }}>
          <h3 style={{
            margin: '0 0 25px 0',
            color: 'var(--secondary-color)',
            fontSize: '1.3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className="fas fa-cogs" style={{ color: 'var(--primary-color)' }}></i>
            إعدادات النظام
          </h3>

          <div style={{ display: 'grid', gap: '8px' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '15px 20px',
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : 'var(--secondary-color)',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  textAlign: 'right',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = '#f8fafc'
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <i className={tab.icon}></i>
                {tab.name}
              </button>
            ))}
          </div>

          {/* معلومات آخر حفظ */}
          {lastSaved && (
            <div style={{
              marginTop: '25px',
              padding: '15px',
              background: 'var(--success-light)',
              borderRadius: '10px',
              fontSize: '0.9rem',
              color: 'var(--success-color)'
            }}>
              <i className="fas fa-check-circle" style={{ marginLeft: '8px' }}></i>
              آخر حفظ: {lastSaved.toLocaleTimeString('ar-SA')}
            </div>
          )}
        </div>

        {/* المحتوى الرئيسي */}
        <div style={{
          flex: 1,
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
          overflow: 'auto'
        }}>
          {/* رأس المحتوى */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            paddingBottom: '20px',
            borderBottom: '2px solid #f1f5f9'
          }}>
            <h2 style={{
              margin: 0,
              color: 'var(--secondary-color)',
              fontSize: '1.8rem'
            }}>
              {tabs.find(tab => tab.id === activeTab)?.name}
            </h2>

            <button
              onClick={saveSettings}
              disabled={isLoading}
              style={{
                padding: '12px 25px',
                background: isLoading ? '#94a3b8' : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> جاري الحفظ...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i> حفظ الإعدادات
                </>
              )}
            </button>
          </div>

          {/* محتوى الإعدادات */}
          <div>
            {/* الإعدادات العامة */}
            {activeTab === 'general' && (
              <div style={{ display: 'grid', gap: '30px' }}>
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
                      اسم الموقع *
                    </label>
                    <input
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) => updateSettings('general', 'siteName', e.target.value)}
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
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      value={settings.general.contactEmail}
                      onChange={(e) => updateSettings('general', 'contactEmail', e.target.value)}
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
                    وصف الموقع *
                  </label>
                  <textarea
                    value={settings.general.siteDescription}
                    onChange={(e) => updateSettings('general', 'siteDescription', e.target.value)}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      background: '#f8fafc',
                      resize: 'vertical',
                      transition: 'all 0.3s ease',
                      lineHeight: '1.6'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary-color)'
                      e.target.style.background = 'white'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border-color)'
                      e.target.style.background = '#f8fafc'
                    }}
                  />
                  <div style={{
                    color: 'var(--gray-color)',
                    fontSize: '0.9rem',
                    marginTop: '5px',
                    textAlign: 'left'
                  }}>
                    {settings.general.siteDescription.length} حرف
                  </div>
                </div>

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
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={settings.general.contactPhone}
                      onChange={(e) => updateSettings('general', 'contactPhone', e.target.value)}
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
                      العملة
                    </label>
                    <select
                      value={settings.general.currency}
                      onChange={(e) => updateSettings('general', 'currency', e.target.value)}
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
                      <option value="SAR">ريال سعودي (SAR)</option>
                      <option value="USD">دولار أمريكي (USD)</option>
                      <option value="EUR">يورو (EUR)</option>
                      <option value="AED">درهم إماراتي (AED)</option>
                    </select>
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
                    العنوان
                  </label>
                  <input
                    type="text"
                    value={settings.general.address}
                    onChange={(e) => updateSettings('general', 'address', e.target.value)}
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
                  />
                </div>

                {/* إعدادات النظام */}
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
                    <i className="fas fa-cogs" style={{ color: 'var(--primary-color)' }}></i>
                    إعدادات النظام
                  </h3>

                  <div style={{ display: 'grid', gap: '20px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '15px 20px',
                      background: 'white',
                      borderRadius: '10px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>
                          وضع الصيانة
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                          تفعيل وضع الصيانة سيمنع الوصول للموقع مؤقتاً
                        </div>
                      </div>
                      <label style={{
                        position: 'relative',
                        display: 'inline-block',
                        width: '60px',
                        height: '34px'
                      }}>
                        <input
                          type="checkbox"
                          checked={settings.general.maintenanceMode}
                          onChange={(e) => updateSettings('general', 'maintenanceMode', e.target.checked)}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: settings.general.maintenanceMode ? 'var(--primary-color)' : '#ccc',
                          transition: '0.4s',
                          borderRadius: '34px'
                        }}>
                          <span style={{
                            position: 'absolute',
                            content: '',
                            height: '26px',
                            width: '26px',
                            left: settings.general.maintenanceMode ? '30px' : '4px',
                            bottom: '4px',
                            backgroundColor: 'white',
                            transition: '0.4s',
                            borderRadius: '50%'
                          }}></span>
                        </span>
                      </label>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '15px 20px',
                      background: 'white',
                      borderRadius: '10px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>
                          تسجيل المستخدمين الجدد
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                          السماح للمستخدمين الجدد بإنشاء حسابات
                        </div>
                      </div>
                      <label style={{
                        position: 'relative',
                        display: 'inline-block',
                        width: '60px',
                        height: '34px'
                      }}>
                        <input
                          type="checkbox"
                          checked={settings.general.userRegistration}
                          onChange={(e) => updateSettings('general', 'userRegistration', e.target.checked)}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: settings.general.userRegistration ? 'var(--success-color)' : '#ccc',
                          transition: '0.4s',
                          borderRadius: '34px'
                        }}>
                          <span style={{
                            position: 'absolute',
                            content: '',
                            height: '26px',
                            width: '26px',
                            left: settings.general.userRegistration ? '30px' : '4px',
                            bottom: '4px',
                            backgroundColor: 'white',
                            transition: '0.4s',
                            borderRadius: '50%'
                          }}></span>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* إعدادات SEO */}
            {activeTab === 'seo' && (
              <div style={{ display: 'grid', gap: '30px' }}>
                {/* تحليل SEO المباشر */}
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
                    تحليل SEO للصفحة الرئيسية
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
                      {settings.seo.focusKeyword && (
                        <div style={{ marginBottom: '15px' }}>
                          <h4 style={{ margin: '0 0 10px 0', color: 'var(--secondary-color)' }}>
                            كثافة الكلمة المفتاحية &quot;{settings.seo.focusKeyword}&quot;
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
                                {calculateKeywordDensity(settings.seo.homeTitle, settings.seo.focusKeyword)}%
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
                                {calculateKeywordDensity(settings.seo.homeDescription, settings.seo.focusKeyword)}%
                              </span>
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
                                background: 'var(--danger-light)',
                                color: 'var(--danger-color)',
                                borderRadius: '6px',
                                fontSize: '0.9rem'
                              }}>
                                <i className="fas fa-exclamation-triangle" style={{ marginLeft: '8px' }}></i>
                                {issue}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* إعدادات SEO الأساسية */}
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
                      عنوان الصفحة الرئيسية *
                    </label>
                    <input
                      type="text"
                      value={settings.seo.homeTitle}
                      onChange={(e) => updateSettings('seo', 'homeTitle', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '15px 20px',
                        border: '2px solid var(--border-color)',
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
                        e.target.style.borderColor = 'var(--border-color)'
                        e.target.style.background = '#f8fafc'
                      }}
                    />
                    <div style={{
                      color: settings.seo.homeTitle.length >= 30 && settings.seo.homeTitle.length <= 60 ? 'var(--success-color)' : 'var(--warning-color)',
                      fontSize: '0.9rem',
                      marginTop: '5px',
                      fontWeight: '600'
                    }}>
                      {settings.seo.homeTitle.length}/60 حرف
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
                      value={settings.seo.focusKeyword}
                      onChange={(e) => updateSettings('seo', 'focusKeyword', e.target.value)}
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
                    وصف الصفحة الرئيسية *
                  </label>
                  <textarea
                    value={settings.seo.homeDescription}
                    onChange={(e) => updateSettings('seo', 'homeDescription', e.target.value)}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      border: '2px solid var(--border-color)',
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
                      e.target.style.borderColor = 'var(--border-color)'
                      e.target.style.background = '#f8fafc'
                    }}
                  />
                  <div style={{
                    color: settings.seo.homeDescription.length >= 120 && settings.seo.homeDescription.length <= 160 ? 'var(--success-color)' : 'var(--warning-color)',
                    fontSize: '0.9rem',
                    marginTop: '5px',
                    fontWeight: '600'
                  }}>
                    {settings.seo.homeDescription.length}/160 حرف
                  </div>
                </div>

                {/* الكلمات المفتاحية */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: '600',
                    color: 'var(--secondary-color)',
                    fontSize: '1rem'
                  }}>
                    الكلمات المفتاحية للصفحة الرئيسية
                  </label>
                  <div style={{ display: 'grid', gap: '15px' }}>
                    {settings.seo.homeKeywords.map((keyword, index) => (
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
                        {settings.seo.homeKeywords.length > 1 && (
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
                      disabled={isLoading}
                      style={{
                        padding: '12px 20px',
                        background: isLoading ? '#94a3b8' : 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) {
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          e.currentTarget.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.3)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading) {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = 'none'
                        }
                      }}
                    >
                      {isLoading ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i> جاري التوليد...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-robot"></i> توليد بالذكاء الاصطناعي
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* عرض اقتراحات الذكاء الاصطناعي */}
                {aiKeywordSuggestions.length > 0 && (
                  <div style={{
                    padding: '25px',
                    background: 'linear-gradient(135deg, #f0f4ff, #e6f3ff)',
                    borderRadius: '15px',
                    border: '2px solid var(--primary-light)',
                    marginTop: '20px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px'
                    }}>
                      <h4 style={{
                        margin: 0,
                        color: 'var(--secondary-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <i className="fas fa-robot" style={{ color: 'var(--primary-color)' }}></i>
                        اقتراحات الذكاء الاصطناعي للكلمات المفتاحية
                      </h4>
                      <button
                        onClick={() => setShowAISuggestions(!showAISuggestions)}
                        style={{
                          padding: '8px 15px',
                          background: 'var(--primary-color)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {showAISuggestions ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
                      </button>
                    </div>

                    {showAISuggestions && (
                      <div style={{
                        display: 'grid',
                        gap: '15px'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '15px'
                        }}>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                            gap: '15px',
                            padding: '15px 20px',
                            background: 'var(--primary-color)',
                            color: 'white',
                            borderRadius: '10px',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            flex: 1
                          }}>
                            <div>الكلمة المفتاحية</div>
                            <div style={{ textAlign: 'center' }}>نقاط الصلة</div>
                            <div style={{ textAlign: 'center' }}>كثافة العنوان</div>
                            <div style={{ textAlign: 'center' }}>كثافة الوصف</div>
                            <div style={{ textAlign: 'center' }}>إجراء</div>
                          </div>
                        </div>

                        <div style={{
                          display: 'flex',
                          gap: '10px',
                          marginBottom: '20px',
                          justifyContent: 'center'
                        }}>
                          <button
                            onClick={applyAllSuggestions}
                            style={{
                              padding: '12px 20px',
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)'
                              e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.3)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)'
                              e.currentTarget.style.boxShadow = 'none'
                            }}
                          >
                            <i className="fas fa-check-double"></i> تطبيق الأفضل (نقاط ≥70)
                          </button>

                          <button
                            onClick={() => setAiKeywordSuggestions([])}
                            style={{
                              padding: '12px 20px',
                              background: 'var(--danger-color)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)'
                              e.currentTarget.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.3)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)'
                              e.currentTarget.style.boxShadow = 'none'
                            }}
                          >
                            <i className="fas fa-times"></i> إلغاء الاقتراحات
                          </button>
                        </div>

                        {aiKeywordSuggestions.map((suggestion, index) => (
                          <div key={index} style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                            gap: '15px',
                            padding: '15px 20px',
                            background: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                            alignItems: 'center',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)'
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)'
                          }}
                          >
                            <div style={{
                              fontWeight: '600',
                              color: 'var(--secondary-color)'
                            }}>
                              {suggestion.keyword}
                            </div>

                            <div style={{
                              textAlign: 'center',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px'
                            }}>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: `conic-gradient(${
                                  suggestion.relevanceScore >= 80 ? 'var(--success-color)' :
                                  suggestion.relevanceScore >= 60 ? 'var(--warning-color)' :
                                  'var(--danger-color)'
                                } ${suggestion.relevanceScore * 3.6}deg, #e2e8f0 0deg)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                color: suggestion.relevanceScore >= 80 ? 'var(--success-color)' :
                                       suggestion.relevanceScore >= 60 ? 'var(--warning-color)' :
                                       'var(--danger-color)'
                              }}>
                                {suggestion.relevanceScore}
                              </div>
                            </div>

                            <div style={{
                              textAlign: 'center',
                              fontWeight: '600',
                              color: parseFloat(suggestion.titleDensity) > 0 ? 'var(--success-color)' : 'var(--gray-color)'
                            }}>
                              {suggestion.titleDensity}%
                            </div>

                            <div style={{
                              textAlign: 'center',
                              fontWeight: '600',
                              color: parseFloat(suggestion.descriptionDensity) > 0 ? 'var(--success-color)' : 'var(--gray-color)'
                            }}>
                              {suggestion.descriptionDensity}%
                            </div>

                            <button
                              onClick={() => applySuggestedKeyword(suggestion.keyword)}
                              disabled={settings.seo.homeKeywords.includes(suggestion.keyword)}
                              style={{
                                padding: '8px 12px',
                                background: settings.seo.homeKeywords.includes(suggestion.keyword)
                                  ? 'var(--success-color)'
                                  : 'var(--primary-color)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: settings.seo.homeKeywords.includes(suggestion.keyword)
                                  ? 'default'
                                  : 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                                opacity: settings.seo.homeKeywords.includes(suggestion.keyword) ? 0.7 : 1
                              }}
                              onMouseEnter={(e) => {
                                if (!settings.seo.homeKeywords.includes(suggestion.keyword)) {
                                  e.currentTarget.style.transform = 'scale(1.05)'
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!settings.seo.homeKeywords.includes(suggestion.keyword)) {
                                  e.currentTarget.style.transform = 'scale(1)'
                                }
                              }}
                            >
                              {settings.seo.homeKeywords.includes(suggestion.keyword) ? (
                                <>
                                  <i className="fas fa-check"></i> مُطبق
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-plus"></i> تطبيق
                                </>
                              )}
                            </button>
                          </div>
                        ))}

                        <div style={{
                          marginTop: '15px',
                          padding: '15px 20px',
                          background: 'var(--info-light)',
                          borderRadius: '10px',
                          fontSize: '0.9rem',
                          color: 'var(--info-color)'
                        }}>
                          <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                            <i className="fas fa-lightbulb" style={{ marginLeft: '8px' }}></i>
                            نصائح لتحسين الكلمات المفتاحية:
                          </div>
                          <ul style={{ margin: 0, paddingRight: '20px' }}>
                            <li>استخدم الكلمات ذات نقاط الصلة العالية (أكثر من 80)</li>
                            <li>حاول دمج الكلمات المفتاحية في العنوان والوصف</li>
                            <li>تجنب الإفراط في استخدام الكلمات المفتاحية (الكثافة المثلى 1-3%)</li>
                            <li>اختر كلمات مفتاحية متنوعة ومترابطة مع محتوى موقعك</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* إعدادات متقدمة */}
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
                      Google Analytics ID
                    </label>
                    <input
                      type="text"
                      value={settings.seo.analyticsId}
                      onChange={(e) => updateSettings('seo', 'analyticsId', e.target.value)}
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
                      placeholder="G-XXXXXXXXXX"
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
                      Search Console ID
                    </label>
                    <input
                      type="text"
                      value={settings.seo.searchConsoleId}
                      onChange={(e) => updateSettings('seo', 'searchConsoleId', e.target.value)}
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
                      placeholder="XXXXXXXXXX"
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
              </div>
            )}

            {/* إعدادات الأمان و SSL */}
            {activeTab === 'security' && (
              <div style={{ display: 'grid', gap: '30px' }}>
                {/* حالة SSL */}
                <div style={{
                  padding: '25px',
                  background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                  borderRadius: '15px',
                  border: '2px solid var(--success-light)'
                }}>
                  <h3 style={{
                    margin: '0 0 20px 0',
                    color: 'var(--secondary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <i className="fas fa-shield-alt" style={{ color: 'var(--success-color)' }}></i>
                    حالة شهادة SSL
                  </h3>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    gap: '25px'
                  }}>
                    <div style={{
                      textAlign: 'center',
                      padding: '20px',
                      background: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                    }}>
                      <div style={{
                        fontSize: '3rem',
                        color: settings.security.sslEnabled ? 'var(--success-color)' : 'var(--danger-color)',
                        marginBottom: '10px'
                      }}>
                        <i className={settings.security.sslEnabled ? 'fas fa-lock' : 'fas fa-unlock'}></i>
                      </div>
                      <div style={{
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        color: settings.security.sslEnabled ? 'var(--success-color)' : 'var(--danger-color)'
                      }}>
                        {settings.security.sslEnabled ? 'مؤمن' : 'غير مؤمن'}
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gap: '15px'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px 20px',
                        background: 'white',
                        borderRadius: '10px'
                      }}>
                        <span style={{ fontWeight: '600' }}>الجهة المصدرة:</span>
                        <span style={{ color: 'var(--primary-color)' }}>{settings.security.sslCertificate.issuer}</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px 20px',
                        background: 'white',
                        borderRadius: '10px'
                      }}>
                        <span style={{ fontWeight: '600' }}>صالح من:</span>
                        <span style={{ color: 'var(--gray-color)' }}>{settings.security.sslCertificate.validFrom}</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px 20px',
                        background: 'white',
                        borderRadius: '10px'
                      }}>
                        <span style={{ fontWeight: '600' }}>صالح حتى:</span>
                        <span style={{ color: 'var(--gray-color)' }}>{settings.security.sslCertificate.validTo}</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px 20px',
                        background: 'white',
                        borderRadius: '10px'
                      }}>
                        <span style={{ fontWeight: '600' }}>الحالة:</span>
                        <span style={{
                          color: getStatusColor(settings.security.sslCertificate.status),
                          fontWeight: '600'
                        }}>
                          {getStatusText(settings.security.sslCertificate.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    marginTop: '20px',
                    display: 'flex',
                    gap: '15px'
                  }}>
                    <button
                      onClick={testSSL}
                      disabled={isLoading}
                      style={{
                        padding: '12px 20px',
                        background: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <i className="fas fa-check-circle"></i> فحص SSL
                    </button>
                    <button
                      style={{
                        padding: '12px 20px',
                        background: 'var(--success-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <i className="fas fa-sync-alt"></i> تجديد الشهادة
                    </button>
                  </div>
                </div>

                {/* إعدادات الأمان */}
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
                      مهلة انتهاء الجلسة (دقيقة)
                    </label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '2px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--secondary-color)' }}>
                      عدد محاولات تسجيل الدخول
                    </label>
                    <input
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => updateSettings('security', 'maxLoginAttempts', parseInt(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '2px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--secondary-color)' }}>
                    الحد الأدنى لطول كلمة المرور
                  </label>
                  <input
                    type="number"
                    value={settings.security.passwordPolicy.minLength}
                    onChange={(e) => updateSettings('security', 'passwordPolicy', {...settings.security.passwordPolicy, minLength: parseInt(e.target.value)})}
                    style={{
                      width: '200px',
                      padding: '12px 15px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
                    <input
                      type="checkbox"
                      id="requireSpecialChars"
                      checked={settings.security.passwordPolicy.requireSymbols}
                      onChange={(e) => updateSettings('security', 'passwordPolicy', {...settings.security.passwordPolicy, requireSymbols: e.target.checked})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <label htmlFor="requireSpecialChars" style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>
                      طلب رموز خاصة في كلمة المرور
                    </label>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
                    <input
                      type="checkbox"
                      id="twoFactorAuth"
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) => updateSettings('security', 'twoFactorAuth', e.target.checked)}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <label htmlFor="twoFactorAuth" style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>
                      المصادقة الثنائية
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* إعدادات الإشعارات */}
            {activeTab === 'notifications' && (
              <div style={{ display: 'grid', gap: '25px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => updateSettings('notifications', 'emailNotifications', e.target.checked)}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <div>
                      <label htmlFor="emailNotifications" style={{ fontWeight: '600', color: 'var(--secondary-color)', display: 'block' }}>
                        إشعارات البريد الإلكتروني
                      </label>
                      <span style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                        إرسال إشعارات مهمة عبر البريد الإلكتروني
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
                    <input
                      type="checkbox"
                      id="smsNotifications"
                      checked={settings.notifications.smsNotifications}
                      onChange={(e) => updateSettings('notifications', 'smsNotifications', e.target.checked)}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <div>
                      <label htmlFor="smsNotifications" style={{ fontWeight: '600', color: 'var(--secondary-color)', display: 'block' }}>
                        إشعارات الرسائل النصية
                      </label>
                      <span style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                        إرسال إشعارات عاجلة عبر الرسائل النصية
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* إعدادات النسخ الاحتياطي */}
            {activeTab === 'backup' && (
              <div style={{ display: 'grid', gap: '30px' }}>
                {/* حالة النسخ الاحتياطي */}
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
                    <i className="fas fa-database" style={{ color: 'var(--primary-color)' }}></i>
                    حالة النسخ الاحتياطي
                  </h3>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    gap: '25px'
                  }}>
                    <div style={{
                      textAlign: 'center',
                      padding: '20px',
                      background: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                    }}>
                      <div style={{
                        fontSize: '2.5rem',
                        color: getStatusColor(settings.backup.backupStatus),
                        marginBottom: '10px'
                      }}>
                        <i className="fas fa-cloud-upload-alt"></i>
                      </div>
                      <div style={{
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        color: getStatusColor(settings.backup.backupStatus)
                      }}>
                        {getStatusText(settings.backup.backupStatus)}
                      </div>
                      <div style={{
                        fontSize: '0.9rem',
                        color: 'var(--gray-color)',
                        marginTop: '5px'
                      }}>
                        {settings.backup.backupSize}
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gap: '15px'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px 20px',
                        background: 'white',
                        borderRadius: '10px'
                      }}>
                        <span style={{ fontWeight: '600' }}>آخر نسخة احتياطية:</span>
                        <span style={{ color: 'var(--primary-color)' }}>{settings.backup.lastBackup}</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px 20px',
                        background: 'white',
                        borderRadius: '10px'
                      }}>
                        <span style={{ fontWeight: '600' }}>التكرار:</span>
                        <span style={{ color: 'var(--gray-color)' }}>
                          {settings.backup.backupFrequency === 'daily' ? 'يومياً' :
                           settings.backup.backupFrequency === 'weekly' ? 'أسبوعياً' :
                           settings.backup.backupFrequency === 'monthly' ? 'شهرياً' : 'كل ساعة'}
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px 20px',
                        background: 'white',
                        borderRadius: '10px'
                      }}>
                        <span style={{ fontWeight: '600' }}>مزود التخزين:</span>
                        <span style={{ color: 'var(--gray-color)' }}>
                          {settings.backup.cloudProvider === 'aws' ? 'Amazon S3' :
                           settings.backup.cloudProvider === 'google' ? 'Google Cloud' :
                           settings.backup.cloudProvider === 'azure' ? 'Microsoft Azure' : 'محلي'}
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px 20px',
                        background: 'white',
                        borderRadius: '10px'
                      }}>
                        <span style={{ fontWeight: '600' }}>مدة الاحتفاظ:</span>
                        <span style={{ color: 'var(--gray-color)' }}>{settings.backup.retentionDays} يوم</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* إعدادات النسخ الاحتياطي */}
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
                      تكرار النسخ الاحتياطي
                    </label>
                    <select
                      value={settings.backup.backupFrequency}
                      onChange={(e) => updateSettings('backup', 'backupFrequency', e.target.value)}
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
                      <option value="hourly">كل ساعة</option>
                      <option value="daily">يومياً</option>
                      <option value="weekly">أسبوعياً</option>
                      <option value="monthly">شهرياً</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '10px',
                      fontWeight: '600',
                      color: 'var(--secondary-color)',
                      fontSize: '1rem'
                    }}>
                      وقت النسخ الاحتياطي
                    </label>
                    <input
                      type="time"
                      value={settings.backup.backupTime}
                      onChange={(e) => updateSettings('backup', 'backupTime', e.target.value)}
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
                    />
                  </div>
                </div>

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
                      مزود التخزين السحابي
                    </label>
                    <select
                      value={settings.backup.cloudProvider}
                      onChange={(e) => updateSettings('backup', 'cloudProvider', e.target.value)}
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
                      <option value="aws">Amazon S3</option>
                      <option value="google">Google Cloud Storage</option>
                      <option value="azure">Microsoft Azure</option>
                      <option value="local">تخزين محلي</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '10px',
                      fontWeight: '600',
                      color: 'var(--secondary-color)',
                      fontSize: '1rem'
                    }}>
                      مدة الاحتفاظ (أيام)
                    </label>
                    <input
                      type="number"
                      value={settings.backup.retentionDays}
                      onChange={(e) => updateSettings('backup', 'retentionDays', parseInt(e.target.value))}
                      min="1"
                      max="365"
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
                    />
                  </div>
                </div>

                {/* إعدادات النسخ الاحتياطي التلقائي */}
                <div style={{
                  padding: '25px',
                  background: 'white',
                  borderRadius: '15px',
                  border: '2px solid var(--border-color)'
                }}>
                  <h4 style={{
                    margin: '0 0 20px 0',
                    color: 'var(--secondary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <i className="fas fa-robot" style={{ color: 'var(--primary-color)' }}></i>
                    النسخ الاحتياطي التلقائي
                  </h4>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '15px 20px',
                    background: '#f8fafc',
                    borderRadius: '10px'
                  }}>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>
                        تفعيل النسخ الاحتياطي التلقائي
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                        إنشاء نسخ احتياطية تلقائياً حسب الجدولة المحددة
                      </div>
                    </div>
                    <label style={{
                      position: 'relative',
                      display: 'inline-block',
                      width: '60px',
                      height: '34px'
                    }}>
                      <input
                        type="checkbox"
                        checked={settings.backup.autoBackup}
                        onChange={(e) => updateSettings('backup', 'autoBackup', e.target.checked)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: settings.backup.autoBackup ? 'var(--success-color)' : '#ccc',
                        transition: '0.4s',
                        borderRadius: '34px'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '',
                          height: '26px',
                          width: '26px',
                          left: settings.backup.autoBackup ? '30px' : '4px',
                          bottom: '4px',
                          backgroundColor: 'white',
                          transition: '0.4s',
                          borderRadius: '50%'
                        }}></span>
                      </span>
                    </label>
                  </div>
                </div>

                {/* أزرار الإجراءات */}
                <div style={{
                  display: 'flex',
                  gap: '15px',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={createBackup}
                    disabled={isLoading}
                    style={{
                      padding: '15px 25px',
                      background: isLoading ? '#94a3b8' : 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> جاري الإنشاء...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-download"></i> إنشاء نسخة احتياطية الآن
                      </>
                    )}
                  </button>

                  <button
                    style={{
                      padding: '15px 25px',
                      background: 'var(--primary-color)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <i className="fas fa-upload"></i> استعادة من نسخة احتياطية
                  </button>

                  <button
                    style={{
                      padding: '15px 25px',
                      background: 'var(--warning-color)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <i className="fas fa-history"></i> عرض سجل النسخ
                  </button>
                </div>
              </div>
            )}

            {/* إعدادات الأداء والتحسين */}
            {activeTab === 'performance' && (
              <div style={{ display: 'grid', gap: '30px' }}>
                <div style={{
                  padding: '25px',
                  background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                  borderRadius: '15px',
                  border: '2px solid var(--warning-light)'
                }}>
                  <h3 style={{
                    margin: '0 0 20px 0',
                    color: 'var(--secondary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <i className="fas fa-tachometer-alt" style={{ color: 'var(--warning-color)' }}></i>
                    إعدادات الأداء
                  </h3>

                  <div style={{ display: 'grid', gap: '20px' }}>
                    {[
                      { key: 'cacheEnabled', label: 'تفعيل التخزين المؤقت', desc: 'تحسين سرعة تحميل الصفحات' },
                      { key: 'compressionEnabled', label: 'ضغط الملفات', desc: 'تقليل حجم الملفات المرسلة' },
                      { key: 'minifyCSS', label: 'ضغط ملفات CSS', desc: 'تقليل حجم ملفات التنسيق' },
                      { key: 'minifyJS', label: 'ضغط ملفات JavaScript', desc: 'تقليل حجم ملفات البرمجة' },
                      { key: 'imageOptimization', label: 'تحسين الصور', desc: 'ضغط وتحسين جودة الصور' },
                      { key: 'lazyLoading', label: 'التحميل التدريجي', desc: 'تحميل المحتوى عند الحاجة' },
                      { key: 'cdnEnabled', label: 'شبكة توصيل المحتوى', desc: 'توزيع المحتوى عالمياً' }
                    ].map((setting) => (
                      <div key={setting.key} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '15px 20px',
                        background: 'white',
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                      }}>
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>
                            {setting.label}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                            {setting.desc}
                          </div>
                        </div>
                        <label style={{
                          position: 'relative',
                          display: 'inline-block',
                          width: '60px',
                          height: '34px'
                        }}>
                          <input
                            type="checkbox"
                            checked={settings.performance[setting.key]}
                            onChange={(e) => updateSettings('performance', setting.key, e.target.checked)}
                            style={{ opacity: 0, width: 0, height: 0 }}
                          />
                          <span style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: settings.performance[setting.key] ? 'var(--success-color)' : '#ccc',
                            transition: '0.4s',
                            borderRadius: '34px'
                          }}>
                            <span style={{
                              position: 'absolute',
                              content: '',
                              height: '26px',
                              width: '26px',
                              left: settings.performance[setting.key] ? '30px' : '4px',
                              bottom: '4px',
                              backgroundColor: 'white',
                              transition: '0.4s',
                              borderRadius: '50%'
                            }}></span>
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

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
                      مدة انتهاء التخزين المؤقت (ثانية)
                    </label>
                    <input
                      type="number"
                      value={settings.performance.cacheExpiry}
                      onChange={(e) => updateSettings('performance', 'cacheExpiry', parseInt(e.target.value))}
                      min="60"
                      max="86400"
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
                      مزود CDN
                    </label>
                    <select
                      value={settings.performance.cdnProvider}
                      onChange={(e) => updateSettings('performance', 'cdnProvider', e.target.value)}
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
                      <option value="cloudflare">Cloudflare</option>
                      <option value="aws">Amazon CloudFront</option>
                      <option value="google">Google Cloud CDN</option>
                      <option value="azure">Azure CDN</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* إعدادات الإشعارات */}
            {activeTab === 'notifications' && (
              <div style={{ display: 'grid', gap: '30px' }}>
                <div style={{
                  padding: '25px',
                  background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                  borderRadius: '15px',
                  border: '2px solid var(--info-light)'
                }}>
                  <h3 style={{
                    margin: '0 0 20px 0',
                    color: 'var(--secondary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <i className="fas fa-bell" style={{ color: 'var(--info-color)' }}></i>
                    إعدادات الإشعارات
                  </h3>

                  <div style={{ display: 'grid', gap: '20px' }}>
                    {[
                      { key: 'emailNotifications', label: 'إشعارات البريد الإلكتروني', desc: 'إرسال إشعارات مهمة عبر البريد الإلكتروني' },
                      { key: 'smsNotifications', label: 'إشعارات الرسائل النصية', desc: 'إرسال إشعارات عاجلة عبر الرسائل النصية' },
                      { key: 'pushNotifications', label: 'الإشعارات الفورية', desc: 'إشعارات فورية في المتصفح' },
                      { key: 'systemAlerts', label: 'تنبيهات النظام', desc: 'تنبيهات حول حالة النظام والأخطاء' },
                      { key: 'backupAlerts', label: 'تنبيهات النسخ الاحتياطي', desc: 'إشعارات حول حالة النسخ الاحتياطي' },
                      { key: 'securityAlerts', label: 'تنبيهات الأمان', desc: 'إشعارات حول المشاكل الأمنية' },
                      { key: 'performanceAlerts', label: 'تنبيهات الأداء', desc: 'إشعارات حول أداء النظام' }
                    ].map((setting) => (
                      <div key={setting.key} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '15px 20px',
                        background: 'white',
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                      }}>
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>
                            {setting.label}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                            {setting.desc}
                          </div>
                        </div>
                        <label style={{
                          position: 'relative',
                          display: 'inline-block',
                          width: '60px',
                          height: '34px'
                        }}>
                          <input
                            type="checkbox"
                            checked={settings.notifications[setting.key]}
                            onChange={(e) => updateSettings('notifications', setting.key, e.target.checked)}
                            style={{ opacity: 0, width: 0, height: 0 }}
                          />
                          <span style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: settings.notifications[setting.key] ? 'var(--info-color)' : '#ccc',
                            transition: '0.4s',
                            borderRadius: '34px'
                          }}>
                            <span style={{
                              position: 'absolute',
                              content: '',
                              height: '26px',
                              width: '26px',
                              left: settings.notifications[setting.key] ? '30px' : '4px',
                              bottom: '4px',
                              backgroundColor: 'white',
                              transition: '0.4s',
                              borderRadius: '50%'
                            }}></span>
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* إعدادات API */}
            {activeTab === 'api' && (
              <div style={{ display: 'grid', gap: '30px' }}>
                <div style={{
                  padding: '25px',
                  background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                  borderRadius: '15px',
                  border: '2px solid var(--secondary-light)'
                }}>
                  <h3 style={{
                    margin: '0 0 20px 0',
                    color: 'var(--secondary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <i className="fas fa-code" style={{ color: 'var(--secondary-color)' }}></i>
                    إعدادات API
                  </h3>

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
                        مفتاح API
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="password"
                          value={settings.api.apiKey}
                          onChange={(e) => updateSettings('api', 'apiKey', e.target.value)}
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
                        حد الطلبات (في الساعة)
                      </label>
                      <input
                        type="number"
                        value={settings.api.rateLimit}
                        onChange={(e) => updateSettings('api', 'rateLimit', parseInt(e.target.value))}
                        min="100"
                        max="10000"
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
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '25px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '10px',
                      fontWeight: '600',
                      color: 'var(--secondary-color)',
                      fontSize: '1rem'
                    }}>
                      رابط Webhook
                    </label>
                    <input
                      type="url"
                      value={settings.api.webhookUrl}
                      onChange={(e) => updateSettings('api', 'webhookUrl', e.target.value)}
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
                      placeholder="https://api.example.com/webhook"
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

                  <div style={{
                    marginTop: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '15px 20px',
                    background: 'white',
                    borderRadius: '10px'
                  }}>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>
                        تفعيل API
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                        السماح بالوصول لواجهة برمجة التطبيقات
                      </div>
                    </div>
                    <label style={{
                      position: 'relative',
                      display: 'inline-block',
                      width: '60px',
                      height: '34px'
                    }}>
                      <input
                        type="checkbox"
                        checked={settings.api.apiEnabled}
                        onChange={(e) => updateSettings('api', 'apiEnabled', e.target.checked)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: settings.api.apiEnabled ? 'var(--success-color)' : '#ccc',
                        transition: '0.4s',
                        borderRadius: '34px'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '',
                          height: '26px',
                          width: '26px',
                          left: settings.api.apiEnabled ? '30px' : '4px',
                          bottom: '4px',
                          backgroundColor: 'white',
                          transition: '0.4s',
                          borderRadius: '50%'
                        }}></span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
