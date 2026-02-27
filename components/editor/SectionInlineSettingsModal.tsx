'use client'

import React, { useState } from 'react'
import { ColorPicker } from '@/components/ui'
import { safeJsonParse } from '@/lib/utils'
import { SectionStyles } from '@/lib/types'

type TabId = 'layout' | 'image' | 'design'
type ContentAlignment = 'left' | 'center' | 'right'

interface SectionInlineSettingsModalProps {
  section: { id: string; type: string; dataJson: string }
  theme: { colors: { primary: string; background: string } }
  siteMedia: Array<{ id: string; url: string; filename: string; type?: string }>
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
  const contentAlignment = (data.contentAlignment as ContentAlignment) || 'left'
  const sectionImages: string[] = Array.isArray(data.sectionImages) ? (data.sectionImages as string[]) : []

  const [activeTab, setActiveTab] = useState<TabId | null>(null)
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [mediaPickerIndex, setMediaPickerIndex] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleAlignment = (align: ContentAlignment) => {
    onUpdate(section.id, { ...data, contentAlignment: align })
  }

  const handleBackgroundColor = (color: string) => {
    onUpdate(section.id, {
      ...data,
      sectionStyles: { ...sectionStyles, backgroundColor: color },
    })
  }

  const handleImageSelect = (url: string) => {
    const next = [...sectionImages]
    next[mediaPickerIndex] = url
    onUpdate(section.id, { ...data, sectionImages: next.slice(0, 4) })
    setShowMediaPicker(false)
  }

  const handleRemoveImage = (index: number) => {
    const next = sectionImages.filter((_, i) => i !== index)
    onUpdate(section.id, { ...data, sectionImages: next })
  }

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(section.id)
      setConfirmDelete(false)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: 'layout', label: 'Mise en page' },
    { id: 'image', label: 'Image' },
    { id: 'design', label: 'Design' },
  ]

  return (
    <div className="absolute top-2 right-2 z-20 w-[280px] bg-white rounded-ovh-lg border border-ovh-gray-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-ovh-gray-200 flex items-center justify-between bg-ovh-gray-50">
        <span className="text-sm font-semibold text-ovh-gray-800">Paramètres de la section</span>
        <button type="button" onClick={onClose} className="p-1 rounded hover:bg-ovh-gray-200">
          <svg className="w-4 h-4 text-ovh-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* CTA Éditer le contenu → ouvre modale complète */}
      {onEdit && (
        <div className="p-2 pb-0">
          <button
            type="button"
            onClick={onEdit}
            className="w-full py-2.5 px-3 text-sm font-semibold text-white bg-ovh-primary hover:bg-ovh-primary/90 rounded-ovh flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Éditer le contenu
          </button>
        </div>
      )}

      {/* CTA Modifier la section → mini menu */}
      <div className="p-2">
        <button
          type="button"
          onClick={() => setActiveTab(activeTab ? null : 'layout')}
          className="w-full py-2 px-3 text-sm font-medium text-ovh-primary hover:bg-ovh-primary/10 rounded-ovh flex items-center justify-between"
        >
          Modifier la section
          <svg className={`w-4 h-4 transition-transform ${activeTab ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {activeTab !== null && (
          <div className="mt-2 border-t border-ovh-gray-100 pt-2">
            <div className="flex gap-1 mb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
                    activeTab === tab.id
                      ? 'text-ovh-primary border-b-2 border-ovh-primary'
                      : 'text-ovh-gray-600 hover:text-ovh-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'layout' && (
              <div className="space-y-2">
                <p className="text-xs text-ovh-gray-600">Alignement du contenu</p>
                <div className="flex gap-1">
                  {(['left', 'center', 'right'] as const).map((align) => (
                    <button
                      key={align}
                      type="button"
                      onClick={() => handleAlignment(align)}
                      className={`flex-1 py-2 text-xs font-medium rounded-ovh border ${
                        contentAlignment === align
                          ? 'border-ovh-primary bg-ovh-primary text-white'
                          : 'border-ovh-gray-200 text-ovh-gray-700 hover:border-ovh-gray-300'
                      }`}
                    >
                      {align === 'left' ? 'Gauche' : align === 'center' ? 'Centre' : 'Droite'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'image' && (
              <div className="space-y-2">
                <p className="text-xs text-ovh-gray-600">Images (4 max)</p>
                <div className="grid grid-cols-4 gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square border border-ovh-gray-200 rounded-ovh overflow-hidden bg-ovh-gray-50 relative">
                      {sectionImages[i] ? (
                        <>
                          <img src={sectionImages[i]} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(i)}
                            className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center"
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => { setMediaPickerIndex(i); setShowMediaPicker(true) }}
                          className="w-full h-full flex items-center justify-center text-ovh-gray-400 hover:bg-ovh-gray-100 text-xs"
                        >
                          +
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {showMediaPicker && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowMediaPicker(false)} />
                    <div className="absolute left-0 right-0 top-full mt-1 max-h-40 overflow-y-auto bg-white border border-ovh-gray-200 rounded-ovh shadow-lg z-40 p-2">
                      {siteMedia.filter((m) => m.type === 'image' || !m.type).length === 0 ? (
                        <p className="text-xs text-ovh-gray-500">Aucune image dans la médiathèque</p>
                      ) : (
                        <div className="grid grid-cols-3 gap-1">
                          {siteMedia.filter((m) => m.type === 'image' || !m.type).map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => handleImageSelect(m.url)}
                              className="aspect-square rounded overflow-hidden border-2 border-ovh-gray-200 hover:border-ovh-primary"
                            >
                              <img src={m.url} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'design' && (
              <div className="space-y-2">
                <ColorPicker
                  label="Couleur de la section"
                  value={sectionStyles.backgroundColor || theme.colors.background}
                  onChange={handleBackgroundColor}
                  closeOnSelect
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions: Dupliquer, Poubelle, Flèches */}
      <div className="px-2 py-2 border-t border-ovh-gray-200 flex items-center justify-between gap-1 bg-ovh-gray-50">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onDuplicate(section)}
            className="p-2 rounded hover:bg-ovh-gray-200"
            title="Dupliquer"
          >
            <svg className="w-4 h-4 text-ovh-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h2m8 0h2a2 2 0 012 2v2m0 8a2 2 0 01-2 2h-2m-8 0H6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className={`p-2 rounded ${confirmDelete ? 'bg-red-100 text-red-700' : 'hover:bg-ovh-gray-200 text-ovh-gray-600'}`}
            title={confirmDelete ? 'Cliquez à nouveau pour confirmer' : 'Supprimer'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          {confirmDelete && <span className="text-xs text-red-600">Confirmer ?</span>}
        </div>
        <div className="flex items-center gap-0">
          <button
            type="button"
            onClick={() => onReorderUp(section.id)}
            disabled={!canMoveUp}
            className="p-2 rounded hover:bg-ovh-gray-200 disabled:opacity-40"
            title="Monter"
          >
            <svg className="w-4 h-4 text-ovh-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onReorderDown(section.id)}
            disabled={!canMoveDown}
            className="p-2 rounded hover:bg-ovh-gray-200 disabled:opacity-40"
            title="Descendre"
          >
            <svg className="w-4 h-4 text-ovh-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
