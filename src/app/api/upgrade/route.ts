import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

const VALID_PLANS = ['pro', 'agence']

export async function POST(request: NextRequest) {
  try {
    const { planId } = await request.json()
    if (!VALID_PLANS.includes(planId)) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 })
    }

    const supabase = createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await admin.from('quotas').upsert({
      user_id: user.id,
      plan: planId,
      count: 0,
      reset_at: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
    }, { onConflict: 'user_id' })

    return NextResponse.json({ success: true, plan: planId })
  } catch (error) {
    console.error('[upgrade]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}