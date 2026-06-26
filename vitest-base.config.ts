import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    isolate: true,
    include: ['src/**/*.spec.ts'],
    exclude: ['libs/**/*.spec.ts', '**/node_modules/**'],
  },
})
