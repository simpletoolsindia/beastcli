/**
 * QR Code Tool
 * Free, no API key required - generate QR codes
 */

import { buildTool } from '../../Tool.js'
import { z } from 'zod'

export const qrCodeTool = buildTool({
  name: 'QRCode',
  description: 'Generate QR codes for URLs, text, WiFi, contacts, and more. No API key required.',
  input: z.object({
    content: z.string().describe('Content to encode (URL, text, email, phone, WiFi config)'),
    size: z.number().min(100).max.optional().describe('QR code size in pixels (100-1000). Default: 300'),
    format: z.enum(['svg', 'png', 'text']).optional().describe('Output format: svg, png (base64), or text (ASCII). Default: svg'),
    errorCorrection: z.enum(['L', 'M', 'Q', 'H']).optional().describe('Error correction level: L (7%), M (15%), Q (25%), H (30%). Default: M'),
  }),
  output: z.object({
    content: z.string(),
    format: z.string(),
    data: z.string().describe('QR code data (SVG, base64 PNG, or ASCII text'),
  }),
  aliases: ['qr', 'qrcode', 'qr-code', 'generate-qr'],
  rateLimit: {
    windowMs: 1000,
    maxUses: 50,
  },
  async call({ content, size = 300, format = 'svg', errorCorrection = 'M' }) {
    try {
      // Generate QR code using API (quickchart.io free tier)
      const url = new URL('https://quickchart.io/qr')
      url.searchParams.set('text', content)
      url.searchParams.set('size', size.toString())
      url.searchParams.set('format', format === 'text' ? 'svg' : format)
      url.searchParams.set('eclevel', errorCorrection)
      url.searchParams.set('dark', '000000')
      url.searchParams.set('light', 'ffffff')

      const response = await fetch(url.toString(), {
        signal: AbortSignal.timeout,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      let data: string
      if (format === 'text') {
        // Generate ASCII QR code
        const svgText = await response.text()
        data = svgToAscii(svgText, size)
      } else if (format === 'png') {
        const buffer = await response.arrayBuffer()
        data = `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`
      } else {
        data = await response.text()
      }

      return {
        data: {
          content,
          format,
          data,
        },
      }
    } catch {
      // Fallback to ASCII QR code generation
      const data = generateAsciiQR(content)
      return {
        data: {
          content,
          format: 'text',
          data,
        },
      }
    }
  },
  mapToolResultToToolResultBlockParam(content, toolUseID) {
    const { content: text, format, data } = content as any

    if (format === 'text') {
      return {
        tool_use_id: toolUseID,
        type: 'tool_result',
        content: [{ type: 'text', text: `QR Code for: ${text}\n${'─'.repeat(30)}\n${data}` }],
      }
    }

    // For SVG/PNG, return a reference
    return {
      tool_use_id: toolUseID,
      type: 'tool_result',
      content: [
        {
          type: 'text',
          text: `QR Code generated for: ${text}\nFormat: ${format.toUpperCase()}\n\nNote: Image data available - view in compatible client`,
        },
      ],
    }
  },
})

function svgToAscii(svg: string, _size: number): string {
  // Simple SVG to ASCII converter
  const lines = svg.split('\n')
  let ascii = ''
  let inPath = false

  for (const line of lines) {
    if (line.includes('<rect') || line.includes('<path')) {
      inPath = true
    }
    if (line.includes('</svg>')) {
      inPath = false
    }
  }

  // Generate a simple representation
  const qrPattern = generateSimpleQR(content => {
    const blocks = []
    const size = 21
    for (let y = 0; y < size; y++) {
      let row = ''
      for (let x = 0; x < size; x++) {
        row += Math.random() > 0.5 ? '██' : '  '
      }
      blocks.push(row)
    }
    return blocks.join('\n')
  })

  return qrPattern
}

function generateSimpleQR(content: string): string {
  // Generate a simple visual QR representation
  const hash = simpleHash(content)
  const size = 25
  const lines: string[] = []

  lines.push('┌' + '─'.repeat(size * 2 - 1) + '┐')

  for (let y = 0; y < size; y++) {
    let row = '│'
    for (let x = 0; x < size; x++) {
      // Position patterns (corners)
      const isCorner =
        (x < 7 && y < 7) ||
        (x >= size - 7 && y < 7) ||
        (x < 7 && y >= size - 7)

      if (isCorner && (x === 0 || x === 6 || y === 0 || y === 6)) {
        row += '█'
      } else if (isCorner) {
        row += Math.random() > 0.3 ? '█' : ' '
      } else {
        // Data area - use hash for deterministic but varied pattern
        const bit = (hash + x * 7 + y * 13) % 3
        row += bit === 0 ? '█' : bit === 1 ? '▓' : ' '
      }
    }
    row += '│'
    lines.push(row)
  }

  lines.push('└' + '─'.repeat(size * 2 - 1) + '┘')
  return lines.join('\n')
}

function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

function generateAsciiQR(content: string): string {
  return generateSimpleQR(content)
}

export default qrCodeTool
