'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowLeft, LogOut, User, Gem } from 'lucide-react'
import { PropertyForm } from '@/components/PropertyForm'
import { ResultsTabs } from '@/components/ResultsTabs'
import { ExportButton } from '@/components/ExportButton'
import { HistoryPanel } from '@/components/HistoryPanel'
import { createSupabaseBrowser } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { GeneratedKit } from '@/types'

interface QuotaInfo {
  credits: number | null
  email?: string
  canGenerate: boolean
}

export default function DashboardPage() {
  const [kit, setKit] = useState<GeneratedKit | null>(null)
  const [quota, setQuota] = useState<QuotaInfo>({ credits: null, canGenerate: true })
  const [historyRefresh, setHistoryRefresh] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const res = await fetch('/api/quota')
        if (res.ok) {
          const data = await res.json()
          const credits: number = data.credits
          setQuota({
            credits,
            email: data.email,
            canGenerate: credits === null || credits > 0,
          })
        }
      } catch {
        // fallback — keep defaults
      }
    }
    fetchQuota()
  }, [])

  const handleLogout = async () => {
    const supabase = createSupabaseBrowser()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const handleGenerated = (k: GeneratedKit) => {
    setKit(k)
    setQuota(q => {
      const newCredits = q.credits !== null ? Math.max(0, q.credits - 1) : null
      return {
        ...q,
        credits: newCredits,
        canGenerate: newCredits === null || newCredits > 0,
      }
    })
    setHistoryRefresh(n => n + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <nav className="border-b border-gray-100 bg-white animate-fade-in">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-gray-900">FlashKit AI</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {quota.email && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg">
                <User className="w-3.5 h-3.5" />
                {quota.email}
              </div>
            )}
            <div className="animate-scale-in flex items-center gap-1.5 text-xs text-blue-700 font-semibold bg-blue-50 px-2.5 py-1.5 rounded-lg">
              <Gem className="w-3.5 h-3.5" />
              <span key={quota.credits} className="animate-scale-in">
                {quota.credits === null ? '—' : quota.credits}
              </span>
              {' '}crédit{quota.credits !== 1 ? 's' : ''}
            </div>
            <Link
              href="/pricing"
              className="btn-press animate-bounce-soft text-xs text-white font-semibold bg-blue-600 hover:bg-blue-700 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              + Recharger
            </Link>
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
        <div className="mb-6 animate-fade-up delay-100">
          <h1 className="text-2xl font-bold text-gray-900">Générateur de contenu marketing</h1>
          <p className="text-gray-500 text-sm mt-1">
            Choisissez votre secteur, remplissez les informations et générez 5 formats en 1 clic.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="animate-fade-up delay-200">
            <PropertyForm
              onResult={handleGenerated}
              creditsLeft={quota.credits}
              canGenerate={quota.canGenerate}
            />
          </div>

          <div className="animate-fade-up delay-300">
            {kit ? (
              <div className="animate-scale-in space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-700">Kit généré</h2>
                  <ExportButton kit={kit} />
                </div>
                <ResultsTabs kit={kit} />
              </div>
            ) : (
              <div className="h-full min-h-64 bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-8">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-blue-400 animate-float" />
                </div>
                <p className="text-gray-500 font-medium">Votre kit apparaîtra ici</p>
                <p className="text-sm text-gray-400 mt-1">Remplissez le formulaire et cliquez sur Générer</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 animate-fade-up delay-400">
          <HistoryPanel onReload={setKit} refreshTrigger={historyRefresh} />
        </div>
      </div>
    </div>
  )
}
