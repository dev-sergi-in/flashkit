import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createCinetPayCheckout } from '@/lib/stripe'
import { createSupabaseServer } from '@/lib/supabase-server'

const Schema = z.object({
  planId: z.enum(['pro', 'agence']),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planId } = Schema.parse(body)

    const supabase = createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    const url = await createCinetPayCheckout(planId, user?.email)
    return NextResponse.json({ url })
  } catch (error) {
    console.error('[checkout]', error)
    return NextResponse.json({ error: 'Erreur de paiement' }, { status: 500 })
  }
}
