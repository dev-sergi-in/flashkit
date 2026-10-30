import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const cpayTransId: string = body.cpay_trans_id || body.transaction_id
    const cpaySiteId: string = body.cpay_site_id || process.env.CINETPAY_SITE_ID || ''

    if (!cpayTransId) {
      return NextResponse.json({ error: 'Missing transaction id' }, { status: 400 })
    }

    // Verify payment with CinetPay
    const verifyRes = await fetch('https://api-checkout.cinetpay.com/v2/payment/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apikey: process.env.CINETPAY_API_KEY,
        site_id: cpaySiteId || process.env.CINETPAY_SITE_ID,
        transaction_id: cpayTransId,
      }),
    })

    if (!verifyRes.ok) {
      console.error('[cinetpay webhook] verify request failed', await verifyRes.text())
      return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
    }

    const verifyData = await verifyRes.json()

    // Payment validated
    if (verifyData.code === '00') {
      const rawMetadata = verifyData.data?.metadata || body.metadata || '{}'
      let metadata: { packId?: string; userId?: string; credits?: number } = {}
      try {
        metadata = typeof rawMetadata === 'string' ? JSON.parse(rawMetadata) : rawMetadata
      } catch {
        console.error('[cinetpay webhook] failed to parse metadata', rawMetadata)
      }

      const { packId, userId, credits } = metadata
      const creditsAdded = Number(credits) || 0
      const amountFcfa = verifyData.data?.amount || 0

      if (!userId || !creditsAdded) {
        console.error('[cinetpay webhook] missing userId or credits in metadata', metadata)
        return NextResponse.json({ ok: true })
      }

      // Idempotence: check if transaction already processed
      const { data: existingTx } = await supabaseAdmin
        .from('transactions')
        .select('id')
        .eq('cinetpay_transaction_id', cpayTransId)
        .single()

      if (existingTx) {
        // Already processed
        return NextResponse.json({ ok: true })
      }

      // Insert transaction record
      await supabaseAdmin.from('transactions').insert({
        user_id: userId,
        cinetpay_transaction_id: cpayTransId,
        amount_fcfa: amountFcfa,
        credits_added: creditsAdded,
        payment_method: 'cinetpay',
        pack_id: packId || null,
        status: 'ACCEPTED',
        created_at: new Date().toISOString(),
      })

      // Atomically add credits: fetch current then update
      const { data: quota } = await supabaseAdmin
        .from('quotas')
        .select('credits')
        .eq('user_id', userId)
        .single()

      if (!quota) {
        await supabaseAdmin.from('quotas').insert({
          user_id: userId,
          credits: creditsAdded,
        })
      } else {
        await supabaseAdmin
          .from('quotas')
          .update({ credits: (quota.credits || 0) + creditsAdded })
          .eq('user_id', userId)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[cinetpay webhook] error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
