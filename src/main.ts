import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './index.css';
import { initSyncEngine } from './services/syncService';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

// Global Vue error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('[IELTS Master Error Boundary]:', err, {
    component: instance?.$options?.name || 'AnonymousComponent',
    lifecycleHook: info
  });
};

// Global unhandled promise rejection handler
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[IELTS Master Unhandled Rejection]:', event.reason);
  });
}

// Initialize hybrid local-first sync engine
initSyncEngine();

// Register PWA service worker in production
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('[SW Registration Error]:', err);
    });
  });
}

app.mount('#app');
