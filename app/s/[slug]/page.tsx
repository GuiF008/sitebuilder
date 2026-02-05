'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { computeTheme, generateThemeStyles } from '@/lib/themes'
import { ComputedTheme } from '@/lib/types'

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
  const data = JSON.parse(section.dataJson)

  switch (section.type) {
    case 'hero':
      return (
        <section
          className="py-20 text-center mb-8 rounded-lg"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <h1
            className="text-4xl font-bold mb-4 text-white"
            style={{ fontFamily: theme.fonts.heading }}
          >
            {data.title}
          </h1>
          <p className="text-xl text-white/80 mb-8">{data.subtitle}</p>
          {data.ctaText && (
            <a
              href={data.ctaLink || '#'}
              className="inline-block px-6 py-3 font-semibold text-white transition-transform hover:scale-105"
              style={{
                backgroundColor: theme.colors.accent,
                borderRadius:
                  theme.buttonStyle === 'pill'
                    ? '9999px'
                    : theme.buttonStyle === 'square'
                      ? '0'
                      : theme.borderRadius,
              }}
            >
              {data.ctaText}
            </a>
          )}
        </section>
      )

    case 'about':
      return (
        <section className="py-12 mb-8">
          <h2
            className="text-3xl font-bold mb-6"
            style={{ fontFamily: theme.fonts.heading, color: theme.colors.text }}
          >
            {data.title}
          </h2>
          <p
            className="text-lg leading-relaxed"
            style={{ color: theme.colors.muted }}
          >
            {data.content}
          </p>
        </section>
      )

    case 'services':
      return (
        <section className="py-12 mb-8">
          <h2
            className="text-3xl font-bold mb-8 text-center"
            style={{ fontFamily: theme.fonts.heading, color: theme.colors.text }}
          >
            {data.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {data.services?.map(
              (
                service: { icon: string; title: string; description: string },
                i: number
              ) => (
                <div
                  key={i}
                  className="p-6 rounded-lg text-center"
                  style={{ backgroundColor: `${theme.colors.primary}10` }}
                >
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3
                    className="font-bold text-lg mb-2"
                    style={{ color: theme.colors.text }}
                  >
                    {service.title}
                  </h3>
                  <p style={{ color: theme.colors.muted }}>{service.description}</p>
                </div>
              )
            )}
          </div>
        </section>
      )

    case 'gallery':
      return (
        <section className="py-12 mb-8">
          <h2
            className="text-3xl font-bold mb-8 text-center"
            style={{ fontFamily: theme.fonts.heading, color: theme.colors.text }}
          >
            {data.title}
          </h2>
          {data.images?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.images.map((img: { url: string; alt: string }, i: number) => (
                <img
                  key={i}
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          ) : (
            <p className="text-center" style={{ color: theme.colors.muted }}>
              Aucune image
            </p>
          )}
        </section>
      )

    case 'testimonials':
      return (
        <section className="py-12 mb-8">
          <h2
            className="text-3xl font-bold mb-8 text-center"
            style={{ fontFamily: theme.fonts.heading, color: theme.colors.text }}
          >
            {data.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.testimonials?.map(
              (
                t: { name: string; role: string; content: string },
                i: number
              ) => (
                <div
                  key={i}
                  className="p-6 rounded-lg"
                  style={{ backgroundColor: `${theme.colors.primary}05` }}
                >
                  <p
                    className="italic mb-4"
                    style={{ color: theme.colors.text }}
                  >
                    "{t.content}"
                  </p>
                  <div>
                    <span className="font-semibold" style={{ color: theme.colors.text }}>
                      {t.name}
                    </span>
                    {t.role && (
                      <span className="ml-2" style={{ color: theme.colors.muted }}>
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
        <section className="py-12 mb-8">
          <h2
            className="text-3xl font-bold mb-8 text-center"
            style={{ fontFamily: theme.fonts.heading, color: theme.colors.text }}
          >
            {data.title}
          </h2>
          <div className="max-w-md mx-auto text-center">
            {data.email && (
              <p style={{ color: theme.colors.muted }}>
                Email :{' '}
                <a
                  href={`mailto:${data.email}`}
                  style={{ color: theme.colors.primary }}
                  className="hover:underline"
                >
                  {data.email}
                </a>
              </p>
            )}
            {data.phone && (
              <p className="mt-2" style={{ color: theme.colors.muted }}>
                Téléphone : {data.phone}
              </p>
            )}
            {data.address && (
              <p className="mt-2" style={{ color: theme.colors.muted }}>
                Adresse : {data.address}
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
            {data.copyright}
          </p>
        </footer>
      )

    default:
      return null
  }
}
