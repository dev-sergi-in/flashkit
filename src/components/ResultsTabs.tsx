'use client'

import { useState } from 'react'
import { Globe, Instagram, Mail, Tag } from 'lucide-react'
import type { GeneratedKit } from '@/types'
import { ResultCard } from './ResultCard'
import { cn } from '@/lib/utils'

interface ResultsTabsProps {
  kit: GeneratedKit
}

type TabId = 'web' | 'instagram' | 'email' | 'print'

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'web', label: 'Annonce Web', icon: <Globe className="w-4 h-4" /> },
  { id: 'instagram', label: 'Instagram', icon: <Instagram className="w-4 h-4" /> },
  { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
  { id: 'print', label: 'Vitrine', icon: <Tag className="w-4 h-4" /> },
]

export function ResultsTabs({ kit }: ResultsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('web')

  const webText = `${kit.annonce_web.titre_seo}\n\n${kit.annonce_web.description_longue}\n\nMots-clés: ${kit.annonce_web.mots_cles.join(', ')}`
  const igText = `${kit.social_media.instagram_caption}\n\n${kit.social_media.hashtags.join(' ')}`
  const emailText = `Objet: ${kit.outreach.email_objet}\n\n${kit.outreach.email_corps}`
  const printText = `${kit.print.titre_vitrine}\n\n${kit.print.points_forts.map(p => `• ${p}`).join('\n')}`

  return (
    <div className="animate-fade-in">
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-4">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200',
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'web' && (
        <ResultCard title="Annonce Web SEO" icon={<Globe className="w-4 h-4" />} copyText={webText}>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-blue-500 font-medium mb-1">Titre SEO</p>
            <p className="font-semibold text-gray-900">{kit.annonce_web.titre_seo}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Description</p>
            <p className="whitespace-pre-wrap leading-relaxed">{kit.annonce_web.description_longue}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-2">Mots-clés</p>
            <div className="flex flex-wrap gap-2">
              {kit.annonce_web.mots_cles.map((kw, i) => (
                <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </ResultCard>
      )}

      {activeTab === 'instagram' && (
        <ResultCard title="Caption Instagram" icon={<Instagram className="w-4 h-4" />} copyText={igText}>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
            <p className="whitespace-pre-wrap leading-relaxed">{kit.social_media.instagram_caption}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-2">Hashtags</p>
            <div className="flex flex-wrap gap-1.5">
              {kit.social_media.hashtags.map((tag, i) => (
                <span key={i} className="text-blue-600 text-xs font-medium">
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          </div>
        </ResultCard>
      )}

      {activeTab === 'email' && (
        <ResultCard title="Email de Prospection" icon={<Mail className="w-4 h-4" />} copyText={emailText}>
          <div className="bg-amber-50 rounded-lg p-3">
            <p className="text-xs text-amber-600 font-medium mb-1">Objet de l'email</p>
            <p className="font-semibold text-gray-900">{kit.outreach.email_objet}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Corps de l'email</p>
            <p className="whitespace-pre-wrap leading-relaxed">{kit.outreach.email_corps}</p>
          </div>
        </ResultCard>
      )}

      {activeTab === 'print' && (
        <ResultCard title="Fiche Vitrine" icon={<Tag className="w-4 h-4" />} copyText={printText}>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-green-600 font-medium mb-1">Titre Vitrine</p>
            <p className="font-bold text-gray-900 text-base">{kit.print.titre_vitrine}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-2">Points forts</p>
            <ul className="space-y-2">
              {kit.print.points_forts.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </ResultCard>
      )}
    </div>
  )
}
