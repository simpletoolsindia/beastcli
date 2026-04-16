/**
 * Rate Limiting Configuration for API Providers
 *
 * NVIDIA NIM has strict rate limits:
 * - 40 RPM (Requests Per Minute) for most models
 * - 10 RPM for larger models like nemotron
 *
 * Environment variables:
 * - NVIDIA_RPM_LIMIT: Override the default RPM limit (default: 40)
 * - NVIDIA_MAX_RETRIES: Max retries on rate limit (default: 3)
 * - NVIDIA_RETRY_DELAY_MS: Base delay between retries (default: 2000)
 * - NVIDIA_BACKOFF_MULTIPLIER: Exponential backoff multiplier (default: 2)
 */

import { isEnvTruthy } from '../envUtils.js'

export interface RateLimitConfig {
  /** Requests per minute limit */
  rpmLimit: number
  /** Requests per second (calculated from RPM) */
  rpsLimit: number
  /** Maximum retries on rate limit errors */
  maxRetries: number
  /** Base delay in ms for retries */
  retryDelayMs: number
  /** Exponential backoff multiplier */
  backoffMultiplier: number
  /** Whether to enable adaptive batching */
  enableBatching: boolean
  /** Batch size for adaptive batching */
  batchSize: number
}

// Default rate limits per provider
const DEFAULT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  // NVIDIA NIM - 40 RPM limit
  'nvidia-nim': {
    rpmLimit: 40,
    rpsLimit: 40 / 60, // ~0.67 req/sec
    maxRetries: 5,
    retryDelayMs: 2000,
    backoffMultiplier: 2,
    enableBatching: true,
    batchSize: 1, // NVIDIA prefers single requests
  },
  'nvidia': {
    rpmLimit: 40,
    rpsLimit: 40 / 60,
    maxRetries: 5,
    retryDelayMs: 2000,
    backoffMultiplier: 2,
    enableBatching: true,
    batchSize: 1,
  },
  // OpenAI - 500 RPM for most tiers
  'openai': {
    rpmLimit: 500,
    rpsLimit: 500 / 60,
    maxRetries: 3,
    retryDelayMs: 1000,
    backoffMultiplier: 2,
    enableBatching: false,
    batchSize: 1,
  },
  // Ollama - local, higher limits
  'ollama': {
    rpmLimit: 1000,
    rpsLimit: 1000 / 60,
    maxRetries: 2,
    retryDelayMs: 500,
    backoffMultiplier: 1.5,
    enableBatching: false,
    batchSize: 1,
  },
  // OpenRouter - varies by tier
  'openrouter': {
    rpmLimit: 60,
    rpsLimit: 60 / 60,
    maxRetries: 3,
    retryDelayMs: 1500,
    backoffMultiplier: 2,
    enableBatching: true,
    batchSize: 2,
  },
  // Gemini - 60 RPM
  'gemini': {
    rpmLimit: 60,
    rpsLimit: 60 / 60,
    maxRetries: 3,
    retryDelayMs: 1500,
    backoffMultiplier: 2,
    enableBatching: false,
    batchSize: 1,
  },
  // Codex - 30 RPM
  'codex': {
    rpmLimit: 30,
    rpsLimit: 30 / 60,
    maxRetries: 4,
    retryDelayMs: 2500,
    backoffMultiplier: 2,
    enableBatching: true,
    batchSize: 1,
  },
  // Default for unknown providers
  'default': {
    rpmLimit: 60,
    rpsLimit: 60 / 60,
    maxRetries: 3,
    retryDelayMs: 1500,
    backoffMultiplier: 2,
    enableBatching: false,
    batchSize: 1,
  },
}

/**
 * Get rate limit configuration for a provider.
 */
export function getRateLimitConfig(provider: string): RateLimitConfig {
  const normalizedProvider = provider.toLowerCase().replace('-', '')

  // Check for NVIDIA first (needs special handling)
  if (normalizedProvider.includes('nvidia')) {
    const envRpm = parseInt(process.env.NVIDIA_RPM_LIMIT || '', 10)
    if (envRpm > 0) {
      return {
        ...DEFAULT_RATE_LIMITS['nvidia-nim'],
        rpmLimit: envRpm,
        rpsLimit: envRpm / 60,
        maxRetries: parseInt(process.env.NVIDIA_MAX_RETRIES || '', 10) || DEFAULT_RATE_LIMITS['nvidia-nim'].maxRetries,
        retryDelayMs: parseInt(process.env.NVIDIA_RETRY_DELAY_MS || '', 10) || DEFAULT_RATE_LIMITS['nvidia-nim'].retryDelayMs,
      }
    }
    return DEFAULT_RATE_LIMITS['nvidia-nim']
  }

  // Try exact match first
  if (DEFAULT_RATE_LIMITS[provider]) {
    return DEFAULT_RATE_LIMITS[provider]
  }

  // Try prefix match
  for (const [key, config] of Object.entries(DEFAULT_RATE_LIMITS)) {
    if (normalizedProvider.includes(key.replace('-', ''))) {
      return config
    }
  }

  return DEFAULT_RATE_LIMITS['default']
}

/**
 * Check if current provider is NVIDIA (for special handling)
 */
export function isNvidiaProvider(): boolean {
  const baseUrl = process.env.OPENAI_BASE_URL || process.env.NVIDIA_NIM || ''
  return baseUrl.includes('nvidia') || baseUrl.includes('integrate.api.nvidia')
}

/**
 * Get retry delay with exponential backoff
 */
export function getRetryDelay(
  attempt: number,
  baseDelayMs: number,
  multiplier: number,
  maxDelayMs: number = 60000
): number {
  const delay = baseDelayMs * Math.pow(multiplier, attempt)
  return Math.min(delay, maxDelayMs)
}

/**
 * Calculate batch delay to stay within RPM limit
 */
export function calculateBatchDelay(rpmLimit: number, batchSize: number): number {
  if (batchSize <= 1) return 0
  // Space out batch to stay within RPM limit
  // For 40 RPM, send 1 request every 1.5 seconds
  return Math.ceil((60000 / rpmLimit) * batchSize)
}

/**
 * Rate limit statistics tracker
 */
class RateLimitTracker {
  private requests: number[] = []
  private readonly rpmLimit: number
  private readonly windowMs: number = 60000 // 1 minute window

  constructor(rpmLimit: number) {
    this.rpmLimit = rpmLimit
  }

  /**
   * Record a request timestamp
   */
  recordRequest(): void {
    const now = Date.now()
    this.requests.push(now)
    // Clean old requests outside the window
    this.requests = this.requests.filter(t => now - t < this.windowMs)
  }

  /**
   * Check if we're within rate limit
   */
  isWithinLimit(): boolean {
    const now = Date.now()
    const recentRequests = this.requests.filter(t => now - t < this.windowMs)
    return recentRequests.length < this.rpmLimit
  }

  /**
   * Get time to wait until next available slot (in ms)
   */
  getWaitTime(): number {
    const now = Date.now()
    const cutoff = now - this.windowMs
    const requestsOutside = this.requests.filter(t => t < cutoff)

    if (requestsOutside.length === 0) return 0

    // Find the oldest request and calculate wait time
    const oldest = Math.min(...this.requests.filter(t => now - t < this.windowMs))
    const timeSinceOldest = now - oldest

    // If we've exceeded the limit, wait until the oldest request expires
    if (this.requests.length >= this.rpmLimit) {
      return Math.max(0, this.windowMs - timeSinceOldest)
    }

    return 0
  }

  /**
   * Get current usage percentage
   */
  getUsagePercent(): number {
    const now = Date.now()
    const recentRequests = this.requests.filter(t => now - t < this.windowMs)
    return (recentRequests.length / this.rpmLimit) * 100
  }
}

// Export a singleton tracker for NVIDIA
export const nvidiaRateTracker = new RateLimitTracker(
  parseInt(process.env.NVIDIA_RPM_LIMIT || '40', 10)
)

/**
 * Get wait time before next NVIDIA request
 */
export function getNvidiaWaitTime(): number {
  return nvidiaRateTracker.getWaitTime()
}

/**
 * Record a successful NVIDIA request
 */
export function recordNvidiaRequest(): void {
  nvidiaRateTracker.recordRequest()
}

/**
 * Wait for rate limit to clear
 */
export async function waitForRateLimit(provider: string): Promise<void> {
  const config = getRateLimitConfig(provider)

  if (provider.toLowerCase().includes('nvidia')) {
    const waitTime = nvidiaRateTracker.getWaitTime()
    if (waitTime > 0) {
      console.log(`[NVIDIA Rate Limit] Waiting ${waitTime}ms...`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }
}

/**
 * Execute request with rate limit handling
 */
export async function withRateLimit<T>(
  provider: string,
  fn: () => Promise<T>,
  options?: { skipCheck?: boolean }
): Promise<T> {
  const config = getRateLimitConfig(provider)

  if (provider.toLowerCase().includes('nvidia') && !options?.skipCheck) {
    const waitTime = nvidiaRateTracker.getWaitTime()
    if (waitTime > 0) {
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
    nvidiaRateTracker.recordRequest()
  }

  try {
    return await fn()
  } catch (error: any) {
    // Check if it's a rate limit error (429)
    if (error?.status === 429 || error?.message?.includes('rate limit')) {
      const attempt = 0
      const delay = getRetryDelay(
        attempt,
        config.retryDelayMs,
        config.backoffMultiplier
      )

      console.log(`[Rate Limit] Got 429, retrying in ${delay}ms...`)

      await new Promise(resolve => setTimeout(resolve, delay))
      return withRateLimit(provider, fn, { skipCheck: true })
    }
    throw error
  }
}
