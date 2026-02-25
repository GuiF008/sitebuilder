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
    id: 'artisan-local',
    name: 'Artisan Local',
    description: 'Chaleureux et rassurant pour artisans et TPE',
    category: 'professional',
    colors: {
      primary: '#8B4513',
      secondary: '#A0522D',
      accent: '#D2691E',
      background: '#FFF8F3',
      text: '#2F2F2F',
      muted: '#7A6F66',
    },
    fonts: {
      heading: 'Poppins',
      body: 'Source Sans Pro',
    },
    borderRadius: '10px',
    buttonStyle: 'rounded',
    defaultSections: ['hero', 'about', 'services', 'gallery', 'contact', 'footer'],
    headerStyle: {
      type: 'classic',
      showLogo: true,
      showNav: true,
      backgroundColor: '#8B4513',
      textColor: '#FFFFFF',
      layout: 'horizontal',
    },
  },
  {
    id: 'restaurant-gourmet',
    name: 'Restaurant Gourmet',
    description: 'Contraste élégant pour restauration et hôtellerie',
    category: 'creative',
    colors: {
      primary: '#1F1F1F',
      secondary: '#3A3A3A',
      accent: '#C9A227',
      background: '#FFFFFF',
      text: '#222222',
      muted: '#6E6E6E',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Inter',
    },
    borderRadius: '6px',
    buttonStyle: 'square',
    defaultSections: ['hero', 'about', 'gallery', 'services', 'contact', 'footer'],
    headerStyle: {
      type: 'minimal',
      showLogo: true,
      showNav: true,
      backgroundColor: '#1F1F1F',
      textColor: '#FFFFFF',
      layout: 'horizontal',
    },
  },
  {
    id: 'freelance-creator',
    name: 'Freelance Creator',
    description: 'Moderne et dynamique pour indépendants',
    category: 'creative',
    colors: {
      primary: '#4F46E5',
      secondary: '#6366F1',
      accent: '#22C55E',
      background: '#F9FAFB',
      text: '#111827',
      muted: '#6B7280',
    },
    fonts: {
      heading: 'Space Grotesk',
      body: 'Inter',
    },
    borderRadius: '12px',
    buttonStyle: 'pill',
    defaultSections: ['hero', 'about', 'services', 'testimonials', 'contact', 'footer'],
    headerStyle: {
      type: 'modern',
      showLogo: true,
      showNav: true,
      backgroundColor: '#4F46E5',
      textColor: '#FFFFFF',
      layout: 'horizontal',
    },
  },
  {
    id: 'medical-trust',
    name: 'Medical Trust',
    description: 'Style clair et crédible pour santé et services',
    category: 'professional',
    colors: {
      primary: '#0F4C81',
      secondary: '#1D70B8',
      accent: '#00A3A3',
      background: '#F5FBFF',
      text: '#1A2A33',
      muted: '#5F7480',
    },
    fonts: {
      heading: 'Source Sans Pro',
      body: 'Source Sans Pro',
    },
    borderRadius: '8px',
    buttonStyle: 'rounded',
    defaultSections: ['hero', 'about', 'services', 'contact', 'hours', 'footer'],
    headerStyle: {
      type: 'classic',
      showLogo: true,
      showNav: true,
      backgroundColor: '#0F4C81',
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
