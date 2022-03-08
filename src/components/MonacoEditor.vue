<template>
  <div>
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
import { onMounted, ref, onUnmounted } from 'vue';

import * as monaco from 'monaco-editor';

// currently just chrome supports the way vite uses workers in dev mode
/* eslint-disable import/no-unresolved */
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

import setupResizeHandler from 'src/composables/resizeHandler';
/* eslint-enable import/no-unresolved */

window.MonacoEnvironment = {
    getWorker(_, label) {
        switch (label) {
            case 'json':
                return new JsonWorker();
            case 'css' || 'scss' || 'less':
                return new CssWorker();
            case 'html':
                return new HtmlWorker();
            case 'typescript' || 'javascript':
                return new TsWorker();
            default: return new EditorWorker();
        }
    },
};
const monacoContainer = ref<HTMLDivElement | null>(null);
const resizeHandle = ref<HTMLDivElement | null>(null);

let monacoInstance: monaco.editor.IDiffEditor | undefined;
const resizeObserver = new ResizeObserver(() => monacoInstance?.layout());

const originalModel = monaco.editor.createModel(
    'This line is removed on the right.\njust some text\nabcd\nefgh\nSome more text',
    'text/',
);
const modifiedModel = monaco.editor.createModel(
    'just some text\nabcz\nzzzzefgh\nSome more text.\nThis line is removed on the left.',
    'text/plain',
);

onMounted(() => {
    if (monacoContainer.value?.tagName !== 'DIV') {
        return;
    }

    monacoInstance = monaco.editor.createDiffEditor(monacoContainer.value, {
        // You can optionally disable the resizing
        enableSplitViewResizing: true,
        theme: 'vs-dark',
    });
    monacoInstance.setModel({
        original: originalModel,
        modified: modifiedModel,
    });

    resizeObserver.observe(monacoContainer.value, { box: 'border-box' });

    if (resizeHandle.value) { setupResizeHandler(monacoContainer.value, resizeHandle.value); }
});

onUnmounted(() => {
    resizeObserver.disconnect();
    monacoInstance?.dispose();
});
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
