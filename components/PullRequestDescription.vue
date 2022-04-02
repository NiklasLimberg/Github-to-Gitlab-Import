<template>
  <div
    class="description-container"
    v-html="description"
  />
</template>

<script setup lang="ts">
defineProps<{description: string}>()
</script>

<style scoped lang="scss">
.description-container {
    /* purgecss ignore current */
    :nth-child(1) {
        margin: 0;
    }

    border: var(--default-border);
    border-radius: 6px;
    background-color: var(--background-color);
    padding: 24px;
}
</style>