<script setup lang="ts">
import { onMounted, shallowReactive, ref } from "vue";

import { useRoute, useRouter } from "vue-router";

import BaseButton from "../components/BaseButton.vue";
import BasePanel from "../components/BasePanel.vue";
import ColorEditor from "../components/ColorEditor.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import LoadingState from "../components/LoadingState.vue";

import { usePalettes } from "../composables/usePalettes";

import type { Color } from "../types/color";
import type { ColorPalette } from "../types/palette";

import { isValidHex } from "../utils/validation";

const route = useRoute();
const router = useRouter();

const { loadPalette, addPalette, editPalette } = usePalettes();

const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const isSaving = ref(false);

const isNew = route.params.id === undefined;

const form = shallowReactive<{
  name: string;
  colors: Color[];
}>({
  name: "",
  colors: [],
});

function getInputValue(event: Event): string {
  const target = event.target;

  if (!(target instanceof HTMLInputElement)) {
    return "";
  }

  return target.value;
}
function handleColorUpdate(updatedColor: Color): void {
  form.colors = form.colors.map((color) => (color.id === updatedColor.id ? updatedColor : color));
}
onMounted(async () => {
  if (isNew) {
    form.colors = [
      {
        id: `color-${Date.now()}`,
        name: "Новый цвет",
        hex: "#3366FF",
      },
    ];

    return;
  }

  const id = Number(route.params.id);

  if (!Number.isInteger(id)) {
    errorMessage.value = "Некорректный идентификатор палитры";

    return;
  }

  isLoading.value = true;

  const palette = await loadPalette(id);

  isLoading.value = false;

  if (!palette) {
    errorMessage.value = "Палитра не найдена";

    return;
  }

  form.name = palette.name;
  form.colors = [...palette.colors];
});

function createColor(): void {
  form.colors = [
    ...form.colors,
    {
      id: `color-${Date.now()}-${form.colors.length}`,
      name: `Цвет ${form.colors.length + 1}`,
      hex: "#999999",
    },
  ];
}

function removeColor(colorId: string): void {
  form.colors = form.colors.filter((color) => color.id !== colorId);
}

async function savePalette(): Promise<void> {
  errorMessage.value = null;

  if (!form.name.trim()) {
    errorMessage.value = "Введите название палитры";

    return;
  }

  if (form.colors.length === 0) {
    errorMessage.value = "Добавьте хотя бы один цвет";

    return;
  }

  const hasInvalidColor = form.colors.some((color) => !isValidHex(color.hex));

  if (hasInvalidColor) {
    errorMessage.value = "Все цвета должны иметь корректный HEX";

    return;
  }

  isSaving.value = true;

  const now = new Date().toISOString();

  const existingId = Number(route.params.id);

  let result: ColorPalette | null;

  if (isNew) {
    const paletteData: Omit<ColorPalette, "id"> = {
      name: form.name.trim(),
      colors: [...form.colors],
      createdAt: now,
      updatedAt: now,
    };

    result = await addPalette(paletteData);
  } else {
    const current = await loadPalette(existingId);

    if (!current) {
      result = null;
    } else {
      result = await editPalette(existingId, {
        name: form.name.trim(),
        colors: [...form.colors],
        createdAt: current.createdAt,
        updatedAt: now,
      });
    }
  }

  isSaving.value = false;

  if (!result) {
    errorMessage.value = "Не удалось сохранить палитру";

    return;
  }

  await router.push("/");
}

function goBack(): void {
  router.push("/");
}
</script>

<template>
  <div class="container page">
    <div class="page-header">
      <div>
        <h1>
          {{ isNew ? "Новая палитра" : "Редактирование палитры" }}
        </h1>

        <p class="page-description">Настройте название и набор цветов.</p>
      </div>
    </div>

    <LoadingState v-if="isLoading" />

    <ErrorMessage v-else-if="errorMessage" :message="errorMessage" />

    <template v-else>
      <BasePanel title="Основная информация">
        <div class="form-group">
          <label for="palette-name"> Название палитры </label>

          <input id="palette-name" v-model="form.name" type="text" placeholder="Например, Закат" />
        </div>
      </BasePanel>

      <BasePanel title="Цвета">
        <div class="editor-colors">
          <ColorEditor
            v-for="color in form.colors"
            :key="color.id"
            :color="color"
            @update="handleColorUpdate"
            @remove="removeColor"
          />
        </div>

        <div class="editor-actions">
          <BaseButton variant="secondary" @click="createColor"> + Добавить цвет </BaseButton>
        </div>
      </BasePanel>

      <div class="page-actions">
        <BaseButton variant="secondary" @click="goBack"> Отмена </BaseButton>

        <BaseButton :disabled="isSaving" @click="savePalette">
          {{ isSaving ? "Сохранение..." : "Сохранить палитру" }}
        </BaseButton>
      </div>
    </template>
  </div>
</template>
