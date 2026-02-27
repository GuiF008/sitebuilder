'use client'

import React, { useState } from 'react'
import { createPortal } from 'react-dom'

const PAGE_TEMPLATES = [
  {
    category: 'Commerce',
    items: [
      { id: 'blog', title: 'Blog', description: 'Publiez des articles et actualités' },
      { id: 'boutique', title: 'Boutique en ligne', description: 'Présentez vos produits' },
      { id: 'rendez-vous', title: 'Rendez-vous', description: 'Prenez des réservations' },
    ],
  },
  {
    category: 'Contenu',
    items: [
      { id: 'a-propos', title: 'À propos', description: 'Présentez votre histoire, mission et équipe' },
      { id: 'contact', title: 'Contact', description: 'Formulaire de contact et coordonnées' },
      { id: 'services', title: 'Services', description: 'Détaillez vos prestations' },
      { id: 'projets', title: 'Projets', description: 'Portfolio et réalisations' },
    ],
  },
  {
    category: 'Légal',
    items: [
      { id: 'politique-confidentialite', title: 'Politique de confidentialité', description: 'RGPD et données personnelles' },
      { id: 'politique-remboursement', title: 'Politique de remboursement', description: 'Conditions de retour' },
      { id: 'conditions-generales', title: 'Conditions générales', description: 'CGV / CGU' },
    ],
  },
]

interface AddPageModalProps {
  isOpen: boolean
  onClose: () => void
  onCreatePage: (title: string) => Promise<void>
}

export function AddPageModal({ isOpen, onClose, onCreatePage }: AddPageModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [customTitle, setCustomTitle] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  if (!isOpen || typeof document === 'undefined') return null

  const selectedItem = PAGE_TEMPLATES
    .flatMap(c => c.items)
    .find(i => i.id === selectedTemplate)

  const handleCreate = async (title: string) => {
    if (!title.trim() || isCreating) return
    setIsCreating(true)
    try {
      await onCreatePage(title.trim())
      setSelectedTemplate(null)
      setCustomTitle('')
      onClose()
    } finally {
      setIsCreating(false)
    }
  }

  const modal = (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-[90vw] max-w-[880px] h-[80vh] max-h-[640px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-ovh-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-ovh-gray-900">Ajouter une page</h2>
            <p className="text-sm text-ovh-gray-500 mt-0.5">
              Choisissez n&apos;importe quelle page et personnalisez-la en changeant le texte, les images et plus encore.
            </p>
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
          {/* Left column: template list */}
          <div className="w-[220px] flex-shrink-0 border-r border-ovh-gray-200 overflow-y-auto py-3 px-3">
            <button
              type="button"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-ovh-gray-50 transition-colors text-left mb-0.5"
            >
              <span className="text-ovh-primary">&#10024;</span>
              <span className="text-sm font-medium text-ovh-primary">Créer une page par IA</span>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedTemplate(null); setCustomTitle('') }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-ovh-gray-50 transition-colors text-left mb-2 ${
                selectedTemplate === null ? 'bg-ovh-gray-100 font-semibold' : ''
              }`}
            >
              <span className="text-ovh-gray-400">+</span>
              <span className="text-sm font-medium text-ovh-gray-800">Nouvelle page vide</span>
            </button>

            <div className="border-t border-ovh-gray-200 pt-1">
              {PAGE_TEMPLATES.map((cat) => (
                <div key={cat.category}>
                  {cat.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedTemplate(item.id)}
                      className={`
                        w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                        ${selectedTemplate === item.id
                          ? 'bg-ovh-gray-100 font-semibold text-ovh-gray-900'
                          : 'text-ovh-gray-700 hover:bg-ovh-gray-50'}
                      `}
                    >
                      {item.title}
                    </button>
                  ))}
                  <div className="border-b border-ovh-gray-100 my-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Right column: preview + action */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedTemplate && selectedItem ? (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-ovh-gray-900">{selectedItem.title}</h3>
                  <p className="text-sm text-ovh-gray-500 mt-1">{selectedItem.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map((variant) => (
                    <div key={variant} className="border border-ovh-gray-200 rounded-xl bg-ovh-gray-50 aspect-[4/3] flex items-center justify-center hover:border-ovh-primary/50 transition-colors cursor-pointer">
                      <div className="text-center px-4">
                        <div className="w-10 h-10 bg-ovh-gray-200 rounded-lg mx-auto mb-2" />
                        <p className="text-xs text-ovh-gray-500 font-medium">{selectedItem.title}</p>
                        <p className="text-[10px] text-ovh-gray-400 mt-0.5">Variante {variant}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleCreate(selectedItem.title)}
                  disabled={isCreating}
                  className="w-full py-2.5 bg-ovh-primary text-white font-semibold rounded-lg hover:bg-ovh-primary-hover transition-colors disabled:opacity-60"
                >
                  {isCreating ? 'Création...' : `Ajouter la page "${selectedItem.title}"`}
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-ovh-gray-900">Nouvelle page vide</h3>
                  <p className="text-sm text-ovh-gray-500 mt-1">Créez une page vierge et ajoutez-y vos propres sections.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ovh-gray-700 mb-1.5">Titre de la page</label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreate(customTitle)}
                    placeholder="ex. Nos réalisations"
                    className="w-full px-3 py-2.5 border border-ovh-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ovh-primary text-sm"
                    autoFocus
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleCreate(customTitle)}
                  disabled={!customTitle.trim() || isCreating}
                  className="w-full py-2.5 bg-ovh-primary text-white font-semibold rounded-lg hover:bg-ovh-primary-hover transition-colors disabled:opacity-60"
                >
                  {isCreating ? 'Création...' : 'Créer la page'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
