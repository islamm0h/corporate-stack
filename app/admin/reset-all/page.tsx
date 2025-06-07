'use client'

import { useState } from 'react'

export default function ResetAll() {
  const [isResetting, setIsResetting] = useState(false)
  const [message, setMessage] = useState('')

  const resetData = async () => {
    setIsResetting(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/reset-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const result = await response.json()
      
      if (result.success) {
        setMessage('✅ تم تصفير جميع البيانات بنجاح!')
      } else {
        setMessage('❌ حدث خطأ في تصفير البيانات: ' + result.error)
      }
    } catch (error) {
      setMessage('❌ حدث خطأ في الاتصال')
      console.error('Error resetting data:', error)
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="admin-content">
      <div className="page-header">
        <h1>
          <i className="fas fa-database"></i>
          تصفير جميع البيانات
        </h1>
        <p>تصفير جميع البيانات ما عدا المستخدمين</p>
      </div>

      <div className="reset-section">
        <div className="warning-box">
          <i className="fas fa-exclamation-triangle"></i>
          <div>
            <h3>تحذير مهم!</h3>
            <p>سيتم حذف جميع البيانات التالية نهائياً:</p>
            <ul>
              <li>جميع العملاء المحتملين</li>
              <li>جميع الأنظمة</li>
              <li>جميع طلبات الأسعار والردود</li>
              <li>جميع الإشعارات</li>
              <li>جميع سجلات الأنشطة</li>
              <li>جميع الإحصائيات والتقارير</li>
            </ul>
            <p><strong>سيتم الاحتفاظ بـ:</strong> جميع حسابات المستخدمين</p>
          </div>
        </div>

        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="reset-actions">
          <button 
            className="btn btn-danger"
            onClick={resetData}
            disabled={isResetting}
          >
            {isResetting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                جاري التصفير...
              </>
            ) : (
              <>
                <i className="fas fa-trash-alt"></i>
                تصفير جميع البيانات الآن
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
