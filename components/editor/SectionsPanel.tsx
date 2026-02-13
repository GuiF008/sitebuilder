'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { PageWithSections } from '@/lib/types'

interface SectionsPanelProps {
  currentPage: PageWithSections | null
  onSectionCreate: (type: string) => Promise<void>
  onSectionUpdate: (sectionId: string, data: Record<string, unknown>) => Promise<void>
  onSectionDelete: (sectionId: string) => Promise<void>
  onSectionReorder: (sectionId: string, direction: 'up' | 'down') => Promise<void>
  onSectionDragReorder?: (draggedId: string, targetId: string) => Promise<void>
  onSectionSelect?: (sectionId: string) => void
}

const SECTION_TYPES = [
  { id: 'hero', label: 'Hero', iconSrc: '/pictos/trophy.png', description: 'En-tête avec titre et image' },
  { id: 'about', label: 'À propos', iconSrc: '/pictos/page-script.png', description: 'Texte et image' },
  { id: 'text', label: 'Texte', iconSrc: '/pictos/page-query.png', description: 'Contenu textuel simple' },
  { id: 'image-text', label: 'Image + Texte', iconSrc: '/pictos/camera.png', description: 'Contenu mixte' },
  { id: 'services', label: 'Services', iconSrc: '/pictos/settings.png', description: 'Liste de services' },
  { id: 'gallery', label: 'Galerie', iconSrc: '/pictos/camera.png', description: 'Grille d\'images' },
  { id: 'contact', label: 'Contact', iconSrc: '/pictos/contacts.png', description: 'Informations de contact' },
]

export function SectionsPanel({
  currentPage,
  onSectionCreate,
  onSectionUpdate,
  onSectionDelete,
  onSectionReorder,
  onSectionDragReorder,
  onSectionSelect,
}: SectionsPanelProps) {
  const [showTypeModal, setShowTypeModal] = useState(false)
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null)

  if (!currentPage) {
    return (
      <div className="text-center py-8 text-ovh-gray-500">
        <p>Sélectionnez une page pour gérer ses sections</p>
      </div>
    )
  }

  const sortedSections = [...currentPage.sections].sort((a, b) => a.order - b.order)

  const handleCreate = async (type: string) => {
    await onSectionCreate(type)
    setShowTypeModal(false)
  }

  return (
    <div className="space-y-4">
      {/* Liste des sections */}
      <div className="space-y-2">
        {sortedSections.length === 0 ? (
          <div className="text-center py-8 text-ovh-gray-500 border-2 border-dashed border-ovh-gray-200 rounded-ovh">
            <p className="text-sm mb-2">Aucune section</p>
            <p className="text-xs">Ajoutez une section pour commencer</p>
          </div>
        ) : (
          sortedSections.map((section, index) => {
            const sectionType = SECTION_TYPES.find(t => t.id === section.type)
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

        {/* Modal de sélection du type */}
        {showTypeModal && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setShowTypeModal(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-ovh shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-ovh-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-ovh-gray-900">Choisir un type de section</h2>
                    <button
                      onClick={() => setShowTypeModal(false)}
                      className="p-1 hover:bg-ovh-gray-100 rounded transition-colors"
                    >
                      <svg className="w-6 h-6 text-ovh-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 p-4">
                  {SECTION_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleCreate(type.id)}
                      className="p-4 text-left hover:bg-ovh-gray-50 transition-colors flex flex-col gap-2 border border-ovh-gray-200 rounded-ovh hover:border-ovh-primary"
                    >
                      <Image
                        src={type.iconSrc}
                        alt={type.label}
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-ovh-gray-800 text-sm">{type.label}</div>
                        <div className="text-xs text-ovh-gray-500">{type.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
