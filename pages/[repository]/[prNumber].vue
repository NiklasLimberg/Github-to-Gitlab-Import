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
    class="editor-container"
      v-for="(file, index) in files"
      :key="file.path"
      :path="file.path"
      :base="file.baseFile"
      :modified="file.modifiedFile"
    />
  </div>
</template>

<script setup lang="ts">
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
    const getFile = createFileProvider(
        'shopware', 
        pullRequest.value.repository.name,
        pullRequest.value.baseRefOid,
        pullRequest.value.headRefOid
    )

    files.value = await Promise.all(pullRequest.value.files.map(file => getFile(file.path)))
})
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