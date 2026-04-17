import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { Box, Text } from 'src/ink.js';
import { getGlobalConfig, saveGlobalConfig } from 'src/utils/config.js';

/**
 * BeastCLI tips that rotate through showing useful hints
 * Gen-Z vibes, keeping it crispy and fun! 🔥
 */
const BEAST_TIPS = [
  { tip: '🐺 Ctrl+S to switch modes - stay in the vibes! 🕹️', color: 'dim' },
  { tip: '🦙 Running local? /provider + Ollama = free & bussin! 🦙', color: 'dim' },
  { tip: '⚡ NVIDIA NIM = lightning fast GPU vibes! Config with /provider!', color: 'dim' },
  { tip: '🎯 OpenRouter = 200+ models, one API key. No cap! Try /provider!', color: 'dim' },
  { tip: '🚫 Ctrl+C to cancel - no cap, no wait!', color: 'dim' },
  { tip: '🍃 /clear = fresh start, clean slate vibes!', color: 'dim' },
  { tip: '🔄 Shift+Tab cycles permission modes - flex your control!', color: 'dim' },
  { tip: '🔌 MCP servers? /mcp to connect your tools - its giving!', color: 'dim' },
  { tip: '📊 /tools = 21 free tools, zero API key drama!', color: 'dim' },
  { tip: '🌐 Web search? /search or /web-fetch - stay online king!', color: 'dim' },
  { tip: '💾 /resume = pick up where you left off, no loss!', color: 'dim' },
  { tip: '📝 /commit = git commit game on point!', color: 'dim' },
  { tip: '🤖 /agent = spawn sub-agents, its giving automation!', color: 'dim' },
  { tip: '📋 /task = task lists that hit different!', color: 'dim' },
  { tip: '🔍 /grep = find stuff faster than you can say "sus"!', color: 'dim' },
  { tip: '🧠 /compact = compress context, no context cliff!', color: 'dim' },
  { tip: '⚡ /batch = process multiple files, speedrun edition!', color: 'dim' },
  { tip: '🎨 /theme = customize your terminal aesthetic!', color: 'dim' },
  { tip: '💫 /loop = cron jobs that hit different!', color: 'dim' },
  { tip: '🔥 /review = code review game strong!', color: 'dim' },
  { tip: '✨ /plan = structured planning, no cap!', color: 'dim' },
  { tip: '🎮 /stuck = unstuck yourself, no Ls taken!', color: 'dim' },
  { tip: '💻 /doctor = diagnose issues like a pro!', color: 'dim' },
  { tip: '🚀 /stats = see your token usage stats!', color: 'dim' },
];

export function EmergencyTip(): React.ReactNode {
  // Get a rotating tip based on session
  const tip = useMemo(() => {
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const tipIndex = (hour * 60 + minute) % BEAST_TIPS.length;
    return BEAST_TIPS[tipIndex];
  }, []);

  const lastShownTip = useMemo(() => getGlobalConfig().lastShownEmergencyTip, []);

  const shouldShow = tip.tip !== lastShownTip;

  useEffect(() => {
    if (shouldShow) {
      saveGlobalConfig(current => {
        if (current.lastShownEmergencyTip === tip.tip) return current;
        return { ...current, lastShownEmergencyTip: tip.tip };
      });
    }
  }, [shouldShow, tip.tip]);

  if (!shouldShow) return null;

  return <Box paddingLeft={2} flexDirection="column">
    <Text {...tip.color === 'warning' ? { color: 'warning' } : tip.color === 'error' ? { color: 'error' } : { dimColor: true }}>
      {tip.tip}
    </Text>
  </Box>;
}
