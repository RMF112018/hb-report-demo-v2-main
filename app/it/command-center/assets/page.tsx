"use client"

import React, { useState, useMemo } from "react"
import { useAuth } from "@/context/auth-context"
import { ITModuleNavigation } from "@/components/layout/ITModuleNavigation"
import { AppHeader } from "@/components/layout/app-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Shield,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  RefreshCw,
  Filter,
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  Monitor,
  Smartphone,
  Printer,
  Wifi,
  Server,
  Home,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  Info,
} from "lucide-react"

import commandCenterMock from "@/data/mock/it/commandCenterMock.json"
import AssetTrackerCard from "@/components/cards/it/AssetTrackerCard"
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights"

export default function AssetTrackerPage() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("overview")

  // Assets-specific AI insights
  const assetInsights = [
    {
      id: "asset-1",
      type: "alert",
      severity: "high",
      title: "License Expiration Warning",
      text: "12 critical software licenses expire within 30 days, risking compliance violations.",
      action: "Initiate renewal process for expiring licenses and update license management workflow.",
      confidence: 96,
      relatedMetrics: ["License Compliance", "Software Assets", "Renewal Management"],
    },
    {
      id: "asset-2",
      type: "opportunity",
      severity: "medium",
      title: "License Optimization Opportunity",
      text: "AI analysis identifies $127K annual savings through software license rightsizing.",
      action: "Review underutilized licenses and negotiate enterprise volume discounts.",
      confidence: 89,
      relatedMetrics: ["Cost Optimization", "License Utilization", "Procurement"],
    },
    {
      id: "asset-3",
      type: "risk",
      severity: "medium",
      title: "Hardware Refresh Planning",
      text: "23 devices approaching end-of-warranty within 6 months, requiring replacement planning.",
      action: "Develop hardware refresh budget and procurement timeline for aging assets.",
      confidence: 91,
      relatedMetrics: ["Hardware Lifecycle", "Warranty Management", "Asset Planning"],
    },
    {
      id: "asset-4",
      type: "performance",
      severity: "low",
      title: "Asset Tracking Accuracy",
      text: "96.7% asset tracking accuracy maintained across all categories and locations.",
      action: "Continue current asset management practices and implement RFID tracking pilot.",
      confidence: 94,
      relatedMetrics: ["Asset Accuracy", "Inventory Management", "Tracking Systems"],
    },
    {
      id: "asset-5",
      type: "forecast",
      severity: "medium",
      title: "Mobile Device Growth Trend",
      text: "Mobile device requests increasing 15% quarterly, requiring procurement planning.",
      action: "Adjust mobile device procurement strategy and negotiate bulk purchase agreements.",
      confidence: 86,
      relatedMetrics: ["Mobile Assets", "Growth Planning", "Procurement Strategy"],
    },
    {
      id: "asset-6",
      type: "opportunity",
      severity: "low",
      title: "Asset Utilization Enhancement",
      text: "Shared equipment utilization could increase 22% through improved scheduling system.",
      action: "Implement asset reservation system and optimize shared resource allocation.",
      confidence: 83,
      relatedMetrics: ["Asset Utilization", "Resource Optimization", "Scheduling"],
    },
  ]

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">You don't have permission to access the IT Command Center.</p>
        </div>
      </div>
    )
  }

  const assetData = commandCenterMock.assets

  const extendedLicenses = [
    ...assetData.licenses,
    {
      software: "Cisco Umbrella",
      totalLicenses: 312,
      usedLicenses: 289,
      availableLicenses: 23,
      costPerMonth: 2.5,
      renewalDate: "2025-02-28",
      status: "Active",
    },
    {
      software: "Meraki Dashboard",
      totalLicenses: 50,
      usedLicenses: 23,
      availableLicenses: 27,
      costPerMonth: 150,
      renewalDate: "2025-07-15",
      status: "Active",
    },
  ]

  const hardwareInventory = [
    {
      id: "HB-DESKTOP-001",
      category: "Desktop",
      model: "Dell OptiPlex 7090",
      serialNumber: "DOPT7090-001",
      purchaseDate: "2023-02-15",
      warrantyExpiry: "2026-02-15",
      assignedTo: "John Smith",
      location: "HQ Dallas - Floor 3",
      status: "Active",
      osVersion: "Windows 11 Pro 23H2",
      lastUpdated: "2024-12-20",
      condition: "Good",
    },
    {
      id: "HB-LAPTOP-156",
      category: "Laptop",
      model: 'MacBook Pro 14"',
      serialNumber: "MBP14-2023-156",
      purchaseDate: "2023-08-10",
      warrantyExpiry: "2026-08-10",
      assignedTo: "Sarah Johnson",
      location: "Remote - Austin",
      status: "Active",
      osVersion: "macOS Sonoma 14.2",
      lastUpdated: "2024-12-25",
      condition: "Excellent",
    },
    {
      id: "HB-TABLET-089",
      category: "Tablet",
      model: 'iPad Pro 12.9"',
      serialNumber: "IPAD2023-089",
      purchaseDate: "2023-06-05",
      warrantyExpiry: "2025-06-05",
      assignedTo: "Mike Wilson",
      location: "Jobsite - Houston",
      status: "Active",
      osVersion: "iPadOS 17.2",
      lastUpdated: "2024-12-22",
      condition: "Good",
    },
    {
      id: "HB-PHONE-234",
      category: "Mobile Device",
      model: "iPhone 15 Pro",
      serialNumber: "IP15P-234",
      purchaseDate: "2024-01-12",
      warrantyExpiry: "2025-01-12",
      assignedTo: "Lisa Garcia",
      location: "HQ Dallas - Floor 2",
      status: "Active",
      osVersion: "iOS 17.2.1",
      lastUpdated: "2024-12-26",
      condition: "Excellent",
    },
    {
      id: "HB-PRINTER-012",
      category: "Printer",
      model: "HP LaserJet Pro 4301dw",
      serialNumber: "HPLJ4301-012",
      purchaseDate: "2023-03-20",
      warrantyExpiry: "2025-03-20",
      assignedTo: "Shared Resource",
      location: "HQ Dallas - Floor 1",
      status: "Active",
      osVersion: "Firmware v2.76",
      lastUpdated: "2024-12-15",
      condition: "Good",
    },
    {
      id: "HB-NET-MX67",
      category: "Network Equipment",
      model: "Cisco Meraki MX67",
      serialNumber: "MX67-2023-001",
      purchaseDate: "2023-01-10",
      warrantyExpiry: "2026-01-10",
      assignedTo: "IT Infrastructure",
      location: "HQ Dallas - Server Room",
      status: "Active",
      osVersion: "MX 18.107.2",
      lastUpdated: "2024-12-24",
      condition: "Excellent",
    },
  ]

  const filteredHardware = useMemo(() => {
    let hardware = hardwareInventory

    if (selectedCategory !== "all") {
      hardware = hardware.filter((item) => item.category.toLowerCase().includes(selectedCategory.toLowerCase()))
    }

    if (selectedLocation !== "all") {
      hardware = hardware.filter((item) => item.location.toLowerCase().includes(selectedLocation.toLowerCase()))
    }

    return hardware
  }, [selectedCategory, selectedLocation])

  const getExpirationStatus = (renewalDate: string) => {
    const today = new Date()
    const renewal = new Date(renewalDate)
    const daysUntilRenewal = Math.ceil((renewal.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilRenewal < 0)
      return {
        status: "Expired",
        color: "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30",
        days: Math.abs(daysUntilRenewal),
      }
    if (daysUntilRenewal <= 30)
      return {
        status: "Critical",
        color: "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30",
        days: daysUntilRenewal,
      }
    if (daysUntilRenewal <= 90)
      return {
        status: "Warning",
        color: "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30",
        days: daysUntilRenewal,
      }
    return {
      status: "Active",
      color: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30",
      days: daysUntilRenewal,
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "excellent":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
      case "good":
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30"
      case "fair":
        return "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30"
      case "poor":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "desktop":
      case "laptop":
        return Monitor
      case "tablet":
      case "mobile device":
        return Smartphone
      case "printer":
        return Printer
      case "network equipment":
        return Wifi
      case "server":
        return Server
      default:
        return Package
    }
  }

  const vendorSummary = useMemo(() => {
    const vendors = extendedLicenses.reduce((acc, license) => {
      const vendor = license.software.split(" ")[0]
      if (!acc[vendor]) {
        acc[vendor] = { licenses: 0, cost: 0, items: [] }
      }
      acc[vendor].licenses += license.usedLicenses
      acc[vendor].cost += license.costPerMonth * license.usedLicenses
      acc[vendor].items.push(license)
      return acc
    }, {} as Record<string, { licenses: number; cost: number; items: any[] }>)

    return Object.entries(vendors).map(([vendor, data]) => ({
      vendor,
      ...data,
    }))
  }, [extendedLicenses])

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="sticky top-16 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3">
          <div className="max-w-[1920px] mx-auto">
            <Breadcrumb className="mb-3">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/it-command-center" className="text-muted-foreground hover:text-foreground">
                    IT Command Center
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Asset & License Tracker</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">
                  Asset & License Tracker
                </h1>
                <Badge variant="outline" className="text-xs whitespace-nowrap">
                  {assetData.totalAssets} Total Assets
                </Badge>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <Button variant="ghost" size="sm" className="text-sm">
                  <Plus className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Add Asset</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-sm">
                  <RefreshCw className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-sm">
                  <Settings className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
              </div>
            </div>

            <div className="mt-3">
              <ITModuleNavigation />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        <div className="block xl:hidden mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Asset Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Assets</span>
                  <span className="font-medium">{assetData.totalAssets}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hardware</span>
                  <span className="font-medium">{assetData.hardwareAssets}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Software</span>
                  <span className="font-medium">{assetData.softwareLicenses}</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">License Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expiring Soon</span>
                  <span className="font-medium text-orange-600">{assetData.expiringSoon}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overdue</span>
                  <span className="font-medium text-red-600">{assetData.overdueRenewals}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monthly Cost</span>
                  <span className="font-medium">${assetData.totalLicenseCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Asset Health</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Excellent</span>
                  <span className="font-medium text-green-600">{assetData.assetHealth.excellent}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Good</span>
                  <span className="font-medium text-blue-600">{assetData.assetHealth.good}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Needs Attention</span>
                  <span className="font-medium text-orange-600">
                    {assetData.assetHealth.fair + assetData.assetHealth.poor}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
          <div className="hidden xl:block xl:col-span-3 space-y-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Asset Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Assets</span>
                  <span className="font-medium">{assetData.totalAssets}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hardware</span>
                  <span className="font-medium">{assetData.hardwareAssets}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Software Licenses</span>
                  <span className="font-medium">{assetData.softwareLicenses}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monthly Cost</span>
                  <span className="font-medium">${assetData.totalLicenseCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Asset
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search Assets
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Renewal Calendar
                </Button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Hardware Categories</h3>
              <div className="space-y-3">
                {Object.entries(assetData.hardwareCategories).map(([category, count]) => {
                  const Icon = getCategoryIcon(category)
                  return (
                    <div key={category} className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{category}</span>
                      </div>
                      <span className="font-medium">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Top Vendors</h3>
              <div className="space-y-3">
                {vendorSummary.slice(0, 5).map((vendor) => (
                  <div key={vendor.vendor} className="flex justify-between text-sm">
                    <div>
                      <div className="font-medium">{vendor.vendor}</div>
                      <div className="text-xs text-muted-foreground">{vendor.licenses} licenses</div>
                    </div>
                    <span className="font-medium">${vendor.cost.toLocaleString()}/mo</span>
                  </div>
                ))}
              </div>
            </div>

            {/* HBI Assets Insights */}
            <div className="bg-card border border-border rounded-lg">
              <div className="p-3 border-b border-border">
                <h3 className="font-semibold text-sm text-foreground">HBI Assets Insights</h3>
              </div>
              <div className="p-0 h-80">
                <EnhancedHBIInsights config={assetInsights} cardId="assets-insights" />
              </div>
            </div>
          </div>

          <div className="xl:col-span-9">
            <div className="bg-card border border-border rounded-lg">
              <CardHeader>
                <CardTitle className="text-xl">Asset & License Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="licenses">Licenses</TabsTrigger>
                    <TabsTrigger value="hardware">Hardware</TabsTrigger>
                    <TabsTrigger value="lifecycle">Lifecycle</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="md:col-span-2 lg:col-span-3">
                        <AssetTrackerCard />
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">License Utilization</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {extendedLicenses.slice(0, 3).map((license) => {
                              const utilizationRate = (license.usedLicenses / license.totalLicenses) * 100
                              return (
                                <div key={license.software} className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="font-medium">{license.software}</span>
                                    <span className="text-muted-foreground">{utilizationRate.toFixed(0)}%</span>
                                  </div>
                                  <div className="bg-muted rounded-full h-2">
                                    <div
                                      className={`rounded-full h-2 ${
                                        utilizationRate > 90
                                          ? "bg-red-500"
                                          : utilizationRate > 75
                                          ? "bg-orange-500"
                                          : "bg-green-500"
                                      }`}
                                      style={{ width: `${utilizationRate}%` }}
                                    />
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Renewal Alerts</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {extendedLicenses
                              .filter((license) => {
                                const status = getExpirationStatus(license.renewalDate)
                                return status.status === "Critical" || status.status === "Warning"
                              })
                              .map((license) => {
                                const status = getExpirationStatus(license.renewalDate)
                                return (
                                  <div key={license.software} className="flex items-start gap-3">
                                    <div className={`p-1 rounded ${status.color}`}>
                                      <AlertTriangle className="h-3 w-3" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">{license.software}</p>
                                      <p className="text-xs text-muted-foreground">{status.days} days until renewal</p>
                                    </div>
                                  </div>
                                )
                              })}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Asset Health</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Excellent</span>
                              <span className="font-medium text-green-600">{assetData.assetHealth.excellent}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Good</span>
                              <span className="font-medium text-blue-600">{assetData.assetHealth.good}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Fair</span>
                              <span className="font-medium text-orange-600">{assetData.assetHealth.fair}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Poor</span>
                              <span className="font-medium text-red-600">{assetData.assetHealth.poor}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="licenses" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Software Licenses</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Software</TableHead>
                              <TableHead>Used / Total</TableHead>
                              <TableHead>Available</TableHead>
                              <TableHead>Cost/Month</TableHead>
                              <TableHead>Renewal Date</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {extendedLicenses.map((license) => {
                              const expStatus = getExpirationStatus(license.renewalDate)
                              const utilizationRate = (license.usedLicenses / license.totalLicenses) * 100
                              return (
                                <TableRow key={license.software}>
                                  <TableCell className="font-medium">{license.software}</TableCell>
                                  <TableCell>
                                    <div>
                                      <span className="text-sm">
                                        {license.usedLicenses} / {license.totalLicenses}
                                      </span>
                                      <div className="bg-muted rounded-full h-1 w-20 mt-1">
                                        <div
                                          className={`rounded-full h-1 ${
                                            utilizationRate > 90
                                              ? "bg-red-500"
                                              : utilizationRate > 75
                                              ? "bg-orange-500"
                                              : "bg-green-500"
                                          }`}
                                          style={{ width: `${utilizationRate}%` }}
                                        />
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>{license.availableLicenses}</TableCell>
                                  <TableCell>
                                    ${(license.costPerMonth * license.usedLicenses).toLocaleString()}
                                  </TableCell>
                                  <TableCell className="text-sm">
                                    {new Date(license.renewalDate).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className={expStatus.color}>
                                      {expStatus.status}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="hardware" className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Filters:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="desktop">Desktops</SelectItem>
                            <SelectItem value="laptop">Laptops</SelectItem>
                            <SelectItem value="tablet">Tablets</SelectItem>
                            <SelectItem value="mobile">Mobile Devices</SelectItem>
                            <SelectItem value="printer">Printers</SelectItem>
                            <SelectItem value="network">Network Equipment</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            <SelectItem value="hq dallas">HQ Dallas</SelectItem>
                            <SelectItem value="remote">Remote</SelectItem>
                            <SelectItem value="jobsite">Jobsites</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Hardware Inventory</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Asset ID</TableHead>
                              <TableHead>Model</TableHead>
                              <TableHead>Assigned To</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>OS/Firmware</TableHead>
                              <TableHead>Condition</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredHardware.map((asset) => (
                              <TableRow key={asset.id}>
                                <TableCell className="font-medium">{asset.id}</TableCell>
                                <TableCell>
                                  <div>
                                    <span className="text-sm">{asset.model}</span>
                                    <div className="text-xs text-muted-foreground">{asset.category}</div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm">{asset.assignedTo}</TableCell>
                                <TableCell className="text-sm">{asset.location}</TableCell>
                                <TableCell className="text-sm">{asset.osVersion}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getConditionColor(asset.condition)}>
                                    {asset.condition}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
                                  >
                                    {asset.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="lifecycle" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Warranty Expiration Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {hardwareInventory.slice(0, 5).map((asset) => {
                              const warrantyStatus = getExpirationStatus(asset.warrantyExpiry)
                              return (
                                <div key={asset.id} className="flex items-start gap-3">
                                  <div className={`p-1 rounded ${warrantyStatus.color}`}>
                                    <Clock className="h-3 w-3" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{asset.model}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {asset.id} • Expires {new Date(asset.warrantyExpiry).toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {warrantyStatus.status === "Expired"
                                        ? "Expired"
                                        : `${warrantyStatus.days} days remaining`}
                                    </p>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Asset Age Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Less than 1 Year</span>
                              <span className="font-medium text-green-600">89</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">1-2 Years</span>
                              <span className="font-medium text-blue-600">156</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">2-3 Years</span>
                              <span className="font-medium text-orange-600">45</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">3+ Years</span>
                              <span className="font-medium text-red-600">22</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
