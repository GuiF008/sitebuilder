'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { BlockData } from '@/components/shared/BlockRenderer'
import type { Media } from '@prisma/client'

interface BlockSettingsModalProps {
  block: BlockData
  media: Media[]
  pages: Array<{ id: string; title: string; slug: string }>
  sections: Array<{ id: string; type: string }>
  onUpdate: (blockId: string, updates: Partial<BlockData>) => void
  onDelete: (blockId: string) => void
  onClose: () => void
}

export function BlockSettingsModal({
  block,
  media,
  pages,
  sections,
  onUpdate,
  onDelete,
  onClose,
}: BlockSettingsModalProps) {
  const [content, setContent] = useState(block.content)
  const [settings, setSettings] = useState<Record<string, unknown>>(block.settings || {})
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [mediaFilter, setMediaFilter] = useState<'image' | 'video' | 'audio'>('image')

  useEffect(() => {
    setContent(block.content)
    setSettings(block.settings || {})
  }, [block.id, block.content, block.settings])

  const save = (c?: string, s?: Record<string, unknown>) => {
    onUpdate(block.id, {
      content: c ?? content,
      settings: s ?? settings,
    })
  }

  const images = media.filter(m => m.type === 'image')
  const videos = media.filter(m => m.type === 'video')
  const audios = media.filter(m => m.type === 'audio')

  const filteredMedia = mediaFilter === 'image' ? images : mediaFilter === 'video' ? videos : audios

  const typeLabels: Record<string, string> = {
    title: 'Titre', subtitle: 'Sous-titre', text: 'Texte',
    image: 'Image', video: 'Vidéo', audio: 'Audio',
    button: 'Bouton', gallery: 'Galerie',
    'contact-form': 'Formulaire', 'social-icons': 'Icônes sociales',
  }

  if (typeof document === 'undefined') return null

  const renderTextConfig = () => {
    const textType = block.type as 'title' | 'subtitle' | 'text'
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ovh-gray-700 mb-1.5">Type de texte</label>
          <div className="flex gap-2">
            {[
              { value: 'title', label: 'Titre' },
              { value: 'subtitle', label: 'Sous-titre' },
              { value: 'text', label: 'Texte simple' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onUpdate(block.id, { type: opt.value, content, settings })
                }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                  textType === opt.value
                    ? 'border-ovh-primary bg-ovh-primary/10 text-ovh-primary'
                    : 'border-ovh-gray-200 text-ovh-gray-600 hover:border-ovh-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-ovh-gray-700 mb-1.5">Contenu</label>
          {block.type === 'text' ? (
            <textarea
              value={content}
              onChange={(e) => { setContent(e.target.value); save(e.target.value) }}
              rows={4}
              className="w-full px-3 py-2 border border-ovh-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ovh-primary resize-none"
              placeholder="Votre texte..."
            />
          ) : (
            <input
              type="text"
              value={content}
              onChange={(e) => { setContent(e.target.value); save(e.target.value) }}
              className="w-full px-3 py-2 border border-ovh-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ovh-primary"
              placeholder={block.type === 'title' ? 'Votre titre...' : 'Votre sous-titre...'}
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-ovh-gray-700 mb-1.5">Alignement</label>
          <div className="flex gap-1">
            {(['left', 'center', 'right'] as const).map((align) => (
              <button
                key={align}
                type="button"
                onClick={() => { const s = { ...settings, alignment: align }; setSettings(s); save(undefined, s) }}
                className={`flex-1 py-2 text-xs font-medium rounded-lg border ${
                  (settings.alignment || 'left') === align
                    ? 'border-ovh-primary bg-ovh-primary text-white'
                    : 'border-ovh-gray-200 text-ovh-gray-700 hover:border-ovh-gray-300'
                }`}
              >
                {align === 'left' ? 'Gauche' : align === 'center' ? 'Centre' : 'Droite'}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderMediaPicker = (type: 'image' | 'video' | 'audio') => {
    const items = type === 'image' ? images : type === 'video' ? videos : audios
    const currentSize = (settings.imageSize as string) || 'full'
    const currentAlign = (settings.alignment as string) || 'left'
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ovh-gray-700 mb-1.5">
            {type === 'image' ? 'Choisir une image' : type === 'video' ? 'Choisir une vidéo' : 'Choisir un audio'}
          </label>
          {content && (
            <div className="relative mb-3 rounded-lg overflow-hidden border border-ovh-gray-200">
              {type === 'image' && <img src={content} alt="" className="w-full h-40 object-cover" />}
              {type === 'video' && <video src={content} controls className="w-full h-40 object-cover" />}
              {type === 'audio' && <audio src={content} controls className="w-full" />}
              <button
                type="button"
                onClick={() => { setContent(''); save('') }}
                className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded shadow"
              >
                Retirer
              </button>
            </div>
          )}
          {items.length === 0 ? (
            <div className="text-center py-8 text-ovh-gray-500 border-2 border-dashed border-ovh-gray-200 rounded-lg">
              <p className="text-sm">Aucun fichier dans la bibliothèque</p>
              <p className="text-xs mt-1">Ajoutez des fichiers via l&apos;onglet Bibliothèque</p>
            </div>
          ) : (
            <div className={`grid gap-2 ${type === 'audio' ? 'grid-cols-1' : 'grid-cols-3'}`}>
              {items.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => { setContent(m.url); save(m.url) }}
                  className={`rounded-lg overflow-hidden border-2 transition-colors ${
                    content === m.url ? 'border-ovh-primary ring-2 ring-ovh-primary/30' : 'border-ovh-gray-200 hover:border-ovh-primary'
                  } ${type === 'audio' ? 'p-3 flex items-center gap-3' : 'aspect-square'}`}
                >
                  {type === 'image' && <img src={m.url} alt="" className="w-full h-full object-cover" />}
                  {type === 'video' && <video src={m.url} className="w-full h-full object-cover" />}
                  {type === 'audio' && (
                    <>
                      <svg className="w-6 h-6 text-ovh-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      <span className="text-sm text-ovh-gray-700 truncate">{m.filename}</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {type === 'image' && (
          <>
            <div>
              <label className="block text-sm font-medium text-ovh-gray-700 mb-1.5">Taille de l&apos;image</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 'small', label: 'Petite', desc: '200px' },
                  { value: 'medium', label: 'Moyenne', desc: '400px' },
                  { value: 'large', label: 'Grande', desc: '600px' },
                  { value: 'full', label: 'Pleine', desc: '100%' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { const s = { ...settings, imageSize: opt.value }; setSettings(s); save(undefined, s) }}
                    className={`py-2 px-1 text-center rounded-lg border-2 transition-colors ${
                      currentSize === opt.value
                        ? 'border-ovh-primary bg-ovh-primary/10 text-ovh-primary'
                        : 'border-ovh-gray-200 text-ovh-gray-600 hover:border-ovh-gray-300'
                    }`}
                  >
                    <span className="block text-xs font-medium">{opt.label}</span>
                    <span className="block text-[10px] text-ovh-gray-400 mt-0.5">{opt.desc}</span>
                  </button>
                ))}
              </div>
              {content && (
                <div className="mt-2 border border-ovh-gray-200 rounded-lg p-3 bg-ovh-gray-50">
                  <p className="text-[10px] text-ovh-gray-400 mb-1.5">Aperçu</p>
                  <div className={`${currentAlign === 'center' ? 'flex justify-center' : currentAlign === 'right' ? 'flex justify-end' : ''}`}>
                    <img
                      src={content}
                      alt=""
                      className="h-auto rounded object-cover"
                      style={{ maxWidth: currentSize === 'small' ? '80px' : currentSize === 'medium' ? '140px' : currentSize === 'large' ? '200px' : '100%' }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-ovh-gray-700 mb-1.5">Alignement</label>
              <div className="flex gap-1">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    type="button"
                    onClick={() => { const s = { ...settings, alignment: align }; setSettings(s); save(undefined, s) }}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg border ${
                      currentAlign === align
                        ? 'border-ovh-primary bg-ovh-primary text-white'
                        : 'border-ovh-gray-200 text-ovh-gray-700 hover:border-ovh-gray-300'
                    }`}
                  >
                    {align === 'left' ? 'Gauche' : align === 'center' ? 'Centre' : 'Droite'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ovh-gray-700 mb-1.5">Texte alternatif</label>
              <input
                type="text"
                value={(settings.alt as string) || ''}
                onChange={(e) => { const s = { ...settings, alt: e.target.value }; setSettings(s); save(undefined, s) }}
                className="w-full px-3 py-2 border border-ovh-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ovh-primary text-sm"
                placeholder="Description de l'image (accessibilité)"
              />
            </div>
          </>
        )}
      </div>
    )
  }

  const renderButtonConfig = () => {
    const linkMode = (settings.linkMode as string) || 'url'
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ovh-gray-700 mb-1.5">Texte du bouton</label>
          <input
            type="text"
            value={content}
            onChange={(e) => { setContent(e.target.value); save(e.target.value) }}
            className="w-full px-3 py-2 border border-ovh-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ovh-primary"
            placeholder="Cliquez ici"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ovh-gray-700 mb-1.5">Type de lien</label>
          <select
            value={linkMode}
            onChange={(e) => {
              const mode = e.target.value
              const s = { ...settings, linkMode: mode }
              setSettings(s)
              save(undefined, s)
            }}
            className="w-full px-3 py-2 border border-ovh-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ovh-primary text-sm"
          >
            <option value="url">URL externe</option>
            <option value="page">Page du site</option>
            <option value="section">Section (ancre)</option>
          </select>
        </div>
        {linkMode === 'url' && (
          <div>
            <label className="block text-sm font-medium text-ovh-gray-700 mb-1.5">URL</label>
            <input
              type="text"
              value={(settings.link as string) || ''}
              onChange={(e) => { const s = { ...settings, link: e.target.value }; setSettings(s); save(undefined, s) }}
              className="w-full px-3 py-2 border border-ovh-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ovh-primary text-sm"
              placeholder="https://..."
            />
          </div>
        )}
        {linkMode === 'page' && (
          <div>
            <label className="block text-sm font-medium text-ovh-gray-700 mb-1.5">Page</label>
            <select
              value={(settings.pageId as string) || ''}
              onChange={(e) => {
                const page = pages.find(p => p.id === e.target.value)
                const s = { ...settings, pageId: page?.id || '', pageSlug: page?.slug || '' }
                setSettings(s)
                save(undefined, s)
              }}
              className="w-full px-3 py-2 border border-ovh-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ovh-primary text-sm"
            >
              <option value="">Choisir une page</option>
              {pages.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
        )}
        {linkMode === 'section' && (
          <div>
            <label className="block text-sm font-medium text-ovh-gray-700 mb-1.5">Section</label>
            <select
              value={(settings.sectionId as string) || ''}
              onChange={(e) => { const s = { ...settings, sectionId: e.target.value }; setSettings(s); save(undefined, s) }}
              className="w-full px-3 py-2 border border-ovh-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ovh-primary text-sm"
            >
              <option value="">Choisir une section</option>
              {sections.map(s => <option key={s.id} value={s.id}>Section {s.type}</option>)}
            </select>
          </div>
        )}
      </div>
    )
  }

  const renderGalleryConfig = () => {
    let galleryImages: string[] = []
    try { galleryImages = JSON.parse(content || '[]') } catch { galleryImages = [] }
    const columns = (settings.columns as number) || 3

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ovh-gray-700 mb-1.5">Nombre de colonnes</label>
          <div className="flex gap-2">
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => { const s = { ...settings, columns: n }; setSettings(s); save(undefined, s) }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg border-2 ${
                  columns === n
                    ? 'border-ovh-primary bg-ovh-primary/10 text-ovh-primary'
                    : 'border-ovh-gray-200 text-ovh-gray-600 hover:border-ovh-gray-300'
                }`}
              >
                {n} colonnes
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-ovh-gray-700">Images ({galleryImages.length})</label>
            <button
              type="button"
              onClick={() => { setMediaFilter('image'); setShowMediaPicker(true) }}
              className="text-xs text-ovh-primary font-medium hover:underline"
            >
              + Ajouter
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {galleryImages.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-ovh-gray-200 group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    const next = galleryImages.filter((_, idx) => idx !== i)
                    const c = JSON.stringify(next)
                    setContent(c)
                    save(c)
                  }}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {galleryImages.length === 0 && (
            <div className="text-center py-6 border-2 border-dashed border-ovh-gray-200 rounded-lg">
              <p className="text-sm text-ovh-gray-400">Aucune image</p>
              <button
                type="button"
                onClick={() => { setMediaFilter('image'); setShowMediaPicker(true) }}
                className="text-sm text-ovh-primary font-medium mt-1 hover:underline"
              >
                Ajouter depuis la bibliothèque
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderSocialConfig = () => {
    let icons: Array<{ platform: string; url: string }> = []
    try { icons = JSON.parse(content || '[]') } catch { icons = [] }

    const availablePlatforms = [
      { id: 'facebook', label: 'Facebook', color: '#1877F2' },
      { id: 'twitter', label: 'X (Twitter)', color: '#1DA1F2' },
      { id: 'instagram', label: 'Instagram', color: '#E4405F' },
      { id: 'linkedin', label: 'LinkedIn', color: '#0A66C2' },
      { id: 'youtube', label: 'YouTube', color: '#FF0000' },
      { id: 'tiktok', label: 'TikTok', color: '#000000' },
      { id: 'pinterest', label: 'Pinterest', color: '#BD081C' },
      { id: 'github', label: 'GitHub', color: '#181717' },
    ]

    const updateIcons = (newIcons: typeof icons) => {
      const c = JSON.stringify(newIcons)
      setContent(c)
      save(c)
    }

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ovh-gray-700 mb-2">Réseaux sociaux</label>
          <div className="space-y-2">
            {icons.map((icon, i) => {
              const platform = availablePlatforms.find(p => p.id === icon.platform)
              return (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: platform?.color || '#6B7280' }}
                  >
                    {icon.platform.charAt(0).toUpperCase()}
                  </span>
                  <input
                    type="text"
                    value={icon.url}
                    onChange={(e) => {
                      const next = [...icons]
                      next[i] = { ...next[i], url: e.target.value }
                      updateIcons(next)
                    }}
                    className="flex-1 px-2 py-1.5 border border-ovh-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ovh-primary"
                    placeholder={`URL ${platform?.label || icon.platform}`}
                  />
                  <button
                    type="button"
                    onClick={() => updateIcons(icons.filter((_, idx) => idx !== i))}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-ovh-gray-700 mb-1.5">Ajouter un réseau</label>
          <div className="flex flex-wrap gap-2">
            {availablePlatforms
              .filter(p => !icons.some(i => i.platform === p.id))
              .map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => updateIcons([...icons, { platform: p.id, url: '' }])}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 border border-ovh-gray-200 rounded-lg text-xs hover:border-ovh-primary transition-colors"
                >
                  <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                  {p.label}
                </button>
              ))}
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (block.type) {
      case 'title':
      case 'subtitle':
      case 'text':
        return renderTextConfig()
      case 'image':
        return renderMediaPicker('image')
      case 'video':
        return renderMediaPicker('video')
      case 'audio':
        return renderMediaPicker('audio')
      case 'button':
        return renderButtonConfig()
      case 'gallery':
        return renderGalleryConfig()
      case 'social-icons':
        return renderSocialConfig()
      case 'contact-form':
        return (
          <div className="text-sm text-ovh-gray-500 py-4 text-center">
            Le formulaire de contact est automatiquement généré.
          </div>
        )
      default:
        return null
    }
  }

  const mediaPickerModal = showMediaPicker ? (
    <div className="fixed inset-0 z-[310] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => setShowMediaPicker(false)} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[90vw] max-w-[560px] max-h-[70vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-ovh-gray-200">
          <h3 className="text-sm font-bold text-ovh-gray-900">Choisir un fichier</h3>
          <button type="button" onClick={() => setShowMediaPicker(false)} className="p-1 hover:bg-ovh-gray-100 rounded">
            <svg className="w-4 h-4 text-ovh-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {filteredMedia.length === 0 ? (
            <div className="text-center py-8 text-ovh-gray-500">
              <p className="text-sm">Aucun fichier disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {filteredMedia.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    if (block.type === 'gallery') {
                      let galleryImages: string[] = []
                      try { galleryImages = JSON.parse(content || '[]') } catch { galleryImages = [] }
                      const c = JSON.stringify([...galleryImages, m.url])
                      setContent(c)
                      save(c)
                    } else {
                      setContent(m.url)
                      save(m.url)
                    }
                    setShowMediaPicker(false)
                  }}
                  className="aspect-square rounded-lg overflow-hidden border-2 border-ovh-gray-200 hover:border-ovh-primary transition-colors"
                >
                  {mediaFilter === 'image' && <img src={m.url} alt="" className="w-full h-full object-cover" />}
                  {mediaFilter === 'video' && <video src={m.url} className="w-full h-full object-cover" />}
                  {mediaFilter === 'audio' && (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-ovh-gray-50 p-2">
                      <svg className="w-8 h-8 text-ovh-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      <span className="text-[10px] text-ovh-gray-500 truncate w-full text-center">{m.filename}</span>
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
    <div className="fixed inset-0 z-[300] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[90vw] max-w-[520px] max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ovh-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-ovh-gray-900">
              Paramétrer : {typeLabels[block.type] || block.type}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { onDelete(block.id); onClose() }}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Supprimer l'élément"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button type="button" onClick={onClose} className="p-2 hover:bg-ovh-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-ovh-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </div>
      </div>
      {mediaPickerModal}
    </div>,
    document.body
  )
}
