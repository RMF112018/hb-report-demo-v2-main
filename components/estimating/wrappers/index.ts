/**
 * @fileoverview Estimating Wrapper Components
 * @version v3.0.0
 * @description Modular wrapper components for estimating functionality
 *
 * Wrapper components handle:
 * - Layout and styling
 * - Context providers
 * - Navigation and routing
 * - Page-level state management
 *
 * NOTE: Specific wrapper components are in development.
 * Currently, use the universal EstimatingModuleWrapper for all components.
 */

// Core wrapper components (in development - use EstimatingModuleWrapper instead)
// export { EstimatingTrackerWrapper } from "./EstimatingTrackerWrapper"
// export { CostSummaryWrapper } from "./CostSummaryWrapper"
// export { BidManagementWrapper } from "./BidManagementWrapper"
// export { ProjectFormWrapper } from "./ProjectFormWrapper"
// export { DocumentLogWrapper } from "./DocumentLogWrapper"
// export { AllowancesLogWrapper } from "./AllowancesLogWrapper"
// export { TradePartnerLogWrapper } from "./TradePartnerLogWrapper"
// export { AreaCalculationsWrapper } from "./AreaCalculationsWrapper"
// export { GCGRLogWrapper } from "./GCGRLogWrapper"
// export { BidLevelingWrapper } from "./BidLevelingWrapper"
// export { CostAnalyticsWrapper } from "./CostAnalyticsWrapper"
// export { QuantityTakeoffWrapper } from "./QuantityTakeoffWrapper"
// export { EstimatingIntelligenceWrapper } from "./EstimatingIntelligenceWrapper"
// export { ProjectOverviewWrapper } from "./ProjectOverviewWrapper"
// export { ClarificationsWrapper } from "./ClarificationsWrapper"

// Universal wrapper component (available now)
export { EstimatingModuleWrapper, EstimatingModuleSkeleton } from "./EstimatingModuleWrapper"

// Composite wrapper components (in development)
// export { EstimatingDashboardWrapper } from "./EstimatingDashboardWrapper"

// Wrapper component types
export type { EstimatingWrapperProps, EstimatingModuleWrapperProps, EstimatingDashboardWrapperProps } from "./types"
