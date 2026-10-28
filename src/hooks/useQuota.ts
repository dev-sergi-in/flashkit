'use client'

import { useState, useEffect } from 'react'
import { getQuotaStatus, hasQuotaRemaining, getRemainingCredits, incrementQuota } from '@/lib/quota'
import type { QuotaStatus } from '@/types'

export function useQuota() {
  const [status, setStatus] = useState<QuotaStatus | null>(null)

  useEffect(() => {
    setStatus(getQuotaStatus())
  }, [])

  const consume = () => {
    incrementQuota()
    setStatus(getQuotaStatus())
  }

  return {
    status,
    remaining: getRemainingCredits(),
    canGenerate: status ? hasQuotaRemaining() : true,
    consume,
  }
}
