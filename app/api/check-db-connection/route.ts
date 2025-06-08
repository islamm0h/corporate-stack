import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Checking database connection...')

    // Check environment variables
    const envVars = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
      POSTGRES_URL_NON_POOLING: !!process.env.POSTGRES_URL_NON_POOLING,
      NODE_ENV: process.env.NODE_ENV
    }

    console.log('Environment variables:', envVars)

    let connectionResults = {
      prisma: { success: false, error: null, userCount: 0 },
      vercelPostgres: { success: false, error: null, available: false }
    }

    // Test Prisma connection
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      
      await prisma.$connect()
      const userCount = await prisma.user.count()
      
      connectionResults.prisma = {
        success: true,
        error: null,
        userCount: userCount
      }
      
      await prisma.$disconnect()
      console.log('Prisma connection successful, users:', userCount)
    } catch (prismaError) {
      console.error('Prisma connection failed:', prismaError)
      connectionResults.prisma = {
        success: false,
        error: prismaError.message,
        userCount: 0
      }
    }

    // Test Vercel Postgres connection
    try {
      const { sql } = await import('@vercel/postgres')
      
      // Simple test query
      const result = await sql`SELECT 1 as test`
      
      connectionResults.vercelPostgres = {
        success: true,
        error: null,
        available: true
      }
      
      console.log('Vercel Postgres connection successful')
    } catch (vercelError) {
      console.error('Vercel Postgres connection failed:', vercelError)
      connectionResults.vercelPostgres = {
        success: false,
        error: vercelError.message,
        available: false
      }
    }

    return NextResponse.json({
      success: true,
      environment: envVars,
      connections: connectionResults,
      recommendations: {
        primaryDatabase: connectionResults.prisma.success ? 'Prisma' : 
                        connectionResults.vercelPostgres.success ? 'Vercel Postgres' : 'None',
        needsSetup: !connectionResults.prisma.success && !connectionResults.vercelPostgres.success,
        hasUsers: connectionResults.prisma.userCount > 0
      }
    })

  } catch (error) {
    console.error('Database check error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      details: 'فشل في فحص اتصال قاعدة البيانات'
    }, { status: 500 })
  }
}
