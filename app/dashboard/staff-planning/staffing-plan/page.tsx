"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/layout/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Calendar,
  ArrowLeft,
  Save,
  FileText,
  Users,
  Clock,
  Home,
  Plus,
  Edit,
  Trash2,
  Download,
  EllipsisVertical,
  BarChart3,
  Grid3X3,
  Eye,
  Target,
  Building2,
  X,
  Maximize,
  Minimize,
  PlusCircle,
  Calculator,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  startOfWeek,
  endOfWeek,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  addWeeks,
  addQuarters,
  addYears,
} from "date-fns"
import { StaffingPlanExport } from "@/components/staff-planning/StaffingPlanExport"
import type { TimeScale } from "@/components/staff-planning/StaffingPlanGantt"
import { useStaffingStore } from "../store/useStaffingStore"

// Import types
import type {
  StaffingPlan,
  StaffingPlanActivity,
  StaffingAllocation,
  StaffingPlanMonth,
  StaffRole,
} from "@/types/staff-planning"

// Import components
import StaffingPlanGantt from "@/components/staff-planning/StaffingPlanGantt"
import { StaffingPlanMatrix } from "@/components/staff-planning/StaffingPlanMatrix"
import UnifiedStaffingPlanView from "@/components/staff-planning/UnifiedStaffingPlanView"

// Import mock data
import projectsData from "@/data/mock/projects.json"
import { cn } from "@/lib/utils"

// Define Project interface
interface Project {
  project_id: number
  name: string
  project_stage_name: string
  contract_value: number
  project_number: string
  active: boolean
  start_date: string
  projected_finish_date: string
}

// New project creation interface
interface NewProjectForm {
  name: string
  project_number: string
  contract_value: string
  project_stage_name: string
}

// Define static roles matching the allocation matrix
const STATIC_ROLES = [
  "PROJECT EXECUTIVE",
  "PROJECT MANAGER",
  "ASSISTANT PROJECT MANAGER",
  "PROJECT ACCOUNTANT",
  "PROJECT ADMINISTRATOR",
  "PROCUREMENT MANAGER",
  "LEAD SUPERINTENDENT",
  "ASSISTANT SUPERINTENDENT",
  "PROJECT SUPERINTENDENT",
  "ASSISTANT SUPERINTENDENT",
  "FOREMAN",
]

// Project Setup Modal Component
const ProjectSetupModal = ({
  open,
  onOpenChange,
  projectName,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  roles,
  roleAllocations,
  onRoleAllocationChange,
  onSave,
  onCancel,
  hasProjectDates,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectName: string
  startDate: Date
  endDate: Date
  onStartDateChange: (date: Date) => void
  onEndDateChange: (date: Date) => void
  roles: StaffRole[]
  roleAllocations: { [roleId: string]: number }
  onRoleAllocationChange: (roleId: string, value: number) => void
  onSave: () => void
  onCancel: () => void
  hasProjectDates: boolean
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Project Setup - {projectName}
          </DialogTitle>
          <DialogDescription>
            Set up the project timeline and initial staffing requirements for the entire project duration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Timeline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Project Timeline</h3>
            </div>

            {!hasProjectDates && (
              <div className="bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Project dates not available</span>
                </div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                  Please enter the overall project start and end dates to continue.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project-start-date">Project Start Date</Label>
                <Input
                  id="project-start-date"
                  type="date"
                  value={format(startDate, "yyyy-MM-dd")}
                  onChange={(e) => onStartDateChange(new Date(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-end-date">Project End Date</Label>
                <Input
                  id="project-end-date"
                  type="date"
                  value={format(endDate, "yyyy-MM-dd")}
                  onChange={(e) => onEndDateChange(new Date(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Role Allocation */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Full Duration Staffing</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Select roles that will be necessary for the entire project duration. You can adjust specific periods later
              in the allocation matrix.
            </p>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {roles.map((role) => (
                <div key={role.id} className="flex items-center justify-between py-2 px-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{role.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`role-${role.id}`} className="text-sm">
                      Qty:
                    </Label>
                    <Input
                      id={`role-${role.id}`}
                      type="number"
                      min="0"
                      step="0.25"
                      value={roleAllocations[role.id] || 0}
                      onChange={(e) => onRoleAllocationChange(role.id, parseFloat(e.target.value) || 0)}
                      className="w-20 h-8"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            <Save className="h-4 w-4 mr-2" />
            Save & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function StaffingPlanPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Store hooks
  const {
    projectSetupAllocations,
    setProjectSetupAllocation,
    clearProjectSetupAllocations,
    getProjectSetupAllocations,
  } = useStaffingStore()

  // Load mock data
  const projects = useMemo<Project[]>(() => projectsData as Project[], [])

  // State management
  const [activeTab, setActiveTab] = useState<"overview" | "planning">("overview")
  const [selectedProject, setSelectedProject] = useState<string | undefined>(undefined)
  const [planName, setPlanName] = useState("")
  const [planDescription, setPlanDescription] = useState("")
  const [planStartDate, setPlanStartDate] = useState<Date>(new Date())
  const [planEndDate, setPlanEndDate] = useState<Date>(addMonths(new Date(), 12))
  const [activities, setActivities] = useState<StaffingPlanActivity[]>([])
  const [allocations, setAllocations] = useState<StaffingAllocation[]>([])
  const [selectedActivity, setSelectedActivity] = useState<StaffingPlanActivity | undefined>(undefined)
  const [showExportModal, setShowExportModal] = useState(false)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // New project creation state
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [newProjectForm, setNewProjectForm] = useState<NewProjectForm>({
    name: "",
    project_number: "",
    contract_value: "",
    project_stage_name: "Preconstruction",
  })
  const [isCreatingProject, setIsCreatingProject] = useState(false)

  // Project setup modal state
  const [showProjectSetupModal, setShowProjectSetupModal] = useState(false)
  const [projectSetupForm, setProjectSetupForm] = useState({
    startDate: new Date(),
    endDate: addMonths(new Date(), 12),
  })

  // Time scale state from Gantt chart
  const [currentTimeScale, setCurrentTimeScale] = useState<TimeScale>("month")
  const [currentTimePeriods, setCurrentTimePeriods] = useState<Date[]>([])

  // Track whether project setup allocations have been applied
  const hasAppliedProjectSetupAllocations = useRef(false)

  // Redirect if not authorized
  useEffect(() => {
    if (!user || (user.role !== "project-manager" && user.role !== "project-executive")) {
      router.push("/dashboard/staff-planning")
    }
  }, [user, router])

  // Initialize with first project if no project is selected
  useEffect(() => {
    if (!selectedProject && projects.length > 0) {
      const firstProject = projects[0]
      setSelectedProject(firstProject.project_id.toString())

      // Auto-populate dates from the first project
      if (firstProject.start_date) {
        setPlanStartDate(new Date(firstProject.start_date))
      }
      if (firstProject.projected_finish_date) {
        setPlanEndDate(new Date(firstProject.projected_finish_date))
      }
    }
  }, [selectedProject, projects])

  // Handle escape key for fullscreen
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isFullscreen])

  // Generate time periods based on Gantt chart time scale
  const planningMonths = useMemo<StaffingPlanMonth[]>(() => {
    if (activities.length === 0 || currentTimePeriods.length === 0) return []

    return currentTimePeriods.map((period) => {
      switch (currentTimeScale) {
        case "week":
          return {
            year: period.getFullYear(),
            month: period.getMonth() + 1,
            label: format(period, "MMM dd"),
            startDate: startOfWeek(period),
            endDate: endOfWeek(period),
            timeScale: "week" as const,
          }
        case "quarter":
          return {
            year: period.getFullYear(),
            month: period.getMonth() + 1,
            label: format(period, "Qo yyyy"),
            startDate: startOfQuarter(period),
            endDate: endOfQuarter(period),
            timeScale: "quarter" as const,
          }
        case "year":
          return {
            year: period.getFullYear(),
            month: period.getMonth() + 1,
            label: format(period, "yyyy"),
            startDate: startOfYear(period),
            endDate: endOfYear(period),
            timeScale: "year" as const,
          }
        default: // month
          return {
            year: period.getFullYear(),
            month: period.getMonth() + 1,
            label: format(period, "MMM yyyy"),
            startDate: startOfMonth(period),
            endDate: endOfMonth(period),
            timeScale: "month" as const,
          }
      }
    })
  }, [activities, currentTimeScale, currentTimePeriods])

  // Generate roles from static list instead of staffing data
  const availableRoles = useMemo<StaffRole[]>(() => {
    const roles = STATIC_ROLES.map((roleName, index) => ({
      id: `role-${index}`,
      name: roleName,
      position: roleName,
      laborRate: 0, // Remove labor rate
      billableRate: 0, // Remove billable rate
      isActive: true,
    }))
    return roles
  }, [])

  // Initialize allocations when roles or months change
  useEffect(() => {
    if (availableRoles.length > 0 && planningMonths.length > 0) {
      // Check if we need to initialize or expand allocations
      const needsInitialization = allocations.length === 0
      const needsExpansion =
        allocations.length > 0 &&
        (allocations.length !== availableRoles.length ||
          planningMonths.some((month) => {
            const monthKey = `${month.year}-${month.month.toString().padStart(2, "0")}`
            return !allocations[0]?.monthlyAllocations.hasOwnProperty(monthKey)
          }))

      if (needsInitialization || needsExpansion) {
        console.log("=== Initializing/Expanding allocations ===")
        console.log("Roles:", availableRoles.length, "Planning months:", planningMonths.length)
        console.log("Needs initialization:", needsInitialization, "Needs expansion:", needsExpansion)

        // Only apply project setup allocations if they haven't been cleared yet AND we're initializing
        const allocationsToApply =
          needsInitialization && !hasAppliedProjectSetupAllocations.current ? projectSetupAllocations : {}
        console.log("Role allocations to apply:", allocationsToApply)

        const newAllocations: StaffingAllocation[] = availableRoles.map((role) => {
          // Find existing allocation for this role
          const existingAllocation = allocations.find((alloc) => alloc.roleId === role.id)

          const monthlyAllocations = planningMonths.reduce((acc, month) => {
            const monthKey = `${month.year}-${month.month.toString().padStart(2, "0")}`

            // Priority: existing value > project setup allocation > 0
            if (existingAllocation?.monthlyAllocations[monthKey] !== undefined) {
              // Preserve existing user allocation
              acc[monthKey] = existingAllocation.monthlyAllocations[monthKey]
            } else if (allocationsToApply[role.id]) {
              // Apply project setup allocation for new months
              acc[monthKey] = allocationsToApply[role.id]
            } else {
              // Default to 0 for new months
              acc[monthKey] = 0
            }
            return acc
          }, {} as { [monthKey: string]: number })

          return {
            roleId: role.id,
            roleName: role.name,
            monthlyAllocations,
          }
        })

        console.log(
          "Roles with values:",
          newAllocations
            .filter((a) => Object.values(a.monthlyAllocations).some((v) => v > 0))
            .map((a) => `${a.roleName}: ${Object.values(a.monthlyAllocations).find((v) => v > 0)}`)
        )

        setAllocations(newAllocations)
      }
    }
  }, [availableRoles, planningMonths, allocations])

  // Clear project setup allocations after they've been successfully applied
  useEffect(() => {
    if (allocations.length > 0 && Object.keys(projectSetupAllocations).length > 0) {
      // Check if any allocations have values (indicating they were applied)
      const hasAppliedValues = allocations.some((allocation) =>
        Object.values(allocation.monthlyAllocations).some((v) => v > 0)
      )

      if (hasAppliedValues) {
        console.log("Clearing project setup allocations after successful application...")
        clearProjectSetupAllocations()
        // Mark that we've cleared project setup allocations so they won't be applied again
        hasAppliedProjectSetupAllocations.current = true
      }
    }
  }, [allocations, projectSetupAllocations, clearProjectSetupAllocations])

  // Show project setup modal when no activities exist and user is on Planning tab
  useEffect(() => {
    if (activities.length === 0 && activeTab === "planning" && selectedProject && !showProjectSetupModal) {
      // Initialize form with project dates if available
      const currentProject = projects.find((p) => p.project_id.toString() === selectedProject)
      if (currentProject) {
        setProjectSetupForm({
          startDate: currentProject.start_date ? new Date(currentProject.start_date) : new Date(),
          endDate: currentProject.projected_finish_date
            ? new Date(currentProject.projected_finish_date)
            : addMonths(new Date(), 12),
        })
      }
      setShowProjectSetupModal(true)
    }
  }, [activities.length, activeTab, selectedProject, projects, showProjectSetupModal])

  // Handle activity updates
  const handleActivityUpdate = (updatedActivity: StaffingPlanActivity) => {
    setActivities((prev) => prev.map((activity) => (activity.id === updatedActivity.id ? updatedActivity : activity)))
    setIsDirty(true)
  }

  // Handle activity selection
  const handleActivitySelect = (activity: StaffingPlanActivity | undefined) => {
    setSelectedActivity(activity)
  }

  // Handle allocation changes
  const handleAllocationChange = (roleId: string, monthKey: string, value: number) => {
    setAllocations((prev) =>
      prev.map((allocation) =>
        allocation.roleId === roleId
          ? {
              ...allocation,
              monthlyAllocations: {
                ...allocation.monthlyAllocations,
                [monthKey]: Math.max(0, value),
              },
            }
          : allocation
      )
    )
    setIsDirty(true)
  }

  // Add new activity
  const handleAddActivity = (newActivity: StaffingPlanActivity) => {
    setActivities((prev) => [...prev, newActivity])
    setSelectedActivity(newActivity)
    setIsDirty(true)
  }

  // Delete activity
  const handleDeleteActivity = (activityToDelete: StaffingPlanActivity) => {
    setActivities((prev) => prev.filter((activity) => activity.id !== activityToDelete.id))
    // Clear selection if the deleted activity was selected
    if (selectedActivity?.id === activityToDelete.id) {
      setSelectedActivity(undefined)
    }
    setIsDirty(true)
  }

  // Handle project selection
  const handleProjectSelect = (value: string) => {
    if (value === "create-new") {
      setShowNewProjectModal(true)
    } else {
      console.log("Selected project ID:", value)
      setSelectedProject(value)

      // Find the selected project and populate date fields
      const selectedProjectData = projects.find((p) => p.project_id.toString() === value)
      console.log("Selected project data:", selectedProjectData)

      if (selectedProjectData) {
        // Populate start date from project start_date
        if (selectedProjectData.start_date) {
          setPlanStartDate(new Date(selectedProjectData.start_date))
        }

        // Populate end date from project projected_finish_date
        if (selectedProjectData.projected_finish_date) {
          setPlanEndDate(new Date(selectedProjectData.projected_finish_date))
        }
      }

      setIsDirty(true)
    }
  }

  // Handle new project creation
  const handleCreateProject = async () => {
    // Validate form
    if (!newProjectForm.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Project name is required.",
        variant: "destructive",
      })
      return
    }

    if (!newProjectForm.project_number.trim()) {
      toast({
        title: "Validation Error",
        description: "Project number is required.",
        variant: "destructive",
      })
      return
    }

    setIsCreatingProject(true)

    try {
      // Create new project
      const newProject: Project = {
        project_id: Date.now(), // Use timestamp as temporary ID
        name: newProjectForm.name.trim(),
        project_number: newProjectForm.project_number.trim(),
        contract_value: parseFloat(newProjectForm.contract_value) || 0,
        project_stage_name: newProjectForm.project_stage_name,
        active: true,
        start_date: format(new Date(), "yyyy-MM-dd"), // Default to today
        projected_finish_date: format(addMonths(new Date(), 12), "yyyy-MM-dd"), // Default to 12 months from now
      }

      // Add to projects list - Skip this since projects is now read-only mock data
      // TODO: In production, this would call an API to create the project

      // Select the new project (for now, just select the first available project)
      if (projects.length > 0) {
        setSelectedProject(projects[0].project_id.toString())
      }

      // Reset form
      setNewProjectForm({
        name: "",
        project_number: "",
        contract_value: "",
        project_stage_name: "Preconstruction",
      })

      // Close modal
      setShowNewProjectModal(false)
      setIsDirty(true)

      toast({
        title: "Project Created",
        description: `${newProject.name} has been created successfully.`,
      })
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create the project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingProject(false)
    }
  }

  // Cancel new project creation
  const handleCancelNewProject = () => {
    setNewProjectForm({
      name: "",
      project_number: "",
      contract_value: "",
      project_stage_name: "Preconstruction",
    })
    setShowNewProjectModal(false)
  }

  // Save plan
  const handleSave = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement save logic
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsDirty(false)
      toast({
        title: "Plan Saved",
        description: "Your staffing plan has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save the staffing plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Cancel changes
  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        router.push("/dashboard/staff-planning")
      }
    } else {
      router.push("/dashboard/staff-planning")
    }
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev)
  }

  // Export plan
  const handleExport = (format: "json" | "excel" | "pdf") => {
    setShowExportModal(false)
    toast({
      title: "Export Started",
      description: `Preparing ${format.toUpperCase()} export of your staffing plan.`,
    })
  }

  // Handle time scale changes from Gantt chart
  const handleTimeScaleChange = (timeScale: TimeScale, periods: Date[]) => {
    setCurrentTimeScale(timeScale)
    setCurrentTimePeriods(periods)
  }

  // Calculate date range for percentage-based positioning (same logic as gantt chart)
  const dateRange = useMemo(() => {
    if (activities.length === 0) {
      // Default range if no activities
      const now = new Date()
      let start: Date, end: Date

      switch (currentTimeScale) {
        case "week":
          start = startOfWeek(addWeeks(now, -4))
          end = endOfWeek(addWeeks(now, 8))
          break
        case "month":
          start = startOfMonth(addMonths(now, -2))
          end = endOfMonth(addMonths(now, 10))
          break
        case "quarter":
          start = startOfQuarter(addQuarters(now, -2))
          end = endOfQuarter(addQuarters(now, 6))
          break
        case "year":
          start = startOfYear(addYears(now, -1))
          end = endOfYear(addYears(now, 4))
          break
        default:
          start = startOfMonth(addMonths(now, -2))
          end = endOfMonth(addMonths(now, 10))
      }

      return { start, end }
    }

    // Find earliest and latest dates from activities
    const startDates = activities.map((activity) => activity.startDate)
    const endDates = activities.map((activity) => activity.endDate)

    const earliestStart = new Date(Math.min(...startDates.map((d) => d.getTime())))
    const latestEnd = new Date(Math.max(...endDates.map((d) => d.getTime())))

    // Align to time scale boundaries
    let alignedStart: Date, alignedEnd: Date

    switch (currentTimeScale) {
      case "week":
        alignedStart = startOfWeek(earliestStart)
        alignedEnd = endOfWeek(latestEnd)
        break
      case "month":
        alignedStart = startOfMonth(earliestStart)
        alignedEnd = endOfMonth(latestEnd)
        break
      case "quarter":
        alignedStart = startOfQuarter(earliestStart)
        alignedEnd = endOfQuarter(latestEnd)
        break
      case "year":
        alignedStart = startOfYear(earliestStart)
        alignedEnd = endOfYear(latestEnd)
        break
      default:
        alignedStart = startOfMonth(earliestStart)
        alignedEnd = endOfMonth(latestEnd)
    }

    return { start: alignedStart, end: alignedEnd }
  }, [activities, currentTimeScale])

  // Project setup modal handlers
  const handleProjectSetupSave = () => {
    console.log("Saving project setup with allocations:", projectSetupAllocations)

    // Reset the ref so allocations can be applied again
    hasAppliedProjectSetupAllocations.current = false

    const currentProject = projects.find((p) => p.project_id.toString() === selectedProject)
    if (!currentProject) return

    // Create project summary activity
    const projectActivity: StaffingPlanActivity = {
      id: `project-${currentProject.project_id}-${Date.now()}`,
      name: currentProject.name,
      startDate: projectSetupForm.startDate,
      endDate: projectSetupForm.endDate,
      description: "Project Summary Activity",
      color: "#3B82F6",
      isLinkedToSchedule: false,
    }

    setActivities([projectActivity])
    setSelectedActivity(projectActivity)

    // Update plan dates to match the project activity
    setPlanStartDate(projectSetupForm.startDate)
    setPlanEndDate(projectSetupForm.endDate)

    setIsDirty(true)
    setShowProjectSetupModal(false)

    toast({
      title: "Project Setup Complete",
      description: "Your staffing plan has been initialized.",
    })
  }

  const handleProjectSetupCancel = () => {
    setShowProjectSetupModal(false)
    clearProjectSetupAllocations()
    // Reset the ref so allocations can be applied again if user retries
    hasAppliedProjectSetupAllocations.current = false
    setProjectSetupForm({
      startDate: new Date(),
      endDate: addMonths(new Date(), 12),
    })
  }

  const handleRoleAllocationChange = (roleId: string, value: number) => {
    setProjectSetupAllocation(roleId, value)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("min-h-screen bg-background", isFullscreen && "fixed inset-0 z-[9999] overflow-auto")}>
      {!isFullscreen && <AppHeader />}
      <div className={cn("space-y-6", isFullscreen ? "p-6 h-full" : "p-6")}>
        {/* Breadcrumb Navigation - Hide in fullscreen */}
        {!isFullscreen && (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard" className="flex items-center gap-1">
                  <Home className="h-3 w-3" />
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/staff-planning" className="flex items-center gap-1">
                  Staff Planning
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Staffing Plan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}

        {/* Header Section */}
        <div
          className={cn(
            "border-b border-border/40 pb-4 backdrop-blur-sm",
            isFullscreen ? "bg-background/95" : "sticky top-20 z-40 bg-white dark:bg-gray-950 -mx-6 px-6"
          )}
        >
          <div className="flex flex-col gap-4 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Staffing Plan</h1>
                  <p className="text-muted-foreground mt-1">Define internal staffing needs and resource allocation</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleSave} disabled={!isDirty || isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>

                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="px-2"
                  title={isFullscreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen"}
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>

                {/* More Actions Menu */}
                <Popover open={moreMenuOpen} onOpenChange={setMoreMenuOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="px-2">
                      <EllipsisVertical className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-0" align="end">
                    <div className="p-1">
                      <button
                        onClick={() => {
                          setShowExportModal(true)
                          setMoreMenuOpen(false)
                        }}
                        className="w-full text-left px-3 py-2 rounded text-sm hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Export
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "overview" | "planning")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="planning" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Planning
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Project Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Project Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-select">Select Project</Label>
                    <Select value={selectedProject} onValueChange={handleProjectSelect}>
                      <SelectTrigger id="project-select">
                        <SelectValue placeholder="Choose a project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.project_id} value={project.project_id.toString()}>
                            <div className="flex items-center justify-between w-full">
                              <span>{project.name}</span>
                              <Badge variant="secondary" className="ml-2">
                                {project.project_stage_name}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="create-new">
                          <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Create New Project
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plan-name">Plan Name</Label>
                    <Input
                      id="plan-name"
                      value={planName}
                      onChange={(e) => setPlanName(e.target.value)}
                      placeholder="Enter staffing plan name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan-description">Description</Label>
                  <Textarea
                    id="plan-description"
                    value={planDescription}
                    onChange={(e) => setPlanDescription(e.target.value)}
                    placeholder="Enter plan description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={format(planStartDate, "yyyy-MM-dd")}
                      onChange={(e) => setPlanStartDate(new Date(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={format(planEndDate, "yyyy-MM-dd")}
                      onChange={(e) => setPlanEndDate(new Date(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Activities</span>
                  </div>
                  <div className="text-2xl font-bold">{activities.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Roles</span>
                  </div>
                  <div className="text-2xl font-bold">{availableRoles.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">Duration</span>
                  </div>
                  <div className="text-2xl font-bold">{planningMonths.length}</div>
                  <div className="text-xs text-muted-foreground">months</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Total FTE</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {allocations.reduce(
                      (sum, allocation) =>
                        sum + Object.values(allocation.monthlyAllocations).reduce((a, b) => a + b, 0),
                      0
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="planning" className={cn("space-y-6", isFullscreen && "h-[calc(100%-60px)]")}>
            {/* Allocation KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Total FTE</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {allocations.reduce(
                      (sum, allocation) =>
                        sum + Object.values(allocation.monthlyAllocations).reduce((a, b) => a + b, 0),
                      0
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">across all roles</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Avg Monthly</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {planningMonths.length > 0
                      ? (
                          allocations.reduce(
                            (sum, allocation) =>
                              sum + Object.values(allocation.monthlyAllocations).reduce((a, b) => a + b, 0),
                            0
                          ) / planningMonths.length
                        ).toFixed(1)
                      : 0}
                  </div>
                  <div className="text-xs text-muted-foreground">FTE per month</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Peak Month</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {Math.max(
                      ...planningMonths.map((month) => {
                        const monthKey = `${month.year}-${month.month.toString().padStart(2, "0")}`
                        return allocations.reduce(
                          (sum, allocation) => sum + (allocation.monthlyAllocations[monthKey] || 0),
                          0
                        )
                      }),
                      0
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">max FTE</div>
                </CardContent>
              </Card>
            </div>

            {/* Unified Staffing Plan View */}
            <div className={cn("resize-container", isFullscreen ? "h-full" : "min-h-[600px]")}>
              <Card className="h-full overflow-hidden">
                <CardHeader className="flex-shrink-0 pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Staffing Plan
                    </div>
                    {selectedProject && (
                      <Badge variant="outline" className="text-xs">
                        {projects.find((p) => p.project_id.toString() === selectedProject)?.name || "Unknown Project"}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                  <UnifiedStaffingPlanView
                    activities={activities}
                    allocations={allocations}
                    months={planningMonths}
                    roles={availableRoles}
                    startDate={planStartDate}
                    endDate={planEndDate}
                    onActivityUpdate={handleActivityUpdate}
                    onActivitySelect={handleActivitySelect}
                    onAddActivity={handleAddActivity}
                    onActivityDelete={handleDeleteActivity}
                    onAllocationChange={handleAllocationChange}
                    selectedActivity={selectedActivity}
                    projectId={selectedProject || ""}
                    onTimeScaleChange={handleTimeScaleChange}
                    timeScale={currentTimeScale}
                    timePeriods={currentTimePeriods}
                    dateRange={dateRange}
                    onUpdateAllocations={setAllocations}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* New Project Creation Modal */}
        <Dialog open={showNewProjectModal} onOpenChange={setShowNewProjectModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Create New Project
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-project-name">Project Name *</Label>
                <Input
                  id="new-project-name"
                  value={newProjectForm.name}
                  onChange={(e) => setNewProjectForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-project-number">Project Number *</Label>
                <Input
                  id="new-project-number"
                  value={newProjectForm.project_number}
                  onChange={(e) => setNewProjectForm((prev) => ({ ...prev, project_number: e.target.value }))}
                  placeholder="Enter project number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-project-value">Contract Value</Label>
                <Input
                  id="new-project-value"
                  type="number"
                  value={newProjectForm.contract_value}
                  onChange={(e) => setNewProjectForm((prev) => ({ ...prev, contract_value: e.target.value }))}
                  placeholder="Enter contract value"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-project-stage">Project Stage</Label>
                <Select
                  value={newProjectForm.project_stage_name}
                  onValueChange={(value) => setNewProjectForm((prev) => ({ ...prev, project_stage_name: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Preconstruction">Preconstruction</SelectItem>
                    <SelectItem value="Construction">Construction</SelectItem>
                    <SelectItem value="Closeout">Closeout</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelNewProject}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject} disabled={isCreatingProject}>
                {isCreatingProject ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Export Modal */}
        {showExportModal && (
          <StaffingPlanExport
            plan={{
              id: "temp-plan",
              projectId: selectedProject || "",
              projectName: projects.find((p) => p.project_id.toString() === selectedProject)?.name || "",
              name: planName,
              description: planDescription,
              startDate: planStartDate,
              endDate: planEndDate,
              activities,
              allocations,
              createdAt: new Date(),
              updatedAt: new Date(),
              createdBy: user ? `${user.firstName} ${user.lastName}` : "Unknown User",
              status: "draft",
            }}
            onExport={handleExport}
            onClose={() => setShowExportModal(false)}
          />
        )}

        {/* Project Setup Modal */}
        <ProjectSetupModal
          open={showProjectSetupModal}
          onOpenChange={setShowProjectSetupModal}
          projectName={projects.find((p) => p.project_id.toString() === selectedProject)?.name || "Unknown Project"}
          startDate={projectSetupForm.startDate}
          endDate={projectSetupForm.endDate}
          onStartDateChange={(date) => setProjectSetupForm((prev) => ({ ...prev, startDate: date }))}
          onEndDateChange={(date) => setProjectSetupForm((prev) => ({ ...prev, endDate: date }))}
          roles={availableRoles}
          roleAllocations={projectSetupAllocations}
          onRoleAllocationChange={handleRoleAllocationChange}
          onSave={handleProjectSetupSave}
          onCancel={handleProjectSetupCancel}
          hasProjectDates={
            !!(
              projects.find((p) => p.project_id.toString() === selectedProject)?.start_date &&
              projects.find((p) => p.project_id.toString() === selectedProject)?.projected_finish_date
            )
          }
        />
      </div>
    </div>
  )
}
