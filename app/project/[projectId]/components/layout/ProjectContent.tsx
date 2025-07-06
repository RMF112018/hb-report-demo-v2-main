/**
 * @fileoverview Project Content component
 * @module ProjectContent
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Main content area component for the project control center with
 * responsive padding, loading states, error handling, and scrolling.
 *
 * @example
 * ```tsx
 * <ProjectContent
 *   config={contentConfig}
 *   navigation={navigation}
 *   userRole="project-manager"
 *   projectData={projectData}
 *   loading={false}
 *   error={null}
 * >
 *   <YourPageContent />
 * </ProjectContent>
 * ```
 */

"use client"

import React, { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ProjectContentProps } from "../../types/layout"
import { useLayout } from "../../hooks/useLayout"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, RefreshCw, Loader2, ArrowUp, Info } from "lucide-react"

/**
 * Project Content component
 */
export function ProjectContent({
  config,
  navigation,
  userRole,
  projectData,
  loading = false,
  error = null,
  className,
  children,
}: ProjectContentProps) {
  const { state: layoutState, responsive, utils } = useLayout()
  const contentRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Content configuration
  const contentPadding = config?.padding ?? layoutState.config.content.padding
  const maxWidth = config?.maxWidth ?? layoutState.config.content.maxWidth
  const scrollable = config?.scrollable ?? layoutState.config.content.scrollable
  const showLoading = config?.showLoading ?? layoutState.config.content.showLoading
  const backgroundColor = config?.backgroundColor ?? layoutState.config.content.backgroundColor

  // Get content dimensions
  const dimensions = utils.getContentDimensions()

  // Handle scroll to top
  const scrollToTop = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Content classes
  const contentClasses = cn(
    "hb-project-content",
    "flex-1",
    "transition-all",
    "duration-300",
    "ease-in-out",
    !scrollable && "overflow-hidden",
    scrollable && !loading && "overflow-auto",
    className
  )

  const innerContentClasses = cn(
    "w-full",
    "h-full",
    "transition-all",
    "duration-300",
    "ease-in-out",
    !maxWidth && "max-w-none",
    typeof maxWidth === "number" && "mx-auto"
  )

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  )

  // Error display component
  const ErrorDisplay = ({ error }: { error: string }) => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Something went wrong</h3>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
        <Button onClick={() => window.location.reload()} className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </div>
    </div>
  )

  // Loading display component
  const LoadingDisplay = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Loading content</h3>
          <p className="text-gray-600">Please wait while we load your project data...</p>
        </div>
      </div>
    </div>
  )

  // Responsive padding calculation
  const getResponsivePadding = () => {
    if (responsive.is("xs") || responsive.is("sm")) {
      return Math.max(12, contentPadding * 0.5)
    }
    if (responsive.isAtMost("md")) {
      return Math.max(16, contentPadding * 0.75)
    }
    return contentPadding
  }

  const responsivePadding = getResponsivePadding()

  // Content container style
  const contentStyle = {
    padding: responsivePadding,
    maxWidth: maxWidth || "none",
    backgroundColor: backgroundColor || "transparent",
    minHeight: dimensions.height,
    width: dimensions.width,
  }

  // Handle scroll events for scroll-to-top button
  const [showScrollTop, setShowScrollTop] = React.useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (scrollAreaRef.current) {
        const scrollTop = scrollAreaRef.current.scrollTop
        setShowScrollTop(scrollTop > 300)
      }
    }

    const scrollElement = scrollAreaRef.current
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll)
      return () => scrollElement.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <main className={contentClasses} id="main-content" role="main" aria-label="Main content" ref={contentRef}>
      {scrollable ? (
        <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
          <div className={innerContentClasses} style={contentStyle}>
            {/* Content based on state */}
            {error ? (
              <ErrorDisplay error={error} />
            ) : loading && showLoading ? (
              <LoadingDisplay />
            ) : loading ? (
              <LoadingSkeleton />
            ) : (
              <>
                {/* Development info */}
                {process.env.NODE_ENV === "development" && (
                  <Alert className="mb-6">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Content Area - User: {userRole || "guest"} | Dimensions: {dimensions.width}x{dimensions.height}px
                      | Padding: {responsivePadding}px | Breakpoint: {layoutState.responsive.breakpoint || "unknown"}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Main content */}
                <div className="relative">{children}</div>
              </>
            )}
          </div>
        </ScrollArea>
      ) : (
        <div className={innerContentClasses} style={contentStyle}>
          {/* Non-scrollable content */}
          {error ? (
            <ErrorDisplay error={error} />
          ) : loading && showLoading ? (
            <LoadingDisplay />
          ) : (
            <>
              {/* Development info */}
              {process.env.NODE_ENV === "development" && (
                <Alert className="mb-6">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Content Area (Non-scrollable) - User: {userRole || "guest"} | Dimensions: {dimensions.width}x
                    {dimensions.height}px | Padding: {responsivePadding}px
                  </AlertDescription>
                </Alert>
              )}

              {/* Main content */}
              <div className="relative h-full">{children}</div>
            </>
          )}
        </div>
      )}

      {/* Scroll to top button */}
      {scrollable && showScrollTop && (
        <Button
          size="sm"
          className="fixed bottom-6 right-6 z-40 rounded-full shadow-lg"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}

      {/* Loading overlay for transitions */}
      {loading && !showLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-4 shadow-lg border">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm font-medium">Loading...</span>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default ProjectContent
