<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

import BaseButton from "../components/BaseButton.vue";
import BasePanel from "../components/BasePanel.vue";
import EmptyState from "../components/EmptyState.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import LoadingState from "../components/LoadingState.vue";
import PaletteList from "../components/PaletteList.vue";

import { usePalettes } from "../composables/usePalettes";

const router = useRouter();

const { palettes, isLoading, error, hasPalettes, loadPalettes, removePalette } = usePalettes();

onMounted(() => {
  loadPalettes();
});

function goToEditor(id: number): void {
  router.push(`/palettes/${id}/edit`);
}

async function handleRemove(id: number): Promise<void> {
  const palette = palettes.value.find((item) => item.id === id);

  if (!palette) {
    return;
  }

  const confirmed = window.confirm(`Удалить палитру «${palette.name}»?`);

  if (!confirmed) {
    return;
  }

  await removePalette(id);
}
</script>

<template>
  <div class="container page">
    <div class="page-header">
      <div>
        <h1>Мои палитры</h1>

        <p class="page-description">Создавайте, редактируйте и анализируйте цветовые палитры.</p>
      </div>

      <BaseButton @click="router.push('/palettes/new')"> + Создать палитру </BaseButton>
    </div>

    <BasePanel>
      <LoadingState v-if="isLoading" />

      <ErrorMessage v-else-if="error" :message="error" />

      <EmptyState v-else-if="!hasPalettes" message="Палитр пока нет. Создайте первую палитру." />

      <PaletteList v-else :palettes="palettes" @edit="goToEditor" @remove="handleRemove" />
    </BasePanel>
  </div>
</template>
