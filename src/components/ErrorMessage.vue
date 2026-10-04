<script setup lang="ts">
defineProps<{
  message: string;
}>();
</script>

<template>
  <div class="state-message state-message--error">
    {{ message }}
  </div>
</template>
