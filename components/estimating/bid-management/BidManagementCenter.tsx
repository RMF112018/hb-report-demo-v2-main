"use client"

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import { Progress } from "../../ui/progress"
import { Alert, AlertDescription } from "../../ui/alert"
import { Skeleton } from "../../ui/skeleton"
import { Checkbox } from "../../ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../../ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useToast } from "../../ui/use-toast"
import {
  Building2,
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  FileText,
  Settings,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  RefreshCw,
  MapPin,
  DollarSign,
  Target,
  Activity,
  BarChart3,
  Calculator,
  Loader2,
  ChevronRight,
  ArrowUpDown,
  SlidersVertical,
  Columns3,
  MoreVertical,
  Edit,
  FolderOpen,
} from "lucide-react"
import EditableField from "./EditableField"
import MetricGrid from "./cards/MetricGrid"
import { MetricData } from "./cards/MetricGrid"
import { useBidPursuits } from "../../../hooks/useBidPursuits"
import ColumnSettingsDialog, {
  ColumnVisibility,
  DELIVERY_COLUMNS,
  STAGE_COLUMNS,
  ESTIMATES_COLUMNS,
} from "./ColumnSettingsDialog"
import ExportButton from "./ExportButton"
import NewPursuitModal, { ProjectPursuitFormData } from "./NewPursuitModal"

// Enhanced TypeScript interfaces
type UserRole = "estimator" | "project-manager" | "executive" | "admin" | "hr-payroll"
type TabId = "delivery" | "stage" | "estimates"

interface BidManagementCenterProps {
  userRole: UserRole
  className?: string
  projectId?: string
  onProjectSelect?: (projectId: string) => void
  initialTab?: TabId
  showHeader?: boolean
}

// Loading Skeleton Component
const BidManagementSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
    <Skeleton className="h-96 w-full" />
  </div>
)

const BidManagementCenter: React.FC<BidManagementCenterProps> = ({
  userRole,
  className = "",
  projectId,
  onProjectSelect,
  initialTab = "delivery",
  showHeader = true,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab)
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [columnDialogOpen, setColumnDialogOpen] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [editingRows, setEditingRows] = useState<Set<string>>(new Set())

  // Column visibility state for each tab
  const [deliveryColumnVisibility, setDeliveryColumnVisibility] = useState<ColumnVisibility>({})
  const [stageColumnVisibility, setStageColumnVisibility] = useState<ColumnVisibility>({})
  const [estimatesColumnVisibility, setEstimatesColumnVisibility] = useState<ColumnVisibility>({})

  // New Pursuit Modal state
  const [newPursuitModalOpen, setNewPursuitModalOpen] = useState(false)
  const [pursuitEditMode, setPursuitEditMode] = useState<"create" | "edit" | "view">("create")
  const [editingPursuitData, setEditingPursuitData] = useState<ProjectPursuitFormData | null>(null)

  const router = useRouter()
  const { toast } = useToast()
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Use the bid pursuits hook
  const { data: pursuitData, isLoading, updateProject } = useBidPursuits()

  // Handle row editing
  const handleEditRow = (projectId: string) => {
    setEditingRows((prev) => new Set([...prev, projectId]))
  }

  const handleSaveRow = (projectId: string) => {
    setEditingRows((prev) => {
      const newSet = new Set(prev)
      newSet.delete(projectId)
      return newSet
    })
    toast({
      title: "Changes Saved",
      description: "Row has been updated successfully.",
    })
  }

  const handleChangeCategory = (projectId: string) => {
    toast({
      title: "Change Category",
      description: "Category change dialog would open here.",
    })
  }

  // New Pursuit Modal handlers
  const handleNewPursuit = () => {
    setPursuitEditMode("create")
    setEditingPursuitData(null)
    setNewPursuitModalOpen(true)
  }

  const handleViewPursuitDetails = (projectId: string) => {
    // Find the project data and convert to form format
    const project = filteredProjects.find((p) => p.id === projectId)
    if (project) {
      const formData: ProjectPursuitFormData = {
        jobName: project.name,
        jobNumber: project.projectNumber,
        architect: "",
        proposalDueDate: project.bidDueDate ? new Date(project.bidDueDate) : undefined,
        proposalDueTime: "",
        proposalDeliveredVia: "",
        handDeliveredCopies: "",
        typeOfProposal: project.deliverable,
        rfiFormat: "",
        projectExecutive: "",
        primaryContact: project.client,
        estimatorsAssigned: project.leadEstimator || "JASON",
        managingItems: [],
        estimatingItems: [],
        deliverablesItems: [],
      }

      setPursuitEditMode("view")
      setEditingPursuitData(formData)
      setNewPursuitModalOpen(true)
    }
  }

  const handleEditPursuitDetails = (projectId: string) => {
    // Find the project data and convert to form format
    const project = filteredProjects.find((p) => p.id === projectId)
    if (project) {
      const formData: ProjectPursuitFormData = {
        jobName: project.name,
        jobNumber: project.projectNumber,
        architect: "",
        proposalDueDate: project.bidDueDate ? new Date(project.bidDueDate) : undefined,
        proposalDueTime: "",
        proposalDeliveredVia: "",
        handDeliveredCopies: "",
        typeOfProposal: project.deliverable,
        rfiFormat: "",
        projectExecutive: "",
        primaryContact: project.client,
        estimatorsAssigned: project.leadEstimator || "JASON",
        managingItems: [],
        estimatingItems: [],
        deliverablesItems: [],
      }

      setPursuitEditMode("edit")
      setEditingPursuitData(formData)
      setNewPursuitModalOpen(true)
    }
  }

  const handlePursuitSubmit = (data: ProjectPursuitFormData) => {
    // Convert form data to project pursuit format and add/update in the data
    // This would typically call an API to save the data
    console.log("Pursuit data submitted:", data)

    toast({
      title: pursuitEditMode === "create" ? "Pursuit Created" : "Pursuit Updated",
      description:
        pursuitEditMode === "create"
          ? "New pursuit has been added successfully."
          : "Pursuit details have been updated.",
    })
  }

  // Handle column settings click
  const handleColumnSettingsClick = () => {
    setColumnDialogOpen(true)
  }

  // Handle search expansion
  const handleSearchExpand = () => {
    setIsSearchExpanded(true)
    // Focus the input after a short delay to ensure it's rendered
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 100)
  }

  // Handle search collapse (when clicking outside or pressing escape)
  const handleSearchCollapse = () => {
    if (!searchTerm) {
      setIsSearchExpanded(false)
    }
  }

  // Handle search input blur
  const handleSearchBlur = () => {
    // Delay collapse to allow for potential refocus
    setTimeout(() => {
      if (!searchTerm) {
        setIsSearchExpanded(false)
      }
    }, 200)
  }

  // Handle escape key
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setSearchTerm("")
      setIsSearchExpanded(false)
    }
  }

  // Inline Search and Filter Component
  const InlineSearchFilter = ({ title }: { title: string }) => (
    <div className="flex items-center justify-between w-full">
      <CardTitle className="text-lg">{title}</CardTitle>
      <div className="flex items-center space-x-2">
        {isSearchExpanded ? (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 w-64 text-sm"
              ref={searchInputRef}
              onBlur={handleSearchBlur}
              onKeyDown={handleSearchKeyDown}
            />
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={handleSearchExpand} className="h-9 w-9 p-0">
            <Search className="h-5 w-5" />
          </Button>
        )}

        <Button variant="outline" size="sm" onClick={handleNewPursuit} className="h-9 px-3">
          <Plus className="h-4 w-4 mr-2" />
          New Pursuit
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 w-9 p-0">
              <SlidersVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>View Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Column Settings</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleColumnSettingsClick}>
              <Columns3 className="h-4 w-4 mr-2" />
              {activeTab === "delivery" && "Current Pursuits Columns"}
              {activeTab === "stage" && "Pre-Construction Projects Columns"}
              {activeTab === "estimates" && "Estimates Columns"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (!searchTerm) return pursuitData
    return pursuitData.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.projectNumber.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, pursuitData])

  // Dashboard metrics
  const dashboardMetrics = useMemo(() => {
    const projects = filteredProjects
    return {
      totalProjects: projects.length,
      openBids: projects.filter((p) => p.status === "Open").length,
      completeDeliverables: projects.filter((p) => p.deliverable === "COMPLETE").length,
      inProgress: projects.filter((p) => p.status === "Active").length,
      totalValue: projects.reduce((sum, p) => sum + p.projectBudget, 0),
      averageValue: projects.length > 0 ? projects.reduce((sum, p) => sum + p.projectBudget, 0) / projects.length : 0,
    }
  }, [filteredProjects])

  // Corrected Event handlers - Fixed routing logic to match ProjectSidebar behavior
  const handleProjectNavigation = useCallback(
    (projectId: string) => {
      // Navigate to project page using the same pattern as ProjectSidebar
      if (onProjectSelect) {
        // Call the parent onProjectSelect callback to update the main app state
        onProjectSelect(projectId)

        // Show success toast
        toast({
          title: "Project Selected",
          description: `Navigating to project ${projectId}`,
          duration: 2000,
        })
      } else {
        // Fallback: Direct navigation to project page if no callback is provided
        router.push(`/project/${projectId}`)

        toast({
          title: "Project Navigation",
          description: `Opening project ${projectId}`,
          duration: 2000,
        })
      }
    },
    [onProjectSelect, router, toast]
  )

  const handleSync = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Sync Complete",
        description: "Project data has been synchronized successfully.",
      })
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to synchronize project data. Please try again.",
        variant: "destructive",
      })
    }
  }, [toast])

  const handleCreateProject = useCallback(() => {
    toast({
      title: "Create Project",
      description: "Project creation modal would open here.",
    })
  }, [toast])

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Complete":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getScheduleColor = (schedule: string) => {
    switch (schedule) {
      case "On Track":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "At Risk":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Delayed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Options for select fields
  const scheduleOptions = [
    { label: "On Track", value: "On Track" },
    { label: "At Risk", value: "At Risk" },
    { label: "Delayed", value: "Delayed" },
    { label: "Complete", value: "Complete" },
  ]

  const deliverableOptions = [
    { label: "GMP Package", value: "GMP PACKAGE" },
    { label: "Design Build", value: "DESIGN BUILD" },
    { label: "Lump Sum", value: "LUMP SUM" },
    { label: "Complete", value: "COMPLETE" },
  ]

  const statusOptions = [
    { label: "Complete", value: "COMPLETE" },
    { label: "In Progress", value: "IN PROGRESS" },
    { label: "Pending", value: "PENDING" },
    { label: "Scheduled", value: "SCHEDULED" },
  ]

  const bidBondOptions = [
    { label: "Required", value: "REQUIRED" },
    { label: "Obtained", value: "OBTAINED" },
    { label: "Pending", value: "PENDING" },
    { label: "Not Required", value: "NOT REQUIRED" },
  ]

  // Handler for field updates
  const handleFieldUpdate = (projectId: string, field: string, value: string | number) => {
    // Use the updateProject function from the hook
    updateProject(projectId, { [field]: value })

    toast({
      title: "Field Updated",
      description: `${field} has been updated to ${value}`,
    })
  }

  // Metric data for each tab
  const deliveryMetrics: MetricData[] = [
    {
      id: "total-pursuits",
      title: "Active Pursuits",
      icon: Building2,
      value: dashboardMetrics.totalProjects,
      description: "Projects being tracked",
    },
    {
      id: "pending-reviews",
      title: "Pending Reviews",
      icon: Clock,
      value: Math.floor(dashboardMetrics.totalProjects * 0.4),
      description: "Awaiting presubmission review",
    },
    {
      id: "completed-tasks",
      title: "Tasks Complete",
      icon: CheckCircle,
      value: Math.floor(dashboardMetrics.totalProjects * 6.3),
      description: "Individual tasks finished",
    },
    {
      id: "ready-to-submit",
      title: "Ready to Submit",
      icon: Target,
      value: Math.floor(dashboardMetrics.totalProjects * 0.2),
      description: "All tasks complete",
    },
  ]

  const stageMetrics: MetricData[] = [
    {
      id: "total-value",
      title: "Total Value",
      icon: DollarSign,
      value: formatCurrency(dashboardMetrics.totalValue),
      description: "Combined project value",
    },
    {
      id: "average-value",
      title: "Average Value",
      icon: BarChart3,
      value: formatCurrency(dashboardMetrics.averageValue),
      description: "Per project",
    },
    {
      id: "active-projects",
      title: "Active Projects",
      icon: Activity,
      value: dashboardMetrics.inProgress,
      description: "Currently bidding",
    },
    {
      id: "open-opportunities",
      title: "Open Opportunities",
      icon: Target,
      value: dashboardMetrics.openBids,
      description: "Available for bidding",
    },
  ]

  const estimateMetrics: MetricData[] = [
    {
      id: "total-estimates",
      title: "Total Estimates",
      icon: Calculator,
      value: filteredProjects.length,
      description: "Submitted estimates",
    },
    {
      id: "average-cost-sqft",
      title: "Avg Cost per SqFt",
      icon: BarChart3,
      value: `$${(filteredProjects.reduce((sum, p) => sum + p.costPerSqf, 0) / filteredProjects.length || 0).toFixed(
        2
      )}`,
      description: "Per square foot",
    },
    {
      id: "awarded-projects",
      title: "Awarded Projects",
      icon: CheckCircle,
      value: filteredProjects.filter((p) => p.awarded).length,
      description: "Successfully won",
    },
    {
      id: "precon-awarded",
      title: "Precon Awarded",
      icon: Target,
      value: filteredProjects.filter((p) => p.awardedPrecon).length,
      description: "Precon contracts",
    },
  ]

  // Tab Components
  const DeliveryTrackingTab = ({ isEditMode }: { isEditMode: boolean }) => (
    <div className="space-y-4">
      <MetricGrid metrics={deliveryMetrics} />

      <Card>
        <CardHeader className="pb-3">
          <InlineSearchFilter title="Current Pursuits" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  {deliveryColumnVisibility.projectNumber && (
                    <TableHead className="h-10 px-3 text-xs font-semibold">Project #</TableHead>
                  )}
                  {deliveryColumnVisibility.projectName && (
                    <TableHead className="h-10 px-3 text-xs font-semibold">Project Name</TableHead>
                  )}
                  {deliveryColumnVisibility.source && (
                    <TableHead className="h-10 px-3 text-xs font-semibold">Source</TableHead>
                  )}
                  {deliveryColumnVisibility.deliverable && (
                    <TableHead className="h-10 px-3 text-xs font-semibold">Deliverable</TableHead>
                  )}
                  {deliveryColumnVisibility.subBidsDue && (
                    <TableHead className="h-10 px-3 text-xs font-semibold">Sub Bids Due</TableHead>
                  )}
                  {deliveryColumnVisibility.presubmissionReview && (
                    <TableHead className="h-10 px-3 text-xs font-semibold">Presubmission Review</TableHead>
                  )}
                  {deliveryColumnVisibility.winStrategyMeeting && (
                    <TableHead className="h-10 px-3 text-xs font-semibold">Win Strategy Meeting</TableHead>
                  )}
                  {deliveryColumnVisibility.dueDateOutTheDoor && (
                    <TableHead className="h-10 px-3 text-xs font-semibold">Due Date (Out The Door)</TableHead>
                  )}
                  {deliveryColumnVisibility.leadEstimator && (
                    <TableHead className="h-10 px-3 text-xs font-semibold">Lead Estimator</TableHead>
                  )}
                  {deliveryColumnVisibility.contributors && (
                    <TableHead className="h-10 px-3 text-xs font-semibold">Contributors</TableHead>
                  )}
                  {deliveryColumnVisibility.px && <TableHead className="h-10 px-3 text-xs font-semibold">PX</TableHead>}
                  {deliveryColumnVisibility.bidBondWanda && (
                    <TableHead className="h-10 px-3 text-xs font-semibold text-center">Bid Bond (Wanda)</TableHead>
                  )}
                  {deliveryColumnVisibility.ppBond && (
                    <TableHead className="h-10 px-3 text-xs font-semibold text-center">P&P Bond</TableHead>
                  )}
                  {deliveryColumnVisibility.schedule && (
                    <TableHead className="h-10 px-3 text-xs font-semibold text-center">Schedule</TableHead>
                  )}
                  {deliveryColumnVisibility.logistics && (
                    <TableHead className="h-10 px-3 text-xs font-semibold text-center">Logistics</TableHead>
                  )}
                  {deliveryColumnVisibility.bimProposal && (
                    <TableHead className="h-10 px-3 text-xs font-semibold text-center">BIM Proposal</TableHead>
                  )}
                  {deliveryColumnVisibility.preconProposalRyan && (
                    <TableHead className="h-10 px-3 text-xs font-semibold text-center">
                      Precon Proposal (Ryan)
                    </TableHead>
                  )}
                  {deliveryColumnVisibility.proposalTabsWanda && (
                    <TableHead className="h-10 px-3 text-xs font-semibold text-center">Proposal Tabs (Wanda)</TableHead>
                  )}
                  {deliveryColumnVisibility.coordWithMarketing && (
                    <TableHead className="h-10 px-3 text-xs font-semibold text-center">
                      Coor. w/ Marketing Prior to Sending
                    </TableHead>
                  )}
                  {deliveryColumnVisibility.actions && (
                    <TableHead className="h-10 px-3 text-xs font-semibold">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => {
                  const isEditing = editingRows.has(project.id)

                  return (
                    <TableRow key={project.id} className="hover:bg-muted/30 border-b border-border/50">
                      {deliveryColumnVisibility.projectNumber && (
                        <TableCell className="px-3 py-2">
                          {isEditing ? (
                            <Input
                              defaultValue={project.projectNumber}
                              className="h-6 text-xs w-24"
                              placeholder="Project #"
                            />
                          ) : (
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => handleProjectNavigation(project.id)}
                              className="h-auto p-0 text-xs font-medium text-primary hover:text-primary/80 hover:underline"
                            >
                              {project.projectNumber}
                            </Button>
                          )}
                        </TableCell>
                      )}
                      {deliveryColumnVisibility.projectName && (
                        <TableCell className="px-3 py-2">
                          {isEditing ? (
                            <Input
                              defaultValue={project.name}
                              className="h-6 text-xs min-w-32"
                              placeholder="Project Name"
                            />
                          ) : (
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => handleProjectNavigation(project.id)}
                              className="h-auto p-0 text-xs text-primary hover:text-primary/80 hover:underline text-left justify-start"
                            >
                              {project.name}
                            </Button>
                          )}
                        </TableCell>
                      )}
                      {deliveryColumnVisibility.source && (
                        <TableCell className="px-3 py-2">
                          {isEditing ? (
                            <Input defaultValue="CLIENT REQUEST" className="h-6 text-xs w-32" placeholder="Source" />
                          ) : (
                            <span className="text-xs">CLIENT REQUEST</span>
                          )}
                        </TableCell>
                      )}
                      {deliveryColumnVisibility.deliverable && (
                        <TableCell className="px-3 py-2">
                          {isEditing ? (
                            <Input defaultValue="PROPOSAL" className="h-6 text-xs w-24" placeholder="Deliverable" />
                          ) : (
                            <span className="text-xs">PROPOSAL</span>
                          )}
                        </TableCell>
                      )}
                      {deliveryColumnVisibility.subBidsDue && (
                        <TableCell className="px-3 py-2">
                          {isEditing ? (
                            <Input type="date" defaultValue="2024-07-29" className="h-6 text-xs w-32" />
                          ) : (
                            <span className="text-xs">7/29/2024</span>
                          )}
                        </TableCell>
                      )}
                      {deliveryColumnVisibility.presubmissionReview && (
                        <TableCell className="px-3 py-2">
                          {isEditing ? (
                            <Input type="date" defaultValue="2024-07-22" className="h-6 text-xs w-32" />
                          ) : (
                            <span className="text-xs">7/22/2024</span>
                          )}
                        </TableCell>
                      )}
                      {deliveryColumnVisibility.winStrategyMeeting && (
                        <TableCell className="px-3 py-2">
                          {isEditing ? (
                            <Input type="date" defaultValue="2024-07-24" className="h-6 text-xs w-32" />
                          ) : (
                            <span className="text-xs">7/24/2024</span>
                          )}
                        </TableCell>
                      )}
                      {deliveryColumnVisibility.dueDateOutTheDoor && (
                        <TableCell className="px-3 py-2">
                          {isEditing ? (
                            <Input type="date" defaultValue="2024-08-05" className="h-6 text-xs w-32" />
                          ) : (
                            <span className="text-xs">8/5/2024</span>
                          )}
                        </TableCell>
                      )}
                      {deliveryColumnVisibility.leadEstimator && (
                        <TableCell className="px-3 py-2">
                          {isEditing ? (
                            <Input defaultValue="JASON" className="h-6 text-xs w-20" placeholder="Name" />
                          ) : (
                            <span className="text-xs">JASON</span>
                          )}
                        </TableCell>
                      )}
                      {deliveryColumnVisibility.contributors && (
                        <TableCell className="px-3 py-2">
                          {isEditing ? (
                            <Input defaultValue="MIKE, SARAH" className="h-6 text-xs w-28" placeholder="Contributors" />
                          ) : (
                            <span className="text-xs">MIKE, SARAH</span>
                          )}
                        </TableCell>
                      )}
                      {deliveryColumnVisibility.px && (
                        <TableCell className="px-3 py-2">
                          {isEditing ? (
                            <Input defaultValue="ALEX" className="h-6 text-xs w-20" placeholder="PX" />
                          ) : (
                            <span className="text-xs">ALEX</span>
                          )}
                        </TableCell>
                      )}
                      {deliveryColumnVisibility.bidBondWanda && (
                        <TableCell className="px-3 py-2 text-center">
                          <Checkbox defaultChecked={Math.random() > 0.5} className="h-4 w-4" />
                        </TableCell>
                      )}
                      {deliveryColumnVisibility.ppBond && (
                        <TableCell className="px-3 py-2 text-center">
                          <Checkbox defaultChecked={Math.random() > 0.5} className="h-4 w-4" />
                        </TableCell>
                      )}
                      {deliveryColumnVisibility.schedule && (
                        <TableCell className="px-3 py-2 text-center">
                          <Checkbox defaultChecked={Math.random() > 0.5} className="h-4 w-4" />
                        </TableCell>
                      )}
                      {deliveryColumnVisibility.logistics && (
                        <TableCell className="px-3 py-2 text-center">
                          <Checkbox defaultChecked={Math.random() > 0.5} className="h-4 w-4" />
                        </TableCell>
                      )}
                      {deliveryColumnVisibility.bimProposal && (
                        <TableCell className="px-3 py-2 text-center">
                          <Checkbox defaultChecked={Math.random() > 0.5} className="h-4 w-4" />
                        </TableCell>
                      )}
                      {deliveryColumnVisibility.preconProposalRyan && (
                        <TableCell className="px-3 py-2 text-center">
                          <Checkbox defaultChecked={Math.random() > 0.5} className="h-4 w-4" />
                        </TableCell>
                      )}
                      {deliveryColumnVisibility.proposalTabsWanda && (
                        <TableCell className="px-3 py-2 text-center">
                          <Checkbox defaultChecked={Math.random() > 0.5} className="h-4 w-4" />
                        </TableCell>
                      )}
                      {deliveryColumnVisibility.coordWithMarketing && (
                        <TableCell className="px-3 py-2 text-center">
                          <Checkbox defaultChecked={Math.random() > 0.5} className="h-4 w-4" />
                        </TableCell>
                      )}
                      {deliveryColumnVisibility.actions && (
                        <TableCell className="px-3 py-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-12 w-12 p-0 hover:bg-muted/50">
                                <MoreVertical className="h-12 w-12 text-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              {!isEditing ? (
                                <>
                                  <DropdownMenuItem onClick={() => handleEditRow(project.id)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleViewPursuitDetails(project.id)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Project Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditPursuitDetails(project.id)}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Edit Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleChangeCategory(project.id)}>
                                    <FolderOpen className="h-4 w-4 mr-2" />
                                    Change Category
                                  </DropdownMenuItem>
                                </>
                              ) : (
                                <>
                                  <DropdownMenuItem onClick={() => handleSaveRow(project.id)}>
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                    Save Changes
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      setEditingRows((prev) => {
                                        const newSet = new Set(prev)
                                        newSet.delete(project.id)
                                        return newSet
                                      })
                                    }
                                  >
                                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                    Cancel
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const CurrentStageTab = ({ isEditMode }: { isEditMode: boolean }) => {
    // Calculate totals for the new structure
    const totals = useMemo(() => {
      const visibleProjects = filteredProjects
      return {
        preconBudget: visibleProjects.reduce((sum, p) => sum + (p.preconBudget || p.projectBudget * 0.15), 0),
        designBudget: visibleProjects.reduce((sum, p) => sum + (p.designBudget || p.projectBudget * 0.12), 0),
        billedToDate: visibleProjects.reduce((sum, p) => sum + p.billedToDate, 0),
      }
    }, [filteredProjects])

    return (
      <div className="space-y-4">
        <MetricGrid metrics={stageMetrics} />

        <Card>
          <CardHeader className="pb-3">
            <InlineSearchFilter title="Pre-Construction Projects" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-md border-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    {stageColumnVisibility.projectNumber && (
                      <TableHead className="h-10 px-3 text-xs font-semibold">Project #</TableHead>
                    )}
                    {stageColumnVisibility.projectName && (
                      <TableHead className="h-10 px-3 text-xs font-semibold">Project Name</TableHead>
                    )}
                    {stageColumnVisibility.currentStage && (
                      <TableHead className="h-10 px-3 text-xs font-semibold">Current Stage</TableHead>
                    )}
                    {stageColumnVisibility.preconBudget && (
                      <TableHead className="h-10 px-3 text-xs font-semibold">Precon Budget</TableHead>
                    )}
                    {stageColumnVisibility.designBudget && (
                      <TableHead className="h-10 px-3 text-xs font-semibold">Design Budget</TableHead>
                    )}
                    {stageColumnVisibility.billedToDate && (
                      <TableHead className="h-10 px-3 text-xs font-semibold">Billed to Date</TableHead>
                    )}
                    {stageColumnVisibility.leadEstimator && (
                      <TableHead className="h-10 px-3 text-xs font-semibold">Lead Estimator</TableHead>
                    )}
                    {stageColumnVisibility.px && <TableHead className="h-10 px-3 text-xs font-semibold">PX</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id} className="hover:bg-muted/30 border-b border-border/50">
                      {stageColumnVisibility.projectNumber && (
                        <TableCell className="px-3 py-2">
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => handleProjectNavigation(project.id)}
                            className="h-auto p-0 text-xs font-medium text-primary hover:text-primary/80 hover:underline"
                          >
                            {project.projectNumber}
                          </Button>
                        </TableCell>
                      )}
                      {stageColumnVisibility.projectName && (
                        <TableCell className="px-3 py-2">
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => handleProjectNavigation(project.id)}
                            className="h-auto p-0 text-xs text-primary hover:text-primary/80 hover:underline text-left justify-start"
                          >
                            {project.name}
                          </Button>
                        </TableCell>
                      )}
                      {stageColumnVisibility.currentStage && (
                        <TableCell className="px-3 py-2">
                          <Badge variant="outline" className="text-xs px-2 py-0.5 h-5">
                            {project.currentStage}
                          </Badge>
                        </TableCell>
                      )}
                      {stageColumnVisibility.preconBudget && (
                        <TableCell className="px-3 py-2 font-medium text-sm">
                          {formatCurrency(project.preconBudget || project.projectBudget * 0.15)}
                        </TableCell>
                      )}
                      {stageColumnVisibility.designBudget && (
                        <TableCell className="px-3 py-2 font-medium text-sm">
                          {formatCurrency(project.designBudget || project.projectBudget * 0.12)}
                        </TableCell>
                      )}
                      {stageColumnVisibility.billedToDate && (
                        <TableCell className="px-3 py-2 text-sm">{formatCurrency(project.billedToDate)}</TableCell>
                      )}
                      {stageColumnVisibility.leadEstimator && (
                        <TableCell className="px-3 py-2">
                          <span className="text-xs">{project.leadEstimator || "JASON"}</span>
                        </TableCell>
                      )}
                      {stageColumnVisibility.px && (
                        <TableCell className="px-3 py-2">
                          <span className="text-xs">{project.px || "ALEX"}</span>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}

                  {/* Totals Row */}
                  <TableRow className="border-t-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 font-semibold">
                    {stageColumnVisibility.projectNumber && (
                      <TableCell className="px-3 py-2 text-xs font-bold">TOTALS</TableCell>
                    )}
                    {stageColumnVisibility.projectName && <TableCell className="px-3 py-2"></TableCell>}
                    {stageColumnVisibility.currentStage && <TableCell className="px-3 py-2"></TableCell>}
                    {stageColumnVisibility.preconBudget && (
                      <TableCell className="px-3 py-2 font-bold text-sm">
                        {formatCurrency(totals.preconBudget)}
                      </TableCell>
                    )}
                    {stageColumnVisibility.designBudget && (
                      <TableCell className="px-3 py-2 font-bold text-sm">
                        {formatCurrency(totals.designBudget)}
                      </TableCell>
                    )}
                    {stageColumnVisibility.billedToDate && (
                      <TableCell className="px-3 py-2 font-bold text-sm">
                        {formatCurrency(totals.billedToDate)}
                      </TableCell>
                    )}
                    {stageColumnVisibility.leadEstimator && <TableCell className="px-3 py-2"></TableCell>}
                    {stageColumnVisibility.px && <TableCell className="px-3 py-2"></TableCell>}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const EstimatesTab = ({ isEditMode }: { isEditMode: boolean }) => (
    <div className="space-y-4">
      <MetricGrid metrics={estimateMetrics} />

      <Card>
        <CardHeader className="pb-3">
          <InlineSearchFilter title="Estimate Analysis" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  {estimatesColumnVisibility.project && (
                    <TableHead className="h-10 px-3 text-xs font-semibold">Project</TableHead>
                  )}
                  {estimatesColumnVisibility.estimateType && (
                    <TableHead className="h-10 px-3 text-xs font-semibold">Estimate Type</TableHead>
                  )}
                  {estimatesColumnVisibility.estimatedCost && (
                    <TableHead className="h-10 px-3 text-xs font-semibold">Estimated Cost</TableHead>
                  )}
                  {estimatesColumnVisibility.costPerSqf && (
                    <TableHead className="h-10 px-3 text-xs font-semibold">Cost per SqFt</TableHead>
                  )}
                  {estimatesColumnVisibility.costPerLft && (
                    <TableHead className="h-10 px-3 text-xs font-semibold">Cost per LF</TableHead>
                  )}
                  {estimatesColumnVisibility.squareFootage && (
                    <TableHead className="h-10 px-3 text-xs font-semibold">Square Footage</TableHead>
                  )}
                  {estimatesColumnVisibility.submittedDate && (
                    <TableHead className="h-10 px-3 text-xs font-semibold">Submitted Date</TableHead>
                  )}
                  {estimatesColumnVisibility.awarded && (
                    <TableHead className="h-10 px-3 text-xs font-semibold">Awarded</TableHead>
                  )}
                  {estimatesColumnVisibility.precon && (
                    <TableHead className="h-10 px-3 text-xs font-semibold">Precon</TableHead>
                  )}
                  {estimatesColumnVisibility.actions && (
                    <TableHead className="h-10 px-3 text-xs font-semibold">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-muted/30 border-b border-border/50">
                    {estimatesColumnVisibility.project && (
                      <TableCell className="px-3 py-2">
                        <div className="space-y-0.5">
                          <div className="font-medium text-sm leading-tight">{project.name}</div>
                          <div className="text-xs text-muted-foreground leading-tight">
                            {project.projectNumber} • {project.client}
                          </div>
                        </div>
                      </TableCell>
                    )}
                    {estimatesColumnVisibility.estimateType && (
                      <TableCell className="px-3 py-2">
                        <Badge variant="outline" className="text-xs px-2 py-0.5 h-5">
                          {project.estimateType}
                        </Badge>
                      </TableCell>
                    )}
                    {estimatesColumnVisibility.estimatedCost && (
                      <TableCell className="px-3 py-2 font-medium text-sm">
                        {formatCurrency(project.estimatedCost)}
                      </TableCell>
                    )}
                    {estimatesColumnVisibility.costPerSqf && (
                      <TableCell className="px-3 py-2 text-sm">${project.costPerSqf.toFixed(2)}</TableCell>
                    )}
                    {estimatesColumnVisibility.costPerLft && (
                      <TableCell className="px-3 py-2 text-sm">${project.costPerLft.toFixed(2)}</TableCell>
                    )}
                    {estimatesColumnVisibility.squareFootage && (
                      <TableCell className="px-3 py-2 text-sm">{project.sqft.toLocaleString()} SqFt</TableCell>
                    )}
                    {estimatesColumnVisibility.submittedDate && (
                      <TableCell className="px-3 py-2 text-sm">{formatDate(project.submitted)}</TableCell>
                    )}
                    {estimatesColumnVisibility.awarded && (
                      <TableCell className="px-3 py-2">
                        {project.awarded ? (
                          <Badge
                            variant="default"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-0.5 h-5"
                          >
                            <CheckCircle className="h-2.5 w-2.5 mr-1" />
                            Awarded
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs px-2 py-0.5 h-5">
                            <XCircle className="h-2.5 w-2.5 mr-1" />
                            Not Awarded
                          </Badge>
                        )}
                      </TableCell>
                    )}
                    {estimatesColumnVisibility.precon && (
                      <TableCell className="px-3 py-2">
                        {project.awardedPrecon ? (
                          <Badge
                            variant="default"
                            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-0.5 h-5"
                          >
                            <CheckCircle className="h-2.5 w-2.5 mr-1" />
                            Awarded
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs px-2 py-0.5 h-5">
                            <XCircle className="h-2.5 w-2.5 mr-1" />
                            Not Awarded
                          </Badge>
                        )}
                      </TableCell>
                    )}
                    {estimatesColumnVisibility.actions && (
                      <TableCell className="px-3 py-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleProjectNavigation(project.id)}
                          className="h-6 w-6 p-0"
                        >
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  if (isLoading) {
    return <BidManagementSkeleton />
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Bid Management Center</h2>
            <p className="text-muted-foreground">
              Comprehensive project bidding and delivery tracking system with real-time BuildingConnected integration
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleSync} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Sync with BuildingConnected
            </Button>
            <Button size="sm" onClick={handleCreateProject}>
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsEditMode(!isEditMode)}>
              <Eye className="h-4 w-4 mr-2" />
              {isEditMode ? "View Mode" : "Edit Mode"}
            </Button>
            <ExportButton data={filteredProjects} fileName="BidTracking2025" />
          </div>
        </div>
      )}

      {/* Column Settings Dialogs */}
      <div>
        {activeTab === "delivery" && (
          <ColumnSettingsDialog
            columns={DELIVERY_COLUMNS}
            tabId="delivery"
            onVisibilityChange={setDeliveryColumnVisibility}
            open={columnDialogOpen}
            onOpenChange={setColumnDialogOpen}
            showTrigger={false}
          />
        )}
        {activeTab === "stage" && (
          <ColumnSettingsDialog
            columns={STAGE_COLUMNS}
            tabId="stage"
            onVisibilityChange={setStageColumnVisibility}
            open={columnDialogOpen}
            onOpenChange={setColumnDialogOpen}
            showTrigger={false}
          />
        )}
        {activeTab === "estimates" && (
          <ColumnSettingsDialog
            columns={ESTIMATES_COLUMNS}
            tabId="estimates"
            onVisibilityChange={setEstimatesColumnVisibility}
            open={columnDialogOpen}
            onOpenChange={setColumnDialogOpen}
            showTrigger={false}
          />
        )}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabId)} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="delivery">Current Pursuits</TabsTrigger>
          <TabsTrigger value="stage">Pre-Construction Projects</TabsTrigger>
          <TabsTrigger value="estimates">Estimates</TabsTrigger>
        </TabsList>

        <TabsContent value="delivery" className="space-y-4">
          <DeliveryTrackingTab isEditMode={isEditMode} />
        </TabsContent>

        <TabsContent value="stage" className="space-y-4">
          <CurrentStageTab isEditMode={isEditMode} />
        </TabsContent>

        <TabsContent value="estimates" className="space-y-4">
          <EstimatesTab isEditMode={isEditMode} />
        </TabsContent>
      </Tabs>

      {/* New Pursuit Modal */}
      <NewPursuitModal
        open={newPursuitModalOpen}
        onOpenChange={setNewPursuitModalOpen}
        onSubmit={handlePursuitSubmit}
        editingData={editingPursuitData}
        mode={pursuitEditMode}
      />
    </div>
  )
}

export default BidManagementCenter
