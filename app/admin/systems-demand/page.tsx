'use client'

import { useState } from 'react'

export default function SystemsDemandReport() {
  const [systemsData] = useState([
    {
      id: 1,
      name: 'نظام المحاسبة والفاتورة الإلكترونية',
      shortName: 'المحاسبة',
      totalRequests: 145,
      monthlyGrowth: '+18%',
      avgResponseTime: '2.3 أيام',
      conversionRate: 68,
      topRegions: ['الرياض', 'جدة', 'الدمام'],
      requestTypes: {
        'عرض سعر': 85,
        'استفسار': 35,
        'عرض تقديمي': 25
      },
      monthlyData: [
        { month: 'يناير', requests: 20 },
        { month: 'فبراير', requests: 22 },
        { month: 'مارس', requests: 25 },
        { month: 'أبريل', requests: 28 },
        { month: 'مايو', requests: 24 },
        { month: 'يونيو', requests: 26 }
      ]
    },
    {
      id: 2,
      name: 'نظام إدارة العملاء (CRM)',
      shortName: 'إدارة العملاء',
      totalRequests: 98,
      monthlyGrowth: '+12%',
      avgResponseTime: '1.8 أيام',
      conversionRate: 72,
      topRegions: ['جدة', 'الرياض', 'الخبر'],
      requestTypes: {
        'عرض سعر': 55,
        'استفسار': 28,
        'عرض تقديمي': 15
      },
      monthlyData: [
        { month: 'يناير', requests: 14 },
        { month: 'فبراير', requests: 16 },
        { month: 'مارس', requests: 18 },
        { month: 'أبريل', requests: 17 },
        { month: 'مايو', requests: 16 },
        { month: 'يونيو', requests: 17 }
      ]
    },
    {
      id: 3,
      name: 'نظام إدارة الموارد البشرية',
      shortName: 'الموارد البشرية',
      totalRequests: 76,
      monthlyGrowth: '+8%',
      avgResponseTime: '2.1 أيام',
      conversionRate: 65,
      topRegions: ['الرياض', 'المدينة المنورة', 'الدمام'],
      requestTypes: {
        'عرض سعر': 42,
        'استفسار': 22,
        'عرض تقديمي': 12
      },
      monthlyData: [
        { month: 'يناير', requests: 11 },
        { month: 'فبراير', requests: 12 },
        { month: 'مارس', requests: 13 },
        { month: 'أبريل', requests: 14 },
        { month: 'مايو', requests: 13 },
        { month: 'يونيو', requests: 13 }
      ]
    },
    {
      id: 4,
      name: 'نظام إدارة المخزون',
      shortName: 'إدارة المخزون',
      totalRequests: 64,
      monthlyGrowth: '+15%',
      avgResponseTime: '1.9 أيام',
      conversionRate: 58,
      topRegions: ['الدمام', 'الرياض', 'جدة'],
      requestTypes: {
        'عرض سعر': 38,
        'استفسار': 16,
        'عرض تقديمي': 10
      },
      monthlyData: [
        { month: 'يناير', requests: 9 },
        { month: 'فبراير', requests: 10 },
        { month: 'مارس', requests: 11 },
        { month: 'أبريل', requests: 12 },
        { month: 'مايو', requests: 11 },
        { month: 'يونيو', requests: 11 }
      ]
    },
    {
      id: 5,
      name: 'نظام إدارة المشاريع',
      shortName: 'إدارة المشاريع',
      totalRequests: 42,
      monthlyGrowth: '+5%',
      avgResponseTime: '2.8 أيام',
      conversionRate: 52,
      topRegions: ['الرياض', 'جدة', 'أبها'],
      requestTypes: {
        'عرض سعر': 22,
        'استفسار': 12,
        'عرض تقديمي': 8
      },
      monthlyData: [
        { month: 'يناير', requests: 6 },
        { month: 'فبراير', requests: 7 },
        { month: 'مارس', requests: 7 },
        { month: 'أبريل', requests: 8 },
        { month: 'مايو', requests: 7 },
        { month: 'يونيو', requests: 7 }
      ]
    }
  ])

  const [selectedSystem, setSelectedSystem] = useState<number | null>(null)
  const [timeRange, setTimeRange] = useState('6months')

  const totalRequests = systemsData.reduce((sum, system) => sum + system.totalRequests, 0)
  const avgConversionRate = (systemsData.reduce((sum, system) => sum + system.conversionRate, 0) / systemsData.length).toFixed(1)

  const getSystemColor = (index: number) => {
    const colors = [
      'var(--primary-color)',
      'var(--success-color)',
      'var(--warning-color)',
      'var(--secondary-color)',
      'var(--danger-color)'
    ]
    return colors[index % colors.length]
  }

  return (
    <>
      {/* إحصائيات عامة */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-cogs"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{systemsData.length}</div>
            <div className="stat-label">الأنظمة المتاحة</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-chart-bar"></i>
            </div>
            <div className="stat-trend up">
              <i className="fas fa-arrow-up"></i>
              +12%
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{totalRequests}</div>
            <div className="stat-label">إجمالي الطلبات</div>
          </div>
          <div className="stat-footer">
            آخر 6 أشهر
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-trophy"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{systemsData[0].shortName}</div>
            <div className="stat-label">النظام الأكثر طلباً</div>
          </div>
          <div className="stat-footer">
            {systemsData[0].totalRequests} طلب
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-percentage"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{avgConversionRate}%</div>
            <div className="stat-label">متوسط معدل التحويل</div>
          </div>
          <div className="stat-footer">
            جميع الأنظمة
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
        {/* رسم بياني للطلب على الأنظمة */}
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">الطلب على الأنظمة</h3>
            <div className="data-table-actions">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                style={{
                  padding: '8px 15px',
                  border: '2px solid var(--border-color)',
                  borderRadius: '6px',
                  fontSize: '0.9rem'
                }}
              >
                <option value="3months">آخر 3 أشهر</option>
                <option value="6months">آخر 6 أشهر</option>
                <option value="year">هذا العام</option>
              </select>
            </div>
          </div>
          <div style={{ padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'end', gap: '15px', height: '250px', marginBottom: '20px' }}>
              {systemsData.map((system, index) => {
                const maxRequests = Math.max(...systemsData.map(s => s.totalRequests))
                const height = (system.totalRequests / maxRequests) * 200
                return (
                  <div key={system.id} style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    flex: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedSystem(selectedSystem === system.id ? null : system.id)}
                  >
                    <div style={{
                      width: '100%',
                      height: `${height}px`,
                      background: `linear-gradient(to top, ${getSystemColor(index)}, ${getSystemColor(index)}80)`,
                      borderRadius: '4px 4px 0 0',
                      marginBottom: '10px',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      border: selectedSystem === system.id ? `3px solid ${getSystemColor(index)}` : 'none'
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
                        top: '-30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'var(--secondary-color)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {system.totalRequests}
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: '0.7rem', 
                      color: 'var(--gray-color)', 
                      textAlign: 'center',
                      fontWeight: '500',
                      lineHeight: '1.2'
                    }}>
                      {system.shortName}
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)', textAlign: 'center' }}>
              انقر على أي نظام لعرض التفاصيل
            </div>
          </div>
        </div>

        {/* تفاصيل النظام المحدد */}
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">
              {selectedSystem ? 
                systemsData.find(s => s.id === selectedSystem)?.shortName : 
                'اختر نظام لعرض التفاصيل'
              }
            </h3>
          </div>
          <div style={{ padding: '30px' }}>
            {selectedSystem ? (
              <div>
                {(() => {
                  const system = systemsData.find(s => s.id === selectedSystem)
                  if (!system) return null
                  
                  return (
                    <>
                      {/* إحصائيات النظام */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                        <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--primary-color)' }}>
                            {system.totalRequests}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                            إجمالي الطلبات
                          </div>
                        </div>
                        <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--success-color)' }}>
                            {system.conversionRate}%
                          </div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                            معدل التحويل
                          </div>
                        </div>
                      </div>

                      {/* أنواع الطلبات */}
                      <div style={{ marginBottom: '25px' }}>
                        <h4 style={{ marginBottom: '15px', color: 'var(--secondary-color)' }}>
                          أنواع الطلبات
                        </h4>
                        <div style={{ display: 'grid', gap: '10px' }}>
                          {Object.entries(system.requestTypes).map(([type, count], index) => (
                            <div key={type} style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '10px 15px',
                              background: '#f8fafc',
                              borderRadius: '8px'
                            }}>
                              <span style={{ fontWeight: '500', color: 'var(--secondary-color)' }}>
                                {type}
                              </span>
                              <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                                {count}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* أهم المناطق */}
                      <div>
                        <h4 style={{ marginBottom: '15px', color: 'var(--secondary-color)' }}>
                          أهم المناطق
                        </h4>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          {system.topRegions.map((region, index) => (
                            <span key={region} style={{
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '500',
                              background: 'var(--primary-light)',
                              color: 'var(--primary-color)'
                            }}>
                              {region}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
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
                  <i className="fas fa-cogs"></i>
                </div>
                <h4 style={{ marginBottom: '10px', color: 'var(--secondary-color)' }}>
                  اختر نظام
                </h4>
                <p style={{ color: 'var(--gray-color)', margin: 0 }}>
                  انقر على أي نظام من الرسم البياني لعرض تفاصيله
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* جدول مقارنة الأنظمة */}
      <div className="data-table-container">
        <div className="data-table-header">
          <h3 className="data-table-title">مقارنة أداء الأنظمة</h3>
          <div className="data-table-actions">
            <button className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '8px 15px' }}>
              <i className="fas fa-download"></i> تصدير التقرير
            </button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>النظام</th>
              <th>إجمالي الطلبات</th>
              <th>النمو الشهري</th>
              <th>متوسط وقت الرد</th>
              <th>معدل التحويل</th>
              <th>أهم المناطق</th>
            </tr>
          </thead>
          <tbody>
            {systemsData.map((system, index) => (
              <tr key={system.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: getSystemColor(index)
                    }}></div>
                    <span style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>
                      {system.shortName}
                    </span>
                  </div>
                </td>
                <td style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                  {system.totalRequests}
                </td>
                <td>
                  <span style={{
                    color: 'var(--success-color)',
                    fontWeight: '600'
                  }}>
                    {system.monthlyGrowth}
                  </span>
                </td>
                <td>{system.avgResponseTime}</td>
                <td>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    background: system.conversionRate >= 65 ? 'var(--success-light)' : 'var(--warning-light)',
                    color: system.conversionRate >= 65 ? 'var(--success-color)' : 'var(--warning-color)'
                  }}>
                    {system.conversionRate}%
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {system.topRegions.slice(0, 2).map((region, regionIndex) => (
                      <span key={region} style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        background: 'var(--primary-light)',
                        color: 'var(--primary-color)'
                      }}>
                        {region}
                      </span>
                    ))}
                    {system.topRegions.length > 2 && (
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        background: '#f1f5f9',
                        color: 'var(--gray-color)'
                      }}>
                        +{system.topRegions.length - 2}
                      </span>
                    )}
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
