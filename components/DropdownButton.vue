<template>
  <div class="button-container">
    <button
      class="main-button"
      aria-haspopup="true"
      @click="isOpen = !isOpen"
    >
      {{ props.buttonText }}
      <icon-chevron-down />
    </button>
    <div
      ref="target"
      class="dropdown"
      :class="isOpen ? 'open' : 'closed'"
      aria-label="submenu"
    >
      <search-bar class="search-container" />
      <ul>
        <li
          v-for="option in options"
          :key="option.name"
        >
          <span>{{ option.name }}</span>
          <icon-check v-if="option.selected" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

interface Option {
  name: string,
  selected: boolean
}

interface Props {
  buttonText: string
  options: Option[]
  hasSearch?: boolean
}

const target = ref(null)
const isOpen = ref(false);

onClickOutside(target, () => isOpen.value = false)

const props = withDefaults(defineProps<Props>(), {
  hasSearch: true
})
</script>


<style scoped>
.button-container {
  position: relative;
}

.main-button {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: var(--background-color);
  border: var(--default-border);
  border-radius: var(--default-border-radius)
}

.main-button:hover,
.button-container:focus-within > .main-button,
li:hover {
  background-color: var(--background-hover-color);
  cursor: pointer;
}

ul {
  list-style: none;
  padding-top: 8px;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;
  padding: 4px;
}

.search-container {
  padding-bottom: 8px;
  border-radius: 0;
  border-bottom: var(--default-border);
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