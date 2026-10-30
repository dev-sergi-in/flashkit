import type { CreditPack } from '@/types'
import { randomUUID } from 'crypto'

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: 'starter',
    nom: 'Pack Starter',
    prix_fcfa: 1000,
    credits_base: 15,
    credits_bonus: 0,
    credits_total: 15,
    cta: 'Acheter 15 crédits',
    features: ['15 crédits (1 000 FCFA)', '5 formats par génération', 'TikTok, Facebook, Web, Email, Fiche', 'Export TXT', 'Valable sans expiration'],
  },
  {
    id: 'pro',
    nom: 'Pack Pro',
    prix_fcfa: 3000,
    credits_base: 50,
    credits_bonus: 5,
    credits_total: 55,
    populaire: true,
    cta: 'Acheter 55 crédits',
    features: ['55 crédits (3 000 FCFA)', '5 crédits offerts', '5 formats par génération', 'Export TXT & PDF', 'Historique complet', 'Support prioritaire'],
  },
  {
    id: 'agence',
    nom: 'Pack Agence',
    prix_fcfa: 10000,
    credits_base: 200,
    credits_bonus: 30,
    credits_total: 230,
    cta: 'Acheter 230 crédits',
    features: ['230 crédits (10 000 FCFA)', '30 crédits offerts', '5 formats par génération', 'Export TXT & PDF', 'Historique complet', 'Support dédié'],
  },
]

export async function createCinetPayCheckout(
  packId: 'starter' | 'pro' | 'agence',
  email?: string,
  userId?: string,
): Promise<string> {
  const pack = CREDIT_PACKS.find(p => p.id === packId)
  if (!pack) throw new Error('Pack non trouvé')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://flashkit.flashservice.app'
  const transactionId = randomUUID().replace(/-/g, '').slice(0, 20)

  const res = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apikey: process.env.CINETPAY_API_KEY,
      site_id: process.env.CINETPAY_SITE_ID,
      transaction_id: transactionId,
      amount: pack.prix_fcfa,
      currency: 'XOF',
      description: `FlashKit AI — ${pack.nom} (${pack.credits_total} crédits)`,
      return_url: `${appUrl}/dashboard?success=1&pack=${packId}`,
      notify_url: `${appUrl}/api/webhooks/cinetpay`,
      channels: 'ALL',
      customer_email: email || '',
      metadata: JSON.stringify({ packId, userId, credits: pack.credits_total }),
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
