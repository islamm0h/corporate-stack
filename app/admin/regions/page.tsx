'use client'

import { useState } from 'react'

export default function RegionsReport() {
  const [regionData] = useState([
    {
      region: 'الرياض',
      leads: 450,
      requests: 125,
      converted: 67,
      conversionRate: 14.9,
      topSystem: 'نظام المحاسبة',
      growth: '+18%',
      cities: [
        { name: 'الرياض', leads: 380, requests: 105 },
        { name: 'الخرج', leads: 45, requests: 12 },
        { name: 'الدرعية', leads: 25, requests: 8 }
      ]
    },
    {
      region: 'مكة المكرمة',
      leads: 320,
      requests: 89,
      converted: 45,
      conversionRate: 14.1,
      topSystem: 'نظام إدارة العملاء',
      growth: '+12%',
      cities: [
        { name: 'جدة', leads: 220, requests: 62 },
        { name: 'مكة المكرمة', leads: 65, requests: 18 },
        { name: 'الطائف', leads: 35, requests: 9 }
      ]
    },
    {
      region: 'المنطقة الشرقية',
      leads: 280,
      requests: 76,
      converted: 38,
      conversionRate: 13.6,
      topSystem: 'نظام إدارة المخزون',
      growth: '+15%',
      cities: [
        { name: 'الدمام', leads: 150, requests: 42 },
        { name: 'الخبر', leads: 85, requests: 23 },
        { name: 'الظهران', leads: 45, requests: 11 }
      ]
    },
    {
      region: 'المدينة المنورة',
      leads: 180,
      requests: 48,
      converted: 22,
      conversionRate: 12.2,
      topSystem: 'نظام الموارد البشرية',
      growth: '+8%',
      cities: [
        { name: 'المدينة المنورة', leads: 120, requests: 32 },
        { name: 'ينبع', leads: 40, requests: 11 },
        { name: 'العلا', leads: 20, requests: 5 }
      ]
    },
    {
      region: 'القصيم',
      leads: 150,
      requests: 41,
      converted: 19,
      conversionRate: 12.7,
      topSystem: 'نظام المحاسبة',
      growth: '+10%',
      cities: [
        { name: 'بريدة', leads: 90, requests: 25 },
        { name: 'عنيزة', leads: 35, requests: 10 },
        { name: 'الرس', leads: 25, requests: 6 }
      ]
    },
    {
      region: 'عسير',
      leads: 120,
      requests: 32,
      converted: 14,
      conversionRate: 11.7,
      topSystem: 'نظام إدارة المشاريع',
      growth: '+6%',
      cities: [
        { name: 'أبها', leads: 75, requests: 20 },
        { name: 'خميس مشيط', leads: 30, requests: 8 },
        { name: 'النماص', leads: 15, requests: 4 }
      ]
    }
  ])

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview')

  const totalLeads = regionData.reduce((sum, region) => sum + region.leads, 0)
  const totalRequests = regionData.reduce((sum, region) => sum + region.requests, 0)
  const totalConverted = regionData.reduce((sum, region) => sum + region.converted, 0)
  const avgConversionRate = (totalConverted / totalLeads * 100).toFixed(1)

  const getRegionColor = (index: number) => {
    const colors = [
      'var(--primary-color)',
      'var(--success-color)',
      'var(--warning-color)',
      'var(--secondary-color)',
      'var(--danger-color)',
      '#8B5CF6'
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
              <i className="fas fa-map-marker-alt"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{regionData.length}</div>
            <div className="stat-label">المناطق المغطاة</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-trend up">
              <i className="fas fa-arrow-up"></i>
              +13%
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{totalLeads.toLocaleString()}</div>
            <div className="stat-label">إجمالي العملاء المحتملين</div>
          </div>
          <div className="stat-footer">
            جميع المناطق
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <div className="stat-trend up">
              <i className="fas fa-arrow-up"></i>
              +11%
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{totalRequests}</div>
            <div className="stat-label">إجمالي الطلبات</div>
          </div>
          <div className="stat-footer">
            جميع المناطق
          </div>
        </div>

        <div className="stat-card success">
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
            عبر جميع المناطق
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
        {/* خريطة المناطق */}
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">توزيع العملاء حسب المناطق</h3>
            <div className="data-table-actions">
              <button 
                className={`btn ${viewMode === 'overview' ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.8rem', padding: '8px 15px', marginLeft: '5px' }}
                onClick={() => setViewMode('overview')}
              >
                نظرة عامة
              </button>
              <button 
                className={`btn ${viewMode === 'detailed' ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.8rem', padding: '8px 15px' }}
                onClick={() => setViewMode('detailed')}
              >
                تفصيلي
              </button>
            </div>
          </div>
          <div style={{ padding: '30px' }}>
            {viewMode === 'overview' ? (
              <div style={{ display: 'grid', gap: '15px' }}>
                {regionData.map((region, index) => (
                  <div 
                    key={region.region} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '15px',
                      background: '#f8fafc',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: selectedRegion === region.region ? `2px solid ${getRegionColor(index)}` : '2px solid transparent'
                    }}
                    onClick={() => setSelectedRegion(selectedRegion === region.region ? null : region.region)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f1f5f9'
                      e.currentTarget.style.transform = 'translateX(-5px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f8fafc'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: getRegionColor(index)
                      }}></div>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>
                          {region.region}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>
                          {region.leads} عميل محتمل
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: '600', color: getRegionColor(index) }}>
                        {region.conversionRate}%
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>
                        معدل التحويل
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '20px' }}>
                {regionData.map((region, index) => (
                  <div key={region.region} style={{
                    padding: '20px',
                    border: '1px solid #f1f5f9',
                    borderRadius: '10px',
                    background: 'white'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h4 style={{ margin: 0, color: 'var(--secondary-color)' }}>{region.region}</h4>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        background: `${getRegionColor(index)}20`,
                        color: getRegionColor(index)
                      }}>
                        {region.growth}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '15px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: '600', color: getRegionColor(index) }}>
                          {region.leads}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>عملاء محتملين</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: '600', color: getRegionColor(index) }}>
                          {region.requests}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>طلبات</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: '600', color: getRegionColor(index) }}>
                          {region.converted}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>تم التحويل</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                      <strong>النظام الأكثر طلباً:</strong> {region.topSystem}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* تفاصيل المنطقة المحددة */}
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">
              {selectedRegion ? `تفاصيل منطقة ${selectedRegion}` : 'اختر منطقة لعرض التفاصيل'}
            </h3>
          </div>
          <div style={{ padding: '30px' }}>
            {selectedRegion ? (
              <div>
                {(() => {
                  const region = regionData.find(r => r.region === selectedRegion)
                  if (!region) return null
                  
                  return (
                    <>
                      <div style={{ marginBottom: '25px' }}>
                        <h4 style={{ marginBottom: '15px', color: 'var(--secondary-color)' }}>
                          إحصائيات المنطقة
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                          <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--primary-color)' }}>
                              {region.leads}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                              عملاء محتملين
                            </div>
                          </div>
                          <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--success-color)' }}>
                              {region.conversionRate}%
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                              معدل التحويل
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 style={{ marginBottom: '15px', color: 'var(--secondary-color)' }}>
                          توزيع المدن
                        </h4>
                        <div style={{ display: 'grid', gap: '10px' }}>
                          {region.cities.map((city, index) => (
                            <div key={city.name} style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '12px 15px',
                              background: '#f8fafc',
                              borderRadius: '8px'
                            }}>
                              <div>
                                <div style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>
                                  {city.name}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>
                                  {city.requests} طلب
                                </div>
                              </div>
                              <div style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                                {city.leads}
                              </div>
                            </div>
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
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h4 style={{ marginBottom: '10px', color: 'var(--secondary-color)' }}>
                  اختر منطقة
                </h4>
                <p style={{ color: 'var(--gray-color)', margin: 0 }}>
                  انقر على أي منطقة من القائمة لعرض تفاصيلها
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* جدول مقارنة المناطق */}
      <div className="data-table-container">
        <div className="data-table-header">
          <h3 className="data-table-title">مقارنة المناطق</h3>
          <div className="data-table-actions">
            <button className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '8px 15px' }}>
              <i className="fas fa-download"></i> تصدير التقرير
            </button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>المنطقة</th>
              <th>العملاء المحتملين</th>
              <th>الطلبات</th>
              <th>التحويلات</th>
              <th>معدل التحويل</th>
              <th>النمو</th>
              <th>النظام الأكثر طلباً</th>
            </tr>
          </thead>
          <tbody>
            {regionData.map((region, index) => (
              <tr key={region.region}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: getRegionColor(index)
                    }}></div>
                    <span style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>
                      {region.region}
                    </span>
                  </div>
                </td>
                <td style={{ fontWeight: '600' }}>{region.leads.toLocaleString()}</td>
                <td>{region.requests}</td>
                <td>{region.converted}</td>
                <td>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    background: 'var(--success-light)',
                    color: 'var(--success-color)'
                  }}>
                    {region.conversionRate}%
                  </span>
                </td>
                <td>
                  <span style={{
                    color: 'var(--success-color)',
                    fontWeight: '600'
                  }}>
                    {region.growth}
                  </span>
                </td>
                <td style={{ fontSize: '0.9rem' }}>{region.topSystem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
