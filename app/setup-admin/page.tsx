'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SetupAdminPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [userStatus, setUserStatus] = useState<any>(null)

  useEffect(() => {
    checkUserStatus()
  }, [])

  const checkUserStatus = async () => {
    try {
      const response = await fetch('/api/init-admin')
      const data = await response.json()
      setUserStatus({
        hasUsers: data.hasAdmin,
        totalUsers: data.hasAdmin ? 1 : 0,
        adminUsers: data.adminInfo ? [data.adminInfo] : []
      })
    } catch (error) {
      console.error('Error checking user status:', error)
    }
  }

  const handleSetupAdmin = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/init-admin', {
        method: 'POST'
      })

      const data = await response.json()
      setResult(data)
      
      if (data.success) {
        await checkUserStatus()
      }
    } catch (error) {
      console.error('Error setting up admin:', error)
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
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
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
          <i className="fas fa-user-shield"></i>
        </div>

        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '15px',
          color: '#333'
        }}>
          إعداد المدير
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          إنشاء حساب المدير الافتراضي للوصول إلى لوحة التحكم
        </p>

        {userStatus && (
          <div style={{
            background: userStatus.hasUsers ? '#fee2e2' : '#f0f9ff',
            border: `1px solid ${userStatus.hasUsers ? '#fecaca' : '#bae6fd'}`,
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '30px',
            textAlign: 'right'
          }}>
            <h3 style={{
              margin: '0 0 15px 0',
              color: userStatus.hasUsers ? '#dc2626' : '#0369a1'
            }}>
              حالة المستخدمين
            </h3>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>إجمالي المستخدمين:</strong> {userStatus.totalUsers}
            </p>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>المديرون:</strong> {userStatus.adminUsers?.length || 0}
            </p>
            
            {userStatus.adminUsers?.length > 0 && (
              <div style={{ marginTop: '15px' }}>
                <strong>المديرون الموجودون:</strong>
                <ul style={{ margin: '10px 0', paddingRight: '20px' }}>
                  {userStatus.adminUsers.map((admin: any) => (
                    <li key={admin.id}>
                      {admin.username} ({admin.email})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!userStatus?.hasUsers && (
          <button
            onClick={handleSetupAdmin}
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
                جاري الإعداد...
              </>
            ) : (
              <>
                <i className="fas fa-plus" style={{ marginLeft: '10px' }}></i>
                إنشاء المدير الافتراضي
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
              {result.success ? 'نجح الإعداد!' : 'فشل الإعداد'}
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
                <p style={{ margin: '5px 0', fontFamily: 'monospace' }}>
                  <strong>اسم المستخدم:</strong> {result.credentials.username}
                </p>
                <p style={{ margin: '5px 0', fontFamily: 'monospace' }}>
                  <strong>كلمة المرور:</strong> {result.credentials.password}
                </p>
                <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', color: '#ea580c' }}>
                  ⚠️ {result.credentials.note}
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
              background: '#f3f4f6',
              color: '#374151',
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
