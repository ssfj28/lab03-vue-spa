import { computed, shallowRef } from "vue";

import type { ColorPalette } from "../types/palette";

import {
  getPalettes,
  getPalette,
  createPalette,
  updatePalette,
  deletePalette,
} from "../services/api";

export function usePalettes() {
  const palettes = shallowRef<ColorPalette[]>([]);

  const isLoading = shallowRef(false);

  const error = shallowRef<string | null>(null);

  const hasPalettes = computed(() => palettes.value.length > 0);

  async function loadPalettes(): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      palettes.value = await getPalettes();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Не удалось загрузить палитры";
    } finally {
      isLoading.value = false;
    }
  }

  async function loadPalette(id: number): Promise<ColorPalette | null> {
    isLoading.value = true;
    error.value = null;

    try {
      return await getPalette(id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Не удалось загрузить палитру";

      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function addPalette(palette: Omit<ColorPalette, "id">): Promise<ColorPalette | null> {
    error.value = null;

    try {
      const createdPalette = await createPalette(palette);

      palettes.value = [...palettes.value, createdPalette];

      return createdPalette;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Не удалось создать палитру";

      return null;
    }
  }

  async function editPalette(
    id: number,
    palette: Omit<ColorPalette, "id">,
  ): Promise<ColorPalette | null> {
    error.value = null;

    try {
      const updatedPalette = await updatePalette(id, palette);

      palettes.value = palettes.value.map((currentPalette) =>
        currentPalette.id === id ? updatedPalette : currentPalette,
      );

      return updatedPalette;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Не удалось изменить палитру";

      return null;
    }
  }

  async function removePalette(id: number): Promise<boolean> {
    error.value = null;

    try {
      await deletePalette(id);

      palettes.value = palettes.value.filter((palette) => palette.id !== id);

      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Не удалось удалить палитру";

      return false;
    }
  }

  return {
    palettes,
    isLoading,
    error,
    hasPalettes,
    loadPalettes,
    loadPalette,
    addPalette,
    editPalette,
    removePalette,
  };
}
