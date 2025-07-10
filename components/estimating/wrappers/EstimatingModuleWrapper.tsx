"use client"

import React, { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EstimatingProvider } from "../EstimatingProvider"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Loader2 } from "lucide-react"

export interface EstimatingModuleWrapperProps {
  children: React.ReactNode
  title?: string
  description?: string
  projectId?: string
  userRole: string
  className?: string
  isEmbedded?: boolean
  showHeader?: boolean
  showCard?: boolean
  onNavigate?: (path: string) => void
  onError?: (error: Error) => void
  loading?: boolean
}

/**
 * EstimatingModuleWrapper - Universal wrapper for estimating components
 *
 * This wrapper provides:
 * - Context providers (EstimatingProvider)
 * - Loading states
 * - Error boundaries
 * - Consistent styling
 * - Optional card layout
 * - Navigation handling
 */
export function EstimatingModuleWrapper({
  children,
  title,
  description,
  projectId,
  userRole,
  className = "",
  isEmbedded = false,
  showHeader = true,
  showCard = true,
  onNavigate,
  onError,
  loading = false,
}: EstimatingModuleWrapperProps) {
  // Error boundary handler
  const handleError = (error: Error) => {
    console.error("Estimating module error:", error)
    if (onError) {
      onError(error)
    }
  }

  // Loading component
  const LoadingComponent = () => (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <span className="ml-2 text-sm text-gray-600">Loading estimating module...</span>
    </div>
  )

  // Error component
  const ErrorComponent = ({ error }: { error: Error }) => (
    <div className="flex items-center justify-center p-8">
      <AlertCircle className="h-8 w-8 text-red-600 mr-2" />
      <div>
        <p className="text-sm font-medium text-red-800">Error loading estimating module</p>
        <p className="text-xs text-red-600 mt-1">{error.message}</p>
      </div>
    </div>
  )

  // Wrapper classes
  const wrapperClasses = `
    estimating-module-wrapper 
    ${isEmbedded ? "embedded-mode" : "standalone-mode"}
    ${className}
  `.trim()

  // Content wrapper
  const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
    if (showCard) {
      return (
        <Card className="w-full h-full">
          {showHeader && (title || description) && (
            <CardHeader>
              {title && <CardTitle className="flex items-center gap-2">{title}</CardTitle>}
              {description && <p className="text-sm text-gray-600">{description}</p>}
            </CardHeader>
          )}
          <CardContent className={showHeader ? "pt-0" : ""}>{children}</CardContent>
        </Card>
      )
    }

    return (
      <div className="w-full h-full">
        {showHeader && (title || description) && (
          <div className="mb-6">
            {title && <h2 className="text-xl font-semibold mb-2">{title}</h2>}
            {description && <p className="text-sm text-gray-600">{description}</p>}
          </div>
        )}
        {children}
      </div>
    )
  }

  return (
    <div className={wrapperClasses}>
      <EstimatingProvider>
        <ErrorBoundary onError={handleError}>
          <ContentWrapper>
            {loading ? <LoadingComponent /> : <Suspense fallback={<LoadingComponent />}>{children}</Suspense>}
          </ContentWrapper>
        </ErrorBoundary>
      </EstimatingProvider>
    </div>
  )
}

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Estimating module error boundary:", error, errorInfo)
    if (this.props.onError) {
      this.props.onError(error)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center p-8">
          <AlertCircle className="h-8 w-8 text-red-600 mr-2" />
          <div>
            <p className="text-sm font-medium text-red-800">Something went wrong</p>
            <p className="text-xs text-red-600 mt-1">{this.state.error?.message || "An unexpected error occurred"}</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Loading skeleton for estimating modules
export function EstimatingModuleSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  )
}

export default EstimatingModuleWrapper
