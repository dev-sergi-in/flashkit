'use client'

import { useState } from 'react'
import { MessageCircle, Share2, Globe } from 'lucide-react'
import type { GeneratedKit } from '@/types'
import { CopyButton } from './CopyButton'
import { cn } from '@/lib/utils'

interface ResultsTabsProps {
  kit: GeneratedKit
}

type TabId = 'whatsapp' | 'social' | 'portail'

const TABS = [
  { id: 'whatsapp' as TabId, label: 'WhatsApp', icon: <MessageCircle className="w-4 h-4" />, color: 'text-green-600' },
  { id: 'social' as TabId, label: 'Réseaux Sociaux', icon: <Share2 className="w-4 h-4" />, color: 'text-purple-600' },
  { id: 'portail' as TabId, label: 'Portail Web', icon: <Globe className="w-4 h-4" />, color: 'text-blue-600' },
]

export function ResultsTabs({ kit }: ResultsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('whatsapp')

  return (
    <div>
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-4">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all',
              activeTab === tab.id ? 'bg-white shadow-sm ' + tab.color : 'text-gray-500 hover:text-gray-700'
            )}>
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'whatsapp' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
              <MessageCircle className="w-4 h-4" /> Format WhatsApp
            </div>
            <CopyButton text={kit.whatsapp.texte} />
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{kit.whatsapp.texte}</p>
          </div>
        </div>
      )}

      {activeTab === 'social' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm">
              <Share2 className="w-4 h-4" /> Facebook / Instagram
            </div>
            <CopyButton text={kit.social.caption + '\n\n' + kit.social.hashtags.join(' ')} />
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{kit.social.caption}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-2">Hashtags</p>
            <div className="flex flex-wrap gap-1.5">
              {kit.social.hashtags.map((tag, i) => (
                <span key={i} className="text-purple-600 text-xs font-medium">
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'portail' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
              <Globe className="w-4 h-4" /> Portail Web
            </div>
            <CopyButton text={kit.portail.titre + '\n\n' + kit.portail.description} />
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-blue-500 font-medium mb-1">Titre de l'annonce</p>
            <p className="font-bold text-gray-900">{kit.portail.titre}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Description</p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{kit.portail.description}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-2">Mots-clés SEO</p>
            <div className="flex flex-wrap gap-2">
              {kit.portail.mots_cles.map((kw, i) => (
                <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{kw}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
