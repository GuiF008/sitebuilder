'use client'

import React from 'react'
import { MediaPanel } from './MediaPanel'

interface AppsPanelProps {
  media: Array<{ id: string; url: string; filename: string; type?: string }>
  onUpload: (file: File) => Promise<void>
  onDelete: (mediaId: string) => Promise<void>
}

export function AppsPanel({ media, onUpload, onDelete }: AppsPanelProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-ovh-gray-600">
        Intégrations et extensions : médiathèque, sauvegardes, versions précédentes.
      </p>
      <div>
        <h3 className="font-semibold text-ovh-gray-800 mb-2">Médiathèque</h3>
        <MediaPanel media={media} onUpload={onUpload} onDelete={onDelete} />
      </div>
      <div className="p-4 bg-ovh-gray-50 rounded-ovh border border-ovh-gray-200">
        <p className="text-xs text-ovh-gray-500">
          Gérer les sauvegardes et versions précédentes : entrée dédiée dans un prochain déploiement.
        </p>
      </div>
    </div>
  )
}
