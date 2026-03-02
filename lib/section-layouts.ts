/**
 * Bibliothèque des 10 maquettes de mises en page de sections
 */

export type LayoutId =
  | 'alpha'    // Hero Split
  | 'bravo'    // Spotlight centré
  | 'charlie'  // Story latérale
  | 'delta'    // Asymétrique premium
  | 'echo'     // Process
  | 'foxtrot'  // Témoignage portrait
  | 'golf'     // Grille de cartes
  | 'hotel'    // Comparatif simple
  | 'india'    // Blog teaser
  | 'juliet'   // Contact confiance

export type SectionTypeId =
  | 'hero' | 'about' | 'text' | 'image-text' | 'services' | 'gallery' | 'contact'
  | 'testimonials' | 'team' | 'features' | 'blog' | 'process'

export interface SectionLayout {
  id: LayoutId
  name: string
  description: string
  /** Alignement principal pour le contenu */
  contentAlignment: 'left' | 'center' | 'right'
  /** Image à gauche (true) ou à droite (false) pour layouts image+texte */
  imagePosition: 'left' | 'right' | 'center' | 'none'
  /** Structure : 'split' | 'stack' | 'grid' | 'overlay' */
  structure: 'split' | 'stack' | 'grid' | 'overlay'
}

export const SECTION_LAYOUTS: SectionLayout[] = [
  { id: 'alpha', name: 'Hero Split', description: 'Texte à gauche, image à droite', contentAlignment: 'left', imagePosition: 'right', structure: 'split' },
  { id: 'bravo', name: 'Spotlight centré', description: 'Contenu centré avec image large', contentAlignment: 'center', imagePosition: 'center', structure: 'stack' },
  { id: 'charlie', name: 'Story latérale', description: 'Image à gauche, texte à droite', contentAlignment: 'left', imagePosition: 'left', structure: 'split' },
  { id: 'delta', name: 'Asymétrique premium', description: 'Cartouche texte chevauchant l\'image', contentAlignment: 'left', imagePosition: 'right', structure: 'overlay' },
  { id: 'echo', name: 'Process / Étapes', description: 'Texte puis schéma de synthèse', contentAlignment: 'center', imagePosition: 'center', structure: 'stack' },
  { id: 'foxtrot', name: 'Témoignage portrait', description: 'Portrait à gauche, citation à droite', contentAlignment: 'left', imagePosition: 'left', structure: 'split' },
  { id: 'golf', name: 'Grille de cartes', description: 'Éléments en grille 3 colonnes', contentAlignment: 'center', imagePosition: 'none', structure: 'grid' },
  { id: 'hotel', name: 'Comparatif simple', description: 'Icône à gauche, texte à droite', contentAlignment: 'left', imagePosition: 'left', structure: 'split' },
  { id: 'india', name: 'Blog teaser', description: 'Image article + résumé', contentAlignment: 'left', imagePosition: 'center', structure: 'stack' },
  { id: 'juliet', name: 'Contact confiance', description: 'Texte à gauche, image à droite', contentAlignment: 'left', imagePosition: 'right', structure: 'split' },
]

export const SECTION_TYPES: { id: SectionTypeId; label: string; defaultLayout: LayoutId; recommendedLayouts: LayoutId[] }[] = [
  { id: 'hero', label: 'Hero', defaultLayout: 'alpha', recommendedLayouts: ['alpha', 'bravo', 'delta'] },
  { id: 'about', label: 'À propos', defaultLayout: 'charlie', recommendedLayouts: ['charlie', 'alpha', 'bravo'] },
  { id: 'text', label: 'Texte', defaultLayout: 'bravo', recommendedLayouts: ['bravo', 'charlie', 'india'] },
  { id: 'image-text', label: 'Image + Texte', defaultLayout: 'charlie', recommendedLayouts: ['charlie', 'alpha', 'delta'] },
  { id: 'services', label: 'Services', defaultLayout: 'golf', recommendedLayouts: ['golf', 'echo', 'hotel'] },
  { id: 'gallery', label: 'Galerie', defaultLayout: 'golf', recommendedLayouts: ['golf', 'bravo'] },
  { id: 'contact', label: 'Contact', defaultLayout: 'juliet', recommendedLayouts: ['juliet', 'bravo'] },
  { id: 'testimonials', label: 'Témoignages', defaultLayout: 'foxtrot', recommendedLayouts: ['foxtrot', 'golf'] },
  { id: 'team', label: 'Équipe', defaultLayout: 'golf', recommendedLayouts: ['golf', 'charlie'] },
  { id: 'features', label: 'Fonctionnalités', defaultLayout: 'hotel', recommendedLayouts: ['hotel', 'golf', 'echo'] },
  { id: 'blog', label: 'Blog', defaultLayout: 'india', recommendedLayouts: ['india', 'golf'] },
  { id: 'process', label: 'Processus', defaultLayout: 'echo', recommendedLayouts: ['echo', 'golf'] },
]

export const SECTION_CATEGORIES: { id: string; label: string; types: SectionTypeId[] }[] = [
  { id: 'header', label: 'En-tête', types: ['hero'] },
  { id: 'about', label: 'À propos', types: ['about', 'text', 'image-text'] },
  { id: 'services', label: 'Services & Fonctionnalités', types: ['services', 'features', 'process'] },
  { id: 'social', label: 'Preuve sociale', types: ['testimonials', 'team'] },
  { id: 'content', label: 'Contenu', types: ['gallery', 'blog'] },
  { id: 'contact', label: 'Contact', types: ['contact'] },
]

export function getLayoutById(id: LayoutId): SectionLayout | undefined {
  return SECTION_LAYOUTS.find(l => l.id === id)
}

export function getSectionTypeById(id: SectionTypeId) {
  return SECTION_TYPES.find(t => t.id === id)
}

/** Bloc de contenu pour BlockRenderer */
export type DefaultBlock = {
  id: string
  type: string
  order: number
  content: string
  settings?: Record<string, unknown>
}

function genId() {
  return `blk-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Génère les blocs par défaut pour une section selon son type et sa mise en page.
 * Chaque layout a une structure propre (titre, sous-titre, texte, image, bouton, etc.).
 */
export function getDefaultBlocksForSection(
  type: SectionTypeId,
  layoutId: LayoutId,
  baseData: Record<string, unknown>
): DefaultBlock[] {
  const title = (baseData.title as string) || 'Titre'
  const subtitle = (baseData.subtitle as string) || 'Sous-titre'
  const content = (baseData.content as string) || 'Votre contenu ici...'
  const image = (baseData.image as string) || ''
  const ctaText = (baseData.ctaText as string) || 'En savoir plus'
  const layout = getLayoutById(layoutId as LayoutId)

  const blocks: DefaultBlock[] = []
  let order = 0

  const add = (t: string, c: string, s?: Record<string, unknown>) => {
    blocks.push({ id: genId(), type: t, order: order++, content: c, settings: s })
  }

  switch (layoutId) {
    case 'alpha': // Hero Split - texte gauche, image droite
      add('title', title, { alignment: layout?.contentAlignment || 'left' })
      add('subtitle', subtitle, { alignment: layout?.contentAlignment || 'left' })
      if (type === 'hero' || type === 'image-text') add('image', image)
      if (type === 'hero') add('button', ctaText)
      if (type === 'about' || type === 'text' || type === 'image-text') add('text', content)
      break
    case 'bravo': // Spotlight centré
      add('title', title, { alignment: 'center' })
      add('subtitle', subtitle, { alignment: 'center' })
      add('text', content, { alignment: 'center' })
      if (image || type === 'image-text' || type === 'hero') add('image', image, { alignment: 'center', imageSize: 'large' })
      if (type === 'hero') add('button', ctaText, { alignment: 'center' })
      break
    case 'charlie': // Story latérale - image gauche, texte droite
      if (image || type === 'image-text' || type === 'about') add('image', image, { imageSize: 'large' })
      add('title', title)
      add('subtitle', subtitle)
      add('text', content)
      if (type === 'hero') add('button', ctaText)
      break
    case 'delta': // Asymétrique premium
      add('title', title)
      add('subtitle', subtitle)
      if (image || type === 'image-text') add('image', image, { imageSize: 'full' })
      add('text', content)
      if (type === 'hero') add('button', ctaText)
      break
    case 'echo': // Process / Étapes
      add('title', title, { alignment: 'center' })
      add('subtitle', subtitle, { alignment: 'center' })
      add('text', content, { alignment: 'center' })
      break
    case 'foxtrot': // Témoignage portrait
      if (image) add('image', image, { imageSize: 'medium' })
      add('title', title)
      add('text', content)
      break
    case 'golf': // Grille de cartes
      add('title', title, { alignment: 'center' })
      add('subtitle', subtitle, { alignment: 'center' })
      add('text', content, { alignment: 'center' })
      add('gallery', JSON.stringify((baseData.images as string[]) || []), { columns: 3 })
      break
    case 'hotel': // Comparatif simple - icône + texte
      add('title', title)
      add('text', content)
      break
    case 'india': // Blog teaser
      add('image', image, { imageSize: 'large' })
      add('title', title)
      add('text', content)
      if (type === 'hero') add('button', ctaText)
      break
    case 'juliet': // Contact confiance
      add('title', title)
      add('text', content)
      add('image', image, { imageSize: 'medium' })
      add('contact-form', '')
      break
    default:
      add('title', title)
      add('subtitle', subtitle)
      add('text', content)
      if (image) add('image', image)
      if (type === 'hero') add('button', ctaText)
  }

  return blocks.sort((a, b) => a.order - b.order).map((b, i) => ({ ...b, order: i }))
}
