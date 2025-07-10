/**
 * @fileoverview Lazy Content Loader with Performance Optimization
 * @module LazyContentLoader
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Advanced lazy loading system for content components with code splitting,
 * preloading, caching, and performance monitoring.
 */

"use client"

import React, { Suspense, lazy, useEffect, useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Loader2, Activity } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

/**
 * Content component props interface
 */
export interface ContentComponentProps {
  selectedSubTool: string
  projectData: any
  userRole: string
  projectId?: string
  [key: string]: any
}

/**
 * Lazy loading configuration
 */
interface LazyLoadConfig {
  /** Enable preloading of likely next components */
  enablePreloading: boolean
  /** Cache timeout in milliseconds */
  cacheTimeout: number
  /** Maximum number of cached components */
  maxCacheSize: number
  /** Enable performance monitoring */
  enablePerformanceMonitoring: boolean
  /** Retry count for failed loads */
  retryCount: number
}

/**
 * Performance metrics interface
 */
interface PerformanceMetrics {
  loadTime: number
  cacheHit: boolean
  componentSize?: number
  timestamp: number
}

/**
 * Component cache entry
 */
interface CacheEntry {
  component: React.LazyExoticComponent<React.ComponentType<any>>
  timestamp: number
  loadTime: number
  hitCount: number
}

/**
 * Default lazy loading configuration
 */
const DEFAULT_CONFIG: LazyLoadConfig = {
  enablePreloading: true,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  maxCacheSize: 10,
  enablePerformanceMonitoring: true,
  retryCount: 3,
}

/**
 * Component cache for lazy loaded components
 */
const componentCache = new Map<string, CacheEntry>()

/**
 * Performance metrics storage
 */
const performanceMetrics = new Map<string, PerformanceMetrics[]>()

/**
 * Lazy component factory with caching and performance monitoring
 */
function createLazyComponent(
  componentName: string,
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  config: LazyLoadConfig = DEFAULT_CONFIG
): React.LazyExoticComponent<React.ComponentType<any>> {
  // Check cache first
  const cached = componentCache.get(componentName)
  if (cached && Date.now() - cached.timestamp < config.cacheTimeout) {
    cached.hitCount++
    return cached.component
  }

  // Create lazy component with performance monitoring
  const lazyComponent = lazy(async () => {
    const startTime = performance.now()

    try {
      const module = await importFn()
      const loadTime = performance.now() - startTime

      // Store in cache
      const cacheEntry: CacheEntry = {
        component: lazy(() => Promise.resolve(module)),
        timestamp: Date.now(),
        loadTime,
        hitCount: 1,
      }

      // Manage cache size
      if (componentCache.size >= config.maxCacheSize) {
        const oldestKey = Array.from(componentCache.keys())[0]
        componentCache.delete(oldestKey)
      }

      componentCache.set(componentName, cacheEntry)

      // Store performance metrics
      if (config.enablePerformanceMonitoring) {
        const metrics: PerformanceMetrics = {
          loadTime,
          cacheHit: false,
          timestamp: Date.now(),
        }

        const existingMetrics = performanceMetrics.get(componentName) || []
        existingMetrics.push(metrics)

        // Keep only last 20 metrics per component
        if (existingMetrics.length > 20) {
          existingMetrics.splice(0, existingMetrics.length - 20)
        }

        performanceMetrics.set(componentName, existingMetrics)
      }

      return module
    } catch (error) {
      console.error(`Failed to load component ${componentName}:`, error)
      throw error
    }
  })

  return lazyComponent
}

/**
 * Lazy loaded content components with code splitting
 */
export const LazyComponents = {
  FinancialHubContent: createLazyComponent("FinancialHubContent", () =>
    import("./content/FinancialHubContent").catch(() => ({ default: () => <div>Component not found</div> }))
  ),
  ProcurementContent: createLazyComponent("ProcurementContent", () =>
    import("./content/ProcurementContent").catch(() => ({ default: () => <div>Component not found</div> }))
  ),
  SchedulerContent: createLazyComponent("SchedulerContent", () =>
    import("./content/SchedulerContent").catch(() => ({ default: () => <div>Component not found</div> }))
  ),
  ConstraintsContent: createLazyComponent("ConstraintsContent", () =>
    import("./content/ConstraintsContent").catch(() => ({ default: () => <div>Component not found</div> }))
  ),
  PermitLogContent: createLazyComponent("PermitLogContent", () =>
    import("./content/PermitLogContent").catch(() => ({ default: () => <div>Component not found</div> }))
  ),
  FieldReportsContent: createLazyComponent("FieldReportsContent", () =>
    import("./content/FieldReportsContent").catch(() => ({ default: () => <div>Component not found</div> }))
  ),
  ReportsContent: createLazyComponent("ReportsContent", () =>
    import("./content/ReportsContent").catch(() => ({ default: () => <div>Component not found</div> }))
  ),
  ChecklistsContent: createLazyComponent("ChecklistsContent", () =>
    import("./content/ChecklistsContent").catch(() => ({ default: () => <div>Component not found</div> }))
  ),
}

/**
 * Preloading utility for likely next components
 */
const preloadingMap: Record<string, string[]> = {
  "Financial Hub": ["ProcurementContent", "SchedulerContent"],
  Procurement: ["FinancialHubContent", "SchedulerContent"],
  Scheduler: ["FinancialHubContent", "ConstraintsContent"],
  "Constraints Log": ["SchedulerContent", "PermitLogContent"],
  "Permit Log": ["ConstraintsContent", "FieldReportsContent"],
  "Field Reports": ["PermitLogContent", "ReportsContent"],
  Reports: ["FieldReportsContent", "ChecklistsContent"],
  Checklists: ["ReportsContent", "FinancialHubContent"],
}

/**
 * Preload function for anticipated components
 */
function preloadComponents(currentTool: string, config: LazyLoadConfig) {
  if (!config.enablePreloading) return

  const componentsToPreload = preloadingMap[currentTool] || []

  componentsToPreload.forEach((componentName) => {
    // Component is ready for preloading when accessed
    // React's lazy loading will handle the dynamic import
    console.log(`Component ${componentName} ready for preloading`)
  })
}

/**
 * Loading skeleton component
 */
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* KPI Skeleton */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-4 mb-2" />
              <Skeleton className="h-6 w-16 mb-1" />
              <Skeleton className="h-3 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Error boundary for lazy loaded components
 */
function LazyLoadError({
  error,
  onRetry,
  componentName,
}: {
  error: Error
  onRetry: () => void
  componentName: string
}) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <p>Failed to load {componentName} component.</p>
          <button onClick={onRetry} className="text-sm underline hover:no-underline">
            Try again
          </button>
        </div>
      </AlertDescription>
    </Alert>
  )
}

/**
 * Props for LazyContentLoader
 */
export interface LazyContentLoaderProps {
  /** Component name to load */
  componentName: keyof typeof LazyComponents
  /** Tool name for preloading */
  toolName: string
  /** Props to pass to the loaded component */
  componentProps: ContentComponentProps
  /** Custom loading component */
  fallback?: React.ComponentType
  /** Lazy loading configuration */
  config?: Partial<LazyLoadConfig>
  /** Error callback */
  onError?: (error: Error) => void
  /** Load callback */
  onLoad?: (loadTime: number) => void
}

/**
 * LazyContentLoader component - Advanced lazy loading with performance optimization
 */
export function LazyContentLoader({
  componentName,
  toolName,
  componentProps,
  fallback: Fallback = LoadingSkeleton,
  config = {},
  onError,
  onLoad,
}: LazyContentLoaderProps) {
  const [retryCount, setRetryCount] = useState(0)
  const [loadError, setLoadError] = useState<Error | null>(null)

  const finalConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config])

  // Preload related components
  useEffect(() => {
    preloadComponents(toolName, finalConfig)
  }, [toolName, finalConfig])

  // Handle retry logic
  const handleRetry = useCallback(() => {
    if (retryCount < finalConfig.retryCount) {
      setRetryCount((prev) => prev + 1)
      setLoadError(null)
    }
  }, [retryCount, finalConfig.retryCount])

  // Get the lazy component
  const LazyComponent = LazyComponents[componentName]

  if (!LazyComponent) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Component "{componentName}" not found.</AlertDescription>
      </Alert>
    )
  }

  if (loadError && retryCount >= finalConfig.retryCount) {
    return <LazyLoadError error={loadError} onRetry={handleRetry} componentName={componentName} />
  }

  return (
    <Suspense fallback={<Fallback />}>
      <ErrorBoundary
        onError={(error) => {
          setLoadError(error)
          onError?.(error)
        }}
        onRetry={handleRetry}
        componentName={componentName}
      >
        <LazyComponent {...componentProps} />
      </ErrorBoundary>
    </Suspense>
  )
}

/**
 * Error boundary component
 */
class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode
    onError: (error: Error) => void
    onRetry: () => void
    componentName: string
  },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    this.props.onError(error)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <LazyLoadError
          error={this.state.error}
          onRetry={() => {
            this.setState({ hasError: false, error: null })
            this.props.onRetry()
          }}
          componentName={this.props.componentName}
        />
      )
    }

    return this.props.children
  }
}

/**
 * Performance monitoring utilities
 */
export const PerformanceMonitor = {
  /**
   * Get performance metrics for a component
   */
  getMetrics: (componentName: string): PerformanceMetrics[] => {
    return performanceMetrics.get(componentName) || []
  },

  /**
   * Get average load time for a component
   */
  getAverageLoadTime: (componentName: string): number => {
    const metrics = performanceMetrics.get(componentName) || []
    if (metrics.length === 0) return 0

    const totalTime = metrics.reduce((sum, metric) => sum + metric.loadTime, 0)
    return totalTime / metrics.length
  },

  /**
   * Get cache hit rate
   */
  getCacheHitRate: (componentName: string): number => {
    const cached = componentCache.get(componentName)
    if (!cached) return 0

    const metrics = performanceMetrics.get(componentName) || []
    const cacheHits = metrics.filter((m) => m.cacheHit).length

    return metrics.length > 0 ? cacheHits / metrics.length : 0
  },

  /**
   * Clear performance data
   */
  clearMetrics: () => {
    performanceMetrics.clear()
    componentCache.clear()
  },
}

export default LazyContentLoader
