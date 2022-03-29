<template>
  <span
    class="label"
    :style="{ backgroundColor: color }"
  >
    {{ text }}
  </span>
</template>

<script setup lang="ts">
defineProps<{ text: string, color?: string}>()
</script>

<style scoped lang="scss">
.label {
  font: var(--text-semibold);
  padding: 8px 12px;
  background: var(--default-label-color);
  border-radius: 114px;
}
</style>