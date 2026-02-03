import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const site = await prisma.site.update({
      where: { id },
      data: body,
      include: {
        pages: {
          include: { sections: true },
          orderBy: { order: 'asc' },
        },
        siteTheme: true,
        publishState: true,
        media: true,
      },
    })

    return NextResponse.json({ site })
  } catch (error) {
    console.error('Error updating site:', error)
    return NextResponse.json(
      { error: 'Failed to update site' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const site = await prisma.site.findUnique({
      where: { id },
      include: {
        pages: {
          include: { sections: true },
          orderBy: { order: 'asc' },
        },
        siteTheme: true,
        publishState: true,
        media: true,
      },
    })

    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ site })
  } catch (error) {
    console.error('Error fetching site:', error)
    return NextResponse.json(
      { error: 'Failed to fetch site' },
      { status: 500 }
    )
  }
}
