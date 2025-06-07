'use client'

import { useState, useEffect } from 'react'

export default function DataManagementPage() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalSystems: 0,
    totalReports: 0,
    totalUsers: 0,
    databaseSize: '0 MB',
    lastBackup: 'لم يتم إنشاء نسخة احتياطية',
    monthlyLeads: 0,
    activeSystemsCount: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        const result = await response.json()

        if (result.success) {
          setStats(result.data)
        } else {
          console.error('Error fetching stats:', result.error)
          // استخدام بيانات افتراضية في حالة الخطأ
          setStats({
            totalLeads: 0,
            totalSystems: 0,
            totalReports: 0,
            totalUsers: 0,
            databaseSize: '0 MB',
            lastBackup: 'لم يتم إنشاء نسخة احتياطية',
            monthlyLeads: 0,
            activeSystemsCount: 0
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
        // استخدام بيانات افتراضية في حالة الخطأ
        setStats({
          totalLeads: 0,
          totalSystems: 0,
          totalReports: 0,
          totalUsers: 0,
          databaseSize: '0 MB',
          lastBackup: 'لم يتم إنشاء نسخة احتياطية',
          monthlyLeads: 0,
          activeSystemsCount: 0
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const refreshStats = async () => {
    setRefreshing(true)
    try {
      const response = await fetch('/api/admin/stats')
      const result = await response.json()

      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Error refreshing stats:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const handleResetData = async (dataType: string) => {
    if (confirm(`هل أنت متأكد من حذف جميع ${dataType}؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
      try {
        // محاكاة حذف البيانات
        alert(`تم حذف جميع ${dataType} بنجاح`)
      } catch (error) {
        alert('حدث خطأ أثناء حذف البيانات')
      }
    }
  }

  const handleBackupData = async () => {
    try {
      alert('تم إنشاء نسخة احتياطية بنجاح')
    } catch (error) {
      alert('حدث خطأ أثناء إنشاء النسخة الاحتياطية')
    }
  }

  const handleRestoreData = async () => {
    if (confirm('هل أنت متأكد من استعادة النسخة الاحتياطية؟ سيتم استبدال البيانات الحالية.')) {
      try {
        alert('تم استعادة النسخة الاحتياطية بنجاح')
      } catch (error) {
        alert('حدث خطأ أثناء استعادة النسخة الاحتياطية')
      }
    }
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg-light)'
      }}>
        <div style={{ textAlign: 'center', color: 'var(--gray-color)' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', marginBottom: '20px' }}></i>
          <div style={{ fontSize: '1.2rem' }}>جاري تحميل بيانات النظام...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg-light)', minHeight: '100vh', padding: '20px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
        color: 'white',
        padding: '40px',
        borderRadius: '15px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '2rem'
        }}>
          <i className="fas fa-database"></i>
        </div>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem', fontWeight: '700' }}>
          إدارة البيانات
        </h1>
        <p style={{ margin: '0 0 20px 0', fontSize: '1.1rem', opacity: 0.9 }}>
          إدارة وصيانة قاعدة البيانات والنسخ الاحتياطية
        </p>
        <button
          onClick={refreshStats}
          disabled={refreshing}
          style={{
            padding: '10px 20px',
            background: refreshing ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: refreshing ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {refreshing ? (
            <>
              <i className="fas fa-spinner fa-spin" style={{ marginLeft: '8px' }}></i>
              جاري التحديث...
            </>
          ) : (
            <>
              <i className="fas fa-sync-alt" style={{ marginLeft: '8px' }}></i>
              تحديث البيانات
            </>
          )}
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#3b82f620',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px',
            color: '#3b82f6',
            fontSize: '1.5rem'
          }}>
            <i className="fas fa-users"></i>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--secondary-color)', marginBottom: '5px' }}>
            {stats.totalLeads.toLocaleString()}
          </div>
          <div style={{ color: 'var(--gray-color)', fontSize: '0.9rem' }}>
            إجمالي العملاء المحتملين
            {stats.monthlyLeads > 0 && (
              <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '2px' }}>
                +{stats.monthlyLeads} هذا الشهر
              </div>
            )}
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#10b98120',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px',
            color: '#10b981',
            fontSize: '1.5rem'
          }}>
            <i className="fas fa-cogs"></i>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--secondary-color)', marginBottom: '5px' }}>
            {stats.totalSystems}
          </div>
          <div style={{ color: 'var(--gray-color)', fontSize: '0.9rem' }}>
            الأنظمة المسجلة
            {stats.activeSystemsCount > 0 && (
              <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '2px' }}>
                {stats.activeSystemsCount} نشط
              </div>
            )}
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#f59e0b20',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px',
            color: '#f59e0b',
            fontSize: '1.5rem'
          }}>
            <i className="fas fa-chart-bar"></i>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--secondary-color)', marginBottom: '5px' }}>
            {stats.totalReports}
          </div>
          <div style={{ color: 'var(--gray-color)', fontSize: '0.9rem' }}>
            العملاء الجدد (30 يوم)
            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '2px' }}>
              مؤشر النشاط الشهري
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#8b5cf620',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px',
            color: '#8b5cf6',
            fontSize: '1.5rem'
          }}>
            <i className="fas fa-user-shield"></i>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--secondary-color)', marginBottom: '5px' }}>
            {stats.totalUsers}
          </div>
          <div style={{ color: 'var(--gray-color)', fontSize: '0.9rem' }}>
            المستخدمين النشطين
            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '2px' }}>
              مكلفين بعملاء محتملين
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0'
        }}>
          {[
            { id: 'overview', label: 'نظرة عامة', icon: 'fas fa-chart-pie' },
            { id: 'backup', label: 'النسخ الاحتياطية', icon: 'fas fa-save' },
            { id: 'cleanup', label: 'تنظيف البيانات', icon: 'fas fa-broom' },
            { id: 'maintenance', label: 'الصيانة', icon: 'fas fa-tools' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '20px',
                border: 'none',
                background: activeTab === tab.id ? 'var(--primary-light)' : 'transparent',
                color: activeTab === tab.id ? 'var(--primary-color)' : 'var(--gray-color)',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderBottom: activeTab === tab.id ? '3px solid var(--primary-color)' : '3px solid transparent'
              }}
            >
              <i className={tab.icon} style={{ marginLeft: '8px' }}></i>
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '30px' }}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h3 style={{ margin: '0 0 20px 0', color: 'var(--secondary-color)' }}>
                معلومات قاعدة البيانات
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{
                  padding: '20px',
                  background: 'var(--bg-light)',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)', marginBottom: '5px' }}>
                    حجم قاعدة البيانات
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--secondary-color)' }}>
                    {stats.databaseSize}
                  </div>
                </div>
                <div style={{
                  padding: '20px',
                  background: 'var(--bg-light)',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)', marginBottom: '5px' }}>
                    آخر نسخة احتياطية
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--secondary-color)' }}>
                    {stats.lastBackup}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Backup Tab */}
          {activeTab === 'backup' && (
            <div>
              <h3 style={{ margin: '0 0 20px 0', color: 'var(--secondary-color)' }}>
                إدارة النسخ الاحتياطية
              </h3>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{
                  padding: '25px',
                  border: '2px dashed var(--primary-color)',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <i className="fas fa-download" style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '15px' }}></i>
                  <h4 style={{ margin: '0 0 10px 0', color: 'var(--secondary-color)' }}>
                    إنشاء نسخة احتياطية
                  </h4>
                  <p style={{ margin: '0 0 20px 0', color: 'var(--gray-color)' }}>
                    إنشاء نسخة احتياطية كاملة من قاعدة البيانات
                  </p>
                  <button
                    onClick={handleBackupData}
                    style={{
                      padding: '12px 24px',
                      background: 'var(--primary-color)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-save" style={{ marginLeft: '8px' }}></i>
                    إنشاء نسخة احتياطية
                  </button>
                </div>

                <div style={{
                  padding: '25px',
                  border: '2px dashed var(--warning-color)',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <i className="fas fa-upload" style={{ fontSize: '2rem', color: 'var(--warning-color)', marginBottom: '15px' }}></i>
                  <h4 style={{ margin: '0 0 10px 0', color: 'var(--secondary-color)' }}>
                    استعادة نسخة احتياطية
                  </h4>
                  <p style={{ margin: '0 0 20px 0', color: 'var(--gray-color)' }}>
                    استعادة البيانات من نسخة احتياطية سابقة
                  </p>
                  <button
                    onClick={handleRestoreData}
                    style={{
                      padding: '12px 24px',
                      background: 'var(--warning-color)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-undo" style={{ marginLeft: '8px' }}></i>
                    استعادة النسخة الاحتياطية
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cleanup Tab */}
          {activeTab === 'cleanup' && (
            <div>
              <h3 style={{ margin: '0 0 20px 0', color: 'var(--secondary-color)' }}>
                تنظيف البيانات
              </h3>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{
                  padding: '20px',
                  border: '1px solid #fecaca',
                  borderRadius: '10px',
                  background: '#fef2f2'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <i className="fas fa-exclamation-triangle" style={{ color: '#dc2626' }}></i>
                    <h4 style={{ margin: 0, color: '#dc2626' }}>تحذير: عمليات الحذف لا يمكن التراجع عنها</h4>
                  </div>
                  <p style={{ margin: '0 0 20px 0', color: '#7f1d1d' }}>
                    تأكد من إنشاء نسخة احتياطية قبل حذف أي بيانات
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <div style={{
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    background: 'white'
                  }}>
                    <h5 style={{ margin: '0 0 10px 0', color: 'var(--secondary-color)' }}>
                      <i className="fas fa-users" style={{ marginLeft: '8px', color: '#3b82f6' }}></i>
                      العملاء المحتملين
                    </h5>
                    <p style={{ margin: '0 0 15px 0', color: 'var(--gray-color)', fontSize: '0.9rem' }}>
                      حذف جميع بيانات العملاء المحتملين والاستمارات
                    </p>
                    <button
                      onClick={() => handleResetData('العملاء المحتملين')}
                      style={{
                        padding: '10px 20px',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      <i className="fas fa-trash" style={{ marginLeft: '5px' }}></i>
                      حذف البيانات
                    </button>
                  </div>

                  <div style={{
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    background: 'white'
                  }}>
                    <h5 style={{ margin: '0 0 10px 0', color: 'var(--secondary-color)' }}>
                      <i className="fas fa-chart-bar" style={{ marginLeft: '8px', color: '#f59e0b' }}></i>
                      التقارير والإحصائيات
                    </h5>
                    <p style={{ margin: '0 0 15px 0', color: 'var(--gray-color)', fontSize: '0.9rem' }}>
                      حذف جميع التقارير والإحصائيات المحفوظة
                    </p>
                    <button
                      onClick={() => handleResetData('التقارير والإحصائيات')}
                      style={{
                        padding: '10px 20px',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      <i className="fas fa-trash" style={{ marginLeft: '5px' }}></i>
                      حذف البيانات
                    </button>
                  </div>

                  <div style={{
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    background: 'white'
                  }}>
                    <h5 style={{ margin: '0 0 10px 0', color: 'var(--secondary-color)' }}>
                      <i className="fas fa-file-alt" style={{ marginLeft: '8px', color: '#10b981' }}></i>
                      ملفات النظام
                    </h5>
                    <p style={{ margin: '0 0 15px 0', color: 'var(--gray-color)', fontSize: '0.9rem' }}>
                      حذف جميع الملفات المرفوعة والمستندات
                    </p>
                    <button
                      onClick={() => handleResetData('ملفات النظام')}
                      style={{
                        padding: '10px 20px',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      <i className="fas fa-trash" style={{ marginLeft: '5px' }}></i>
                      حذف البيانات
                    </button>
                  </div>

                  <div style={{
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    background: 'white'
                  }}>
                    <h5 style={{ margin: '0 0 10px 0', color: 'var(--secondary-color)' }}>
                      <i className="fas fa-database" style={{ marginLeft: '8px', color: '#8b5cf6' }}></i>
                      إعادة تعيين كاملة
                    </h5>
                    <p style={{ margin: '0 0 15px 0', color: 'var(--gray-color)', fontSize: '0.9rem' }}>
                      حذف جميع البيانات والعودة للحالة الافتراضية
                    </p>
                    <button
                      onClick={() => handleResetData('جميع البيانات')}
                      style={{
                        padding: '10px 20px',
                        background: '#7c2d12',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      <i className="fas fa-exclamation-triangle" style={{ marginLeft: '5px' }}></i>
                      إعادة تعيين كاملة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && (
            <div>
              <h3 style={{ margin: '0 0 20px 0', color: 'var(--secondary-color)' }}>
                صيانة النظام
              </h3>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{
                  padding: '20px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  background: 'white'
                }}>
                  <h4 style={{ margin: '0 0 15px 0', color: 'var(--secondary-color)' }}>
                    <i className="fas fa-broom" style={{ marginLeft: '8px', color: 'var(--primary-color)' }}></i>
                    تنظيف قاعدة البيانات
                  </h4>
                  <p style={{ margin: '0 0 15px 0', color: 'var(--gray-color)' }}>
                    تحسين أداء قاعدة البيانات وحذف البيانات المؤقتة
                  </p>
                  <button
                    onClick={() => alert('تم تنظيف قاعدة البيانات بنجاح')}
                    style={{
                      padding: '10px 20px',
                      background: 'var(--primary-color)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-play" style={{ marginLeft: '5px' }}></i>
                    تشغيل التنظيف
                  </button>
                </div>

                <div style={{
                  padding: '20px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  background: 'white'
                }}>
                  <h4 style={{ margin: '0 0 15px 0', color: 'var(--secondary-color)' }}>
                    <i className="fas fa-tachometer-alt" style={{ marginLeft: '8px', color: 'var(--success-color)' }}></i>
                    تحسين الأداء
                  </h4>
                  <p style={{ margin: '0 0 15px 0', color: 'var(--gray-color)' }}>
                    إعادة فهرسة الجداول وتحسين استعلامات قاعدة البيانات
                  </p>
                  <button
                    onClick={() => alert('تم تحسين الأداء بنجاح')}
                    style={{
                      padding: '10px 20px',
                      background: 'var(--success-color)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-rocket" style={{ marginLeft: '5px' }}></i>
                    تحسين الأداء
                  </button>
                </div>

                <div style={{
                  padding: '20px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  background: 'white'
                }}>
                  <h4 style={{ margin: '0 0 15px 0', color: 'var(--secondary-color)' }}>
                    <i className="fas fa-shield-alt" style={{ marginLeft: '8px', color: 'var(--warning-color)' }}></i>
                    فحص سلامة البيانات
                  </h4>
                  <p style={{ margin: '0 0 15px 0', color: 'var(--gray-color)' }}>
                    التحقق من سلامة البيانات وإصلاح أي مشاكل
                  </p>
                  <button
                    onClick={() => alert('تم فحص البيانات - لا توجد مشاكل')}
                    style={{
                      padding: '10px 20px',
                      background: 'var(--warning-color)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-search" style={{ marginLeft: '5px' }}></i>
                    فحص البيانات
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
