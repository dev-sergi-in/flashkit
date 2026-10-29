import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { anthropic, MODEL, MAX_TOKENS } from '@/lib/anthropic'
import { SYSTEM_PROMPT, buildUserMessage } from '@/lib/prompt'
import { createSupabaseServer } from '@/lib/supabase-server'
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

const PLAN_LIMITS: Record<string, number | null> = {
  starter: 10,
  pro: null,
  agence: null,
  enterprise: null,
}

function nextMonthReset() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()
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

    // Vérifier quota en base
    const supabase = createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data: quota } = await supabase
        .from('quotas')
        .select('count, plan, reset_at')
        .eq('user_id', user.id)
        .single()

      const plan = quota?.plan ?? 'starter'
      const limit = PLAN_LIMITS[plan] ?? 10
      const now = new Date()
      const shouldReset = quota?.reset_at && now > new Date(quota.reset_at)
      const currentCount = shouldReset ? 0 : (quota?.count ?? 0)

      if (limit !== null && currentCount >= limit) {
        return NextResponse.json<ApiError>(
          { error: 'Quota mensuel atteint. Passez au plan Pro pour continuer.', code: 'QUOTA_EXCEEDED' },
          { status: 429 }
        )
      }
    }

    const { input } = parsed.data
    const { domain, fields, ton } = input
    const domainLabel = DOMAIN_LABELS[domain] ?? domain
    const userMessage = buildUserMessage(domain, domainLabel, fields, ton)

    // Appel Claude avec prompt caching
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }] as any,
      messages: [
        { role: 'user', content: userMessage },
      ],
    })

    const text = message.content[0]?.type === 'text' ? message.content[0].text : null
    if (!text) throw new Error('Réponse vide de l\'API')

    let kit: GeneratedKit
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      kit = JSON.parse(jsonMatch ? jsonMatch[0] : text)
    } catch {
      throw new Error('Le format de réponse est invalide')
    }

    const generation_id = randomUUID()

    // Incrémenter quota en base
    if (user) {
      const { data: quota } = await supabase
        .from('quotas')
        .select('count, plan, reset_at')
        .eq('user_id', user.id)
        .single()

      const now = new Date()
      const shouldReset = quota?.reset_at && now > new Date(quota.reset_at)
      const newCount = shouldReset ? 1 : (quota?.count ?? 0) + 1

      if (!quota) {
        await supabase.from('quotas').insert({
          user_id: user.id,
          count: 1,
          reset_at: nextMonthReset(),
          plan: 'starter',
        })
      } else {
        await supabase.from('quotas').update({
          count: newCount,
          ...(shouldReset && { reset_at: nextMonthReset() }),
        }).eq('user_id', user.id)
      }

      // Sauvegarder en historique
      await supabase.from('generations').insert({
        id: generation_id,
        user_id: user.id,
        domain,
        ton,
        kit,
        created_at: new Date().toISOString(),
      }).then(() => {}).catch(() => {}) // non bloquant
    }

    return NextResponse.json({
      kit,
      generation_id,
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
