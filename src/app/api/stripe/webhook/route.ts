import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const event = body?.name
    const transaction = body?.entity

    if (event === 'transaction.approved' && transaction) {
      const planId = transaction.metadata?.planId as string
      const email = transaction.customer?.email as string

      if (planId && email && (planId === 'pro' || planId === 'agence')) {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const { data: userData } = await supabase.auth.admin.listUsers()
        const user = userData?.users?.find(u => u.email === email)

        if (user) {
          await supabase.from('quotas').upsert({
            user_id: user.id,
            plan: planId,
            count: 0,
            reset_at: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
          }, { onConflict: 'user_id' })
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[webhook]', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }
}