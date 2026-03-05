import { Site, Page, Section, SiteTheme, Media, PublishState, EditToken } from '@prisma/client'
import { PICTOS } from '@/lib/pictos'

// Site avec toutes les relations
export type SiteWithRelations = Site & {
  pages: PageWithSections[]
  siteTheme: SiteTheme | null
  publishState: PublishState | null
  editToken: EditToken | null
  media: Media[]
}

// Page avec ses sections
export type PageWithSections = Page & {
  sections: Section[]
}

// Thème calculé (depuis preset ou personnalisé)
export interface ComputedTheme {
  name: string
  family: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
    muted: string
  }
  fonts: {
    heading: string
    body: string
  }
  borderRadius: string
  buttonStyle: 'rounded' | 'square' | 'pill'
}

// Données pour création de site
export interface CreateSiteData {
  name: string
  contactEmail: string
  goal: string
  themeFamily: string
  sections: string[]
  needs: string[]
}

// Section data JSON parsed
export interface HeroData {
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  backgroundImage?: string
}

export interface AboutData {
  title: string
  content: string
  image?: string
}

export interface ServicesData {
  title: string
  services: {
    icon?: string // Pour compatibilité avec anciennes données
    iconSrc?: string // Nouveau format avec pictos
    title: string
    description: string
  }[]
}

export interface GalleryData {
  title: string
  images: {
    url: string
    alt: string
  }[]
}

export interface TestimonialsData {
  title: string
  testimonials: {
    name: string
    role: string
    content: string
    avatar?: string
  }[]
}

export interface ContactData {
  title: string
  email: string
  phone?: string
  address?: string
  showForm: boolean
}

export interface FooterData {
  copyright: string
  links: {
    label: string
    url: string
  }[]
}

export type SectionData = 
  | HeroData 
  | AboutData 
  | ServicesData 
  | GalleryData 
  | TestimonialsData 
  | ContactData 
  | FooterData

// ============================================
// SYSTÈME DE BLOCS DE CONTENU MODULAIRE
// ============================================

export type ContentBlockType = 'title' | 'subtitle' | 'text' | 'image' | 'video' | 'audio' | 'button' | 'shape' | 'gallery' | 'contact-form' | 'social-icons'

export interface ContentBlock {
  id: string
  type: ContentBlockType
  order: number
  content: string // Texte ou URL selon le type
  settings?: {
    alignment?: 'left' | 'center' | 'right'
    size?: 'small' | 'medium' | 'large'
    imageSize?: 'small' | 'medium' | 'large' | 'full' // Pour blocs image
    videoSize?: 'small' | 'medium' | 'large' | 'full' // Pour blocs vidéo
    textFont?: string // Police spécifique au bloc
    textSize?: number // Taille de police (px) pour le bloc
    textColor?: string // Couleur du texte pour le bloc
    textBold?: boolean
    textItalic?: boolean
    textUnderline?: boolean
    link?: string // URL pour linkMode === 'url'
    linkMode?: 'url' | 'page' | 'section'
    pageId?: string
    pageSlug?: string
    sectionId?: string
    alt?: string // Pour images
  }
}

// Styles personnalisés de section
export interface SectionStyles {
  backgroundColor?: string
  bgMode?: 'color' | 'gradient'
  gradientColor1?: string
  gradientColor2?: string
  gradientAngle?: number
  backgroundImage?: string
  backgroundVideo?: string
  overlayColor?: string
  overlayOpacity?: number
  bgFixed?: boolean
  bgPosition?: number
  headingFont?: string
  bodyFont?: string
  headingSize?: number // taille en px pour les titres
  bodySize?: number // taille en px pour le texte
  headingColor?: string
  textColor?: string
  buttonStyle?: 'square' | 'rounded' | 'pill'
}

// Section avec blocs de contenu
export interface FlexibleSectionData {
  blocks: ContentBlock[]
  backgroundColor?: string
  padding?: 'small' | 'medium' | 'large'
  sectionStyles?: SectionStyles
}

// Types de blocs disponibles avec leurs métadonnées (même source pictos que le site)
export const CONTENT_BLOCK_TYPES = [
  { type: 'title' as ContentBlockType, label: 'Titre', iconSrc: PICTOS['page-script'], description: 'Titre principal' },
  { type: 'subtitle' as ContentBlockType, label: 'Sous-titre', iconSrc: PICTOS['page-info'], description: 'Sous-titre ou accroche' },
  { type: 'text' as ContentBlockType, label: 'Texte', iconSrc: PICTOS['page-query'], description: 'Paragraphe de texte' },
  { type: 'image' as ContentBlockType, label: 'Image', iconSrc: PICTOS.camera, description: 'Image depuis la médiathèque' },
  { type: 'video' as ContentBlockType, label: 'Vidéo', iconSrc: PICTOS.play, description: 'Vidéo depuis la médiathèque' },
  { type: 'audio' as ContentBlockType, label: 'Audio', iconSrc: PICTOS.microphone, description: 'Fichier audio' },
  { type: 'button' as ContentBlockType, label: 'Bouton', iconSrc: PICTOS.cursors, description: 'Bouton d\'action' },
  { type: 'gallery' as ContentBlockType, label: 'Galerie', iconSrc: PICTOS.camera, description: 'Grille d\'images' },
  { type: 'contact-form' as ContentBlockType, label: 'Formulaire de contact', iconSrc: PICTOS.contacts, description: 'Formulaire de contact' },
  { type: 'social-icons' as ContentBlockType, label: 'Icônes sociales', iconSrc: PICTOS.settings, description: 'Liens réseaux sociaux' },
]
