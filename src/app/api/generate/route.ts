import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { SYSTEM_PROMPT, buildUserMessage } from '@/lib/prompt'
import type { GeneratedKit, ApiError } from '@/types'
import { randomUUID } from 'crypto'

const DOMAIN_LABELS: Record<string, string> = {
  immobilier: "Immobilier & Terrains",
  ecommerce: "E-commerce & High-Tech",
  automobile: "Automobile & Motos",
  services: "Services & Prestations",
  digital: "Formations En Ligne & SaaS",
  restauration_evenements: "Restauration, Hôtels & Événements",
  beaute_bienetre: "Beauté, Cosmétique & Spas",
  materiel_pro: "Matériel Pro, BTP & Équipements",
  education_ecoles: "Écoles & Formations Présentielles",
  mode_artisanat: "Mode, Sur-Mesure & Artisanat",
  sante_parapharmacie: "Santé, Parapharmacie & Bio",
  agriculture_agro: "Agriculture, Élevage & Agroalimentaire",
  voyage_logistique: "Voyage, Transport & Transit",
  finance_juridique: "Finance, Assurance & Juridique",
  sport_fitness: "Sport, Fitness & Coaching",
  energie_solaire: "Énergie Solaire & Électricité",
  art_divertissement: "Art, Musique & Entertainment",
  autre_custom: "Autre Activité (Personnalisé)",
}

const RequestSchema = z.object({
  input: z.object({
    domain: z.string().min(1),
    fields: z.record(z.string(), z.string()),
    ton: z.enum(['Standard', 'Prestige', 'Accessible']),
  }),
  userId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = RequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json<ApiError>(
        { error: 'Données invalides', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    const { input } = parsed.data
    const { domain, fields, ton } = input
    const domainLabel = DOMAIN_LABELS[domain] ?? domain
    const userMessage = buildUserMessage(domain, domainLabel, fields, ton)

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://immo-prompt-ai.vercel.app',
        'X-Title': 'Immo-Prompt AI',
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
        max_tokens: 1500,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`OpenRouter error ${response.status}: ${err}`)
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content
    if (!text) throw new Error('Réponse vide de l\'API')

    let kit: GeneratedKit
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      kit = JSON.parse(jsonMatch ? jsonMatch[0] : text)
    } catch {
      throw new Error('Le format de réponse est invalide')
    }

    return NextResponse.json({
      kit,
      generation_id: randomUUID(),
    })
  } catch (error) {
    console.error('[generate] error:', error)
    const message = error instanceof Error ? error.message : 'Erreur interne'
    return NextResponse.json<ApiError>(
      { error: message, code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
