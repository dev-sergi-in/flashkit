export type Ton = 'Professionnel' | 'Persuasif' | 'Luxe' | 'Court'

export interface KitWhatsApp {
  texte: string
}

export interface KitSocial {
  caption: string
  hashtags: string[]
}

export interface KitPortail {
  titre: string
  description: string
  mots_cles: string[]
}

export interface GeneratedKit {
  whatsapp: KitWhatsApp
  social: KitSocial
  portail: KitPortail
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
}

export interface ImmoInput {
  type_bien: string
  operation: string
  superficie: string
  prix: string
  ville: string
  pieces?: string
  chambres?: string
  salles_bain?: string
  atouts: string[]
  ton: Ton
  details?: string
}

export interface GenerateRequest {
  input: ImmoInput
}

export interface GenerateResponse {
  kit: GeneratedKit
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
