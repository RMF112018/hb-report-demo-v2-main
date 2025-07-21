/**
 * Sentry Configuration for HB Report Demo
 *
 * Provides error tracking, performance monitoring, and user analytics
 * for production deployment and monitoring.
 */

import * as Sentry from "@sentry/nextjs"

/**
 * Initialize Sentry for error tracking and performance monitoring
 *
 * @param dsn - Sentry DSN for project identification
 * @param environment - Current environment (development, staging, production)
 * @param tracesSampleRate - Percentage of transactions to capture (0.0 to 1.0)
 * @param replaysSessionSampleRate - Percentage of sessions to record for replay
 * @param replaysOnErrorSampleRate - Percentage of error sessions to record
 */
export function initSentry(): void {
  const dsn = process.env["NEXT_PUBLIC_SENTRY_DSN"]
  const environment = process.env.NODE_ENV || "development"

  if (!dsn) {
    console.warn("Sentry DSN not configured. Error tracking disabled.")
    return
  }

  Sentry.init({
    dsn,
    environment,

    // Performance monitoring
    tracesSampleRate: environment === "production" ? 0.1 : 1.0,

    // Session replay for debugging
    replaysSessionSampleRate: environment === "production" ? 0.01 : 1.0,
    replaysOnErrorSampleRate: environment === "production" ? 0.1 : 1.0,

    // Performance monitoring
    beforeSend(event: any, hint: any) {
      // Filter out certain errors in development
      if (environment === "development") {
        const error = hint.originalException as Error
        if (error?.message?.includes("ResizeObserver")) {
          return null
        }
      }

      return event
    },

    // User context
    beforeSendTransaction(event: any) {
      // Add custom context for transactions
      return event
    },
  })
}

/**
 * Set user context for Sentry
 *
 * @param user - User information for context
 */
export function setUserContext(user: { id: string; email: string; role: string; name?: string }): void {
  const userContext: any = {
    id: user.id,
    email: user.email,
    role: user.role,
  }

  if (user.name) {
    userContext.username = user.name
  }

  Sentry.setUser(userContext)
}

/**
 * Add breadcrumb for user actions
 *
 * @param message - Breadcrumb message
 * @param category - Breadcrumb category
 * @param data - Additional data
 */
export function addBreadcrumb(message: string, category: string = "user", data?: Record<string, any>): void {
  Sentry.addBreadcrumb({
    message,
    category,
    data: data || {},
    level: "info",
  })
}

/**
 * Capture exception with context
 *
 * @param error - Error to capture
 * @param context - Additional context
 */
export function captureException(error: Error, context?: Record<string, any>): void {
  Sentry.captureException(error, {
    contexts: {
      app: {
        version: process.env["NEXT_PUBLIC_APP_VERSION"] || "3.0.0",
        environment: process.env.NODE_ENV,
      },
      ...context,
    },
  })
}

/**
 * Start performance transaction
 *
 * @param name - Transaction name
 * @param operation - Operation type
 * @returns Transaction object
 */
export function startTransaction(name: string, operation: string = "ui.action"): any {
  // Note: startTransaction is not available in @sentry/nextjs
  // This is a placeholder for future implementation
  console.warn(`startTransaction not available in @sentry/nextjs - ${name} (${operation})`)
  return null
}

/**
 * Set tag for filtering and grouping
 *
 * @param key - Tag key
 * @param value - Tag value
 */
export function setTag(key: string, value: string) {
  Sentry.setTag(key, value)
}

/**
 * Set context for additional debugging information
 *
 * @param name - Context name
 * @param data - Context data
 */
export function setContext(name: string, data: Record<string, any>) {
  Sentry.setContext(name, data)
}

// Initialize Sentry on module load
initSentry()

export default Sentry
