'use client'

import { useState } from 'react'
import type { GeneratedKit, GeneratorInput, SectorId, Ton } from '@/types'

const SECTORS: { id: SectorId; label: string; emoji: string }[] = [
  { id: 'immobilier', label: 'Immobilier & Terrains', emoji: '🏠' },
  { id: 'ecommerce', label: 'E-commerce & High-Tech', emoji: '🛒' },
  { id: 'automobile', label: 'Automobile & Motos', emoji: '🚗' },
  { id: 'services', label: 'Services & Prestations', emoji: '🛠️' },
  { id: 'digital', label: 'Formations & SaaS', emoji: '💻' },
  { id: 'restauration', label: 'Restauration & Hôtels', emoji: '🍽️' },
  { id: 'beaute', label: 'Beauté & Cosmétique', emoji: '💆' },
  { id: 'btp', label: 'BTP & Équipements', emoji: '⚙️' },
  { id: 'formation', label: 'Écoles & Formations', emoji: '🎓' },
  { id: 'mode', label: 'Mode & Artisanat', emoji: '👗' },
  { id: 'sante', label: 'Santé & Parapharmacie', emoji: '💊' },
  { id: 'agriculture', label: 'Agriculture & Agro', emoji: '🌾' },
  { id: 'voyage', label: 'Voyage & Transport', emoji: '✈️' },
  { id: 'finance', label: 'Finance & Assurance', emoji: '⚖️' },
  { id: 'sport', label: 'Sport & Fitness', emoji: '🏋️' },
  { id: 'energie', label: 'Énergie Solaire', emoji: '☀️' },
  { id: 'art', label: 'Art & Entertainment', emoji: '🎨' },
  { id: 'autre', label: 'Autre Activité', emoji: '📦' },
]

const TONS: { value: Ton; label: string }[] = [
  { value: 'Professionnel', label: 'Professionnel' },
  { value: 'Persuasif', label: 'Persuasif' },
  { value: 'Energique', label: 'Energique' },
  { value: 'Luxe', label: 'Luxe' },
]

interface PropertyFormProps {
  onResult: (kit: GeneratedKit) => void
  creditsLeft?: number | null
  canGenerate?: boolean
}

export function PropertyForm({ onResult, creditsLeft, canGenerate = true }: PropertyFormProps) {
  const [input, setInput] = useState<Partial<GeneratorInput>>({ sector: 'immobilier', ton: 'Professionnel' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = <K extends keyof GeneratorInput>(key: K, value: GeneratorInput[K]) =>
    setInput(p => ({ ...p, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!input.sector || !input.intitule || !input.arguments_cles || !input.prix || !input.cible || !input.ton) {
      setError('Veuillez remplir tous les champs obligatoires.')
      return
    }
    if (!canGenerate || creditsLeft === 0) {
      setError('Quota épuisé. Passez au plan supérieur pour continuer.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la génération')
      onResult(data.kit)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const noCredits = creditsLeft === 0

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5 transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center justify-between animate-fade-up">
        <h2 className="text-lg font-semibold text-gray-900">Générer du contenu marketing</h2>
        <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
          {creditsLeft === null || creditsLeft === undefined ? '∞' : creditsLeft} crédit(s) restant(s)
        </span>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Secteur d'activité <span className="text-red-500">*</span>
        </label>
        <select
          value={input.sector || 'immobilier'}
          onChange={e => set('sector', e.target.value as SectorId)}
          required
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
        >
          {SECTORS.map(s => (
            <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Intitulé <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={input.intitule || ''}
          onChange={e => set('intitule', e.target.value)}
          placeholder="Ex: iPhone 15 Pro, Villa F4 Cocody, Formation SEO..."
          required
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Arguments clés <span className="text-red-500">*</span>
        </label>
        <textarea
          value={input.arguments_cles || ''}
          onChange={e => set('arguments_cles', e.target.value)}
          rows={3}
          placeholder="Ex: Neuf, garantie 1 an, livraison rapide, titre foncier..."
          required
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Prix / Offre <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={input.prix || ''}
          onChange={e => set('prix', e.target.value)}
          placeholder="Ex: 850 000 FCFA, à partir de 25 000 FCFA/mois"
          required
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Public cible <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={input.cible || ''}
          onChange={e => set('cible', e.target.value)}
          placeholder="Ex: Entrepreneurs, familles, étudiants, PME..."
          required
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ton du message</label>
        <div className="grid grid-cols-2 gap-2">
          {TONS.map(t => (
            <button
              key={t.value}
              type="button"
              onClick={() => set('ton', t.value)}
              className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all duration-150 active:scale-95 ${
                input.ton === t.value
                  ? 'bg-blue-600 text-white border-blue-600 animate-scale-in'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="animate-scale-in bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      {noCredits ? (
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-lg text-center">
            Vous n'avez plus de crédits.{' '}
            <a href="/pricing" className="font-semibold underline hover:text-amber-900">
              Obtenir plus de crédits →
            </a>
          </div>
          <button
            type="submit"
            disabled
            className="w-full flex items-center justify-center gap-2 bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl cursor-not-allowed opacity-60"
          >
            ✨ Générer 5 formats (1 crédit)
          </button>
        </div>
      ) : (
        <button
          type="submit"
          disabled={loading}
          className="btn-press relative overflow-hidden w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
        >
          {loading ? (
            <>
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Génération en cours...
            </>
          ) : (
            <>✨ Générer 5 formats (1 crédit)</>
          )}
        </button>
      )}
    </form>
  )
}
