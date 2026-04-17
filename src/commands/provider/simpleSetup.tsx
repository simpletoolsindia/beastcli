import * as React from 'react'
import type { LocalJSXCommandOnDone } from '../../types/command.js'
import { Box, Text } from '../../ink.js'
import {
  buildNvidiaNimProfileEnv,
  buildOpenAIProfileEnv,
  buildOllamaProfileEnv,
  createProfileFile,
  type ProfileEnv,
} from '../../utils/providerProfile.js'
import { getOllamaChatBaseUrl, hasLocalOllama } from '../../utils/providerDiscovery.js'

const DEFAULT_OLLAMA_MODEL = 'llama3.2'

export async function simpleSetup(
  _args: Record<string, string | undefined>,
  _onDone: LocalJSXCommandOnDone,
): Promise<React.ReactNode> {
  return (
    <Box flexDirection="column" paddingY={1}>
      <Text bold={true} color="beastcli">
        🐺 BeastCLI Provider Setup
      </Text>
      <Text dimColor={true}>
        {'━'.repeat(50)}
      </Text>
      <Box flexDirection="column" marginY={1}>
        <Text>Select a provider to configure:</Text>
        <Text dimColor={true} marginTop={1}>
          1. NVIDIA NIM ⚡ (Fast GPU inference)
        </Text>
        <Text dimColor={true}>
          2. OpenRouter 🎯 (200+ models)
        </Text>
        <Text dimColor={true}>
          3. Ollama 🦙 (Local, free)
        </Text>
        <Text dimColor={true}>
          4. OpenAI 🤖 (GPT-4)
        </Text>
        <Text dimColor={true}>
          5. View current config
        </Text>
      </Box>
      <Text dimColor={true}>
        {'─'.repeat(50)}
      </Text>
      <Text marginTop={1}>
        Usage: /provider setup [nvidia|openrouter|ollama|openai|status]
      </Text>
    </Box>
  )
}

export async function handleSimpleSetup(
  provider: string,
): Promise<{ success: boolean; message: string }> {
  switch (provider.toLowerCase()) {
    case 'nvidia':
      return setupNvidia()
    case 'openrouter':
      return setupOpenRouter()
    case 'ollama':
      return setupOllama()
    case 'openai':
      return setupOpenAI()
    case 'status':
      return showStatus()
    default:
      return {
        success: false,
        message:
          'Unknown provider. Use: nvidia, openrouter, ollama, openai, or status',
      }
  }
}

async function setupNvidia(): Promise<{ success: boolean; message: string }> {
  const apiKey =
    process.env.NVIDIA_API_KEY || process.env.ANTHROPIC_API_KEY || ''

  if (!apiKey) {
    return {
      success: false,
      message: `
⚡ NVIDIA NIM Setup
━━━━━━━━━━━━━━━━━━━━
Get your API key at: https://ngc.nvidia.com/

Then run:
  export NVIDIA_API_KEY=your-key-here
  export ENABLE_TOOL_SEARCH=true

Or add to ~/.beastcli/.env:
  NVIDIA_API_KEY=your-key-here
  ENABLE_TOOL_SEARCH=true
`,
    }
  }

  const env = buildNvidiaNimProfileEnv({ apiKey })
  if (!env) {
    return {
      success: false,
      message: 'Failed to build NVIDIA NIM profile: no API key found.',
    }
  }
  // Auto-enable tool search to defer 21 native tools and reduce initial prompt size
  env.ENABLE_TOOL_SEARCH = 'true'
  env.BEASTCLI_PROVIDER = 'nvidia'
  createProfileFile('nvidia-nim', env as ProfileEnv)

  return {
    success: true,
    message: `
✅ NVIDIA NIM Configured!
━━━━━━━━━━━━━━━━━━━━
Model: nvidia/llama-3.1-nemotron-70b-instruct
Rate Limit: 40 RPM
Tool Search: enabled (reduces prompt size ~6K tokens)

Restart BeastCLI to use the new provider.
`,
  }
}

async function setupOpenRouter(): Promise<{ success: boolean; message: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY || ''

  if (!apiKey) {
    return {
      success: false,
      message: `
🎯 OpenRouter Setup
━━━━━━━━━━━━━━━━━━━━
Get your API key at: https://openrouter.ai/keys

Then run:
  export OPENROUTER_API_KEY=sk-or-v1-xxx
  export ENABLE_TOOL_SEARCH=true

Or add to ~/.beastcli/.env:
  OPENROUTER_API_KEY=sk-or-v1-xxx
  ENABLE_TOOL_SEARCH=true
`,
    }
  }

  const env = buildOpenAIProfileEnv({
    goal: 'balanced',
    apiKey,
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'anthropic/claude-3.5-sonnet',
  })
  if (!env) {
    return {
      success: false,
      message: 'Failed to build OpenRouter profile: no API key found.',
    }
  }
  // Auto-enable tool search to defer 21 native tools and reduce initial prompt size
  env.ENABLE_TOOL_SEARCH = 'true'
  env.BEASTCLI_PROVIDER = 'openrouter'
  createProfileFile('openai', env as ProfileEnv)

  return {
    success: true,
    message: `
✅ OpenRouter Configured!
━━━━━━━━━━━━━━━━━━━━
Available models: 200+
Popular: anthropic/claude-3.5-sonnet, google/gemini-2.0-flash-thinking
Tool Search: enabled (reduces prompt size ~6K tokens)

Restart BeastCLI to use the new provider.
`,
  }
}

async function setupOllama(): Promise<{ success: boolean; message: string }> {
  const hasOllama = await hasLocalOllama()

  if (!hasOllama) {
    return {
      success: false,
      message: `
🦙 Ollama Setup
━━━━━━━━━━━━━━━━━━━━
Ollama is not running. Install from: https://ollama.ai/

Then run:
  ollama pull llama3.2
  export OLLAMA_BASE_URL=http://localhost:11434
  export OLLAMA_MODEL=llama3.2
  export ENABLE_TOOL_SEARCH=true

Common models:
  ollama pull llama3.2       # Fast & capable
  ollama pull mistral         # Great for coding
  ollama pull codellama:7b    # Code-specialized
`,
    }
  }

  const env = buildOllamaProfileEnv(DEFAULT_OLLAMA_MODEL, {
    getOllamaChatBaseUrl,
  }) as ProfileEnv
  env.ENABLE_TOOL_SEARCH = 'true'
  env.BEASTCLI_PROVIDER = 'ollama'
  createProfileFile('ollama', env)

  return {
    success: true,
    message: `
✅ Ollama Configured!
━━━━━━━━━━━━━━━━━━━━
Model: ${DEFAULT_OLLAMA_MODEL}
Local URL: ${getOllamaChatBaseUrl()}
No API key needed — runs completely offline!
Tool Search: enabled (reduces prompt size ~6K tokens)

Restart BeastCLI to use the new provider.
`,
  }
}

async function setupOpenAI(): Promise<{ success: boolean; message: string }> {
  const apiKey = process.env.OPENAI_API_KEY || ''

  if (!apiKey) {
    return {
      success: false,
      message: `
🤖 OpenAI Setup
━━━━━━━━━━━━━━━━━━━━
Get your API key at: https://platform.openai.com/api-keys

Then run:
  export OPENAI_API_KEY=sk-xxx
  export OPENAI_BASE_URL=https://api.openai.com/v1
  export OPENAI_MODEL=gpt-4o
  export ENABLE_TOOL_SEARCH=true

Or add to ~/.beastcli/.env:
  OPENAI_API_KEY=sk-xxx
  OPENAI_BASE_URL=https://api.openai.com/v1
  OPENAI_MODEL=gpt-4o
  ENABLE_TOOL_SEARCH=true
`,
    }
  }

  const baseUrl =
    process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
  const model = process.env.OPENAI_MODEL || 'gpt-4o'
  const env = buildOpenAIProfileEnv({
    goal: 'balanced',
    apiKey,
    baseUrl,
    model,
  })
  if (!env) {
    return {
      success: false,
      message: 'Failed to build OpenAI profile: no API key found.',
    }
  }
  env.ENABLE_TOOL_SEARCH = 'true'
  env.BEASTCLI_PROVIDER = 'openai'
  createProfileFile('openai', env as ProfileEnv)

  return {
    success: true,
    message: `
✅ OpenAI Configured!
━━━━━━━━━━━━━━━━━━━━
Model: ${model}
Base URL: ${baseUrl}
Tool Search: enabled (reduces prompt size ~6K tokens)

Restart BeastCLI to use the new provider.
`,
  }
}

async function showStatus(): Promise<{ success: boolean; message: string }> {
  const toolSearch = process.env.ENABLE_TOOL_SEARCH
  const nvidiaKey = process.env.NVIDIA_API_KEY ? '✓ Set' : '✗ Not set'
  const openRouterKey = process.env.OPENROUTER_API_KEY ? '✓ Set' : '✗ Not set'
  const openaiKey = process.env.OPENAI_API_KEY ? '✓ Set' : '✗ Not set'
  const ollamaRunning = (await hasLocalOllama())
    ? '✓ Running'
    : '✗ Not running'

  return {
    success: true,
    message: `
🐺 BeastCLI Provider Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tool Search: ${toolSearch ? `✓ Enabled (saves ~6K tokens/req)` : '✗ Disabled'}

API Keys Status:
  NVIDIA NIM:    ${nvidiaKey}
  OpenRouter:    ${openRouterKey}
  OpenAI:        ${openaiKey}
  Ollama:        ${ollamaRunning}

Quick Commands:
  /provider setup nvidia     - Configure NVIDIA NIM
  /provider setup openrouter - Configure OpenRouter
  /provider setup ollama     - Configure Ollama
  /provider setup openai     - Configure OpenAI
  /provider setup status     - Show this status
`,
  }
}

export default { simpleSetup, handleSimpleSetup }
