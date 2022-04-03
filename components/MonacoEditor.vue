<template>
  <div class="container">
    <div class="header">
      <div class="info">
        {{ path }}
      </div>
      <div class="changes">
        420 - 150
      </div>
    </div>
    <div
      ref="monacoContainer"
      class="editor"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'

import * as monaco from 'monaco-editor'
import type monacoType from 'monaco-editor'

import {createPatch } from 'diff'

const monacoContainer = ref<HTMLDivElement | null>(null)

let monacoInstance: monacoType.editor.IStandaloneDiffEditor | undefined

const props = defineProps<{path: string, base: string, modified: string}>()
const emit = defineEmits<{(e: 'override', value: string): void}>()

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

    monacoInstance.onDidUpdateDiff(() => {
        const modifiedValue = monacoInstance?.getModifiedEditor().getValue() || '';
        const override = modifiedValue === props.modified ? '' : createPatch(props.path, props.modified, modifiedValue) 
        emit('override', override)
    })

    monacoInstance.getLineChanges()
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

.editor {
    height: 480px;
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
</style>
