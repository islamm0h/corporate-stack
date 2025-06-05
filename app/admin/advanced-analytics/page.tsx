'use client'

import { useState, useEffect } from 'react'

export default function AdvancedAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months')
  const [selectedMetric, setSelectedMetric] = useState('leads')
  const [aiInsights, setAiInsights] = useState([
    {
      id: 1,
      type: 'prediction',
      title: 'توقع نمو العملاء المحتملين',
      description: 'بناءً على البيانات التاريخية، نتوقع زيادة 23% في العملاء المحتملين خلال الشهرين القادمين',
      confidence: 87,
      impact: 'high',
      recommendation: 'زيادة الاستثمار في التسويق الرقمي بنسبة 15%'
    },
    {
      id: 2,
      type: 'anomaly',
      title: 'انخفاض غير متوقع في منطقة الرياض',
      description: 'انخفاض 12% في الطلبات من منطقة الرياض مقارنة بالمتوقع',
      confidence: 92,
      impact: 'medium',
      recommendation: 'مراجعة استراتيجية التسويق في منطقة الرياض'
    },
    {
      id: 3,
      type: 'opportunity',
      title: 'فرصة نمو في نظام إدارة المخزون',
      description: 'زيادة الاهتمام بنظام إدارة المخزون بنسبة 34% في المنطقة الشرقية',
      confidence: 78,
      impact: 'high',
      recommendation: 'تطوير حملة تسويقية مخصصة للمنطقة الشرقية'
    }
  ])

  const [predictiveData] = useState({
    leadsPrediction: [
      { month: 'يوليو', actual: 225, predicted: 245, confidence: 85 },
      { month: 'أغسطس', actual: null, predicted: 268, confidence: 82 },
      { month: 'سبتمبر', actual: null, predicted: 291, confidence: 78 },
      { month: 'أكتوبر', actual: null, predicted: 315, confidence: 74 },
      { month: 'نوفمبر', actual: null, predicted: 342, confidence: 70 },
      { month: 'ديسمبر', actual: null, predicted: 378, confidence: 67 }
    ],
    conversionPrediction: [
      { month: 'يوليو', rate: 15.2, predicted: 16.1, trend: 'up' },
      { month: 'أغسطس', rate: null, predicted: 16.8, trend: 'up' },
      { month: 'سبتمبر', rate: null, predicted: 17.3, trend: 'up' },
      { month: 'أكتوبر', rate: null, predicted: 17.9, trend: 'up' },
      { month: 'نوفمبر', rate: null, predicted: 18.2, trend: 'up' },
      { month: 'ديسمبر', rate: null, predicted: 18.7, trend: 'up' }
    ]
  })

  const [marketAnalysis] = useState({
    seasonality: {
      peak: 'أكتوبر - ديسمبر',
      low: 'يونيو - أغسطس',
      pattern: 'نمط موسمي قوي مع زيادة 45% في نهاية العام'
    },
    competitorAnalysis: {
      marketShare: 23.5,
      trend: '+2.3%',
      position: 'الثاني في السوق',
      threats: ['منافس جديد في المنطقة الشرقية', 'انخفاض الأسعار في السوق']
    },
    customerBehavior: {
      avgDecisionTime: '14.5 يوم',
      preferredContact: 'البريد الإلكتروني (67%)',
      peakActivity: '10:00 - 14:00',
      deviceUsage: { desktop: 45, mobile: 35, tablet: 20 }
    }
  })

  const [riskAnalysis] = useState([
    {
      risk: 'انخفاض معدل التحويل',
      probability: 25,
      impact: 'متوسط',
      mitigation: 'تحسين عملية المتابعة',
      status: 'مراقب'
    },
    {
      risk: 'فقدان حصة سوقية',
      probability: 15,
      impact: 'عالي',
      mitigation: 'تطوير منتجات جديدة',
      status: 'منخفض'
    },
    {
      risk: 'زيادة تكلفة الاكتساب',
      probability: 40,
      impact: 'متوسط',
      mitigation: 'تحسين استهداف الإعلانات',
      status: 'مراقب'
    }
  ])

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
            <div className="stat-value">94.3%</div>
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
            <div className="stat-value">378</div>
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
            <div className="stat-value">3</div>
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
            <div className="stat-value">23.5%</div>
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
          {aiInsights.map((insight) => (
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
            {selectedMetric === 'leads' && (
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
            {riskAnalysis.map((risk, index) => (
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

            <div style={{ marginTop: '20px' }}>
              <h5 style={{ marginBottom: '15px', color: 'var(--secondary-color)' }}>توزيع الطلب السنوي</h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, index) => {
                  const values = [85, 70, 60, 145]
                  const maxValue = Math.max(...values)
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
                          height: `${height}px`,
                          background: index === 3 ? 'var(--success-color)' : 'var(--primary-color)',
                          borderRadius: '2px'
                        }}></div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>{quarter}</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--secondary-color)' }}>
                        {values[index]}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
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
              {marketAnalysis.competitorAnalysis.threats.map((threat, index) => (
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
                        background: 'var(--primary-color)',
                        borderRadius: '3px',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
              <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '10px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--success-color)', marginBottom: '5px' }}>
                  45,000
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                  متوسط CLV (ريال)
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '10px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--primary-color)', marginBottom: '5px' }}>
                  3.2
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                  سنوات متوسط الاحتفاظ
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ marginBottom: '15px', color: 'var(--secondary-color)' }}>توزيع CLV حسب القطاع</h5>
              {[
                { sector: 'الشركات الكبيرة', clv: 85000, color: 'var(--success-color)' },
                { sector: 'الشركات المتوسطة', clv: 45000, color: 'var(--primary-color)' },
                { sector: 'الشركات الصغيرة', clv: 25000, color: 'var(--warning-color)' }
              ].map((item, index) => (
                <div key={index} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--secondary-color)' }}>
                      {item.sector}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: item.color }}>
                      {item.clv.toLocaleString()} ريال
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
                      width: `${(item.clv / 85000) * 100}%`,
                      height: '100%',
                      background: item.color,
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              padding: '15px',
              background: 'var(--success-light)',
              borderRadius: '8px',
              borderRight: '4px solid var(--success-color)'
            }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--success-color)', fontWeight: '600', marginBottom: '5px' }}>
                توصية الذكاء الاصطناعي
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>
                التركيز على الشركات المتوسطة يمكن أن يزيد ROI بنسبة 34%
              </div>
            </div>
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
            <div style={{ marginBottom: '25px' }}>
              <h5 style={{ marginBottom: '15px', color: 'var(--secondary-color)' }}>التوقعات للعام القادم</h5>

              {[
                {
                  trend: 'نمو الطلب على الأتمتة',
                  probability: 89,
                  impact: 'عالي',
                  description: 'زيادة متوقعة 67% في طلبات أنظمة الأتمتة'
                },
                {
                  trend: 'التحول للحلول السحابية',
                  probability: 76,
                  impact: 'متوسط',
                  description: 'نمو 45% في الطلب على الحلول السحابية'
                },
                {
                  trend: 'زيادة الاهتمام بالأمان السيبراني',
                  probability: 92,
                  impact: 'عالي',
                  description: 'نمو 78% في طلبات حلول الأمان'
                }
              ].map((trend, index) => (
                <div key={index} style={{
                  padding: '15px',
                  marginBottom: '15px',
                  background: 'white',
                  borderRadius: '8px',
                  border: '1px solid #f1f5f9'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ fontWeight: '600', color: 'var(--secondary-color)', fontSize: '0.9rem' }}>
                      {trend.trend}
                    </div>
                    <div style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      background: trend.impact === 'عالي' ? 'var(--danger-light)' : 'var(--warning-light)',
                      color: trend.impact === 'عالي' ? 'var(--danger-color)' : 'var(--warning-color)'
                    }}>
                      {trend.impact}
                    </div>
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>احتمالية التحقق</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary-color)' }}>
                        {trend.probability}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '4px',
                      background: '#f1f5f9',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${trend.probability}%`,
                        height: '100%',
                        background: trend.probability > 80 ? 'var(--success-color)' : 'var(--warning-color)',
                        borderRadius: '2px'
                      }}></div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>
                    {trend.description}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              padding: '15px',
              background: 'var(--primary-light)',
              borderRadius: '8px',
              borderRight: '4px solid var(--primary-color)'
            }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: '600', marginBottom: '5px' }}>
                استراتيجية مقترحة
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>
                الاستثمار في تطوير حلول الأتمتة والأمان السيبراني لمواكبة اتجاهات السوق
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
