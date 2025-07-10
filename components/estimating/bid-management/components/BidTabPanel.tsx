/**
 * @fileoverview Bid Tab Panel Component
 * @version 3.0.0
 * @description Comprehensive bid tab management with evaluation, comparison, and export features
 */

"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Badge } from "../../../ui/badge"
import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"
import { Label } from "../../../ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select"
import { Textarea } from "../../../ui/textarea"
import { useToast } from "../../../ui/use-toast"
import {
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Calculator,
  BarChart3,
  FileText,
  Users,
  DollarSign,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  EyeOff,
} from "lucide-react"
import { BidPackage, BidResponse, BidLineItem } from "../types/bid-management"

interface BidTabPanelProps {
  packageId: string
  bidPackage: BidPackage
  className?: string
}

// Mock bid evaluation criteria
const mockEvaluationCriteria = [
  { id: "price", name: "Price", weight: 40, type: "number" },
  { id: "experience", name: "Experience", weight: 25, type: "rating" },
  { id: "schedule", name: "Schedule Compliance", weight: 20, type: "rating" },
  { id: "quality", name: "Quality Rating", weight: 15, type: "rating" },
]

// Mock bid responses for demonstration
const mockBidResponses: BidResponse[] = [
  {
    id: "resp-001",
    packageId: "pkg-001",
    vendorId: "vendor-001",
    vendorName: "Ace Construction Co.",
    bidAmount: 450000,
    status: "submitted",
    submissionDate: "2025-01-25T14:30:00Z",
    validUntil: "2025-03-01T17:00:00Z",
    lineItems: [
      { id: "li-001", description: "Concrete Work", quantity: 1, unit: "LS", unitPrice: 180000, totalPrice: 180000 },
      { id: "li-002", description: "Reinforcement", quantity: 1, unit: "LS", unitPrice: 95000, totalPrice: 95000 },
      { id: "li-003", description: "Finishing", quantity: 1, unit: "LS", unitPrice: 175000, totalPrice: 175000 },
    ],
    attachments: [],
    notes: "Includes all materials and labor. 10% contingency included.",
    evaluationScore: 85,
    riskLevel: "low",
  },
  {
    id: "resp-002",
    packageId: "pkg-001",
    vendorId: "vendor-002",
    vendorName: "Superior Builders LLC",
    bidAmount: 425000,
    status: "submitted",
    submissionDate: "2025-01-26T09:15:00Z",
    validUntil: "2025-02-28T17:00:00Z",
    lineItems: [
      { id: "li-004", description: "Concrete Work", quantity: 1, unit: "LS", unitPrice: 165000, totalPrice: 165000 },
      { id: "li-005", description: "Reinforcement", quantity: 1, unit: "LS", unitPrice: 85000, totalPrice: 85000 },
      { id: "li-006", description: "Finishing", quantity: 1, unit: "LS", unitPrice: 175000, totalPrice: 175000 },
    ],
    attachments: [],
    notes: "Alternate approach using precast elements. Faster installation.",
    evaluationScore: 92,
    riskLevel: "medium",
  },
  {
    id: "resp-003",
    packageId: "pkg-001",
    vendorId: "vendor-003",
    vendorName: "Elite Contractors Inc.",
    bidAmount: 485000,
    status: "under-review",
    submissionDate: "2025-01-24T16:45:00Z",
    validUntil: "2025-03-15T17:00:00Z",
    lineItems: [
      { id: "li-007", description: "Concrete Work", quantity: 1, unit: "LS", unitPrice: 195000, totalPrice: 195000 },
      { id: "li-008", description: "Reinforcement", quantity: 1, unit: "LS", unitPrice: 105000, totalPrice: 105000 },
      { id: "li-009", description: "Finishing", quantity: 1, unit: "LS", unitPrice: 185000, totalPrice: 185000 },
    ],
    attachments: [],
    notes: "Premium materials and extended warranty included.",
    evaluationScore: 78,
    riskLevel: "low",
  },
]

const BidTabPanel: React.FC<BidTabPanelProps> = ({ packageId, bidPackage, className = "" }) => {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [bidResponses, setBidResponses] = useState<BidResponse[]>(mockBidResponses)
  const [selectedBids, setSelectedBids] = useState<string[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([])

  // Calculate bid statistics
  const bidStats = useMemo(() => {
    const total = bidResponses.length
    const submitted = bidResponses.filter((b) => b.status === "submitted").length
    const underReview = bidResponses.filter((b) => b.status === "under-review").length
    const amounts = bidResponses.map((b) => b.bidAmount)
    const lowest = Math.min(...amounts)
    const highest = Math.max(...amounts)
    const average = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length

    return {
      total,
      submitted,
      underReview,
      lowest,
      highest,
      average,
      spread: highest - lowest,
      spreadPercentage: ((highest - lowest) / lowest) * 100,
    }
  }, [bidResponses])

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "under-review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "clarification-needed":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "accepted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  // Get risk level color
  const getRiskColor = (risk: string) => {
    switch (risk) {
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

  // Handle bid selection
  const handleBidSelection = (bidId: string) => {
    setSelectedBids((prev) => (prev.includes(bidId) ? prev.filter((id) => id !== bidId) : [...prev, bidId]))
  }

  // Handle export
  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting bid tab data to ${format.toUpperCase()}...`,
    })
  }

  // Handle import
  const handleImport = () => {
    toast({
      title: "Import Successful",
      description: "Bid data imported successfully.",
    })
    setShowImportDialog(false)
  }

  // Toggle column visibility
  const toggleColumn = (columnId: string) => {
    setHiddenColumns((prev) => (prev.includes(columnId) ? prev.filter((id) => id !== columnId) : [...prev, columnId]))
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Bid Tab Management</h2>
          <p className="text-sm text-muted-foreground">
            Package: {bidPackage.name} • {bidResponses.length} bids received
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowImportDialog(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Select onValueChange={handleExport}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Export" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bids</p>
                <p className="text-2xl font-bold">{bidStats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lowest Bid</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(bidStats.lowest)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Highest Bid</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(bidStats.highest)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average</p>
                <p className="text-2xl font-bold">{formatCurrency(bidStats.average)}</p>
              </div>
              <Calculator className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Spread</p>
                <p className="text-2xl font-bold">{bidStats.spreadPercentage.toFixed(1)}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
          <TabsTrigger value="line-items">Line Items</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Bid Responses</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{bidStats.submitted} submitted</Badge>
                  <Badge variant="outline">{bidStats.underReview} under review</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Select</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Bid Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bidResponses.map((bid) => (
                    <TableRow key={bid.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedBids.includes(bid.id)}
                          onChange={() => handleBidSelection(bid.id)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{bid.vendorName}</TableCell>
                      <TableCell className="font-mono">{formatCurrency(bid.bidAmount)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(bid.status)}>{bid.status.replace("-", " ")}</Badge>
                      </TableCell>
                      <TableCell>{new Date(bid.submissionDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(bid.validUntil).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getRiskColor(bid.riskLevel)}`}>{bid.riskLevel}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{bid.evaluationScore}</span>
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(bid.evaluationScore! / 20)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bid Comparison</CardTitle>
              <p className="text-sm text-muted-foreground">Compare selected bids side by side</p>
            </CardHeader>
            <CardContent>
              {selectedBids.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select bids to compare</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Criteria</TableHead>
                        {selectedBids.map((bidId) => {
                          const bid = bidResponses.find((b) => b.id === bidId)
                          return (
                            <TableHead key={bidId} className="text-center">
                              {bid?.vendorName}
                            </TableHead>
                          )
                        })}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Bid Amount</TableCell>
                        {selectedBids.map((bidId) => {
                          const bid = bidResponses.find((b) => b.id === bidId)
                          return (
                            <TableCell key={bidId} className="text-center font-mono">
                              {bid ? formatCurrency(bid.bidAmount) : "-"}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Evaluation Score</TableCell>
                        {selectedBids.map((bidId) => {
                          const bid = bidResponses.find((b) => b.id === bidId)
                          return (
                            <TableCell key={bidId} className="text-center">
                              {bid?.evaluationScore || "-"}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Risk Level</TableCell>
                        {selectedBids.map((bidId) => {
                          const bid = bidResponses.find((b) => b.id === bidId)
                          return (
                            <TableCell key={bidId} className="text-center">
                              <span className={bid ? getRiskColor(bid.riskLevel) : ""}>{bid?.riskLevel || "-"}</span>
                            </TableCell>
                          )
                        })}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Valid Until</TableCell>
                        {selectedBids.map((bidId) => {
                          const bid = bidResponses.find((b) => b.id === bidId)
                          return (
                            <TableCell key={bidId} className="text-center">
                              {bid ? new Date(bid.validUntil).toLocaleDateString() : "-"}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Criteria</CardTitle>
              <p className="text-sm text-muted-foreground">Configure evaluation criteria and weights</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEvaluationCriteria.map((criteria) => (
                  <div key={criteria.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{criteria.name}</h4>
                      <p className="text-sm text-muted-foreground">Weight: {criteria.weight}%</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="line-items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Line Item Analysis</CardTitle>
              <p className="text-sm text-muted-foreground">Detailed breakdown of bid line items</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bidResponses.map((bid) => (
                  <div key={bid.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">{bid.vendorName}</h4>
                      <Badge className={getStatusColor(bid.status)}>{bid.status.replace("-", " ")}</Badge>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Total Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bid.lineItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell className="font-mono">{formatCurrency(item.unitPrice)}</TableCell>
                            <TableCell className="font-mono font-medium">{formatCurrency(item.totalPrice)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-t-2">
                          <TableCell colSpan={4} className="font-medium">
                            Total
                          </TableCell>
                          <TableCell className="font-mono font-bold">{formatCurrency(bid.bidAmount)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Bid Data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="import-file">Select File</Label>
              <Input id="import-file" type="file" accept=".xlsx,.csv,.json" className="mt-1" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleImport}>Import</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BidTabPanel
