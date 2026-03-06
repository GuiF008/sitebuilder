/**
 * Persistance temporaire des réponses onboarding (localStorage).
 * Clé : builder_onboarding_answers
 */

import type { OnboardingAnswers } from './types'

const STORAGE_KEY = 'builder_onboarding_answers'

export function loadOnboardingAnswers(): OnboardingAnswers | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as OnboardingAnswers
  } catch {
    return null
  }
}

export function saveOnboardingAnswers(answers: OnboardingAnswers): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
  } catch {
    // ignore
  }
}

export function clearOnboardingAnswers(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
