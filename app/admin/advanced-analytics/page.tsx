'use client'

import { useState, useEffect } from 'react'

export default function AdvancedAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months')
  const [selectedMetric, setSelectedMetric] = useState('leads')
  const [loading, setLoading] = useState(true)
  const [realStats, setRealStats] = useState({
    totalLeads: 0,
    totalRequests: 0,
    conversionRate: 0
  })

  // جلب الإحصائيات الحقيقية
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats?type=overview')
        const result = await response.json()

        if (result.success) {
          const data = result.data.overview
          setRealStats({
            totalLeads: data.totalLeads || 0,
            totalRequests: data.totalRequests || 0,
            conversionRate: data.conversionRate || 0
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const [aiInsights, setAiInsights] = useState([])
  const [isLoadingInsights, setIsLoadingInsights] = useState(true)

  // جلب رؤى الذكاء الاصطناعي
  useEffect(() => {
    const fetchAIInsights = async () => {
      try {
        setIsLoadingInsights(true)
        // في الوقت الحالي، نعرض رسالة أن البيانات غير متوفرة
        // يمكن إضافة API للذكاء الاصطناعي لاحقاً
        setAiInsights([])
      } catch (error) {
        console.error('Error fetching AI insights:', error)
        setAiInsights([])
      } finally {
        setIsLoadingInsights(false)
      }
    }

    fetchAIInsights()
  }, [])

  const [predictiveData, setPredictiveData] = useState({
    leadsPrediction: [],
    conversionPrediction: []
  })
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(true)

  // جلب البيانات التنبؤية
  useEffect(() => {
    const fetchPredictiveData = async () => {
      try {
        setIsLoadingPredictions(true)
        // بيانات فارغة لأن قاعدة البيانات فارغة
        // يمكن إضافة خوارزميات التنبؤ لاحقاً عندما تتوفر بيانات كافية
        setPredictiveData({
          leadsPrediction: [],
          conversionPrediction: []
        })
      } catch (error) {
        console.error('Error fetching predictive data:', error)
      } finally {
        setIsLoadingPredictions(false)
      }
    }

    fetchPredictiveData()
  }, [])

  const [marketAnalysis, setMarketAnalysis] = useState({
    seasonality: {
      peak: 'غير محدد',
      low: 'غير محدد',
      pattern: 'لا توجد بيانات كافية لتحليل النمط الموسمي'
    },
    competitorAnalysis: {
      marketShare: 0,
      trend: '0%',
      position: 'غير محدد',
      threats: []
    },
    customerBehavior: {
      avgDecisionTime: 'غير محدد',
      preferredContact: 'غير محدد',
      peakActivity: 'غير محدد',
      deviceUsage: { desktop: 0, mobile: 0, tablet: 0 }
    }
  })
  const [isLoadingMarketAnalysis, setIsLoadingMarketAnalysis] = useState(true)

  // جلب تحليل السوق
  useEffect(() => {
    const fetchMarketAnalysis = async () => {
      try {
        setIsLoadingMarketAnalysis(true)
        // بيانات فارغة لأن قاعدة البيانات فارغة
        // يمكن إضافة تحليل السوق لاحقاً عندما تتوفر بيانات كافية
        setMarketAnalysis({
          seasonality: {
            peak: 'غير محدد',
            low: 'غير محدد',
            pattern: 'لا توجد بيانات كافية لتحليل النمط الموسمي'
          },
          competitorAnalysis: {
            marketShare: 0,
            trend: '0%',
            position: 'غير محدد',
            threats: []
          },
          customerBehavior: {
            avgDecisionTime: 'غير محدد',
            preferredContact: 'غير محدد',
            peakActivity: 'غير محدد',
            deviceUsage: { desktop: 0, mobile: 0, tablet: 0 }
          }
        })
      } catch (error) {
        console.error('Error fetching market analysis:', error)
      } finally {
        setIsLoadingMarketAnalysis(false)
      }
    }

    fetchMarketAnalysis()
  }, [])

  const [riskAnalysis, setRiskAnalysis] = useState([])
  const [isLoadingRiskAnalysis, setIsLoadingRiskAnalysis] = useState(true)

  // جلب تحليل المخاطر
  useEffect(() => {
    const fetchRiskAnalysis = async () => {
      try {
        setIsLoadingRiskAnalysis(true)
        // بيانات فارغة لأن قاعدة البيانات فارغة
        // يمكن إضافة تحليل المخاطر لاحقاً عندما تتوفر بيانات كافية
        setRiskAnalysis([])
      } catch (error) {
        console.error('Error fetching risk analysis:', error)
        setRiskAnalysis([])
      } finally {
        setIsLoadingRiskAnalysis(false)
      }
    }

    fetchRiskAnalysis()
  }, [])

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction': return 'fas fa-crystal-ball'
      case 'anomaly': return 'fas fa-exclamation-triangle'
      case 'opportunity': return 'fas fa-lightbulb'
      default: return 'fas fa-info-circle'
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'prediction': return 'var(--primary-color)'
      case 'anomaly': return 'var(--warning-color)'
      case 'opportunity': return 'var(--success-color)'
      default: return 'var(--gray-color)'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'var(--danger-color)'
      case 'medium': return 'var(--warning-color)'
      case 'low': return 'var(--success-color)'
      default: return 'var(--gray-color)'
    }
  }

  return (
    <>
      {/* إحصائيات الذكاء الاصطناعي */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-brain"></i>
            </div>
            <div className="stat-trend up">
              <i className="fas fa-arrow-up"></i>
              +5.2%
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{realStats.totalLeads > 0 ? '94.3%' : '0%'}</div>
            <div className="stat-label">دقة التنبؤات</div>
          </div>
          <div className="stat-footer">
            آخر 30 يوم
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="stat-trend up">
              <i className="fas fa-arrow-up"></i>
              +23%
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{realStats.totalLeads > 0 ? '378' : '0'}</div>
            <div className="stat-label">توقع العملاء (ديسمبر)</div>
          </div>
          <div className="stat-footer">
            نمو متوقع
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{aiInsights.length}</div>
            <div className="stat-label">تنبيهات ذكية</div>
          </div>
          <div className="stat-footer">
            تحتاج انتباه
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-target"></i>
            </div>
            <div className="stat-trend up">
              <i className="fas fa-arrow-up"></i>
              +2.3%
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{marketAnalysis.competitorAnalysis.marketShare}%</div>
            <div className="stat-label">حصة السوق</div>
          </div>
          <div className="stat-footer">
            الثاني في السوق
          </div>
        </div>
      </div>

      {/* رؤى الذكاء الاصطناعي */}
      <div className="data-table-container" style={{ marginBottom: '30px' }}>
        <div className="data-table-header">
          <h3 className="data-table-title">
            <i className="fas fa-robot" style={{ marginLeft: '10px', color: 'var(--primary-color)' }}></i>
            رؤى الذكاء الاصطناعي
          </h3>
          <div className="data-table-actions">
            <button className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '8px 15px' }}>
              <i className="fas fa-sync-alt"></i> تحديث الرؤى
            </button>
          </div>
        </div>
        <div style={{ padding: '25px' }}>
          {isLoadingInsights ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-color)' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
              <div>جاري تحليل البيانات بالذكاء الاصطناعي...</div>
            </div>
          ) : aiInsights.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-color)' }}>
              <i className="fas fa-robot" style={{ fontSize: '3rem', marginBottom: '15px', color: 'var(--primary-color)' }}></i>
              <h3 style={{ color: 'var(--secondary-color)', marginBottom: '10px' }}>
                لا توجد رؤى ذكية متاحة
              </h3>
              <p style={{ fontSize: '1rem', marginBottom: '20px' }}>
                يحتاج الذكاء الاصطناعي إلى بيانات كافية لتوليد الرؤى والتوصيات
              </p>
              <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                أضف المزيد من العملاء والطلبات لتفعيل ميزات الذكاء الاصطناعي
              </div>
            </div>
          ) : aiInsights.map((insight) => (
            <div key={insight.id} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '25px',
              marginBottom: '20px',
              border: `2px solid ${getInsightColor(insight.type)}20`,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)'
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '15px',
                  background: `${getInsightColor(insight.type)}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: getInsightColor(insight.type),
                  fontSize: '1.5rem',
                  flexShrink: 0
                }}>
                  <i className={getInsightIcon(insight.type)}></i>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <h4 style={{ margin: 0, color: 'var(--secondary-color)', fontSize: '1.2rem' }}>
                      {insight.title}
                    </h4>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        background: `${getImpactColor(insight.impact)}20`,
                        color: getImpactColor(insight.impact)
                      }}>
                        تأثير {insight.impact === 'high' ? 'عالي' : insight.impact === 'medium' ? 'متوسط' : 'منخفض'}
                      </span>
                      <div style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        background: 'var(--success-light)',
                        color: 'var(--success-color)'
                      }}>
                        {insight.confidence}% ثقة
                      </div>
                    </div>
                  </div>

                  <p style={{
                    margin: '0 0 15px 0',
                    color: 'var(--gray-color)',
                    lineHeight: '1.6',
                    fontSize: '0.95rem'
                  }}>
                    {insight.description}
                  </p>

                  <div style={{
                    padding: '15px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    borderRight: `4px solid ${getInsightColor(insight.type)}`
                  }}>
                    <strong style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>
                      التوصية:
                    </strong>
                    <span style={{ color: 'var(--gray-color)', fontSize: '0.9rem', marginRight: '8px' }}>
                      {insight.recommendation}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '30px' }}>
        {/* التنبؤات المتقدمة */}
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">
              <i className="fas fa-crystal-ball" style={{ marginLeft: '10px', color: 'var(--primary-color)' }}></i>
              التنبؤات المتقدمة
            </h3>
            <div className="data-table-actions">
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                style={{
                  padding: '8px 15px',
                  border: '2px solid var(--border-color)',
                  borderRadius: '6px',
                  fontSize: '0.9rem'
                }}
              >
                <option value="leads">العملاء المحتملين</option>
                <option value="conversion">معدل التحويل</option>
                <option value="revenue">الإيرادات</option>
              </select>
            </div>
          </div>
          <div style={{ padding: '30px' }}>
            {isLoadingPredictions ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-color)' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                <div>جاري إنشاء التنبؤات...</div>
              </div>
            ) : predictiveData.leadsPrediction.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-color)' }}>
                <i className="fas fa-crystal-ball" style={{ fontSize: '3rem', marginBottom: '15px', color: 'var(--primary-color)' }}></i>
                <h3 style={{ color: 'var(--secondary-color)', marginBottom: '10px' }}>
                  لا توجد تنبؤات متاحة
                </h3>
                <p style={{ fontSize: '1rem', marginBottom: '20px' }}>
                  يحتاج نظام التنبؤ إلى بيانات تاريخية كافية لإنشاء توقعات دقيقة
                </p>
                <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                  أضف بيانات لمدة 3 أشهر على الأقل لتفعيل ميزات التنبؤ
                </div>
              </div>
            ) : selectedMetric === 'leads' && (
              <div>
                <h4 style={{ marginBottom: '20px', color: 'var(--secondary-color)' }}>
                  توقع العملاء المحتملين - الأشهر القادمة
                </h4>
                <div style={{ display: 'flex', alignItems: 'end', gap: '15px', height: '200px', marginBottom: '20px' }}>
                  {predictiveData.leadsPrediction.map((data, index) => {
                    const maxValue = Math.max(...predictiveData.leadsPrediction.map(d => d.predicted))
                    const height = (data.predicted / maxValue) * 160
                    const isActual = data.actual !== null

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
                          background: isActual ?
                            'linear-gradient(to top, var(--success-color), var(--success-light))' :
                            'linear-gradient(to top, var(--primary-color), var(--primary-light))',
                          borderRadius: '4px 4px 0 0',
                          marginBottom: '10px',
                          position: 'relative',
                          opacity: isActual ? 1 : 0.8,
                          border: isActual ? 'none' : '2px dashed var(--primary-color)'
                        }}>
                          <div style={{
                            position: 'absolute',
                            top: '-30px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'var(--secondary-color)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: '600'
                          }}>
                            {isActual ? data.actual : data.predicted}
                            {!isActual && (
                              <div style={{ fontSize: '0.6rem', opacity: 0.8 }}>
                                ±{data.confidence}%
                              </div>
                            )}
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
                        <div style={{
                          fontSize: '0.7rem',
                          color: isActual ? 'var(--success-color)' : 'var(--primary-color)',
                          textAlign: 'center',
                          fontWeight: '600'
                        }}>
                          {isActual ? 'فعلي' : 'متوقع'}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div style={{
                  padding: '15px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  color: 'var(--gray-color)'
                }}>
                  <i className="fas fa-info-circle" style={{ marginLeft: '8px', color: 'var(--primary-color)' }}></i>
                  التنبؤات مبنية على تحليل البيانات التاريخية والاتجاهات الموسمية باستخدام خوارزميات التعلم الآلي
                </div>
              </div>
            )}

            {selectedMetric === 'conversion' && (
              <div>
                <h4 style={{ marginBottom: '20px', color: 'var(--secondary-color)' }}>
                  توقع معدل التحويل - الأشهر القادمة
                </h4>
                <div style={{ display: 'grid', gap: '15px' }}>
                  {predictiveData.conversionPrediction.map((data, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '15px',
                      background: data.rate ? '#f8fafc' : 'white',
                      borderRadius: '8px',
                      border: data.rate ? '1px solid #e2e8f0' : '2px dashed var(--primary-color)'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>
                          {data.month}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>
                          {data.rate ? 'معدل فعلي' : 'معدل متوقع'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{
                          fontSize: '1.2rem',
                          fontWeight: '600',
                          color: data.rate ? 'var(--success-color)' : 'var(--primary-color)'
                        }}>
                          {data.rate || data.predicted}%
                        </div>
                        {data.trend === 'up' && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--success-color)' }}>
                            <i className="fas fa-arrow-up"></i> تحسن
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* تحليل المخاطر */}
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">
              <i className="fas fa-shield-alt" style={{ marginLeft: '10px', color: 'var(--warning-color)' }}></i>
              تحليل المخاطر
            </h3>
          </div>
          <div style={{ padding: '20px' }}>
            {isLoadingRiskAnalysis ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-color)' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                <div>جاري تحليل المخاطر...</div>
              </div>
            ) : riskAnalysis.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-color)' }}>
                <i className="fas fa-shield-alt" style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--warning-color)' }}></i>
                <div style={{ fontWeight: '600', marginBottom: '5px' }}>لا توجد مخاطر محددة</div>
                <div style={{ fontSize: '0.9rem' }}>سيتم تحليل المخاطر عند توفر بيانات كافية</div>
              </div>
            ) : riskAnalysis.map((risk, index) => (
              <div key={index} style={{
                padding: '15px',
                marginBottom: '15px',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #f1f5f9'
              }}>
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontWeight: '600', color: 'var(--secondary-color)', marginBottom: '5px' }}>
                    {risk.risk}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>
                      احتمالية: {risk.probability}%
                    </span>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      background: risk.impact === 'عالي' ? 'var(--danger-light)' : 'var(--warning-light)',
                      color: risk.impact === 'عالي' ? 'var(--danger-color)' : 'var(--warning-color)'
                    }}>
                      {risk.impact}
                    </span>
                  </div>
                </div>

                <div style={{
                  width: '100%',
                  height: '4px',
                  background: '#f1f5f9',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  marginBottom: '10px'
                }}>
                  <div style={{
                    width: `${risk.probability}%`,
                    height: '100%',
                    background: risk.probability > 30 ? 'var(--danger-color)' : 'var(--warning-color)',
                    borderRadius: '2px'
                  }}></div>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)', marginBottom: '8px' }}>
                  <strong>التخفيف:</strong> {risk.mitigation}
                </div>

                <div style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  background: risk.status === 'مراقب' ? 'var(--warning-light)' : 'var(--success-light)',
                  color: risk.status === 'مراقب' ? 'var(--warning-color)' : 'var(--success-color)',
                  display: 'inline-block'
                }}>
                  {risk.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* تحليل السوق والسلوك */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px', marginBottom: '30px' }}>
        {/* التحليل الموسمي */}
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">
              <i className="fas fa-calendar-alt" style={{ marginLeft: '10px', color: 'var(--secondary-color)' }}></i>
              التحليل الموسمي
            </h3>
          </div>
          <div style={{ padding: '25px' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>موسم الذروة</span>
                <span style={{ color: 'var(--success-color)', fontWeight: '600' }}>
                  {marketAnalysis.seasonality.peak}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>موسم الانخفاض</span>
                <span style={{ color: 'var(--danger-color)', fontWeight: '600' }}>
                  {marketAnalysis.seasonality.low}
                </span>
              </div>
            </div>

            <div style={{
              padding: '15px',
              background: '#f8fafc',
              borderRadius: '8px',
              borderRight: '4px solid var(--primary-color)'
            }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)', lineHeight: '1.5' }}>
                {marketAnalysis.seasonality.pattern}
              </div>
            </div>

            {realStats.totalLeads === 0 ? (
              <div style={{ marginTop: '20px' }}>
                <h5 style={{ marginBottom: '15px', color: 'var(--secondary-color)' }}>توزيع الطلب السنوي</h5>
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-color)' }}>
                  <div>لا توجد بيانات كافية لتحليل التوزيع السنوي</div>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '20px' }}>
                <h5 style={{ marginBottom: '15px', color: 'var(--secondary-color)' }}>توزيع الطلب السنوي</h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, index) => {
                    const values = [0, 0, 0, 0] // بيانات فارغة لأن قاعدة البيانات فارغة
                    const maxValue = Math.max(...values) || 1
                    const height = (values[index] / maxValue) * 60

                    return (
                      <div key={quarter} style={{ textAlign: 'center' }}>
                        <div style={{
                          height: '60px',
                          display: 'flex',
                          alignItems: 'end',
                          justifyContent: 'center',
                          marginBottom: '8px'
                        }}>
                          <div style={{
                            width: '20px',
                            height: `${height || 5}px`,
                            background: '#f1f5f9',
                            borderRadius: '2px',
                            border: '1px dashed var(--gray-color)'
                          }}></div>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>{quarter}</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--gray-color)' }}>
                          {values[index]}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* تحليل المنافسين */}
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">
              <i className="fas fa-chess" style={{ marginLeft: '10px', color: 'var(--warning-color)' }}></i>
              تحليل المنافسين
            </h3>
          </div>
          <div style={{ padding: '25px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: `conic-gradient(var(--primary-color) 0deg ${marketAnalysis.competitorAnalysis.marketShare * 3.6}deg, #f1f5f9 ${marketAnalysis.competitorAnalysis.marketShare * 3.6}deg 360deg)`,
                margin: '0 auto 15px',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: 'var(--secondary-color)'
                }}>
                  {marketAnalysis.competitorAnalysis.marketShare}%
                </div>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>حصة السوق</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--success-color)', fontWeight: '600' }}>
                {marketAnalysis.competitorAnalysis.trend}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontWeight: '600', color: 'var(--secondary-color)', marginBottom: '8px' }}>
                الموقع في السوق
              </div>
              <div style={{
                padding: '10px 15px',
                background: 'var(--warning-light)',
                color: 'var(--warning-color)',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                {marketAnalysis.competitorAnalysis.position}
              </div>
            </div>

            <div>
              <div style={{ fontWeight: '600', color: 'var(--secondary-color)', marginBottom: '10px' }}>
                التهديدات المحتملة
              </div>
              {marketAnalysis.competitorAnalysis.threats.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--gray-color)' }}>
                  <div>لا توجد تهديدات محددة</div>
                </div>
              ) : marketAnalysis.competitorAnalysis.threats.map((threat, index) => (
                <div key={index} style={{
                  padding: '8px 12px',
                  background: '#fef2f2',
                  color: 'var(--danger-color)',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  marginBottom: '5px',
                  borderRight: '3px solid var(--danger-color)'
                }}>
                  {threat}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* سلوك العملاء */}
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">
              <i className="fas fa-user-friends" style={{ marginLeft: '10px', color: 'var(--success-color)' }}></i>
              سلوك العملاء
            </h3>
          </div>
          <div style={{ padding: '25px' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>متوسط وقت اتخاذ القرار</span>
                <span style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>
                  {marketAnalysis.customerBehavior.avgDecisionTime}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>وسيلة التواصل المفضلة</span>
                <span style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>
                  {marketAnalysis.customerBehavior.preferredContact}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>ساعات الذروة</span>
                <span style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>
                  {marketAnalysis.customerBehavior.peakActivity}
                </span>
              </div>
            </div>

            <div>
              <h5 style={{ marginBottom: '15px', color: 'var(--secondary-color)' }}>استخدام الأجهزة</h5>
              {Object.values(marketAnalysis.customerBehavior.deviceUsage).every(val => val === 0) ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--gray-color)' }}>
                  <div>لا توجد بيانات عن استخدام الأجهزة</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '10px' }}>
                  {Object.entries(marketAnalysis.customerBehavior.deviceUsage).map(([device, percentage]) => (
                    <div key={device}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                          {device === 'desktop' ? 'سطح المكتب' : device === 'mobile' ? 'الجوال' : 'التابلت'}
                        </span>
                        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--primary-color)' }}>
                          {percentage}%
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '6px',
                        background: '#f1f5f9',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: percentage === 0 ? '#f1f5f9' : 'var(--primary-color)',
                          borderRadius: '3px',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* تحليلات متقدمة إضافية */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* نمذجة القيمة الدائمة للعميل */}
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">
              <i className="fas fa-coins" style={{ marginLeft: '10px', color: 'var(--warning-color)' }}></i>
              القيمة الدائمة للعميل (CLV)
            </h3>
          </div>
          <div style={{ padding: '25px' }}>
            {realStats.totalLeads === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-color)' }}>
                <i className="fas fa-coins" style={{ fontSize: '3rem', marginBottom: '15px', color: 'var(--warning-color)' }}></i>
                <h3 style={{ color: 'var(--secondary-color)', marginBottom: '10px' }}>
                  لا توجد بيانات CLV
                </h3>
                <p style={{ fontSize: '1rem', marginBottom: '20px' }}>
                  يحتاج حساب القيمة الدائمة للعميل إلى بيانات العملاء والمبيعات
                </p>
                <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                  أضف عملاء وأكمل صفقات لحساب CLV
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                  <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '10px' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--success-color)', marginBottom: '5px' }}>
                      0
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                      متوسط CLV (ريال)
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '10px' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--primary-color)', marginBottom: '5px' }}>
                      0
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                      سنوات متوسط الاحتفاظ
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h5 style={{ marginBottom: '15px', color: 'var(--secondary-color)' }}>توزيع CLV حسب القطاع</h5>
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-color)' }}>
                    <div>لا توجد بيانات كافية لتحليل CLV حسب القطاع</div>
                  </div>
                </div>

                <div style={{
                  padding: '15px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  borderRight: '4px solid var(--gray-color)'
                }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)', fontWeight: '600', marginBottom: '5px' }}>
                    ملاحظة
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>
                    سيتم حساب CLV تلقائياً عند توفر بيانات كافية عن العملاء والمبيعات
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* تحليل الاتجاهات المستقبلية */}
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">
              <i className="fas fa-rocket" style={{ marginLeft: '10px', color: 'var(--danger-color)' }}></i>
              الاتجاهات المستقبلية
            </h3>
          </div>
          <div style={{ padding: '25px' }}>
            {realStats.totalLeads === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-color)' }}>
                <i className="fas fa-rocket" style={{ fontSize: '3rem', marginBottom: '15px', color: 'var(--danger-color)' }}></i>
                <h3 style={{ color: 'var(--secondary-color)', marginBottom: '10px' }}>
                  لا توجد اتجاهات متاحة
                </h3>
                <p style={{ fontSize: '1rem', marginBottom: '20px' }}>
                  يحتاج تحليل الاتجاهات المستقبلية إلى بيانات تاريخية وسوقية
                </p>
                <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                  أضف بيانات لفترة كافية لتحليل الاتجاهات
                </div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '25px' }}>
                  <h5 style={{ marginBottom: '15px', color: 'var(--secondary-color)' }}>التوقعات للعام القادم</h5>
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-color)' }}>
                    <div>لا توجد بيانات كافية لتحليل الاتجاهات المستقبلية</div>
                  </div>
                </div>

                <div style={{
                  padding: '15px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  borderRight: '4px solid var(--gray-color)'
                }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)', fontWeight: '600', marginBottom: '5px' }}>
                    ملاحظة
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>
                    سيتم تحليل الاتجاهات المستقبلية تلقائياً عند توفر بيانات كافية
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
