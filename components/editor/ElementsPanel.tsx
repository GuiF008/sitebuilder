'use client'

import React from 'react'
import Image from 'next/image'
import { ContentBlockType } from '@/lib/types'

// Éléments à afficher (exclus : code incorporé, formulaire abonnement, recherche produit, carte, feed Instagram)
const ELEMENTS = [
  { id: 'text', label: 'Texte', blockType: 'text' as ContentBlockType, iconSrc: '/pictos/page-query.png' },
  { id: 'button', label: 'Bouton', blockType: 'button' as ContentBlockType, iconSrc: '/pictos/cursors.png' },
  { id: 'affiliate', label: 'Lien d\'affiliation', blockType: 'button' as ContentBlockType, iconSrc: '/pictos/page-script.png' },
  { id: 'add-to-cart', label: 'Ajouter au panier', blockType: 'button' as ContentBlockType, iconSrc: '/pictos/cart.png' },
  { id: 'image', label: 'Image', blockType: 'image' as ContentBlockType, iconSrc: '/pictos/camera.png' },
  { id: 'gallery', label: 'Galerie', blockType: 'gallery' as ContentBlockType, iconSrc: '/pictos/camera.png' },
  { id: 'video', label: 'Vidéo', blockType: 'video' as ContentBlockType, iconSrc: '/pictos/play.png' },
  { id: 'shape', label: 'Forme', blockType: 'shape' as ContentBlockType, iconSrc: '/pictos/brush.png' },
  { id: 'contact-form', label: 'Formulaire de contact', blockType: 'contact-form' as ContentBlockType, iconSrc: '/pictos/contacts.png' },
  { id: 'social-icons', label: 'Icônes sociales', blockType: 'social-icons' as ContentBlockType, iconSrc: '/pictos/settings.png' },
]

interface ElementsPanelProps {
  selectedSectionId: string | null
  onAddElement: (sectionId: string, blockType: ContentBlockType, options?: { elementId?: string }) => void
}

export function ElementsPanel({ selectedSectionId, onAddElement }: ElementsPanelProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-ovh-gray-800">Éléments</h3>
      <p className="text-sm text-ovh-gray-600">
        Faites glisser et déposez des éléments directement sur la page. Si une section est sélectionnée, vous pouvez aussi cliquer pour y ajouter l’élément.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {ELEMENTS.map((el) => (
          <button
            key={el.id}
            type="button"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/element', JSON.stringify({ blockType: el.blockType, elementId: el.id }))
              e.dataTransfer.effectAllowed = 'copy'
            }}
            onClick={() => {
              if (selectedSectionId) onAddElement(selectedSectionId, el.blockType, { elementId: el.id })
            }}
            className={`
              flex items-center gap-2 p-3 rounded-ovh border-2 text-left transition-all
              border-ovh-gray-200 hover:border-ovh-primary hover:bg-ovh-primary/5 cursor-grab active:cursor-grabbing
            `}
          >
            <div className="w-8 h-8 flex-shrink-0 rounded border border-ovh-gray-200 flex items-center justify-center overflow-hidden bg-white">
              <Image src={el.iconSrc} alt="" width={20} height={20} className="object-contain" />
            </div>
            <span className="text-sm font-medium text-ovh-gray-800 truncate">{el.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
