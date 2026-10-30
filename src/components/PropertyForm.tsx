'use client'

import { useState } from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import type { GeneratedKit, ImmoInput, Ton } from '@/types'

const TYPES_BIEN = ['Appartement', 'Villa', 'Terrain', 'Local commercial', 'Immeuble', 'Studio', 'Duplex', 'Maison']
const OPERATIONS = ['Vente', 'Location', 'Bail commercial']
const TONS: { value: Ton; label: string }[] = [
  { value: 'Professionnel', label: 'Professionnel' },
  { value: 'Persuasif', label: 'Persuasif' },
  { value: 'Luxe', label: 'Luxe / Haut de gamme' },
  { value: 'Court', label: 'Court & Direct' },
]
const ATOUTS = ['Garage', 'Piscine', 'Balcon', 'Climatisation', 'Titre Foncier', 'Gardien', 'Groupe électrogène', 'Eau courante', 'Clôturé', 'Vue mer', 'Meublé', 'Cuisine équipée']

interface PropertyFormProps {
  onResult: (kit: GeneratedKit) => void
  creditsLeft?: number | null
  canGenerate?: boolean
}

export function PropertyForm({ onResult, creditsLeft, canGenerate = true }: PropertyFormProps) {
  const [input, setInput] = useState<Partial<ImmoInput>>({ atouts: [], ton: 'Professionnel' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: keyof ImmoInput, value: string) => setInput(p => ({ ...p, [key]: value }))

  const toggleAtout = (a: string) => {
    const current = input.atouts || []
    setInput(p => ({ ...p, atouts: current.includes(a) ? current.filter(x => x !== a) : [...current, a] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!input.type_bien || !input.operation || !input.superficie || !input.prix || !input.ville) {
      setError('Veuillez remplir tous les champs obligatoires.')
      return
    }
    if (!canGenerate) { setError('Quota épuisé. Passez au plan Pro pour continuer.'); return }
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

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Caractéristiques du bien</h2>
        {creditsLeft !== undefined && (
          <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
            {creditsLeft === null ? '∞' : creditsLeft} restante{creditsLeft !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Type + Opération */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type de bien <span className="text-red-500">*</span></label>
          <select value={input.type_bien || ''} onChange={e => set('type_bien', e.target.value)} required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">Choisir...</option>
            {TYPES_BIEN.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Opération <span className="text-red-500">*</span></label>
          <select value={input.operation || ''} onChange={e => set('operation', e.target.value)} required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">Choisir...</option>
            {OPERATIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {/* Superficie + Prix + Ville */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Superficie (m²) <span className="text-red-500">*</span></label>
          <input type="number" value={input.superficie || ''} onChange={e => set('superficie', e.target.value)} placeholder="ex: 120" required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA) <span className="text-red-500">*</span></label>
          <input type="text" value={input.prix || ''} onChange={e => set('prix', e.target.value)} placeholder="ex: 45 000 000" required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ville / Quartier <span className="text-red-500">*</span></label>
        <input type="text" value={input.ville || ''} onChange={e => set('ville', e.target.value)} placeholder="ex: Lomé, Bè Kpota" required
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {/* Pièces + Chambres + SDB */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { key: 'pieces', label: 'Pièces', placeholder: '5' },
          { key: 'chambres', label: 'Chambres', placeholder: '3' },
          { key: 'salles_bain', label: 'Salles de bain', placeholder: '2' },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            <input type="number" value={(input as Record<string, string>)[f.key] || ''}
              onChange={e => set(f.key as keyof ImmoInput, e.target.value)} placeholder={f.placeholder}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        ))}
      </div>

      {/* Atouts */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Atouts du bien</label>
        <div className="flex flex-wrap gap-2">
          {ATOUTS.map(a => {
            const selected = (input.atouts || []).includes(a)
            return (
              <button key={a} type="button" onClick={() => toggleAtout(a)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                {a}
              </button>
            )
          })}
        </div>
      </div>

      {/* Détails + Ton */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Informations complémentaires</label>
        <textarea value={input.details || ''} onChange={e => set('details', e.target.value)} rows={2}
          placeholder="Proximité école, rénovation récente, vue dégagée..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ton du message</label>
        <div className="grid grid-cols-2 gap-2">
          {TONS.map(t => (
            <button key={t.value} type="button" onClick={() => setInput(p => ({ ...p, ton: t.value }))}
              className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${input.ton === t.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}

      <button type="submit" disabled={loading || !canGenerate}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Génération en cours...</> : <><Sparkles className="w-4 h-4" />Générer les annonces</>}
      </button>
    </form>
  )
}
