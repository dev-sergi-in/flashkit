'use client'

import { useState } from 'react'
import type { CreditPack } from '@/types'

interface PricingCardProps {
  pack: CreditPack
  userEmail?: string
}

export function PricingCard({ pack, userEmail }: PricingCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheckout = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId: pack.id }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) {
        setError(data.error || 'Erreur de paiement')
        return
      }
      window.location.href = data.url
    } catch {
      setError('Erreur réseau, veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`bg-white rounded-2xl p-6 border flex flex-col ${
        pack.populaire
          ? 'border-blue-500 shadow-lg shadow-blue-100 ring-2 ring-blue-500'
          : 'border-gray-100 shadow-sm'
      }`}
    >
      {pack.populaire && (
        <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full self-start mb-4 tracking-wide">
          LE PLUS POPULAIRE
        </div>
      )}

      <h3 className="font-bold text-gray-900 text-xl mb-2">{pack.nom}</h3>

      <div className="mb-4">
        <span className="text-3xl font-bold text-gray-900">
          {pack.prix_fcfa.toLocaleString('fr-FR')} FCFA
        </span>
      </div>

      <div className="flex items-center gap-2 mb-5">
        <span className="text-4xl font-extrabold text-gray-900">{pack.credits_total}</span>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-700">crédits</span>
          {pack.credits_bonus > 0 && (
            <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
              +{pack.credits_bonus} offerts
            </span>
          )}
        </div>
      </div>

      <ul className="space-y-2.5 mb-6 flex-1">
        {pack.features.map(f => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      {error && (
        <p className="text-red-500 text-xs mb-3 text-center">{error}</p>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-xl transition-colors ${
          pack.populaire
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-800 hover:bg-gray-700 text-white'
        } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {loading ? (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : (
          pack.cta
        )}
      </button>
    </div>
  )
}
