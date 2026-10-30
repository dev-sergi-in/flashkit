export type Ton = 'Professionnel' | 'Persuasif' | 'Energique' | 'Luxe'

export type SectorId =
  | 'immobilier' | 'ecommerce' | 'automobile' | 'services' | 'digital'
  | 'restauration' | 'beaute' | 'btp' | 'formation' | 'mode'
  | 'sante' | 'agriculture' | 'voyage' | 'finance' | 'sport'
  | 'energie' | 'art' | 'autre'

export interface GeneratorInput {
  sector: SectorId
  intitule: string
  arguments_cles: string
  prix: string
  cible: string
  ton: Ton
}

export interface KitTikTok {
  hook: string
  scenes: string
  script: string
  cta: string
}

export interface KitFacebook {
  post: string
  hashtags: string[]
}

export interface KitWeb {
  titre: string
  resume: string
  points: string[]
}

export interface KitEmail {
  objet: string
  corps: string
}

export interface KitFiche {
  synthese: string
  offre: string
}

export interface GeneratedKit {
  tiktok: KitTikTok
  facebook: KitFacebook
  web: KitWeb
  email: KitEmail
  fiche: KitFiche
}

export interface CreditPack {
  id: 'starter' | 'pro' | 'agence'
  nom: string
  prix_fcfa: number
  credits_base: number
  credits_bonus: number
  credits_total: number
  populaire?: boolean
  cta: string
  features: string[]
}

export interface ApiError {
  error: string
  code: string
}
