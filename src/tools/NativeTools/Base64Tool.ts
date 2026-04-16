/**
 * Base64 Encoder/Decoder Tool
 * Free, no API key required - encode/decode Base64 strings
 */

import { buildTool } from '../../Tool.js'
import { z } from 'zod'

export const base64Tool = buildTool({
  name: 'Base64',
  description: 'Encode or decode Base64 strings. Useful for data encoding, API authentication, and binary-to-text conversion. No API key required.',
  input: z.object({
    text: z.string().describe('Text to encode or decode'),
    action: z.enum(['encode', 'decode']).describe('Action: encode or decode'),
  }),
  output: z.object({
    result: z.string().describe('The encoded or decoded result'),
    original: z.string().describe('The original input'),
    action: z.string().describe('The action performed'),
  }),
  aliases: ['base64', 'b64', 'encode64', 'decode64'],
  rateLimit: {
    windowMs: 1000,
    maxUses: 100,
  },
  async call({ text, action }) {
    try {
      if (action === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(text)))
        return {
          data: {
            result: encoded,
            original: text,
            action: 'encode',
          },
        }
      } else {
        const decoded = decodeURIComponent(escape(atob(text)))
        return {
          data: {
            result: decoded,
            original: text,
            action: 'decode',
          },
        }
      }
    } catch {
      return {
        data: {
          result: 'Error: Invalid input for Base64 decode. Make sure the input is valid Base64 encoded text.',
          original: text,
          action,
        },
      }
    }
  },
  mapToolResultToToolResultBlockParam(content, toolUseID) {
    const { result, action } = content as { result: string; original: string; action: string }
    return {
      tool_use_id: toolUseID,
      type: 'tool_result',
      content: [
        {
          type: 'text',
          text: `${action === 'encode' ? 'Encoded' : 'Decoded'}: ${result}`,
        },
      ],
    }
  },
})

export default base64Tool
