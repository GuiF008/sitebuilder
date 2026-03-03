'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { computeTheme, generateThemeStyles } from '@/lib/themes'
import { Header } from '@/components/shared/Header'
import { ComputedTheme } from '@/lib/types'
import { getThemeBranding } from '@/lib/themes/branding'
import { PublicSection } from '@/components/public/PublicSectionRenderer'

interface SiteSnapshot {
  name: string
  themeFamily: string
  siteTheme: Record<string, string> | null
  pages: {
    id: string
    title: string
    slug: string
    order: number
    isHome: boolean
    showInMenu: boolean
    sections: { id: string; type: string; dataJson: string; order: number }[]
  }[]
}

export default function PreviewPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const token = params.token as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [site, setSite] = useState<SiteSnapshot | null>(null)
  const [theme, setTheme] = useState<ComputedTheme | null>(null)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  useEffect(() => {
    async function loadSite() {
      try {
        const response = await fetch(`/api/sites/by-token?token=${token}`)
        if (!response.ok) {
          setError('Site non trouvé')
          return
        }
        const data = await response.json()
        const s = data.site
        setSite({
          name: s.name,
          themeFamily: s.themeFamily,
          siteTheme: s.siteTheme,
          pages: s.pages || [],
        })
        setTheme(computeTheme(s.themeFamily, s.siteTheme))
        const pages = s.pages || []
        if (pages.length > 0) {
          const pageSlug = searchParams.get('page')
          const idx = pageSlug
            ? pages.findIndex((p: { slug: string }) => p.slug === pageSlug)
            : pages.findIndex((p: { isHome: boolean }) => p.isHome)
          setCurrentPageIndex(idx !== -1 ? idx : 0)
        }
      } catch {
        setError('Erreur de connexion')
      } finally {
        setLoading(false)
      }
    }
    loadSite()
  }, [token, searchParams])

  useEffect(() => {
    if (!site?.pages) return
    const pageSlug = searchParams.get('page')
    const idx = pageSlug
      ? site.pages.findIndex((p) => p.slug === pageSlug)
      : site.pages.findIndex((p) => p.isHome)
    if (idx !== -1) setCurrentPageIndex(idx)
  }, [site, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement de l&apos;aperçu...</p>
        </div>
      </div>
    )
  }

  if (error || !site || !theme) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Aperçu non disponible</h1>
          <p className="text-gray-600 mb-6">{error || 'Site non trouvé'}</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    )
  }

  const sortedPages = [...site.pages].sort((a, b) => a.order - b.order)
  const menuPages = sortedPages.filter((p) => p.showInMenu)
  const currentPage = sortedPages[currentPageIndex]

  return (
    <div className="min-h-screen" style={generateThemeStyles(theme)}>
      {/* Badge Aperçu (non publié) */}
      <div className="fixed top-4 right-4 z-50 bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg">
        Aperçu (non publié)
      </div>

      {menuPages.length > 0 && (
        <Header
          siteName={site.name}
          menuPages={menuPages.map((p) => ({ id: p.id, title: p.title }))}
          currentPageId={currentPage?.id}
          themeFamily={site.themeFamily}
          theme={theme}
          onPageClick={(pageId) => {
            const pageIndex = sortedPages.findIndex((p) => p.id === pageId)
            if (pageIndex !== -1) setCurrentPageIndex(pageIndex)
          }}
        />
      )}

      {menuPages.length <= 1 && (
        <header
          className="px-6 py-4 border-b border-ovh-gray-200"
          style={{ backgroundColor: '#FFFFFF', color: theme.colors.text || '#1F2937' }}
        >
          <span className="font-bold" style={{ fontFamily: theme.fonts.heading }}>
            {site.name}
          </span>
        </header>
      )}

      <main style={{ backgroundColor: theme.colors.background }}>
        {currentPage && (
          <div className="w-full px-4 py-8">
            {currentPage.sections
              .sort((a, b) => a.order - b.order)
              .map((section, index) => (
                <PublicSection
                  key={section.id}
                  section={section}
                  sectionIndex={index}
                  theme={theme}
                  themeFamily={site.themeFamily}
                  publicBasePath={`/preview/${token}`}
                />
              ))}
          </div>
        )}
      </main>

      <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg px-4 py-2 border border-gray-200">
        <Link href={`/edit/${token}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <span>Retour à l&apos;éditeur</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
