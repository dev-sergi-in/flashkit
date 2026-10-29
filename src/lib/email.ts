import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail({ name, email, subject, message }: {
  name: string; email: string; subject: string; message: string
}) {
  return resend.emails.send({
    from: 'FlashKit <noreply@flashkit.app>',
    to: 'contact@flashkit.app',
    subject: `[Contact] ${subject}`,
    html: `<p><strong>De :</strong> ${name} (${email})</p><p><strong>Sujet :</strong> ${subject}</p><p><strong>Message :</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
    reply_to: email,
  })
}

export async function sendWelcomeEmail(email: string) {
  return resend.emails.send({
    from: 'FlashKit <noreply@flashkit.app>',
    to: email,
    subject: 'Bienvenue sur FlashKit !',
    html: '<h2>Bienvenue sur FlashKit !</h2><p>Votre compte est créé. Vous avez <strong>10 générations gratuites</strong> pour commencer.</p><p><a href="https://immo-prompt-ai.vercel.app/dashboard">Accéder au dashboard</a></p>',
  })
}