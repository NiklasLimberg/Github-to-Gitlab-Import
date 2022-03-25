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
  },
  ssr: false,
  vite: {
    plugins: [
      eslintPlugin()
    ]
  },
  privateRuntimeConfig: {
    GITHUB_API_TOKEN: process.env.GITHUB_API_TOKEN
  },
  typescript: {
    strict: true
  }
})
