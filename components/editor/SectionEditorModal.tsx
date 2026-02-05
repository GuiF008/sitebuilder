'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { SiteWithRelations, ComputedTheme, ContentBlock, ContentBlockType, CONTENT_BLOCK_TYPES } from '@/lib/types'
import { ColorPicker } from '@/components/ui'

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
  settingsModalOpen?: boolean // Pour positionner en cascade
}

// Générer un ID unique pour les blocs
const generateBlockId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

export function SectionEditorModal({
  isOpen,
  onClose,
  section,
  site,
  theme,
  onUpdate,
  settingsModalOpen = false,
}: SectionEditorModalProps) {
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'audio'>('image')
  const [showBlockMenu, setShowBlockMenu] = useState(false)
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null)
  const [showStylePanel, setShowStylePanel] = useState(false)
  
  // Styles de section
  const [sectionStyles, setSectionStyles] = useState({
    backgroundColor: theme.colors.background,
    headingFont: theme.fonts.heading,
    bodyFont: theme.fonts.body,
    headingColor: theme.colors.text,
    textColor: theme.colors.text,
    buttonStyle: theme.buttonStyle,
  })

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

  // Ajouter un bloc
  const addBlock = (type: ContentBlockType) => {
    const maxOrder = blocks.length > 0 ? Math.max(...blocks.map(b => b.order)) : -1
    const newBlock: ContentBlock = {
      id: generateBlockId(),
      type,
      order: maxOrder + 1,
      content: type === 'title' ? 'Nouveau titre' 
             : type === 'subtitle' ? 'Nouveau sous-titre'
             : type === 'text' ? 'Votre texte ici...'
             : type === 'button' ? 'Cliquez ici'
             : '',
      settings: type === 'button' ? { link: '#' } : undefined
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

  return (
    <>
      {/* Modal - s'ouvre en cascade à droite de SettingsModal */}
      <aside
        className={`
          fixed top-[60px] bottom-[52px] w-[420px] max-w-full
          bg-white border-l border-ovh-gray-200 z-[60]
          transform transition-all duration-300 ease-out
          overflow-hidden flex flex-col
          ${settingsModalOpen ? 'left-[420px]' : 'left-0'}
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-ovh-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg text-ovh-gray-900">Éditer la section</h2>
              <p className="text-sm text-ovh-gray-500">Ajoutez et organisez le contenu</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-ovh-gray-100 rounded-ovh transition-colors"
            >
              <svg className="w-5 h-5 text-ovh-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Style de la section */}
        <div className="px-5 py-3 bg-ovh-gray-50 border-b border-ovh-gray-200">
          <button
            onClick={() => setShowStylePanel(!showStylePanel)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Image
                src="/pictos/brush.png"
                alt="Style"
                width={20}
                height={20}
                className="w-5 h-5 object-contain"
              />
              <span className="font-semibold text-sm text-ovh-gray-800">Style de la section</span>
            </div>
            <svg
              className={`w-4 h-4 text-ovh-gray-400 transition-transform duration-200 ${
                showStylePanel ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showStylePanel && (
            <div className="mt-4 space-y-4 pb-2">
              {/* Couleur de fond */}
              <ColorPicker
                label="Couleur de fond"
                value={sectionStyles.backgroundColor}
                onChange={(color) => saveSectionStyles({ ...sectionStyles, backgroundColor: color })}
              />

              {/* Polices */}
              <div>
                <label className="block text-sm font-medium text-ovh-gray-700 mb-1.5">
                  Police des titres
                </label>
                <select
                  value={sectionStyles.headingFont}
                  onChange={(e) => saveSectionStyles({ ...sectionStyles, headingFont: e.target.value })}
                  className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-2 focus:ring-ovh-primary text-sm"
                >
                  {FONTS.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ovh-gray-700 mb-1.5">
                  Police du texte
                </label>
                <select
                  value={sectionStyles.bodyFont}
                  onChange={(e) => saveSectionStyles({ ...sectionStyles, bodyFont: e.target.value })}
                  className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-2 focus:ring-ovh-primary text-sm"
                >
                  {FONTS.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Couleurs du texte */}
              <ColorPicker
                label="Couleur des titres"
                value={sectionStyles.headingColor}
                onChange={(color) => saveSectionStyles({ ...sectionStyles, headingColor: color })}
              />

              <ColorPicker
                label="Couleur du texte"
                value={sectionStyles.textColor}
                onChange={(color) => saveSectionStyles({ ...sectionStyles, textColor: color })}
              />

              {/* Style des boutons */}
              <div>
                <label className="block text-sm font-medium text-ovh-gray-700 mb-2">
                  Style des boutons
                </label>
                <div className="flex gap-2">
                  {BUTTON_STYLES.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => saveSectionStyles({ ...sectionStyles, buttonStyle: style.value as 'square' | 'rounded' | 'pill' })}
                      className={`
                        flex-1 py-2 px-3 border-2 text-xs font-medium transition-all
                        ${style.value === 'square' ? 'rounded-none' : ''}
                        ${style.value === 'rounded' ? 'rounded-ovh' : ''}
                        ${style.value === 'pill' ? 'rounded-full' : ''}
                        ${sectionStyles.buttonStyle === style.value
                          ? 'border-ovh-primary bg-ovh-primary text-white'
                          : 'border-ovh-gray-300 text-ovh-gray-600 hover:border-ovh-gray-400'}
                      `}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Liste des blocs */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {sortedBlocks.length === 0 ? (
            <div className="text-center py-12 text-ovh-gray-500 border-2 border-dashed border-ovh-gray-200 rounded-ovh">
              <p className="mb-2">Aucun contenu</p>
              <p className="text-sm">Ajoutez des blocs pour commencer</p>
            </div>
          ) : (
            sortedBlocks.map((block) => (
              <div
                key={block.id}
                draggable
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
                  <button
                    onClick={() => deleteBlock(block.id)}
                    className="p-1 hover:bg-red-50 rounded text-red-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
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
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-2 focus:ring-ovh-primary"
                        placeholder="Texte du bouton"
                      />
                      <input
                        type="text"
                        value={block.settings?.link || ''}
                        onChange={(e) => updateBlock(block.id, { settings: { ...block.settings, link: e.target.value } })}
                        className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-2 focus:ring-ovh-primary text-sm"
                        placeholder="Lien (URL)"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer avec bouton d'ajout */}
        <div className="px-5 py-4 bg-white border-t border-ovh-gray-200 flex-shrink-0">
          <div className="relative">
            <button
              onClick={() => setShowBlockMenu(!showBlockMenu)}
              className="w-full px-4 py-2 bg-ovh-primary text-white rounded-ovh font-medium hover:bg-ovh-primary-hover transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un bloc
            </button>

            {/* Menu d'ajout de bloc */}
            {showBlockMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowBlockMenu(false)} />
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-ovh-gray-200 rounded-ovh shadow-lg z-20 max-h-64 overflow-y-auto">
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
      </aside>

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[70]" onClick={() => setShowMediaPicker(false)} />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-ovh-lg max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h3 className="font-bold text-lg">
                  Sélectionner {mediaType === 'image' ? 'une image' : mediaType === 'video' ? 'une vidéo' : 'un audio'}
                </h3>
                <button onClick={() => setShowMediaPicker(false)} className="p-2 hover:bg-ovh-gray-100 rounded-ovh">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {getMediaForType().length === 0 ? (
                  <div className="text-center py-12 text-ovh-gray-500">
                    <p>Aucun {mediaType === 'image' ? 'image' : mediaType === 'video' ? 'vidéo' : 'audio'} dans la médiathèque</p>
                    <p className="text-sm mt-2">Ajoutez des fichiers via la médiathèque ou par drag & drop</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {getMediaForType().map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleMediaSelect(item.url)}
                        className="aspect-square rounded-ovh overflow-hidden border-2 border-ovh-gray-200 hover:border-ovh-primary transition-colors"
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
        </>
      )}
    </>
  )
}
