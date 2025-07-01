"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/context/auth-context"
import { AppHeader } from "@/components/layout/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Edit,
  Search,
  Filter,
  RotateCcw
} from "lucide-react"

// Import procurement log components
import { ProcurementLogTable } from "@/components/procurement/ProcurementLogTable"
import { ProcurementLogForm } from "@/components/procurement/ProcurementLogForm"
import { ProcurementSyncPanel } from "@/components/procurement/ProcurementSyncPanel"
import { ProcurementStatsPanel } from "@/components/procurement/ProcurementStatsPanel"
import { HbiProcurementInsights } from "@/components/procurement/HbiProcurementInsights"
import { ExportModal } from "@/components/constraints/ExportModal"

import { useToast } from "@/hooks/use-toast"
import type { ProcurementLogRecord, ProcoreCommitment, BidTabLink } from "@/types/procurement"

export default function ProcurementLogPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  // State management
  const [procurementRecords, setProcurementRecords] = useState<ProcurementLogRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<ProcurementLogRecord[]>([])
  const [activeTab, setActiveTab] = useState("log")
  const [isLoading, setIsLoading] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [csiFilter, setCsiFilter] = useState("all")
  const [selectedRecord, setSelectedRecord] = useState<ProcurementLogRecord | null>(null)
  const [showRecordForm, setShowRecordForm] = useState(false)

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
          canEdit: true,
          canSync: true
        }
      case "project-executive":
        return {
          scope: "portfolio",
          projectCount: 6,
          description: "Portfolio View - 6 Projects",
          canCreate: true,
          canApprove: true,
          canEdit: true,
          canSync: true
        }
      case "project-manager":
        return {
          scope: "single",
          projectCount: 1,
          description: "Single Project View",
          canCreate: true,
          canApprove: false,
          canEdit: true,
          canSync: false
        }
      default:
        return {
          scope: "limited",
          projectCount: 1,
          description: "Limited View",
          canCreate: false,
          canApprove: false,
          canEdit: false,
          canSync: false
        }
    }
  }

  const dataScope = getDataScope()

  // Mock data generation based on Procore integration
  useEffect(() => {
    setIsLoading(true)
    
    // Simulate loading Procore commitments and generating procurement log records
    setTimeout(() => {
      const mockRecords: ProcurementLogRecord[] = generateMockProcurementRecords()
      setProcurementRecords(mockRecords)
      setFilteredRecords(mockRecords)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter records based on search and filters
  useEffect(() => {
    let filtered = procurementRecords

    // Text search
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.commitment_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.csi_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.csi_description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(record => record.status === statusFilter)
    }

    // CSI filter
    if (csiFilter !== "all") {
      filtered = filtered.filter(record => record.csi_code.startsWith(csiFilter))
    }

    setFilteredRecords(filtered)
  }, [procurementRecords, searchTerm, statusFilter, csiFilter])

  // Handle Procore sync
  const handleProcoreSync = async () => {
    setIsLoading(true)
    try {
      // Simulate Procore API sync
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate new records with updated Procore data
      const updatedRecords = generateMockProcurementRecords()
      setProcurementRecords(updatedRecords)
      
      toast({
        title: "Procore Sync Complete",
        description: "Commitment data has been synchronized from Procore",
      })
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync with Procore. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle record creation/update
  const handleRecordSubmit = (recordData: Partial<ProcurementLogRecord>) => {
    if (selectedRecord) {
      // Update existing record
      const updatedRecords = procurementRecords.map(record =>
        record.id === selectedRecord.id ? { ...record, ...recordData } : record
      )
      setProcurementRecords(updatedRecords)
      toast({
        title: "Record Updated",
        description: "Procurement record has been updated successfully",
      })
    } else {
      // Create new record
      const newRecord: ProcurementLogRecord = {
        id: `proc-${Date.now()}`,
        procore_commitment_id: "",
        project_id: "proj-001",
        ...recordData
      } as ProcurementLogRecord
      
      setProcurementRecords([...procurementRecords, newRecord])
      toast({
        title: "Record Created",
        description: "New procurement record has been created successfully",
      })
    }
    
    setShowRecordForm(false)
    setSelectedRecord(null)
  }

  // Handle export
  const handleExportSubmit = (options: { format: "pdf" | "excel" | "csv"; fileName: string; filePath: string }) => {
    try {
      // Export functionality would go here
      toast({
        title: "Export Started",
        description: `Procurement log exported to ${options.format.toUpperCase()}`,
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

  // Calculate statistics for widgets
  const stats = useMemo(() => {
    const totalValue = procurementRecords.reduce((sum, record) => sum + record.contract_amount, 0)
    const activeBuyouts = procurementRecords.filter(r => ["bidding", "negotiation", "awarded", "active"].includes(r.status)).length
    const completedBuyouts = procurementRecords.filter(r => r.status === "completed").length
    const pendingContracts = procurementRecords.filter(r => r.status === "pending_approval").length
    const vendorCount = new Set(procurementRecords.map(r => r.vendor_name)).size
    const complianceRate = procurementRecords.filter(r => r.compliance_status === "compliant").length / Math.max(procurementRecords.length, 1) * 100
    const avgSavings = procurementRecords.reduce((sum, r) => sum + Math.abs(r.variance_percentage), 0) / Math.max(procurementRecords.length, 1)
    const onTimeDelivery = 92.3 // Mock value - would be calculated from milestone data
    
    // Calculate category breakdown
    const byCategory = procurementRecords.reduce((acc, record) => {
      acc[record.contract_type] = (acc[record.contract_type] || 0) + record.contract_amount
      return acc
    }, {} as Record<string, number>)

    // Calculate status breakdown
    const byStatus = procurementRecords.reduce((acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1
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
  }, [procurementRecords])

  // Calculate additional stats for our components
  const procurementStats = useMemo(() => {
    const activeProcurements = procurementRecords.filter(r => ["bidding", "negotiation", "awarded", "active"].includes(r.status)).length
    const completedProcurements = procurementRecords.filter(r => r.status === "completed").length
    const pendingApprovals = procurementRecords.filter(r => r.status === "pending_approval").length
    const linkedToBidTabs = procurementRecords.filter(r => r.bid_tab_link?.bid_tab_id).length
    const avgCycleTime = 28 // Mock value

    return {
      totalValue: stats.totalValue,
      activeProcurements,
      completedProcurements,
      pendingApprovals,
      linkedToBidTabs,
      avgCycleTime,
      complianceRate: stats.complianceRate,
      totalRecords: procurementRecords.length
    }
  }, [procurementRecords, stats])

  const ProcurementLogContentCard = () => (
    <Card className={isFullScreen ? "fixed inset-0 z-[130] rounded-none" : ""}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-[#FF6B35]" />
          Procurement Log
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
          <TabsList className="grid w-full grid-cols-3" data-tour="procurement-log-tabs">
            <TabsTrigger 
              value="log"
              className="flex items-center gap-2"
              data-tour="procurement-tab"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Procurement Log</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sync"
              className="flex items-center gap-2"
              data-tour="sync-tab"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Procore Sync</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="flex items-center gap-2"
              data-tour="analytics-tab"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="log" className="mt-6">
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 gap-2">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search procurement records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="bidding">Bidding</SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                      <SelectItem value="awarded">Awarded</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={csiFilter} onValueChange={setCsiFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="CSI Division" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Divisions</SelectItem>
                      <SelectItem value="01">01 - General</SelectItem>
                      <SelectItem value="02">02 - Existing Conditions</SelectItem>
                      <SelectItem value="03">03 - Concrete</SelectItem>
                      <SelectItem value="04">04 - Masonry</SelectItem>
                      <SelectItem value="05">05 - Metals</SelectItem>
                      <SelectItem value="06">06 - Wood & Plastics</SelectItem>
                      <SelectItem value="07">07 - Thermal & Moisture</SelectItem>
                      <SelectItem value="08">08 - Openings</SelectItem>
                      <SelectItem value="09">09 - Finishes</SelectItem>
                      <SelectItem value="10">10 - Specialties</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Procurement Log Table */}
              <div data-tour="procurement-table">
                <ProcurementLogTable
                  records={filteredRecords}
                  onRecordEdit={(record: ProcurementLogRecord) => {
                    setSelectedRecord(record)
                    setShowRecordForm(true)
                  }}
                  onRecordView={(record: ProcurementLogRecord) => {
                    // Handle record view
                  }}
                  isLoading={isLoading}
                  userRole={userRole}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sync" className="mt-6">
            <ProcurementSyncPanel
              onSync={handleProcoreSync}
              isLoading={isLoading}
              lastSyncTime={new Date()}
              dataScope={dataScope}
            />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="space-y-6">
              <ProcurementStatsPanel stats={procurementStats} />
              <HbiProcurementInsights procurementStats={procurementStats} />
            </div>
          </TabsContent>
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
                  <BreadcrumbPage>Procurement Log</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Header Section */}
            <div className="flex flex-col gap-4" data-tour="procurement-log-page-header">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Procurement Log</h1>
                  <p className="text-muted-foreground mt-1">Track and manage subcontract procurement linked to Procore commitments and bid tabs</p>
                  <div className="flex items-center gap-4 mt-2" data-tour="procurement-log-scope-badges">
                    <Badge variant="outline" className="px-3 py-1">
                      {dataScope.description}
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1">
                      {procurementStats.totalRecords} Records
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1">
                      {procurementStats.linkedToBidTabs} Linked to Bid Tabs
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {dataScope.canSync && (
                    <Button variant="outline" onClick={handleProcoreSync} disabled={isLoading}>
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                      Sync Procore
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setIsExportModalOpen(true)}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  {dataScope.canCreate && (
                    <Button 
                      onClick={() => setShowRecordForm(true)}
                      className="bg-[#FF6B35] hover:bg-[#E55A2B]"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Record
                    </Button>
                  )}
                </div>
              </div>

              {/* Statistics Widgets */}
              <div data-tour="procurement-log-quick-stats">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                          <p className="text-2xl font-bold">
                            {stats.totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-[#FF6B35]" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Active</p>
                          <p className="text-2xl font-bold">{procurementStats.activeProcurements}</p>
                        </div>
                        <Activity className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Completed</p>
                          <p className="text-2xl font-bold">{procurementStats.completedProcurements}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                          <p className="text-2xl font-bold">{procurementStats.pendingApprovals}</p>
                        </div>
                        <Clock className="h-8 w-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </>
        )}

        {/* HBI Insights Panel */}
        <div data-tour="procurement-hbi-insights">
          <HbiProcurementInsights procurementStats={procurementStats} />
        </div>

        {/* Main Content */}
        <ProcurementLogContentCard />

        {/* Record Form Modal */}
        <Dialog open={showRecordForm} onOpenChange={setShowRecordForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedRecord ? "Edit Procurement Record" : "Create New Procurement Record"}
              </DialogTitle>
            </DialogHeader>
            <ProcurementLogForm
              record={selectedRecord}
              onSubmit={handleRecordSubmit}
              onCancel={() => {
                setShowRecordForm(false)
                setSelectedRecord(null)
              }}
            />
          </DialogContent>
        </Dialog>

        <div data-tour="procurement-export">
          <ExportModal
            open={isExportModalOpen}
            onOpenChange={setIsExportModalOpen}
            onExport={handleExportSubmit}
            defaultFileName="ProcurementLog"
          />
        </div>
      </div>
    </>
  )
}

// Mock data generation function
function generateMockProcurementRecords(): ProcurementLogRecord[] {
  const records: ProcurementLogRecord[] = [
    {
      id: "proc-001",
      procore_commitment_id: "2525840-001",
      project_id: "proj-001",
      commitment_title: "EXTERIOR WALL ASSEMBLIES",
      commitment_number: "2525840-001",
      vendor_name: "The City of West Palm Beach",
      vendor_contact: {
        name: "John Smith",
        email: "john.smith@cityofwestpalmbeach.com",
        phone: "(561) 822-1400"
      },
      csi_code: "07 40 00",
      csi_description: "Roofing and Siding Panels",
      status: "planning",
      contract_amount: 1609994.17,
      budget_amount: 1700000.00,
      variance: -90005.83,
      variance_percentage: -5.29,
      procurement_method: "competitive-bid",
      bid_tab_link: {
        bid_tab_id: "bid-tab-exterior-001",
        csi_match: true,
        description_match: 85
      },
      contract_type: "subcontract",
      start_date: "2025-02-01",
      completion_date: "2025-06-30",
      milestones: [
        {
          name: "Bid Opening",
          date: "2025-01-15",
          status: "completed",
          completed: true
        },
        {
          name: "Contract Award",
          date: "2025-01-30",
          status: "pending",
          completed: false
        }
      ],
      compliance_status: "compliant",
      bonds_required: true,
      insurance_verified: true,
      created_at: "2025-01-10T10:00:00Z",
      updated_at: "2025-01-15T14:30:00Z",
      created_by: "System Import",
      procurement_notes: "Imported from Procore commitment. Linked to exterior wall assemblies bid tab."
    },
    {
      id: "proc-002",
      procore_commitment_id: "2525840-002",
      project_id: "proj-001",
      commitment_title: "ACOUSTICAL SPACE UNITS",
      commitment_number: "2525840-002",
      vendor_name: "AMERICAN LEAK DETECTION",
      vendor_contact: {
        name: "Sarah Johnson",
        email: "sarah@americanleakdetection.com",
        phone: "(561) 744-6999"
      },
      csi_code: "09 50 00",
      csi_description: "Ceilings",
      status: "negotiation",
      contract_amount: 1018842.05,
      budget_amount: 1000000.00,
      variance: 18842.05,
      variance_percentage: 1.88,
      procurement_method: "competitive-bid",
      bid_tab_link: {
        bid_tab_id: "bid-tab-acoustical-001",
        csi_match: true,
        description_match: 92
      },
      contract_type: "subcontract",
      start_date: "2025-03-01",
      completion_date: "2025-07-15",
      milestones: [
        {
          name: "Bid Analysis",
          date: "2025-01-20",
          status: "completed",
          completed: true
        },
        {
          name: "Negotiations",
          date: "2025-02-01",
          status: "in-progress",
          completed: false
        }
      ],
      compliance_status: "warning",
      bonds_required: false,
      insurance_verified: false,
      created_at: "2025-01-12T09:15:00Z",
      updated_at: "2025-01-20T16:45:00Z",
      created_by: "System Import",
      procurement_notes: "Insurance documentation pending. Negotiations ongoing for value engineering opportunities."
    }
  ]

  return records
} 