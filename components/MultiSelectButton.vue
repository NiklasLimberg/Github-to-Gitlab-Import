<template>
  <dropdown-element>
    <template #base>
      <button
        class="main-button"
        aria-haspopup="true"
      >
        {{ props.title }}
        <icon-chevron-down />
      </button>
    </template>
    <template #elements>
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
    </template>
  </dropdown-element>
</template>

<script setup lang="ts">
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
</script>


<style scoped>

.main-button {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: var(--background-color);
  border: var(--default-border);
  border-radius: var(--default-border-radius)
}

.main-button:hover, li:hover {
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
</style>