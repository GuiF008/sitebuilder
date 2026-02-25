'use client'

import React from 'react'

export function AiToolsPanel() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-ovh-gray-600">
        Outils IA accessibles depuis l&apos;éditeur :
      </p>
      <ul className="text-sm text-ovh-gray-600 space-y-2 list-disc list-inside">
        <li><strong>Rédacteur IA</strong> : disponible dans la barre d&apos;outils lors de l&apos;édition d&apos;un texte.</li>
        <li><strong>Créer une image par IA</strong> : action du menu contextuel sur une section (ellipsis).</li>
      </ul>
      <div className="p-4 bg-ovh-gray-50 rounded-ovh border border-ovh-gray-200">
        <p className="text-xs text-ovh-gray-500">
          Ces fonctionnalités seront activées avec votre clé API. Configurez-les dans les paramètres du compte.
        </p>
      </div>
    </div>
  )
}
