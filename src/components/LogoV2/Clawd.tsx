import { c as _c } from "react-compiler-runtime";
import * as React from 'react';
import { Box, Text } from '../../ink.js';
import { env } from '../../utils/env.js';

/**
 * Beast mascot pose types
 */
export type ClawdPose = 'default' | 'howl' | 'hunt' | 'sleep' | 'fierce'
| 'look-left' | 'look-right' | 'party' | 'sparkle'
| 'cool' | 'star' | 'rocket' | 'ninja' | 'vibing'

type Props = {
  pose?: ClawdPose;
};

// ASCII art segments for beast/wolf mascot - each pose has distinct character
type Segments = {
  r1L: string;  // Row 1 left - ear/head shape
  r1E: string;  // Row 1 eyes
  r1R: string;  // Row 1 right - ear/head shape
  r2L: string;  // Row 2 left - body/legs
  r2M: string;  // Row 2 middle - chest/body
  r2R: string;  // Row 2 right - body/legs
  r3: string;   // Row 3 - tail/ground decoration
};

// Beast poses - wolf character with different moods
const POSES: Record<ClawdPose, Segments> = {
  default: {
    r1L: '  /\\',
    r1E: ' ◉◉ ',
    r1R: '/\\  ',
    r2L: ' /█\\',
    r2M: '███',
    r2R: '/█\\',
    r3: '‾/w\\‾'
  },
  howl: {
    r1L: '  /\\',
    r1E: ' ◉◉',
    r1R: '/\\‾',
    r2L: ' /█\\',
    r2M: '███',
    r2R: '/█\\',
    r3: '‾/w\\‾'
  },
  hunt: {
    r1L: '  ◢',
    r1E: ' ◉◉',
    r1R: '◣ ',
    r2L: ' /█\\',
    r2M: '███',
    r2R: '/█\\',
    r3: '‾/w\\‾'
  },
  sleep: {
    r1L: '   ',
    r1E: ' ◡◡ ',
    r1R: '   ',
    r2L: '  ╭',
    r2M: '──╯',
    r2R: '╰─',
    r3: '~ ~ '
  },
  fierce: {
    r1L: '  /\\',
    r1E: ' ▲▲ ',
    r1R: '/\\  ',
    r2L: ' /█\\',
    r2M: '███',
    r2R: '/█\\',
    r3: '‾/w\\‾'
  },
  'look-left': {
    r1L: '  /\\',
    r1E: ' ◐◉ ',
    r1R: '/\\  ',
    r2L: ' /█\\',
    r2M: '███',
    r2R: '/█\\',
    r3: '‾/w\\‾'
  },
  'look-right': {
    r1L: '  /\\',
    r1E: ' ◉◐ ',
    r1R: '/\\  ',
    r2L: ' /█\\',
    r2M: '███',
    r2R: '/█\\',
    r3: '‾/w\\‾'
  },
  party: {
    r1L: '  /\\',
    r1E: ' ★★ ',
    r1R: '/\\  ',
    r2L: ' /█\\',
    r2M: '███',
    r2R: '/█\\',
    r3: '‾/w\\‾'
  },
  sparkle: {
    r1L: ' ✦/\\',
    r1E: ' ◉◉ ',
    r1R: '/\\✦ ',
    r2L: ' /█\\',
    r2M: '███',
    r2R: '/█\\',
    r3: '‾/w\\‾'
  },
  cool: {
    r1L: '  /\\',
    r1E: ' ◉_',
    r1R: '_◉ ',
    r2L: ' /█\\',
    r2M: '███',
    r2R: '/█\\',
    r3: '‾/w\\‾'
  },
  star: {
    r1L: '  /\\',
    r1E: ' ★★ ',
    r1R: '/\\  ',
    r2L: ' /█\\',
    r2M: '███',
    r2R: '/█\\',
    r3: '★/w\\★'
  },
  rocket: {
    r1L: '  /\\',
    r1E: ' ◉◉',
    r1R: '/\\🔥',
    r2L: ' /█\\',
    r2M: '███',
    r2R: '/█\\',
    r3: '‾/w\\‾'
  },
  ninja: {
    r1L: '  /‾',
    r1E: ' ◉◉',
    r1R: '‾\\  ',
    r2L: ' /█\\',
    r2M: '███',
    r2R: '/█\\',
    r3: '‾/w\\‾'
  },
  vibing: {
    r1L: '  /\\',
    r1E: ' ◉◉',
    r1R: '/\\~',
    r2L: ' /█\\',
    r2M: '███',
    r2R: '/█\\',
    r3: '~/w\\~'
  }
};

// Apple Terminal simplified eyes
const APPLE_EYES: Record<ClawdPose, string> = {
  default: ' ◉◉ ',
  howl: ' ◉◉‾',
  hunt: ' ◉◉',
  sleep: ' ◡◡ ',
  fierce: ' ▲▲ ',
  'look-left': ' ◐◉ ',
  'look-right': ' ◉◐ ',
  party: ' ★★ ',
  sparkle: ' ◉◉ ',
  cool: ' ◉_',
  star: ' ★★ ',
  rocket: ' ◉◉',
  ninja: ' ◉◉',
  vibing: ' ◉◉',
};
export function Clawd(t0) {
  const $ = _c(26);
  let t1;
  if ($[0] !== t0) {
    t1 = t0 === undefined ? {} : t0;
    $[0] = t0;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const {
    pose: t2
  } = t1;
  const pose = t2 === undefined ? "default" : t2;
  if (env.terminal === "Apple_Terminal") {
    let t3;
    if ($[2] !== pose) {
      t3 = <AppleTerminalClawd pose={pose} />;
      $[2] = pose;
      $[3] = t3;
    } else {
      t3 = $[3];
    }
    return t3;
  }
  const p = POSES[pose];
  // Row 1 - head with ears
  let t3;
  if ($[4] !== p.r1L) {
    t3 = <Text color="beastcli">{p.r1L}</Text>;
    $[4] = p.r1L;
    $[5] = t3;
  } else {
    t3 = $[5];
  }
  let t4;
  if ($[6] !== p.r1E) {
    t4 = <Text color="beastcli">{p.r1E}</Text>;
    $[6] = p.r1E;
    $[7] = t4;
  } else {
    t4 = $[7];
  }
  let t5;
  if ($[8] !== p.r1R) {
    t5 = <Text color="beastcli">{p.r1R}</Text>;
    $[8] = p.r1R;
    $[9] = t5;
  } else {
    t5 = $[9];
  }
  let t6;
  if ($[10] !== t3 || $[11] !== t4 || $[12] !== t5) {
    t6 = <Text>{t3}{t4}{t5}</Text>;
    $[10] = t3;
    $[11] = t4;
    $[12] = t5;
    $[13] = t6;
  } else {
    t6 = $[13];
  }
  // Row 2 - body with legs
  let t7;
  if ($[14] !== p.r2L) {
    t7 = <Text color="beastcli">{p.r2L}</Text>;
    $[14] = p.r2L;
    $[15] = t7;
  } else {
    t7 = $[15];
  }
  let t8;
  if ($[16] !== p.r2M) {
    t8 = <Text color="beastcli" bold={true}>{p.r2M}</Text>;
    $[16] = p.r2M;
    $[17] = t8;
  } else {
    t8 = $[17];
  }
  let t9;
  if ($[17] !== p.r2R) {
    t9 = <Text color="beastcli">{p.r2R}</Text>;
    $[17] = p.r2R;
    $[18] = t9;
  } else {
    t9 = $[18];
  }
  let t10;
  if ($[19] !== t7 || $[20] !== t8 || $[21] !== t9) {
    t10 = <Text>{t7}{t8}{t9}</Text>;
    $[19] = t7;
    $[20] = t8;
    $[21] = t9;
    $[22] = t10;
  } else {
    t10 = $[22];
  }
  // Row 3 - tail decoration
  let t11;
  if ($[23] !== p.r3) {
    t11 = <Text color="beastcli" dimColor={true}>{p.r3}</Text>;
    $[23] = p.r3;
    $[24] = t11;
  } else {
    t11 = $[24];
  }
  let t12;
  if ($[25] !== t6 || $[26] !== t10 || $[27] !== t11) {
    t12 = <Box flexDirection="column">{t6}{t10}{t11}</Box>;
    $[25] = t6;
    $[26] = t10;
    $[27] = t11;
    $[28] = t12;
  } else {
    t12 = $[28];
  }
  return t12;
}
function AppleTerminalClawd(t0) {
  const $ = _c(10);
  const {
    pose
  } = t0;
  let t1;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = <Text color="text">▗</Text>;
    $[0] = t1;
  } else {
    t1 = $[0];
  }
  const t2 = APPLE_EYES[pose];
  let t3;
  if ($[1] !== t2) {
    t3 = <Text color="text">{t2}</Text>;
    $[1] = t2;
    $[2] = t3;
  } else {
    t3 = $[2];
  }
  let t4;
  if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
    t4 = <Text color="text">▖</Text>;
    $[3] = t4;
  } else {
    t4 = $[3];
  }
  let t5;
  if ($[4] !== t3) {
    t5 = <Text>{t1}{t3}{t4}</Text>;
    $[4] = t3;
    $[5] = t5;
  } else {
    t5 = $[5];
  }
  let t6;
  let t7;
  if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
    t6 = <Text backgroundColor="clawd_body">{" ".repeat(7)}</Text>;
    t7 = <Text color="clawd_body">▘▘ ▝▝</Text>;
    $[6] = t6;
    $[7] = t7;
  } else {
    t6 = $[6];
    t7 = $[7];
  }
  let t8;
  if ($[8] !== t5) {
    t8 = <Box flexDirection="column" alignItems="center">{t5}{t6}{t7}</Box>;
    $[8] = t5;
    $[9] = t8;
  } else {
    t8 = $[9];
  }
  return t8;
}
