import { c as _c } from "react-compiler-runtime";
import React, { useMemo } from 'react';
import { Box, Text, useTheme } from 'src/ink.js';
import { env } from '../../utils/env.js';

declare const MACRO: { VERSION: string; DISPLAY_VERSION?: string }

const WELCOME_V2_WIDTH = 58;

// Startup vibes
const STARTUP_VIBES = [
  '⚡ BOOTSTRAPPING...',
  '🎯 READY TO BUILD...',
  '🔥 POWERING UP...',
  '✨ BEAST MODE: ON...',
  '🚀 LAUNCHING...',
  '💫 LOADED & LOCKED...',
];

function getRandomStartupVibe(): string {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const index = (hour * 60 + minute) % STARTUP_VIBES.length;
  return STARTUP_VIBES[index]!;
}

function getRandomTip(): string {
  const tips = [
    '/provider - Switch AI providers',
    '/tools    - 21 built-in tools',
    'Ctrl+S   - Switch permission modes',
    '/mcp      - Connect MCP servers',
    '/compact  - Compact context',
  ]
  return tips[Math.floor(Math.random() * tips.length)]!
}

export function WelcomeV2() {
  const $ = _c(50);
  const [theme] = useTheme();

  const startupVibe = useMemo(() => getRandomStartupVibe(), []);
  const quickTip = useMemo(() => getRandomTip(), []);

  if (env.terminal === "Apple_Terminal") {
    let t0;
    if ($[0] !== theme) {
      t0 = <AppleTerminalWelcomeV2 theme={theme} welcomeMessage="Welcome to BeastCLI" />;
      $[0] = theme;
      $[1] = t0;
    } else {
      t0 = $[1];
    }
    return t0;
  }

  const isLight = ["light", "light-daltonized", "light-ansi"].includes(theme);

  // Slots 2-14 for light theme
  let t0, t1, t2, t3, t4, t5, t6, t7;
  if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <Text><Text color="beastcli" bold={true}>BEASTCLI</Text><Text dimColor={true}> v{MACRO.DISPLAY_VERSION ?? MACRO.VERSION}</Text></Text>;
    t1 = <Text color={isLight ? undefined : "beastcli"}>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</Text>;
    t2 = <Text dimColor={true}>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</Text>;
    t3 = <Text color="beastcli" bold={true}>{`  ${startupVibe}`}</Text>;
    t4 = <Text dimColor={true}>{`  ${quickTip}`}</Text>;
    t5 = <Text dimColor={true}>{"  /provider - NVIDIA NIM, OpenRouter, Ollama, Claude, OpenAI"}</Text>;
    t6 = <Text dimColor={true}>{"  /tools    - 21 built-in tools (no API key needed)          "}</Text>;
    t7 = <Text dimColor={true}>{"  Ctrl+S    - Switch permission modes                       "}</Text>;
    $[2] = t0; $[3] = t1; $[4] = t2; $[5] = t3; $[6] = t4; $[7] = t5; $[8] = t6; $[9] = t7;
  } else {
    t0 = $[2]; t1 = $[3]; t2 = $[4]; t3 = $[5]; t4 = $[6]; t5 = $[7]; t6 = $[8]; t7 = $[9];
  }
  let t8;
  if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
    t8 = <Box width={WELCOME_V2_WIDTH} flexDirection="column" alignItems="center">
      <Text bold={true}>{t0}</Text>
      <Text>{t1}</Text>
      <Text>{t2}</Text>
      <Text bold={true} color="beastcli">{t3}</Text>
      <Text>{t4}</Text>
      <Text>{t5}</Text>
      <Text>{t6}</Text>
      <Text>{t7}</Text>
    </Box>;
    $[10] = t8;
  } else {
    t8 = $[10];
  }
  return t8;
}

type AppleTerminalWelcomeV2Props = {
  theme: string;
  welcomeMessage: string;
};

function AppleTerminalWelcomeV2({ theme, welcomeMessage }: AppleTerminalWelcomeV2Props) {
  const $ = _c(50);
  const startupVibe = useMemo(() => getRandomStartupVibe(), []);
  const isLight = ["light", "light-daltonized", "light-ansi"].includes(theme);

  let t1, t2, t3, t4, t5, t6;
  if ($[11] !== welcomeMessage) {
    t1 = <Text color="beastcli">{welcomeMessage} </Text>;
    $[11] = welcomeMessage;
    $[12] = t1;
  } else {
    t1 = $[12];
  }
  if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
    t2 = <Text dimColor={true}>v{MACRO.DISPLAY_VERSION ?? MACRO.VERSION} </Text>;
    t3 = <Text color={isLight ? undefined : "beastcli"}>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</Text>;
    t4 = <Text color="beastcli" bold={true}>{`  ${startupVibe}`}</Text>;
    t5 = <Text dimColor={true}>{"  /provider - NVIDIA NIM, OpenRouter, Ollama, Claude, OpenAI"}</Text>;
    t6 = <Text dimColor={true}>{"  /tools    - 21 built-in tools (no API key needed)          "}</Text>;
    $[13] = t2; $[14] = t3; $[15] = t4; $[16] = t5; $[17] = t6;
  } else {
    t2 = $[13]; t3 = $[14]; t4 = $[15]; t5 = $[16]; t6 = $[17];
  }
  let t7;
  if ($[18] !== t1) {
    t7 = <Box width={WELCOME_V2_WIDTH} flexDirection="column" alignItems="center">
      <Text>{t1}{t2}</Text>
      <Text>{t3}</Text>
      <Text bold={true} color="beastcli">{t4}</Text>
      <Text>{t5}</Text>
      <Text>{t6}</Text>
    </Box>;
    $[18] = t1;
    $[19] = t7;
  } else {
    t7 = $[19];
  }
  return t7;
}
