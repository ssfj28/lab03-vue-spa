<script setup lang="ts">
import type { ColorPalette } from "../types/palette";

import PaletteCard from "./PaletteCard.vue";

defineProps<{
  palettes: ColorPalette[];
}>();

const emit = defineEmits<{
  edit: [id: number];
  remove: [id: number];
}>();
</script>

<template>
  <div class="palette-list">
    <PaletteCard
      v-for="palette in palettes"
      :key="palette.id"
      :palette="palette"
      @edit="emit('edit', $event)"
      @remove="emit('remove', $event)"
    />
  </div>
</template>
