/**
 * Accessibility Utilities for HB Report Demo
 *
 * Provides comprehensive accessibility helpers including:
 * - Focus management and trapping
 * - ARIA attribute helpers
 * - Color contrast validation
 * - Keyboard navigation utilities
 * - Screen reader announcements
 */

/**
 * Focus management utilities
 */
export const focusManagement = {
  /**
   * Traps focus within a container element
   * @param container - The container element to trap focus within
   * @param activeElement - The currently active element
   */
  trapFocus: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (!firstElement || !lastElement) {
      return () => {} // Return empty cleanup function if no focusable elements
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    container.addEventListener("keydown", handleKeyDown)

    // Return cleanup function
    return () => {
      container.removeEventListener("keydown", handleKeyDown)
    }
  },

  /**
   * Moves focus to the first focusable element in a container
   * @param container - The container element
   */
  focusFirstElement: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    if (focusableElements.length > 0) {
      const firstElement = focusableElements[0]
      if (firstElement) {
        firstElement.focus()
      }
    }
  },

  /**
   * Returns focus to the previously focused element
   * @param previousElement - The element to return focus to
   */
  returnFocus: (previousElement: HTMLElement | null) => {
    if (previousElement) {
      previousElement.focus()
    }
  },
}

/**
 * ARIA attribute helpers
 */
export const ariaHelpers = {
  /**
   * Generates a unique ID for ARIA relationships
   * @param prefix - The prefix for the ID
   * @returns A unique ID string
   */
  generateId: (prefix: string): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  },

  /**
   * Creates ARIA live region for announcements
   * @param message - The message to announce
   * @param priority - The priority level ('polite' or 'assertive')
   */
  announce: (message: string, priority: "polite" | "assertive" = "polite") => {
    const announcement = document.createElement("div")
    announcement.setAttribute("aria-live", priority)
    announcement.setAttribute("aria-atomic", "true")
    announcement.className = "sr-only"
    announcement.textContent = message

    document.body.appendChild(announcement)

    // Remove after announcement
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement)
      }
    }, 1000)
  },

  /**
   * Validates ARIA attributes for a given role
   * @param role - The ARIA role
   * @param attributes - The attributes to validate
   * @returns Object with validation results
   */
  validateAriaAttributes: (role: string, attributes: Record<string, string>) => {
    const requiredAttributes: Record<string, string[]> = {
      button: ["aria-label", "aria-pressed"],
      checkbox: ["aria-checked"],
      combobox: ["aria-expanded", "aria-haspopup"],
      dialog: ["aria-labelledby", "aria-describedby"],
      listbox: ["aria-multiselectable"],
      menuitem: ["aria-haspopup"],
      progressbar: ["aria-valuenow", "aria-valuemin", "aria-valuemax"],
      slider: ["aria-valuenow", "aria-valuemin", "aria-valuemax"],
      tab: ["aria-selected"],
      tabpanel: ["aria-labelledby"],
      textbox: ["aria-multiline", "aria-required"],
      treeitem: ["aria-expanded", "aria-level", "aria-setsize", "aria-posinset"],
    }

    const required = requiredAttributes[role] || []
    const missing = required.filter((attr) => !attributes[attr])

    return {
      isValid: missing.length === 0,
      missing,
      required,
      provided: Object.keys(attributes),
    }
  },
}

/**
 * Color contrast utilities
 */
export const colorContrast = {
  /**
   * Calculates the relative luminance of a color
   * @param color - The color in hex format
   * @returns The relative luminance value
   */
  getRelativeLuminance: (color: string): number => {
    const hex = color.replace("#", "")
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255

    const rs = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
    const gs = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)
    const bs = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  },

  /**
   * Calculates the contrast ratio between two colors
   * @param color1 - First color in hex format
   * @param color2 - Second color in hex format
   * @returns The contrast ratio
   */
  getContrastRatio: (color1: string, color2: string): number => {
    const l1 = colorContrast.getRelativeLuminance(color1)
    const l2 = colorContrast.getRelativeLuminance(color2)

    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)

    return (lighter + 0.05) / (darker + 0.05)
  },

  /**
   * Checks if a color combination meets WCAG 2.2 AA standards
   * @param foreground - Foreground color in hex format
   * @param background - Background color in hex format
   * @param level - WCAG level ('AA' or 'AAA')
   * @returns Object with validation results
   */
  meetsWCAGStandards: (foreground: string, background: string, level: "AA" | "AAA" = "AA") => {
    const ratio = colorContrast.getContrastRatio(foreground, background)
    const requiredRatio = level === "AA" ? 4.5 : 7

    return {
      ratio,
      requiredRatio,
      passes: ratio >= requiredRatio,
      level,
    }
  },
}

/**
 * Input sanitization utilities
 */
export const sanitization = {
  /**
   * Sanitizes user input for form fields
   * @param input - The input string to sanitize
   * @returns Sanitized input string
   */
  sanitizeInput: (input: string): string => {
    // Basic HTML entity encoding
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;")
  },

  /**
   * Validates and sanitizes email addresses
   * @param email - The email address to validate
   * @returns Object with validation results
   */
  validateEmail: (email: string) => {
    const sanitized = sanitization.sanitizeInput(email)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = emailRegex.test(sanitized)

    return {
      isValid,
      sanitized,
      original: email,
    }
  },
}

/**
 * Keyboard navigation utilities
 */
export const keyboardNavigation = {
  /**
   * Handles keyboard navigation for arrow keys
   * @param event - The keyboard event
   * @param items - Array of focusable items
   * @param currentIndex - Current focused index
   * @param onIndexChange - Callback when index changes
   */
  handleArrowKeys: (
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    onIndexChange: (index: number) => void
  ) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault()
        const nextIndex = (currentIndex + 1) % items.length
        onIndexChange(nextIndex)
        items[nextIndex]?.focus()
        break
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault()
        const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1
        onIndexChange(prevIndex)
        items[prevIndex]?.focus()
        break
      case "Home":
        event.preventDefault()
        onIndexChange(0)
        items[0]?.focus()
        break
      case "End":
        event.preventDefault()
        const lastIndex = items.length - 1
        onIndexChange(lastIndex)
        items[lastIndex]?.focus()
        break
    }
  },

  /**
   * Creates a skip link for keyboard navigation
   * @param targetId - The ID of the target element
   * @param text - The link text
   * @returns HTML string for skip link
   */
  createSkipLink: (targetId: string, text: string): string => {
    return `<a href="#${targetId}" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded">${text}</a>`
  },
}

/**
 * Screen reader utilities
 */
export const screenReader = {
  /**
   * Announces text to screen readers
   * @param text - The text to announce
   * @param priority - The priority level
   */
  announce: (text: string, priority: "polite" | "assertive" = "polite") => {
    ariaHelpers.announce(text, priority)
  },

  /**
   * Creates a visually hidden element for screen readers
   * @param text - The text to hide visually
   * @returns HTML string
   */
  visuallyHidden: (text: string): string => {
    return `<span class="sr-only">${text}</span>`
  },

  /**
   * Provides context for screen readers
   * @param context - The context information
   * @param element - The element to provide context for
   */
  provideContext: (context: string, element: HTMLElement) => {
    element.setAttribute("aria-describedby", context)
  },
}

/**
 * Error handling utilities for accessibility
 */
export const accessibilityErrorHandling = {
  /**
   * Handles unhandled promise rejections
   * @param error - The error to handle
   * @param context - Additional context information
   */
  handleUnhandledRejection: (error: Error, context?: string) => {
    console.error("Unhandled promise rejection:", error)

    // Announce error to screen readers
    const message = `Error: ${error.message}. ${context || ""}`
    screenReader.announce(message, "assertive")

    // Log for debugging
    console.error("Accessibility error context:", context)
  },

  /**
   * Handles race conditions in async operations
   * @param operation - The async operation
   * @param abortController - AbortController for cancellation
   * @returns Promise with proper error handling
   */
  handleRaceCondition: async <T>(
    operation: (signal: AbortSignal) => Promise<T>,
    abortController: AbortController
  ): Promise<T> => {
    try {
      return await operation(abortController.signal)
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        // Operation was cancelled, don't announce to screen readers
        throw error
      }

      accessibilityErrorHandling.handleUnhandledRejection(
        error instanceof Error ? error : new Error(String(error)),
        "Async operation failed"
      )
      throw error
    }
  },
}

export default {
  focusManagement,
  ariaHelpers,
  colorContrast,
  sanitization,
  keyboardNavigation,
  screenReader,
  accessibilityErrorHandling,
}
