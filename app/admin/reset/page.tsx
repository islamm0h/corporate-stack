'use client'

import { useState } from 'react'

export default function ResetDatabasePage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const resetDatabase = async () => {
    if (!confirm('هل أنت متأكد من تصفير قاعدة البيانات؟ سيتم حذف جميع البيانات!')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/setup-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reset: true })
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, message: 'خطأ في الاتصال', error: error })
    } finally {
      setLoading(false)
    }
  }

  const setupDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/setup-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reset: false })
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, message: 'خطأ في الاتصال', error: error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
            إدارة قاعدة البيانات
          </h1>

          <div className="space-y-4">
            <button
              onClick={resetDatabase}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {loading ? 'جاري التصفير...' : '🗑️ تصفير قاعدة البيانات'}
            </button>

            <button
              onClick={setupDatabase}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'جاري الإعداد...' : '⚙️ إعداد البيانات الأساسية'}
            </button>
          </div>

          {result && (
            <div className={`mt-6 p-4 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <h3 className={`text-sm font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.success ? '✅ نجح' : '❌ فشل'}
              </h3>
              <p className={`mt-1 text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                {result.message}
              </p>
              {result.data && (
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              )}
            </div>
          )}

          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              ← العودة إلى الموقع
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
