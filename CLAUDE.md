# IMMO-PROMPT AI

SaaS B2B de génération de kits marketing immobiliers via l'API Anthropic Claude.

## Stack
- Next.js 14 App Router + TypeScript
- Tailwind CSS (classes directes, pas de composants Shadcn installés manuellement)
- @anthropic-ai/sdk pour l'IA
- Stripe pour les paiements
- Upstash Redis pour le rate limiting
- jspdf + docx pour l'export

## Architecture
- `src/types/index.ts` — tous les types partagés (PropertyInput, GeneratedKit, Plan, etc.)
- `src/lib/anthropic.ts` — client Anthropic + constantes MODEL/MAX_TOKENS
- `src/lib/prompt.ts` — SYSTEM_PROMPT de production + buildUserMessage()
- `src/app/api/generate/route.ts` — route principale de génération avec prompt caching
- `src/lib/stripe.ts` — client Stripe + définition des PLANS
- `src/lib/ratelimit.ts` — rate limiting Upstash (graceful fallback si Redis down)
- `src/lib/quota.ts` — quotas localStorage côté client
- `src/lib/export.ts` — export TXT/PDF/DOCX
- `src/components/PropertyForm.tsx` — formulaire de saisie
- `src/components/ResultsTabs.tsx` — affichage des 4 onglets résultats

## Variables d'environnement requises
Voir `.env.example`

## Plans tarifaires
- Starter : gratuit, 10 générations/mois
- Pro : 29€/mois, illimité
- Agence : 79€/mois, 5 accès
- Enterprise : sur devis, API + marque blanche

## Prompt caching
Le system prompt utilise `cache_control: { type: 'ephemeral' }` pour réduire les coûts API de 90%.

## Sécurité
- Inputs sanitisés dans `src/lib/validation.ts`
- Rate limiting par IP sur /api/generate et /api/export
- Validation Zod sur toutes les routes API
- Webhook Stripe avec vérification de signature
