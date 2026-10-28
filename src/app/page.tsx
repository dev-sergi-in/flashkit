import Link from 'next/link'
import { Sparkles, Globe, Instagram, Mail, Tag, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">Immo-Prompt AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
              Tarifs
            </Link>
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Essayer gratuitement
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Propulsé par Claude 3.5 Sonnet
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Votre kit marketing immobilier<br />
          <span className="text-blue-600">en moins de 5 secondes</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Convertissez vos fiches techniques brutes en annonces web optimisées,
          captions Instagram, emails de prospection et fiches vitrine prêts à l'emploi.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg shadow-blue-200"
          >
            Générer gratuitement <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900 font-medium px-6 py-4">
            Voir les tarifs →
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-4">3 générations gratuites • Sans carte bancaire</p>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-3 gap-6 text-center">
          {[
            { value: '90%', label: 'De temps gagné' },
            { value: '< 5s', label: 'Par génération' },
            { value: '4', label: 'Canaux générés' },
          ].map(stat => (
            <div key={stat.value} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-3xl font-bold text-blue-600 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          4 formats de contenu générés instantanément
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Globe, title: 'Annonce Web SEO', desc: 'Titre optimisé, description 300 mots, mots-clés', color: 'text-blue-600 bg-blue-50' },
            { icon: Instagram, title: 'Caption Instagram', desc: 'Caption engageante + hashtags ciblés', color: 'text-purple-600 bg-purple-50' },
            { icon: Mail, title: 'Email de Prospection', desc: 'Objet optimisé + pitch 150 mots', color: 'text-amber-600 bg-amber-50' },
            { icon: Tag, title: 'Fiche Vitrine', desc: 'Titre impactant + 4 points forts', color: 'text-green-600 bg-green-50' },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-20 text-center">
        <div className="bg-blue-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Prêt à gagner 45 minutes par bien ?</h2>
          <p className="text-blue-100 mb-8">Rejoignez les agences qui ont modernisé leur rédaction.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Commencer gratuitement <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        © 2026 Immo-Prompt AI — Tous droits réservés
      </footer>
    </div>
  )
}
