'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui'

function SuccessContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [copied, setCopied] = useState(false)

  const editUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/edit/${token}`
    : `/edit/${token}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-ovh-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-ovh-gray-600">Token manquant</p>
          <Link href="/onboarding" className="text-ovh-primary hover:underline mt-2 inline-block">
            Recommencer
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ovh-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-ovh-lg shadow-lg border border-ovh-gray-200 p-8 max-w-lg w-full text-center">
        {/* Success icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-ovh-gray-900 mb-2">
          Félicitations !
        </h1>
        <p className="text-ovh-gray-600 mb-8">
          Votre site a été créé avec succès
        </p>

        {/* Secret link section */}
        <div className="bg-ovh-gray-50 rounded-ovh p-5 mb-6">
          <div className="flex items-center gap-2 justify-center mb-3">
            <svg className="w-5 h-5 text-ovh-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="font-semibold text-ovh-gray-800">Votre lien secret</span>
          </div>
          
          <div className="bg-white border border-ovh-gray-200 rounded-ovh p-3 mb-4 break-all text-sm font-mono text-ovh-gray-700">
            {editUrl}
          </div>

          <Button
            onClick={handleCopy}
            variant={copied ? 'secondary' : 'primary'}
            className="w-full"
          >
            {copied ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copié !
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copier le lien
              </>
            )}
          </Button>
        </div>

        {/* Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-ovh p-4 mb-8 text-left">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-amber-800">Important</p>
              <p className="text-sm text-amber-700">
                Copiez ce lien et gardez-le précieusement. C'est votre unique moyen d'accéder à votre site pour le modifier.
                <strong> Ce lien ne sera plus affiché.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link href={`/edit/${token}`}>
          <Button size="lg" className="w-full">
            Accéder à l'éditeur
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ovh-gray-50 flex items-center justify-center">
        <div className="animate-pulse">Chargement...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
