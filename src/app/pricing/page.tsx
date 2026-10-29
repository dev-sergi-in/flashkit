'use client'

import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { PricingCard } from '@/components/PricingCard'
import { PLANS } from '@/lib/stripe'
import { useEffect, useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase'

export default function PricingPage() {
  const [userEmail, setUserEmail] = useState<string | undefined>()

  useEffect(() => {
    const supabase = createSupabaseBrowser()
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? undefined)
    })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="border-b border-white/50 bg-white/70 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900">FlashKit</span>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choisissez votre plan</h1>
          <p className="text-lg text-gray-500">Commencez gratuitement, passez Pro quand vous êtes prêt.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map(plan => (
            <PricingCard key={plan.id} plan={plan} userEmail={userEmail} />
          ))}
        </div>
      </div>
    </div>
  )
}