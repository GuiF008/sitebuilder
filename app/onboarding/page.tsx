'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button, Input, Card } from '@/components/ui'
import { themePresets } from '@/lib/themes/presets'

export default function OnboardingPage() {
  const router = useRouter()
  const [name, setName] = useState('Mon super site')
  const [email, setEmail] = useState('contact@example.com')
  const [themeFamily, setThemeFamily] = useState(themePresets[0].id)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contactEmail: email,
          themeFamily,
          goal: 'vitrine',
          sections: [],
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Erreur lors de la création du site')
      }

      const data = await res.json()
      // API returns editUrl or token
      if (data.editUrl) {
        router.push(data.editUrl)
      } else if (data.token) {
        router.push(`/edit/${data.token}`)
      } else if (data.site && data.site.id) {
        router.push(`/edit/${data.site.id}`)
      } else {
        router.push('/onboarding/success')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Créer votre site — Templates OVHcloud</h1>
        <p className="text-ovh-gray-600 mb-6">Choisissez un template, renseignez un nom et un email pour commencer. Le site sera créé et ouvert dans l'éditeur.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {themePresets.map((preset) => (
            <Card
              key={preset.id}
              selected={themeFamily === preset.id}
              onClick={() => setThemeFamily(preset.id)}
              className="p-4 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-ovh-gray-900">{preset.name}</div>
                  <div className="text-sm text-ovh-gray-500">{preset.description}</div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded" style={{ background: preset.colors.primary }} />
                  <div className="w-8 h-8 rounded" style={{ background: preset.colors.secondary }} />
                  <div className="w-8 h-8 rounded" style={{ background: preset.colors.accent }} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-ovh-lg shadow-sm border border-ovh-gray-200 p-6">
          <Input label="Nom du site" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email de contact" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-4" />

          {error && <p className="text-red-600 mt-4">{error}</p>}

          <div className="mt-6 flex gap-3">
            <Button onClick={handleCreate} disabled={isLoading}>
              {isLoading ? 'Création...' : 'Créer mon site'}
            </Button>
            <Button variant="ghost" onClick={() => router.push('/')}>
              Annuler
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
