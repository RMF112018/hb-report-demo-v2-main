"use client"

import React, { useState, useEffect, useMemo } from "react"

// Compact grid styling
const compactGridStyles = `
  .compact-grid .ag-root-wrapper {
    font-size: 12px;
  }
  
  .compact-grid .ag-header-cell {
    font-size: 11px;
    font-weight: 600;
    padding: 8px 12px;
    height: 40px;
  }
  
  .compact-grid .ag-cell {
    font-size: 12px;
    padding: 6px 12px;
    height: 48px;
    line-height: 1.4;
  }
  
  .compact-grid .ag-row {
    height: 48px;
  }
  
  .compact-grid .ag-row:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
  
  .compact-grid .ag-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
  }
  
  .compact-grid .ag-header-cell-resize {
    background-color: #dee2e6;
  }
  
  .compact-grid .ag-cell-wrapper {
    height: 100%;
    display: flex;
    align-items: center;
  }
  
  .compact-grid .ag-cell-value {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  /* Dark mode specific styling */
  .dark .compact-grid .ag-header {
    background-color: #1f2937;
    border-bottom: 1px solid #374151;
  }
  
  .dark .compact-grid .ag-header-cell {
    color: #f9fafb;
    background-color: #1f2937;
  }
  
  .dark .compact-grid .ag-header-cell-label {
    color: #f9fafb;
  }
  
  .dark .compact-grid .ag-header-cell-text {
    color: #f9fafb;
  }
  
  .dark .compact-grid .ag-header-cell-resize {
    background-color: #4b5563;
  }
  
  .dark .compact-grid .ag-row:hover {
    background-color: rgba(255, 255, 255, 0.04);
  }
  
  .dark .compact-grid .ag-cell {
    color: #f9fafb;
  }
`
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  ProtectedGrid,
  ProtectedColDef,
  GridRow,
  createGridWithTotalsAndSticky,
  createReadOnlyColumn,
} from "@/components/ui/protected-grid"
import {
  Building2,
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  Plus,
  RefreshCw,
  FileText,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Package,
  ArrowUpRight,
  Zap,
  Link,
  Shield,
  Activity,
} from "lucide-react"

interface ProcurementCommitment {
  id: string
  procoreId: string
  number: string
  title: string
  vendor: {
    name: string
    id: string
    contact: string
    phone: string
  }
  trade: string
  status: "draft" | "pending" | "approved" | "executed" | "complete" | "cancelled"
  contractAmount: number
  originalAmount: number
  variance: number
  variancePercent: number
  startDate: string
  endDate: string
  completionPercent: number
  paymentTerms: string
  retentionPercent: number
  bondRequired: boolean
  insuranceVerified: boolean
  procoreSyncStatus: "synced" | "pending" | "error"
  lastSyncDate: string
  changeOrders: number
  invoicesSubmitted: number
  invoicesPaid: number
  currentBalance: number
  project: {
    id: string
    name: string
  }
  createdBy: string
  createdAt: string
  updatedAt: string
}

interface ProcurementCommitmentsTableProps {
  projectId?: string
  userRole: string
  onCommitmentSelect?: (commitment: ProcurementCommitment) => void
  onCommitmentEdit?: (commitment: ProcurementCommitment) => void
  onSyncProcore?: () => void
  compactMode?: boolean
}

export function ProcurementCommitmentsTable({
  projectId,
  userRole,
  onCommitmentSelect,
  onCommitmentEdit,
  onSyncProcore,
  compactMode = false,
}: ProcurementCommitmentsTableProps) {
  const [commitments, setCommitments] = useState<ProcurementCommitment[]>([])
  const [filteredCommitments, setFilteredCommitments] = useState<ProcurementCommitment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tradeFilter, setTradeFilter] = useState("all")
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle")
  const [selectedCommitments, setSelectedCommitments] = useState<string[]>([])
  const [showCommitmentDetail, setShowCommitmentDetail] = useState(false)
  const [selectedCommitment, setSelectedCommitment] = useState<ProcurementCommitment | null>(null)

  // Mock Procore integration - simulate fetching commitments
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockCommitments: ProcurementCommitment[] = [
        {
          id: "commit-001",
          procoreId: "PCR-2024-001",
          number: "SC-001",
          title: "Structural Steel Package - Phase 1",
          vendor: {
            name: "ABC Steel Works",
            id: "vendor-001",
            contact: "John Smith",
            phone: "(555) 123-4567",
          },
          trade: "Structural",
          status: "executed",
          contractAmount: 2650000,
          originalAmount: 2500000,
          variance: 150000,
          variancePercent: 6.0,
          startDate: "2024-01-15",
          endDate: "2024-06-30",
          completionPercent: 68,
          paymentTerms: "Net 30",
          retentionPercent: 5.0,
          bondRequired: true,
          insuranceVerified: true,
          procoreSyncStatus: "synced",
          lastSyncDate: "2024-12-20T10:30:00Z",
          changeOrders: 2,
          invoicesSubmitted: 4,
          invoicesPaid: 3,
          currentBalance: 1802000,
          project: {
            id: projectId || "2525840",
            name: "Palm Beach Luxury Estate",
          },
          createdBy: "system",
          createdAt: "2024-01-10T08:00:00Z",
          updatedAt: "2024-12-20T10:30:00Z",
        },
        {
          id: "commit-002",
          procoreId: "PCR-2024-002",
          number: "SC-002",
          title: "MEP Systems Installation",
          vendor: {
            name: "Advanced MEP Solutions",
            id: "vendor-002",
            contact: "Sarah Johnson",
            phone: "(555) 234-5678",
          },
          trade: "MEP",
          status: "approved",
          contractAmount: 1850000,
          originalAmount: 1850000,
          variance: 0,
          variancePercent: 0,
          startDate: "2024-02-01",
          endDate: "2024-08-30",
          completionPercent: 35,
          paymentTerms: "Net 30",
          retentionPercent: 10.0,
          bondRequired: true,
          insuranceVerified: true,
          procoreSyncStatus: "synced",
          lastSyncDate: "2024-12-20T09:15:00Z",
          changeOrders: 1,
          invoicesSubmitted: 2,
          invoicesPaid: 1,
          currentBalance: 1387500,
          project: {
            id: projectId || "2525840",
            name: "Palm Beach Luxury Estate",
          },
          createdBy: "system",
          createdAt: "2024-01-25T10:00:00Z",
          updatedAt: "2024-12-20T09:15:00Z",
        },
        {
          id: "commit-003",
          procoreId: "PCR-2024-003",
          number: "SC-003",
          title: "Concrete & Masonry Works",
          vendor: {
            name: "Elite Concrete Co",
            id: "vendor-003",
            contact: "Mike Rodriguez",
            phone: "(555) 345-6789",
          },
          trade: "Concrete",
          status: "pending",
          contractAmount: 975000,
          originalAmount: 950000,
          variance: 25000,
          variancePercent: 2.6,
          startDate: "2024-03-01",
          endDate: "2024-07-15",
          completionPercent: 0,
          paymentTerms: "Net 30",
          retentionPercent: 5.0,
          bondRequired: false,
          insuranceVerified: false,
          procoreSyncStatus: "pending",
          lastSyncDate: "2024-12-19T14:45:00Z",
          changeOrders: 0,
          invoicesSubmitted: 0,
          invoicesPaid: 0,
          currentBalance: 0,
          project: {
            id: projectId || "2525840",
            name: "Palm Beach Luxury Estate",
          },
          createdBy: "system",
          createdAt: "2024-02-15T11:30:00Z",
          updatedAt: "2024-12-19T14:45:00Z",
        },
        {
          id: "commit-004",
          procoreId: "PCR-2024-004",
          number: "SC-004",
          title: "Drywall & Finishes",
          vendor: {
            name: "Perfect Finishes LLC",
            id: "vendor-004",
            contact: "Lisa Chen",
            phone: "(555) 456-7890",
          },
          trade: "Finishes",
          status: "draft",
          contractAmount: 680000,
          originalAmount: 680000,
          variance: 0,
          variancePercent: 0,
          startDate: "2024-04-15",
          endDate: "2024-08-30",
          completionPercent: 0,
          paymentTerms: "Net 30",
          retentionPercent: 5.0,
          bondRequired: false,
          insuranceVerified: false,
          procoreSyncStatus: "error",
          lastSyncDate: "2024-12-18T16:20:00Z",
          changeOrders: 0,
          invoicesSubmitted: 0,
          invoicesPaid: 0,
          currentBalance: 0,
          project: {
            id: projectId || "2525840",
            name: "Palm Beach Luxury Estate",
          },
          createdBy: "system",
          createdAt: "2024-02-20T09:15:00Z",
          updatedAt: "2024-12-18T16:20:00Z",
        },
      ]

      setCommitments(mockCommitments)
      setFilteredCommitments(mockCommitments)
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [projectId])

  // Filter commitments based on search and filters
  useEffect(() => {
    let filtered = commitments

    if (searchTerm) {
      filtered = filtered.filter(
        (commitment) =>
          commitment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          commitment.vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          commitment.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          commitment.trade.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((commitment) => commitment.status === statusFilter)
    }

    if (tradeFilter !== "all") {
      filtered = filtered.filter((commitment) => commitment.trade === tradeFilter)
    }

    setFilteredCommitments(filtered)
  }, [commitments, searchTerm, statusFilter, tradeFilter])

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

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { color: string; label: string } } = {
      draft: { color: "bg-gray-100 text-gray-800 border-gray-200", label: "Draft" },
      pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pending" },
      approved: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Approved" },
      executed: { color: "bg-green-100 text-green-800 border-green-200", label: "Executed" },
      complete: { color: "bg-purple-100 text-purple-800 border-purple-200", label: "Complete" },
      cancelled: { color: "bg-red-100 text-red-800 border-red-200", label: "Cancelled" },
    }
    const config = statusConfig[status] || statusConfig.draft
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getSyncStatusBadge = (syncStatus: string) => {
    const syncConfig: { [key: string]: { color: string; label: string; icon: React.ReactNode } } = {
      synced: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Synced",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Pending",
        icon: <Clock className="h-3 w-3" />,
      },
      error: {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Error",
        icon: <AlertTriangle className="h-3 w-3" />,
      },
    }
    const config = syncConfig[syncStatus] || syncConfig.pending
    return (
      <Badge variant="outline" className={config.color}>
        {config.icon}
        <span className="ml-1">{config.label}</span>
      </Badge>
    )
  }

  const getVarianceColor = (variance: number, percentage: number) => {
    if (variance === 0) return "text-gray-600"
    if (variance > 0) return "text-red-600"
    return "text-green-600"
  }

  const getVarianceIcon = (variance: number) => {
    if (variance === 0) return null
    if (variance > 0) return <TrendingUp className="h-3 w-3" />
    return <TrendingDown className="h-3 w-3" />
  }

  const handleSync = async () => {
    setSyncStatus("syncing")
    // Simulate Procore API sync
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setSyncStatus("success")
    if (onSyncProcore) onSyncProcore()
    setTimeout(() => setSyncStatus("idle"), 3000)
  }

  const handleCommitmentClick = (commitment: ProcurementCommitment) => {
    setSelectedCommitment(commitment)
    setShowCommitmentDetail(true)
    if (onCommitmentSelect) onCommitmentSelect(commitment)
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on commitments:`, selectedCommitments)
    // Implement bulk actions
  }

  const getUniqueValues = (key: keyof ProcurementCommitment) => {
    return [...new Set(commitments.map((commitment) => commitment[key] as string))]
  }

  const totalValue = filteredCommitments.reduce((sum, commitment) => sum + commitment.contractAmount, 0)
  const totalVariance = filteredCommitments.reduce((sum, commitment) => sum + commitment.variance, 0)
  const avgCompletion =
    filteredCommitments.reduce((sum, commitment) => sum + commitment.completionPercent, 0) /
      filteredCommitments.length || 0

  // Transform commitments data for the grid - matching BuyoutV2.js structure
  const transformedCommitments = useMemo(() => {
    return filteredCommitments.map((commitment) => ({
      id: commitment.id, // Required field for GridRow
      procore_id: commitment.procoreId,
      division_description: commitment.trade,
      title: commitment.title,
      number: commitment.number,
      vendor: commitment.vendor.name,
      status: commitment.status,
      bic: "N/A", // Default BIC value
      contract_start_date: commitment.startDate,
      grand_total: commitment.contractAmount,
      budget: commitment.originalAmount,
      allowances: 0, // Default allowances value
      savings_loss: commitment.variance,
      ownerApproval: commitment.status === "executed" ? "Approved" : "Pending",
      signed_contract_received_date: commitment.status === "executed" ? commitment.endDate : null,
      comments: "", // Default comments
      _originalData: commitment, // Keep reference to original data
    }))
  }, [filteredCommitments])

  // Define column definitions for the grid - matching BuyoutV2.js structure
  const columnDefs: ProtectedColDef[] = useMemo(
    () => [
      createReadOnlyColumn("division_description", "Division", {
        width: 200,
        cellStyle: { fontWeight: "bold" },
      }),
      createReadOnlyColumn("title", "Commitment", {
        width: 200,
        cellStyle: { fontWeight: "bold" },
      }),
      createReadOnlyColumn("number", "Commitment #", {
        width: 150,
      }),
      createReadOnlyColumn("vendor", "Vendor", {
        width: 200,
      }),
      createReadOnlyColumn("status", "Status", {
        width: 180,
        cellRenderer: (params: any) => {
          const statusConfig: { [key: string]: { color: string; label: string } } = {
            Pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pending" },
            "In Progress": { color: "bg-blue-100 text-blue-800 border-blue-200", label: "In Progress" },
            "LOI Sent": { color: "bg-orange-100 text-orange-800 border-orange-200", label: "LOI Sent" },
            "Contract Sent": { color: "bg-purple-100 text-purple-800 border-purple-200", label: "Contract Sent" },
            "Contract Executed": {
              color: "bg-green-100 text-green-800 border-green-200",
              label: "Contract Executed",
            },
            "On Hold": { color: "bg-red-100 text-red-800 border-red-200", label: "On Hold" },
          }
          const config = statusConfig[params.value] || statusConfig["Pending"]
          return (
            <Badge variant="outline" className={`${config.color} text-xs`}>
              {config.label}
            </Badge>
          )
        },
      }),
      createReadOnlyColumn("bic", "BIC", {
        width: 120,
        cellRenderer: (params: any) => {
          const bicConfig: { [key: string]: { color: string; label: string } } = {
            HB: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "HB" },
            Vendor: { color: "bg-green-100 text-green-800 border-green-200", label: "Vendor" },
            Owner: { color: "bg-purple-100 text-purple-800 border-purple-200", label: "Owner" },
            "N/A": { color: "bg-gray-100 text-gray-800 border-gray-200", label: "N/A" },
          }
          const config = bicConfig[params.value] || bicConfig["N/A"]
          return (
            <Badge variant="outline" className={`${config.color} text-xs`}>
              {config.label}
            </Badge>
          )
        },
      }),
      createReadOnlyColumn("contract_start_date", "Scope Start", {
        width: 150,
        cellRenderer: (params: any) => {
          if (!params.value) return ""
          const date = new Date(params.value)
          return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
        },
      }),
      createReadOnlyColumn("grand_total", "Contract Amount", {
        width: 160,
        cellRenderer: (params: any) => {
          const value = parseFloat(params.value || 0)
          return value.toLocaleString("en-US", { style: "currency", currency: "USD" })
        },
      }),
      createReadOnlyColumn("budget", "Budget", {
        width: 160,
        cellRenderer: (params: any) => {
          const value = parseFloat(params.value || 0)
          return value.toLocaleString("en-US", { style: "currency", currency: "USD" })
        },
      }),
      createReadOnlyColumn("allowances", "Allowances", {
        width: 160,
        cellRenderer: (params: any) => {
          const value = parseFloat(params.value || 0)
          return value.toLocaleString("en-US", { style: "currency", currency: "USD" })
        },
      }),
      createReadOnlyColumn("savings_loss", "Savings / Loss", {
        width: 160,
        cellRenderer: (params: any) => {
          const value = parseFloat(params.value || 0)
          const formattedValue = value.toLocaleString("en-US", { style: "currency", currency: "USD" })
          const color = value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "text-gray-600"
          return <span className={color}>{formattedValue}</span>
        },
      }),
      createReadOnlyColumn("ownerApproval", "Owner Approval", {
        width: 150,
      }),
      createReadOnlyColumn("signed_contract_received_date", "Contract Executed", {
        width: 150,
        cellRenderer: (params: any) => {
          if (!params.value) return ""
          const date = new Date(params.value)
          return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
        },
      }),
      createReadOnlyColumn("comments", "Comments", {
        width: 200,
      }),
      createReadOnlyColumn("actions", "Actions", {
        width: 120,
        cellRenderer: (params: any) => {
          const commitment = params.data._originalData
          return (
            <div className="flex items-center gap-1">
              <Button size="sm" variant="outline" onClick={() => handleCommitmentClick(commitment)}>
                <Eye className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => onCommitmentEdit && onCommitmentEdit(commitment)}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(`https://app.procore.com/commitments/${commitment.procoreId}`, "_blank")}
              >
                <ArrowUpRight className="h-3 w-3" />
              </Button>
            </div>
          )
        },
        pinned: "right",
        sortable: false,
        filter: false,
      }),
    ],
    [handleCommitmentClick, onCommitmentEdit]
  )

  // Grid configuration with consistent styling
  const gridConfig = createGridWithTotalsAndSticky(2, false, {
    allowExport: true,
    allowRowSelection: true,
    allowMultiSelection: true,
    allowColumnReordering: false,
    allowColumnResizing: true,
    allowSorting: true,
    allowFiltering: true,
    allowCellEditing: false,
    showToolbar: true,
    showStatusBar: true,
    userRole,
    theme: "quartz",
  })

  // Handle row selection
  const handleRowSelection = (event: any) => {
    const selectedNodes = event.api.getSelectedNodes()
    const selectedIds = selectedNodes.map((node: any) => node.data.id)
    setSelectedCommitments(selectedIds)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Loading commitments...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Inject compact grid styles */}
      <style dangerouslySetInnerHTML={{ __html: compactGridStyles }} />

      {/* Summary Stats */}
      {!compactMode && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Variance</p>
                  <p className={`text-2xl font-bold ${getVarianceColor(totalVariance, 0)}`}>
                    {formatCurrency(totalVariance)}
                  </p>
                </div>
                {getVarianceIcon(totalVariance)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Completion</p>
                  <p className="text-2xl font-bold">{avgCompletion.toFixed(0)}%</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Commitments</p>
                  <p className="text-2xl font-bold">{filteredCommitments.length}</p>
                </div>
                <Package className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Commitments Grid */}
      <Card>
        <CardContent>
          {/* Protected Grid */}
          <div className="min-w-0 max-w-full overflow-hidden">
            <ProtectedGrid
              columnDefs={columnDefs}
              rowData={transformedCommitments}
              config={gridConfig}
              events={{
                onRowSelected: handleRowSelection,
                onGridReady: (event) => {
                  // Grid ready event
                },
              }}
              height="600px"
              loading={loading}
              enableSearch={false} // We handle search externally
              title=""
              className="compact-grid"
            />
          </div>

          {filteredCommitments.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No commitments found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Commitment Detail Modal */}
      {selectedCommitment && (
        <Dialog open={showCommitmentDetail} onOpenChange={setShowCommitmentDetail}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#FF6B35]" />
                {selectedCommitment.title}
                <Badge variant="outline" className="ml-2">
                  {selectedCommitment.procoreId}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-500">Contract Amount</p>
                    <p className="text-xl font-bold">{formatCurrency(selectedCommitment.contractAmount)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-500">Completion</p>
                    <p className="text-xl font-bold">{selectedCommitment.completionPercent}%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-500">Current Balance</p>
                    <p className="text-xl font-bold">{formatCurrency(selectedCommitment.currentBalance)}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Commitment Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contract Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Number:</span>
                        <div className="font-medium">{selectedCommitment.number}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Trade:</span>
                        <div className="font-medium">{selectedCommitment.trade}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Start Date:</span>
                        <div className="font-medium">{formatDate(selectedCommitment.startDate)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">End Date:</span>
                        <div className="font-medium">{formatDate(selectedCommitment.endDate)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Payment Terms:</span>
                        <div className="font-medium">{selectedCommitment.paymentTerms}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Retention:</span>
                        <div className="font-medium">{selectedCommitment.retentionPercent}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Vendor Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Company:</span>
                        <div className="font-medium">{selectedCommitment.vendor.name}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Contact:</span>
                        <div className="font-medium">{selectedCommitment.vendor.contact}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <div className="font-medium">{selectedCommitment.vendor.phone}</div>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <Badge variant={selectedCommitment.bondRequired ? "default" : "outline"}>
                          {selectedCommitment.bondRequired ? "Bond Required" : "No Bond"}
                        </Badge>
                        <Badge variant={selectedCommitment.insuranceVerified ? "default" : "outline"}>
                          {selectedCommitment.insuranceVerified ? "Insurance Verified" : "Insurance Pending"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Financial Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financial Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedCommitment.changeOrders}</div>
                      <div className="text-sm text-blue-500">Change Orders</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{selectedCommitment.invoicesSubmitted}</div>
                      <div className="text-sm text-green-500">Invoices Submitted</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{selectedCommitment.invoicesPaid}</div>
                      <div className="text-sm text-purple-500">Invoices Paid</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {((selectedCommitment.invoicesPaid / selectedCommitment.invoicesSubmitted) * 100 || 0).toFixed(
                          0
                        )}
                        %
                      </div>
                      <div className="text-sm text-orange-500">Payment Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sync Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Procore Sync Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getSyncStatusBadge(selectedCommitment.procoreSyncStatus)}
                        <span className="text-sm text-gray-500">
                          Last sync: {formatDate(selectedCommitment.lastSyncDate)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        This commitment is{" "}
                        {selectedCommitment.procoreSyncStatus === "synced" ? "synchronized" : "not synchronized"} with
                        Procore
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(`https://app.procore.com/commitments/${selectedCommitment.procoreId}`, "_blank")
                      }
                    >
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      View in Procore
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
