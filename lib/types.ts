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
    icon: string
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
