import { feature } from 'bun:bundle'
import z from 'zod/v4'
import { PAUSE_ICON } from '../../constants/figures.js'
// Types extracted to src/types/permissions.ts to break import cycles
import {
  EXTERNAL_PERMISSION_MODES,
  type ExternalPermissionMode,
  PERMISSION_MODES,
  type PermissionMode,
} from '../../types/permissions.js'
import { lazySchema } from '../lazySchema.js'

// Re-export for backwards compatibility
export {
  EXTERNAL_PERMISSION_MODES,
  PERMISSION_MODES,
  type ExternalPermissionMode,
  type PermissionMode,
}

export const permissionModeSchema = lazySchema(() => z.enum(PERMISSION_MODES))
export const externalPermissionModeSchema = lazySchema(() =>
  z.enum(EXTERNAL_PERMISSION_MODES),
)

type ModeColorKey =
  | 'text'
  | 'planMode'
  | 'permission'
  | 'autoAccept'
  | 'error'
  | 'warning'

type PermissionModeConfig = {
  title: string
  shortTitle: string
  symbol: string
  color: ModeColorKey
  external: ExternalPermissionMode
}

const PERMISSION_MODE_CONFIG: Partial<
  Record<PermissionMode, PermissionModeConfig>
> = {
  guidance: {
    title: '🎯 Guidance Mode',
    shortTitle: 'Guidance',
    symbol: '👀',
    color: 'text',
    external: 'guidance',
    description: 'Ask before making changes',
  },
  autopilot: {
    title: '🚀 Autopilot Mode',
    shortTitle: 'Autopilot',
    symbol: '⏩',
    color: 'autoAccept',
    external: 'autopilot',
    description: 'Auto-approve file edits, ask for other actions',
  },
  control: {
    title: '⚡ Control Mode',
    shortTitle: 'Control',
    symbol: '🎮',
    color: 'warning',
    external: 'control',
    description: 'Full control - auto-accept all actions',
  },
  observe: {
    title: '🔍 Observe Mode',
    shortTitle: 'Observe',
    symbol: '🔎',
    color: 'planMode',
    external: 'observe',
    description: 'Read-only - analysis only, no changes',
  },
  dontAsk: {
    title: "🤫 Don't Ask",
    shortTitle: 'Silent',
    symbol: '🔇',
    color: 'error',
    external: 'dontAsk',
    description: 'Never ask, always deny',
  },
  ...(feature('TRANSCRIPT_CLASSIFIER')
    ? {
        auto: {
          title: '🧠 Auto Mode',
          shortTitle: 'Auto',
          symbol: '🤖',
          color: 'warning' as ModeColorKey,
          external: 'guidance' as ExternalPermissionMode,
          description: 'AI decides when to ask',
        },
      }
    : {}),
}

// Aliases for backwards compatibility
export const LEGACY_MODE_ALIASES: Record<string, PermissionMode> = {
  default: 'guidance',
  acceptEdits: 'autopilot',
  bypassPermissions: 'control',
  plan: 'observe',
  '--dangerously-skip-permissions': 'control',
}

/**
 * Type guard to check if a PermissionMode is an ExternalPermissionMode.
 * auto is internal-only and excluded from external modes.
 */
export function isExternalPermissionMode(
  mode: PermissionMode,
): mode is ExternalPermissionMode {
  // External users can't have auto, so always true for them
  if (process.env.USER_TYPE !== 'ant') {
    return true
  }
  return mode !== 'auto' && mode !== 'bubble'
}

function getModeConfig(mode: PermissionMode): PermissionModeConfig {
  return PERMISSION_MODE_CONFIG[mode] ?? PERMISSION_MODE_CONFIG.guidance!
}

export function toExternalPermissionMode(
  mode: PermissionMode,
): ExternalPermissionMode {
  return getModeConfig(mode).external
}

export function permissionModeFromString(str: string): PermissionMode {
  return (PERMISSION_MODES as readonly string[]).includes(str)
    ? (str as PermissionMode)
    : 'default'
}

export function permissionModeTitle(mode: PermissionMode): string {
  return getModeConfig(mode).title
}

export function isDefaultMode(mode: PermissionMode | undefined): boolean {
  return mode === 'default' || mode === undefined
}

export function permissionModeShortTitle(mode: PermissionMode): string {
  return getModeConfig(mode).shortTitle
}

export function permissionModeSymbol(mode: PermissionMode): string {
  return getModeConfig(mode).symbol
}

export function getModeColor(mode: PermissionMode): ModeColorKey {
  return getModeConfig(mode).color
}
