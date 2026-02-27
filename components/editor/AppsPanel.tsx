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
        Intégrations et extensions : sauvegardes, versions précédentes (médiathèque à venir).
      </p>
      <div className="p-4 bg-ovh-gray-50 rounded-ovh border border-ovh-gray-200">
        <p className="text-xs text-ovh-gray-500">
          Gérer les sauvegardes, versions précédentes et futures intégrations : fonctionnalités en cours de préparation.
        </p>
      </div>
    </div>
  )
}
