import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (_err, _req, res) => {
            if ('writeHead' in res && !res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ status: 'offline', message: 'Backend service offline, falling back to local sandbox' }));
            }
          });
        }
      }
    },
  },
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/vue') || id.includes('node_modules/pinia') || id.includes('node_modules/vue-router')) {
            return 'vendor-vue';
          }
          if (id.includes('node_modules/lucide-vue-next') || id.includes('node_modules/@lucide')) {
            return 'vendor-icons';
          }
          if (id.includes('src/data/readingTests')) {
            return 'data-reading';
          }
          if (id.includes('src/data/listeningTests')) {
            return 'data-listening';
          }
          if (id.includes('src/data/writingTasks')) {
            return 'data-writing';
          }
          if (id.includes('src/data/speakingTopics') || id.includes('src/data/vocabularyData') || id.includes('src/data/dictionaryData')) {
            return 'data-vocab-speech';
          }
        }
      }
    }
  }
});
