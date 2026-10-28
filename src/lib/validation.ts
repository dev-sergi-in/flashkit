import { z } from 'zod'

export const PropertySchema = z.object({
  bien: z.string().min(3, 'Minimum 3 caractères').max(200),
  surface: z.string().min(1, 'Surface requise').max(50),
  localisation: z.string().min(3, 'Localisation requise').max(200),
  prix: z.string().min(1, 'Prix requis').max(100),
  points_forts: z.string().min(5, 'Décrivez au moins un point fort').max(500),
  ton: z.enum(['Standard', 'Prestige', 'Accessible']),
  chambres: z.string().optional(),
  etage: z.string().optional(),
  annee_construction: z.string().optional(),
})

export type PropertyFormValues = z.infer<typeof PropertySchema>

export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, 1000)
}
