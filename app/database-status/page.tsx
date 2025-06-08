'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DatabaseStatusPage() {
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [dbStatus, setDbStatus] = useState<any>(null)
  const [setupResult, setSetupResult] = useState<any>(null)

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    setChecking(true)
    try {
      const response = await fetch('/api/check-db-connection')
      const data = await response.json()
      setDbStatus(data)
    } catch (error) {
      console.error('Error checking database:', error)
    } finally {
      setChecking(false)
    }
  }

  const setupCompleteDatabase = async () => {
    setLoading(true)
    setSetupResult(null)

    try {
      const response = await fetch('/api/setup-complete-db', {
        method: 'POST'
      })

      const data = await response.json()
      setSetupResult(data)
      
      if (data.success) {
        await checkDatabaseStatus()
      }
    } catch (error) {
      console.error('Error setting up database:', error)
      setSetupResult({
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
      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '800px',
        width: '100%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
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
          color: '#6366f1'
        }}>
          حالة قاعدة البيانات
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          فحص وإعداد قاعدة البيانات للربط الكامل مع لوحة التحكم
        </p>

        {checking ? (
          <div style={{
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <i className="fas fa-spinner fa-spin" style={{ marginLeft: '10px' }}></i>
            جاري فحص قاعدة البيانات...
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
              تقرير حالة قاعدة البيانات
            </h3>

            {/* Environment Variables */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#6c757d' }}>متغيرات البيئة:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                {Object.entries(dbStatus.environment || {}).map(([key, value]) => (
                  <div key={key} style={{
                    background: value ? '#d4edda' : '#f8d7da',
                    padding: '8px',
                    borderRadius: '5px',
                    fontSize: '0.9rem'
                  }}>
                    <strong>{key}:</strong> {value ? '✅' : '❌'}
                  </div>
                ))}
              </div>
            </div>

            {/* Connection Status */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#6c757d' }}>حالة الاتصالات:</h4>
              
              {/* Prisma Connection */}
              <div style={{
                background: dbStatus.connections?.prisma?.success ? '#d4edda' : '#f8d7da',
                border: `1px solid ${dbStatus.connections?.prisma?.success ? '#c3e6cb' : '#f5c6cb'}`,
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '10px'
              }}>
                <h5 style={{ margin: '0 0 10px 0' }}>
                  <i className="fas fa-layer-group" style={{ marginLeft: '8px' }}></i>
                  Prisma ORM
                </h5>
                <p style={{ margin: '5px 0' }}>
                  <strong>الحالة:</strong> {dbStatus.connections?.prisma?.success ? '✅ متصل' : '❌ غير متصل'}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>عدد المستخدمين:</strong> {dbStatus.connections?.prisma?.userCount || 0}
                </p>
                {dbStatus.connections?.prisma?.error && (
                  <p style={{ margin: '5px 0', color: '#721c24', fontSize: '0.9rem' }}>
                    <strong>الخطأ:</strong> {dbStatus.connections.prisma.error}
                  </p>
                )}
              </div>

              {/* Vercel Postgres Connection */}
              <div style={{
                background: dbStatus.connections?.vercelPostgres?.success ? '#d4edda' : '#f8d7da',
                border: `1px solid ${dbStatus.connections?.vercelPostgres?.success ? '#c3e6cb' : '#f5c6cb'}`,
                borderRadius: '8px',
                padding: '15px'
              }}>
                <h5 style={{ margin: '0 0 10px 0' }}>
                  <i className="fas fa-cloud" style={{ marginLeft: '8px' }}></i>
                  Vercel Postgres
                </h5>
                <p style={{ margin: '5px 0' }}>
                  <strong>الحالة:</strong> {dbStatus.connections?.vercelPostgres?.success ? '✅ متصل' : '❌ غير متصل'}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>متاح:</strong> {dbStatus.connections?.vercelPostgres?.available ? 'نعم' : 'لا'}
                </p>
                {dbStatus.connections?.vercelPostgres?.error && (
                  <p style={{ margin: '5px 0', color: '#721c24', fontSize: '0.9rem' }}>
                    <strong>الخطأ:</strong> {dbStatus.connections.vercelPostgres.error}
                  </p>
                )}
              </div>
            </div>

            {/* Recommendations */}
            {dbStatus.recommendations && (
              <div style={{
                background: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '8px',
                padding: '15px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>
                  <i className="fas fa-lightbulb" style={{ marginLeft: '8px' }}></i>
                  التوصيات
                </h4>
                <p style={{ margin: '5px 0' }}>
                  <strong>قاعدة البيانات الأساسية:</strong> {dbStatus.recommendations.primaryDatabase}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>يحتاج إعداد:</strong> {dbStatus.recommendations.needsSetup ? 'نعم' : 'لا'}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>يوجد مستخدمون:</strong> {dbStatus.recommendations.hasUsers ? 'نعم' : 'لا'}
                </p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={setupCompleteDatabase}
          disabled={loading}
          style={{
            background: loading ? '#ccc' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
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
              جاري الإعداد الكامل...
            </>
          ) : (
            <>
              <i className="fas fa-magic" style={{ marginLeft: '10px' }}></i>
              إعداد قاعدة البيانات الكامل
            </>
          )}
        </button>

        {setupResult && (
          <div style={{
            background: setupResult.success ? '#d4edda' : '#f8d7da',
            border: `1px solid ${setupResult.success ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'right'
          }}>
            <h3 style={{
              margin: '0 0 15px 0',
              color: setupResult.success ? '#155724' : '#721c24'
            }}>
              {setupResult.success ? 'نجح الإعداد!' : 'فشل الإعداد'}
            </h3>
            
            <p style={{ margin: '0 0 10px 0' }}>
              {setupResult.message || setupResult.error}
            </p>

            {setupResult.success && (
              <>
                <p style={{ margin: '10px 0', fontWeight: 'bold' }}>
                  <strong>الطريقة المستخدمة:</strong> {setupResult.method}
                </p>

                {setupResult.credentials && (
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
                      <strong>اسم المستخدم:</strong> {setupResult.credentials.username}
                    </p>
                    <p style={{ margin: '5px 0', fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 'bold' }}>
                      <strong>كلمة المرور:</strong> {setupResult.credentials.password}
                    </p>
                  </div>
                )}

                <div style={{
                  background: '#d1ecf1',
                  border: '1px solid #bee5eb',
                  borderRadius: '8px',
                  padding: '15px',
                  marginTop: '15px'
                }}>
                  <p style={{ margin: '0', color: '#0c5460' }}>
                    <i className="fas fa-check-circle" style={{ marginLeft: '8px' }}></i>
                    {setupResult.note}
                  </p>
                </div>
              </>
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
