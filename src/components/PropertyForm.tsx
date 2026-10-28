'use client'

import { useState } from 'react'
import type { PropertyInput, GeneratedKit, Ton } from '@/types'
import { sanitizeInput } from '@/lib/validation'
import { Loader2, Sparkles } from 'lucide-react'

interface PropertyFormProps {
  onResult: (kit: GeneratedKit) => void
  creditsLeft?: number | null
}

const defaultValues: PropertyInput = {
  bien: '',
  surface: '',
  localisation: '',
  prix: '',
  points_forts: '',
  ton: 'Standard',
  chambres: '',
  etage: '',
  annee_construction: '',
}

export function PropertyForm({ onResult, creditsLeft }: PropertyFormProps) {
  const [form, setForm] = useState<PropertyInput>(defaultValues)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.bien || !form.surface || !form.localisation || !form.prix || !form.points_forts) {
      setError('Veuillez remplir tous les champs obligatoires.')
      return
    }

    const sanitized: PropertyInput = {
      bien: sanitizeInput(form.bien),
      surface: sanitizeInput(form.surface),
      localisation: sanitizeInput(form.localisation),
      prix: sanitizeInput(form.prix),
      points_forts: sanitizeInput(form.points_forts),
      ton: form.ton as Ton,
      chambres: form.chambres ? sanitizeInput(form.chambres) : undefined,
      etage: form.etage ? sanitizeInput(form.etage) : undefined,
      annee_construction: form.annee_construction ? sanitizeInput(form.annee_construction) : undefined,
    }

    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property: sanitized }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la génération')
      }

      onResult(data.kit)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-900">Caractéristiques du bien</h2>
        {creditsLeft !== undefined && (
          <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
            {creditsLeft === null ? '∞' : creditsLeft} génération{creditsLeft !== 1 ? 's' : ''} restante{creditsLeft !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de bien <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="bien"
            value={form.bien}
            onChange={handleChange}
            placeholder="Ex: Villa contemporaine F5, Studio vue mer..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Surface <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="surface"
            value={form.surface}
            onChange={handleChange}
            placeholder="Ex: 180m²"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Localisation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="localisation"
            value={form.localisation}
            onChange={handleChange}
            placeholder="Ex: Lomé, Baguida"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prix <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="prix"
            value={form.prix}
            onChange={handleChange}
            placeholder="Ex: 120 000 000 FCFA"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ton du message</label>
          <select
            name="ton"
            value={form.ton}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="Standard">Standard</option>
            <option value="Prestige">Prestige</option>
            <option value="Accessible">Accessible</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chambres</label>
          <input
            type="text"
            name="chambres"
            value={form.chambres}
            onChange={handleChange}
            placeholder="Ex: 4 chambres"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Année de construction</label>
          <input
            type="text"
            name="annee_construction"
            value={form.annee_construction}
            onChange={handleChange}
            placeholder="Ex: 2022"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Points forts <span className="text-red-500">*</span>
          </label>
          <textarea
            name="points_forts"
            value={form.points_forts}
            onChange={handleChange}
            rows={3}
            placeholder="Ex: Piscine, Smart Home, Garage 3 voitures, Sécurité 24/7, Vue panoramique..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Génération en cours...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Générer le kit marketing
          </>
        )}
      </button>
    </form>
  )
}
