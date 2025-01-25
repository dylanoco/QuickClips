import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], 
  server: {port: 5001},
  build: {
    rollupOptions: {
      external: ['sonner','../react-project/node_modules/sonner/dist/index.js'],
    },
  },
})
