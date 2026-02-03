import { SiteTheme } from '@prisma/client'
import { ComputedTheme } from '@/lib/types'
import { getThemePreset, getDefaultTheme, ThemePreset } from './presets'

/**
 * Calcule le thème à appliquer en fonction du preset et des personnalisations
 */
export function computeTheme(
  themeFamily: string,
  siteTheme: SiteTheme | null
): ComputedTheme {
  const preset = getThemePreset(themeFamily) || getDefaultTheme()

  // Si pas de personnalisation, utilise le preset tel quel
  if (!siteTheme) {
    return {
      name: preset.name,
      family: preset.id,
      colors: preset.colors,
      fonts: preset.fonts,
      borderRadius: preset.borderRadius,
      buttonStyle: preset.buttonStyle,
    }
  }

  // Sinon, merge les personnalisations
  return {
    name: 'Personnalisé',
    family: themeFamily,
    colors: {
      primary: siteTheme.primaryColor,
      secondary: siteTheme.secondaryColor,
      accent: siteTheme.accentColor,
      background: siteTheme.backgroundColor,
      text: siteTheme.textColor,
      muted: '#6C757D',
    },
    fonts: {
      heading: `${siteTheme.headingFont}, system-ui, sans-serif`,
      body: `${siteTheme.bodyFont}, system-ui, sans-serif`,
    },
    borderRadius: siteTheme.borderRadius,
    buttonStyle: siteTheme.buttonStyle as 'rounded' | 'square' | 'pill',
  }
}

/**
 * Génère les CSS custom properties pour un thème
 */
export function generateThemeStyles(theme: ComputedTheme): React.CSSProperties {
  return {
    '--theme-primary': theme.colors.primary,
    '--theme-secondary': theme.colors.secondary,
    '--theme-accent': theme.colors.accent,
    '--theme-background': theme.colors.background,
    '--theme-text': theme.colors.text,
    '--theme-muted': theme.colors.muted,
    '--theme-heading-font': theme.fonts.heading,
    '--theme-body-font': theme.fonts.body,
    '--theme-border-radius': theme.borderRadius,
  } as React.CSSProperties
}

export { themePresets, getThemePreset, getDefaultTheme } from './presets'
export type { ThemePreset }
