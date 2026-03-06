/**
 * Types pour l'onboarding conversationnel en 4 étapes.
 * Les réponses sont stockées temporairement (localStorage) et compilées pour générer la V1.
 */

export type ThemeGoal = 'vitrine' | 'portfolio' | 'blog' | 'ecommerce'

/** Étape 1 : intention brute et champs déduits */
export interface Step1Data {
  rawIntent: string
  inferredSiteType: ThemeGoal
  inferredBusinessCategory: string
  inferredPrimaryGoal: string
}

/** Options de contenu (étape 2) - ids alignés avec les sections du builder */
export const CONTENT_NEED_IDS = [
  'present_activity',
  'present_services',
  'show_photos',
  'show_testimonials',
  'share_contact',
  'contact_form',
  'show_hours',
  'show_map',
  'present_team',
  'news_blog',
  'show_products',
  'reservation_quote',
] as const
export type ContentNeedId = (typeof CONTENT_NEED_IDS)[number]

/** Mapping besoin utilisateur → type de section builder */
export const CONTENT_NEED_TO_SECTION: Record<string, string> = {
  present_activity: 'about',
  present_services: 'services',
  show_photos: 'gallery',
  show_testimonials: 'testimonials',
  share_contact: 'contact',
  contact_form: 'contact',
  show_hours: 'hours',
  show_map: 'contact',
  present_team: 'about',
  news_blog: 'about',
  show_products: 'services',
  reservation_quote: 'contact',
}

/** Étape 2 : contenus sélectionnés et déductions */
export interface Step2Data {
  selectedContentNeeds: string[]
  inferredSections: string[]
  contentPriority: string[]
  contentDensity: 'visual' | 'balanced' | 'text'
}

/** Étape 3 : direction visuelle */
export type VisualUniverse = 'moderne' | 'elegant' | 'minimaliste' | 'chaleureux' | 'creatif' | 'professionnel'
export type ColorMood = 'bleu_confiance' | 'noir_premium' | 'beige_naturel' | 'vert_apaisant' | 'vif_dynamique'
export type TypographyStyle = 'moderne' | 'elegante' | 'creative' | 'classique'

export interface Step3Data {
  visualStyle: VisualUniverse
  colorMood: ColorMood
  typographyStyle: TypographyStyle
}

/** Réponses complètes onboarding */
export interface OnboardingAnswers {
  currentStep: number
  step1?: Step1Data
  step2?: Step2Data
  step3?: Step3Data
  /** Nom du site (dérivé de l'intention ou par défaut) */
  siteName?: string
}

/** Paramètres compilés pour l'API de création de site */
export interface CompiledOnboardingPayload {
  name: string
  contactEmail: string
  goal: ThemeGoal
  themeFamily: string
  sections: string[]
  needs?: string[]
}
