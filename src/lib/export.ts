import type { GeneratedKit } from '@/types'

export function kitToText(kit: GeneratedKit): string {
  return `=== IMMO-PROMPT AI — KIT MARKETING ===
Généré le ${new Date().toLocaleDateString('fr-FR')}

--- ANNONCE WEB SEO ---
Titre : ${kit.annonce_web.titre_seo}

Description :
${kit.annonce_web.description_longue}

Mots-clés : ${kit.annonce_web.mots_cles.join(', ')}

--- INSTAGRAM ---
Caption :
${kit.social_media.instagram_caption}

Hashtags : ${kit.social_media.hashtags.join(' ')}

--- EMAIL DE PROSPECTION ---
Objet : ${kit.outreach.email_objet}

Corps :
${kit.outreach.email_corps}

--- FICHE VITRINE ---
Titre : ${kit.print.titre_vitrine}

Points forts :
${kit.print.points_forts.map(p => `• ${p}`).join('\n')}
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
<title>Kit Marketing — IMMO-PROMPT AI</title>
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
  <h1>IMMO-PROMPT AI</h1>
  <p>Kit Marketing — ${new Date().toLocaleDateString('fr-FR')}</p>
</div>
<div class="content">
  <div class="section">
    <div class="section-title">Annonce Web SEO</div>
    <p><span class="label">Titre :</span> ${kit.annonce_web.titre_seo}</p>
    <p>${kit.annonce_web.description_longue.replace(/\n/g, '<br>')}</p>
    <p><span class="label">Mots-clés :</span> ${kit.annonce_web.mots_cles.join(', ')}</p>
  </div>
  <div class="section">
    <div class="section-title">Instagram</div>
    <p>${kit.social_media.instagram_caption.replace(/\n/g, '<br>')}</p>
    <p><span class="label">Hashtags :</span> ${kit.social_media.hashtags.join(' ')}</p>
  </div>
  <div class="section">
    <div class="section-title">Email de Prospection</div>
    <p><span class="label">Objet :</span> ${kit.outreach.email_objet}</p>
    <p>${kit.outreach.email_corps.replace(/\n/g, '<br>')}</p>
  </div>
  <div class="section">
    <div class="section-title">Fiche Vitrine</div>
    <p><span class="label">Titre :</span> ${kit.print.titre_vitrine}</p>
    ${kit.print.points_forts.map(p => `<p>• ${p}</p>`).join('')}
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

export async function downloadDOCX(kit: GeneratedKit, filename = 'kit-marketing.docx') {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx')

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({ text: 'IMMO-PROMPT AI — Kit Marketing', heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: `Généré le ${new Date().toLocaleDateString('fr-FR')}`, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: '' }),
        new Paragraph({ text: 'ANNONCE WEB SEO', heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ children: [new TextRun({ text: 'Titre : ', bold: true }), new TextRun(kit.annonce_web.titre_seo)] }),
        new Paragraph({ text: kit.annonce_web.description_longue }),
        new Paragraph({ children: [new TextRun({ text: 'Mots-clés : ', bold: true }), new TextRun(kit.annonce_web.mots_cles.join(', '))] }),
        new Paragraph({ text: '' }),
        new Paragraph({ text: 'INSTAGRAM', heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: kit.social_media.instagram_caption }),
        new Paragraph({ children: [new TextRun({ text: 'Hashtags : ', bold: true }), new TextRun(kit.social_media.hashtags.join(' '))] }),
        new Paragraph({ text: '' }),
        new Paragraph({ text: 'EMAIL DE PROSPECTION', heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ children: [new TextRun({ text: 'Objet : ', bold: true }), new TextRun(kit.outreach.email_objet)] }),
        new Paragraph({ text: kit.outreach.email_corps }),
        new Paragraph({ text: '' }),
        new Paragraph({ text: 'FICHE VITRINE', heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ children: [new TextRun({ text: 'Titre : ', bold: true }), new TextRun(kit.print.titre_vitrine)] }),
        ...kit.print.points_forts.map(p => new Paragraph({ text: `• ${p}` })),
      ],
    }],
  })

  const buffer = await Packer.toBuffer(doc)
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
