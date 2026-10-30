'use client'

import { useState } from 'react'
import type { GeneratedKit } from '@/types'

interface ResultsTabsProps {
  kit: GeneratedKit
}

type TabId = 'tiktok' | 'facebook' | 'web' | 'email' | 'fiche'

const TABS: { id: TabId; label: string; icon: string; activeClass: string }[] = [
  { id: 'tiktok', label: 'TikTok & Reels', icon: '🎵', activeClass: 'bg-white text-rose-600 shadow-sm' },
  { id: 'facebook', label: 'Facebook & Instagram', icon: '📘', activeClass: 'bg-white text-blue-600 shadow-sm' },
  { id: 'web', label: 'Annonce Web', icon: '🌐', activeClass: 'bg-white text-green-600 shadow-sm' },
  { id: 'email', label: 'Email Pro', icon: '✉️', activeClass: 'bg-white text-purple-600 shadow-sm' },
  { id: 'fiche', label: 'Fiche Commerciale', icon: '📋', activeClass: 'bg-white text-orange-600 shadow-sm' },
]

function CopyBtn({ getText }: { getText: () => string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
    >
      {copied ? (
        <span className="animate-scale-in inline-block">Copié ✓</span>
      ) : (
        'Copier'
      )}
    </button>
  )
}

export function ResultsTabs({ kit }: ResultsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('tiktok')
  const [contentKey, setContentKey] = useState(0)

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId)
    setContentKey(k => k + 1)
  }

  return (
    <div>
      <div className="animate-fade-in flex gap-1 bg-gray-100 p-1 rounded-xl mb-4 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex-shrink-0 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-[1.02] ${
              activeTab === tab.id ? tab.activeClass : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className={activeTab === tab.id ? 'animate-bounce-soft' : ''}>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div key={contentKey} className="animate-fade-up">
        {activeTab === 'tiktok' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between animate-fade-up delay-100">
              <span className="text-rose-600 font-semibold text-sm flex items-center gap-1.5">🎵 TikTok & Reels</span>
              <CopyBtn getText={() => kit.tiktok.hook + '\n\n' + kit.tiktok.script + '\n\n' + kit.tiktok.cta} />
            </div>
            <div className="space-y-3">
              <div className="bg-rose-50 rounded-xl p-4 animate-fade-up delay-100">
                <p className="text-xs text-rose-500 font-semibold uppercase tracking-wide mb-1">Hook</p>
                <p className="font-bold text-gray-900 text-sm">{kit.tiktok.hook}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 animate-fade-up delay-200">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Scènes</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{kit.tiktok.scenes}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 animate-fade-up delay-200">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Script</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{kit.tiktok.script}</p>
              </div>
              <div className="bg-rose-50 rounded-xl p-4 animate-fade-up delay-300">
                <p className="text-xs text-rose-500 font-semibold uppercase tracking-wide mb-1">CTA</p>
                <p className="text-sm font-medium text-gray-800">{kit.tiktok.cta}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'facebook' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between animate-fade-up delay-100">
              <span className="text-blue-600 font-semibold text-sm flex items-center gap-1.5">📘 Facebook & Instagram</span>
              <CopyBtn getText={() => kit.facebook.post + '\n\n' + kit.facebook.hashtags.join(' ')} />
            </div>
            <div className="bg-blue-50 rounded-xl p-4 animate-fade-up delay-200">
              <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{kit.facebook.post}</p>
            </div>
            <div className="animate-fade-up delay-300">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Hashtags</p>
              <div className="flex flex-wrap gap-1.5">
                {kit.facebook.hashtags.map((tag, i) => (
                  <span key={i} className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'web' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between animate-fade-up delay-100">
              <span className="text-green-600 font-semibold text-sm flex items-center gap-1.5">🌐 Annonce Web</span>
              <CopyBtn getText={() => kit.web.titre + '\n' + kit.web.resume + '\n' + kit.web.points.map(p => '• ' + p).join('\n')} />
            </div>
            <div className="bg-green-50 rounded-xl p-4 animate-fade-up delay-100">
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-1">Titre</p>
              <p className="font-bold text-gray-900">{kit.web.titre}</p>
            </div>
            <div className="animate-fade-up delay-200">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Résumé</p>
              <p className="text-sm text-gray-700 leading-relaxed">{kit.web.resume}</p>
            </div>
            <div className="animate-fade-up delay-300">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Points clés</p>
              <ul className="space-y-1.5">
                {kit.web.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 mt-0.5 shrink-0">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between animate-fade-up delay-100">
              <span className="text-purple-600 font-semibold text-sm flex items-center gap-1.5">✉️ Email Pro</span>
              <CopyBtn getText={() => 'Objet: ' + kit.email.objet + '\n\n' + kit.email.corps} />
            </div>
            <div className="flex items-center gap-2 animate-fade-up delay-200">
              <span className="text-xs text-purple-600 font-semibold uppercase tracking-wide">Objet :</span>
              <span className="bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full">{kit.email.objet}</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 animate-fade-up delay-300">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Corps de l'email</p>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">{kit.email.corps}</pre>
            </div>
          </div>
        )}

        {activeTab === 'fiche' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between animate-fade-up delay-100">
              <span className="text-orange-600 font-semibold text-sm flex items-center gap-1.5">📋 Fiche Commerciale</span>
              <CopyBtn getText={() => kit.fiche.synthese + '\n\n' + kit.fiche.offre} />
            </div>
            <div className="bg-orange-50 rounded-xl p-4 animate-fade-up delay-200">
              <p className="text-xs text-orange-500 font-semibold uppercase tracking-wide mb-2">Synthèse</p>
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{kit.fiche.synthese}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 animate-fade-up delay-300">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Offre</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{kit.fiche.offre}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
