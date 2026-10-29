'use client'

import { useState } from 'react'
import type { GeneratedKit, DomainId } from '@/types'
import { sanitizeInput } from '@/lib/validation'
import { Loader2, Sparkles } from 'lucide-react'
import { DomainSelector } from '@/components/DomainSelector'
import { getDomain } from '@/lib/domains'

interface PropertyFormProps {
  onResult: (kit: GeneratedKit, domain?: string, domainLabel?: string) => void
  creditsLeft?: number | null
  canGenerate?: boolean
}

export function PropertyForm({ onResult, creditsLeft, canGenerate = true }: PropertyFormProps) {
  const [domain, setDomain] = useState<DomainId>('immobilier')
  const [fields, setFields] = useState<Record<string, string>>({})
  const [ton, setTon] = useState<string>('Standard')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const domainConfig = getDomain(domain)

  const handleDomainChange = (newDomain: string) => {
    setDomain(newDomain as DomainId)
    setFields({})
    setError(null)
  }

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const missingRequired = domainConfig.fields
      .filter(f => f.required)
      .some(f => !fields[f.name] || fields[f.name].trim() === '')

    if (missingRequired) {
      setError('Veuillez remplir tous les champs obligatoires.')
      return
    }

    if (!canGenerate) {
      setError('Quota épuisé. Passez au plan Pro pour continuer.')
      return
    }

    const sanitizedFields: Record<string, string> = {}
    for (const [key, value] of Object.entries(fields)) {
      if (value && value.trim() !== '') {
        sanitizedFields[key] = sanitizeInput(value)
      }
    }

    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: { domain, fields: sanitizedFields, ton } }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la génération')
      }

      onResult(data.kit, domain, domainConfig.label)
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

      <DomainSelector value={domain} onChange={handleDomainChange} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {domainConfig.fields.map(field => (
          <div
            key={field.name}
            className={field.type === 'textarea' ? 'sm:col-span-2' : ''}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                value={fields[field.name] ?? ''}
                onChange={handleFieldChange}
                rows={3}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required={field.required}
              />
            ) : (
              <input
                type="text"
                name={field.name}
                value={fields[field.name] ?? ''}
                onChange={handleFieldChange}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={field.required}
              />
            )}
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ton du message</label>
          <select
            value={ton}
            onChange={e => setTon(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="Standard">Standard</option>
            <option value="Prestige">Prestige</option>
            <option value="Accessible">Accessible</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !canGenerate}
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
