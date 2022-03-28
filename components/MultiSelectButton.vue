<template>
  <div class="button-container">
    <button
      class="main-button"
      aria-haspopup="true"
      @click="isOpen = !isOpen"
    >
      {{ props.title }}
      <icon-chevron-down />
    </button>
    <div
      ref="target"
      class="dropdown"
      :class="isOpen ? 'open' : 'closed'"
      aria-label="submenu"
    >
      <search-bar
        :model-value="props.searchTerm"
        class="search-container"
        @update:model-value="emit('search', $event)"
      />
      <ul>
        <li
          v-for="option in props.options"
          :key="option.name"
          @click="emit('optionClick', option.id)"
        >
          <span>{{ option.name }}</span>
          <icon-check v-if="props.selection.includes(option.id)" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

interface Option {
  id: string,
  name: string
}

interface Props {
  title: string
  options?: Option[],
  selection?: string[],
  hasSearch?: boolean,
  searchTerm?: string
}

const target = ref(null)
const isOpen = ref(false);

const props = withDefaults(defineProps<Props>(), {
    selection: () => [],
    options: () => [],
    hasSearch: true,
    searchTerm: ''
})

const emit = defineEmits<{
  (e: 'optionClick', value: string): void,
  (e: 'search', value: string): void
}>()

onClickOutside(target, () => isOpen.value = false)
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