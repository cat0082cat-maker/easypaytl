import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/finance/calculator/',
  plugins: [react()],
  build: {
    outDir: 'firebase-dist/finance/calculator',
    emptyOutDir: true,
  },
})
