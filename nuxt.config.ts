import eslintPlugin from 'vite-plugin-eslint'
import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
    ssr: false,
    privateRuntimeConfig: {
        GITHUB_API_TOKEN: process.env.GITHUB_API_TOKEN,
        GITLAB_AUTH_TOKEN: process.env.GITLAB_AUTH_TOKEN,
        JIRA_USER_NAME: process.env.JIRA_USER_NAME,
        JIRA_USER_PASSWORD: process.env.JIRA_USER_PASSWORD
    },
    typescript: {
        strict: true
    }
})
