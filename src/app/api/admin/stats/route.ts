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

  const [quotasRes, generationsRes, usersRes] = await Promise.all([
    db.from('quotas').select('plan, count'),
    db.from('generations').select('id, created_at'),
    db.auth.admin.listUsers(),
  ])

  const quotas = quotasRes.data || []
  const generations = generationsRes.data || []
  const users = usersRes.data?.users || []

  const planCounts = { starter: 0, pro: 0, agence: 0, enterprise: 0 }
  for (const q of quotas) {
    const p = q.plan as keyof typeof planCounts
    if (p in planCounts) planCounts[p]++
  }

  // Générations des 7 derniers jours
  const now = Date.now()
  const week = 7 * 24 * 60 * 60 * 1000
  const recentGenerations = generations.filter(
    (g: { created_at: string }) => now - new Date(g.created_at).getTime() < week
  ).length

  return NextResponse.json({
    total_users: users.length,
    total_generations: generations.length,
    generations_last_7_days: recentGenerations,
    plans: planCounts,
  })
}
