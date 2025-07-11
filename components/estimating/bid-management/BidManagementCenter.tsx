"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import { Progress } from "../../ui/progress"
import { Alert, AlertDescription } from "../../ui/alert"
import { Skeleton } from "../../ui/skeleton"
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

// Enhanced TypeScript interfaces
type UserRole = "estimator" | "project-manager" | "executive" | "admin"
type TabId = "delivery" | "stage" | "estimates"

interface BidManagementCenterProps {
  userRole: UserRole
  className?: string
  projectId?: string
  onProjectSelect?: (projectId: string) => void
  initialTab?: TabId
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
}) => {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab)
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  // Column visibility state for each tab
  const [deliveryColumnVisibility, setDeliveryColumnVisibility] = useState<ColumnVisibility>({})
  const [stageColumnVisibility, setStageColumnVisibility] = useState<ColumnVisibility>({})
  const [estimatesColumnVisibility, setEstimatesColumnVisibility] = useState<ColumnVisibility>({})

  const router = useRouter()
  const { toast } = useToast()

  // Use the bid pursuits hook
  const { data: pursuitData, isLoading, updateProject } = useBidPursuits()

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
      id: "total-projects",
      title: "Total Projects",
      icon: Building2,
      value: dashboardMetrics.totalProjects,
      description: "Active tracking",
    },
    {
      id: "open-bids",
      title: "Open Bids",
      icon: Eye,
      value: dashboardMetrics.openBids,
      description: "Awaiting submission",
    },
    {
      id: "complete-deliverables",
      title: "Complete Deliverables",
      icon: CheckCircle,
      value: dashboardMetrics.completeDeliverables,
      description: "Ready for review",
    },
    {
      id: "in-progress",
      title: "In Progress",
      icon: Activity,
      value: dashboardMetrics.inProgress,
      description: "Active projects",
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
    <div className="space-y-6">
      <MetricGrid metrics={deliveryMetrics} />

      <Card>
        <CardHeader>
          <CardTitle>Project Delivery Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {deliveryColumnVisibility.project && <TableHead>Project</TableHead>}
                  {deliveryColumnVisibility.schedule && <TableHead>Schedule</TableHead>}
                  {deliveryColumnVisibility.deliverable && <TableHead>Deliverable</TableHead>}
                  {deliveryColumnVisibility.bidBookLog && <TableHead>Bid Book Log</TableHead>}
                  {deliveryColumnVisibility.review && <TableHead>Review</TableHead>}
                  {deliveryColumnVisibility.programming && <TableHead>Programming</TableHead>}
                  {deliveryColumnVisibility.pricing && <TableHead>Pricing</TableHead>}
                  {deliveryColumnVisibility.leanEstimating && <TableHead>Lean Estimating</TableHead>}
                  {deliveryColumnVisibility.finalEstimate && <TableHead>Final Estimate</TableHead>}
                  {deliveryColumnVisibility.contributors && <TableHead>Contributors</TableHead>}
                  {deliveryColumnVisibility.bidBond && <TableHead>Bid Bond</TableHead>}
                  {deliveryColumnVisibility.actions && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-muted/50">
                    {deliveryColumnVisibility.project && (
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {project.projectNumber} • {project.client}
                          </div>
                          <div className="text-sm text-muted-foreground">{project.location}</div>
                        </div>
                      </TableCell>
                    )}
                    {deliveryColumnVisibility.schedule && (
                      <TableCell>
                        {isEditMode ? (
                          <EditableField
                            value={project.schedule}
                            onChange={(value) => handleFieldUpdate(project.id, "schedule", value)}
                            type="select"
                            options={scheduleOptions}
                            className="min-w-[120px]"
                          />
                        ) : (
                          <Badge variant="secondary" className={getScheduleColor(project.schedule)}>
                            {project.schedule}
                          </Badge>
                        )}
                      </TableCell>
                    )}
                    {deliveryColumnVisibility.deliverable && (
                      <TableCell>
                        {isEditMode ? (
                          <EditableField
                            value={project.deliverable}
                            onChange={(value) => handleFieldUpdate(project.id, "deliverable", value)}
                            type="select"
                            options={deliverableOptions}
                            className="min-w-[130px]"
                          />
                        ) : (
                          <Badge variant="outline">{project.deliverable}</Badge>
                        )}
                      </TableCell>
                    )}
                    {deliveryColumnVisibility.bidBookLog && (
                      <TableCell>
                        {isEditMode ? (
                          <EditableField
                            value={project.bidBookLog}
                            onChange={(value) => handleFieldUpdate(project.id, "bidBookLog", value)}
                            type="select"
                            options={statusOptions}
                            className="min-w-[110px]"
                          />
                        ) : (
                          <Badge variant="outline">{project.bidBookLog}</Badge>
                        )}
                      </TableCell>
                    )}
                    {deliveryColumnVisibility.review && (
                      <TableCell>
                        {isEditMode ? (
                          <EditableField
                            value={project.review}
                            onChange={(value) => handleFieldUpdate(project.id, "review", value)}
                            type="select"
                            options={statusOptions}
                            className="min-w-[110px]"
                          />
                        ) : (
                          <Badge variant="outline">{project.review}</Badge>
                        )}
                      </TableCell>
                    )}
                    {deliveryColumnVisibility.programming && (
                      <TableCell>
                        {isEditMode ? (
                          <EditableField
                            value={project.programming}
                            onChange={(value) => handleFieldUpdate(project.id, "programming", value)}
                            type="select"
                            options={statusOptions}
                            className="min-w-[110px]"
                          />
                        ) : (
                          <Badge variant="outline">{project.programming}</Badge>
                        )}
                      </TableCell>
                    )}
                    {deliveryColumnVisibility.pricing && (
                      <TableCell>
                        {isEditMode ? (
                          <EditableField
                            value={project.pricing}
                            onChange={(value) => handleFieldUpdate(project.id, "pricing", value)}
                            type="number"
                            className="min-w-[80px]"
                          />
                        ) : (
                          <div className="space-y-1">
                            <Progress value={project.pricing} className="h-2" />
                            <div className="text-sm text-muted-foreground">{project.pricing}%</div>
                          </div>
                        )}
                      </TableCell>
                    )}
                    {deliveryColumnVisibility.leanEstimating && (
                      <TableCell>
                        {isEditMode ? (
                          <EditableField
                            value={project.leanEstimating}
                            onChange={(value) => handleFieldUpdate(project.id, "leanEstimating", value)}
                            type="select"
                            options={statusOptions}
                            className="min-w-[110px]"
                          />
                        ) : (
                          <Badge variant="outline">{project.leanEstimating}</Badge>
                        )}
                      </TableCell>
                    )}
                    {deliveryColumnVisibility.finalEstimate && (
                      <TableCell>
                        {isEditMode ? (
                          <EditableField
                            value={project.finalEstimate}
                            onChange={(value) => handleFieldUpdate(project.id, "finalEstimate", value)}
                            type="select"
                            options={statusOptions}
                            className="min-w-[110px]"
                          />
                        ) : (
                          <Badge variant="outline">{project.finalEstimate}</Badge>
                        )}
                      </TableCell>
                    )}
                    {deliveryColumnVisibility.contributors && (
                      <TableCell>
                        {isEditMode ? (
                          <EditableField
                            value={project.contributors}
                            onChange={(value) => handleFieldUpdate(project.id, "contributors", value)}
                            type="text"
                            placeholder="Enter contributors"
                            className="min-w-[100px]"
                          />
                        ) : (
                          <Badge variant="outline">{project.contributors}</Badge>
                        )}
                      </TableCell>
                    )}
                    {deliveryColumnVisibility.bidBond && (
                      <TableCell>
                        {isEditMode ? (
                          <EditableField
                            value={project.bidBond}
                            onChange={(value) => handleFieldUpdate(project.id, "bidBond", value)}
                            type="select"
                            options={bidBondOptions}
                            className="min-w-[120px]"
                          />
                        ) : (
                          <Badge variant="outline">{project.bidBond}</Badge>
                        )}
                      </TableCell>
                    )}
                    {deliveryColumnVisibility.actions && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleProjectNavigation(project.id)}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronRight className="h-4 w-4" />
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

  const CurrentStageTab = ({ isEditMode }: { isEditMode: boolean }) => (
    <div className="space-y-6">
      <MetricGrid metrics={stageMetrics} />

      <Card>
        <CardHeader>
          <CardTitle>Current Project Stage Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {stageColumnVisibility.project && <TableHead>Project</TableHead>}
                  {stageColumnVisibility.currentStage && <TableHead>Current Stage</TableHead>}
                  {stageColumnVisibility.projectBudget && <TableHead>Project Budget</TableHead>}
                  {stageColumnVisibility.originalBudget && <TableHead>Original Budget</TableHead>}
                  {stageColumnVisibility.billedToDate && <TableHead>Billed to Date</TableHead>}
                  {stageColumnVisibility.remainingBudget && <TableHead>Remaining Budget</TableHead>}
                  {stageColumnVisibility.budgetVariance && <TableHead>Budget Variance</TableHead>}
                  {stageColumnVisibility.actions && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-muted/50">
                    {stageColumnVisibility.project && (
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {project.projectNumber} • {project.client}
                          </div>
                          <div className="text-sm text-muted-foreground">{project.location}</div>
                        </div>
                      </TableCell>
                    )}
                    {stageColumnVisibility.currentStage && (
                      <TableCell>
                        <Badge variant="outline">{project.currentStage}</Badge>
                      </TableCell>
                    )}
                    {stageColumnVisibility.projectBudget && (
                      <TableCell className="font-medium">{formatCurrency(project.projectBudget)}</TableCell>
                    )}
                    {stageColumnVisibility.originalBudget && (
                      <TableCell className="font-medium">{formatCurrency(project.originalBudget)}</TableCell>
                    )}
                    {stageColumnVisibility.billedToDate && (
                      <TableCell>{formatCurrency(project.billedToDate)}</TableCell>
                    )}
                    {stageColumnVisibility.remainingBudget && (
                      <TableCell>{formatCurrency(project.remainingBudget)}</TableCell>
                    )}
                    {stageColumnVisibility.budgetVariance && (
                      <TableCell>
                        {project.projectBudget === project.originalBudget ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            On Budget
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            {project.projectBudget > project.originalBudget ? "Over Budget" : "Under Budget"}
                          </Badge>
                        )}
                      </TableCell>
                    )}
                    {stageColumnVisibility.actions && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleProjectNavigation(project.id)}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronRight className="h-4 w-4" />
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

  const EstimatesTab = ({ isEditMode }: { isEditMode: boolean }) => (
    <div className="space-y-6">
      <MetricGrid metrics={estimateMetrics} />

      <Card>
        <CardHeader>
          <CardTitle>Estimate Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {estimatesColumnVisibility.project && <TableHead>Project</TableHead>}
                  {estimatesColumnVisibility.estimateType && <TableHead>Estimate Type</TableHead>}
                  {estimatesColumnVisibility.estimatedCost && <TableHead>Estimated Cost</TableHead>}
                  {estimatesColumnVisibility.costPerSqf && <TableHead>Cost per SqFt</TableHead>}
                  {estimatesColumnVisibility.costPerLft && <TableHead>Cost per LF</TableHead>}
                  {estimatesColumnVisibility.squareFootage && <TableHead>Square Footage</TableHead>}
                  {estimatesColumnVisibility.submittedDate && <TableHead>Submitted Date</TableHead>}
                  {estimatesColumnVisibility.awarded && <TableHead>Awarded</TableHead>}
                  {estimatesColumnVisibility.precon && <TableHead>Precon</TableHead>}
                  {estimatesColumnVisibility.actions && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-muted/50">
                    {estimatesColumnVisibility.project && (
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {project.projectNumber} • {project.client}
                          </div>
                        </div>
                      </TableCell>
                    )}
                    {estimatesColumnVisibility.estimateType && (
                      <TableCell>
                        <Badge variant="outline">{project.estimateType}</Badge>
                      </TableCell>
                    )}
                    {estimatesColumnVisibility.estimatedCost && (
                      <TableCell className="font-medium">{formatCurrency(project.estimatedCost)}</TableCell>
                    )}
                    {estimatesColumnVisibility.costPerSqf && <TableCell>${project.costPerSqf.toFixed(2)}</TableCell>}
                    {estimatesColumnVisibility.costPerLft && <TableCell>${project.costPerLft.toFixed(2)}</TableCell>}
                    {estimatesColumnVisibility.squareFootage && (
                      <TableCell>{project.sqft.toLocaleString()} SqFt</TableCell>
                    )}
                    {estimatesColumnVisibility.submittedDate && <TableCell>{formatDate(project.submitted)}</TableCell>}
                    {estimatesColumnVisibility.awarded && (
                      <TableCell>
                        {project.awarded ? (
                          <Badge
                            variant="default"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Awarded
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="h-3 w-3 mr-1" />
                            Not Awarded
                          </Badge>
                        )}
                      </TableCell>
                    )}
                    {estimatesColumnVisibility.precon && (
                      <TableCell>
                        {project.awardedPrecon ? (
                          <Badge
                            variant="default"
                            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Awarded
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="h-3 w-3 mr-1" />
                            Not Awarded
                          </Badge>
                        )}
                      </TableCell>
                    )}
                    {estimatesColumnVisibility.actions && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleProjectNavigation(project.id)}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronRight className="h-4 w-4" />
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

      {/* Search and Filter */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects by name, client, or project number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        {activeTab === "delivery" && (
          <ColumnSettingsDialog
            columns={DELIVERY_COLUMNS}
            tabId="delivery"
            onVisibilityChange={setDeliveryColumnVisibility}
          />
        )}
        {activeTab === "stage" && (
          <ColumnSettingsDialog columns={STAGE_COLUMNS} tabId="stage" onVisibilityChange={setStageColumnVisibility} />
        )}
        {activeTab === "estimates" && (
          <ColumnSettingsDialog
            columns={ESTIMATES_COLUMNS}
            tabId="estimates"
            onVisibilityChange={setEstimatesColumnVisibility}
          />
        )}
      </div>

      {/* Alert for role-specific information */}
      {userRole === "estimator" && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            As an estimator, you can track bid progress, analyze estimates, and manage project deliverables. Click on
            any project to navigate to the detailed project view.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabId)} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="delivery">Delivery Tracking</TabsTrigger>
          <TabsTrigger value="stage">Current Stage</TabsTrigger>
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
    </div>
  )
}

export default BidManagementCenter
