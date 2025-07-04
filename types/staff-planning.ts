// Centralized type definitions for Staff Planning module
// This prevents type inconsistencies across components

export interface Employee {
  id: string
  name: string
  position: string
  assignment: {
    projectId: string
    role: string
    startDate: string
    endDate: string
  }
  laborRate: number
  billableRate: number
  experience: number
  strengths: string[]
  weaknesses: string[]
}

export interface Project {
  id: string
  name: string
  schedule: {
    startDate: string
    endDate: string
    milestones: string[]
  }
  budget: number
  assignedStaff: string[]
  projectExecutive: string
  status: string
}

export interface SPCR {
  id: string
  projectId: string
  type: "increase" | "decrease"
  position: string
  startDate: string
  endDate: string
  scheduleRef: string
  budget: number
  explanation: string
  status: "draft" | "submitted" | "approved" | "rejected"
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface HBIInsight {
  id: string
  projectId: string
  type: "staffing-need" | "overlap" | "employee-suggestion"
  description: string
  confidence: number
  suggestedEmployees: string[]
}

export interface StaffPlanningData {
  employees: Employee[]
  projects: Project[]
  spcrs: SPCR[]
  insights: HBIInsight[]
}

// User interface for role-based access control
export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "project-executive" | "project-manager" | "staff"
}

// Component prop interfaces
export interface StaffPlanningHubProps {
  staffData: StaffPlanningData
  selectedProject: Project | null
  user: User | null
}

export interface StaffOverviewProps {
  staffData: StaffPlanningData
  selectedProject: Project | null
}

export interface StaffTableProps {
  employees: Employee[]
  projects: Project[]
  filteredEmployees?: Employee[]
}

export interface SPCRListProps {
  spcrs: SPCR[]
  projects: Project[]
}

export interface HBIStaffingInsightsProps {
  insights: HBIInsight[]
  projects: Project[]
  employees: Employee[]
}

// Utility types for filtering and sorting
export type StaffFilter = {
  position?: string
  project?: string
  status?: string
  searchTerm?: string
}

export type SortField = "name" | "position" | "laborRate" | "billableRate" | "experience"
export type SortDirection = "asc" | "desc"

// API response types
export interface StaffPlanningApiResponse {
  success: boolean
  data?: StaffPlanningData
  error?: string
  message?: string
}

export interface SPCRSubmissionResponse {
  success: boolean
  spcr?: SPCR
  error?: string
  message?: string
}

// Schedule Activity Types
export interface ScheduleActivity {
  id?: string
  project_id: number
  activity_name: string
  start_date: string
  end_date: string
  primary_base_start_date?: string
  primary_base_end_date?: string
  // Add other fields as needed
}

// Enhanced Staffing Plan Activity with schedule linking
export interface StaffingPlanActivity {
  id: string
  name: string
  startDate: Date
  endDate: Date
  linkedScheduleActivityId?: string
  linkedScheduleActivity?: ScheduleActivity // Reference to linked schedule activity
  color?: string
  description?: string
  isLinkedToSchedule?: boolean // Flag to indicate if this is linked to schedule
}

// Add-Activity Modal Types
export interface AddActivityModalProps {
  isOpen: boolean
  onClose: () => void
  onAddActivity: (activity: StaffingPlanActivity) => void
  projectId?: string
  planStartDate: Date
  planEndDate: Date
}

export interface ScheduleActivitySelectorProps {
  projectId: string
  onSelect: (activity: ScheduleActivity) => void
  onCancel: () => void
}

export interface NewActivityFormProps {
  onSubmit: (activity: Omit<StaffingPlanActivity, "id">) => void
  onCancel: () => void
  defaultStartDate: Date
  defaultEndDate: Date
}

// Staffing Plan Types
export interface StaffingPlanMonth {
  year: number
  month: number
  label: string
  startDate: Date
  endDate: Date
  timeScale?: "week" | "month" | "quarter" | "year"
}

export interface StaffingAllocation {
  roleId: string
  roleName: string
  monthlyAllocations: { [monthKey: string]: number }
}

export interface StaffingPlan {
  id: string
  projectId: string
  projectName: string
  name: string
  description?: string
  startDate: Date
  endDate: Date
  activities: StaffingPlanActivity[]
  allocations: StaffingAllocation[]
  createdAt: Date
  updatedAt: Date
  createdBy: string
  status: "draft" | "active" | "completed"
}

export interface StaffingPlanExport {
  plan: StaffingPlan
  format: "json" | "excel" | "pdf"
  includeGantt: boolean
  includeMatrix: boolean
  includeDetails: boolean
}

// Gantt Chart Types
export interface GanttChartProps {
  activities: StaffingPlanActivity[]
  startDate: Date
  endDate: Date
  onActivityUpdate: (activity: StaffingPlanActivity) => void
  onActivitySelect: (activity: StaffingPlanActivity | undefined) => void
  onAddActivity: (activity: StaffingPlanActivity) => void
  selectedActivity?: StaffingPlanActivity
  projectId?: string
}

export interface GanttTimelineMonth {
  year: number
  month: number
  label: string
  startDate: Date
  endDate: Date
  daysInMonth: number
  offset: number
  width: number
}

// Matrix Types
export interface StaffingMatrixProps {
  allocations: StaffingAllocation[]
  months: StaffingPlanMonth[]
  roles: StaffRole[]
  onAllocationChange: (roleId: string, monthKey: string, value: number) => void
  readOnly?: boolean
}

export interface StaffRole {
  id: string
  name: string
  position: string
  laborRate: number
  billableRate: number
  isActive: boolean
}
