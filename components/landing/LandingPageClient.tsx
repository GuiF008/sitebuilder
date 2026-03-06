'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button, Input, Card, ProgressSteps } from '@/components/ui'
import {
  loadOnboardingAnswers,
  saveOnboardingAnswers,
  clearOnboardingAnswers,
} from '@/lib/onboarding/storage'
import { buildStep1Data } from '@/lib/onboarding/infer'
import { compileOnboardingToPayload } from '@/lib/onboarding/compile'
import type { OnboardingAnswers, Step2Data, Step3Data } from '@/lib/onboarding/types'
import {
  CONTENT_OPTIONS,
  VISUAL_UNIVERSES,
  COLOR_MOODS,
  TYPOGRAPHY_OPTIONS,
} from '@/lib/onboarding/options'

const STEPS = ['Votre projet', 'Contenu', 'Style', 'Génération']

const INTENT_EXAMPLES = [
  'Je veux créer un site pour mon restaurant',
  'Je veux présenter mon activité de photographe',
  'Je veux un site vitrine pour mon entreprise',
  'Je veux montrer mes réalisations',
  'Je veux créer un site pour mon association',
]

interface LandingPageClientProps {
  initialStep?: number
}

export function LandingPageClient({ initialStep = 0 }: LandingPageClientProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [isLoading, setIsLoading] = useState(false)
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    currentStep: 1,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const stepContentRef = useRef<HTMLDivElement>(null)

  // Hydratation depuis localStorage
  useEffect(() => {
    const saved = loadOnboardingAnswers()
    if (saved && (saved.step1 || saved.currentStep > 1)) {
      setAnswers(saved)
      if (initialStep > 0) setCurrentStep(Math.min(saved.currentStep, 4))
    } else if (initialStep > 0) {
      setCurrentStep(1)
      setAnswers((a) => ({ ...a, currentStep: 1 }))
    }
  }, [initialStep])

  useEffect(() => {
    if (currentStep > 0 && stepContentRef.current) {
      stepContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [currentStep])

  useEffect(() => {
    if (currentStep >= 1 && currentStep <= 4 && answers.currentStep !== currentStep) {
      saveOnboardingAnswers({ ...answers, currentStep })
    }
  }, [currentStep, answers])

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (currentStep === 1) {
      const intent = answers.step1?.rawIntent?.trim()
      if (!intent) newErrors.intent = 'Décrivez en quelques mots le but de votre site'
    }
    if (currentStep === 3) {
      if (!answers.step3?.visualStyle) newErrors.visual = 'Choisissez un univers visuel'
      else if (!answers.step3?.colorMood) newErrors.visual = 'Choisissez une ambiance couleur'
      else if (!answers.step3?.typographyStyle) newErrors.visual = 'Choisissez une typographie'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (!validateStep()) return
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
      setAnswers((a) => ({ ...a, currentStep: currentStep + 1 }))
    } else {
      handleGenerate()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setAnswers((a) => ({ ...a, currentStep: currentStep - 1 }))
    } else {
      setCurrentStep(0)
    }
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    setErrors({})
    try {
      const payload = compileOnboardingToPayload(answers)
      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: payload.name,
          contactEmail: payload.contactEmail,
          goal: payload.goal,
          themeFamily: payload.themeFamily,
          sections: payload.sections,
          needs: payload.needs,
        }),
      })
      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Erreur lors de la création du site')
      }
      const data = await response.json()
      clearOnboardingAnswers()
      router.push(`/edit/${data.token}`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Une erreur est survenue.'
      setErrors({ submit: msg })
    } finally {
      setIsLoading(false)
    }
  }

  // —— Step 1: intention
  const setStep1Intent = (rawIntent: string) => {
    const step1 = buildStep1Data(rawIntent)
    setAnswers((a) => ({ ...a, step1, currentStep: a.currentStep }))
  }

  // —— Step 2: contenus
  const suggestedContentIds = answers.step1
    ? getSuggestedContentIdsForGoal(answers.step1.inferredSiteType)
    : []
  const toggleContentNeed = (id: string) => {
    const prev = answers.step2?.selectedContentNeeds ?? []
    const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    const inferredSections = dedupeSectionsFromContentNeeds(next)
    setAnswers((a) => ({
      ...a,
      step2: {
        selectedContentNeeds: next,
        inferredSections,
        contentPriority: next,
        contentDensity: inferContentDensity(next),
      } as Step2Data,
    }))
  }

  // —— Step 3: visuel
  const setStep3 = (partial: Partial<Step3Data>) => {
    setAnswers((a) => ({
      ...a,
      step3: { ...a.step3!, ...partial } as Step3Data,
    }))
  }
  const step3 = answers.step3 ?? ({} as Step3Data)

  return (
    <div className="min-h-screen bg-white w-full">
      <header className="bg-white border-b border-ovh-gray-200 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logo/ovhcloud-logo.svg"
                alt="OVHcloud"
                width={120}
                height={40}
                className="h-8 w-auto"
                priority
              />
              <span className="text-ovh-gray-300">|</span>
              <span className="font-semibold text-lg">Site Builder</span>
            </div>
            <a
              href="https://www.ovhcloud.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ovh-gray-500 hover:text-ovh-primary transition-colors"
            >
              ovhcloud.com
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full">
        {currentStep === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
            <div className="order-2 md:order-1 min-w-0">
              <Image
                src="/hosting-hero.png"
                unoptimized
                alt="Créer votre site web"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg object-contain"
                priority
              />
            </div>
            <div className="order-1 md:order-2 space-y-8 text-left min-w-0">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ovh-gray-900 mb-4 text-left">
                  Créez votre site web
                  <span className="text-ovh-primary"> en quelques minutes</span>
                </h1>
                <p className="text-xl text-ovh-gray-600 text-left">
                  Sans aucune connaissance technique. Sans compte à créer.
                  Décrivez votre projet, choisissez le style — nous générons une première version modifiable.
                </p>
              </div>
              <div className="text-left">
                <a
                  href="/?step=1"
                  className="inline-flex items-center justify-center font-semibold rounded-ovh-lg px-8 py-3.5 text-lg w-full sm:w-auto cursor-pointer bg-ovh-primary text-white hover:bg-ovh-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ovh-primary transition-colors"
                  style={{ textDecoration: 'none' }}
                >
                  Créer votre site
                </a>
              </div>
            </div>
          </div>
        )}

        {currentStep >= 1 && currentStep <= 4 && (
          <>
            <div className="text-center mb-6">
              <p className="text-ovh-gray-600">4 étapes pour générer votre site</p>
            </div>
            <div className="mb-10">
              <ProgressSteps steps={STEPS} currentStep={currentStep - 1} />
            </div>
          </>
        )}

        {currentStep >= 1 && currentStep <= 4 && (
          <div
            ref={stepContentRef}
            className="bg-white rounded-ovh-lg shadow-sm border border-ovh-gray-200 p-8 max-w-4xl mx-auto"
          >
            {/* Étape 1 — Besoin principal */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-ovh-gray-900">
                    Quel est le but de votre site ?
                  </h1>
                  <p className="text-ovh-gray-600 mt-2">
                    Décrivez en une phrase ce que vous voulez faire
                  </p>
                </div>
                <Input
                  type="text"
                  label=""
                  placeholder="Ex : Je veux un site pour mon restaurant..."
                  value={answers.step1?.rawIntent ?? ''}
                  onChange={(e) => setStep1Intent(e.target.value)}
                  error={errors.intent}
                />
                <p className="text-sm text-ovh-gray-500">Exemples :</p>
                <ul className="text-sm text-ovh-gray-600 space-y-1 list-disc list-inside">
                  {INTENT_EXAMPLES.map((ex) => (
                    <li key={ex}>{ex}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Étape 2 — Nom du projet + Contenu */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-ovh-gray-900">
                    Que souhaitez-vous montrer ou proposer sur votre site ?
                  </h1>
                  <p className="text-ovh-gray-600 mt-2">
                    Donnez un nom à votre projet, puis cochez tout ce qui vous correspond
                  </p>
                </div>

                <Input
                  type="text"
                  label="Nom du projet"
                  placeholder="Ex : Mon restaurant, Mon portfolio..."
                  value={answers.siteName ?? ''}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, siteName: e.target.value }))
                  }
                  hint="Ce nom sera utilisé pour votre site"
                />

                <div className="grid sm:grid-cols-2 gap-3">
                  {CONTENT_OPTIONS.map((opt) => (
                    <label
                      key={opt.id}
                      className={`
                        flex items-center gap-3 p-4 rounded-ovh border-2 cursor-pointer transition-all duration-200
                        ${(answers.step2?.selectedContentNeeds ?? []).includes(opt.id)
                          ? 'border-ovh-primary bg-ovh-primary/5'
                          : 'border-ovh-gray-200 hover:border-ovh-gray-300'}
                        ${suggestedContentIds.includes(opt.id) ? 'ring-1 ring-ovh-primary/30' : ''}
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={(answers.step2?.selectedContentNeeds ?? []).includes(opt.id)}
                        onChange={() => toggleContentNeed(opt.id)}
                        className="w-5 h-5 text-ovh-primary rounded border-ovh-gray-300 focus:ring-ovh-primary"
                      />
                      <span className="font-medium text-ovh-gray-800">{opt.label}</span>
                      {suggestedContentIds.includes(opt.id) && (
                        <span className="text-xs text-ovh-primary ml-auto">Recommandé</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Étape 3 — Direction visuelle */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-ovh-gray-900">
                    Quel style souhaitez-vous pour votre site ?
                  </h1>
                  <p className="text-ovh-gray-600 mt-2">
                    Choisissez un univers, une ambiance couleur et une typographie
                  </p>
                </div>

                <div>
                  <p className="font-medium text-ovh-gray-800 mb-2">Univers visuel</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {VISUAL_UNIVERSES.map((u) => (
                      <Card
                        key={u.id}
                        selected={step3.visualStyle === u.id}
                        onClick={() => setStep3({ visualStyle: u.id })}
                        className="p-3 text-center"
                      >
                        <span className="text-sm font-medium">{u.label}</span>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-medium text-ovh-gray-800 mb-2">Ambiance couleur</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {COLOR_MOODS.map((c) => (
                      <Card
                        key={c.id}
                        selected={step3.colorMood === c.id}
                        onClick={() => setStep3({ colorMood: c.id })}
                        className="p-3 text-center"
                      >
                        <span className="text-sm font-medium">{c.label}</span>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-medium text-ovh-gray-800 mb-2">Typographie</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TYPOGRAPHY_OPTIONS.map((t) => (
                      <Card
                        key={t.id}
                        selected={step3.typographyStyle === t.id}
                        onClick={() => setStep3({ typographyStyle: t.id })}
                        className="p-3 text-center"
                      >
                        <span className="text-sm font-medium">{t.label}</span>
                      </Card>
                    ))}
                  </div>
                </div>
                {errors.visual && (
                  <p className="text-red-600 text-sm text-center">{errors.visual}</p>
                )}
              </div>
            )}

            {/* Étape 4 — Récap + Génération */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-ovh-gray-900">
                    Votre site est prêt à être généré
                  </h1>
                  <p className="text-ovh-gray-600 mt-2">
                    Nous allons créer une première version que vous pourrez modifier immédiatement.
                  </p>
                </div>
                <div className="bg-ovh-gray-50 rounded-ovh-lg p-6 space-y-3 text-left">
                  <p>
                    <strong>Projet :</strong> {answers.step1?.rawIntent || '—'}
                  </p>
                  <p>
                    <strong>Contenu :</strong>{' '}
                    {(answers.step2?.selectedContentNeeds?.length ?? 0) > 0
                      ? CONTENT_OPTIONS.filter((o) =>
                          answers.step2?.selectedContentNeeds?.includes(o.id)
                        )
                          .map((o) => o.label)
                          .join(', ')
                      : 'Sections adaptées à votre objectif'}
                  </p>
                  <p>
                    <strong>Style :</strong>{' '}
                  {[step3.visualStyle, step3.colorMood?.replace('_', ' / '), step3.typographyStyle]
                    .filter(Boolean)
                    .join(' · ') || '—'}
                  </p>
                </div>
                {errors.submit && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-ovh text-red-700 text-center">
                    {errors.submit}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between mt-10 pt-6 border-t border-ovh-gray-200">
              <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1}>
                Retour
              </Button>
              <Button onClick={handleNext} disabled={isLoading}>
                {isLoading
                  ? 'Génération en cours...'
                  : currentStep === 4
                    ? 'Générer mon site'
                    : 'Continuer'}
              </Button>
            </div>
          </div>
        )}

        {currentStep === 0 && (
          <section
            className="w-full py-16 mt-20 overflow-hidden"
            style={{
              marginLeft: 'calc(-50vw + 50%)',
              marginRight: 'calc(-50vw + 50%)',
              width: '100vw',
              backgroundColor: '#DEEBF7',
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-12 text-ovh-primary">
                Simple, rapide, efficace
              </h2>
              <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                <FeatureCard
                  iconImg="/onboarding-5min.png"
                  title="En 4 étapes"
                  description="Décrivez votre projet, choisissez le contenu et le style. Une première version est générée automatiquement."
                />
                <FeatureCard
                  iconImg="/onboarding-personnalisable.png"
                  title="Personnalisable"
                  description="Modifiez les couleurs, les polices et le contenu en temps réel dans l'éditeur."
                />
                <FeatureCard
                  iconImg="/onboarding-responsive.png"
                  title="Responsive"
                  description="Votre site s'adapte automatiquement à tous les écrans."
                />
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="py-8 px-4 border-t border-ovh-gray-200 w-full">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-3">
            <Image
              src="/logo/ovhcloud-logo.svg"
              alt="OVHcloud"
              width={100}
              height={32}
              className="h-6 w-auto"
            />
            <span className="text-ovh-gray-300">|</span>
            <span className="text-sm text-ovh-gray-600">Site Builder</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/v2/preview"
              className="text-sm text-ovh-primary hover:underline font-medium"
            >
              V2 Preview (démo)
            </Link>
            <p className="text-sm text-ovh-gray-500">
              © {new Date().getFullYear()} OVHcloud. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  iconImg,
  title,
  description,
}: {
  iconImg: string
  title: string
  description: string
}) {
  return (
    <div className="bg-white border border-white/90 rounded-ovh-lg shadow-sm text-center p-6 text-ovh-gray-800">
      <div className="flex justify-center mb-4 min-h-16">
        <Image
          src={iconImg}
          alt={title}
          width={64}
          height={64}
          className="w-16 h-16 object-contain"
        />
      </div>
      <h3 className="text-xl font-semibold text-ovh-gray-900 mb-2">{title}</h3>
      <p className="text-ovh-gray-600">{description}</p>
    </div>
  )
}

// ——— Helpers

type ThemeGoal = 'vitrine' | 'portfolio' | 'blog' | 'ecommerce'

function getSuggestedContentIdsForGoal(goal: ThemeGoal): string[] {
  const byGoal: Record<ThemeGoal, string[]> = {
    vitrine: ['present_activity', 'present_services', 'share_contact', 'contact_form'],
    portfolio: ['present_activity', 'show_photos', 'show_testimonials', 'contact_form'],
    blog: ['present_activity', 'news_blog', 'contact_form'],
    ecommerce: ['present_services', 'show_products', 'show_testimonials', 'contact_form'],
  }
  return byGoal[goal] ?? byGoal.vitrine
}

const CONTENT_NEED_TO_SECTION: Record<string, string> = {
  present_activity: 'about',
  present_services: 'services',
  show_photos: 'gallery',
  show_testimonials: 'testimonials',
  share_contact: 'contact',
  contact_form: 'contact',
  show_hours: 'hours',
  show_map: 'contact',
  present_team: 'about',
  news_blog: 'about',
  show_products: 'services',
  reservation_quote: 'contact',
}

function dedupeSectionsFromContentNeeds(needIds: string[]): string[] {
  const sections = new Set<string>(['hero'])
  for (const id of needIds) {
    const s = CONTENT_NEED_TO_SECTION[id]
    if (s) sections.add(s)
  }
  sections.add('footer')
  const order = ['hero', 'about', 'services', 'gallery', 'testimonials', 'hours', 'contact', 'footer']
  return order.filter((x) => sections.has(x))
}

function inferContentDensity(selectedIds: string[]): 'visual' | 'balanced' | 'text' {
  const visual = ['show_photos', 'show_testimonials', 'present_team'].filter((id) =>
    selectedIds.includes(id)
  ).length
  if (visual >= 2) return 'visual'
  if (selectedIds.length <= 2) return 'text'
  return 'balanced'
}
