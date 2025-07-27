/**
 * @fileoverview HBI Analysis Hook
 * @module useHBIAnalysis
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-31
 *
 * React hook for integrating with HBI Market Analysis API
 */

"use client"

import { useState, useEffect, useCallback } from "react"

export interface HBIAnalysisParams {
  region?: string
  timeframe?: string
  sector?: string
  marketSegment?: string
  riskLevel?: "low" | "medium" | "high"
  analysisDepth?: "summary" | "detailed" | "comprehensive"
}

export interface HBIAnalysisResult {
  insight: string
  confidence: number
  trend: "up" | "down" | "stable"
  recommendation?: string
  keyFactors?: string[]
  keyFindings?: string[]
  dataQuality?: number
  processingTime: number
  modelVersion: string
  timestamp: string
  promptId: string
  hbiMetadata: {
    analysisType: string
    confidence: number
    timeframe: string
    dataSourceCount: number
  }
  poweredBy: string
  requestId: string
}

export interface UseHBIAnalysisReturn {
  data: HBIAnalysisResult | null
  loading: boolean
  error: string | null
  runAnalysis: (
    promptId: string,
    parameters?: HBIAnalysisParams,
    options?: {
      realTimeMode?: boolean
      includeConfidence?: boolean
    }
  ) => Promise<void>
  clearError: () => void
  isHBIEnabled: boolean
  toggleHBIMode: () => void
}

/**
 * Hook for HBI Market Analysis integration
 */
export function useHBIAnalysis(): UseHBIAnalysisReturn {
  const [data, setData] = useState<HBIAnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isHBIEnabled, setIsHBIEnabled] = useState(false)

  // Load HBI mode preference from localStorage
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem("hbi-forecast-enabled")
      if (savedMode) {
        setIsHBIEnabled(JSON.parse(savedMode))
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [])

  // Save HBI mode preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("hbi-forecast-enabled", JSON.stringify(isHBIEnabled))
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [isHBIEnabled])

  /**
   * Run HBI analysis
   */
  const runAnalysis = useCallback(
    async (
      promptId: string,
      parameters: HBIAnalysisParams = {},
      options: { realTimeMode?: boolean; includeConfidence?: boolean } = {}
    ) => {
      if (!isHBIEnabled) {
        setError("HBI Forecast mode is disabled. Enable it to run analysis.")
        return
      }

      setLoading(true)
      setError(null)

      try {
        const requestBody = {
          promptId,
          parameters,
          realTimeMode: options.realTimeMode ?? false,
          includeConfidence: options.includeConfidence ?? true,
        }

        const response = await fetch("/api/hbi/market-analysis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `HBI API error: ${response.status}`)
        }

        const result: HBIAnalysisResult = await response.json()
        setData(result)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "HBI analysis failed"
        setError(errorMessage)

        // Try to load fallback data on error
        try {
          const fallbackResponse = await fetch("/data/mock/intel/hbi-insights.json")
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json()
            const fallbackInsight = fallbackData.insights.floridaMarketGrowth

            setData({
              ...fallbackInsight,
              processingTime: 0,
              modelVersion: "HBI-3.2.1-Fallback",
              promptId,
              hbiMetadata: {
                analysisType: "Market Growth",
                confidence: fallbackInsight.confidence,
                timeframe: "3 months",
                dataSourceCount: 127,
              },
              poweredBy: "HBI Market Intelligence Engine (Offline Mode)",
              requestId: `fallback-${Date.now()}`,
            })

            setError(`${errorMessage} (using cached insights)`)
          }
        } catch (fallbackErr) {
          // Fallback failed too
          console.error("Fallback data loading failed:", fallbackErr)
        }
      } finally {
        setLoading(false)
      }
    },
    [isHBIEnabled]
  )

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  /**
   * Toggle HBI mode
   */
  const toggleHBIMode = useCallback(() => {
    setIsHBIEnabled((prev) => !prev)
    if (error) {
      setError(null)
    }
  }, [error])

  return {
    data,
    loading,
    error,
    runAnalysis,
    clearError,
    isHBIEnabled,
    toggleHBIMode,
  }
}

/**
 * Hook for fetching available HBI prompts
 */
export function useHBIPrompts() {
  const [prompts, setPrompts] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPrompts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/hbi/market-analysis?action=prompts")
      if (!response.ok) {
        throw new Error(`Failed to fetch prompts: ${response.status}`)
      }

      const data = await response.json()
      setPrompts(data.prompts || [])
      setCategories(data.categories || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch HBI prompts"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPrompts()
  }, [fetchPrompts])

  return {
    prompts,
    categories,
    loading,
    error,
    refetch: fetchPrompts,
  }
}

/**
 * Hook for HBI service status
 */
export function useHBIStatus() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkStatus = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/hbi/market-analysis?action=status")
      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`)
      }

      const data = await response.json()
      setStatus(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Status check failed"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkStatus()
  }, [checkStatus])

  return {
    status,
    loading,
    error,
    refresh: checkStatus,
  }
}
