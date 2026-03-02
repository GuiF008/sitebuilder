'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { PageWithSections } from '@/lib/types'
import { SECTION_LAYOUTS, getSectionTypeById, type LayoutId } from '@/lib/section-layouts'

interface SectionsPanelProps {
  currentPage: PageWithSections | null
  onSectionCreate: (type: string, layout?: string) => Promise<void>
  onSectionUpdate: (sectionId: string, data: Record<string, unknown>) => Promise<void>
  onSectionDelete: (sectionId: string) => Promise<void>
  onSectionReorder: (sectionId: string, direction: 'up' | 'down') => Promise<void>
  onSectionDragReorder?: (draggedId: string, targetId: string) => Promise<void>
  onSectionSelect?: (sectionId: string) => void
  /** Afficher la liste des éléments (composants) glisser-déposer selon le spec */
  showElementsList?: boolean
}

// Types de sections avec icônes
const SECTION_TYPES_UI = [
  { id: 'hero', label: 'Hero', iconSrc: '/pictos/trophy.png' },
  { id: 'about', label: 'À propos', iconSrc: '/pictos/page-script.png' },
  { id: 'text', label: 'Texte', iconSrc: '/pictos/page-query.png' },
  { id: 'image-text', label: 'Image + Texte', iconSrc: '/pictos/camera.png' },
  { id: 'services', label: 'Services', iconSrc: '/pictos/settings.png' },
  { id: 'gallery', label: 'Galerie', iconSrc: '/pictos/camera.png' },
  { id: 'contact', label: 'Contact', iconSrc: '/pictos/contacts.png' },
  { id: 'testimonials', label: 'Témoignages', iconSrc: '/pictos/contacts.png' },
  { id: 'team', label: 'Équipe', iconSrc: '/pictos/page-script.png' },
  { id: 'features', label: 'Fonctionnalités', iconSrc: '/pictos/settings.png' },
  { id: 'blog', label: 'Blog', iconSrc: '/pictos/book.png' },
  { id: 'process', label: 'Processus', iconSrc: '/pictos/settings.png' },
]

// Éléments (composants) selon le spec : Texte, Bouton, Image, Galerie, Vidéo, Forme, Carte, Feed Instagram, etc.
const ELEMENT_TYPES = [
  { id: 'text', label: 'Texte', icon: 'T' },
  { id: 'button', label: 'Bouton', icon: 'B' },
  { id: 'image', label: 'Image', icon: 'Img' },
  { id: 'gallery', label: 'Galerie', icon: 'G' },
  { id: 'video', label: 'Vidéo', icon: 'V' },
  { id: 'shape', label: 'Forme', icon: '◇' },
  { id: 'card', label: 'Carte', icon: 'C' },
  { id: 'instagram', label: 'Feed Instagram', icon: 'IG' },
  { id: 'contact-form', label: 'Formulaire de contact', icon: 'F' },
  { id: 'newsletter', label: 'Formulaire d\'abonnement', icon: 'N' },
  { id: 'social-icons', label: 'Icônes sociales', icon: 'S' },
  { id: 'embed', label: 'Code incorporé', icon: '</>' },
  { id: 'product-search', label: 'Recherche produit', icon: '🔍', ecommerce: true },
  { id: 'add-to-cart', label: 'Ajouter au panier', icon: '🛒', ecommerce: true },
  { id: 'affiliate', label: 'Lien d\'affiliation', icon: 'A', ecommerce: true },
]

export function SectionsPanel({
  currentPage,
  onSectionCreate,
  onSectionUpdate,
  onSectionDelete,
  onSectionReorder,
  onSectionDragReorder,
  onSectionSelect,
  showElementsList = false,
}: SectionsPanelProps) {
  const [showTypeModal, setShowTypeModal] = useState(false)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedLayout, setSelectedLayout] = useState<LayoutId | null>(null)
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null)

  if (!currentPage) {
    return (
      <div className="text-center py-8 text-ovh-gray-500">
        <p>Sélectionnez une page pour gérer ses sections</p>
      </div>
    )
  }

  const sortedSections = [...currentPage.sections].sort((a, b) => a.order - b.order)

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId)
    const st = getSectionTypeById(typeId as import('@/lib/section-layouts').SectionTypeId)
    setSelectedLayout(st?.defaultLayout || 'bravo')
  }

  const handleCreate = async () => {
    if (selectedType) {
      await onSectionCreate(selectedType, selectedLayout || undefined)
      setShowTypeModal(false)
      setSelectedType(null)
      setSelectedLayout(null)
    }
  }

  const typeInfo = selectedType ? getSectionTypeById(selectedType as import('@/lib/section-layouts').SectionTypeId) : null
  const availableLayouts = typeInfo ? SECTION_LAYOUTS.filter(l => typeInfo.recommendedLayouts.includes(l.id)) : []

  return (
    <div className="space-y-4">
      {/* Liste des éléments (glisser-déposer) - spec Éléments */}
      {showElementsList && (
        <div className="pb-3 border-b border-ovh-gray-200">
          <h4 className="text-xs font-semibold text-ovh-gray-500 uppercase tracking-wide mb-2">
            Éléments à glisser sur la page
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {ELEMENT_TYPES.map((el) => (
              <button
                key={el.id}
                type="button"
                onClick={() => onSectionCreate(el.id)}
                className="px-2 py-1.5 text-xs font-medium rounded-ovh border border-ovh-gray-200 bg-white hover:border-ovh-primary hover:bg-ovh-primary/5 transition-colors flex items-center gap-1"
                title={el.label}
              >
                <span className="opacity-70">{el.icon}</span>
                <span className="truncate max-w-[80px]">{el.label}</span>
                {el.ecommerce && (
                  <span className="text-[9px] text-ovh-gray-400">e-com</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Liste des sections */}
      <div className="space-y-2">
        {sortedSections.length === 0 ? (
          <div className="text-center py-8 text-ovh-gray-500 border-2 border-dashed border-ovh-gray-200 rounded-ovh">
            <p className="text-sm mb-2">Aucune section</p>
            <p className="text-xs">Ajoutez une section pour commencer</p>
          </div>
        ) : (
          sortedSections.map((section, index) => {
            const sectionType = SECTION_TYPES_UI.find(t => t.id === section.type)
            const isDragging = draggedSectionId === section.id
            
            return (
              <div
                key={section.id}
                draggable
                onDragStart={() => setDraggedSectionId(section.id)}
                onDragOver={(e) => {
                  e.preventDefault()
                  if (draggedSectionId && draggedSectionId !== section.id) {
                    e.currentTarget.classList.add('border-ovh-primary')
                  }
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('border-ovh-primary')
                }}
                onDrop={async (e) => {
                  e.preventDefault()
                  e.currentTarget.classList.remove('border-ovh-primary')
                  if (draggedSectionId && draggedSectionId !== section.id && onSectionDragReorder) {
                    await onSectionDragReorder(draggedSectionId, section.id)
                  }
                  setDraggedSectionId(null)
                }}
                onDragEnd={() => {
                  setDraggedSectionId(null)
                  // Retirer toutes les classes de drag
                  document.querySelectorAll('.border-ovh-primary').forEach(el => {
                    el.classList.remove('border-ovh-primary')
                  })
                }}
                onClick={() => onSectionSelect?.(section.id)}
                className={`
                  flex items-center gap-2 p-3 bg-ovh-gray-50 rounded-ovh border border-ovh-gray-200
                  cursor-move hover:bg-white transition-colors
                  ${isDragging ? 'opacity-50' : ''}
                `}
              >
                {/* Réordonner */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => onSectionReorder(section.id, 'up')}
                    disabled={index === 0}
                    className="p-1 hover:bg-white rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4 text-ovh-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onSectionReorder(section.id, 'down')}
                    disabled={index === sortedSections.length - 1}
                    className="p-1 hover:bg-white rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4 text-ovh-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Handle drag */}
                <div className="text-ovh-gray-400 cursor-grab active:cursor-grabbing">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                  </svg>
                </div>

                {/* Info section */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {sectionType?.iconSrc ? (
                      <Image
                        src={sectionType.iconSrc}
                        alt={sectionType.label}
                        width={20}
                        height={20}
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      <Image
                        src="/pictos/page-query.png"
                        alt="Section"
                        width={20}
                        height={20}
                        className="w-5 h-5 object-contain"
                      />
                    )}
                    <span className="font-medium text-sm text-ovh-gray-800 truncate">
                      {sectionType?.label || section.type}
                    </span>
                  </div>
                </div>

                {/* Supprimer */}
                <button
                  onClick={() => {
                    if (confirm('Supprimer cette section ?')) {
                      onSectionDelete(section.id)
                    }
                  }}
                  className="p-2 hover:bg-red-50 rounded-ovh text-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* Bouton ajouter */}
      <div className="relative">
        <button
          onClick={() => setShowTypeModal(true)}
          className="w-full px-4 py-2 bg-ovh-primary text-white rounded-ovh font-medium hover:bg-ovh-primary-hover transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter une section
        </button>

        {/* Modal de sélection type + mise en page (10 layouts) */}
        {showTypeModal && (
          <>
            <div className="fixed inset-0 z-40 bg-black/50" onClick={() => { setShowTypeModal(false); setSelectedType(null); setSelectedLayout(null) }} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-ovh shadow-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-ovh-gray-200">
                  <h2 className="text-lg font-bold text-ovh-gray-900">
                    {selectedType ? `Mise en page pour « ${typeInfo?.label} »` : 'Choisir un type de section'}
                  </h2>
                  <button onClick={() => { setShowTypeModal(false); setSelectedType(null); setSelectedLayout(null) }} className="p-1 hover:bg-ovh-gray-100 rounded">
                    <svg className="w-6 h-6 text-ovh-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {!selectedType ? (
                    <div className="grid grid-cols-2 gap-3">
                      {SECTION_TYPES_UI.map((t) => (
                        <button key={t.id} onClick={() => handleTypeSelect(t.id)} className="p-4 text-left hover:bg-ovh-gray-50 flex gap-3 border border-ovh-gray-200 rounded-ovh hover:border-ovh-primary">
                          <Image src={t.iconSrc} alt={t.label} width={24} height={24} className="w-6 h-6 object-contain" />
                          <span className="font-medium text-sm text-ovh-gray-800">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button onClick={() => { setSelectedType(null); setSelectedLayout(null) }} className="text-sm text-ovh-primary hover:underline mb-2">← Retour aux types</button>
                      {availableLayouts.map((layout) => (
                        <button
                          key={layout.id}
                          onClick={() => setSelectedLayout(layout.id)}
                          className={`w-full p-4 text-left border rounded-xl transition-all ${
                            selectedLayout === layout.id ? 'border-ovh-primary bg-ovh-primary/5' : 'border-ovh-gray-200 hover:border-ovh-primary/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${selectedLayout === layout.id ? 'text-ovh-primary' : 'text-ovh-gray-800'}`}>{layout.name}</span>
                            {typeInfo?.defaultLayout === layout.id && <span className="text-[10px] text-ovh-primary bg-ovh-primary/10 px-1.5 py-0.5 rounded">Recommandé</span>}
                          </div>
                          <p className="text-xs text-ovh-gray-500 mt-0.5">{layout.description}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {selectedType && (
                  <div className="p-4 border-t border-ovh-gray-200 flex justify-end">
                    <button onClick={handleCreate} disabled={!selectedLayout} className="px-6 py-2.5 bg-ovh-primary text-white font-semibold rounded-lg hover:bg-ovh-primary/90 disabled:opacity-50">
                      Ajouter la section
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
