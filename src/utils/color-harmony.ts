import type { Color } from "../types/color";
import type { ColorHarmony, HarmonyType } from "../types/harmony";

import { hexToHsl, hslToHex } from "./color-conversion";

function normalizeHue(hue: number): number {
  return ((hue % 360) + 360) % 360;
}

function createHarmonyColor(source: Color, hue: number, index: number): Color {
  const sourceHsl = hexToHsl(source.hex);

  return {
    id: `${source.id}-harmony-${index}`,
    name: `${source.name} — гармония ${index}`,
    hex: hslToHex({
      ...sourceHsl,
      h: normalizeHue(hue),
    }),
  };
}

export function getColorHarmony(source: Color, type: HarmonyType): ColorHarmony {
  const sourceHsl = hexToHsl(source.hex);

  let offsets: number[];

  switch (type) {
    case "complementary":
      offsets = [180];
      break;

    case "analogous":
      offsets = [-30, 30];
      break;

    case "triadic":
      offsets = [120, 240];
      break;
  }

  const colors = [
    source,
    ...offsets.map((offset, index) => createHarmonyColor(source, sourceHsl.h + offset, index + 1)),
  ];

  return {
    type,
    source,
    colors,
  };
}
