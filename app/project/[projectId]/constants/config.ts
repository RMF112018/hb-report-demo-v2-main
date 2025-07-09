/**
 * @fileoverview Project page configuration constants
 * @module ProjectConfig
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Centralized configuration for tools, categories, core tabs,
 * and other system-wide constants used in the project page.
 *
 * @example
 * ```typescript
 * import { TOOLS_CONFIG, CATEGORIES_CONFIG } from './config'
 *
 * const financialTools = TOOLS_CONFIG.filter(tool =>
 *   tool.category === 'Financial Management'
 * )
 * ```
 */

import { ToolConfig, CategoryConfig, CoreTabConfig, ProjectStage, UserRole, StageConfig } from "../types/navigation"
import {
  Building2,
  DollarSign,
  Calendar,
  FileText,
  Users,
  Settings,
  BarChart3,
  Wrench,
  Shield,
  Package,
  ClipboardList,
  Activity,
  Database,
  Search,
  Target,
  AlertTriangle,
  CheckSquare,
  History,
  PieChart,
  TrendingUp,
} from "lucide-react"

/**
 * Tool configurations
 * Defines all available tools with their properties and permissions
 */
export const TOOLS_CONFIG: ToolConfig[] = [
  // Financial Management Tools
  {
    name: "Financial Hub",
    href: "/dashboard/financial-hub",
    category: "Financial Management",
    description: "Comprehensive financial management and analysis suite",
    visibleRoles: ["executive", "project-executive", "project-manager", "admin"],
    icon: DollarSign,
  },
  {
    name: "Procurement",
    href: "/dashboard/procurement",
    category: "Financial Management",
    description: "Subcontractor buyout and material procurement management",
    visibleRoles: ["executive", "project-executive", "project-manager", "admin"],
    icon: Package,
  },

  // Field Management Tools
  {
    name: "Scheduler",
    href: "/dashboard/scheduler",
    category: "Field Management",
    description: "AI-powered project schedule generation and optimization",
    visibleRoles: ["executive", "project-executive", "project-manager", "admin"],
    icon: Calendar,
  },
  {
    name: "Constraints Log",
    href: "/dashboard/constraints-log",
    category: "Field Management",
    description: "Track and manage project constraints and resolutions",
    visibleRoles: ["executive", "project-executive", "project-manager", "admin"],
    icon: AlertTriangle,
  },
  {
    name: "Permit Log",
    href: "/dashboard/permit-log",
    category: "Field Management",
    description: "Permit tracking and compliance",
    visibleRoles: ["executive", "project-executive", "project-manager", "admin"],
    icon: Shield,
  },
  {
    name: "Field Reports",
    href: "/dashboard/field-reports",
    category: "Field Management",
    description: "Daily logs, manpower, safety, and quality reporting",
    visibleRoles: ["executive", "project-executive", "project-manager", "admin"],
    icon: ClipboardList,
  },

  // Compliance Tools
  {
    name: "Contract Documents",
    href: "/dashboard/contract-documents",
    category: "Compliance",
    description: "Contract document management and compliance tracking",
    visibleRoles: ["executive", "project-executive", "project-manager", "admin"],
    icon: FileText,
  },
  {
    name: "Trade Partners Database",
    href: "/dashboard/trade-partners",
    category: "Compliance",
    description: "Comprehensive subcontractor and vendor management system",
    visibleRoles: ["executive", "project-executive", "project-manager", "admin"],
    icon: Users,
  },

  // Pre-Construction Tools
  {
    name: "Pre-Construction Dashboard",
    href: "/pre-con",
    category: "Pre-Construction",
    description: "Pre-construction command center and pipeline overview",
    visibleRoles: ["executive", "project-executive", "estimator", "admin"],
    icon: Building2,
  },
  {
    name: "Business Development",
    href: "/pre-con#business-dev",
    category: "Pre-Construction",
    description: "Lead generation and pursuit management",
    visibleRoles: ["executive", "project-executive", "estimator", "admin"],
    icon: TrendingUp,
  },
  {
    name: "Estimating",
    href: "/estimating",
    category: "Pre-Construction",
    description: "Cost estimation and analysis tools",
    visibleRoles: ["executive", "project-executive", "estimator", "admin"],
    icon: BarChart3,
  },
  {
    name: "Innovation & Digital Services",
    href: "/tools/coming-soon",
    category: "Pre-Construction",
    description: "BIM, VDC, and digital construction technologies",
    visibleRoles: ["executive", "project-executive", "estimator", "admin"],
    icon: Wrench,
  },

  // Warranty Tools
  {
    name: "Warranty Management",
    href: "/tools/coming-soon",
    category: "Warranty",
    description: "Warranty management and tracking tools",
    visibleRoles: ["executive", "project-executive", "project-manager", "admin"],
    icon: Settings,
  },

  // Historical Projects Tools
  {
    name: "Archive",
    href: "/tools/coming-soon",
    category: "Historical Projects",
    description: "Access completed project archives and historical data",
    visibleRoles: ["executive", "project-executive", "project-manager", "admin"],
    icon: Database,
  },
]

/**
 * Category configurations
 * Defines all available categories with their properties
 */
export const CATEGORIES_CONFIG: CategoryConfig[] = [
  {
    name: "overview",
    label: "Overview",
    color: "bg-gray-500",
    icon: "📊",
    tools: [],
  },
  {
    name: "Pre-Construction",
    color: "bg-indigo-500",
    icon: "📐",
    tools: TOOLS_CONFIG.filter((tool) => tool.category === "Pre-Construction"),
  },
  {
    name: "Financial Management",
    color: "bg-green-500",
    icon: "💰",
    tools: TOOLS_CONFIG.filter((tool) => tool.category === "Financial Management"),
  },
  {
    name: "Field Management",
    color: "bg-orange-500",
    icon: "🏗️",
    tools: TOOLS_CONFIG.filter((tool) => tool.category === "Field Management"),
  },
  {
    name: "Compliance",
    color: "bg-purple-500",
    icon: "📋",
    tools: TOOLS_CONFIG.filter((tool) => tool.category === "Compliance"),
  },
  {
    name: "Warranty",
    color: "bg-amber-500",
    icon: "🛡️",
    tools: TOOLS_CONFIG.filter((tool) => tool.category === "Warranty"),
  },
  {
    name: "Historical Projects",
    color: "bg-slate-500",
    icon: "📚",
    tools: TOOLS_CONFIG.filter((tool) => tool.category === "Historical Projects"),
  },
]

/**
 * Core tabs configuration
 * Defines the base functionality tabs
 */
export const CORE_TABS_CONFIG: CoreTabConfig[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Project overview and analytics",
    icon: BarChart3,
  },
  {
    id: "checklists",
    label: "Checklists",
    description: "Project startup and closeout checklists",
    icon: CheckSquare,
  },
  {
    id: "productivity",
    label: "Productivity",
    description: "Threaded messaging and task management",
    icon: Activity,
  },
  {
    id: "staffing",
    label: "Staffing",
    description: "Resource planning and scheduling",
    icon: Calendar,
  },
  {
    id: "responsibility-matrix",
    label: "Responsibility Matrix",
    description: "Role assignments and accountability",
    icon: Users,
  },
  {
    id: "reports",
    label: "Reports",
    description: "Comprehensive reporting dashboard with approval workflows",
    icon: FileText,
  },
]

/**
 * Sub-tool configurations for each tool
 */
export const SUB_TOOLS_CONFIG: Record<
  string,
  Array<{ id: string; label: string; icon: string; description?: string }>
> = {
  "Financial Hub": [
    { id: "overview", label: "Overview", icon: "📊", description: "Financial dashboard overview" },
    { id: "budget-analysis", label: "Budget Analysis", icon: "📈", description: "Detailed budget tracking" },
    { id: "jchr", label: "JCHR", icon: "📋", description: "Job Cost History Report" },
    { id: "ar-aging", label: "AR Aging", icon: "💳", description: "Accounts receivable analysis" },
    { id: "cash-flow", label: "Cash Flow", icon: "💰", description: "Cash flow management" },
    { id: "forecasting", label: "Forecasting", icon: "🔮", description: "Financial forecasting" },
    { id: "change-management", label: "Change Management", icon: "🔄", description: "Change order tracking" },
    { id: "pay-authorization", label: "Pay Authorization", icon: "✅", description: "Payment authorization" },
    { id: "pay-application", label: "Pay Application", icon: "📄", description: "AIA G702/G703 applications" },
    { id: "retention", label: "Retention", icon: "🔒", description: "Retention management" },
  ],
  Scheduler: [
    { id: "overview", label: "Overview", icon: "📅", description: "Schedule overview" },
    { id: "schedule-monitor", label: "Schedule Monitor", icon: "🖥️", description: "Schedule monitoring" },
    { id: "health-analysis", label: "Health Analysis", icon: "🏥", description: "Schedule health analysis" },
    { id: "look-ahead", label: "Look Ahead", icon: "👁️", description: "Forward looking schedule" },
    { id: "generator", label: "Generator", icon: "⚡", description: "Schedule generation" },
  ],
  Procurement: [
    { id: "overview", label: "Overview", icon: "📦", description: "Procurement overview" },
    { id: "buyout", label: "Buyout", icon: "💼", description: "Subcontractor buyout" },
    { id: "analytics", label: "Analytics", icon: "📊", description: "Procurement analytics" },
    { id: "integration", label: "Integration", icon: "🔗", description: "System integrations" },
  ],
  "Constraints Log": [
    { id: "log", label: "Log", icon: "📝", description: "Constraints log" },
    { id: "timeline", label: "Timeline", icon: "⏱️", description: "Constraints timeline" },
    { id: "analytics", label: "Analytics", icon: "📈", description: "Constraints analytics" },
  ],
  "Permit Log": [
    { id: "log", label: "Log", icon: "📋", description: "Permits log" },
    { id: "calendar", label: "Calendar", icon: "📅", description: "Permit calendar" },
    { id: "analytics", label: "Analytics", icon: "📊", description: "Permit analytics" },
  ],
  "Field Reports": [
    { id: "overview", label: "Overview", icon: "📊", description: "Field reports overview" },
    { id: "daily-logs", label: "Daily Logs", icon: "📝", description: "Daily activity logs" },
    { id: "safety", label: "Safety", icon: "🦺", description: "Safety reports" },
    { id: "quality", label: "Quality", icon: "✅", description: "Quality control" },
  ],
  Checklists: [
    { id: "startup", label: "Start-Up", icon: "🚀", description: "Project startup checklist" },
    { id: "closeout", label: "Closeout", icon: "🏁", description: "Project closeout checklist" },
  ],
  "Field Management": [
    {
      id: "scheduler",
      label: "Scheduler",
      icon: "📅",
      description: "AI-powered project schedule generation and optimization",
    },
    {
      id: "constraints-log",
      label: "Constraints Log",
      icon: "⚠️",
      description: "Track and manage project constraints and resolutions",
    },
    { id: "permit-log", label: "Permit Log", icon: "🛡️", description: "Permit tracking and compliance" },
    {
      id: "field-reports",
      label: "Field Reports",
      icon: "📋",
      description: "Daily logs, manpower, safety, and quality reporting",
    },
  ],
}

/**
 * Role-based category visibility
 */
export const ROLE_CATEGORY_ACCESS: Record<UserRole, string[]> = {
  executive: [
    "Pre-Construction",
    "Financial Management",
    "Field Management",
    "Compliance",
    "Warranty",
    "Historical Projects",
  ],
  "project-executive": [
    "Pre-Construction",
    "Financial Management",
    "Field Management",
    "Compliance",
    "Warranty",
    "Historical Projects",
  ],
  admin: [
    "Pre-Construction",
    "Financial Management",
    "Field Management",
    "Compliance",
    "Warranty",
    "Historical Projects",
  ],
  "project-manager": ["Financial Management", "Field Management", "Compliance", "Warranty"],
  estimator: ["Pre-Construction", "Compliance"],
  superintendent: ["Field Management", "Compliance"],
  "team-member": ["Field Management", "Compliance"],
  viewer: ["Field Management"],
}

/**
 * Stage configurations
 */
export const STAGE_CONFIGS: Record<ProjectStage, StageConfig> = {
  "BIM Coordination": {
    stageName: "BIM Coordination",
    stageColor: "bg-blue-500",
    availableTools: ["Pre-Construction Dashboard", "Innovation & Digital Services"],
    requiredPermissions: ["view-bim", "edit-models"],
    features: {
      showFinancials: false,
      showScheduler: true,
      showFieldReports: false,
      showPermits: false,
      showConstraints: true,
    },
  },
  Bidding: {
    stageName: "Bidding",
    stageColor: "bg-purple-500",
    availableTools: ["Pre-Construction Dashboard", "Estimating", "Business Development"],
    requiredPermissions: ["view-estimates", "create-bids"],
    features: {
      showFinancials: true,
      showScheduler: true,
      showFieldReports: false,
      showPermits: false,
      showConstraints: true,
    },
  },
  "Pre-Construction": {
    stageName: "Pre-Construction",
    stageColor: "bg-indigo-500",
    availableTools: ["Pre-Construction Dashboard", "Estimating", "Financial Hub", "Scheduler"],
    requiredPermissions: ["view-estimates", "manage-contracts"],
    features: {
      showFinancials: true,
      showScheduler: true,
      showFieldReports: false,
      showPermits: true,
      showConstraints: true,
    },
  },
  Construction: {
    stageName: "Construction",
    stageColor: "bg-orange-500",
    availableTools: ["Financial Hub", "Procurement", "Scheduler", "Constraints Log", "Permit Log", "Field Reports"],
    requiredPermissions: ["view-all", "edit-field-data"],
    features: {
      showFinancials: true,
      showScheduler: true,
      showFieldReports: true,
      showPermits: true,
      showConstraints: true,
    },
  },
  Closeout: {
    stageName: "Closeout",
    stageColor: "bg-green-500",
    availableTools: ["Financial Hub", "Contract Documents", "Warranty Management"],
    requiredPermissions: ["view-all", "manage-closeout"],
    features: {
      showFinancials: true,
      showScheduler: false,
      showFieldReports: true,
      showPermits: false,
      showConstraints: false,
    },
  },
  Warranty: {
    stageName: "Warranty",
    stageColor: "bg-amber-500",
    availableTools: ["Warranty Management", "Contract Documents"],
    requiredPermissions: ["view-warranty", "manage-warranty"],
    features: {
      showFinancials: false,
      showScheduler: false,
      showFieldReports: false,
      showPermits: false,
      showConstraints: false,
    },
  },
  Closed: {
    stageName: "Closed",
    stageColor: "bg-gray-500",
    availableTools: ["Archive", "Contract Documents"],
    requiredPermissions: ["view-archive"],
    features: {
      showFinancials: false,
      showScheduler: false,
      showFieldReports: false,
      showPermits: false,
      showConstraints: false,
    },
  },
}

/**
 * Navigation animation settings
 */
export const ANIMATION_CONFIG = {
  /** Default transition duration in milliseconds */
  TRANSITION_DURATION: 300,
  /** Exploration delay before committing */
  EXPLORATION_DELAY: 150,
  /** Animation easing function */
  EASING: "cubic-bezier(0.4, 0, 0.2, 1)",
  /** Whether animations are enabled by default */
  ENABLED: true,
  /** Reduced motion settings */
  RESPECT_REDUCED_MOTION: true,
}

/**
 * Performance configuration
 */
export const PERFORMANCE_CONFIG = {
  /** Lazy loading threshold */
  LAZY_LOAD_THRESHOLD: "200px",
  /** Debounce delay for search */
  SEARCH_DEBOUNCE: 300,
  /** Cache expiration time */
  CACHE_EXPIRATION: 5 * 60 * 1000, // 5 minutes
  /** Maximum cached items */
  MAX_CACHE_SIZE: 100,
}

/**
 * Default navigation configuration
 */
export const DEFAULT_NAVIGATION = {
  category: null,
  tool: null,
  subTool: null,
  coreTab: null,
}

/**
 * System configuration
 */
export const SYSTEM_CONFIG = {
  /** Current version */
  VERSION: "2.2.0",
  /** Build environment */
  ENVIRONMENT: process.env.NODE_ENV || "development",
  /** Debug mode */
  DEBUG: process.env.NODE_ENV === "development",
  /** Feature flags */
  FEATURES: {
    ENABLE_ANALYTICS: true,
    ENABLE_DEEP_LINKING: true,
    ENABLE_CACHING: true,
    ENABLE_ANIMATIONS: true,
  },
}

export default {
  TOOLS_CONFIG,
  CATEGORIES_CONFIG,
  CORE_TABS_CONFIG,
  SUB_TOOLS_CONFIG,
  ROLE_CATEGORY_ACCESS,
  STAGE_CONFIGS,
  ANIMATION_CONFIG,
  PERFORMANCE_CONFIG,
  DEFAULT_NAVIGATION,
  SYSTEM_CONFIG,
}
