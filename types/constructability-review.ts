/**
 * @fileoverview Constructability Review System Types
 * @module ConstructabilityReviewTypes
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-26
 *
 * Comprehensive TypeScript types and interfaces for the constructability review system
 * including reviews, templates, scoring, issues, and workflow management.
 */

// Base types
export type ReviewStatus = "pending" | "in-progress" | "completed" | "cancelled" | "on-hold"
export type ReviewPriority = "low" | "medium" | "high" | "urgent"
export type IssueSeverity = "low" | "medium" | "high" | "critical"
export type ProjectStage =
  | "Schematic Design"
  | "Design Development"
  | "Construction Documents"
  | "Pre-Construction"
  | "Construction"
  | "Post-Construction"
export type ReviewType =
  | "Initial Review"
  | "Progress Review"
  | "Final Review"
  | "Change Order Review"
  | "Value Engineering Review"
  | "Constructability Review"

// Scoring system
export interface ScoringCriteria {
  designFeasibility: {
    weight: number
    description: string
    maxScore: number
  }
  coordinationClarity: {
    weight: number
    description: string
    maxScore: number
  }
  codeCompliance: {
    weight: number
    description: string
    maxScore: number
  }
  costScheduleImpact: {
    weight: number
    description: string
    maxScore: number
  }
  constructabilityRisk: {
    weight: number
    description: string
    maxScore: number
  }
  bimReviewQuality: {
    weight: number
    description: string
    maxScore: number
  }
}

export interface ReviewScoring {
  designFeasibility: number
  coordinationClarity: number
  codeCompliance: number
  costScheduleImpact: number
  constructabilityRisk: number
  bimReviewQuality: number
}

export interface ScoreBreakdown {
  category: keyof ReviewScoring
  score: number
  maxScore: number
  weight: number
  weightedScore: number
  comments?: string
}

// Issues and recommendations
export interface ReviewIssue {
  id: string
  description: string
  severity: IssueSeverity
  category: string
  location: string
  recommendation: string
  assignedTo?: string
  dueDate?: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: ReviewPriority
  tags: string[]
  attachments: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
  estimatedCost?: number
  estimatedDuration?: number
  riskLevel?: number
  impact?: "low" | "medium" | "high"
}

export interface ReviewRecommendation {
  id: string
  description: string
  category: string
  priority: ReviewPriority
  implementationCost?: number
  implementationTime?: number
  expectedBenefit: string
  status: "pending" | "accepted" | "rejected" | "implemented"
  assignedTo?: string
  dueDate?: string
  tags: string[]
  relatedIssues: string[]
  createdAt: string
  updatedAt: string
}

// Attachments and files
export interface ReviewAttachment {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  filePath: string
  uploadedAt: string
  uploadedBy: string
  description?: string
  tags: string[]
  isPublic: boolean
  version: number
}

// Quality checklist
export interface QualityChecklistItem {
  id: string
  item: string
  description?: string
  category: string
  required: boolean
  checked: boolean
  checkedBy?: string
  checkedAt?: string
  comments?: string
  weight?: number
}

// Review template
export interface ReviewTemplate {
  id: string
  name: string
  description: string
  version: string
  projectStage: ProjectStage
  reviewType: ReviewType
  scoringCriteria: ScoringCriteria
  requiredFields: string[]
  estimatedDuration: number
  qualityChecklist: QualityChecklistItem[]
  instructions: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  lastUsedAt?: string
  usageCount: number
}

// Review workflow
export interface ReviewWorkflow {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface WorkflowStep {
  id: string
  name: string
  description: string
  order: number
  assignedRole: string
  estimatedDuration: number
  requiredActions: string[]
  isRequired: boolean
  canSkip: boolean
  dependencies: string[]
  notifications: NotificationConfig[]
}

export interface NotificationConfig {
  event: "step_started" | "step_completed" | "deadline_approaching" | "overdue"
  recipients: string[]
  template: string
  delay?: number
}

// Main review interface
export interface ConstructabilityReview {
  id: string
  reviewType: string
  projectId: string
  projectStage: ProjectStage
  templateId?: string

  // Basic information
  reviewerName: string
  reviewerRole: string
  reviewerEmail: string
  reviewDate: string
  estimatedDuration: number
  actualDuration?: number
  priority: ReviewPriority
  status: ReviewStatus

  // Scoring
  scoring: ReviewScoring
  overallScore: number
  scoreBreakdown: ScoreBreakdown[]

  // Content
  reviewScope: string
  reviewLimitations: string
  reviewObjectives: string[]
  comments: string
  executiveSummary?: string

  // Issues and recommendations
  issuesIdentified: ReviewIssue[]
  recommendations: ReviewRecommendation[]

  // Attachments and files
  attachments: ReviewAttachment[]

  // Quality checklist
  qualityChecklist: QualityChecklistItem[]

  // Follow-up and workflow
  requiresFollowUp: boolean
  followUpDate?: string
  followUpReviewId?: string
  workflowId?: string
  currentWorkflowStep?: string

  // Notifications
  notifyStakeholders: boolean
  stakeholderEmails: string[]

  // Metadata
  tags: string[]
  version: number
  isPublic: boolean
  isDraft: boolean

  // Timestamps
  createdAt: string
  updatedAt: string
  completedAt?: string
  submittedAt?: string

  // Audit trail
  createdBy: string
  lastModifiedBy: string
  reviewHistory: ReviewHistoryEntry[]

  // Performance metrics
  performanceMetrics?: ReviewPerformanceMetrics
}

// Review history and audit
export interface ReviewHistoryEntry {
  id: string
  action: "created" | "updated" | "submitted" | "approved" | "rejected" | "commented" | "status_changed"
  timestamp: string
  userId: string
  userName: string
  description: string
  changes?: { [key: string]: { from: any; to: any } }
  metadata?: { [key: string]: any }
}

// Performance metrics
export interface ReviewPerformanceMetrics {
  completionTime: number
  issuesResolved: number
  recommendationsImplemented: number
  costSavings?: number
  scheduleSavings?: number
  qualityScore: number
  stakeholderSatisfaction?: number
  reworkReduction?: number
}

// Analytics and reporting
export interface ReviewAnalytics {
  totalReviews: number
  averageScore: number
  completionRate: number
  averageCompletionTime: number
  issuesPerReview: number
  recommendationsPerReview: number
  scoreDistribution: { [key: string]: number }
  trendData: ReviewTrendData[]
  performanceByStage: { [key: string]: ReviewPerformanceMetrics }
  performanceByReviewer: { [key: string]: ReviewPerformanceMetrics }
}

export interface ReviewTrendData {
  date: string
  averageScore: number
  reviewCount: number
  issueCount: number
  resolutionRate: number
}

// Export and import
export interface ReviewExportConfig {
  format: "pdf" | "excel" | "word" | "json" | "csv"
  includeAttachments: boolean
  includeImages: boolean
  includeScoring: boolean
  includeIssues: boolean
  includeRecommendations: boolean
  includeHistory: boolean
  dateRange?: {
    start: string
    end: string
  }
  filters?: ReviewFilters
}

export interface ReviewFilters {
  status?: ReviewStatus[]
  priority?: ReviewPriority[]
  projectStage?: ProjectStage[]
  reviewType?: ReviewType[]
  reviewerName?: string[]
  scoreRange?: {
    min: number
    max: number
  }
  dateRange?: {
    start: string
    end: string
  }
  tags?: string[]
  hasIssues?: boolean
  hasRecommendations?: boolean
}

// Search and pagination
export interface ReviewSearchParams {
  query?: string
  filters?: ReviewFilters
  sortBy?: keyof ConstructabilityReview
  sortOrder?: "asc" | "desc"
  page?: number
  pageSize?: number
}

export interface ReviewSearchResult {
  reviews: ConstructabilityReview[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// Form and validation
export interface ReviewFormData {
  // Basic Information
  reviewType: string
  projectStage: ProjectStage
  reviewerName: string
  reviewerRole: string
  reviewerEmail: string
  reviewDate: string
  estimatedDuration: number
  priority: ReviewPriority
  tags: string[]

  // Scoring
  scoring: ReviewScoring

  // Content
  reviewScope: string
  reviewLimitations: string
  reviewObjectives: string[]
  comments: string
  executiveSummary?: string

  // Issues and recommendations
  issuesIdentified: Omit<ReviewIssue, "id" | "createdAt" | "updatedAt" | "createdBy">[]
  recommendations: Omit<ReviewRecommendation, "id" | "createdAt" | "updatedAt">[]

  // Attachments
  attachments: File[]

  // Quality checklist
  qualityChecklist: QualityChecklistItem[]

  // Follow-up
  requiresFollowUp: boolean
  followUpDate?: string

  // Notifications
  notifyStakeholders: boolean
  stakeholderEmails: string[]

  // Settings
  isPublic: boolean
  isDraft: boolean
}

export interface ReviewFormErrors {
  [key: string]: string
}

export interface ReviewValidationRule {
  field: string
  required: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  customValidator?: (value: any) => string | null
}

// API types
export interface CreateReviewRequest {
  formData: ReviewFormData
  templateId?: string
  workflowId?: string
}

export interface UpdateReviewRequest {
  id: string
  formData: Partial<ReviewFormData>
  version: number
}

export interface ReviewResponse {
  review: ConstructabilityReview
  message: string
  success: boolean
}

export interface ReviewListResponse {
  reviews: ConstructabilityReview[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  message: string
  success: boolean
}

// Dashboard and metrics
export interface ReviewDashboardData {
  summary: {
    totalReviews: number
    averageScore: number
    completionRate: number
    pendingReviews: number
    overdueReviews: number
  }
  recentReviews: ConstructabilityReview[]
  analytics: ReviewAnalytics
  trends: ReviewTrendData[]
  alerts: ReviewAlert[]
}

export interface ReviewAlert {
  id: string
  type: "overdue" | "low_score" | "high_issues" | "missing_followup"
  title: string
  message: string
  severity: "info" | "warning" | "error"
  reviewId: string
  createdAt: string
  acknowledged: boolean
}

// Component props
export interface ReviewComponentProps {
  projectId: string
  projectData: any
  userRole: string
  user: any
  review?: ConstructabilityReview
  template?: ReviewTemplate
  onSave?: (review: ConstructabilityReview) => void
  onSubmit?: (review: ConstructabilityReview) => void
  onCancel?: () => void
  onDelete?: (reviewId: string) => void
  readOnly?: boolean
  showActions?: boolean
  className?: string
}

// Context types
export interface ReviewContextValue {
  reviews: ConstructabilityReview[]
  currentReview: ConstructabilityReview | null
  templates: ReviewTemplate[]
  analytics: ReviewAnalytics | null
  loading: boolean
  error: string | null

  // Actions
  createReview: (data: CreateReviewRequest) => Promise<ConstructabilityReview>
  updateReview: (data: UpdateReviewRequest) => Promise<ConstructabilityReview>
  deleteReview: (id: string) => Promise<void>
  loadReview: (id: string) => Promise<ConstructabilityReview>
  loadReviews: (params: ReviewSearchParams) => Promise<ReviewSearchResult>
  exportReview: (id: string, config: ReviewExportConfig) => Promise<Blob>

  // Filters and search
  setFilters: (filters: ReviewFilters) => void
  setSearchQuery: (query: string) => void
  resetFilters: () => void
}

// Utility types
export type ReviewField = keyof ConstructabilityReview
export type ScoringField = keyof ReviewScoring
export type ReviewStatusTransition = {
  from: ReviewStatus
  to: ReviewStatus
  allowedRoles: string[]
  requiresApproval: boolean
}

// Configuration types
export interface ReviewSystemConfig {
  maxFileSize: number
  allowedFileTypes: string[]
  maxAttachments: number
  scoringScale: {
    min: number
    max: number
    step: number
  }
  defaultDuration: number
  reminderDays: number
  autoArchiveDays: number
  enableWorkflows: boolean
  enableNotifications: boolean
  enableAnalytics: boolean
}

// Integration types
export interface BIMIntegration {
  modelId: string
  viewId: string
  elementIds: string[]
  clashResults?: ClashResult[]
  lastSync: string
}

export interface ClashResult {
  id: string
  type: "hard" | "soft" | "clearance"
  severity: IssueSeverity
  description: string
  elementA: string
  elementB: string
  location: {
    x: number
    y: number
    z: number
  }
  status: "open" | "resolved" | "ignored"
}

// Notification types
export interface ReviewNotification {
  id: string
  type: "review_created" | "review_updated" | "review_submitted" | "review_overdue" | "issue_assigned"
  title: string
  message: string
  reviewId: string
  recipientId: string
  sent: boolean
  sentAt?: string
  read: boolean
  readAt?: string
  createdAt: string
}

// Audit and compliance
export interface ReviewAuditLog {
  id: string
  reviewId: string
  action: string
  userId: string
  userName: string
  timestamp: string
  ipAddress: string
  userAgent: string
  details: any
  success: boolean
  error?: string
}

export interface ComplianceReport {
  id: string
  reviewId: string
  generatedAt: string
  generatedBy: string
  standards: string[]
  complianceScore: number
  violations: ComplianceViolation[]
  recommendations: string[]
  approvedBy?: string
  approvedAt?: string
}

export interface ComplianceViolation {
  id: string
  standard: string
  section: string
  severity: IssueSeverity
  description: string
  recommendation: string
  resolved: boolean
  resolvedAt?: string
  resolvedBy?: string
}

// Error types
export interface ReviewError {
  code: string
  message: string
  details?: any
  field?: string
  timestamp: string
}

// Success types
export interface ReviewSuccess {
  message: string
  data?: any
  timestamp: string
}

// Default values and constants
export const DEFAULT_SCORING: ReviewScoring = {
  designFeasibility: 0,
  coordinationClarity: 0,
  codeCompliance: 0,
  costScheduleImpact: 0,
  constructabilityRisk: 0,
  bimReviewQuality: 0,
}

export const DEFAULT_SCORING_CRITERIA: ScoringCriteria = {
  designFeasibility: {
    weight: 25,
    description: "Feasibility and practicality of the design approach",
    maxScore: 10,
  },
  coordinationClarity: {
    weight: 20,
    description: "Clarity of design coordination and integration",
    maxScore: 10,
  },
  codeCompliance: {
    weight: 15,
    description: "Compliance with building codes and regulations",
    maxScore: 10,
  },
  costScheduleImpact: {
    weight: 20,
    description: "Impact on project cost and schedule",
    maxScore: 10,
  },
  constructabilityRisk: {
    weight: 15,
    description: "Risk assessment for construction execution",
    maxScore: 10,
  },
  bimReviewQuality: {
    weight: 5,
    description: "Quality of BIM model and documentation",
    maxScore: 10,
  },
}

export const REVIEW_STATUS_TRANSITIONS: ReviewStatusTransition[] = [
  { from: "pending", to: "in-progress", allowedRoles: ["reviewer", "manager"], requiresApproval: false },
  { from: "in-progress", to: "completed", allowedRoles: ["reviewer"], requiresApproval: false },
  { from: "completed", to: "in-progress", allowedRoles: ["manager"], requiresApproval: true },
  { from: "in-progress", to: "on-hold", allowedRoles: ["reviewer", "manager"], requiresApproval: false },
  { from: "on-hold", to: "in-progress", allowedRoles: ["reviewer", "manager"], requiresApproval: false },
  { from: "pending", to: "cancelled", allowedRoles: ["manager"], requiresApproval: false },
  { from: "in-progress", to: "cancelled", allowedRoles: ["manager"], requiresApproval: true },
]

export const DEFAULT_REVIEW_CONFIG: ReviewSystemConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".jpg", ".jpeg", ".png", ".gif", ".dwg", ".rvt"],
  maxAttachments: 20,
  scoringScale: {
    min: 0,
    max: 10,
    step: 0.5,
  },
  defaultDuration: 8,
  reminderDays: 3,
  autoArchiveDays: 365,
  enableWorkflows: true,
  enableNotifications: true,
  enableAnalytics: true,
}

// Type guards
export function isValidReviewStatus(status: string): status is ReviewStatus {
  return ["pending", "in-progress", "completed", "cancelled", "on-hold"].includes(status)
}

export function isValidReviewPriority(priority: string): priority is ReviewPriority {
  return ["low", "medium", "high", "urgent"].includes(priority)
}

export function isValidIssueSeverity(severity: string): severity is IssueSeverity {
  return ["low", "medium", "high", "critical"].includes(severity)
}

export function isValidProjectStage(stage: string): stage is ProjectStage {
  return [
    "Schematic Design",
    "Design Development",
    "Construction Documents",
    "Pre-Construction",
    "Construction",
    "Post-Construction",
  ].includes(stage)
}

// Utility functions
export function calculateOverallScore(scoring: ReviewScoring, criteria: ScoringCriteria): number {
  const totalWeightedScore = Object.entries(scoring).reduce((sum, [key, score]) => {
    const criterion = criteria[key as keyof ScoringCriteria]
    return sum + (score * criterion.weight) / 100
  }, 0)

  return Math.round(totalWeightedScore * 10) / 10
}

export function getScoreBreakdown(scoring: ReviewScoring, criteria: ScoringCriteria): ScoreBreakdown[] {
  return Object.entries(scoring).map(([key, score]) => {
    const criterion = criteria[key as keyof ScoringCriteria]
    return {
      category: key as keyof ReviewScoring,
      score,
      maxScore: criterion.maxScore,
      weight: criterion.weight,
      weightedScore: (score * criterion.weight) / 100,
    }
  })
}

export function validateReviewForm(formData: ReviewFormData, rules: ReviewValidationRule[]): ReviewFormErrors {
  const errors: ReviewFormErrors = {}

  rules.forEach((rule) => {
    const value = formData[rule.field as keyof ReviewFormData]

    if (rule.required && (!value || (typeof value === "string" && value.trim() === ""))) {
      errors[rule.field] = `${rule.field} is required`
      return
    }

    if (rule.minLength && typeof value === "string" && value.length < rule.minLength) {
      errors[rule.field] = `${rule.field} must be at least ${rule.minLength} characters`
      return
    }

    if (rule.maxLength && typeof value === "string" && value.length > rule.maxLength) {
      errors[rule.field] = `${rule.field} must be no more than ${rule.maxLength} characters`
      return
    }

    if (rule.pattern && typeof value === "string" && !rule.pattern.test(value)) {
      errors[rule.field] = `${rule.field} format is invalid`
      return
    }

    if (rule.customValidator) {
      const customError = rule.customValidator(value)
      if (customError) {
        errors[rule.field] = customError
      }
    }
  })

  return errors
}

export function getReviewStatusColor(status: ReviewStatus): string {
  switch (status) {
    case "completed":
      return "text-green-600"
    case "in-progress":
      return "text-blue-600"
    case "pending":
      return "text-yellow-600"
    case "on-hold":
      return "text-orange-600"
    case "cancelled":
      return "text-red-600"
    default:
      return "text-gray-600"
  }
}

export function getScoreColor(score: number): string {
  if (score >= 8.5) return "text-green-600"
  if (score >= 7.0) return "text-yellow-600"
  if (score >= 5.0) return "text-orange-600"
  return "text-red-600"
}

export function getScoreLabel(score: number): string {
  if (score >= 9) return "Excellent"
  if (score >= 8) return "Good"
  if (score >= 6) return "Satisfactory"
  if (score >= 4) return "Needs Improvement"
  return "Poor"
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"]
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

export function generateReviewId(): string {
  return `CR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function generateIssueId(): string {
  return `ISS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function generateRecommendationId(): string {
  return `REC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// All types are already exported above with individual export declarations
