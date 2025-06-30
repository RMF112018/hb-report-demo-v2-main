"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/context/auth-context"
import { AppHeader } from "@/components/layout/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { 
  Package, 
  Building2, 
  DollarSign, 
  TrendingUp,
  BarChart3,
  PieChart,
  Scale,
  FileText,
  Users,
  Activity,
  CheckCircle,
  Clock,
  Shield,
  Target,
  Plus,
  RefreshCw,
  Download,
  Home,
  Maximize,
  Minimize,
  Eye,
  Edit
} from "lucide-react"

// Import comprehensive procurement components
import { ProcurementOverview } from "@/components/procurement/ProcurementOverview"
import { BuyoutManagement } from "@/components/procurement/BuyoutManagement"
import { VendorManagement } from "@/components/procurement/VendorManagement"
import { ProcurementAnalytics } from "@/components/procurement/ProcurementAnalytics"
import { BidComparison } from "@/components/procurement/BidComparison"
import { ContractTracking } from "@/components/procurement/ContractTracking"

// Import new components aligned with constraints log
import { ProcurementWidgets, type ProcurementStats } from "@/components/procurement/ProcurementWidgets"
import { HbiProcurementInsights } from "@/components/procurement/HbiProcurementInsights"
import { ProcurementExportUtils } from "@/components/procurement/ProcurementExportUtils"
import { ExportModal } from "@/components/constraints/ExportModal"

import { useToast } from "@/hooks/use-toast"
import { BuyoutRecord } from "@/types/procurement"
import procurementData from "@/data/mock/financial/procurement/procurement.json"

// Transform JSON data to BuyoutRecord format
const transformProcurementData = (data: any[]): BuyoutRecord[] => {
  return data.slice(0, 50).map((item, index) => ({
    id: `buyout-${index + 1}`,
    projectId: item.project_id?.toString() || "unknown",
    type: item["Contract Type"]?.toLowerCase().includes("purchase") ? "material" : "subcontract",
    name: item.Title || "Unknown",
    description: item.Description?.replace(/<[^>]*>/g, "") || "",
    category: item.Title?.split(" ")[0] || "General",
    costCode: item.Number || "",
    budgetAmount: item["Original Contract Amount"] || 0,
    contractAmount: item["Revised Contract Amount"] || 0,
    currentAmount: item["Revised Contract Amount"] || 0,
    variance: (item["Revised Contract Amount"] || 0) - (item["Original Contract Amount"] || 0),
    variancePercentage: item["Original Contract Amount"] 
      ? (((item["Revised Contract Amount"] || 0) - item["Original Contract Amount"]) / item["Original Contract Amount"]) * 100
      : 0,
    retentionPercentage: 5,
    retentionAmount: (item["Revised Contract Amount"] || 0) * 0.05,
    vendorId: `vendor-${index + 1}`,
    vendorName: item.Vendor || "Unknown Vendor",
    vendorContact: {
      name: item["Primary Contact"] || "Unknown",
      email: item["Email Address"] || "",
      phone: item["Vendor Phone"] || "",
    },
    startDate: item["Contract Date (1)"] || new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    milestones: [],
    status: item.Status?.toLowerCase().includes("approved") ? "active" : 
            item.Status?.toLowerCase().includes("draft") ? "planning" :
            item.Status?.toLowerCase().includes("signature") ? "awarded" : "planning",
    complianceStatus: item["Bond Received"] === true ? "compliant" : 
                     item["Bond Received"] === false ? "non-compliant" : "warning",
    complianceChecks: [],
    procurementMethod: "competitive-bid",
    bidCount: Math.floor(Math.random() * 8) + 3,
    awardDate: item["Contract Date (1)"] || undefined,
    createdBy: "System",
    createdAt: new Date().toISOString(),
    updatedBy: "System",
    updatedAt: new Date().toISOString(),
  })) as BuyoutRecord[]
}

export default function ProcurementPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  // State management
  const [buyouts] = useState<BuyoutRecord[]>(transformProcurementData(procurementData))
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)

  // Role-based access control
  const userRole = user?.role || "project-manager"
  
  // Get role-specific data scope
  const getDataScope = () => {
    switch (userRole) {
      case "executive":
        return {
          scope: "enterprise",
          projectCount: 15,
          description: "Enterprise View - All Projects",
          canCreate: true,
          canApprove: true,
          canEdit: true
        }
      case "project-executive":
        return {
          scope: "portfolio",
          projectCount: 6,
          description: "Portfolio View - 6 Projects",
          canCreate: true,
          canApprove: true,
          canEdit: true
        }
      case "project-manager":
        return {
          scope: "single",
          projectCount: 1,
          description: "Single Project View",
          canCreate: true,
          canApprove: false,
          canEdit: true
        }
      default:
        return {
          scope: "limited",
          projectCount: 1,
          description: "Limited View",
          canCreate: false,
          canApprove: false,
          canEdit: false
        }
    }
  }

  const dataScope = getDataScope()

  // Calculate statistics
  const stats = useMemo((): ProcurementStats => {
    const totalValue = buyouts.reduce((sum, buyout) => sum + buyout.currentAmount, 0)
    const activeBuyouts = buyouts.filter(b => b.status === "active" || b.status === "awarded").length
    const completedBuyouts = buyouts.filter(b => b.status === "completed").length
    const pendingContracts = buyouts.filter(b => b.status === "planning" || b.status === "bidding").length
    const vendorCount = new Set(buyouts.map(b => b.vendorName)).size
    const complianceRate = (buyouts.filter(b => b.complianceStatus === "compliant").length / buyouts.length) * 100
    const avgSavings = buyouts.reduce((sum, b) => sum + Math.abs(b.variancePercentage), 0) / buyouts.length
    const onTimeDelivery = 87.5 // Mock value

    const byCategory = buyouts.reduce((acc, buyout) => {
      acc[buyout.category] = (acc[buyout.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byStatus = buyouts.reduce((acc, buyout) => {
      acc[buyout.status] = (acc[buyout.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalValue,
      activeBuyouts,
      completedBuyouts,
      pendingContracts,
      vendorCount,
      complianceRate,
      avgSavings,
      onTimeDelivery,
      byCategory,
      byStatus
    }
  }, [buyouts])

  // Define procurement modules based on role
  const procurementModules = useMemo(() => {
    const baseModules = [
      {
        id: "overview",
        label: "Overview",
        icon: BarChart3,
        description: "Comprehensive procurement dashboard with key metrics",
        component: ProcurementOverview,
        requiredRoles: ["project-manager", "project-executive", "executive", "admin"]
      },
      {
        id: "buyouts",
        label: "Buyout Management",
        icon: Package,
        description: "Subcontractor buyout tracking and management",
        component: BuyoutManagement,
        requiredRoles: ["project-manager", "project-executive", "executive", "admin"]
      },
      {
        id: "vendors",
        label: "Vendor Management",
        icon: Building2,
        description: "Vendor relationships and performance tracking",
        component: VendorManagement,
        requiredRoles: ["project-manager", "project-executive", "executive", "admin"]
      },
      {
        id: "bid-comparison",
        label: "Bid Comparison",
        icon: Scale,
        description: "Advanced bid analysis and comparison tools",
        component: BidComparison,
        requiredRoles: ["project-manager", "project-executive", "executive"]
      },
      {
        id: "contracts",
        label: "Contract Tracking",
        icon: FileText,
        description: "Contract status and compliance monitoring",
        component: ContractTracking,
        requiredRoles: ["project-executive", "executive", "admin"]
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: PieChart,
        description: "Advanced procurement analytics and insights",
        component: ProcurementAnalytics,
        requiredRoles: ["project-executive", "executive", "admin"]
      }
    ]

    // Filter modules based on user role
    return baseModules.filter(module => 
      !module.requiredRoles || module.requiredRoles.includes(userRole)
    )
  }, [userRole])

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Data Refreshed",
        description: "Procurement data has been updated",
      })
    }, 1000)
  }

  // Handle export
  const handleExportSubmit = (options: { format: "pdf" | "excel" | "csv"; fileName: string; filePath: string }) => {
    try {
      switch (options.format) {
        case "pdf":
          ProcurementExportUtils.exportToPDF(buyouts, stats, dataScope.description, options.fileName)
          break
        case "excel":
          ProcurementExportUtils.exportToExcel(buyouts, stats, dataScope.description, options.fileName)
          break
        case "csv":
          ProcurementExportUtils.exportToCSV(buyouts, dataScope.description, options.fileName)
          break
      }

      toast({
        title: "Export Started",
        description: `Procurement data exported to ${options.format.toUpperCase()}`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data",
        variant: "destructive",
      })
    }
  }

  // Toggle fullscreen
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullScreen) {
        setIsFullScreen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isFullScreen])

  // Get role-specific project scope description
  const getProjectScopeDescription = () => {
    switch (userRole) {
      case "project-manager":
        return "Single Project View"
      case "project-executive":
        return "Portfolio View (6 Projects)"
      default:
        return "Enterprise View (All Projects)"
    }
  }

  const ProcurementContentCard = () => (
    <Card className={isFullScreen ? "fixed inset-0 z-[130] rounded-none" : ""}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-[#FF6B35]" />
          Procurement Management
        </CardTitle>
        <Button variant="outline" size="sm" onClick={toggleFullScreen} className="flex items-center gap-2">
          {isFullScreen ? (
            <>
              <Minimize className="h-4 w-4" />
              Exit Full Screen
            </>
          ) : (
            <>
              <Maximize className="h-4 w-4" />
              Full Screen
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className={isFullScreen ? "h-[calc(100vh-80px)] overflow-y-auto" : ""}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 bg-background shadow-sm" data-tour="procurement-tabs">
            {procurementModules.map((module) => (
              <TabsTrigger 
                key={module.id} 
                value={module.id} 
                className="flex items-center gap-2 data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white transition-all duration-200"
              >
                <module.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{module.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {procurementModules.map((module) => (
            <TabsContent key={module.id} value={module.id} className="mt-6">
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <module.icon className="h-5 w-5 text-[#FF6B35]" />
                    {module.label}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{module.description}</p>
                </div>
                
                <module.component 
                  userRole={userRole}
                  dataScope={dataScope}
                  summaryMetrics={{
                    totalProcurementValue: stats.totalValue,
                    activeBuyouts: stats.activeBuyouts,
                    pendingContracts: stats.pendingContracts,
                    avgSavings: stats.avgSavings,
                    vendorCount: stats.vendorCount,
                    completedBuyouts: stats.completedBuyouts
                  }}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )

  return (
    <>
      <AppHeader />
      <div className="space-y-6 p-6">
        {!isFullScreen && (
          <>
            {/* Breadcrumb Navigation */}
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
                  <BreadcrumbPage>Procurement</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Header Section */}
            <div className="flex flex-col gap-4" data-tour="procurement-page-header">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Procurement Management</h1>
                  <p className="text-muted-foreground mt-1">Subcontractor buyout and vendor management system</p>
                  <div className="flex items-center gap-4 mt-2" data-tour="procurement-scope-badges">
                    <Badge variant="outline" className="px-3 py-1">
                      {getProjectScopeDescription()}
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1">
                      {stats.totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })} Total Value
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1">
                      {stats.activeBuyouts} Active Buyouts
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Button variant="outline" onClick={() => setIsExportModalOpen(true)}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  {dataScope.canCreate && (
                    <Button className="bg-[#FF6B35] hover:bg-[#E55A2B]">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Buyout
                    </Button>
                  )}
                </div>
              </div>

              {/* Statistics Widgets */}
              <div data-tour="procurement-quick-stats">
                <ProcurementWidgets stats={stats} />
              </div>
            </div>

            {/* HBI Insights Panel */}
            <div data-tour="procurement-hbi-insights">
              <HbiProcurementInsights buyouts={buyouts} stats={stats} />
            </div>
          </>
        )}

        {/* Main Content */}
        <ProcurementContentCard />

        {/* Export Modal */}
        <div data-tour="procurement-export">
          <ExportModal
            open={isExportModalOpen}
            onOpenChange={setIsExportModalOpen}
            onExport={handleExportSubmit}
            defaultFileName="ProcurementData"
          />
        </div>

        {/* Help & Support Section */}
        {!isFullScreen && (
          <Card className="mt-8 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Procurement Management Help</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                    Access comprehensive tools for managing subcontractor buyouts, vendor relationships, and procurement analytics with AI-powered insights.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-blue-600 border-blue-300 dark:text-blue-300 dark:border-blue-600">
                      Subcontractor Buyouts
                    </Badge>
                    <Badge variant="outline" className="text-blue-600 border-blue-300 dark:text-blue-300 dark:border-blue-600">
                      Vendor Performance
                    </Badge>
                    <Badge variant="outline" className="text-blue-600 border-blue-300 dark:text-blue-300 dark:border-blue-600">
                      Bid Analysis
                    </Badge>
                    <Badge variant="outline" className="text-blue-600 border-blue-300 dark:text-blue-300 dark:border-blue-600">
                      Contract Tracking
                    </Badge>
                    <Badge variant="outline" className="text-blue-600 border-blue-300 dark:text-blue-300 dark:border-blue-600">
                      HBI Insights
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
} 