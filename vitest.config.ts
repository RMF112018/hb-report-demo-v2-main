/**
 * Vitest Configuration for Phase 2 Testing
 * Comprehensive test setup with coverage targets and performance testing
 *
 * @module VitestConfig
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-29
 */

import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./__tests__/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "__tests__/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/*.setup.*",
        "coverage/",
        ".next/",
        "dist/",
        "build/",
        "public/",
        "scripts/",
        "stories/",
        "docs/",
        "bin/",
        "*.config.js",
        "*.config.ts",
        "*.config.mjs",
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}", "**/__tests__/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules/", "dist/", "build/", ".next/", "coverage/"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  define: {
    "process.env.NODE_ENV": '"test"',
  },
})
