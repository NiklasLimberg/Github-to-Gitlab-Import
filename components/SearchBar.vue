<template>
  <div class="search-container">
    <icon-search />
    <input
      class="search-input"
      placeholder="Search all pull requests"
      :value="props.modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{modelValue: string}>(), {
    modelValue: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style scoped lang="scss">
.search-container {
  svg {
    position: absolute;
    padding-left: var(--default-unit); 
  }
  
  width: 100%;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding-left: 40px;

  font: var(--text-secondary);
}
</style>