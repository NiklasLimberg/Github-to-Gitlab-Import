<template>
  <div class="button-container">
    <div @click="isOpen = !isOpen">
      <slot
        name="base"
      />
    </div>
    
    <div
      ref="target"
      class="dropdown"
      :class="isOpen ? 'open' : 'closed'"
      aria-label="submenu"
    >
      <slot name="elements" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const target = ref(null)
const isOpen = ref(false);

onClickOutside(target, () => isOpen.value = false)
</script>


<style scoped>
.button-container {
  position: relative;
}

.button-container:focus-within > .main-button,
li:hover {
  background-color: var(--background-hover-color);
  cursor: pointer;
}

.dropdown {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  transition: all 0.5s ease;
  margin-top: 8px;
  right: 0;
  display: none;
  width: 300px;
  padding: 8px;
  border: var(--default-border);
  border-radius: var(--default-border-radius);
  background-color: var(--background-color);
}

.dropdown.open {
   visibility: visible;
   opacity: 1;
   display: block;
}
</style>