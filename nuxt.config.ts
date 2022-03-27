import eslintPlugin from 'vite-plugin-eslint'
import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
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
