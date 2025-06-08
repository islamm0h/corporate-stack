'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SimpleSetupPage() {
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [status, setStatus] = useState<any>(null)
  const [setupResult, setSetupResult] = useState<any>(null)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    setChecking(true)
    try {
      const response = await fetch('/api/simple-setup')
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error('Error checking status:', error)
    } finally {
      setChecking(false)
    }
  }

  const setupDatabase = async () => {
    setLoading(true)
    setSetupResult(null)

    try {
      const response = await fetch('/api/simple-setup', {
        method: 'POST'
      })

      const data = await response.json()
      setSetupResult(data)
      
      if (data.success) {
        await checkStatus()
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
      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 30px',
          fontSize: '2rem',
          color: 'white'
        }}>
          <i className="fas fa-rocket"></i>
        </div>

        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '15px',
          color: '#4f46e5'
        }}>
          إعداد سريع
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          إعداد قاعدة البيانات والمدير بطريقة بسيطة وسريعة
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
            جاري فحص حالة النظام...
          </div>
        ) : status && (
          <div style={{
            background: status.status === 'ready' ? '#f0fdf4' : '#fef3f2',
            border: `1px solid ${status.status === 'ready' ? '#bbf7d0' : '#fecaca'}`,
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '30px',
            textAlign: 'right'
          }}>
            <h3 style={{
              margin: '0 0 15px 0',
              color: status.status === 'ready' ? '#16a34a' : '#dc2626',
              textAlign: 'center'
            }}>
              حالة النظام
            </h3>
            
            <p style={{ margin: '5px 0' }}>
              <strong>الحالة:</strong> {status.status === 'ready' ? '✅ جاهز' : '⚠️ يحتاج إعداد'}
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>المدير موجود:</strong> {status.hasAdmin ? '✅ نعم' : '❌ لا'}
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>الرسالة:</strong> {status.message}
            </p>

            {status.adminInfo && (
              <div style={{
                background: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '8px',
                padding: '15px',
                marginTop: '15px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>
                  معلومات المدير الموجود:
                </h4>
                <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>
                  <strong>اسم المستخدم:</strong> {status.adminInfo.username}
                </p>
                <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>
                  <strong>البريد:</strong> {status.adminInfo.email}
                </p>
              </div>
            )}
          </div>
        )}

        {status?.status !== 'ready' && (
          <button
            onClick={setupDatabase}
            disabled={loading}
            style={{
              background: loading ? '#ccc' : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
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
                جاري الإعداد...
              </>
            ) : (
              <>
                <i className="fas fa-magic" style={{ marginLeft: '10px' }}></i>
                إعداد قاعدة البيانات
              </>
            )}
          </button>
        )}

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

            {setupResult.success && setupResult.method && (
              <p style={{ margin: '10px 0', fontSize: '0.9rem', color: '#666' }}>
                <strong>الطريقة المستخدمة:</strong> {setupResult.method}
              </p>
            )}

            {setupResult.success && setupResult.credentials && (
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
                <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', color: '#856404' }}>
                  {setupResult.credentials.note}
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
            onClick={checkStatus}
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
            href="/database-status"
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
            <i className="fas fa-database" style={{ marginLeft: '8px' }}></i>
            حالة قاعدة البيانات
          </Link>
        </div>
      </div>
    </div>
  )
}
