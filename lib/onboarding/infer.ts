/**
 * Inférence à partir de l'intention utilisateur (étape 1).
 * Détecte type de site, catégorie métier, objectif principal.
 */

import type { ThemeGoal } from './types'
import type { Step1Data } from './types'

const LOWER = (s: string) => s.toLowerCase().trim()

/** Mots-clés par type de site (goal) */
const GOAL_KEYWORDS: Record<ThemeGoal, string[]> = {
  vitrine: [
    'restaurant', 'café', 'cafe', 'bar', 'hotel', 'activité', 'entreprise', 'association',
    'artisan', 'commerce', 'local', 'présenter', 'vitrine', 'site vitrine', 'activité',
    'boutique physique', 'salon', 'coiffeur', 'médecin', 'avocat', 'cabinet',
  ],
  portfolio: [
    'photographe', 'photographie', 'créateur', 'créations', 'réalisations', 'portfolio',
    'montrer mon travail', 'galerie', 'artiste', 'designer', 'graphiste', 'développeur',
  ],
  blog: [
    'blog', 'actualités', 'news', 'articles', 'partager', 'écrire', 'rédaction',
  ],
  ecommerce: [
    'vendre', 'boutique', 'e-commerce', 'ecommerce', 'produits', 'shop', 'commander',
  ],
}

/** Sections recommandées par type de site (aligné avec getSuggestedSections dans starter.ts) */
const SECTIONS_BY_GOAL: Record<ThemeGoal, string[]> = {
  vitrine: ['about', 'services', 'contact'],
  portfolio: ['about', 'gallery', 'testimonials', 'contact'],
  blog: ['about', 'contact'],
  ecommerce: ['about', 'services', 'testimonials', 'contact'],
}

/** Détection du type de site à partir du texte libre */
export function inferSiteTypeFromIntent(rawIntent: string): ThemeGoal {
  const text = LOWER(rawIntent)
  let best: ThemeGoal = 'vitrine'
  let maxScore = 0

  for (const [goal, keywords] of Object.entries(GOAL_KEYWORDS)) {
    const score = keywords.filter((k) => text.includes(LOWER(k))).length
    if (score > maxScore) {
      maxScore = score
      best = goal as ThemeGoal
    }
  }
  return best
}

/** Catégorie métier simplifiée pour affichage / log */
export function inferBusinessCategory(rawIntent: string): string {
  const text = LOWER(rawIntent)
  if (text.match(/\b(restaurant|café|cafe|bar|food|cuisine)\b/)) return 'restaurant'
  if (text.match(/\b(photographe|photo|galerie)\b/)) return 'photographe'
  if (text.match(/\b(association|asso)\b/)) return 'association'
  if (text.match(/\b(artisan|commerce|local|boutique)\b/)) return 'activité locale'
  if (text.match(/\b(entreprise|société|company)\b/)) return 'entreprise'
  if (text.match(/\b(portfolio|réalisations|créations)\b/)) return 'créatif'
  return 'général'
}

/** Objectif principal (pour sections / wording) */
export function inferPrimaryGoal(rawIntent: string): string {
  const text = LOWER(rawIntent)
  if (text.match(/\b(présenter|présentation|présenter mon)\b/)) return 'présentation'
  if (text.match(/\b(contact|contacter|me joindre)\b/)) return 'contact'
  if (text.match(/\b(réservation|réserver|devis)\b/)) return 'réservation'
  if (text.match(/\b(galerie|photos|réalisations)\b/)) return 'galerie'
  if (text.match(/\b(services|prestations)\b/)) return 'services'
  return 'présentation'
}

/** Construit Step1Data à partir de l'intention brute. On garde rawIntent tel quel (espaces autorisés). */
export function buildStep1Data(rawIntent: string): Step1Data {
  const trimmed = rawIntent.trim()
  return {
    rawIntent,
    inferredSiteType: inferSiteTypeFromIntent(trimmed),
    inferredBusinessCategory: inferBusinessCategory(trimmed),
    inferredPrimaryGoal: inferPrimaryGoal(trimmed),
  }
}

/** Sections par défaut recommandées pour un goal (pour l'étape 2 si on pré-remplit) */
export function getDefaultSectionsForGoal(goal: ThemeGoal): string[] {
  return [...SECTIONS_BY_GOAL[goal]]
}
