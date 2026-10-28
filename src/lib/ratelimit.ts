import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let redis: Redis | null = null
let ratelimit: Ratelimit | null = null

function getRedis(): Redis {
  if (!redis) {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error('Upstash Redis non configuré')
    }
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
  return redis
}

function getRatelimit(): Ratelimit {
  if (!ratelimit) {
    ratelimit = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(10, '60 s'),
      analytics: true,
      prefix: 'immo_rl',
    })
  }
  return ratelimit
}

export async function checkRateLimit(identifier: string): Promise<{
  success: boolean
  remaining: number
  reset: number
}> {
  try {
    const rl = getRatelimit()
    const result = await rl.limit(identifier)
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
    }
  } catch (error) {
    console.warn('[ratelimit] Redis unavailable, allowing request:', error)
    return { success: true, remaining: 9, reset: Date.now() + 60000 }
  }
}

export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  return `ip:${ip}`
}
