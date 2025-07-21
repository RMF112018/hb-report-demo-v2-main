/**
 * Accessibility Hook
 *
 * Provides comprehensive accessibility utilities including:
 * - Focus management
 * - Screen reader announcements
 * - Keyboard navigation
 * - ARIA attribute management
 * - Error handling for accessibility
 */

import { useCallback, useRef, useEffect } from "react"
import { screenReader, focusManagement, ariaHelpers, accessibilityErrorHandling } from "@/lib/accessibility-utils"

interface UseAccessibilityOptions {
  /**
   * Whether to announce changes to screen readers
   */
  announceChanges?: boolean
  /**
   * Whether to manage focus automatically
   */
  manageFocus?: boolean
  /**
   * Whether to handle keyboard navigation
   */
  handleKeyboard?: boolean
  /**
   * Custom error handler
   */
  onError?: (error: Error) => void
}

interface UseAccessibilityReturn {
  /**
   * Announce text to screen readers
   */
  announce: (text: string, priority?: "polite" | "assertive") => void
  /**
   * Focus the first element in a container
   */
  focusFirstElement: (container: HTMLElement) => void
  /**
   * Trap focus within a container
   */
  trapFocus: (container: HTMLElement) => () => void
  /**
   * Generate unique IDs for ARIA relationships
   */
  generateId: (prefix: string) => string
  /**
   * Handle keyboard navigation
   */
  handleKeyboardNavigation: (
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    onIndexChange: (index: number) => void
  ) => void
  /**
   * Handle unhandled promise rejections
   */
  handleUnhandledRejection: (error: Error, context?: string) => void
  /**
   * Handle race conditions in async operations
   */
  handleRaceCondition: <T>(
    operation: (signal: AbortSignal) => Promise<T>,
    abortController: AbortController
  ) => Promise<T>
  /**
   * Validate ARIA attributes
   */
  validateAriaAttributes: (
    role: string,
    attributes: Record<string, string>
  ) => {
    isValid: boolean
    missing: string[]
    required: string[]
    provided: string[]
  }
}

/**
 * Accessibility hook for managing focus, announcements, and keyboard navigation
 *
 * @param options - Hook configuration options
 * @returns Object with accessibility utilities
 */
export function useAccessibility(options: UseAccessibilityOptions = {}): UseAccessibilityReturn {
  const { announceChanges = true, manageFocus = true, handleKeyboard = true, onError } = options

  const previousFocusRef = useRef<HTMLElement | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  /**
   * Enhanced announce function with error handling
   */
  const announce = useCallback(
    (text: string, priority: "polite" | "assertive" = "polite") => {
      try {
        if (announceChanges) {
          screenReader.announce(text, priority)
        }
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error))
        accessibilityErrorHandling.handleUnhandledRejection(errorObj, "Screen reader announcement failed")
        onError?.(errorObj)
      }
    },
    [announceChanges, onError]
  )

  /**
   * Enhanced focus management with error handling
   */
  const focusFirstElement = useCallback(
    (container: HTMLElement) => {
      try {
        if (manageFocus) {
          focusManagement.focusFirstElement(container)
        }
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error))
        accessibilityErrorHandling.handleUnhandledRejection(errorObj, "Focus management failed")
        onError?.(errorObj)
      }
    },
    [manageFocus, onError]
  )

  /**
   * Enhanced focus trapping with cleanup
   */
  const trapFocus = useCallback(
    (container: HTMLElement) => {
      try {
        // Store previous focus
        previousFocusRef.current = document.activeElement as HTMLElement

        // Clean up previous trap
        if (cleanupRef.current) {
          cleanupRef.current()
        }

        // Set up new trap
        const cleanup = focusManagement.trapFocus(container)
        cleanupRef.current = cleanup

        return () => {
          cleanup()
          cleanupRef.current = null
          // Return focus to previous element
          if (previousFocusRef.current) {
            focusManagement.returnFocus(previousFocusRef.current)
            previousFocusRef.current = null
          }
        }
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error))
        accessibilityErrorHandling.handleUnhandledRejection(errorObj, "Focus trapping failed")
        onError?.(errorObj)
        return () => {}
      }
    },
    [onError]
  )

  /**
   * Generate unique IDs for ARIA relationships
   */
  const generateId = useCallback((prefix: string) => {
    return ariaHelpers.generateId(prefix)
  }, [])

  /**
   * Enhanced keyboard navigation with error handling
   */
  const handleKeyboardNavigation = useCallback(
    (event: KeyboardEvent, items: HTMLElement[], currentIndex: number, onIndexChange: (index: number) => void) => {
      try {
        if (handleKeyboard) {
          // Import keyboardNavigation dynamically to avoid circular dependencies
          const { keyboardNavigation } = require("@/lib/accessibility-utils")
          keyboardNavigation.handleArrowKeys(event, items, currentIndex, onIndexChange)
        }
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error))
        accessibilityErrorHandling.handleUnhandledRejection(errorObj, "Keyboard navigation failed")
        onError?.(errorObj)
      }
    },
    [handleKeyboard, onError]
  )

  /**
   * Enhanced unhandled rejection handler
   */
  const handleUnhandledRejection = useCallback(
    (error: Error, context?: string) => {
      try {
        accessibilityErrorHandling.handleUnhandledRejection(error, context)
        onError?.(error)
      } catch (handlerError) {
        console.error("Error in accessibility error handler:", handlerError)
        onError?.(error)
      }
    },
    [onError]
  )

  /**
   * Enhanced race condition handler
   */
  const handleRaceCondition = useCallback(
    async <T>(operation: (signal: AbortSignal) => Promise<T>, abortController: AbortController): Promise<T> => {
      try {
        return await accessibilityErrorHandling.handleRaceCondition(operation, abortController)
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error))
        onError?.(errorObj)
        throw error
      }
    },
    [onError]
  )

  /**
   * Validate ARIA attributes
   */
  const validateAriaAttributes = useCallback((role: string, attributes: Record<string, string>) => {
    return ariaHelpers.validateAriaAttributes(role, attributes)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
      if (previousFocusRef.current) {
        focusManagement.returnFocus(previousFocusRef.current)
        previousFocusRef.current = null
      }
    }
  }, [])

  return {
    announce,
    focusFirstElement,
    trapFocus,
    generateId,
    handleKeyboardNavigation,
    handleUnhandledRejection,
    handleRaceCondition,
    validateAriaAttributes,
  }
}

export default useAccessibility
