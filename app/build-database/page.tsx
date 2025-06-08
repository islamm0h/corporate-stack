'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function BuildDatabasePage() {
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [dbStatus, setDbStatus] = useState<any>(null)
  const [buildResult, setBuildResult] = useState<any>(null)

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    setChecking(true)
    try {
      const response = await fetch('/api/build-database')
      const data = await response.json()
      setDbStatus(data)
    } catch (error) {
      console.error('Error checking database:', error)
    } finally {
      setChecking(false)
    }
  }

  const buildDatabase = async () => {
    setLoading(true)
    setBuildResult(null)

    try {
      const response = await fetch('/api/build-database', {
        method: 'POST'
      })

      const data = await response.json()
      setBuildResult(data)
      
      if (data.success) {
        await checkDatabaseStatus()
      }
    } catch (error) {
      console.error('Error building database:', error)
      setBuildResult({
        success: false,
        error: 'حدث خطأ في الاتصال'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '900px',
        width: '100%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 30px',
          fontSize: '2rem',
          color: 'white'
        }}>
          <i className="fas fa-database"></i>
        </div>

        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '15px',
          color: '#667eea'
        }}>
          بناء قاعدة البيانات
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          إعداد وبناء قاعدة بيانات Prisma PostgreSQL
        </p>

        {checking ? (
          <div style={{
            background: '#f0f4ff',
            border: '1px solid #c7d2fe',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <i className="fas fa-spinner fa-spin" style={{ marginLeft: '10px' }}></i>
            جاري فحص حالة قاعدة البيانات...
          </div>
        ) : dbStatus && (
          <div style={{
            background: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '30px',
            textAlign: 'right'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#495057', textAlign: 'center' }}>
              حالة قاعدة البيانات
            </h3>

            {/* Database Info */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#6c757d' }}>معلومات قاعدة البيانات:</h4>
              <div style={{
                background: dbStatus.connected ? '#d4edda' : '#f8d7da',
                border: `1px solid ${dbStatus.connected ? '#c3e6cb' : '#f5c6cb'}`,
                borderRadius: '8px',
                padding: '15px'
              }}>
                <p style={{ margin: '5px 0' }}>
                  <strong>الاتصال:</strong> {dbStatus.connected ? '✅ متصل' : '❌ غير متصل'}
                </p>
                {dbStatus.database && (
                  <>
                    <p style={{ margin: '5px 0' }}>
                      <strong>النوع:</strong> {dbStatus.database.type}
                    </p>
                    <p style={{ margin: '5px 0' }}>
                      <strong>ORM:</strong> {dbStatus.database.orm}
                    </p>
                    <p style={{ margin: '5px 0' }}>
                      <strong>التسريع:</strong> {dbStatus.database.accelerate ? 'Prisma Accelerate ✅' : 'لا'}
                    </p>
                    <p style={{ margin: '5px 0' }}>
                      <strong>المزود:</strong> {dbStatus.database.provider}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Statistics */}
            {dbStatus.statistics && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#6c757d' }}>إحصائيات قاعدة البيانات:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                  <div style={{
                    background: '#e3f2fd',
                    padding: '10px',
                    borderRadius: '5px',
                    textAlign: 'center'
                  }}>
                    <strong>المستخدمون</strong><br/>
                    <span style={{ fontSize: '1.5rem', color: '#1976d2' }}>{dbStatus.statistics.users}</span>
                  </div>
                  <div style={{
                    background: '#f3e5f5',
                    padding: '10px',
                    borderRadius: '5px',
                    textAlign: 'center'
                  }}>
                    <strong>الأنظمة</strong><br/>
                    <span style={{ fontSize: '1.5rem', color: '#7b1fa2' }}>{dbStatus.statistics.systems}</span>
                  </div>
                  <div style={{
                    background: '#e8f5e8',
                    padding: '10px',
                    borderRadius: '5px',
                    textAlign: 'center'
                  }}>
                    <strong>العملاء</strong><br/>
                    <span style={{ fontSize: '1.5rem', color: '#388e3c' }}>{dbStatus.statistics.leads}</span>
                  </div>
                  <div style={{
                    background: '#fff3e0',
                    padding: '10px',
                    borderRadius: '5px',
                    textAlign: 'center'
                  }}>
                    <strong>الطلبات</strong><br/>
                    <span style={{ fontSize: '1.5rem', color: '#f57c00' }}>{dbStatus.statistics.requests}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Status */}
            {dbStatus.admin && (
              <div style={{
                background: dbStatus.admin.exists ? '#d4edda' : '#fff3cd',
                border: `1px solid ${dbStatus.admin.exists ? '#c3e6cb' : '#ffeaa7'}`,
                borderRadius: '8px',
                padding: '15px'
              }}>
                <h5 style={{ margin: '0 0 10px 0' }}>
                  <i className="fas fa-user-shield" style={{ marginLeft: '8px' }}></i>
                  حالة المدير
                </h5>
                <p style={{ margin: '5px 0' }}>
                  <strong>المدير موجود:</strong> {dbStatus.admin.exists ? '✅ نعم' : '❌ لا'}
                </p>
                {dbStatus.admin.exists && (
                  <>
                    <p style={{ margin: '5px 0' }}>
                      <strong>اسم المستخدم:</strong> {dbStatus.admin.username}
                    </p>
                    <p style={{ margin: '5px 0' }}>
                      <strong>البريد الإلكتروني:</strong> {dbStatus.admin.email}
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Status */}
            <div style={{
              background: dbStatus.status === 'ready' ? '#d4edda' : '#fff3cd',
              border: `1px solid ${dbStatus.status === 'ready' ? '#c3e6cb' : '#ffeaa7'}`,
              borderRadius: '8px',
              padding: '15px',
              marginTop: '15px'
            }}>
              <h5 style={{ margin: '0 0 10px 0' }}>
                <i className="fas fa-info-circle" style={{ marginLeft: '8px' }}></i>
                حالة النظام
              </h5>
              <p style={{ margin: '0' }}>
                {dbStatus.status === 'ready' ? 
                  '✅ قاعدة البيانات جاهزة للاستخدام' : 
                  '⚠️ قاعدة البيانات تحتاج إعداد'
                }
              </p>
            </div>
          </div>
        )}

        {dbStatus?.status !== 'ready' && (
          <button
            onClick={buildDatabase}
            disabled={loading}
            style={{
              background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '20px',
              width: '100%',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin" style={{ marginLeft: '10px' }}></i>
                جاري بناء قاعدة البيانات...
              </>
            ) : (
              <>
                <i className="fas fa-hammer" style={{ marginLeft: '10px' }}></i>
                بناء قاعدة البيانات
              </>
            )}
          </button>
        )}

        {buildResult && (
          <div style={{
            background: buildResult.success ? '#d4edda' : '#f8d7da',
            border: `1px solid ${buildResult.success ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'right'
          }}>
            <h3 style={{
              margin: '0 0 15px 0',
              color: buildResult.success ? '#155724' : '#721c24'
            }}>
              {buildResult.success ? 'نجح البناء!' : 'فشل البناء'}
            </h3>
            
            <p style={{ margin: '0 0 10px 0' }}>
              {buildResult.message || buildResult.error}
            </p>

            {buildResult.success && buildResult.credentials && (
              <div style={{
                background: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '8px',
                padding: '15px',
                marginTop: '15px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>
                  <i className="fas fa-key" style={{ marginLeft: '8px' }}></i>
                  بيانات تسجيل الدخول
                </h4>
                <p style={{ margin: '5px 0', fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  <strong>اسم المستخدم:</strong> {buildResult.credentials.username}
                </p>
                <p style={{ margin: '5px 0', fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  <strong>كلمة المرور:</strong> {buildResult.credentials.password}
                </p>
                <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', color: '#856404' }}>
                  {buildResult.credentials.note}
                </p>
              </div>
            )}

            {buildResult.success && buildResult.nextSteps && (
              <div style={{
                background: '#d1ecf1',
                border: '1px solid #bee5eb',
                borderRadius: '8px',
                padding: '15px',
                marginTop: '15px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>
                  <i className="fas fa-list-ol" style={{ marginLeft: '8px' }}></i>
                  الخطوات التالية
                </h4>
                <ol style={{ margin: '0', paddingRight: '20px' }}>
                  {buildResult.nextSteps.map((step: string, index: number) => (
                    <li key={index} style={{ margin: '5px 0' }}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link
            href="/login"
            style={{
              background: '#28a745',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            <i className="fas fa-sign-in-alt" style={{ marginLeft: '8px' }}></i>
            تسجيل الدخول
          </Link>

          <button
            onClick={checkDatabaseStatus}
            style={{
              background: '#17a2b8',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <i className="fas fa-sync-alt" style={{ marginLeft: '8px' }}></i>
            تحديث الحالة
          </button>

          <Link
            href="/admin"
            style={{
              background: '#6f42c1',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            <i className="fas fa-tachometer-alt" style={{ marginLeft: '8px' }}></i>
            لوحة التحكم
          </Link>
        </div>
      </div>
    </div>
  )
}
