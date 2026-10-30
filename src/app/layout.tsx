import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flashkit AI — Annonces immobilières en 5 secondes',
  description: 'Générez des annonces immobilières professionnelles pour WhatsApp, Facebook, Instagram et les portails web grâce à l\'IA.',
  keywords: ['annonce immobilière', 'intelligence artificielle', 'immobilier', 'agent immobilier', 'Togo', 'Afrique'],
  metadataBase: new URL('https://flashkit.flashservice.app'),
  alternates: { canonical: 'https://flashkit.flashservice.app' },
  openGraph: {
    title: 'Flashkit AI',
    description: 'Annonces immobilières professionnelles générées par IA en 5 secondes.',
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
