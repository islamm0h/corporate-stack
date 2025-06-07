'use client'

import { useState, useEffect } from 'react'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6months')
  const [loading, setLoading] = useState(true)

  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalLeads: 0,
      totalRequests: 0,
      totalResponses: 0,
      conversionRate: 0,
      avgResponseTime: 0,
      customerSatisfaction: 4.6
    },
    monthlyTrends: [],
    leadSources: [],
    systemPerformance: [],
    regionalPerformance: []
  })

  // جلب جميع البيانات التحليلية
  useEffect(() => {
    const fetchAllAnalytics = async () => {
      try {
        setLoading(true)

        // جلب البيانات العامة
        const [overviewRes, trendsRes, sourcesRes, systemsRes, regionsRes] = await Promise.all([
          fetch('/api/dashboard/stats?type=overview'),
          fetch('/api/analytics/trends'),
          fetch('/api/analytics/sources'),
          fetch('/api/analytics/systems'),
          fetch('/api/analytics/regions')
        ])

        const [overview, trends, sources, systems, regions] = await Promise.all([
          overviewRes.json(),
          trendsRes.json(),
          sourcesRes.json(),
          systemsRes.json(),
          regionsRes.json()
        ])

        // تحديث البيانات العامة
        if (overview.success) {
          const data = overview.data.overview
          setAnalyticsData(prev => ({
            ...prev,
            overview: {
              ...prev.overview,
              totalLeads: data.totalLeads || 0,
              totalRequests: data.totalRequests || 0,
              totalResponses: data.totalResponses || 0,
              conversionRate: data.conversionRate || 0,
              avgResponseTime: data.avgResponseTime || 0
            }
          }))
        }

        // تحديث الاتجاهات الشهرية
        if (trends.success && trends.data.length > 0) {
          setAnalyticsData(prev => ({
            ...prev,
            monthlyTrends: trends.data
          }))
        }

        // تحديث مصادر العملاء
        if (sources.success && sources.data.length > 0) {
          setAnalyticsData(prev => ({
            ...prev,
            leadSources: sources.data
          }))
        }

        // تحديث أداء الأنظمة
        if (systems.success && systems.data.length > 0) {
          setAnalyticsData(prev => ({
            ...prev,
            systemPerformance: systems.data
          }))
        }

        // تحديث أداء المناطق
        if (regions.success && regions.data.length > 0) {
          setAnalyticsData(prev => ({
            ...prev,
            regionalPerformance: regions.data
          }))
        }

      } catch (error) {
        console.error('Error fetching analytics:', error)
        // في حالة الخطأ، استخدام بيانات فارغة
        setAnalyticsData(prev => ({
          ...prev,
          monthlyTrends: [],
          leadSources: [],
          systemPerformance: [],
          regionalPerformance: []
        }))
      } finally {
        setLoading(false)
      }
    }

    fetchAllAnalytics()
  }, [timeRange])

  const getMaxValue = (data: any[], key: string) => {
    return Math.max(...data.map(item => item[key]))
  }

  const getSourceColor = (index: number) => {
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
      {/* إحصائيات سريعة */}
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
            <div className="stat-value">{analyticsData.overview.totalLeads.toLocaleString()}</div>
            <div className="stat-label">إجمالي العملاء المحتملين</div>
          </div>
          <div className="stat-footer">
            آخر 6 أشهر
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <div className="stat-trend up">
              <i className="fas fa-arrow-up"></i>
              +8%
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{analyticsData.overview.totalRequests}</div>
            <div className="stat-label">إجمالي الطلبات</div>
          </div>
          <div className="stat-footer">
            آخر 6 أشهر
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-percentage"></i>
            </div>
            <div className="stat-trend up">
              <i className="fas fa-arrow-up"></i>
              +2.1%
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{analyticsData.overview.conversionRate}%</div>
            <div className="stat-label">معدل التحويل</div>
          </div>
          <div className="stat-footer">
            متوسط عام
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-trend down">
              <i className="fas fa-arrow-down"></i>
              -0.3
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{analyticsData.overview.avgResponseTime}</div>
            <div className="stat-label">متوسط وقت الرد (أيام)</div>
          </div>
          <div className="stat-footer">
            تحسن في الأداء
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '30px' }}>
        {/* الاتجاهات الشهرية */}
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">الاتجاهات الشهرية</h3>
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
                <div>جاري تحميل الاتجاهات الشهرية...</div>
              </div>
            ) : analyticsData.monthlyTrends.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-color)' }}>
                <i className="fas fa-chart-line" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                <div>لا توجد بيانات للاتجاهات الشهرية</div>
                <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>أضف بيانات جديدة لرؤية الاتجاهات</div>
              </div>
            ) : (
              <>
                {/* رسم بياني للعملاء المحتملين */}
                <div style={{ marginBottom: '30px' }}>
                  <h4 style={{ marginBottom: '20px', color: 'var(--secondary-color)', fontSize: '1.1rem' }}>
                    العملاء المحتملين الجدد
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'end', gap: '15px', height: '180px' }}>
                    {analyticsData.monthlyTrends.map((data, index) => {
                  const maxLeads = getMaxValue(analyticsData.monthlyTrends, 'leads')
                  const height = (data.leads / maxLeads) * 140
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
                          fontWeight: '600'
                        }}>
                          {data.leads}
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

            {/* رسم بياني للتحويلات */}
            <div>
              <h4 style={{ marginBottom: '20px', color: 'var(--secondary-color)', fontSize: '1.1rem' }}>
                التحويلات الناجحة
              </h4>
              <div style={{ display: 'flex', alignItems: 'end', gap: '15px', height: '120px' }}>
                {analyticsData.monthlyTrends.map((data, index) => {
                  const maxConversions = getMaxValue(analyticsData.monthlyTrends, 'conversions')
                  const height = (data.conversions / maxConversions) * 80
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
                        {data.conversions}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
              </>
            )}
          </div>
        </div>

        {/* مصادر العملاء المحتملين */}
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">مصادر العملاء المحتملين</h3>
          </div>
          <div style={{ padding: '30px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-color)' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                <div>جاري تحميل مصادر العملاء...</div>
              </div>
            ) : analyticsData.leadSources.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-color)' }}>
                <i className="fas fa-chart-pie" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                <div>لا توجد بيانات لمصادر العملاء</div>
                <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>أضف عملاء محتملين لرؤية المصادر</div>
              </div>
            ) : (
              <>
                {/* رسم دائري بسيط */}
                <div style={{ marginBottom: '25px', textAlign: 'center' }}>
                  <div style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: analyticsData.leadSources.length >= 5 ? `conic-gradient(
                      var(--primary-color) 0deg ${analyticsData.leadSources[0]?.percentage * 3.6 || 0}deg,
                      var(--success-color) ${analyticsData.leadSources[0]?.percentage * 3.6 || 0}deg ${((analyticsData.leadSources[0]?.percentage || 0) + (analyticsData.leadSources[1]?.percentage || 0)) * 3.6}deg,
                      var(--warning-color) ${((analyticsData.leadSources[0]?.percentage || 0) + (analyticsData.leadSources[1]?.percentage || 0)) * 3.6}deg ${((analyticsData.leadSources[0]?.percentage || 0) + (analyticsData.leadSources[1]?.percentage || 0) + (analyticsData.leadSources[2]?.percentage || 0)) * 3.6}deg,
                      var(--secondary-color) ${((analyticsData.leadSources[0]?.percentage || 0) + (analyticsData.leadSources[1]?.percentage || 0) + (analyticsData.leadSources[2]?.percentage || 0)) * 3.6}deg ${((analyticsData.leadSources[0]?.percentage || 0) + (analyticsData.leadSources[1]?.percentage || 0) + (analyticsData.leadSources[2]?.percentage || 0) + (analyticsData.leadSources[3]?.percentage || 0)) * 3.6}deg,
                      var(--danger-color) ${((analyticsData.leadSources[0]?.percentage || 0) + (analyticsData.leadSources[1]?.percentage || 0) + (analyticsData.leadSources[2]?.percentage || 0) + (analyticsData.leadSources[3]?.percentage || 0)) * 3.6}deg 360deg
                    )` : 'var(--gray-light)',
                    margin: '0 auto',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '80px',
                      height: '80px',
                      background: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column'
                    }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--secondary-color)' }}>
                        {analyticsData.overview.totalLeads}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--gray-color)' }}>
                        إجمالي
                      </div>
                    </div>
                  </div>
                </div>

                {/* قائمة المصادر */}
                <div style={{ display: 'grid', gap: '12px' }}>
                  {analyticsData.leadSources.map((source, index) => (
                <div key={source.source} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: getSourceColor(index)
                    }}></div>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--secondary-color)' }}>
                      {source.source}
                    </span>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--secondary-color)' }}>
                      {source.count}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--gray-color)' }}>
                      {source.percentage}%
                    </div>
                  </div>
                </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* أداء الأنظمة والمناطق */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* أداء الأنظمة */}
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">أداء الأنظمة</h3>
          </div>
          <div style={{ padding: '20px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-color)' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                <div>جاري تحميل أداء الأنظمة...</div>
              </div>
            ) : analyticsData.systemPerformance.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-color)' }}>
                <i className="fas fa-cogs" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                <div>لا توجد بيانات لأداء الأنظمة</div>
                <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>أضف أنظمة وطلبات لرؤية الأداء</div>
              </div>
            ) : analyticsData.systemPerformance.map((system, index) => (
              <div key={system.system} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '15px 0',
                borderBottom: index < analyticsData.systemPerformance.length - 1 ? '1px solid #f1f5f9' : 'none'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '600',
                    color: 'var(--secondary-color)',
                    marginBottom: '5px'
                  }}>
                    {system.system}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--gray-color)',
                    marginBottom: '8px'
                  }}>
                    {system.requests} طلب • {system.conversions} تحويل
                  </div>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    background: '#f1f5f9',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${system.rate}%`,
                      height: '100%',
                      background: system.rate >= 65 ? 'var(--success-color)' : system.rate >= 55 ? 'var(--warning-color)' : 'var(--danger-color)',
                      borderRadius: '3px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
                <div style={{
                  marginRight: '15px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: system.rate >= 65 ? 'var(--success-color)' : system.rate >= 55 ? 'var(--warning-color)' : 'var(--danger-color)'
                  }}>
                    {system.rate}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* أداء المناطق */}
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">أداء المناطق</h3>
          </div>
          <div style={{ padding: '20px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-color)' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                <div>جاري تحميل أداء المناطق...</div>
              </div>
            ) : analyticsData.regionalPerformance.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-color)' }}>
                <i className="fas fa-map-marker-alt" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                <div>لا توجد بيانات لأداء المناطق</div>
                <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>أضف عملاء من مناطق مختلفة لرؤية الأداء</div>
              </div>
            ) : analyticsData.regionalPerformance.map((region, index) => (
              <div key={region.region} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '15px 0',
                borderBottom: index < analyticsData.regionalPerformance.length - 1 ? '1px solid #f1f5f9' : 'none'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '600',
                    color: 'var(--secondary-color)',
                    marginBottom: '5px'
                  }}>
                    {region.region}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--gray-color)',
                    marginBottom: '8px'
                  }}>
                    {region.leads} عميل محتمل • {region.conversions} تحويل
                  </div>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    background: '#f1f5f9',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(region.rate / 15) * 100}%`,
                      height: '100%',
                      background: 'var(--primary-color)',
                      borderRadius: '3px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
                <div style={{
                  marginRight: '15px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: 'var(--primary-color)'
                  }}>
                    {region.rate}%
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
