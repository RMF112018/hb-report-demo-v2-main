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

// Lazy load components for better performance
const BidLeveling = lazy(() => import("./bid-management/components/BidLeveling"))
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
type UserRole = "estimator" | "project-manager" | "executive" | "admin"
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

// Enhanced mock data that captures the comprehensive information from the image
const mockProjectTrackingData = [
  {
    id: "bc-001",
    name: "Downtown Medical Center",
    client: "Healthcare Partners LLC",
    location: "Atlanta, GA",
    projectNumber: "2025-001",

    // Schedule & Delivery Tracking (from top table in image)
    schedule: "On Track",
    deliverable: "GMP PACKAGE",
    bidBookLog: "COMPLETE",
    review: "IN PROGRESS",
    programming: "COMPLETE",
    pricing: "60%",
    leanEstimating: "SCHEDULED",
    finalEstimate: "PENDING",
    contributors: "DUKE",
    bidBond: "REQUIRED",

    // Current Stage & Budget (from middle table in image)
    currentStage: "DD",
    projectBudget: 45000000,
    originalBudget: 42000000,
    billedToDate: 13139.0,
    remainingBudget: 44986861.0,

    // Estimates & Cost Analysis (from bottom table in image)
    estimateType: "CONCEPTUAL ESTIMATE",
    costPerSqf: 425.5,
    costPerLft: 850.0,
    submitted: "01/15/2024",
    awarded: false,
    awardedPrecon: false,
    lastEstimation: "RYAN",

    // Additional tracking fields
    bidDueDate: "2025-02-15",
    status: "Open",
    estimatedCost: 38000000,
    scope: "General Contractor",
    csiScopes: ["03 - Concrete", "04 - Masonry", "05 - Metals"],
    lead: "Sarah Chen",
    bidderCount: 12,
    responseCount: 8,
    createdDate: "2025-01-01",
    lastActivity: "2025-01-14",
    confidence: 85,
    riskLevel: "Medium",
    tags: ["Healthcare", "LEED", "Fast-track"],
    sqft: 105000,
    stories: 4,
    constructionType: "Type II",
    estimator: "DUKE",
    architect: "HKS Inc",
    engineer: "WSP USA",
  },
  {
    id: "bc-002",
    name: "Riverside Office Complex",
    client: "Metro Development",
    location: "Charlotte, NC",
    projectNumber: "2025-002",

    schedule: "Delayed",
    deliverable: "LUMP SUM PROPOSAL",
    bidBookLog: "IN PROGRESS",
    review: "COMPLETE",
    programming: "COMPLETE",
    pricing: "100%",
    leanEstimating: "COMPLETE",
    finalEstimate: "SUBMITTED",
    contributors: "SAM",
    bidBond: "WAIVED",

    currentStage: "CD",
    projectBudget: 28000000,
    originalBudget: 26500000,
    billedToDate: 24500.0,
    remainingBudget: 27975500.0,

    estimateType: "LUMP SUM PROPOSAL",
    costPerSqf: 380.25,
    costPerLft: 0,
    submitted: "12/20/2024",
    awarded: true,
    awardedPrecon: true,
    lastEstimation: "SAM",

    bidDueDate: "2025-01-25",
    status: "Awarded",
    estimatedCost: 24500000,
    scope: "General Contractor",
    csiScopes: ["03 - Concrete", "07 - Thermal & Moisture", "09 - Finishes"],
    lead: "Mike Rodriguez",
    bidderCount: 15,
    responseCount: 12,
    createdDate: "2024-12-15",
    lastActivity: "2025-01-10",
    confidence: 92,
    riskLevel: "Low",
    tags: ["Commercial", "Office", "Sustainable"],
    sqft: 73600,
    stories: 8,
    constructionType: "Type I",
    estimator: "SAM",
    architect: "Gensler",
    engineer: "Thornton Tomasetti",
  },
  {
    id: "bc-003",
    name: "University Research Lab",
    client: "State University",
    location: "Raleigh, NC",
    projectNumber: "2025-003",

    schedule: "Fast Track",
    deliverable: "CONCEPTUAL EST",
    bidBookLog: "PENDING",
    review: "SCHEDULED",
    programming: "IN PROGRESS",
    pricing: "25%",
    leanEstimating: "NOT STARTED",
    finalEstimate: "TBD",
    contributors: "VITO",
    bidBond: "TBD",

    currentStage: "SD",
    projectBudget: 15000000,
    originalBudget: 14200000,
    billedToDate: 8500.0,
    remainingBudget: 14991500.0,

    estimateType: "CONCEPTUAL ESTIMATE",
    costPerSqf: 520.75,
    costPerLft: 0,
    submitted: "TBD",
    awarded: false,
    awardedPrecon: false,
    lastEstimation: "VITO",

    bidDueDate: "2025-03-01",
    status: "Open",
    estimatedCost: 13200000,
    scope: "Design-Build",
    csiScopes: ["11 - Equipment", "13 - Special Construction", "14 - Conveying"],
    lead: "Jennifer Park",
    bidderCount: 8,
    responseCount: 5,
    createdDate: "2025-01-10",
    lastActivity: "2025-01-14",
    confidence: 78,
    riskLevel: "High",
    tags: ["Education", "Research", "Specialized"],
    sqft: 28800,
    stories: 3,
    constructionType: "Type II",
    estimator: "VITO",
    architect: "SmithGroup",
    engineer: "Clark Nexsen",
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
    pricing: "85%",
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
    lastEstimation: "HANK",

    bidDueDate: "2025-02-28",
    status: "Open",
    estimatedCost: 78500000,
    scope: "General Contractor",
    csiScopes: ["03 - Concrete", "04 - Masonry", "05 - Metals", "09 - Finishes"],
    lead: "Alex Johnson",
    bidderCount: 18,
    responseCount: 14,
    createdDate: "2024-11-15",
    lastActivity: "2025-01-13",
    confidence: 88,
    riskLevel: "Medium",
    tags: ["Hospitality", "Luxury", "Downtown"],
    sqft: 175000,
    stories: 12,
    constructionType: "Type I",
    estimator: "HANK",
    architect: "Skidmore Owings & Merrill",
    engineer: "Arup",
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
    pricing: "45%",
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
    lastEstimation: "PAUL",

    bidDueDate: "2025-03-15",
    status: "Open",
    estimatedCost: 30200000,
    scope: "General Contractor",
    csiScopes: ["03 - Concrete", "05 - Metals", "13 - Special Construction"],
    lead: "Sarah Williams",
    bidderCount: 12,
    responseCount: 7,
    createdDate: "2024-12-01",
    lastActivity: "2025-01-12",
    confidence: 75,
    riskLevel: "Medium",
    tags: ["Industrial", "Manufacturing", "Expansion"],
    sqft: 120000,
    stories: 1,
    constructionType: "Type III",
    estimator: "PAUL",
    architect: "Page",
    engineer: "Burns & McDonnell",
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
      const totalBidders = mockProjectTrackingData.reduce((sum, p) => sum + p.bidderCount, 0)
      const totalResponses = mockProjectTrackingData.reduce((sum, p) => sum + p.responseCount, 0)
      const responseRate = totalResponses > 0 ? (totalResponses / totalBidders) * 100 : 0

      return {
        totalProjects,
        openProjects,
        awardedProjects,
        totalValue,
        avgConfidence,
        responseRate,
        totalBidders,
        totalResponses,
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

    const handleProjectNavigation = useCallback(
      (projectId: string) => {
        if (onProjectSelect) {
          onProjectSelect(projectId)
        } else {
          router.push(`/project/${projectId}`)
        }
      },
      [router, onProjectSelect]
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

    // Project navigation handled by enhanced useCallback above

    // Delivery Tracking Tab - matches the top table from the image
    const DeliveryTrackingTab = () => (
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Complete Deliverables</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {mockProjectTrackingData.filter((p) => p.bidBookLog === "COMPLETE").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {mockProjectTrackingData.filter((p) => p.review === "IN PROGRESS").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
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
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSync} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync
                </>
              )}
            </Button>
            <Button size="sm" onClick={() => setShowCreateProject(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Comprehensive Delivery Tracking Table */}
        <Card>
          <CardHeader>
            <CardTitle>Project Delivery Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Project Name</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Deliverable</TableHead>
                    <TableHead>Bid Book Log</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead>Programming</TableHead>
                    <TableHead>Pricing</TableHead>
                    <TableHead>Lean Estimating</TableHead>
                    <TableHead>Final Estimate</TableHead>
                    <TableHead>Contributors</TableHead>
                    <TableHead>Bid Bond</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        <Button
                          variant="link"
                          className="p-0 text-left justify-start"
                          onClick={() => handleProjectNavigation(project.id)}
                        >
                          {project.name}
                        </Button>
                        <div className="text-xs text-gray-500">{project.client}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            project.schedule === "On Track"
                              ? "default"
                              : project.schedule === "Delayed"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {project.schedule}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{project.deliverable}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            project.bidBookLog === "COMPLETE"
                              ? "default"
                              : project.bidBookLog === "IN PROGRESS"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {project.bidBookLog}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            project.review === "COMPLETE"
                              ? "default"
                              : project.review === "IN PROGRESS"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {project.review}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            project.programming === "COMPLETE"
                              ? "default"
                              : project.programming === "IN PROGRESS"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {project.programming}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={parseInt(project.pricing.replace("%", ""))} className="w-16" />
                          <span className="text-xs">{project.pricing}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            project.leanEstimating === "COMPLETE"
                              ? "default"
                              : project.leanEstimating === "IN PROGRESS"
                              ? "secondary"
                              : project.leanEstimating === "SCHEDULED"
                              ? "outline"
                              : "destructive"
                          }
                        >
                          {project.leanEstimating}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            project.finalEstimate === "SUBMITTED"
                              ? "default"
                              : project.finalEstimate === "IN PROGRESS"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {project.finalEstimate}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{project.contributors}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            project.bidBond === "REQUIRED"
                              ? "destructive"
                              : project.bidBond === "OBTAINED"
                              ? "default"
                              : "outline"
                          }
                        >
                          {project.bidBond}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(project.bidDueDate)}</div>
                        <div className="text-xs text-gray-500">
                          {getDaysUntilDue(project.bidDueDate) > 0
                            ? `${getDaysUntilDue(project.bidDueDate)} days`
                            : "Overdue"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleProjectNavigation(project.id)}>
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    )

    // Current Stage Tab - matches the middle table from the image
    const CurrentStageTab = () => (
      <div className="space-y-6">
        {/* Stage Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Design Development</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {mockProjectTrackingData.filter((p) => p.currentStage === "DD").length}
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Construction Documents</p>
                  <p className="text-2xl font-bold text-green-600">
                    {mockProjectTrackingData.filter((p) => p.currentStage === "CD").length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Schematic Design</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {mockProjectTrackingData.filter((p) => p.currentStage === "SD").length}
                  </p>
                </div>
                <Layers className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Budget</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(mockProjectTrackingData.reduce((sum, p) => sum + p.projectBudget, 0))}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
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
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="DD">Design Development</SelectItem>
                <SelectItem value="CD">Construction Documents</SelectItem>
                <SelectItem value="SD">Schematic Design</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSync} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Current Stage Budget Table */}
        <Card>
          <CardHeader>
            <CardTitle>Current Stage & Budget Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Project Name</TableHead>
                    <TableHead>Current Stage</TableHead>
                    <TableHead>Project Budget</TableHead>
                    <TableHead>Original Budget</TableHead>
                    <TableHead>Billed to Date</TableHead>
                    <TableHead>Remaining Budget</TableHead>
                    <TableHead>Budget Variance</TableHead>
                    <TableHead>Estimator</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => {
                    const budgetVariance = project.projectBudget - project.originalBudget
                    const variancePercentage = (budgetVariance / project.originalBudget) * 100

                    return (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">
                          <Button
                            variant="link"
                            className="p-0 text-left justify-start"
                            onClick={() => handleProjectNavigation(project.id)}
                          >
                            {project.name}
                          </Button>
                          <div className="text-xs text-gray-500">{project.client}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              project.currentStage === "CD"
                                ? "default"
                                : project.currentStage === "DD"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {project.currentStage}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(project.projectBudget)}</TableCell>
                        <TableCell>{formatCurrency(project.originalBudget)}</TableCell>
                        <TableCell>{formatCurrency(project.billedToDate)}</TableCell>
                        <TableCell>{formatCurrency(project.remainingBudget)}</TableCell>
                        <TableCell>
                          <div className={`font-medium ${budgetVariance > 0 ? "text-red-600" : "text-green-600"}`}>
                            {budgetVariance > 0 ? "+" : ""}
                            {formatCurrency(budgetVariance)}
                            <div className="text-xs text-gray-500">
                              {variancePercentage > 0 ? "+" : ""}
                              {variancePercentage.toFixed(1)}%
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{project.estimator}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleProjectNavigation(project.id)}>
                              View
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
      </div>
    )

    // Estimates Tab - matches the bottom table from the image
    const EstimatesTab = () => (
      <div className="space-y-6">
        {/* Estimates Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conceptual Estimates</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {mockProjectTrackingData.filter((p) => p.estimateType === "CONCEPTUAL ESTIMATE").length}
                  </p>
                </div>
                <Calculator className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">GMP Estimates</p>
                  <p className="text-2xl font-bold text-green-600">
                    {mockProjectTrackingData.filter((p) => p.estimateType === "GMP ESTIMATE").length}
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Lump Sum Proposals</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {mockProjectTrackingData.filter((p) => p.estimateType === "LUMP SUM PROPOSAL").length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Cost/SF</p>
                  <p className="text-2xl font-bold">
                    $
                    {(
                      mockProjectTrackingData.reduce((sum, p) => sum + p.costPerSqf, 0) / mockProjectTrackingData.length
                    ).toFixed(0)}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-600 dark:text-orange-400" />
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
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="CONCEPTUAL ESTIMATE">Conceptual</SelectItem>
                <SelectItem value="GMP ESTIMATE">GMP</SelectItem>
                <SelectItem value="LUMP SUM PROPOSAL">Lump Sum</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSync} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Estimates Cost Analysis Table */}
        <Card>
          <CardHeader>
            <CardTitle>Estimates & Cost Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Project Name</TableHead>
                    <TableHead>Estimate Type</TableHead>
                    <TableHead>Cost Per SF</TableHead>
                    <TableHead>Cost Per LF</TableHead>
                    <TableHead>Total Estimate</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Awarded</TableHead>
                    <TableHead>Awarded Precon</TableHead>
                    <TableHead>Last Estimation</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        <Button
                          variant="link"
                          className="p-0 text-left justify-start"
                          onClick={() => handleProjectNavigation(project.id)}
                        >
                          {project.name}
                        </Button>
                        <div className="text-xs text-gray-500">{project.client}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            project.estimateType === "GMP ESTIMATE"
                              ? "default"
                              : project.estimateType === "LUMP SUM PROPOSAL"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {project.estimateType}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">${project.costPerSqf.toFixed(2)}</TableCell>
                      <TableCell>{project.costPerLft > 0 ? `$${project.costPerLft.toFixed(2)}` : "N/A"}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(project.estimatedCost)}</TableCell>
                      <TableCell>{project.submitted !== "TBD" ? formatDate(project.submitted) : "TBD"}</TableCell>
                      <TableCell>
                        <Badge variant={project.awarded ? "default" : "outline"}>
                          {project.awarded ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={project.awardedPrecon ? "default" : "outline"}>
                          {project.awardedPrecon ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{project.lastEstimation}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleProjectNavigation(project.id)}>
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    )

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
                            <div className="text-sm text-gray-500">{project.scope}</div>
                            <div className="flex gap-1">
                              {project.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
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
                            <div className="font-medium">
                              {project.responseCount}/{project.bidderCount}
                            </div>
                            <Progress value={(project.responseCount / project.bidderCount) * 100} className="h-2" />
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
              <DeliveryTrackingTab />
            </TabsContent>

            <TabsContent value="stage" className="space-y-4">
              <CurrentStageTab />
            </TabsContent>

            <TabsContent value="estimates" className="space-y-4">
              <EstimatesTab />
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
