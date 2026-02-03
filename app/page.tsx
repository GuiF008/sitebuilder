import Link from 'next/link'
import { Button } from '@/components/ui'
import { themePresets } from '@/lib/themes/presets'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-ovh-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-ovh-primary rounded-ovh flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <span className="font-bold text-lg text-ovh-gray-800">Site Builder</span>
            </div>
            <Link href="/onboarding">
              <Button size="sm">Créer mon site</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-ovh-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ovh-gray-900 mb-6">
            Créez votre site web
            <span className="text-ovh-primary"> en quelques minutes</span>
          </h1>
          <p className="text-xl text-ovh-gray-600 mb-10 max-w-2xl mx-auto">
            Sans aucune connaissance technique. Sans compte à créer. 
            Choisissez un modèle, personnalisez et publiez.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding">
              <Button size="lg">
                Créer mon site gratuitement
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Voir les modèles
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-ovh-gray-900 mb-12">
            Simple, rapide, efficace
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🚀"
              title="En 5 minutes"
              description="Un parcours guidé en 5 étapes pour créer votre site. Pas besoin d'être expert."
            />
            <FeatureCard
              icon="🎨"
              title="Personnalisable"
              description="Modifiez les couleurs, les polices et le contenu en temps réel."
            />
            <FeatureCard
              icon="📱"
              title="Responsive"
              description="Votre site s'adapte automatiquement à tous les écrans."
            />
          </div>
        </div>
      </section>

      {/* Themes Preview */}
      <section className="py-20 px-4 bg-ovh-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-ovh-gray-900 mb-4">
            Choisissez votre style
          </h2>
          <p className="text-center text-ovh-gray-600 mb-12 max-w-2xl mx-auto">
            6 modèles professionnels, entièrement personnalisables
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {themePresets.map((preset) => (
              <ThemePreviewCard key={preset.id} preset={preset} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-ovh-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Prêt à créer votre site ?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Lancez-vous maintenant, c'est gratuit et sans engagement.
          </p>
          <Link href="/onboarding">
            <Button 
              size="lg" 
              className="bg-white text-ovh-primary hover:bg-ovh-gray-100"
            >
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-ovh-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-ovh-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">O</span>
            </div>
            <span className="text-sm text-ovh-gray-600">OVHcloud Site Builder</span>
          </div>
          <p className="text-sm text-ovh-gray-500">
            © {new Date().getFullYear()} OVHcloud. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: string
  title: string
  description: string 
}) {
  return (
    <div className="text-center p-6">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-ovh-gray-900 mb-2">{title}</h3>
      <p className="text-ovh-gray-600">{description}</p>
    </div>
  )
}

function ThemePreviewCard({ 
  preset 
}: { 
  preset: typeof themePresets[0] 
}) {
  return (
    <div className="bg-white rounded-ovh-lg border border-ovh-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Preview */}
      <div
        className="h-32 relative"
        style={{ backgroundColor: preset.colors.background }}
      >
        {/* Simulated layout */}
        <div
          className="absolute top-0 left-0 right-0 h-8"
          style={{ backgroundColor: preset.colors.primary }}
        />
        <div className="absolute top-12 left-4 right-4">
          <div
            className="h-3 rounded-full mb-2"
            style={{ backgroundColor: preset.colors.primary, width: '60%' }}
          />
          <div
            className="h-2 rounded-full"
            style={{ backgroundColor: preset.colors.muted, width: '80%' }}
          />
        </div>
      </div>
      
      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-ovh-gray-900">{preset.name}</h3>
        <p className="text-sm text-ovh-gray-500 mb-3">{preset.description}</p>
        
        {/* Color palette */}
        <div className="flex gap-1.5">
          <div
            className="w-6 h-6 rounded-full border border-ovh-gray-200"
            style={{ backgroundColor: preset.colors.primary }}
            title="Primaire"
          />
          <div
            className="w-6 h-6 rounded-full border border-ovh-gray-200"
            style={{ backgroundColor: preset.colors.secondary }}
            title="Secondaire"
          />
          <div
            className="w-6 h-6 rounded-full border border-ovh-gray-200"
            style={{ backgroundColor: preset.colors.accent }}
            title="Accent"
          />
        </div>
      </div>
    </div>
  )
}
