import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-ovh-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Image
                src="/logo/ovhcloud-logo.svg"
                alt="OVHcloud"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
              <span className="text-ovh-gray-300">|</span>
              <span className="font-semibold text-lg text-ovh-gray-800">Site Builder</span>
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
          <p className="text-sm text-ovh-gray-500">
            © {new Date().getFullYear()} OVHcloud. Tous droits réservés.
          </p>
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

