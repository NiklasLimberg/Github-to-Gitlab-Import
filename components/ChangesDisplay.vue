<template>
  <div class="flex gap-large">
    <div class="flex gap-small">
      <icon-additions />
      <span>{{ additions }}</span>
    </div>
    <div class="flex gap-small">
      <icon-deletions />
      <span>{{ deletions }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{additions: number, deletions: number}>()
</script>

<style scoped>
.flex {
    display: inline-flex;
    align-items: center;
}

.gap-small {
    gap: 2px;
}

.gap-large {
    gap: 12px;
}
</style>