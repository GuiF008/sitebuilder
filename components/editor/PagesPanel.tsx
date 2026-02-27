'use client'

import React, { useState, useRef, useEffect } from 'react'
import { PageWithSections } from '@/lib/types'
import { AddPageModal } from './AddPageModal'

interface PagesPanelProps {
  pages: PageWithSections[]
  currentPageIndex: number
  onPageSelect: (index: number) => void
  onPageCreate: (title: string) => Promise<void>
  onPageUpdate: (pageId: string, data: Partial<PageWithSections>) => Promise<void>
  onPageDelete: (pageId: string) => Promise<void>
  onPageReorder: (pageId: string, direction: 'up' | 'down') => Promise<void>
  showSeoBadge?: boolean
  showHiddenPagesZone?: boolean
}

function PageContextMenu({
  page,
  pages,
  isLoading,
  onClose,
  onRename,
  onDuplicate,
  onToggleMenu,
  onSetHome,
  onDelete,
}: {
  page: PageWithSections
  pages: PageWithSections[]
  isLoading: boolean
  onClose: () => void
  onRename: () => void
  onDuplicate: () => void
  onToggleMenu: () => void
  onSetHome: () => void
  onDelete: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div ref={ref} className="absolute right-0 top-full mt-1 w-52 bg-white rounded-lg shadow-lg border border-ovh-gray-200 py-1.5 z-[60]">
      <button type="button" onClick={onRename} disabled={isLoading} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-ovh-gray-700 hover:bg-ovh-gray-50 transition-colors text-left">
        <svg className="w-4 h-4 text-ovh-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        Renommer
      </button>
      <button type="button" onClick={onDuplicate} disabled={isLoading} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-ovh-gray-700 hover:bg-ovh-gray-50 transition-colors text-left">
        <svg className="w-4 h-4 text-ovh-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
        Dupliquer
      </button>
      <button type="button" onClick={onToggleMenu} disabled={isLoading} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-ovh-gray-700 hover:bg-ovh-gray-50 transition-colors text-left">
        <svg className="w-4 h-4 text-ovh-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {page.showInMenu ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          )}
        </svg>
        {page.showInMenu ? 'Masquer du menu' : 'Afficher dans le menu'}
      </button>
      {!page.isHome && (
        <button type="button" onClick={onSetHome} disabled={isLoading} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-ovh-gray-700 hover:bg-ovh-gray-50 transition-colors text-left">
          <svg className="w-4 h-4 text-ovh-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          Page d&apos;accueil
        </button>
      )}
      <div className="border-t border-ovh-gray-100 my-1" />
      <button type="button" onClick={onDelete} disabled={pages.length <= 1 || isLoading} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left disabled:opacity-40">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        Supprimer
      </button>
    </div>
  )
}

export function PagesPanel({
  pages,
  currentPageIndex,
  onPageSelect,
  onPageCreate,
  onPageUpdate,
  onPageDelete,
  onPageReorder,
  showSeoBadge = true,
  showHiddenPagesZone = true,
}: PagesPanelProps) {
  const [editingPageId, setEditingPageId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [contextMenuPageId, setContextMenuPageId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [draggedPageId, setDraggedPageId] = useState<string | null>(null)

  const sortedPages = [...pages].sort((a, b) => a.order - b.order)
  const menuPages = sortedPages.filter((p) => p.showInMenu !== false)
  const hiddenPages = sortedPages.filter((p) => p.showInMenu === false)

  const handleStartEdit = (page: PageWithSections) => {
    setEditingPageId(page.id)
    setEditingTitle(page.title)
    setContextMenuPageId(null)
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
    if (pages.length <= 1) return
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
    setContextMenuPageId(null)
    try {
      await onPageUpdate(pageId, { showInMenu: !currentValue })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDuplicate = async (page: PageWithSections) => {
    setContextMenuPageId(null)
    setIsLoading(true)
    try {
      await onPageCreate(page.title + ' (copie)')
    } finally {
      setIsLoading(false)
    }
  }

  const renderPageRow = (page: PageWithSections, index: number) => {
    const globalIndex = sortedPages.findIndex((p) => p.id === page.id)
    const isDragging = draggedPageId === page.id

    return (
      <div
        key={page.id}
        draggable
        onDragStart={() => setDraggedPageId(page.id)}
        onDragOver={(e) => {
          e.preventDefault()
          if (draggedPageId && draggedPageId !== page.id) {
            e.currentTarget.classList.add('border-l-ovh-primary', 'border-l-2')
          }
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove('border-l-ovh-primary', 'border-l-2')
        }}
        onDrop={async (e) => {
          e.preventDefault()
          e.currentTarget.classList.remove('border-l-ovh-primary', 'border-l-2')
          if (draggedPageId && draggedPageId !== page.id) {
            const dragIdx = sortedPages.findIndex(p => p.id === draggedPageId)
            const targetIdx = sortedPages.findIndex(p => p.id === page.id)
            const direction = dragIdx < targetIdx ? 'down' : 'up'
            const steps = Math.abs(dragIdx - targetIdx)
            for (let i = 0; i < steps; i++) {
              await onPageReorder(draggedPageId, direction)
            }
          }
          setDraggedPageId(null)
        }}
        onDragEnd={() => setDraggedPageId(null)}
        className={`
          relative flex items-center gap-2 px-3 py-3 rounded-lg transition-all cursor-pointer
          ${currentPageIndex === globalIndex ? 'bg-ovh-gray-100' : 'hover:bg-ovh-gray-50'}
          ${isDragging ? 'opacity-40' : ''}
        `}
        onClick={() => onPageSelect(globalIndex)}
      >
        {/* Drag handle */}
        <div className="text-ovh-gray-300 cursor-grab active:cursor-grabbing flex-shrink-0">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="5" cy="4" r="1.2" /><circle cx="11" cy="4" r="1.2" />
            <circle cx="5" cy="8" r="1.2" /><circle cx="11" cy="8" r="1.2" />
            <circle cx="5" cy="12" r="1.2" /><circle cx="11" cy="12" r="1.2" />
          </svg>
        </div>

        {/* Icon */}
        <div className="flex-shrink-0">
          {page.isHome ? (
            <svg className="w-5 h-5 text-ovh-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-ovh-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          {editingPageId === page.id ? (
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onBlur={() => handleSaveEdit(page.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit(page.id)
                if (e.key === 'Escape') setEditingPageId(null)
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full px-2 py-0.5 border border-ovh-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-ovh-primary"
              autoFocus
            />
          ) : (
            <span className="text-sm font-semibold text-ovh-gray-900 truncate block">
              {page.title}
            </span>
          )}
        </div>

        {/* SEO badge */}
        {showSeoBadge && (
          <span className="flex-shrink-0 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border border-amber-300 bg-amber-50 text-amber-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            SEO
          </span>
        )}

        {/* Context menu trigger */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setContextMenuPageId(contextMenuPageId === page.id ? null : page.id)
            }}
            className="p-1 hover:bg-ovh-gray-200 rounded transition-colors"
          >
            <svg className="w-5 h-5 text-ovh-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
            </svg>
          </button>

          {contextMenuPageId === page.id && (
            <PageContextMenu
              page={page}
              pages={pages}
              isLoading={isLoading}
              onClose={() => setContextMenuPageId(null)}
              onRename={() => handleStartEdit(page)}
              onDuplicate={() => handleDuplicate(page)}
              onToggleMenu={() => handleToggleMenu(page.id, page.showInMenu)}
              onSetHome={() => { handleSetHome(page.id); setContextMenuPageId(null) }}
              onDelete={() => { handleDelete(page.id); setContextMenuPageId(null) }}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Navigation principale */}
      <div>
        <h4 className="text-xs font-semibold text-ovh-gray-500 uppercase tracking-wider mb-2">
          Navigation principale
        </h4>
        <div className="space-y-0.5">
          {menuPages.map((page, i) => renderPageRow(page, i))}
        </div>
      </div>

      {/* Pages masquées du menu */}
      {showHiddenPagesZone && (
        <div className="pt-3 border-t border-ovh-gray-200">
          <h4 className="text-xs font-semibold text-ovh-gray-500 uppercase tracking-wider mb-2">
            Pages masquées du menu
          </h4>
          <p className="text-xs text-ovh-gray-400 mb-2">
            Ces pages sont accessibles par les moteurs de recherche et les URL, mais n&apos;apparaissent pas dans votre menu de navigation.
          </p>
          {hiddenPages.length > 0 ? (
            <div className="space-y-0.5">
              {hiddenPages.map((page, i) => renderPageRow(page, i))}
            </div>
          ) : (
            <div className="py-4 px-3 border-2 border-dashed border-ovh-gray-200 rounded-lg text-center">
              <p className="text-sm text-ovh-gray-400 font-medium">Aucune page ou lien masqué</p>
              <p className="text-xs text-ovh-gray-400 mt-1">
                Glissez-déposez les pages ou masquez-les dans les paramètres de la page.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Ajouter une page */}
      <div className="pt-3 border-t border-ovh-gray-200">
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-dashed border-ovh-gray-300 text-ovh-gray-500 hover:border-ovh-primary hover:text-ovh-primary transition-colors font-medium text-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter une page
        </button>
      </div>

      {/* Add page modal */}
      <AddPageModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreatePage={onPageCreate}
      />
    </div>
  )
}
