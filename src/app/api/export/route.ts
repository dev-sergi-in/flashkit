import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { kitToText } from '@/lib/export'
import type { GeneratedKit } from '@/types'

const KitSchema = z.object({
  kit: z.object({
    annonce_web: z.object({ titre_seo: z.string(), description_longue: z.string(), mots_cles: z.array(z.string()) }),
    social_media: z.object({ instagram_caption: z.string(), hashtags: z.array(z.string()) }),
    outreach: z.object({ email_objet: z.string(), email_corps: z.string() }),
    print: z.object({ titre_vitrine: z.string(), points_forts: z.array(z.string()) }),
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
