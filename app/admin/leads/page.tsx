'use client'

import { useState, useEffect } from 'react'

interface Lead {
  id: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  industry: string
  companySize: string
  region: string
  city: string
  source: string
  status: string
  leadScore: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function LeadsManagement() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  // جلب العملاء المحتملين من قاعدة البيانات
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('/api/leads')
        const result = await response.json()

        if (result.success) {
          setLeads(result.data)
        } else {
          console.error('Failed to fetch leads:', result.message)
        }
      } catch (error) {
        console.error('Error fetching leads:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [])

  // استخدام البيانات الافتراضية إذا لم تكن هناك بيانات حقيقية
  useEffect(() => {
    if (leads.length === 0 && !loading) {
      // لا نستخدم بيانات افتراضية - نعرض فقط البيانات الحقيقية أو رسالة فارغة
    }
  }, [leads.length, loading])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCity, setFilterCity] = useState('all')

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus
    const matchesCity = filterCity === 'all' || lead.city === filterCity
    // إزالة فلتر النظام لأنه غير موجود في واجهة Lead

    return matchesSearch && matchesStatus && matchesCity
  })

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'جديد'
      case 'contacted': return 'تم التواصل'
      case 'qualified': return 'مؤهل'
      case 'proposal': return 'عرض سعر'
      case 'converted': return 'تم التحويل'
      case 'lost': return 'فقدان'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'var(--primary-color)'
      case 'contacted': return 'var(--warning-color)'
      case 'qualified': return 'var(--secondary-color)'
      case 'proposal': return 'var(--warning-color)'
      case 'converted': return 'var(--success-color)'
      case 'lost': return 'var(--danger-color)'
      default: return 'var(--gray-color)'
    }
  }

  const cities = [...new Set(leads.map(lead => lead.city))]
  // إزالة الأنظمة لأنها غير موجودة في واجهة Lead

  return (
    <>
      {/* إحصائيات العملاء المحتملين */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{leads.length}</div>
            <div className="stat-label">إجمالي العملاء المحتملين</div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-user-plus"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{leads.filter(l => l.status === 'new').length}</div>
            <div className="stat-label">عملاء جدد</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-user-check"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{leads.filter(l => l.status === 'qualified').length}</div>
            <div className="stat-label">عملاء مؤهلين</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-trophy"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{leads.filter(l => l.status === 'converted').length}</div>
            <div className="stat-label">تم التحويل</div>
          </div>
        </div>
      </div>

      {/* جدول العملاء المحتملين */}
      <div className="data-table-container">
        <div className="data-table-header">
          <h3 className="data-table-title">إدارة العملاء المحتملين</h3>
          <div className="data-table-actions">
            <button className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '10px 20px', marginLeft: '10px' }}>
              <i className="fas fa-download"></i> تصدير
            </button>
            <button className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '10px 20px' }}>
              <i className="fas fa-plus"></i> إضافة عميل محتمل
            </button>
          </div>
        </div>

        {/* أدوات البحث والفلترة */}
        <div style={{ padding: '20px 25px', borderBottom: '1px solid var(--border-color)', background: '#f8fafc' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="البحث عن شركة أو شخص..."
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
              <option value="contacted">تم التواصل</option>
              <option value="qualified">مؤهل</option>
              <option value="proposal">عرض سعر</option>
              <option value="converted">تم التحويل</option>
              <option value="lost">فقدان</option>
            </select>

            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              style={{
                padding: '10px 15px',
                border: '2px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            >
              <option value="all">جميع المدن</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>


          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>الشركة</th>
              <th>الشخص المسؤول</th>
              <th>المدينة</th>
              <th>المصدر</th>
              <th>الحالة</th>
              <th>آخر تواصل</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-color)' }}>
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                  <div>جاري تحميل العملاء المحتملين...</div>
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-color)' }}>
                  <i className="fas fa-users" style={{ fontSize: '3rem', marginBottom: '15px' }}></i>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px' }}>
                    لا توجد عملاء محتملين
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    قاعدة البيانات فارغة حالياً. أضف عملاء محتملين جدد للبدء.
                  </div>
                  <button className="btn btn-primary">
                    <i className="fas fa-plus"></i> إضافة عميل محتمل
                  </button>
                </td>
              </tr>
            ) : filteredLeads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--secondary-color)', marginBottom: '3px' }}>
                      {lead.companyName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>
                      {lead.email}
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <div style={{ fontWeight: '500', color: 'var(--secondary-color)', marginBottom: '3px' }}>
                      {lead.contactPerson}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>
                      {lead.phone}
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    background: 'var(--primary-light)',
                    color: 'var(--primary-color)'
                  }}>
                    {lead.city}
                  </span>
                </td>
                <td style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                  {lead.source}
                </td>
                <td>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    background: `${getStatusColor(lead.status)}20`,
                    color: getStatusColor(lead.status)
                  }}>
                    {getStatusText(lead.status)}
                  </span>
                </td>
                <td style={{ fontSize: '0.9rem' }}>
                  {lead.updatedAt ? new Date(lead.updatedAt).toLocaleDateString('ar-SA') : 'غير محدد'}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button className="action-btn view">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="action-btn edit">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="action-btn view" style={{ background: 'rgba(0, 102, 204, 0.1)', color: 'var(--primary-color)' }}>
                      <i className="fas fa-phone"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
