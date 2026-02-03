import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/token'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const pages = await prisma.page.findMany({
      where: { siteId: id },
      include: { sections: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ pages })
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title } = body

    // Get max order
    const maxOrder = await prisma.page.aggregate({
      where: { siteId: id },
      _max: { order: true },
    })

    // Generate unique slug for this site
    const baseSlug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50)

    // Check if slug exists for this site
    let slug = baseSlug
    let counter = 1
    while (true) {
      const existing = await prisma.page.findFirst({
        where: { siteId: id, slug },
      })
      if (!existing) break
      slug = `${baseSlug}-${counter++}`
    }

    const page = await prisma.page.create({
      data: {
        siteId: id,
        title,
        slug,
        order: (maxOrder._max.order || 0) + 1,
        isHome: false,
        showInMenu: true,
      },
      include: { sections: true },
    })

    return NextResponse.json({ page })
  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    )
  }
}
