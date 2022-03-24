/// <reference types="vite/client" />

import { Environment as MonacoEnvironment } from 'monaco-editor/esm/vs/editor/editor.api';

declare global {
  interface Window {
    MonacoEnvironment: MonacoEnvironment
  }
}

export {};
