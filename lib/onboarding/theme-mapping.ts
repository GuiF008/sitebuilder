/**
 * Mapping des préférences visuelles (étape 3) vers un themeFamily existant.
 * S'appuie uniquement sur les thèmes définis dans lib/themes/presets.ts.
 */

import { themePresets } from '@/lib/themes/presets'
import type { ThemePreset } from '@/lib/themes/presets'
import type { VisualUniverse, ColorMood, TypographyStyle } from './types'

/** Score de correspondance thème vs préférences (plus c'est haut, mieux c'est) */
function scorePreset(
  preset: ThemePreset,
  visualStyle: VisualUniverse,
  colorMood: ColorMood,
  typographyStyle: TypographyStyle
): number {
  let score = 0

  // Mapping univers visuel → category preset
  const styleToCategory: Record<VisualUniverse, string[]> = {
    moderne: ['professional', 'bold'],
    elegant: ['professional', 'creative'],
    minimaliste: ['minimal', 'professional'],
    chaleureux: ['professional', 'creative'],
    creatif: ['creative', 'bold'],
    professionnel: ['professional'],
  }
  const preferredCategories = styleToCategory[visualStyle] || []
  if (preferredCategories.includes(preset.category)) score += 3

  // Couleur dominante du preset vs ambiance
  const primary = preset.colors.primary.toLowerCase()
  if (colorMood === 'bleu_confiance' && (primary.includes('0e9c') || primary.includes('4c81') || primary.includes('1e3a') || primary.includes('0891'))) score += 2
  if (colorMood === 'noir_premium' && (primary.includes('1b1b') || primary.includes('1f1f') || primary.includes('111'))) score += 2
  if (colorMood === 'beige_naturel' && (primary.includes('8b45') || primary.includes('a052'))) score += 2
  if (colorMood === 'vert_apaisant' && primary.includes('059669')) score += 2
  if (colorMood === 'vif_dynamique' && (primary.includes('7c3a') || primary.includes('4f46') || primary.includes('a85'))) score += 2

  // Typo
  const fontHeading = (preset.fonts.heading || '').toLowerCase()
  if (typographyStyle === 'moderne' && (fontHeading.includes('space') || fontHeading.includes('inter') || fontHeading.includes('source'))) score += 1
  if (typographyStyle === 'elegante' && (fontHeading.includes('georgia') || fontHeading.includes('playfair'))) score += 1
  if (typographyStyle === 'creative' && (fontHeading.includes('poppins') || fontHeading.includes('space'))) score += 1
  if (typographyStyle === 'classique' && (fontHeading.includes('georgia') || fontHeading.includes('source'))) score += 1

  return score
}

/**
 * Retourne le thème le plus cohérent avec les préférences utilisateur.
 */
export function resolveThemeFromPreferences(
  visualStyle: VisualUniverse,
  colorMood: ColorMood,
  typographyStyle: TypographyStyle
): string {
  let best: ThemePreset = themePresets[0]
  let bestScore = -1

  for (const preset of themePresets) {
    const s = scorePreset(preset, visualStyle, colorMood, typographyStyle)
    if (s > bestScore) {
      bestScore = s
      best = preset
    }
  }
  return best.id
}
