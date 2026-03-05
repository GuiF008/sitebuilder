'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { computeTheme, generateThemeStyles } from '@/lib/themes'
import { Header } from '@/components/shared/Header'
import { ComputedTheme } from '@/lib/types'
import { PublicSection } from '@/components/public/PublicSectionRenderer'

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
  const searchParams = useSearchParams()
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

        const computedTheme = computeTheme(
          data.site.themeFamily,
          data.site.siteTheme
        )
        setTheme(computedTheme)

        if (data.snapshot?.pages) {
          const pageSlug = searchParams.get('page')
          const idx = pageSlug
            ? data.snapshot.pages.findIndex((p: { slug: string }) => p.slug === pageSlug)
            : data.snapshot.pages.findIndex((p: { isHome: boolean }) => p.isHome)
          setCurrentPageIndex(idx !== -1 ? idx : 0)
        }
      } catch (err) {
        setError('Erreur de connexion')
      } finally {
        setLoading(false)
      }
    }

    loadSite()
  }, [slug, searchParams])

  // Sync page index when ?page= changes (client navigation)
  useEffect(() => {
    if (!snapshot?.pages) return
    const pageSlug = searchParams.get('page')
    const idx = pageSlug
      ? snapshot.pages.findIndex((p: { slug: string }) => p.slug === pageSlug)
      : snapshot.pages.findIndex((p: { isHome: boolean }) => p.isHome)
    if (idx !== -1) setCurrentPageIndex(idx)
  }, [snapshot, searchParams])

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
      {menuPages.length > 0 && (
        <Header
          siteName={snapshot.name}
          menuPages={menuPages.map(p => ({ id: p.id, title: p.title }))}
          currentPageId={currentPage?.id}
          themeFamily={snapshot.themeFamily}
          theme={theme}
          onPageClick={(pageId) => {
            const pageIndex = sortedPages.findIndex((p) => p.id === pageId)
            if (pageIndex !== -1) {
              setCurrentPageIndex(pageIndex)
            }
          }}
        />
      )}

      {/* Single page header if no navigation - blanc par défaut */}
      {menuPages.length <= 1 && (
        <header
          className="px-6 py-4 border-b border-ovh-gray-200"
          style={{
            backgroundColor: '#FFFFFF',
            color: theme.colors.text || '#1F2937',
          }}
        >
          <span className="font-bold" style={{ fontFamily: theme.fonts.heading }}>
            {snapshot.name}
          </span>
        </header>
      )}

      {/* Page content - sections pleine largeur */}
      <main style={{ backgroundColor: theme.colors.background }}>
        {currentPage && (
          <div className="w-full py-8">
            {currentPage.sections
              .sort((a, b) => a.order - b.order)
              .map((section, index) => (
                <PublicSection
                  key={section.id}
                  section={section}
                  sectionIndex={index}
                  theme={theme}
                  themeFamily={snapshot.themeFamily}
                  publicBasePath={`/s/${slug}`}
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

