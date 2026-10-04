<script setup lang="ts">
import { computed, shallowReactive, watch } from "vue";

import type { HSL, RGB, Color } from "../types/color";

import { hexToHsl, hexToRgb, hslToHex, rgbToHex, rgbToHsl } from "../utils/color-conversion";

import { isValidHex, isValidHsl, isValidRgb } from "../utils/validation";

import ColorCard from "./ColorCard.vue";
import BaseButton from "./BaseButton.vue";

const props = defineProps<{
  color: Color;
}>();

const emit = defineEmits<{
  update: [color: Color];
  remove: [colorId: string];
}>();

const editor = shallowReactive<{
  name: string;
  hex: string;
  r: number;
  g: number;
  b: number;
  h: number;
  s: number;
  l: number;
}>({
  name: "",
  hex: "",
  r: 0,
  g: 0,
  b: 0,
  h: 0,
  s: 0,
  l: 0,
});

const errorMessage = shallowReactive<{
  value: string | null;
}>({
  value: null,
});

function syncFromColor(color: Color): void {
  const rgb = hexToRgb(color.hex);
  const hsl = hexToHsl(color.hex);

  editor.name = color.name;
  editor.hex = color.hex;
  editor.r = Math.round(rgb.r);
  editor.g = Math.round(rgb.g);
  editor.b = Math.round(rgb.b);
  editor.h = Math.round(hsl.h);
  editor.s = Math.round(hsl.s);
  editor.l = Math.round(hsl.l);

  errorMessage.value = null;
}

watch(
  () => props.color,
  (color) => {
    syncFromColor(color);
  },
  {
    immediate: true,
  },
);

const previewColor = computed<Color>(() => {
  return {
    id: props.color.id,
    name: editor.name,
    hex: editor.hex,
  };
});
function getInputValue(event: Event): string {
  const target = event.target;

  if (!(target instanceof HTMLInputElement)) {
    return "";
  }

  return target.value;
}
function updateName(value: string): void {
  editor.name = value;

  emit("update", {
    ...props.color,
    name: value,
  });
}

function updateFromHex(event: Event): void {
  const hex = getInputValue(event).trim().toUpperCase();

  editor.hex = hex;

  if (!isValidHex(hex)) {
    errorMessage.value = "HEX должен иметь формат #RRGGBB.";

    return;
  }

  const rgb = hexToRgb(hex);
  const hsl = hexToHsl(hex);

  editor.r = Math.round(rgb.r);
  editor.g = Math.round(rgb.g);
  editor.b = Math.round(rgb.b);

  editor.h = Math.round(hsl.h);
  editor.s = Math.round(hsl.s);
  editor.l = Math.round(hsl.l);

  errorMessage.value = null;

  emit("update", {
    ...props.color,
    name: editor.name,
    hex,
  });
}

function updateFromRgb(component: "r" | "g" | "b", value: string): void {
  editor[component] = Number(value);

  const rgb: RGB = {
    r: editor.r,
    g: editor.g,
    b: editor.b,
  };

  if (!isValidRgb(rgb)) {
    errorMessage.value = "RGB-компоненты должны быть от 0 до 255.";

    return;
  }

  const hex = rgbToHex(rgb);
  const hsl = rgbToHsl(rgb);

  editor.hex = hex;

  editor.h = Math.round(hsl.h);
  editor.s = Math.round(hsl.s);
  editor.l = Math.round(hsl.l);

  errorMessage.value = null;

  emit("update", {
    ...props.color,
    name: editor.name,
    hex,
  });
}

function updateFromHsl(component: "h" | "s" | "l", value: string): void {
  editor[component] = Number(value);

  const hsl: HSL = {
    h: editor.h,
    s: editor.s,
    l: editor.l,
  };

  if (!isValidHsl(hsl)) {
    errorMessage.value = "H должно быть от 0 до 360, S и L — от 0 до 100.";

    return;
  }

  const hex = hslToHex(hsl);
  const rgb = hexToRgb(hex);

  editor.hex = hex;

  editor.r = Math.round(rgb.r);
  editor.g = Math.round(rgb.g);
  editor.b = Math.round(rgb.b);

  errorMessage.value = null;

  emit("update", {
    ...props.color,
    name: editor.name,
    hex,
  });
}

function remove(): void {
  emit("remove", props.color.id);
}
</script>

<template>
  <article class="color-editor">
    <div class="color-editor-header">
      <div>
        <h3>
          {{ editor.name || "Новый цвет" }}
        </h3>

        <p class="muted">Редактор цвета</p>
      </div>

      <BaseButton variant="danger" @click="remove"> Удалить цвет </BaseButton>
    </div>

    <div class="color-editor-preview">
      <ColorCard :color="previewColor" />
    </div>

    <div class="form-group">
      <label> Название </label>

      <input
        :value="editor.name"
        type="text"
        @input="updateName(($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="color-editor-grid">
      <section class="color-editor-section">
        <h4>HEX</h4>

        <input
          :value="editor.hex"
          type="text"
          maxlength="7"
          placeholder="#FF0000"
          @input="updateFromHex"
        />
      </section>

      <section class="color-editor-section">
        <h4>RGB</h4>

        <div class="color-values">
          <label>
            R
            <input
              :value="editor.r"
              type="number"
              min="0"
              max="255"
              @input="updateFromRgb('r', ($event.target as HTMLInputElement).value)"
            />
          </label>

          <label>
            G
            <input
              :value="editor.g"
              type="number"
              min="0"
              max="255"
              @input="updateFromRgb('g', ($event.target as HTMLInputElement).value)"
            />
          </label>

          <label>
            B
            <input
              :value="editor.b"
              type="number"
              min="0"
              max="255"
              @input="updateFromRgb('b', ($event.target as HTMLInputElement).value)"
            />
          </label>
        </div>
      </section>

      <section class="color-editor-section">
        <h4>HSL</h4>

        <div class="color-values">
          <label>
            H
            <input
              :value="editor.h"
              type="number"
              min="0"
              max="360"
              @input="updateFromHsl('h', ($event.target as HTMLInputElement).value)"
            />
          </label>

          <label>
            S
            <input
              :value="editor.s"
              type="number"
              min="0"
              max="100"
              @input="updateFromHsl('s', ($event.target as HTMLInputElement).value)"
            />
          </label>

          <label>
            L
            <input
              :value="editor.l"
              type="number"
              min="0"
              max="100"
              @input="updateFromHsl('l', ($event.target as HTMLInputElement).value)"
            />
          </label>
        </div>
      </section>
    </div>

    <p v-if="errorMessage.value" class="color-editor-error">
      {{ errorMessage.value }}
    </p>
  </article>
</template>
