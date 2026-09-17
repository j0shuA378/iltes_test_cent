import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

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
})
