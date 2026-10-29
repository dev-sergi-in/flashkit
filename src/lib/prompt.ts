import type { BusinessInput } from '@/types'

export const SYSTEM_PROMPT = `Tu es un expert mondial en copywriting et marketing de performance B2B/B2C.
Ta mission est de convertir des caractéristiques brutes d'une offre en un kit complet de contenus de vente.

CONSIGNES STRICTES :
1. N'invente AUCUN fait non mentionné dans la requête utilisateur.
2. N'utilise jamais les mots "IA", "prompt", "assistant" ou "modèle".
3. Réponds EXCLUSIVEMENT en JSON valide, sans balises markdown.
4. Adapte le ton et le vocabulaire au secteur d'activité indiqué.

STRUCTURE JSON ATTENDUE :
{
  "annonce_web": {
    "titre_seo": "String (< 80 caractères)",
    "description_longue": "String (300 mots structurés)",
    "mots_cles": ["String"]
  },
  "social_media": {
    "instagram_caption": "String (engageant avec émojis & CTA)",
    "hashtags": ["String"]
  },
  "outreach": {
    "email_objet": "String",
    "email_corps": "String (150 mots)"
  },
  "print": {
    "titre_vitrine": "String",
    "points_forts": ["String", "String", "String", "String"]
  }
}`

export function buildUserMessage(domain: string, domainLabel: string, fields: Record<string, string>, ton: string): string {
  const parts: string[] = [`Secteur : ${domainLabel} (${domain})`, `Ton : ${ton}`]
  for (const [key, value] of Object.entries(fields)) {
    if (value && value.trim() !== '') {
      parts.push(`${key} : ${value.trim()}`)
    }
  }
  return parts.join('\n')
}
