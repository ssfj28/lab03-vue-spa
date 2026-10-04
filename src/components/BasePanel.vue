<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<template>
  <section class="panel">
    <h2 v-if="title" class="panel-title">
      {{ title }}
    </h2>

    <div class="panel-content">
      <slot />
    </div>
  </section>
</template>
