'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  totalAssigned: number
  lastAssigned: string | null
  assignmentOrder: number
  currentAssigned: number
}

export default function AssignmentManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAssignmentStats()
  }, [])

  const fetchAssignmentStats = async () => {
    try {
      const response = await fetch('/api/leads/assign')
      const result = await response.json()
      
      if (result.success) {
        setUsers(result.data.users)
      }
    } catch (error) {
      console.error('Error fetching assignment stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetAssignmentOrder = async () => {
    try {
      const response = await fetch('/api/leads/assign/reset', {
        method: 'POST'
      })
      
      if (response.ok) {
        fetchAssignmentStats()
        alert('تم إعادة تعيين ترتيب التوزيع بنجاح')
      }
    } catch (error) {
      console.error('Error resetting assignment order:', error)
      alert('فشل في إعادة تعيين ترتيب التوزيع')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل إحصائيات التوزيع...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">إدارة توزيع العملاء المحتملين</h1>
              <p className="text-gray-600 mt-2">نظام التوزيع التلقائي بالتناوب (Round Robin)</p>
            </div>
            <button
              onClick={resetAssignmentOrder}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              إعادة تعيين الترتيب
            </button>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">إجمالي المستخدمين</h3>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">إجمالي التخصيصات</h3>
            <p className="text-3xl font-bold text-green-600">
              {users.reduce((sum, user) => sum + user.totalAssigned, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">العملاء النشطين</h3>
            <p className="text-3xl font-bold text-orange-600">
              {users.reduce((sum, user) => sum + user.currentAssigned, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">المستخدم التالي</h3>
            <p className="text-sm font-medium text-purple-600">
              {users.length > 0 ? `${users[0].firstName} ${users[0].lastName}` : 'غير محدد'}
            </p>
          </div>
        </div>

        {/* جدول المستخدمين */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">إحصائيات التوزيع</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المستخدم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الدور
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ترتيب التوزيع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    إجمالي التخصيصات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العملاء النشطين
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    آخر تخصيص
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={user.id} className={index === 0 ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                        user.role === 'MANAGER' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role === 'ADMIN' ? 'مدير' : user.role === 'MANAGER' ? 'مدير مبيعات' : 'مستخدم'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.assignmentOrder}
                      {index === 0 && (
                        <span className="mr-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">التالي</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.totalAssigned}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.currentAssigned}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastAssigned 
                        ? new Date(user.lastAssigned).toLocaleDateString('ar-SA')
                        : 'لم يتم التخصيص بعد'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        نشط
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* شرح النظام */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">كيف يعمل نظام التوزيع بالتناوب؟</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">التوزيع التلقائي:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• عند تعبئة نموذج جديد، يتم توزيع العميل تلقائي<|im_start|></li>
                <li>• يتم التوزيع على المستخدم الذي لم يحصل على عميل مؤخر<|im_start|></li>
                <li>• في حالة التساوي، يتم التوزيع على الأقل في إجمالي التخصيصات</li>
                <li>• يتم تحديث ترتيب التوزيع تلقائي<|im_start|></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">المميزات:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• توزيع عادل بين جميع المستخدمين</li>
                <li>• تتبع دقيق لإحصائيات التوزيع</li>
                <li>• إمكانية إعادة تعيين الترتيب</li>
                <li>• تسجيل جميع الأنشطة</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
