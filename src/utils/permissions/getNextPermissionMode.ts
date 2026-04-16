import { feature } from 'bun:bundle'
import type { ToolPermissionContext } from '../../Tool.js'
import { logForDebugging } from '../debug.js'
import type { PermissionMode } from './PermissionMode.js'
import {
  getAutoModeUnavailableReason,
  isAutoModeGateEnabled,
  transitionPermissionMode,
} from './permissionSetup.js'

// Checks both the cached isAutoModeAvailable (set at startup by
// verifyAutoModeGateAccess) and the live isAutoModeGateEnabled() — these can
// diverge if the circuit breaker or settings change mid-session. The
// live check prevents transitionPermissionMode from throwing
// (permissionSetup.ts:~559), which would silently crash the shift+tab handler
// and leave the user stuck at the current mode.
function canCycleToAuto(ctx: ToolPermissionContext): boolean {
  if (feature('TRANSCRIPT_CLASSIFIER')) {
    const gateEnabled = isAutoModeGateEnabled()
    const can = !!ctx.isAutoModeAvailable && gateEnabled
    if (!can) {
      logForDebugging(
        `[auto-mode] canCycleToAuto=false: ctx.isAutoModeAvailable=${ctx.isAutoModeAvailable} isAutoModeGateEnabled=${gateEnabled} reason=${getAutoModeUnavailableReason()}`,
      )
    }
    return can
  }
  return false
}

/**
 * Determines the next permission mode when cycling with Ctrl+S or Shift+Tab.
 * Cycle order: guidance → autopilot → observe → control → (auto) → guidance
 */
export function getNextPermissionMode(
  toolPermissionContext: ToolPermissionContext,
  _teamContext?: { leadAgentId: string },
): PermissionMode {
  switch (toolPermissionContext.mode) {
    case 'guidance':
      // Guidance → Autopilot (auto-approve edits)
      return 'autopilot'

    case 'autopilot':
      // Autopilot → Observe (read-only mode)
      return 'observe'

    case 'observe':
      // Observe → Control (full power)
      if (toolPermissionContext.isBypassPermissionsModeAvailable) {
        return 'control'
      }
      if (canCycleToAuto(toolPermissionContext)) {
        return 'auto'
      }
      return 'guidance'

    case 'control':
      // Control → Auto (AI decides) or back to Guidance
      if (canCycleToAuto(toolPermissionContext)) {
        return 'auto'
      }
      return 'guidance'

    case 'auto':
      // Auto → back to Guidance
      return 'guidance'

    case 'dontAsk':
      // Silent mode → back to Guidance
      return 'guidance'

    default:
      // For any legacy modes or unknown modes, go to Guidance
      return 'guidance'
  }
}

/**
 * Computes the next permission mode and prepares the context for it.
 * Handles any context cleanup needed for the target mode (e.g., stripping
 * dangerous permissions when entering auto mode).
 *
 * @returns The next mode and the context to use (with dangerous permissions stripped if needed)
 */
export function cyclePermissionMode(
  toolPermissionContext: ToolPermissionContext,
  teamContext?: { leadAgentId: string },
): { nextMode: PermissionMode; context: ToolPermissionContext } {
  const nextMode = getNextPermissionMode(toolPermissionContext, teamContext)
  return {
    nextMode,
    context: transitionPermissionMode(
      toolPermissionContext.mode,
      nextMode,
      toolPermissionContext,
    ),
  }
}