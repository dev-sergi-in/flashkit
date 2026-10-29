import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'

const PLAN_LIMITS: Record<string, number | null> = {
  starter: 10,
  pro: null,
  agence: null,
  enterprise: null,
}

function nextMonthReset() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()
}

export async function GET() {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data } = await supabase
    .from('quotas')
    .select('count, reset_at, plan')
    .eq('user_id', user.id)
    .single()

  const plan = data?.plan ?? 'starter'
  const limit = PLAN_LIMITS[plan] ?? 10
  const count = data?.count ?? 0

  return NextResponse.json({
    plan,
    count,
    limit,
    remaining: limit !== null ? Math.max(0, limit - count) : null,
    canGenerate: limit !== null ? count < limit : true,
    reset_at: data?.reset_at,
    email: user.email,
  })
}

export async function POST() {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: existing } = await supabase
    .from('quotas')
    .select('count, plan, reset_at')
    .eq('user_id', user.id)
    .single()

  const now = new Date()
  const shouldReset = existing?.reset_at && now > new Date(existing.reset_at)
  const newCount = shouldReset ? 1 : (existing?.count ?? 0) + 1

  if (!existing) {
    await supabase.from('quotas').insert({
      user_id: user.id,
      count: 1,
      reset_at: nextMonthReset(),
      plan: 'starter',
    })
  } else {
    await supabase.from('quotas').update({
      count: newCount,
      ...(shouldReset && { reset_at: nextMonthReset() }),
    }).eq('user_id', user.id)
  }

  return NextResponse.json({ success: true, count: newCount })
}
