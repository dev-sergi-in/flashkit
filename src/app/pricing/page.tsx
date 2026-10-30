import { CREDIT_PACKS } from '@/lib/stripe'
import { PricingCard } from '@/components/PricingCard'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'

const PACK_DELAYS = ['delay-100', 'delay-200', 'delay-300']

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-up delay-100">
            Rechargez vos <span className="gradient-text">crédits</span>
          </h1>
          <p className="text-lg text-gray-500 animate-fade-up delay-200">Payez uniquement ce que vous utilisez. 1 crédit = 5 formats générés.</p>
        </div>

        {/* Security badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-5 py-2 rounded-full animate-bounce-soft">
            Paiement 100% sécurisé 🔒
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {CREDIT_PACKS.map((pack, i) => (
            <div key={pack.id} className={`animate-scale-in card-hover ${PACK_DELAYS[i]}`}>
              <PricingCard pack={pack} />
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-400 mt-8 animate-fade-up delay-400">
          Paiement sécurisé via CinetPay • Flooz, TMoney, Orange Money, Wave, VISA/Mastercard • Crédits sans expiration
        </p>
      </div>
    </div>
  )
}
