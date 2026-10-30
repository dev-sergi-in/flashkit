import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServer } from '@/lib/supabase-server'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sergeakakpo22@gmail.com'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adminClient(): any {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const db = adminClient()

  const [usersRes, quotasRes, gensRes] = await Promise.all([
    db.auth.admin.listUsers(),
    db.from('quotas').select('user_id, plan, count, credits, reset_at'),
    db.from('generations').select('user_id, created_at').order('created_at', { ascending: false }),
  ])

  const quotaMap = new Map<string, { plan: string; count: number; credits: number; reset_at: string }>()
  for (const q of (quotasRes.data || [])) {
    quotaMap.set(q.user_id, { plan: q.plan ?? 'starter', count: q.count ?? 0, credits: q.credits ?? 0, reset_at: q.reset_at })
  }

  const genCountMap = new Map<string, number>()
  const lastGenMap = new Map<string, string>()
  for (const g of (gensRes.data || [])) {
    genCountMap.set(g.user_id, (genCountMap.get(g.user_id) || 0) + 1)
    if (!lastGenMap.has(g.user_id)) lastGenMap.set(g.user_id, g.created_at)
  }

  const result = (usersRes.data?.users || []).map((u: { id: string; email: string; created_at: string }) => {
    const quota = quotaMap.get(u.id)
    return {
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      plan: quota?.plan ?? 'starter',
      count: quota?.count ?? 0,
      credits: quota?.credits ?? 0,
      reset_at: quota?.reset_at ?? null,
      total_generations: genCountMap.get(u.id) ?? 0,
      last_generation: lastGenMap.get(u.id) ?? null,
    }
  })

  return NextResponse.json({ users: result })
}
