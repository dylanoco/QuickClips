import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/app/',
  plugins: [react()], 
  server: {port: 5001},
  build: {
    rollupOptions: {
      external: [],
    },
  },
})
