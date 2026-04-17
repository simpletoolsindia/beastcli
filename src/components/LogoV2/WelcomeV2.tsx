import { c as _c } from "react-compiler-runtime";
import React, { useMemo } from 'react';
import { Box, Text, useTheme } from 'src/ink.js';
import { env } from '../../utils/env.js';

const WELCOME_V2_WIDTH = 58;

// Gen-Z startup vibes - rotates based on time
const STARTUP_VIBES = [
  '🐺 BOOGIEING MODE! 💃',
  '⚡ BOOTSTRAPPING... 🚀',
  '🎯 CHANNELLING THE VIBES ✨',
  '🔥 LEVITATING TOOLS 🛸',
  '🎪 LEVELING UP! 📈',
  '🌟 VIBING WITH CODE ⚡',
  '🎨 SPARKLING UP! ✦',
  '🦄 UNICORN MODE! 🦄',
  '🎮 GAME ON! 🕹️',
  '🌊 RIDING THE WAVE 🌊',
  '🎭 BEAST MODE: ACTIVATED 🐺',
  '💫 COSMIC ENERGY LOADING 💫',
];

function getRandomStartupVibe(): string {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const index = (hour * 60 + minute) % STARTUP_VIBES.length;
  return STARTUP_VIBES[index]!;
}

// Gen-Z quick tips - fun and trendy
const QUICK_TIPS = [
  '/provider - Switch AI providers like changing playlists!',
  '/tools - 21 free tools, no API key drama!',
  'Ctrl+S - Cycle modes, stay in control!',
  '/mcp - Connect MCP servers like plugging in!',
  '/loop - Set cron jobs, automate your life!',
  '/batch - Process files like a boss!',
  '/simplify - Clean code, keep it crispy!',
];

function getRandomTip(): string {
  const index = Math.floor(Math.random() * QUICK_TIPS.length);
  return QUICK_TIPS[index]!;
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

  // Light theme - clean beast logo
  if (["light", "light-daltonized", "light-ansi"].includes(theme)) {
    let t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
      t0 = <Text><Text color="beastcli" bold={true}>🐺 BEAST-CLI</Text><Text dimColor={true}> v{MACRO.DISPLAY_VERSION ?? MACRO.VERSION}</Text></Text>;
      t1 = <Text dimColor={true}>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</Text>;
      t2 = <Text>{"                                                      "}</Text>;
      t3 = <Text color="beastcli">{"       /\\"}</Text>;
      t4 = <Text color="beastcli">{"      ◉◉  "}</Text>;
      t5 = <Text color="beastcli">{"     /  \\"}</Text>;
      t6 = <Text color="beastcli">{"    /____\\"}</Text>;
      t7 = <Text color="beastcli" dimColor={true}>{"      ███  "}</Text>;
      t8 = <Text color="beastcli" dimColor={true}>{"   ~~~  "}</Text>;
      t9 = <Text>{"                                                      "}</Text>;
      t10 = <Text dimColor={true}>{`  ${quickTip}`}</Text>;
      t11 = <Text dimColor={true}>{"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"}</Text>;
      t12 = <Text color="beastcli" bold={true}>{`  ${startupVibe}`}</Text>;
      t13 = <Text dimColor={true}>{"  /provider - Configure AI providers                    "}</Text>;
      t14 = <Text dimColor={true}>{"  Ctrl+S - Switch modes | /tools - Native tools         "}</Text>;
      $[2] = t0; $[3] = t1; $[4] = t2; $[5] = t3; $[6] = t4; $[7] = t5; $[8] = t6;
      $[9] = t7; $[10] = t8; $[11] = t9; $[12] = t10; $[13] = t11; $[14] = t12; $[15] = t13; $[16] = t14;
    } else {
      t0 = $[2]; t1 = $[3]; t2 = $[4]; t3 = $[5]; t4 = $[6]; t5 = $[7]; t6 = $[8];
      t7 = $[9]; t8 = $[10]; t9 = $[11]; t10 = $[12]; t11 = $[13]; t12 = $[14]; t13 = $[15]; t14 = $[16];
    }
    let t15;
    if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
      t15 = <Box width={WELCOME_V2_WIDTH} flexDirection="column" alignItems="center">
        <Text bold={true}>{t0}</Text>
        <Text>{t1}</Text>
        <Text>{t2}</Text>
        <Box flexDirection="row" marginY={1}>{t3}{t4}{t5}{t6}</Box>
        <Box flexDirection="row">{t7}{t8}</Box>
        <Text>{t9}</Text>
        <Text>{t10}</Text>
        <Text>{t11}</Text>
        <Text bold={true} color="beastcli">{t12}</Text>
        <Text>{t13}</Text>
        <Text>{t14}</Text>
      </Box>;
      $[17] = t15;
    } else {
      t15 = $[17];
    }
    return t15;
  }

  // Dark theme - full beast logo with dramatic styling
  let t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15;
  if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <Text><Text color="beastcli" bold={true}>🐺 BEAST-CLI</Text><Text dimColor={true}> v{MACRO.DISPLAY_VERSION ?? MACRO.VERSION}</Text></Text>;
    t1 = <Text color="beastcli">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</Text>;
    t2 = <Text>{"                                                      "}</Text>;
    // Beast ASCII art - wolf head
    t3 = <Text color="beastcli" bold={true}>{"      /\\      ◉◉      /\\    "}</Text>;
    t4 = <Text color="beastcli">{"     /  \\____________/  \\   "}</Text>;
    t5 = <Text color="beastcli">{"    /    \\________/    \\  "}</Text>;
    t6 = <Text color="beastcli">{"   /______\\      /______\\ "}</Text>;
    t7 = <Text color="beastcli">{"           ████████████      "}</Text>;
    t8 = <Text color="beastcli">{"           ═══════════       "}</Text>;
    t9 = <Text>{"                                                      "}</Text>;
    t10 = <Text color="beastcli" bold={true}>{`  ${startupVibe}`}</Text>;
    t11 = <Text dimColor={true}>{"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"}</Text>;
    t12 = <Text dimColor={true}>{"  /provider - NVIDIA NIM, OpenRouter, Ollama, ChatGPT setup"}</Text>;
    t13 = <Text dimColor={true}>{"  /tools    - 21 built-in tools (no API key drama)          "}</Text>;
    t14 = <Text dimColor={true}>{`  ${quickTip}`}</Text>;
    t15 = <Text dimColor={true}>{"  /help     - Full command reference                       "}</Text>;
    $[17] = t0; $[18] = t1; $[19] = t2; $[20] = t3; $[21] = t4; $[22] = t5; $[23] = t6;
    $[24] = t7; $[25] = t8; $[26] = t9; $[27] = t10; $[28] = t11; $[29] = t12;
    $[30] = t13; $[31] = t14; $[32] = t15;
  } else {
    t0 = $[17]; t1 = $[18]; t2 = $[19]; t3 = $[20]; t4 = $[21]; t5 = $[22]; t6 = $[23];
    t7 = $[24]; t8 = $[25]; t9 = $[26]; t10 = $[27]; t11 = $[28]; t12 = $[29];
    t13 = $[30]; t14 = $[31]; t15 = $[32];
  }
  let t16;
  if ($[33] === Symbol.for("react.memo_cache_sentinel")) {
    t16 = <Box width={WELCOME_V2_WIDTH} flexDirection="column" alignItems="center">
      <Text bold={true}>{t0}</Text>
      <Text>{t1}</Text>
      <Text>{t2}</Text>
      <Text>{t3}</Text>
      <Text>{t4}</Text>
      <Text>{t5}</Text>
      <Text>{t6}</Text>
      <Text>{t7}</Text>
      <Text>{t8}</Text>
      <Text>{t9}</Text>
      <Text bold={true} color="beastcli">{t10}</Text>
      <Text>{t11}</Text>
      <Text>{t12}</Text>
      <Text>{t13}</Text>
      <Text>{t14}</Text>
      <Text>{t15}</Text>
    </Box>;
    $[33] = t16;
  } else {
    t16 = $[33];
  }
  return t16;
}

type AppleTerminalWelcomeV2Props = {
  theme: string;
  welcomeMessage: string;
};

function AppleTerminalWelcomeV2({ theme, welcomeMessage }: AppleTerminalWelcomeV2Props) {
  const $ = _c(50);
  const startupVibe = useMemo(() => getRandomStartupVibe(), []);
  const isLightTheme = ["light", "light-daltonized", "light-ansi"].includes(theme);

  if (isLightTheme) {
    let t1, t2, t3, t4, t5, t6, t7, t8, t9, t10;
    if ($[0] !== welcomeMessage) {
      t1 = <Text color="beastcli">{welcomeMessage} </Text>;
      $[0] = welcomeMessage;
      $[1] = t1;
    } else {
      t1 = $[1];
    }
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
      t2 = <Text dimColor={true}>v{MACRO.DISPLAY_VERSION ?? MACRO.VERSION} </Text>;
      t3 = <Text dimColor={true}>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</Text>;
      t4 = <Text color="beastcli">{"       /\\"}</Text>;
      t5 = <Text color="beastcli">{"      ◉◉  "}</Text>;
      t6 = <Text color="beastcli">{"     /  \\"}</Text>;
      t7 = <Text color="beastcli">{"    /____\\"}</Text>;
      t8 = <Text color="beastcli" dimColor={true}>{"      ███  "}</Text>;
      t9 = <Text dimColor={true}>{`  ${startupVibe}`}</Text>;
      t10 = <Text dimColor={true}>{"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"}</Text>;
      $[2] = t2; $[3] = t3; $[4] = t4; $[5] = t5; $[6] = t6; $[7] = t7; $[8] = t8; $[9] = t9; $[10] = t10;
    } else {
      t2 = $[2]; t3 = $[3]; t4 = $[4]; t5 = $[5]; t6 = $[6]; t7 = $[7]; t8 = $[8]; t9 = $[9]; t10 = $[10];
    }
    let t11;
    if ($[11] !== t1) {
      t11 = <Box width={WELCOME_V2_WIDTH} flexDirection="column" alignItems="center">
        <Text>{t1}{t2}</Text>
        <Text>{t3}</Text>
        <Box flexDirection="row" marginY={1}>{t4}{t5}{t6}{t7}</Box>
        <Box flexDirection="row">{t8}</Box>
        <Text>{t9}</Text>
        <Text>{t10}</Text>
      </Box>;
      $[11] = t1;
      $[12] = t11;
    } else {
      t11 = $[12];
    }
    return t11;
  }

  // Dark theme Apple Terminal
  let t1, t2, t3, t4, t5, t6, t7, t8, t9, t10;
  if ($[13] !== welcomeMessage) {
    t1 = <Text color="beastcli">{welcomeMessage} </Text>;
    $[13] = welcomeMessage;
    $[14] = t1;
  } else {
    t1 = $[14];
  }
  if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
    t2 = <Text dimColor={true}>v{MACRO.DISPLAY_VERSION ?? MACRO.VERSION} </Text>;
    t3 = <Text color="beastcli">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</Text>;
    t4 = <Text color="beastcli" bold={true}>{"      /\\      ◉◉      /\\    "}</Text>;
    t5 = <Text color="beastcli">{"     /  \\___________/  \\   "}</Text>;
    t6 = <Text color="beastcli">{"    /    \\_______/    \\  "}</Text>;
    t7 = <Text color="beastcli">{"   /______\\     /______\\ "}</Text>;
    t8 = <Text color="beastcli">{"           ████████████      "}</Text>;
    t9 = <Text color="beastcli" dimColor={true}>{"           ═══════════       "}</Text>;
    t10 = <Text dimColor={true}>{"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"}</Text>;
    $[15] = t2; $[16] = t3; $[17] = t4; $[18] = t5; $[19] = t6; $[20] = t7; $[21] = t8; $[22] = t9; $[23] = t10;
  } else {
    t2 = $[15]; t3 = $[16]; t4 = $[17]; t5 = $[18]; t6 = $[19]; t7 = $[20]; t8 = $[21]; t9 = $[22]; t10 = $[23];
  }
  let t11;
  if ($[24] !== t1) {
    t11 = <Box width={WELCOME_V2_WIDTH} flexDirection="column" alignItems="center">
      <Text>{t1}{t2}</Text>
      <Text>{t3}</Text>
      <Text>{t4}</Text>
      <Text>{t5}</Text>
      <Text>{t6}</Text>
      <Text>{t7}</Text>
      <Text>{t8}</Text>
      <Text>{t9}</Text>
      <Text>{t10}</Text>
      <Text dimColor={true}>{`  ${startupVibe}`}</Text>
    </Box>;
    $[24] = t1;
    $[25] = t11;
  } else {
    t11 = $[25];
  }
  return t11;
}
