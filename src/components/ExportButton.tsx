'use client'

import { useState } from 'react'
import { Download, FileText, FileDown, Loader2 } from 'lucide-react'
import type { GeneratedKit } from '@/types'
import { downloadText, downloadPDF, downloadDOCX } from '@/lib/export'

interface ExportButtonProps {
  kit: GeneratedKit
  isPro?: boolean
}

export function ExportButton({ kit, isPro = false }: ExportButtonProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const handleExport = async (format: 'txt' | 'pdf' | 'docx') => {
    if ((format === 'pdf' || format === 'docx') && !isPro) {
      alert('Export PDF et Word disponibles sur le plan Pro ou supérieur.')
      return
    }
    setLoading(format)
    try {
      if (format === 'txt') downloadText(kit)
      else if (format === 'pdf') await downloadPDF(kit)
      else await downloadDOCX(kit)
    } finally {
      setLoading(null)
      setOpen(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
      >
        <Download className="w-3.5 h-3.5" />
        Exporter
      </button>

      {open && (
        <div className="absolute right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-10 py-1 min-w-36">
          {[
            { format: 'txt' as const, label: '.TXT', icon: FileText, free: true },
            { format: 'pdf' as const, label: '.PDF', icon: FileDown, free: false },
            { format: 'docx' as const, label: '.DOCX', icon: FileDown, free: false },
          ].map(({ format, label, icon: Icon, free }) => (
            <button
              key={format}
              onClick={() => handleExport(format)}
              disabled={loading !== null}
              className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 text-left"
            >
              <span className="flex items-center gap-2 text-gray-700">
                {loading === format ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
                {label}
              </span>
              {!free && !isPro && (
                <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-medium">Pro</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
