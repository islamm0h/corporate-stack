'use client'

import { useState } from 'react'

export default function ResponsesManagement() {
  const [responses] = useState([
    {
      id: 1,
      requestId: 1,
      companyName: 'شركة الرياض للتجارة',
      contactPerson: 'أحمد محمد السالم',
      system: 'نظام المحاسبة والفاتورة الإلكترونية',
      responseType: 'عرض سعر',
      status: 'sent',
      sentDate: '2024-01-15 14:30',
      responseBy: 'سارة أحمد - مدير المبيعات',
      followUpDate: '2024-01-18',
      notes: 'تم إرسال عرض سعر مفصل، العميل طلب تعديلات على الباقة',
      nextAction: 'متابعة بعد 3 أيام'
    },
    {
      id: 2,
      requestId: 2,
      companyName: 'مؤسسة جدة للخدمات',
      contactPerson: 'فاطمة علي أحمد',
      system: 'نظام إدارة العملاء (CRM)',
      responseType: 'معلومات إضافية',
      status: 'pending',
      sentDate: null,
      responseBy: 'محمد سالم - مستشار تقني',
      followUpDate: '2024-01-16',
      notes: 'العميل يحتاج معلومات تقنية مفصلة عن التكامل',
      nextAction: 'إرسال الوثائق التقنية'
    },
    {
      id: 3,
      requestId: 3,
      companyName: 'شركة الدمام الصناعية',
      contactPerson: 'محمد يوسف الخالد',
      system: 'نظام إدارة المخزون',
      responseType: 'عرض تقديمي',
      status: 'scheduled',
      sentDate: '2024-01-14 10:00',
      responseBy: 'نورا خالد - مدير المنتجات',
      followUpDate: '2024-01-17',
      notes: 'تم تحديد موعد العرض التقديمي يوم الأربعاء',
      nextAction: 'تحضير العرض التقديمي'
    },
    {
      id: 4,
      requestId: 4,
      companyName: 'مكتب الخبر الاستشاري',
      contactPerson: 'نورا سالم العتيبي',
      system: 'نظام إدارة المشاريع',
      responseType: 'استشارة',
      status: 'completed',
      sentDate: '2024-01-12 09:30',
      responseBy: 'خالد عبدالله - مستشار أول',
      followUpDate: '2024-01-20',
      notes: 'تمت الاستشارة بنجاح، العميل راضي عن الخدمة',
      nextAction: 'متابعة للحصول على مشاريع مستقبلية'
    },
    {
      id: 5,
      requestId: 5,
      companyName: 'شركة المدينة التقنية',
      contactPerson: 'خالد عبدالله النمر',
      system: 'نظام إدارة الموارد البشرية',
      responseType: 'عرض سعر',
      status: 'draft',
      sentDate: null,
      responseBy: 'أحمد محمد - مدير المبيعات',
      followUpDate: '2024-01-16',
      notes: 'جاري إعداد عرض السعر، يحتاج مراجعة الإدارة',
      nextAction: 'إنهاء العرض وإرساله'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')

  const filteredResponses = responses.filter(response => {
    const matchesSearch = response.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         response.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         response.system.toLowerCase().includes(searchTerm.toLowerCase())
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
          {filteredResponses.map((response) => (
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
                    {response.companyName}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                    <span><i className="fas fa-user"></i> {response.contactPerson}</span>
                    <span><i className="fas fa-cog"></i> {response.system}</span>
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
                    <span style={{ marginRight: '10px', color: 'var(--gray-color)' }}>{response.responseBy}</span>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong style={{ color: 'var(--secondary-color)' }}>تاريخ الإرسال:</strong>
                    <span style={{ marginRight: '10px', color: 'var(--gray-color)' }}>
                      {response.sentDate || 'لم يتم الإرسال بعد'}
                    </span>
                  </div>
                </div>
                <div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong style={{ color: 'var(--secondary-color)' }}>تاريخ المتابعة:</strong>
                    <span style={{ marginRight: '10px', color: 'var(--gray-color)' }}>{response.followUpDate}</span>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--secondary-color)' }}>الإجراء التالي:</strong>
                    <span style={{ marginRight: '10px', color: 'var(--gray-color)' }}>{response.nextAction}</span>
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
                  {response.notes}
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
