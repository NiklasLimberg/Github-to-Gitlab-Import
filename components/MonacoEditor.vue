<template>
  <div>
    aaaa
    <button @click="monacoDiffNavigator?.next()">
      Next
    </button>
    <button @click="monacoDiffNavigator?.previous()">
      Previous
    </button>
    <div
      ref="monacoContainer"
      class="resizeable"
    />
    <div
      ref="resizeHandle"
      class="handle"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'

import * as monaco from 'monaco-editor'
import type monacoType from 'monaco-editor'
import type { Environment as MonacoEnvironment } from 'monaco-editor/esm/vs/editor/editor.api'

// currently just chrome supports the way vite uses workers in dev mode
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import 'monaco-editor/esm/vs/basic-languages/php/php.contribution'

window.MonacoEnvironment = {
  getWorker (_, label) {
    switch (label) {
      case 'json':
        return new JsonWorker()
      case 'css' || 'scss' || 'less':
        return new CssWorker()
      case 'html':
        return new HtmlWorker()
      case 'typescript' || 'javascript':
        return new TsWorker()
      default: return new EditorWorker()
    }
  }
}

declare global {
  interface Window {
    MonacoEnvironment: MonacoEnvironment
  }
}

const monacoContainer = ref<HTMLDivElement | null>(null)
const resizeHandle = ref<HTMLDivElement | null>(null)

let monacoInstance: monacoType.editor.IStandaloneDiffEditor | undefined
let monacoDiffNavigator: monacoType.editor.IDiffNavigator | undefined

// this will be moved to the scope of the page
async function getPRInfo () {
  const requests = []
  requests[0] = fetch('https://raw.githubusercontent.com/shopware/platform/01b6568b680e7e3c1dd040e1bc56529a1ff44062/src/Core/Framework/Api/Controller/CacheController.php')
  requests[1] = fetch('https://raw.githubusercontent.com/shopware/platform/bfa90ba614705a4ea14c1da1deec1b0bbf86f27a/src/Core/Framework/Api/Controller/CacheController.php')
  const jsonTransforms = (await Promise.all(requests)).map(response => response.text())
  const [base, modified] = await Promise.all(jsonTransforms)
  return { base, modified }
}

onMounted(async () => {
  if (monacoContainer.value?.tagName !== 'DIV') {
    return
  }

  monacoInstance = monaco.editor.createDiffEditor(monacoContainer.value, {
    // You can optionally disable the resizing
    enableSplitViewResizing: true,
    theme: 'vs-dark'
  })

  const prInfo = await getPRInfo()

  const originalModel = monaco.editor.createModel(
    prInfo.base,
    'application/x-php'
  )
  const modifiedModel = monaco.editor.createModel(
    prInfo.modified,
    'application/x-php'
  )

  monacoInstance.setModel({
    original: originalModel,
    modified: modifiedModel
  })

  monacoDiffNavigator = monaco.editor.createDiffNavigator(monacoInstance, {
    followsCaret: true,
    ignoreCharChanges: true
  })

  monacoInstance.getLineChanges()

  if (resizeHandle.value) { setupResizeHandler(monacoContainer.value, resizeHandle.value, () => monacoInstance?.layout()) }
})

onUnmounted(() => {
  monacoInstance?.dispose()
})
</script>

<style lang="scss">
.resizeable {
  box-sizing: border-box;
  --resizeable-height: 300px;
  height: var(--resizeable-height);
  min-height: var(--min-height);
  max-height: var(--max-height);
  background-color: grey;
  resize: vertical;
}

.handle {
  cursor: row-resize;
  width: 100%;
  height: 5px;
  transition: height 0.25s;
  background-color: rgb(75, 75, 75);
  font-size: 30px;
  text-align: center;
}

.handle:hover {
  height: 10px;
}
</style>
