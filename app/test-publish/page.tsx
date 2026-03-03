'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Page de test : crée un site et redirige vers le flux de publication.
 * Utile pour tester le One Page Order sans passer par l'onboarding complet.
 * URL : http://localhost:3000/test-publish
 */
export default function TestPublishPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'error'>('loading')

  useEffect(() => {
    async function createAndRedirect() {
      try {
        const res = await fetch('/api/sites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Site de test',
            contactEmail: 'test@example.com',
            themeFamily: 'stellar',
            goal: 'vitrine',
            sections: ['about', 'services', 'contact'],
          }),
        })
        if (!res.ok) throw new Error('Erreur création')
        const data = await res.json()
        const token = data.token || data.editUrl?.replace('/edit/', '')
        if (token) {
          router.replace(`/edit/${token}/publish`)
        } else {
          setStatus('error')
        }
      } catch {
        setStatus('error')
      }
    }
    createAndRedirect()
  }, [router])

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Erreur lors de la création du site de test.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-ovh-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p>Création du site de test et redirection vers le flux de publication...</p>
      </div>
    </div>
  )
}
