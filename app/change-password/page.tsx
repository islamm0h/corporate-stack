'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ChangePasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  const isFirstLogin = searchParams.get('firstLogin') === 'true'

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userInfo, setUserInfo] = useState<any>(null)

  useEffect(() => {
    if (!userId) {
      router.push('/login')
      return
    }

    // جلب معلومات المستخدم
    fetchUserInfo()
  }, [userId])

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`/api/auth/change-password?userId=${userId}`)
      const result = await response.json()

      if (result.success) {
        setUserInfo(result.data)
      } else {
        setError('فشل في جلب معلومات المستخدم')
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // التحقق من صحة البيانات
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('جميع الحقول مطلوبة')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('كلمة المرور الجديدة وتأكيدها غير متطابقتين')
      return
    }

    if (formData.newPassword.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          isFirstLogin
        })
      })

      const result = await response.json()

      if (result.success) {
        // إعادة توجيه إلى لوحة التحكم
        router.push('/admin?passwordChanged=true')
      } else {
        setError(result.error || 'فشل في تغيير كلمة المرور')
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  if (!userInfo) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#667eea' }}></i>
          <p style={{ marginTop: '20px', color: '#666' }}>جاري التحميل...</p>
        </div>
      </div>
    )
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
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'white',
            fontSize: '2rem'
          }}>
            <i className="fas fa-key"></i>
          </div>
          
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#2d3748',
            marginBottom: '10px'
          }}>
            {isFirstLogin ? 'تغيير كلمة المرور' : 'تحديث كلمة المرور'}
          </h1>
          
          <p style={{
            color: '#718096',
            fontSize: '1.1rem'
          }}>
            مرحباً {userInfo.firstName} {userInfo.lastName}
          </p>
          
          {isFirstLogin && (
            <div style={{
              background: '#fef5e7',
              border: '1px solid #f6ad55',
              borderRadius: '10px',
              padding: '15px',
              marginTop: '20px',
              color: '#c05621'
            }}>
              <i className="fas fa-exclamation-triangle" style={{ marginLeft: '8px' }}></i>
              يجب تغيير كلمة المرور المؤقتة قبل المتابعة
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#2d3748'
            }}>
              {isFirstLogin ? 'كلمة المرور المؤقتة' : 'كلمة المرور الحالية'}
            </label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease'
              }}
              placeholder={isFirstLogin ? 'أدخل كلمة المرور المؤقتة' : 'أدخل كلمة المرور الحالية'}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#2d3748'
            }}>
              كلمة المرور الجديدة
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '1rem'
              }}
              placeholder="أدخل كلمة المرور الجديدة (8 أحرف على الأقل)"
              required
              minLength={8}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#2d3748'
            }}>
              تأكيد كلمة المرور الجديدة
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '1rem'
              }}
              placeholder="أعد إدخال كلمة المرور الجديدة"
              required
            />
          </div>

          {error && (
            <div style={{
              background: '#fed7d7',
              border: '1px solid #fc8181',
              borderRadius: '10px',
              padding: '12px',
              marginBottom: '20px',
              color: '#c53030',
              textAlign: 'center'
            }}>
              <i className="fas fa-exclamation-circle" style={{ marginLeft: '8px' }}></i>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#a0aec0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '15px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin" style={{ marginLeft: '10px' }}></i>
                جاري التحديث...
              </>
            ) : (
              <>
                <i className="fas fa-check" style={{ marginLeft: '10px' }}></i>
                تحديث كلمة المرور
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
