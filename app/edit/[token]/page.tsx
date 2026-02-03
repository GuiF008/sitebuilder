'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { SettingsModal } from '@/components/editor'
import { SiteWithRelations, PageWithSections, ComputedTheme } from '@/lib/types'
import { computeTheme, generateThemeStyles } from '@/lib/themes'

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [site, setSite] = useState<SiteWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [isPublishing, setIsPublishing] = useState(false)

  // Load site
  useEffect(() => {
    async function loadSite() {
      try {
        const response = await fetch(`/api/sites/by-token?token=${token}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError('Site non trouvé. Vérifiez votre lien.')
          } else {
            setError('Erreur lors du chargement du site')
          }
          return
        }
        const data = await response.json()
        setSite(data.site)
      } catch (err) {
        setError('Erreur de connexion')
      } finally {
        setLoading(false)
      }
    }

    loadSite()
  }, [token])

  // Compute theme
  const theme: ComputedTheme | null = site
    ? computeTheme(site.themeFamily, site.siteTheme)
    : null

  // Sort pages by order
  const sortedPages = site
    ? [...site.pages].sort((a, b) => a.order - b.order)
    : []

  const currentPage = sortedPages[currentPageIndex]

  // Pages visible in menu
  const menuPages = sortedPages.filter((p) => p.showInMenu)

  // Auto-save indicator
  const showSaveStatus = () => {
    setSaveStatus('saving')
    setTimeout(() => setSaveStatus('saved'), 500)
    setTimeout(() => setSaveStatus('idle'), 2000)
  }

  // Handlers
  const handleThemeChange = async (updates: Record<string, string>) => {
    if (!site) return

    // Optimistic update
    const newSiteTheme = {
      ...(site.siteTheme || {
        id: '',
        siteId: site.id,
        primaryColor: '#000E9C',
        secondaryColor: '#0050D7',
        accentColor: '#00D4AA',
        backgroundColor: '#FFFFFF',
        textColor: '#212529',
        headingFont: 'Source Sans Pro',
        bodyFont: 'Source Sans Pro',
        borderRadius: '8px',
        buttonStyle: 'rounded',
      }),
      ...updates,
    }

    // Handle themeFamily change
    if (updates.themeFamily) {
      setSite((prev) => prev ? { 
        ...prev, 
        themeFamily: updates.themeFamily,
        siteTheme: newSiteTheme as typeof prev.siteTheme
      } : null)
    } else {
      setSite((prev) => prev ? { 
        ...prev, 
        siteTheme: newSiteTheme as typeof prev.siteTheme 
      } : null)
    }

    showSaveStatus()

    // Persist
    try {
      await fetch(`/api/sites/${site.id}/theme`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
    } catch (err) {
      console.error('Failed to save theme:', err)
    }
  }

  const handlePageCreate = async (title: string) => {
    if (!site) return

    try {
      const response = await fetch(`/api/sites/${site.id}/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      const data = await response.json()
      
      setSite((prev) => prev ? {
        ...prev,
        pages: [...prev.pages, data.page],
      } : null)
      
      showSaveStatus()
    } catch (err) {
      console.error('Failed to create page:', err)
    }
  }

  const handlePageUpdate = async (pageId: string, updates: Partial<PageWithSections>) => {
    if (!site) return

    // Optimistic update
    setSite((prev) => prev ? {
      ...prev,
      pages: prev.pages.map((p) =>
        p.id === pageId ? { ...p, ...updates } : p
      ),
    } : null)

    showSaveStatus()

    try {
      await fetch(`/api/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
    } catch (err) {
      console.error('Failed to update page:', err)
    }
  }

  const handlePageDelete = async (pageId: string) => {
    if (!site) return

    setSite((prev) => prev ? {
      ...prev,
      pages: prev.pages.filter((p) => p.id !== pageId),
    } : null)

    // Adjust current page index if needed
    if (currentPageIndex >= sortedPages.length - 1) {
      setCurrentPageIndex(Math.max(0, currentPageIndex - 1))
    }

    showSaveStatus()

    try {
      await fetch(`/api/pages/${pageId}`, { method: 'DELETE' })
    } catch (err) {
      console.error('Failed to delete page:', err)
    }
  }

  const handlePageReorder = async (pageId: string, direction: 'up' | 'down') => {
    if (!site) return

    const pageIndex = sortedPages.findIndex((p) => p.id === pageId)
    if (pageIndex === -1) return

    const targetIndex = direction === 'up' ? pageIndex - 1 : pageIndex + 1
    if (targetIndex < 0 || targetIndex >= sortedPages.length) return

    const targetPage = sortedPages[targetIndex]
    const currentPage = sortedPages[pageIndex]

    // Swap orders
    const updates = [
      { id: currentPage.id, order: targetPage.order },
      { id: targetPage.id, order: currentPage.order },
    ]

    // Optimistic update
    setSite((prev) => prev ? {
      ...prev,
      pages: prev.pages.map((p) => {
        const update = updates.find((u) => u.id === p.id)
        return update ? { ...p, order: update.order } : p
      }),
    } : null)

    // Update current page index to follow the moved page
    if (pageIndex === currentPageIndex) {
      setCurrentPageIndex(targetIndex)
    } else if (targetIndex === currentPageIndex) {
      setCurrentPageIndex(pageIndex)
    }

    showSaveStatus()

    try {
      await fetch(`/api/sites/${site.id}/pages/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      })
    } catch (err) {
      console.error('Failed to reorder pages:', err)
    }
  }

  const handleMediaUpload = async (file: File) => {
    if (!site) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`/api/sites/${site.id}/media`, {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()

      setSite((prev) => prev ? {
        ...prev,
        media: [...prev.media, data.media],
      } : null)

      showSaveStatus()
    } catch (err) {
      console.error('Failed to upload media:', err)
    }
  }

  const handleMediaDelete = async (mediaId: string) => {
    if (!site) return

    setSite((prev) => prev ? {
      ...prev,
      media: prev.media.filter((m) => m.id !== mediaId),
    } : null)

    showSaveStatus()

    try {
      await fetch(`/api/media/${mediaId}`, { method: 'DELETE' })
    } catch (err) {
      console.error('Failed to delete media:', err)
    }
  }

  const handlePublish = async () => {
    if (!site) return

    setIsPublishing(true)
    try {
      const response = await fetch(`/api/sites/${site.id}/publish`, {
        method: 'POST',
      })
      
      if (response.ok) {
        const data = await response.json()
        setSite((prev) => prev ? {
          ...prev,
          publishState: data.publishState,
        } : null)
        
        alert(`Site publié ! Accessible sur /s/${site.slug}`)
      }
    } catch (err) {
      console.error('Failed to publish:', err)
      alert('Erreur lors de la publication')
    } finally {
      setIsPublishing(false)
    }
  }

  // Drag & Drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const hasFiles = e.dataTransfer.types.includes('Files')
    if (hasFiles) {
      setIsDraggingFile(true)
    }
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    // Only hide if leaving the entire editor zone
    if (e.currentTarget === e.target) {
      setIsDraggingFile(false)
    }
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingFile(false)

    const files = Array.from(e.dataTransfer.files).filter(
      (f) => f.type.startsWith('image/') || f.type.startsWith('video/') || f.type.startsWith('audio/')
    )

    for (const file of files) {
      await handleMediaUpload(file)
    }
  }, [site])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-ovh-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-ovh-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-ovh-gray-600">Chargement de l'éditeur...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !site || !theme) {
    return (
      <div className="min-h-screen bg-ovh-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-ovh-gray-900 mb-2">Oups !</h1>
          <p className="text-ovh-gray-600 mb-6">{error || 'Site non trouvé'}</p>
          <Link href="/">
            <Button>Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={generateThemeStyles(theme)}
    >
      {/* Top bar */}
      <header className="h-[60px] bg-white border-b border-ovh-gray-200 flex items-center justify-between px-4 flex-shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="p-2 hover:bg-ovh-gray-100 rounded-ovh transition-colors"
            data-testid="menu-toggle"
          >
            <svg className="w-6 h-6 text-ovh-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/" className="p-2 hover:bg-ovh-gray-100 rounded-ovh transition-colors">
            <svg className="w-5 h-5 text-ovh-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="font-bold text-lg text-ovh-gray-900">{site.name}</h1>
        </div>

        <div className="flex items-center gap-2">
          {site.publishState?.isPublished && (
            <Link 
              href={`/s/${site.slug}`}
              target="_blank"
              className="text-sm text-ovh-gray-500 hover:text-ovh-primary flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Voir le site
            </Link>
          )}
          <Link href="/upgrade">
            <Button variant="outline" size="sm">
              Upgrade
            </Button>
          </Link>
          <Button 
            size="sm" 
            onClick={handlePublish}
            disabled={isPublishing}
          >
            {isPublishing ? 'Publication...' : 'Publier'}
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex relative">
        {/* Settings Modal */}
        <SettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          site={site}
          theme={theme}
          currentPageIndex={currentPageIndex}
          onSiteUpdate={(updates) => setSite((prev) => prev ? { ...prev, ...updates } : null)}
          onPageSelect={setCurrentPageIndex}
          onPageCreate={handlePageCreate}
          onPageUpdate={handlePageUpdate}
          onPageDelete={handlePageDelete}
          onPageReorder={handlePageReorder}
          onThemeChange={handleThemeChange}
          onMediaUpload={handleMediaUpload}
          onMediaDelete={handleMediaDelete}
        />

        {/* Editor area */}
        <main 
          className={`
            flex-1 transition-all duration-300 flex flex-col
            ${settingsOpen ? 'ml-[420px]' : 'ml-0'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Page tabs */}
          {sortedPages.length > 1 && (
            <div className="bg-white border-b border-ovh-gray-200 px-4 py-2 flex gap-1 overflow-x-auto flex-shrink-0">
              {sortedPages.map((page, index) => (
                <button
                  key={page.id}
                  onClick={() => setCurrentPageIndex(index)}
                  className={`
                    px-4 py-2 rounded-ovh whitespace-nowrap text-sm font-medium transition-colors page-tab
                    ${currentPageIndex === index
                      ? 'text-white'
                      : 'text-ovh-gray-600 hover:bg-ovh-gray-100'}
                  `}
                  style={{
                    backgroundColor: currentPageIndex === index ? theme.colors.primary : undefined,
                  }}
                >
                  {page.isHome && '🏠 '}{page.title}
                </button>
              ))}
            </div>
          )}

          {/* Navigation preview */}
          {menuPages.length > 1 && (
            <nav 
              className="px-6 py-4 flex items-center justify-between nav-preview"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <span className="font-bold text-white">{site.name}</span>
              <div className="flex gap-4">
                {menuPages.map((page, idx) => {
                  const pageIndex = sortedPages.findIndex((p) => p.id === page.id)
                  return (
                    <button
                      key={page.id}
                      onClick={() => setCurrentPageIndex(pageIndex)}
                      className={`
                        text-sm transition-colors
                        ${currentPageIndex === pageIndex ? 'text-white font-semibold' : 'text-white/70 hover:text-white'}
                      `}
                    >
                      {page.title}
                    </button>
                  )
                })}
              </div>
            </nav>
          )}

          {/* Page content preview */}
          <div 
            className="flex-1 overflow-auto editor-zone"
            style={{ backgroundColor: theme.colors.background }}
          >
            {currentPage ? (
              <div className="max-w-4xl mx-auto p-8">
                {currentPage.sections
                  .sort((a, b) => a.order - b.order)
                  .map((section) => (
                    <SectionPreview
                      key={section.id}
                      section={section}
                      theme={theme}
                    />
                  ))}
                
                {currentPage.sections.length === 0 && (
                  <div className="text-center py-20 text-ovh-gray-400">
                    <p className="text-lg mb-2">Cette page est vide</p>
                    <p className="text-sm">Ajoutez du contenu via les paramètres</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-ovh-gray-400">
                Aucune page sélectionnée
              </div>
            )}
          </div>
        </main>

        {/* Drag overlay */}
        {isDraggingFile && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center drag-overlay"
            style={{ backgroundColor: `${theme.colors.primary}ee` }}
            onDragOver={handleDragOver}
            onDragLeave={() => setIsDraggingFile(false)}
            onDrop={handleDrop}
          >
            <div className="text-white text-center">
              <svg className="w-20 h-20 mx-auto mb-4 animate-bounce-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-2xl font-bold mb-2">Déposez vos images ici</p>
              <p className="text-white/80">Elles seront ajoutées à votre médiathèque</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <footer className="h-[52px] bg-white border-t border-ovh-gray-200 flex items-center justify-between px-4 flex-shrink-0 z-30">
        <div className="flex items-center gap-2 text-sm text-ovh-gray-500">
          {saveStatus === 'saving' && (
            <>
              <div className="w-3 h-3 border-2 border-ovh-primary border-t-transparent rounded-full animate-spin" />
              Enregistrement...
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Modifications enregistrées
            </>
          )}
          {saveStatus === 'idle' && (
            <span className="text-ovh-gray-400">✓ Modifications en temps réel</span>
          )}
        </div>
        <div className="text-sm text-ovh-gray-500">
          Thème : <span className="font-medium">{theme.name}</span>
        </div>
      </footer>
    </div>
  )
}

// Section preview component
function SectionPreview({ 
  section, 
  theme 
}: { 
  section: { id: string; type: string; dataJson: string }
  theme: ComputedTheme 
}) {
  const data = JSON.parse(section.dataJson)

  switch (section.type) {
    case 'hero':
      return (
        <section className="py-20 text-center mb-8 rounded-ovh-lg" style={{ backgroundColor: theme.colors.primary }}>
          <h1 
            className="text-4xl font-bold mb-4 text-white"
            style={{ fontFamily: theme.fonts.heading }}
            contentEditable
            suppressContentEditableWarning
          >
            {data.title}
          </h1>
          <p 
            className="text-xl text-white/80 mb-8"
            contentEditable
            suppressContentEditableWarning
          >
            {data.subtitle}
          </p>
          <button
            className="px-6 py-3 font-semibold text-white"
            style={{ 
              backgroundColor: theme.colors.accent,
              borderRadius: theme.buttonStyle === 'pill' ? '9999px' : theme.buttonStyle === 'square' ? '0' : theme.borderRadius,
            }}
          >
            {data.ctaText}
          </button>
        </section>
      )

    case 'about':
      return (
        <section className="py-12 mb-8">
          <h2 
            className="text-3xl font-bold mb-6"
            style={{ fontFamily: theme.fonts.heading, color: theme.colors.text }}
            contentEditable
            suppressContentEditableWarning
          >
            {data.title}
          </h2>
          <p 
            className="text-lg leading-relaxed"
            style={{ color: theme.colors.muted }}
            contentEditable
            suppressContentEditableWarning
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
            contentEditable
            suppressContentEditableWarning
          >
            {data.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {data.services?.map((service: { icon: string; title: string; description: string }, i: number) => (
              <div 
                key={i} 
                className="p-6 rounded-ovh-lg text-center"
                style={{ backgroundColor: `${theme.colors.primary}10` }}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 
                  className="font-bold text-lg mb-2"
                  style={{ color: theme.colors.text }}
                  contentEditable
                  suppressContentEditableWarning
                >
                  {service.title}
                </h3>
                <p 
                  style={{ color: theme.colors.muted }}
                  contentEditable
                  suppressContentEditableWarning
                >
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )

    case 'contact':
      return (
        <section className="py-12 mb-8">
          <h2 
            className="text-3xl font-bold mb-8 text-center"
            style={{ fontFamily: theme.fonts.heading, color: theme.colors.text }}
            contentEditable
            suppressContentEditableWarning
          >
            {data.title}
          </h2>
          <div className="max-w-md mx-auto text-center">
            <p style={{ color: theme.colors.muted }}>
              Email : <span contentEditable suppressContentEditableWarning>{data.email}</span>
            </p>
          </div>
        </section>
      )

    case 'footer':
      return (
        <footer className="py-8 border-t mt-8" style={{ borderColor: `${theme.colors.muted}30` }}>
          <p 
            className="text-center text-sm"
            style={{ color: theme.colors.muted }}
            contentEditable
            suppressContentEditableWarning
          >
            {data.copyright}
          </p>
        </footer>
      )

    default:
      return (
        <div className="py-8 text-center text-ovh-gray-400 border border-dashed border-ovh-gray-300 rounded-ovh mb-4">
          Section : {section.type}
        </div>
      )
  }
}
