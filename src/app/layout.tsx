import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'FlashKit — Kit marketing professionnel en 5 secondes',
  description: 'Transformez vos informations produit en kits marketing complets : annonce web, Instagram, email et fiche vitrine. 18 secteurs supportés. Propulsé par IA.',
  keywords: ['marketing', 'intelligence artificielle', 'annonce', 'immobilier', 'e-commerce', 'contenu marketing'],
  openGraph: {
    title: 'FlashKit',
    description: 'Générez votre kit marketing professionnel en moins de 5 secondes.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
        <Script src="https://cdn.fedapay.com/checkout.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}