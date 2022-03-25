import eslintPlugin from 'vite-plugin-eslint'
import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  alias: {
    '~~': '/<rootDir>',
    '@@': '/<rootDir>',
    '~': '/<rootDir>',
    '@': '/<rootDir>',
    assets: '/<rootDir>/assets',
    public: '/<rootDir>/public',
    '@/monaco-editor': '/<rootDir>/node_modules/monaco-editor'
  },
  ssr: false,
  vite: {
    plugins: [
      eslintPlugin()
    ]
  },
  typescript: {
    strict: true
  }
})
