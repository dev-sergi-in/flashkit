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

export async function downloadPDF(kit: GeneratedKit, filename = 'kit-marketing.pdf') {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const blue: [number, number, number] = [37, 99, 235]
  const dark: [number, number, number] = [17, 24, 39]

  let y = 20
  const margin = 20
  const pageWidth = 210
  const contentWidth = pageWidth - 2 * margin

  const addSection = (title: string, content: string) => {
    if (y > 260) { doc.addPage(); y = 20 }
    doc.setFillColor(...blue)
    doc.rect(margin, y - 4, contentWidth, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(title, margin + 3, y + 1)
    y += 10

    doc.setTextColor(...dark)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(content, contentWidth)
    lines.forEach((line: string) => {
      if (y > 280) { doc.addPage(); y = 20 }
      doc.text(line, margin, y)
      y += 5
    })
    y += 6
  }

  doc.setFillColor(...blue)
  doc.rect(0, 0, 210, 30, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('IMMO-PROMPT AI', margin, 15)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`Kit Marketing — ${new Date().toLocaleDateString('fr-FR')}`, margin, 22)
  y = 40

  addSection('ANNONCE WEB SEO', `Titre : ${kit.annonce_web.titre_seo}\n\n${kit.annonce_web.description_longue}\n\nMots-clés : ${kit.annonce_web.mots_cles.join(', ')}`)
  addSection('INSTAGRAM', `${kit.social_media.instagram_caption}\n\n${kit.social_media.hashtags.join(' ')}`)
  addSection('EMAIL DE PROSPECTION', `Objet : ${kit.outreach.email_objet}\n\n${kit.outreach.email_corps}`)
  addSection('FICHE VITRINE', `Titre : ${kit.print.titre_vitrine}\n\n${kit.print.points_forts.map(p => `• ${p}`).join('\n')}`)

  doc.save(filename)
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
