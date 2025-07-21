import { getLogger } from "@logtape/logtape"

/**
 * Structured logging service for HB Report Demo v3.0
 *
 * This service provides structured logging capabilities with:
 * - Log levels (debug, info, warn, error)
 * - Structured data with metadata
 * - Performance tracking
 * - Error handling with stack traces
 * - Production-safe logging (debug logs disabled in production)
 *
 * @example
 * ```typescript
 * import { logger } from '@/lib/structured-logger'
 *
 * // Basic logging
 * logger.info('User logged in', { userId: '123', role: 'project-manager' })
 *
 * // Error logging with context
 * logger.error('Failed to load data', {
 *   component: 'Dashboard',
 *   function: 'loadData',
 *   error: err
 * })
 *
 * // Performance tracking
 * logger.track('ExpensiveOperation', async () => {
 *   return await expensiveCalculation()
 * })
 * ```
 */

// Create the main logger instance
const logger = getLogger("hb-report-demo")

/**
 * Performance logger for tracking component render times and operations
 */
export const performanceLogger = {
  /**
   * Track the performance of a function or operation
   * @param name - Name of the operation being tracked
   * @param fn - Function to execute and track
   * @param metadata - Additional metadata for the operation
   */
  async track<T>(name: string, fn: () => Promise<T> | T, metadata?: Record<string, unknown>): Promise<T> {
    const start = performance.now()
    try {
      const result = await fn()
      const duration = performance.now() - start

      logger.debug(`Performance [${name}]`, {
        duration: `${duration.toFixed(2)}ms`,
        success: true,
        ...metadata,
      })

      return result
    } catch (error) {
      const duration = performance.now() - start

      logger.error(`Performance [${name}] failed`, {
        duration: `${duration.toFixed(2)}ms`,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        ...metadata,
      })

      throw error
    }
  },

  /**
   * Track synchronous operations
   * @param name - Name of the operation being tracked
   * @param fn - Function to execute and track
   * @param metadata - Additional metadata for the operation
   */
  trackSync<T>(name: string, fn: () => T, metadata?: Record<string, unknown>): T {
    const start = performance.now()
    try {
      const result = fn()
      const duration = performance.now() - start

      logger.debug(`Performance [${name}]`, {
        duration: `${duration.toFixed(2)}ms`,
        success: true,
        ...metadata,
      })

      return result
    } catch (error) {
      const duration = performance.now() - start

      logger.error(`Performance [${name}] failed`, {
        duration: `${duration.toFixed(2)}ms`,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        ...metadata,
      })

      throw error
    }
  },
}

/**
 * Component logger for tracking React component lifecycle and performance
 */
export const componentLogger = {
  /**
   * Log component mount
   * @param componentName - Name of the component
   * @param props - Component props (sanitized)
   */
  mount(componentName: string, props?: Record<string, unknown>) {
    logger.debug(`Component mounted`, {
      component: componentName,
      props: props ? sanitizeProps(props) : undefined,
    })
  },

  /**
   * Log component unmount
   * @param componentName - Name of the component
   */
  unmount(componentName: string) {
    logger.debug(`Component unmounted`, {
      component: componentName,
    })
  },

  /**
   * Log component render
   * @param componentName - Name of the component
   * @param renderTime - Time taken to render in milliseconds
   */
  render(componentName: string, renderTime: number) {
    logger.debug(`Component rendered`, {
      component: componentName,
      renderTime: `${renderTime.toFixed(2)}ms`,
    })
  },

  /**
   * Log component error
   * @param componentName - Name of the component
   * @param error - Error that occurred
   * @param errorBoundary - Whether error was caught by error boundary
   */
  error(componentName: string, error: Error, errorBoundary = false) {
    logger.error(`Component error`, {
      component: componentName,
      error: error.message,
      stack: error.stack,
      errorBoundary,
    })
  },
}

/**
 * Hook logger for tracking custom hook usage and performance
 */
export const hookLogger = {
  /**
   * Log hook initialization
   * @param hookName - Name of the hook
   * @param params - Hook parameters
   */
  init(hookName: string, params?: Record<string, unknown>) {
    logger.debug(`Hook initialized`, {
      hook: hookName,
      params: params ? sanitizeProps(params) : undefined,
    })
  },

  /**
   * Log hook state change
   * @param hookName - Name of the hook
   * @param stateName - Name of the state that changed
   * @param oldValue - Previous value
   * @param newValue - New value
   */
  stateChange(hookName: string, stateName: string, oldValue: unknown, newValue: unknown) {
    logger.debug(`Hook state changed`, {
      hook: hookName,
      state: stateName,
      oldValue: sanitizeValue(oldValue),
      newValue: sanitizeValue(newValue),
    })
  },

  /**
   * Log hook error
   * @param hookName - Name of the hook
   * @param error - Error that occurred
   */
  error(hookName: string, error: Error) {
    logger.error(`Hook error`, {
      hook: hookName,
      error: error.message,
      stack: error.stack,
    })
  },
}

/**
 * API logger for tracking API calls and responses
 */
export const apiLogger = {
  /**
   * Log API request
   * @param method - HTTP method
   * @param url - Request URL
   * @param params - Request parameters
   */
  request(method: string, url: string, params?: Record<string, unknown>) {
    logger.info(`API request`, {
      method,
      url,
      params: params ? sanitizeProps(params) : undefined,
    })
  },

  /**
   * Log API response
   * @param method - HTTP method
   * @param url - Request URL
   * @param status - Response status code
   * @param duration - Request duration in milliseconds
   */
  response(method: string, url: string, status: number, duration: number) {
    logger.info(`API response`, {
      method,
      url,
      status,
      duration: `${duration.toFixed(2)}ms`,
    })
  },

  /**
   * Log API error
   * @param method - HTTP method
   * @param url - Request URL
   * @param error - Error that occurred
   * @param duration - Request duration in milliseconds
   */
  error(method: string, url: string, error: Error, duration: number) {
    logger.error(`API error`, {
      method,
      url,
      error: error.message,
      duration: `${duration.toFixed(2)}ms`,
    })
  },
}

/**
 * Utility functions for sanitizing sensitive data
 */

/**
 * Sanitize component props to remove sensitive information
 * @param props - Component props to sanitize
 * @returns Sanitized props
 */
function sanitizeProps(props: Record<string, unknown>): Record<string, unknown> {
  const sensitiveKeys = ["password", "token", "secret", "key", "auth", "credential", "private"]

  return Object.entries(props).reduce((acc, [key, value]) => {
    const isSensitive = sensitiveKeys.some((sensitiveKey) => key.toLowerCase().includes(sensitiveKey))

    if (isSensitive) {
      acc[key] = "[REDACTED]"
    } else {
      acc[key] = sanitizeValue(value)
    }

    return acc
  }, {} as Record<string, unknown>)
}

/**
 * Sanitize a single value for logging
 * @param value - Value to sanitize
 * @returns Sanitized value
 */
function sanitizeValue(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value
  }

  if (typeof value === "string") {
    // Truncate long strings
    return value.length > 100 ? `${value.substring(0, 100)}...` : value
  }

  if (typeof value === "object") {
    if (Array.isArray(value)) {
      // Truncate long arrays
      return value.length > 10 ? [...value.slice(0, 10), `...and ${value.length - 10} more`] : value
    }

    // For objects, sanitize recursively
    return sanitizeProps(value as Record<string, unknown>)
  }

  return value
}

// Export the main logger and specialized loggers
export { logger }

// Export default logger for backward compatibility
export default logger
