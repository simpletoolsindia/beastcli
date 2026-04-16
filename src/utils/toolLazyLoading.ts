/**
 * Native tools configuration for lazy loading.
 *
 * Native tools are deferred by default to reduce prompt size.
 * They are only loaded when the model explicitly searches for them via ToolSearch.
 *
 * To change this behavior:
 * - Set DEFER_NATIVE_TOOLS=0 to include all native tools in the initial prompt
 */

import { isEnvTruthy } from '../envUtils.js'

// Should native tools be deferred (lazy loaded)?
export const SHOULD_DEFER_NATIVE_TOOLS = isEnvTruthy(process.env.DEFER_NATIVE_TOOLS !== '0')

// List of native tool names that should be deferred
export const NATIVE_TOOL_NAMES = [
  'Calculator',
  'JsonFormatter',
  'ColorConverter',
  'Base64',
  'UUID',
  'Timestamp',
  'URL',
  'Hash',
  'TextDiff',
  'Weather',
  'Currency',
  'QRCode',
  'Timezone',
  'Regex',
  'Password',
  'News',
  'IPLookup',
  'Lorem',
  'TextStats',
  'Cron',
  'YouTubeTranscript',
] as const

// Tools that should NEVER be deferred (always load in initial prompt)
export const ALWAYS_LOAD_TOOLS = new Set([
  'ToolSearch',  // Required to load deferred tools
  'Bash',        // Core functionality
  'Read',        // Core functionality
  'Edit',        // Core functionality
  'Write',       // Core functionality
  'Glob',        // Core functionality
  'Grep',        // Core functionality
  'WebSearch',   // Core functionality
  'WebFetch',    // Core functionality
])

/**
 * Check if a tool should be deferred based on its name.
 * Native tools are deferred if DEFER_NATIVE_TOOLS is enabled.
 */
export function shouldDeferNativeTool(toolName: string): boolean {
  if (!SHOULD_DEFER_NATIVE_TOOLS) return false
  if (ALWAYS_LOAD_TOOLS.has(toolName)) return false
  return NATIVE_TOOL_NAMES.includes(toolName as typeof NATIVE_TOOL_NAMES[number])
}

/**
 * Get the count of deferred native tools.
 * Used for analytics/metrics.
 */
export function getDeferredNativeToolCount(): number {
  return SHOULD_DEFER_NATIVE_TOOLS ? NATIVE_TOOL_NAMES.length : 0
}
