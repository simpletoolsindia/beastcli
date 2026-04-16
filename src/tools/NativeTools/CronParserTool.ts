/**
 * Cron Parser Tool
 * Free, no API key required - parse and validate cron expressions
 */

import { buildTool } from '../../Tool.js'
import { z } from 'zod'

export const cronParserTool = buildTool({
  name: 'Cron',
  description: 'Parse, validate, and explain cron expressions. Convert cron to human-readable format and calculate next run times. No API key required.',
  input: z.object({
    expression: z.string().describe('Cron expression (e.g., "0 9 * * 1-5" for 9 AM weekdays)'),
    count: z.number().min(1).max(20).optional().describe('Number of next run times to show. Default: 5'),
  }),
  output: z.object({
    expression: z.string(),
    valid: z.boolean(),
    description: z.string(),
    nextRuns: z.array(z.string()),
    parts: z.object({
      second: z.string(),
      minute: z.string(),
      hour: z.string(),
      dayOfMonth: z.string(),
      month: z.string(),
      dayOfWeek: z.string(),
    }),
  }),
  aliases: ['cron', 'cron-parser', 'cronjob', 'schedule', 'cron-expression'],
  rateLimit: {
    windowMs: 1000,
    maxUses: 50,
  },
  async call({ expression, count = 5 }) {
    const parts = expression.trim().split(/\s+/)
    const valid = parts.length >= 5 && parts.length <= 6

    if (!valid) {
      return {
        data: {
          expression,
          valid: false,
          description: 'Invalid cron expression. Expected 5-6 parts: [second] minute hour day-of-month month day-of-week',
          nextRuns: [],
          parts: { second: '', minute: '', hour: '', dayOfMonth: '', month: '', dayOfWeek: '' },
        },
      }
    }

    const [second, minute, hour, dayOfMonth, month, dayOfWeek] = parts.length === 5
      ? ['0', ...parts]
      : parts

    const description = describeCron(second, minute, hour, dayOfMonth, month, dayOfWeek)
    const nextRuns = calculateNextRuns(second, minute, hour, dayOfMonth, month, dayOfWeek, count)

    return {
      data: {
        expression,
        valid: true,
        description,
        nextRuns,
        parts: { second, minute, hour, dayOfMonth, month, dayOfWeek },
      },
    }
  },
  mapToolResultToToolResultBlockParam(content, toolUseID) {
    const { expression, valid, description, nextRuns, parts } = content as any

    if (!valid) {
      return {
        tool_use_id: toolUseID,
        type: 'tool_result',
        content: [{ type: 'text', text: `❌ Invalid cron: ${expression}` }],
      }
    }

    let text = `⏰ Cron: ${expression}\n${'━'.repeat(40)}\n`
    text += `✅ ${description}\n\n`
    text += `Parts: ${parts.second} ${parts.minute} ${parts.hour} ${parts.dayOfMonth} ${parts.month} ${parts.dayOfWeek}\n`
    text += `       sec  min   hr    dom     mon   dow\n\n`
    text += `📅 Next ${nextRuns.length} runs:\n`
    nextRuns.forEach((run, i) => {
      text += `   ${i + 1}. ${run}\n`
    })

    return {
      tool_use_id: toolUseID,
      type: 'tool_result',
      content: [{ type: 'text', text }],
    }
  },
})

function describeCron(second: string, minute: string, hour: string, dayOfMonth: string, month: string, dayOfWeek: string): string {
  const parts: string[] = []

  // Time
  if (minute === '*' && hour === '*') {
    parts.push('every minute')
  } else if (minute === '*') {
    parts.push(`every minute during hour ${hour}`)
  } else if (hour === '*') {
    parts.push(`at minute ${minute} of every hour`)
  } else {
    parts.push(`at ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`)
  }

  // Day of week
  const dowNames: Record<string, string> = {
    '0': 'Sun', '1': 'Mon', '2': 'Tue', '3': 'Wed', '4': 'Thu', '5': 'Fri', '6': 'Sat', '7': 'Sun',
    'SUN': 'Sun', 'MON': 'Mon', 'TUE': 'Tue', 'WED': 'Wed', 'THU': 'Thu', 'FRI': 'Fri', 'SAT': 'Sat',
  }
  if (dayOfWeek !== '*') {
    parts.push(`on ${dowNames[dayOfWeek.toUpperCase()] || dayOfWeek}`)
  }

  // Day of month
  if (dayOfMonth !== '*') {
    parts.push(`on day ${dayOfMonth}`)
  }

  // Month
  const monthNames: Record<string, string> = {
    '1': 'Jan', '2': 'Feb', '3': 'Mar', '4': 'Apr', '5': 'May', '6': 'Jun',
    '7': 'Jul', '8': 'Aug', '9': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec',
  }
  if (month !== '*') {
    parts.push(`in ${monthNames[month] || month}`)
  }

  return parts.join(' ')
}

function calculateNextRuns(second: string, minute: string, hour: string, dayOfMonth: string, month: string, dayOfWeek: string, count: number): string[] {
  const runs: string[] = []
  let date = new Date()

  for (let i = 0; i < 1000 && runs.length < count; i++) {
    date = new Date(date.getTime() + 60000) // Add 1 minute

    const secMatch = matchCronPart(second, date.getSeconds())
    const minMatch = matchCronPart(minute, date.getMinutes())
    const hourMatch = matchCronPart(hour, date.getHours())
    const domMatch = matchCronPart(dayOfMonth, date.getDate())
    const monMatch = matchCronPart(month, date.getMonth() + 1)
    const dowMatch = matchCronPart(dayOfWeek, date.getDay())

    if (secMatch && minMatch && hourMatch && domMatch && monMatch && dowMatch) {
      runs.push(formatDate(date))
    }
  }

  return runs
}

function matchCronPart(part: string, value: number): boolean {
  if (part === '*') return true

  // Handle lists (e.g., "1,5,10")
  if (part.includes(',')) {
    return part.split(',').some(p => matchCronPart(p.trim(), value))
  }

  // Handle ranges (e.g., "1-5")
  if (part.includes('-')) {
    const [start, end] = part.split('-').map(Number)
    return value >= start && value <= end
  }

  // Handle steps (e.g., "*/5")
  if (part.includes('/')) {
    const [, step] = part.split('/')
    return value % parseInt(step) === 0
  }

  return parseInt(part) === value
}

function formatDate(date: Date): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

export default cronParserTool
