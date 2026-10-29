import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createSupabaseAdmin(): any {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function nextMonthReset() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()
}

const VALID_PLANS = ['pro', 'agence'] as const

// CinetPay envoie un POST avec cpm_trans_id, on vérifie le statut via leur API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const transactionId = body?.cpm_trans_id

    if (!transactionId) {
      return NextResponse.json({ received: true })
    }

    // Vérifier le statut du paiement auprès de CinetPay
    const checkRes = await fetch('https://api-checkout.cinetpay.com/v2/payment/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apikey: process.env.CINETPAY_API_KEY,
        site_id: process.env.CINETPAY_SITE_ID,
        transaction_id: transactionId,
      }),
    })

    const checkData = await checkRes.json()

    if (checkData.data?.status !== 'ACCEPTED') {
      console.log('[webhook] Paiement non accepté:', checkData.data?.status)
      return NextResponse.json({ received: true })
    }

    // Extraire planId et email depuis metadata
    let planId: string | undefined
    let email: string | undefined
    try {
      const meta = JSON.parse(checkData.data?.metadata || '{}')
      planId = meta.planId
      email = meta.email || checkData.data?.customer_email
    } catch {
      planId = checkData.data?.metadata
      email = checkData.data?.customer_email
    }

    if (!planId || !VALID_PLANS.includes(planId as typeof VALID_PLANS[number])) {
      console.warn('[webhook] planId invalide:', planId)
      return NextResponse.json({ received: true })
    }

    if (!email) {
      console.warn('[webhook] email manquant')
      return NextResponse.json({ received: true })
    }

    const supabase = createSupabaseAdmin()

    // Trouver l'utilisateur par email
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers()
    if (userError) throw userError

    const user = userData.users.find((u: { email?: string }) => u.email === email)
    if (!user) {
      console.warn('[webhook] Utilisateur introuvable:', email)
      return NextResponse.json({ received: true })
    }

    // Mettre à jour le plan
    const { data: existing } = await supabase
      .from('quotas')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (existing) {
      await supabase
        .from('quotas')
        .update({ plan: planId, count: 0, reset_at: nextMonthReset() })
        .eq('user_id', user.id)
    } else {
      await supabase.from('quotas').insert({
        user_id: user.id,
        plan: planId,
        count: 0,
        reset_at: nextMonthReset(),
      })
    }

    console.log(`[webhook] Plan ${planId} activé pour ${email}`)
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[webhook] erreur:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }
}
