/**
 * Timezone Tool
 * Free, no API key required - convert between timezones
 */

import { buildTool } from '../../Tool.js'
import { z } from 'zod'

export const timezoneTool = buildTool({
  shouldDefer: true,
  name: 'Timezone',
  description: 'Convert times between timezones, get current time in multiple cities, and find timezone offsets. No API key required.',
  input: z.object({
    time: z.string().optional().describe('Time to convert (e.g., "14:30", "2024-01-15 14:30"). Defaults to current time'),
    from: z.string().optional().describe('Source timezone (e.g., "America/New_York", "UTC", "EST"). Defaults to local'),
    to: z.string().describe('Target timezone(s) - comma-separated or "all" for major cities'),
  }),
  output: z.object({
    conversions: z.array(z.object({
      timezone: z.string(),
      time: z.string(),
      offset: z.string(),
      abbr: z.string(),
    })),
    date: z.string(),
  }),
  aliases: ['timezone', 'tz', 'time', 'world-clock', 'convert-time'],
  rateLimit: {
    windowMs: 1000,
    maxUses: 100,
  },
  async call({ time, from = Intl.DateTimeFormat().resolvedOptions().timeZone, to }) {
    // Parse input time or use current
    let date: Date
    if (time) {
      // Try to parse the time
      const parsed = new Date(time)
      if (isNaN(parsed.getTime())) {
        // Try parsing as just time
        const [hours, minutes] = time.split(':').map(Number)
        date = new Date()
        date.setHours(hours, minutes || 0, 0, 0)
      } else {
        date = parsed
      }
    } else {
      date = new Date()
    }

    // Get target timezones
    const targetTimezones = to === 'all'
      ? ['America/New_York', 'America/Los_Angeles', 'America/Chicago', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Kolkata', 'Australia/Sydney', 'Pacific/Auckland']
      : to.split(',').map(tz => tz.trim())

    const conversions = targetTimezones.map(tz => {
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZoneName: 'short',
        })

        const parts = formatter.formatToParts(date)
        const timeStr = parts.find(p => p.type === 'time')?.value || ''
        const tzName = parts.find(p => p.type === 'timeZoneName')?.value || ''

        // Get offset
        const offsetFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          timeZoneName: 'longOffset',
        })
        const offsetStr = offsetFormatter.formatToParts(date).find(p => p.type === 'timeZoneName')?.value || ''

        return {
          timezone: tz,
          time: timeStr,
          offset: offsetStr.replace(/.*([+-]\d{1,2}:\d{2}).*/, '$1'),
          abbr: tzName,
        }
      } catch {
        return {
          timezone: tz,
          time: 'Invalid',
          offset: '',
          abbr: '',
        }
      }
    })

    return {
      data: {
        conversions,
        date: date.toISOString().split('T')[0],
      },
    }
  },
  mapToolResultToToolResultBlockParam(content, toolUseID) {
    const { conversions, date } = content as any

    let text = `🕐 Timezone Conversion\n━━━━━━━━━━━━━━━━━━\nDate: ${date}\n\n`
    conversions.forEach((conv: any) => {
      const tzShort = conv.timezone.split('/').pop() || conv.timezone
      text += `${conv.time.padEnd(12)} ${tzShort.padEnd(20)} ${conv.abbr}\n`
    })

    return {
      tool_use_id: toolUseID,
      type: 'tool_result',
      content: [{ type: 'text', text }],
    }
  },
})

export default timezoneTool
