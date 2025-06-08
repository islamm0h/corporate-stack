'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DbAdminPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [dbStatus, setDbStatus] = useState<any>(null)

  useEffect(() => {
    checkDatabase()
  }, [])

  const checkDatabase = async () => {
    try {
      const response = await fetch('/api/create-db-admin')
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
      const response = await fetch('/api/create-db-admin', {
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
      background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
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
          background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
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
          color: '#1e40af'
        }}>
          إنشاء مدير في قاعدة البيانات
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          إنشاء مستخدم admin مباشرة في قاعدة البيانات
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
                      نشط: {dbStatus.adminUser.isActive ? 'نعم' : 'لا'}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <button
          onClick={createAdmin}
          disabled={loading}
          style={{
            background: loading ? '#ccc' : 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
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
              إنشاء admin في قاعدة البيانات
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

            {result.verification && (
              <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#666' }}>
                <strong>التحقق:</strong>
                <ul style={{ margin: '5px 0', paddingRight: '20px' }}>
                  <li>المستخدم موجود: {result.verification.userExists ? 'نعم' : 'لا'}</li>
                  <li>إجمالي المستخدمين: {result.verification.totalUsers}</li>
                  <li>معرف المدير: {result.verification.adminId}</li>
                </ul>
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
