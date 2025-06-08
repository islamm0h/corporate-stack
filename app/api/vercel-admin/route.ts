import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting Vercel Postgres admin creation...')

    // Check for Vercel Postgres URL
    const postgresUrl = process.env.POSTGRES_URL
    
    if (!postgresUrl) {
      return NextResponse.json({
        success: false,
        error: 'لا يوجد رابط قاعدة بيانات Vercel Postgres',
        details: 'POSTGRES_URL environment variable not found',
        suggestion: 'تأكد من إعداد قاعدة بيانات Vercel Postgres'
      }, { status: 500 })
    }

    console.log('Vercel Postgres URL found, connecting...')

    // Import Vercel Postgres
    const { sql } = await import('@vercel/postgres')

    // Create password hash
    const password = 'admin123'
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log('Password hashed successfully')

    // Delete all existing users
    console.log('Deleting all existing users...')
    const deleteResult = await sql`DELETE FROM users`
    console.log(`Deleted ${deleteResult.rowCount} users`)

    // Insert new admin user
    console.log('Creating new admin user...')
    const insertResult = await sql`
      INSERT INTO users (
        id,
        username, 
        email, 
        password_hash, 
        first_name, 
        last_name, 
        role, 
        is_active, 
        must_change_password, 
        created_at, 
        updated_at
      ) VALUES (
        gen_random_uuid(),
        'admin',
        'admin@corporatestack.com',
        ${hashedPassword},
        'مدير',
        'النظام',
        'admin',
        true,
        false,
        NOW(),
        NOW()
      ) RETURNING *
    `

    const adminUser = insertResult.rows[0]
    console.log('Admin user created successfully:', adminUser.id)

    // Verify creation
    const verifyResult = await sql`
      SELECT id, username, email, first_name, last_name, role, is_active, created_at
      FROM users 
      WHERE username = 'admin'
    `

    const countResult = await sql`SELECT COUNT(*) as count FROM users`
    const totalUsers = parseInt(countResult.rows[0].count)

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء المدير في قاعدة بيانات Vercel بنجاح',
      admin: verifyResult.rows[0],
      verification: {
        userExists: verifyResult.rows.length > 0,
        totalUsers: totalUsers,
        adminId: verifyResult.rows[0]?.id
      },
      credentials: {
        username: 'admin',
        password: 'admin123',
        note: 'استخدم هذه البيانات لتسجيل الدخول'
      },
      database: 'Vercel Postgres'
    })

  } catch (error) {
    console.error('Vercel Postgres admin creation error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'فشل في إنشاء المدير في قاعدة بيانات Vercel',
      details: error.message,
      errorType: error.constructor.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const postgresUrl = process.env.POSTGRES_URL
    
    if (!postgresUrl) {
      return NextResponse.json({
        success: false,
        error: 'لا يوجد رابط قاعدة بيانات Vercel Postgres',
        databaseConnected: false
      }, { status: 500 })
    }

    const { sql } = await import('@vercel/postgres')

    // Get user count
    const countResult = await sql`SELECT COUNT(*) as count FROM users`
    const totalUsers = parseInt(countResult.rows[0].count)

    // Get admin user
    const adminResult = await sql`
      SELECT id, username, email, first_name, last_name, role, is_active, created_at
      FROM users 
      WHERE username = 'admin'
    `

    // Get all users
    const allUsersResult = await sql`
      SELECT id, username, email, role, is_active, created_at
      FROM users
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: totalUsers,
        adminExists: adminResult.rows.length > 0,
        adminUser: adminResult.rows[0] || null,
        allUsers: allUsersResult.rows,
        databaseConnected: true,
        database: 'Vercel Postgres'
      }
    })

  } catch (error) {
    console.error('Error checking Vercel Postgres:', error)
    return NextResponse.json({
      success: false,
      error: 'فشل في الاتصال بقاعدة بيانات Vercel',
      details: error.message,
      databaseConnected: false
    }, { status: 500 })
  }
}
