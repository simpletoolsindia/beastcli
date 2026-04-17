import type { AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS } from '../../services/analytics/index.js'
import { shouldUseCodexTransport } from '../../services/api/providerConfig.js'
import { isEnvTruthy } from '../envUtils.js'

export type APIProvider =
  | 'firstParty'
  | 'bedrock'
  | 'vertex'
  | 'foundry'
  | 'openai'
  | 'gemini'
  | 'github'
  | 'codex'
  | 'nvidia-nim'
  | ''
  | 'mistral'

/**
 * Mapping from BEASTCLI_PROVIDER=xxx names to internal providers.
 * Provides a simple user-facing way to select providers.
 */
const BEASTCLI_PROVIDER_MAP: Record<string, APIProvider> = {
  nvidia: 'nvidia-nim',
  minmax: '',
  openrouter: 'openai',
  openai: 'openai',
  ollama: 'openai',
  gemini: 'gemini',
  mistral: 'mistral',
  github: 'github',
  bedrock: 'bedrock',
  vertex: 'vertex',
  foundry: 'foundry',
  anthropic: 'firstParty',
  codex: 'codex',
}

/**
 * Check if a provider is selected via the simple BEASTCLI_PROVIDER env var.
 * Returns the provider name or null if not set.
 */
function getBeastCLIProviderFromSimpleEnv(): APIProvider | null {
  const provider = process.env.BEASTCLI_PROVIDER
  if (!provider) return null
  const normalized = provider.toLowerCase().trim()
  const mapped = BEASTCLI_PROVIDER_MAP[normalized]
  if (mapped) return mapped
  return null
}

export function getAPIProvider(): APIProvider {
  // Priority 1: BEASTCLI_PROVIDER=nvidia|openai|gemini|ollama|mistral|...
  const beastProvider = getBeastCLIProviderFromSimpleEnv()
  if (beastProvider) return beastProvider

  if (isEnvTruthy(process.env.NVIDIA_NIM)) {
    return 'nvidia-nim'
  }
  if (isEnvTruthy(process.env.MINIMAX_API_KEY)) {
    return ''
  }

  return isEnvTruthy(
    process.env.BEASTCLI_USE_GEMINI ?? process.env.CLAUDE_CODE_USE_GEMINI,
  )
    ? 'gemini'
    : isEnvTruthy(
        process.env.BEASTCLI_USE_MISTRAL ?? process.env.CLAUDE_CODE_USE_MISTRAL,
      )
      ? 'mistral'
      : isEnvTruthy(
          process.env.BEASTCLI_USE_GITHUB ??
            process.env.CLAUDE_CODE_USE_GITHUB,
        )
        ? 'github'
        : isEnvTruthy(
            process.env.BEASTCLI_USE_OPENAI ??
              process.env.CLAUDE_CODE_USE_OPENAI,
          )
          ? isCodexModel()
            ? 'codex'
            : 'openai'
          : isEnvTruthy(
              process.env.BEASTCLI_USE_BEDROCK ??
                process.env.CLAUDE_CODE_USE_BEDROCK,
            )
            ? 'bedrock'
            : isEnvTruthy(
                process.env.BEASTCLI_USE_VERTEX ??
                  process.env.CLAUDE_CODE_USE_VERTEX,
              )
              ? 'vertex'
              : isEnvTruthy(
                  process.env.BEASTCLI_USE_FOUNDRY ??
                    process.env.CLAUDE_CODE_USE_FOUNDRY,
                )
                ? 'foundry'
                : 'firstParty'
}

export function usesAnthropicAccountFlow(): boolean {
  return getAPIProvider() === 'firstParty'
}

function isCodexModel(): boolean {
  return shouldUseCodexTransport(
    process.env.OPENAI_MODEL || '',
    process.env.OPENAI_BASE_URL ?? process.env.OPENAI_API_BASE,
  )
}

export function getAPIProviderForStatsig(): AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS {
  return getAPIProvider() as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
}

/**
 * Check if ANTHROPIC_BASE_URL is a first-party Anthropic API URL.
 * Returns true if not set (default API) or points to api.anthropic.com
 * (or api-staging.anthropic.com for ant users).
 */
export function isFirstPartyAnthropicBaseUrl(): boolean {
  const baseUrl = process.env.ANTHROPIC_BASE_URL
  if (!baseUrl) {
    return true
  }
  try {
    const host = new URL(baseUrl).host
    const allowedHosts = ['api.anthropic.com']
    if (process.env.USER_TYPE === 'ant') {
      allowedHosts.push('api-staging.anthropic.com')
    }
    return allowedHosts.includes(host)
  } catch {
    return false
  }
}
