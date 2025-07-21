/**
 * Jest configuration for HB Report Demo application
 * Provides comprehensive testing setup for React, TypeScript, and Next.js
 *
 * @module JestConfig
 * @version 1.0.0
 * @author HB Development Team
 */

const nextJest = require("next/jest")

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: "./",
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Test environment
  testEnvironment: "jsdom",

  // Module name mapping
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^.+\\.(css|sass|scss)$": "identity-obj-proxy",
  },

  // Test file patterns
  testMatch: ["<rootDir>/**/__tests__/**/*.{js,jsx,ts,tsx}", "<rootDir>/**/*.{test,spec}.{js,jsx,ts,tsx}"],

  // Coverage configuration
  collectCoverageFrom: [
    "components/**/*.{js,jsx,ts,tsx}",
    "hooks/**/*.{js,jsx,ts,tsx}",
    "lib/**/*.{js,jsx,ts,tsx}",
    "context/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**",
    "!**/jest.config.js",
    "!**/jest.setup.js",
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Coverage reporters
  coverageReporters: ["text", "lcov", "html"],

  // Test timeout
  testTimeout: 10000,

  // Module file extensions
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],

  // Transform configuration
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },

  // Transform ignore patterns
  transformIgnorePatterns: ["/node_modules/", "^.+\\.module\\.(css|sass|scss)$"],

  // Test environment setup
  testEnvironmentOptions: {
    customExportConditions: [""],
  },

  // Watch plugins
  watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks between tests
  restoreMocks: true,

  // Reset modules between tests
  resetModules: true,
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
