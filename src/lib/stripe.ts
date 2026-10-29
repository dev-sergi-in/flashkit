import type { Plan } from '@/types'

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
      'Intégration Hektor/Apimo',
      'SLA garanti',
      'Account manager dédié',
      'Facturation personnalisée',
    ],
    cta: 'Nous contacter',
  },
]

export async function createFedaPayCheckout(planId: 'pro' | 'agence', email?: string) {
  const plan = PLANS.find(p => p.id === planId)
  if (!plan) throw new Error('Plan non trouvé')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://immo-prompt-ai.vercel.app'

  const txRes = await fetch('https://api.fedapay.com/v1/transactions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.FEDAPAY_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: `Immo-Prompt AI — Plan ${plan.nom}`,
      amount: plan.prix_fcfa,
      currency: { iso: 'XOF' },
      callback_url: `${appUrl}/dashboard?success=1&plan=${planId}`,
      customer: { email: email || '' },
      metadata: { planId },
    }),
  })

  if (!txRes.ok) {
    const err = await txRes.text()
    throw new Error(`FedaPay error: ${err}`)
  }

  const txData = await txRes.json()
  const txId = txData.v1?.transaction?.id

  const tokenRes = await fetch(`https://api.fedapay.com/v1/transactions/${txId}/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.FEDAPAY_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
  })

  if (!tokenRes.ok) throw new Error('Impossible de générer le lien de paiement')

  const tokenData = await tokenRes.json()
  const token = tokenData.token

  return `https://checkout.fedapay.com/?token=${token}`
}
