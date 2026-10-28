import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIdentifier } from '@/lib/ratelimit'

const PROTECTED_ROUTES = ['/api/generate', '/api/export']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  if (!isProtected) return NextResponse.next()

  const identifier = getClientIdentifier(request)

  try {
    const { success, remaining, reset } = await checkRateLimit(identifier)

    if (!success) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez patienter.', code: 'RATE_LIMITED' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      )
    }

    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    return response
  } catch {
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/api/generate', '/api/export', '/api/stripe/checkout'],
}
