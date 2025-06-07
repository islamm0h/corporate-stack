'use client'

import { useState, useEffect } from 'react'

interface Response {
  id: string
  quoteRequest: {
    id: string
    lead: {
      companyName: string
      contactPerson: string
    }
    system: {
      name: string
    }
    requestType: string
  }
  responseType: string
  status: string
  sentAt: string | null
  responseBy: {
    firstName: string
    lastName: string
    role: string
  } | null
  followUpDate: string | null
  notes: string | null
  nextAction: string | null
  createdAt: string
  updatedAt: string
}

export default function ResponsesManagement() {
  const [responses, setResponses] = useState<Response[]>([])
  const [loading, setLoading] = useState(true)

  // جلب الردود من قاعدة البيانات
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/responses')
        const result = await response.json()

        if (result.success) {
          setResponses(result.data)
        } else {
          console.error('Error fetching responses:', result.error)
          setResponses([])
        }
      } catch (error) {
        console.error('Error fetching responses:', error)
        setResponses([])
      } finally {
        setLoading(false)
      }
    }

    fetchResponses()
  }, [])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')

  const filteredResponses = responses.filter(response => {
    const companyName = response.quoteRequest?.lead?.companyName || ''
    const contactPerson = response.quoteRequest?.lead?.contactPerson || ''
    const systemName = response.quoteRequest?.system?.name || ''

    const matchesSearch = companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         systemName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || response.status === filterStatus
    const matchesType = filterType === 'all' || response.responseType === filterType

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'مسودة'
      case 'pending': return 'في الانتظار'
      case 'sent': return 'تم الإرسال'
      case 'scheduled': return 'مجدول'
      case 'completed': return 'مكتمل'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'var(--gray-color)'
      case 'pending': return 'var(--warning-color)'
      case 'sent': return 'var(--primary-color)'
      case 'scheduled': return 'var(--secondary-color)'
      case 'completed': return 'var(--success-color)'
      default: return 'var(--gray-color)'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return 'fas fa-edit'
      case 'pending': return 'fas fa-clock'
      case 'sent': return 'fas fa-paper-plane'
      case 'scheduled': return 'fas fa-calendar'
      case 'completed': return 'fas fa-check-circle'
      default: return 'fas fa-info-circle'
    }
  }

  return (
    <>
      {/* إحصائيات الردود */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-reply"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{responses.length}</div>
            <div className="stat-label">إجمالي الردود</div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{responses.filter(r => r.status === 'pending' || r.status === 'draft').length}</div>
            <div className="stat-label">في الانتظار</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-paper-plane"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{responses.filter(r => r.status === 'sent').length}</div>
            <div className="stat-label">تم الإرسال</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{responses.filter(r => r.status === 'completed').length}</div>
            <div className="stat-label">مكتملة</div>
          </div>
        </div>
      </div>

      {/* جدول الردود */}
      <div className="data-table-container">
        <div className="data-table-header">
          <h3 className="data-table-title">الردود والمتابعة</h3>
          <div className="data-table-actions">
            <button className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '10px 20px', marginLeft: '10px' }}>
              <i className="fas fa-download"></i> تصدير
            </button>
            <button className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '10px 20px' }}>
              <i className="fas fa-plus"></i> إضافة رد جديد
            </button>
          </div>
        </div>

        {/* أدوات البحث والفلترة */}
        <div style={{ padding: '20px 25px', borderBottom: '1px solid var(--border-color)', background: '#f8fafc' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="البحث في الردود..."
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
              <option value="draft">مسودة</option>
              <option value="pending">في الانتظار</option>
              <option value="sent">تم الإرسال</option>
              <option value="scheduled">مجدول</option>
              <option value="completed">مكتمل</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: '10px 15px',
                border: '2px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            >
              <option value="all">جميع الأنواع</option>
              <option value="عرض سعر">عرض سعر</option>
              <option value="معلومات إضافية">معلومات إضافية</option>
              <option value="عرض تقديمي">عرض تقديمي</option>
              <option value="استشارة">استشارة</option>
            </select>
          </div>
        </div>

        <div style={{ padding: '20px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-color)' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
              <div>جاري تحميل الردود...</div>
            </div>
          ) : filteredResponses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-color)' }}>
              <i className="fas fa-reply" style={{ fontSize: '3rem', marginBottom: '15px' }}></i>
              <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px' }}>
                لا توجد ردود
              </div>
              <div style={{ marginBottom: '20px' }}>
                قاعدة البيانات فارغة حالياً. أضف طلبات وردود للبدء.
              </div>
              <button className="btn btn-primary">
                <i className="fas fa-plus"></i> إضافة رد جديد
              </button>
            </div>
          ) : filteredResponses.map((response) => (
            <div key={response.id} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '25px',
              marginBottom: '20px',
              border: '1px solid #f1f5f9',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            >
              {/* رأس الرد */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--secondary-color)', fontSize: '1.2rem' }}>
                    {response.quoteRequest?.lead?.companyName || 'غير محدد'}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                    <span><i className="fas fa-user"></i> {response.quoteRequest?.lead?.contactPerson || 'غير محدد'}</span>
                    <span><i className="fas fa-cog"></i> {response.quoteRequest?.system?.name || 'غير محدد'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    background: 'var(--primary-light)',
                    color: 'var(--primary-color)'
                  }}>
                    {response.responseType}
                  </span>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    background: `${getStatusColor(response.status)}20`,
                    color: getStatusColor(response.status),
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <i className={getStatusIcon(response.status)}></i>
                    {getStatusText(response.status)}
                  </span>
                </div>
              </div>

              {/* تفاصيل الرد */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong style={{ color: 'var(--secondary-color)' }}>المسؤول عن الرد:</strong>
                    <span style={{ marginRight: '10px', color: 'var(--gray-color)' }}>
                      {response.responseBy
                        ? `${response.responseBy.firstName} ${response.responseBy.lastName} - ${response.responseBy.role}`
                        : 'غير محدد'
                      }
                    </span>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong style={{ color: 'var(--secondary-color)' }}>تاريخ الإرسال:</strong>
                    <span style={{ marginRight: '10px', color: 'var(--gray-color)' }}>
                      {response.sentAt
                        ? new Date(response.sentAt).toLocaleDateString('ar-SA') + ' ' + new Date(response.sentAt).toLocaleTimeString('ar-SA')
                        : 'لم يتم الإرسال بعد'
                      }
                    </span>
                  </div>
                </div>
                <div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong style={{ color: 'var(--secondary-color)' }}>تاريخ المتابعة:</strong>
                    <span style={{ marginRight: '10px', color: 'var(--gray-color)' }}>
                      {response.followUpDate
                        ? new Date(response.followUpDate).toLocaleDateString('ar-SA')
                        : 'غير محدد'
                      }
                    </span>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--secondary-color)' }}>الإجراء التالي:</strong>
                    <span style={{ marginRight: '10px', color: 'var(--gray-color)' }}>{response.nextAction || 'غير محدد'}</span>
                  </div>
                </div>
              </div>

              {/* ملاحظات */}
              <div style={{ marginBottom: '20px' }}>
                <strong style={{ color: 'var(--secondary-color)', display: 'block', marginBottom: '8px' }}>الملاحظات:</strong>
                <p style={{
                  margin: 0,
                  padding: '15px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  color: 'var(--gray-color)',
                  lineHeight: '1.6'
                }}>
                  {response.notes || 'لا توجد ملاحظات'}
                </p>
              </div>

              {/* أزرار الإجراءات */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '8px 15px' }}>
                  <i className="fas fa-eye"></i> عرض التفاصيل
                </button>
                <button className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '8px 15px' }}>
                  <i className="fas fa-edit"></i> تعديل
                </button>
                {response.status === 'draft' && (
                  <button className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '8px 15px' }}>
                    <i className="fas fa-paper-plane"></i> إرسال
                  </button>
                )}
                {response.status === 'sent' && (
                  <button className="btn btn-warning" style={{ fontSize: '0.9rem', padding: '8px 15px' }}>
                    <i className="fas fa-phone"></i> متابعة
                  </button>
                )}
                <button className="btn btn-light" style={{ fontSize: '0.9rem', padding: '8px 15px' }}>
                  <i className="fas fa-calendar"></i> جدولة
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
