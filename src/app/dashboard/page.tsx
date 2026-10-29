'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Sparkles, CheckCircle, X } from 'lucide-react'
import { PropertyForm } from '@/components/PropertyForm'
import { ResultsTabs } from '@/components/ResultsTabs'
import { ExportButton } from '@/components/ExportButton'
import { HistoryPanel } from '@/components/HistoryPanel'
import { DashboardNav } from '@/components/DashboardNav'
import type { GeneratedKit } from '@/types'

interface QuotaInfo {
  plan: string
  remaining: number | null
  canGenerate: boolean
  email?: string
}

function SuccessBanner({ plan, onClose }: { plan: string; onClose: () => void }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm">
      <div className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4 shrink-0" />
        <span>Paiement réussi ! Votre plan <strong className="capitalize">{plan}</strong> est maintenant actif.</span>
      </div>
      <button onClick={onClose}><X className="w-4 h-4 text-green-600 hover:text-green-800" /></button>
    </div>
  )
}

function DashboardContent() {
  const [kit, setKit] = useState<GeneratedKit | null>(null)
  const [quota, setQuota] = useState<QuotaInfo>({ plan: 'starter', remaining: null, canGenerate: true })
  const [historyRefresh, setHistoryRefresh] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successPlan, setSuccessPlan] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  const fetchQuota = useCallback(async () => {
    try {
      const res = await fetch('/api/quota')
      if (res.ok) {
        const data = await res.json()
        setQuota({ plan: data.plan, remaining: data.remaining, canGenerate: data.canGenerate, email: data.email })
      }
    } catch {}
  }, [])

  useEffect(() => {
    fetchQuota()
    const success = searchParams.get('success')
    const plan = searchParams.get('plan')
    if (success === '1' && plan) {
      setShowSuccess(true)
      setSuccessPlan(plan)
      fetchQuota()
      router.replace('/dashboard')
    }
  }, [fetchQuota, searchParams, router])

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

  const isPro = quota.plan !== 'starter'

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav email={quota.email} plan={quota.plan} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {showSuccess && <SuccessBanner plan={successPlan} onClose={() => setShowSuccess(false)} />}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Générateur de kit marketing</h1>
          <p className="text-gray-500 text-sm mt-1">Choisissez votre secteur, remplissez les informations et générez votre contenu multi-canal.</p>
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
                  <ExportButton kit={kit} isPro={isPro} />
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

export default function DashboardPage() {
  return <Suspense><DashboardContent /></Suspense>
}