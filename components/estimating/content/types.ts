/**
 * @fileoverview Content Component Types
 * @version v3.0.0
 * @description Type definitions for content components
 *
 * NOTE: These types are placeholders for future content component development.
 * Content components will be pure, layout-agnostic components extracted from
 * existing estimating components.
 */

import { ReactNode } from "react"

// Base content component props
export interface EstimatingContentProps {
  children?: ReactNode
  className?: string
  userRole: string
  projectId?: string
  data?: any
  onAction?: (action: string, data?: any) => void
  onError?: (error: Error) => void
}

// Future content component types - will be implemented when content components are created
export interface CostSummaryContentProps extends EstimatingContentProps {
  projectName?: string
  costData?: any
  onSave?: (data: any) => void
  onExport?: (format: "pdf" | "csv") => void
}

export interface BidManagementContentProps extends EstimatingContentProps {
  bids?: any[]
  onBidSelect?: (bid: any) => void
  onBidUpdate?: (bid: any) => void
}

export interface ProjectFormContentProps extends EstimatingContentProps {
  project?: any
  mode?: "create" | "edit"
  onSubmit?: (project: any) => void
}

export interface DocumentLogContentProps extends EstimatingContentProps {
  documents?: any[]
  onDocumentSelect?: (document: any) => void
  onDocumentUpload?: (file: File) => void
}

export interface AllowancesContentProps extends EstimatingContentProps {
  allowances?: any[]
  onAllowanceUpdate?: (allowance: any) => void
}

export interface TradePartnerContentProps extends EstimatingContentProps {
  partners?: any[]
  onPartnerSelect?: (partner: any) => void
}

export interface AreaCalculationsContentProps extends EstimatingContentProps {
  areas?: any[]
  onAreaUpdate?: (area: any) => void
}

export interface GCGRContentProps extends EstimatingContentProps {
  gcgrItems?: any[]
  onItemUpdate?: (item: any) => void
}

export interface CostAnalyticsContentProps extends EstimatingContentProps {
  analyticsData?: any
  timeRange?: string
  onTimeRangeChange?: (range: string) => void
}

export interface QuantityTakeoffContentProps extends EstimatingContentProps {
  quantities?: any[]
  onQuantityUpdate?: (quantity: any) => void
}

export interface EstimatingIntelligenceContentProps extends EstimatingContentProps {
  intelligenceData?: any
  onInsightSelect?: (insight: any) => void
}

export interface ProjectOverviewContentProps extends EstimatingContentProps {
  overview?: any
  viewMode?: "overview" | "details"
  onViewModeChange?: (mode: string) => void
}

export interface ClarificationsContentProps extends EstimatingContentProps {
  clarifications?: any[]
  onClarificationUpdate?: (clarification: any) => void
}

export interface EstimatingTrackerContentProps extends EstimatingContentProps {
  projects?: any[]
  onProjectSelect?: (project: any) => void
  onProjectUpdate?: (project: any) => void
}
