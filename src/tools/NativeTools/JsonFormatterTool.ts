/**
 * JSON Formatter & Validator Tool
 * Free, no API key required - format, validate, and minify JSON
 */

import { buildTool } from '../../Tool.js'
import { z } from 'zod'

export const jsonFormatterTool = buildTool({
  shouldDefer: true,
  name: 'JsonFormatter',
  description: 'Format, validate, or minify JSON.',
  input: z.object({
    json: z.string().describe('JSON string to format, validate, or minify'),
    action: z.enum(['format', 'minify', 'validate', 'prettify']).optional().describe('Action'),
    indent: z.number().optional().describe('Indentation size (default: 2)'),
  }),
  output: z.object({
    result: z.string(), valid: z.boolean(), error: z.string().optional(),
  }),
  aliases: ['json', 'format-json'],
  rateLimit: { windowMs: 1000, maxUses: 50 },
  async call({ json, action = 'format', indent = 2 }) {
    try {
      const parsed = JSON.parse(json)
      switch (action) {
        case 'minify': return { data: { result: JSON.stringify(parsed), valid: true } }
        case 'validate': return { data: { result: 'Valid JSON', valid: true } }
        default: return { data: { result: JSON.stringify(parsed, null, indent), valid: true } }
      }
    } catch (error: any) {
      return { data: { result: '', valid: false, error: error.message } }
    }
  },
  mapToolResultToToolResultBlockParam(content, toolUseID) {
    const { result, valid, error } = content as any
    return {
      tool_use_id: toolUseID, type: 'tool_result',
      content: [{ type: 'text', text: error ? `Invalid JSON: ${error}` : result }],
    }
  },
})

export default jsonFormatterTool