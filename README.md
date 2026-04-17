# BeastCLI

**AI-powered coding agent — runs GPT, Claude, Gemini, DeepSeek, and 200+ models in your terminal.**

<p align="center">
  <a href="https://www.npmjs.com/package/@simpletoolsindia/beastcli"><img src="https://img.shields.io/badge/NPM-v1.1.2-FF6B35?style=for-the-badge&logo=npm" alt="NPM"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node-20+-339933?style=for-the-badge&logo=node.js" alt="Node"></a>
  <a href="https://github.com/simpletoolsindia/beastcli/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-4ECDC4?style=for-the-badge" alt="License"></a>
  <a href="https://discord.gg/simpletools"><img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord" alt="Discord"></a>
</p>

---

## Install

```bash
npm install -g @simpletoolsindia/beastcli
beastcli --version    # verify installation
```

Requires **Node.js 20+**.

---

## Quick Start

```bash
# Start interactive setup (auto-detects your provider)
beastcli

# Or set up via environment variables
OPENAI_API_KEY=sk-... beastcli -p "write a hello world in python"
```

---

## Provider Setup

BeastCLI works with any OpenAI-compatible API. Set one of these:

### Ollama (Free & Local)

```bash
# Install: https://ollama.ai
ollama pull qwen2.5-coder:7b

beastcli -p "write hello world" \
  --provider ollama \
  --bare
```

Or with environment variables:
```bash
BEASTCLI_PROVIDER=ollama \
OPENAI_BASE_URL=http://localhost:11434/v1 \
OPENAI_MODEL=qwen2.5-coder:7b \
beastcli -p "write hello world" --bare
```

### OpenRouter (200+ Models)

Get a key at [openrouter.ai/keys](https://openrouter.ai/keys), then:

```bash
OPENAI_API_KEY=sk-or-v1-... \
OPENAI_BASE_URL=https://openrouter.ai/api/v1 \
OPENAI_MODEL=google/gemma-3-4b-it \
beastcli -p "write hello world" --bare
```

**Free models on OpenRouter:** `google/gemma-3-4b-it`, `deepseek/deepseek-chat-v3-0324:free`, `qwen/qwen-2.5-72b-instruct:free`

### NVIDIA NIM (GPU Accelerated)

Get a key at [ngc.nvidia.com](https://ngc.nvidia.com/), then:

```bash
OPENAI_API_KEY=nvapi-... \
OPENAI_BASE_URL=https://integrate.api.nvidia.com/v1 \
OPENAI_MODEL=google/gemma-3-4b-it \
beastcli -p "write hello world" --bare
```

### OpenAI / Anthropic / Gemini

```bash
# OpenAI
OPENAI_API_KEY=sk-... beastcli -p "write hello world" --bare

# Anthropic
ANTHROPIC_API_KEY=sk-ant-... beastcli -p "write hello world" --bare

# Gemini (OpenAI-compatible endpoint)
GOOGLE_API_KEY=... \
OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai \
OPENAI_MODEL=gemini-2.0-flash \
beastcli -p "write hello world" --bare
```

---

## All Providers

| Provider | Base URL | API Key Env Var |
|----------|----------|----------------|
| Ollama | `http://localhost:11434/v1` | None |
| OpenRouter | `https://openrouter.ai/api/v1` | `OPENAI_API_KEY` |
| NVIDIA NIM | `https://integrate.api.nvidia.com/v1` | `OPENAI_API_KEY` |
| OpenAI | `https://api.openai.com/v1` | `OPENAI_API_KEY` |
| Anthropic | (default) | `ANTHROPIC_API_KEY` |
| DeepSeek | `https://api.deepseek.com/v1` | `OPENAI_API_KEY` |
| Groq | `https://api.groq.com/openai/v1` | `OPENAI_API_KEY` |
| Together AI | `https://api.together.xyz/v1` | `OPENAI_API_KEY` |
| LM Studio | `http://localhost:1234/v1` | None |
| Custom | Any OpenAI-compatible | `OPENAI_API_KEY` |

---

## CLI Usage

### Interactive Mode
```bash
beastcli                      # full interactive REPL
beastcli --provider ollama    # specify provider at startup
beastcli --model llama3.2     # specify model
```

### Non-Interactive Mode (`-p`)
```bash
beastcli -p "write hello world in python"     # single prompt, print output
beastcli -p "explain this: $(cat file.py)"     # pipe input
echo "fix this bug" | beastcli -p              # stdin input
beastcli -p --model gpt-4o "analyze this code" # specify model
```

### Scripting / CI Mode (`--bare`)
```bash
# Minimal mode: skips UI, auth, plugins — for scripts and CI
beastcli -p "write tests" --bare

# Chain prompts
beastcli -p "plan the feature" --bare > plan.txt
beastcli -p "implement based on plan" --bare
```

---

## Built-in Tools (No API Key Required)

These run locally without any API key:

| Tool | Example | Description |
|------|---------|-------------|
| Calculator | `/calc 2+2` | Math operations |
| UUID | `/uuid` | UUID v1/v4/v7 |
| Hash | `/hash sha256 "text"` | MD5, SHA, etc. |
| Base64 | `/base64 encode "hi"` | Encode/decode |
| JSON | `/json format '{}'` | Format/validate |
| QR Code | `/qr "https://..."` | Generate QR |
| Color | `/color #FF0000` | HEX/RGB/HSL |
| URL | `/url parse "..."` | Parse/encode URLs |
| Regex | `/regex "[a-z]+" "abc"` | Test regex |
| Password | `/password 16` | Secure passwords |
| Text Diff | `/diff "a" "b"` | Compare text |
| Text Stats | `/stats "text"` | Word count, etc. |
| Lorem | `/lorem 5` | Placeholder text |
| Cron | `/cron "0 9 * * *"` | Parse cron |
| Timezone | `/tz Tokyo` | Time zones |
| Currency | `/currency 100 USD EUR` | Conversion |
| IP Lookup | `/ip 8.8.8.8` | Geolocation |
| Weather | `/weather Tokyo` | Current weather |
| News | `/news tech` | Tech news |
| Timestamp | `/timestamp` | Unix time |
| YouTube | `/transcript "url"` | Video transcripts |

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `/help` | Show help |
| `/clear` | Clear chat |
| `/config` | Open settings UI |
| `/provider` | Manage providers |
| `/doctor` | Run diagnostics |
| `/commit` | Git commit wizard |
| `/diff` | Show changes |
| `/plan` | Structured planning |
| `/task` | Task management |
| `/agent` | Spawn sub-agent |
| `/compact` | Compact context |
| `/mcp add` | Add MCP server |
| `/skills` | List/install skills |

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+C` | Cancel operation |
| `Ctrl+D` | Exit BeastCLI |
| `Tab` | Autocomplete |
| `↑/↓` | Command history |
| `Ctrl+L` | Clear terminal |

---

## Configuration Files

Settings are stored at:
- **macOS/Linux:** `~/.beastcli/config.json`
- **Windows:** `%USERPROFILE%/.beastcli/config.json`

To reset to defaults:
```bash
rm ~/.beastcli/config.json
beastcli    # fresh setup
```

---

## Troubleshooting

**"command not found" after install:**
```bash
# Find where it was installed
which beastcli

# If using nvm, run:
npm install -g @simpletoolsindia/beastcli
hash -r
```

**Ollama not connecting:**
```bash
ollama serve            # ensure server is running
curl http://localhost:11434  # should return version
```

**Rate limited (NVIDIA/OpenAI):**
- Wait 60 seconds and retry
- Use a local model (Ollama) to avoid limits

**Context too long:**
```bash
/compact    # compact conversation context
```

---

## Develop

```bash
git clone https://github.com/simpletoolsindia/beastcli
cd beastcli
npm install          # or: bun install
bun run build        # build dist/cli.mjs
bun test             # run test suite
```

**Debug build errors:**
```bash
bun run build 2>&1 | grep -i error
```

---

## License

MIT — see [LICENSE](LICENSE)

---

<p align="center">
  <strong>Built by <a href="https://simpletools.in">SimpleTools India</a></strong>
  <br>
  <a href="https://github.com/simpletoolsindia/beastcli">GitHub</a> ·
  <a href="https://www.npmjs.com/package/@simpletoolsindia/beastcli">NPM</a> ·
  <a href="https://discord.gg/simpletools">Discord</a>
</p>
