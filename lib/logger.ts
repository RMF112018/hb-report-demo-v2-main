/**
 * Structured logging service for the HB Report application
 * Provides consistent logging across development and production environments
 *
 * @module Logger
 * @version 1.0.0
 * @author HB Development Team
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
}

export interface LogContext {
  component?: string
  function?: string
  userId?: string
  projectId?: string
  sessionId?: string
  [key: string]: unknown
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: LogContext
  error?: Error
  data?: unknown
}

/**
 * Logger class providing structured logging capabilities
 */
class Logger {
  private isDevelopment: boolean
  private isProduction: boolean
  private currentLevel: LogLevel

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development"
    this.isProduction = process.env.NODE_ENV === "production"
    this.currentLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO
  }

  /**
   * Set the minimum log level for output
   * @param level - The minimum log level to display
   */
  setLevel(level: LogLevel): void {
    this.currentLevel = level
  }

  /**
   * Check if a log level should be output
   * @param level - The log level to check
   * @returns True if the level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    return level >= this.currentLevel
  }

  /**
   * Format log entry for output
   * @param level - Log level
   * @param message - Log message
   * @param context - Additional context
   * @param error - Error object if applicable
   * @param data - Additional data
   * @returns Formatted log entry
   */
  private formatLog(level: LogLevel, message: string, context?: LogContext, error?: Error, data?: unknown): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
      data,
    }
  }

  /**
   * Output log entry to appropriate destination
   * @param entry - Log entry to output
   */
  private output(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return

    const levelName = LogLevel[entry.level]
    const prefix = `[${levelName}] ${entry.timestamp}`
    const contextStr = entry.context ? ` ${JSON.stringify(entry.context)}` : ""
    const dataStr = entry.data ? ` ${JSON.stringify(entry.data)}` : ""

    if (this.isDevelopment) {
      // Development: Rich console output
      const consoleMethod = this.getConsoleMethod(entry.level)
      const consoleFn = console[consoleMethod] as (message: string) => void
      consoleFn(`${prefix} ${entry.message}${contextStr}${dataStr}`)

      if (entry.error) {
        console.error("Error details:", entry.error)
      }
    } else {
      // Production: Structured JSON logging
      console.log(JSON.stringify(entry))
    }
  }

  /**
   * Get appropriate console method for log level
   * @param level - Log level
   * @returns Console method name
   */
  private getConsoleMethod(level: LogLevel): keyof Console {
    switch (level) {
      case LogLevel.DEBUG:
        return "debug"
      case LogLevel.INFO:
        return "info"
      case LogLevel.WARN:
        return "warn"
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        return "error"
      default:
        return "log"
    }
  }

  /**
   * Log debug message
   * @param message - Debug message
   * @param context - Additional context
   * @param data - Additional data
   */
  debug(message: string, context?: LogContext, data?: unknown): void {
    this.output(this.formatLog(LogLevel.DEBUG, message, context, undefined, data))
  }

  /**
   * Log info message
   * @param message - Info message
   * @param context - Additional context
   * @param data - Additional data
   */
  info(message: string, context?: LogContext, data?: unknown): void {
    this.output(this.formatLog(LogLevel.INFO, message, context, undefined, data))
  }

  /**
   * Log warning message
   * @param message - Warning message
   * @param context - Additional context
   * @param data - Additional data
   */
  warn(message: string, context?: LogContext, data?: unknown): void {
    this.output(this.formatLog(LogLevel.WARN, message, context, undefined, data))
  }

  /**
   * Log error message
   * @param message - Error message
   * @param error - Error object
   * @param context - Additional context
   * @param data - Additional data
   */
  error(message: string, error?: Error, context?: LogContext, data?: unknown): void {
    this.output(this.formatLog(LogLevel.ERROR, message, context, error, data))
  }

  /**
   * Log critical error message
   * @param message - Critical error message
   * @param error - Error object
   * @param context - Additional context
   * @param data - Additional data
   */
  critical(message: string, error?: Error, context?: LogContext, data?: unknown): void {
    this.output(this.formatLog(LogLevel.CRITICAL, message, context, error, data))
  }

  /**
   * Create a logger instance with predefined context
   * @param context - Default context for all log entries
   * @returns Logger instance with context
   */
  withContext(context: LogContext): Logger {
    const logger = new Logger()
    logger.currentLevel = this.currentLevel
    logger.isDevelopment = this.isDevelopment
    logger.isProduction = this.isProduction

    // Override output method to include context
    const originalOutput = logger.output.bind(logger)
    logger.output = (entry: LogEntry) => {
      const entryWithContext = {
        ...entry,
        context: { ...context, ...entry.context },
      }
      originalOutput(entryWithContext)
    }

    return logger
  }
}

// Export singleton instance
export const logger = new Logger()

// Export convenience functions
export const debug = (message: string, context?: LogContext, data?: unknown) => logger.debug(message, context, data)
export const info = (message: string, context?: LogContext, data?: unknown) => logger.info(message, context, data)
export const warn = (message: string, context?: LogContext, data?: unknown) => logger.warn(message, context, data)
export const error = (message: string, error?: Error, context?: LogContext, data?: unknown) =>
  logger.error(message, error, context, data)
export const critical = (message: string, error?: Error, context?: LogContext, data?: unknown) =>
  logger.critical(message, error, context, data)
