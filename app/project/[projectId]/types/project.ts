/**
 * @fileoverview Project data type definitions
 * @module ProjectTypes
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Comprehensive type definitions for project data, metrics, permissions,
 * and related functionality used throughout the project page system.
 *
 * @example
 * ```typescript
 * import { ProjectData, ProjectMetrics } from './project'
 *
 * const project: ProjectData = {
 *   id: 'proj-123',
 *   name: 'Office Building Construction',
 *   stage: 'Construction',
 *   contractValue: 2500000
 * }
 * ```
 */

/**
 * Core project data interface
 */
export interface ProjectData {
  /** Unique project identifier */
  id: string | number
  /** Project name */
  name: string
  /** Project description */
  description?: string
  /** Current project stage */
  stage: string
  /** Project stage name for display */
  project_stage_name: string
  /** Project type */
  project_type_name: string
  /** Contract value */
  contract_value: number
  /** Project duration in days */
  duration: number
  /** Start date */
  start_date?: string
  /** End date */
  end_date?: string
  /** Project location */
  location?: string
  /** Project manager */
  project_manager?: string
  /** Client/owner information */
  client?: string
  /** Additional project metadata */
  metadata?: Record<string, any>
}

/**
 * Project metrics and KPIs
 */
export interface ProjectMetrics {
  /** Total budget allocated */
  totalBudget: number
  /** Amount spent to date */
  spentToDate: number
  /** Remaining budget */
  remainingBudget: number
  /** Schedule progress percentage */
  scheduleProgress: number
  /** Budget progress percentage */
  budgetProgress: number
  /** Number of active team members */
  activeTeamMembers: number
  /** Completed milestones */
  completedMilestones: number
  /** Total milestones */
  totalMilestones: number
  /** Active risk items */
  riskItems: number
  /** Active RFIs */
  activeRFIs: number
  /** Change orders */
  changeOrders: number
  /** Project health score */
  healthScore?: number
  /** Performance metrics */
  performance?: {
    costPerformanceIndex: number
    schedulePerformanceIndex: number
    qualityScore: number
    safetyScore: number
  }
}

/**
 * User role types
 */
export type UserRole =
  | "executive"
  | "project-executive"
  | "project-manager"
  | "superintendent"
  | "estimator"
  | "team-member"
  | "admin"
  | "viewer"

/**
 * Project stage types
 */
export type ProjectStage =
  | "BIM Coordination"
  | "Bidding"
  | "Pre-Construction"
  | "Construction"
  | "Closeout"
  | "Warranty"
  | "Closed"

/**
 * Permission system
 */
export interface ProjectPermissions {
  /** User role */
  userRole: UserRole
  /** Whether user has access to current stage */
  stageAccess: boolean
  /** Tool-specific permissions */
  toolPermissions: Record<string, boolean>
  /** Action-specific permissions */
  actionPermissions: Record<string, boolean>
  /** Data access permissions */
  dataPermissions: {
    canViewFinancials: boolean
    canEditFinancials: boolean
    canViewSchedule: boolean
    canEditSchedule: boolean
    canViewReports: boolean
    canCreateReports: boolean
    canApproveReports: boolean
  }
}

/**
 * Stage configuration
 */
export interface StageConfig {
  /** Stage name */
  stageName: ProjectStage
  /** Stage display color */
  stageColor: string
  /** Available tools for this stage */
  availableTools: string[]
  /** Required permissions */
  requiredPermissions: string[]
  /** Stage-specific features */
  features: {
    showFinancials: boolean
    showScheduler: boolean
    showFieldReports: boolean
    showPermits: boolean
    showConstraints: boolean
  }
}

/**
 * Project insights from AI analysis
 */
export interface ProjectInsight {
  /** Unique insight identifier */
  id: string
  /** Insight type */
  type: "alert" | "opportunity" | "performance" | "risk"
  /** Severity level */
  severity: "low" | "medium" | "high"
  /** Insight title */
  title: string
  /** Detailed text */
  text: string
  /** Recommended action */
  action: string
  /** Confidence level (0-100) */
  confidence: number
  /** Related metrics */
  relatedMetrics: string[]
  /** Timestamp */
  timestamp?: number
  /** Source of insight */
  source?: string
}

/**
 * Recent activity item
 */
export interface ActivityItem {
  /** Activity ID */
  id: string
  /** Activity type */
  type: "milestone" | "alert" | "update" | "approval" | "completion"
  /** Activity title */
  title: string
  /** Activity description */
  description: string
  /** Activity timestamp */
  timestamp: string
  /** Icon component */
  icon: React.ComponentType<{ className?: string }>
  /** Color for styling */
  color: string
  /** Associated user */
  user?: string
  /** Related entity */
  relatedEntity?: {
    type: string
    id: string
    name: string
  }
}

/**
 * Quick action configuration
 */
export interface QuickAction {
  /** Action label */
  label: string
  /** Icon component */
  icon: React.ComponentType<{ className?: string }>
  /** Action handler */
  action: () => void
  /** Whether action is enabled */
  enabled?: boolean
  /** Action description */
  description?: string
  /** Required permissions */
  requiredPermissions?: string[]
}

/**
 * KPI widget configuration
 */
export interface KPIWidget {
  /** Widget icon */
  icon: React.ComponentType<{ className?: string }>
  /** KPI value */
  value: string | number
  /** KPI label */
  label: string
  /** Color theme */
  color: string
  /** Trend indicator */
  trend?: "up" | "down" | "stable"
  /** Trend percentage */
  trendPercentage?: number
  /** Additional context */
  context?: string
}

/**
 * Financial data summary
 */
export interface FinancialSummary {
  /** Data scope */
  scope: "single" | "portfolio"
  /** Number of projects */
  projectCount: number
  /** Scope description */
  description: string
  /** Project names */
  projects: string[]
  /** Project ID */
  projectId: string
  /** Total contract value */
  totalContractValue: number
  /** Net cash flow */
  netCashFlow: number
  /** Profit margin percentage */
  profitMargin: number
  /** Pending approvals count */
  pendingApprovals: number
  /** Overall health score */
  healthScore: number
}

/**
 * Schedule data summary
 */
export interface ScheduleSummary {
  /** Data scope */
  scope: "single" | "portfolio"
  /** Number of projects */
  projectCount: number
  /** Scope description */
  description: string
  /** Project names */
  projects: string[]
  /** Project ID */
  projectId: string
  /** Total activities */
  totalActivities: number
  /** Critical path duration */
  criticalPathDuration: number
  /** Schedule health score */
  scheduleHealth: number
  /** Current variance in days */
  currentVariance: number
  /** Upcoming milestones */
  upcomingMilestones: number
}

/**
 * Project context type
 */
export interface ProjectContextType {
  /** Current project data */
  project: ProjectData | null
  /** Project metrics */
  metrics: ProjectMetrics | null
  /** User permissions */
  permissions: ProjectPermissions
  /** Stage configuration */
  stageConfig: StageConfig | null
  /** Project insights */
  insights: ProjectInsight[]
  /** Recent activity */
  activity: ActivityItem[]
  /** Loading state */
  loading: boolean
  /** Error state */
  error: string | null
  /** Refresh project data */
  refresh: () => Promise<void>
}

/**
 * Project hook return type
 */
export interface UseProjectReturn {
  /** Project data */
  project: ProjectData | null
  /** Project metrics */
  metrics: ProjectMetrics | null
  /** Loading state */
  loading: boolean
  /** Error state */
  error: string | null
  /** Refresh function */
  refresh: () => Promise<void>
  /** Update project data */
  updateProject: (updates: Partial<ProjectData>) => Promise<void>
}

/**
 * Project permissions hook return type
 */
export interface UseProjectPermissionsReturn {
  /** Current permissions */
  permissions: ProjectPermissions
  /** Check if user can access tool */
  canAccessTool: (tool: string) => boolean
  /** Check if user can perform action */
  canPerformAction: (action: string) => boolean
  /** Check if user has stage access */
  hasStageAccess: (stage: ProjectStage) => boolean
  /** Get user-specific tools */
  getAvailableTools: () => string[]
}

/**
 * Project metrics hook return type
 */
export interface UseProjectMetricsReturn {
  /** Current metrics */
  metrics: ProjectMetrics | null
  /** KPI widgets for current context */
  kpiWidgets: KPIWidget[]
  /** Financial summary */
  financialSummary: FinancialSummary
  /** Schedule summary */
  scheduleSummary: ScheduleSummary
  /** Calculate metric */
  calculateMetric: (metric: string, data?: any) => number
  /** Format metric value */
  formatMetric: (value: number, type: string) => string
}

/**
 * Project stage hook return type
 */
export interface UseProjectStageReturn {
  /** Current stage */
  currentStage: ProjectStage | null
  /** Stage configuration */
  stageConfig: StageConfig | null
  /** Available stages for transition */
  availableStages: ProjectStage[]
  /** Check if stage transition is valid */
  isValidTransition: (toStage: ProjectStage) => boolean
  /** Transition to new stage */
  transitionStage: (toStage: ProjectStage) => Promise<void>
  /** Get stage permissions */
  getStagePermissions: (stage: ProjectStage) => string[]
}

/**
 * Export configuration for modularity
 */
export interface ProjectModuleConfig {
  /** Module name */
  name: string
  /** Component to render */
  component: React.ComponentType<any>
  /** Required props */
  requiredProps: string[]
  /** Optional props */
  optionalProps?: string[]
  /** Dependencies */
  dependencies: string[]
  /** Lazy loading */
  lazy?: boolean
}

export default ProjectData
