import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const event = body?.name
    const transaction = body?.entity

    if (event === 'transaction.approved' && transaction) {
      const planId = transaction.metadata?.planId
      const email = transaction.customer?.email
      console.log('[webhook] Payment approved:', planId, email)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[webhook]', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }
}
