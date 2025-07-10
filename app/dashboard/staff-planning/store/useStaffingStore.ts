"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

// Import mock data
import staffingData from "@/data/mock/staffing/staffing.json"
import spcrData from "@/data/mock/staffing/spcr.json"
import projectsData from "@/data/mock/projects.json"

export interface StaffMember {
  id: string
  name: string
  position: string
  laborRate: number
  billableRate: number
  experience: number
  strengths: string[]
  weaknesses: string[]
  discProfile?: string
  assignments: Array<{
    project_id: number
    role: string
    startDate: string
    endDate: string
  }>
}

export interface Project {
  project_id: number
  name: string
  project_stage_name: string
  contract_value: number
  project_number: string
  active: boolean
}

export interface SPCR {
  id: string
  project_id: number
  type: "increase" | "decrease"
  position: string
  startDate: string
  endDate: string
  schedule_activity: string
  scheduleRef: string
  budget: number
  explanation: string
  status: "pending" | "approved" | "rejected"
  workflowStage:
    | "submitted"
    | "pe-review"
    | "pe-approved"
    | "pe-rejected"
    | "executive-review"
    | "final-approved"
    | "final-rejected"
    | "withdrawn"
    | "closed"
  createdBy: string
  createdAt: string
  updatedAt: string
  comments?: Array<{
    id: string
    author: string
    content: string
    timestamp: string
    action?: "approve" | "reject" | "forward"
  }>
}

export interface GanttFilters {
  search: string
  position: string
  project: string
  dateRange: {
    start: Date | null
    end: Date | null
  }
}

export interface StaffingState {
  // Data
  staffMembers: StaffMember[]
  projects: Project[]
  spcrs: SPCR[]

  // UI State
  ganttFilters: GanttFilters
  selectedStaffMember: StaffMember | null
  selectedProject: number | null

  // SPCR Draft State
  spcrDraft: Partial<SPCR> | null

  // Project Setup State
  projectSetupAllocations: { [roleId: string]: number }

  // View State
  ganttViewMode: "week" | "month" | "quarter" | "year"
  spcrViewFilter: "all" | "pending" | "approved" | "rejected" | "closed"
}

export interface StaffingActions {
  // Data actions
  updateStaffAssignment: (staffId: string, updatedStaff: StaffMember) => void
  createSPCR: (spcr: Omit<SPCR, "id" | "createdAt" | "updatedAt">) => void
  updateSPCR: (id: string, updates: Partial<SPCR>) => void
  addSPCRComment: (
    spcrId: string,
    comment: {
      id: string
      author: string
      content: string
      timestamp: string
      action?: "approve" | "reject" | "forward"
    }
  ) => void

  // Filter actions
  setGanttFilters: (filters: Partial<GanttFilters>) => void
  clearGanttFilters: () => void

  // Selection actions
  setSelectedStaffMember: (member: StaffMember | null) => void
  setSelectedProject: (projectId: number | null) => void

  // SPCR Draft actions
  setSPCRDraft: (draft: Partial<SPCR> | null) => void
  saveSPCRDraft: () => void
  clearSPCRDraft: () => void

  // Project Setup actions
  setProjectSetupAllocation: (roleId: string, value: number) => void
  clearProjectSetupAllocations: () => void
  getProjectSetupAllocations: () => { [roleId: string]: number }

  // View actions
  setGanttViewMode: (mode: "week" | "month" | "quarter" | "year") => void
  setSPCRViewFilter: (filter: "all" | "pending" | "approved" | "rejected" | "closed") => void

  // Utility functions
  getStaffByProject: (projectId: number) => StaffMember[]
  getSPCRsByProject: (projectId: number) => SPCR[]
  getSPCRsByRole: (userRole: "executive" | "project-executive" | "project-manager") => SPCR[]
  calculateLaborCost: (staffIds: string[], weeklyHours?: number) => number

  // Data management
  reinitializeData: () => void
}

// Helper function to generate workflow stage
const getWorkflowStage = (status: string): SPCR["workflowStage"] => {
  switch (status) {
    case "pending":
      return "pe-review"
    case "approved":
      return "final-approved"
    case "rejected":
      return "pe-rejected"
    default:
      return "submitted"
  }
}

// Initialize data
const initializeData = () => {
  const staff = (staffingData as StaffMember[]) || []
  const projects = (projectsData as Project[]) || []
  const spcrs = (spcrData as any[]).map((spcr) => ({
    ...spcr,
    workflowStage: getWorkflowStage(spcr.status),
    comments: [],
  })) as SPCR[]

  console.log(
    `useStaffingStore: Initialized with ${staff.length} staff members, ${projects.length} projects, ${spcrs.length} SPCRs`
  )

  // Debug: Check for project 2525840 assignments
  const project2525840Assignments = staff.filter((s) => s.assignments.some((a) => a.project_id === 2525840))
  console.log(`useStaffingStore: Found ${project2525840Assignments.length} staff members assigned to project 2525840:`)
  project2525840Assignments.slice(0, 5).forEach((staff) => {
    console.log(`  - ${staff.name} (${staff.position})`)
  })

  return { staff, projects, spcrs }
}

export const useStaffingStore = create<StaffingState & StaffingActions>()(
  persist(
    (set, get) => {
      const { staff, projects, spcrs } = initializeData()

      return {
        // Initial state
        staffMembers: staff,
        projects: projects,
        spcrs: spcrs,
        ganttFilters: {
          search: "",
          position: "all",
          project: "all",
          dateRange: { start: null, end: null },
        },
        selectedStaffMember: null,
        selectedProject: null,
        spcrDraft: null,
        ganttViewMode: "month",
        spcrViewFilter: "approved", // Default to Approved for executive view
        projectSetupAllocations: {},

        // Actions
        updateStaffAssignment: (staffId, updatedStaff) => {
          set((state) => ({
            staffMembers: state.staffMembers.map((staff) => (staff.id === staffId ? updatedStaff : staff)),
          }))
        },

        createSPCR: (spcrData) => {
          const newSPCR: SPCR = {
            id: `spcr-${Date.now()}`,
            ...spcrData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            workflowStage: "submitted",
            comments: [],
          }

          set((state) => ({
            spcrs: [...state.spcrs, newSPCR],
          }))
        },

        updateSPCR: (id, updates) => {
          set((state) => ({
            spcrs: state.spcrs.map((spcr) =>
              spcr.id === id ? { ...spcr, ...updates, updatedAt: new Date().toISOString() } : spcr
            ),
          }))
        },

        addSPCRComment: (spcrId, comment) => {
          set((state) => ({
            spcrs: state.spcrs.map((spcr) =>
              spcr.id === spcrId
                ? {
                    ...spcr,
                    comments: [...(spcr.comments || []), comment],
                    updatedAt: new Date().toISOString(),
                  }
                : spcr
            ),
          }))
        },

        setGanttFilters: (filters) => {
          set((state) => ({
            ganttFilters: { ...state.ganttFilters, ...filters },
          }))
        },

        clearGanttFilters: () => {
          set({
            ganttFilters: {
              search: "",
              position: "all",
              project: "all",
              dateRange: { start: null, end: null },
            },
          })
        },

        setSelectedStaffMember: (member) => {
          set({ selectedStaffMember: member })
        },

        setSelectedProject: (projectId) => {
          set({ selectedProject: projectId })
        },

        setSPCRDraft: (draft) => {
          set({ spcrDraft: draft })
        },

        saveSPCRDraft: () => {
          const { spcrDraft, createSPCR } = get()
          if (spcrDraft && spcrDraft.project_id && spcrDraft.type && spcrDraft.position) {
            createSPCR(spcrDraft as Omit<SPCR, "id" | "createdAt" | "updatedAt">)
            set({ spcrDraft: null })
          }
        },

        clearSPCRDraft: () => {
          set({ spcrDraft: null })
        },

        setGanttViewMode: (mode) => {
          set({ ganttViewMode: mode })
        },

        setSPCRViewFilter: (filter) => {
          set({ spcrViewFilter: filter })
        },

        // Project Setup actions
        setProjectSetupAllocation: (roleId, value) => {
          set((state) => ({
            projectSetupAllocations: { ...state.projectSetupAllocations, [roleId]: value },
          }))
        },

        clearProjectSetupAllocations: () => {
          set({ projectSetupAllocations: {} })
        },

        getProjectSetupAllocations: () => {
          const { projectSetupAllocations } = get()
          return projectSetupAllocations
        },

        // Utility functions
        getStaffByProject: (projectId) => {
          const { staffMembers } = get()
          return staffMembers.filter((staff) =>
            staff.assignments.some((assignment) => assignment.project_id === projectId)
          )
        },

        getSPCRsByProject: (projectId) => {
          const { spcrs } = get()
          return spcrs.filter((spcr) => spcr.project_id === projectId)
        },

        getSPCRsByRole: (userRole) => {
          const { spcrs } = get()

          switch (userRole) {
            case "project-manager":
              // PM sees SPCRs for their project (hardcoded to Palm Beach project)
              return spcrs.filter((spcr) => spcr.project_id === 2525840)

            case "project-executive":
              // PE sees SPCRs for their portfolio (6 projects) that need PE review or they've acted on
              const portfolioProjects = [2525840, 2525841, 2525842, 2525843, 2525844, 2525845]
              return spcrs.filter(
                (spcr) =>
                  portfolioProjects.includes(spcr.project_id) &&
                  [
                    "pe-review",
                    "pe-approved",
                    "pe-rejected",
                    "executive-review",
                    "final-approved",
                    "final-rejected",
                  ].includes(spcr.workflowStage)
              )

            case "executive":
              // Executive sees SPCRs that have been approved by PE or need final approval
              return spcrs.filter((spcr) =>
                ["executive-review", "final-approved", "final-rejected"].includes(spcr.workflowStage)
              )

            default:
              return spcrs
          }
        },

        calculateLaborCost: (staffIds, weeklyHours = 40) => {
          const { staffMembers } = get()
          return staffMembers
            .filter((staff) => staffIds.includes(staff.id))
            .reduce((total, staff) => total + staff.laborRate * weeklyHours, 0)
        },

        reinitializeData: () => {
          const { staff, projects, spcrs } = initializeData()
          set({
            staffMembers: staff,
            projects: projects,
            spcrs: spcrs,
          })
        },
      }
    },
    {
      name: "staffing-storage-v2", // Changed name to force fresh initialization
      partialize: (state) => ({
        staffMembers: state.staffMembers, // Include staffMembers in persistence
        projects: state.projects, // Include projects in persistence
        spcrs: state.spcrs,
        ganttFilters: state.ganttFilters,
        spcrDraft: state.spcrDraft,
        ganttViewMode: state.ganttViewMode,
        spcrViewFilter: state.spcrViewFilter,
        selectedProject: state.selectedProject,
      }),
    }
  )
)
