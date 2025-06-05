'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: 'admin' | 'manager' | 'user'
  isActive: boolean
  emailVerified: boolean
  lastLogin?: string
  createdAt: string
  permissions: string[]
}

interface Permission {
  id: string
  name: string
  description: string
  category: string
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [permissions] = useState<Permission[]>([
    { id: 'users.view', name: 'عرض المستخدمين', description: 'إمكانية عرض قائمة المستخدمين', category: 'المستخدمين' },
    { id: 'users.create', name: 'إضافة مستخدمين', description: 'إمكانية إضافة مستخدمين جدد', category: 'المستخدمين' },
    { id: 'users.edit', name: 'تعديل المستخدمين', description: 'إمكانية تعديل بيانات المستخدمين', category: 'المستخدمين' },
    { id: 'users.delete', name: 'حذف المستخدمين', description: 'إمكانية حذف المستخدمين', category: 'المستخدمين' },
    { id: 'leads.view', name: 'عرض العملاء المحتملين', description: 'إمكانية عرض العملاء المحتملين', category: 'العملاء' },
    { id: 'leads.create', name: 'إضافة عملاء محتملين', description: 'إمكانية إضافة عملاء محتملين جدد', category: 'العملاء' },
    { id: 'leads.edit', name: 'تعديل العملاء المحتملين', description: 'إمكانية تعديل بيانات العملاء المحتملين', category: 'العملاء' },
    { id: 'leads.delete', name: 'حذف العملاء المحتملين', description: 'إمكانية حذف العملاء المحتملين', category: 'العملاء' },
    { id: 'systems.view', name: 'عرض الأنظمة', description: 'إمكانية عرض الأنظمة والخدمات', category: 'الأنظمة' },
    { id: 'systems.create', name: 'إضافة أنظمة', description: 'إمكانية إضافة أنظمة وخدمات جديدة', category: 'الأنظمة' },
    { id: 'systems.edit', name: 'تعديل الأنظمة', description: 'إمكانية تعديل الأنظمة والخدمات', category: 'الأنظمة' },
    { id: 'systems.delete', name: 'حذف الأنظمة', description: 'إمكانية حذف الأنظمة والخدمات', category: 'الأنظمة' },
    { id: 'analytics.view', name: 'عرض التحليلات', description: 'إمكانية عرض التقارير والتحليلات', category: 'التحليلات' },
    { id: 'settings.view', name: 'عرض الإعدادات', description: 'إمكانية عرض إعدادات النظام', category: 'الإعدادات' },
    { id: 'settings.edit', name: 'تعديل الإعدادات', description: 'إمكانية تعديل إعدادات النظام', category: 'الإعدادات' }
  ])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // بيانات تجريبية للمستخدمين
  const mockUsers: User[] = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@corporatestack.com',
      firstName: 'مدير',
      lastName: 'النظام',
      phone: '+966501234567',
      role: 'admin',
      isActive: true,
      emailVerified: true,
      lastLogin: '2024-01-15T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      permissions: permissions.map(p => p.id)
    },
    {
      id: '2',
      username: 'manager1',
      email: 'manager@corporatestack.com',
      firstName: 'أحمد',
      lastName: 'المدير',
      phone: '+966502345678',
      role: 'manager',
      isActive: true,
      emailVerified: true,
      lastLogin: '2024-01-14T15:45:00Z',
      createdAt: '2024-01-02T00:00:00Z',
      permissions: ['users.view', 'leads.view', 'leads.create', 'leads.edit', 'systems.view', 'analytics.view']
    },
    {
      id: '3',
      username: 'user1',
      email: 'user@corporatestack.com',
      firstName: 'محمد',
      lastName: 'المستخدم',
      phone: '+966503456789',
      role: 'user',
      isActive: true,
      emailVerified: false,
      lastLogin: '2024-01-13T09:20:00Z',
      createdAt: '2024-01-03T00:00:00Z',
      permissions: ['leads.view', 'systems.view']
    },
    {
      id: '4',
      username: 'sara.ahmed',
      email: 'sara@corporatestack.com',
      firstName: 'سارة',
      lastName: 'أحمد',
      phone: '+966504567890',
      role: 'manager',
      isActive: false,
      emailVerified: true,
      lastLogin: '2024-01-10T14:15:00Z',
      createdAt: '2024-01-04T00:00:00Z',
      permissions: ['users.view', 'leads.view', 'leads.create', 'systems.view']
    },
    {
      id: '5',
      username: 'khalid.omar',
      email: 'khalid@corporatestack.com',
      firstName: 'خالد',
      lastName: 'عمر',
      phone: '+966505678901',
      role: 'user',
      isActive: true,
      emailVerified: true,
      lastLogin: '2024-01-12T11:30:00Z',
      createdAt: '2024-01-05T00:00:00Z',
      permissions: ['leads.view', 'systems.view', 'analytics.view']
    }
  ]

  useEffect(() => {
    // محاكاة تحميل البيانات
    setTimeout(() => {
      setUsers(mockUsers)
      setLoading(false)
    }, 1000)
  }, [])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterRole, setFilterRole] = useState('all')

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.includes(searchTerm) ||
                         user.lastName.includes(searchTerm) ||
                         user.email.includes(searchTerm) ||
                         user.username.includes(searchTerm)
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'inactive' && !user.isActive)
    const matchesRole = filterRole === 'all' || user.role === filterRole

    return matchesSearch && matchesStatus && matchesRole
  })

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'مدير عام'
      case 'manager': return 'مدير'
      case 'user': return 'مستخدم'
      default: return role
    }
  }

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin': return 'badge-danger'
      case 'manager': return 'badge-warning'
      case 'user': return 'badge-info'
      default: return 'badge-secondary'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleAddUser = () => {
    setSelectedUser(null)
    setShowAddModal(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const handleManagePermissions = (user: User) => {
    setSelectedUser(user)
    setShowPermissionsModal(true)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, isActive: !user.isActive }
        : user
    ))
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>جاري تحميل المستخدمين...</p>
      </div>
    )
  }

  return (
    <div className="admin-page">

      {/* شريط الأدوات */}
      <div className="toolbar">
        <div className="toolbar-left">
          <button
            className="btn btn-primary"
            onClick={handleAddUser}
          >
            <i className="fas fa-plus"></i>
            إضافة مستخدم جديد
          </button>
        </div>

        <div className="toolbar-right">
          {/* البحث */}
          <div className="search-box">
            <input
              type="text"
              placeholder="البحث في المستخدمين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <i className="fas fa-search search-icon"></i>
          </div>

          {/* فلتر الدور */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="filter-select"
          >
            <option value="all">جميع الأدوار</option>
            <option value="admin">مدير عام</option>
            <option value="manager">مدير</option>
            <option value="user">مستخدم</option>
          </select>

          {/* فلتر الحالة */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
          </select>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>{users.length}</h3>
            <p>إجمالي المستخدمين</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-user-shield"></i>
          </div>
          <div className="stat-content">
            <h3>{users.filter(u => u.role === 'admin').length}</h3>
            <p>المديرين العامين</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-user-tie"></i>
          </div>
          <div className="stat-content">
            <h3>{users.filter(u => u.role === 'manager').length}</h3>
            <p>المديرين</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-user-check"></i>
          </div>
          <div className="stat-content">
            <h3>{users.filter(u => u.isActive).length}</h3>
            <p>المستخدمين النشطين</p>
          </div>
        </div>
      </div>

      {/* جدول المستخدمين */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>المستخدم</th>
              <th>البريد الإلكتروني</th>
              <th>الهاتف</th>
              <th>الدور</th>
              <th>الحالة</th>
              <th>الصلاحيات</th>
              <th>آخر دخول</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    <div className="user-details">
                      <div className="user-name">{user.firstName} {user.lastName}</div>
                      <div className="user-username">@{user.username}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="email-cell">
                    {user.email}
                    {user.emailVerified && (
                      <i className="fas fa-check-circle verified-icon" title="بريد إلكتروني مؤكد"></i>
                    )}
                  </div>
                </td>
                <td>{user.phone || '-'}</td>
                <td>
                  <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                    {getRoleText(user.role)}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.isActive ? 'status-active' : 'status-inactive'}`}>
                    {user.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </td>
                <td>
                  <div className="permissions-cell">
                    <span className="permissions-count">
                      {user.permissions.length} صلاحية
                    </span>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => handleManagePermissions(user)}
                    >
                      إدارة
                    </button>
                  </div>
                </td>
                <td>
                  {user.lastLogin ? formatDate(user.lastLogin) : 'لم يسجل دخول'}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleEditUser(user)}
                      title="تعديل"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleManagePermissions(user)}
                      title="إدارة الصلاحيات"
                    >
                      <i className="fas fa-key"></i>
                    </button>
                    <button
                      className={`btn btn-sm ${user.isActive ? 'btn-warning' : 'btn-success'}`}
                      onClick={() => handleToggleStatus(user.id)}
                      title={user.isActive ? 'إلغاء التفعيل' : 'تفعيل'}
                    >
                      <i className={`fas ${user.isActive ? 'fa-pause' : 'fa-play'}`}></i>
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteUser(user.id)}
                      title="حذف"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="no-data">
            <i className="fas fa-users"></i>
            <h3>لا توجد مستخدمين</h3>
            <p>لم يتم العثور على مستخدمين مطابقين للبحث</p>
          </div>
        )}
      </div>

      {/* نافذة إدارة الصلاحيات */}
      {showPermissionsModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowPermissionsModal(false)}>
          <div className="modal-content permissions-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>إدارة صلاحيات المستخدم</h3>
              <button
                className="modal-close"
                onClick={() => setShowPermissionsModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="user-info-header">
                <div className="user-avatar">
                  {selectedUser.firstName.charAt(0)}{selectedUser.lastName.charAt(0)}
                </div>
                <div>
                  <h4>{selectedUser.firstName} {selectedUser.lastName}</h4>
                  <p>{selectedUser.email}</p>
                  <span className={`badge ${getRoleBadgeClass(selectedUser.role)}`}>
                    {getRoleText(selectedUser.role)}
                  </span>
                </div>
              </div>

              <div className="permissions-grid">
                {Object.entries(
                  permissions.reduce((acc, permission) => {
                    if (!acc[permission.category]) {
                      acc[permission.category] = []
                    }
                    acc[permission.category].push(permission)
                    return acc
                  }, {} as Record<string, Permission[]>)
                ).map(([category, categoryPermissions]) => (
                  <div key={category} className="permission-category">
                    <h5 className="category-title">{category}</h5>
                    <div className="permissions-list">
                      {categoryPermissions.map((permission) => (
                        <div key={permission.id} className="permission-item">
                          <label className="permission-label">
                            <input
                              type="checkbox"
                              checked={selectedUser.permissions.includes(permission.id)}
                              onChange={(e) => {
                                const updatedPermissions = e.target.checked
                                  ? [...selectedUser.permissions, permission.id]
                                  : selectedUser.permissions.filter(p => p !== permission.id)

                                setSelectedUser({
                                  ...selectedUser,
                                  permissions: updatedPermissions
                                })

                                setUsers(users.map(user =>
                                  user.id === selectedUser.id
                                    ? { ...user, permissions: updatedPermissions }
                                    : user
                                ))
                              }}
                            />
                            <span className="permission-name">{permission.name}</span>
                          </label>
                          <p className="permission-description">{permission.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowPermissionsModal(false)}
              >
                إلغاء
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowPermissionsModal(false)}
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
