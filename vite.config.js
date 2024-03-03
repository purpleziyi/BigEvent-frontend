import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
  ,
  server: {
    proxy: {
      '/api': { // get the request with api in path
        target: 'http://localhost:8080',  // back-end service
        changeOrigin: true, // change the origin
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
