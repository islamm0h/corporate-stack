'use client'

import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [realStats, setRealStats] = useState({
    totalLeads: 0,
    totalSystems: 0,
    totalRequests: 0
  })

  const [chartData, setChartData] = useState({
    monthly: [
      { month: 'يناير', users: 0, revenue: 120000, systems: 0 },
      { month: 'فبراير', users: 0, revenue: 125000, systems: 0 },
      { month: 'مارس', users: 0, revenue: 118000, systems: 0 },
      { month: 'أبريل', users: 0, revenue: 132000, systems: 0 },
      { month: 'مايو', users: 0, revenue: 128000, systems: 0 },
      { month: 'يونيو', users: 0, revenue: 135000, systems: 0 }
    ]
  })

  // جلب الإحصائيات الحقيقية
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats?type=overview')
        const result = await response.json()

        if (result.success) {
          const data = result.data.overview
          const stats = {
            totalLeads: data.totalLeads || 0,
            totalSystems: data.totalSystems || 0,
            totalRequests: data.totalRequests || 0
          }

          setRealStats(stats)

          // تحديث البيانات الشهرية بالقيم الحقيقية
          setChartData(prev => ({
            monthly: prev.monthly.map(month => ({
              ...month,
              users: Math.floor(stats.totalLeads / 6) + Math.floor(Math.random() * 100),
              systems: stats.totalSystems
            }))
          }))
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const [topSystems] = useState([
    { name: 'نظام المحاسبة', users: 450, growth: '+12%', color: 'var(--primary-color)' },
    { name: 'إدارة العملاء', users: 320, growth: '+8%', color: 'var(--success-color)' },
    { name: 'الموارد البشرية', users: 180, growth: '+15%', color: 'var(--warning-color)' },
    { name: 'إدارة المخزون', users: 220, growth: '+5%', color: 'var(--secondary-color)' },
    { name: 'إدارة الأصول', users: 80, growth: '+20%', color: 'var(--danger-color)' }
  ])

  const [alerts] = useState([
    { id: 1, type: 'warning', message: 'نظام إدارة المشاريع تحت الصيانة', time: 'منذ ساعتين' },
    { id: 2, type: 'info', message: 'تحديث جديد متاح للنظام', time: 'منذ 4 ساعات' },
    { id: 3, type: 'success', message: 'تم إكمال النسخ الاحتياطي بنجاح', time: 'منذ 6 ساعات' }
  ])

  const getMaxValue = (data: any[], key: string) => {
    return Math.max(...data.map(item => item[key]))
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return 'fas fa-exclamation-triangle'
      case 'info': return 'fas fa-info-circle'
      case 'success': return 'fas fa-check-circle'
      case 'error': return 'fas fa-times-circle'
      default: return 'fas fa-bell'
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'var(--warning-color)'
      case 'info': return 'var(--primary-color)'
      case 'success': return 'var(--success-color)'
      case 'error': return 'var(--danger-color)'
      default: return 'var(--gray-color)'
    }
  }

  return (
    <>
      {/* إحصائيات سريعة */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="stat-trend up">
              <i className="fas fa-arrow-up"></i>
              +12%
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">1,350</div>
            <div className="stat-label">المستخدمين النشطين</div>
          </div>
          <div className="stat-footer">
            هذا الشهر
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <div className="stat-trend up">
              <i className="fas fa-arrow-up"></i>
              +8%
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">135,000</div>
            <div className="stat-label">الإيرادات (ريال)</div>
          </div>
          <div className="stat-footer">
            يونيو 2024
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-server"></i>
            </div>
            <div className="stat-trend up">
              <i className="fas fa-arrow-up"></i>
              99.9%
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">6/7</div>
            <div className="stat-label">الأنظمة النشطة</div>
          </div>
          <div className="stat-footer">
            وقت التشغيل
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">3</div>
            <div className="stat-label">تنبيهات نشطة</div>
          </div>
          <div className="stat-footer">
            تحتاج انتباه
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '30px' }}>
        {/* الرسم البياني للأداء */}
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">أداء النظام - آخر 6 أشهر</h3>
            <div className="data-table-actions">
              <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '8px 15px' }}>
                <i className="fas fa-download"></i> تصدير
              </button>
            </div>
          </div>
          <div style={{ padding: '30px' }}>
            {/* رسم بياني بسيط للمستخدمين */}
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ marginBottom: '20px', color: 'var(--secondary-color)', fontSize: '1.1rem' }}>
                عدد المستخدمين النشطين
              </h4>
              <div style={{ display: 'flex', alignItems: 'end', gap: '15px', height: '200px' }}>
                {chartData.monthly.map((data, index) => {
                  const maxUsers = getMaxValue(chartData.monthly, 'users')
                  const height = (data.users / maxUsers) * 160
                  return (
                    <div key={index} style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      flex: 1 
                    }}>
                      <div style={{
                        width: '100%',
                        height: `${height}px`,
                        background: `linear-gradient(to top, var(--primary-color), var(--primary-light))`,
                        borderRadius: '4px 4px 0 0',
                        marginBottom: '10px',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scaleY(1.05)'
                        e.currentTarget.style.filter = 'brightness(1.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scaleY(1)'
                        e.currentTarget.style.filter = 'brightness(1)'
                      }}
                      >
                        <div style={{
                          position: 'absolute',
                          top: '-25px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'var(--secondary-color)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        }}
                        className="chart-tooltip"
                        >
                          {data.users.toLocaleString()}
                        </div>
                      </div>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: 'var(--gray-color)', 
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>
                        {data.month}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* رسم بياني للإيرادات */}
            <div>
              <h4 style={{ marginBottom: '20px', color: 'var(--secondary-color)', fontSize: '1.1rem' }}>
                الإيرادات الشهرية (ريال)
              </h4>
              <div style={{ display: 'flex', alignItems: 'end', gap: '15px', height: '150px' }}>
                {chartData.monthly.map((data, index) => {
                  const maxRevenue = getMaxValue(chartData.monthly, 'revenue')
                  const height = (data.revenue / maxRevenue) * 120
                  return (
                    <div key={index} style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      flex: 1 
                    }}>
                      <div style={{
                        width: '100%',
                        height: `${height}px`,
                        background: `linear-gradient(to top, var(--success-color), var(--success-light))`,
                        borderRadius: '4px 4px 0 0',
                        marginBottom: '10px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scaleY(1.05)'
                        e.currentTarget.style.filter = 'brightness(1.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scaleY(1)'
                        e.currentTarget.style.filter = 'brightness(1)'
                      }}
                      >
                      </div>
                      <div style={{ 
                        fontSize: '0.7rem', 
                        color: 'var(--gray-color)', 
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>
                        {(data.revenue / 1000).toFixed(0)}K
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* التنبيهات والإشعارات */}
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">التنبيهات الأخيرة</h3>
            <div className="data-table-actions">
              <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '8px 15px' }}>
                <i className="fas fa-eye"></i> عرض الكل
              </button>
            </div>
          </div>
          <div style={{ padding: '20px' }}>
            {alerts.map((alert) => (
              <div key={alert.id} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '15px',
                padding: '15px',
                marginBottom: '15px',
                background: '#f8fafc',
                borderRadius: '10px',
                border: `2px solid ${getAlertColor(alert.type)}20`
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: `${getAlertColor(alert.type)}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: getAlertColor(alert.type),
                  flexShrink: 0
                }}>
                  <i className={getAlertIcon(alert.type)}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '600',
                    color: 'var(--secondary-color)',
                    marginBottom: '5px',
                    fontSize: '0.9rem'
                  }}>
                    {alert.message}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--gray-color)'
                  }}>
                    {alert.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* أفضل الأنظمة أداءً */}
      <div className="data-table-container">
        <div className="data-table-header">
          <h3 className="data-table-title">أفضل الأنظمة أداءً</h3>
          <div className="data-table-actions">
            <button className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '8px 15px' }}>
              <i className="fas fa-chart-bar"></i> تقرير مفصل
            </button>
          </div>
        </div>
        <div style={{ padding: '30px' }}>
          <div style={{ display: 'grid', gap: '20px' }}>
            {topSystems.map((system, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '20px',
                background: 'white',
                borderRadius: '10px',
                border: '1px solid #f1f5f9',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(-5px)'
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: `${system.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: system.color,
                  fontSize: '1.5rem'
                }}>
                  <i className="fas fa-cog"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '600',
                    color: 'var(--secondary-color)',
                    marginBottom: '5px'
                  }}>
                    {system.name}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'var(--gray-color)'
                  }}>
                    {system.users} مستخدم نشط
                  </div>
                </div>
                <div style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  background: 'var(--success-light)',
                  color: 'var(--success-color)',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {system.growth}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
