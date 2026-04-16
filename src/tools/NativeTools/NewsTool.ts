/**
 * News Tool
 * Free, no API key required - get latest news headlines
 */

import { buildTool } from '../../Tool.js'
import { z } from 'zod'

export const newsTool = buildTool({
  name: 'News',
  description: 'Get latest news headlines and articles. Uses public RSS feeds and free APIs - no API key required.',
  input: z.object({
    topic: z.string().optional().describe('News topic or keyword (e.g., "technology", "sports", "science"). Empty for top headlines'),
    country: z.string().optional().describe('Country code: us, gb, in, au, ca. Default: us'),
    limit: z.number().min(1).max(50).optional().describe('Number of headlines to return. Default: 10'),
  }),
  output: z.object({
    headlines: z.array(z.object({
      title: z.string(),
      source: z.string(),
      url: z.string(),
      published: z.string(),
      description: z.string().optional(),
    })),
    topic: z.string(),
    total: z.number(),
  }),
  aliases: ['news', 'headlines', 'headlines', 'latest-news', 'rss'],
  rateLimit: {
    windowMs: 30000,
    maxUses: 20,
  },
  async call({ topic, country = 'us', limit = 10 }) {
    try {
      // Use newsdata.io free tier API (500 requests/day free)
      // Alternative: use GNews free tier
      const apiKey = process.env.NEWSDATA_API_KEY

      if (apiKey) {
        // Use newsdata.io with API key
        const url = new URL('https://newsdata.io/api/1/news')
        url.searchParams.set('apikey', apiKey)
        url.searchParams.set('country', country)
        if (topic) {
          url.searchParams.set('q', topic)
          url.searchParams.set('language', 'en')
        } else {
          url.searchParams.set('category', 'top')
        }

        const response = await fetch(url.toString(), {
          signal: AbortSignal.timeout,
        })

        if (response.ok) {
          const data = await response.json()
          const headlines = (data.results || []).slice(0, limit).map((article: any) => ({
            title: article.title || 'No title',
            source: article.source_id || 'Unknown',
            url: article.link || '',
            published: formatDate(article.pubDate),
            description: article.description || '',
          }))

          return {
            data: {
              headlines,
              topic: topic || 'Top Headlines',
              total: headlines.length,
            },
          }
        }
      }

      // Fallback: Use GNews free API (100 requests/day)
      const gnewsUrl = new URL('https://gnews.io/api/v4/top-headlines')
      gnewsUrl.searchParams.set('token', process.env.GNEWS_API_KEY || 'demo')
      gnewsUrl.searchParams.set('lang', 'en')
      gnewsUrl.searchParams.set('max', limit.toString())
      if (topic) {
        gnewsUrl.searchParams.set('q', topic)
      }

      const gnewsResponse = await fetch(gnewsUrl.toString(), {
        signal: AbortSignal.timeout,
      })

      if (gnewsResponse.ok) {
        const gnewsData = await gnewsResponse.json()
        const headlines = (gnewsData.articles || []).slice(0, limit).map((article: any) => ({
          title: article.title || 'No title',
          source: article.source?.name || 'Unknown',
          url: article.url || '',
          published: formatDate(article.publishedAt),
          description: article.description || '',
        }))

        return {
          data: {
            headlines,
            topic: topic || 'Top Headlines',
            total: headlines.length,
          },
        }
      }

      // Final fallback: Use Hacker News API (always works, no key)
      return await getHackerNews(topic, limit)
    } catch {
      // Ultimate fallback: Hacker News
      return await getHackerNews(topic, limit)
    }
  },
  mapToolResultToToolResultBlockParam(content, toolUseID) {
    const { headlines, topic, total } = content as any

    let text = `📰 ${topic} (${total} articles)\n${'━'.repeat(40)}\n\n`

    headlines.forEach((article: any, i: number) => {
      text += `${i + 1}. ${article.title}\n`
      text += `   📍 ${article.source} | ${article.published}\n`
      if (article.description) {
        text += `   ${article.description.slice(0, 80)}...\n`
      }
      text += `   🔗 ${article.url}\n\n`
    })

    return {
      tool_use_id: toolUseID,
      type: 'tool_result',
      content: [{ type: 'text', text }],
    }
  },
})

async function getHackerNews(topic: string | undefined, limit: number) {
  try {
    // Get top stories
    const topStoriesUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json'
    const response = await fetch(topStoriesUrl, { signal: AbortSignal.timeout })

    if (!response.ok) throw new Error('Failed to fetch')

    const storyIds: number[] = await response.json()
    const limitedIds = storyIds.slice(0, limit * 2) // Fetch extra in case of filter

    const stories = await Promise.all(
      limitedIds.slice(0, limit).map(async (id) => {
        try {
          const storyResponse = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
            { signal: AbortSignal.timeout }
          )
          return storyResponse.ok ? await storyResponse.json() : null
        } catch {
          return null
        }
      })
    )

    let headlines = stories
      .filter(s => s && s.title && s.url)
      .filter(s => !topic || s.title.toLowerCase().includes(topic.toLowerCase()))
      .slice(0, limit)
      .map((s: any) => ({
        title: s.title,
        source: 'Hacker News',
        url: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
        published: new Date((s.time || 0) * 1000).toISOString().split('T')[0],
        description: `${s.score || 0} points | ${s.descendants || 0} comments`,
      }))

    return {
      data: {
        headlines,
        topic: topic || 'Hacker News Top',
        total: headlines.length,
      },
    }
  } catch {
    return {
      data: {
        headlines: [],
        topic: topic || 'News',
        total: 0,
      },
    }
  }
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Unknown'
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (hours < 48) return 'Yesterday'
    return date.toISOString().split('T')[0]
  } catch {
    return dateStr
  }
}

export default newsTool
