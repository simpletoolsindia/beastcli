/**
 * SearxNG Search Provider
 *
 * Self-hosted meta-search engine aggregator
 * https://github.com/searxng/searxng
 */

import type { SearchInput, SearchProvider } from './types.js'
import { applyDomainFilters, safeHostname } from './types.js'
import { extractHits } from './custom.js'

// Default SearxNG instance URL - can be overridden via SEARXNG_URL or WEB_SEARCH_API env var
const DEFAULT_SEARXNG_URL = process.env.SEARXNG_URL || process.env.WEB_SEARCH_API || 'https://search.sridharhomelab.in'

export const searxngProvider: SearchProvider = {
  name: 'searxng',

  isConfigured(): boolean {
    // SearxNG is always "configured" - it will fail at runtime if URL is unreachable
    // Users can set SEARXNG_URL or WEB_SEARCH_API to point to their instance
    return true
  },

  async search(input: SearchInput, signal?: AbortSignal): Promise<{ hits: any[]; providerName: string; durationSeconds: number }> {
    const start = performance.now()
    const baseUrl = DEFAULT_SEARXNG_URL.replace(/\/$/, '')

    // Try the SearxNG public API endpoint
    const searchUrl = `${baseUrl}/search?q=${encodeURIComponent(input.query)}&format=json&engines=general`

    let response: Response
    try {
      response = await fetch(searchUrl, {
        signal: signal || AbortSignal.timeout(15_000),
        headers: {
          'Accept': 'application/json',
        },
      })
    } catch (error) {
      // Try alternative SearxNG endpoint format as fallback
      const altUrl = `${baseUrl}/search?q=${encodeURIComponent(input.query)}`
      response = await fetch(altUrl, {
        signal: signal || AbortSignal.timeout(15_000),
      })
    }

    if (!response.ok) {
      throw new Error(`SearxNG responded with status ${response.status}`)
    }

    let data: { results?: Array<{ title?: string; url?: string; content?: string; engines?: string[] }> }
    try {
      data = await response.json()
    } catch {
      throw new Error('Failed to parse SearxNG response as JSON')
    }

    if (!data.results || !Array.isArray(data.results)) {
      // If JSON parse failed, return empty results
      return {
        hits: [],
        providerName: 'searxng',
        durationSeconds: (performance.now() - start) / 1000,
      }
    }

    const rawHits = data.results.map(result => ({
      title: result.title || '',
      url: result.url || '',
      description: result.content || '',
    }))

    const hits = applyDomainFilters(rawHits, input)

    return {
      hits,
      providerName: 'searxng',
      durationSeconds: (performance.now() - start) / 1000,
    }
  },
}