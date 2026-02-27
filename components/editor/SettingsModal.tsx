'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { PagesPanel } from './PagesPanel'
import { SectionsPanel } from './SectionsPanel'
import { DesignPanel } from './DesignPanel'
import { MediaPanel } from './MediaPanel'
import { AiToolsPanel } from './AiToolsPanel'
import { AppsPanel } from './AppsPanel'
import { ProjectOptionsPanel } from './ProjectOptionsPanel'
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
  onSectionCreate: (pageId: string, type: string) => Promise<void>
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

type TabId = 'config' | 'elements' | 'pages' | 'styles' | 'ai' | 'library' | 'more'

const TABS: { id: TabId; iconSrc: string; label: string }[] = [
  { id: 'config', iconSrc: '/pictos/settings.png', label: 'Configuration' },
  { id: 'elements', iconSrc: '/pictos/cursors.png', label: 'Éléments' },
  { id: 'pages', iconSrc: '/pictos/book.png', label: 'Pages' },
  { id: 'styles', iconSrc: '/pictos/brush.png', label: 'Styles' },
  { id: 'ai', iconSrc: '/pictos/trophy.png', label: 'Outils IA' },
  { id: 'library', iconSrc: '/pictos/camera.png', label: 'Bibliothèque' },
  { id: 'more', iconSrc: '/pictos/page-script.png', label: 'Plus' },
]

const CONFIG_STEPS = [
  { id: 'create', label: 'Commencer la création de votre site web !', done: true },
  { id: 'mobile', label: 'Visiter votre site sur mobile', done: false },
  { id: 'images', label: 'Modifier les images', done: false },
  { id: 'publish', label: 'Passer à la publication !', done: false },
  { id: 'social', label: 'Mettre à jour les liens de réseaux sociaux', done: false },
  { id: 'texts', label: 'Modifier les textes des paragraphes', done: false },
  { id: 'header', label: 'Modifier le texte de l\'en-tête', done: false },
]

const MORE_ITEMS = [
  { id: 'general', icon: '⚙️', label: 'Paramètres généraux' },
  { id: 'integrations', icon: '🔗', label: 'Intégrations' },
  { id: 'contact-messages', icon: '💬', label: 'Messages du formulaire' },
  { id: 'analytics', icon: '📊', label: 'Analyses' },
  { id: 'media', icon: '🖼️', label: 'Médiathèque' },
  { id: 'backups', icon: '💾', label: 'Gérer les sauvegardes' },
  { id: 'help', icon: '❓', label: 'Aide et ressources' },
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
  const [activeTab, setActiveTab] = useState<TabId | null>('config')
  const [moreSubmenu, setMoreSubmenu] = useState<string | null>(null)

  const currentPage = site.pages[currentPageIndex] || null

  const handleTabClick = (tabId: TabId) => {
    if (activeTab === tabId) {
      setActiveTab(null)
    } else {
      setActiveTab(tabId)
      setMoreSubmenu(null)
    }
  }

  const completedSteps = CONFIG_STEPS.filter(s => s.done).length

  const renderPanelContent = () => {
    switch (activeTab) {
      case 'config':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-ovh-gray-900">Bonjour</h2>
              <p className="text-sm text-ovh-gray-600 mt-1">
                Commencez dès maintenant : suivez ces étapes pour préparer votre site web à accueillir vos visiteurs.
              </p>
            </div>

            <div className="bg-white rounded-ovh-lg border border-ovh-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-ovh-gray-900">Configuration du site web</h3>
                <div className="relative w-10 h-10">
                  <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15" fill="none" stroke="#00D4AA" strokeWidth="3"
                      strokeDasharray={`${(completedSteps / CONFIG_STEPS.length) * 94.2} 94.2`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-ovh-gray-700">
                    {completedSteps}/{CONFIG_STEPS.length}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                {CONFIG_STEPS.map((step) => (
                  <button
                    key={step.id}
                    type="button"
                    className="w-full flex items-center gap-3 p-3 rounded-ovh hover:bg-ovh-gray-50 transition-colors text-left group"
                  >
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
                      ${step.done
                        ? 'bg-emerald-500 text-white'
                        : 'border-2 border-ovh-gray-300'}
                    `}>
                      {step.done && (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm flex-1 ${step.done ? 'text-ovh-gray-500' : 'text-ovh-gray-800 font-medium'}`}>
                      {step.label}
                    </span>
                    <svg className="w-4 h-4 text-ovh-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

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
                  onSectionCreate={(type) => onSectionCreate(currentPage.id, type)}
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

      case 'more':
        if (moreSubmenu === 'general') {
          return (
            <div className="space-y-4">
              <button type="button" onClick={() => setMoreSubmenu(null)} className="flex items-center gap-2 text-sm text-ovh-primary hover:underline">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Retour
              </button>
              <ProjectOptionsPanel siteId={site.id} />
            </div>
          )
        }
        if (moreSubmenu === 'media') {
          return (
            <div className="space-y-4">
              <button type="button" onClick={() => setMoreSubmenu(null)} className="flex items-center gap-2 text-sm text-ovh-primary hover:underline">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Retour
              </button>
              <MediaPanel media={site.media} onUpload={onMediaUpload} onDelete={onMediaDelete} />
            </div>
          )
        }
        return (
          <div className="space-y-2">
            {MORE_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'general' || item.id === 'media') {
                    setMoreSubmenu(item.id)
                  }
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-ovh hover:bg-ovh-gray-50 transition-colors text-left"
              >
                <span className="text-lg w-6 text-center">{item.icon}</span>
                <span className="text-sm font-medium text-ovh-gray-800 flex-1">{item.label}</span>
                <svg className="w-4 h-4 text-ovh-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
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
              <span className={`text-[10px] leading-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {tab.label}
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
