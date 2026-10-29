'use client'

interface DomainSelectorProps {
  value: string
  onChange: (domainId: string) => void
}

const domains = [
  { id: 'immobilier', emoji: '🏠', label: 'Immobilier & Terrains' },
  { id: 'ecommerce', emoji: '🛒', label: 'E-commerce & High-Tech' },
  { id: 'automobile', emoji: '🚗', label: 'Automobile & Motos' },
  { id: 'services', emoji: '🔧', label: 'Services & Prestations' },
  { id: 'digital', emoji: '💻', label: 'Formations En Ligne & SaaS' },
  { id: 'restauration_evenements', emoji: '🍽️', label: 'Restauration, Hôtels & Événements' },
  { id: 'beaute_bienetre', emoji: '💅', label: 'Beauté, Cosmétique & Spas' },
  { id: 'materiel_pro', emoji: '🏗️', label: 'Matériel Pro, BTP & Équipements' },
  { id: 'education_ecoles', emoji: '🎓', label: 'Écoles & Formations Présentielles' },
  { id: 'mode_artisanat', emoji: '👗', label: 'Mode, Sur-Mesure & Artisanat' },
  { id: 'sante_parapharmacie', emoji: '💊', label: 'Santé, Parapharmacie & Bio' },
  { id: 'agriculture_agro', emoji: '🌾', label: 'Agriculture, Élevage & Agroalimentaire' },
  { id: 'voyage_logistique', emoji: '✈️', label: 'Voyage, Transport & Transit' },
  { id: 'finance_juridique', emoji: '💰', label: 'Finance, Assurance & Juridique' },
  { id: 'sport_fitness', emoji: '🏋️', label: 'Sport, Fitness & Coaching' },
  { id: 'energie_solaire', emoji: '☀️', label: 'Énergie Solaire & Électricité' },
  { id: 'art_divertissement', emoji: '🎨', label: 'Art, Musique & Entertainment' },
  { id: 'autre_custom', emoji: '⚡', label: 'Autre Activité (Personnalisé)' },
]

export default function DomainSelector({ value, onChange }: DomainSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {domains.map((domain) => {
        const selected = value === domain.id
        return (
          <button
            key={domain.id}
            type="button"
            onClick={() => onChange(domain.id)}
            className={`border rounded-xl p-3 cursor-pointer transition-colors flex flex-col items-center text-center ${
              selected
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-300 text-gray-600'
            }`}
          >
            <span className="text-2xl">{domain.emoji}</span>
            <span className="text-xs mt-1">{domain.label}</span>
          </button>
        )
      })}
    </div>
  )
}
