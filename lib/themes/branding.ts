import { ComputedTheme } from '@/lib/types'
import { getThemePreset } from './presets'

export type ThemeBranding = {
  headerBg: string
  headerText: string
  /** Fond de la section hero (lié au thème) */
  heroBg: string
  footerBg: string
  footerText: string
  heroCtaBg: string
  heroCtaText: string
}

/**
 * Couleurs header / hero / footer dérivées du thème (preset).
 * Hero et footer utilisent les couleurs du thème choisi à l'onboarding.
 */
export function getThemeBranding(themeFamily: string, theme: ComputedTheme): ThemeBranding {
  const preset = getThemePreset(themeFamily)
  const headerBg = theme.colors.primary
  const headerText = preset?.headerStyle?.textColor || '#FFFFFF'

  const siteBackground = preset?.colors?.background ?? theme.colors.background

  const isLight = (color: string) => {
    const hex = color.replace('#', '')
    if (hex.length !== 6) return true
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 160
  }

  const baseDark = preset?.colors?.primary ?? theme.colors.primary
  const baseLight = preset?.colors?.secondary ?? '#FFFFFF'
  const heroFooterColor = isLight(siteBackground) ? baseDark : baseLight

  const heroBg = heroFooterColor
  const footerBg = heroFooterColor
  const footerText = '#FFFFFF'
  const heroCtaBg = preset?.colors?.accent ?? theme.colors.accent
  const heroCtaText = theme.colors.primary

  return {
    headerBg,
    headerText,
    heroBg,
    footerBg,
    footerText,
    heroCtaBg,
    heroCtaText,
  }
}
