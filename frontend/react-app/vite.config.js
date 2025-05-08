import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/app/',
  plugins: [
    react(),
    tailwindcss(),
  ], 
  server: {port: 5001},
  build: {
    rollupOptions: {
      external: [],
    },
  },
})
