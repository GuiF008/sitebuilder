'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { PagesPanel } from './PagesPanel'
import { SectionsPanel } from './SectionsPanel'
import { DesignPanel } from './DesignPanel'
import { MediaPanel } from './MediaPanel'
import { AiToolsPanel } from './AiToolsPanel'
import { ElementsPanel } from './ElementsPanel'
import { SiteWithRelations, PageWithSections } from '@/lib/types'
import { ComputedTheme, ContentBlockType } from '@/lib/types'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  site: SiteWithRelations
  theme: ComputedTheme
  currentPageIndex: number
  onSiteUpdate: (site: Partial<SiteWithRelations>) => void
  onPageSelect: (index: number) => void
  onPageCreate: (title: string) => Promise<void>
  onPageUpdate: (pageId: string, data: Partial<PageWithSections>) => Promise<void>
  onPageDelete: (pageId: string) => Promise<void>
  onPageReorder: (pageId: string, direction: 'up' | 'down') => Promise<void>
  onSectionCreate: (pageId: string, type: string, layout?: string) => Promise<void>
  onSectionUpdate: (sectionId: string, data: Record<string, unknown>) => Promise<void>
  onSectionDelete: (sectionId: string) => Promise<void>
  onSectionReorder: (sectionId: string, direction: 'up' | 'down') => Promise<void>
  onSectionDragReorder?: (draggedId: string, targetId: string) => Promise<void>
  onSectionSelect?: (sectionId: string) => void
  onThemeChange: (updates: Record<string, string>) => void
  onMediaUpload: (file: File) => Promise<void>
  onMediaDelete: (mediaId: string) => Promise<void>
  selectedSectionId?: string | null
  onAddBlockToSection?: (sectionId: string, blockType: ContentBlockType, options?: { elementId?: string }) => void
}

type TabId = 'pages' | 'elements' | 'styles' | 'ai' | 'library'

const TABS: { id: TabId; iconSrc: string; label: string; badge?: string }[] = [
  { id: 'pages', iconSrc: '/pictos/book.png', label: 'Pages' },
  { id: 'elements', iconSrc: '/pictos/cursors.png', label: 'Éléments' },
  { id: 'styles', iconSrc: '/pictos/brush.png', label: 'Styles' },
  { id: 'ai', iconSrc: '/pictos/trophy.png', label: 'Outils IA', badge: 'SOON' },
  { id: 'library', iconSrc: '/pictos/camera.png', label: 'Bibliothèque' },
]


export function SettingsModal({
  isOpen,
  onClose,
  site,
  theme,
  currentPageIndex,
  onSiteUpdate,
  onPageSelect,
  onPageCreate,
  onPageUpdate,
  onPageDelete,
  onPageReorder,
  onSectionCreate,
  onSectionUpdate,
  onSectionDelete,
  onSectionReorder,
  onSectionDragReorder,
  onSectionSelect,
  onThemeChange,
  onMediaUpload,
  onMediaDelete,
  selectedSectionId = null,
  onAddBlockToSection,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabId | null>('pages')

  const currentPage = site.pages[currentPageIndex] || null

  const handleTabClick = (tabId: TabId) => {
    if (activeTab === tabId) {
      setActiveTab(null)
    } else {
      setActiveTab(tabId)
    }
  }

  const renderPanelContent = () => {
    switch (activeTab) {
      case 'elements':
        return (
          <ElementsPanel
            selectedSectionId={selectedSectionId ?? null}
            onAddElement={(sectionId, blockType, options) => onAddBlockToSection?.(sectionId, blockType, options)}
          />
        )

      case 'pages':
        return (
          <div className="space-y-6">
            <PagesPanel
              pages={site.pages}
              currentPageIndex={currentPageIndex}
              onPageSelect={onPageSelect}
              onPageCreate={onPageCreate}
              onPageUpdate={onPageUpdate}
              onPageDelete={onPageDelete}
              onPageReorder={onPageReorder}
              showSeoBadge
              showHiddenPagesZone
            />
            {currentPage && (
              <div className="pt-4 border-t border-ovh-gray-200">
                <h3 className="font-semibold text-ovh-gray-800 mb-3">Sections de la page</h3>
                <SectionsPanel
                  currentPage={currentPage}
                  onSectionCreate={(type, layout) => onSectionCreate(currentPage.id, type, layout)}
                  onSectionUpdate={onSectionUpdate}
                  onSectionDelete={onSectionDelete}
                  onSectionReorder={onSectionReorder}
                  onSectionDragReorder={onSectionDragReorder}
                  onSectionSelect={onSectionSelect}
                  showElementsList={false}
                />
              </div>
            )}
          </div>
        )

      case 'styles':
        return (
          <DesignPanel
            site={site}
            theme={theme}
            onThemeChange={onThemeChange}
          />
        )

      case 'ai':
        return <AiToolsPanel />

      case 'library':
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-ovh-gray-900">Bibliothèque</h2>
              <p className="text-sm text-ovh-gray-600 mt-1">Photos et vidéos de votre site</p>
            </div>
            <MediaPanel
              media={site.media}
              onUpload={onMediaUpload}
              onDelete={onMediaDelete}
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      {/* Icon sidebar - toujours visible quand isOpen */}
      <aside
        className={`
          fixed top-[60px] bottom-[52px] left-0 w-[72px]
          bg-white border-r border-ovh-gray-200 z-50
          flex flex-col items-center py-2 gap-1
          transform transition-transform duration-200
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={`
                w-[64px] flex flex-col items-center gap-0.5 px-1 py-2.5 rounded-lg
                transition-all duration-150 text-center
                ${isActive
                  ? 'bg-ovh-primary/10 text-ovh-primary'
                  : 'text-ovh-gray-600 hover:bg-ovh-gray-50 hover:text-ovh-gray-800'}
              `}
            >
              <Image
                src={tab.iconSrc}
                alt={tab.label}
                width={24}
                height={24}
                className={`w-6 h-6 object-contain transition-transform ${isActive ? 'scale-110' : ''}`}
              />
              <span className={`text-[10px] leading-tight flex items-center gap-1 justify-center ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {tab.label}
                {tab.badge && (
                  <span className="bg-blue-500 text-white text-[7px] font-bold px-1 py-0.5 rounded-md shrink-0">
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          )
        })}
      </aside>

      {/* Content panel */}
      <aside
        className={`
          fixed top-[60px] bottom-[52px] left-[72px] w-[360px]
          bg-white border-r border-ovh-gray-200 z-50
          transform transition-transform duration-200 ease-out
          overflow-hidden flex flex-col
          ${isOpen && activeTab ? 'translate-x-0' : '-translate-x-[432px]'}
        `}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-ovh-gray-200 flex-shrink-0 bg-white">
          <h2 className="font-bold text-ovh-gray-900">
            {TABS.find(t => t.id === activeTab)?.label || ''}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-ovh-gray-100 rounded-ovh transition-colors"
          >
            <svg className="w-5 h-5 text-ovh-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Panel body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {renderPanelContent()}
        </div>
      </aside>
    </>
  )
}
