import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'

const FORMATS = [
  {
    icon: '🎬',
    title: 'Script TikTok & Reels',
    desc: 'Hook accrocheur, indications de scènes et CTA percutant pour vos vidéos courtes',
  },
  {
    icon: '📱',
    title: 'Post Facebook & Instagram',
    desc: 'Storytelling engageant avec émojis, paragraphes aérés et hashtags ciblés',
  },
  {
    icon: '🌐',
    title: 'Annonce Web & Marketplace',
    desc: 'Titre SEO, résumé accrocheur et liste de caractéristiques techniques',
  },
  {
    icon: '📧',
    title: 'Email de Prospection',
    desc: 'Objet percutant et corps structuré AIDA prêt à envoyer',
  },
  {
    icon: '📋',
    title: 'Fiche Commerciale',
    desc: 'Synthèse bénéfices clients et présentation de l\'offre tarifaire',
  },
]

const SECTORS = [
  'Immobilier', 'E-commerce', 'Automobile', 'Services', 'Digital/SaaS',
  'Restauration', 'Beauté', 'BTP', 'Formation', 'Mode', 'Santé',
  'Agriculture', 'Voyage', 'Finance', 'Sport', 'Énergie', 'Art', 'Autre',
]

const PRICING_TEASER = [
  { name: 'Pack Starter', price: '1 000 FCFA', credits: '15 crédits', popular: false },
  { name: 'Pack Pro', price: '3 000 FCFA', credits: '55 crédits', popular: true },
  { name: 'Pack Agence', price: '10 000 FCFA', credits: '230 crédits', popular: false },
]

const FORMAT_DELAYS = ['delay-100', 'delay-200', 'delay-300', 'delay-400', 'delay-500']
const PRICING_DELAYS = ['delay-100', 'delay-200', 'delay-300']

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50 animate-fade-in">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">FlashKit AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
              Tarifs
            </Link>
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium border border-gray-200 px-4 py-2 rounded-lg transition-colors hover:bg-gray-50">
              Se connecter
            </Link>
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              Essayer gratuitement
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        {/* Decorative blurred circles */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-20 animate-float pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-purple-200 rounded-full blur-3xl opacity-20 animate-float delay-300 pointer-events-none" />

        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 animate-scale-in delay-100">
          <span className="animate-bounce-soft">✨</span> 3 crédits offerts à l&apos;inscription
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight animate-fade-up delay-200">
          Générez <span className="gradient-text">5 formats marketing</span><br />
          <span className="text-blue-600">en 1 clic</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-up delay-300">
          Scripts TikTok, posts Facebook, annonces web, emails de prospection et fiches commerciales.
          Propulsé par l&apos;IA Claude d&apos;Anthropic.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-400">
          <Link href="/login" className="btn-press flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg shadow-blue-200">
            Commencer gratuitement — 3 crédits offerts <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/pricing" className="btn-press text-gray-600 hover:text-gray-900 font-medium px-6 py-4">
            Voir les tarifs →
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-4 animate-fade-up delay-500">
          Aucune carte bancaire requise • 18 secteurs couverts • 5 formats par génération
        </p>
      </section>

      {/* 5 Formats */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">5 formats générés en une seule fois</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FORMATS.map((f, i) => (
            <div key={f.title} className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-up card-hover ${FORMAT_DELAYS[i]}`}>
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 18 Sectors */}
      <section className="max-w-5xl mx-auto px-4 pb-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">18 secteurs d&apos;activité couverts</h2>
        <p className="text-gray-500 mb-8">FlashKit AI s&apos;adapte à votre domaine pour un contenu pertinent et ciblé.</p>
        <div className="flex flex-wrap justify-center gap-2 animate-fade-up delay-200">
          {SECTORS.map(sector => (
            <span key={sector} className="bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-full shadow-sm">
              {sector}
            </span>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Tarifs simples et transparents</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PRICING_TEASER.map((p, i) => (
            <div
              key={p.name}
              className={`bg-white rounded-2xl p-6 border text-center animate-scale-in card-hover ${PRICING_DELAYS[i]} ${
                p.popular
                  ? 'border-blue-400 shadow-md ring-2 ring-blue-100'
                  : 'border-gray-100 shadow-sm'
              }`}
            >
              {p.popular && (
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
                  ⭐ Populaire
                </span>
              )}
              <p className="font-bold text-gray-900 text-lg mb-1">{p.name}</p>
              <p className="text-2xl font-bold text-blue-600 mb-1">{p.price}</p>
              <p className="text-sm text-gray-500">{p.credits}</p>
            </div>
          ))}
        </div>
        <p className="text-center mt-6">
          <Link href="/pricing" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            Voir les détails →
          </Link>
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400 space-y-1 animate-fade-in delay-300">
        <p>© 2026 FlashKit AI — Tous droits réservés</p>
        <p>Mobile Money &amp; Cartes acceptés via CinetPay</p>
      </footer>
    </div>
  )
}
