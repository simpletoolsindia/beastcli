/**
 * SearxNG Search Provider
 *
 * Self-hosted meta-search engine aggregator
 * https://github.com/searxng/searxng
 */

import { safeHostname, extractHits, type SearchProvider, type ProviderOutput } from './types.js'

// Default SearxNG instance URL - can be overridden via WEB_SEARCH_API env var
const DEFAULT_SEARXNG_URL = process.env.SEARXNG_URL || process.env.WEB_SEARCH_API || 'https://search.sridharhomelab.in'

export const searxngProvider: SearchProvider = {
  name: 'searxng',

  isAvailable(): boolean {
    // SearxNG is always "available" - it will fail at runtime if URL is unreachable
    // Users can set SEARXNG_URL or WEB_SEARCH_API to point to their instance
    return true
  },

  async search(input: { query: string }): Promise<ProviderOutput> {
    const { query } = input
    const baseUrl = DEFAULT_SEARXNG_URL.replace(/\/$/, '')

    // Try the SearxNG public API endpoint
    const searchUrl = `${baseUrl}/search?q=${encodeURIComponent(query)}&format=json&engines=general`

    let response: Response
    try {
      response = await fetch(searchUrl, {
        signal: AbortSignal.timeout(15_000),
        headers: {
          'Accept': 'application/json',
        },
      })
    } catch (error) {
      // Try alternative SearxNG endpoint format
      const altUrl = `${baseUrl}/search?q=${encodeURIComponent(query)}`
      response = await fetch(altUrl, {
        signal: AbortSignal.timeout(15_000),
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
      // If JSON parse failed, try to extract from HTML fallback
      return {
        query,
        hits: [],
        provider: 'searxng',
      }
    }

    const hits = extractHits(data.results.map(result => ({
      title: result.title || '',
      url: result.url || '',
      snippet: result.content || '',
    })))

    return {
      query,
      hits,
      provider: 'searxng',
    }
  },
}

// Auto-detect SearxNG by checking if WEB_SEARCH_API points to a SearxNG instance
export function detectSearxngProvider(webSearchApi?: string): SearchProvider | null {
  const url = webSearchApi || DEFAULT_SEARXNG_URL

  // Check if URL looks like a SearxNG instance
  if (url.includes('searx') || url.includes('search')) {
    return searxngProvider
  }

  return null
}