/**
 * Currency Converter Tool
 * Free, no API key required - convert between currencies
 */

import { buildTool } from '../../Tool.js'
import { z } from 'zod'

export const currencyTool = buildTool({
  shouldDefer: true,
  name: 'Currency',
  description: 'Convert between currencies using live exchange rates. No API key required - uses frankfurter.app free API.',
  input: z.object({
    amount: z.number().describe('Amount to convert'),
    from: z.string().describe('Source currency code (e.g., "USD", "EUR", "GBP")'),
    to: z.string().optional().describe('Target currency code (e.g., "USD", "EUR", "GBP"). If omitted, converts to all common currencies.'),
  }),
  output: z.object({
    amount: z.number(),
    from: z.string(),
    rates: z.record(z.number()),
    date: z.string(),
  }),
  aliases: ['currency', 'convert', 'exchange', 'forex', 'money'],
  rateLimit: {
    windowMs: 10000,
    maxUses: 30,
  },
  async call({ amount, from, to }) {
    try {
      const fromUpper = from.toUpperCase()
      const url = to
        ? `https://api.frankfurter.app/latest?from=${fromUpper}&to=${to.toUpperCase()}`
        : `https://api.frankfurter.app/latest?from=${fromUpper}`

      const response = await fetch(url, {
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        return {
          data: {
            amount,
            from: fromUpper,
            rates: {},
            date: 'Error',
          },
        }
      }

      const data = await response.json()
      const rates = data.rates || {}

      // Calculate converted amounts
      const convertedRates: Record<string, string> = {}
      for (const [currency, rate] of Object.entries(rates)) {
        convertedRates[currency] = (amount * (rate as number)).toFixed(2)
      }

      return {
        data: {
          amount,
          from: fromUpper,
          rates: convertedRates,
          date: data.date || new Date().toISOString().split('T')[0],
        },
      }
    } catch {
      return {
        data: {
          amount,
          from: from.toUpperCase(),
          rates: {},
          date: 'Error fetching rates',
        },
      }
    }
  },
  mapToolResultToToolResultBlockParam(content, toolUseID) {
    const { amount, from, rates, date } = content as any

    let text = `💱 Currency Conversion\n━━━━━━━━━━━━━━━━━━\n`
    text += `${amount} ${from} (${date})\n`
    text += `━━━━━━━━━━━━━━━━━━\n`

    const entries = Object.entries(rates).slice(0, 20) // Limit to 20 currencies
    entries.forEach(([currency, value]) => {
      text += `${currency.padEnd(6)} ${value}\n`
    })

    if (Object.keys(rates).length > 20) {
      text += `\n... and ${Object.keys(rates).length - 20} more currencies`
    }

    return {
      tool_use_id: toolUseID,
      type: 'tool_result',
      content: [{ type: 'text', text }],
    }
  },
})

export default currencyTool
