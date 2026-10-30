import { CREDIT_PACKS } from '@/lib/stripe'
import { PricingCard } from '@/components/PricingCard'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
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
      </nav>
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Rechargez vos crédits</h1>
          <p className="text-lg text-gray-500">Payez uniquement ce que vous utilisez. 1 crédit = 5 formats générés.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {CREDIT_PACKS.map(pack => (
            <PricingCard key={pack.id} pack={pack} />
          ))}
        </div>
        <p className="text-center text-sm text-gray-400 mt-8">
          Paiement sécurisé via CinetPay • Flooz, TMoney, Orange Money, Wave, VISA/Mastercard • Crédits sans expiration
        </p>
      </div>
    </div>
  )
}
