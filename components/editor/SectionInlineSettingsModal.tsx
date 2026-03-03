'use client'

import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { safeJsonParse } from '@/lib/utils'
import { SectionStyles } from '@/lib/types'
import { ColorPickerModal } from '@/components/ui'

type TabId = 'background'
type BgSubTab = 'color' | 'image' | 'video'
type ColorMode = 'solid' | 'gradient'
type ColorPickerTarget = 'bg' | 'grad1' | 'grad2' | 'overlay'

interface SectionInlineSettingsModalProps {
  section: { id: string; type: string; dataJson: string }
  theme: { colors: { primary: string; background: string; secondary: string; accent: string; text: string; muted: string } }
  siteMedia: Array<{ id: string; url: string; filename: string; originalName?: string | null; type?: string }>
  onUpdate: (sectionId: string, data: Record<string, unknown>) => void
  onDuplicate: (section: { id: string; type: string; dataJson: string }) => void
  onDelete: (sectionId: string) => void
  onReorderUp: (sectionId: string) => void
  onReorderDown: (sectionId: string) => void
  canMoveUp: boolean
  canMoveDown: boolean
  onClose: () => void
  onEdit?: () => void
}

function ColorSwatchButton({
  value,
  onClick,
  label,
}: { value: string; onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-8 h-8 rounded-lg border-2 border-white shadow-md cursor-pointer overflow-hidden flex-shrink-0 hover:scale-105 transition-transform"
      style={{ backgroundColor: value }}
      title={label || 'Choisir une couleur'}
    />
  )
}

export function SectionInlineSettingsModal({
  section,
  theme,
  siteMedia,
  onUpdate,
  onDuplicate,
  onDelete,
  onReorderUp,
  onReorderDown,
  canMoveUp,
  canMoveDown,
  onClose,
  onEdit,
}: SectionInlineSettingsModalProps) {
  const data = safeJsonParse<Record<string, unknown>>(section.dataJson, {}) || {}
  const sectionStyles: SectionStyles = (data.sectionStyles as SectionStyles) || {}
  const bgMode = sectionStyles.bgMode || 'color'
  const gradColor1 = sectionStyles.gradientColor1 || theme.colors.primary
  const gradColor2 = sectionStyles.gradientColor2 || theme.colors.secondary
  const gradAngle = sectionStyles.gradientAngle ?? 135
  const bgColor = sectionStyles.backgroundColor || theme.colors.background
  const bgImage = sectionStyles.backgroundImage || ''
  const bgVideo = sectionStyles.backgroundVideo || ''
  const overlayColor = sectionStyles.overlayColor || '#000000'
  const overlayOpacity = sectionStyles.overlayOpacity ?? 0.5
  const bgFixed = sectionStyles.bgFixed || false
  const bgPosition = sectionStyles.bgPosition ?? 50

  const [activeTab, setActiveTab] = useState<TabId | null>('background')
  const [bgSubTab, setBgSubTab] = useState<BgSubTab>('color')
  const [colorMode, setColorMode] = useState<ColorMode>(bgMode === 'gradient' ? 'gradient' : 'solid')
  const [showMediaPicker, setShowMediaPicker] = useState<'image' | 'video' | null>(null)
  const [colorPickerOpen, setColorPickerOpen] = useState<ColorPickerTarget | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const updateStyles = (updates: Partial<SectionStyles>) => {
    onUpdate(section.id, {
      ...data,
      sectionStyles: { ...sectionStyles, ...updates },
    })
  }


  const themeSwatches = [
    theme.colors.background, theme.colors.text, theme.colors.primary,
    theme.colors.secondary, theme.colors.accent, theme.colors.muted,
    '#ffffff', '#000000', '#f3f4f6', '#1f2937',
  ]

  const tabs: { id: TabId; label: string }[] = [
    { id: 'background', label: 'Arrière-plan' },
  ]

  const bgSubTabs: { id: BgSubTab; label: string }[] = [
    { id: 'color', label: 'Couleur' },
    { id: 'image', label: 'Image' },
    { id: 'video', label: 'Vidéo' },
  ]

  const renderColorTab = () => (
    <div className="space-y-3">
      {/* Unie / Dégradé toggle */}
      <div className="flex rounded-lg border border-ovh-gray-200 overflow-hidden">
        {(['solid', 'gradient'] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => {
              setColorMode(mode)
              updateStyles({ bgMode: mode === 'gradient' ? 'gradient' : 'color' })
            }}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${
              colorMode === mode
                ? 'bg-ovh-primary text-white'
                : 'bg-white text-ovh-gray-600 hover:bg-ovh-gray-50'
            }`}
          >
            {mode === 'solid' ? 'Unie' : 'Dégradé'}
          </button>
        ))}
      </div>

      {colorMode === 'solid' ? (
        <div className="space-y-2">
          <p className="text-xs text-ovh-gray-600 font-medium">Couleurs du site</p>
          <div className="flex flex-wrap gap-1.5">
            {themeSwatches.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() => updateStyles({ backgroundColor: c, bgMode: 'color' })}
                className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                  bgColor === c ? 'border-ovh-primary ring-2 ring-ovh-primary/30 scale-110' : 'border-white shadow-sm'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <ColorSwatchButton value={bgColor} onClick={() => setColorPickerOpen('bg')} label="Choisir la couleur de fond" />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => updateStyles({ backgroundColor: e.target.value, bgMode: 'color' })}
              className="flex-1 px-2 py-1.5 text-xs font-mono border border-ovh-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-ovh-primary"
            />
          </div>
          {/* Preview */}
          <div className="h-10 rounded-lg border border-ovh-gray-200" style={{ backgroundColor: bgColor }} />
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-ovh-gray-600 font-medium">Couleurs en dégradé</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2">
              <ColorSwatchButton value={gradColor1} onClick={() => setColorPickerOpen('grad1')} label="Première couleur du dégradé" />
              <input type="text" value={gradColor1} onChange={(e) => updateStyles({ gradientColor1: e.target.value, bgMode: 'gradient' })} className="flex-1 px-2 py-1 text-[10px] font-mono border border-ovh-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-ovh-primary" />
            </div>
            <div className="flex-1 flex items-center gap-2">
              <ColorSwatchButton value={gradColor2} onClick={() => setColorPickerOpen('grad2')} label="Deuxième couleur du dégradé" />
              <input type="text" value={gradColor2} onChange={(e) => updateStyles({ gradientColor2: e.target.value, bgMode: 'gradient' })} className="flex-1 px-2 py-1 text-[10px] font-mono border border-ovh-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-ovh-primary" />
            </div>
          </div>
          {/* Preview */}
          <div className="h-16 rounded-lg border border-ovh-gray-200" style={{ background: `linear-gradient(${gradAngle}deg, ${gradColor1}, ${gradColor2})` }} />
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs text-ovh-gray-600">Angle du dégradé</p>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0} max={360}
                  value={gradAngle}
                  onChange={(e) => updateStyles({ gradientAngle: parseInt(e.target.value) || 0, bgMode: 'gradient' })}
                  className="w-14 px-1.5 py-1 text-xs text-center border border-ovh-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-ovh-primary"
                />
                <span className="text-xs text-ovh-gray-400">°</span>
              </div>
            </div>
            <input
              type="range" min={0} max={360}
              value={gradAngle}
              onChange={(e) => updateStyles({ gradientAngle: parseInt(e.target.value), bgMode: 'gradient' })}
              className="w-full h-1.5 bg-ovh-gray-200 rounded-lg appearance-none cursor-pointer accent-ovh-primary"
            />
          </div>
        </div>
      )}
    </div>
  )

  const renderMediaBg = (type: 'image' | 'video') => {
    const currentUrl = type === 'image' ? bgImage : bgVideo
    const mediaItems = siteMedia.filter(m => type === 'image' ? (m.type === 'image' || !m.type) : m.type === 'video')
    return (
      <div className="space-y-3">
        {/* Preview / Select */}
        {currentUrl ? (
          <div className="relative rounded-lg overflow-hidden border border-ovh-gray-200">
            {type === 'image' ? (
              <img src={currentUrl} alt="" className="w-full h-28 object-cover" style={{ objectPosition: `center ${bgPosition}%` }} />
            ) : (
              <video src={currentUrl} className="w-full h-28 object-cover" muted />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-3">
              <button
                type="button"
                onClick={() => setShowMediaPicker(type)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur rounded-lg text-xs font-medium text-ovh-gray-800 hover:bg-white transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {type === 'image' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  )}
                </svg>
                Remplacer {type === 'image' ? "l'image" : 'la vidéo'}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowMediaPicker(type)}
            className="w-full h-24 border-2 border-dashed border-ovh-gray-300 rounded-lg flex flex-col items-center justify-center text-xs text-ovh-gray-500 hover:border-ovh-primary hover:text-ovh-primary transition-colors"
          >
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {type === 'image' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              )}
            </svg>
            Choisir {type === 'image' ? 'une image' : 'une vidéo'}
          </button>
        )}

        {currentUrl && (
          <>
            {/* Opacité */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs text-ovh-gray-600">Opacité de l&apos;arrière-plan</p>
                <span className="text-xs text-ovh-gray-500 tabular-nums">{Math.round((1 - overlayOpacity) * 100)} %</span>
              </div>
              <input
                type="range" min={0} max={100}
                value={Math.round((1 - overlayOpacity) * 100)}
                onChange={(e) => updateStyles({ overlayOpacity: 1 - parseInt(e.target.value) / 100 })}
                className="w-full h-1.5 bg-ovh-gray-200 rounded-lg appearance-none cursor-pointer accent-ovh-primary"
              />
            </div>

            {/* Couleur overlay */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-ovh-gray-600">Couleur de superposition</p>
              <ColorSwatchButton value={overlayColor} onClick={() => setColorPickerOpen('overlay')} label="Couleur de superposition" />
            </div>

            {/* Fixed */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-ovh-gray-600">Arrière-plan fixe</p>
              <button
                type="button"
                onClick={() => updateStyles({ bgFixed: !bgFixed })}
                className={`w-10 h-5 rounded-full transition-colors relative ${bgFixed ? 'bg-ovh-primary' : 'bg-ovh-gray-300'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${bgFixed ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>

            {/* Position */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs text-ovh-gray-600">Position</p>
                <span className="text-xs text-ovh-gray-500 tabular-nums">{bgPosition} %</span>
              </div>
              <input
                type="range" min={0} max={100}
                value={bgPosition}
                onChange={(e) => updateStyles({ bgPosition: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-ovh-gray-200 rounded-lg appearance-none cursor-pointer accent-ovh-primary"
              />
            </div>

            {/* Retirer */}
            <button
              type="button"
              onClick={() => {
                if (type === 'image') updateStyles({ backgroundImage: '' })
                else updateStyles({ backgroundVideo: '' })
              }}
              className="w-full py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              Retirer {type === 'image' ? "l'image" : 'la vidéo'}
            </button>
          </>
        )}
      </div>
    )
  }

  const mediaPickerPortal = showMediaPicker && typeof document !== 'undefined' ? createPortal(
    <div className="fixed inset-0 z-[300] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => setShowMediaPicker(null)} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[90vw] max-w-[500px] max-h-[60vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-ovh-gray-200">
          <h3 className="text-sm font-bold text-ovh-gray-900">
            {showMediaPicker === 'image' ? 'Image de fond' : 'Vidéo de fond'}
          </h3>
          <button type="button" onClick={() => setShowMediaPicker(null)} className="p-1 hover:bg-ovh-gray-100 rounded">
            <svg className="w-4 h-4 text-ovh-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {(() => {
            const items = siteMedia.filter(m =>
              showMediaPicker === 'image' ? (m.type === 'image' || !m.type) : m.type === 'video'
            )
            if (items.length === 0) return (
              <div className="text-center py-8 text-ovh-gray-500">
                <p className="text-sm">Aucun fichier dans la bibliothèque</p>
                <p className="text-xs mt-1">Ajoutez des fichiers via l&apos;onglet Bibliothèque</p>
              </div>
            )
            return (
              <div className="grid grid-cols-3 gap-2">
                {items.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      if (showMediaPicker === 'image') updateStyles({ backgroundImage: m.url })
                      else updateStyles({ backgroundVideo: m.url })
                      setShowMediaPicker(null)
                    }}
                    className="aspect-square rounded-lg overflow-hidden border-2 border-ovh-gray-200 hover:border-ovh-primary transition-colors"
                  >
                    {showMediaPicker === 'image' ? (
                      <img src={m.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <video src={m.url} className="w-full h-full object-cover" muted />
                    )}
                  </button>
                ))}
              </div>
            )
          })()}
        </div>
      </div>
    </div>,
    document.body
  ) : null

  return (
    <div
      className="absolute top-2 right-2 z-20 w-[300px] bg-white rounded-2xl border border-ovh-gray-200 shadow-xl overflow-visible"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <span className="text-base font-bold text-ovh-gray-900">Paramètres de la section</span>
        <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-ovh-gray-100">
          <svg className="w-4 h-4 text-ovh-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* CTAs unifiés : Arrière-plan + Éditer le contenu */}
      <div className="px-4 pt-2 pb-2 space-y-2">
        {/* Arrière-plan */}
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === 'background' ? null : 'background')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
            activeTab === 'background'
              ? 'border-ovh-primary bg-ovh-primary/5'
              : 'border-ovh-gray-200 hover:border-ovh-gray-300 hover:bg-ovh-gray-50'
          }`}
        >
          <div
            className="w-10 h-10 rounded-lg border-2 border-ovh-gray-200 flex-shrink-0"
            style={bgMode === 'gradient' ? { background: `linear-gradient(${gradAngle}deg, ${gradColor1}, ${gradColor2})` } : { backgroundColor: bgColor }}
            title="Aperçu du fond"
          />
          <div className="flex-1 min-w-0">
            <span className={`font-semibold block ${activeTab === 'background' ? 'text-ovh-primary' : 'text-ovh-gray-800'}`}>
              Arrière-plan
            </span>
            <p className="text-xs text-ovh-gray-500 mt-0.5 truncate">
              {bgSubTab === 'color' ? 'Couleur ou dégradé' : bgSubTab === 'image' ? 'Image de fond' : 'Vidéo de fond'}
            </p>
          </div>
          <svg
            className={`w-5 h-5 text-ovh-gray-400 flex-shrink-0 transition-transform ${activeTab === 'background' ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Éditer le contenu */}
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-ovh-gray-200 hover:border-ovh-primary hover:bg-ovh-primary/5 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-ovh-primary/10 border-2 border-ovh-primary/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-ovh-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold block text-ovh-gray-800">Éditer le contenu</span>
              <p className="text-xs text-ovh-gray-500 mt-0.5">Modifier textes, images et blocs</p>
            </div>
            <svg className="w-5 h-5 text-ovh-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Actions : Dupliquer + Supprimer */}
      {!confirmDelete && (
        <div className="px-4 pb-3 space-y-2">
          <p className="text-xs font-medium text-ovh-gray-500 uppercase tracking-wide mb-2">Actions</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onDuplicate(section)}
              className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-ovh-gray-200 hover:border-ovh-primary hover:bg-ovh-primary/5 transition-all text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-ovh-primary/10 border border-ovh-primary/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-ovh-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h2m8 0h2a2 2 0 012 2v2m0 8a2 2 0 01-2 2h-2m-8 0H6" />
                </svg>
              </div>
              <div className="min-w-0">
                <span className="font-semibold block text-sm text-ovh-gray-800">Dupliquer</span>
                <p className="text-[10px] text-ovh-gray-500 leading-tight">Copie en dessous</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="group flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-ovh-gray-200 hover:border-red-500 hover:bg-red-50 transition-all text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-red-100/80 border border-red-200 group-hover:bg-red-100 group-hover:border-red-300 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div className="min-w-0">
                <span className="font-semibold block text-sm text-ovh-gray-800 group-hover:text-red-700">Supprimer</span>
                <p className="text-[10px] text-ovh-gray-500 group-hover:text-red-600/80 leading-tight">Retirer la section</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Contenu Arrière-plan */}
      {activeTab === 'background' && (
        <div className="px-4 py-4 mt-2 border-t border-ovh-gray-100">
          {/* Sub-tabs Couleur / Image / Vidéo */}
          <p className="text-xs font-medium text-ovh-gray-500 uppercase tracking-wide mb-2">Type de fond</p>
          <div className="flex rounded-xl border-2 border-ovh-gray-200 overflow-hidden mb-4">
            {bgSubTabs.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setBgSubTab(sub.id)}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  bgSubTab === sub.id
                    ? 'bg-ovh-primary text-white'
                    : 'bg-white text-ovh-gray-600 hover:bg-ovh-gray-50'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {bgSubTab === 'color' && renderColorTab()}
          {bgSubTab === 'image' && renderMediaBg('image')}
          {bgSubTab === 'video' && renderMediaBg('video')}
        </div>
      )}

      {/* Zone de confirmation suppression */}
      {confirmDelete && (
        <div className="px-4 py-3 bg-red-50 border-b border-red-100">
          <p className="text-sm font-medium text-red-800 mb-2">Supprimer cette section ?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                onDelete(section.id)
                setConfirmDelete(false)
                onClose()
              }}
              className="flex-1 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700"
            >
              Oui, supprimer
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="flex-1 px-3 py-2 rounded-lg border border-ovh-gray-300 text-ovh-gray-700 text-sm font-medium hover:bg-ovh-gray-100"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Footer : réorganisation */}
      <div className="px-4 py-3 border-t border-ovh-gray-100 flex items-center justify-end bg-ovh-gray-50/50 rounded-b-2xl">
        {!confirmDelete && (
          <div className="flex rounded-xl border-2 border-ovh-gray-200 overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => onReorderUp(section.id)}
              disabled={!canMoveUp}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ovh-gray-700 hover:bg-ovh-primary/10 hover:text-ovh-primary disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ovh-gray-700 border-r border-ovh-gray-200 transition-colors"
              title="Monter la section"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Monter
            </button>
            <button
              type="button"
              onClick={() => onReorderDown(section.id)}
              disabled={!canMoveDown}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ovh-gray-700 hover:bg-ovh-primary/10 hover:text-ovh-primary disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ovh-gray-700 transition-colors"
              title="Descendre la section"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Descendre
            </button>
          </div>
        )}
      </div>

      {mediaPickerPortal}

      {/* Module de choix de couleur (roue + palettes + hex) */}
      {colorPickerOpen && (
        <ColorPickerModal
          value={
            colorPickerOpen === 'bg' ? bgColor :
            colorPickerOpen === 'grad1' ? gradColor1 :
            colorPickerOpen === 'grad2' ? gradColor2 : overlayColor
          }
          onChange={(c) => {
            if (colorPickerOpen === 'bg') updateStyles({ backgroundColor: c, bgMode: 'color' })
            else if (colorPickerOpen === 'grad1') updateStyles({ gradientColor1: c, bgMode: 'gradient' })
            else if (colorPickerOpen === 'grad2') updateStyles({ gradientColor2: c, bgMode: 'gradient' })
            else updateStyles({ overlayColor: c })
          }}
          onClose={() => setColorPickerOpen(null)}
          themeSwatches={themeSwatches}
          title={
            colorPickerOpen === 'bg' ? 'Couleur de fond' :
            colorPickerOpen === 'grad1' ? 'Couleur 1 du dégradé' :
            colorPickerOpen === 'grad2' ? 'Couleur 2 du dégradé' : 'Couleur de superposition'
          }
        />
      )}
    </div>
  )
}
