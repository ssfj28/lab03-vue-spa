<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import BasePanel from "../components/BasePanel.vue";
import ColorCard from "../components/ColorCard.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import LoadingState from "../components/LoadingState.vue";

import { usePalettes } from "../composables/usePalettes";

import type { Color } from "../types/color";
import type { HarmonyType } from "../types/harmony";

import { getColorHarmony } from "../utils/color-harmony";

const { palettes, isLoading, error, loadPalettes } = usePalettes();

const selectedColorId = ref("");
const harmonyType = ref<HarmonyType>("complementary");

onMounted(async () => {
  await loadPalettes();

  selectedColorId.value = palettes.value[0]?.colors[0]?.id ?? "";
});

const allColors = computed<Color[]>(() => {
  return palettes.value.reduce<Color[]>((result, palette) => [...result, ...palette.colors], []);
});

const selectedColor = computed<Color | null>(() => {
  return allColors.value.find((color) => color.id === selectedColorId.value) ?? null;
});

const harmony = computed(() => {
  if (!selectedColor.value) {
    return null;
  }

  return getColorHarmony(selectedColor.value, harmonyType.value);
});
</script>

<template>
  <div class="container page">
    <div class="page-header">
      <div>
        <h1>Цветовые гармонии</h1>

        <p class="page-description">Исследуйте дополнительные отношения между цветами.</p>
      </div>
    </div>

    <LoadingState v-if="isLoading" />

    <ErrorMessage v-else-if="error" :message="error" />

    <template v-else>
      <BasePanel title="Настройки">
        <div class="form-group">
          <label for="source-color"> Исходный цвет </label>

          <select id="source-color" v-model="selectedColorId">
            <option v-for="color in allColors" :key="color.id" :value="color.id">
              {{ color.name }} — {{ color.hex }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="harmony-type"> Тип гармонии </label>

          <select id="harmony-type" v-model="harmonyType">
            <option value="complementary">Комплементарная</option>

            <option value="analogous">Аналоговая</option>

            <option value="triadic">Триадная</option>
          </select>
        </div>
      </BasePanel>

      <BasePanel v-if="harmony" title="Результат">
        <div class="color-grid">
          <ColorCard v-for="color in harmony.colors" :key="color.id" :color="color" />
        </div>
      </BasePanel>

      <BasePanel v-else title="Результат">
        <p>Сначала добавьте хотя бы одну палитру с цветом.</p>
      </BasePanel>
    </template>
  </div>
</template>
