import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { anthropic, MODEL, MAX_TOKENS } from '@/lib/anthropic'
import { SYSTEM_PROMPT, buildUserMessage } from '@/lib/prompt'
import { createSupabaseServer } from '@/lib/supabase-server'
import type { GeneratedKit, ApiError } from '@/types'
import { randomUUID } from 'crypto'

const RequestSchema = z.object({
  input: z.object({
    sector: z.enum([
      'immobilier', 'ecommerce', 'automobile', 'services', 'digital',
      'restauration', 'beaute', 'btp', 'formation', 'mode', 'sante',
      'agriculture', 'voyage', 'finance', 'sport', 'energie', 'art', 'autre',
    ]),
    intitule: z.string().min(1),
    arguments_cles: z.string().min(1),
    prix: z.string().min(1),
    cible: z.string().min(1),
    ton: z.enum(['Professionnel', 'Persuasif', 'Energique', 'Luxe']),
  }),
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

    const supabase = createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json<ApiError>(
        { error: 'Non authentifié', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    // Credit check
    const { data: quota } = await supabase
      .from('quotas')
      .select('credits')
      .eq('user_id', user.id)
      .single()

    if (!quota) {
      // Welcome gift: insert row with 3 credits
      await supabase.from('quotas').insert({
        user_id: user.id,
        credits: 3,
      })
    } else if (quota.credits <= 0) {
      return NextResponse.json<ApiError>(
        { error: 'Crédits épuisés. Rechargez votre compte pour continuer.', code: 'QUOTA_EXCEEDED' },
        { status: 429 }
      )
    }

    const { input } = parsed.data
    const userMessage = buildUserMessage(input)

    // Call Claude with prompt caching
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

    // Decrement credits
    await supabase
      .from('quotas')
      .update({ credits: (quota?.credits ?? 3) - 1 })
      .eq('user_id', user.id)

    // Save to generations table (non-blocking)
    try {
      await supabase.from('generations').insert({
        id: generation_id,
        user_id: user.id,
        domain: input.sector,
        ton: input.ton,
        kit,
        created_at: new Date().toISOString(),
      })
    } catch { /* ignoré */ }

    return NextResponse.json({ kit, generation_id })
  } catch (error) {
    console.error('[generate] error:', error)
    const message = error instanceof Error ? error.message : 'Erreur interne'
    return NextResponse.json<ApiError>(
      { error: message, code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
