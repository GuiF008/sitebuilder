'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { themePresets } from '@/lib/themes/presets'
import { Button, Input, Card, ProgressSteps } from '@/components/ui'

const STEPS = ['Identité', 'Objectif', 'Contenu', 'Besoins']

const GOALS = [
  { id: 'vitrine', iconSrc: '/pictos/house.png', label: 'Vitrine', description: 'Présenter mon activité' },
  { id: 'portfolio', iconSrc: '/pictos/camera.png', label: 'Portfolio', description: 'Montrer mes créations' },
  { id: 'blog', iconSrc: '/pictos/book.png', label: 'Blog', description: 'Partager mes actualités' },
  { id: 'ecommerce', iconSrc: '/pictos/cart.png', label: 'Boutique', description: 'Vendre en ligne' },
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

export default function LandingPage() {
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

    if (currentStep === 1) {
      if (!name.trim()) newErrors.name = 'Le nom du site est requis'
      if (!email.trim()) newErrors.email = "L'email est requis"
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Email invalide'
      }
    }

    if (currentStep === 2 && !goal) {
      newErrors.goal = 'Veuillez sélectionner un objectif'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (!validateStep()) return

    const maxStep = STEPS.length
    if (currentStep < maxStep) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      setCurrentStep(0) // Retour au hero
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
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || 'Erreur lors de la création du site'
        const errorDetails = errorData.details ? `: ${JSON.stringify(errorData.details)}` : ''
        throw new Error(`${errorMessage}${errorDetails}`)
      }

      const data = await response.json()
      
      // Redirect to success page with token
      router.push(`/onboarding/success?token=${data.token}`)
    } catch (error) {
      console.error('Error creating site:', error)
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue. Veuillez réessayer.'
      setErrors({ submit: errorMessage })
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-ovh-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logo/ovhcloud-logo.svg"
                alt="OVHcloud"
                width={120}
                height={40}
                className="h-8 w-auto"
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

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image à gauche */}
          <div className="order-2 lg:order-1">
            <Image
              src="/hosting-hero.webp"
              alt="Créer votre site web"
              width={600}
              height={600}
              className="w-full h-auto rounded-lg"
              priority
            />
          </div>

          {/* Contenu à droite - aligné à gauche */}
          <div className="order-1 lg:order-2 space-y-8 text-left">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ovh-gray-900 mb-4 text-left">
                Créez votre site web
                <span className="text-ovh-primary"> en quelques minutes</span>
              </h1>
              <p className="text-xl text-ovh-gray-600 text-left">
                Sans aucune connaissance technique. Sans compte à créer. 
                Personnalisez et publiez en quelques clics.
              </p>
            </div>

            <div className="text-left">
              <Button 
                size="lg" 
                onClick={() => setCurrentStep(1)}
                className="w-full sm:w-auto"
              >
                Créer votre site
              </Button>
            </div>
          </div>
        </div>

        {/* Progress */}
        {currentStep > 0 && (
          <div className="mt-12 mb-8">
            <ProgressSteps steps={STEPS} currentStep={currentStep - 1} />
          </div>
        )}

        {/* Step content */}
        {currentStep > 0 && (
          <div className="bg-white rounded-ovh-lg shadow-sm border border-ovh-gray-200 p-8 max-w-4xl mx-auto">
            {/* Step 1: Identity */}
            {currentStep === 1 && (
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
            {currentStep === 2 && (
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
                        <Image
                          src={g.iconSrc}
                          alt={g.label}
                          width={48}
                          height={48}
                          className="w-12 h-12 object-contain"
                        />
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

                {/* Template selection */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-ovh-gray-900 mb-3">Choisir un modèle</h3>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {themePresets.map((preset) => (
                      <Card
                        key={preset.id}
                        selected={themeFamily === preset.id}
                        onClick={() => setThemeFamily(preset.id)}
                        className="p-4 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-ovh-gray-900">{preset.name}</div>
                            <div className="text-sm text-ovh-gray-500">{preset.description}</div>
                          </div>
                          <div className="flex gap-2">
                            <div className="w-6 h-6 rounded" style={{ background: preset.colors.primary }} />
                            <div className="w-6 h-6 rounded" style={{ background: preset.colors.secondary }} />
                            <div className="w-6 h-6 rounded" style={{ background: preset.colors.accent }} />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Sections */}
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

            {/* Step 4: Needs */}
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
                disabled={currentStep === 1}
              >
                Retour
              </Button>

              <Button onClick={handleNext} disabled={isLoading}>
                {isLoading
                  ? 'Création en cours...'
                  : currentStep === STEPS.length
                    ? 'Créer mon site'
                    : 'Continuer'}
              </Button>
            </div>
          </div>
        )}

        {/* Features Section - affichée seulement si on n'est pas dans le formulaire */}
        {currentStep === 0 && (
          <section className="py-20 mt-20">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-ovh-gray-900 mb-12">
                Simple, rapide, efficace
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard
                  iconSrc="/pictos/speed.png"
                  title="En 5 minutes"
                  description="Un parcours guidé en 5 étapes pour créer votre site. Pas besoin d'être expert."
                />
                <FeatureCard
                  iconSrc="/pictos/brush.png"
                  title="Personnalisable"
                  description="Modifiez les couleurs, les polices et le contenu en temps réel."
                />
                <FeatureCard
                  iconSrc="/pictos/mobile.png"
                  title="Responsive"
                  description="Votre site s'adapte automatiquement à tous les écrans."
                />
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-ovh-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
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
  iconSrc, 
  title, 
  description 
}: { 
  iconSrc: string
  title: string
  description: string 
}) {
  return (
    <div className="text-center p-6">
      <div className="flex justify-center mb-4">
        <Image
          src={iconSrc}
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
