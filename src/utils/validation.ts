import type { HSL, RGB } from "../types/color";

export function isValidHex(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value.trim());
}

export function isValidRgb(rgb: RGB): boolean {
  return (
    Number.isFinite(rgb.r) &&
    Number.isFinite(rgb.g) &&
    Number.isFinite(rgb.b) &&
    rgb.r >= 0 &&
    rgb.r <= 255 &&
    rgb.g >= 0 &&
    rgb.g <= 255 &&
    rgb.b >= 0 &&
    rgb.b <= 255
  );
}

export function isValidHsl(hsl: HSL): boolean {
  return (
    Number.isFinite(hsl.h) &&
    Number.isFinite(hsl.s) &&
    Number.isFinite(hsl.l) &&
    hsl.h >= 0 &&
    hsl.h <= 360 &&
    hsl.s >= 0 &&
    hsl.s <= 100 &&
    hsl.l >= 0 &&
    hsl.l <= 100
  );
}
