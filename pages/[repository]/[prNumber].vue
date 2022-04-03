<template>
  <div v-if="!pending">
    <div class="header">
      <h1>{{ pullRequest.title }} #{{ pullRequest.number }}</h1>
      <div class="labels">
        <label-display
          v-for="label in pullRequest.labels"
          :key="label.id"
          :text="label.name"
          :color="'#' + label.color"
        />
      </div>
    </div>
    <pull-request-description :description="pullRequest.bodyHTML" />

    <div>{{ pullRequest.additions }} - {{ pullRequest.deletions }}</div>

    <monaco-editor
      v-for="file in files"
      :key="file.path"
      class="editor-container"
      :path="file.path"
      :base="file.baseFile"
      :modified="file.modifiedFile"
      @override="(override) => fileOverride(file.path, override)"
    />
  </div>
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
}
.labels {
   padding-top: 24px;
}
.editor-container {
  margin-bottom: 16px;
}
</style>