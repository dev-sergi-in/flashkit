import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FlashKit AI — Générateur de Contenu Marketing',
  description: 'Générez des scripts TikTok, posts Facebook, annonces web, emails et fiches commerciales en 1 clic. FlashKit AI utilise l\'IA Claude pour créer votre contenu marketing en 18 secteurs.',
  keywords: ['marketing', 'intelligence artificielle', 'TikTok', 'Facebook', 'génération de contenu', 'IA', 'Afrique'],
  metadataBase: new URL('https://flashkit.flashservice.app'),
  alternates: { canonical: 'https://flashkit.flashservice.app' },
  openGraph: {
    title: 'FlashKit AI',
    description: 'Générez 5 formats de contenu marketing en 1 clic avec l\'IA.',
    type: 'website',
    url: 'https://flashkit.flashservice.app',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
