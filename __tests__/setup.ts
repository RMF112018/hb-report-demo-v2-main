/**
 * Test Setup Configuration for Phase 2
 * Comprehensive test environment setup with React Testing Library and performance testing
 *
 * @module TestSetup
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-29
 */

import "@testing-library/jest-dom"
import { vi } from "vitest"
import React from "react"

// Extend Performance interface for memory tracking
declare global {
  interface Performance {
    memory?: {
      usedJSHeapSize: number
      totalJSHeapSize: number
      jsHeapSizeLimit: number
    }
  }
}

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}))

// Mock Next.js image component
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement("img", { src, alt, ...props })
  },
}))

// Mock structured logger
vi.mock("@/lib/structured-logger", () => ({
  structuredLogger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    critical: vi.fn(),
    withContext: vi.fn(() => ({
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      critical: vi.fn(),
    })),
  },
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  critical: vi.fn(),
}))

// Mock environment validation
vi.mock("@/lib/env-validation", () => ({
  validateEnv: vi.fn(() => ({
    NODE_ENV: "test",
    NEXT_PUBLIC_APP_NAME: "HB Report Demo",
    LOG_LEVEL: "debug",
    ENABLE_ANALYTICS: false,
    ENABLE_DEBUG_MODE: true,
    NEXT_PUBLIC_VERSION: "3.0.0",
  })),
  env: {
    NODE_ENV: "test",
    NEXT_PUBLIC_APP_NAME: "HB Report Demo",
    LOG_LEVEL: "debug",
    ENABLE_ANALYTICS: false,
    ENABLE_DEBUG_MODE: true,
    NEXT_PUBLIC_VERSION: "3.0.0",
  },
  isFeatureEnabled: vi.fn(() => false),
  getAppConfig: vi.fn(() => ({
    name: "HB Report Demo",
    version: "3.0.0",
    environment: "test",
    debugMode: true,
    analytics: false,
    url: undefined,
  })),
}))

// Mock performance utilities
vi.mock("@/lib/performance-utils", () => ({
  useDeepMemo: vi.fn((factory: () => unknown) => factory()),
  useDeepCallback: vi.fn((callback: unknown) => callback),
  useEventListener: vi.fn(),
  useResizeObserver: vi.fn(),
  useIntersectionObserver: vi.fn(),
  useMutationObserver: vi.fn(),
  useDebouncedCallback: vi.fn((callback: unknown) => callback),
  useThrottledCallback: vi.fn((callback: unknown) => callback),
  measurePerformance: vi.fn(async (_name: string, fn: () => unknown) => fn()),
  usePerformanceMeasure: vi.fn(() => vi.fn(async (fn: () => unknown) => fn())),
  debounce: vi.fn((func: unknown) => func),
  throttle: vi.fn((func: unknown) => func),
  deepEqual: vi.fn((a: unknown, b: unknown) => a === b),
  isFunction: vi.fn((value: unknown) => typeof value === "function"),
  isObject: vi.fn((value: unknown) => typeof value === "object" && value !== null && !Array.isArray(value)),
  isArray: vi.fn((value: unknown) => Array.isArray(value)),
}))

// Mock context providers
vi.mock("@/context/auth-context", () => ({
  useAuth: () => ({
    user: {
      id: "test-user-id",
      email: "test@example.com",
      name: "Test User",
      role: "project-manager",
    },
    login: vi.fn(),
    logout: vi.fn(),
    isLoading: false,
    isClient: true,
    hasAutoInsightsMode: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}))

vi.mock("@/context/project-context", () => ({
  useProjectContext: () => ({
    projectId: "test-project-id",
    project: {
      id: "test-project-id",
      name: "Test Project",
      status: "active",
    },
    setProjectId: vi.fn(),
  }),
  ProjectProvider: ({ children }: { children: React.ReactNode }) => children,
}))

vi.mock("@/context/tour-context", () => ({
  useTour: () => ({
    startTour: vi.fn(),
    isTourAvailable: true,
    resetTourState: vi.fn(),
  }),
  TourProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock hooks
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}))

// Mock data
vi.mock("@/data/mock/projects.json", () => [
  {
    id: "test-project-1",
    name: "Test Project 1",
    status: "active",
    project_stage_name: "Construction",
    budget: 1000000,
    start_date: "2024-01-01",
    end_date: "2024-12-31",
  },
  {
    id: "test-project-2",
    name: "Test Project 2",
    status: "active",
    project_stage_name: "Pre-Construction",
    budget: 500000,
    start_date: "2024-02-01",
    end_date: "2024-11-30",
  },
])

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

global.MutationObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
}))

// Performance testing utilities
export const createPerformanceTest = (name: string) => {
  const startTime = performance.now()

  return {
    end: () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      console.log(`Performance Test [${name}]: ${duration.toFixed(2)}ms`)
      return duration
    },
  }
}

// Memory leak detection
export const createMemoryLeakDetector = () => {
  const initialMemory = performance.memory?.usedJSHeapSize || 0

  return {
    check: () => {
      const currentMemory = performance.memory?.usedJSHeapSize || 0
      const memoryIncrease = currentMemory - initialMemory

      if (memoryIncrease > 10 * 1024 * 1024) {
        // 10MB threshold
        console.warn(`Potential memory leak detected: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB increase`)
      }

      return memoryIncrease
    },
  }
}

// Custom matchers for performance testing
expect.extend({
  toBeWithinPerformanceThreshold(received: number, expected: number, threshold: number = 100) {
    const pass = Math.abs(received - expected) <= threshold
    return {
      message: () => `expected ${received} to be within ${threshold}ms of ${expected}`,
      pass,
    }
  },
})

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeWithinPerformanceThreshold(expected: number, threshold?: number): R
    }
  }
}
