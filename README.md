# 🐺 BeastCLI

**The Ultimate AI-Powered Coding Agent — Built for Gen-Z Developers**

<p align="center">
  <img src="https://img.shields.io/badge/NPM-v1.1.0-FF6B35?style=for-the-badge&logo=npm" alt="NPM Version">
  <img src="https://img.shields.io/badge/Node-20+-339933?style=for-the-badge&logo=node.js" alt="Node Version">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/License-MIT-4ECDC4?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/Platform-macOS%20%7C%20Linux%20%7C%20Windows-2ECC71?style=for-the-badge" alt="Platform">
</p>

---

## ✨ What is BeastCLI?

BeastCLI is a terminal-native AI coding agent that brings **GPT-5, Claude, Gemini, DeepSeek, and 200+ models** to your terminal. No web UI needed — everything happens in your CLI. Built for developers who want speed, power, and vibes.

**No API key needed for 21 built-in tools.** For AI models, just pick a provider below.

---

## 🚀 Quick Start

```bash
npm install -g @simpletoolsindia/beastcli
beastcli
```

That's it. BeastCLI boots up, shows a cool ASCII wolf mascot 🐺, and guides you through first-run setup.

---

## ⚡ Provider Setup (Choose Your AI Backend)

BeastCLI supports **16 providers** — pick the one that fits your vibe:

### 1. Interactive Setup (Easiest — No ENV vars needed!)

```bash
beastcli
```

On first launch, BeastCLI shows an interactive menu. Pick a provider, enter your API key/model, and you're done. **It's saved automatically — next time you run BeastCLI, it just works.**

To change providers later:
```bash
/config        # Open settings UI — manage providers, themes, permissions
/provider      # Quick provider manager
```

### 2. Quick CLI Setup

```bash
# Interactive setup (recommended)
/provider setup nvidia       # NVIDIA NIM — fast GPU inference
/provider setup openrouter   # OpenRouter — 200+ models
/provider setup ollama       # Ollama — local, free, offline
/provider setup openai       # OpenAI — GPT-4/5
/provider setup chatgpt      # ChatGPT Plus/Pro OAuth — browser sign-in
/provider setup status       # View current config

# One-liner CLI flags (no interactive prompt)
/provider setup openrouter --key sk-or-v1-...   # OpenRouter with API key
```

Or use `--provider` flag with environment variable:

```bash
OPENROUTER_API_KEY=sk-or-v1-... beastcli --provider openrouter --model google/gemma-4-31b-it:free
```

---

## 🏗️ All Available Providers

| Provider | Setup Command | Description |
|----------|---------------|-------------|
| **NVIDIA NIM** | `/provider setup nvidia` | Fast GPU inference via NVIDIA NGC |
| **OpenRouter** | `/provider setup openrouter` | 200+ models from Anthropic, OpenAI, Meta, DeepSeek, etc. |
| **Ollama** | `/provider setup ollama` | Local models — completely free & offline |
| **OpenAI** | `/provider setup openai` | GPT-4o, GPT-5 family |
| **ChatGPT Plus/Pro OAuth** | `/provider setup chatgpt` | Browser sign-in, no API key needed |
| **Anthropic (Claude)** | interactive | Native Claude API |
| **Google Gemini** | interactive | Gemini via OpenAI-compatible API |
| **DeepSeek** | interactive | DeepSeek Chat API |
| **Moonshot AI** | interactive | Kimi OpenAI-compatible |
| **Together AI** | interactive | Together chat API |
| **Groq** | interactive | Groq OpenAI-compatible |
| **Mistral** | interactive | Mistral API |
| **Azure OpenAI** | interactive | Azure OpenAI deployment |
| **LM Studio** | interactive | Local LM Studio |
| **Custom** | interactive | Any OpenAI-compatible API |

### NVIDIA NIM — Lightning Fast ⚡

```bash
# Get key at: https://ngc.nvidia.com/
export NVIDIA_API_KEY=nvapi-your-key-here

# That's it! BeastCLI auto-detects NVIDIA NIM from your API key.
# Or use interactive setup:
beastcli
# Choose "NVIDIA NIM" from the provider list
```

**Popular models on NVIDIA NIM:**
- `nvidia/llama-3.3-nemotron-70b-instruct` (default)
- `nvidia/nemotron-super-49b-instruct`
- `meta/llama-4-maverick-17b-16e-instruct`
- `google/gemma-3-27b-it`

### ChatGPT Plus/Pro OAuth 🔥 (No API Key!)

```bash
beastcli
/provider
# Select "Codex OAuth" → BeastCLI opens browser for ChatGPT sign-in
```

After signing in, your **ChatGPT Plus/Pro subscription** powers BeastCLI — no API key needed. Tokens are stored securely for future sessions.

> **Requirements:** Active ChatGPT Plus or Pro subscription. BeastCLI uses browser-based OAuth via `https://auth.openai.com` on port 1455.

### Ollama — Free & Offline 🦙

```bash
# Install from https://ollama.ai/
ollama pull llama3.2
ollama pull codellama:7b

beastcli
# Choose "Ollama" — BeastCLI auto-detects your local models
```

### OpenRouter — 200+ Models 🎯

```bash
# Get key at: https://openrouter.ai/keys
beastcli
# Choose "OpenRouter" → enter API key
```

Best models on OpenRouter:
- `anthropic/claude-3.7-sonnet` (fast, capable)
- `google/gemini-3-flash-thinking` (thinking model)
- `deepseek/deepseek-chat-v3-0324` (great value)
- `openai/gpt-5-mini` (fast GPT-5)
- `meta/llama-4-maverick` (open weights)

---

## 🛠️ 21 Native Tools (No API Key Needed!)

| # | Tool | Usage | Description |
|---|------|-------|-------------|
| 1 | Calculator | `/calc 2+2` | Math operations |
| 2 | UUID | `/uuid` | UUID v1, v4, v7 generation |
| 3 | Weather | `/weather Tokyo` | Current weather |
| 4 | Timezone | `/tz Tokyo` | Time in any timezone |
| 5 | Timestamp | `/timestamp` | Unix timestamp |
| 6 | Currency | `/currency 100 USD to EUR` | Currency conversion |
| 7 | Hash | `/hash sha256 "text"` | MD5, SHA, etc. |
| 8 | Base64 | `/base64 encode "text"` | Base64 encode/decode |
| 9 | URL Tools | `/url parse "https://..."` | URL parsing & encoding |
| 10 | Regex | `/regex "pattern" "text"` | Test regex |
| 11 | Password | `/password 16` | Secure password generator |
| 12 | QR Code | `/qr "text"` | Generate QR codes |
| 13 | Text Diff | `/diff "text1" "text2"` | Compare text |
| 14 | JSON Format | `/json '{"key":"value"}'` | Format & validate JSON |
| 15 | Color Converter | `/color #FF6B35` | HEX/RGB/HSL |
| 16 | Lorem Ipsum | `/lorem 5` | Placeholder text |
| 17 | Text Stats | `/stats "text"` | Word count, reading time |
| 18 | Cron Parser | `/cron "0 9 * * *"` | Parse cron expressions |
| 19 | News | `/news tech` | Latest tech news |
| 20 | IP Lookup | `/ip 8.8.8.8` | IP geolocation |
| 21 | YouTube Transcript | `/transcript "url"` | Get video transcripts |

---

## 🦁 Permission Modes

Four modes for different situations. Switch with **Ctrl+S**:

| Mode | What it does | When to use |
|------|-------------|-------------|
| **Guidance** | Asks before any change | Learning, reviewing |
| **AutoPilot** | Auto-approves edits | Trusted coding sessions |
| **Control** | Full auto-accept | Automation, scripts |
| **Observe** | Read-only analysis | Code review, exploration |

**Shift+Tab** — Toggle between Guidance and AutoPilot quickly.

---

## ⚡ Performance: Tool Search (Saves ~6K Tokens!)

Third-party providers (NVIDIA NIM, OpenRouter, Ollama, etc.) benefit from **Tool Search** — BeastCLI defers loading the 21 native tools until you actually ask for one. This saves ~6,000 tokens per request.

Tool Search is auto-enabled when you use `/provider setup` commands.

To enable manually:
```bash
export ENABLE_TOOL_SEARCH=true
```

When you need a native tool, just ask naturally — BeastCLI fetches the schema automatically.

---

## 🔌 MCP Server Support

Connect to Model Context Protocol servers for extended capabilities:

```bash
/mcp add <name>     # Add MCP server
/mcp list           # List connected servers
/mcp remove <name>  # Remove server
/mcp auth           # Manage MCP authentication
```

---

## ⏰ Skills System

Extensible skill commands for specialized tasks:

| Skill | Command | Description |
|-------|---------|-------------|
| Batch | `/batch` | Process multiple files in one go |
| Simplify | `/simplify` | Review code for reuse, quality, efficiency |
| Loop | `/loop` | Schedule recurring tasks with cron |
| Debug | `/debug` | Debug tool calls and execution |
| Stuck | `/stuck` | Diagnose and recover from stuck states |
| Verify | `/verify` | Verify generated content quality |
| Keybindings | `/keybindings` | Configure status line keybindings |

```bash
/skills              # List all available skills
/skills install <name> # Install a skill
```

---

## 🎮 Slash Commands

### General
| Command | Description |
|---------|-------------|
| `/help` | Show help |
| `/clear` | Clear chat |
| `/config` | Open settings UI |
| `/provider` | Configure providers |
| `/tools` | List built-in tools |
| `/doctor` | Run diagnostics |
| `/status` | View status |

### Git Operations
| Command | Description |
|---------|-------------|
| `/commit` | Create git commit |
| `/diff` | Show file changes |
| `/branch` | Manage branches |
| `/log` | View git history |
| `/review` | Code review |
| `/pr` | Pull request operations |

### Agent & Tasks
| Command | Description |
|---------|-------------|
| `/agent` | Spawn a sub-agent |
| `/plan` | Structured planning |
| `/plan-ultra` | Detailed planning mode |
| `/task` | Create task list |
| `/compact` | Compact context for long sessions |
| `/team` | Multi-agent team coordination |
| `/thinkback` | Rewind conversation |

### Search & Navigation
| Command | Description |
|---------|-------------|
| `/read <file>` | Read file contents |
| `/glob "**/*.ts"` | Find files by pattern |
| `/grep "pattern"` | Search in files |
| `/lsp` | LSP-powered navigation |
| `/web-search` | Search the web |
| `/web-fetch` | Fetch web pages |

### Utilities
| Command | Description |
|---------|-------------|
| `/theme` | Change terminal theme |
| `/output-style` | Customize output style |
| `/stats` | View token and usage stats |
| `/cost` | Estimate operation costs |
| `/privacy` | Privacy settings |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Cycle permission modes |
| `Shift+Tab` | Toggle Guidance/AutoPilot |
| `Ctrl+C` | Cancel current operation |
| `Ctrl+D` | Exit BeastCLI |
| `Tab` | Autocomplete |
| `↑/↓` | Command history |
| `Ctrl+L` | Clear terminal |

---

## 🎨 Customization

### Themes
```bash
/theme set dark        # Dark theme (default)
/theme set light       # Light theme
/theme set midnight    # Midnight theme
```

### Status Line
```bash
/statusline            # Configure status line
```

---

## 🏗️ Provider Architecture

```
BeastCLI supports these authentication methods:
┌─────────────────────────────────────────────┐
│  Provider Type         │ Auth Method        │
├────────────────────────┼────────────────────┤
│  Anthropic (Claude)    │ API Key            │
│  OpenAI-compatible     │ API Key / Bearer   │
│  ChatGPT Plus/Pro      │ OAuth (browser)    │
│  Ollama                │ None (local)       │
│  LM Studio             │ None (local)       │
│  Google ADC            │ Application Default│
└─────────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### Provider Issues
```bash
/doctor              # Run full diagnostics
/provider setup status  # Check API key status
```

### NVIDIA Rate Limited?
- Wait 60 seconds (default 40 RPM limit)
- Or use `/rate-limit-options` to adjust

### Ollama Not Found?
- Install from ollama.ai
- Run `ollama serve` to start server
- Run `ollama pull llama3.2` to get a model

### Prompt Too Large?
- Enable Tool Search: `export ENABLE_TOOL_SEARCH=true`
- This defers 21 native tools and saves ~6K tokens

---

## 📊 Token Savings

| Configuration | Initial Prompt | Savings |
|---------------|----------------|---------|
| Default (no tool search) | ~15,000 tokens | — |
| With `ENABLE_TOOL_SEARCH=true` | ~9,000 tokens | **~6K tokens** |
| Ollama (local, no cloud) | ~9,000 tokens | **~6K tokens** |

---

## 🤝 Contributing

Contributions welcome! Please read contributing guidelines before submitting PRs.

## 📄 License

MIT License — see LICENSE file.

---

<p align="center">
  <strong>Built with ❤️ by SimpleTools India</strong>
  <br>
  <a href="https://github.com/simpletoolsindia/beastcli">GitHub</a> •
  <a href="https://www.npmjs.com/package/@simpletoolsindia/beastcli">NPM</a> •
  <a href="https://discord.gg/simpletools">Discord</a>
</p>