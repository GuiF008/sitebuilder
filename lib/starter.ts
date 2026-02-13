import { getThemePreset, getDefaultTheme } from './themes/presets'

interface SectionTemplate {
  type: string
  dataJson: string
  order: number
}

/**
 * Génère le contenu initial pour une section
 */
function getDefaultSectionData(type: string, siteName: string): object {
  switch (type) {
    case 'hero':
      return {
        title: `Bienvenue sur ${siteName}`,
        subtitle: 'Votre partenaire de confiance pour tous vos projets',
        ctaText: 'Découvrir',
        ctaLink: '#about',
      }
    case 'about':
      return {
        title: 'À propos',
        content: `${siteName} est une entreprise passionnée par son métier. Nous mettons notre expertise au service de nos clients pour leur offrir des solutions adaptées à leurs besoins.`,
      }
    case 'services':
      return {
        title: 'Nos services',
        services: [
          {
            iconSrc: '/pictos/trophy.png',
            title: 'Conseil',
            description: 'Un accompagnement personnalisé pour vos projets',
          },
          {
            iconSrc: '/pictos/speed.png',
            title: 'Réactivité',
            description: 'Une équipe disponible et réactive',
          },
          {
            iconSrc: '/pictos/star.png',
            title: 'Qualité',
            description: 'Un travail soigné et des finitions parfaites',
          },
        ],
      }
    case 'gallery':
      return {
        title: 'Nos réalisations',
        images: [],
      }
    case 'testimonials':
      return {
        title: 'Témoignages',
        testimonials: [
          {
            name: 'Marie D.',
            role: 'Cliente',
            content: 'Un service exceptionnel ! Je recommande vivement.',
          },
          {
            name: 'Pierre L.',
            role: 'Client',
            content: 'Professionnalisme et qualité au rendez-vous.',
          },
        ],
      }
    case 'contact':
      return {
        title: 'Contactez-nous',
        email: 'contact@example.com',
        showForm: true,
      }
    case 'footer':
      return {
        copyright: `© ${new Date().getFullYear()} ${siteName}. Tous droits réservés.`,
        links: [
          { label: 'Mentions légales', url: '#' },
          { label: 'Politique de confidentialité', url: '#' },
        ],
      }
    case 'hours':
      return {
        title: 'Horaires',
        schedule: [
          { day: 'Lundi - Vendredi', hours: '9h - 18h' },
          { day: 'Samedi', hours: '10h - 16h' },
          { day: 'Dimanche', hours: 'Fermé' },
        ],
      }
    default:
      return {}
  }
}

/**
 * Génère les sections initiales pour une page d'accueil
 */
export function generateStarterSections(
  siteName: string,
  themeFamily: string,
  selectedSections: string[]
): SectionTemplate[] {
  const preset = getThemePreset(themeFamily) || getDefaultTheme()
  
  // Sections à créer : celles sélectionnées + les sections obligatoires du thème
  const sectionsToCreate = new Set<string>([
    'hero', // Toujours présent
    ...selectedSections,
    'footer', // Toujours présent
    ...(preset.defaultSections || []), // Sections par défaut du preset
  ])

  // Ordre des sections
  const sectionOrder = ['hero', 'about', 'services', 'gallery', 'testimonials', 'hours', 'contact', 'footer']
  
  const sections: SectionTemplate[] = []
  let order = 0

  for (const type of sectionOrder) {
    if (sectionsToCreate.has(type)) {
      // Allow theme-specific overrides for default data
      const baseData = getDefaultSectionData(type, siteName)
      let themedData = baseData

      if (preset.id === 'ovh-modern') {
        if (type === 'hero') {
          themedData = {
            ...baseData,
            subtitle: 'Hébergé par OVHcloud — fiable et sécurisé',
            ctaText: 'Commencer',
            imageSrc: '/hosting-hero.webp',
          }
        }

        if (type === 'about') {
          themedData = {
            ...baseData,
            content: `${siteName} — présent sur OVHcloud. Nous fournissons des solutions performantes et sécurisées.`,
          }
        }
      }

      sections.push({
        type,
        dataJson: JSON.stringify(themedData),
        order: order++,
      })
    }
  }

  return sections
}

/**
 * Mappe les objectifs aux sections recommandées
 */
export function getSuggestedSections(goal: string): string[] {
  const goalSections: Record<string, string[]> = {
    vitrine: ['about', 'services', 'contact'],
    portfolio: ['about', 'gallery', 'testimonials', 'contact'],
    blog: ['about', 'contact'],
    ecommerce: ['about', 'services', 'testimonials', 'contact'],
  }

  return goalSections[goal] || ['about', 'services', 'contact']
}
