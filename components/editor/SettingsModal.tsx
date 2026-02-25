'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { PagesPanel } from './PagesPanel'
import { SectionsPanel } from './SectionsPanel'
import { DesignPanel } from './DesignPanel'
import { SeoPanel } from './SeoPanel'
import { AiToolsPanel } from './AiToolsPanel'
import { AppsPanel } from './AppsPanel'
import { SiteWithRelations, PageWithSections } from '@/lib/types'
import { ComputedTheme } from '@/lib/types'

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
}

// Navigation modulaire selon le spec : Éléments, Pages, Styles, SEO, Outils IA, Apps/Plus
type SectionId = 'elements' | 'pages' | 'styles' | 'seo' | 'ai' | 'apps'

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
}: SettingsModalProps) {
  const [openSections, setOpenSections] = useState<Set<SectionId>>(new Set<SectionId>(['elements']))

  const toggleSection = (sectionId: SectionId) => {
    setOpenSections(prev => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }

  const currentPage = site.pages[currentPageIndex] || null

  const sections: { id: SectionId; iconSrc: string; label: string; subtitle: string }[] = [
    { id: 'elements', iconSrc: '/pictos/page-script.png', label: 'Éléments', subtitle: 'Glisser-déposer les composants' },
    { id: 'pages', iconSrc: '/pictos/book.png', label: 'Pages / Menu du site', subtitle: 'Liste des pages et navigation' },
    { id: 'styles', iconSrc: '/pictos/brush.png', label: 'Styles du site', subtitle: 'Couleurs, polices, boutons, animations' },
    { id: 'seo', iconSrc: '/pictos/settings.png', label: 'SEO', subtitle: 'Titre, meta, OpenGraph, alt images' },
    { id: 'ai', iconSrc: '/pictos/trophy.png', label: 'Outils IA', subtitle: 'Rédacteur IA, image par IA' },
    { id: 'apps', iconSrc: '/pictos/camera.png', label: 'Apps / Plus', subtitle: 'Intégrations et extensions' },
  ]

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Modal */}
      <aside
        className={`
          fixed top-[60px] bottom-[52px] left-0 w-[420px] max-w-full
          bg-ovh-gray-50 border-r border-ovh-gray-200 z-50
          transform transition-transform duration-300 ease-out
          overflow-hidden flex flex-col settings-modal
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-ovh-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg text-ovh-gray-900">Paramètres du site</h2>
              <p className="text-sm text-ovh-gray-500">Personnalisez votre site</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-ovh-gray-100 rounded-ovh transition-colors"
            >
              <svg className="w-5 h-5 text-ovh-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Accordion sections */}
        <div className="flex-1 overflow-y-auto">
          {sections.map((section) => (
            <div key={section.id} className="border-b border-ovh-gray-200">
              {/* Section header */}
              <button
                onClick={() => toggleSection(section.id)}
                className={`
                  w-full px-5 py-4 flex items-center justify-between
                  text-left transition-all duration-200 hover:bg-white
                  ${openSections.has(section.id) ? 'border-l-4 border-l-ovh-primary bg-white' : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={section.iconSrc}
                    alt={section.label}
                    width={28}
                    height={28}
                    className="w-7 h-7 object-contain"
                  />
                  <div>
                    <div className="font-semibold text-ovh-gray-800">{section.label}</div>
                    <div className="text-sm text-ovh-gray-500">{section.subtitle}</div>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-ovh-gray-400 transition-transform duration-200 ${
                    openSections.has(section.id) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Section content */}
              <div
                className={`
                  overflow-hidden transition-all duration-300 ease-in-out
                  ${openSections.has(section.id) ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                <div className="px-5 py-4 bg-white">
                  {section.id === 'elements' && currentPage && (
                    <SectionsPanel
                      currentPage={currentPage}
                      onSectionCreate={(type) => onSectionCreate(currentPage.id, type)}
                      onSectionUpdate={onSectionUpdate}
                      onSectionDelete={onSectionDelete}
                      onSectionReorder={onSectionReorder}
                      onSectionDragReorder={onSectionDragReorder}
                      onSectionSelect={onSectionSelect}
                      showElementsList
                    />
                  )}
                  {section.id === 'pages' && (
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
                  )}
                  {section.id === 'styles' && (
                    <DesignPanel
                      site={site}
                      theme={theme}
                      onThemeChange={onThemeChange}
                    />
                  )}
                  {section.id === 'seo' && (
                    <SeoPanel site={site} onSiteUpdate={onSiteUpdate} />
                  )}
                  {section.id === 'ai' && (
                    <AiToolsPanel />
                  )}
                  {section.id === 'apps' && (
                    <AppsPanel media={site.media} onUpload={onMediaUpload} onDelete={onMediaDelete} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-white border-t border-ovh-gray-200 flex-shrink-0">
          <div className="flex items-center justify-center gap-2">
            <Image
              src="/pictos/check.png"
              alt="Validé"
              width={16}
              height={16}
              className="w-4 h-4 object-contain"
            />
            <p className="text-xs text-ovh-gray-500">
              Les modifications sont appliquées en temps réel
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
