'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function VercelAdminPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [dbStatus, setDbStatus] = useState<any>(null)

  useEffect(() => {
    checkDatabase()
  }, [])

  const checkDatabase = async () => {
    try {
      const response = await fetch('/api/vercel-admin')
      const data = await response.json()
      setDbStatus(data.data)
    } catch (error) {
      console.error('Error checking database:', error)
    }
  }

  const createAdmin = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/vercel-admin', {
        method: 'POST'
      })

      const data = await response.json()
      setResult(data)
      
      if (data.success) {
        await checkDatabase()
      }
    } catch (error) {
      console.error('Error creating admin:', error)
      setResult({
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
      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
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
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 30px',
          fontSize: '2rem',
          color: 'white'
        }}>
          <i className="fas fa-cloud-upload-alt"></i>
        </div>

        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '15px',
          color: '#059669'
        }}>
          إنشاء مدير Vercel
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          إنشاء مستخدم admin في قاعدة بيانات Vercel Postgres
        </p>

        {dbStatus && (
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
              <strong>النوع:</strong> {dbStatus.database || 'غير محدد'}
            </p>
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
                
                {dbStatus.adminUser && (
                  <div style={{ marginTop: '15px', background: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
                    <strong>بيانات المدير:</strong>
                    <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>
                      ID: {dbStatus.adminUser.id}<br/>
                      اسم المستخدم: {dbStatus.adminUser.username}<br/>
                      البريد: {dbStatus.adminUser.email}<br/>
                      الدور: {dbStatus.adminUser.role}<br/>
                      نشط: {dbStatus.adminUser.is_active ? 'نعم' : 'لا'}
                    </p>
                  </div>
                )}

                {dbStatus.allUsers && dbStatus.allUsers.length > 0 && (
                  <details style={{ marginTop: '15px', textAlign: 'left' }}>
                    <summary style={{ cursor: 'pointer', color: '#666' }}>
                      عرض جميع المستخدمين ({dbStatus.allUsers.length})
                    </summary>
                    <div style={{ marginTop: '10px', fontSize: '0.8rem' }}>
                      {dbStatus.allUsers.map((user: any, index: number) => (
                        <div key={user.id} style={{ 
                          padding: '5px', 
                          background: index % 2 === 0 ? '#f8f9fa' : 'white',
                          borderRadius: '3px',
                          margin: '2px 0'
                        }}>
                          {user.username} - {user.email} - {user.role}
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </>
            )}
          </div>
        )}

        <button
          onClick={createAdmin}
          disabled={loading}
          style={{
            background: loading ? '#ccc' : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
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
              <i className="fas fa-plus" style={{ marginLeft: '10px' }}></i>
              إنشاء admin في Vercel Postgres
            </>
          )}
        </button>

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
                <p style={{ margin: '5px 0', fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  <strong>اسم المستخدم:</strong> {result.credentials.username}
                </p>
                <p style={{ margin: '5px 0', fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  <strong>كلمة المرور:</strong> {result.credentials.password}
                </p>
                <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', color: '#ea580c' }}>
                  {result.credentials.note}
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
                  {result.details}
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
            onClick={checkDatabase}
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
        </div>
      </div>
    </div>
  )
}
