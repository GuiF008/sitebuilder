import { ComputedTheme } from '@/lib/types'
import { getThemePreset } from './presets'

type ThemeBranding = {
  headerBg: string
  headerText: string
  footerBg: string
  footerText: string
  heroCtaBg: string
  heroCtaText: string
}

/**
 * Variante thématique header/footer pour chaque template.
 * Permet d'ajuster la cohérence visuelle thème par thème.
 */
export function getThemeBranding(themeFamily: string, theme: ComputedTheme): ThemeBranding {
  const preset = getThemePreset(themeFamily)
  const headerBg = preset?.headerStyle?.backgroundColor || theme.colors.primary
  const headerText = preset?.headerStyle?.textColor || '#FFFFFF'

  const byTheme: Record<string, { footerBg: string; footerText: string; heroCtaBg: string; heroCtaText: string }> = {
    'ovh-modern': { footerBg: '#00167A', footerText: '#FFFFFF', heroCtaBg: '#00D4AA', heroCtaText: '#00167A' },
    'classic-elegant': { footerBg: '#2A4A70', footerText: '#FFFFFF', heroCtaBg: '#98C1D9', heroCtaText: '#1E3A5F' },
    'creative-bold': { footerBg: '#9333EA', footerText: '#FFFFFF', heroCtaBg: '#F472B6', heroCtaText: '#4A1D96' },
    'pro-business': { footerBg: '#111827', footerText: '#FFFFFF', heroCtaBg: '#3B82F6', heroCtaText: '#FFFFFF' },
    'nature-zen': { footerBg: '#047857', footerText: '#FFFFFF', heroCtaBg: '#F59E0B', heroCtaText: '#1F2937' },
    'tech-moderne': { footerBg: '#111827', footerText: '#E2E8F0', heroCtaBg: '#8B5CF6', heroCtaText: '#FFFFFF' },
    'artisan-chic': { footerBg: '#6B3F24', footerText: '#FFF8EE', heroCtaBg: '#E7B36A', heroCtaText: '#4A2A14' },
    'minimal-light': { footerBg: '#F3F4F6', footerText: '#111827', heroCtaBg: '#111827', heroCtaText: '#FFFFFF' },
    'agency-neon': { footerBg: '#0B1020', footerText: '#E2E8F0', heroCtaBg: '#22D3EE', heroCtaText: '#0B1020' },
    'restaurant-sun': { footerBg: '#92400E', footerText: '#FFF7ED', heroCtaBg: '#F59E0B', heroCtaText: '#3F2A14' },
  }

  const footerVariant = byTheme[themeFamily] || {
    footerBg: preset?.colors.secondary || theme.colors.secondary,
    footerText: '#FFFFFF',
    heroCtaBg: preset?.colors.accent || theme.colors.accent,
    heroCtaText: '#FFFFFF',
  }

  return {
    headerBg,
    headerText,
    footerBg: footerVariant.footerBg,
    footerText: footerVariant.footerText,
    heroCtaBg: footerVariant.heroCtaBg,
    heroCtaText: footerVariant.heroCtaText,
  }
}
