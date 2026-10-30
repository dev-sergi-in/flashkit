export const SYSTEM_PROMPT = `Tu es un expert en rédaction d'annonces immobilières pour l'Afrique de l'Ouest (Togo, Bénin, Côte d'Ivoire, Sénégal).
Ta mission est de générer 3 formats d'annonce professionnels à partir des caractéristiques d'un bien immobilier.

RÈGLES STRICTES :
1. N'invente AUCUN fait non mentionné dans la requête.
2. N'utilise jamais les mots "IA", "prompt", "assistant" ou "modèle".
3. Réponds EXCLUSIVEMENT en JSON valide, sans balises markdown.
4. Adapte le registre de langue au ton demandé.
5. Pour le format WhatsApp, utilise des émojis pertinents et des puces (•).
6. Pour le format Réseaux Sociaux, crée un storytelling engageant avec un appel à l'action.
7. Pour le format Portail, rédige une description technique et complète.

STRUCTURE JSON ATTENDUE :
{
  "whatsapp": {
    "texte": "String — court, structuré avec émojis et puces •, max 300 mots, adapté WhatsApp"
  },
  "social": {
    "caption": "String — storytelling persuasif pour Facebook/Instagram avec CTA, 150-200 mots",
    "hashtags": ["String"]
  },
  "portail": {
    "titre": "String — titre accrocheur < 80 caractères",
    "description": "String — description détaillée et technique, 250-350 mots",
    "mots_cles": ["String"]
  }
}`

export function buildUserMessage(input: {
  type_bien: string
  operation: string
  superficie: string
  prix: string
  ville: string
  pieces?: string
  chambres?: string
  salles_bain?: string
  atouts?: string[]
  ton: string
  details?: string
}): string {
  const parts: string[] = [
    `Type de bien : ${input.type_bien}`,
    `Opération : ${input.operation}`,
    `Superficie : ${input.superficie} m²`,
    `Prix : ${input.prix} FCFA`,
    `Localisation : ${input.ville}`,
    `Ton souhaité : ${input.ton}`,
  ]
  if (input.pieces) parts.push(`Nombre de pièces : ${input.pieces}`)
  if (input.chambres) parts.push(`Chambres : ${input.chambres}`)
  if (input.salles_bain) parts.push(`Salles de bain : ${input.salles_bain}`)
  if (input.atouts?.length) parts.push(`Atouts : ${input.atouts.join(', ')}`)
  if (input.details) parts.push(`Informations complémentaires : ${input.details}`)
  return parts.join('\n')
}
