import { c as _c } from "react-compiler-runtime";
import React from 'react';
import { Text, Box } from '../../ink.js';
import type { Theme } from '../../utils/theme.js';
type Props = {
  /**
   * How much progress to display, between 0 and 1 inclusive
   */
  ratio: number; // [0, 1]

  /**
   * How many characters wide to draw the progress bar
   */
  width: number; // how many characters wide

  /**
   * Optional color for the filled portion of the bar
   */
  fillColor?: keyof Theme;

  /**
   * Optional color for the empty portion of the bar
   */
  emptyColor?: keyof Theme;

  /**
   * Show context window usage
   */
  showContext?: boolean;

  /**
   * Context window percentage (0-100)
   */
  contextPercent?: number;
};

// Modern Dragula-style gradient blocks with emojis
const GRADIENT_BLOCKS = ['░', '▒', '▓', '█'];
const EMOJI_STATES = ['🔮', '⚡', '🎯', '🚀'];

export function ProgressBar(props: Props) {
  const $ = _c(15);
  const {
    ratio: inputRatio,
    width,
    fillColor,
    emptyColor,
    showContext = false,
    contextPercent = 0,
  } = props;
  const ratio = Math.min(1, Math.max(0, inputRatio));
  const whole = Math.floor(ratio * width);
  let filled;
  if ($[0] !== whole) {
    filled = GRADIENT_BLOCKS[GRADIENT_BLOCKS.length - 1].repeat(whole);
    $[0] = whole;
    $[1] = filled;
  } else {
    filled = $[1];
  }
  let segments;
  if ($[2] !== ratio || $[3] !== filled || $[4] !== whole || $[5] !== width) {
    segments = [filled];
    if (whole < width) {
      const remainder = ratio * width - whole;
      const middle = Math.floor(remainder * GRADIENT_BLOCKS.length);
      segments.push(GRADIENT_BLOCKS[middle]);
      const empty = width - whole - 1;
      if (empty > 0) {
        let emptyStr;
        if ($[7] !== empty) {
          emptyStr = ' '.repeat(empty);
          $[7] = empty;
          $[8] = emptyStr;
        } else {
          emptyStr = $[8];
        }
        segments.push(emptyStr);
      }
    }
    $[2] = ratio;
    $[3] = filled;
    $[4] = whole;
    $[5] = width;
    $[6] = segments;
  } else {
    segments = $[6];
  }
  const bar = segments.join('');

  // Choose emoji based on progress
  const emojiIndex = Math.floor(ratio * (EMOJI_STATES.length - 1));
  const emoji = ratio >= 1 ? '✅' : ratio >= 0.75 ? '🚀' : ratio >= 0.5 ? '🎯' : ratio >= 0.25 ? '⚡' : '🔮';
  const progressPercent = Math.round(ratio * 100);

  let t2;
  if ($[9] !== emptyColor || $[10] !== fillColor || $[11] !== bar) {
    t2 = <Text color={fillColor ?? 'text'} backgroundColor={emptyColor}>{bar}</Text>;
    $[9] = emptyColor;
    $[10] = fillColor;
    $[11] = bar;
    $[12] = t2;
  } else {
    t2 = $[12];
  }

  let t3;
  if ($[13] !== showContext || $[14] !== contextPercent) {
    // Build the full output with progress bar and context info
    const contextBar = showContext ? ` | 💭 Context: ${contextPercent}%` : '';
    const progressText = `[${emoji} ${progressPercent}%]`;
    t3 = (
      <Box flexDirection="row" gap={1}>
        {t2}
        <Text dimColor={true}>{progressText}{contextBar}</Text>
      </Box>
    );
    $[13] = showContext;
    $[14] = contextPercent;
    $[15] = t3;
  } else {
    t3 = $[15];
  }
  return t3;
}

// Simple context window progress bar component
export function ContextProgressBar(props: { used: number; max: number; width?: number }) {
  const { used, max, width = 40 } = props;
  const ratio = Math.min(1, used / max);
  const percent = Math.round(ratio * 100);

  // Color based on usage
  const color: keyof Theme = percent > 90 ? 'error' : percent > 70 ? 'warning' : 'success';

  return (
    <Box flexDirection="row" gap={1} alignItems="center">
      <Text dimColor={true}>💭</Text>
      <ProgressBar ratio={ratio} width={width} fillColor={color} />
      <Text dimColor={true}>{percent}%</Text>
    </Box>
  );
}