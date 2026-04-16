/**
 * Regex Tool
 * Free, no API key required - test and validate regular expressions
 */

import { buildTool } from '../../Tool.js'
import { z } from 'zod'

export const regexTool = buildTool({
  name: 'Regex',
  description: 'Test regular expressions against text, validate patterns, and extract matches. No API key required.',
  input: z.object({
    pattern: z.string().describe('Regular expression pattern (e.g., "\\d{3}-\\d{3}-\\d{4}")'),
    text: z.string().describe('Text to test the regex against'),
    flags: z.string().optional().describe('Regex flags: g (global), i (case-insensitive), m (multiline), s (dotall). Default: g'),
    extract: z.boolean().optional().describe('If true, extract all matches. If false, just test for matches. Default: true'),
  }),
  output: z.object({
    pattern: z.string(),
    valid: z.boolean(),
    matches: z.array(z.object({
      match: z.string(),
      index: z.number(),
      groups: z.record(z.string()).optional(),
    })),
    matchCount: z.number(),
    testResult: z.boolean(),
  }),
  aliases: ['regex', 'regexp', 'test-regex', 'regex-tester', 'pattern'],
  rateLimit: {
    windowMs: 1000,
    maxUses: 100,
  },
  async call({ pattern, text, flags = 'g', extract = true }) {
    const matches: Array<{ match: string; index: number; groups?: Record<string, string> }> = []
    let valid = true
    let testResult = false

    try {
      const regex = new RegExp(pattern, flags)

      if (extract) {
        let match
        while ((match = regex.exec(text)) !== null) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.groups ? { ...match.groups } : undefined,
          })
          // Prevent infinite loop for zero-width matches
          if (match[0].length === 0) {
            regex.lastIndex++
          }
        }
        testResult = matches.length > 0
      } else {
        testResult = regex.test(text)
      }
    } catch (error) {
      valid = false
      testResult = false
    }

    return {
      data: {
        pattern,
        valid,
        matches: matches.slice(0, 50), // Limit to 50 matches
        matchCount: matches.length,
        testResult,
      },
    }
  },
  mapToolResultToToolResultBlockParam(content, toolUseID) {
    const { pattern, valid, matches, matchCount, testResult } = content as any

    if (!valid) {
      return {
        tool_use_id: toolUseID,
        type: 'tool_result',
        content: [{ type: 'text', text: `Invalid regex pattern: ${pattern}` }],
      }
    }

    let text = `🔍 Regex Test Results\n━━━━━━━━━━━━━━━━━━\nPattern: /${pattern}/\n\n`
    text += `✅ ${testResult ? 'Pattern matches!' : 'No matches found'}\n`
    text += `📊 Total matches: ${matchCount}\n`

    if (matches.length > 0) {
      text += `\nMatches:\n`
      matches.slice(0, 10).forEach((m: any, i: number) => {
        text += `  ${i + 1}. "${m.match}" at index ${m.index}\n`
        if (m.groups) {
          Object.entries(m.groups).forEach(([key, value]) => {
            text += `     ${key}: "${value}"\n`
          })
        }
      })
      if (matchCount > 10) {
        text += `\n  ... and ${matchCount - 10} more matches`
      }
    }

    return {
      tool_use_id: toolUseID,
      type: 'tool_result',
      content: [{ type: 'text', text }],
    }
  },
})

export default regexTool
