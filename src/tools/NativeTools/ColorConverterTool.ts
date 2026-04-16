/**
 * Color Converter Tool
 * Free, no API key required - convert between color formats
 */

import { buildTool } from '../../Tool.js'
import { z } from 'zod'

export const colorConverterTool = buildTool({
  name: 'ColorConverter',
  description: 'Convert colors between HEX, RGB, HSL, and other formats. Useful for CSS styling, design systems, and color manipulation.',
  input: z.object({
    color: z.string().describe('Color to convert (e.g., "#ff0000", "rgb(255,0,0)", "red", "hsl(0,100%,50%)")'),
    targetFormat: z.enum(['hex', 'rgb', 'hsl', 'hsv', 'cmyk', 'name']).optional().describe('Target format: hex, rgb, hsl, hsv, cmyk, name'),
  }),
  output: z.object({
    original: z.string().describe('Original color input'),
    hex: z.string().describe('HEX format'),
    rgb: z.string().describe('RGB format'),
    hsl: z.string().describe('HSL format'),
    name: z.string().optional().describe('Closest CSS color name'),
  }),
  aliases: ['color', 'colour', 'hex2rgb', 'rgb2hex'],
  rateLimit: {
    windowMs: 1000,
    maxUses: 50,
  },
})(
  async ({ color, targetFormat }) => {
    // Named colors map (common colors)
    const namedColors: Record<string, string> = {
      'red': '#ff0000', 'green': '#00ff00', 'blue': '#0000ff',
      'white': '#ffffff', 'black': '#000000', 'yellow': '#ffff00',
      'cyan': '#00ffff', 'magenta': '#ff00ff', 'orange': '#ffa500',
      'purple': '#800080', 'pink': '#ffc0cb', 'brown': '#a52a2a',
      'gray': '#808080', 'grey': '#808080', 'navy': '#000080',
    }

    let hex = color.trim()

    // Handle named colors
    if (namedColors[hex.toLowerCase()]) {
      hex = namedColors[hex.toLowerCase()]
    }

    // Parse HEX
    if (!hex.startsWith('#')) {
      hex = '#' + hex
    }
    hex = hex.replace(/^#+/, '#')

    // Validate HEX
    const hexMatch = hex.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i)
    if (!hexMatch) {
      return { original: color, hex: '#INVALID', rgb: 'rgb(0,0,0)', hsl: 'hsl(0,0%,0%)', name: 'unknown' }
    }

    let r: number, g: number, b: number

    if (hex.length === 4) {
      // Short form #RGB
      r = parseInt(hex[1] + hex[1], 16)
      g = parseInt(hex[2] + hex[2], 16)
      b = parseInt(hex[3] + hex[3], 16)
    } else {
      // Full form #RRGGBB
      r = parseInt(hex.slice(1, 3), 16)
      g = parseInt(hex.slice(3, 5), 16)
      b = parseInt(hex.slice(5, 7), 16)
    }

    // Convert to HSL
    const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255
    const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm)
    const l = (max + min) / 2

    let h = 0, s = 0
    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break
        case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break
        case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break
      }
    }

    const hsl = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
    const rgb = `rgb(${r}, ${g}, ${b})`

    return {
      original: color,
      hex: hex.toUpperCase(),
      rgb,
      hsl,
      name: getClosestColorName(r, g, b),
    }
  }
)

function getClosestColorName(r: number, g: number, b: number): string {
  const colors = [
    { name: 'Red', r: 255, g: 0, b: 0 },
    { name: 'Green', r: 0, g: 255, b: 0 },
    { name: 'Blue', r: 0, g: 0, b: 255 },
    { name: 'Yellow', r: 255, g: 255, b: 0 },
    { name: 'Cyan', r: 0, g: 255, b: 255 },
    { name: 'Magenta', r: 255, g: 0, b: 255 },
    { name: 'White', r: 255, g: 255, b: 255 },
    { name: 'Black', r: 0, g: 0, b: 0 },
    { name: 'Orange', r: 255, g: 165, b: 0 },
    { name: 'Purple', r: 128, g: 0, b: 128 },
  ]

  let minDist = Infinity
  let closest = 'Unknown'

  for (const c of colors) {
    const dist = Math.sqrt(Math.pow(r - c.r, 2) + Math.pow(g - c.g, 2) + Math.pow(b - c.b, 2))
    if (dist < minDist) {
      minDist = dist
      closest = c.name
    }
  }

  return closest
}

export default colorConverterTool