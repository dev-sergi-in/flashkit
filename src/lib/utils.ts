import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrix(prix: string): string {
  const num = parseInt(prix.replace(/\D/g, ''), 10)
  if (isNaN(num)) return prix
  return new Intl.NumberFormat('fr-FR').format(num)
}
