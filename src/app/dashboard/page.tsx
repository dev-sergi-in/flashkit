'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowLeft, LogOut, User, Crown } from 'lucide-react'
import { PropertyForm } from '@/components/PropertyForm'
import { ResultsTabs } from '@/components/ResultsTabs'
import { ExportButton } from '@/components/ExportButton'
import { HistoryPanel } from '@/components/HistoryPanel'
import { createSupabaseBrowser } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { GeneratedKit } from '@/types'

interface QuotaInfo {
  plan: string
  remaining: number | null
  canGenerate: boolean
  email?: string
}

export default function DashboardPage() {
  const [kit, setKit] = useState<GeneratedKit | null>(null)
  const [quota, setQuota] = useState<QuotaInfo>({ plan: 'starter', remaining: null, canGenerate: true })
  const [historyRefresh, setHistoryRefresh] = useState(0)
  const router = useRouter()

  const fetchQuota = useCallback(async () => {
    try {
      const res = await fetch('/api/quota')
      if (res.ok) {
        const data = await res.json()
        setQuota({
          plan: data.plan,
          remaining: data.remaining,
          canGenerate: data.canGenerate,
          email: data.email,
        })
      }
    } catch {
      // fallback — keep defaults
    }
  }, [])

  useEffect(() => { fetchQuota() }, [fetchQuota])

  const handleLogout = async () => {
    const supabase = createSupabaseBrowser()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const handleGenerated = async (k: GeneratedKit, domain?: string, domainLabel?: string) => {
    setKit(k)
    setQuota(q => ({
      ...q,
      remaining: q.remaining !== null ? Math.max(0, q.remaining - 1) : null,
      canGenerate: q.remaining !== null ? q.remaining - 1 > 0 : true,
    }))
    await fetch('/api/quota', { method: 'POST' })
    if (domain) {
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, domain_label: domainLabel ?? domain, kit: k }),
      })
      setHistoryRefresh(n => n + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          <div className="flex items-center gap-3">
            {quota.email && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg">
                <User className="w-3.5 h-3.5" />
                {quota.email}
              </div>
            )}
            {quota.plan === 'starter' ? (
              <Link href="/pricing" className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-lg">
                <Crown className="w-3.5 h-3.5" />
                Passer Pro
              </Link>
            ) : (
              <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2.5 py-1.5 rounded-lg capitalize">{quota.plan}</span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Générateur de kit marketing</h1>
          <p className="text-gray-500 text-sm mt-1">
            Choisissez votre secteur, remplissez les informations et générez votre contenu multi-canal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <PropertyForm
              onResult={(k, domain, domainLabel) => handleGenerated(k, domain, domainLabel)}
              creditsLeft={quota.remaining}
              canGenerate={quota.canGenerate}
            />
          </div>

          <div>
            {kit ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-700">Kit généré</h2>
                  <ExportButton kit={kit} />
                </div>
                <ResultsTabs kit={kit} />
              </div>
            ) : (
              <div className="h-full min-h-64 bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-8">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-gray-500 font-medium">Votre kit apparaîtra ici</p>
                <p className="text-sm text-gray-400 mt-1">Remplissez le formulaire et cliquez sur Générer</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <HistoryPanel onReload={setKit} refreshTrigger={historyRefresh} />
        </div>
      </div>
    </div>
  )
}