'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Card, ProgressSteps } from '@/components/ui'
import { themePresets } from '@/lib/themes/presets'

const STEPS = ['Identité', 'Objectif', 'Modèle', 'Contenu', 'Besoins']

const GOALS = [
  { id: 'vitrine', icon: '🏢', label: 'Vitrine', description: 'Présenter mon activité' },
  { id: 'portfolio', icon: '🖼️', label: 'Portfolio', description: 'Montrer mes créations' },
  { id: 'blog', icon: '📝', label: 'Blog', description: 'Partager mes actualités' },
  { id: 'ecommerce', icon: '🛒', label: 'Boutique', description: 'Vendre en ligne' },
]

const SECTIONS = [
  { id: 'about', label: 'À propos', defaultChecked: true },
  { id: 'services', label: 'Services', defaultChecked: true },
  { id: 'gallery', label: 'Galerie photos', defaultChecked: false },
  { id: 'testimonials', label: 'Témoignages clients', defaultChecked: false },
  { id: 'contact', label: 'Contact', defaultChecked: true },
  { id: 'hours', label: 'Horaires & localisation', defaultChecked: false },
]

const NEEDS = [
  { id: 'form', label: 'Formulaire de contact', premium: false },
  { id: 'seo', label: 'Visible sur Google', premium: false },
  { id: 'chat', label: 'Chat en direct', premium: true },
  { id: 'booking', label: 'Prise de rendez-vous', premium: true },
  { id: 'shop', label: 'Vendre en ligne', premium: true },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  
  // Form data
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [goal, setGoal] = useState('')
  const [themeFamily, setThemeFamily] = useState('ovh-modern')
  const [sections, setSections] = useState<string[]>(
    SECTIONS.filter(s => s.defaultChecked).map(s => s.id)
  )
  const [needs, setNeeds] = useState<string[]>([])

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = () => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 0) {
      if (!name.trim()) newErrors.name = 'Le nom du site est requis'
      if (!email.trim()) newErrors.email = "L'email est requis"
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Email invalide'
      }
    }

    if (currentStep === 1 && !goal) {
      newErrors.goal = 'Veuillez sélectionner un objectif'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (!validateStep()) return

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contactEmail: email,
          goal,
          themeFamily,
          sections,
          needs,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création du site')
      }

      const data = await response.json()
      
      // Redirect to success page with token
      router.push(`/onboarding/success?token=${data.token}`)
    } catch (error) {
      console.error('Error creating site:', error)
      setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer.' })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSection = (id: string) => {
    setSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const toggleNeed = (id: string) => {
    setNeeds(prev =>
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-ovh-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-ovh-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ovh-primary rounded-ovh flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <span className="font-bold text-lg">Site Builder</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-10">
          <ProgressSteps steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Step content */}
        <div className="bg-white rounded-ovh-lg shadow-sm border border-ovh-gray-200 p-8">
          {/* Step 1: Identity */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-ovh-gray-900">
                  Donnez un nom à votre site
                </h1>
                <p className="text-ovh-gray-600 mt-2">
                  Vous pourrez le changer plus tard
                </p>
              </div>

              <Input
                label="Nom du site"
                placeholder="Mon Super Site"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
              />

              <Input
                label="Email de contact"
                type="email"
                placeholder="contact@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                hint="Pour recevoir les messages de vos visiteurs"
              />
            </div>
          )}

          {/* Step 2: Goal */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-ovh-gray-900">
                  À quoi servira votre site ?
                </h1>
                <p className="text-ovh-gray-600 mt-2">
                  Cela nous aide à personnaliser votre expérience
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {GOALS.map((g) => (
                  <Card
                    key={g.id}
                    selected={goal === g.id}
                    onClick={() => setGoal(g.id)}
                    className="p-5"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{g.icon}</span>
                      <div>
                        <div className="font-semibold text-ovh-gray-900">{g.label}</div>
                        <div className="text-sm text-ovh-gray-500">{g.description}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              {errors.goal && (
                <p className="text-red-600 text-sm text-center">{errors.goal}</p>
              )}
            </div>
          )}

          {/* Step 3: Theme */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-ovh-gray-900">
                  Choisissez un modèle
                </h1>
                <p className="text-ovh-gray-600 mt-2">
                  Vous pourrez le personnaliser à votre goût
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {themePresets.map((preset) => (
                  <Card
                    key={preset.id}
                    selected={themeFamily === preset.id}
                    onClick={() => setThemeFamily(preset.id)}
                    className="overflow-hidden theme-card"
                  >
                    {/* Preview */}
                    <div
                      className="h-32 relative"
                      style={{ backgroundColor: preset.colors.background }}
                    >
                      {/* Selected indicator */}
                      {themeFamily === preset.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-ovh-primary rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Simulated header */}
                      <div
                        className="absolute top-0 left-0 right-0 h-8"
                        style={{ backgroundColor: preset.colors.primary }}
                      />
                      
                      {/* Simulated content */}
                      <div className="absolute top-12 left-4 right-4">
                        <div
                          className="h-3 rounded-full mb-2"
                          style={{ backgroundColor: preset.colors.primary, width: '60%' }}
                        />
                        <div
                          className="h-2 rounded-full mb-1"
                          style={{ backgroundColor: preset.colors.muted, width: '80%' }}
                        />
                        <div
                          className="h-2 rounded-full"
                          style={{ backgroundColor: preset.colors.muted, width: '50%' }}
                        />
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="p-4">
                      <div className="font-semibold text-ovh-gray-900">{preset.name}</div>
                      <div className="text-sm text-ovh-gray-500 mb-3">{preset.description}</div>
                      
                      {/* Color palette */}
                      <div className="flex gap-1.5">
                        <div
                          className="w-5 h-5 rounded-full border border-ovh-gray-200"
                          style={{ backgroundColor: preset.colors.primary }}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-ovh-gray-200"
                          style={{ backgroundColor: preset.colors.secondary }}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-ovh-gray-200"
                          style={{ backgroundColor: preset.colors.accent }}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Sections */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-ovh-gray-900">
                  Que souhaitez-vous montrer ?
                </h1>
                <p className="text-ovh-gray-600 mt-2">
                  Sélectionnez les sections de votre site
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {SECTIONS.map((section) => (
                  <label
                    key={section.id}
                    className={`
                      flex items-center gap-3 p-4 rounded-ovh border-2 cursor-pointer
                      transition-all duration-200
                      ${sections.includes(section.id)
                        ? 'border-ovh-primary bg-ovh-primary/5'
                        : 'border-ovh-gray-200 hover:border-ovh-gray-300'}
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={sections.includes(section.id)}
                      onChange={() => toggleSection(section.id)}
                      className="w-5 h-5 text-ovh-primary rounded border-ovh-gray-300 focus:ring-ovh-primary"
                    />
                    <span className="font-medium text-ovh-gray-800">{section.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Needs */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-ovh-gray-900">
                  Avez-vous des besoins particuliers ?
                </h1>
                <p className="text-ovh-gray-600 mt-2">
                  Certaines fonctionnalités sont disponibles en Premium
                </p>
              </div>

              <div className="space-y-3">
                {NEEDS.map((need) => (
                  <label
                    key={need.id}
                    className={`
                      flex items-center justify-between p-4 rounded-ovh border-2 cursor-pointer
                      transition-all duration-200
                      ${needs.includes(need.id)
                        ? 'border-ovh-primary bg-ovh-primary/5'
                        : 'border-ovh-gray-200 hover:border-ovh-gray-300'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={needs.includes(need.id)}
                        onChange={() => toggleNeed(need.id)}
                        className="w-5 h-5 text-ovh-primary rounded border-ovh-gray-300 focus:ring-ovh-primary"
                      />
                      <span className="font-medium text-ovh-gray-800">{need.label}</span>
                    </div>
                    {need.premium && (
                      <span className="text-xs font-semibold text-ovh-accent bg-ovh-accent/10 px-2 py-1 rounded-full">
                        Premium
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Error message */}
          {errors.submit && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-ovh text-red-700 text-center">
              {errors.submit}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-10 pt-6 border-t border-ovh-gray-200">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Retour
            </Button>

            <Button onClick={handleNext} disabled={isLoading}>
              {isLoading
                ? 'Création en cours...'
                : currentStep === STEPS.length - 1
                  ? 'Créer mon site'
                  : 'Continuer'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
