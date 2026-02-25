export interface ThemePreset {
  id: string
  name: string
  description: string
  category: string
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
  defaultSections: string[]
  headerStyle?: {
    type: 'minimal' | 'classic' | 'bold' | 'modern'
    showLogo: boolean
    showNav: boolean
    backgroundColor?: string
    textColor?: string
    layout?: 'horizontal' | 'vertical'
  }
}

export const themePresets: ThemePreset[] = [
  {
    id: 'ovh-modern',
    name: 'OVH Modern',
    description: 'Design épuré aux couleurs OVHcloud',
    category: 'professional',
    colors: {
      primary: '#000E9C',
      secondary: '#0050D7',
      accent: '#00D4AA',
      background: '#FFFFFF',
      text: '#212529',
      muted: '#6C757D',
    },
    fonts: {
      heading: 'Source Sans Pro',
      body: 'Source Sans Pro',
    },
    borderRadius: '8px',
    buttonStyle: 'rounded',
    defaultSections: ['hero', 'about', 'services', 'contact', 'footer'],
    headerStyle: {
      type: 'modern',
      showLogo: true,
      showNav: true,
      backgroundColor: '#000E9C',
      textColor: '#FFFFFF',
      layout: 'horizontal',
    },
  },
  {
    id: 'classic-elegant',
    name: 'Classic Élégant',
    description: 'Style traditionnel et raffiné',
    category: 'professional',
    colors: {
      primary: '#1E3A5F',
      secondary: '#3D5A80',
      accent: '#98C1D9',
      background: '#FAFAFA',
      text: '#293241',
      muted: '#5C677D',
    },
    fonts: {
      heading: 'Georgia',
      body: 'Source Sans Pro',
    },
    borderRadius: '4px',
    buttonStyle: 'square',
    defaultSections: ['hero', 'about', 'services', 'testimonials', 'contact', 'footer'],
    headerStyle: {
      type: 'classic',
      showLogo: true,
      showNav: true,
      backgroundColor: '#1E3A5F',
      textColor: '#FFFFFF',
      layout: 'horizontal',
    },
  },
  {
    id: 'creative-bold',
    name: 'Créatif Bold',
    description: 'Dynamique et coloré pour les créatifs',
    category: 'creative',
    colors: {
      primary: '#7C3AED',
      secondary: '#A855F7',
      accent: '#F472B6',
      background: '#FFFFFF',
      text: '#1F2937',
      muted: '#6B7280',
    },
    fonts: {
      heading: 'Poppins',
      body: 'Inter',
    },
    borderRadius: '16px',
    buttonStyle: 'pill',
    defaultSections: ['hero', 'gallery', 'about', 'testimonials', 'contact', 'footer'],
    headerStyle: {
      type: 'bold',
      showLogo: true,
      showNav: true,
      backgroundColor: '#7C3AED',
      textColor: '#FFFFFF',
      layout: 'horizontal',
    },
  },
  {
    id: 'pro-business',
    name: 'Pro Business',
    description: 'Sobre et corporate pour les entreprises',
    category: 'professional',
    colors: {
      primary: '#1B1B1B',
      secondary: '#374151',
      accent: '#3B82F6',
      background: '#FFFFFF',
      text: '#111827',
      muted: '#6B7280',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    borderRadius: '6px',
    buttonStyle: 'rounded',
    defaultSections: ['hero', 'about', 'services', 'testimonials', 'contact', 'footer'],
    headerStyle: {
      type: 'minimal',
      showLogo: true,
      showNav: true,
      backgroundColor: '#1B1B1B',
      textColor: '#FFFFFF',
      layout: 'horizontal',
    },
  },
  {
    id: 'nature-zen',
    name: 'Nature Zen',
    description: 'Organique et apaisant pour le bien-être',
    category: 'minimal',
    colors: {
      primary: '#059669',
      secondary: '#10B981',
      accent: '#F59E0B',
      background: '#F0FDF4',
      text: '#1F2937',
      muted: '#6B7280',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Lato',
    },
    borderRadius: '12px',
    buttonStyle: 'rounded',
    defaultSections: ['hero', 'about', 'services', 'gallery', 'contact', 'footer'],
    headerStyle: {
      type: 'classic',
      showLogo: true,
      showNav: true,
      backgroundColor: '#059669',
      textColor: '#FFFFFF',
      layout: 'horizontal',
    },
  },
  {
    id: 'tech-moderne',
    name: 'Tech Moderne',
    description: 'Futuriste et innovant pour les startups',
    category: 'bold',
    colors: {
      primary: '#0891B2',
      secondary: '#06B6D4',
      accent: '#8B5CF6',
      background: '#0F172A',
      text: '#F1F5F9',
      muted: '#94A3B8',
    },
    fonts: {
      heading: 'Space Grotesk',
      body: 'Inter',
    },
    borderRadius: '8px',
    buttonStyle: 'rounded',
    defaultSections: ['hero', 'about', 'services', 'testimonials', 'contact', 'footer'],
    headerStyle: {
      type: 'modern',
      showLogo: true,
      showNav: true,
      backgroundColor: '#0F172A',
      textColor: '#F1F5F9',
      layout: 'horizontal',
    },
  },
  {
    id: 'artisan-chic',
    name: 'Artisan Chic',
    description: 'Chaleureux et premium pour métiers d art et services locaux',
    category: 'professional',
    colors: {
      primary: '#7A4B2A',
      secondary: '#B07D4F',
      accent: '#E7B36A',
      background: '#FFF9F2',
      text: '#2D221A',
      muted: '#7C6A5C',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Source Sans Pro',
    },
    borderRadius: '10px',
    buttonStyle: 'rounded',
    defaultSections: ['hero', 'about', 'services', 'testimonials', 'contact', 'footer'],
    headerStyle: {
      type: 'classic',
      showLogo: true,
      showNav: true,
      backgroundColor: '#7A4B2A',
      textColor: '#FFFFFF',
      layout: 'horizontal',
    },
  },
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    description: 'Minimaliste et lisible pour portfolios et vitrines',
    category: 'minimal',
    colors: {
      primary: '#111111',
      secondary: '#3A3A3A',
      accent: '#6D28D9',
      background: '#FFFFFF',
      text: '#111827',
      muted: '#6B7280',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    borderRadius: '4px',
    buttonStyle: 'square',
    defaultSections: ['hero', 'about', 'gallery', 'contact', 'footer'],
    headerStyle: {
      type: 'minimal',
      showLogo: true,
      showNav: true,
      backgroundColor: '#FFFFFF',
      textColor: '#111111',
      layout: 'horizontal',
    },
  },
  {
    id: 'agency-neon',
    name: 'Agency Neon',
    description: 'Fort contraste pour studios et agences digitales',
    category: 'bold',
    colors: {
      primary: '#0B1020',
      secondary: '#1E293B',
      accent: '#22D3EE',
      background: '#0F172A',
      text: '#E2E8F0',
      muted: '#94A3B8',
    },
    fonts: {
      heading: 'Space Grotesk',
      body: 'Inter',
    },
    borderRadius: '12px',
    buttonStyle: 'pill',
    defaultSections: ['hero', 'services', 'testimonials', 'contact', 'footer'],
    headerStyle: {
      type: 'modern',
      showLogo: true,
      showNav: true,
      backgroundColor: '#0B1020',
      textColor: '#E2E8F0',
      layout: 'horizontal',
    },
  },
  {
    id: 'restaurant-sun',
    name: 'Restaurant Sun',
    description: 'Palette solaire pour restauration et hospitality',
    category: 'creative',
    colors: {
      primary: '#B45309',
      secondary: '#D97706',
      accent: '#F59E0B',
      background: '#FFFBEB',
      text: '#3F2A14',
      muted: '#7C6A5C',
    },
    fonts: {
      heading: 'Poppins',
      body: 'Lato',
    },
    borderRadius: '14px',
    buttonStyle: 'rounded',
    defaultSections: ['hero', 'about', 'gallery', 'services', 'contact', 'footer'],
    headerStyle: {
      type: 'bold',
      showLogo: true,
      showNav: true,
      backgroundColor: '#B45309',
      textColor: '#FFFFFF',
      layout: 'horizontal',
    },
  },
]

export function getThemePreset(id: string): ThemePreset | undefined {
  return themePresets.find((preset) => preset.id === id)
}

export function getDefaultTheme(): ThemePreset {
  return themePresets[0]
}
