import type { Color } from "./color";

export type HarmonyType = "complementary" | "analogous" | "triadic";

export type ColorHarmony = {
  type: HarmonyType;
  source: Color;
  colors: Color[];
};
