import { LandingPageClient } from '@/components/landing/LandingPageClient'

interface PageProps {
  searchParams?: { step?: string }
}

export default function Page({ searchParams }: PageProps) {
  const initialStep = searchParams?.step === '1' ? 1 : 0
  return <LandingPageClient initialStep={initialStep} />
}
