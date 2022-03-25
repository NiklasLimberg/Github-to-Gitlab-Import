import type { Environment as MonacoEnvironment } from 'monaco-editor/esm/vs/editor/editor.api'

declare global {
    interface Window {
      MonacoEnvironment: MonacoEnvironment
    }
}

declare module '*.worker?worker' {
  export = Worker
}

declare module '@nuxt/schema' {
  interface PrivateRuntimeConfig {
    GITHUB_API_TOKEN: string
  }
}
// It is always important to ensure you import/export something when augmenting a type
export {}
