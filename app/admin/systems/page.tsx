'use client'

import { useState, useEffect } from 'react'

export default function SystemsManagement() {
  const [systems, setSystems] = useState([
    {
      id: 1,
      name: 'نظام المحاسبة والفاتورة الإلكترونية',
      description: 'نظام متكامل لإدارة الحسابات والفواتير الإلكترونية',
      status: 'active',
      version: '2.1.5',
      users: 450,
      lastUpdate: '2024-01-10',
      uptime: '99.9%',
      icon: 'fas fa-calculator',
      color: 'var(--primary-color)'
    },
    {
      id: 2,
      name: 'نظام إدارة العملاء (CRM)',
      description: 'نظام شامل لإدارة العلاقات مع العملاء',
      status: 'active',
      version: '1.8.2',
      users: 320,
      lastUpdate: '2024-01-08',
      uptime: '99.8%',
      icon: 'fas fa-users',
      color: 'var(--success-color)'
    },
    {
      id: 3,
      name: 'نظام إدارة الموارد البشرية',
      description: 'نظام متكامل لإدارة شؤون الموظفين والرواتب',
      status: 'active',
      version: '1.5.7',
      users: 180,
      lastUpdate: '2024-01-05',
      uptime: '99.7%',
      icon: 'fas fa-user-tie',
      color: 'var(--warning-color)'
    },
    {
      id: 4,
      name: 'نظام إدارة المشاريع',
      description: 'نظام لتخطيط وتتبع المشاريع والمهام',
      status: 'maintenance',
      version: '1.2.3',
      users: 0,
      lastUpdate: '2024-01-12',
      uptime: '0%',
      icon: 'fas fa-project-diagram',
      color: 'var(--danger-color)'
    },
    {
      id: 5,
      name: 'نظام إدارة المخزون',
      description: 'نظام لإدارة المخزون والمواد',
      status: 'active',
      version: '1.9.1',
      users: 220,
      lastUpdate: '2024-01-07',
      uptime: '99.9%',
      icon: 'fas fa-boxes',
      color: 'var(--secondary-color)'
    },
    {
      id: 6,
      name: 'نظام إدارة الأصول',
      description: 'نظام لتتبع وإدارة أصول الشركة',
      status: 'active',
      version: '1.4.6',
      users: 80,
      lastUpdate: '2024-01-09',
      uptime: '99.6%',
      icon: 'fas fa-building',
      color: 'var(--primary-dark)'
    }
  ])

  const [selectedSystem, setSelectedSystem] = useState<number | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showFilesModal, setShowFilesModal] = useState(false)
  const [editingSystem, setEditingSystem] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState(false)
  const [systemFiles, setSystemFiles] = useState<any[]>([])
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط'
      case 'inactive': return 'متوقف'
      case 'maintenance': return 'صيانة'
      case 'updating': return 'يتم التحديث'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'var(--success-color)'
      case 'inactive': return 'var(--danger-color)'
      case 'maintenance': return 'var(--warning-color)'
      case 'updating': return 'var(--primary-color)'
      default: return 'var(--gray-color)'
    }
  }

  const totalUsers = systems.reduce((sum, system) => sum + system.users, 0)
  const activeSystems = systems.filter(s => s.status === 'active').length
  const systemsInMaintenance = systems.filter(s => s.status === 'maintenance').length

  // دوال التحكم في النظام
  const handleEditSystem = (system: any) => {
    setEditingSystem(system)
    setShowEditModal(true)
  }

  const handleSaveSystem = async (systemData: any) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/systems/${systemData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(systemData)
      })

      const result = await response.json()

      if (result.success) {
        // تحديث النظام في القائمة
        setSystems(prev => prev.map(s =>
          s.id === systemData.id ? { ...s, ...systemData } : s
        ))
        setShowEditModal(false)
        setEditingSystem(null)
        alert('تم تحديث النظام بنجاح')
      } else {
        alert(result.error || 'فشل في تحديث النظام')
      }
    } catch (error) {
      console.error('Error updating system:', error)
      alert('حدث خطأ في تحديث النظام')
    } finally {
      setIsLoading(false)
    }
  }

  const handleShowFiles = async (system: any) => {
    setEditingSystem(system)
    setShowFilesModal(true)
    await loadSystemFiles(system.id)
  }

  const loadSystemFiles = async (systemId: string) => {
    try {
      const response = await fetch(`/api/admin/systems/${systemId}/files`)
      const result = await response.json()

      if (result.success) {
        setSystemFiles(result.data)
      } else {
        console.error('Failed to load files:', result.error)
      }
    } catch (error) {
      console.error('Error loading files:', error)
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFiles || !editingSystem) return

    setUploadingFiles(true)
    try {
      const formData = new FormData()

      // إضافة الملفات للـ FormData
      Array.from(selectedFiles).forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch(`/api/admin/systems/${editingSystem.id}/files`, {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        alert(`تم رفع ${result.data.count} ملف بنجاح`)
        setSelectedFiles(null)
        // إعادة تحميل الملفات
        await loadSystemFiles(editingSystem.id)
      } else {
        alert(result.error || 'فشل في رفع الملفات')
      }
    } catch (error) {
      console.error('Error uploading files:', error)
      alert('حدث خطأ في رفع الملفات')
    } finally {
      setUploadingFiles(false)
    }
  }

  return (
    <>
      {/* إحصائيات الأنظمة */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-cogs"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{systems.length}</div>
            <div className="stat-label">إجمالي الأنظمة</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{activeSystems}</div>
            <div className="stat-label">الأنظمة النشطة</div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-tools"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{systemsInMaintenance}</div>
            <div className="stat-label">تحت الصيانة</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
          </div>
          <div className="stat-body">
            <div className="stat-value">{totalUsers.toLocaleString()}</div>
            <div className="stat-label">إجمالي المستخدمين</div>
          </div>
        </div>
      </div>

      {/* شبكة الأنظمة */}
      <div className="data-table-container">
        <div className="data-table-header">
          <h3 className="data-table-title">إدارة الأنظمة</h3>
          <div className="data-table-actions">
            <button className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '10px 20px', marginLeft: '10px' }}>
              <i className="fas fa-sync-alt"></i> تحديث الحالة
            </button>
            <button className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '10px 20px' }}>
              <i className="fas fa-plus"></i> إضافة نظام جديد
            </button>
          </div>
        </div>

        <div style={{ padding: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' }}>
          {systems.map((system) => (
            <div key={system.id} style={{
              background: 'white',
              borderRadius: '15px',
              padding: '25px',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={() => setSelectedSystem(selectedSystem === system.id ? null : system.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.08)'
            }}
            >
              {/* شريط الحالة العلوي */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                height: '4px',
                background: getStatusColor(system.status)
              }}></div>

              {/* رأس البطاقة */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '20px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '15px',
                  background: `${system.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: system.color,
                  fontSize: '1.8rem'
                }}>
                  <i className={system.icon}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    margin: '0 0 8px 0',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: 'var(--secondary-color)'
                  }}>
                    {system.name}
                  </h4>
                  <p style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    color: 'var(--gray-color)',
                    lineHeight: '1.5'
                  }}>
                    {system.description}
                  </p>
                </div>
              </div>

              {/* معلومات النظام */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)', marginBottom: '5px' }}>
                    الحالة
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    background: `${getStatusColor(system.status)}20`,
                    color: getStatusColor(system.status)
                  }}>
                    {getStatusText(system.status)}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)', marginBottom: '5px' }}>
                    الإصدار
                  </div>
                  <div style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>
                    v{system.version}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)', marginBottom: '5px' }}>
                    المستخدمين
                  </div>
                  <div style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>
                    {system.users.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)', marginBottom: '5px' }}>
                    وقت التشغيل
                  </div>
                  <div style={{
                    fontWeight: '600',
                    color: system.uptime === '0%' ? 'var(--danger-color)' : 'var(--success-color)'
                  }}>
                    {system.uptime}
                  </div>
                </div>
              </div>

              {/* تفاصيل إضافية عند التحديد */}
              {selectedSystem === system.id && (
                <div style={{
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '20px',
                  marginTop: '20px'
                }}>
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)', marginBottom: '5px' }}>
                      آخر تحديث
                    </div>
                    <div style={{ fontWeight: '500', color: 'var(--secondary-color)' }}>
                      {system.lastUpdate}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="action-btn view"
                      style={{ flex: 1, padding: '8px 12px' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleShowFiles(system)
                      }}
                    >
                      <i className="fas fa-folder"></i> الملفات
                    </button>
                    <button
                      className="action-btn edit"
                      style={{ flex: 1, padding: '8px 12px' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditSystem(system)
                      }}
                    >
                      <i className="fas fa-edit"></i> تعديل
                    </button>
                    {system.status === 'active' && (
                      <button className="action-btn delete" style={{ padding: '8px 12px' }}>
                        <i className="fas fa-stop"></i>
                      </button>
                    )}
                    {system.status === 'maintenance' && (
                      <button className="action-btn view" style={{ padding: '8px 12px' }}>
                        <i className="fas fa-play"></i>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* نموذج تعديل النظام */}
      {showEditModal && editingSystem && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>تعديل النظام</h3>
              <button
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <EditSystemForm
                system={editingSystem}
                onSave={handleSaveSystem}
                onCancel={() => setShowEditModal(false)}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* نموذج إدارة الملفات */}
      {showFilesModal && editingSystem && (
        <div className="modal-overlay" onClick={() => setShowFilesModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>إدارة ملفات النظام - {editingSystem.name}</h3>
              <button
                className="modal-close"
                onClick={() => setShowFilesModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <FilesManager
                systemId={editingSystem.id}
                files={systemFiles}
                onFileUpload={handleFileUpload}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                uploadingFiles={uploadingFiles}
                onRefresh={() => loadSystemFiles(editingSystem.id)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// مكون نموذج تعديل النظام
function EditSystemForm({ system, onSave, onCancel, isLoading }: any) {
  const [formData, setFormData] = useState({
    name: system.name || '',
    description: system.description || '',
    category: system.category || '',
    version: system.version || '1.0.0',
    icon: system.icon || 'fas fa-cog',
    color: system.color || '#0066cc',
    status: system.status || 'active',
    users: system.users || 0,
    uptime: system.uptime || '99.9%'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...system, ...formData })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            اسم النظام
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            الفئة
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            الإصدار
          </label>
          <input
            type="text"
            value={formData.version}
            onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            الحالة
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          >
            <option value="active">نشط</option>
            <option value="inactive">متوقف</option>
            <option value="maintenance">صيانة</option>
            <option value="updating">يتم التحديث</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            عدد المستخدمين
          </label>
          <input
            type="number"
            value={formData.users}
            onChange={(e) => setFormData(prev => ({ ...prev, users: parseInt(e.target.value) || 0 }))}
            min="0"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            وقت التشغيل
          </label>
          <input
            type="text"
            value={formData.uptime}
            onChange={(e) => setFormData(prev => ({ ...prev, uptime: e.target.value }))}
            placeholder="99.9%"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
          الوصف
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '1rem',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '12px 24px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            background: 'white',
            cursor: 'pointer'
          }}
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            background: 'var(--primary-color)',
            color: 'white',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>
    </form>
  )
}

// مكون إدارة الملفات
function FilesManager({
  systemId,
  files,
  onFileUpload,
  selectedFiles,
  setSelectedFiles,
  uploadingFiles,
  onRefresh
}: any) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files)
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf': return 'fas fa-file-pdf'
      case 'image': return 'fas fa-image'
      case 'video': return 'fas fa-video'
      default: return 'fas fa-file'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const videoFiles = files.filter((f: any) => f.fileType === 'video')
  const imageFiles = files.filter((f: any) => f.fileType === 'image')
  const pdfFiles = files.filter((f: any) => f.fileType === 'pdf')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      {/* قسم رفع الملفات */}
      <div style={{
        border: '2px dashed #ddd',
        borderRadius: '12px',
        padding: '30px',
        textAlign: 'center',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <i className="fas fa-cloud-upload-alt" style={{
            fontSize: '3rem',
            color: 'var(--primary-color)',
            marginBottom: '15px'
          }}></i>
          <h4 style={{ margin: '0 0 10px 0', color: 'var(--secondary-color)' }}>
            رفع ملفات جديدة
          </h4>
          <p style={{ margin: 0, color: 'var(--gray-color)', fontSize: '0.9rem' }}>
            يمكنك رفع ملفات PDF، صور، و 3 فيديوهات كحد أقصى
          </p>
        </div>

        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.mp4,.mpeg,.mov,.avi"
          onChange={handleFileSelect}
          style={{ marginBottom: '15px' }}
        />

        {selectedFiles && selectedFiles.length > 0 && (
          <div style={{ marginBottom: '15px' }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: '500' }}>
              الملفات المحددة ({selectedFiles.length}):
            </p>
            <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
              {Array.from(selectedFiles).map((file: File, index) => (
                <div key={index}>
                  {file.name} ({formatFileSize(file.size)})
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onFileUpload}
          disabled={!selectedFiles || selectedFiles.length === 0 || uploadingFiles}
          style={{
            padding: '12px 30px',
            border: 'none',
            borderRadius: '8px',
            background: (!selectedFiles || selectedFiles.length === 0 || uploadingFiles)
              ? '#ccc' : 'var(--primary-color)',
            color: 'white',
            cursor: (!selectedFiles || selectedFiles.length === 0 || uploadingFiles)
              ? 'not-allowed' : 'pointer',
            fontSize: '1rem'
          }}
        >
          {uploadingFiles ? (
            <>
              <i className="fas fa-spinner fa-spin" style={{ marginLeft: '8px' }}></i>
              جاري الرفع...
            </>
          ) : (
            <>
              <i className="fas fa-upload" style={{ marginLeft: '8px' }}></i>
              رفع الملفات
            </>
          )}
        </button>
      </div>

      {/* عرض الملفات الموجودة */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h4 style={{ margin: 0, color: 'var(--secondary-color)' }}>
            الملفات الموجودة ({files.length})
          </h4>
          <button
            onClick={onRefresh}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            <i className="fas fa-sync-alt"></i> تحديث
          </button>
        </div>

        {files.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: 'var(--gray-color)',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px'
          }}>
            <i className="fas fa-folder-open" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
            <p>لا توجد ملفات مرفوعة بعد</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* الفيديوهات */}
            {videoFiles.length > 0 && (
              <div>
                <h5 style={{
                  margin: '0 0 15px 0',
                  color: 'var(--secondary-color)',
                  borderBottom: '2px solid var(--primary-color)',
                  paddingBottom: '8px'
                }}>
                  <i className="fas fa-video" style={{ marginLeft: '8px' }}></i>
                  الفيديوهات ({videoFiles.length}/3)
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  {videoFiles.map((file: any) => (
                    <div key={file.id} style={{
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '15px',
                      backgroundColor: 'white'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <i className={getFileIcon(file.fileType)} style={{
                          color: 'var(--primary-color)',
                          fontSize: '1.2rem'
                        }}></i>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                            {file.originalName}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>
                            {formatFileSize(file.fileSize)}
                          </div>
                        </div>
                      </div>
                      {file.filePath && (
                        <video
                          controls
                          style={{ width: '100%', height: '120px', borderRadius: '4px' }}
                        >
                          <source src={file.filePath} type={file.mimeType} />
                        </video>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* الصور */}
            {imageFiles.length > 0 && (
              <div>
                <h5 style={{
                  margin: '0 0 15px 0',
                  color: 'var(--secondary-color)',
                  borderBottom: '2px solid var(--success-color)',
                  paddingBottom: '8px'
                }}>
                  <i className="fas fa-image" style={{ marginLeft: '8px' }}></i>
                  الصور ({imageFiles.length})
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                  {imageFiles.map((file: any) => (
                    <div key={file.id} style={{
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '10px',
                      backgroundColor: 'white'
                    }}>
                      {file.filePath && (
                        <img
                          src={file.filePath}
                          alt={file.originalName}
                          style={{
                            width: '100%',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            marginBottom: '8px'
                          }}
                        />
                      )}
                      <div style={{ fontSize: '0.8rem', fontWeight: '500' }}>
                        {file.originalName}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--gray-color)' }}>
                        {formatFileSize(file.fileSize)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ملفات PDF */}
            {pdfFiles.length > 0 && (
              <div>
                <h5 style={{
                  margin: '0 0 15px 0',
                  color: 'var(--secondary-color)',
                  borderBottom: '2px solid var(--danger-color)',
                  paddingBottom: '8px'
                }}>
                  <i className="fas fa-file-pdf" style={{ marginLeft: '8px' }}></i>
                  ملفات PDF ({pdfFiles.length})
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {pdfFiles.map((file: any) => (
                    <div key={file.id} style={{
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '15px',
                      backgroundColor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px'
                    }}>
                      <i className={getFileIcon(file.fileType)} style={{
                        color: 'var(--danger-color)',
                        fontSize: '2rem'
                      }}></i>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '500', marginBottom: '5px' }}>
                          {file.originalName}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>
                          {formatFileSize(file.fileSize)} • {new Date(file.createdAt).toLocaleDateString('ar-SA')}
                        </div>
                      </div>
                      {file.filePath && (
                        <a
                          href={file.filePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '8px 16px',
                            border: '1px solid var(--primary-color)',
                            borderRadius: '6px',
                            color: 'var(--primary-color)',
                            textDecoration: 'none',
                            fontSize: '0.9rem'
                          }}
                        >
                          <i className="fas fa-external-link-alt" style={{ marginLeft: '5px' }}></i>
                          فتح
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// إضافة CSS للنماذج المنبثقة
const modalStyles = `
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  .modal-content.large {
    max-width: 900px;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 25px;
    border-bottom: 1px solid #eee;
  }

  .modal-header h3 {
    margin: 0;
    color: var(--secondary-color);
    font-size: 1.3rem;
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--gray-color);
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-close:hover {
    background: #f5f5f5;
    color: var(--secondary-color);
  }

  .modal-body {
    padding: 25px;
  }

  input[type="file"] {
    padding: 10px;
    border: 2px dashed #ddd;
    border-radius: 8px;
    background: white;
    width: 100%;
    cursor: pointer;
  }

  input[type="file"]:hover {
    border-color: var(--primary-color);
  }

  @media (max-width: 768px) {
    .modal-content {
      margin: 10px;
      max-width: calc(100vw - 20px);
    }

    .modal-header {
      padding: 15px 20px;
    }

    .modal-body {
      padding: 20px;
    }
  }
`

// إضافة CSS للصفحة
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.textContent = modalStyles
  document.head.appendChild(styleElement)
}