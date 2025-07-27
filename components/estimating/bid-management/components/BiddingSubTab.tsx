/**
 * @fileoverview Bidding Sub-Tab Component
 * @version 3.0.0
 * @description Modular and production-ready bidding sub-tab component integrating
 * bid package management with comprehensive overview and navigation
 *
 * Architecture:
 * - Combines BiddingOverview analytics with BidManagementNavigation
 * - Modular component architecture following v-3-0 standards
 * - Full TypeScript safety with proper error boundaries
 * - Production-ready with performance optimization
 * - Responsive design with mobile support
 */

"use client"

import React, { useState, useCallback, useMemo, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Building2,
  FileText,
  Users,
  BarChart3,
  Package,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  Settings,
  PieChart,
  Search,
  Filter,
  Download,
  Plus,
  Calculator,
  TrendingUp,
  Activity,
  Clock,
  Target,
  AlertCircle,
  UserPlus,
  FormInput,
} from "lucide-react"

// Import specific components for each section
import BidMessagePanel from "./BidMessagePanel"
import BiddersList from "./BiddersList"
import BidFormPanel from "./BidFormPanel"
import BidLeveling from "../../BidLeveling"
import { SharePointLibraryViewer } from "../../../sharepoint/SharePointLibraryViewer"

// Types
interface BidPackage {
  id: string
  name: string
  lead: string
  bidsDate: string
  bidsTime: string
  companies: number
  viewed: number
  bidding: number
  bids: number
  estimatedCost?: number | null
  softAwardedCompany: string
  leveledBid?: number | null
  hasLevelBids: boolean
  status: "active" | "pending" | "awarded" | "closed"
}

interface BiddingSubTabProps {
  projectId: string
  projectData?: any
  userRole: string
  user?: any
  className?: string
  onPackageSelect?: (packageId: string) => void
  onError?: (error: Error) => void
}

// Error Boundary Component (MANDATORY for v3.0)
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class BiddingErrorBoundary extends React.Component<
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
    console.error("BiddingSubTab Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <Alert className="m-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Something went wrong with the Bidding module. Please refresh the page.</AlertDescription>
          </Alert>
        )
      )
    }
    return this.props.children
  }
}

// Loading Skeleton (MANDATORY for v3.0)
const BiddingSubTabSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
    <Skeleton className="h-96 w-full" />
  </div>
)

// Main Component with React.memo for performance (MANDATORY for v3.0)
const BiddingSubTabComponent = React.memo<BiddingSubTabProps>(
  ({ projectId, projectData, userRole, user, className = "", onPackageSelect, onError }) => {
    // State Management
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
    const [activeSection, setActiveSection] = useState<string>("overview")
    const [searchTerm, setSearchTerm] = useState("")
    const [bidPackagesExpanded, setBidPackagesExpanded] = useState(true)
    const [isMobile, setIsMobile] = useState(false)

    // Mobile detection (MANDATORY for v3.0 responsive design)
    React.useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768)
      checkMobile()
      window.addEventListener("resize", checkMobile)
      return () => window.removeEventListener("resize", checkMobile)
    }, [])

    // Mock bid packages data (consistent with original implementation)
    const bidPackages: BidPackage[] = useMemo(
      () => [
        {
          id: "01-00",
          name: "Materials Testing",
          lead: "WS",
          bidsDate: "4/18/2025",
          bidsTime: "5:00 PM EDT",
          companies: 13,
          viewed: 6,
          bidding: 2,
          bids: 1,
          estimatedCost: null,
          softAwardedCompany: "Level bids",
          leveledBid: null,
          hasLevelBids: true,
          status: "active",
        },
        {
          id: "02-21",
          name: "Surveying",
          lead: "WS",
          bidsDate: "4/18/2025",
          bidsTime: "5:00 PM EDT",
          companies: 11,
          viewed: 4,
          bidding: 3,
          bids: 1,
          estimatedCost: null,
          softAwardedCompany: "Level bids",
          leveledBid: null,
          hasLevelBids: true,
          status: "active",
        },
        {
          id: "03-33",
          name: "Concrete",
          lead: "WS",
          bidsDate: "4/18/2025",
          bidsTime: "5:00 PM EDT",
          companies: 29,
          viewed: 13,
          bidding: 1,
          bids: 0,
          estimatedCost: null,
          softAwardedCompany: "no bids",
          leveledBid: null,
          hasLevelBids: false,
          status: "pending",
        },
        {
          id: "03-35",
          name: "Hollow Core Concrete",
          lead: "WS",
          bidsDate: "4/18/2025",
          bidsTime: "5:00 PM EDT",
          companies: 1,
          viewed: 0,
          bidding: 0,
          bids: 0,
          estimatedCost: null,
          softAwardedCompany: "no bids",
          leveledBid: null,
          hasLevelBids: false,
          status: "pending",
        },
        {
          id: "04-22",
          name: "Masonry",
          lead: "WS",
          bidsDate: "4/18/2025",
          bidsTime: "5:00 PM EDT",
          companies: 14,
          viewed: 9,
          bidding: 0,
          bids: 0,
          estimatedCost: null,
          softAwardedCompany: "no bids",
          leveledBid: null,
          hasLevelBids: false,
          status: "pending",
        },
        {
          id: "05-70",
          name: "Decorative Metals",
          lead: "WS",
          bidsDate: "4/18/2025",
          bidsTime: "5:00 PM EDT",
          companies: 14,
          viewed: 3,
          bidding: 0,
          bids: 0,
          estimatedCost: null,
          softAwardedCompany: "no bids",
          leveledBid: null,
          hasLevelBids: false,
          status: "pending",
        },
        {
          id: "06-11",
          name: "Wood Framing",
          lead: "WS",
          bidsDate: "4/18/2025",
          bidsTime: "5:00 PM EDT",
          companies: 30,
          viewed: 10,
          bidding: 1,
          bids: 0,
          estimatedCost: null,
          softAwardedCompany: "no bids",
          leveledBid: null,
          hasLevelBids: false,
          status: "pending",
        },
        {
          id: "06-17",
          name: "Wood Trusses",
          lead: "WS",
          bidsDate: "4/18/2025",
          bidsTime: "5:00 PM EDT",
          companies: 8,
          viewed: 7,
          bidding: 3,
          bids: 0,
          estimatedCost: null,
          softAwardedCompany: "no bids",
          leveledBid: null,
          hasLevelBids: false,
          status: "pending",
        },
        {
          id: "06-41",
          name: "Millwork",
          lead: "WS",
          bidsDate: "4/18/2025",
          bidsTime: "5:00 PM EDT",
          companies: 22,
          viewed: 3,
          bidding: 0,
          bids: 0,
          estimatedCost: null,
          softAwardedCompany: "no bids",
          leveledBid: null,
          hasLevelBids: false,
          status: "pending",
        },
        {
          id: "06-61",
          name: "Rough Carpentry Hardware",
          lead: "WS",
          bidsDate: "4/18/2025",
          bidsTime: "5:00 PM EDT",
          companies: 6,
          viewed: 0,
          bidding: 0,
          bids: 0,
          estimatedCost: null,
          softAwardedCompany: "no bids",
          leveledBid: null,
          hasLevelBids: false,
          status: "pending",
        },
      ],
      []
    )

    // Filtered packages based on search
    const filteredPackages = useMemo(() => {
      if (!searchTerm) return bidPackages
      return bidPackages.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }, [bidPackages, searchTerm])

    // Dashboard metrics calculation
    const dashboardMetrics = useMemo(() => {
      const totalPackages = bidPackages.length
      const activePackages = bidPackages.filter((p) => p.status === "active").length
      const totalBids = bidPackages.reduce((sum, p) => sum + p.bids, 0)
      const totalCompanies = bidPackages.reduce((sum, p) => sum + p.companies, 0)
      const avgResponseRate = totalCompanies > 0 ? (totalBids / totalCompanies) * 100 : 0

      return {
        totalPackages,
        activePackages,
        totalBids,
        totalCompanies,
        avgResponseRate,
      }
    }, [bidPackages])

    // Enhanced callbacks with useCallback for performance (MANDATORY for v3.0)
    const handlePackageSelect = useCallback(
      (packageId: string) => {
        setSelectedPackage(packageId)
        setActiveSection("overview")
        if (onPackageSelect) {
          onPackageSelect(packageId)
        }
      },
      [onPackageSelect]
    )

    const handleSectionChange = useCallback((section: string) => {
      setActiveSection(section)
    }, [])

    const handleBackToOverview = useCallback(() => {
      setSelectedPackage(null)
      setActiveSection("overview")
    }, [])

    const handleBidPackagesToggle = useCallback(() => {
      setBidPackagesExpanded((prev) => !prev)
    }, [])

    // Note: BidManagementNavigation component replaced with horizontal navigation cards

    // Bidding Overview Component
    const BiddingOverview = () => (
      <div className="space-y-6">
        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Packages</p>
                  <p className="text-2xl font-bold">{dashboardMetrics.totalPackages}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Packages</p>
                  <p className="text-2xl font-bold text-green-600">{dashboardMetrics.activePackages}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bids</p>
                  <p className="text-2xl font-bold">{dashboardMetrics.totalBids}</p>
                </div>
                <Calculator className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Response Rate</p>
                  <p className="text-2xl font-bold">{dashboardMetrics.avgResponseRate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Package
            </Button>
          </div>
        </div>

        {/* Bid Packages Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Bid Packages</span>
              <Badge variant="secondary">{filteredPackages.length} packages</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Package</TableHead>
                    <TableHead>Lead</TableHead>
                    <TableHead>Bid Due</TableHead>
                    <TableHead>Companies</TableHead>
                    <TableHead>Viewed</TableHead>
                    <TableHead>Bidding</TableHead>
                    <TableHead>Bids</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPackages.map((pkg) => (
                    <TableRow
                      key={pkg.id}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => handlePackageSelect(pkg.id)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{pkg.id}</div>
                          <div className="text-sm text-gray-500">{pkg.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{pkg.lead}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{pkg.bidsDate}</div>
                          <div className="text-sm text-gray-500">{pkg.bidsTime}</div>
                        </div>
                      </TableCell>
                      <TableCell>{pkg.companies}</TableCell>
                      <TableCell>{pkg.viewed}</TableCell>
                      <TableCell>{pkg.bidding}</TableCell>
                      <TableCell>
                        <Badge variant={pkg.bids > 0 ? "default" : "secondary"}>{pkg.bids}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={pkg.status === "active" ? "default" : "secondary"}
                          className={
                            pkg.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          }
                        >
                          {pkg.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
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

    // Package Detail View
    const PackageDetailView = () => {
      const pkg = bidPackages.find((p) => p.id === selectedPackage)
      if (!pkg) return <div>Package not found</div>

      // Navigation sections for the selected package
      const packageSections = [
        { id: "overview", label: "Overview", icon: Package, description: "Package details and summary" },
        { id: "bid-leveling", label: "Bid Leveling", icon: TrendingUp, description: "Bid analysis and comparison" },
        { id: "files", label: "Files", icon: FileText, count: 12, description: "Documents and attachments" },
        {
          id: "messages",
          label: "Messages",
          icon: MessageSquare,
          count: 3,
          description: "Communications and notifications",
        },
        { id: "bidders", label: "Bidders", icon: UserPlus, count: 8, description: "Manage bidders and invitations" },
        { id: "bid-form", label: "Bid Form", icon: FormInput, count: 1, description: "Bid forms and templates" },
      ]

      const renderSectionContent = () => {
        switch (activeSection) {
          case "overview":
            return (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {pkg.id}: {pkg.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Lead</p>
                      <p className="text-sm">{pkg.lead}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Bid Due</p>
                      <p className="text-sm">
                        {pkg.bidsDate} at {pkg.bidsTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Companies Invited</p>
                      <p className="text-sm">{pkg.companies}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Companies Viewed</p>
                      <p className="text-sm">{pkg.viewed}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Currently Bidding</p>
                      <p className="text-sm">{pkg.bidding}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Bids Received</p>
                      <Badge variant={pkg.bids > 0 ? "default" : "secondary"}>{pkg.bids}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          case "files":
            return (
              <SharePointLibraryViewer projectId={projectId} projectName={`${pkg.id} - ${pkg.name}`} className="mt-0" />
            )
          case "messages":
            return <BidMessagePanel projectId={projectId} packageId={pkg.id} className="mt-0" />
          case "bidders":
            return <BiddersList projectId={projectId} packageId={pkg.id} className="mt-0" />
          case "bid-form":
            return (
              <BidFormPanel
                packageId={pkg.id}
                forms={[]}
                onFormCreate={() => {
                  // Handle form creation
                }}
                onFormEdit={() => {
                  // Handle form editing
                }}
                className="mt-0"
              />
            )
          case "bid-leveling":
            return (
              <div className="mt-0">
                <BidLeveling />
              </div>
            )
          default:
            return (
              <Card>
                <CardHeader>
                  <CardTitle>Select a Section</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Choose a section from the navigation above to view details.</p>
                </CardContent>
              </Card>
            )
        }
      }

      return (
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <button onClick={handleBackToOverview} className="cursor-pointer hover:text-blue-600 flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Bid Packages
            </button>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">
              {pkg.id}: {pkg.name}
            </span>
          </div>

          {/* Package Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">
                {pkg.id}: {pkg.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Due: {pkg.bidsDate} at {pkg.bidsTime} • {pkg.companies} companies invited • {pkg.bids} bids received
              </p>
            </div>
            <Badge
              variant={pkg.status === "active" ? "default" : "secondary"}
              className={
                pkg.status === "active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
              }
            >
              {pkg.status}
            </Badge>
          </div>

          {/* Horizontal Navigation Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {packageSections.map((section) => {
              const IconComponent = section.icon
              const isActive = activeSection === section.id

              return (
                <Card
                  key={section.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isActive ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "hover:border-gray-300"
                  }`}
                  onClick={() => handleSectionChange(section.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="relative">
                        <IconComponent className={`h-6 w-6 ${isActive ? "text-blue-600" : "text-gray-600"}`} />
                        {section.count !== undefined && (
                          <Badge
                            variant="secondary"
                            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                          >
                            {section.count}
                          </Badge>
                        )}
                      </div>
                      <div>
                        <p
                          className={`text-xs font-medium ${
                            isActive ? "text-blue-600" : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {section.label}
                        </p>
                        {!isMobile && (
                          <p className="text-xs text-muted-foreground mt-1 leading-tight">{section.description}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Main Content */}
          <div>{renderSectionContent()}</div>
        </div>
      )
    }

    // Main render logic
    return (
      <div className={`bidding-sub-tab ${className}`}>
        {selectedPackage ? <PackageDetailView /> : <BiddingOverview />}
      </div>
    )
  }
)

BiddingSubTabComponent.displayName = "BiddingSubTabComponent"

// Enhanced component with Error Boundary wrapper (MANDATORY for v3.0)
export function BiddingSubTab(props: BiddingSubTabProps) {
  return (
    <BiddingErrorBoundary>
      <Suspense fallback={<BiddingSubTabSkeleton />}>
        <BiddingSubTabComponent {...props} />
      </Suspense>
    </BiddingErrorBoundary>
  )
}

export default BiddingSubTab
