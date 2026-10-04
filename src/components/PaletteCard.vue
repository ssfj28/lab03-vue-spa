<script setup lang="ts">
import type { ColorPalette } from "../types/palette";

import BaseButton from "./BaseButton.vue";

defineProps<{
  palette: ColorPalette;
}>();

const emit = defineEmits<{
  edit: [id: number];
  remove: [id: number];
}>();
</script>

<template>
  <article class="palette-card">
    <div class="palette-card-header">
      <div>
        <h3>
          {{ palette.name }}
        </h3>

        <p class="muted">
          Цветов:
          {{ palette.colors.length }}
        </p>
      </div>

      <div class="palette-actions">
        <BaseButton variant="secondary" @click="emit('edit', palette.id)"> Изменить </BaseButton>

        <BaseButton variant="danger" @click="emit('remove', palette.id)"> Удалить </BaseButton>
      </div>
    </div>

    <div class="palette-swatches">
      <div
        v-for="color in palette.colors"
        :key="color.id"
        class="palette-swatch"
        :style="{
          backgroundColor: color.hex,
        }"
        :title="`${color.name}: ${color.hex}`"
      />
    </div>

    <div class="palette-footer">
      <RouterLink :to="`/palettes/${palette.id}/edit`" class="text-link">
        Открыть редактор →
      </RouterLink>
    </div>
  </article>
</template>
