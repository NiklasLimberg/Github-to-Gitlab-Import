import { resolve } from 'path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            'monaco-editor/': resolve(__dirname, './node_modules/monaco-editor/'),
            src: resolve(__dirname, 'src'),
        },
    },
});
