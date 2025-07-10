"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
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

      {/* Commitments Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5 text-[#FF6B35]" />
              Procore Commitments
              <Badge variant="outline" className="ml-2">
                <Zap className="h-3 w-3 mr-1" />
                Live Sync
              </Badge>
            </CardTitle>

            <div className="flex items-center gap-2">
              {selectedCommitments.length > 0 && (
                <Select onValueChange={handleBulkAction}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Bulk actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sync">Sync Selected</SelectItem>
                    <SelectItem value="export">Export Selected</SelectItem>
                    <SelectItem value="update">Update Status</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Button variant="outline" size="sm" onClick={handleSync} disabled={syncStatus === "syncing"}>
                {syncStatus === "syncing" ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Sync Procore
              </Button>

              <Button size="sm" className="bg-[#FF6B35] hover:bg-[#E55A2B]">
                <Plus className="h-4 w-4 mr-2" />
                New Commitment
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search commitments, vendors, or trades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="executed">Executed</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
              </SelectContent>
            </Select>

            <Select value={tradeFilter} onValueChange={setTradeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by trade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trades</SelectItem>
                {getUniqueValues("trade").map((trade) => (
                  <SelectItem key={trade} value={trade}>
                    {trade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedCommitments.length === filteredCommitments.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCommitments(filteredCommitments.map((c) => c.id))
                        } else {
                          setSelectedCommitments([])
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Commitment / Vendor</TableHead>
                  <TableHead>Trade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Contract Amount</TableHead>
                  <TableHead className="text-right">Variance</TableHead>
                  <TableHead className="text-center">Completion</TableHead>
                  <TableHead className="text-center">Sync Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommitments.map((commitment) => (
                  <TableRow key={commitment.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedCommitments.includes(commitment.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCommitments([...selectedCommitments, commitment.id])
                          } else {
                            setSelectedCommitments(selectedCommitments.filter((id) => id !== commitment.id))
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="cursor-pointer" onClick={() => handleCommitmentClick(commitment)}>
                        <div className="font-medium">{commitment.title}</div>
                        <div className="text-sm text-gray-500">{commitment.vendor.name}</div>
                        <div className="text-xs text-gray-400">{commitment.number}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{commitment.trade}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(commitment.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">{formatCurrency(commitment.contractAmount)}</div>
                      {commitment.originalAmount !== commitment.contractAmount && (
                        <div className="text-xs text-gray-500">
                          Original: {formatCurrency(commitment.originalAmount)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div
                        className={`flex items-center justify-end gap-1 ${getVarianceColor(
                          commitment.variance,
                          commitment.variancePercent
                        )}`}
                      >
                        {getVarianceIcon(commitment.variance)}
                        <span className="font-medium">
                          {commitment.variance > 0 ? "+" : ""}
                          {formatCurrency(commitment.variance)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {commitment.variancePercent > 0 ? "+" : ""}
                        {commitment.variancePercent.toFixed(1)}%
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="w-full space-y-1">
                        <Progress value={commitment.completionPercent} className="h-2" />
                        <span className="text-sm">{commitment.completionPercent}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{getSyncStatusBadge(commitment.procoreSyncStatus)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleCommitmentClick(commitment)}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onCommitmentEdit && onCommitmentEdit(commitment)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            window.open(`https://app.procore.com/commitments/${commitment.procoreId}`, "_blank")
                          }
                        >
                          <ArrowUpRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
