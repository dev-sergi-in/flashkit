import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createFedaPayCheckout } from '@/lib/stripe'

const Schema = z.object({
  planId: z.enum(['pro', 'agence']),
  email: z.string().email().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planId, email } = Schema.parse(body)

    const url = await createFedaPayCheckout(planId, email)
    return NextResponse.json({ url })
  } catch (error) {
    console.error('[checkout]', error)
    return NextResponse.json({ error: 'Erreur de paiement' }, { status: 500 })
  }
}
