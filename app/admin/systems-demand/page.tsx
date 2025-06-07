'use client'

import { useState, useEffect } from 'react'

interface SystemData {
  id: string
  name: string
  shortName: string
  totalRequests: number
  monthlyGrowth: string
  avgResponseTime: string
  conversionRate: number
  topRegions: string[]
  requestTypes: {
    [key: string]: number
  }
  monthlyData: Array<{
    month: string
    requests: number
  }>
}

export default function SystemsDemandReport() {
  const [systemsData, setSystemsData] = useState<SystemData[]>([])
  const [loading, setLoading] = useState(true)
  // جلب بيانات الأنظمة من قاعدة البيانات
  useEffect(() => {
    const fetchSystemsData = async () => {
      try {
        setLoading(true)

        // جلب بيانات الأنظمة
        const systemsResponse = await fetch('/api/dashboard/stats?type=systems')
        const systemsResult = await systemsResponse.json()

        if (systemsResult.success && systemsResult.data.topSystems.length > 0) {
          // تحويل البيانات إلى التنسيق المطلوب
          const transformedData: SystemData[] = systemsResult.data.topSystems.map((system: any, index: number) => ({
            id: system.id || `system-${index}`,
            name: system.name,
            shortName: system.name.length > 15 ? system.name.substring(0, 15) + '...' : system.name,
            totalRequests: system.count || 0,
            monthlyGrowth: '+0%', // سيتم حسابه لاحقاً من البيانات التاريخية
            avgResponseTime: 'غير محدد',
            conversionRate: 0, // سيتم حسابه من بيانات الردود
            topRegions: ['غير محدد'],
            requestTypes: {
              'عرض سعر': 0,
              'استفسار': 0,
              'عرض تقديمي': 0
            },
            monthlyData: [
              { month: 'يناير', requests: 0 },
              { month: 'فبراير', requests: 0 },
              { month: 'مارس', requests: 0 },
              { month: 'أبريل', requests: 0 },
              { month: 'مايو', requests: 0 },
              { month: 'يونيو', requests: 0 }
            ]
          }))

          setSystemsData(transformedData)
        } else {
          setSystemsData([])
        }
      } catch (error) {
        console.error('Error fetching systems data:', error)
        setSystemsData([])
      } finally {
        setLoading(false)
      }
    }

    fetchSystemsData()
  }, [])

  const [selectedSystem, setSelectedSystem] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('6months')

  const totalRequests = systemsData.reduce((sum, system) => sum + system.totalRequests, 0)
  const avgConversionRate = systemsData.length > 0
    ? (systemsData.reduce((sum, system) => sum + system.conversionRate, 0) / systemsData.length).toFixed(1)
    : '0'

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
            <div className="stat-value">{loading ? '...' : systemsData.length}</div>
            <div className="stat-label">الأنظمة المتاحة</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-chart-bar"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{loading ? '...' : totalRequests}</div>
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
            <div className="stat-value">
              {loading ? '...' : systemsData.length > 0 ? systemsData[0].shortName : 'غير محدد'}
            </div>
            <div className="stat-label">النظام الأكثر طلباً</div>
          </div>
          <div className="stat-footer">
            {loading ? '...' : systemsData.length > 0 ? `${systemsData[0].totalRequests} طلب` : '0 طلب'}
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-percentage"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{loading ? '...' : avgConversionRate}%</div>
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
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-color)' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                <div>جاري تحميل بيانات الأنظمة...</div>
              </div>
            ) : systemsData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-color)' }}>
                <i className="fas fa-cogs" style={{ fontSize: '3rem', marginBottom: '15px' }}></i>
                <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px' }}>
                  لا توجد أنظمة
                </div>
                <div>
                  لا توجد بيانات للأنظمة حالياً. أضف طلبات لعرض إحصائيات الأنظمة.
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'end', gap: '15px', height: '250px', marginBottom: '20px' }}>
                  {systemsData.map((system, index) => {
                    const maxRequests = Math.max(...systemsData.map(s => s.totalRequests), 1)
                    const height = maxRequests > 0 ? (system.totalRequests / maxRequests) * 200 : 20
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
                          background: system.totalRequests > 0
                            ? `linear-gradient(to top, ${getSystemColor(index)}, ${getSystemColor(index)}80)`
                            : '#f1f5f9',
                          borderRadius: '4px 4px 0 0',
                          marginBottom: '10px',
                          position: 'relative',
                          transition: 'all 0.3s ease',
                          border: selectedSystem === system.id ? `3px solid ${getSystemColor(index)}` :
                                  system.totalRequests === 0 ? '1px dashed var(--gray-color)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (system.totalRequests > 0) {
                            e.currentTarget.style.transform = 'scaleY(1.05)'
                            e.currentTarget.style.filter = 'brightness(1.1)'
                          }
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
              </>
            )}
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
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-color)' }}>
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                  <div>جاري تحميل بيانات الأنظمة...</div>
                </td>
              </tr>
            ) : systemsData.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-color)' }}>
                  <i className="fas fa-cogs" style={{ fontSize: '3rem', marginBottom: '15px' }}></i>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px' }}>
                    لا توجد أنظمة
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    لا توجد بيانات للأنظمة حالياً. أضف طلبات لعرض إحصائيات الأنظمة.
                  </div>
                </td>
              </tr>
            ) : systemsData.map((system, index) => (
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
                    color: system.monthlyGrowth.startsWith('+') ? 'var(--success-color)' : 'var(--gray-color)',
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
                    background: system.conversionRate >= 65 ? 'var(--success-light)' :
                               system.conversionRate > 0 ? 'var(--warning-light)' : '#f1f5f9',
                    color: system.conversionRate >= 65 ? 'var(--success-color)' :
                           system.conversionRate > 0 ? 'var(--warning-color)' : 'var(--gray-color)'
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
                        background: region === 'غير محدد' ? '#f1f5f9' : 'var(--primary-light)',
                        color: region === 'غير محدد' ? 'var(--gray-color)' : 'var(--primary-color)'
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
