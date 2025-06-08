'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CreateTablesPage() {
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [tablesStatus, setTablesStatus] = useState<any>(null)
  const [createResult, setCreateResult] = useState<any>(null)

  useEffect(() => {
    checkTables()
  }, [])

  const checkTables = async () => {
    setChecking(true)
    try {
      const response = await fetch('/api/create-tables')
      const data = await response.json()
      setTablesStatus(data)
    } catch (error) {
      console.error('Error checking tables:', error)
    } finally {
      setChecking(false)
    }
  }

  const createTables = async () => {
    setLoading(true)
    setCreateResult(null)

    try {
      const response = await fetch('/api/create-tables', {
        method: 'POST'
      })

      const data = await response.json()
      setCreateResult(data)
      
      if (data.success) {
        await checkTables()
      }
    } catch (error) {
      console.error('Error creating tables:', error)
      setCreateResult({
        success: false,
        error: 'حدث خطأ في إنشاء الجداول'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '700px',
        width: '100%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 30px',
          fontSize: '2rem',
          color: 'white'
        }}>
          <i className="fas fa-table"></i>
        </div>

        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '15px',
          color: '#7c3aed'
        }}>
          إنشاء الجداول
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          إنشاء جداول قاعدة البيانات المطلوبة للنظام
        </p>

        {checking ? (
          <div style={{
            background: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <i className="fas fa-spinner fa-spin" style={{ marginLeft: '10px' }}></i>
            جاري فحص الجداول الموجودة...
          </div>
        ) : tablesStatus && (
          <div style={{
            background: tablesStatus.all_tables_exist ? '#f0fdf4' : '#fef3f2',
            border: `1px solid ${tablesStatus.all_tables_exist ? '#bbf7d0' : '#fecaca'}`,
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '30px',
            textAlign: 'right'
          }}>
            <h3 style={{
              margin: '0 0 15px 0',
              color: tablesStatus.all_tables_exist ? '#16a34a' : '#dc2626',
              textAlign: 'center'
            }}>
              حالة الجداول
            </h3>
            
            <p style={{ margin: '5px 0' }}>
              <strong>الجداول الموجودة:</strong> {tablesStatus.tables_count || 0} من 5
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>الحالة:</strong> {tablesStatus.all_tables_exist ? '✅ جميع الجداول موجودة' : '❌ جداول مفقودة'}
            </p>

            {tablesStatus.tables_found && tablesStatus.tables_found.length > 0 && (
              <div style={{
                background: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '15px',
                marginTop: '15px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                  الجداول الموجودة:
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {tablesStatus.tables_found.map((table: any, index: number) => (
                    <span key={index} style={{
                      background: '#d4edda',
                      color: '#155724',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.9rem'
                    }}>
                      {table.table_name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!tablesStatus?.all_tables_exist && (
          <button
            onClick={createTables}
            disabled={loading}
            style={{
              background: loading ? '#ccc' : 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '20px',
              width: '100%',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin" style={{ marginLeft: '10px' }}></i>
                جاري إنشاء الجداول...
              </>
            ) : (
              <>
                <i className="fas fa-plus-circle" style={{ marginLeft: '10px' }}></i>
                إنشاء جداول قاعدة البيانات
              </>
            )}
          </button>
        )}

        {createResult && (
          <div style={{
            background: createResult.success ? '#d4edda' : '#f8d7da',
            border: `1px solid ${createResult.success ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'right'
          }}>
            <h3 style={{
              margin: '0 0 15px 0',
              color: createResult.success ? '#155724' : '#721c24'
            }}>
              {createResult.success ? 'نجح إنشاء الجداول!' : 'فشل إنشاء الجداول'}
            </h3>
            
            <p style={{ margin: '0 0 10px 0' }}>
              {createResult.message || createResult.error}
            </p>

            {createResult.success && createResult.tables_created && (
              <div style={{
                background: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '15px',
                marginTop: '15px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                  الجداول المُنشأة:
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {createResult.tables_created.map((table: string, index: number) => (
                    <span key={index} style={{
                      background: '#d4edda',
                      color: '#155724',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.9rem'
                    }}>
                      {table}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {createResult.success && createResult.credentials && (
              <div style={{
                background: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '8px',
                padding: '15px',
                marginTop: '15px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>
                  <i className="fas fa-key" style={{ marginLeft: '8px' }}></i>
                  بيانات تسجيل الدخول
                </h4>
                <p style={{ margin: '5px 0', fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  <strong>اسم المستخدم:</strong> {createResult.credentials.username}
                </p>
                <p style={{ margin: '5px 0', fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  <strong>كلمة المرور:</strong> {createResult.credentials.password}
                </p>
                <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', color: '#856404' }}>
                  {createResult.credentials.note}
                </p>
              </div>
            )}

            {createResult.success && createResult.statistics && (
              <div style={{
                background: '#e7f3ff',
                border: '1px solid #b3d9ff',
                borderRadius: '8px',
                padding: '15px',
                marginTop: '15px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#0066cc' }}>
                  الإحصائيات:
                </h4>
                <p style={{ margin: '5px 0' }}>
                  <strong>المستخدمون:</strong> {createResult.statistics.users}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>الأنظمة:</strong> {createResult.statistics.systems}
                </p>
              </div>
            )}
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link
            href="/login"
            style={{
              background: '#28a745',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            <i className="fas fa-sign-in-alt" style={{ marginLeft: '8px' }}></i>
            تسجيل الدخول
          </Link>

          <button
            onClick={checkTables}
            style={{
              background: '#17a2b8',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <i className="fas fa-sync-alt" style={{ marginLeft: '8px' }}></i>
            فحص الجداول
          </button>

          <Link
            href="/database-status"
            style={{
              background: '#6f42c1',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            <i className="fas fa-database" style={{ marginLeft: '8px' }}></i>
            حالة قاعدة البيانات
          </Link>
        </div>
      </div>
    </div>
  )
}
