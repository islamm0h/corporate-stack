'use client'

import { useState, useEffect } from 'react'

interface QuoteRequest {
  id: string
  lead: {
    companyName: string
    contactPerson: string
    email: string
    phone: string
  }
  system: {
    name: string
  }
  requestType: string
  description: string
  budget: string
  timeline: string
  status: string
  priority: string
  createdAt: string
}

export default function RequestsManagement() {
  const [requests, setRequests] = useState<QuoteRequest[]>([])
  const [loading, setLoading] = useState(true)

  // جلب الطلبات من قاعدة البيانات
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('/api/quote-requests')
        const result = await response.json()

        if (result.success) {
          setRequests(result.data)
        } else {
          console.error('Failed to fetch requests:', result.message)
        }
      } catch (error) {
        console.error('Error fetching requests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  // استخدام البيانات الافتراضية إذا لم تكن هناك بيانات حقيقية
  useEffect(() => {
    if (requests.length === 0 && !loading) {
      const fallbackData = [
        {
          id: '1',
          lead: {
            companyName: 'لا توجد طلبات',
            contactPerson: 'قاعدة البيانات فارغة',
            email: 'no-data@example.com',
            phone: '+966500000000'
          },
          system: {
            name: 'لا يوجد نظام'
          },
          requestType: 'لا يوجد',
          description: 'قاعدة البيانات فارغة حالياً. أضف بيانات جديدة لرؤية الطلبات.',
          budget: 'غير محدد',
          timeline: 'غير محدد',
          status: 'new',
          priority: 'low',
          createdAt: new Date().toISOString()
        }
      ]
      setRequests(fallbackData)
    }
  }, [requests.length, loading])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterType, setFilterType] = useState('all')

  const filteredRequests = requests.filter(request => {
    const companyName = request.lead?.companyName || ''
    const contactPerson = request.lead?.contactPerson || ''
    const systemName = request.system?.name || ''

    const matchesSearch = companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         systemName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus
    const matchesPriority = filterPriority === 'all' || request.priority === filterPriority
    const matchesType = filterType === 'all' || request.requestType === filterType

    return matchesSearch && matchesStatus && matchesPriority && matchesType
  })

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'جديد'
      case 'in_progress': return 'قيد المعالجة'
      case 'responded': return 'تم الرد'
      case 'closed': return 'مغلق'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'var(--primary-color)'
      case 'in_progress': return 'var(--warning-color)'
      case 'responded': return 'var(--success-color)'
      case 'closed': return 'var(--gray-color)'
      default: return 'var(--gray-color)'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'عالية'
      case 'medium': return 'متوسطة'
      case 'low': return 'منخفضة'
      default: return priority
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'var(--danger-color)'
      case 'medium': return 'var(--warning-color)'
      case 'low': return 'var(--success-color)'
      default: return 'var(--gray-color)'
    }
  }

  return (
    <>
      {/* إحصائيات الطلبات */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-envelope"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{requests.length}</div>
            <div className="stat-label">إجمالي الطلبات</div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-envelope-open"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{requests.filter(r => r.status === 'new').length}</div>
            <div className="stat-label">طلبات جديدة</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{requests.filter(r => r.status === 'in_progress').length}</div>
            <div className="stat-label">قيد المعالجة</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{requests.filter(r => r.status === 'responded').length}</div>
            <div className="stat-label">تم الرد عليها</div>
          </div>
        </div>
      </div>

      {/* جدول الطلبات */}
      <div className="data-table-container">
        <div className="data-table-header">
          <h3 className="data-table-title">الطلبات الواردة</h3>
          <div className="data-table-actions">
            <button className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '10px 20px', marginLeft: '10px' }}>
              <i className="fas fa-download"></i> تصدير
            </button>
            <button className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '10px 20px' }}>
              <i className="fas fa-sync-alt"></i> تحديث
            </button>
          </div>
        </div>

        {/* أدوات البحث والفلترة */}
        <div style={{ padding: '20px 25px', borderBottom: '1px solid var(--border-color)', background: '#f8fafc' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '15px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="البحث في الطلبات..."
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
              <option value="new">جديد</option>
              <option value="in_progress">قيد المعالجة</option>
              <option value="responded">تم الرد</option>
              <option value="closed">مغلق</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={{
                padding: '10px 15px',
                border: '2px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            >
              <option value="all">جميع الأولويات</option>
              <option value="high">عالية</option>
              <option value="medium">متوسطة</option>
              <option value="low">منخفضة</option>
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
              <option value="استفسار">استفسار</option>
              <option value="عرض تقديمي">عرض تقديمي</option>
              <option value="استشارة">استشارة</option>
            </select>
          </div>
        </div>

        <div style={{ padding: '20px' }}>
          {filteredRequests.map((request) => (
            <div key={request.id} style={{
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
              {/* رأس الطلب */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--secondary-color)', fontSize: '1.2rem' }}>
                    {request.lead?.companyName || 'غير محدد'}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                    <span><i className="fas fa-user"></i> {request.lead?.contactPerson || 'غير محدد'}</span>
                    <span><i className="fas fa-envelope"></i> {request.lead?.email || 'غير محدد'}</span>
                    <span><i className="fas fa-phone"></i> {request.lead?.phone || 'غير محدد'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    background: `${getPriorityColor(request.priority)}20`,
                    color: getPriorityColor(request.priority)
                  }}>
                    {getPriorityText(request.priority)}
                  </span>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    background: `${getStatusColor(request.status)}20`,
                    color: getStatusColor(request.status)
                  }}>
                    {getStatusText(request.status)}
                  </span>
                </div>
              </div>

              {/* تفاصيل الطلب */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong style={{ color: 'var(--secondary-color)' }}>نوع الطلب:</strong>
                    <span style={{ marginRight: '10px', color: 'var(--gray-color)' }}>{request.requestType}</span>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong style={{ color: 'var(--secondary-color)' }}>النظام المطلوب:</strong>
                    <span style={{ marginRight: '10px', color: 'var(--gray-color)' }}>{request.system?.name || 'غير محدد'}</span>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--secondary-color)' }}>تاريخ الإرسال:</strong>
                    <span style={{ marginRight: '10px', color: 'var(--gray-color)' }}>
                      {request.createdAt ? new Date(request.createdAt).toLocaleDateString('ar-SA') : 'غير محدد'}
                    </span>
                  </div>
                </div>
                <div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong style={{ color: 'var(--secondary-color)' }}>الميزانية:</strong>
                    <span style={{ marginRight: '10px', color: 'var(--gray-color)' }}>{request.budget}</span>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--secondary-color)' }}>الجدول الزمني:</strong>
                    <span style={{ marginRight: '10px', color: 'var(--gray-color)' }}>{request.timeline}</span>
                  </div>
                </div>
              </div>

              {/* رسالة الطلب */}
              <div style={{ marginBottom: '20px' }}>
                <strong style={{ color: 'var(--secondary-color)', display: 'block', marginBottom: '8px' }}>تفاصيل الطلب:</strong>
                <p style={{ 
                  margin: 0,
                  padding: '15px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  color: 'var(--gray-color)',
                  lineHeight: '1.6'
                }}>
                  {request.description || 'لا توجد تفاصيل'}
                </p>
              </div>

              {/* أزرار الإجراءات */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '8px 15px' }}>
                  <i className="fas fa-eye"></i> عرض التفاصيل
                </button>
                <button className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '8px 15px' }}>
                  <i className="fas fa-reply"></i> الرد على الطلب
                </button>
                {request.status === 'new' && (
                  <button className="btn btn-warning" style={{ fontSize: '0.9rem', padding: '8px 15px' }}>
                    <i className="fas fa-play"></i> بدء المعالجة
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
