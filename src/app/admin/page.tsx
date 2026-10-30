'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Sparkles, TrendingUp, Crown, LogOut, RefreshCw, Gem, Banknote } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase'

interface User {
  id: string
  email: string
  created_at: string
  plan: string
  count: number
  total_generations: number
  last_generation: string | null
  credits: number
}

interface Stats {
  total_users: number
  total_generations: number
  generations_last_7_days: number
  plans: { starter: number; pro: number; agence: number; enterprise: number }
  revenue_fcfa: number
}

const PLAN_COLORS: Record<string, string> = {
  starter: 'bg-gray-100 text-gray-700',
  pro: 'bg-blue-100 text-blue-700',
  agence: 'bg-purple-100 text-purple-700',
  enterprise: 'bg-yellow-100 text-yellow-700',
}

const PLANS = ['starter', 'pro', 'agence', 'enterprise']

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  // Credits adjustment state
  const [adjustingUser, setAdjustingUser] = useState<string | null>(null)
  const [adjustDelta, setAdjustDelta] = useState('')
  const [adjustReason, setAdjustReason] = useState('')
  const [adjusting, setAdjusting] = useState(false)

  const router = useRouter()

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [sRes, uRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users'),
      ])

      if (sRes.status === 403) {
        setError('Accès refusé — vous n\'êtes pas administrateur.')
        setLoading(false)
        return
      }

      const sData = await sRes.json()
      const uData = await uRes.json()
      setStats(sData)
      setUsers(uData.users || [])
    } catch {
      setError('Erreur de chargement.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const changePlan = async (userId: string, plan: string) => {
    setUpdating(userId)
    try {
      await fetch(`/api/admin/users/${userId}/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, plan, count: 0 } : u))
    } finally {
      setUpdating(null)
    }
  }

  const handleAdjustCredits = async (userId: string) => {
    const delta = parseInt(adjustDelta, 10)
    if (isNaN(delta) || adjustReason.trim() === '') return
    setAdjusting(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}/credits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta, reason: adjustReason.trim() }),
      })
      if (res.ok) {
        setUsers(prev => prev.map(u =>
          u.id === userId ? { ...u, credits: Math.max(0, u.credits + delta) } : u
        ))
        setAdjustingUser(null)
        setAdjustDelta('')
        setAdjustReason('')
      }
    } finally {
      setAdjusting(false)
    }
  }

  const handleLogout = async () => {
    await createSupabaseBrowser().auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900">FlashKit AI</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full ml-1">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={load} className="text-gray-400 hover:text-gray-600" title="Actualiser">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600" title="Déconnexion">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">{error}</div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400">Chargement...</div>
        ) : (
          <>
            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                <StatCard icon={<Users className="w-5 h-5 text-blue-600" />} label="Utilisateurs" value={stats.total_users} />
                <StatCard icon={<Sparkles className="w-5 h-5 text-purple-600" />} label="Générations totales" value={stats.total_generations} />
                <StatCard icon={<TrendingUp className="w-5 h-5 text-green-600" />} label="7 derniers jours" value={stats.generations_last_7_days} />
                <StatCard icon={<Crown className="w-5 h-5 text-yellow-600" />} label="Abonnés Pro+" value={stats.plans.pro + stats.plans.agence + stats.plans.enterprise} />
                <StatCard icon={<Gem className="w-5 h-5 text-indigo-600" />} label="Crédits vendus" value={stats.total_generations} />
                <StatCard
                  icon={<Banknote className="w-5 h-5 text-emerald-600" />}
                  label="Revenus (FCFA)"
                  value={stats.revenue_fcfa}
                  format="currency"
                />
              </div>
            )}

            {/* Plans répartition */}
            {stats && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <h2 className="font-semibold text-gray-900 mb-4">Répartition des plans</h2>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(stats.plans).map(([plan, count]) => (
                    <div key={plan} className={`px-4 py-2 rounded-xl text-sm font-medium ${PLAN_COLORS[plan]}`}>
                      {plan} — {count} utilisateur{count > 1 ? 's' : ''}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Table utilisateurs */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Utilisateurs ({users.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-gray-500 font-medium">Email</th>
                      <th className="text-left px-6 py-3 text-gray-500 font-medium">Plan</th>
                      <th className="text-left px-6 py-3 text-gray-500 font-medium">Générations</th>
                      <th className="text-left px-6 py-3 text-gray-500 font-medium">Crédits</th>
                      <th className="text-left px-6 py-3 text-gray-500 font-medium">Dernière activité</th>
                      <th className="text-left px-6 py-3 text-gray-500 font-medium">Changer plan</th>
                      <th className="text-left px-6 py-3 text-gray-500 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map(u => (
                      <>
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-gray-900 font-medium">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${PLAN_COLORS[u.plan] || PLAN_COLORS.starter}`}>
                              {u.plan}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{u.total_generations}</td>
                          <td className="px-6 py-4">
                            <span className="flex items-center gap-1 text-gray-700 font-medium">
                              <Gem className="w-3.5 h-3.5 text-indigo-500" />
                              {u.credits ?? 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-xs">
                            {u.last_generation
                              ? new Date(u.last_generation).toLocaleDateString('fr-FR')
                              : '—'}
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={u.plan}
                              disabled={updating === u.id}
                              onChange={e => changePlan(u.id, e.target.value)}
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white disabled:opacity-50"
                            >
                              {PLANS.map(p => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => {
                                if (adjustingUser === u.id) {
                                  setAdjustingUser(null)
                                  setAdjustDelta('')
                                  setAdjustReason('')
                                } else {
                                  setAdjustingUser(u.id)
                                  setAdjustDelta('')
                                  setAdjustReason('')
                                }
                              }}
                              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium border border-indigo-200 px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                            >
                              Ajuster crédits
                            </button>
                          </td>
                        </tr>
                        {adjustingUser === u.id && (
                          <tr key={`${u.id}-adjust`} className="bg-indigo-50">
                            <td colSpan={7} className="px-6 py-4">
                              <div className="flex items-end gap-3 flex-wrap">
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Delta (positif ou négatif)</label>
                                  <input
                                    type="number"
                                    value={adjustDelta}
                                    onChange={e => setAdjustDelta(e.target.value)}
                                    placeholder="ex: 10 ou -5"
                                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 w-32 bg-white"
                                  />
                                </div>
                                <div className="flex-1 min-w-48">
                                  <label className="block text-xs text-gray-500 mb-1">Raison</label>
                                  <textarea
                                    value={adjustReason}
                                    onChange={e => setAdjustReason(e.target.value)}
                                    placeholder="Motif de l'ajustement..."
                                    rows={1}
                                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 w-full bg-white resize-none"
                                  />
                                </div>
                                <button
                                  onClick={() => handleAdjustCredits(u.id)}
                                  disabled={adjusting || adjustDelta === '' || adjustReason.trim() === ''}
                                  className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-4 py-1.5 rounded-lg transition-colors"
                                >
                                  {adjusting ? 'Envoi…' : 'Valider'}
                                </button>
                                <button
                                  onClick={() => { setAdjustingUser(null); setAdjustDelta(''); setAdjustReason('') }}
                                  className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5"
                                >
                                  Annuler
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="text-center py-12 text-gray-400">Aucun utilisateur</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  format,
}: {
  icon: React.ReactNode
  label: string
  value: number
  format?: 'currency'
}) {
  const display = format === 'currency'
    ? value.toLocaleString('fr-FR') + ' FCFA'
    : value.toLocaleString('fr-FR')

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-3">{icon}<span className="text-sm text-gray-500">{label}</span></div>
      <p className="text-2xl font-bold text-gray-900 break-all">{display}</p>
    </div>
  )
}
