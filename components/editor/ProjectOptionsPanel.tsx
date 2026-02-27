'use client'

import React, { useState, useEffect } from 'react'

const STORAGE_PREFIX = 'sitebuilder_options_'

export interface ProjectOptions {
  domain?: string
  mail?: string
  ssl?: string
  cdn?: string
  other?: string
}

interface ProjectOptionsPanelProps {
  siteId: string
}

function loadOptions(siteId: string): ProjectOptions {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + siteId)
    if (raw) return JSON.parse(raw) as ProjectOptions
  } catch {}
  return {}
}

function saveOptions(siteId: string, options: ProjectOptions) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_PREFIX + siteId, JSON.stringify(options))
  } catch {}
}

export function ProjectOptionsPanel({ siteId }: ProjectOptionsPanelProps) {
  const [options, setOptions] = useState<ProjectOptions>(() => loadOptions(siteId))

  useEffect(() => {
    setOptions(loadOptions(siteId))
  }, [siteId])

  const update = (key: keyof ProjectOptions, value: string) => {
    const next = { ...options, [key]: value || undefined }
    setOptions(next)
    saveOptions(siteId, next)
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-ovh-gray-800">Options du projet</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-ovh-gray-700 mb-1">Domaine</label>
          <input
            type="text"
            value={options.domain ?? ''}
            onChange={(e) => update('domain', e.target.value)}
            placeholder="ex. www.monsite.fr"
            className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-2 focus:ring-ovh-primary text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ovh-gray-700 mb-1">Mail</label>
          <input
            type="text"
            value={options.mail ?? ''}
            onChange={(e) => update('mail', e.target.value)}
            placeholder="ex. contact@monsite.fr"
            className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-2 focus:ring-ovh-primary text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ovh-gray-700 mb-1">SSL</label>
          <input
            type="text"
            value={options.ssl ?? ''}
            onChange={(e) => update('ssl', e.target.value)}
            placeholder="Certificat SSL"
            className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-2 focus:ring-ovh-primary text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ovh-gray-700 mb-1">CDN</label>
          <input
            type="text"
            value={options.cdn ?? ''}
            onChange={(e) => update('cdn', e.target.value)}
            placeholder="Option CDN"
            className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-2 focus:ring-ovh-primary text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ovh-gray-700 mb-1">Autre</label>
          <input
            type="text"
            value={options.other ?? ''}
            onChange={(e) => update('other', e.target.value)}
            placeholder="Autres options"
            className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-2 focus:ring-ovh-primary text-sm"
          />
        </div>
      </div>
      <p className="text-xs text-ovh-gray-500">
        Ces options sont enregistrées localement pour votre projet.
      </p>
    </div>
  )
}
