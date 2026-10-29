'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Mail, Loader2, CheckCircle, ArrowLeft } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createSupabaseBrowser()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/settings%3Freset%3D1`,
    })
    setLoading(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <Link href="/login" className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour à la connexion
        </Link>
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">FlashKit</span>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Email envoyé !</h2>
            <p className="text-gray-500 text-sm">Vérifiez votre boîte mail et cliquez sur le lien pour réinitialiser votre mot de passe.</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Mot de passe oublié</h1>
            <p className="text-gray-500 text-sm mb-6">Entrez votre email pour recevoir un lien de réinitialisation.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="votre@email.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {error && <p className="text-red-600 text-sm bg-red-50 border border-red-100 px-3 py-2 rounded-xl">{error}</p>}
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Envoyer le lien
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}