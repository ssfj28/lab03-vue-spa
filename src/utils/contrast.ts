import type { ContrastResult } from "../types/contrast";

import { hexToRgb } from "./color-conversion";

function getLinearChannel(channel: number): number {
  const normalized = channel / 255;

  if (normalized <= 0.04045) {
    return normalized / 12.92;
  }

  return Math.pow((normalized + 0.055) / 1.055, 2.4);
}

function getRelativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);

  const red = getLinearChannel(rgb.r);

  const green = getLinearChannel(rgb.g);

  const blue = getLinearChannel(rgb.b);

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function getContrastRatio(foreground: string, background: string): number {
  const foregroundLuminance = getRelativeLuminance(foreground);

  const backgroundLuminance = getRelativeLuminance(background);

  const lighter = Math.max(foregroundLuminance, backgroundLuminance);

  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

export function getContrastResult(foreground: string, background: string): ContrastResult {
  const ratio = getContrastRatio(foreground, background);

  return {
    ratio,
    wcagAA: ratio >= 4.5,
    wcagAAA: ratio >= 7,
  };
}
