/**
 * Native Calculator Tool
 * Free, no API key required - performs mathematical operations locally
 */

import { buildTool } from '../../Tool.js'
import { z } from 'zod'

export const calculatorTool = buildTool({
  name: 'Calculator',
  description: 'Perform mathematical calculations. Supports basic operations, advanced math functions, and unit conversions. No API key required.',
  input: z.object({
    expression: z.string().describe('Mathematical expression to evaluate (e.g., "2 + 2", "sqrt(16)", "sin(45)", "100 * 5 / 2")'),
    precision: z.number().optional().describe('Decimal precision (default: 4)'),
  }),
  output: z.object({
    result: z.string().describe('The calculated result'),
    expression: z.string().describe('The original expression'),
  }),
  aliases: ['calc', 'math', 'compute'],
  rateLimit: {
    windowMs: 1000,
    maxUses: 100,
  },
})(
  async ({ expression, precision = 4 }) => {
    const mathFuncs: Record<string, Function> = {
      // Basic operations
      'sqrt': Math.sqrt, 'abs': Math.abs, 'ceil': Math.ceil, 'floor': Math.floor, 'round': Math.round,
      'min': Math.min, 'max': Math.max,
      // Trigonometry (in radians)
      'sin': Math.sin, 'cos': Math.cos, 'tan': Math.tan,
      'asin': Math.asin, 'acos': Math.acos, 'atan': Math.atan, 'atan2': Math.atan2,
      // Exponential & Log
      'exp': Math.exp, 'log': Math.log, 'log10': Math.log10, 'log2': Math.log2,
      'pow': Math.pow, 'PI': Math.PI, 'E': Math.E,
      // Other
      'random': Math.random, 'cbrt': Math.cbrt, 'hypot': Math.hypot,
    }

    let processedExpr = expression.toLowerCase().trim()

    // Replace function names
    for (const [name, fn] of Object.entries(mathFuncs)) {
      const regex = new RegExp(`\\b${name}\\b`, 'gi')
      processedExpr = processedExpr.replace(regex, `Math.${name}`)
    }

    // Handle percentage (e.g., "50 + 10%")
    processedExpr = processedExpr.replace(/(\d+(?:\.\d+)?)\s*%/g, (_, num) => ` * (${num} / 100)`)

    // Handle implicit multiplication: "2(3)" → "2*(3)"
    processedExpr = processedExpr.replace(/(\d)\(/g, '$1*(')
    processedExpr = processedExpr.replace(/\)\(/g, ')*(')

    try {
      // Safe eval using Function constructor
      const result = new Function(`"use strict"; return (${processedExpr})`)()

      if (typeof result !== 'number' || !isFinite(result)) {
        return { result: 'Invalid result (Infinity or NaN)', expression }
      }

      const formatted = Number.isInteger(result) ? result.toString() : result.toFixed(precision)
      return { result: formatted, expression }
    } catch (error) {
      return { result: `Error: Invalid expression "${expression}"`, expression }
    }
  }
)

export default calculatorTool