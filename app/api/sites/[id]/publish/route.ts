import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get full site data
    const site = await prisma.site.findUnique({
      where: { id },
      include: {
        pages: {
          include: { sections: true },
          orderBy: { order: 'asc' },
        },
        siteTheme: true,
      },
    })

    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      )
    }

    // Create snapshot
    const snapshot = {
      name: site.name,
      themeFamily: site.themeFamily,
      siteTheme: site.siteTheme,
      pages: site.pages.map((page) => ({
        id: page.id,
        title: page.title,
        slug: page.slug,
        order: page.order,
        isHome: page.isHome,
        showInMenu: page.showInMenu,
        sections: page.sections.map((section) => ({
          id: section.id,
          type: section.type,
          dataJson: section.dataJson,
          order: section.order,
        })),
      })),
    }

    // Update or create publish state
    const publishState = await prisma.publishState.upsert({
      where: { siteId: id },
      update: {
        isPublished: true,
        publishedAt: new Date(),
        snapshotJson: JSON.stringify(snapshot),
      },
      create: {
        siteId: id,
        isPublished: true,
        publishedAt: new Date(),
        snapshotJson: JSON.stringify(snapshot),
      },
    })

    return NextResponse.json({ 
      publishState,
      publicUrl: `/s/${site.slug}`,
    })
  } catch (error) {
    console.error('Error publishing site:', error)
    return NextResponse.json(
      { error: 'Failed to publish site' },
      { status: 500 }
    )
  }
}
