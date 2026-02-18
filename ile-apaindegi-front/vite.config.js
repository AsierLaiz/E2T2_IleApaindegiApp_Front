import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: 'ws',        // Fuerza el protocolo WebSocket
      host: '98.85.48.192',  // Pon tu IP pública aquí
      clientPort: 80,        // El navegador siempre pide al 80
    },
    watch: {
      usePolling: true,
    },
  },
})