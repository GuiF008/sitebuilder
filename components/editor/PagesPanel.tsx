'use client'

import React, { useState } from 'react'
import { Button, Input } from '@/components/ui'
import { PageWithSections } from '@/lib/types'

interface PagesPanelProps {
  pages: PageWithSections[]
  currentPageIndex: number
  onPageSelect: (index: number) => void
  onPageCreate: (title: string) => Promise<void>
  onPageUpdate: (pageId: string, data: Partial<PageWithSections>) => Promise<void>
  onPageDelete: (pageId: string) => Promise<void>
  onPageReorder: (pageId: string, direction: 'up' | 'down') => Promise<void>
}

export function PagesPanel({
  pages,
  currentPageIndex,
  onPageSelect,
  onPageCreate,
  onPageUpdate,
  onPageDelete,
  onPageReorder,
}: PagesPanelProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [newPageTitle, setNewPageTitle] = useState('')
  const [editingPageId, setEditingPageId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sortedPages = [...pages].sort((a, b) => a.order - b.order)

  const handleCreatePage = async () => {
    if (!newPageTitle.trim()) return
    
    setIsLoading(true)
    try {
      await onPageCreate(newPageTitle.trim())
      setNewPageTitle('')
      setIsCreating(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartEdit = (page: PageWithSections) => {
    setEditingPageId(page.id)
    setEditingTitle(page.title)
  }

  const handleSaveEdit = async (pageId: string) => {
    if (!editingTitle.trim()) return
    
    setIsLoading(true)
    try {
      await onPageUpdate(pageId, { title: editingTitle.trim() })
      setEditingPageId(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (pageId: string) => {
    if (pages.length <= 1) {
      alert('Vous devez conserver au moins une page')
      return
    }
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) return
    
    setIsLoading(true)
    try {
      await onPageDelete(pageId)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetHome = async (pageId: string) => {
    setIsLoading(true)
    try {
      // Reset all pages' isHome, then set the selected one
      for (const page of pages) {
        if (page.isHome && page.id !== pageId) {
          await onPageUpdate(page.id, { isHome: false })
        }
      }
      await onPageUpdate(pageId, { isHome: true })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleMenu = async (pageId: string, currentValue: boolean) => {
    setIsLoading(true)
    try {
      await onPageUpdate(pageId, { showInMenu: !currentValue })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Pages list */}
      <div className="space-y-2">
        {sortedPages.map((page, index) => (
          <div
            key={page.id}
            className={`
              p-3 rounded-ovh border-2 transition-all
              ${currentPageIndex === index 
                ? 'border-ovh-primary bg-ovh-primary/5' 
                : 'border-ovh-gray-200 hover:border-ovh-gray-300'}
            `}
          >
            <div className="flex items-center justify-between gap-2">
              {/* Page info */}
              <div 
                className="flex items-center gap-2 flex-1 cursor-pointer"
                onClick={() => onPageSelect(index)}
              >
                {page.isHome && (
                  <span className="text-lg" title="Page d'accueil">🏠</span>
                )}
                
                {editingPageId === page.id ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => handleSaveEdit(page.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(page.id)}
                    className="flex-1 px-2 py-1 border border-ovh-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-ovh-primary"
                    autoFocus
                  />
                ) : (
                  <span 
                    className="font-medium text-ovh-gray-800 cursor-pointer hover:text-ovh-primary"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStartEdit(page)
                    }}
                  >
                    {page.title}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {/* Reorder up */}
                <button
                  onClick={() => onPageReorder(page.id, 'up')}
                  disabled={index === 0 || isLoading}
                  className="p-1.5 hover:bg-ovh-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Monter"
                >
                  <svg className="w-4 h-4 text-ovh-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>

                {/* Reorder down */}
                <button
                  onClick={() => onPageReorder(page.id, 'down')}
                  disabled={index === sortedPages.length - 1 || isLoading}
                  className="p-1.5 hover:bg-ovh-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Descendre"
                >
                  <svg className="w-4 h-4 text-ovh-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Set as home */}
                <button
                  onClick={() => handleSetHome(page.id)}
                  disabled={page.isHome || isLoading}
                  className={`p-1.5 rounded transition-colors ${
                    page.isHome 
                      ? 'bg-ovh-primary/10 text-ovh-primary' 
                      : 'hover:bg-ovh-gray-100 text-ovh-gray-400 hover:text-ovh-gray-600'
                  }`}
                  title="Définir comme page d'accueil"
                >
                  <svg className="w-4 h-4" fill={page.isHome ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </button>

                {/* Toggle menu visibility */}
                <button
                  onClick={() => handleToggleMenu(page.id, page.showInMenu)}
                  disabled={isLoading}
                  className={`p-1.5 rounded transition-colors ${
                    page.showInMenu 
                      ? 'bg-ovh-primary/10 text-ovh-primary' 
                      : 'hover:bg-ovh-gray-100 text-ovh-gray-400'
                  }`}
                  title={page.showInMenu ? 'Visible dans le menu' : 'Masqué du menu'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {page.showInMenu ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    )}
                  </svg>
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(page.id)}
                  disabled={pages.length <= 1 || isLoading}
                  className="p-1.5 hover:bg-red-50 rounded text-ovh-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Supprimer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add page */}
      {isCreating ? (
        <div className="p-3 border-2 border-dashed border-ovh-gray-300 rounded-ovh space-y-3">
          <Input
            placeholder="Titre de la page"
            value={newPageTitle}
            onChange={(e) => setNewPageTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreatePage()}
            autoFocus
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleCreatePage}
              disabled={!newPageTitle.trim() || isLoading}
            >
              Créer
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsCreating(false)
                setNewPageTitle('')
              }}
            >
              Annuler
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="w-full p-3 border-2 border-dashed border-ovh-gray-300 rounded-ovh text-ovh-gray-500 hover:border-ovh-primary hover:text-ovh-primary transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter une page
        </button>
      )}
    </div>
  )
}
