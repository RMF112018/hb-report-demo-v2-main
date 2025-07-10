/**
 * @fileoverview Bid Management Type Definitions
 * @version 3.0.0
 * @description Core TypeScript types for the bid management system
 */

// Core project types for bidding stage
export interface BidProject {
  id: string
  name: string
  display_name: string
  project_number: string
  location: string
  estimated_value: number
  projected_finish_date: string
  project_stage_name: "Bidding"
  status: "active" | "awarded" | "lost" | "withdrawn"
  client: string
  delivery_method: string
  team_lead?: string
  key_dates: {
    bid_due: string
    project_start: string
    project_end: string
  }
  packages: BidPackage[]
  team: TeamMember[]
  created_date: string
  last_modified: string
}

// Bid package management
export interface BidPackage {
  id: string
  projectId: string
  name: string
  scope: string
  description: string
  dueDate: string
  invitedSubs: string[]
  assignedTeam: TeamMember[]
  status: "draft" | "sent" | "responses-due" | "under-review" | "awarded"
  estimatedValue: number
  responses: BidResponse[]
  requirements: string[]
  attachments: BidAttachment[]
  created_date: string
  last_modified: string
}

// Bid response from subcontractors
export interface BidResponse {
  id: string
  packageId: string
  vendorId: string
  vendorName: string
  bidAmount: number
  status: "submitted" | "under-review" | "clarification-needed" | "accepted" | "rejected"
  submissionDate: string
  validUntil: string
  lineItems: BidLineItem[]
  attachments: BidAttachment[]
  notes: string
  evaluationScore?: number
  riskLevel: "low" | "medium" | "high"
}

// Bid line items
export interface BidLineItem {
  id: string
  description: string
  quantity: number
  unit: string
  unitPrice: number
  totalPrice: number
  notes?: string
}

// File attachments
export interface BidAttachment {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedBy: string
  uploadedDate: string
  sharePointPath?: string
}

// Team member assignments
export interface TeamMember {
  id: string
  name: string
  email: string
  role: "Lead Estimator" | "Coordinator" | "Executive Oversight" | "Support" | "Project Manager" | "Estimator"
  phone?: string
  department: string
  avatar?: string
  isActive: boolean
  company?: string
}

// Message system
export interface BidMessage {
  id: string
  threadId: string
  projectId: string
  packageId?: string
  sender: TeamMember
  recipients: TeamMember[]
  subject: string
  content: string
  attachments: BidAttachment[]
  timestamp: string
  isRead: boolean
  priority: "low" | "normal" | "high" | "urgent"
  status?: "sent" | "delivered" | "read" | "failed"
  readBy?: string[]
  reactions?: MessageReaction[]
}

export interface MessageReaction {
  userId: string
  type: "thumbs_up" | "thumbs_down" | "heart" | "laugh" | "wow" | "sad" | "angry"
  timestamp: string
}

export interface BidMessageThread {
  id: string
  projectId: string
  packageId?: string
  subject: string
  participants: TeamMember[]
  messages: BidMessage[]
  lastMessage: string
  lastActivity: string
  isActive: boolean
  messageCount: number
  unreadCount: number
  priority?: "low" | "normal" | "high" | "urgent"
  tags?: string[]
  status?: "active" | "archived" | "pending-response" | "resolved"
}

// Bid forms
export interface BidForm {
  id: string
  packageId: string
  templateId: string
  name: string
  description: string
  fields: BidFormField[]
  status: "draft" | "active" | "completed"
  responses: BidFormResponse[]
  dueDate: string
  created_date: string
}

export interface BidFormField {
  id: string
  name: string
  type: "text" | "number" | "currency" | "date" | "select" | "textarea" | "file"
  label: string
  required: boolean
  options?: string[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export interface BidFormResponse {
  id: string
  formId: string
  vendorId: string
  responses: Record<string, any>
  submissionDate: string
  isComplete: boolean
}

// Reports
export interface BidReport {
  id: string
  type: "invited-vs-responded" | "bid-comparison" | "team-assignment" | "package-summary"
  projectId: string
  packageId?: string
  name: string
  description: string
  parameters: Record<string, any>
  generatedDate: string
  generatedBy: string
  format: "pdf" | "excel" | "csv"
  url?: string
}

// Component props interfaces
export interface BidManagementCenterProps {
  userRole: string
  projectId?: string
  initialProject?: BidProject
  className?: string
  onProjectSelect?: (projectId: string | null) => void
}

export interface BidPackageListProps {
  projectId: string
  packages: BidPackage[]
  selectedPackage?: BidPackage
  onPackageSelect: (pkg: BidPackage) => void
  onPackageCreate: () => void
  onPackageEdit: (pkg: BidPackage) => void
  onPackageDelete: (packageId: string) => void
}

export interface BidMessagePanelProps {
  projectId: string
  packageId?: string
  className?: string
}

export interface BidFileManagerProps {
  projectId: string
  packageId?: string
  allowedTypes?: string[]
  maxFileSize?: number
  className?: string
}

export interface BidFormPanelProps {
  packageId: string
  forms: BidForm[]
  onFormCreate: () => void
  onFormEdit: (form: BidForm) => void
  className?: string
}

export interface BidTeamManagerProps {
  projectId: string
  team: TeamMember[]
  onTeamUpdate: (team: TeamMember[]) => void
  availableMembers: TeamMember[]
  className?: string
}

export interface BidReportsPanelProps {
  projectId: string
  packageId?: string
  reports: BidReport[]
  onReportGenerate: (type: string, params: Record<string, any>) => void
  className?: string
}

export interface BidProjectDetailsProps {
  project: BidProject
  onProjectUpdate: (updates: Partial<BidProject>) => void
  isEditable: boolean
  className?: string
}

export interface BidTabPanelProps {
  packageId: string
  className?: string
}

// Hook return types
export interface UseBidProjectsReturn {
  biddingProjects: BidProject[]
  selectedProject: BidProject | null
  isLoading: boolean
  error: string | null
  createProject: (projectData: Omit<BidProject, "id" | "created_date" | "last_modified">) => Promise<BidProject>
  updateProject: (projectId: string, updates: Partial<BidProject>) => Promise<void>
  deleteProject: (projectId: string) => Promise<void>
  selectProject: (project: BidProject | null) => void
  refetch: () => Promise<void>
  getProjectsByStatus: (status: BidProject["status"]) => BidProject[]
  getProjectsByTeamLead: (teamLead: string) => BidProject[]
  getProjectStats: () => {
    total: number
    active: number
    awarded: number
    lost: number
    withdrawn: number
    totalValue: number
    averageValue: number
  }
}

export interface UseBidPackagesReturn {
  packages: BidPackage[]
  selectedPackage: BidPackage | null
  isLoading: boolean
  error: string | null
  createPackage: (packageData: Omit<BidPackage, "id" | "created_date" | "last_modified">) => Promise<void>
  updatePackage: (packageId: string, updates: Partial<BidPackage>) => Promise<void>
  deletePackage: (packageId: string) => Promise<void>
  selectPackage: (pkg: BidPackage | null) => void
  getPackagesByStatus: (status: BidPackage["status"]) => BidPackage[]
  getPackagesByTeamMember: (teamMemberId: string) => BidPackage[]
  getPackageStats: () => {
    total: number
    draft: number
    sent: number
    responsesDue: number
    underReview: number
    awarded: number
    totalValue: number
    averageValue: number
    totalResponses: number
    averageResponses: number
  }
  getPackagesWithPendingResponses: () => BidPackage[]
  getPackagesDueSoon: () => BidPackage[]
  getOverduePackages: () => BidPackage[]
}

export interface UseBidMessagesReturn {
  messageThreads: BidMessageThread[]
  activeThread: BidMessageThread | null
  isLoading: boolean
  error: string | null
  sendMessage: (threadId: string, content: string, attachments?: BidAttachment[]) => Promise<void>
  markAsRead: (messageId: string) => Promise<void>
  createThread: (subject: string, recipients: TeamMember[], packageId?: string) => Promise<BidMessageThread>
}

// Utility types
export type BidPackageStatus = BidPackage["status"]
export type BidResponseStatus = BidResponse["status"]
export type TeamMemberRole = TeamMember["role"]
export type BidMessagePriority = BidMessage["priority"]
export type BidReportType = BidReport["type"]

// Filter and sort types
export interface BidProjectFilters {
  status?: BidProject["status"][]
  teamLead?: string
  dateRange?: {
    start: string
    end: string
  }
  estimatedValue?: {
    min: number
    max: number
  }
}

export interface BidPackageFilters {
  status?: BidPackageStatus[]
  assignedTeam?: string[]
  dueDate?: {
    start: string
    end: string
  }
  estimatedValue?: {
    min: number
    max: number
  }
}

export type SortField = "name" | "dueDate" | "estimatedValue" | "status" | "created_date"
export type SortDirection = "asc" | "desc"

export interface SortConfig {
  field: SortField
  direction: SortDirection
}
