import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken, hashToken, generateSlug } from '@/lib/token'
import { generateStarterSections } from '@/lib/starter'
import { getThemePreset, getDefaultTheme } from '@/lib/themes/presets'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, contactEmail, goal, themeFamily, sections, needs } = body

    // Generate unique slug and token
    const slug = generateSlug(name)
    const token = generateToken()
    const tokenHash = hashToken(token)

    // Get theme preset
    const preset = getThemePreset(themeFamily) || getDefaultTheme()

    // Create site with all related data
    const site = await prisma.site.create({
      data: {
        name,
        slug,
        contactEmail,
        goal,
        themeFamily,
        editToken: {
          create: {
            tokenHash,
          },
        },
        siteTheme: {
          create: {
            primaryColor: preset.colors.primary,
            secondaryColor: preset.colors.secondary,
            accentColor: preset.colors.accent,
            backgroundColor: preset.colors.background,
            textColor: preset.colors.text,
            headingFont: preset.fonts.heading,
            bodyFont: preset.fonts.body,
            borderRadius: preset.borderRadius,
            buttonStyle: preset.buttonStyle,
          },
        },
        publishState: {
          create: {
            isPublished: false,
          },
        },
        pages: {
          create: {
            title: 'Accueil',
            slug: 'accueil',
            order: 0,
            isHome: true,
            showInMenu: true,
            sections: {
              create: generateStarterSections(name, themeFamily, sections),
            },
          },
        },
      },
      include: {
        pages: {
          include: {
            sections: true,
          },
        },
        editToken: true,
        siteTheme: true,
        publishState: true,
        media: true,
      },
    })

    return NextResponse.json({
      site,
      token, // Return plain token to user (only time it's shown)
      editUrl: `/edit/${token}`,
    })
  } catch (error) {
    console.error('Error creating site:', error)
    return NextResponse.json(
      { error: 'Failed to create site' },
      { status: 500 }
    )
  }
}
