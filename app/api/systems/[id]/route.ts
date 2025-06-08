import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/database'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف النظام مطلوب' },
        { status: 400 }
      )
    }

    const system = await prisma.system.findUnique({
      where: { id },
      select: { name: true, category: true }
    })

    if (!system) {
      return NextResponse.json(
        { success: false, error: 'النظام غير موجود' },
        { status: 404 }
      )
    }

    // Check if system has quote requests
    const hasRequests = await prisma.quoteRequest.findFirst({
      where: { systemId: id }
    })

    if (hasRequests) {
      return NextResponse.json(
        { success: false, error: 'لا يمكن حذف النظام لأنه مرتبط بطلبات عروض أسعار' },
        { status: 400 }
      )
    }

    await prisma.system.delete({
      where: { id }
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'delete_system',
        entityType: 'system',
        entityId: id,
        details: JSON.stringify({
          name: system.name,
          category: system.category
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف النظام بنجاح'
    })
  } catch (error) {
    console.error('Error deleting system:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في حذف النظام' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف النظام مطلوب' },
        { status: 400 }
      )
    }

    const system = await prisma.system.update({
      where: { id },
      data: body
    })

    return NextResponse.json({
      success: true,
      data: system,
      message: 'تم تحديث النظام بنجاح'
    })
  } catch (error) {
    console.error('Error updating system:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث النظام' },
      { status: 500 }
    )
  }
}
