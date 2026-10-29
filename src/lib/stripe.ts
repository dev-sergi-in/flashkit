import type { Plan } from '@/types'
import { randomUUID } from 'crypto'

export const PLANS: Plan[] = [
  {
    id: 'starter',
    nom: 'Starter',
    prix_eur: 0,
    prix_fcfa: 0,
    generations: 10,
    features: [
      '10 générations / mois',
      'Annonce Web + Instagram',
      'Email de prospection',
      'Fiche vitrine',
      'Export .txt',
    ],
    cta: 'Commencer gratuitement',
  },
  {
    id: 'pro',
    nom: 'Pro Agent',
    prix_eur: 29,
    prix_fcfa: 19000,
    generations: null,
    features: [
      'Générations illimitées',
      'Tous les formats',
      'Export PDF',
      'Historique des générations',
      'Support prioritaire',
    ],
    cta: 'Passer Pro',
    populaire: true,
  },
  {
    id: 'agence',
    nom: 'Agence',
    prix_eur: 79,
    prix_fcfa: 50000,
    generations: null,
    features: [
      '5 accès collaborateurs',
      'Générations illimitées',
      'Export PDF',
      'Branding personnalisé',
      'Tableau de bord agence',
      'Support dédié',
    ],
    cta: 'Choisir Agence',
  },
  {
    id: 'enterprise',
    nom: 'Enterprise',
    prix_eur: null,
    prix_fcfa: null,
    generations: null,
    features: [
      'Accès API direct',
      'Marque blanche',
      'Intégration sur mesure',
      'SLA garanti',
      'Account manager dédié',
      'Facturation personnalisée',
    ],
    cta: 'Nous contacter',
  },
]

export async function createCinetPayCheckout(
  planId: 'pro' | 'agence',
  email?: string
): Promise<string> {
  const plan = PLANS.find(p => p.id === planId)
  if (!plan) throw new Error('Plan non trouvé')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://immo-prompt-ai.vercel.app'
  const transactionId = randomUUID().replace(/-/g, '').slice(0, 20)

  const res = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apikey: process.env.CINETPAY_API_KEY,
      site_id: process.env.CINETPAY_SITE_ID,
      transaction_id: transactionId,
      amount: plan.prix_fcfa,
      currency: 'XOF',
      description: `Immo-Prompt AI — Plan ${plan.nom}`,
      return_url: `${appUrl}/dashboard?success=1&plan=${planId}`,
      notify_url: `${appUrl}/api/stripe/webhook`,
      channels: 'ALL',
      customer_email: email || '',
      metadata: JSON.stringify({ planId, email }),
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`CinetPay error: ${err}`)
  }

  const data = await res.json()

  if (data.code !== '201') {
    throw new Error(`CinetPay: ${data.message || 'Erreur inconnue'}`)
  }

  return data.data.payment_url
}
