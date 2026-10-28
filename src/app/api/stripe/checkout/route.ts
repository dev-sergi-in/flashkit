import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { stripe, PLANS } from '@/lib/stripe'

const Schema = z.object({
  planId: z.enum(['pro', 'agence']),
  email: z.string().email().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planId, email } = Schema.parse(body)

    const plan = PLANS.find(p => p.id === planId)
    if (!plan?.stripe_price_id) {
      return NextResponse.json({ error: 'Plan non trouvé' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=1`,
      metadata: { planId },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('[stripe/checkout]', error)
    return NextResponse.json({ error: 'Erreur de paiement' }, { status: 500 })
  }
}
