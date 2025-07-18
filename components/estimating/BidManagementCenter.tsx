"use client"

import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useEstimating } from "./EstimatingProvider"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { ProjectPursuit } from "@/types/estimating"

// Lazy load components for better performance
const BidLeveling = lazy(() => import("./bid-management/components/BidLeveling"))

// Import modular tab components
import DeliveryTrackingTab from "./bid-management/tabs/DeliveryTrackingTab"
import CurrentStageTab from "./bid-management/tabs/CurrentStageTab"
import EstimatesTab from "./bid-management/tabs/EstimatesTab"
import {
  Building2,
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  FileText,
  Zap,
  Settings,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Upload,
  RefreshCw,
  MoreHorizontal,
  Archive,
  Trash2,
  Edit,
  Copy,
  Mail,
  MapPin,
  DollarSign,
  Target,
  Star,
  Activity,
  BarChart3,
  PieChart,
  Calendar as CalendarIcon,
  Briefcase,
  Phone,
  Globe,
  LinkIcon,
  Database,
  Layers,
  Wrench,
  FileCheck,
  UserCheck,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  SortAsc,
  SortDesc,
  Calculator,
  Loader2,
} from "lucide-react"

// Enhanced TypeScript interfaces for v3.0 compliance
type UserRole = "estimator" | "project-manager" | "executive" | "admin" | "hr-payroll"
type TabId = "delivery" | "stage" | "estimates" | "bidders" | "forms" | "analytics"

interface BidManagementCenterProps {
  userRole: UserRole
  className?: string
  projectId?: string
  onProjectSelect?: (projectId: string) => void
  initialTab?: TabId
  onError?: (error: Error) => void
}

// Error Boundary Component (MANDATORY for v3.0)
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class BidManagementErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("BidManagementCenter Error:", error, errorInfo)
    // In production, this would send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <Alert className="m-4">
            <AlertDescription>
              Something went wrong with the Bid Management Center. Please refresh the page or contact support.
            </AlertDescription>
          </Alert>
        )
      )
    }

    return this.props.children
  }
}

// Loading Skeleton Component (MANDATORY for v3.0)
const BidManagementSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-6 w-32" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
    <Skeleton className="h-96 w-full" />
  </div>
)

// Enhanced mock data with real project IDs from system
const mockProjectTrackingData: ProjectPursuit[] = [
  {
    // Miami Commercial Tower - Real project ID from system
    id: "2525841",
    name: "Miami Commercial Tower",
    client: "Innovation Corp",
    location: "Miami, FL",
    projectNumber: "FL-SE-002",

    // Schedule & Delivery Tracking (from top table in image)
    schedule: "On Track",
    deliverable: "GMP PACKAGE",
    bidBookLog: "COMPLETE",
    review: "IN PROGRESS",
    programming: "COMPLETE",
    pricing: 60,
    leanEstimating: "SCHEDULED",
    finalEstimate: "PENDING",
    contributors: "DUKE",
    bidBond: "REQUIRED",

    // Current Stage & Budget (from middle table in image)
    currentStage: "DD",
    projectBudget: 250000000,
    originalBudget: 250000000,
    billedToDate: 13139.0,
    remainingBudget: 249986861.0,

    // Estimates & Cost Analysis (from bottom table in image)
    estimateType: "CONCEPTUAL ESTIMATE",
    costPerSqf: 500.0,
    costPerLft: 1000.0,
    submitted: "01/15/2025",
    awarded: false,
    awardedPrecon: false,

    // Additional tracking fields
    bidDueDate: "2025-02-15",
    status: "Open",
    estimatedCost: 250000000,
    lead: "Sarah Chen",
    confidence: 85,
    riskLevel: "Medium",
    sqft: 500000,
  },
  {
    // Coral Gables Luxury Condominium - Real project ID from system
    id: "2525851",
    name: "Coral Gables Luxury Condominium",
    client: "Miami-Dade Development",
    location: "Coral Gables, FL",
    projectNumber: "FL-SE-006",

    schedule: "Delayed",
    deliverable: "LUMP SUM PROPOSAL",
    bidBookLog: "IN PROGRESS",
    review: "COMPLETE",
    programming: "COMPLETE",
    pricing: 100,
    leanEstimating: "COMPLETE",
    finalEstimate: "SUBMITTED",
    contributors: "SAM",
    bidBond: "WAIVED",

    currentStage: "CD",
    projectBudget: 140000000,
    originalBudget: 140000000,
    billedToDate: 24500.0,
    remainingBudget: 139975500.0,

    estimateType: "LUMP SUM PROPOSAL",
    costPerSqf: 500.0,
    costPerLft: 800.0,
    submitted: "12/20/2024",
    awarded: true,
    awardedPrecon: true,

    bidDueDate: "2025-01-25",
    status: "Awarded",
    estimatedCost: 140000000,
    lead: "Mike Rodriguez",
    confidence: 92,
    riskLevel: "Low",
    sqft: 280000,
  },
  {
    // Naples Waterfront Condominium - Real project ID from system
    id: "2525843",
    name: "Naples Waterfront Condominium",
    client: "Naples Development LLC",
    location: "Naples, FL",
    projectNumber: "FL-SW-001",

    schedule: "Fast Track",
    deliverable: "CONCEPTUAL EST",
    bidBookLog: "PENDING",
    review: "SCHEDULED",
    programming: "IN PROGRESS",
    pricing: 25,
    leanEstimating: "NOT STARTED",
    finalEstimate: "TBD",
    contributors: "VITO",
    bidBond: "TBD",

    currentStage: "SD",
    projectBudget: 120000000,
    originalBudget: 120000000,
    billedToDate: 8500.0,
    remainingBudget: 119991500.0,

    estimateType: "CONCEPTUAL ESTIMATE",
    costPerSqf: 600.0,
    costPerLft: 1200.0,
    submitted: "TBD",
    awarded: false,
    awardedPrecon: false,

    bidDueDate: "2025-03-01",
    status: "Open",
    estimatedCost: 120000000,
    lead: "Jennifer Park",
    confidence: 78,
    riskLevel: "High",
    sqft: 200000,
  },
  {
    id: "bc-004",
    name: "Luxury Hotel Downtown",
    client: "Hospitality Group LLC",
    location: "Nashville, TN",
    projectNumber: "2025-004",

    schedule: "On Track",
    deliverable: "GMP PACKAGE",
    bidBookLog: "COMPLETE",
    review: "COMPLETE",
    programming: "COMPLETE",
    pricing: 85,
    leanEstimating: "IN PROGRESS",
    finalEstimate: "IN PROGRESS",
    contributors: "HANK",
    bidBond: "OBTAINED",

    currentStage: "CD",
    projectBudget: 85000000,
    originalBudget: 82000000,
    billedToDate: 45600.0,
    remainingBudget: 84954400.0,

    estimateType: "GMP ESTIMATE",
    costPerSqf: 485.3,
    costPerLft: 0,
    submitted: "01/08/2025",
    awarded: false,
    awardedPrecon: true,

    bidDueDate: "2025-02-28",
    status: "Open",
    estimatedCost: 78500000,
    lead: "Alex Johnson",
    confidence: 88,
    riskLevel: "Medium",
    sqft: 175000,
  },
  {
    id: "bc-005",
    name: "Manufacturing Facility Expansion",
    client: "Industrial Partners Inc",
    location: "Memphis, TN",
    projectNumber: "2025-005",

    schedule: "Accelerated",
    deliverable: "LUMP SUM PROPOSAL",
    bidBookLog: "IN PROGRESS",
    review: "PENDING",
    programming: "COMPLETE",
    pricing: 45,
    leanEstimating: "SCHEDULED",
    finalEstimate: "PENDING",
    contributors: "PAUL",
    bidBond: "REQUIRED",

    currentStage: "DD",
    projectBudget: 32000000,
    originalBudget: 30500000,
    billedToDate: 18750.0,
    remainingBudget: 31981250.0,

    estimateType: "CONCEPTUAL ESTIMATE",
    costPerSqf: 285.6,
    costPerLft: 450.0,
    submitted: "TBD",
    awarded: false,
    awardedPrecon: false,

    bidDueDate: "2025-04-10",
    status: "Open",
    estimatedCost: 32000000,
    lead: "David Kim",
    confidence: 71,
    riskLevel: "Medium",
    sqft: 112000,
  },
]

// Mock bidder templates
const mockBidderTemplates = [
  {
    id: "template-001",
    name: "Commercial Office Standard",
    description: "Standard bidder list for commercial office projects",
    scopes: [
      "03 - Concrete",
      "04 - Masonry",
      "05 - Metals",
      "06 - Wood",
      "07 - Thermal",
      "08 - Openings",
      "09 - Finishes",
    ],
    regions: ["Southeast", "Mid-Atlantic"],
    bidderCount: 24,
    usageCount: 12,
    lastUsed: "2025-01-10",
    defaultMessage:
      "You are invited to submit a bid for this commercial office project. Please review the attached specifications and submit your proposal by the due date.",
  },
  {
    id: "template-002",
    name: "Healthcare Specialized",
    description: "Specialized bidder list for healthcare facilities",
    scopes: ["11 - Equipment", "13 - Special Construction", "22 - Plumbing", "23 - HVAC", "26 - Electrical"],
    regions: ["Southeast"],
    bidderCount: 18,
    usageCount: 8,
    lastUsed: "2025-01-05",
    defaultMessage:
      "You are invited to bid on this healthcare facility project. Special attention to healthcare regulations and compliance requirements.",
  },
]

// Mock bid form templates
const mockBidFormTemplates = [
  {
    id: "form-001",
    name: "Standard GC Bid Form",
    description: "Standard general contractor bid form with common line items",
    category: "General Contractor",
    lineItemCount: 15,
    customFields: 3,
    lastModified: "2025-01-12",
    usageCount: 25,
    fields: [
      { name: "Base Bid Amount", type: "currency", required: true },
      { name: "Alternate 1", type: "currency", required: false },
      { name: "Unit Price - Concrete", type: "currency", required: true },
      { name: "Bond Rate", type: "percentage", required: true },
      { name: "Project Duration", type: "number", required: true },
    ],
  },
  {
    id: "form-002",
    name: "Trade-Specific Electrical",
    description: "Electrical contractor bid form with specialized line items",
    category: "Electrical",
    lineItemCount: 12,
    customFields: 5,
    lastModified: "2025-01-08",
    usageCount: 18,
    fields: [
      { name: "Base Electrical Work", type: "currency", required: true },
      { name: "Emergency Power Systems", type: "currency", required: false },
      { name: "Fire Alarm Systems", type: "currency", required: false },
      { name: "Unit Price - Outlets", type: "currency", required: true },
      { name: "Material Escalation", type: "percentage", required: true },
    ],
  },
]

// Enhanced component with React.memo for performance (MANDATORY for v3.0)
const BidManagementCenterComponent = React.memo<BidManagementCenterProps>(
  ({ userRole, className = "", projectId, onProjectSelect, initialTab = "delivery", onError }) => {
    const router = useRouter()
    const { toast } = useToast()
    const [activeTab, setActiveTab] = useState<TabId>(initialTab)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedProject, setSelectedProject] = useState<string | null>(projectId || null)
    const [showCreateProject, setShowCreateProject] = useState(false)
    const [showCreateTemplate, setShowCreateTemplate] = useState(false)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [sortBy, setSortBy] = useState<string>("dueDate")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
    const [isLoading, setIsLoading] = useState(false)
    const [lastSync, setLastSync] = useState(new Date())
    const [isMobile, setIsMobile] = useState(false)

    // Add editing state for inline editing capabilities
    const [editingProject, setEditingProject] = useState<string | null>(null)
    const [editingField, setEditingField] = useState<string | null>(null)
    const [editValues, setEditValues] = useState<Record<string, any>>({})

    const { projects, isLoading: contextLoading, bidTabs, tradeBids } = useEstimating()

    // Mobile detection effect (MANDATORY for v3.0 responsive design)
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }

      checkMobile()
      window.addEventListener("resize", checkMobile)
      return () => window.removeEventListener("resize", checkMobile)
    }, [])

    // Error handling effect
    useEffect(() => {
      if (onError) {
        const handleError = (error: ErrorEvent) => {
          onError(new Error(error.message))
        }
        window.addEventListener("error", handleError)
        return () => window.removeEventListener("error", handleError)
      }
    }, [onError])

    // Filter and sort projects
    const filteredProjects = useMemo(() => {
      let filtered = mockProjectTrackingData.filter((project) => {
        const matchesSearch =
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.location.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || project.status.toLowerCase() === statusFilter.toLowerCase()

        return matchesSearch && matchesStatus
      })

      // Sort projects
      filtered.sort((a, b) => {
        let aValue: any = a[sortBy as keyof typeof a]
        let bValue: any = b[sortBy as keyof typeof b]

        if (sortBy === "bidDueDate" || sortBy === "createdDate" || sortBy === "lastActivity") {
          aValue = new Date(aValue)
          bValue = new Date(bValue)
        } else if (sortBy === "projectValue" || sortBy === "estimatedCost") {
          aValue = Number(aValue)
          bValue = Number(bValue)
        }

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
        return 0
      })

      return filtered
    }, [searchTerm, statusFilter, sortBy, sortOrder])

    // Calculate dashboard metrics
    const dashboardMetrics = useMemo(() => {
      const totalProjects = mockProjectTrackingData.length
      const openProjects = mockProjectTrackingData.filter((p) => p.status === "Open").length
      const awardedProjects = mockProjectTrackingData.filter((p) => p.status === "Awarded").length
      const totalValue = mockProjectTrackingData.reduce((sum, p) => sum + p.projectBudget, 0)
      const avgConfidence = mockProjectTrackingData.reduce((sum, p) => sum + p.confidence, 0) / totalProjects

      return {
        totalProjects,
        openProjects,
        awardedProjects,
        totalValue,
        avgConfidence,
        responseRate: 75.5, // Static value since bidderCount/responseCount removed
        totalBidders: totalProjects * 12, // Estimated based on project count
        totalResponses: Math.round(totalProjects * 12 * 0.755), // Calculated from response rate
      }
    }, [])

    // Enhanced callbacks with useCallback for performance (MANDATORY for v3.0)
    const handleSync = useCallback(async () => {
      try {
        setIsLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setLastSync(new Date())
        toast({
          title: "Sync Complete",
          description: "BuildingConnected data synchronized successfully.",
        })
      } catch (error) {
        toast({
          title: "Sync Failed",
          description: "Failed to sync with BuildingConnected API.",
          variant: "destructive",
        })
        if (onError) {
          onError(error as Error)
        }
      } finally {
        setIsLoading(false)
      }
    }, [toast, onError])

    const handleTabChange = useCallback((value: string) => {
      setActiveTab(value as TabId)
    }, [])

    // Fixed routing logic to match ProjectSidebar behavior
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

    // Enhanced keyboard navigation (MANDATORY for v3.0 accessibility)
    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowCreateProject(false)
        setShowCreateTemplate(false)
        setShowCreateForm(false)
      }
    }, [])

    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case "open":
          return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
        case "awarded":
          return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
        case "archived":
          return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
        case "closed":
          return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      }
    }

    const getRiskColor = (risk: string) => {
      switch (risk.toLowerCase()) {
        case "low":
          return "text-green-600 dark:text-green-400"
        case "medium":
          return "text-yellow-600 dark:text-yellow-400"
        case "high":
          return "text-red-600 dark:text-red-400"
        default:
          return "text-gray-600 dark:text-gray-400"
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

    const getDaysUntilDue = (dueDate: string) => {
      const due = new Date(dueDate)
      const today = new Date()
      const diffTime = due.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    }

    // Editing functionality callbacks
    const handleStartEdit = useCallback((projectId: string, field: string, currentValue: any) => {
      setEditingProject(projectId)
      setEditingField(field)
      setEditValues({ [field]: currentValue })
    }, [])

    const handleSaveEdit = useCallback(
      async (projectId: string, field: string, newValue: any) => {
        try {
          // In a real application, this would make an API call to update the project
          // For now, we'll just simulate the save operation
          await new Promise((resolve) => setTimeout(resolve, 500))

          toast({
            title: "Field Updated",
            description: `${field} has been updated successfully.`,
          })

          setEditingProject(null)
          setEditingField(null)
          setEditValues({})
        } catch (error) {
          toast({
            title: "Update Failed",
            description: "Failed to update the field. Please try again.",
            variant: "destructive",
          })
        }
      },
      [toast]
    )

    const handleCancelEdit = useCallback(() => {
      setEditingProject(null)
      setEditingField(null)
      setEditValues({})
    }, [])

    // Project navigation handled by enhanced useCallback above

    // Editable Field Component for inline editing
    const EditableField = ({
      projectId,
      field,
      value,
      type = "text",
      className = "",
      displayComponent,
    }: {
      projectId: string
      field: string
      value: any
      type?: "text" | "number" | "currency" | "select"
      className?: string
      displayComponent?: React.ReactNode
    }) => {
      const isEditing = editingProject === projectId && editingField === field
      const currentValue = editValues[field] !== undefined ? editValues[field] : value

      if (isEditing) {
        return (
          <div className="flex items-center gap-2">
            {type === "currency" ? (
              <Input
                type="number"
                value={currentValue}
                onChange={(e) => setEditValues({ ...editValues, [field]: parseFloat(e.target.value) || 0 })}
                className="w-32"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit(projectId, field, currentValue)
                  if (e.key === "Escape") handleCancelEdit()
                }}
                autoFocus
              />
            ) : type === "number" ? (
              <Input
                type="number"
                value={currentValue}
                onChange={(e) => setEditValues({ ...editValues, [field]: parseFloat(e.target.value) || 0 })}
                className="w-24"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit(projectId, field, currentValue)
                  if (e.key === "Escape") handleCancelEdit()
                }}
                autoFocus
              />
            ) : (
              <Input
                type="text"
                value={currentValue}
                onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value })}
                className="w-32"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit(projectId, field, currentValue)
                  if (e.key === "Escape") handleCancelEdit()
                }}
                autoFocus
              />
            )}
            <Button size="sm" onClick={() => handleSaveEdit(projectId, field, currentValue)}>
              <CheckCircle className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
              <XCircle className="h-3 w-3" />
            </Button>
          </div>
        )
      }

      return (
        <div className={`group flex items-center gap-2 ${className}`}>
          {displayComponent || (
            <span className={type === "currency" ? "font-medium" : ""}>
              {type === "currency" ? formatCurrency(value) : value}
            </span>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
            onClick={() => handleStartEdit(projectId, field, value)}
          >
            <Edit className="h-3 w-3" />
          </Button>
        </div>
      )
    }

    // Project Name Link Component
    const ProjectNameLink = ({ project }: { project: ProjectPursuit }) => (
      <div className="space-y-1">
        <Button
          variant="link"
          className="p-0 text-left justify-start font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          onClick={() => handleProjectNavigation(project.id)}
        >
          {project.name}
        </Button>
        <div className="text-sm text-muted-foreground">
          {project.projectNumber} • {project.client}
        </div>
        <div className="text-sm text-muted-foreground">{project.location}</div>
      </div>
    )

    // Delivery Tracking Tab - Now using modular component

    // Tab functions have been extracted to modular components

    const ProjectsTab = () => (
      <div className="space-y-6">
        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
                  <p className="text-2xl font-bold">{dashboardMetrics.totalProjects}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Bids</p>
                  <p className="text-2xl font-bold text-green-600">{dashboardMetrics.openProjects}</p>
                </div>
                <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(dashboardMetrics.totalValue)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Response Rate</p>
                  <p className="text-2xl font-bold">{dashboardMetrics.responseRate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="awarded">Awarded</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="name">Project Name</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="projectValue">Project Value</SelectItem>
                <SelectItem value="lastActivity">Last Activity</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
              {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSync} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Syncing..." : "Sync"}
            </Button>

            <Button onClick={() => setShowCreateProject(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </div>
        </div>

        {/* Projects Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Projects</span>
              <Badge variant="secondary">{filteredProjects.length} projects</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Bidders</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => {
                    const daysUntilDue = getDaysUntilDue(project.bidDueDate)
                    return (
                      <TableRow key={project.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{project.name}</div>
                            <div className="text-sm text-gray-500">{project.projectNumber}</div>
                            <div className="flex gap-1">
                              <Badge variant="outline" className="text-xs">
                                {project.currentStage}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {project.riskLevel}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{project.client}</div>
                          <div className="text-sm text-gray-500">{project.lead}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            {project.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{formatDate(project.bidDueDate)}</div>
                            <div className={`text-sm ${daysUntilDue < 7 ? "text-red-600" : "text-gray-500"}`}>
                              {daysUntilDue > 0 ? `${daysUntilDue} days left` : "Past due"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{formatCurrency(project.projectBudget)}</div>
                            <div className="text-sm text-gray-500">Est: {formatCurrency(project.estimatedCost)}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{project.confidence}% confidence</div>
                            <Progress value={project.confidence} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`font-medium ${getRiskColor(project.riskLevel)}`}>{project.riskLevel}</div>
                            <div className="text-sm text-gray-500">{project.confidence}%</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleProjectNavigation(project.id)}
                              title="View Project"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleProjectNavigation(project.id)}
                              title="Open Project"
                            >
                              <Briefcase className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Sync Status */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Last synced: {lastSync.toLocaleTimeString()}
          </div>
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Connected to BuildingConnected API
          </div>
        </div>
      </div>
    )

    const BidderTemplatesTab = () => (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Bidder List Templates</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage reusable bidder lists for different project types
            </p>
          </div>
          <Button onClick={() => setShowCreateTemplate(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockBidderTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-600 dark:text-gray-400">Bidders</p>
                    <p className="text-lg font-semibold">{template.bidderCount}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600 dark:text-gray-400">Usage</p>
                    <p className="text-lg font-semibold">{template.usageCount}</p>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-gray-600 dark:text-gray-400 mb-2">CSI Scopes</p>
                  <div className="flex flex-wrap gap-1">
                    {template.scopes.slice(0, 3).map((scope, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {scope}
                      </Badge>
                    ))}
                    {template.scopes.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.scopes.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <p className="font-medium text-gray-600 dark:text-gray-400 mb-2">Regions</p>
                  <div className="flex flex-wrap gap-1">
                    {template.regions.map((region, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {region}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-gray-500">Last used: {formatDate(template.lastUsed)}</div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Clone
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )

    const BidFormsTab = () => (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Bid Form Templates</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create and manage bid forms with custom line items and response formats
            </p>
          </div>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Form
          </Button>
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockBidFormTemplates.map((form) => (
            <Card key={form.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{form.name}</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">{form.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-600 dark:text-gray-400">Line Items</p>
                    <p className="text-lg font-semibold">{form.lineItemCount}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600 dark:text-gray-400">Custom Fields</p>
                    <p className="text-lg font-semibold">{form.customFields}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600 dark:text-gray-400">Usage</p>
                    <p className="text-lg font-semibold">{form.usageCount}</p>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-gray-600 dark:text-gray-400 mb-2">Category</p>
                  <Badge variant="secondary">{form.category}</Badge>
                </div>

                <div>
                  <p className="font-medium text-gray-600 dark:text-gray-400 mb-2">Sample Fields</p>
                  <div className="space-y-2">
                    {form.fields.slice(0, 3).map((field, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{field.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {field.type}
                          </Badge>
                          {field.required && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    {form.fields.length > 3 && (
                      <p className="text-xs text-gray-500">+{form.fields.length - 3} more fields</p>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-500">Last modified: {formatDate(form.lastModified)}</div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )

    const AnalyticsTab = () => (
      <div className="space-y-6">
        {/* Analytics Header */}
        <div>
          <h3 className="text-lg font-semibold">Bid Analytics</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track performance metrics and insights across all bid activities
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Win Rate</p>
                  <p className="text-2xl font-bold text-green-600">24.5%</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Bid Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(29333333)}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Bids</p>
                  <p className="text-2xl font-bold">{dashboardMetrics.openProjects}</p>
                </div>
                <Activity className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Bid Volume Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                  <p>Chart visualization coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Win Rate by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto mb-2" />
                  <p>Chart visualization coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )

    return (
      <div
        className={`bid-management-center ${className}`}
        onKeyDown={handleKeyDown}
        role="main"
        aria-label="Bid Management Center"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Bid Management Center</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive bid management powered by BuildingConnected integration
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2" />
                API Connected
              </Badge>
            </div>
          </div>

          {/* Enhanced Tabs with comprehensive project tracking */}
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className={isMobile ? "grid grid-cols-3 gap-1" : "grid w-full grid-cols-6"}>
              <TabsTrigger value="delivery" className={isMobile ? "text-xs" : ""}>
                {isMobile ? "Delivery" : "Delivery Tracking"}
              </TabsTrigger>
              <TabsTrigger value="stage" className={isMobile ? "text-xs" : ""}>
                {isMobile ? "Stage" : "Current Stage"}
              </TabsTrigger>
              <TabsTrigger value="estimates" className={isMobile ? "text-xs" : ""}>
                Estimates
              </TabsTrigger>
              <TabsTrigger value="bidders" className={isMobile ? "text-xs" : ""}>
                {isMobile ? "Templates" : "Bidder Templates"}
              </TabsTrigger>
              <TabsTrigger value="forms" className={isMobile ? "text-xs" : ""}>
                {isMobile ? "Forms" : "Bid Forms"}
              </TabsTrigger>
              <TabsTrigger value="analytics" className={isMobile ? "text-xs" : ""}>
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="delivery" className="space-y-4">
              <DeliveryTrackingTab
                filteredProjects={filteredProjects}
                dashboardMetrics={dashboardMetrics}
                onProjectNavigation={handleProjectNavigation}
                isEditMode={true}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                isLoading={isLoading}
                onSync={handleSync}
              />
            </TabsContent>

            <TabsContent value="stage" className="space-y-4">
              <CurrentStageTab
                filteredProjects={filteredProjects}
                dashboardMetrics={dashboardMetrics}
                onProjectNavigation={handleProjectNavigation}
                isEditMode={true}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                isLoading={isLoading}
                onSync={handleSync}
              />
            </TabsContent>

            <TabsContent value="estimates" className="space-y-4">
              <EstimatesTab
                filteredProjects={filteredProjects}
                dashboardMetrics={dashboardMetrics}
                onProjectNavigation={handleProjectNavigation}
                isEditMode={true}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                isLoading={isLoading}
                onSync={handleSync}
              />
            </TabsContent>

            <TabsContent value="bidders" className="space-y-4">
              <BidderTemplatesTab />
            </TabsContent>

            <TabsContent value="forms" className="space-y-4">
              <BidFormsTab />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <AnalyticsTab />
            </TabsContent>
          </Tabs>

          {/* Create Project Dialog */}
          <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Project Name</label>
                    <Input placeholder="Enter project name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Client</label>
                    <Input placeholder="Enter client name" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input placeholder="Enter location" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Bid Due Date</label>
                    <Input type="date" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Project Value</label>
                  <Input placeholder="Enter project value" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateProject(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowCreateProject(false)}>Create Project</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  }
)

// Enhanced component with Error Boundary wrapper (MANDATORY for v3.0)
export function BidManagementCenter(props: BidManagementCenterProps) {
  return (
    <BidManagementErrorBoundary>
      <Suspense fallback={<BidManagementSkeleton />}>
        <BidManagementCenterComponent {...props} />
      </Suspense>
    </BidManagementErrorBoundary>
  )
}

export default BidManagementCenter
