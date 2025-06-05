'use client'

import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalLeads: 1250,
    newRequests: 45,
    pendingResponses: 23,
    convertedLeads: 187
  })

  const [recentActivities] = useState([
    { id: 1, user: 'شركة الرياض للتجارة', action: 'طلب عرض سعر لنظام المحاسبة', time: 'منذ 5 دقائق', type: 'request' },
    { id: 2, user: 'مؤسسة جدة للخدمات', action: 'استفسار عن نظام إدارة العملاء', time: 'منذ 15 دقيقة', type: 'inquiry' },
    { id: 3, user: 'شركة الدمام الصناعية', action: 'تم الرد على الاستفسار', time: 'منذ 30 دقيقة', type: 'response' },
    { id: 4, user: 'مكتب الخبر الاستشاري', action: 'طلب عرض تقديمي', time: 'منذ ساعة', type: 'demo' },
    { id: 5, user: 'شركة المدينة التقنية', action: 'تحويل إلى عميل', time: 'منذ ساعتين', type: 'convert' }
  ])

  const [topRequestedSystems] = useState([
    { name: 'نظام المحاسبة والفاتورة الإلكترونية', requests: 45, percentage: 35 },
    { name: 'نظام إدارة العملاء (CRM)', requests: 32, percentage: 25 },
    { name: 'نظام إدارة الموارد البشرية', requests: 28, percentage: 22 },
    { name: 'نظام إدارة المخزون', requests: 15, percentage: 12 },
    { name: 'نظام إدارة المشاريع', requests: 8, percentage: 6 }
  ])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'request': return 'fas fa-envelope'
      case 'inquiry': return 'fas fa-question-circle'
      case 'response': return 'fas fa-reply'
      case 'demo': return 'fas fa-presentation'
      case 'convert': return 'fas fa-check-circle'
      default: return 'fas fa-info-circle'
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'request': return 'var(--primary-color)'
      case 'inquiry': return 'var(--warning-color)'
      case 'response': return 'var(--success-color)'
      case 'demo': return 'var(--secondary-color)'
      case 'convert': return 'var(--success-color)'
      default: return 'var(--gray-color)'
    }
  }

  return (
    <>
      {/* بطاقات الإحصائيات */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-trend up">
              <i className="fas fa-arrow-up"></i>
              +12%
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{stats.totalLeads.toLocaleString()}</div>
            <div className="stat-label">إجمالي العملاء المحتملين</div>
          </div>
          <div className="stat-footer">
            مقارنة بالشهر الماضي
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <div className="stat-trend up">
              <i className="fas fa-arrow-up"></i>
              +8
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{stats.newRequests}</div>
            <div className="stat-label">طلبات جديدة</div>
          </div>
          <div className="stat-footer">
            هذا الأسبوع
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-trend down">
              <i className="fas fa-arrow-down"></i>
              -3
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{stats.pendingResponses}</div>
            <div className="stat-label">ردود في الانتظار</div>
          </div>
          <div className="stat-footer">
            تحتاج متابعة
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-trend up">
              <i className="fas fa-arrow-up"></i>
              +15%
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{stats.convertedLeads}</div>
            <div className="stat-label">عملاء محولين</div>
          </div>
          <div className="stat-footer">
            هذا الشهر
          </div>
        </div>
      </div>

      {/* الجداول والمحتوى */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* النشاطات الأخيرة */}
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">النشاطات الأخيرة</h3>
            <div className="data-table-actions">
              <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '8px 15px' }}>
                <i className="fas fa-eye"></i> عرض الكل
              </button>
            </div>
          </div>
          <div style={{ padding: '20px' }}>
            {recentActivities.map((activity) => (
              <div key={activity.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '15px 0',
                borderBottom: '1px solid #f1f5f9'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: `${getActivityColor(activity.type)}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: getActivityColor(activity.type)
                }}>
                  <i className={getActivityIcon(activity.type)}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: 'var(--secondary-color)', marginBottom: '5px' }}>
                    {activity.user}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                    {activity.action}
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* الأنظمة الأكثر طلباً */}
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">الأنظمة الأكثر طلباً</h3>
            <div className="data-table-actions">
              <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '8px 15px' }}>
                <i className="fas fa-chart-bar"></i> تقرير مفصل
              </button>
            </div>
          </div>
          <div style={{ padding: '20px' }}>
            {topRequestedSystems.map((system, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '15px 0',
                borderBottom: index < topRequestedSystems.length - 1 ? '1px solid #f1f5f9' : 'none'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '600',
                    color: 'var(--secondary-color)',
                    marginBottom: '5px'
                  }}>
                    {system.name}
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#f1f5f9',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '5px'
                  }}>
                    <div style={{
                      width: `${system.percentage}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, var(--primary-color), var(--primary-light))`,
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--gray-color)'
                  }}>
                    {system.requests} طلب ({system.percentage}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
