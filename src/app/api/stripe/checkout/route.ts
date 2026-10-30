import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createCinetPayCheckout } from '@/lib/stripe'
import { createSupabaseServer } from '@/lib/supabase-server'

const Schema = z.object({
  packId: z.enum(['starter', 'pro', 'agence']),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { packId } = Schema.parse(body)
    const supabase = createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    const url = await createCinetPayCheckout(packId, user?.email, user?.id)
    return NextResponse.json({ url })
  } catch (error) {
    console.error('[checkout]', error)
    return NextResponse.json({ error: 'Erreur de paiement' }, { status: 500 })
  }
}
