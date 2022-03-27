<template>
  <header>
    <h1>Github Importer</h1>
    <icon-cog />
  </header>
  <main>
    <section class="search-section">
      <search-bar />
      <repository-dropdown />
      <author-dropdown />
      <assignee-dropdown />
      <label-dropdown />
      <review-dropdown />
    </section>
  </main>
</template>

<style lang="scss" scoped>
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
