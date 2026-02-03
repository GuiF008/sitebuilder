import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { updates } = body // Array of { id, order }

    // Update all pages in a transaction
    await prisma.$transaction(
      updates.map((update: { id: string; order: number }) =>
        prisma.page.update({
          where: { id: update.id },
          data: { order: update.order },
        })
      )
    )

    // Return updated pages
    const pages = await prisma.page.findMany({
      where: { siteId: id },
      include: { sections: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ pages })
  } catch (error) {
    console.error('Error reordering pages:', error)
    return NextResponse.json(
      { error: 'Failed to reorder pages' },
      { status: 500 }
    )
  }
}
