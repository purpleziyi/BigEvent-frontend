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
  // 当路径如http://localhost:5173/api/user/register时，最后会去掉api并变为 http://localhost:8080/user/register
  server: {
    proxy: {  
      '/api': {  // get the request with api in path
        target: 'http://localhost:8080',   
        changeOrigin: true,  
        rewrite: (path) => path.replace(/^\/api/, '')  // replace "api" to '' in the new path
      }
    }
  }
})
