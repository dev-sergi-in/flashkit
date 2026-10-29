import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM ?? 'FlashKit <onboarding@resend.dev>'
const CONTACT_TO = process.env.RESEND_CONTACT_TO ?? 'internetmail10000@gmail.com'

export async function sendContactEmail({ name, email, subject, message }: {
  name: string; email: string; subject: string; message: string
}) {
  return resend.emails.send({
    from: FROM,
    to: CONTACT_TO,
    subject: `[Contact] ${subject}`,
    html: `<p><strong>De :</strong> ${name} (${email})</p><p><strong>Sujet :</strong> ${subject}</p><p><strong>Message :</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
    reply_to: email,
  })
}

export async function sendWelcomeEmail(email: string) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Bienvenue sur FlashKit !',
    html: '<h2>Bienvenue sur FlashKit !</h2><p>Votre compte est créé. Vous avez <strong>10 générations gratuites</strong> pour commencer.</p><p><a href="https://immo-prompt-ai.vercel.app/dashboard">Accéder au dashboard →</a></p>',
  })
}