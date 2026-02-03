import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashToken } from '@/lib/token'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    const tokenHash = hashToken(token)

    const editToken = await prisma.editToken.findFirst({
      where: { tokenHash },
      include: {
        site: {
          include: {
            pages: {
              include: {
                sections: true,
              },
              orderBy: { order: 'asc' },
            },
            siteTheme: true,
            publishState: true,
            media: true,
          },
        },
      },
    })

    if (!editToken) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      )
    }

    // Update last used
    await prisma.editToken.update({
      where: { id: editToken.id },
      data: { lastUsedAt: new Date() },
    })

    return NextResponse.json({ site: editToken.site })
  } catch (error) {
    console.error('Error fetching site by token:', error)
    return NextResponse.json(
      { error: 'Failed to fetch site' },
      { status: 500 }
    )
  }
}
