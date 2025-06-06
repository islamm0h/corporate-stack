'use client'

import { useState } from 'react'

export default function ResetDatabasePage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const resetAndSetup = async () => {
    if (!confirm('هل أنت متأكد من تصفير قاعدة البيانات وإعادة إعدادها؟')) {
      return
    }

    setLoading(true)
    setResult(null)
    
    try {
      // تصفير وإعداد قاعدة البيانات
      const response = await fetch('/api/setup-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reset: true })
      })

      const data = await response.json()
      setResult(data)
      
      if (data.success) {
        setResult({
          ...data,
          loginInfo: {
            url: window.location.origin + '/login',
            email: 'admin@corporatestack.com',
            note: 'كلمة المرور: سيتم إنشاؤها في الخطوة التالية'
          }
        })
      }
    } catch (error) {
      setResult({ 
        success: false, 
        message: 'خطأ في الاتصال', 
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🗑️ تصفير قاعدة البيانات
            </h1>
            <p className="text-gray-600">
              إعادة تعيين قاعدة البيانات وإنشاء البيانات الأساسية
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">تحذير</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>سيتم حذف جميع البيانات الموجودة وإنشاء بيانات جديدة تشمل:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>مستخدم مدير: admin@corporatestack.com</li>
                    <li>مستخدم مدير مبيعات: manager@corporatestack.com</li>
                    <li>أنظمة أساسية (CRM، المحاسبة)</li>
                    <li>عميل تجريبي واحد</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={resetAndSetup}
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري التصفير والإعداد...
              </div>
            ) : (
              '🗑️ تصفير وإعداد قاعدة البيانات'
            )}
          </button>

          {result && (
            <div className={`mt-6 p-6 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <h3 className={`text-lg font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.success ? '✅ تم بنجاح!' : '❌ فشل'}
              </h3>
              <p className={`mt-2 text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                {result.message}
              </p>
              
              {result.success && result.loginInfo && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">معلومات تسجيل الدخول:</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <p><strong>رابط تسجيل الدخول:</strong> <a href={result.loginInfo.url} className="underline" target="_blank">{result.loginInfo.url}</a></p>
                    <p><strong>البريد الإلكتروني:</strong> {result.loginInfo.email}</p>
                    <p><strong>ملاحظة:</strong> {result.loginInfo.note}</p>
                  </div>
                </div>
              )}
              
              {result.data && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium">عرض التفاصيل</summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}

          <div className="mt-8 text-center space-y-2">
            <a
              href="/"
              className="inline-block text-sm text-blue-600 hover:text-blue-500 underline"
            >
              ← العودة إلى الموقع الرئيسي
            </a>
            <br />
            <a
              href="/login"
              className="inline-block text-sm text-green-600 hover:text-green-500 underline"
            >
              🔐 الذهاب إلى صفحة تسجيل الدخول
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
