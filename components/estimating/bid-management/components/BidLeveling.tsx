/**
 * @fileoverview Bid Leveling Component - Subcontractor Proposal Comparison
 * @version 3.1.0
 * @description Advanced bid leveling system for comparing subcontractor proposals with scope management
 */

"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Badge } from "../../../ui/badge"
import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"
import { Label } from "../../../ui/label"
import { Textarea } from "../../../ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select"
import { ScrollArea } from "../../../ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs"
import { useToast } from "../../../ui/use-toast"
import {
  Plus,
  Edit3,
  Trash2,
  Download,
  Upload,
  Calculator,
  CheckCircle,
  AlertTriangle,
  XCircle,
  DollarSign,
  FileText,
  Users,
  Target,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Eye,
  Save,
  RefreshCw,
  Settings,
} from "lucide-react"

interface BidLevelingProps {
  projectId: string
  packageId: string
  className?: string
}

// Scope line item interface
interface ScopeLineItem {
  id: string
  category: string
  description: string
  unit: string
  quantity: number
  specifications?: string
  inclusions?: string[]
  exclusions?: string[]
  notes?: string
  priority: "critical" | "important" | "standard" | "optional"
  status: "active" | "clarification-needed" | "removed"
}

// Bidder proposal interface
interface BidderProposal {
  bidderId: string
  bidderName: string
  submitDate: string
  totalAmount: number
  status: "submitted" | "reviewed" | "clarification-requested" | "accepted" | "rejected"
  lineItems: {
    [lineItemId: string]: {
      unitPrice: number
      totalPrice: number
      included: boolean
      excluded: boolean
      clarificationNeeded: boolean
      plugValue?: number
      notes?: string
      alternates?: {
        description: string
        price: number
      }[]
    }
  }
  generalConditions?: {
    markup: number
    bondRate: number
    insuranceRate: number
    overhead: number
  }
  exclusions?: string[]
  inclusions?: string[]
  assumptions?: string[]
  clarifications?: string[]
}

// Mock data for demonstration
const mockScopeItems: ScopeLineItem[] = [
  {
    id: "scope-001",
    category: "Site Preparation",
    description: "Mobilization and Site Setup",
    unit: "LS",
    quantity: 1,
    specifications: "Establish temporary facilities, utilities, and access roads",
    inclusions: ["Temporary power", "Site office", "Storage areas"],
    exclusions: ["Permits", "Utility connections"],
    priority: "critical",
    status: "active",
  },
  {
    id: "scope-002",
    category: "Site Preparation",
    description: "Excavation and Grading",
    unit: "CY",
    quantity: 2500,
    specifications: "Mass excavation to design grades per drawings",
    inclusions: ["Excavation", "Loading", "Hauling"],
    exclusions: ["Rock removal", "Dewatering"],
    priority: "critical",
    status: "active",
  },
  {
    id: "scope-003",
    category: "Concrete",
    description: "Foundation Concrete",
    unit: "CY",
    quantity: 180,
    specifications: "4000 PSI concrete with specified reinforcement",
    inclusions: ["Concrete", "Placement", "Finishing"],
    exclusions: ["Reinforcement", "Formwork"],
    priority: "critical",
    status: "active",
  },
  {
    id: "scope-004",
    category: "Concrete",
    description: "Slab on Grade",
    unit: "SF",
    quantity: 15000,
    specifications: "6-inch thick concrete slab with vapor barrier",
    inclusions: ["Concrete", "Vapor barrier", "Finishing"],
    exclusions: ["Base preparation", "Saw cutting"],
    priority: "important",
    status: "active",
  },
  {
    id: "scope-005",
    category: "Structural Steel",
    description: "Steel Frame Erection",
    unit: "TON",
    quantity: 45,
    specifications: "Structural steel frame per structural drawings",
    inclusions: ["Steel supply", "Erection", "Bolting"],
    exclusions: ["Foundation bolts", "Fireproofing"],
    priority: "critical",
    status: "active",
  },
  {
    id: "scope-006",
    category: "Roofing",
    description: "Metal Roof System",
    unit: "SF",
    quantity: 12000,
    specifications: "Standing seam metal roof with insulation",
    inclusions: ["Metal panels", "Insulation", "Installation"],
    exclusions: ["Structural deck", "Gutters"],
    priority: "important",
    status: "active",
  },
]

const mockBidderProposals: BidderProposal[] = [
  {
    bidderId: "bidder-001",
    bidderName: "Apex Construction LLC",
    submitDate: "2025-01-25",
    totalAmount: 1250000,
    status: "submitted",
    lineItems: {
      "scope-001": { unitPrice: 25000, totalPrice: 25000, included: true, excluded: false, clarificationNeeded: false },
      "scope-002": { unitPrice: 45, totalPrice: 112500, included: true, excluded: false, clarificationNeeded: false },
      "scope-003": { unitPrice: 850, totalPrice: 153000, included: true, excluded: false, clarificationNeeded: false },
      "scope-004": { unitPrice: 8.5, totalPrice: 127500, included: true, excluded: false, clarificationNeeded: false },
      "scope-005": {
        unitPrice: 4200,
        totalPrice: 189000,
        included: false,
        excluded: true,
        clarificationNeeded: false,
        notes: "Steel not included - separate contract",
      },
      "scope-006": {
        unitPrice: 12.25,
        totalPrice: 147000,
        included: true,
        excluded: false,
        clarificationNeeded: false,
      },
    },
    generalConditions: { markup: 8, bondRate: 1.5, insuranceRate: 2.0, overhead: 12 },
    exclusions: ["Structural steel", "Permits", "Testing"],
    inclusions: ["Site cleanup", "As-built drawings"],
    assumptions: ["Weather delays not included", "Material escalation at 3%"],
  },
  {
    bidderId: "bidder-002",
    bidderName: "SteelWorks Fabrication",
    submitDate: "2025-01-24",
    totalAmount: 1180000,
    status: "submitted",
    lineItems: {
      "scope-001": { unitPrice: 22000, totalPrice: 22000, included: true, excluded: false, clarificationNeeded: false },
      "scope-002": { unitPrice: 42, totalPrice: 105000, included: true, excluded: false, clarificationNeeded: false },
      "scope-003": { unitPrice: 825, totalPrice: 148500, included: true, excluded: false, clarificationNeeded: false },
      "scope-004": { unitPrice: 7.95, totalPrice: 119250, included: true, excluded: false, clarificationNeeded: false },
      "scope-005": { unitPrice: 3950, totalPrice: 177750, included: true, excluded: false, clarificationNeeded: false },
      "scope-006": {
        unitPrice: 11.75,
        totalPrice: 141000,
        included: true,
        excluded: false,
        clarificationNeeded: false,
      },
    },
    generalConditions: { markup: 7.5, bondRate: 1.25, insuranceRate: 1.8, overhead: 10 },
    exclusions: ["Site utilities", "Testing", "Permits"],
    inclusions: ["Cleanup", "Minor modifications"],
  },
  {
    bidderId: "bidder-003",
    bidderName: "Premier Construction",
    submitDate: "2025-01-23",
    totalAmount: 1320000,
    status: "clarification-requested",
    lineItems: {
      "scope-001": { unitPrice: 28000, totalPrice: 28000, included: true, excluded: false, clarificationNeeded: false },
      "scope-002": {
        unitPrice: 48,
        totalPrice: 120000,
        included: true,
        excluded: false,
        clarificationNeeded: true,
        notes: "Need clarification on rock removal",
      },
      "scope-003": { unitPrice: 875, totalPrice: 157500, included: true, excluded: false, clarificationNeeded: false },
      "scope-004": { unitPrice: 9.25, totalPrice: 138750, included: true, excluded: false, clarificationNeeded: false },
      "scope-005": { unitPrice: 4500, totalPrice: 202500, included: true, excluded: false, clarificationNeeded: false },
      "scope-006": {
        unitPrice: 13.5,
        totalPrice: 162000,
        included: true,
        excluded: false,
        clarificationNeeded: true,
        notes: "Premium option pricing",
      },
    },
    generalConditions: { markup: 10, bondRate: 2.0, insuranceRate: 2.5, overhead: 15 },
    clarifications: ["Rock removal scope", "Roofing options", "Schedule requirements"],
  },
]

const BidLeveling: React.FC<BidLevelingProps> = ({ projectId, packageId, className = "" }) => {
  const { toast } = useToast()
  const [selectedTab, setSelectedTab] = useState<"scope" | "comparison" | "analysis">("scope")
  const [scopeItems, setScopeItems] = useState<ScopeLineItem[]>(mockScopeItems)
  const [bidderProposals, setBidderProposals] = useState<BidderProposal[]>(mockBidderProposals)
  const [showAddScopeDialog, setShowAddScopeDialog] = useState(false)
  const [editingScopeItem, setEditingScopeItem] = useState<ScopeLineItem | null>(null)
  const [selectedComparison, setSelectedComparison] = useState<"all" | "included-only" | "excluded-only">("all")
  const [plugValues, setPlugValues] = useState<{
    [scopeId: string]: {
      source: "none" | "manual" | string // bidder ID
      amount: number
      manualAmount?: number
    }
  }>({})

  // Plug value handlers
  const handlePlugValueChange = (scopeId: string, source: string) => {
    setPlugValues((prev) => ({
      ...prev,
      [scopeId]: {
        source,
        amount:
          source === "manual"
            ? prev[scopeId]?.manualAmount || 0
            : source === "none"
            ? 0
            : getBidderAmount(scopeId, source),
        manualAmount: prev[scopeId]?.manualAmount || 0,
      },
    }))
  }

  const handleManualPlugChange = (scopeId: string, value: string) => {
    const amount = parseFloat(value) || 0
    setPlugValues((prev) => ({
      ...prev,
      [scopeId]: {
        ...prev[scopeId],
        amount,
        manualAmount: amount,
      },
    }))
  }

  const getBidderAmount = (scopeId: string, bidderId: string) => {
    const bidder = bidderProposals.find((b) => b.bidderId === bidderId)
    return bidder?.lineItems[scopeId]?.totalPrice || 0
  }

  const calculatePlugTotal = () => {
    return Object.values(plugValues).reduce((total, plug) => {
      return total + (plug.amount || 0)
    }, 0)
  }

  // Calculate totals and analysis
  const analysisData = useMemo(() => {
    const bidderAnalysis = bidderProposals.map((bidder) => {
      let includedTotal = 0
      let excludedTotal = 0
      let clarificationTotal = 0
      let itemCount = 0

      scopeItems.forEach((scope) => {
        const lineItem = bidder.lineItems[scope.id]
        if (lineItem) {
          itemCount++
          if (lineItem.included) includedTotal += lineItem.totalPrice
          if (lineItem.excluded) excludedTotal += lineItem.totalPrice
          if (lineItem.clarificationNeeded) clarificationTotal += lineItem.totalPrice
        }
      })

      return {
        ...bidder,
        includedTotal,
        excludedTotal,
        clarificationTotal,
        itemCount,
        avgUnitPrice: includedTotal / itemCount || 0,
      }
    })

    // Find lowest and highest bids
    const sortedByTotal = [...bidderAnalysis].sort((a, b) => a.includedTotal - b.includedTotal)
    const lowestBid = sortedByTotal[0]
    const highestBid = sortedByTotal[sortedByTotal.length - 1]

    return {
      bidders: bidderAnalysis,
      lowestBid,
      highestBid,
      avgBid: bidderAnalysis.reduce((sum, b) => sum + b.includedTotal, 0) / bidderAnalysis.length,
      totalScope: scopeItems.length,
    }
  }, [bidderProposals, scopeItems])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "reviewed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "clarification-requested":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "important":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "standard":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "optional":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
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

  const handleAddScopeItem = (newItem: Omit<ScopeLineItem, "id">) => {
    const scopeItem: ScopeLineItem = {
      ...newItem,
      id: `scope-${Date.now()}`,
    }
    setScopeItems([...scopeItems, scopeItem])
    setShowAddScopeDialog(false)
    toast({
      title: "Scope Item Added",
      description: `${scopeItem.description} has been added to the scope.`,
    })
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Bid Leveling - Materials Testing Package
                <Badge variant="secondary">{scopeItems.length} scope items</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Compare and analyze subcontractor proposals with scope management
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Analysis
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scope">Scope Management</TabsTrigger>
          <TabsTrigger value="comparison">Bid Comparison</TabsTrigger>
          <TabsTrigger value="analysis">Analysis & Results</TabsTrigger>
        </TabsList>

        {/* Scope Management Tab */}
        <TabsContent value="scope" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Scope of Work</CardTitle>
                <Dialog open={showAddScopeDialog} onOpenChange={setShowAddScopeDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Scope Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add Scope Line Item</DialogTitle>
                    </DialogHeader>
                    <ScopeItemForm onSubmit={handleAddScopeItem} onCancel={() => setShowAddScopeDialog(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left p-3 font-semibold">Priority</th>
                      <th className="text-left p-3 font-semibold">Category</th>
                      <th className="text-left p-3 font-semibold">Description</th>
                      <th className="text-left p-3 font-semibold">Quantity</th>
                      <th className="text-left p-3 font-semibold">Unit</th>
                      <th className="text-left p-3 font-semibold">Specifications</th>
                      <th className="text-left p-3 font-semibold">Inclusions</th>
                      <th className="text-left p-3 font-semibold">Exclusions</th>
                      <th className="text-center p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scopeItems.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-muted/20">
                        <td className="p-3">
                          <Badge variant="outline" className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant="secondary">{item.category}</Badge>
                        </td>
                        <td className="p-3">
                          <div className="max-w-xs">
                            <div className="font-medium">{item.description}</div>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <span className="font-medium">{item.quantity}</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-sm text-muted-foreground">{item.unit}</span>
                        </td>
                        <td className="p-3">
                          <div className="max-w-xs">
                            {item.specifications && (
                              <p className="text-sm text-muted-foreground line-clamp-2">{item.specifications}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="max-w-xs">
                            {item.inclusions && item.inclusions.length > 0 && (
                              <div className="text-sm">
                                <ul className="list-disc list-inside text-green-700">
                                  {item.inclusions.slice(0, 2).map((inc, index) => (
                                    <li key={index} className="text-xs">
                                      {inc}
                                    </li>
                                  ))}
                                  {item.inclusions.length > 2 && (
                                    <li className="text-xs text-muted-foreground">
                                      +{item.inclusions.length - 2} more
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="max-w-xs">
                            {item.exclusions && item.exclusions.length > 0 && (
                              <div className="text-sm">
                                <ul className="list-disc list-inside text-red-700">
                                  {item.exclusions.slice(0, 2).map((exc, index) => (
                                    <li key={index} className="text-xs">
                                      {exc}
                                    </li>
                                  ))}
                                  {item.exclusions.length > 2 && (
                                    <li className="text-xs text-muted-foreground">
                                      +{item.exclusions.length - 2} more
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            <Button variant="ghost" size="sm" title="Edit Scope Item">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Delete Scope Item">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {/* Add Scope Item Row */}
                    <tr className="border-b-2 border-muted">
                      <td colSpan={9} className="p-3">
                        <Dialog open={showAddScopeDialog} onOpenChange={setShowAddScopeDialog}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full border-dashed border-2 h-12 text-muted-foreground hover:text-foreground hover:border-solid"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Scope Item
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Add Scope Line Item</DialogTitle>
                            </DialogHeader>
                            <ScopeItemForm
                              onSubmit={handleAddScopeItem}
                              onCancel={() => setShowAddScopeDialog(false)}
                            />
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bid Comparison Tab */}
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Proposal Comparison</CardTitle>
                <div className="flex items-center gap-4">
                  <Select
                    value={selectedComparison}
                    onValueChange={(value) => setSelectedComparison(value as "all" | "included-only" | "excluded-only")}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Items</SelectItem>
                      <SelectItem value="included-only">Included Only</SelectItem>
                      <SelectItem value="excluded-only">Excluded Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Calculator className="h-4 w-4 mr-2" />
                    Recalculate
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left p-3 min-w-[280px] font-semibold">Scope Item</th>
                      <th className="text-center p-3 min-w-[100px] font-semibold">Unit Type</th>
                      <th className="text-center p-3 min-w-[100px] font-semibold">Quantity</th>
                      {bidderProposals.map((bidder) => (
                        <th key={bidder.bidderId} className="text-center p-3 min-w-[180px] font-semibold">
                          <div>
                            <div className="font-semibold">{bidder.bidderName}</div>
                            <Badge className={getStatusColor(bidder.status)} variant="outline">
                              {bidder.status}
                            </Badge>
                          </div>
                        </th>
                      ))}
                      <th className="text-center p-3 min-w-[150px] font-semibold bg-accent/30 border-l border-border">
                        <div className="flex items-center justify-center gap-1">
                          <Settings className="h-4 w-4" />
                          Plug Value
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {scopeItems.map((scope) => (
                      <tr key={scope.id} className="border-b hover:bg-muted/20">
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{scope.description}</div>
                            <div className="text-xs text-muted-foreground">{scope.category}</div>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className="text-xs">
                            {scope.unit}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          <span className="font-medium">{scope.quantity}</span>
                        </td>
                        {bidderProposals.map((bidder) => {
                          const lineItem = bidder.lineItems[scope.id]
                          return (
                            <td key={bidder.bidderId} className="p-3 text-center">
                              {lineItem ? (
                                <div className="space-y-1">
                                  <div className="font-semibold text-sm">{formatCurrency(lineItem.totalPrice)}</div>
                                  <div className="text-xs text-muted-foreground">
                                    ${lineItem.unitPrice.toFixed(2)}/{scope.unit}
                                  </div>
                                  <div className="flex justify-center gap-1 flex-wrap">
                                    {lineItem.included && (
                                      <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30 text-xs">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Inc
                                      </Badge>
                                    )}
                                    {lineItem.excluded && (
                                      <Badge className="bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30 text-xs">
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Exc
                                      </Badge>
                                    )}
                                    {lineItem.clarificationNeeded && (
                                      <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30 text-xs">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        Clar
                                      </Badge>
                                    )}
                                  </div>
                                  {lineItem.notes && (
                                    <div className="text-xs text-muted-foreground italic">{lineItem.notes}</div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">—</span>
                              )}
                            </td>
                          )
                        })}
                        <td className="p-3 bg-accent/20 border-l border-border">
                          <div className="space-y-2">
                            <Select
                              value={plugValues[scope.id]?.source || "none"}
                              onValueChange={(value) => handlePlugValueChange(scope.id, value)}
                            >
                              <SelectTrigger className="w-full h-8 text-xs bg-background border-input">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No Plug</SelectItem>
                                <SelectItem value="manual">Manual Entry</SelectItem>
                                {bidderProposals.map((bidder) => {
                                  const lineItem = bidder.lineItems[scope.id]
                                  if (lineItem) {
                                    return (
                                      <SelectItem key={bidder.bidderId} value={bidder.bidderId}>
                                        {bidder.bidderName} - {formatCurrency(lineItem.totalPrice)}
                                      </SelectItem>
                                    )
                                  }
                                  return null
                                })}
                              </SelectContent>
                            </Select>

                            {plugValues[scope.id]?.source === "manual" && (
                              <Input
                                type="number"
                                placeholder="Enter amount"
                                value={plugValues[scope.id]?.manualAmount || ""}
                                onChange={(e) => handleManualPlugChange(scope.id, e.target.value)}
                                className="h-8 text-xs bg-background border-input"
                              />
                            )}

                            {plugValues[scope.id]?.source && plugValues[scope.id]?.source !== "none" && (
                              <div className="text-xs font-medium text-center text-foreground">
                                {plugValues[scope.id]?.source === "manual"
                                  ? formatCurrency(plugValues[scope.id]?.manualAmount || 0)
                                  : formatCurrency(plugValues[scope.id]?.amount || 0)}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {/* Totals Row */}
                    <tr className="border-t-2 font-semibold bg-muted/30">
                      <td className="p-3">
                        <div className="font-bold">TOTAL</div>
                      </td>
                      <td className="p-3 text-center">
                        <span className="text-muted-foreground text-xs">—</span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="text-muted-foreground text-xs">—</span>
                      </td>
                      {bidderProposals.map((bidder) => {
                        const analysis = analysisData.bidders.find((b) => b.bidderId === bidder.bidderId)
                        return (
                          <td key={bidder.bidderId} className="p-3 text-center">
                            <div className="font-bold">{formatCurrency(analysis?.includedTotal || 0)}</div>
                            {analysis && analysis.excludedTotal > 0 && (
                              <div className="text-xs text-red-600 dark:text-red-400">
                                +{formatCurrency(analysis.excludedTotal)} excluded
                              </div>
                            )}
                          </td>
                        )
                      })}
                      <td className="p-3 text-center bg-accent/30 border-l border-border">
                        <div className="font-bold text-foreground">{formatCurrency(calculatePlugTotal())}</div>
                        <div className="text-xs text-muted-foreground">Plug Total</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leveled Bid Summary */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Leveled Bid Analysis</CardTitle>
                  <p className="text-sm text-muted-foreground">Based on {bidderProposals.length} submitted proposals</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Leveled Bid Summary Table */}
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left p-3 font-medium">Item</th>
                            <th className="text-right p-3 font-medium">Amount</th>
                            <th className="text-center p-3 font-medium">Source</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scopeItems.map((scope) => {
                            const plugValue = plugValues[scope.id]
                            const selectedBidder =
                              plugValue?.source && plugValue.source !== "none" && plugValue.source !== "manual"
                                ? bidderProposals.find((b) => b.bidderId === plugValue.source)?.bidderName
                                : null
                            const amount =
                              plugValue?.source === "manual"
                                ? plugValue.manualAmount || 0
                                : plugValue?.source === "none"
                                ? 0
                                : plugValue?.amount || 0

                            return (
                              <tr key={scope.id} className="border-b">
                                <td className="p-3">
                                  <div className="font-medium">{scope.description}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {scope.quantity} {scope.unit}
                                  </div>
                                </td>
                                <td className="p-3 text-right font-medium">
                                  {amount > 0 ? formatCurrency(amount) : "—"}
                                </td>
                                <td className="p-3 text-center text-sm">
                                  {plugValue?.source === "manual" ? (
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                      Manual
                                    </Badge>
                                  ) : selectedBidder ? (
                                    <Badge variant="outline" className="bg-green-50 text-green-700">
                                      {selectedBidder}
                                    </Badge>
                                  ) : (
                                    <span className="text-muted-foreground">No plug</span>
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                          {/* Total Row */}
                          <tr className="border-t-2 bg-muted/30">
                            <td className="p-3 font-bold">Leveled Bid Total</td>
                            <td className="p-3 text-right font-bold text-lg">{formatCurrency(calculatePlugTotal())}</td>
                            <td className="p-3 text-center">
                              <Badge variant="secondary">Total</Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Bid Comparison Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingDown className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Lowest Bid</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(analysisData.lowestBid?.includedTotal || 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">{analysisData.lowestBid?.bidderName}</div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Average Bid</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">{formatCurrency(analysisData.avgBid)}</div>
                        <div className="text-sm text-muted-foreground">{bidderProposals.length} proposals</div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium">Highest Bid</span>
                        </div>
                        <div className="text-2xl font-bold text-red-600">
                          {formatCurrency(analysisData.highestBid?.includedTotal || 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">{analysisData.highestBid?.bidderName}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bid Metrics & Qualifications */}
            <div className="space-y-4">
              {/* Leveled Bid Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Leveled Bid Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Spread from Estimated Cost</span>
                      <span className="font-medium">—</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Spread from Estimated Cost</span>
                      <span className="font-medium">—</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">% Spread from Apparent Low</span>
                      <span className="font-medium">—</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">$ Spread from Apparent Low</span>
                      <span className="font-medium">—</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">% Spread from Base Bid</span>
                      <span className="font-medium">—</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">$ Spread from Base Bid</span>
                      <span className="font-medium">—</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Leveled Bid as % of Project Limit</span>
                        <span className="font-medium">—</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Qualifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Qualifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Qualification Status</span>
                      <span className="font-medium">—</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Expiration Date</span>
                      <span className="font-medium">—</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Project Limit / Total Limit</span>
                      <span className="font-medium">—</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Internal Backlog</span>
                      <span className="font-medium">—</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">EMR (most recent)</span>
                      <span className="font-medium">—</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Application Summary</span>
                      <span className="font-medium">—</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Application Status</span>
                      <span className="font-medium">—</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Scope Item Form Component
interface ScopeItemFormProps {
  onSubmit: (item: Omit<ScopeLineItem, "id">) => void
  onCancel: () => void
  initialData?: ScopeLineItem
}

const ScopeItemForm: React.FC<ScopeItemFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    category: initialData?.category || "",
    description: initialData?.description || "",
    unit: initialData?.unit || "LS",
    quantity: initialData?.quantity || 1,
    specifications: initialData?.specifications || "",
    inclusions: initialData?.inclusions?.join(", ") || "",
    exclusions: initialData?.exclusions?.join(", ") || "",
    notes: initialData?.notes || "",
    priority: initialData?.priority || ("standard" as const),
    status: initialData?.status || ("active" as const),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      inclusions: formData.inclusions ? formData.inclusions.split(",").map((s) => s.trim()) : [],
      exclusions: formData.exclusions ? formData.exclusions.split(",").map((s) => s.trim()) : [],
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g., Site Preparation"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="important">Important</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="optional">Optional</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Detailed work description"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LS">LS (Lump Sum)</SelectItem>
              <SelectItem value="SF">SF (Square Feet)</SelectItem>
              <SelectItem value="CY">CY (Cubic Yards)</SelectItem>
              <SelectItem value="LF">LF (Linear Feet)</SelectItem>
              <SelectItem value="TON">TON (Tons)</SelectItem>
              <SelectItem value="EA">EA (Each)</SelectItem>
              <SelectItem value="HR">HR (Hours)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specifications">Specifications</Label>
        <Textarea
          id="specifications"
          value={formData.specifications}
          onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
          placeholder="Technical specifications and requirements"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inclusions">Inclusions (comma-separated)</Label>
          <Textarea
            id="inclusions"
            value={formData.inclusions}
            onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
            placeholder="What's included in this scope"
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="exclusions">Exclusions (comma-separated)</Label>
          <Textarea
            id="exclusions"
            value={formData.exclusions}
            onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })}
            placeholder="What's excluded from this scope"
            rows={2}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? "Update" : "Add"} Scope Item</Button>
      </div>
    </form>
  )
}

export default BidLeveling
