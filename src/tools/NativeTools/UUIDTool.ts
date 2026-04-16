/**
 * UUID Generator Tool
 * Free, no API key required - generate UUIDs
 */

import { buildTool } from '../../Tool.js'
import { z } from 'zod'

export const uuidTool = buildTool({
  shouldDefer: true,
  name: 'UUID',
  description: 'Generate UUIDs (v1, v4, v7) and validate existing UUIDs. Useful for creating unique identifiers, testing, and data modeling. No API key required.',
  input: z.object({
    version: z.enum(['v1', 'v4', 'v7']).optional().describe('UUID version: v1 (time-based), v4 (random), v7 (Unix epoch time-based). Default: v4'),
    count: z.number().min(1).max(100).optional().describe('Number of UUIDs to generate (default: 1, max: 100)'),
    validate: z.string().optional().describe('UUID to validate (checks if string is a valid UUID format)'),
  }),
  output: z.object({
    uuids: z.array(z.string()).describe('Generated or validated UUIDs'),
    valid: z.boolean().optional().describe('Whether validation passed'),
    version: z.string().describe('UUID version used'),
  }),
  aliases: ['uuid', 'guid', 'uuidv4', 'uuidv7', 'generate-uuid'],
  rateLimit: {
    windowMs: 1000,
    maxUses: 50,
  },
  async call({ version = 'v4', count = 1, validate }) {
    // If validating, check the input
    if (validate) {
      const uuidRegex = {
        v1: /^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        v4: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        v7: /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      }
      const isValid = uuidRegex[version].test(validate)
      return {
        data: {
          uuids: [validate],
          valid: isValid,
          version,
        },
      }
    }

    // Generate UUIDs
    const uuids: string[] = []
    for (let i = 0; i < count; i++) {
      uuids.push(generateUUID(version))
    }

    return {
      data: {
        uuids,
        version,
      },
    }
  },
  mapToolResultToToolResultBlockParam(content, toolUseID) {
    const { uuids, valid, version } = content as { uuids: string[]; valid?: boolean; version: string }
    const validationResult = valid !== undefined ? `\nValid: ${valid}` : ''
    return {
      tool_use_id: toolUseID,
      type: 'tool_result',
      content: [
        {
          type: 'text',
          text: `Generated ${uuids.length} UUID (${version}):\n${uuids.join('\n')}${validationResult}`,
        },
      ],
    }
  },
})

function generateUUID(version: 'v1' | 'v4' | 'v7'): string {
  switch (version) {
    case 'v1': {
      // Time-based UUID
      const timestamp = Date.now()
      const clockSeq = Math.floor(Math.random() * 0x3fff) | 0x8000
      const node = Array.from({ length: 6 }, () => Math.floor(Math.random() * 256))
      const hex = (n: number, len: number) => n.toString(16).padStart(len, '0')
      return [
        hex(((timestamp / 0x100000000) * 0x10000) & 0xffffffff, 8),
        hex(((timestamp / 0x100000000) * 0x10000) >>> 16, 4),
        hex(0x1000 | (timestamp >>> 28), 4),
        hex(clockSeq & 0xff | 0x80, 4),
        hex(node[0] << 8 | node[1], 4) + hex(node[2] << 8 | node[3], 4) + hex(node[4] << 8 | node[5], 4),
      ].join('-')
    }
    case 'v7': {
      // Unix Epoch time-based UUID v7
      const timestamp = Date.now()
      const rand = crypto.getRandomValues(new Uint8Array(10))
      const hex = (n: number, len: number) => n.toString(16).padStart(len, '0')
      const t1 = hex(Math.floor(timestamp / 0x1000000000000), 4)
      const t2 = hex(Math.floor((timestamp / 0x100000000) % 0x10000), 4)
      const t3 = hex(Math.floor((timestamp % 0x100000000) / 0x10000), 4)
      const t4 = hex(0x7000 | (timestamp % 0x10000), 4)
      const t5 = hex(rand[0] << 8 | rand[1], 4)
      const t6 = hex(rand[2] << 8 | rand[3], 4) + hex(rand[4] << 8 | rand[5], 4) + hex(rand[6] << 8 | rand[7], 4) + hex(rand[8] << 8 | rand[9], 4)
      return `${t1}-${t2}-${t3}-${t4}-${t5}-${t6}`
    }
    case 'v4':
    default: {
      // Random UUID v4
      return crypto.randomUUID()
    }
  }
}

export default uuidTool
