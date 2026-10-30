'use client'

import { useState, useEffect, useCallback } from 'react'
import type { GeneratedKit } from '@/types'

interface Generation {
  id: string
  domain: string
  ton: string
  kit: GeneratedKit
  created_at: string
}

interface HistoryPanelProps {
  onReload: (kit: GeneratedKit) => void
  refreshTrigger?: number
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function HistoryPanel({ onReload, refreshTrigger }: HistoryPanelProps) {
  const [open, setOpen] = useState(false)
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(false)

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/history')
      if (res.ok) {
        const data = await res.json()
        setGenerations(data.generations ?? [])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) fetchHistory()
  }, [open, fetchHistory, refreshTrigger])

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2.5">
          <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="font-semibold text-gray-800 text-sm">Historique des générations</span>
          {generations.length > 0 && !open && (
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
              {generations.length}
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <svg className="w-5 h-5 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
          ) : generations.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Aucune génération enregistrée.</p>
          ) : (
            <div className="space-y-2">
              {generations.map(g => (
                <div
                  key={g.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-lg shrink-0">📄</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {g.domain} — {g.ton}
                      </p>
                      <p className="text-xs text-gray-400">{formatDate(g.created_at)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onReload(g.kit)}
                    className="shrink-0 flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold opacity-0 group-hover:opacity-100 transition-opacity bg-blue-50 px-2.5 py-1.5 rounded-lg"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
                    </svg>
                    Recharger
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
