/** Objectifs onboarding (étape 2) auxquels le thème est adapté */
export type ThemeGoal = 'vitrine' | 'portfolio' | 'blog' | 'ecommerce'

export interface ThemePreset {
  id: string
  name: string
  description: string
  /** Court libellé style : couleurs, typo, bords (pour la carte) */
  styleLabel?: string
  /** Objectifs pour lesquels ce thème est recommandé (étape 2 onboarding) */
  goals: ThemeGoal[]
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
  /** Couleur de fond du hero (sinon primary) */
  heroBg?: string
  /** Couleur de fond du footer (sinon secondary) */
  footerBg?: string
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
    description: 'Design épuré aux couleurs OVHcloud, idéal pour une vitrine professionnelle.',
    styleLabel: 'Bleu / vert accent · Source Sans Pro · Coins arrondis',
    goals: ['vitrine', 'portfolio'],
    category: 'professional',
    colors: {
      primary: '#000E9C',
      secondary: '#0050D7',
      accent: '#00D4AA',
      background: '#FFFFFF',
      text: '#212529',
      muted: '#6C757D',
    },
    fonts: { heading: 'Source Sans Pro', body: 'Source Sans Pro' },
    borderRadius: '8px',
    buttonStyle: 'rounded',
    heroBg: '#000E9C',
    footerBg: '#00167A',
    defaultSections: ['hero', 'about', 'services', 'contact', 'footer'],
    headerStyle: { type: 'modern', showLogo: true, showNav: true, backgroundColor: '#000E9C', textColor: '#FFFFFF', layout: 'horizontal' },
  },
  {
    id: 'classic-elegant',
    name: 'Classic Élégant',
    description: 'Style traditionnel et raffiné, parfait pour présenter une activité avec sérieux.',
    styleLabel: 'Bleu marine / gris · Georgia & Source Sans Pro · Coins carrés',
    goals: ['vitrine', 'blog'],
    category: 'professional',
    colors: {
      primary: '#1E3A5F',
      secondary: '#3D5A80',
      accent: '#98C1D9',
      background: '#FAFAFA',
      text: '#293241',
      muted: '#5C677D',
    },
    fonts: { heading: 'Georgia', body: 'Source Sans Pro' },
    borderRadius: '4px',
    buttonStyle: 'square',
    heroBg: '#1E3A5F',
    footerBg: '#2A4A70',
    defaultSections: ['hero', 'about', 'services', 'testimonials', 'contact', 'footer'],
    headerStyle: { type: 'classic', showLogo: true, showNav: true, backgroundColor: '#1E3A5F', textColor: '#FFFFFF', layout: 'horizontal' },
  },
  {
    id: 'creative-bold',
    name: 'Créatif Bold',
    description: 'Dynamique et coloré, pour les créatifs et portfolios qui osent.',
    styleLabel: 'Violet / rose · Poppins & Inter · Très arrondi (pilule)',
    goals: ['portfolio', 'blog'],
    category: 'creative',
    colors: {
      primary: '#7C3AED',
      secondary: '#A855F7',
      accent: '#F472B6',
      background: '#FFFFFF',
      text: '#1F2937',
      muted: '#6B7280',
    },
    fonts: { heading: 'Poppins', body: 'Inter' },
    borderRadius: '16px',
    buttonStyle: 'pill',
    heroBg: '#7C3AED',
    footerBg: '#9333EA',
    defaultSections: ['hero', 'gallery', 'about', 'testimonials', 'contact', 'footer'],
    headerStyle: { type: 'bold', showLogo: true, showNav: true, backgroundColor: '#7C3AED', textColor: '#FFFFFF', layout: 'horizontal' },
  },
  {
    id: 'pro-business',
    name: 'Pro Business',
    description: 'Sobre et corporate pour les entreprises et la vente B2B.',
    styleLabel: 'Noir / bleu · Inter · Légèrement arrondi',
    goals: ['vitrine', 'ecommerce'],
    category: 'professional',
    colors: {
      primary: '#1B1B1B',
      secondary: '#374151',
      accent: '#3B82F6',
      background: '#FFFFFF',
      text: '#111827',
      muted: '#6B7280',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    borderRadius: '6px',
    buttonStyle: 'rounded',
    heroBg: '#1B1B1B',
    footerBg: '#111827',
    defaultSections: ['hero', 'about', 'services', 'testimonials', 'contact', 'footer'],
    headerStyle: { type: 'minimal', showLogo: true, showNav: true, backgroundColor: '#1B1B1B', textColor: '#FFFFFF', layout: 'horizontal' },
  },
  {
    id: 'nature-zen',
    name: 'Nature Zen',
    description: 'Organique et apaisant pour le bien-être, la nature et les services doux.',
    styleLabel: 'Vert / ambre · Playfair Display & Lato · Arrondi',
    goals: ['vitrine', 'blog'],
    category: 'minimal',
    colors: {
      primary: '#059669',
      secondary: '#10B981',
      accent: '#F59E0B',
      background: '#F0FDF4',
      text: '#1F2937',
      muted: '#6B7280',
    },
    fonts: { heading: 'Playfair Display', body: 'Lato' },
    borderRadius: '12px',
    buttonStyle: 'rounded',
    heroBg: '#059669',
    footerBg: '#047857',
    defaultSections: ['hero', 'about', 'services', 'gallery', 'contact', 'footer'],
    headerStyle: { type: 'classic', showLogo: true, showNav: true, backgroundColor: '#059669', textColor: '#FFFFFF', layout: 'horizontal' },
  },
  {
    id: 'tech-moderne',
    name: 'Tech Moderne',
    description: 'Futuriste et innovant pour les startups et la tech.',
    styleLabel: 'Cyan / violet · Space Grotesk & Inter · Fond sombre',
    goals: ['portfolio', 'vitrine', 'ecommerce'],
    category: 'bold',
    colors: {
      primary: '#0891B2',
      secondary: '#06B6D4',
      accent: '#8B5CF6',
      background: '#0F172A',
      text: '#F1F5F9',
      muted: '#94A3B8',
    },
    fonts: { heading: 'Space Grotesk', body: 'Inter' },
    borderRadius: '8px',
    buttonStyle: 'rounded',
    heroBg: '#0F172A',
    footerBg: '#111827',
    defaultSections: ['hero', 'about', 'services', 'testimonials', 'contact', 'footer'],
    headerStyle: { type: 'modern', showLogo: true, showNav: true, backgroundColor: '#0F172A', textColor: '#F1F5F9', layout: 'horizontal' },
  },
  {
    id: 'artisan-local',
    name: 'Artisan Local',
    description: 'Chaleureux et rassurant pour artisans, TPE et commerces de proximité.',
    styleLabel: 'Marron / terre · Poppins & Source Sans Pro · Arrondi',
    goals: ['vitrine', 'ecommerce'],
    category: 'professional',
    colors: {
      primary: '#8B4513',
      secondary: '#A0522D',
      accent: '#D2691E',
      background: '#FFF8F3',
      text: '#2F2F2F',
      muted: '#7A6F66',
    },
    fonts: { heading: 'Poppins', body: 'Source Sans Pro' },
    borderRadius: '10px',
    buttonStyle: 'rounded',
    heroBg: '#8B4513',
    footerBg: '#6B3F24',
    defaultSections: ['hero', 'about', 'services', 'gallery', 'contact', 'footer'],
    headerStyle: { type: 'classic', showLogo: true, showNav: true, backgroundColor: '#8B4513', textColor: '#FFFFFF', layout: 'horizontal' },
  },
  {
    id: 'restaurant-gourmet',
    name: 'Restaurant Gourmet',
    description: 'Contraste élégant pour restauration, hôtellerie et food.',
    styleLabel: 'Noir / or · Playfair Display & Inter · Coins carrés',
    goals: ['vitrine', 'ecommerce'],
    category: 'creative',
    colors: {
      primary: '#1F1F1F',
      secondary: '#3A3A3A',
      accent: '#C9A227',
      background: '#FFFFFF',
      text: '#222222',
      muted: '#6E6E6E',
    },
    fonts: { heading: 'Playfair Display', body: 'Inter' },
    borderRadius: '6px',
    buttonStyle: 'square',
    heroBg: '#1F1F1F',
    footerBg: '#1F1F1F',
    defaultSections: ['hero', 'about', 'gallery', 'services', 'contact', 'footer'],
    headerStyle: { type: 'minimal', showLogo: true, showNav: true, backgroundColor: '#1F1F1F', textColor: '#FFFFFF', layout: 'horizontal' },
  },
  {
    id: 'freelance-creator',
    name: 'Freelance Creator',
    description: 'Moderne et dynamique pour indépendants et créateurs.',
    styleLabel: 'Indigo / vert · Space Grotesk & Inter · Pilule',
    goals: ['portfolio', 'blog', 'vitrine'],
    category: 'creative',
    colors: {
      primary: '#4F46E5',
      secondary: '#6366F1',
      accent: '#22C55E',
      background: '#F9FAFB',
      text: '#111827',
      muted: '#6B7280',
    },
    fonts: { heading: 'Space Grotesk', body: 'Inter' },
    borderRadius: '12px',
    buttonStyle: 'pill',
    heroBg: '#4F46E5',
    footerBg: '#4338CA',
    defaultSections: ['hero', 'about', 'services', 'testimonials', 'contact', 'footer'],
    headerStyle: { type: 'modern', showLogo: true, showNav: true, backgroundColor: '#4F46E5', textColor: '#FFFFFF', layout: 'horizontal' },
  },
  {
    id: 'medical-trust',
    name: 'Medical Trust',
    description: 'Style clair et crédible pour santé, services aux personnes et confiance.',
    styleLabel: 'Bleu médical · Source Sans Pro · Arrondi',
    goals: ['vitrine', 'blog'],
    category: 'professional',
    colors: {
      primary: '#0F4C81',
      secondary: '#1D70B8',
      accent: '#00A3A3',
      background: '#F5FBFF',
      text: '#1A2A33',
      muted: '#5F7480',
    },
    fonts: { heading: 'Source Sans Pro', body: 'Source Sans Pro' },
    borderRadius: '8px',
    buttonStyle: 'rounded',
    heroBg: '#0F4C81',
    footerBg: '#0F4C81',
    defaultSections: ['hero', 'about', 'services', 'contact', 'hours', 'footer'],
    headerStyle: { type: 'classic', showLogo: true, showNav: true, backgroundColor: '#0F4C81', textColor: '#FFFFFF', layout: 'horizontal' },
  },
]

export function getThemePreset(id: string): ThemePreset | undefined {
  return themePresets.find((preset) => preset.id === id)
}

export function getDefaultTheme(): ThemePreset {
  return themePresets[0]
}

/** Thèmes recommandés pour l’objectif choisi à l’étape 2 de l’onboarding */
export function getThemesForGoal(goal: ThemeGoal | string): ThemePreset[] {
  if (!goal) return themePresets
  return themePresets.filter((p) => p.goals.includes(goal as ThemeGoal))
}
