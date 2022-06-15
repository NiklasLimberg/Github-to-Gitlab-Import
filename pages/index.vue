<template>
  <div>
    <header>
      <h1>Github Importer</h1>
      <settings />
    </header>
    <main>
      <section class="search-section">
        <search-section v-model="searchTerm" />
      </section>
      <section class="pullRequestCards">
        <pull-request-overview-card
          v-for="pullRequest in pullRequests"
          :key="pullRequest.id"
          :pull-request="pullRequest"
        />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { debouncedWatch } from '@vueuse/core'

const searchTerm = ref('repo:shopware/platform is:pr is:open')
const { data: pullRequests, refresh: refreshList } = await useFetch('/api/pulls', { method: 'post', body: { q: searchTerm.value } })

debouncedWatch(searchTerm, async () => {
    refreshList()
}, { debounce: 100 })

</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}

header {
  display: flex;
  justify-content: space-between;
}

.search-section {
  display: flex;
  padding: 48px 0 16px 0;
  gap: var(--default-unit);
}
</style>
