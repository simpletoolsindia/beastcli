/**
 * Timestamp Tool
 * Free, no API key required - convert between timestamps and human-readable dates
 */

import { buildTool } from '../../Tool.js'
import { z } from 'zod'

export const timestampTool = buildTool({
  name: 'Timestamp',
  description: 'Convert between Unix timestamps and human-readable dates. Useful for API debugging, log analysis, and data conversion. No API key required.',
  input: z.object({
    value: z.string().describe('Timestamp in milliseconds, seconds, or ISO date string'),
    toFormat: z.enum(['unix_ms', 'unix_s', 'iso', 'human', 'relative']).optional().describe('Output format: unix_ms (milliseconds), unix_s (seconds), iso (ISO 8601), human (readable), relative (e.g., "2 hours ago"). Default: human'),
    timezone: z.string().optional().describe('Timezone (e.g., "UTC", "America/New_York"). Default: local'),
  }),
  output: z.object({
    original: z.string().describe('Original input value'),
    unixMs: z.number().describe('Unix timestamp in milliseconds'),
    unixS: z.number().describe('Unix timestamp in seconds'),
    iso: z.string().describe('ISO 8601 formatted date'),
    human: z.string().describe('Human-readable date'),
    relative: z.string().describe('Relative time description'),
  }),
  aliases: ['timestamp', 'date', 'time', 'epoch', 'unixtime'],
  rateLimit: {
    windowMs: 1000,
    maxUses: 100,
  },
  async call({ value, toFormat = 'human', timezone = 'UTC' }) {
    let date: Date

    // Parse input value
    const trimmedValue = value.trim()

    // Check if it's a number (timestamp)
    if (/^\d+$/.test(trimmedValue)) {
      const num = parseInt(trimmedValue, 10)
      // Determine if it's seconds or milliseconds
      if (trimmedValue.length <= 10) {
        date = new Date(num * 1000)
      } else {
        date = new Date(num)
      }
    } else {
      // Try to parse as date string
      date = new Date(trimmedValue)
    }

    // Handle invalid date
    if (isNaN(date.getTime())) {
      return {
        data: {
          original: value,
          unixMs: 0,
          unixS: 0,
          iso: 'Invalid date',
          human: 'Invalid date',
          relative: 'Invalid date',
        },
      }
    }

    const unixMs = date.getTime()
    const unixS = Math.floor(unixMs / 1000)

    // Format outputs
    const iso = date.toISOString()
    const human = date.toLocaleString('en-US', { timeZone: timezone })
    const relative = getRelativeTime(unixMs)

    // Return requested format
    let result: string
    switch (toFormat) {
      case 'unix_ms':
        result = unixMs.toString()
        break
      case 'unix_s':
        result = unixS.toString()
        break
      case 'iso':
        result = iso
        break
      case 'relative':
        result = relative
        break
      case 'human':
      default:
        result = human
        break
    }

    return {
      data: {
        result,
        unixMs,
        unixS,
        iso,
        human,
        relative,
        original: value,
        toFormat,
      },
    }
  },
  mapToolResultToToolResultBlockParam(content, toolUseID) {
    const { unixMs, unixS, iso, human, relative, result } = content as any
    return {
      tool_use_id: toolUseID,
      type: 'tool_result',
      content: [
        {
          type: 'text',
          text: `Timestamp Conversion\n━━━━━━━━━━━━━━━━━━\nUnix (ms):   ${unixMs}\nUnix (s):    ${unixS}\nISO:         ${iso}\nHuman:       ${human}\nRelative:    ${relative}\n──────────────────\nResult:      ${result}`,
        },
      ],
    }
  },
})

function getRelativeTime(unixMs: number): string {
  const now = Date.now()
  const diff = now - unixMs
  const absDiff = Math.abs(diff)
  const past = diff > 0

  const seconds = Math.floor(absDiff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) {
    return past ? 'just now' : 'in a moment'
  }
  if (minutes < 60) {
    return past ? `${minutes} minute${minutes > 1 ? 's' : ''} ago` : `in ${minutes} minute${minutes > 1 ? 's' : ''}`
  }
  if (hours < 24) {
    return past ? `${hours} hour${hours > 1 ? 's' : ''} ago` : `in ${hours} hour${hours > 1 ? 's' : ''}`
  }
  if (days < 7) {
    return past ? `${days} day${days > 1 ? 's' : ''} ago` : `in ${days} day${days > 1 ? 's' : ''}`
  }
  if (weeks < 4) {
    return past ? `${weeks} week${weeks > 1 ? 's' : ''} ago` : `in ${weeks} week${weeks > 1 ? 's' : ''}`
  }
  if (months < 12) {
    return past ? `${months} month${months > 1 ? 's' : ''} ago` : `in ${months} month${months > 1 ? 's' : ''}`
  }
  return past ? `${years} year${years > 1 ? 's' : ''} ago` : `in ${years} year${years > 1 ? 's' : ''}`
}

export default timestampTool
