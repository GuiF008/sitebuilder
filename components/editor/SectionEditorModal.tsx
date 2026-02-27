'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { SiteWithRelations, PageWithSections, ComputedTheme, ContentBlock, ContentBlockType, CONTENT_BLOCK_TYPES } from '@/lib/types'
import { ColorPicker } from '@/components/ui'

type EditorTab = 'content' | 'style'

const FONTS = [
  { value: 'Source Sans Pro', label: 'Source Sans Pro' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Space Grotesk', label: 'Space Grotesk' },
  { value: 'Lato', label: 'Lato' },
]

const BUTTON_STYLES = [
  { value: 'square', label: 'Carré' },
  { value: 'rounded', label: 'Arrondi' },
  { value: 'pill', label: 'Pilule' },
]

interface SectionEditorModalProps {
  isOpen: boolean
  onClose: () => void
  section: { id: string; type: string; dataJson: string } | null
  site: SiteWithRelations
  theme: ComputedTheme
  onUpdate: (sectionId: string, updates: Record<string, unknown>) => Promise<void>
  currentPage?: PageWithSections | null
}

const generateBlockId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

export function SectionEditorModal({
  isOpen,
  onClose,
  section,
  site,
  theme,
  onUpdate,
  currentPage = null,
}: SectionEditorModalProps) {
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'audio'>('image')
  const [showBlockMenu, setShowBlockMenu] = useState(false)
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<EditorTab>('content')
  
  // Styles de section
  const [sectionStyles, setSectionStyles] = useState({
    backgroundColor: theme.colors.background,
    headingFont: theme.fonts.heading,
    bodyFont: theme.fonts.body,
    headingColor: theme.colors.text,
    textColor: theme.colors.text,
    buttonStyle: theme.buttonStyle,
  })
  const [contentAlignment, setContentAlignment] = useState<'left' | 'center' | 'right'>('left')
  const [sectionImages, setSectionImages] = useState<string[]>([])
  const [showMediaPickerForImages, setShowMediaPickerForImages] = useState(false)
  const [mediaPickerImageIndex, setMediaPickerImageIndex] = useState(0)

  useEffect(() => {
    if (section) {
      const data = JSON.parse(section.dataJson)
      // Si la section a déjà des blocs, les charger
      if (data.blocks && Array.isArray(data.blocks)) {
        setBlocks(data.blocks)
      } else {
        // Convertir les anciennes données en blocs
        const convertedBlocks: ContentBlock[] = []
        let order = 0
        
        if (data.title) {
          convertedBlocks.push({ id: generateBlockId(), type: 'title', order: order++, content: data.title })
        }
        if (data.subtitle) {
          convertedBlocks.push({ id: generateBlockId(), type: 'subtitle', order: order++, content: data.subtitle })
        }
        if (data.image) {
          convertedBlocks.push({ id: generateBlockId(), type: 'image', order: order++, content: data.image })
        }
        if (data.content) {
          convertedBlocks.push({ id: generateBlockId(), type: 'text', order: order++, content: data.content })
        }
        if (data.ctaText) {
          convertedBlocks.push({ id: generateBlockId(), type: 'button', order: order++, content: data.ctaText, settings: { link: data.ctaLink } })
        }
        if (data.email) {
          convertedBlocks.push({ id: generateBlockId(), type: 'text', order: order++, content: `Email: ${data.email}` })
        }
        
        setBlocks(convertedBlocks)
      }
      
      // Charger les styles de section s'ils existent
      if (data.sectionStyles) {
        setSectionStyles({
          backgroundColor: data.sectionStyles.backgroundColor || theme.colors.background,
          headingFont: data.sectionStyles.headingFont || theme.fonts.heading,
          bodyFont: data.sectionStyles.bodyFont || theme.fonts.body,
          headingColor: data.sectionStyles.headingColor || theme.colors.text,
          textColor: data.sectionStyles.textColor || theme.colors.text,
          buttonStyle: data.sectionStyles.buttonStyle || theme.buttonStyle,
        })
      }
      setContentAlignment((data.contentAlignment as 'left' | 'center' | 'right') || 'left')
      setSectionImages(Array.isArray(data.sectionImages) ? data.sectionImages : [])
    }
  }, [section, theme])

  if (!section) return null

  // Sauvegarder les blocs
  const saveBlocks = (newBlocks: ContentBlock[]) => {
    setBlocks(newBlocks)
    const currentData = section ? JSON.parse(section.dataJson) : {}
    const updatedData = {
      ...currentData,
      blocks: newBlocks,
      sectionStyles: sectionStyles
    }
    if (section) {
      onUpdate(section.id, updatedData)
    }
  }

  // Sauvegarder les styles de section
  const saveSectionStyles = (newStyles: typeof sectionStyles) => {
    setSectionStyles(newStyles)
    const currentData = section ? JSON.parse(section.dataJson) : {}
    const updatedData = {
      ...currentData,
      blocks: blocks,
      sectionStyles: newStyles
    }
    if (section) {
      onUpdate(section.id, updatedData)
    }
  }

  // Sauvegarder mise en page / images de section
  const saveSectionData = (updates: Record<string, unknown>) => {
    const currentData = section ? JSON.parse(section.dataJson) : {}
    const updatedData = { ...currentData, ...updates, blocks, sectionStyles }
    if (section) {
      onUpdate(section.id, updatedData)
    }
  }

  // Ajouter un bloc
  const addBlock = (type: ContentBlockType) => {
    const maxOrder = blocks.length > 0 ? Math.max(...blocks.map(b => b.order)) : -1
    const defaults: Record<string, string> = {
      title: 'Nouveau titre',
      subtitle: 'Nouveau sous-titre',
      text: 'Votre texte ici...',
      button: 'Cliquez ici',
      shape: '',
      gallery: '',
      'contact-form': 'Formulaire de contact',
      'social-icons': 'Liens réseaux sociaux',
    }
    const newBlock: ContentBlock = {
      id: generateBlockId(),
      type,
      order: maxOrder + 1,
      content: defaults[type] ?? '',
      settings: type === 'button' ? { linkMode: 'url', link: '#' } : undefined
    }
    saveBlocks([...blocks, newBlock])
    setShowBlockMenu(false)
  }

  // Supprimer un bloc
  const deleteBlock = (blockId: string) => {
    saveBlocks(blocks.filter(b => b.id !== blockId))
  }

  // Mettre à jour un bloc
  const updateBlock = (blockId: string, updates: Partial<ContentBlock>) => {
    const newBlocks = blocks.map(b => 
      b.id === blockId ? { ...b, ...updates } : b
    )
    saveBlocks(newBlocks)
  }

  // Réordonner par drag & drop
  const handleDragReorder = (draggedId: string, targetId: string) => {
    const draggedIndex = blocks.findIndex(b => b.id === draggedId)
    const targetIndex = blocks.findIndex(b => b.id === targetId)
    
    if (draggedIndex === -1 || targetIndex === -1) return
    
    const newBlocks = [...blocks]
    const [dragged] = newBlocks.splice(draggedIndex, 1)
    newBlocks.splice(targetIndex, 0, dragged)
    
    // Réassigner les ordres
    newBlocks.forEach((block, index) => {
      block.order = index
    })
    
    saveBlocks(newBlocks)
  }

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    const ordered = [...blocks].sort((a, b) => a.order - b.order)
    const index = ordered.findIndex(b => b.id === blockId)
    if (index === -1) return

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= ordered.length) return

    const next = [...ordered]
    const [moved] = next.splice(index, 1)
    next.splice(targetIndex, 0, moved)

    next.forEach((block, i) => {
      block.order = i
    })

    saveBlocks(next)
    setActiveBlockId(moved.id)
  }

  // Sélectionner un média
  const handleMediaSelect = (url: string) => {
    if (activeBlockId) {
      updateBlock(activeBlockId, { content: url })
    }
    setShowMediaPicker(false)
    setActiveBlockId(null)
  }

  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order)
  const images = site.media.filter(m => m.type === 'image')
  const videos = site.media.filter(m => m.type === 'video')
  const audios = site.media.filter(m => m.type === 'audio')

  const getMediaForType = () => {
    switch (mediaType) {
      case 'image': return images
      case 'video': return videos
      case 'audio': return audios
      default: return images
    }
  }

  if (!isOpen || typeof document === 'undefined') return null

  const modal = (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-[90vw] max-w-[880px] h-[80vh] max-h-[640px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-ovh-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-ovh-gray-900">Éditer la section</h2>
            <p className="text-sm text-ovh-gray-500 mt-0.5">Ajoutez et organisez le contenu de votre section</p>
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

        {/* Body: two columns */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left column: tabs */}
          <div className="w-[220px] flex-shrink-0 border-r border-ovh-gray-200 overflow-y-auto py-3 px-3">
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-colors mb-1 ${
                activeTab === 'content' ? 'bg-ovh-gray-100 font-semibold text-ovh-gray-900' : 'text-ovh-gray-700 hover:bg-ovh-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <span className="text-sm">Contenu</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('style')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-colors mb-1 ${
                activeTab === 'style' ? 'bg-ovh-gray-100 font-semibold text-ovh-gray-900' : 'text-ovh-gray-700 hover:bg-ovh-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <span className="text-sm">Style</span>
            </button>
          </div>

          {/* Right column: content */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

        {/* Panneau Style */}
        {activeTab === 'style' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
            <div>
              <label className="block text-sm font-medium text-ovh-gray-700 mb-1.5">Mise en page</label>
              <div className="flex gap-1">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    type="button"
                    onClick={() => {
                      setContentAlignment(align)
                      saveSectionData({ contentAlignment: align })
                    }}
                    className={`flex-1 py-2 text-xs font-medium rounded-ovh border ${
                      contentAlignment === align ? 'border-ovh-primary bg-ovh-primary text-white' : 'border-ovh-gray-200 text-ovh-gray-700'
                    }`}
                  >
                    {align === 'left' ? 'Gauche' : align === 'center' ? 'Centre' : 'Droite'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ovh-gray-700 mb-1.5">Images (4 max)</label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square border border-ovh-gray-200 rounded-ovh overflow-hidden bg-ovh-gray-50 relative">
                    {sectionImages[i] ? (
                      <>
                        <img src={sectionImages[i]} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const next = sectionImages.filter((_, idx) => idx !== i)
                            setSectionImages(next)
                            saveSectionData({ sectionImages: next })
                          }}
                          className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setMediaPickerImageIndex(i); setShowMediaPickerForImages(true) }}
                        className="w-full h-full flex items-center justify-center text-ovh-gray-400 hover:bg-ovh-gray-100 text-xs"
                      >
                        +
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {showMediaPickerForImages && (
                <>
                  <div className="fixed inset-0 z-[210]" onClick={() => setShowMediaPickerForImages(false)} />
                  <div className="fixed inset-0 z-[215] flex items-center justify-center">
                    <div className="relative bg-white rounded-2xl shadow-2xl w-[90vw] max-w-[560px] max-h-[70vh] overflow-hidden flex flex-col">
                      <div className="flex items-start justify-between px-6 py-4 border-b border-ovh-gray-200 flex-shrink-0">
                        <div>
                          <h2 className="text-lg font-bold text-ovh-gray-900">Choisir une image</h2>
                          <p className="text-sm text-ovh-gray-500 mt-0.5">Sélectionnez une image depuis votre bibliothèque</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowMediaPickerForImages(false)}
                          className="p-2 hover:bg-ovh-gray-100 rounded-lg transition-colors flex-shrink-0 -mt-1 -mr-1"
                        >
                          <svg className="w-5 h-5 text-ovh-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto p-6">
                        {site.media.filter((m) => m.type === 'image' || !m.type).length === 0 ? (
                          <div className="text-center py-12 text-ovh-gray-500">
                            <p>Aucune image dans la médiathèque</p>
                            <p className="text-sm mt-2">Ajoutez des images via la bibliothèque</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-3">
                            {site.media.filter((m) => m.type === 'image' || !m.type).map((m) => (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => {
                                  const next = [...sectionImages]
                                  next[mediaPickerImageIndex] = m.url
                                  setSectionImages(next.slice(0, 4))
                                  saveSectionData({ sectionImages: next.slice(0, 4) })
                                  setShowMediaPickerForImages(false)
                                }}
                                className="aspect-square rounded-xl overflow-hidden border-2 border-ovh-gray-200 hover:border-ovh-primary transition-colors"
                              >
                                <img src={m.url} alt="" className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <ColorPicker
              label="Couleur de fond"
              value={sectionStyles.backgroundColor}
              onChange={(color) => saveSectionStyles({ ...sectionStyles, backgroundColor: color })}
              closeOnSelect
            />
            <div>
              <label className="block text-sm font-medium text-ovh-gray-700 mb-1.5">Police des titres</label>
              <select
                value={sectionStyles.headingFont}
                onChange={(e) => saveSectionStyles({ ...sectionStyles, headingFont: e.target.value })}
                className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-2 focus:ring-ovh-primary text-sm"
              >
                {FONTS.map((font) => (
                  <option key={font.value} value={font.value}>{font.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ovh-gray-700 mb-1.5">Police du texte</label>
              <select
                value={sectionStyles.bodyFont}
                onChange={(e) => saveSectionStyles({ ...sectionStyles, bodyFont: e.target.value })}
                className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-2 focus:ring-ovh-primary text-sm"
              >
                {FONTS.map((font) => (
                  <option key={font.value} value={font.value}>{font.label}</option>
                ))}
              </select>
            </div>
            <ColorPicker
              label="Couleur des titres"
              value={sectionStyles.headingColor}
              onChange={(color) => saveSectionStyles({ ...sectionStyles, headingColor: color })}
              closeOnSelect
            />
            <ColorPicker
              label="Couleur du texte"
              value={sectionStyles.textColor}
              onChange={(color) => saveSectionStyles({ ...sectionStyles, textColor: color })}
              closeOnSelect
            />
            <div>
              <label className="block text-sm font-medium text-ovh-gray-700 mb-2">Style des boutons</label>
              <div className="flex gap-2">
                {BUTTON_STYLES.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => saveSectionStyles({ ...sectionStyles, buttonStyle: style.value as 'square' | 'rounded' | 'pill' })}
                    className={`flex-1 py-2 px-3 border-2 text-xs font-medium transition-all
                      ${style.value === 'square' ? 'rounded-none' : ''} ${style.value === 'rounded' ? 'rounded-ovh' : ''} ${style.value === 'pill' ? 'rounded-full' : ''}
                      ${sectionStyles.buttonStyle === style.value ? 'border-ovh-primary bg-ovh-primary text-white' : 'border-ovh-gray-300 text-ovh-gray-600 hover:border-ovh-gray-400'}`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Liste des blocs (onglet Contenu) */}
        {activeTab === 'content' && (
        <>
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {sortedBlocks.length === 0 ? (
            <div className="text-center py-12 text-ovh-gray-500 border-2 border-dashed border-ovh-gray-200 rounded-ovh">
              <p className="mb-2">Aucun contenu</p>
              <p className="text-sm">Ajoutez des blocs pour commencer</p>
            </div>
          ) : (
            sortedBlocks.map((block, index) => (
              <div
                key={block.id}
                draggable
                onClick={() => setActiveBlockId(block.id)}
                onDragStart={() => setDraggedBlockId(block.id)}
                onDragOver={(e) => {
                  e.preventDefault()
                  if (draggedBlockId && draggedBlockId !== block.id) {
                    e.currentTarget.classList.add('border-ovh-primary', 'border-2')
                  }
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('border-ovh-primary', 'border-2')
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.remove('border-ovh-primary', 'border-2')
                  if (draggedBlockId && draggedBlockId !== block.id) {
                    handleDragReorder(draggedBlockId, block.id)
                  }
                  setDraggedBlockId(null)
                }}
                onDragEnd={() => setDraggedBlockId(null)}
                className={`
                  bg-ovh-gray-50 rounded-ovh border border-ovh-gray-200 overflow-hidden
                  ${draggedBlockId === block.id ? 'opacity-50' : ''}
                  ${activeBlockId === block.id ? 'ring-2 ring-ovh-primary' : ''}
                `}
              >
                {/* Header du bloc */}
                <div className="flex items-center gap-2 px-3 py-2 bg-white border-b border-ovh-gray-100">
                  <div className="text-ovh-gray-400 cursor-grab active:cursor-grabbing">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                  </div>
                  {(() => {
                    const blockType = CONTENT_BLOCK_TYPES.find(t => t.type === block.type)
                    return blockType?.iconSrc ? (
                      <Image
                        src={blockType.iconSrc}
                        alt={blockType.label}
                        width={20}
                        height={20}
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      <Image
                        src="/pictos/page-query.png"
                        alt="Bloc"
                        width={20}
                        height={20}
                        className="w-5 h-5 object-contain"
                      />
                    )
                  })()}
                  <span className="text-sm font-medium text-ovh-gray-700 flex-1">
                    {CONTENT_BLOCK_TYPES.find(t => t.type === block.type)?.label || block.type}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveBlock(block.id, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-ovh-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <svg className="w-3 h-3 text-ovh-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBlock(block.id, 'down')}
                      disabled={index === sortedBlocks.length - 1}
                      className="p-1 hover:bg-ovh-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <svg className="w-3 h-3 text-ovh-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteBlock(block.id)}
                      className="p-1 hover:bg-red-50 rounded text-red-500"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Contenu du bloc */}
                <div className="p-3">
                  {/* Titre */}
                  {block.type === 'title' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        className="w-full px-3 py-2 text-lg font-bold border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-2 focus:ring-ovh-primary"
                        placeholder="Titre"
                      />
                      {/* Contrôles d'alignement */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-ovh-gray-500">Alignement :</span>
                        <div className="flex gap-1 border border-ovh-gray-300 rounded-ovh p-1">
                          <button
                            onClick={() => updateBlock(block.id, { 
                              settings: { ...block.settings, alignment: 'left' } 
                            })}
                            className={`p-1.5 rounded transition-colors ${
                              (block.settings?.alignment || 'left') === 'left'
                                ? 'bg-ovh-primary text-white'
                                : 'text-ovh-gray-600 hover:bg-ovh-gray-100'
                            }`}
                            title="Aligner à gauche"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                          </button>
                          <button
                            onClick={() => updateBlock(block.id, { 
                              settings: { ...block.settings, alignment: 'center' } 
                            })}
                            className={`p-1.5 rounded transition-colors ${
                              block.settings?.alignment === 'center'
                                ? 'bg-ovh-primary text-white'
                                : 'text-ovh-gray-600 hover:bg-ovh-gray-100'
                            }`}
                            title="Centrer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M8 12h8M4 18h16" />
                            </svg>
                          </button>
                          <button
                            onClick={() => updateBlock(block.id, { 
                              settings: { ...block.settings, alignment: 'right' } 
                            })}
                            className={`p-1.5 rounded transition-colors ${
                              block.settings?.alignment === 'right'
                                ? 'bg-ovh-primary text-white'
                                : 'text-ovh-gray-600 hover:bg-ovh-gray-100'
                            }`}
                            title="Aligner à droite"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 6h-16M20 12h-16M20 18h-16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sous-titre */}
                  {block.type === 'subtitle' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        className="w-full px-3 py-2 text-base border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-2 focus:ring-ovh-primary"
                        placeholder="Sous-titre"
                      />
                      {/* Contrôles d'alignement */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-ovh-gray-500">Alignement :</span>
                        <div className="flex gap-1 border border-ovh-gray-300 rounded-ovh p-1">
                          <button
                            onClick={() => updateBlock(block.id, { 
                              settings: { ...block.settings, alignment: 'left' } 
                            })}
                            className={`p-1.5 rounded transition-colors ${
                              (block.settings?.alignment || 'left') === 'left'
                                ? 'bg-ovh-primary text-white'
                                : 'text-ovh-gray-600 hover:bg-ovh-gray-100'
                            }`}
                            title="Aligner à gauche"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                          </button>
                          <button
                            onClick={() => updateBlock(block.id, { 
                              settings: { ...block.settings, alignment: 'center' } 
                            })}
                            className={`p-1.5 rounded transition-colors ${
                              block.settings?.alignment === 'center'
                                ? 'bg-ovh-primary text-white'
                                : 'text-ovh-gray-600 hover:bg-ovh-gray-100'
                            }`}
                            title="Centrer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M8 12h8M4 18h16" />
                            </svg>
                          </button>
                          <button
                            onClick={() => updateBlock(block.id, { 
                              settings: { ...block.settings, alignment: 'right' } 
                            })}
                            className={`p-1.5 rounded transition-colors ${
                              block.settings?.alignment === 'right'
                                ? 'bg-ovh-primary text-white'
                                : 'text-ovh-gray-600 hover:bg-ovh-gray-100'
                            }`}
                            title="Aligner à droite"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 6h-16M20 12h-16M20 18h-16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Texte */}
                  {block.type === 'text' && (
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-2 focus:ring-ovh-primary resize-none"
                      placeholder="Votre texte..."
                    />
                  )}

                  {/* Image */}
                  {block.type === 'image' && (
                    <div>
                      {block.content ? (
                        <div className="relative group">
                          <img
                            src={block.content}
                            alt="Image"
                            className="w-full h-32 object-cover rounded-ovh"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-ovh">
                            <button
                              onClick={() => {
                                setActiveBlockId(block.id)
                                setMediaType('image')
                                setShowMediaPicker(true)
                              }}
                              className="px-3 py-1 bg-white text-ovh-gray-900 rounded text-sm"
                            >
                              Changer
                            </button>
                            <button
                              onClick={() => updateBlock(block.id, { content: '' })}
                              className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveBlockId(block.id)
                            setMediaType('image')
                            setShowMediaPicker(true)
                          }}
                          className="w-full h-32 border-2 border-dashed border-ovh-gray-300 rounded-ovh flex flex-col items-center justify-center hover:border-ovh-primary transition-colors"
                        >
                          <svg className="w-8 h-8 mb-1 text-ovh-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-ovh-gray-500">Ajouter une image</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Vidéo */}
                  {block.type === 'video' && (
                    <div>
                      {block.content ? (
                        <div className="relative group">
                          <video
                            src={block.content}
                            className="w-full h-32 object-cover rounded-ovh"
                            controls
                          />
                          <button
                            onClick={() => updateBlock(block.id, { content: '' })}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveBlockId(block.id)
                            setMediaType('video')
                            setShowMediaPicker(true)
                          }}
                          className="w-full h-32 border-2 border-dashed border-ovh-gray-300 rounded-ovh flex flex-col items-center justify-center hover:border-ovh-primary transition-colors"
                        >
                          <svg className="w-8 h-8 mb-1 text-ovh-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-ovh-gray-500">Ajouter une vidéo</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Audio */}
                  {block.type === 'audio' && (
                    <div>
                      {block.content ? (
                        <div className="relative group">
                          <audio
                            src={block.content}
                            className="w-full"
                            controls
                          />
                          <button
                            onClick={() => updateBlock(block.id, { content: '' })}
                            className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveBlockId(block.id)
                            setMediaType('audio')
                            setShowMediaPicker(true)
                          }}
                          className="w-full h-20 border-2 border-dashed border-ovh-gray-300 rounded-ovh flex flex-col items-center justify-center hover:border-ovh-primary transition-colors"
                        >
                          <svg className="w-8 h-8 mb-1 text-ovh-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                          <span className="text-sm text-ovh-gray-500">Ajouter un audio</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Bouton */}
                  {block.type === 'button' && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-2 focus:ring-ovh-primary"
                        placeholder="Texte du bouton"
                      />
                      <div>
                        <label className="block text-xs font-medium text-ovh-gray-600 mb-1">Lien</label>
                        <select
                          value={(block.settings?.linkMode as string) || 'url'}
                          onChange={(e) => {
                            const mode = e.target.value as 'url' | 'page' | 'section'
                            updateBlock(block.id, {
                              settings: {
                                ...block.settings,
                                linkMode: mode,
                                link: mode === 'url' ? (block.settings?.link || '#') : undefined,
                                pageId: mode === 'page' ? (block.settings?.pageId || '') : undefined,
                                pageSlug: mode === 'page' ? (block.settings?.pageSlug || '') : undefined,
                                sectionId: mode === 'section' ? (block.settings?.sectionId || '') : undefined,
                              },
                            })
                          }}
                          className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-2 focus:ring-ovh-primary text-sm"
                        >
                          <option value="url">URL externe</option>
                          <option value="page">Page du site</option>
                          <option value="section">Section (ancre)</option>
                        </select>
                      </div>
                      {(block.settings?.linkMode || 'url') === 'url' && (
                        <input
                          type="text"
                          value={block.settings?.link || ''}
                          onChange={(e) => updateBlock(block.id, { settings: { ...block.settings, link: e.target.value } })}
                          className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-2 focus:ring-ovh-primary text-sm"
                          placeholder="https://..."
                        />
                      )}
                      {(block.settings?.linkMode || 'url') === 'page' && (
                        <select
                          value={block.settings?.pageId || ''}
                          onChange={(e) => {
                            const page = site.pages.find((p) => p.id === e.target.value)
                            updateBlock(block.id, {
                              settings: {
                                ...block.settings,
                                pageId: page?.id || '',
                                pageSlug: page?.slug || '',
                              },
                            })
                          }}
                          className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-2 focus:ring-ovh-primary text-sm"
                        >
                          <option value="">Choisir une page</option>
                          {site.pages.map((p) => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                          ))}
                        </select>
                      )}
                      {(block.settings?.linkMode || 'url') === 'section' && currentPage && (
                        <select
                          value={block.settings?.sectionId || ''}
                          onChange={(e) => updateBlock(block.id, { settings: { ...block.settings, sectionId: e.target.value } })}
                          className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-2 focus:ring-ovh-primary text-sm"
                        >
                          <option value="">Choisir une section</option>
                          {[...currentPage.sections].sort((a, b) => a.order - b.order).map((s) => (
                            <option key={s.id} value={s.id}>Section {s.type}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                  {/* Forme, Galerie, Formulaire contact, Icônes sociales */}
                  {['shape', 'gallery', 'contact-form', 'social-icons'].includes(block.type) && (
                    <div className="space-y-2">
                      <p className="text-xs text-ovh-gray-500">Élément {block.type}</p>
                      <input
                        type="text"
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh text-sm"
                        placeholder="Libellé ou contenu"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer avec bouton d'ajout */}
        <div className="px-6 py-4 bg-white border-t border-ovh-gray-200 flex-shrink-0">
          <div className="relative">
            <button
              onClick={() => setShowBlockMenu(!showBlockMenu)}
              className="w-full px-4 py-2.5 bg-ovh-primary text-white rounded-lg font-semibold hover:bg-ovh-primary-hover transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un bloc
            </button>

            {showBlockMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowBlockMenu(false)} />
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-ovh-gray-200 rounded-xl shadow-lg z-20 max-h-64 overflow-y-auto">
                  {CONTENT_BLOCK_TYPES.map((type) => (
                    <button
                      key={type.type}
                      onClick={() => addBlock(type.type)}
                      className="w-full px-4 py-3 text-left hover:bg-ovh-gray-50 transition-colors flex items-center gap-3 border-b border-ovh-gray-100 last:border-b-0"
                    >
                      {type.iconSrc ? (
                        <Image
                          src={type.iconSrc}
                          alt={type.label}
                          width={24}
                          height={24}
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <Image
                          src="/pictos/page-query.png"
                          alt="Bloc"
                          width={24}
                          height={24}
                          className="w-6 h-6 object-contain"
                        />
                      )}
                      <div>
                        <div className="font-medium text-ovh-gray-800">{type.label}</div>
                        <div className="text-xs text-ovh-gray-500">{type.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        </>
        )}

          </div>
        </div>
      </div>
    </div>
  )

  const mediaPicker = showMediaPicker ? (
    <div className="fixed inset-0 z-[210] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => setShowMediaPicker(false)} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-[90vw] max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-start justify-between px-6 py-4 border-b border-ovh-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-ovh-gray-900">
              Sélectionner {mediaType === 'image' ? 'une image' : mediaType === 'video' ? 'une vidéo' : 'un audio'}
            </h2>
            <p className="text-sm text-ovh-gray-500 mt-0.5">Choisissez un média depuis votre bibliothèque</p>
          </div>
          <button
            type="button"
            onClick={() => setShowMediaPicker(false)}
            className="p-2 hover:bg-ovh-gray-100 rounded-lg transition-colors flex-shrink-0 -mt-1 -mr-1"
          >
            <svg className="w-5 h-5 text-ovh-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {getMediaForType().length === 0 ? (
            <div className="text-center py-12 text-ovh-gray-500">
              <p>Aucun {mediaType === 'image' ? 'image' : mediaType === 'video' ? 'vidéo' : 'audio'} dans la médiathèque</p>
              <p className="text-sm mt-2">Ajoutez des fichiers via la médiathèque ou par drag &amp; drop</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {getMediaForType().map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMediaSelect(item.url)}
                  className="aspect-square rounded-xl overflow-hidden border-2 border-ovh-gray-200 hover:border-ovh-primary transition-colors"
                >
                  {mediaType === 'image' ? (
                    <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                  ) : mediaType === 'video' ? (
                    <video src={item.url} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-ovh-gray-100">
                      <svg className="w-12 h-12 text-ovh-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null

  return createPortal(
    <>
      {modal}
      {mediaPicker}
    </>,
    document.body
  )
}
