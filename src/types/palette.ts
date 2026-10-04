import type { Color } from "./color";

export type ColorPalette = {
  id: number;
  name: string;
  colors: Color[];
  createdAt: string;
  updatedAt: string;
};
