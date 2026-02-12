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
    host: '0.0.0.0', // Permite que Vite sea accesible fuera del contenedor
    port: 5173,      // El puerto que mapeas en Docker
    strictPort: true,
    hmr: {
      path: '/ws',      // Ruta que configuramos en Apache (ProxyPass /ws)
      clientPort: 80,   // El navegador se comunica por el puerto 80 (Apache)
    },
    watch: {
      usePolling: true, // Necesario para que detecte cambios dentro de Docker en Windows/AWS
    },
  },
})