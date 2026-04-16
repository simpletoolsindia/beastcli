/**
 * JSON Formatter & Validator Tool
 * Free, no API key required - format, validate, and minify JSON
 */

import { buildTool } from '../../Tool.js'
import { z } from 'zod'

export const jsonFormatterTool = buildTool({
  name: 'JsonFormatter',
  description: 'Format, validate, or minify JSON. Useful for cleaning up messy JSON, validating structure, or compressing JSON for storage.',
  input: z.object({
    json: z.string().describe('JSON string to format, validate, or minify'),
    action: z.enum(['format', 'minify', 'validate', 'prettify']).optional().describe('Action: format (pretty print), minify (compress), validate (check only), prettify (with colors)'),
    indent: z.number().optional().describe('Indentation size (default: 2 spaces)'),
  }),
  output: z.object({
    result: z.string().describe('Formatted/minified/validated JSON'),
    valid: z.boolean().describe('Whether JSON is valid'),
    error: z.string().optional().describe('Error message if invalid'),
  }),
  aliases: ['json', 'format-json', 'json-format', 'prettify-json'],
  rateLimit: {
    windowMs: 1000,
    maxUses: 50,
  },
})(
  async ({ json, action = 'format', indent = 2 }) => {
    try {
      // First validate by parsing
      const parsed = JSON.parse(json)

      switch (action) {
        case 'minify':
          return {
            result: JSON.stringify(parsed),
            valid: true,
          }

        case 'validate':
          return {
            result: 'Valid JSON ✓',
            valid: true,
          }

        case 'prettify':
        case 'format':
        default:
          return {
            result: JSON.stringify(parsed, null, indent),
            valid: true,
          }
      }
    } catch (error: any) {
      return {
        result: '',
        valid: false,
        error: error.message,
      }
    }
  }
)

export default jsonFormatterTool