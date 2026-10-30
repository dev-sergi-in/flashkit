import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { kitToText } from '@/lib/export'
import type { GeneratedKit } from '@/types'

const KitSchema = z.object({
  kit: z.object({
    tiktok: z.object({ hook: z.string(), scenes: z.string(), script: z.string(), cta: z.string() }),
    facebook: z.object({ post: z.string(), hashtags: z.array(z.string()) }),
    web: z.object({ titre: z.string(), resume: z.string(), points: z.array(z.string()) }),
    email: z.object({ objet: z.string(), corps: z.string() }),
    fiche: z.object({ synthese: z.string(), offre: z.string() }),
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
          'Content-Disposition': 'attachment; filename="kit-marketing.txt"',
        },
      })
    }

    return NextResponse.json({ error: 'Format non supporté' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Erreur export' }, { status: 500 })
  }
}
