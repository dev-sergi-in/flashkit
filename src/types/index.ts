export type Ton = 'Standard' | 'Prestige' | 'Accessible'

export type DomainId =
  | 'immobilier'
  | 'ecommerce'
  | 'automobile'
  | 'services'
  | 'digital'
  | 'restauration_evenements'
  | 'beaute_bienetre'
  | 'materiel_pro'
  | 'education_ecoles'
  | 'mode_artisanat'
  | 'sante_parapharmacie'
  | 'agriculture_agro'
  | 'voyage_logistique'
  | 'finance_juridique'
  | 'sport_fitness'
  | 'energie_solaire'
  | 'art_divertissement'
  | 'autre_custom'

export interface DomainField {
  name: string
  label: string
  placeholder: string
  required: boolean
  type: 'text' | 'textarea' | 'select'
  options?: string[]
}

export interface Domain {
  id: DomainId
  label: string
  fields: DomainField[]
  promptContext: string
}

export interface BusinessInput {
  domain: DomainId
  fields: Record<string, string>
  ton: Ton
}

// Legacy — kept for backwards compat
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
  input: BusinessInput
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
