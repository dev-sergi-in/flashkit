'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Sparkles, ArrowLeft, LogOut, User, Crown, Settings, CreditCard } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase'

interface DashboardNavProps {
  email?: string
  plan?: string
}

export function DashboardNav({ email, plan = 'starter' }: DashboardNavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isPro = plan !== 'starter'

  const handleLogout = async () => {
    const supabase = createSupabaseBrowser()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="border-b border-gray-100 bg-white">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900">FlashKit</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {email && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg">
              <User className="w-3.5 h-3.5" />
              {email}
            </div>
          )}
          {!isPro ? (
            <Link href="/pricing" className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-lg">
              <Crown className="w-3.5 h-3.5" />
              Passer Pro
            </Link>
          ) : (
            <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2.5 py-1.5 rounded-lg capitalize">{plan}</span>
          )}
          <Link href="/dashboard/billing" className={`p-2 rounded-lg transition-colors ${pathname === '/dashboard/billing' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`} title="Abonnement">
            <CreditCard className="w-4 h-4" />
          </Link>
          <Link href="/dashboard/settings" className={`p-2 rounded-lg transition-colors ${pathname === '/dashboard/settings' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`} title="Paramètres">
            <Settings className="w-4 h-4" />
          </Link>
          <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" title="Déconnexion">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  )
}