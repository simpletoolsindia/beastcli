/**
 * Text Stats Tool
 * Free, no API key required - analyze text statistics
 */

import { buildTool } from '../../Tool.js'
import { z } from 'zod'

export const textStatsTool = buildTool({
  shouldDefer: true,
  name: 'TextStats',
  description: 'Analyze text statistics: word count, character count, line count, reading time, sentence count, and more. No API key required.',
  input: z.object({
    text: z.string().describe('Text to analyze'),
    detailed: z.boolean().optional().describe('Show detailed analysis including word frequency. Default: false'),
  }),
  output: z.object({
    characters: z.number(),
    charactersNoSpaces: z.number(),
    words: z.number(),
    sentences: z.number(),
    paragraphs: z.number(),
    lines: z.number(),
    readingTime: z.string(),
    speakingTime: z.string(),
    topWords: z.array(z.object({ word: z.string(), count: z.number() })).optional(),
    avgWordLength: z.number(),
    avgSentenceLength: z.number(),
  }),
  aliases: ['text-stats', 'word-count', 'count', 'analyze-text', 'wc'],
  rateLimit: {
    windowMs: 1000,
    maxUses: 100,
  },
  async call({ text, detailed = false }) {
    const lines = text.split('\n')
    const words = text.split(/\s+/).filter(w => w.length > 0)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)

    // Calculate word frequencies
    const wordFreq: Record<string, number> = {}
    words.forEach(word => {
      const normalized = word.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (normalized.length > 2) {
        wordFreq[normalized] = (wordFreq[normalized] || 0) + 1
      }
    })

    const topWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }))

    // Calculate averages
    const totalWordLength = words.reduce((sum, word) => sum + word.length, 0)
    const avgWordLength = words.length > 0 ? totalWordLength / words.length : 0
    const avgSentenceLength = sentences.length > 0 ? words.length / sentences.length : 0

    // Calculate reading time (200 wpm average, 300 for code)
    const readingTimeMin = words.length / 200
    const speakingTimeMin = words.length / 150
    const readingTime = formatTime(readingTimeMin)
    const speakingTime = formatTime(speakingTimeMin)

    return {
      data: {
        characters: text.length,
        charactersNoSpaces: text.replace(/\s/g, '').length,
        words: words.length,
        sentences: sentences.length,
        paragraphs: paragraphs.length || (text.trim().length > 0 ? 1 : 0),
        lines: lines.length,
        readingTime,
        speakingTime,
        topWords: detailed ? topWords : undefined,
        avgWordLength: Math.round(avgWordLength * 10) / 10,
        avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
      },
    }
  },
  mapToolResultToToolResultBlockParam(content, toolUseID) {
    const { characters, charactersNoSpaces, words, sentences, paragraphs, lines, readingTime, speakingTime, topWords, avgWordLength, avgSentenceLength } = content as any

    let text = `📊 Text Statistics\n${'━'.repeat(40)}\n`
    text += `Characters:     ${characters.toLocaleString()}\n`
    text += `No Spaces:     ${charactersNoSpaces.toLocaleString()}\n`
    text += `Words:         ${words.toLocaleString()}\n`
    text += `Sentences:     ${sentences.toLocaleString()}\n`
    text += `Paragraphs:    ${paragraphs.toLocaleString()}\n`
    text += `Lines:         ${lines.toLocaleString()}\n`
    text += `────────────────────────────\n`
    text += `📖 Reading:    ${readingTime}\n`
    text += `🗣️ Speaking:   ${speakingTime}\n`
    text += `────────────────────────────\n`
    text += `Avg Word:      ${avgWordLength} chars\n`
    text += `Avg Sentence:  ${avgSentenceLength} words\n`

    if (topWords && topWords.length > 0) {
      text += `\n🔥 Top Words:\n`
      topWords.slice(0, 5).forEach((w: any) => {
        text += `   ${w.word}: ${w.count}\n`
      })
    }

    return {
      tool_use_id: toolUseID,
      type: 'tool_result',
      content: [{ type: 'text', text }],
    }
  },
})

function formatTime(minutes: number): string {
  if (minutes < 1) {
    return `${Math.ceil(minutes * 60)} sec`
  }
  if (minutes < 60) {
    return `${Math.ceil(minutes)} min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = Math.ceil(minutes % 60)
  return `${hours}h ${mins}m`
}

export default textStatsTool
