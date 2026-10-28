import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Immo-Prompt AI — Génération de contenu immobilier en 5 secondes',
  description: 'Convertissez vos fiches techniques en kits marketing complets : annonce web, Instagram, email et fiche vitrine. Propulsé par IA.',
  keywords: ['immobilier', 'marketing', 'intelligence artificielle', 'annonce', 'agence immobilière'],
  openGraph: {
    title: 'Immo-Prompt AI',
    description: 'Générez votre kit marketing immobilier complet en moins de 5 secondes.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
