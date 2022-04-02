<template>
  <div class="container">
    <div class="header">
      <div class="info">
        <button @click="monacoDiffNavigator?.next()">
          Next
        </button>
        <button @click="monacoDiffNavigator?.previous()">
          Previous
        </button>
        <div>{{ path }}</div>
      </div>
      <div class="changes">
        420 - 150
      </div>
    </div>
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

// currently just chrome supports the way vite uses workers in dev mode
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// @ts-ignore
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// @ts-ignore
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// @ts-ignore
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
// @ts-ignore
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
/* eslint-enable @typescript-eslint/ban-ts-comment */

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

const monacoContainer = ref<HTMLDivElement | null>(null)
const resizeHandle = ref<HTMLDivElement | null>(null)

let monacoInstance: monacoType.editor.IStandaloneDiffEditor | undefined
let monacoDiffNavigator: monacoType.editor.IDiffNavigator | undefined

const props = defineProps<{path: string, base: string, modified: string}>()

function detectLanguage(path: string) {
    switch (path.split('.').pop()) {
    case 'css':
        return 'css';
    case 'js' || 'ts':
        return 'typescript'
    case 'php':
        return 'php'
    case 'md':
        return 'markdown'
    case 'twig' || 'html':
        return 'html'
    default: 
        return 'text'
    }
}


onMounted(async () => {
    if (monacoContainer.value?.tagName !== 'DIV') {
        return
    }

    const language = detectLanguage(props.path);
    const originalModel = monaco.editor.createModel(
        props.base,
        language
    )

    const modifiedModel = monaco.editor.createModel(
        props.modified,
        language
    )

    monacoInstance = monaco.editor.createDiffEditor(monacoContainer.value, {
    // You can optionally disable the resizing
        enableSplitViewResizing: true,
        theme: 'vs-dark'
    })

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

<style scoped lang="scss">
.container {
    background-color: var(--background-color) ;
    border: var(--default-border);
    border-radius: 6px;
}

.header {
    border-bottom: var(--default-border);
    display: flex;
    padding: 6px 8px;
    justify-content: space-between;
    align-items: center;
}

.info {
    display: flex;
    align-items: center;
    gap: 8px
}

.changes {
    display: flex;
    align-items: center;
}

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
