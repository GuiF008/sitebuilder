'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Redirige vers la page d'accueil qui contient maintenant le formulaire
export default function OnboardingPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/')
  }, [router])

  return null
}
