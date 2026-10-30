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

  const [generationsRes, usersRes, transactionsRes] = await Promise.all([
    db.from('generations').select('id, created_at'),
    db.auth.admin.listUsers(),
    db.from('transactions').select('amount_fcfa, status'),
  ])

  const generations = generationsRes.data || []
  const users = usersRes.data?.users || []
  const transactions = (transactionsRes.data || []) as Array<{ amount_fcfa: number; status: string }>

  const now = Date.now()
  const week = 7 * 24 * 60 * 60 * 1000
  const recentGenerations = generations.filter(
    (g: { created_at: string }) => now - new Date(g.created_at).getTime() < week
  ).length

  const revenue_fcfa = transactions
    .filter(t => t.status === 'ACCEPTED')
    .reduce((sum, t) => sum + (t.amount_fcfa || 0), 0)

  return NextResponse.json({
    total_users: users.length,
    total_generations: generations.length,
    generations_last_7_days: recentGenerations,
    revenue_fcfa,
  })
}
