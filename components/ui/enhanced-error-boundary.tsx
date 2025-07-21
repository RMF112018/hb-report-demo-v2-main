/**
 * Enhanced Error Boundary Component with Accessibility Features
 *
 * Provides comprehensive error handling with:
 * - Screen reader announcements
 * - Proper ARIA attributes
 * - Focus management
 * - Keyboard navigation
 * - Error recovery options
 */

import React, { Component } from "react"
import type { ErrorInfo, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react"
import { screenReader } from "@/lib/accessibility-utils"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showRecoveryOptions?: boolean
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Enhanced Error Boundary with accessibility features
 *
 * @param props - Component props
 * @param props.children - Child components to render
 * @param props.fallback - Custom fallback component
 * @param props.onError - Error callback function
 * @param props.showRecoveryOptions - Whether to show recovery options
 * @returns Error boundary component
 */
export class EnhancedErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging
    console.error("Error caught by boundary:", error, errorInfo)

    // Update state
    this.setState({
      hasError: true,
      error,
      errorInfo,
    })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Announce error to screen readers
    const errorMessage = `An error occurred: ${error.message}. Please try refreshing the page or contact support if the problem persists.`
    screenReader.announce(errorMessage, "assertive")
  }

  override componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset error state if children change
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      })
    }
  }

  /**
   * Handles error recovery by refreshing the page
   */
  handleRefresh = () => {
    // Announce action to screen readers
    screenReader.announce("Refreshing page to recover from error", "polite")

    // Small delay to allow announcement
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  /**
   * Handles navigation to home page
   */
  handleGoHome = () => {
    // Announce action to screen readers
    screenReader.announce("Navigating to home page", "polite")

    // Small delay to allow announcement
    setTimeout(() => {
      window.location.href = "/"
    }, 500)
  }

  /**
   * Handles going back to previous page
   */
  handleGoBack = () => {
    // Announce action to screen readers
    screenReader.announce("Going back to previous page", "polite")

    // Small delay to allow announcement
    setTimeout(() => {
      window.history.back()
    }, 500)
  }

  /**
   * Handles error reset
   */
  handleReset = () => {
    // Announce action to screen readers
    screenReader.announce("Resetting error state", "polite")

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  override render() {
    if (this.state.hasError) {
      // Custom fallback component
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI with accessibility features
      return (
        <div
          role="alert"
          aria-live="assertive"
          aria-labelledby="error-title"
          aria-describedby="error-description"
          className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900"
        >
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />
                <CardTitle id="error-title" className="text-red-600 dark:text-red-400">
                  Something went wrong
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div id="error-description" className="text-sm text-gray-600 dark:text-gray-300">
                <p>We encountered an unexpected error. This has been logged and our team will investigate.</p>
                {this.state.error && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-gray-500 dark:text-gray-400">
                      Technical details
                    </summary>
                    <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                      {this.state.error.message}
                    </pre>
                  </details>
                )}
              </div>

              {this.props.showRecoveryOptions !== false && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Recovery options:</p>
                  <div className="flex flex-col space-y-2">
                    <Button onClick={this.handleRefresh} className="w-full" aria-describedby="refresh-description">
                      <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                      Refresh Page
                    </Button>
                    <span id="refresh-description" className="sr-only">
                      Refreshes the current page to recover from the error
                    </span>

                    <Button
                      onClick={this.handleGoHome}
                      variant="outline"
                      className="w-full"
                      aria-describedby="home-description"
                    >
                      <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                      Go to Home
                    </Button>
                    <span id="home-description" className="sr-only">
                      Navigates to the home page
                    </span>

                    <Button
                      onClick={this.handleGoBack}
                      variant="outline"
                      className="w-full"
                      aria-describedby="back-description"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                      Go Back
                    </Button>
                    <span id="back-description" className="sr-only">
                      Goes back to the previous page
                    </span>

                    <Button
                      onClick={this.handleReset}
                      variant="ghost"
                      className="w-full"
                      aria-describedby="reset-description"
                    >
                      Try Again
                    </Button>
                    <span id="reset-description" className="sr-only">
                      Attempts to reset the error state and continue
                    </span>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p>If this problem persists, please contact support with the error details.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default EnhancedErrorBoundary
