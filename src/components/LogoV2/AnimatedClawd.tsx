import { c as _c } from "react-compiler-runtime";
import { useEffect, useRef, useState } from 'react';
import { Box } from '../../ink.js';
import { getInitialSettings } from '../../utils/settings/settings.js';
import { Clawd, type ClawdPose } from './Clawd.js';
type Frame = {
  pose: ClawdPose;
  offset: number;
};

/** Hold a pose for n frames (60ms each). */
function hold(pose: ClawdPose, offset: number, frames: number): Frame[] {
  return Array.from({
    length: frames
  }, () => ({
    pose,
    offset
  }));
}

// Beast howl animation: default -> howl -> fierce -> default
const HOWL_SEQUENCE: readonly Frame[] = [
  ...hold('default', 0, 2),
  ...hold('howl', 0, 8),
  ...hold('fierce', 0, 4),
  ...hold('default', 0, 2)
];

// Hunt animation: default -> hunt -> look-right -> default
const HUNT_SEQUENCE: readonly Frame[] = [
  ...hold('default', 0, 2),
  ...hold('hunt', 0, 6),
  ...hold('look-right', 0, 4),
  ...hold('default', 0, 2)
];

// Party animation: default -> party -> sparkle -> party -> default
const PARTY_SEQUENCE: readonly Frame[] = [
  ...hold('default', 0, 2),
  ...hold('party', 0, 6),
  ...hold('sparkle', 0, 4),
  ...hold('party', 0, 4),
  ...hold('default', 0, 2)
];

// Cool animation: default -> cool -> star -> cool -> default
const COOL_SEQUENCE: readonly Frame[] = [
  ...hold('default', 0, 2),
  ...hold('cool', 0, 8),
  ...hold('star', 0, 4),
  ...hold('default', 0, 2)
];

// Rocket animation: default -> rocket -> default
const ROCKET_SEQUENCE: readonly Frame[] = [
  ...hold('default', 0, 2),
  ...hold('rocket', 0, 10),
  ...hold('default', 0, 2)
];

// Vibing animation: default -> vibing -> ninja -> vibing -> default
const VIBING_SEQUENCE: readonly Frame[] = [
  ...hold('default', 0, 2),
  ...hold('vibing', 0, 6),
  ...hold('ninja', 0, 4),
  ...hold('vibing', 0, 4),
  ...hold('default', 0, 2)
];

// Star animation: default -> star -> sparkle -> star -> default
const STAR_SEQUENCE: readonly Frame[] = [
  ...hold('default', 0, 2),
  ...hold('star', 0, 8),
  ...hold('sparkle', 0, 6),
  ...hold('default', 0, 2)
];

const CLICK_ANIMATIONS: readonly (readonly Frame[])[] = [
  HOWL_SEQUENCE,
  HUNT_SEQUENCE,
  PARTY_SEQUENCE,
  COOL_SEQUENCE,
  ROCKET_SEQUENCE,
  VIBING_SEQUENCE,
  STAR_SEQUENCE
];
const IDLE: Frame = {
  pose: 'default'
};
const FRAME_MS = 60;
const incrementFrame = (i: number) => i + 1;
const CLAWD_HEIGHT = 3;

/**
 * Clawd with click-triggered animations. Container height is fixed at CLAWD_HEIGHT
 * so the surrounding layout never shifts. Click only fires when mouse tracking is
 * enabled (i.e. inside AlternateScreen / fullscreen); elsewhere this renders and
 * behaves identically to plain <Clawd />.
 */
export function AnimatedClawd() {
  const $ = _c(8);
  const {
    pose,
    bounceOffset,
    onClick
  } = useClawdAnimation();
  let t0;
  if ($[0] !== pose) {
    t0 = <Clawd pose={pose} />;
    $[0] = pose;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  let t1;
  if ($[2] !== bounceOffset || $[3] !== t0) {
    t1 = <Box marginTop={bounceOffset} flexShrink={0}>{t0}</Box>;
    $[2] = bounceOffset;
    $[3] = t0;
    $[4] = t1;
  } else {
    t1 = $[4];
  }
  let t2;
  if ($[5] !== onClick || $[6] !== t1) {
    t2 = <Box height={CLAWD_HEIGHT} flexDirection="column" onClick={onClick}>{t1}</Box>;
    $[5] = onClick;
    $[6] = t1;
    $[7] = t2;
  } else {
    t2 = $[7];
  }
  return t2;
}
function useClawdAnimation(): {
  pose: ClawdPose;
  bounceOffset: number;
  onClick: () => void;
} {
  // Read once at mount — no useSettings() subscription, since that would
  // re-render on any settings change.
  const [reducedMotion] = useState(() => getInitialSettings().prefersReducedMotion ?? false);
  const [frameIndex, setFrameIndex] = useState(-1);
  const sequenceRef = useRef<readonly Frame[]>(CLICK_ANIMATIONS[0]!);
  const onClick = () => {
    if (reducedMotion || frameIndex !== -1) return;
    sequenceRef.current = CLICK_ANIMATIONS[Math.floor(Math.random() * CLICK_ANIMATIONS.length)]!;
    setFrameIndex(0);
  };
  useEffect(() => {
    if (frameIndex === -1) return;
    if (frameIndex >= sequenceRef.current.length) {
      setFrameIndex(-1);
      return;
    }
    const timer = setTimeout(setFrameIndex, FRAME_MS, incrementFrame);
    return () => clearTimeout(timer);
  }, [frameIndex]);
  const seq = sequenceRef.current;
  const current = frameIndex >= 0 && frameIndex < seq.length ? seq[frameIndex]! : IDLE;
  return {
    pose: current.pose,
    bounceOffset: current.offset ?? 0,
    onClick
  };
}
