/**
 * @fileoverview Bid Management Module - Main Exports
 * @version 3.0.0
 * @description Central export point for all bid management components, hooks, and types
 */

// Main orchestrator component
export { default as BidManagementCenter } from "./BidManagementCenter"

// Core components
export { default as BidProjectList } from "./components/BidProjectList"
export { default as BidPackageList } from "./components/BidPackageList"
export { default as BidProjectDetails } from "./components/BidProjectDetails"
export { default as BidPackageDetails } from "./components/BidPackageDetails"
export { default as BidMessagePanel } from "./components/BidMessagePanel"
export { default as BidFileManager } from "./components/BidFileManager"
export { default as BidTeamManager } from "./components/BidTeamManager"
export { default as BidReportsPanel } from "./components/BidReportsPanel"
export { default as BidLeveling } from "./components/BidLeveling"

// Custom hooks
export { useBidProjects } from "./hooks/use-bid-projects"
export { useBidPackages } from "./hooks/use-bid-packages"

// Types
export * from "./types/bid-management"
