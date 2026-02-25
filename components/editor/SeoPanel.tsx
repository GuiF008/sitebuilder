'use client'

import React from 'react'
import { Input } from '@/components/ui'
import { SiteWithRelations } from '@/lib/types'

interface SeoPanelProps {
  site: SiteWithRelations
  onSiteUpdate: (updates: Partial<SiteWithRelations>) => void
}

export function SeoPanel({ site, onSiteUpdate }: SeoPanelProps) {
  // Données SEO par page ou globales – à brancher sur le modèle quand disponible
  return (
    <div className="space-y-6">
      <p className="text-sm text-ovh-gray-500">
        Panneau SEO dédié : titre de la page, meta description, OpenGraph, textes alternatifs des images.
      </p>
      <div className="space-y-3">
        <Input
          label="Titre du site (balise &lt;title&gt;)"
          placeholder="Mon site"
          value={site.name}
          onChange={() => {}}
        />
        <p className="text-xs text-ovh-gray-400">Le titre du site est celui défini à la création. Par page : à venir.</p>
        <div>
          <label className="block text-sm font-medium text-ovh-gray-700 mb-1.5">
            Meta description
          </label>
          <textarea
            placeholder="Description pour les moteurs de recherche"
            className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-2 focus:ring-ovh-primary text-sm min-h-[80px]"
            rows={3}
          />
        </div>
        <p className="text-xs text-ovh-gray-400">
          OpenGraph et alt images sont gérés au niveau de chaque page et de chaque image dans l&apos;éditeur.
        </p>
      </div>
    </div>
  )
}
