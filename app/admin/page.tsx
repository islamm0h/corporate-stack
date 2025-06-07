'use client'

import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newRequests: 0,
    pendingResponses: 0,
    convertedLeads: 0
  })
  const [loading, setLoading] = useState(true)

  // جلب الإحصائيات الحقيقية
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats?type=overview')
        const result = await response.json()

        if (result.success) {
          const data = result.data.overview
          setStats({
            totalLeads: data.totalLeads || 0,
            newRequests: data.totalRequests || 0,
            pendingResponses: data.pendingRequests || 0,
            convertedLeads: data.completedRequests || 0
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
        // استخدام القيم الافتراضية في حالة الخطأ
        setStats({
          totalLeads: 1250,
          newRequests: 45,
          pendingResponses: 23,
          convertedLeads: 187
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const [recentActivities, setRecentActivities] = useState([])
  const [isLoadingActivities, setIsLoadingActivities] = useState(true)

  // جلب النشاطات الحقيقية
  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        setIsLoadingActivities(true)
        const response = await fetch('/api/dashboard/stats?type=recent')
        const result = await response.json()

        if (result.success) {
          // تحويل البيانات إلى تنسيق النشاطات
          const activities = []

          // إضافة العملاء المحتملين الجدد
          if (result.data.recentLeads) {
            result.data.recentLeads.forEach(lead => {
              activities.push({
                id: `lead-${lead.id}`,
                user: lead.companyName,
                action: `عميل محتمل جديد من ${lead.source === 'WEBSITE' ? 'الموقع' : lead.source}`,
                time: formatTimeAgo(lead.createdAt),
                type: 'lead',
                createdAt: lead.createdAt
              })
            })
          }

          // إضافة طلبات الأسعار الجديدة
          if (result.data.recentRequests) {
            result.data.recentRequests.forEach(request => {
              activities.push({
                id: `request-${request.id}`,
                user: request.lead.companyName,
                action: `طلب ${request.requestType === 'QUOTE' ? 'عرض سعر' : 'استفسار'}`,
                time: formatTimeAgo(request.createdAt),
                type: 'request',
                createdAt: request.createdAt
              })
            })
          }

          // إضافة الردود الجديدة
          if (result.data.recentResponses) {
            result.data.recentResponses.forEach(response => {
              activities.push({
                id: `response-${response.id}`,
                user: response.request.lead.companyName,
                action: `تم الرد على ${response.responseType === 'EMAIL' ? 'البريد الإلكتروني' : 'الطلب'}`,
                time: formatTimeAgo(response.createdAt),
                type: 'response',
                createdAt: response.createdAt
              })
            })
          }

          // ترتيب النشاطات حسب التاريخ
          activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

          setRecentActivities(activities.slice(0, 5))
        }
      } catch (error) {
        console.error('Error fetching recent activities:', error)
        // في حالة الخطأ، عرض رسالة
        setRecentActivities([
          { id: 1, user: 'لا توجد بيانات', action: 'قاعدة البيانات فارغة - أضف بيانات جديدة', time: 'الآن', type: 'info' }
        ])
      } finally {
        setIsLoadingActivities(false)
      }
    }

    fetchRecentActivities()
  }, [])

  // دالة لتنسيق الوقت
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'الآن'
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`

    const diffInDays = Math.floor(diffInHours / 24)
    return `منذ ${diffInDays} يوم`
  }

  const [topRequestedSystems, setTopRequestedSystems] = useState([])
  const [isLoadingTopSystems, setIsLoadingTopSystems] = useState(true)

  // جلب الأنظمة الأكثر طلباً
  useEffect(() => {
    const fetchTopSystems = async () => {
      try {
        setIsLoadingTopSystems(true)
        const response = await fetch('/api/dashboard/stats?type=systems')
        const result = await response.json()

        if (result.success && result.data.topSystems) {
          // تحويل البيانات إلى التنسيق المطلوب
          const systemsData = result.data.topSystems.map(system => ({
            name: system.name,
            requests: system.requestCount || 0,
            percentage: system.percentage || 0
          }))

          setTopRequestedSystems(systemsData)
        } else {
          // إذا لم توجد بيانات، عرض قائمة فارغة
          setTopRequestedSystems([])
        }
      } catch (error) {
        console.error('Error fetching top systems:', error)
        // في حالة الخطأ، عرض قائمة فارغة
        setTopRequestedSystems([])
      } finally {
        setIsLoadingTopSystems(false)
      }
    }

    fetchTopSystems()
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lead': return 'fas fa-user-plus'
      case 'request': return 'fas fa-envelope'
      case 'inquiry': return 'fas fa-question-circle'
      case 'response': return 'fas fa-reply'
      case 'demo': return 'fas fa-presentation'
      case 'convert': return 'fas fa-check-circle'
      case 'info': return 'fas fa-info-circle'
      default: return 'fas fa-info-circle'
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'lead': return 'var(--primary-color)'
      case 'request': return 'var(--warning-color)'
      case 'inquiry': return 'var(--warning-color)'
      case 'response': return 'var(--success-color)'
      case 'demo': return 'var(--secondary-color)'
      case 'convert': return 'var(--success-color)'
      case 'info': return 'var(--gray-color)'
      default: return 'var(--gray-color)'
    }
  }

  return (
    <>
      {/* بطاقات الإحصائيات */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-trend up">
              <i className="fas fa-arrow-up"></i>
              +12%
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{stats.totalLeads.toLocaleString()}</div>
            <div className="stat-label">إجمالي العملاء المحتملين</div>
          </div>
          <div className="stat-footer">
            مقارنة بالشهر الماضي
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <div className="stat-trend up">
              <i className="fas fa-arrow-up"></i>
              +8
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{stats.newRequests}</div>
            <div className="stat-label">طلبات جديدة</div>
          </div>
          <div className="stat-footer">
            هذا الأسبوع
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-trend down">
              <i className="fas fa-arrow-down"></i>
              -3
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{stats.pendingResponses}</div>
            <div className="stat-label">ردود في الانتظار</div>
          </div>
          <div className="stat-footer">
            تحتاج متابعة
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-trend up">
              <i className="fas fa-arrow-up"></i>
              +15%
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{stats.convertedLeads}</div>
            <div className="stat-label">عملاء محولين</div>
          </div>
          <div className="stat-footer">
            هذا الشهر
          </div>
        </div>
      </div>

      {/* الجداول والمحتوى */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* النشاطات الأخيرة */}
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">النشاطات الأخيرة</h3>
            <div className="data-table-actions">
              <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '8px 15px' }}>
                <i className="fas fa-eye"></i> عرض الكل
              </button>
            </div>
          </div>
          <div style={{ padding: '20px' }}>
            {isLoadingActivities ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-color)' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                <div>جاري تحميل النشاطات...</div>
              </div>
            ) : recentActivities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-color)' }}>
                <i className="fas fa-inbox" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                <div>لا توجد نشاطات حديثة</div>
                <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>أضف بيانات جديدة لرؤية النشاطات</div>
              </div>
            ) : recentActivities.map((activity) => (
              <div key={activity.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '15px 0',
                borderBottom: '1px solid #f1f5f9'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: `${getActivityColor(activity.type)}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: getActivityColor(activity.type)
                }}>
                  <i className={getActivityIcon(activity.type)}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: 'var(--secondary-color)', marginBottom: '5px' }}>
                    {activity.user}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                    {activity.action}
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* الأنظمة الأكثر طلباً */}
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">الأنظمة الأكثر طلباً</h3>
            <div className="data-table-actions">
              <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '8px 15px' }}>
                <i className="fas fa-chart-bar"></i> تقرير مفصل
              </button>
            </div>
          </div>
          <div style={{ padding: '20px' }}>
            {isLoadingTopSystems ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-color)' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                <div>جاري تحميل الأنظمة الأكثر طلباً...</div>
              </div>
            ) : topRequestedSystems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-color)' }}>
                <i className="fas fa-chart-bar" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                <div>لا توجد بيانات للأنظمة</div>
                <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>أضف طلبات جديدة لرؤية الأنظمة الأكثر طلباً</div>
              </div>
            ) : topRequestedSystems.map((system, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '15px 0',
                borderBottom: index < topRequestedSystems.length - 1 ? '1px solid #f1f5f9' : 'none'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '600',
                    color: 'var(--secondary-color)',
                    marginBottom: '5px'
                  }}>
                    {system.name}
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#f1f5f9',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '5px'
                  }}>
                    <div style={{
                      width: `${system.percentage}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, var(--primary-color), var(--primary-light))`,
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--gray-color)'
                  }}>
                    {system.requests} طلب ({system.percentage}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
