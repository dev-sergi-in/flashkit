import type { GeneratedKit } from '@/types'

export function kitToText(kit: GeneratedKit): string {
  return `=== FlashKit AI — KIT MARKETING ===
Généré le ${new Date().toLocaleDateString('fr-FR')}

--- SCRIPT TIKTOK & REELS ---
Hook : ${kit.tiktok.hook}
Scènes : ${kit.tiktok.scenes}

Script :
${kit.tiktok.script}

CTA : ${kit.tiktok.cta}

--- POST FACEBOOK & INSTAGRAM ---
${kit.facebook.post}

Hashtags : ${kit.facebook.hashtags.join(' ')}

--- ANNONCE WEB & MARKETPLACE ---
Titre : ${kit.web.titre}

${kit.web.resume}

Points clés :
${kit.web.points.map(p => `• ${p}`).join('\n')}

--- EMAIL DE PROSPECTION ---
Objet : ${kit.email.objet}

${kit.email.corps}

--- FICHE COMMERCIALE ---
${kit.fiche.synthese}

Offre : ${kit.fiche.offre}
`
}

export function downloadText(kit: GeneratedKit, filename = 'kit-marketing.txt') {
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
<title>Kit Marketing — FlashKit AI</title>
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
  <h1>FlashKit AI</h1>
  <p>Kit Marketing — ${new Date().toLocaleDateString('fr-FR')}</p>
</div>
<div class="content">
  <div class="section">
    <div class="section-title">Script TikTok & Reels</div>
    <p><span class="label">Hook :</span> ${kit.tiktok.hook}</p>
    <p><span class="label">Scènes :</span> ${kit.tiktok.scenes}</p>
    <p><span class="label">Script :</span> ${kit.tiktok.script.replace(/\n/g, '<br>')}</p>
    <p><span class="label">CTA :</span> ${kit.tiktok.cta}</p>
  </div>
  <div class="section">
    <div class="section-title">Post Facebook & Instagram</div>
    <p>${kit.facebook.post.replace(/\n/g, '<br>')}</p>
    <p><span class="label">Hashtags :</span> ${kit.facebook.hashtags.join(' ')}</p>
  </div>
  <div class="section">
    <div class="section-title">Annonce Web & Marketplace</div>
    <p><span class="label">Titre :</span> ${kit.web.titre}</p>
    <p>${kit.web.resume.replace(/\n/g, '<br>')}</p>
    ${kit.web.points.map(p => `<p>• ${p}</p>`).join('')}
  </div>
  <div class="section">
    <div class="section-title">Email de Prospection</div>
    <p><span class="label">Objet :</span> ${kit.email.objet}</p>
    <p>${kit.email.corps.replace(/\n/g, '<br>')}</p>
  </div>
  <div class="section">
    <div class="section-title">Fiche Commerciale</div>
    <p>${kit.fiche.synthese.replace(/\n/g, '<br>')}</p>
    <p><span class="label">Offre :</span> ${kit.fiche.offre}</p>
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
