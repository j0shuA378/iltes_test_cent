import { createApp } from 'vue';
import App from './App.vue';
import './index.css';
import { initSyncEngine } from './services/syncService';

// Initialize hybrid local-first sync engine
initSyncEngine();

// Register minimal PWA service worker in production
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

createApp(App).mount('#app');
