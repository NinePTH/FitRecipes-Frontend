/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.git', '.cache', 'coverage'],
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    // Additional configuration for CI stability
    testTimeout: 20000,
    hookTimeout: 10000,
    teardownTimeout: 5000,
  },
})
