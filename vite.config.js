
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/portfolio-ci-cd/',
  plugins: [react()],
  build: {
    target: 'es2020',
    cssMinify: true,
    assetsInlineLimit: 0,
  },
})
