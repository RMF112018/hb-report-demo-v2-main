"use client"

/**
 * Enhanced Error Boundary Component
 * Provides comprehensive error handling and recovery for React components
 *
 * @module ErrorBoundary
 * @version 2.0.0
 * @author HB Development Team
 */

import React from "react"
import { logger } from "@/lib/logger"

/**
 * Error boundary state interface
 */
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  errorId: string | null
}

/**
 * Error boundary props interface
 */
interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?:
    | React.ComponentType<{
        error: Error | null
        errorInfo: React.ErrorInfo | null
        errorId: string | null
        retry: () => void
      }>
    | undefined
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  onRetry?: () => void
  componentName?: string
  context?: Record<string, unknown> | undefined
}

/**
 * Default error fallback component with responsive design
 * @param props - Error fallback props
 * @returns Error fallback JSX
 */
const DefaultErrorFallback: React.FC<{
  error: Error | null
  errorInfo: React.ErrorInfo | null
  errorId: string | null
  retry: () => void
}> = ({ error, errorInfo, errorId, retry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-base sm:text-lg font-semibold text-red-800 dark:text-red-200 text-center sm:text-left">
          Something went wrong
        </h2>
      </div>

      <div className="text-center space-y-2">
        <p className="text-xs sm:text-sm text-red-600 dark:text-red-300 px-2">
          An unexpected error occurred. Our team has been notified.
        </p>
        {errorId && (
          <p className="text-xs text-red-500 dark:text-red-400 font-mono break-all px-2">Error ID: {errorId}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
        <button
          onClick={retry}
          className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors text-sm sm:text-base"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm sm:text-base"
        >
          Reload Page
        </button>
      </div>

      {process.env.NODE_ENV === "development" && error && (
        <details className="w-full max-w-full">
          <summary className="cursor-pointer text-xs sm:text-sm text-red-600 dark:text-red-300 hover:text-red-700 dark:hover:text-red-200 px-2 py-1">
            Error Details (Development)
          </summary>
          <div className="mt-2 p-3 sm:p-4 bg-red-100 dark:bg-red-900/40 rounded-md text-xs font-mono text-red-800 dark:text-red-200 overflow-auto max-h-32 sm:max-h-48 md:max-h-64">
            <div className="mb-2 break-words">
              <strong>Error:</strong> {error.message}
            </div>
            <div className="mb-2">
              <strong>Stack:</strong>
              <pre className="whitespace-pre-wrap break-words text-xs">{error.stack}</pre>
            </div>
            {errorInfo && (
              <div>
                <strong>Component Stack:</strong>
                <pre className="whitespace-pre-wrap break-words text-xs">{errorInfo.componentStack}</pre>
              </div>
            )}
          </div>
        </details>
      )}
    </div>
  )
}

/**
 * Enhanced Error Boundary class component
 * Provides comprehensive error handling with logging and recovery options
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    }
  }

  /**
   * Generate a unique error ID for tracking
   * @returns Unique error identifier
   */
  private generateErrorId(): string {
    return `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Handle component errors and log them appropriately
   * @param error - The error that occurred
   * @param errorInfo - Additional error information
   */
  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const errorId = this.generateErrorId()

    // Log the error with structured logging
    logger.error("React component error caught by ErrorBoundary", error, {
      component: this.props.componentName ?? "Unknown",
      function: "componentDidCatch",
      errorId,
      errorMessage: error.message,
      errorStack: error.stack,
      componentStack: errorInfo.componentStack,
      ...this.props.context,
    })

    // Update state with error information
    this.setState({
      hasError: true,
      error,
      errorInfo,
      errorId,
    })

    // Call optional error handler
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo)
      } catch (handlerError) {
        logger.error("Error in ErrorBoundary onError handler", handlerError as Error, {
          component: "ErrorBoundary",
          function: "componentDidCatch",
        })
      }
    }
  }

  /**
   * Reset the error state and retry rendering
   */
  private handleRetry = (): void => {
    logger.info("Retrying component after error", {
      component: this.props.componentName ?? "Unknown",
      function: "handleRetry",
    })

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    })

    // Call optional retry handler
    if (this.props.onRetry) {
      try {
        this.props.onRetry()
      } catch (retryError) {
        logger.error("Error in ErrorBoundary onRetry handler", retryError as Error, {
          component: "ErrorBoundary",
          function: "handleRetry",
        })
      }
    }
  }

  /**
   * Render error fallback or children
   * @returns JSX element
   */
  override render(): React.ReactNode {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback ?? DefaultErrorFallback

      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          retry={this.handleRetry}
        />
      )
    }

    return this.props.children
  }
}

/**
 * Client-side wrapper for ErrorBoundary to fix server component issues
 */
export function ClientErrorBoundary(props: ErrorBoundaryProps) {
  return <ErrorBoundary {...props} />
}

/**
 * Hook for creating error boundaries in functional components
 * @param onError - Error handler function
 * @param onRetry - Retry handler function
 * @returns Error boundary props
 */
export const useErrorBoundary = (
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void,
  onRetry?: () => void
) => {
  return {
    onError,
    onRetry,
  }
}

/**
 * Higher-order component that wraps a component with error boundary
 * @param Component - Component to wrap
 * @param options - Error boundary options
 * @returns Wrapped component with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    fallback?: React.ComponentType<{
      error: Error | null
      errorInfo: React.ErrorInfo | null
      errorId: string | null
      retry: () => void
    }>
    componentName?: string
    context?: Record<string, unknown>
  } = {}
) {
  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundary
      fallback={options.fallback}
      componentName={options.componentName || Component.displayName || Component.name}
      context={options.context}
    >
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}
