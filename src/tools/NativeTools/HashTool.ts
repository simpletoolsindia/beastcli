/**
 * Hash Tool
 * Free, no API key required - generate cryptographic hashes
 */

import { buildTool } from '../../Tool.js'
import { z } from 'zod'

export const hashTool = buildTool({
  shouldDefer: true,
  name: 'Hash',
  description: 'Generate cryptographic hashes (MD5, SHA1, SHA256, SHA512). Useful for checksums, password hashing comparisons, and data verification. No API key required.',
  input: z.object({
    text: z.string().describe('Text to hash'),
    algorithm: z.enum(['md5', 'sha1', 'sha256', 'sha512']).optional().describe('Hash algorithm: md5, sha1, sha256, sha512. Default: sha256'),
  }),
  output: z.object({
    hash: z.string().describe('The generated hash'),
    original: z.string().describe('Original text (truncated for display)'),
    algorithm: z.string().describe('Algorithm used'),
    bytes: z.number().describe('Hash length in bytes'),
  }),
  aliases: ['hash', 'md5', 'sha', 'sha256', 'checksum', 'generate-hash'],
  rateLimit: {
    windowMs: 1000,
    maxUses: 50,
  },
  async call({ text, algorithm = 'sha256' }) {
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(text)
      const hashBuffer = await crypto.subtle.digest(algorithm.toUpperCase().replace('SHA', 'SHA-'), data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

      return {
        data: {
          hash: hashHex,
          original: text.length > 50 ? text.slice(0, 50) + '...' : text,
          algorithm: algorithm.toUpperCase(),
          bytes: hashHex.length / 2,
        },
      }
    } catch {
      return {
        data: {
          hash: 'Error: Hash generation failed',
          original: text,
          algorithm: algorithm.toUpperCase(),
          bytes: 0,
        },
      }
    }
  },
  mapToolResultToToolResultBlockParam(content, toolUseID) {
    const { hash, original, algorithm, bytes } = content as {
      hash: string; original: string; algorithm: string; bytes: number
    }
    return {
      tool_use_id: toolUseID,
      type: 'tool_result',
      content: [
        {
          type: 'text',
          text: `${algorithm} Hash\n━━━━━━━━━━━━━━━━━━\nInput:   ${original}\nAlgorithm: ${algorithm} (${bytes} bytes)\nHash:\n${hash}`,
        },
      ],
    }
  },
})

export default hashTool
