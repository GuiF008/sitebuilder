'use client'

import Link from 'next/link'
import { Button } from '@/components/ui'

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-ovh-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-ovh-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ovh-primary rounded-ovh flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <span className="font-bold text-lg">Site Builder</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-ovh-gray-900 mb-4">
            Passez à Premium
          </h1>
          <p className="text-xl text-ovh-gray-600">
            Débloquez toutes les fonctionnalités pour votre site
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Free */}
          <div className="bg-white rounded-ovh-lg border-2 border-ovh-gray-200 p-8">
            <h2 className="text-2xl font-bold text-ovh-gray-900 mb-2">Gratuit</h2>
            <p className="text-ovh-gray-600 mb-6">Pour démarrer</p>
            <div className="text-4xl font-bold text-ovh-gray-900 mb-8">
              0€
              <span className="text-lg font-normal text-ovh-gray-500">/mois</span>
            </div>
            
            <ul className="space-y-3 mb-8">
              <Feature included>1 site web</Feature>
              <Feature included>6 thèmes disponibles</Feature>
              <Feature included>5 pages maximum</Feature>
              <Feature included>Éditeur visuel</Feature>
              <Feature included>Publication en 1 clic</Feature>
              <Feature>Badge "Créé avec OVHcloud"</Feature>
              <Feature>Nom de domaine personnalisé</Feature>
              <Feature>Support prioritaire</Feature>
            </ul>

            <Button variant="outline" className="w-full" disabled>
              Plan actuel
            </Button>
          </div>

          {/* Premium */}
          <div className="bg-white rounded-ovh-lg border-2 border-ovh-primary p-8 relative">
            <div className="absolute -top-3 right-4 bg-ovh-accent text-white text-xs font-bold px-3 py-1 rounded-full">
              Recommandé
            </div>
            
            <h2 className="text-2xl font-bold text-ovh-gray-900 mb-2">Premium</h2>
            <p className="text-ovh-gray-600 mb-6">Pour les professionnels</p>
            <div className="text-4xl font-bold text-ovh-gray-900 mb-8">
              9,99€
              <span className="text-lg font-normal text-ovh-gray-500">/mois</span>
            </div>
            
            <ul className="space-y-3 mb-8">
              <Feature included>Sites illimités</Feature>
              <Feature included>Tous les thèmes</Feature>
              <Feature included>Pages illimitées</Feature>
              <Feature included>Éditeur visuel avancé</Feature>
              <Feature included>Publication en 1 clic</Feature>
              <Feature included>Sans badge OVHcloud</Feature>
              <Feature included>Nom de domaine personnalisé</Feature>
              <Feature included>Support prioritaire 24/7</Feature>
            </ul>

            <Button className="w-full">
              Passer à Premium
            </Button>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-ovh-gray-900 mb-8 text-center">
            Questions fréquentes
          </h2>
          
          <div className="space-y-6">
            <FaqItem
              question="Puis-je annuler à tout moment ?"
              answer="Oui, vous pouvez annuler votre abonnement Premium à tout moment. Votre site restera en ligne avec les fonctionnalités gratuites."
            />
            <FaqItem
              question="Comment fonctionne le nom de domaine personnalisé ?"
              answer="Avec Premium, vous pouvez connecter votre propre nom de domaine (ex: monsite.com) au lieu de l'adresse par défaut."
            />
            <FaqItem
              question="Mes données sont-elles sécurisées ?"
              answer="Oui, vos données sont hébergées en Europe sur l'infrastructure sécurisée OVHcloud."
            />
          </div>
        </div>
      </main>
    </div>
  )
}

function Feature({ 
  children, 
  included = false 
}: { 
  children: React.ReactNode
  included?: boolean 
}) {
  return (
    <li className="flex items-center gap-3">
      {included ? (
        <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-ovh-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span className={included ? 'text-ovh-gray-800' : 'text-ovh-gray-400'}>
        {children}
      </span>
    </li>
  )
}

function FaqItem({ 
  question, 
  answer 
}: { 
  question: string
  answer: string 
}) {
  return (
    <div className="bg-white rounded-ovh p-6 border border-ovh-gray-200">
      <h3 className="font-semibold text-ovh-gray-900 mb-2">{question}</h3>
      <p className="text-ovh-gray-600">{answer}</p>
    </div>
  )
}
