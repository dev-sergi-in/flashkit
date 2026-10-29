'use client'

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import type { Plan } from '@/types'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface PricingCardProps {
  plan: Plan
  userEmail?: string
}

export function PricingCard({ plan, userEmail }: PricingCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCheckout = () => {
    if (plan.id === "starter" || plan.id === "enterprise") return
    setLoading(true)
    setError("")

    const tryOpen = (attempts = 0) => {
      const FedaPay = (window as unknown as Record<string, unknown>).FedaPay as {
        init: (opts: unknown) => { open: () => void }
      } | undefined

      if (!FedaPay) {
        if (attempts > 15) {
          setError("Erreur de chargement du paiement. Rechargez la page.")
          setLoading(false)
          return
        }
        setTimeout(() => tryOpen(attempts + 1), 300)
        return
      }

      const handler = FedaPay.init({
        public_key: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_sandbox_o0_RZPmI8ZDMYSejKrCKj4yJ",
        transaction: {
          amount: plan.prix_fcfa,
          description: `FlashKit — Plan ${plan.nom}`,
        },
        customer: { email: userEmail || "" },
        onComplete: async (resp: { reason: string }) => {
          if (resp.reason !== "DIALOG DISMISSED") {
            try {
              await fetch("/api/upgrade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planId: plan.id }),
              })
            } catch {}
            window.location.href = "/dashboard?success=1&plan=" + plan.id
          } else {
            setLoading(false)
          }
        },
      })
      setLoading(false)
      handler.open()
    }

    tryOpen()
  }

  const isFree = plan.id === "starter"
  const isEnterprise = plan.id === "enterprise"

  return (
    <div className={cn(
      "bg-white rounded-2xl p-6 border flex flex-col",
      plan.populaire
        ? "border-blue-500 shadow-lg shadow-blue-100 ring-2 ring-blue-500"
        : "border-gray-100 shadow-sm"
    )}>
      {plan.populaire && (
        <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full self-start mb-4">
          LE PLUS POPULAIRE
        </div>
      )}
      <h3 className="font-bold text-gray-900 text-xl mb-1">{plan.nom}</h3>
      <div className="mb-4">
        {isEnterprise ? (
          <p className="text-2xl font-bold text-gray-900">Sur devis</p>
        ) : (
          <>
            <span className="text-4xl font-bold text-gray-900">
              {plan.prix_eur === 0 ? "Gratuit" : `${plan.prix_eur} €`}
            </span>
            {plan.prix_eur !== 0 && plan.prix_eur !== null && (
              <span className="text-gray-400 text-sm">/mois</span>
            )}
            {plan.prix_fcfa !== null && plan.prix_fcfa > 0 && (
              <p className="text-sm text-gray-400 mt-0.5">≈ {plan.prix_fcfa.toLocaleString("fr-FR")} FCFA</p>
            )}
          </>
        )}
      </div>
      <ul className="space-y-2.5 mb-6 flex-1">
        {plan.features.map(f => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
            <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      {error && (
        <p className="text-red-500 text-xs mb-3">{error}</p>
      )}
      {isFree ? (
        <Link href="/dashboard" className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-4 rounded-xl transition-colors">
          {plan.cta}
        </Link>
      ) : isEnterprise ? (
        <a href="mailto:contact@flashkit.app" className="block text-center border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors">
          {plan.cta}
        </a>
      ) : (
        <button
          onClick={handleCheckout}
          disabled={loading}
          className={cn(
            "w-full flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-70",
            plan.populaire ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-900 hover:bg-gray-800 text-white"
          )}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : plan.cta}
        </button>
      )}
    </div>
  )
}