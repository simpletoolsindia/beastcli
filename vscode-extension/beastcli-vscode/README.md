# BeastCLI VS Code Extension

A practical VS Code companion for BeastCLI with a project-aware **Control Center**, predictable terminal launch behavior, and quick access to useful BeastCLI workflows.

## Features

- **Real Control Center status** in the Activity Bar:
  - whether the configured `beastcli` command is installed
  - the launch command being used
  - whether the launch shim injects `CLAUDE_CODE_USE_OPENAI=1`
  - the current workspace folder
  - the launch cwd that will be used for terminal sessions
  - whether `.beastcli-profile.json` exists in the current workspace root
  - a conservative provider summary derived from the workspace profile or known environment flags
- **Project-aware launch behavior**:
  - `Launch BeastCLI` launches from the active editor's workspace when possible
  - falls back to the first workspace folder when needed
  - avoids launching from an arbitrary default cwd when a project is open
- **Practical sidebar actions**:
  - Launch BeastCLI
  - Launch in Workspace Root
  - Open Workspace Profile
  - Open Repository
  - Open Setup Guide
  - Open Command Palette
- **Built-in dark theme**: `BeastCLI Terminal Black`

## Requirements

- VS Code `1.95+`
- `beastcli` available in your terminal PATH (`npm install -g @gitlawb/beastcli`)

## Commands

- `BeastCLI: Open Control Center`
- `BeastCLI: Launch in Terminal`
- `BeastCLI: Launch in Workspace Root`
- `BeastCLI: Open Repository`
- `BeastCLI: Open Setup Guide`
- `BeastCLI: Open Workspace Profile`

## Settings

- `beastcli.launchCommand` (default: `beastcli`)
- `beastcli.terminalName` (default: `BeastCLI`)
- `beastcli.useOpenAIShim` (default: `false`)

`beastcli.useOpenAIShim` only injects `CLAUDE_CODE_USE_OPENAI=1` into terminals launched by the extension. It does not guess or configure a provider by itself.

## Notes on Status Detection

- Provider status prefers the real workspace `.beastcli-profile.json` file when present.
- If no saved profile exists, the extension falls back to known environment flags available to the VS Code extension host.
- If the source of truth is unclear, the extension shows `unknown` instead of guessing.

## Development

From this folder:

```bash
npm run test
npm run lint
```

To package (optional):

```bash
npm run package
```

