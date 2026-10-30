import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServer } from '@/lib/supabase-server'
import { z } from 'zod'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sergeakakpo22@gmail.com'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adminClient(): any {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const Schema = z.object({
  delta: z.number().int(),
  reason: z.string().min(1),
})

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const body = await request.json()
  const { delta, reason } = Schema.parse(body)
  const userId = params.id

  const db = adminClient()

  const { data: existing } = await db
    .from('quotas')
    .select('credits')
    .eq('user_id', userId)
    .single()

  const currentCredits = existing?.credits ?? 0
  const newCredits = Math.max(0, currentCredits + delta)

  if (existing) {
    await db.from('quotas')
      .update({ credits: newCredits })
      .eq('user_id', userId)
  } else {
    await db.from('quotas').insert({ user_id: userId, credits: newCredits })
  }

  // Log the adjustment (best-effort)
  try {
    await db.from('transactions').insert({
      user_id: userId,
      cinetpay_transaction_id: `admin_${Date.now()}`,
      amount_fcfa: 0,
      credits_added: delta,
      pack_id: 'admin',
      payment_method: 'admin',
      status: `ADMIN: ${reason}`,
    })
  } catch { /* ignore */ }

  return NextResponse.json({ success: true, credits: newCredits })
}
