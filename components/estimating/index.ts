/**
 * @fileoverview Estimating Module - Comprehensive Export Index
 * @version v3.0.0
 * @description Modular estimating components for injection into other application pages
 *
 * Architecture: Wrapper-Content Component Pattern
 * - Wrapper components handle layout, context, and routing
 * - Content components are self-contained and reusable
 * - All components follow v-3.0.mdc modularization standards
 */

// ==========================================
// CORE INFRASTRUCTURE EXPORTS
// ==========================================

// Main Provider - Required for all estimating functionality
export { EstimatingProvider, useEstimating } from "./EstimatingProvider"

// Core Tracking Components
export { default as EstimatingTracker } from "./EstimatingTracker"
export { ProjectSpecificDashboard } from "./ProjectSpecificDashboard"
export { ProjectEstimateOverview } from "./ProjectEstimateOverview"

// ==========================================
// COST MANAGEMENT EXPORTS
// ==========================================

// Cost Analysis and Management
export { CostSummaryModule } from "./CostSummaryModule"
export { AreaCalculationsModule } from "./AreaCalculationsModule"
export { default as AllowancesLog } from "./AllowancesLog"
export { default as GCGRLog } from "./GCGRLog"
export { CostAnalyticsDashboard } from "./CostAnalyticsDashboard"

// ==========================================
// BID MANAGEMENT EXPORTS
// ==========================================

// Bid Processing and Management
export { BidLeveling } from "./BidLeveling"
export { BidLevelingContent } from "./BidLevelingContent"
export { default as ProjectBidManagement } from "./BidManagement"
export { BidManagementCenter } from "./BidManagementCenter"
export { BidTabManagement } from "./BidTabManagement"

// NEW: BuildingConnected Integration Components
export { default as ProjectList } from "./ProjectList"
export { default as BidderTemplateManager } from "./BidderTemplateManager"
export { default as BidFormBuilder } from "./BidFormBuilder"

// ==========================================
// PROJECT MANAGEMENT EXPORTS
// ==========================================

// Project Setup and Management
export { default as ProjectForm } from "./ProjectForm"
export { default as TradePartnerLog } from "./TradePartnerLog"
export { default as DocumentLog } from "./DocumentLog"
export { default as ClarificationsAssumptions } from "./ClarificationsAssumptions"

// ==========================================
// ANALYTICS & INTELLIGENCE EXPORTS
// ==========================================

// Analytics and Insights
export { QuantityTakeoffDashboard } from "./QuantityTakeoffDashboard"
export { EstimatingIntelligence } from "./EstimatingIntelligence"

// ==========================================
// MODULAR WRAPPER COMPONENTS
// ==========================================

// Main wrapper component for universal use
export { EstimatingModuleWrapper, EstimatingModuleSkeleton } from "./wrappers/EstimatingModuleWrapper"

// Content components (in development - will be available in future versions)
// export * from "./content"

// ==========================================
// TYPE DEFINITIONS & INTERFACES
// ==========================================

// Re-export all estimating types for external use
export type {
  EstimateData,
  ProjectData,
  QuantityTakeoff,
  BidData,
  CostAnalysis,
  TradePartner,
  Allowance,
  GCGRItem,
  TradeBids,
  BidTab,
  BidComparison,
} from "./EstimatingProvider"

// Component prop interfaces for external integration
export interface EstimatingModuleProps {
  projectId?: string
  userRole: string
  className?: string
  isEmbedded?: boolean
  showHeader?: boolean
  onNavigate?: (path: string) => void
}

export interface EstimatingContentProps extends EstimatingModuleProps {
  data?: any
  onSave?: (data: any) => void
  onExport?: (format: "pdf" | "csv") => void
  onUpdate?: (updates: any) => void
}

// ==========================================
// LAZY LOADING HELPERS
// ==========================================

import { lazy } from "react"

// Lazy-loaded components for performance optimization
export const LazyEstimatingTracker = lazy(() => import("./EstimatingTracker"))
export const LazyCostSummaryModule = lazy(() =>
  import("./CostSummaryModule").then((m) => ({ default: m.CostSummaryModule }))
)
export const LazyProjectBidManagement = lazy(() => import("./BidManagement"))
export const LazyBidManagementCenter = lazy(() =>
  import("./BidManagementCenter").then((m) => ({ default: m.BidManagementCenter }))
)
export const LazyProjectForm = lazy(() => import("./ProjectForm"))
export const LazyDocumentLog = lazy(() => import("./DocumentLog"))

// NEW: Lazy-loaded BuildingConnected integration components
export const LazyProjectList = lazy(() => import("./ProjectList"))
export const LazyBidderTemplateManager = lazy(() => import("./BidderTemplateManager"))
export const LazyBidFormBuilder = lazy(() => import("./BidFormBuilder"))

// ==========================================
// MODULAR INJECTION UTILITIES
// ==========================================

/**
 * Component registry for dynamic injection
 * Use this to get component references for external integration
 */
export const estimatingComponents = {
  "estimating-tracker": LazyEstimatingTracker,
  "cost-summary": LazyCostSummaryModule,
  "bid-management": LazyProjectBidManagement,
  "bid-management-center": LazyBidManagementCenter,
  "project-form": LazyProjectForm,
  "document-log": LazyDocumentLog,
  "project-list": LazyProjectList,
  "bidder-template-manager": LazyBidderTemplateManager,
  "bid-form-builder": LazyBidFormBuilder,
} as const

/**
 * Utility function to get component registry
 * Use this for dynamic component loading
 */
export const getEstimatingComponent = (componentName: keyof typeof estimatingComponents) => {
  return estimatingComponents[componentName]
}

// ==========================================
// MODULE CONFIGURATION
// ==========================================

/**
 * Configuration for estimating modules
 * Allows for easy customization when injecting into other pages
 */
export const estimatingModuleConfig = {
  // Default props for each module
  defaultProps: {
    "estimating-tracker": {
      className: "estimating-tracker-module",
      showHeader: true,
    },
    "cost-summary": {
      className: "cost-summary-module",
      showHeader: true,
    },
    "bid-management": {
      className: "bid-management-module",
      showHeader: true,
    },
    "bid-management-center": {
      className: "bid-management-center-module",
      showHeader: true,
    },
    "project-list": {
      className: "project-list-module",
      showHeader: true,
    },
    "bidder-template-manager": {
      className: "bidder-template-manager-module",
      showHeader: true,
    },
    "bid-form-builder": {
      className: "bid-form-builder-module",
      showHeader: true,
    },
  },

  // Required providers for each module
  requiredProviders: {
    "estimating-tracker": ["EstimatingProvider"],
    "cost-summary": ["EstimatingProvider"],
    "bid-management": ["EstimatingProvider"],
    "bid-management-center": ["EstimatingProvider"],
    "project-form": ["EstimatingProvider"],
    "document-log": ["EstimatingProvider"],
    "project-list": ["EstimatingProvider"],
    "bidder-template-manager": ["EstimatingProvider"],
    "bid-form-builder": ["EstimatingProvider"],
  },

  // Dependencies between modules
  dependencies: {
    "cost-summary": ["area-calculations", "allowances-log"],
    "bid-management": ["bid-leveling", "trade-partners"],
    "bid-management-center": ["project-list", "bidder-template-manager", "bid-form-builder"],
    "project-overview": ["cost-analytics", "estimating-intelligence"],
  },
}

// ==========================================
// BUILDINGCONNECTED INTEGRATION CONFIG
// ==========================================

/**
 * BuildingConnected API integration configuration
 * For connecting to Autodesk BuildingConnected services
 */
export const buildingConnectedConfig = {
  apiVersion: "v2",
  baseUrl: "https://api.buildingconnected.com",
  endpoints: {
    projects: "/projects",
    bidders: "/bidders",
    templates: "/templates",
    forms: "/forms",
    invitations: "/invitations",
    responses: "/responses",
  },
  features: {
    realTimeSync: true,
    webhookSupport: true,
    bulkOperations: true,
    advancedFiltering: true,
    customFields: true,
    analytics: true,
  },
  limits: {
    maxProjectsPerRequest: 100,
    maxBiddersPerTemplate: 500,
    maxFieldsPerForm: 50,
    maxAttachmentSize: 50, // MB
  },
}

// ==========================================
// VERSION INFORMATION
// ==========================================

export const ESTIMATING_MODULE_VERSION = "3.0.0"
export const LAST_UPDATED = "2025-01-14"
export const ARCHITECTURE_STANDARD = "v-3.0.mdc"

// NEW: BuildingConnected integration version
export const BUILDING_CONNECTED_VERSION = "1.0.0"
export const BUILDING_CONNECTED_LAST_UPDATED = "2025-01-14"
