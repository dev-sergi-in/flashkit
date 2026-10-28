import type { ReactNode } from 'react'
import { CopyButton } from './CopyButton'
import { cn } from '@/lib/utils'

interface ResultCardProps {
  title: string
  icon: ReactNode
  copyText: string
  className?: string
  children: ReactNode
}

export function ResultCard({ title, icon, copyText, className, children }: ResultCardProps) {
  return (
    <div className={cn('bg-white border border-gray-100 rounded-xl p-5 shadow-sm', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-blue-600">{icon}</span>
          <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        </div>
        <CopyButton text={copyText} />
      </div>
      <div className="space-y-3 text-sm text-gray-700">
        {children}
      </div>
    </div>
  )
}
