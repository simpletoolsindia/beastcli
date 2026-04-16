# 🦍 BeastCLI

**The Ultimate AI-Powered Coding Agent for Developers**

<p align="center">
  <img src="https://img.shields.io/badge/NPM-v1.0.0-FF6B35?style=for-the-badge&logo=npm" alt="NPM Version">
  <img src="https://img.shields.io/badge/Node-20+-339933?style=for-the-badge&logo=node.js" alt="Node Version">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/License-MIT-4ECDC4?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/Platform-macOS%20%7C%20Linux%20%7C%20Windows-2ECC71?style=for-the-badge" alt="Platform">
</p>

---

## ✨ What is BeastCLI?

BeastCLI is a powerful, open-source AI coding agent that brings intelligent automation to your terminal. It leverages cutting-edge AI models from **NVIDIA NIM**, **OpenRouter**, **OpenAI**, **Gemini**, and many more providers to help you code faster, smarter, and more efficiently.

### 🎯 Core Features

- 🤖 **Multi-Provider AI Support** - Connect to NVIDIA NIM, OpenRouter, OpenAI, Gemini, Ollama, and 200+ models
- ⚡ **Lightning Fast** - Built with Bun for blazing performance
- 🛠️ **Powerful Tools** - Bash, file operations, grep, glob, agents, tasks, MCP support
- 📡 **Real-time Streaming** - Live token output and tool progress
- 🎨 **Beautiful Terminal UI** - Rich, colored output with modern Ink-based interface
- 🔌 **MCP Server Support** - Connect to Model Context Protocol servers
- 💾 **Local Model Support** - Run with Ollama, LM Studio, or any OpenAI-compatible server

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

That's it! You're ready to code with AI power.

---

## 🔥 Quick Setup Examples

### NVIDIA NIM

Get your API key from [build.nvidia.com](https://build.nvidia.com/) and run:

```bash
export NVIDIA_API_KEY=nvapi-your-key-here
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_BASE_URL=https://integrate.api.nvidia.com/v1
export OPENAI_MODEL=nvidia/llama-3.1-nemotron-70b-instruct

beastcli
```

### OpenRouter (200+ Models)

Get your API key from [openrouter.ai](https://openrouter.ai/) and run:

```bash
export OPENROUTER_API_KEY=sk-or-your-key-here
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_BASE_URL=https://openrouter.ai/api/v1
export OPENAI_MODEL=anthropic/claude-3.5-sonnet

beastcli
```

### OpenAI

```bash
export OPENAI_API_KEY=sk-your-key-here
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_MODEL=gpt-4o

beastcli
```

### Ollama (Local)

```bash
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_BASE_URL=http://localhost:11434/v1
export OPENAI_MODEL=llama3.2

beastcli
```

---

## 🏗️ Supported Providers

| Provider | Description | Setup |
|----------|-------------|-------|
| **NVIDIA NIM** | NVIDIA GPU-powered inference | [build.nvidia.com](https://build.nvidia.com/) |
| **OpenRouter** | 200+ models, unified API | [openrouter.ai](https://openrouter.ai/) |
| **OpenAI** | GPT-4, GPT-4o, GPT-3.5 | API key |
| **Google Gemini** | Gemini Pro, Flash | API key |
| **GitHub Models** | GitHub-hosted models | OAuth |
| **Ollama** | Local model inference | [ollama.com](https://ollama.com/) |
| **LM Studio** | Local model server | [lmstudio.ai](https://lmstudio.ai/) |
| **AWS Bedrock** | AWS-hosted models | AWS credentials |
| **Google Vertex** | GCP-hosted models | GCP project |

---

## 🎨 Features in Detail

### Intelligent Coding Workflows

```
✅ Bash commands
✅ File read/write/edit
✅ Grep search
✅ Glob pattern matching
✅ Multi-agent support
✅ Task management
✅ MCP server integration
✅ Web search & fetch
✅ Streaming responses
```

### Agent Routing

Configure different models for different tasks:

```json
{
  "agentModels": {
    "fast": {
      "base_url": "https://openrouter.ai/api/v1",
      "api_key": "sk-or-your-key"
    },
    "powerful": {
      "base_url": "https://integrate.api.nvidia.com/v1",
      "api_key": "nvapi-your-key"
    }
  },
  "agentRouting": {
    "Explore": "fast",
    "Plan": "powerful",
    "default": "fast"
  }
}
```

### Web Search

Built-in web search powered by DuckDuckGo (free) or premium providers like Firecrawl.

---

## 🛠️ Development

### Build from Source

```bash
# Clone the repository
git clone https://github.com/simpletoolsindia/beastcli.git
cd beastcli

# Install dependencies
bun install

# Build
bun run build

# Run
node dist/cli.mjs
```

### Available Commands

```bash
bun run dev          # Build and run
bun run test         # Run tests
bun run build        # Build for production
bun run smoke        # Quick smoke test
bun run typecheck    # TypeScript check
```

---

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      BeastCLI                           │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   NVIDIA    │  │  OpenRouter │  │   OpenAI    │     │
│  │    NIM      │  │     API     │  │    API      │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                │             │
│  ┌──────┴────────────────┴────────────────┴──────┐   │
│  │            AI Provider Abstraction              │   │
│  └────────────────────────┬────────────────────────┘   │
│                           │                            │
│  ┌────────────────────────┴────────────────────────┐  │
│  │           Core Engine + Tools                     │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────┐     │  │
│  │  │  Bash  │ │  File  │ │  Grep  │ │ MCP  │     │  │
│  │  └────────┘ └────────┘ └────────┘ └──────┘     │  │
│  └──────────────────────────────────────────────────┘  │
│                           │                            │
│  ┌────────────────────────┴────────────────────────┐  │
│  │              Terminal UI (Ink)                    │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🔒 Security & Privacy

- ✅ No telemetry collection (disabled by default)
- ✅ Local-only operation mode available
- ✅ Secure credential storage
- ✅ Private by design

---

## 📦 VS Code Extension

Get the BeastCLI VS Code extension for:
- 🖥️ Integrated terminal launch
- 🎯 Project-aware context
- 🎨 Terminal themes
- ⚙️ Provider-aware control center

---

## 🌟 Why BeastCLI?

| Feature | BeastCLI | Others |
|---------|----------|--------|
| NVIDIA NIM Support | ✅ Native | ❌ |
| OpenRouter Support | ✅ 200+ Models | ❌ |
| Local Model Support | ✅ Ollama, LM Studio | ⚠️ Limited |
| Performance | ⚡ Bun-powered | 🐢 Node-based |
| Multi-Provider | ✅ 10+ Providers | ⚠️ 1-2 |
| Open Source | ✅ MIT License | ❌ |

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit PRs.

```bash
# Fork and clone
git clone https://github.com/simpletoolsindia/beastcli.git

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git commit -m "feat: add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- 📘 [Documentation](docs/)
- 🐛 [Issue Tracker](https://github.com/simpletoolsindia/beastcli/issues)
- 💬 [Discussions](https://github.com/simpletoolsindia/beastcli/discussions)
- 📦 [NPM Package](https://www.npmjs.com/package/@simpletoolsindia/beastcli)

---

<p align="center">
  <strong>Made with ❤️ by <a href="https://github.com/simpletoolsindia">SimpleTools India</a></strong>
  <br>
  <sub>Star ⭐ the repo if you find BeastCLI useful!</sub>
</p>