import type { PlanId, QuotaStatus } from '@/types'

const PLAN_LIMITS: Record<PlanId, number | null> = {
  starter: 10,
  pro: null,
  agence: null,
  enterprise: null,
}

const STORAGE_KEY = 'immo_quota'

interface StoredQuota {
  used: number
  plan: PlanId
  reset_at: string
}

function getMonthReset(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 1)
}

export function getQuotaFromStorage(): StoredQuota {
  if (typeof window === 'undefined') {
    return { used: 0, plan: 'starter', reset_at: getMonthReset().toISOString() }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const initial: StoredQuota = { used: 0, plan: 'starter', reset_at: getMonthReset().toISOString() }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      return initial
    }
    const stored: StoredQuota = JSON.parse(raw)
    if (new Date(stored.reset_at) < new Date()) {
      const reset: StoredQuota = { ...stored, used: 0, reset_at: getMonthReset().toISOString() }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reset))
      return reset
    }
    return stored
  } catch {
    return { used: 0, plan: 'starter', reset_at: getMonthReset().toISOString() }
  }
}

export function incrementQuota(): void {
  if (typeof window === 'undefined') return
  const current = getQuotaFromStorage()
  const updated: StoredQuota = { ...current, used: current.used + 1 }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function getQuotaStatus(): QuotaStatus {
  const stored = getQuotaFromStorage()
  const limit = PLAN_LIMITS[stored.plan]
  return {
    used: stored.used,
    limit,
    plan: stored.plan,
    reset_at: new Date(stored.reset_at),
  }
}

export function hasQuotaRemaining(): boolean {
  const status = getQuotaStatus()
  if (status.limit === null) return true
  return status.used < status.limit
}

export function getRemainingCredits(): number | null {
  const status = getQuotaStatus()
  if (status.limit === null) return null
  return Math.max(0, status.limit - status.used)
}

export function setPlan(plan: PlanId): void {
  if (typeof window === 'undefined') return
  const current = getQuotaFromStorage()
  const updated: StoredQuota = { ...current, plan }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}
