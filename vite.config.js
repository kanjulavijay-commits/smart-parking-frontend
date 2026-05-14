import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('recharts'))          return 'charts'
          if (id.includes('react-router-dom'))  return 'vendor'
          if (id.includes('react-dom'))         return 'vendor'
          if (id.includes('@tanstack'))         return 'query'
          if (id.includes('zustand'))           return 'state'
        },
      },
    },
  },
})
