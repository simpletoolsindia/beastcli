# 🐺 BeastCLI

**The Ultimate AI-Powered Coding Agent for Developers**

<p align="center">
  <img src="https://img.shields.io/badge/NPM-v1.0.6-FF6B35?style=for-the-badge&logo=npm" alt="NPM Version">
  <img src="https://img.shields.io/badge/Node-20+-339933?style=for-the-badge&logo=node.js" alt="Node Version">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/License-MIT-4ECDC4?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/Platform-macOS%20%7C%20Linux%20%7C%20Windows-2ECC71?style=for-the-badge" alt="Platform">
</p>

---

## ✨ What is BeastCLI?

BeastCLI is a powerful, open-source AI coding agent that brings intelligent automation to your terminal. It leverages cutting-edge AI models from **NVIDIA NIM**, **OpenRouter**, **OpenAI**, **Gemini**, **Ollama**, and **200+ providers** via OpenAI-compatible API. Built with TypeScript, React, and Ink for a beautiful terminal experience.

### 🎯 Core Features

- 🤖 **Multi-Provider AI** — NVIDIA NIM, OpenRouter, OpenAI, Gemini, Ollama, Mistral, Codex, and 200+ models via OpenAI-compatible API
- ⚡ **Built with Bun** — Fast startup and blazing performance
- 🛠️ **21 Native Tools** — Calculator, UUID, Weather, Currency, QR Code, YouTube Transcripts, and more — no API keys needed!
- 📡 **Real-time Streaming** — Live token output and tool progress
- 🎨 **Rich Terminal UI** — Colored output with an Ink-based React interface
- 🔌 **MCP Server Support** — Connect to Model Context Protocol servers for extended capabilities
- 💾 **Local Model Support** — Run with Ollama, fully offline and free
- 🦁 **Permission Modes** — Guidance, AutoPilot, Control, Observe — switch with `Ctrl+S`
- 🚀 **NVIDIA Rate Limiting** — 40 RPM support with exponential backoff
- 🔄 **Coordinator Mode** — Spawn worker sub-agents for parallel task execution
- ⏰ **Cron Scheduling** — Schedule recurring tasks with `/loop`
- 📝 **Skills System** — Extensible skills for batch processing, code review, simplify, and more
- 🧠 **Memory & Context** — Session memory, context collapse, and compact mode for long conversations
- 🔍 **Auto-Debug & Auto-Fix** — Built-in debugging assistance and automatic fix suggestions
- 📊 **Analytics & Observability** — OpenTelemetry integration, token estimation, usage stats
- 🌐 **Web Intelligence** — Web search, web fetch with Crawl4AI fallback, and news tools
- 🔑 **GitHub Integration** — PR reviews, issue management, branch handling, and GitHub App installation
- 📦 **Plugin System** — Extensible plugin architecture for custom functionality

---

## 🚀 Quick Start

### Installation

```bash
npm install -g @simpletoolsindia/beastcli
```

### Launch

```bash
beastcli
```

That's it! BeastCLI will guide you through the initial setup.

---

## ⚡ Quick Provider Setup

### NVIDIA NIM (Fast GPU Inference)

```bash
# Get your API key from https://ngc.nvidia.com/
export NVIDIA_API_KEY=nvapi-your-key-here
export OPENAI_BASE_URL=https://integrate.api.nvidia.com/v1
export OPENAI_MODEL=nvidia/llama-3.3-nemotron-70b-instruct

beastcli
```

### OpenRouter (200+ Models)

```bash
# Get your API key from https://openrouter.ai/
export OPENROUTER_API_KEY=sk-or-v1-xxx
export OPENAI_BASE_URL=https://openrouter.ai/api/v1
export OPENAI_MODEL=anthropic/claude-3.5-sonnet

beastcli
```

### Ollama (Local — Free & Offline)

```bash
# Install Ollama from https://ollama.ai/
ollama pull llama3.2
ollama pull mistral

export OPENAI_BASE_URL=http://localhost:11434/v1
export OPENAI_MODEL=llama3.2

beastcli
```

### OpenAI (GPT-4)

```bash
# Get your API key from https://platform.openai.com/
export OPENAI_API_KEY=sk-xxx
export OPENAI_BASE_URL=https://api.openai.com/v1
export OPENAI_MODEL=gpt-4o

beastcli
```

---

## 🏗️ Provider Configuration

BeastCLI supports **7 providers** with a guided interactive setup:

### Using /provider Command (Interactive)

```bash
/provider          # Open interactive provider manager — choose provider, set model, API key
```

The `/provider` wizard shows:
- **Current provider** and model in use
- **Saved profile** name
- Choice of: **Auto** (detects Ollama or guides OpenAI setup), **Ollama**, **OpenAI-compatible**, **Gemini**, **Mistral**, **Codex**, **Codex OAuth**, or **Clear saved profile**

### Using /provider setup (Quick CLI)

```bash
/provider setup nvidia     # Configure NVIDIA NIM (fast GPU inference)
/provider setup openrouter # Configure OpenRouter (200+ models)
/provider setup ollama     # Configure Ollama (local, free)
/provider setup openai     # Configure OpenAI (GPT-4)
/provider setup status     # View all provider key statuses
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NVIDIA_API_KEY` | NVIDIA NGC API key | `nvapi-xxx` |
| `OPENAI_API_KEY` | OpenAI-compatible API key | `sk-xxx` |
| `OPENAI_BASE_URL` | API base URL | `https://api.openai.com/v1` |
| `OPENAI_MODEL` | Model to use | `gpt-4o` |
| `OPENROUTER_API_KEY` | OpenRouter API key | `sk-or-v1-xxx` |
| `OLLAMA_BASE_URL` | Ollama server URL | `http://localhost:11434` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `GEMINI_MODEL` | Gemini model | `gemini-2.0-flash` |
| `MISTRAL_API_KEY` | Mistral API key | `...` |
| `MISTRAL_BASE_URL` | Mistral base URL | `https://api.mistral.ai/v1` |
| `MISTRAL_MODEL` | Mistral model | `mistral-large-latest` |
| `BEAST_PROVIDER` | Active provider name | `nvidia`, `ollama`, `openai` |
| `BEAST_MODEL` | Model override | `nvidia/llama-3.3-nemotron-70b` |
| `ENABLE_TOOL_SEARCH` | Enable tool deferral (reduces prompt size by ~6K tokens) | `true`, `auto`, `auto:N` |

### Switching Providers (Runtime)

Simply run `/provider` at any time — BeastCLI will show the current provider and let you switch. Provider profiles are saved to `~/.beastcli/beastcli-profile.json` and persist across sessions.

---

## 🛠️ 21 Native Tools (No API Keys Needed!)

All native tools work without any API configuration:

| # | Tool | Command | Description |
|---|------|---------|-------------|
| 1 | Calculator | `/calc 2+2` | Mathematical calculations |
| 2 | UUID Generator | `/uuid` | Generate UUIDs (v1, v4, v7) |
| 3 | Weather | `/weather London` | Current weather info |
| 4 | Timezone | `/tz Tokyo` | Time in any timezone |
| 5 | Timestamp | `/timestamp` | Current Unix timestamp |
| 6 | Currency | `/currency 100 USD to EUR` | Currency conversion |
| 7 | Hash | `/hash sha256 "text"` | Generate hashes (MD5, SHA-1, SHA-256, etc.) |
| 8 | Base64 | `/base64 encode "text"` | Base64 encode/decode |
| 9 | URL Tools | `/url parse "https://..."` | URL parsing & encoding |
| 10 | Regex | `/regex "pattern" "text"` | Test regex patterns |
| 11 | Password | `/password 16` | Generate secure passwords |
| 12 | QR Code | `/qr "text to encode"` | Generate QR codes |
| 13 | Text Diff | `/diff "text1" "text2"` | Compare text differences |
| 14 | JSON Format | `/json '{"key":"value"}'` | Format & validate JSON |
| 15 | Color Converter | `/color #FF6B35` | HEX/RGB/HSL conversion |
| 16 | Lorem Ipsum | `/lorem 5` | Generate placeholder text |
| 17 | Text Stats | `/stats "text"` | Word count, reading time |
| 18 | Cron Parser | `/cron "0 9 * * *"` | Parse cron expressions |
| 19 | News | `/news tech` | Latest tech news |
| 20 | IP Lookup | `/ip 8.8.8.8` | IP geolocation |
| 21 | YouTube Transcript | `/transcript "url"` | Get video transcripts |

### View All Tools

```bash
/tools        # List all available tools
/tools search # Search for specific tools
```

---

## 🦁 Permission Modes

BeastCLI features four permission modes for different use cases:

| Mode | Description | When to Use |
|------|-------------|-------------|
| **Guidance** | Asks before changes | Learning, reviewing code |
| **AutoPilot** | Auto-approves edits | Trusted coding sessions |
| **Control** | Full auto-accept | Automation, scripts |
| **Observe** | Read-only analysis | Code review |

### Switching Modes

- **Ctrl+S** — Cycle through all modes
- **Shift+Tab** — Toggle between Guidance and AutoPilot
- `/permissions` — View current mode

---

## 📁 Project Setup

### Create a New Project

```bash
mkdir my-project && cd my-project
beastcli
```

### Project Configuration

BeastCLI automatically looks for configuration in:

- `./.beastcli/settings.json` — Project settings
- `./.beastcli/skills/` — Project-specific skills
- `~/.beastcli/settings.json` — User settings
- `~/.beastcli/skills/` — User skills

---

## 🔌 MCP Server Support

Connect to Model Context Protocol servers for extended capabilities:

```bash
/mcp add <server-name>   # Add MCP server
/mcp list                # List connected servers
/mcp remove <name>       # Remove server
/mcp auth                # Manage MCP authentication
```

---

## ⏰ Skills System

Extensible skills that enhance BeastCLI's capabilities:

| Skill | Command | Description |
|-------|---------|-------------|
| Batch | `/batch` | Process multiple files in one go |
| Simplify | `/simplify` | Review changed code for reuse, quality, and efficiency |
| Loop | `/loop` | Schedule recurring tasks with cron syntax |
| Debug | `/debug` | Debug tool calls and execution |
| Update Config | `/update-config` | Configure Claude Code settings via CLI |
| Keybindings | `/keybindings` | Configure status line keybindings |
| Stuck | `/stuck` | Diagnose and recover from stuck states |
| Verify Content | `/verify` | Verify generated content quality |
| Claude API | `/claude-api` | Manage Claude API settings |

### View All Skills

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
| `/model` | Change AI model |
| `/provider` | Configure providers |
| `/tools` | List built-in tools |
| `/doctor` | Run diagnostics |

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
| `/plan` | Plan implementation |
| `/plan-ultra` | Detailed planning mode |
| `/task` | Create task list |
| `/thinkback` | Rewind conversation context |
| `/compact` | Compact context for long sessions |
| `/team` | Multi-agent team coordination |

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
| `/feedback` | Submit feedback |

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
/theme                  # View themes
/theme set dark         # Set dark theme
/theme set light        # Set light theme
/theme set midnight     # Set midnight theme
```

### Output Styles

```bash
/output-style           # View output styles
/output-style set <name> # Set style
```

### Status Line

```bash
/statusline             # Configure status line
```

---

## 🔧 Configuration Files

### settings.json

```json
{
  "permissions": "ask",
  "model": "nvidia/llama-3.3-nemotron-70b-instruct",
  "theme": "dark",
  "outputStyle": "default"
}
```

### .env File

Create `~/.beastcli/.env` for persistent environment variables:

```bash
NVIDIA_API_KEY=nvapi-your-key
OPENROUTER_API_KEY=sk-or-v1-xxx
OPENAI_API_KEY=sk-xxx
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_MODEL=anthropic/claude-3.5-sonnet
```

---

## 🐛 Troubleshooting

### Initial prompt too large?

If you're using a third-party provider (NVIDIA NIM, OpenRouter, Ollama, etc.) and the initial prompt feels large, enable **Tool Search** to defer 21 native tools:

```bash
export ENABLE_TOOL_SEARCH=true
```

This saves approximately **~6,000 tokens** per request by loading native tools (Calculator, UUID, Weather, QR Code, etc.) on-demand instead of upfront. When you need a native tool, just ask — BeastCLI will fetch its schema automatically.



### Provider Issues

```bash
/doctor                  # Run diagnostics
/provider setup status   # Check provider status
```

### Common Problems

**NVIDIA Rate Limited?**
- Wait 60 seconds (default 40 RPM limit)
- Or configure via `/rate-limit-options`

**OpenRouter Slow?**
- Try a different model
- Check API status at openrouter.ai

**Ollama Not Found?**
- Install from ollama.ai
- Run `ollama serve` to start server
- Try `ollama pull llama3.2`

---

## 📊 Architecture

```
┌──────────────────────────────────────────────┐
│                  BeastCLI CLI                  │
├──────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────────┐       │
│  │  Commands   │  │      Tools       │       │
│  │  (90+ cmds) │  │  Native / CLI /  │       │
│  └─────────────┘  │  MCP / Agent     │       │
│  ┌─────────────┐  └──────────────────┘       │
│  │   Skills    │  ┌──────────────────┐       │
│  │  (12 built) │  │    Coordinator    │       │
│  └─────────────┘  │  (Multi-Agent)   │       │
├──────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐    │
│  │        AI Provider Layer              │    │
│  │  NVIDIA │ OpenRouter │ OpenAI │      │    │
│  │  Gemini │ Ollama │ Mistral │ Codex  │    │
│  │  200+ OpenAI-compatible providers    │    │
│  └──────────────────────────────────────┘    │
├──────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────────┐       │
│  │    MCP      │  │   Services       │       │
│  │  Servers    │  │  Analytics,      │       │
│  │             │  │  RateLimits,     │       │
│  │             │  │  Plugins, LSP     │       │
│  └─────────────┘  └──────────────────┘       │
└──────────────────────────────────────────────┘
```

---

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT License — see LICENSE file for details.

---

<p align="center">
  <strong>Built with ❤️ by SimpleTools India</strong>
  <br>
  <a href="https://github.com/simpletoolsindia/beastcli">GitHub</a> •
  <a href="https://www.npmjs.com/package/@simpletoolsindia/beastcli">NPM</a> •
  <a href="https://discord.gg/simpletools">Discord</a>
</p>
