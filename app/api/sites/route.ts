import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken, hashToken, generateSlug } from '@/lib/token'
import { generateStarterSections } from '@/lib/starter'
import { getThemePreset, getDefaultTheme } from '@/lib/themes/presets'
import { apiHandler, ApiError, validateBody } from '@/lib/api-helpers'
import { createSiteSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  return apiHandler(async () => {
    let body
    try {
      body = await request.json()
    } catch (error) {
      throw new ApiError(400, 'Body JSON invalide')
    }

    const validated = validateBody(
      body,
      createSiteSchema
    )
    
    const { 
      name, 
      contactEmail, 
      goal, 
      themeFamily, 
      sections = [], 
      needs = [] 
    } = validated

    // Generate unique slug and token
    const slug = generateSlug(name)
    const token = generateToken()
    const tokenHash = hashToken(token)

    // Get theme preset avec vérification
    const preset = getThemePreset(themeFamily) || getDefaultTheme()
    
    if (!preset) {
      throw new ApiError(400, `Thème "${themeFamily}" non trouvé`)
    }

    // Générer les sections starter avec gestion d'erreur
    let starterSections
    try {
      starterSections = generateStarterSections(name, themeFamily, sections)
    } catch (error) {
      console.error('Erreur lors de la génération des sections:', error)
      throw new ApiError(500, 'Erreur lors de la génération du contenu initial')
    }

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
              create: starterSections,
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

    return {
      site,
      token, // Return plain token to user (only time it's shown)
      editUrl: `/edit/${token}`,
    }
  })
}
