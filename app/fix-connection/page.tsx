'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function FixConnectionPage() {
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(true)
  const [testResult, setTestResult] = useState<any>(null)
  const [fixResult, setFixResult] = useState<any>(null)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    setTesting(true)
    try {
      const response = await fetch('/api/fix-connection')
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      console.error('Error testing connection:', error)
      setTestResult({
        success: false,
        error: 'فشل في اختبار الاتصال'
      })
    } finally {
      setTesting(false)
    }
  }

  const fixConnection = async () => {
    setLoading(true)
    setFixResult(null)

    try {
      const response = await fetch('/api/fix-connection', {
        method: 'POST'
      })

      const data = await response.json()
      setFixResult(data)
      
      if (data.success) {
        await testConnection()
      }
    } catch (error) {
      console.error('Error fixing connection:', error)
      setFixResult({
        success: false,
        error: 'حدث خطأ في إصلاح الاتصال'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
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
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 30px',
          fontSize: '2rem',
          color: 'white'
        }}>
          <i className="fas fa-tools"></i>
        </div>

        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '15px',
          color: '#dc2626'
        }}>
          إصلاح الاتصال
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          تشخيص وإصلاح مشاكل الاتصال بقاعدة البيانات
        </p>

        {testing ? (
          <div style={{
            background: '#fef3f2',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <i className="fas fa-spinner fa-spin" style={{ marginLeft: '10px' }}></i>
            جاري اختبار الاتصال...
          </div>
        ) : testResult && (
          <div style={{
            background: testResult.success ? '#f0fdf4' : '#fef3f2',
            border: `1px solid ${testResult.success ? '#bbf7d0' : '#fecaca'}`,
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '30px',
            textAlign: 'right'
          }}>
            <h3 style={{
              margin: '0 0 15px 0',
              color: testResult.success ? '#16a34a' : '#dc2626',
              textAlign: 'center'
            }}>
              نتيجة اختبار الاتصال
            </h3>
            
            <p style={{ margin: '5px 0' }}>
              <strong>الحالة:</strong> {testResult.success ? '✅ يعمل' : '❌ لا يعمل'}
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>الرسالة:</strong> {testResult.message || testResult.error}
            </p>

            {testResult.databaseUrl && (
              <p style={{ margin: '5px 0' }}>
                <strong>DATABASE_URL:</strong> {testResult.databaseUrl}
              </p>
            )}

            {testResult.environment && (
              <p style={{ margin: '5px 0' }}>
                <strong>البيئة:</strong> {testResult.environment}
              </p>
            )}

            {testResult.tests && (
              <div style={{
                background: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '15px',
                marginTop: '15px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                  تفاصيل الاختبارات:
                </h4>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <div style={{
                    background: testResult.tests.prismaTest?.success ? '#d4edda' : '#f8d7da',
                    padding: '8px',
                    borderRadius: '5px',
                    fontSize: '0.9rem'
                  }}>
                    <strong>Prisma:</strong> {testResult.tests.prismaTest?.success ? '✅' : '❌'}
                    {testResult.tests.prismaTest?.error && (
                      <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>
                        {testResult.tests.prismaTest.error}
                      </div>
                    )}
                  </div>
                  <div style={{
                    background: testResult.tests.directConnection?.success ? '#d4edda' : '#f8d7da',
                    padding: '8px',
                    borderRadius: '5px',
                    fontSize: '0.9rem'
                  }}>
                    <strong>اتصال مباشر:</strong> {testResult.tests.directConnection?.success ? '✅' : '❌'}
                  </div>
                  <div style={{
                    background: testResult.tests.accelerateTest?.success ? '#d4edda' : '#f8d7da',
                    padding: '8px',
                    borderRadius: '5px',
                    fontSize: '0.9rem'
                  }}>
                    <strong>Prisma Accelerate:</strong> {testResult.tests.accelerateTest?.success ? '✅' : '❌'}
                  </div>
                </div>
              </div>
            )}

            {testResult.recommendations && (
              <div style={{
                background: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '8px',
                padding: '15px',
                marginTop: '15px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>
                  التوصيات:
                </h4>
                <ul style={{ margin: '0', paddingRight: '20px' }}>
                  {testResult.recommendations.map((rec: string, index: number) => (
                    <li key={index} style={{ margin: '5px 0' }}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <button
          onClick={fixConnection}
          disabled={loading}
          style={{
            background: loading ? '#ccc' : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
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
              جاري إصلاح الاتصال...
            </>
          ) : (
            <>
              <i className="fas fa-wrench" style={{ marginLeft: '10px' }}></i>
              إصلاح الاتصال
            </>
          )}
        </button>

        {fixResult && (
          <div style={{
            background: fixResult.success ? '#d4edda' : '#f8d7da',
            border: `1px solid ${fixResult.success ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'right'
          }}>
            <h3 style={{
              margin: '0 0 15px 0',
              color: fixResult.success ? '#155724' : '#721c24'
            }}>
              {fixResult.success ? 'نجح الإصلاح!' : 'فشل الإصلاح'}
            </h3>
            
            <p style={{ margin: '0 0 10px 0' }}>
              {fixResult.message || fixResult.error}
            </p>

            {fixResult.success && fixResult.method && (
              <p style={{ margin: '10px 0', fontSize: '0.9rem', color: '#666' }}>
                <strong>الطريقة المستخدمة:</strong> {fixResult.method}
              </p>
            )}

            {fixResult.success && fixResult.credentials && (
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
                  <strong>اسم المستخدم:</strong> {fixResult.credentials.username}
                </p>
                <p style={{ margin: '5px 0', fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  <strong>كلمة المرور:</strong> {fixResult.credentials.password}
                </p>
                <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', color: '#856404' }}>
                  {fixResult.credentials.note}
                </p>
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
            onClick={testConnection}
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
            إعادة اختبار
          </button>

          <Link
            href="/simple-setup"
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
            <i className="fas fa-rocket" style={{ marginLeft: '8px' }}></i>
            الإعداد السريع
          </Link>
        </div>
      </div>
    </div>
  )
}
