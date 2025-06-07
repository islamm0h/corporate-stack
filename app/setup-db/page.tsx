'use client'

import { useState } from 'react'

export default function SetupDatabase() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const setupDatabase = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/setup-production', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || 'فشل في إعداد قاعدة البيانات')
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم')
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
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
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
          color: 'white',
          fontSize: '2rem'
        }}>
          <i className="fas fa-database"></i>
        </div>

        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#2d3748',
          marginBottom: '15px'
        }}>
          إعداد قاعدة البيانات
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: '#718096',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          اضغط على الزر أدناه لإعداد قاعدة البيانات وإضافة البيانات التجريبية
        </p>

        {!result && !error && (
          <button
            onClick={setupDatabase}
            disabled={loading}
            style={{
              background: loading ? '#a0aec0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              padding: '15px 40px',
              fontSize: '1.2rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)'
            }}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin" style={{ marginLeft: '10px' }}></i>
                جاري الإعداد...
              </>
            ) : (
              <>
                <i className="fas fa-play" style={{ marginLeft: '10px' }}></i>
                بدء إعداد قاعدة البيانات
              </>
            )}
          </button>
        )}

        {result && (
          <div style={{
            background: '#f0fff4',
            border: '2px solid #68d391',
            borderRadius: '15px',
            padding: '30px',
            marginTop: '20px'
          }}>
            <div style={{
              color: '#38a169',
              fontSize: '3rem',
              marginBottom: '20px'
            }}>
              <i className="fas fa-check-circle"></i>
            </div>
            <h3 style={{
              color: '#38a169',
              fontSize: '1.5rem',
              marginBottom: '15px'
            }}>
              تم إعداد قاعدة البيانات بنجاح! 🎉
            </h3>
            <div style={{
              color: '#2f855a',
              fontSize: '1.1rem',
              lineHeight: '1.6'
            }}>
              <p>✅ تم إنشاء {result.data.users} مستخدم</p>
              <p>✅ تم إنشاء {result.data.systems} نظام</p>
              <p>✅ تم إنشاء {result.data.leads} عميل محتمل</p>
            </div>
            <div style={{ marginTop: '30px' }}>
              <a
                href="/admin"
                style={{
                  background: '#38a169',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '25px',
                  padding: '12px 30px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  display: 'inline-block',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fas fa-arrow-left" style={{ marginLeft: '10px' }}></i>
                الذهاب إلى لوحة التحكم
              </a>
            </div>
          </div>
        )}

        {error && (
          <div style={{
            background: '#fed7d7',
            border: '2px solid #fc8181',
            borderRadius: '15px',
            padding: '30px',
            marginTop: '20px'
          }}>
            <div style={{
              color: '#e53e3e',
              fontSize: '3rem',
              marginBottom: '20px'
            }}>
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3 style={{
              color: '#e53e3e',
              fontSize: '1.5rem',
              marginBottom: '15px'
            }}>
              حدث خطأ في الإعداد
            </h3>
            <p style={{
              color: '#c53030',
              fontSize: '1.1rem',
              marginBottom: '20px'
            }}>
              {error}
            </p>
            <button
              onClick={() => {
                setError(null)
                setResult(null)
              }}
              style={{
                background: '#e53e3e',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                padding: '12px 30px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-redo" style={{ marginLeft: '10px' }}></i>
              إعادة المحاولة
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
