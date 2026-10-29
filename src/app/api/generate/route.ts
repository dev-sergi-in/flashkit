import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { anthropic, MODEL, MAX_TOKENS } from '@/lib/anthropic'
import { SYSTEM_PROMPT, buildUserMessage } from '@/lib/prompt'
import type { GeneratedKit, ApiError } from '@/types'
import { randomUUID } from 'crypto'

const PropertySchema = z.object({
  bien: z.string().min(3).max(200),
  surface: z.string().min(1).max(50),
  localisation: z.string().min(3).max(200),
  prix: z.string().min(1).max(100),
  points_forts: z.string().min(5).max(500),
  ton: z.enum(['Standard', 'Prestige', 'Accessible']),
  chambres: z.string().optional(),
  etage: z.string().optional(),
  annee_construction: z.string().optional(),
})

const RequestSchema = z.object({
  property: PropertySchema,
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

    const { property } = parsed.data
    const userMessage = buildUserMessage(property)

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: userMessage }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : null
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
