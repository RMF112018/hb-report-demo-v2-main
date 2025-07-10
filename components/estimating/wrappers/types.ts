/**
 * @fileoverview Estimating Wrapper Component Types
 * @version v3.0.0
 * @description Type definitions for modular wrapper components
 */

import { ReactNode } from "react"

// Base wrapper props interface
export interface EstimatingWrapperProps {
  children: ReactNode
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

// Extended wrapper props for modules
export interface EstimatingModuleWrapperProps extends EstimatingWrapperProps {
  title?: string
  description?: string
}

// Dashboard wrapper props
export interface EstimatingDashboardWrapperProps extends EstimatingWrapperProps {
  modules: string[]
  layout?: "grid" | "tabs" | "accordion"
  columns?: number
}

// Specific wrapper component props
export interface EstimatingTrackerWrapperProps extends EstimatingWrapperProps {
  showNewOpportunityForm?: boolean
  onNewOpportunityFormChange?: (show: boolean) => void
  onProjectSelect?: (projectId: string) => void
}

export interface CostSummaryWrapperProps extends EstimatingWrapperProps {
  projectName?: string
  onSave?: (data: any) => void
  onExport?: (format: "pdf" | "csv") => void
  onSubmit?: (data: any) => void
}

export interface BidManagementWrapperProps extends EstimatingWrapperProps {
  // Bid management specific props
}

export interface ProjectFormWrapperProps extends EstimatingWrapperProps {
  project?: any
  onSave?: (project: any) => void
  mode?: "create" | "edit"
}

export interface DocumentLogWrapperProps extends EstimatingWrapperProps {
  // Document log specific props
}

export interface AllowancesLogWrapperProps extends EstimatingWrapperProps {
  // Allowances log specific props
}

export interface TradePartnerLogWrapperProps extends EstimatingWrapperProps {
  // Trade partner log specific props
}

export interface AreaCalculationsWrapperProps extends EstimatingWrapperProps {
  projectName?: string
  onSave?: (data: any) => void
  onExport?: (format: "pdf" | "csv") => void
}

export interface GCGRLogWrapperProps extends EstimatingWrapperProps {
  // GCGR log specific props
}

export interface BidLevelingWrapperProps extends EstimatingWrapperProps {
  // Bid leveling specific props
}

export interface CostAnalyticsWrapperProps extends EstimatingWrapperProps {
  // Cost analytics specific props
}

export interface QuantityTakeoffWrapperProps extends EstimatingWrapperProps {
  estimatingProjects?: any[]
}

export interface EstimatingIntelligenceWrapperProps extends EstimatingWrapperProps {
  estimatingData?: any[]
  projectsData?: any[]
}

export interface ProjectOverviewWrapperProps extends EstimatingWrapperProps {
  estimatingData?: any[]
  projectsData?: any[]
  summaryStats?: any
  viewMode?: "overview" | "projects"
}

export interface ClarificationsWrapperProps extends EstimatingWrapperProps {
  // Clarifications specific props
}
