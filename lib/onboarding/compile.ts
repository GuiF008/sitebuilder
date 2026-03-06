/**
 * Compilation des réponses onboarding en paramètres pour l'API de création de site.
 * Produit un payload prêt pour POST /api/sites.
 */

import { getSuggestedSections } from '@/lib/starter'
import { resolveThemeFromPreferences } from './theme-mapping'
import type { OnboardingAnswers, CompiledOnboardingPayload, ThemeGoal } from './types'
import { CONTENT_NEED_TO_SECTION } from './types'

const DEFAULT_SITE_NAME = 'Mon site'
const ONBOARDING_PLACEHOLDER_EMAIL = 'contact@site.local'

/**
 * Dérive un nom de site court à partir de l'intention (optionnel).
 */
function deriveSiteName(rawIntent: string): string {
  const t = rawIntent.trim()
  if (!t) return DEFAULT_SITE_NAME
  // Prendre les ~3 premiers mots max, capitaliser
  const words = t.split(/\s+/).slice(0, 3)
  if (words.length === 0) return DEFAULT_SITE_NAME
  const name = words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
  return name.length > 50 ? name.slice(0, 47) + '…' : name
}

/**
 * Construit la liste des sections pour la page d'accueil à partir des réponses.
 * Union des sections déduites de l'étape 2 (contenus sélectionnés) et des sections
 * recommandées pour le goal (étape 1), sans doublon, avec ordre cohérent.
 */
function buildSectionsList(answers: OnboardingAnswers): string[] {
  const order = ['hero', 'about', 'services', 'gallery', 'testimonials', 'hours', 'contact', 'footer']
  const fromStep2 = answers.step2?.inferredSections ?? []
  const goal = answers.step1?.inferredSiteType ?? 'vitrine'
  const fromGoal = getSuggestedSections(goal)
  const combined = new Set<string>(['hero', ...fromStep2, ...fromGoal, 'footer'])
  return order.filter((s) => combined.has(s))
}

/**
 * Compile les réponses onboarding en payload pour POST /api/sites.
 */
export function compileOnboardingToPayload(answers: OnboardingAnswers): CompiledOnboardingPayload {
  const step1 = answers.step1
  const step2 = answers.step2
  const step3 = answers.step3

  const goal: ThemeGoal = step1?.inferredSiteType ?? 'vitrine'
  const rawIntent = step1?.rawIntent ?? ''

  let sections: string[] = []
  if (step2?.selectedContentNeeds?.length) {
    const fromNeeds = new Set<string>()
    for (const needId of step2.selectedContentNeeds) {
      const section = CONTENT_NEED_TO_SECTION[needId]
      if (section) fromNeeds.add(section)
    }
    const order = ['hero', 'about', 'services', 'gallery', 'testimonials', 'hours', 'contact', 'footer']
    sections = order.filter((s) => fromNeeds.has(s) || s === 'hero' || s === 'footer')
  }
  if (sections.length <= 2) {
    sections = buildSectionsList(answers)
  }

  const visualStyle = step3?.visualStyle ?? 'professionnel'
  const colorMood = step3?.colorMood ?? 'bleu_confiance'
  const typographyStyle = step3?.typographyStyle ?? 'moderne'
  const themeFamily = resolveThemeFromPreferences(visualStyle, colorMood, typographyStyle)

  const name = answers.siteName?.trim() || deriveSiteName(rawIntent)

  return {
    name,
    contactEmail: ONBOARDING_PLACEHOLDER_EMAIL,
    goal,
    themeFamily,
    sections,
    needs: step2?.selectedContentNeeds,
  }
}
