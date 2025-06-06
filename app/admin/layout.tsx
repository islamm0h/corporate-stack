'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const handleLogout = () => {
    // حذف الكوكيز والبيانات المحفوظة
    document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    localStorage.removeItem('adminUser')
    sessionStorage.removeItem('adminUser')

    // توجيه إلى صفحة تسجيل الدخول
    router.push('/login')
  }

  const navItems = [
    {
      title: 'الرئيسية',
      items: [
        { href: '/admin', icon: 'fas fa-tachometer-alt', text: 'لوحة المعلومات', exact: true },
        { href: '/admin/analytics', icon: 'fas fa-chart-line', text: 'التحليلات والإحصائيات' },
        { href: '/admin/advanced-analytics', icon: 'fas fa-brain', text: 'الإحصائيات المتقدمة (AI)' },
      ]
    },
    {
      title: 'إدارة العملاء المحتملين',
      items: [
        { href: '/admin/leads', icon: 'fas fa-users', text: 'العملاء المحتملين' },
        { href: '/admin/assignment', icon: 'fas fa-random', text: 'توزيع العملاء' },
        { href: '/admin/requests', icon: 'fas fa-envelope', text: 'الطلبات الواردة' },
        { href: '/admin/responses', icon: 'fas fa-reply', text: 'الردود والمتابعة' },
      ]
    },
    {
      title: 'التقارير',
      items: [
        { href: '/admin/reports', icon: 'fas fa-file-alt', text: 'تقارير العملاء' },
        { href: '/admin/regions', icon: 'fas fa-map-marker-alt', text: 'تقارير المناطق' },
        { href: '/admin/systems-demand', icon: 'fas fa-chart-bar', text: 'الطلب على الأنظمة' },
      ]
    },
    {
      title: 'إدارة النظام',
      items: [
        { href: '/admin/systems-management', icon: 'fas fa-cogs', text: 'إدارة الأنظمة' },
        { href: '/admin/users', icon: 'fas fa-users-cog', text: 'إدارة المستخدمين' },
        { href: '/admin/settings', icon: 'fas fa-cog', text: 'إعدادات النظام' },
      ]
    }
  ]

  const isActiveLink = (href: string, exact = false) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="admin-layout">
      {/* الشريط الجانبي */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* شعار لوحة التحكم */}
        <div className="admin-logo">
          <div className="admin-logo-icon">
            <i className="fas fa-shield-alt"></i>
          </div>
          <div className="admin-logo-text">لوحة التحكم</div>
        </div>

        {/* قائمة التنقل */}
        <nav className="admin-nav">
          {navItems.map((section, index) => (
            <div key={index} className="admin-nav-section">
              <div className="admin-nav-title">{section.title}</div>
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="admin-nav-item">
                  <Link
                    href={item.href}
                    className={`admin-nav-link ${isActiveLink(item.href, item.exact) ? 'active' : ''}`}
                  >
                    <i className={`admin-nav-icon ${item.icon}`}></i>
                    <span className="admin-nav-text">{item.text}</span>
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </nav>

      </aside>

      {/* زر طي الشريط الجانبي */}
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        <i className={`fas ${sidebarCollapsed ? 'fa-bars' : 'fa-times'}`}></i>
      </button>

      {/* المحتوى الرئيسي */}
      <main className="admin-main">
        {/* رأس لوحة التحكم */}
        <header className="admin-header">
          <h1 className="admin-header-title">
            {pathname === '/admin' && (
              <>
                <i className="fas fa-tachometer-alt page-title-icon icon-dashboard"></i>
                لوحة المعلومات
              </>
            )}
            {pathname === '/admin/analytics' && (
              <>
                <i className="fas fa-chart-line page-title-icon icon-analytics"></i>
                التحليلات والإحصائيات
              </>
            )}
            {pathname === '/admin/advanced-analytics' && (
              <>
                <i className="fas fa-brain page-title-icon icon-analytics"></i>
                الإحصائيات المتقدمة (AI)
              </>
            )}
            {pathname === '/admin/leads' && (
              <>
                <i className="fas fa-users page-title-icon icon-users"></i>
                العملاء المحتملين
              </>
            )}
            {pathname === '/admin/assignment' && (
              <>
                <i className="fas fa-random page-title-icon icon-users"></i>
                إدارة توزيع العملاء المحتملين
              </>
            )}
            {pathname === '/admin/requests' && (
              <>
                <i className="fas fa-envelope page-title-icon icon-reports"></i>
                الطلبات الواردة
              </>
            )}
            {pathname === '/admin/responses' && (
              <>
                <i className="fas fa-reply page-title-icon icon-reports"></i>
                الردود والمتابعة
              </>
            )}
            {pathname === '/admin/reports' && (
              <>
                <i className="fas fa-file-alt page-title-icon icon-reports"></i>
                تقارير العملاء
              </>
            )}
            {pathname === '/admin/regions' && (
              <>
                <i className="fas fa-map-marker-alt page-title-icon icon-analytics"></i>
                تقارير المناطق
              </>
            )}
            {pathname === '/admin/systems-demand' && (
              <>
                <i className="fas fa-chart-bar page-title-icon icon-analytics"></i>
                الطلب على الأنظمة
              </>
            )}
            {pathname === '/admin/systems-management' && (
              <>
                <i className="fas fa-cogs page-title-icon icon-systems"></i>
                إدارة الأنظمة
              </>
            )}

            {pathname === '/admin/users' && (
              <>
                <i className="fas fa-users page-title-icon icon-users"></i>
                إدارة المستخدمين والصلاحيات
              </>
            )}
            {pathname === '/admin/settings' && (
              <>
                <i className="fas fa-cog page-title-icon icon-settings"></i>
                إعدادات النظام
              </>
            )}
          </h1>

          {/* وصف الصفحة */}
          {pathname === '/admin/users' && (
            <p className="admin-header-description">
              إدارة شاملة للمستخدمين وصلاحياتهم مع إمكانية إضافة وتعديل وحذف المستخدمين
            </p>
          )}

          <div className="admin-header-actions">
            {/* شريط البحث */}
            <div className="admin-search">
              <input
                type="text"
                className="admin-search-input"
                placeholder="البحث..."
              />
              <i className="admin-search-icon fas fa-search"></i>
            </div>

            {/* الإشعارات */}
            <div className="admin-notifications">
              <button className="notification-btn">
                <i className="fas fa-bell"></i>
                <span className="notification-badge">3</span>
              </button>
            </div>

            {/* ملف المستخدم */}
            <div className="admin-user-profile">
              <div className="admin-user-avatar">م</div>
              <div className="admin-user-info">
                <div className="admin-user-name">مدير النظام</div>
                <div className="admin-user-role">مدير عام</div>
              </div>

              {/* زر تسجيل الخروج */}
              <button
                onClick={handleLogout}
                className="logout-btn"
                title="تسجيل الخروج"
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </header>

        {/* محتوى الصفحة */}
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  )
}
