'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DashboardNav } from '@/components/DashboardNav'
import { PLANS } from '@/lib/stripe'
import { Crown, CheckCircle, Zap } from 'lucide-react'

interface QuotaData { plan: string; count: number; limit: number | null; remaining: number | null; reset_at: string; email: string }

export default function BillingPage() {
  const [quota, setQuota] = useState<QuotaData | null>(null)

  useEffect(() => {
    fetch('/api/quota').then(r => r.json()).then(setQuota).catch(() => {})
  }, [])

  const currentPlan = PLANS.find(p => p.id === quota?.plan) ?? PLANS[0]
  const isPro = quota?.plan !== 'starter'
  const resetDate = quota?.reset_at ? new Date(quota.reset_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) : null

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav email={quota?.email} plan={quota?.plan} />
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Abonnement &amp; facturation</h1>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Plan actuel</p>
              <div className="flex items-center gap-2">
                {isPro && <Crown className="w-5 h-5 text-yellow-500" />}
                <h2 className="text-xl font-bold text-gray-900 capitalize">{currentPlan.nom}</h2>
              </div>
            </div>
            {!isPro && (
              <Link href="/pricing" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Passer Pro
              </Link>
            )}
          </div>

          <ul className="space-y-2 mb-4">
            {currentPlan.features.map(f => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          {currentPlan.prix_eur !== null && currentPlan.prix_eur > 0 && (
            <p className="text-sm text-gray-500">
              {currentPlan.prix_eur} € / mois · {currentPlan.prix_fcfa?.toLocaleString('fr-FR')} FCFA
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Utilisation ce mois</h2>
          {quota ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Générations utilisées</span>
                <span className="font-semibold">{quota.count} {quota.limit !== null ? `/ ${quota.limit}` : '/ ∞'}</span>
              </div>
              {quota.limit !== null && (
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (quota.count / quota.limit) * 100)}%` }}
                  />
                </div>
              )}
              {resetDate && (
                <p className="text-xs text-gray-400">Réinitialisation le {resetDate}</p>
              )}
            </div>
          ) : (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-2 bg-gray-100 rounded" />
            </div>
          )}
        </div>

        {isPro && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-2">Gérer l'abonnement</h2>
            <p className="text-sm text-gray-500 mb-3">Pour annuler ou modifier votre abonnement, contactez-nous.</p>
            <a href="mailto:contact@flashkit.app" className="text-blue-600 text-sm font-semibold hover:underline">
              contact@flashkit.app
            </a>
          </div>
        )}
      </div>
    </div>
  )
}