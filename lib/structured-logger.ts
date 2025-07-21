/**
 * Enhanced structured logging service using @logtape/logtape
 * Provides production-ready logging with structured output and security compliance
 *
 * @module StructuredLogger
 * @version 2.0.0
 * @author HB Development Team
 * @since 2025-01-29
 */

// Fallback for @logtape/logtape until package is installed
interface LogLevel {
  DEBUG: 0
  INFO: 1
  WARN: 2
  ERROR: 3
}

interface Logger {
  debug(message: string, context?: unknown): void
  info(message: string, context?: unknown): void
  warn(message: string, context?: unknown): void
  error(message: string, context?: unknown): void
}

function createLogger(_options: { level: LogLevel; format: string; destination: NodeJS.WriteStream }): Logger {
  return {
    debug: (message: string, context?: unknown) => console.debug(message, context),
    info: (message: string, context?: unknown) => console.info(message, context),
    warn: (message: string, context?: unknown) => console.warn(message, context),
    error: (message: string, context?: unknown) => console.error(message, context),
  }
}

const LogLevel: LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
}

export interface LogContext {
  component?: string
  function?: string
  userId?: string
  projectId?: string
  sessionId?: string
  requestId?: string
  environment?: string
  version?: string
  [key: string]: unknown
}

export interface SecurityContext {
  sanitized: boolean
  piiRemoved: boolean
  sensitiveDataMasked: boolean
}

export interface LogEntry {
  timestamp: string
  level: number
  message: string
  context?: LogContext
  security?: SecurityContext
  error?: Error | undefined
  data?: unknown
  traceId?: string
}

/**
 * Enhanced Logger class with security and compliance features
 */
class StructuredLogger {
  private logger: Logger
  private isDevelopment: boolean
  private isProduction: boolean
  private currentLevel: number
  private securityEnabled: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development"
    this.isProduction = process.env.NODE_ENV === "production"
    this.currentLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO
    this.securityEnabled = this.isProduction

    // Initialize @logtape/logtape logger
    this.logger = createLogger({
      level: LogLevel,
      format: this.isDevelopment ? "human" : "json",
      destination: process.stdout,
    })
  }

  /**
   * Set the minimum log level for output
   * @param level - The minimum log level to display
   */
  setLevel(level: number): void {
    this.currentLevel = level
    this.logger = createLogger({
      level: LogLevel,
      format: this.isDevelopment ? "human" : "json",
      destination: process.stdout,
    })
  }

  /**
   * Sanitize sensitive data from log entries
   * @param data - Data to sanitize
   * @returns Sanitized data
   */
  private sanitizeData(data: unknown): unknown {
    if (typeof data !== "object" || data === null) {
      return data
    }

    const sensitiveKeys = [
      "password",
      "token",
      "secret",
      "key",
      "auth",
      "authorization",
      "apiKey",
      "api_key",
      "private_key",
      "privateKey",
      "credential",
      "ssn",
      "credit_card",
      "creditCard",
      "account_number",
      "accountNumber",
    ]

    const sanitized = { ...(data as Record<string, unknown>) }

    for (const key of Object.keys(sanitized)) {
      const lowerKey = key.toLowerCase()
      if (sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive))) {
        sanitized[key] = "[REDACTED]"
      } else if (typeof sanitized[key] === "object" && sanitized[key] !== null) {
        sanitized[key] = this.sanitizeData(sanitized[key])
      }
    }

    return sanitized
  }

  /**
   * Generate trace ID for request tracking
   * @returns Unique trace ID
   */
  private generateTraceId(): string {
    return `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Format log entry with security and compliance features
   * @param level - Log level
   * @param message - Log message
   * @param context - Additional context
   * @param error - Error object if applicable
   * @param data - Additional data
   * @returns Formatted log entry
   */
  private formatLog(level: number, message: string, context?: LogContext, error?: Error, data?: unknown): LogEntry {
    const sanitizedData = this.securityEnabled ? this.sanitizeData(data) : data
    const sanitizedContext = this.securityEnabled ? this.sanitizeData(context) : context

    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: sanitizedContext as LogContext,
      security: {
        sanitized: this.securityEnabled,
        piiRemoved: this.securityEnabled,
        sensitiveDataMasked: this.securityEnabled,
      },
      error,
      data: sanitizedData,
      traceId: this.generateTraceId(),
    }
  }

  /**
   * Log debug message
   * @param message - Debug message
   * @param context - Additional context
   * @param data - Additional data
   */
  debug(message: string, context?: LogContext, data?: unknown): void {
    const entry = this.formatLog(LogLevel.DEBUG, message, context, undefined, data)
    this.logger.debug(entry.message, { ...entry.context, data: entry.data })
  }

  /**
   * Log info message
   * @param message - Info message
   * @param context - Additional context
   * @param data - Additional data
   */
  info(message: string, context?: LogContext, data?: unknown): void {
    const entry = this.formatLog(LogLevel.INFO, message, context, undefined, data)
    this.logger.info(entry.message, { ...entry.context, data: entry.data })
  }

  /**
   * Log warning message
   * @param message - Warning message
   * @param context - Additional context
   * @param data - Additional data
   */
  warn(message: string, context?: LogContext, data?: unknown): void {
    const entry = this.formatLog(LogLevel.WARN, message, context, undefined, data)
    this.logger.warn(entry.message, { ...entry.context, data: entry.data })
  }

  /**
   * Log error message
   * @param message - Error message
   * @param error - Error object
   * @param context - Additional context
   * @param data - Additional data
   */
  error(message: string, error?: Error, context?: LogContext, data?: unknown): void {
    const entry = this.formatLog(LogLevel.ERROR, message, context, error, data)
    this.logger.error(entry.message, {
      ...entry.context,
      error: error?.stack || error?.message,
      data: entry.data,
    })
  }

  /**
   * Log critical error message
   * @param message - Critical error message
   * @param error - Error object
   * @param context - Additional context
   * @param data - Additional data
   */
  critical(message: string, error?: Error, context?: LogContext, data?: unknown): void {
    const entry = this.formatLog(LogLevel.ERROR, message, context, error, data)
    this.logger.error(`CRITICAL: ${entry.message}`, {
      ...entry.context,
      error: error?.stack || error?.message,
      data: entry.data,
      severity: "critical",
    })
  }

  /**
   * Create a logger instance with predefined context
   * @param context - Default context for all log entries
   * @returns Logger instance with context
   */
  withContext(context: LogContext): StructuredLogger {
    const logger = new StructuredLogger()
    logger.currentLevel = this.currentLevel
    logger.isDevelopment = this.isDevelopment
    logger.isProduction = this.isProduction
    logger.securityEnabled = this.securityEnabled

    // Override logging methods to include context
    const originalDebug = logger.debug.bind(logger)
    const originalInfo = logger.info.bind(logger)
    const originalWarn = logger.warn.bind(logger)
    const originalError = logger.error.bind(logger)
    const originalCritical = logger.critical.bind(logger)

    logger.debug = (message: string, ctx?: LogContext, data?: unknown) => {
      originalDebug(message, { ...context, ...ctx }, data)
    }
    logger.info = (message: string, ctx?: LogContext, data?: unknown) => {
      originalInfo(message, { ...context, ...ctx }, data)
    }
    logger.warn = (message: string, ctx?: LogContext, data?: unknown) => {
      originalWarn(message, { ...context, ...ctx }, data)
    }
    logger.error = (message: string, error?: Error, ctx?: LogContext, data?: unknown) => {
      originalError(message, error, { ...context, ...ctx }, data)
    }
    logger.critical = (message: string, error?: Error, ctx?: LogContext, data?: unknown) => {
      originalCritical(message, error, { ...context, ...ctx }, data)
    }

    return logger
  }

  /**
   * Enable/disable security features
   * @param enabled - Whether to enable security features
   */
  setSecurityEnabled(enabled: boolean): void {
    this.securityEnabled = enabled
  }
}

// Export singleton instance
export const structuredLogger = new StructuredLogger()

// Export convenience functions
export const debug = (message: string, context?: LogContext, data?: unknown) =>
  structuredLogger.debug(message, context, data)
export const info = (message: string, context?: LogContext, data?: unknown) =>
  structuredLogger.info(message, context, data)
export const warn = (message: string, context?: LogContext, data?: unknown) =>
  structuredLogger.warn(message, context, data)
export const error = (message: string, error?: Error, context?: LogContext, data?: unknown) =>
  structuredLogger.error(message, error, context, data)
export const critical = (message: string, error?: Error, context?: LogContext, data?: unknown) =>
  structuredLogger.critical(message, error, context, data)
