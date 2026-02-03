import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const theme = await prisma.siteTheme.findUnique({
      where: { siteId: id },
    })

    return NextResponse.json({ theme })
  } catch (error) {
    console.error('Error fetching theme:', error)
    return NextResponse.json(
      { error: 'Failed to fetch theme' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Extract themeFamily if present (goes to Site)
    const { themeFamily, ...themeUpdates } = body

    // Update theme family on site if provided
    if (themeFamily) {
      await prisma.site.update({
        where: { id },
        data: { themeFamily },
      })
    }

    // Update or create site theme
    const theme = await prisma.siteTheme.upsert({
      where: { siteId: id },
      update: themeUpdates,
      create: {
        siteId: id,
        ...themeUpdates,
      },
    })

    return NextResponse.json({ theme })
  } catch (error) {
    console.error('Error updating theme:', error)
    return NextResponse.json(
      { error: 'Failed to update theme' },
      { status: 500 }
    )
  }
}
