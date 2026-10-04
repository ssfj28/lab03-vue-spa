<script setup lang="ts">
defineProps<{
  message: string;
}>();
</script>

<template>
  <div class="state-message">
    {{ message }}
  </div>
</template>
