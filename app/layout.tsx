import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OVHcloud Site Builder',
  description: 'Créez votre site web en quelques minutes, sans aucune connaissance technique',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&family=Playfair+Display:wght@500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-white text-ovh-gray-800">
        {children}
      </body>
    </html>
  )
}
