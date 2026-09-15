import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
  server: {
    proxy: {
      '/api/dict': {
        target: 'https://dict.youdao.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dict/, ''),
      },
    },
  },
})
