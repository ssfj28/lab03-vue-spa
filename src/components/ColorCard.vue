<script setup lang="ts">
import { computed } from "vue";

import type { Color } from "../types/color";

import { hexToRgb, hexToHsl } from "../utils/color-conversion";

const props = defineProps<{
  color: Color;
}>();

const rgb = computed(() => hexToRgb(props.color.hex));

const hsl = computed(() => hexToHsl(props.color.hex));
</script>

<template>
  <article class="color-card">
    <div
      class="color-preview"
      :style="{
        backgroundColor: color.hex,
      }"
    />

    <div class="color-card-content">
      <h3>
        {{ color.name }}
      </h3>

      <p>
        <strong>HEX:</strong>
        {{ color.hex }}
      </p>

      <p>
        <strong>RGB:</strong>
        {{ Math.round(rgb.r) }}, {{ Math.round(rgb.g) }},
        {{ Math.round(rgb.b) }}
      </p>

      <p>
        <strong>HSL:</strong>
        {{ Math.round(hsl.h) }}°, {{ Math.round(hsl.s) }}%, {{ Math.round(hsl.l) }}%
      </p>
    </div>
  </article>
</template>
