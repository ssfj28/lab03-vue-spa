import type { HSL, RGB } from "../types/color";

function assertRgb(rgb: RGB): void {
  const isValid =
    Number.isFinite(rgb.r) &&
    Number.isFinite(rgb.g) &&
    Number.isFinite(rgb.b) &&
    rgb.r >= 0 &&
    rgb.r <= 255 &&
    rgb.g >= 0 &&
    rgb.g <= 255 &&
    rgb.b >= 0 &&
    rgb.b <= 255;

  if (!isValid) {
    throw new Error("RGB-компоненты должны находиться в диапазоне от 0 до 255");
  }
}

function assertHsl(hsl: HSL): void {
  const isValid =
    Number.isFinite(hsl.h) &&
    Number.isFinite(hsl.s) &&
    Number.isFinite(hsl.l) &&
    hsl.h >= 0 &&
    hsl.h <= 360 &&
    hsl.s >= 0 &&
    hsl.s <= 100 &&
    hsl.l >= 0 &&
    hsl.l <= 100;

  if (!isValid) {
    throw new Error("HSL-компоненты должны находиться в диапазонах H: 0–360, S: 0–100, L: 0–100");
  }
}

export function hexToRgb(hex: string): RGB {
  const normalizedHex = hex.trim();

  if (!/^#[0-9A-Fa-f]{6}$/.test(normalizedHex)) {
    throw new Error("HEX должен иметь формат #RRGGBB");
  }

  const value = Number.parseInt(normalizedHex.slice(1), 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

export function rgbToHex(rgb: RGB): string {
  assertRgb(rgb);

  const red = Math.round(rgb.r);
  const green = Math.round(rgb.g);
  const blue = Math.round(rgb.b);

  return (
    "#" +
    [red, green, blue]
      .map((component) => component.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

export function rgbToHsl(rgb: RGB): HSL {
  assertRgb(rgb);

  const red = rgb.r / 255;
  const green = rgb.g / 255;
  const blue = rgb.b / 255;

  const max = Math.max(red, green, blue);

  const min = Math.min(red, green, blue);

  const lightness = (max + min) / 2;

  if (max === min) {
    return {
      h: 0,
      s: 0,
      l: lightness * 100,
    };
  }

  const delta = max - min;

  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

  let hue: number;

  switch (max) {
    case red:
      hue = (green - blue) / delta + (green < blue ? 6 : 0);
      break;

    case green:
      hue = (blue - red) / delta + 2;
      break;

    default:
      hue = (red - green) / delta + 4;
      break;
  }

  hue /= 6;

  return {
    h: hue * 360,
    s: saturation * 100,
    l: lightness * 100,
  };
}

export function hslToRgb(hsl: HSL): RGB {
  assertHsl(hsl);

  const hue = (((hsl.h % 360) + 360) % 360) / 360;

  const saturation = hsl.s / 100;

  const lightness = hsl.l / 100;

  if (saturation === 0) {
    const value = lightness * 255;

    return {
      r: value,
      g: value,
      b: value,
    };
  }

  const q =
    lightness < 0.5
      ? lightness * (1 + saturation)
      : lightness + saturation - lightness * saturation;

  const p = 2 * lightness - q;

  const hueToRgb = (t: number): number => {
    let adjusted = t;

    if (adjusted < 0) {
      adjusted += 1;
    }

    if (adjusted > 1) {
      adjusted -= 1;
    }

    if (adjusted < 1 / 6) {
      return p + (q - p) * 6 * adjusted;
    }

    if (adjusted < 1 / 2) {
      return q;
    }

    if (adjusted < 2 / 3) {
      return p + (q - p) * (2 / 3 - adjusted) * 6;
    }

    return p;
  };

  return {
    r: hueToRgb(hue + 1 / 3) * 255,

    g: hueToRgb(hue) * 255,

    b: hueToRgb(hue - 1 / 3) * 255,
  };
}

export function hexToHsl(hex: string): HSL {
  return rgbToHsl(hexToRgb(hex));
}

export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}
