'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui'
import { Media } from '@prisma/client'

interface MediaPanelProps {
  media: Media[]
  onUpload: (file: File) => Promise<void>
  onDelete: (mediaId: string) => Promise<void>
}

type FilterType = 'all' | 'image' | 'video' | 'audio'

export function MediaPanel({
  media,
  onUpload,
  onDelete,
}: MediaPanelProps) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [isUploading, setIsUploading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredMedia = media.filter((m) => {
    if (filter === 'all') return true
    return m.type === filter
  })

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    setIsUploading(true)
    try {
      for (const file of Array.from(files)) {
        await onUpload(file)
      }
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleCopyUrl = async (url: string, mediaId: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(mediaId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDelete = async (mediaId: string) => {
    if (!confirm('Supprimer ce fichier ?')) return
    await onDelete(mediaId)
  }

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'Tous' },
    { id: 'image', label: 'Images' },
    { id: 'video', label: 'Vidéos' },
    { id: 'audio', label: 'Sons' },
  ]

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      <div
        className="border-2 border-dashed border-ovh-gray-300 rounded-ovh p-6 text-center hover:border-ovh-primary transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/mp4,video/webm,video/quicktime,audio/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-ovh-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-ovh-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-ovh-gray-700">
              {isUploading ? 'Upload en cours...' : 'Cliquez ou glissez-déposez'}
            </p>
            <p className="text-xs text-ovh-gray-500">
              Images, vidéos (MP4, WebM, MOV — max 250 Mo) ou audio
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`
              px-3 py-1.5 text-sm font-medium rounded-ovh transition-colors inline-flex items-center gap-1.5
              ${filter === f.id
                ? 'bg-ovh-primary text-white'
                : 'text-ovh-gray-600 hover:bg-ovh-gray-100'}
            `}
          >
            <span>{f.label}</span>
            {f.id === 'audio' && (
              <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-ovh-gray-200 text-ovh-gray-700 font-medium shrink-0">
                Soon
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Media grid */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-8 text-ovh-gray-500 text-sm">
          Aucun fichier
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {filteredMedia.map((m) => {
            const displayName = m.originalName ?? m.filename
            return (
            <div
              key={m.id}
              className="relative group aspect-square bg-ovh-gray-100 rounded-ovh overflow-hidden"
            >
              {m.type === 'image' ? (
                <img
                  src={m.url}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : m.type === 'video' ? (
                <video
                  src={m.url}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-ovh-gray-200">
                  <svg className="w-8 h-8 text-ovh-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
              )}

              {/* Nom du fichier (affichage) */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-2">
                <p className="text-xs text-white truncate" title={displayName}>{displayName}</p>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleCopyUrl(m.url, m.id)}
                  className="p-2 bg-white rounded-full hover:bg-ovh-gray-100 transition-colors"
                  title="Copier l'URL"
                >
                  {copiedId === m.id ? (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-ovh-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                  title="Supprimer"
                >
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
