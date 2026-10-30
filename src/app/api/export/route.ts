import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { kitToText } from '@/lib/export'
import type { GeneratedKit } from '@/types'

const KitSchema = z.object({
  kit: z.object({
    whatsapp: z.object({ texte: z.string() }),
    social: z.object({ caption: z.string(), hashtags: z.array(z.string()) }),
    portail: z.object({ titre: z.string(), description: z.string(), mots_cles: z.array(z.string()) }),
  }),
  format: z.enum(['txt']),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { kit, format } = KitSchema.parse(body)

    if (format === 'txt') {
      const text = kitToText(kit as GeneratedKit)
      return new NextResponse(text, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': 'attachment; filename="annonces-immo.txt"',
        },
      })
    }

    return NextResponse.json({ error: 'Format non supporté' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Erreur export' }, { status: 500 })
  }
}
