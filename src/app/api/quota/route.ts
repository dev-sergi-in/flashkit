import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'

export async function GET() {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data } = await supabase
    .from('quotas')
    .select('credits')
    .eq('user_id', user.id)
    .single()

  return NextResponse.json({
    credits: data?.credits ?? 3,
    email: user.email,
  })
}
