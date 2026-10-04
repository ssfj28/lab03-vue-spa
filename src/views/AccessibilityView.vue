<script setup lang="ts">
import { computed, ref } from "vue";

import BasePanel from "../components/BasePanel.vue";
import ErrorMessage from "../components/ErrorMessage.vue";

import { getContrastResult } from "../utils/contrast";

import { isValidHex } from "../utils/validation";

const foreground = ref("#222222");
const background = ref("#FFFFFF");

const inputsAreValid = computed(() => {
  return isValidHex(foreground.value) && isValidHex(background.value);
});

const result = computed(() => {
  if (!inputsAreValid.value) {
    return null;
  }

  return getContrastResult(foreground.value, background.value);
});
</script>

<template>
  <div class="container page">
    <div class="page-header">
      <div>
        <h1>Проверка доступности</h1>

        <p class="page-description">Проверьте контраст текста и фона.</p>
      </div>
    </div>

    <BasePanel title="Цвета">
      <div class="accessibility-inputs">
        <div class="form-group">
          <label for="foreground"> Цвет текста </label>

          <div class="hex-input-row">
            <input id="foreground" v-model="foreground" type="text" maxlength="7" />

            <input v-model="foreground" type="color" />
          </div>
        </div>

        <div class="form-group">
          <label for="background"> Цвет фона </label>

          <div class="hex-input-row">
            <input id="background" v-model="background" type="text" maxlength="7" />

            <input v-model="background" type="color" />
          </div>
        </div>
      </div>

      <ErrorMessage
        v-if="!inputsAreValid"
        message="Введите два корректных цвета в формате #RRGGBB."
      />
    </BasePanel>

    <BasePanel v-if="result" title="Результат">
      <div
        class="contrast-result"
        :style="{
          color: foreground,
          backgroundColor: background,
        }"
      >
        Пример текста с выбранными цветами
      </div>

      <div class="contrast-ratio">
        <strong> Коэффициент контрастности: </strong>

        {{ result.ratio }}:1
      </div>

      <div class="wcag-result">
        <span :class="['wcag-badge', result.wcagAA ? 'wcag-badge--success' : 'wcag-badge--error']">
          WCAG AA:
          {{ result.wcagAA ? "пройден" : "не пройден" }}
        </span>

        <span :class="['wcag-badge', result.wcagAAA ? 'wcag-badge--success' : 'wcag-badge--error']">
          WCAG AAA:
          {{ result.wcagAAA ? "пройден" : "не пройден" }}
        </span>
      </div>
    </BasePanel>
  </div>
</template>
