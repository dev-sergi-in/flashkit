import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Tous les champs sont requis.' }, { status: 400 })
    }

    await sendContactEmail({ name, email, subject, message })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[contact] Error:', error)
    return NextResponse.json({ error: 'Erreur lors de l\'envoi du message.' }, { status: 500 })
  }
}