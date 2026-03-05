'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui'
import { SettingsModal } from '@/components/editor'
import { SectionEditorModal } from '@/components/editor/SectionEditorModal'
import { SectionInlineSettingsModal } from '@/components/editor/SectionInlineSettingsModal'
import { Header } from '@/components/shared/Header'
import { SiteWithRelations, PageWithSections, ComputedTheme, SectionStyles, ContentBlockType } from '@/lib/types'
import { computeTheme, generateThemeStyles } from '@/lib/themes'
import { safeJsonParse } from '@/lib/utils'
import { BlockRenderer, type BlockData } from '@/components/shared/BlockRenderer'
import { BlockSettingsModal } from '@/components/editor/BlockSettingsModal'
import { getThemeBranding } from '@/lib/themes/branding'
import { PICTOS } from '@/lib/pictos'
import { PictoIcon } from '@/components/shared/PictoIcon'
import { SocialIconLogo } from '@/components/shared/SocialIconLogo'

/** Modale de connexion pour "Enregistrer un brouillon" – design type OVHcloud (capture) */
function DraftLoginModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[400px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-8">
          <div className="flex justify-end -mt-2 -mr-2 mb-2">
            <button type="button" onClick={onClose} className="p-2 hover:bg-ovh-gray-100 rounded-lg transition-colors text-ovh-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <h2 className="text-xl font-bold text-center text-ovh-primary mb-1">Connectez-vous</h2>
          <p className="text-center text-sm text-ovh-gray-500 mb-6">
            Vous n&apos;avez pas de compte ?{' '}
            <button type="button" className="text-ovh-primary font-medium hover:underline">Créer un compte</button>
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ovh-gray-700 mb-1">Email ou identifiant *</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-2 focus:ring-ovh-primary focus:border-ovh-primary text-ovh-gray-900"
                placeholder="Email ou identifiant"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ovh-gray-700 mb-1">Mot de passe *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-2 focus:ring-ovh-primary focus:border-ovh-primary text-ovh-gray-900 pr-10"
                  placeholder="Mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-ovh-gray-500 hover:text-ovh-gray-700 rounded"
                  title={showPassword ? 'Masquer' : 'Afficher'}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded border-ovh-gray-300 text-ovh-primary focus:ring-ovh-primary" />
              <span className="text-sm text-ovh-gray-600">Se souvenir de ce compte</span>
            </label>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full mt-6 px-4 py-3 bg-ovh-primary text-white font-semibold rounded-ovh hover:bg-ovh-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ovh-primary transition-colors"
          >
            Se connecter
          </button>
          <p className="text-center mt-4">
            <button type="button" className="text-sm text-ovh-gray-500 hover:underline">Mot de passe oublié ?</button>
          </p>
        </div>
      </div>
    </div>
  )
}

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
  const [uploadToast, setUploadToast] = useState<number>(0) // Nombre d'images uploadées
  const [isSaving, setIsSaving] = useState(false)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [showAddSectionModal, setShowAddSectionModal] = useState(false)
  const [copiedSectionData, setCopiedSectionData] = useState<{ type: string; dataJson: string } | null>(null)
  const [sectionMenuOpen, setSectionMenuOpen] = useState<string | null>(null)
  const [draftLoginModalOpen, setDraftLoginModalOpen] = useState(false)

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

      if (!response.ok) {
        const msg = data?.error || `Erreur ${response.status}`
        alert(`Échec de l'upload : ${msg}`)
        return
      }

      setSite((prev) => prev ? {
        ...prev,
        media: [...prev.media, data.media],
      } : null)

      showSaveStatus()
    } catch (err) {
      console.error('Failed to upload media:', err)
      alert(`Échec de l'upload : ${err instanceof Error ? err.message : 'Erreur réseau'}`)
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

  const handleSectionCreate = async (pageId: string, type: string) => {
    if (!site) return

    try {
      const response = await fetch(`/api/pages/${pageId}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })
      const data = await response.json()

      setSite((prev) => prev ? {
        ...prev,
        pages: prev.pages.map((p) =>
          p.id === pageId
            ? { ...p, sections: [...p.sections, data.section] }
            : p
        ),
      } : null)

      // Sélectionner automatiquement la nouvelle section
      setSelectedSectionId(data.section.id)

      showSaveStatus()
    } catch (err) {
      console.error('Failed to create section:', err)
    }
  }

  const handleSectionDuplicate = async (section: { id: string; type: string; dataJson: string }) => {
    if (!site || !currentPage) return
    try {
      const response = await fetch(`/api/pages/${currentPage.id}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: section.type }),
      })
      const data = await response.json()
      await fetch(`/api/sections/${data.section.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataJson: section.dataJson }),
      })
      const refreshed = await fetch(`/api/sites/by-token?token=${token}`)
      if (refreshed.ok) {
        const j = await refreshed.json()
        setSite(j.site)
        setSelectedSectionId(data.section.id)
      }
      showSaveStatus()
    } catch (err) {
      console.error('Failed to duplicate section:', err)
    }
  }

  const handleSectionUpdate = async (sectionId: string, updates: Record<string, unknown>) => {
    if (!site) return

    // Trouver la section actuelle pour fusionner les données
    let currentData: Record<string, unknown> = {}
    for (const page of site.pages) {
      const section = page.sections.find(s => s.id === sectionId)
      if (section) {
        currentData = safeJsonParse<Record<string, unknown>>(section.dataJson, {}) || {}
        break
      }
    }

    const mergedData = { ...currentData, ...updates }

    // Optimistic update
    setSite((prev) => prev ? {
      ...prev,
      pages: prev.pages.map((p) => ({
        ...p,
        sections: p.sections.map((s) =>
          s.id === sectionId
            ? { ...s, dataJson: JSON.stringify(mergedData) }
            : s
        ),
      })),
    } : null)

    showSaveStatus()

    try {
      await fetch(`/api/sections/${sectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataJson: JSON.stringify(mergedData) }),
      })
    } catch (err) {
      console.error('Failed to update section:', err)
    }
  }

  const generateBlockId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const handleAddBlockToSection = (sectionId: string, blockType: ContentBlockType, options?: { elementId?: string }) => {
    if (!site || !currentPage) return
    const section = currentPage.sections.find(s => s.id === sectionId)
    if (!section) return
    const currentData = safeJsonParse<Record<string, unknown>>(section.dataJson, {}) || {}
    let blocks = (currentData.blocks as Array<{ id: string; type: string; order: number; content: string; settings?: Record<string, unknown> }>) || []

    // Si la section n'a pas encore de blocs mais a des champs legacy (title, content, etc.), les convertir en blocs pour ne rien perdre
    if (blocks.length === 0) {
      const initialBlocks: Array<{ id: string; type: string; order: number; content: string; settings?: Record<string, unknown> }> = []
      let order = 0
      if (currentData.title && typeof currentData.title === 'string') {
        initialBlocks.push({ id: generateBlockId(), type: 'title', order: order++, content: currentData.title as string })
      }
      if (currentData.subtitle && typeof currentData.subtitle === 'string') {
        initialBlocks.push({ id: generateBlockId(), type: 'subtitle', order: order++, content: currentData.subtitle as string })
      }
      if (currentData.image && typeof currentData.image === 'string') {
        initialBlocks.push({ id: generateBlockId(), type: 'image', order: order++, content: currentData.image as string })
      }
      if (currentData.content && typeof currentData.content === 'string') {
        initialBlocks.push({ id: generateBlockId(), type: 'text', order: order++, content: currentData.content as string })
      }
      if (currentData.ctaText && typeof currentData.ctaText === 'string') {
        initialBlocks.push({
          id: generateBlockId(),
          type: 'button',
          order: order++,
          content: currentData.ctaText as string,
          settings: { link: (currentData.ctaLink as string) || '#' },
        })
      }
      if (initialBlocks.length > 0) {
        blocks = initialBlocks
      }
    }

    const maxOrder = blocks.length > 0 ? Math.max(...blocks.map(b => b.order)) : -1
    const defaultContent: Record<string, string> = {
      title: 'Nouveau titre',
      subtitle: 'Sous-titre',
      text: 'Votre texte ici...',
      button: 'Cliquez ici',
      image: '',
      video: '',
      audio: '',
      shape: '',
      gallery: '',
      'contact-form': 'Formulaire de contact',
      'social-icons': 'Liens réseaux sociaux',
    }
    const settings: Record<string, unknown> = {}
    if (blockType === 'button' && options?.elementId === 'affiliate') {
      settings.linkMode = 'url'
      settings.link = '#'
    }
    if (blockType === 'button' && options?.elementId === 'add-to-cart') {
      settings.linkMode = 'url'
      settings.link = '#'
    }
    const newBlock = {
      id: generateBlockId(),
      type: blockType,
      order: maxOrder + 1,
      content: defaultContent[blockType] ?? '',
      settings: Object.keys(settings).length ? settings : undefined,
    }
    handleSectionUpdate(sectionId, { ...currentData, blocks: [...blocks, newBlock] })
    setSelectedSectionId(sectionId)
    showSaveStatus()
  }

  const handleSectionDelete = async (sectionId: string) => {
    if (!site) return

    setSite((prev) => prev ? {
      ...prev,
      pages: prev.pages.map((p) => ({
        ...p,
        sections: p.sections.filter((s) => s.id !== sectionId),
      })),
    } : null)

    showSaveStatus()

    try {
      await fetch(`/api/sections/${sectionId}`, { method: 'DELETE' })
    } catch (err) {
      console.error('Failed to delete section:', err)
    }
  }

  const handleSectionReorder = async (sectionId: string, direction: 'up' | 'down') => {
    if (!site || !currentPage) return

    try {
      await fetch(`/api/pages/${currentPage.id}/sections`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId, direction }),
      })

      // Recharger le site pour avoir les sections réordonnées
      const response = await fetch(`/api/sites/by-token?token=${token}`)
      if (response.ok) {
        const data = await response.json()
        setSite(data.site)
      }
    } catch (err) {
      console.error('Failed to reorder sections:', err)
    }
  }

  const handleSectionDragReorder = async (draggedId: string, targetId: string) => {
    if (!site || !currentPage) return

    const sections = [...currentPage.sections].sort((a, b) => a.order - b.order)
    const draggedIndex = sections.findIndex(s => s.id === draggedId)
    const targetIndex = sections.findIndex(s => s.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    // Calculer la nouvelle position
    const direction = draggedIndex < targetIndex ? 'down' : 'up'
    const steps = Math.abs(targetIndex - draggedIndex)

    // Effectuer les réordonnements nécessaires
    for (let i = 0; i < steps; i++) {
      await fetch(`/api/pages/${currentPage.id}/sections`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId: draggedId, direction }),
      })
    }

    // Recharger le site
    const response = await fetch(`/api/sites/by-token?token=${token}`)
    if (response.ok) {
      const data = await response.json()
      setSite(data.site)
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

    if (files.length === 0) return

    // Upload parallèle
    const uploads = files.map((file) => handleMediaUpload(file))
    await Promise.all(uploads)

    // Afficher le toast de succès
    setUploadToast(files.length)
    setTimeout(() => setUploadToast(0), 3000)
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

        <div className="flex items-center gap-3">
          {/* Indicateur de sauvegarde - spec Top Bar */}
          <span className="text-sm text-ovh-gray-500 flex items-center gap-1.5 min-w-[140px]">
            {saveStatus === 'saving' && (
              <>
                <div className="w-2.5 h-2.5 border-2 border-ovh-primary border-t-transparent rounded-full animate-spin" />
                En cours de sauvegarde
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Enregistré
              </>
            )}
            {saveStatus === 'idle' && (
              <span className="text-ovh-gray-400">Enregistré</span>
            )}
          </span>
          {/* Aperçu - ouvre le site dans un nouvel onglet (publié ou prévisualisation) */}
          <Link
            href={site.publishState?.isPublished ? `/s/${site.slug}` : `/preview/${token}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm">
              Aperçu
            </Button>
          </Link>
          {/* Enregistrer un brouillon - ouvre la modale connexion OVHcloud */}
          <button
            type="button"
            onClick={() => setDraftLoginModalOpen(true)}
            className="inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 text-sm rounded-ovh border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
          >
            Enregistrer un brouillon
          </button>
          {/* Publier - flux One Page Order (freemium → payant) */}
          <Link href={`/edit/${token}/publish`}>
            <Button size="sm">
              Publier mon site
            </Button>
          </Link>
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
          onSectionCreate={handleSectionCreate}
          onSectionUpdate={handleSectionUpdate}
          onSectionDelete={handleSectionDelete}
          onSectionReorder={handleSectionReorder}
          onSectionDragReorder={handleSectionDragReorder}
          onSectionSelect={setSelectedSectionId}
          onThemeChange={handleThemeChange}
          onMediaUpload={handleMediaUpload}
          onMediaDelete={handleMediaDelete}
          selectedSectionId={selectedSectionId}
          onAddBlockToSection={handleAddBlockToSection}
        />

        {/* Section Editor Modal (niveau 2 – portal centré, déclenché depuis le menu inline) */}
        {editingSectionId && currentPage && (
          <SectionEditorModal
            isOpen={!!editingSectionId}
            onClose={() => setEditingSectionId(null)}
            section={currentPage.sections.find(s => s.id === editingSectionId) || null}
            site={site}
            theme={theme}
            onUpdate={handleSectionUpdate}
            currentPage={currentPage}
          />
        )}

        {/* Modale Enregistrer un brouillon – Connexion OVHcloud */}
        {draftLoginModalOpen && createPortal(
          <DraftLoginModal onClose={() => setDraftLoginModalOpen(false)} />,
          document.body
        )}

        {/* Editor area - pas de décalage quand la modale section s'ouvre (overlay) */}
        <main 
          className={`
            flex-1 transition-all duration-300 flex flex-col
            ${settingsOpen ? 'ml-[432px]' : 'ml-0'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Navigation preview */}
          {menuPages.length > 1 && (
            <Header
              siteName={site.name}
              menuPages={menuPages.map(p => ({ id: p.id, title: p.title }))}
              currentPageId={currentPage?.id}
              themeFamily={site.themeFamily}
              theme={theme}
              onPageClick={(pageId) => {
                const pageIndex = sortedPages.findIndex((p) => p.id === pageId)
                if (pageIndex !== -1) {
                  setCurrentPageIndex(pageIndex)
                }
              }}
            />
          )}

          {/* Page content preview - Canvas central */}
          <div 
            className="flex-1 overflow-auto editor-zone relative builder-selectable-text"
            style={{ backgroundColor: theme.colors.background }}
          >
            {currentPage ? (
              <>
                <div 
                  className="w-full pb-20"
                  onClick={() => setSelectedSectionId(null)}
                >
                  {currentPage.sections
                    .sort((a, b) => a.order - b.order)
                    .map((section) => (
                      <div
                        key={section.id}
                        className="relative group transition-all"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedSectionId(section.id)
                        }}
                        onDragOver={(e) => {
                          e.preventDefault()
                          e.dataTransfer.dropEffect = 'copy'
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          const raw = e.dataTransfer.getData('application/element')
                          if (raw) {
                            try {
                              const { blockType, elementId } = JSON.parse(raw)
                              handleAddBlockToSection(section.id, blockType, elementId ? { elementId } : undefined)
                            } catch {}
                          }
                        }}
                      >
                        {/* Modale inline en haut à droite : Paramètres de la section */}
                        {selectedSectionId === section.id && (() => {
                          const sorted = [...currentPage.sections].sort((a, b) => a.order - b.order)
                          const idx = sorted.findIndex(s => s.id === section.id)
                          return (
                            <SectionInlineSettingsModal
                              section={section}
                              theme={theme}
                              siteMedia={site.media}
                              onUpdate={handleSectionUpdate}
                              onDuplicate={handleSectionDuplicate}
                              onDelete={handleSectionDelete}
                              onReorderUp={(id) => { handleSectionReorder(id, 'up') }}
                              onReorderDown={(id) => { handleSectionReorder(id, 'down') }}
                              canMoveUp={idx > 0}
                              canMoveDown={idx < sorted.length - 1}
                              onClose={() => setSelectedSectionId(null)}
                              onEdit={() => setEditingSectionId(section.id)}
                            />
                          )
                        })()}
                        <div className="cursor-pointer hover:outline hover:outline-2 hover:outline-ovh-primary hover:outline-offset-0 transition-all">
                          <SectionPreview
                            section={section}
                            theme={theme}
                            site={site}
                            currentPage={currentPage}
                            onSectionUpdate={handleSectionUpdate}
                            onMediaSelect={(mediaUrl) => {
                              handleSectionUpdate(section.id, { image: mediaUrl })
                            }}
                            isSelected={selectedSectionId === section.id}
                            onElementClick={(sectionId) => {
                              setEditingSectionId(sectionId)
                            }}
                          />
                        </div>
                      </div>
                    ))}
                
                  {currentPage.sections.length === 0 && (
                    <div className="text-center py-20 text-ovh-gray-400">
                      <p className="text-lg mb-2">Cette page est vide</p>
                      <p className="text-sm">Cliquez sur « Ajouter une section » ci-dessous</p>
                    </div>
                  )}
                </div>
                {/* CTA persistant "Ajouter une section" - spec en bas du canvas */}
                <div className="sticky bottom-0 left-0 right-0 py-4 flex justify-center bg-gradient-to-t from-white/95 to-transparent">
                  <button
                    type="button"
                    onClick={() => setShowAddSectionModal(true)}
                    className="px-6 py-3 bg-ovh-primary text-white rounded-ovh font-medium hover:opacity-90 transition-opacity shadow-lg flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Ajouter une section
                  </button>
                </div>
                {/* Modal Ajouter une nouvelle section (bibliothèque) */}
                {showAddSectionModal && (
                  <AddSectionModal
                    currentPageId={currentPage.id}
                    onSectionCreate={async (type) => {
                      await handleSectionCreate(currentPage.id, type)
                      setShowAddSectionModal(false)
                    }}
                    onClose={() => setShowAddSectionModal(false)}
                  />
                )}
              </>
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
              <svg className="w-20 h-20 mx-auto mb-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-2xl font-bold mb-2">Déposez vos images ici</p>
              <p className="text-white/80">Elles seront ajoutées à votre médiathèque</p>
            </div>
          </div>
        )}

        {/* Toast de succès upload */}
        {uploadToast > 0 && (
          <div className="fixed bottom-20 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-ovh shadow-lg animate-fade-in">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>
                {uploadToast} image{uploadToast > 1 ? 's' : ''} ajoutée{uploadToast > 1 ? 's' : ''} à votre médiathèque
              </span>
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
            <span className="text-ovh-gray-400 flex items-center gap-1">
              <PictoIcon src={PICTOS.check} alt="" width={14} height={14} className="w-3.5 h-3.5 object-contain opacity-60" />
              Modifications en temps réel
            </span>
          )}
        </div>
        <div className="text-sm text-ovh-gray-500">
          Thème : <span className="font-medium">{theme.name}</span>
        </div>
      </footer>
    </div>
  )
}

// Modal "Ajouter une nouvelle section" - bibliothèque par catégories (spec)
const SECTION_CATEGORIES: { id: string; label: string; types: string[] }[] = [
  { id: 'about', label: 'À propos', types: ['hero', 'about', 'text', 'image-text'] },
  { id: 'services', label: 'Services', types: ['services'] },
  { id: 'blog', label: 'Blog', types: ['text', 'gallery'] },
  { id: 'shop', label: 'Boutique', types: ['gallery', 'text'] },
  { id: 'contact', label: 'Contact', types: ['contact'] },
  { id: 'other', label: 'Autres', types: ['gallery', 'contact'] },
]
const SECTION_TYPE_LABELS: Record<string, string> = {
  hero: 'Hero',
  about: 'À propos',
  text: 'Texte',
  'image-text': 'Image + Texte',
  services: 'Services',
  gallery: 'Galerie',
  contact: 'Contact',
}

function AddSectionModal({
  currentPageId,
  onSectionCreate,
  onClose,
}: {
  currentPageId: string
  onSectionCreate: (type: string) => Promise<void>
  onClose: () => void
}) {
  if (typeof document === 'undefined') return null

  const modal = (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[90vw] max-w-[880px] h-[80vh] max-h-[640px] flex flex-col overflow-hidden">
        <div className="flex items-start justify-between px-6 py-4 border-b border-ovh-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-ovh-gray-900">Ajouter une nouvelle section</h2>
            <p className="text-sm text-ovh-gray-500 mt-0.5">Choisissez un type de section pour enrichir votre page.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-ovh-gray-100 rounded-lg transition-colors flex-shrink-0 -mt-1 -mr-1"
          >
            <svg className="w-5 h-5 text-ovh-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {SECTION_CATEGORIES.map((cat) => (
            <div key={cat.id} className="mb-6">
              <h3 className="text-sm font-semibold text-ovh-gray-700 uppercase tracking-wide mb-2">{cat.label}</h3>
              <div className="grid grid-cols-2 gap-3">
                {cat.types.map((typeId) => (
                  <button
                    key={`${cat.id}-${typeId}`}
                    type="button"
                    onClick={() => onSectionCreate(typeId)}
                    className="p-4 text-left border border-ovh-gray-200 rounded-xl hover:border-ovh-primary hover:bg-ovh-primary/5 transition-colors text-sm font-medium text-ovh-gray-800"
                  >
                    {SECTION_TYPE_LABELS[typeId] ?? typeId}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}

// Section preview component
function SectionPreview({ 
  section, 
  theme,
  site,
  currentPage,
  onSectionUpdate,
  onMediaSelect,
  isSelected,
  onElementClick,
}: { 
  section: { id: string; type: string; dataJson: string }
  theme: ComputedTheme
  site: SiteWithRelations
  currentPage: PageWithSections | null
  onSectionUpdate: (sectionId: string, updates: Record<string, unknown>) => void
  onMediaSelect: (url: string) => void
  isSelected?: boolean
  onElementClick?: (sectionId: string, block: BlockData) => void
}) {
  const data = safeJsonParse<Record<string, unknown>>(section.dataJson, {}) || {}
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [selectedBlockForSettings, setSelectedBlockForSettings] = useState<BlockData | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)
  const [localHeight, setLocalHeight] = useState<number | undefined>(
    typeof data.sectionHeight === 'number' ? (data.sectionHeight as number) : undefined
  )
  const latestHeightRef = useRef<number | undefined>(
    typeof data.sectionHeight === 'number' ? (data.sectionHeight as number) : undefined
  )
  const resizingRef = useRef<{
    origin: 'top' | 'bottom'
    startY: number
    startHeight: number
  } | null>(null)

  const handleImageClick = () => {
    setShowMediaPicker(true)
  }

  const handleImageSelect = (mediaUrl: string) => {
    onSectionUpdate(section.id, { image: mediaUrl })
    setShowMediaPicker(false)
  }

  const blocks = (data.blocks || []) as BlockData[]

  const handleBlockClick = (block: BlockData) => {
    if (block.type === 'image' || block.type === 'video' || block.type === 'audio') {
      setSelectedBlockForSettings(block)
    }
    if (onElementClick) {
      onElementClick(section.id, block)
    }
  }

  const handleBlockUpdate = (blockId: string, updates: Partial<BlockData>) => {
    const updated = blocks.map((b) =>
      b.id === blockId ? { ...b, ...updates } : b
    )
    onSectionUpdate(section.id, { blocks: updated })
  }

  const handleBlockDelete = (blockId: string) => {
    const updated = blocks.filter((b) => b.id !== blockId)
    onSectionUpdate(section.id, { blocks: updated })
    setSelectedBlockForSettings(null)
  }

  const startResize = (origin: 'top' | 'bottom', e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const el = sectionRef.current
    const rect = el?.getBoundingClientRect()
    const baseHeight = (typeof localHeight === 'number' ? localHeight : rect?.height) ?? 0
    if (!baseHeight) return
    resizingRef.current = {
      origin,
      startY: e.clientY,
      startHeight: baseHeight,
    }
    latestHeightRef.current = baseHeight
    const onMove = (ev: MouseEvent) => {
      if (!resizingRef.current) return
      const { origin, startY, startHeight } = resizingRef.current
      const delta = ev.clientY - startY
      let next = origin === 'top' ? startHeight - delta : startHeight + delta
      next = Math.max(200, Math.min(1400, next))
      setLocalHeight(next)
      latestHeightRef.current = next
    }
    const onUp = () => {
      const finalHeight = latestHeightRef.current
      if (resizingRef.current && typeof finalHeight === 'number') {
        onSectionUpdate(section.id, { sectionHeight: finalHeight })
      }
      resizingRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      document.body.style.cursor = ''
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    document.body.style.cursor = 'ns-resize'
  }

  // Helper pour accéder aux propriétés de data de manière sécurisée
  const getDataValue = (key: string): string => {
    return (data[key] as string) || ''
  }

  // Styles personnalisés de la section ou thème par défaut
  // Ne pas définir backgroundColor par défaut : Hero utilise branding.heroBg, les autres theme.colors.background
  const sectionStyles: SectionStyles = (data.sectionStyles as SectionStyles) || {
    headingFont: theme.fonts.heading,
    bodyFont: theme.fonts.body,
    headingColor: theme.colors.text,
    textColor: theme.colors.text,
    buttonStyle: theme.buttonStyle,
  }
  const branding = getThemeBranding(site.themeFamily, theme)
  const contentAlignment = (data.contentAlignment as 'left' | 'center' | 'right') || 'left'
  const sectionImages: string[] = Array.isArray(data.sectionImages) ? (data.sectionImages as string[]) : []
  const alignmentClass = contentAlignment === 'center' ? 'text-center' : contentAlignment === 'right' ? 'text-right' : 'text-left'

  // Styles d'arrière-plan (couleur, dégradé, image, vidéo, overlay) — preview en temps réel
  const hasBgImage = !!sectionStyles.backgroundImage
  const hasBgVideo = !!sectionStyles.backgroundVideo
  const hasBgMedia = hasBgImage || hasBgVideo
  const bgOverlayColor = sectionStyles.overlayColor || '#000000'
  const bgOverlayOpacity = sectionStyles.overlayOpacity ?? 0.5
  const bgFixed = sectionStyles.bgFixed ?? false
  const bgPosition = sectionStyles.bgPosition ?? 50
  const isGradient = sectionStyles.bgMode === 'gradient'
  const sectionBgStyle: React.CSSProperties = {
    ...(isGradient ? {
      background: `linear-gradient(${sectionStyles.gradientAngle ?? 135}deg, ${sectionStyles.gradientColor1 || theme.colors.primary}, ${sectionStyles.gradientColor2 || theme.colors.secondary})`,
    } : {
      backgroundColor: sectionStyles.backgroundColor ?? theme.colors.background,
    }),
    ...(hasBgImage ? {
      backgroundImage: `url(${sectionStyles.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: `center ${bgPosition}%`,
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: bgFixed ? 'fixed' : 'scroll',
    } : {}),
  }
  const BgOverlay = hasBgMedia ? (
    <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: bgOverlayColor, opacity: bgOverlayOpacity }} />
  ) : null
  const BgVideo = hasBgVideo && !hasBgImage ? (
    <video
      src={sectionStyles.backgroundVideo}
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      style={{ objectPosition: `center ${bgPosition}%` }}
    />
  ) : null

  const sectionHeight = localHeight ?? (typeof data.sectionHeight === 'number' ? (data.sectionHeight as number) : undefined)

  // Si la section a des blocs de contenu (hors services/galerie qui utilisent data direct)
  if (data.blocks && Array.isArray(data.blocks) && data.blocks.length > 0 && section.type !== 'services' && section.type !== 'gallery') {
    const pageList = currentPage?.id ? (site.pages || []).map((p) => ({ id: p.id, title: p.title, slug: p.slug || '' })) : []
    const sectionList = (currentPage?.sections || []).map((s) => ({ id: s.id, type: s.type }))
    const sectionLayout = (data.sectionLayout as 'stacked' | 'media-left' | 'media-right' | 'title-top') || 'stacked'

    const allBlocks = blocks

    let contentNode: React.ReactNode

    if ((sectionLayout === 'media-left' || sectionLayout === 'media-right')) {
      const mediaBlocks = allBlocks.filter((b) => b.type === 'image' || b.type === 'video')
      const otherBlocks = allBlocks.filter((b) => b.type !== 'image' && b.type !== 'video')
      const hasBoth = mediaBlocks.length > 0 && otherBlocks.length > 0

      if (!hasBoth) {
        contentNode = (
          <BlockRenderer
            blocks={allBlocks}
            sectionStyles={sectionStyles}
            theme={theme}
            isPublic={false}
            onBlockClick={handleBlockClick}
          />
        )
      } else {
        const mediaColumn = (
          <BlockRenderer
            blocks={mediaBlocks}
            sectionStyles={sectionStyles}
            theme={theme}
            isPublic={false}
            onBlockClick={handleBlockClick}
          />
        )
        const textColumn = (
          <BlockRenderer
            blocks={otherBlocks}
            sectionStyles={sectionStyles}
            theme={theme}
            isPublic={false}
            onBlockClick={handleBlockClick}
          />
        )
        contentNode = (
          <div className="grid gap-8 md:grid-cols-2 items-center">
            {sectionLayout === 'media-left' ? (
              <>
                {mediaColumn}
                {textColumn}
              </>
            ) : (
              <>
                {textColumn}
                {mediaColumn}
              </>
            )}
          </div>
        )
      }
    } else if (sectionLayout === 'title-top') {
      const titleBlocks = allBlocks.filter((b) => b.type === 'title' || b.type === 'subtitle')
      const restBlocks = allBlocks.filter((b) => b.type !== 'title' && b.type !== 'subtitle')

      contentNode = (
        <>
          {titleBlocks.length > 0 && (
            <BlockRenderer
              blocks={titleBlocks}
              sectionStyles={sectionStyles}
              theme={theme}
              isPublic={false}
              onBlockClick={handleBlockClick}
            />
          )}
          {restBlocks.length > 0 && (
            <div className="mt-4">
              <BlockRenderer
                blocks={restBlocks}
                sectionStyles={sectionStyles}
                theme={theme}
                isPublic={false}
                onBlockClick={handleBlockClick}
              />
            </div>
          )}
        </>
      )
    } else {
      contentNode = (
        <BlockRenderer
          blocks={allBlocks}
          sectionStyles={sectionStyles}
          theme={theme}
          isPublic={false}
          onBlockClick={handleBlockClick}
        />
      )
    }

    return (
      <section
        ref={sectionRef as React.RefObject<HTMLElement>}
        className={`py-8 px-8 ${alignmentClass} ${hasBgMedia ? 'relative overflow-hidden' : ''} relative`}
        style={{ ...sectionBgStyle, minHeight: sectionHeight }}
      >
        {BgVideo}
        {BgOverlay}
        <div className={hasBgMedia ? 'relative z-10 section-content-over-bg' : ''}>
        {sectionImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {sectionImages.slice(0, 4).map((url, i) => (
              <img key={i} src={url} alt="" className="w-full aspect-video object-cover rounded-lg" />
            ))}
          </div>
        )}
        {contentNode}
        {selectedBlockForSettings && (
          <BlockSettingsModal
            block={selectedBlockForSettings}
            media={site.media}
            pages={pageList}
            sections={sectionList}
            onUpdate={handleBlockUpdate}
            onDelete={handleBlockDelete}
            onClose={() => setSelectedBlockForSettings(null)}
          />
        )}
        </div>
        {/* Poignées de redimensionnement haut / bas (drag & drop) */}
        {isSelected && (
          <>
            <button
              type="button"
              onMouseDown={(e) => startResize('top', e)}
              className="absolute left-1/2 -top-5 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-ovh-primary text-white text-xs shadow flex items-center justify-center cursor-row-resize"
              title="Redimensionner la hauteur de la section"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l-3 3m3-3l3 3M12 19l-3-3m3 3l3-3" />
              </svg>
            </button>
            <button
              type="button"
              onMouseDown={(e) => startResize('bottom', e)}
              className="absolute left-1/2 -bottom-5 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-ovh-primary text-white text-xs shadow flex items-center justify-center cursor-row-resize"
              title="Redimensionner la hauteur de la section"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l-3 3m3-3l3 3M12 19l-3-3m3 3l3-3" />
              </svg>
            </button>
          </>
        )}
      </section>
    )
  }

  // Sinon, afficher le rendu par défaut selon le type
  switch (section.type) {
    case 'hero': {
      const heroBgStyle: React.CSSProperties = isGradient
        ? sectionBgStyle
        : { ...sectionBgStyle, backgroundColor: sectionStyles.backgroundColor || branding.heroBg }
      return (
        <section 
          ref={sectionRef as React.RefObject<HTMLElement>}
          className={`py-20 px-8 ${alignmentClass} ${hasBgMedia ? 'relative overflow-hidden' : ''} relative`}
          style={{ ...heroBgStyle, minHeight: sectionHeight }}
        >
          {BgVideo}
          {BgOverlay}
          <div className={hasBgMedia ? 'relative z-10' : ''}>
          <h1 
            className="font-bold mb-4 text-white"
            style={{
              fontFamily: sectionStyles.headingFont,
              ...(hasBgMedia ? { textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5)' } : {}),
            }}
            contentEditable
            suppressContentEditableWarning
          >
            {getDataValue('title')}
          </h1>
          <p 
            className="text-white/80 mb-8 text-xl"
            style={{
              fontFamily: sectionStyles.bodyFont,
              ...(hasBgMedia ? { textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 0 16px rgba(0,0,0,0.5)' } : {}),
            }}
            contentEditable
            suppressContentEditableWarning
          >
            {getDataValue('subtitle')}
          </p>
          <button
            className="px-6 py-3 font-semibold text-white"
            style={{ 
              backgroundColor: branding.heroCtaBg,
              color: branding.heroCtaText,
              borderRadius: sectionStyles.buttonStyle === 'pill' ? '9999px' : sectionStyles.buttonStyle === 'square' ? '0' : theme.borderRadius,
            }}
          >
            {getDataValue('ctaText')}
          </button>
        </div>
        {/* Poignées de redimensionnement haut / bas (drag & drop) */}
        {isSelected && (
          <>
            <button
              type="button"
              onMouseDown={(e) => startResize('top', e)}
              className="absolute left-1/2 -top-5 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-ovh-primary text-white text-xs shadow flex items-center justify-center cursor-row-resize"
              title="Redimensionner la hauteur de la section"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l-3 3m3-3l3 3M12 19l-3-3m3 3l3-3" />
              </svg>
            </button>
            <button
              type="button"
              onMouseDown={(e) => startResize('bottom', e)}
              className="absolute left-1/2 -bottom-5 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-ovh-primary text-white text-xs shadow flex items-center justify-center cursor-row-resize"
              title="Redimensionner la hauteur de la section"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l-3 3m3-3l3 3M12 19l-3-3m3 3l3-3" />
              </svg>
            </button>
          </>
        )}
        </section>
      )
    }

    case 'about':
      return (
        <section 
          ref={sectionRef as React.RefObject<HTMLElement>}
          className={`py-12 px-8 ${alignmentClass} ${hasBgMedia ? 'relative overflow-hidden' : ''} relative`}
          style={{ ...sectionBgStyle, minHeight: sectionHeight }}
        >
          {BgVideo}
          {BgOverlay}
          <div className={hasBgMedia ? 'relative z-10' : ''}>
          <h2 
            className="font-bold mb-6 text-3xl"
            style={{ fontFamily: sectionStyles.headingFont, color: sectionStyles.headingColor }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onSectionUpdate(section.id, { title: e.currentTarget.textContent || '' })}
          >
            {getDataValue('title')}
          </h2>
          {data.image ? (
            <div className="mb-6 relative group">
              <img src={data.image as string} alt={getDataValue('title')} className="w-full h-64 object-cover" />
              <button
                onClick={() => handleImageClick()}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
              >
                <span className="text-sm">Changer l'image</span>
              </button>
            </div>
          ) : (
            <div
              onClick={handleImageClick}
              className="mb-6 h-64 border-2 border-dashed border-ovh-gray-300 flex items-center justify-center cursor-pointer hover:border-ovh-primary transition-colors"
            >
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-2 text-ovh-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-ovh-gray-500">Cliquez pour ajouter une image</p>
              </div>
            </div>
          )}
          <p 
            className="text-lg leading-relaxed"
            style={{ fontFamily: sectionStyles.bodyFont, color: sectionStyles.textColor }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onSectionUpdate(section.id, { content: e.currentTarget.textContent || '' })}
          >
            {getDataValue('content')}
          </p>
          </div>
          {showMediaPicker && (
            <MediaPickerModal
              media={site.media.filter(m => m.type === 'image')}
              onSelect={handleImageSelect}
              onClose={() => setShowMediaPicker(false)}
            />
          )}
        {/* Poignées de redimensionnement haut / bas (drag & drop) */}
        {isSelected && (
          <>
            <button
              type="button"
              onMouseDown={(e) => startResize('top', e)}
              className="absolute left-1/2 -top-5 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-ovh-primary text-white text-xs shadow flex items-center justify-center cursor-row-resize"
              title="Redimensionner la hauteur de la section"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l-3 3m3-3l3 3M12 19l-3-3m3 3l3-3" />
              </svg>
            </button>
            <button
              type="button"
              onMouseDown={(e) => startResize('bottom', e)}
              className="absolute left-1/2 -bottom-5 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-ovh-primary text-white text-xs shadow flex items-center justify-center cursor-row-resize"
              title="Redimensionner la hauteur de la section"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l-3 3m3-3l3 3M12 19l-3-3m3 3l3-3" />
              </svg>
            </button>
          </>
        )}
        </section>
      )

    case 'services':
      return (
        <section 
          ref={sectionRef as React.RefObject<HTMLElement>}
          className={`py-12 px-8 ${alignmentClass} ${hasBgMedia ? 'relative overflow-hidden' : ''} relative`}
          style={{ ...sectionBgStyle, minHeight: sectionHeight }}
        >
          {BgVideo}
          {BgOverlay}
          <div className={hasBgMedia ? 'relative z-10' : ''}>
          <h2 
            className="text-3xl font-bold mb-8"
            style={{ fontFamily: sectionStyles.headingFont, color: sectionStyles.headingColor }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onSectionUpdate(section.id, { title: e.currentTarget.textContent || '' })}
          >
            {getDataValue('title') || 'Nos services'}
          </h2>
          <p
            className="text-lg mb-6 opacity-90 min-h-[1.5em]"
            style={{ fontFamily: sectionStyles.bodyFont, color: sectionStyles.textColor }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onSectionUpdate(section.id, { content: e.currentTarget.textContent || '', subtitle: e.currentTarget.textContent || '' })}
          >
            {getDataValue('subtitle') || getDataValue('content') || 'Votre contenu ici...'}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {((data.services as Array<{ icon?: string; iconSrc?: string; title: string; description: string }>) || []).length > 0
              ? ((data.services as Array<{ icon?: string; iconSrc?: string; title: string; description: string }>) || []).map((service, i: number) => (
                  <div
                    key={i}
                    className="p-6 rounded-ovh-lg text-center"
                    style={{ backgroundColor: `${theme.colors.primary}10` }}
                  >
                    {service.iconSrc ? (
                      <div className="flex justify-center mb-4" style={{ color: sectionStyles.headingColor }}>
                        <PictoIcon src={service.iconSrc} alt={service.title} width={48} height={48} className="w-12 h-12 object-contain" />
                      </div>
                    ) : service.icon ? (
                      <div className="text-4xl mb-4">{service.icon}</div>
                    ) : null}
                    <h3
                      className="font-bold text-lg mb-2"
                      style={{ fontFamily: sectionStyles.headingFont, color: sectionStyles.headingColor }}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const svc = (data.services as Array<{ icon?: string; iconSrc?: string; title: string; description: string }>) || []
                        const next = [...svc]
                        if (next[i]) next[i] = { ...next[i], title: e.currentTarget.textContent || '' }
                        onSectionUpdate(section.id, { services: next })
                      }}
                    >
                      {service.title}
                    </h3>
                    <p
                      style={{ fontFamily: sectionStyles.bodyFont, color: sectionStyles.textColor }}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const svc = (data.services as Array<{ icon?: string; iconSrc?: string; title: string; description: string }>) || []
                        const next = [...svc]
                        if (next[i]) next[i] = { ...next[i], description: e.currentTarget.textContent || '' }
                        onSectionUpdate(section.id, { services: next })
                      }}
                    >
                      {service.description}
                    </p>
                  </div>
                ))
              : (
                <div className="col-span-full py-12 border-2 border-dashed border-ovh-gray-300 rounded-ovh-lg text-center">
                  <p className="text-ovh-gray-500 text-sm mb-2">Aucun service</p>
                  <p className="text-ovh-gray-400 text-xs">Cliquez sur « Modifier » puis onglet Contenu pour configurer vos services</p>
                </div>
              )}
          </div>
          </div>
        {/* Poignées de redimensionnement haut / bas (drag & drop) */}
        {isSelected && (
          <>
            <button
              type="button"
              onMouseDown={(e) => startResize('top', e)}
              className="absolute left-1/2 -top-5 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-ovh-primary text-white text-xs shadow flex items-center justify-center cursor-row-resize"
              title="Redimensionner la hauteur de la section"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l-3 3m3-3l3 3M12 19l-3-3m3 3l3-3" />
              </svg>
            </button>
            <button
              type="button"
              onMouseDown={(e) => startResize('bottom', e)}
              className="absolute left-1/2 -bottom-5 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-ovh-primary text-white text-xs shadow flex items-center justify-center cursor-row-resize"
              title="Redimensionner la hauteur de la section"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l-3 3m3-3l3 3M12 19l-3-3m3 3l3-3" />
              </svg>
            </button>
          </>
        )}
        </section>
      )

    case 'gallery':
      return (
        <section 
          ref={sectionRef as React.RefObject<HTMLElement>}
          className={`py-12 px-8 ${alignmentClass} ${hasBgMedia ? 'relative overflow-hidden' : ''} relative`}
          style={{ ...sectionBgStyle, minHeight: sectionHeight }}
        >
          {BgVideo}
          {BgOverlay}
          <div className={hasBgMedia ? 'relative z-10' : ''}>
          <h2
            className="text-3xl font-bold mb-8"
            style={{ fontFamily: sectionStyles.headingFont, color: sectionStyles.headingColor }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onSectionUpdate(section.id, { title: e.currentTarget.textContent || '' })}
          >
            {getDataValue('title') || 'Galerie'}
          </h2>
          {getDataValue('subtitle') && (
            <p
              className="text-lg mb-6 opacity-90"
              style={{ fontFamily: sectionStyles.bodyFont, color: sectionStyles.textColor }}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onSectionUpdate(section.id, { subtitle: e.currentTarget.textContent || '' })}
            >
              {getDataValue('subtitle')}
            </p>
          )}
          {((data.images as Array<{ url: string; alt?: string }>) || []).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {((data.images as Array<{ url: string; alt?: string }>) || []).map((img, i: number) => (
                <img key={i} src={img.url} alt={img.alt || ''} className="w-full h-48 object-cover rounded-ovh-lg" />
              ))}
            </div>
          ) : (
            <div className="py-12 border-2 border-dashed border-ovh-gray-300 rounded-ovh-lg text-center">
              <p className="text-ovh-gray-500 text-sm mb-2">Aucune image</p>
              <p className="text-ovh-gray-400 text-xs">Cliquez sur « Modifier » puis onglet Contenu pour ajouter des images depuis la bibliothèque</p>
            </div>
          )}
          </div>
        {/* Poignées de redimensionnement haut / bas (drag & drop) */}
        {isSelected && (
          <>
            <button
              type="button"
              onMouseDown={(e) => startResize('top', e)}
              className="absolute left-1/2 -top-5 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-ovh-primary text-white text-xs shadow flex items-center justify-center cursor-row-resize"
              title="Redimensionner la hauteur de la section"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l-3 3m3-3l3 3M12 19l-3-3m3 3l3-3" />
              </svg>
            </button>
            <button
              type="button"
              onMouseDown={(e) => startResize('bottom', e)}
              className="absolute left-1/2 -bottom-5 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-ovh-primary text-white text-xs shadow flex items-center justify-center cursor-row-resize"
              title="Redimensionner la hauteur de la section"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l-3 3m3-3l3 3M12 19l-3-3m3 3l3-3" />
              </svg>
            </button>
          </>
        )}
        </section>
      )

    case 'contact':
      return (
        <section 
          ref={sectionRef as React.RefObject<HTMLElement>}
          className={`py-12 px-8 ${alignmentClass} ${hasBgMedia ? 'relative overflow-hidden' : ''} relative`}
          style={{ ...sectionBgStyle, minHeight: sectionHeight }}
        >
          {BgVideo}
          {BgOverlay}
          <div className={hasBgMedia ? 'relative z-10' : ''}>
          <h2 
            className="text-3xl font-bold mb-8"
            style={{ fontFamily: theme.fonts.heading, color: theme.colors.text }}
            contentEditable
            suppressContentEditableWarning
          >
            {getDataValue('title')}
          </h2>
          <div className="max-w-md mx-auto text-center">
            <p style={{ color: theme.colors.muted }}>
              Email : <span contentEditable suppressContentEditableWarning>{getDataValue('email')}</span>
            </p>
          </div>
          </div>
        {/* Poignées de redimensionnement haut / bas (drag & drop) */}
        {isSelected && (
          <>
            <button
              type="button"
              onMouseDown={(e) => startResize('top', e)}
              className="absolute left-1/2 -top-5 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-ovh-primary text-white text-xs shadow flex items-center justify-center cursor-row-resize"
              title="Redimensionner la hauteur de la section"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l-3 3m3-3l3 3M12 19l-3-3m3 3l3-3" />
              </svg>
            </button>
            <button
              type="button"
              onMouseDown={(e) => startResize('bottom', e)}
              className="absolute left-1/2 -bottom-5 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-ovh-primary text-white text-xs shadow flex items-center justify-center cursor-row-resize"
              title="Redimensionner la hauteur de la section"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l-3 3m3-3l3 3M12 19l-3-3m3 3l3-3" />
              </svg>
            </button>
          </>
        )}
        </section>
      )

    case 'footer': {
      const footerBgStyle: React.CSSProperties = isGradient
        ? sectionBgStyle
        : { ...sectionBgStyle, backgroundColor: sectionStyles.backgroundColor || branding.footerBg }
      const socialIcons = (() => {
        try {
          return (data.socialIcons as Array<{ platform: string; url: string }>) || []
        } catch { return [] }
      })()
      return (
        <footer 
          ref={sectionRef as React.RefObject<HTMLElement>}
          className={`py-12 px-8 ${alignmentClass} ${hasBgMedia ? 'relative overflow-hidden' : ''} relative`}
          style={{ ...footerBgStyle, minHeight: sectionHeight }}
        >
          {BgVideo}
          {BgOverlay}
          <div className={`max-w-6xl mx-auto ${hasBgMedia ? 'relative z-10' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold mb-2" style={{ color: branding.footerText }} contentEditable suppressContentEditableWarning onBlur={(e) => onSectionUpdate(section.id, { contactTitle: e.currentTarget.textContent || '' })}>
                  {getDataValue('contactTitle') || 'Contact'}
                </h3>
                <p className="text-sm mb-4 opacity-90" style={{ color: branding.footerText }} contentEditable suppressContentEditableWarning onBlur={(e) => onSectionUpdate(section.id, { contactDesc: e.currentTarget.textContent || '' })}>
                  {getDataValue('contactDesc') || 'Une équipe à votre écoute, prête à vous aider.'}
                </p>
                {socialIcons.length > 0 && (
                  <div className="flex gap-3">
                    {socialIcons.map((icon, i) => (
                      <a
                        key={i}
                        href={icon.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                        style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: branding.footerText }}
                      >
                        <SocialIconLogo platform={icon.platform} color={branding.footerText} size={20} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2" style={{ color: branding.footerText }}>EMAIL</h3>
                <p className="text-sm space-y-1" style={{ color: branding.footerText }}>
                  {getDataValue('phone') && (
                    <span className="block" contentEditable suppressContentEditableWarning onBlur={(e) => onSectionUpdate(section.id, { phone: e.currentTarget.textContent || '' })}>
                      {getDataValue('phone')}
                    </span>
                  )}
                  {getDataValue('email') && (
                    <span contentEditable suppressContentEditableWarning onBlur={(e) => onSectionUpdate(section.id, { email: e.currentTarget.textContent || '' })} className="hover:underline opacity-90 cursor-text">
                      {getDataValue('email')}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <p className="text-center text-sm" style={{ color: branding.footerText }} contentEditable suppressContentEditableWarning onBlur={(e) => onSectionUpdate(section.id, { copyright: e.currentTarget.textContent || '' })}>
              {getDataValue('copyright')}
            </p>
          </div>
        </footer>
      )
    }

    default:
      return (
        <section 
          ref={sectionRef as React.RefObject<HTMLElement>}
          className={`py-8 px-8 text-ovh-gray-400 border border-dashed border-ovh-gray-300 ${alignmentClass} ${hasBgMedia ? 'relative overflow-hidden' : ''} relative`} 
          style={{ ...sectionBgStyle, minHeight: sectionHeight }}
        >
          {BgVideo}
          {BgOverlay}
          <div className={hasBgMedia ? 'relative z-10' : ''}>Section : {section.type}</div>
          {/* Poignées de redimensionnement haut / bas (drag & drop) */}
          {isSelected && (
            <>
              <button
                type="button"
                onMouseDown={(e) => startResize('top', e)}
                className="absolute left-1/2 -top-5 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-ovh-primary text-white text-xs shadow flex items-center justify-center cursor-row-resize"
                title="Redimensionner la hauteur de la section"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l-3 3m3-3l3 3M12 19l-3-3m3 3l3-3" />
                </svg>
              </button>
              <button
                type="button"
                onMouseDown={(e) => startResize('bottom', e)}
                className="absolute left-1/2 -bottom-5 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-ovh-primary text-white text-xs shadow flex items-center justify-center cursor-row-resize"
                title="Redimensionner la hauteur de la section"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l-3 3m3-3l3 3M12 19l-3-3m3 3l3-3" />
                </svg>
              </button>
            </>
          )}
        </section>
      )
  }
}

// Composant pour sélectionner un média depuis la médiathèque
function MediaPickerModal({
  media,
  onSelect,
  onClose,
  title = 'Sélectionner une image',
}: {
  media: Array<{ id: string; url: string; filename: string; originalName?: string | null; type?: string }>
  onSelect: (url: string) => void
  onClose: () => void
  title?: string
}) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-ovh-lg max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h3 className="font-bold text-lg">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-ovh-gray-100 rounded-ovh">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {media.length === 0 ? (
              <div className="text-center py-12 text-ovh-gray-500">
                <p>Aucun média dans la médiathèque</p>
                <p className="text-sm mt-2">Ajoutez des fichiers via la médiathèque</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {media.map((item) => {
                  const displayName = item.originalName ?? item.filename
                  return (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item.url)}
                    className="aspect-square rounded-ovh overflow-hidden border-2 border-ovh-gray-200 hover:border-ovh-primary transition-colors flex flex-col bg-ovh-gray-100"
                  >
                    <div className="flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden">
                      {(item.type === 'video' || item.url.match(/\.(mp4|webm|ogg)$/i)) ? (
                        <video src={item.url} className="w-full h-full object-cover" muted />
                      ) : item.type === 'audio' ? (
                        <div className="flex flex-col items-center gap-2 text-ovh-gray-500">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                        </div>
                      ) : (
                        <img src={item.url} alt={displayName} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <span className="text-xs text-ovh-gray-600 truncate px-2 py-1.5 bg-white text-center border-t border-ovh-gray-200">
                      {displayName}
                    </span>
                  </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
