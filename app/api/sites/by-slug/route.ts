import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      )
    }

    const site = await prisma.site.findUnique({
      where: { slug },
      include: {
        publishState: true,
        siteTheme: true,
      },
    })

    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      )
    }

    if (!site.publishState?.isPublished) {
      return NextResponse.json(
        { error: 'Site not published' },
        { status: 404 }
      )
    }

    // Return snapshot data for public site
    return NextResponse.json({
      site: {
        name: site.name,
        slug: site.slug,
        themeFamily: site.themeFamily,
        isPremium: site.isPremium,
        siteTheme: site.siteTheme,
      },
      snapshot: site.publishState.snapshotJson
        ? JSON.parse(site.publishState.snapshotJson)
        : null,
    })
  } catch (error) {
    console.error('Error fetching site by slug:', error)
    return NextResponse.json(
      { error: 'Failed to fetch site' },
      { status: 500 }
    )
  }
}
