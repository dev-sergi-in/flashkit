export type Ton = 'Standard' | 'Prestige' | 'Accessible'

export interface PropertyInput {
  bien: string
  surface: string
  localisation: string
  prix: string
  points_forts: string
  ton: Ton
  chambres?: string
  etage?: string
  annee_construction?: string
}

export interface AnnonceWeb {
  titre_seo: string
  description_longue: string
  mots_cles: string[]
}

export interface SocialMedia {
  instagram_caption: string
  hashtags: string[]
}

export interface Outreach {
  email_objet: string
  email_corps: string
}

export interface Print {
  titre_vitrine: string
  points_forts: string[]
}

export interface GeneratedKit {
  annonce_web: AnnonceWeb
  social_media: SocialMedia
  outreach: Outreach
  print: Print
}

export type PlanId = 'starter' | 'pro' | 'agence' | 'enterprise'

export interface Plan {
  id: PlanId
  nom: string
  prix_eur: number | null
  prix_fcfa: number | null
  generations: number | null
  features: string[]
  cta: string
  populaire?: boolean
  stripe_price_id?: string
}

export interface GenerateRequest {
  property: PropertyInput
  userId?: string
}

export interface GenerateResponse {
  kit: GeneratedKit
  credits_restants?: number
  generation_id: string
}

export interface ApiError {
  error: string
  code?: string
}

export interface QuotaStatus {
  used: number
  limit: number | null
  plan: PlanId
  reset_at?: Date
}
