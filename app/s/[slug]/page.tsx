'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { computeTheme, generateThemeStyles } from '@/lib/themes'
import { ComputedTheme, SectionStyles } from '@/lib/types'
import { safeJsonParse } from '@/lib/utils'
import { BlockRenderer } from '@/components/shared/BlockRenderer'

interface Snapshot {
  name: string
  themeFamily: string
  siteTheme: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    backgroundColor: string
    textColor: string
    headingFont: string
    bodyFont: string
    borderRadius: string
    buttonStyle: string
  } | null
  pages: {
    id: string
    title: string
    slug: string
    order: number
    isHome: boolean
    showInMenu: boolean
    sections: {
      id: string
      type: string
      dataJson: string
      order: number
    }[]
  }[]
}

export default function PublicSitePage() {
  const params = useParams()
  const slug = params.slug as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null)
  const [siteInfo, setSiteInfo] = useState<{ name: string; isPremium: boolean } | null>(null)
  const [theme, setTheme] = useState<ComputedTheme | null>(null)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  useEffect(() => {
    async function loadSite() {
      try {
        const response = await fetch(`/api/sites/by-slug?slug=${slug}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError('Site non trouvé')
          } else {
            setError('Erreur lors du chargement')
          }
          return
        }

        const data = await response.json()
        setSnapshot(data.snapshot)
        setSiteInfo({ name: data.site.name, isPremium: data.site.isPremium })

        // Compute theme
        const computedTheme = computeTheme(
          data.site.themeFamily,
          data.site.siteTheme
        )
        setTheme(computedTheme)

        // Find home page index
        if (data.snapshot?.pages) {
          const homeIndex = data.snapshot.pages.findIndex((p: { isHome: boolean }) => p.isHome)
          if (homeIndex !== -1) {
            setCurrentPageIndex(homeIndex)
          }
        }
      } catch (err) {
        setError('Erreur de connexion')
      } finally {
        setLoading(false)
      }
    }

    loadSite()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error || !snapshot || !theme) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">404</h1>
          <p className="text-gray-600 mb-6">{error || 'Site non trouvé'}</p>
          <Link
            href="/"
            className="text-blue-600 hover:underline"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  const sortedPages = [...snapshot.pages].sort((a, b) => a.order - b.order)
  const menuPages = sortedPages.filter((p) => p.showInMenu)
  const currentPage = sortedPages[currentPageIndex]

  return (
    <div className="min-h-screen" style={generateThemeStyles(theme)}>
      {/* Navigation */}
      {menuPages.length > 1 && (
        <nav
          className="px-6 py-4 flex items-center justify-between"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <span className="font-bold text-white" style={{ fontFamily: theme.fonts.heading }}>
            {snapshot.name}
          </span>
          <div className="flex gap-4">
            {menuPages.map((page) => {
              const pageIndex = sortedPages.findIndex((p) => p.id === page.id)
              return (
                <button
                  key={page.id}
                  onClick={() => setCurrentPageIndex(pageIndex)}
                  className={`
                    text-sm transition-colors
                    ${currentPageIndex === pageIndex
                      ? 'text-white font-semibold'
                      : 'text-white/70 hover:text-white'}
                  `}
                >
                  {page.title}
                </button>
              )
            })}
          </div>
        </nav>
      )}

      {/* Single page header if no navigation */}
      {menuPages.length <= 1 && (
        <header
          className="px-6 py-4"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <span className="font-bold text-white" style={{ fontFamily: theme.fonts.heading }}>
            {snapshot.name}
          </span>
        </header>
      )}

      {/* Page content */}
      <main style={{ backgroundColor: theme.colors.background }}>
        {currentPage && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            {currentPage.sections
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <PublicSection
                  key={section.id}
                  section={section}
                  theme={theme}
                />
              ))}
          </div>
        )}
      </main>

      {/* Freemium badge */}
      {!siteInfo?.isPremium && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg px-4 py-2 border border-gray-200">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <Image
              src="/logo/ovhcloud-logo.svg"
              alt="OVHcloud"
              width={80}
              height={24}
              className="h-5 w-auto"
            />
            <span className="text-gray-400">|</span>
            <span>Site Builder</span>
          </Link>
        </div>
      )}
    </div>
  )
}

function PublicSection({
  section,
  theme,
}: {
  section: { id: string; type: string; dataJson: string }
  theme: ComputedTheme
}) {
  const data = safeJsonParse<Record<string, unknown>>(section.dataJson, {}) || {}
  
  // Helper pour accéder aux propriétés de data de manière sécurisée
  const getDataValue = (key: string): string => {
    return (data[key] as string) || ''
  }
  
  // Styles personnalisés de la section ou thème par défaut
  const sectionStyles: SectionStyles = (data.sectionStyles as SectionStyles) || {
    backgroundColor: theme.colors.background,
    headingFont: theme.fonts.heading,
    bodyFont: theme.fonts.body,
    headingColor: theme.colors.text,
    textColor: theme.colors.text,
    buttonStyle: theme.buttonStyle,
  }

  // Si la section a des blocs de contenu, les afficher
  if (data.blocks && Array.isArray(data.blocks) && data.blocks.length > 0) {
    return (
      <section className="py-8 mb-4 px-4 rounded-lg" style={{ backgroundColor: sectionStyles.backgroundColor }}>
        <BlockRenderer 
          blocks={data.blocks as Array<{ id: string; type: string; order: number; content: string; settings?: Record<string, unknown> }>} 
          sectionStyles={sectionStyles} 
          theme={theme}
          isPublic={true}
        />
      </section>
    )
  }

  switch (section.type) {
    case 'hero':
      return (
        <section
          className="py-20 text-center mb-8 rounded-lg"
          style={{ backgroundColor: sectionStyles.backgroundColor || theme.colors.primary }}
        >
          <h1
            className="text-4xl font-bold mb-4 text-white"
            style={{ fontFamily: sectionStyles.headingFont }}
          >
            {getDataValue('title')}
          </h1>
          <p 
            className="text-xl text-white/80 mb-8"
            style={{ fontFamily: sectionStyles.bodyFont }}
          >
            {getDataValue('subtitle')}
          </p>
          {getDataValue('ctaText') && (
            <a
              href={(data.ctaLink as string) || '#'}
              className="inline-block px-6 py-3 font-semibold text-white transition-transform hover:scale-105"
              style={{
                backgroundColor: theme.colors.accent,
                borderRadius:
                  sectionStyles.buttonStyle === 'pill'
                    ? '9999px'
                    : sectionStyles.buttonStyle === 'square'
                      ? '0'
                      : theme.borderRadius,
              }}
              >
                {getDataValue('ctaText')}
              </a>
          )}
        </section>
      )

    case 'about':
      return (
        <section 
          className="py-12 mb-8 rounded-lg"
          style={{ backgroundColor: sectionStyles.backgroundColor }}
        >
          <h2
            className="text-3xl font-bold mb-6"
            style={{ fontFamily: sectionStyles.headingFont, color: sectionStyles.headingColor }}
          >
            {getDataValue('title')}
          </h2>
          <p
            className="text-lg leading-relaxed"
            style={{ fontFamily: sectionStyles.bodyFont, color: sectionStyles.textColor }}
          >
            {getDataValue('content')}
          </p>
        </section>
      )

    case 'services':
      return (
        <section 
          className="py-12 mb-8 rounded-lg"
          style={{ backgroundColor: sectionStyles.backgroundColor }}
        >
          <h2
            className="text-3xl font-bold mb-8 text-center"
            style={{ fontFamily: sectionStyles.headingFont, color: sectionStyles.headingColor }}
          >
            {getDataValue('title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {((data.services as Array<{ icon?: string; iconSrc?: string; title: string; description: string }>) || []).map(
              (
                service,
                i: number
              ) => (
                <div
                  key={i}
                  className="p-6 rounded-lg text-center"
                  style={{ backgroundColor: `${theme.colors.primary}10` }}
                >
                  {service.iconSrc ? (
                    <div className="flex justify-center mb-4">
                      <Image
                        src={service.iconSrc}
                        alt={service.title}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                  ) : service.icon ? (
                    <div className="text-4xl mb-4">{service.icon}</div>
                  ) : null}
                  <h3
                    className="font-bold text-lg mb-2"
                    style={{ fontFamily: sectionStyles.headingFont, color: sectionStyles.headingColor }}
                  >
                    {service.title}
                  </h3>
                  <p style={{ fontFamily: sectionStyles.bodyFont, color: sectionStyles.textColor }}>{service.description}</p>
                </div>
              )
            )}
          </div>
        </section>
      )

    case 'gallery':
      return (
        <section 
          className="py-12 mb-8 rounded-lg"
          style={{ backgroundColor: sectionStyles.backgroundColor }}
        >
          <h2
            className="text-3xl font-bold mb-8 text-center"
            style={{ fontFamily: sectionStyles.headingFont, color: sectionStyles.headingColor }}
          >
            {getDataValue('title')}
          </h2>
            {((data.images as Array<{ url: string; alt: string }>) || []).length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {((data.images as Array<{ url: string; alt: string }>) || []).map((img, i: number) => (
                <img
                  key={i}
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          ) : (
            <p className="text-center" style={{ fontFamily: sectionStyles.bodyFont, color: sectionStyles.textColor }}>
              Aucune image
            </p>
          )}
        </section>
      )

    case 'testimonials':
      return (
        <section 
          className="py-12 mb-8 rounded-lg"
          style={{ backgroundColor: sectionStyles.backgroundColor }}
        >
          <h2
            className="text-3xl font-bold mb-8 text-center"
            style={{ fontFamily: sectionStyles.headingFont, color: sectionStyles.headingColor }}
          >
            {getDataValue('title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {((data.testimonials as Array<{ name: string; role: string; content: string }>) || []).map(
              (
                t,
                i: number
              ) => (
                <div
                  key={i}
                  className="p-6 rounded-lg"
                  style={{ backgroundColor: `${theme.colors.primary}05` }}
                >
                  <p
                    className="italic mb-4"
                    style={{ fontFamily: sectionStyles.bodyFont, color: sectionStyles.textColor }}
                  >
                    "{t.content}"
                  </p>
                  <div>
                    <span className="font-semibold" style={{ fontFamily: sectionStyles.headingFont, color: sectionStyles.headingColor }}>
                      {t.name}
                    </span>
                    {t.role && (
                      <span className="ml-2" style={{ fontFamily: sectionStyles.bodyFont, color: sectionStyles.textColor }}>
                        — {t.role}
                      </span>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      )

    case 'contact':
      return (
        <section 
          className="py-12 mb-8 rounded-lg"
          style={{ backgroundColor: sectionStyles.backgroundColor }}
        >
          <h2
            className="text-3xl font-bold mb-8 text-center"
            style={{ fontFamily: sectionStyles.headingFont, color: sectionStyles.headingColor }}
          >
            {getDataValue('title')}
          </h2>
          <div className="max-w-md mx-auto text-center">
            {getDataValue('email') && (
              <p style={{ fontFamily: sectionStyles.bodyFont, color: sectionStyles.textColor }}>
                Email :{' '}
                <a
                  href={`mailto:${getDataValue('email')}`}
                  style={{ color: theme.colors.primary }}
                  className="hover:underline"
                >
                  {getDataValue('email')}
                </a>
              </p>
            )}
            {getDataValue('phone') && (
              <p className="mt-2" style={{ fontFamily: sectionStyles.bodyFont, color: sectionStyles.textColor }}>
                Téléphone : {getDataValue('phone')}
              </p>
            )}
            {getDataValue('address') && (
              <p className="mt-2" style={{ fontFamily: sectionStyles.bodyFont, color: sectionStyles.textColor }}>
                Adresse : {getDataValue('address')}
              </p>
            )}
          </div>
        </section>
      )

    case 'footer':
      return (
        <footer
          className="py-8 border-t mt-8"
          style={{ borderColor: `${theme.colors.muted}30` }}
        >
          <p
            className="text-center text-sm"
            style={{ color: theme.colors.muted }}
          >
            {getDataValue('copyright')}
          </p>
        </footer>
      )

    default:
      return null
  }
}

// PublicBlockRenderer est maintenant remplacé par BlockRenderer partagé
