import Stripe from 'stripe'
import type { Plan } from '@/types'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

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
    stripe_price_id: process.env.STRIPE_PRICE_PRO,
    features: [
      'Générations illimitées',
      'Tous les formats',
      'Export PDF & Word',
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
    stripe_price_id: process.env.STRIPE_PRICE_AGENCE,
    features: [
      '5 accès collaborateurs',
      'Générations illimitées',
      'Export PDF, Word & Excel',
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
