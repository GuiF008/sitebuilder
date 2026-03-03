'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui'

// Packs web (données en dur - mode démo)
const WEB_PACKS = [
  {
    id: 'perso',
    name: 'Perso',
    power: 'Puissance standard',
    features: [
      'Sites illimités',
      'Puissance standard',
      '1 nom de domaine offert la première année*',
      '100 Go stockage SSD',
      '10 adresses e-mail (5 Go)',
    ],
    priceOriginal: '5,99€',
    pricePromo: '2,99',
    priceUnit: 'HT/mois',
  },
  {
    id: 'pro',
    name: 'Pro',
    power: 'Puissance supérieure',
    features: [
      'Sites illimités',
      'Puissance supérieure',
      '1 nom de domaine offert la première année*',
      '250 Go stockage SSD',
      '100 adresses e-mail (5 Go)',
    ],
    priceOriginal: '9,99€',
    pricePromo: '1,99',
    priceUnit: 'HT/mois',
  },
  {
    id: 'performance',
    name: 'Performance',
    power: 'Puissance haut niveau',
    features: [
      'Sites illimités',
      'Puissance haut niveau',
      '1 nom de domaine offert la première année*',
      '500 Go stockage SSD',
      '1000 adresses e-mail (5 Go)',
    ],
    priceOriginal: 'À partir de 19,99€',
    pricePromo: '6,99',
    priceUnit: 'HT/mois',
  },
] as const

// Simulation des résultats de domaine
function simulateDomainSearch(query: string) {
  const base = query.toLowerCase().replace(/[^a-z0-9]/g, '')
  if (!base) return []
  return [
    {
      domain: `${base}.ovh`,
      priceFirstYear: '0,00 €',
      priceYearly: '2,99 €/an',
      label: 'Gratuit la première année',
      sublabel: 'Tarif réduit sur votre Hébergement',
      available: true,
      promoted: true,
    },
    {
      domain: `${base}.com`,
      priceFirstYear: '10,29 €',
      priceYearly: '13,49 €/an',
      label: '',
      sublabel: '',
      available: true,
      promoted: false,
    },
    {
      domain: `${base}.fr`,
      priceFirstYear: '5,59 €',
      priceYearly: '7,79 €/an',
      label: '',
      sublabel: '',
      available: true,
      promoted: false,
    },
  ]
}

type Step = 'order' | 'payment' | 'validation'

export default function PublishPage() {
  const params = useParams()
  const token = params.token as string

  const [site, setSite] = useState<{ id: string; name: string; slug: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Données du formulaire
  const [domainQuery, setDomainQuery] = useState('')
  const [domainResults, setDomainResults] = useState<ReturnType<typeof simulateDomainSearch>>([])
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [selectedPack, setSelectedPack] = useState<string>('pro')
  const [step, setStep] = useState<Step>('order')
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)

  // Charger le site
  useEffect(() => {
    async function loadSite() {
      try {
        const response = await fetch(`/api/sites/by-token?token=${token}`)
        if (!response.ok) {
          setError('Site non trouvé')
          return
        }
        const data = await response.json()
        const s = data.site
        setSite({ id: s.id, name: s.name, slug: s.slug })
        const base = (s.slug || s.name || 'monsite').toLowerCase().replace(/[^a-z0-9]/g, '') || 'monsite'
        setDomainQuery(base)
        setDomainResults(simulateDomainSearch(base))
        setSelectedDomain(`${base}.ovh`)
      } catch {
        setError('Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }
    loadSite()
  }, [token])

  const handleSearchDomain = () => {
    setDomainResults(simulateDomainSearch(domainQuery))
    if (domainResults.length > 0) setSelectedDomain(domainResults[0]?.domain ?? null)
  }

  const pack = WEB_PACKS.find((p) => p.id === selectedPack)
  const domainResult = domainResults.find((d) => d.domain === selectedDomain)

  // Calcul total mock (pour la démo) : pack × 12 mois + domaine (0 si .ovh promo)
  const packAnnual = pack ? parseFloat(pack.pricePromo.replace(',', '.')) * 12 : 0
  const domainFirstYear = domainResult?.promoted ? 0 : parseFloat((domainResult?.priceFirstYear || '0').replace(/[^0-9,]/g, '').replace(',', '.')) || 0
  const totalHT = (packAnnual + domainFirstYear).toFixed(2)

  const handleContinueToPayment = () => {
    if (!selectedDomain || !selectedPack) return
    setStep('payment')
  }

  const handleMockPayment = () => {
    setStep('validation')
  }

  const handleFinalPublish = async () => {
    if (!site) return
    setIsPublishing(true)
    try {
      const response = await fetch(`/api/sites/${site.id}/publish`, { method: 'POST' })
      if (response.ok) {
        setPublishSuccess(true)
      } else {
        alert('Erreur lors de la publication')
      }
    } catch {
      alert('Erreur lors de la publication')
    } finally {
      setIsPublishing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ovh-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-ovh-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !site) {
    return (
      <div className="min-h-screen bg-ovh-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-ovh-gray-600 mb-4">{error || 'Site non trouvé'}</p>
          <Link href="/">
            <Button>Retour à l&apos;accueil</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Écran de succès
  if (publishSuccess) {
    return (
      <div className="min-h-screen bg-ovh-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-ovh-gray-900 mb-2">Site publié !</h1>
          <p className="text-ovh-gray-600 mb-6">
            Votre site est en ligne sur{' '}
            <a href={`/s/${site.slug}`} target="_blank" rel="noopener noreferrer" className="text-ovh-primary font-medium hover:underline">
              /s/{site.slug}
            </a>
          </p>
          <Link href={`/edit/${token}`}>
            <Button>Retour à l&apos;éditeur</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ovh-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-ovh-gray-200 px-4 py-3 flex items-center gap-4">
        <Link href={`/edit/${token}`} className="p-2 hover:bg-ovh-gray-100 rounded-lg transition-colors">
          <svg className="w-5 h-5 text-ovh-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="font-bold text-lg text-ovh-gray-900">Publication de &quot;{site.name}&quot;</h1>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Contenu principal */}
          <div className="flex-1 min-w-0 space-y-8">
            {step === 'order' && (
              <>
                {/* 1. Choix du nom de domaine */}
                <section className="bg-white rounded-2xl border border-ovh-gray-200 p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-ovh-gray-900 mb-2">
                    Un nom de domaine inclus avec votre hébergement web
                  </h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-sm text-blue-800">
                    Grâce à un domaine en .ovh, vous bénéficiez d&apos;un tarif réduit sur l&apos;hébergement : 0,99€/mois au lieu de 1,59€/mois !
                  </div>
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      value={domainQuery}
                      onChange={(e) => setDomainQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchDomain()}
                      placeholder="Rechercher un nom de domaine"
                      className="flex-1 px-4 py-3 border-2 border-ovh-gray-200 rounded-xl focus:border-ovh-primary focus:outline-none"
                    />
                    <Button onClick={handleSearchDomain}>Rechercher</Button>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800">
                    Bénéficiez d&apos;un nom de domaine gratuit pendant un an en souscrivant à une offre d&apos;hébergement web.
                    <ul className="mt-2 space-y-1">
                      <li>✓ 1 adresse e-mail personnalisée</li>
                      <li>✓ 1 DNSSEC (DNS sécurisée)</li>
                    </ul>
                  </div>
                  <h3 className="font-semibold text-ovh-gray-800 mb-3">Résultats de la recherche</h3>
                  <div className="space-y-2">
                    {domainResults.map((d) => (
                      <label
                        key={d.domain}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedDomain === d.domain
                            ? 'border-ovh-primary bg-ovh-primary/5'
                            : 'border-ovh-gray-200 hover:border-ovh-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="domain"
                          checked={selectedDomain === d.domain}
                          onChange={() => setSelectedDomain(d.domain)}
                          className="w-4 h-4 text-ovh-primary"
                        />
                        <div className="flex-1">
                          <span className="font-medium">{d.domain}</span>
                          {d.label && (
                            <span className="ml-2 text-sm text-green-600">{d.label}</span>
                          )}
                          {d.sublabel && (
                            <span className="block text-xs text-ovh-gray-500">{d.sublabel}</span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">{d.priceFirstYear}</span>
                          <span className="block text-xs text-ovh-gray-500">{d.priceYearly}</span>
                        </div>
                        <span className="text-xs text-green-600 font-medium">Disponible</span>
                      </label>
                    ))}
                  </div>
                </section>

                {/* 2. Choix du pack web */}
                <section className="bg-white rounded-2xl border border-ovh-gray-200 p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-ovh-gray-900 mb-6">Choisissez votre pack web</h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {WEB_PACKS.map((p) => (
                      <label
                        key={p.id}
                        className={`relative flex flex-col p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                          selectedPack === p.id
                            ? 'border-ovh-primary bg-ovh-primary/5'
                            : 'border-ovh-gray-200 hover:border-ovh-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="pack"
                          checked={selectedPack === p.id}
                          onChange={() => setSelectedPack(p.id)}
                          className="sr-only"
                        />
                        <span className="font-bold text-lg text-ovh-gray-900 mb-2">{p.name}</span>
                        <ul className="space-y-2 flex-1 mb-4">
                          {p.features.map((f, i) => (
                            <li key={i} className="text-sm text-ovh-gray-600 flex items-start gap-2">
                              <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {f}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-auto pt-4 border-t border-ovh-gray-200">
                          <span className="line-through text-ovh-gray-400 text-sm">{p.priceOriginal}</span>
                          <span className="block font-bold text-xl text-ovh-primary">{p.pricePromo} €</span>
                          <span className="text-xs text-ovh-gray-500">{p.priceUnit}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </section>
              </>
            )}

            {step === 'payment' && (
              <section className="bg-white rounded-2xl border border-ovh-gray-200 p-8 shadow-sm">
                <h2 className="text-xl font-bold text-ovh-gray-900 mb-4">Paiement (mode démo)</h2>
                <p className="text-ovh-gray-600 mb-6">
                  Ceci est une simulation. En production, vous seriez redirigé vers une solution de paiement sécurisée.
                </p>
                <div className="bg-ovh-gray-50 rounded-xl p-6 mb-6">
                  <p className="font-medium mb-2">Récapitulatif :</p>
                  <p>Domaine : {selectedDomain}</p>
                  <p>Pack : {pack?.name}</p>
                  <p className="font-semibold mt-2">Total 1ère année : {totalHT} € HT</p>
                </div>
                <Button size="lg" onClick={handleMockPayment}>
                  Simuler le paiement
                </Button>
              </section>
            )}

            {step === 'validation' && (
              <section className="bg-white rounded-2xl border border-ovh-gray-200 p-8 shadow-sm">
                <h2 className="text-xl font-bold text-ovh-gray-900 mb-4">Validation</h2>
                <p className="text-ovh-gray-600 mb-6">
                  Paiement simulé avec succès. Cliquez ci-dessous pour publier votre site.
                </p>
                <Button size="lg" onClick={handleFinalPublish} disabled={isPublishing}>
                  {isPublishing ? 'Publication en cours...' : 'Publier mon site'}
                </Button>
              </section>
            )}
          </div>

          {/* Récapitulatif latéral */}
          <aside className="w-80 flex-shrink-0">
            <div className="sticky top-8 bg-white rounded-2xl border border-ovh-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-ovh-gray-200">
                <h3 className="font-bold text-ovh-gray-900">Récapitulatif</h3>
              </div>
              <div className="p-4 space-y-4">
                {pack && (
                  <div>
                    <p className="text-sm font-medium text-ovh-gray-700">Hébergement</p>
                    <p className="font-semibold">{pack.name}</p>
                    <p className="text-xs text-ovh-gray-500">Durée : 12 mois</p>
                  </div>
                )}
                {selectedDomain && (
                  <div>
                    <p className="text-sm font-medium text-ovh-gray-700">Nom de domaine</p>
                    <p className="font-semibold">{selectedDomain}</p>
                    <p className="text-xs text-ovh-gray-500">
                      {domainResult?.promoted ? '0,00 € la 1ère année' : domainResult?.priceFirstYear}
                    </p>
                  </div>
                )}
                <div className="pt-4 border-t border-ovh-gray-200">
                  <p className="text-sm text-ovh-gray-600">Total HT 1ère année</p>
                  <p className="text-xl font-bold text-ovh-primary">{totalHT} €</p>
                </div>
              </div>
              {step === 'order' && (
                <div className="p-4 border-t border-ovh-gray-200 bg-ovh-gray-50">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleContinueToPayment}
                    disabled={!selectedDomain || !selectedPack}
                  >
                    Continuer ma commande
                  </Button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
