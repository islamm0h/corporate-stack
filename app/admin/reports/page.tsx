'use client'

import { useState, useEffect } from 'react'

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedReport, setSelectedReport] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [realStats, setRealStats] = useState({
    totalLeads: 0,
    totalRequests: 0,
    totalResponses: 0,
    conversionRate: 0
  })

  // جلب الإحصائيات الحقيقية
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // جلب الإحصائيات العامة
        const overviewResponse = await fetch('/api/dashboard/stats?type=overview')
        const overviewResult = await overviewResponse.json()

        if (overviewResult.success) {
          const data = overviewResult.data.overview
          setRealStats({
            totalLeads: data.totalLeads || 0,
            totalRequests: data.totalRequests || 0,
            totalResponses: data.totalResponses || 0,
            conversionRate: data.conversionRate || 0
          })
        }

        // جلب البيانات الشهرية
        const trendsResponse = await fetch('/api/analytics/trends')
        const trendsResult = await trendsResponse.json()

        if (trendsResult.success && trendsResult.data.length > 0) {
          setMonthlyData(trendsResult.data.map(item => ({
            month: item.month,
            leads: item.leads || 0,
            requests: item.requests || 0,
            conversions: item.conversions || 0
          })))
        }

        // جلب بيانات الأنظمة
        const systemsResponse = await fetch('/api/dashboard/stats?type=systems')
        const systemsResult = await systemsResponse.json()

        if (systemsResult.success && systemsResult.data.topSystems.length > 0) {
          const systemsData = systemsResult.data.topSystems.map((system, index) => ({
            name: system.name,
            requests: system.count || 0,
            conversions: Math.floor((system.count || 0) * 0.7), // تقدير التحويلات
            rate: system.count > 0 ? Math.floor((Math.floor((system.count || 0) * 0.7) / system.count) * 100) : 0,
            color: ['var(--primary-color)', 'var(--success-color)', 'var(--warning-color)', 'var(--secondary-color)', 'var(--danger-color)'][index] || 'var(--gray-color)'
          }))
          setSystemDemand(systemsData)
        }

      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const reportTypes = [
    { id: 'overview', name: 'نظرة عامة', icon: 'fas fa-chart-pie' },
    { id: 'leads', name: 'تقرير العملاء المحتملين', icon: 'fas fa-users' },
    { id: 'requests', name: 'تقرير الطلبات', icon: 'fas fa-envelope' },
    { id: 'conversions', name: 'تقرير التحويلات', icon: 'fas fa-check-circle' },
    { id: 'sources', name: 'تقرير مصادر العملاء', icon: 'fas fa-chart-bar' },
    { id: 'performance', name: 'تقرير الأداء', icon: 'fas fa-tachometer-alt' }
  ]

  const [monthlyData, setMonthlyData] = useState([
    { month: 'يناير', leads: 0, requests: 0, conversions: 0 },
    { month: 'فبراير', leads: 0, requests: 0, conversions: 0 },
    { month: 'مارس', leads: 0, requests: 0, conversions: 0 },
    { month: 'أبريل', leads: 0, requests: 0, conversions: 0 },
    { month: 'مايو', leads: 0, requests: 0, conversions: 0 },
    { month: 'يونيو', leads: 0, requests: 0, conversions: 0 }
  ])

  const [systemDemand, setSystemDemand] = useState([
    { name: 'نظام المحاسبة', requests: 0, conversions: 0, rate: 0, color: 'var(--primary-color)' },
    { name: 'إدارة العملاء', requests: 0, conversions: 0, rate: 0, color: 'var(--success-color)' },
    { name: 'الموارد البشرية', requests: 0, conversions: 0, rate: 0, color: 'var(--warning-color)' },
    { name: 'إدارة المخزون', requests: 0, conversions: 0, rate: 0, color: 'var(--secondary-color)' },
    { name: 'إدارة المشاريع', requests: 0, conversions: 0, rate: 0, color: 'var(--danger-color)' }
  ])

  const [recentReports, setRecentReports] = useState([])

  return (
    <>
      {/* إحصائيات التقارير */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-file-alt"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{loading ? '...' : '0'}</div>
            <div className="stat-label">التقارير المُنشأة</div>
          </div>
          <div className="stat-footer">
            هذا الشهر
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-download"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{loading ? '...' : '0'}</div>
            <div className="stat-label">مرات التحميل</div>
          </div>
          <div className="stat-footer">
            آخر 30 يوم
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{loading ? '...' : '0'}</div>
            <div className="stat-label">تقارير مجدولة</div>
          </div>
          <div className="stat-footer">
            تعمل تلقائياً
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{loading ? '...' : '0'}</div>
            <div className="stat-label">تقارير فاشلة</div>
          </div>
          <div className="stat-footer">
            تحتاج مراجعة
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px' }}>
        {/* قائمة أنواع التقارير */}
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">أنواع التقارير</h3>
          </div>
          <div style={{ padding: '20px' }}>
            {reportTypes.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 15px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  marginBottom: '8px',
                  background: selectedReport === report.id ? 'var(--primary-light)' : 'transparent',
                  color: selectedReport === report.id ? 'var(--primary-color)' : 'var(--gray-color)'
                }}
                onMouseEnter={(e) => {
                  if (selectedReport !== report.id) {
                    e.currentTarget.style.background = '#f8fafc'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedReport !== report.id) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <i className={report.icon} style={{ width: '20px', textAlign: 'center' }}></i>
                <span style={{ fontWeight: selectedReport === report.id ? '600' : '500' }}>
                  {report.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* محتوى التقرير */}
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">
              {reportTypes.find(r => r.id === selectedReport)?.name || 'نظرة عامة'}
            </h3>
            <div className="data-table-actions">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                style={{
                  padding: '8px 15px',
                  border: '2px solid var(--border-color)',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  marginLeft: '10px'
                }}
              >
                <option value="week">هذا الأسبوع</option>
                <option value="month">هذا الشهر</option>
                <option value="quarter">هذا الربع</option>
                <option value="year">هذا العام</option>
              </select>
              <button className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '8px 15px' }}>
                <i className="fas fa-download"></i> تصدير
              </button>
            </div>
          </div>

          {selectedReport === 'overview' && (
            <div style={{ padding: '30px' }}>
              {/* رسم بياني للبيانات الشهرية */}
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ marginBottom: '20px', color: 'var(--secondary-color)' }}>الأداء الشهري</h4>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-color)' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                    <div>جاري تحميل البيانات الشهرية...</div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '15px' }}>
                    {monthlyData.map((data, index) => (
                      <div key={index} style={{
                        background: '#f8fafc',
                        padding: '15px',
                        borderRadius: '10px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)', marginBottom: '8px' }}>
                          {data.month}
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--primary-color)', marginBottom: '5px' }}>
                          {data.leads}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--gray-color)' }}>
                          عميل محتمل
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* الطلب على الأنظمة */}
              <div>
                <h4 style={{ marginBottom: '20px', color: 'var(--secondary-color)' }}>الطلب على الأنظمة</h4>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-color)' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                    <div>جاري تحميل بيانات الأنظمة...</div>
                  </div>
                ) : systemDemand.every(system => system.requests === 0) ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-color)' }}>
                    <i className="fas fa-chart-bar" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                    <div>لا توجد بيانات للأنظمة</div>
                    <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>
                      أضف طلبات لعرض إحصائيات الأنظمة
                    </div>
                  </div>
                ) : systemDemand.map((system, index) => (
                  <div key={index} style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '500', color: 'var(--secondary-color)' }}>
                        {system.name}
                      </span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                        {system.requests} طلب • {system.conversions} تحويل ({system.rate}%)
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: '#f1f5f9',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${system.rate}%`,
                        height: '100%',
                        background: system.color,
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedReport !== 'overview' && (
            <div style={{ padding: '30px', textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'var(--primary-light)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: 'var(--primary-color)',
                fontSize: '2rem'
              }}>
                <i className={reportTypes.find(r => r.id === selectedReport)?.icon}></i>
              </div>
              <h4 style={{ marginBottom: '10px', color: 'var(--secondary-color)' }}>
                {reportTypes.find(r => r.id === selectedReport)?.name}
              </h4>
              <p style={{ color: 'var(--gray-color)', marginBottom: '20px' }}>
                سيتم عرض بيانات هذا التقرير هنا
              </p>
              <button className="btn btn-primary">
                <i className="fas fa-chart-bar"></i> إنشاء التقرير
              </button>
            </div>
          )}
        </div>
      </div>

      {/* التقارير الأخيرة */}
      <div className="data-table-container">
        <div className="data-table-header">
          <h3 className="data-table-title">التقارير الأخيرة</h3>
          <div className="data-table-actions">
            <button className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '8px 15px' }}>
              <i className="fas fa-eye"></i> عرض الكل
            </button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>اسم التقرير</th>
              <th>النوع</th>
              <th>تاريخ الإنشاء</th>
              <th>الحجم</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {recentReports.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-color)' }}>
                  <i className="fas fa-file-alt" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                  <div>لا توجد تقارير</div>
                  <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>
                    لم يتم إنشاء أي تقارير بعد
                  </div>
                </td>
              </tr>
            ) : recentReports.map((report) => (
              <tr key={report.id}>
                <td style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>
                  {report.name}
                </td>
                <td>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    background: 'var(--primary-light)',
                    color: 'var(--primary-color)'
                  }}>
                    {report.type}
                  </span>
                </td>
                <td>{report.date}</td>
                <td>{report.size}</td>
                <td>
                  <span className={`status-badge ${report.status === 'مكتمل' ? 'active' : 'pending'}`}>
                    {report.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button className="action-btn view">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="action-btn edit">
                      <i className="fas fa-download"></i>
                    </button>
                    <button className="action-btn delete">
                      <i className="fas fa-trash"></i>
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
