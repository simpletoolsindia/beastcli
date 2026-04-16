/**
 * TextDiff Tool
 * Free, no API key required - compare two texts and show differences
 */

import { buildTool } from '../../Tool.js'
import { z } from 'zod'

export const textDiffTool = buildTool({
  name: 'TextDiff',
  description: 'Compare two texts and highlight differences. Useful for code review, document comparison, and change tracking. No API key required.',
  input: z.object({
    oldText: z.string().describe('The original text'),
    newText: z.string().describe('The modified text'),
    context: z.number().optional().describe('Number of unchanged lines to show around changes (default: 3)'),
    format: z.enum(['unified', 'side-by-side', 'stats']).optional().describe('Output format: unified, side-by-side, or stats. Default: unified'),
  }),
  output: z.object({
    diff: z.string().describe('The diff output'),
    additions: z.number().describe('Number of added lines'),
    deletions: z.number().describe('Number of deleted lines'),
    changes: z.number().describe('Total number of changes'),
  }),
  aliases: ['diff', 'text-diff', 'compare', 'text-compare', 'changed-lines'],
  rateLimit: {
    windowMs: 1000,
    maxUses: 50,
  },
  async call({ oldText, newText, context = 3, format = 'unified' }) {
    const oldLines = oldText.split('\n')
    const newLines = newText.split('\n')

    const diff = computeDiff(oldLines, newLines, context, format)
    const { additions, deletions } = countChanges(diff)

    return {
      data: {
        diff: diff || 'No differences found',
        additions,
        deletions,
        changes: additions + deletions,
      },
    }
  },
  mapToolResultToToolResultBlockParam(content, toolUseID) {
    const { diff, additions, deletions, changes } = content as {
      diff: string; additions: number; deletions: number; changes: number
    }
    return {
      tool_use_id: toolUseID,
      type: 'tool_result',
      content: [
        {
          type: 'text',
          text: diff + `\n━━━━━━━━━━━━━━━━━━\nStats: +${additions} / -${deletions} / ${changes} changes`,
        },
      ],
    }
  },
})

function computeDiff(oldLines: string[], newLines: string[], context: number, format: string): string {
  const lcs = longestCommonSubsequence(oldLines, newLines)
  const diff: string[] = []
  let oldIdx = 0
  let newIdx = 0
  let lcsIdx = 0

  while (oldIdx < oldLines.length || newIdx < newLines.length) {
    if (lcsIdx < lcs.length && oldIdx < oldLines.length && newIdx < newLines.length &&
        oldLines[oldIdx] === lcs[lcsIdx] && newLines[newIdx] === lcs[lcsIdx]) {
      // Context line
      if (format === 'unified') {
        diff.push(`  ${lcs[lcsIdx]}`)
      }
      oldIdx++
      newIdx++
      lcsIdx++
    } else {
      // Check for deletions
      if (oldIdx < oldLines.length && (lcsIdx >= lcs.length || oldLines[oldIdx] !== lcs[lcsIdx])) {
        const delLines: string[] = []
        while (oldIdx < oldLines.length && (lcsIdx >= lcs.length || oldLines[oldIdx] !== lcs[lcsIdx])) {
          delLines.push(oldLines[oldIdx])
          oldIdx++
        }
        // Add context before
        if (format === 'unified') {
          for (let i = Math.max(0, delLines.length - context); i < delLines.length - context; i++) {
            if (i >= 0) diff.push(`  ${oldLines[Math.max(0, oldIdx - delLines.length + i - context)]}`)
          }
        }
        delLines.forEach(line => diff.push(`- ${line}`))
        // Add context after
        if (format === 'unified') {
          for (let i = context; i < Math.min(context * 2, delLines.length); i++) {
            if (oldIdx - delLines.length + i < oldLines.length) {
              diff.push(`  ${oldLines[oldIdx - delLines.length + i]}`)
            }
          }
        }
      }
      // Check for additions
      if (newIdx < newLines.length && (lcsIdx >= lcs.length || newLines[newIdx] !== lcs[lcsIdx])) {
        const addLines: string[] = []
        while (newIdx < newLines.length && (lcsIdx >= lcs.length || newLines[newIdx] !== lcs[lcsIdx])) {
          addLines.push(newLines[newIdx])
          newIdx++
        }
        addLines.forEach(line => diff.push(`+ ${line}`))
      }
    }
  }

  return diff.join('\n')
}

function longestCommonSubsequence(a: string[], b: string[]): string[] {
  const m = a.length
  const n = b.length
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  const result: string[] = []
  let i = m
  let j = n
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.unshift(a[i - 1])
      i--
      j--
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--
    } else {
      j--
    }
  }

  return result
}

function countChanges(diff: string): { additions: number; deletions: number } {
  const lines = diff.split('\n')
  let additions = 0
  let deletions = 0

  for (const line of lines) {
    if (line.startsWith('+') && !line.startsWith('+++')) {
      additions++
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      deletions++
    }
  }

  return { additions, deletions }
}

export default textDiffTool
