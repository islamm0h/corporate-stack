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
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newUserData, setNewUserData] = useState<any>(null)
  const [addUserForm, setAddUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    role: 'user'
  })

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
    // جلب المستخدمين من قاعدة البيانات
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users')
        const result = await response.json()

        if (result.success) {
          setUsers(result.data)
        } else {
          console.error('Failed to fetch users:', result.message)
          // في حالة الفشل، استخدم البيانات التجريبية
          setUsers(mockUsers)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
        // في حالة الخطأ، استخدم البيانات التجريبية
        setUsers(mockUsers)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
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
    setAddUserForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      username: '',
      role: 'user'
    })
    setShowAddModal(true)
  }

  const handleCreateUser = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addUserForm)
      })

      const result = await response.json()

      if (result.success) {
        setNewUserData(result.data)
        setShowAddModal(false)
        setShowPasswordModal(true)

        // إعادة تحميل قائمة المستخدمين
        const usersResponse = await fetch('/api/users')
        const usersResult = await usersResponse.json()
        if (usersResult.success) {
          setUsers(usersResult.data)
        }
      } else {
        alert(result.error || 'فشل في إنشاء المستخدم')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('حدث خطأ في إنشاء المستخدم')
    }
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

      {/* نافذة إضافة مستخدم جديد */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>إضافة مستخدم جديد</h3>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label>الاسم الأول *</label>
                  <input
                    type="text"
                    value={addUserForm.firstName}
                    onChange={(e) => setAddUserForm({...addUserForm, firstName: e.target.value})}
                    placeholder="أدخل الاسم الأول"
                    required
                  />
                </div>
                <div>
                  <label>الاسم الأخير *</label>
                  <input
                    type="text"
                    value={addUserForm.lastName}
                    onChange={(e) => setAddUserForm({...addUserForm, lastName: e.target.value})}
                    placeholder="أدخل الاسم الأخير"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                <div>
                  <label>البريد الإلكتروني *</label>
                  <input
                    type="email"
                    value={addUserForm.email}
                    onChange={(e) => setAddUserForm({...addUserForm, email: e.target.value})}
                    placeholder="أدخل البريد الإلكتروني"
                    required
                  />
                </div>
                <div>
                  <label>اسم المستخدم *</label>
                  <input
                    type="text"
                    value={addUserForm.username}
                    onChange={(e) => setAddUserForm({...addUserForm, username: e.target.value})}
                    placeholder="أدخل اسم المستخدم"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                <div>
                  <label>رقم الهاتف</label>
                  <input
                    type="tel"
                    value={addUserForm.phone}
                    onChange={(e) => setAddUserForm({...addUserForm, phone: e.target.value})}
                    placeholder="أدخل رقم الهاتف"
                  />
                </div>
                <div>
                  <label>الدور *</label>
                  <select
                    value={addUserForm.role}
                    onChange={(e) => setAddUserForm({...addUserForm, role: e.target.value})}
                    required
                  >
                    <option value="user">مستخدم</option>
                    <option value="manager">مدير</option>
                    <option value="admin">مدير عام</option>
                  </select>
                </div>
              </div>

              <div style={{
                background: '#f8f9fa',
                padding: '15px',
                borderRadius: '8px',
                marginTop: '20px',
                border: '1px solid #e9ecef'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <i className="fas fa-info-circle" style={{ color: '#0066cc', marginLeft: '8px' }}></i>
                  <strong>ملاحظة مهمة</strong>
                </div>
                <p style={{ margin: 0, color: '#6c757d', fontSize: '0.9rem' }}>
                  سيتم إنشاء كلمة مرور مؤقتة للمستخدم الجديد. يجب على المستخدم تغيير كلمة المرور في أول تسجيل دخول.
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                إلغاء
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreateUser}
                disabled={!addUserForm.firstName || !addUserForm.lastName || !addUserForm.email || !addUserForm.username}
              >
                إنشاء المستخدم
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة عرض كلمة المرور المؤقتة */}
      {showPasswordModal && newUserData && (
        <div className="modal-overlay">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>تم إنشاء المستخدم بنجاح</h3>
            </div>

            <div className="modal-body">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: 'white',
                  fontSize: '2rem'
                }}>
                  <i className="fas fa-check"></i>
                </div>
                <h4>تم إنشاء حساب {newUserData.firstName} {newUserData.lastName}</h4>
              </div>

              <div style={{
                background: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <i className="fas fa-key" style={{ color: '#856404', marginLeft: '10px' }}></i>
                  <strong style={{ color: '#856404' }}>كلمة المرور المؤقتة</strong>
                </div>
                <div style={{
                  background: 'white',
                  padding: '15px',
                  borderRadius: '6px',
                  border: '2px dashed #ffc107',
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#856404',
                  letterSpacing: '2px',
                  fontFamily: 'monospace'
                }}>
                  {newUserData.temporaryPassword}
                </div>
                <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', color: '#856404' }}>
                  <i className="fas fa-exclamation-triangle" style={{ marginLeft: '5px' }}></i>
                  احفظ هذه كلمة المرور في مكان آمن. لن تظهر مرة أخرى!
                </p>
              </div>

              <div style={{
                background: '#d1ecf1',
                border: '1px solid #bee5eb',
                borderRadius: '8px',
                padding: '15px'
              }}>
                <h5 style={{ color: '#0c5460', marginBottom: '10px' }}>معلومات تسجيل الدخول:</h5>
                <p style={{ margin: '5px 0', color: '#0c5460' }}>
                  <strong>البريد الإلكتروني:</strong> {newUserData.email}
                </p>
                <p style={{ margin: '5px 0', color: '#0c5460' }}>
                  <strong>اسم المستخدم:</strong> {newUserData.username}
                </p>
                <p style={{ margin: '5px 0', color: '#0c5460' }}>
                  <strong>رابط تغيير كلمة المرور:</strong>
                </p>
                <div style={{
                  background: 'white',
                  padding: '10px',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  wordBreak: 'break-all',
                  marginTop: '5px'
                }}>
                  {window.location.origin}{newUserData.loginUrl}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowPasswordModal(false)
                  setNewUserData(null)
                }}
              >
                تم الحفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
