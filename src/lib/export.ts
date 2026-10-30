import type { GeneratedKit } from '@/types'

export function kitToText(kit: GeneratedKit): string {
  return `=== Flashkit AI — ANNONCES IMMOBILIÈRES ===
Généré le ${new Date().toLocaleDateString('fr-FR')}

--- WHATSAPP ---
${kit.whatsapp.texte}

--- RÉSEAUX SOCIAUX ---
${kit.social.caption}

Hashtags : ${kit.social.hashtags.join(' ')}

--- PORTAIL IMMOBILIER ---
Titre : ${kit.portail.titre}

${kit.portail.description}

Mots-clés : ${kit.portail.mots_cles.join(', ')}
`
}

export function downloadText(kit: GeneratedKit, filename = 'annonces-immo.txt') {
  const text = kitToText(kit)
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadPDF(kit: GeneratedKit) {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Annonces Immobilières — Flashkit AI</title>
<style>
  body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #111827; }
  .header { background: #2563eb; color: white; padding: 20px 30px; }
  .header h1 { margin: 0; font-size: 22px; }
  .header p { margin: 4px 0 0; font-size: 12px; opacity: 0.85; }
  .content { padding: 24px 30px; }
  .section { margin-bottom: 24px; page-break-inside: avoid; }
  .section-title { background: #2563eb; color: white; padding: 6px 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; }
  .label { font-weight: bold; font-size: 11px; }
  p { margin: 4px 0; font-size: 11px; line-height: 1.6; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="header">
  <h1>Flashkit AI</h1>
  <p>Annonces Immobilières — ${new Date().toLocaleDateString('fr-FR')}</p>
</div>
<div class="content">
  <div class="section">
    <div class="section-title">WhatsApp</div>
    <p>${kit.whatsapp.texte.replace(/\n/g, '<br>')}</p>
  </div>
  <div class="section">
    <div class="section-title">Réseaux Sociaux</div>
    <p>${kit.social.caption.replace(/\n/g, '<br>')}</p>
    <p><span class="label">Hashtags :</span> ${kit.social.hashtags.join(' ')}</p>
  </div>
  <div class="section">
    <div class="section-title">Portail Immobilier</div>
    <p><span class="label">Titre :</span> ${kit.portail.titre}</p>
    <p>${kit.portail.description.replace(/\n/g, '<br>')}</p>
    <p><span class="label">Mots-clés :</span> ${kit.portail.mots_cles.join(', ')}</p>
  </div>
</div>
</body>
</html>`

  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => { win.print() }, 300)
}
