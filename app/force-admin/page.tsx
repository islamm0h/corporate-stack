'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ForceAdminPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [dbStatus, setDbStatus] = useState<any>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    setChecking(true)
    try {
      const response = await fetch('/api/force-create-admin')
      const data = await response.json()
      setDbStatus(data.data)
    } catch (error) {
      console.error('Error checking database:', error)
      setDbStatus({ databaseConnected: false, error: error.message })
    } finally {
      setChecking(false)
    }
  }

  const forceCreateAdmin = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/force-create-admin', {
        method: 'POST'
      })

      const data = await response.json()
      setResult(data)
      
      if (data.success) {
        await checkDatabaseStatus()
      }
    } catch (error) {
      console.error('Error creating admin:', error)
      setResult({
        success: false,
        error: 'حدث خطأ في الاتصال',
        details: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '700px',
        width: '100%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 30px',
          fontSize: '2rem',
          color: 'white'
        }}>
          <i className="fas fa-user-cog"></i>
        </div>

        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '15px',
          color: '#dc2626'
        }}>
          إنشاء مدير قسري
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          حذف جميع المستخدمين وإنشاء مدير جديد بالبيانات المحددة
        </p>

        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '30px',
          textAlign: 'right'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#dc2626' }}>
            <i className="fas fa-exclamation-triangle" style={{ marginLeft: '8px' }}></i>
            تحذير مهم
          </h3>
          <ul style={{ margin: '0', paddingRight: '20px', color: '#7f1d1d' }}>
            <li>سيتم حذف جميع المستخدمين الموجودين</li>
            <li>سيتم إنشاء مستخدم admin جديد فقط</li>
            <li>هذا الإجراء لا يمكن التراجع عنه</li>
            <li>استخدم هذا فقط في حالة الضرورة القصوى</li>
          </ul>
        </div>

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
            background: dbStatus.databaseConnected ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${dbStatus.databaseConnected ? '#bbf7d0' : '#fecaca'}`,
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '30px',
            textAlign: 'right'
          }}>
            <h3 style={{
              margin: '0 0 15px 0',
              color: dbStatus.databaseConnected ? '#16a34a' : '#dc2626'
            }}>
              حالة قاعدة البيانات
            </h3>
            
            <p style={{ margin: '5px 0' }}>
              <strong>الاتصال:</strong> {dbStatus.databaseConnected ? '✅ متصل' : '❌ غير متصل'}
            </p>
            
            {dbStatus.databaseConnected && (
              <>
                <p style={{ margin: '5px 0' }}>
                  <strong>إجمالي المستخدمين:</strong> {dbStatus.totalUsers}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>المدير موجود:</strong> {dbStatus.adminExists ? '✅ نعم' : '❌ لا'}
                </p>
                
                {dbStatus.users && dbStatus.users.length > 0 && (
                  <div style={{ marginTop: '15px' }}>
                    <strong>المستخدمون الموجودون:</strong>
                    <ul style={{ margin: '10px 0', paddingRight: '20px' }}>
                      {dbStatus.users.map((user: any) => (
                        <li key={user.id}>
                          {user.username} ({user.email}) - {user.role} - {user.isActive ? 'نشط' : 'غير نشط'}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {dbStatus?.databaseConnected && (
          <button
            onClick={forceCreateAdmin}
            disabled={loading}
            style={{
              background: loading ? '#ccc' : 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
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
                جاري الإنشاء...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus" style={{ marginLeft: '10px' }}></i>
                إنشاء مدير قسري (admin / admin123)
              </>
            )}
          </button>
        )}

        {result && (
          <div style={{
            background: result.success ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${result.success ? '#bbf7d0' : '#fecaca'}`,
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'right'
          }}>
            <h3 style={{
              margin: '0 0 15px 0',
              color: result.success ? '#16a34a' : '#dc2626'
            }}>
              {result.success ? 'نجح الإنشاء!' : 'فشل الإنشاء'}
            </h3>
            
            <p style={{ margin: '0 0 10px 0' }}>
              {result.message || result.error}
            </p>

            {result.success && result.credentials && (
              <div style={{
                background: '#fffbeb',
                border: '1px solid #fed7aa',
                borderRadius: '8px',
                padding: '15px',
                marginTop: '15px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#ea580c' }}>
                  <i className="fas fa-key" style={{ marginLeft: '8px' }}></i>
                  بيانات تسجيل الدخول
                </h4>
                <p style={{ margin: '5px 0', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                  <strong>اسم المستخدم:</strong> {result.credentials.username}
                </p>
                <p style={{ margin: '5px 0', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                  <strong>كلمة المرور:</strong> {result.credentials.password}
                </p>
              </div>
            )}

            {result.details && (
              <details style={{ marginTop: '15px', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', color: '#666' }}>تفاصيل تقنية</summary>
                <pre style={{ 
                  background: '#f8f9fa', 
                  padding: '10px', 
                  borderRadius: '5px', 
                  fontSize: '0.8rem',
                  overflow: 'auto',
                  marginTop: '10px'
                }}>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
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
              background: '#16a34a',
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
              background: '#3b82f6',
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
            href="/"
            style={{
              background: 'transparent',
              color: '#6b7280',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              border: '1px solid #d1d5db',
              transition: 'all 0.3s ease'
            }}
          >
            <i className="fas fa-home" style={{ marginLeft: '8px' }}></i>
            الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
