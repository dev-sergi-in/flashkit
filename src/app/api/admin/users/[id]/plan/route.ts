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

function nextMonthReset() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()
}

const Schema = z.object({
  plan: z.enum(['starter', 'pro', 'agence', 'enterprise']),
})

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const body = await request.json()
  const { plan } = Schema.parse(body)
  const userId = params.id

  const db = adminClient()

  const { data: existing } = await db
    .from('quotas')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (existing) {
    await db.from('quotas')
      .update({ plan, count: 0, reset_at: nextMonthReset() })
      .eq('user_id', userId)
  } else {
    await db.from('quotas').insert({
      user_id: userId,
      plan,
      count: 0,
      reset_at: nextMonthReset(),
    })
  }

  return NextResponse.json({ success: true, plan })
}
