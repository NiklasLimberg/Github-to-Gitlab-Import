<template>
  <div v-if="!pending">
    <header class="header">
      <div>
        <h1>{{ pullRequest.title }} <span class="secondary-text">#{{ pullRequest.number }}</span></h1>
        <div class="labels">
          <label-display
            v-for="label in pullRequest.labels"
            :key="label.id"
            :text="label.name"
            :color="'#' + label.color"
          />
        </div>
      </div>
      <div class="action-buttons">
        <nuxt-link>
          <button class="button-secondary">
            Github
          </button>
        </nuxt-link>
        <button class="button-primary">
          Import
        </button>
      </div>
    </header>
    <section class="description-section">
      <pull-request-description :description="pullRequest.bodyHTML" />
      <pull-request-side-bar
        :author="pullRequest.author"
        :assignee="pullRequest.assignee"
        :review-passed="pullRequest.reviewDecision !== 'CHANGES_REQUESTED'"
        :mergeable="pullRequest.mergeable"
      />
    </section>
    <changes-display
      :additions="pullRequest.additions"
      :deletions="pullRequest.deletions"
      class="changes-display"
    />
    <section>
      <monaco-editor
        v-for="file in files"
        :key="file.path"
        class="editor-container"
        :path="file.path"
        :base="file.baseFile"
        :modified="file.modifiedFile"
        @override="(override) => fileOverride(file.path, override)"
      />
    </section>
  </div>
  <commit-message-modal />
</template>

<script setup lang="ts">
registerMonacoWorkers()

interface File {
  path: string
  baseFile: string
  modifiedFile: string
}

const route = useRoute()
const repository = route.params.repository as string;
const prNumber = route.params.prNumber as string;

const { data: pullRequest, pending } = await useFetch('/api/pull', { 
    params: {
        repositoryName: repository,
        prNumber
    } 
})


let files = ref([] as File[])
watch(pullRequest, async () => {
    if(!pullRequest.value) {
        return
    }
    
    const getFile = createFileProvider(
        'shopware', 
        pullRequest.value.repository.name,
        pullRequest.value.baseRefOid,
        pullRequest.value.headRefOid
    )

    files.value = await Promise.all(pullRequest.value.files.map(file => getFile(file.path)))
}, { immediate: true })

const overrides = new Map<string, string>()
function fileOverride(path: string, override: string) {
    console.log(override)
    if(override.length === 0) {
        overrides.delete(path)
        return
    }
    overrides.set(path, override)
}

</script>


<style scoped>
.header {
  padding-bottom: 48px;
  display: flex;
  justify-content: space-between;
}

.action-buttons {
  display: inline-flex;
  gap: 16px;
}
.labels {
   padding-top: 24px;
}
.editor-container {
  margin-bottom: 16px;
}

.secondary-text {
  font: var(--text-secondary)
}
.description-section {
  display: grid;
  grid-template-columns: 8fr 2fr;
  gap: 32px;
  padding-bottom: 48px;
  border-bottom: var(--default-border);
}

.changes-display {
  margin: 24px 0px;
  padding: 8px 12px;
  background-color: var(--background-color);
  border-radius: 6px;
}
</style>