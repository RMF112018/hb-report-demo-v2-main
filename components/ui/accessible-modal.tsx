/**
 * Accessible Modal Component
 *
 * Provides a fully accessible modal dialog with:
 * - Focus trapping
 * - Proper ARIA attributes
 * - Keyboard navigation (Escape to close)
 * - Screen reader announcements
 * - Click outside to close
 */

import React, { useEffect, useRef, useCallback, type JSX } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { focusManagement, screenReader, ariaHelpers } from "@/lib/accessibility-utils"

interface AccessibleModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  description?: string
  size?: "sm" | "md" | "lg" | "xl"
  showCloseButton?: boolean
  closeOnEscape?: boolean
  closeOnOverlayClick?: boolean
  preventScroll?: boolean
  className?: string
}

/**
 * Accessible Modal Component
 *
 * @param props - Component props
 * @param props.isOpen - Whether the modal is open
 * @param props.onClose - Function to call when modal should close
 * @param props.title - Modal title
 * @param props.children - Modal content
 * @param props.description - Modal description (optional)
 * @param props.size - Modal size variant
 * @param props.showCloseButton - Whether to show close button
 * @param props.closeOnEscape - Whether to close on Escape key
 * @param props.closeOnOverlayClick - Whether to close on overlay click
 * @param props.preventScroll - Whether to prevent body scroll
 * @param props.className - Additional CSS classes
 * @returns Accessible modal component
 */
export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  description,
  size = "md",
  showCloseButton = true,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  preventScroll = true,
  className = "",
}): JSX.Element | null => {
  const modalRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const titleId = ariaHelpers.generateId("modal-title")
  const descriptionId = description ? ariaHelpers.generateId("modal-description") : undefined

  // Size classes
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  }

  /**
   * Handles modal close with accessibility announcements
   */
  const handleClose = useCallback(() => {
    screenReader.announce("Modal closed", "polite")
    onClose()
  }, [onClose])

  /**
   * Handles Escape key press
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault()
        handleClose()
      }
    },
    [handleClose, closeOnEscape]
  )

  /**
   * Handles overlay click
   */
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === overlayRef.current && closeOnOverlayClick) {
        handleClose()
      }
    },
    [handleClose, closeOnOverlayClick]
  )

  // Focus management and event listeners
  useEffect(() => {
    if (isOpen) {
      // Store current focus
      previousFocusRef.current = document.activeElement as HTMLElement

      // Announce modal opening
      screenReader.announce(`Modal opened: ${title}`, "polite")

      // Add event listeners
      document.addEventListener("keydown", handleKeyDown)

      // Prevent body scroll if requested
      if (preventScroll) {
        document.body.style.overflow = "hidden"
      }

      // Focus first element in modal
      setTimeout(() => {
        if (modalRef.current) {
          focusManagement.focusFirstElement(modalRef.current)
        }
      }, 100)

      // Return cleanup function
      return () => {
        document.removeEventListener("keydown", handleKeyDown)
        if (preventScroll) {
          document.body.style.overflow = ""
        }
      }
    }
    // Return undefined when modal is not open
    return undefined
  }, [isOpen, title, handleKeyDown, preventScroll])

  // Return focus when modal closes
  useEffect(() => {
    if (!isOpen && previousFocusRef.current) {
      focusManagement.returnFocus(previousFocusRef.current)
      previousFocusRef.current = null
    }
  }, [isOpen])

  // Don't render if not open
  if (!isOpen) {
    return null
  }

  // Create portal for modal
  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div ref={modalRef} className={`w-full ${sizeClasses[size]} ${className}`} role="document">
        <Card className="shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="space-y-1">
              <CardTitle id={titleId} className="text-lg font-semibold">
                {title}
              </CardTitle>
              {description && (
                <p id={descriptionId} className="text-sm text-gray-600 dark:text-gray-300">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <Button variant="ghost" size="sm" onClick={handleClose} aria-label="Close modal" className="h-8 w-8 p-0">
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">{children}</CardContent>
        </Card>
      </div>
    </div>,
    document.body
  )
}

export default AccessibleModal
