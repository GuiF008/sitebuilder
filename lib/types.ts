import { Site, Page, Section, SiteTheme, Media, PublishState, EditToken } from '@prisma/client'

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

export type ContentBlockType = 'title' | 'subtitle' | 'text' | 'image' | 'video' | 'audio' | 'button'

export interface ContentBlock {
  id: string
  type: ContentBlockType
  order: number
  content: string // Texte ou URL selon le type
  settings?: {
    alignment?: 'left' | 'center' | 'right'
    size?: 'small' | 'medium' | 'large'
    link?: string // Pour boutons et images cliquables
    alt?: string // Pour images
  }
}

// Styles personnalisés de section
export interface SectionStyles {
  backgroundColor?: string
  headingFont?: string
  bodyFont?: string
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

// Types de blocs disponibles avec leurs métadonnées
export const CONTENT_BLOCK_TYPES = [
  { type: 'title' as ContentBlockType, label: 'Titre', iconSrc: '/pictos/page-script.png', description: 'Titre principal' },
  { type: 'subtitle' as ContentBlockType, label: 'Sous-titre', iconSrc: '/pictos/page-info.png', description: 'Sous-titre ou accroche' },
  { type: 'text' as ContentBlockType, label: 'Texte', iconSrc: '/pictos/page-query.png', description: 'Paragraphe de texte' },
  { type: 'image' as ContentBlockType, label: 'Image', iconSrc: '/pictos/camera.png', description: 'Image depuis la médiathèque' },
  { type: 'video' as ContentBlockType, label: 'Vidéo', iconSrc: '/pictos/play.png', description: 'Vidéo depuis la médiathèque' },
  { type: 'audio' as ContentBlockType, label: 'Audio', iconSrc: '/pictos/microphone.png', description: 'Fichier audio' },
  { type: 'button' as ContentBlockType, label: 'Bouton', iconSrc: '/pictos/cursors.png', description: 'Bouton d\'action' },
]
