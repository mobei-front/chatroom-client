// vite.config.js  
import { defineConfig } from 'vite'  
import vue from '@vitejs/plugin-vue'  
  
export default defineConfig({  
  base: process.env.GITHUB_ACTIONS === 'true' ? '/chatroom-client/' : '/',
  plugins: [vue()],
  server: {
    port: 5173,
    host: 'localhost',
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
})
