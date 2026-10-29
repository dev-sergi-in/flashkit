'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { DashboardNav } from '@/components/DashboardNav'
import { createSupabaseBrowser } from '@/lib/supabase'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

function SettingsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isReset = searchParams.get('reset') === '1'

  const [email, setEmail] = useState('')
  const [plan, setPlan] = useState('starter')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [loadingPass, setLoadingPass] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    document.title = 'Param\u00e8tres \u2014 FlashKit'
    const supabase = createSupabaseBrowser()
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? '')
    })
    fetch('/api/quota').then(r => r.json()).then(d => setPlan(d.plan ?? 'starter')).catch(() => {})
  }, [])

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMsg({ type, text })
    setTimeout(() => setMsg(null), 4000)
  }

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingEmail(true)
    const supabase = createSupabaseBrowser()
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    setLoadingEmail(false)
    if (error) showMsg('error', error.message)
    else showMsg('success', 'Email mis \u00e0 jour\u00a0! V\u00e9rifiez votre nouvelle adresse.')
    setNewEmail('')
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) { showMsg('error', 'Les mots de passe ne correspondent pas'); return }
    if (newPassword.length < 6) { showMsg('error', 'Minimum 6 caract\u00e8res'); return }
    setLoadingPass(true)
    const supabase = createSupabaseBrowser()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setLoadingPass(false)
    if (error) showMsg('error', error.message)
    else {
      showMsg('success', 'Mot de passe mis \u00e0 jour\u00a0!')
      setNewPassword(''); setConfirmPassword('')
      if (isReset) router.replace('/dashboard/settings')
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Supprimer d\u00e9finitivement votre compte\u00a0? Cette action est irr\u00e9versible.')) return
    setLoadingDelete(true)
    const res = await fetch('/api/account/delete', { method: 'DELETE' })
    if (res.ok) {
      const supabase = createSupabaseBrowser()
      await supabase.auth.signOut()
      router.push('/')
    } else {
      showMsg('error', 'Erreur lors de la suppression')
      setLoadingDelete(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav email={email} plan={plan} />
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Param\u00e8tres du compte</h1>

        {msg && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${msg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            {msg.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            {msg.text}
          </div>
        )}

        {isReset && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl text-sm">
            Choisissez un nouveau mot de passe pour votre compte.
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Adresse email</h2>
          <p className="text-sm text-gray-500">Actuelle\u00a0: <span className="font-medium text-gray-700">{email}</span></p>
          <form onSubmit={handleEmailChange} className="flex gap-2">
            <input
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              required
              placeholder="nouvelle@adresse.com"
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" disabled={loadingEmail} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl disabled:opacity-70 flex items-center gap-2">
              {loadingEmail && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Modifier
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">{isReset ? 'Nouveau mot de passe' : 'Changer le mot de passe'}</h2>
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Nouveau mot de passe (min. 6 caract\u00e8res)"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirmer le mot de passe"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" disabled={loadingPass} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl disabled:opacity-70 flex items-center gap-2">
              {loadingPass && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Mettre \u00e0 jour
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-red-100 p-6 space-y-3">
          <h2 className="font-semibold text-red-700">Zone de danger</h2>
          <p className="text-sm text-gray-500">La suppression de votre compte est d\u00e9finitive et irr\u00e9versible.</p>
          <button onClick={handleDeleteAccount} disabled={loadingDelete} className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-xl disabled:opacity-70 flex items-center gap-2">
            {loadingDelete && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return <Suspense><SettingsContent /></Suspense>
}