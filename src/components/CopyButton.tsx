'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  text: string
  className?: string
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200',
        copied
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-600',
        className
      )}
    >
      {copied ? (
        <><Check className="w-3.5 h-3.5" />Copié !</>
      ) : (
        <><Copy className="w-3.5 h-3.5" />Copier</>
      )}
    </button>
  )
}
