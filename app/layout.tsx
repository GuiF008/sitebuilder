import type { Metadata, Viewport } from 'next'
import { Source_Sans_3 } from 'next/font/google'
import './globals.css'

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-source-sans',
})

export const metadata: Metadata = {
  title: 'OVHcloud Site Builder',
  description: 'Créez votre site web en quelques minutes, sans aucune connaissance technique',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={sourceSans.variable}>
      <head>
        {/* Polices additionnelles pour les thèmes du builder */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&family=Playfair+Display:wght@500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${sourceSans.className} antialiased bg-white text-ovh-gray-800`}>
        {children}
      </body>
    </html>
  )
}
