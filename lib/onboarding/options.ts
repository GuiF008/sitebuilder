/**
 * Options affichées dans l'onboarding (étapes 2 et 3).
 */

import type { ContentNeedId } from './types'

/** Options de contenu (étape 2) - libellés pour l'UI */
export const CONTENT_OPTIONS: { id: ContentNeedId | string; label: string }[] = [
  { id: 'present_activity', label: 'Présenter mon activité' },
  { id: 'present_services', label: 'Présenter mes services' },
  { id: 'show_photos', label: 'Afficher des photos' },
  { id: 'show_testimonials', label: 'Afficher des témoignages clients' },
  { id: 'share_contact', label: 'Partager mes coordonnées' },
  { id: 'contact_form', label: 'Permettre de me contacter' },
  { id: 'show_hours', label: 'Afficher mes horaires' },
  { id: 'show_map', label: 'Afficher une carte / adresse' },
  { id: 'present_team', label: 'Présenter mon équipe' },
  { id: 'news_blog', label: 'Publier des actualités' },
  { id: 'show_products', label: 'Mettre en avant mes produits' },
  { id: 'reservation_quote', label: 'Permettre une réservation / demande de devis' },
]

/** Univers visuels (étape 3) */
export const VISUAL_UNIVERSES = [
  { id: 'moderne' as const, label: 'Moderne' },
  { id: 'elegant' as const, label: 'Élégant' },
  { id: 'minimaliste' as const, label: 'Minimaliste' },
  { id: 'chaleureux' as const, label: 'Chaleureux' },
  { id: 'creatif' as const, label: 'Créatif' },
  { id: 'professionnel' as const, label: 'Professionnel' },
]

/** Ambiances couleurs (étape 3) */
export const COLOR_MOODS = [
  { id: 'bleu_confiance' as const, label: 'Bleu / confiance' },
  { id: 'noir_premium' as const, label: 'Noir / premium' },
  { id: 'beige_naturel' as const, label: 'Beige / naturel' },
  { id: 'vert_apaisant' as const, label: 'Vert / apaisant' },
  { id: 'vif_dynamique' as const, label: 'Couleurs vives / dynamique' },
]

/** Typographies (étape 3) */
export const TYPOGRAPHY_OPTIONS = [
  { id: 'moderne' as const, label: 'Moderne' },
  { id: 'elegante' as const, label: 'Élégante' },
  { id: 'creative' as const, label: 'Créative' },
  { id: 'classique' as const, label: 'Classique' },
]
