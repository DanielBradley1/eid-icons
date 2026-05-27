import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  appType: 'spa',
  server: {
    // Strip trailing slashes in dev
    middlewareMode: false,
  },
  preview: {
    port: 4173,
  },
})
