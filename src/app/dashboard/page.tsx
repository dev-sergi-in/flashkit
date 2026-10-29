'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowLeft } from 'lucide-react'
import { PropertyForm } from '@/components/PropertyForm'
import { ResultsTabs } from '@/components/ResultsTabs'
import { ExportButton } from '@/components/ExportButton'
import { useQuota } from '@/hooks/useQuota'
import type { GeneratedKit } from '@/types'

export default function DashboardPage() {
  const [kit, setKit] = useState<GeneratedKit | null>(null)
  const { remaining, canGenerate, consume } = useQuota()

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
              <span className="font-bold text-gray-900">Immo-Prompt AI</span>
            </div>
          </div>
          <Link href="/pricing" className="text-sm text-blue-600 font-semibold hover:text-blue-700">
            Passer Pro →
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Générateur de kit marketing</h1>
          <p className="text-gray-500 text-sm mt-1">
            Remplissez les caractéristiques du bien pour générer votre contenu multi-canal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <PropertyForm onResult={(k) => { setKit(k); consume() }} creditsLeft={remaining} canGenerate={canGenerate} />
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
      </div>
    </div>
  )
}
