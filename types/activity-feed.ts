export interface ActivityFeedItem {
  id: string
  project_id: number
  project_name: string
  type: ActivityType
  description: string
  timestamp: string
  source: ActivitySource
  user?: string
  metadata?: {
    [key: string]: any
  }
}

export type ActivityType =
  | "submittal"
  | "rfi"
  | "commitment"
  | "change_order"
  | "change_event"
  | "drawing"
  | "daily_log"
  | "inspection"
  | "bid_package"
  | "bid_invitation"
  | "proposal"
  | "correspondence"
  | "compliance"
  | "pay_app"
  | "contract"
  | "budget"
  | "quality_inspection"
  | "deficiency"
  | "resolution"
  | "spcr"
  | "forecast"
  | "assignment"
  | "note"

export type ActivitySource = "procore" | "building_connected" | "compass" | "sage" | "sitemate" | "hb_report"

export interface ActivityFeedFilters {
  dateRange?: {
    from: Date
    to: Date
  }
  types?: ActivityType[]
  projects?: number[]
  search?: string
  source?: ActivitySource[]
}

export interface ActivityFeedConfig {
  userRole: "executive" | "project-executive" | "project-manager" | "estimator"
  projectId?: number
  showFilters?: boolean
  showPagination?: boolean
  itemsPerPage?: number
  allowExport?: boolean
}

export interface ActivityFeedProps {
  config: ActivityFeedConfig
  filters?: ActivityFeedFilters
  onFiltersChange?: (filters: ActivityFeedFilters) => void
  className?: string
}

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  submittal: "Submittal",
  rfi: "RFI",
  commitment: "Commitment",
  change_order: "Change Order",
  change_event: "Change Event",
  drawing: "Drawing",
  daily_log: "Daily Log",
  inspection: "Inspection",
  bid_package: "Bid Package",
  bid_invitation: "Bid Invitation",
  proposal: "Proposal",
  correspondence: "Correspondence",
  compliance: "Compliance",
  pay_app: "Pay Application",
  contract: "Contract",
  budget: "Budget",
  quality_inspection: "Quality Inspection",
  deficiency: "Deficiency",
  resolution: "Resolution",
  spcr: "SPCR",
  forecast: "Forecast",
  assignment: "Assignment",
  note: "Note",
}

export const ACTIVITY_SOURCE_LABELS: Record<ActivitySource, string> = {
  procore: "Procore",
  building_connected: "Building Connected",
  compass: "Compass",
  sage: "Sage",
  sitemate: "SiteMate",
  hb_report: "HB Report",
}
