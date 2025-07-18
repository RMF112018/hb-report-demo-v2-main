/**
 * @fileoverview Bid Leveling Component - Subcontractor Proposal Comparison
 * @version 3.1.0
 * @description Advanced bid leveling system for comparing subcontractor proposals with scope management
 */

"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
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
  projectId?: string
  packageId?: string
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

  // Helper functions for prequal status and risk scoring
  const getPrequalStatus = (bidder: BidderProposal) => {
    const statuses: Record<string, { status: string; color: string }> = {
      "bidder-001": { status: "approved", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      "bidder-002": {
        status: "pending",
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      },
      "bidder-003": { status: "expired", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
    }
    return (
      statuses[bidder.bidderId] || {
        status: "unknown",
        color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      }
    )
  }

  const getRiskScore = (bidder: BidderProposal) => {
    const riskScores: Record<string, { score: number; level: string; color: string }> = {
      "bidder-001": {
        score: 1.2,
        level: "low",
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      },
      "bidder-002": {
        score: 3.1,
        level: "medium",
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      },
      "bidder-003": { score: 4.7, level: "high", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
    }
    return (
      riskScores[bidder.bidderId] || {
        score: 2.5,
        level: "unknown",
        color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      }
    )
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

  // Bidder action handlers
  const handleBidderAction = (bidderId: string, action: string) => {
    const bidder = bidderProposals.find((b) => b.bidderId === bidderId)
    if (!bidder) return

    switch (action) {
      case "include":
        toast({
          title: "Bidder Included",
          description: `${bidder.bidderName} has been included in the estimate.`,
        })
        break
      case "bench":
        toast({
          title: "Bidder Benched",
          description: `${bidder.bidderName} has been benched as backup.`,
        })
        break
      case "disqualify":
        toast({
          title: "Bidder Disqualified",
          description: `${bidder.bidderName} has been disqualified from consideration.`,
        })
        break
    }
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scope">Scope Management</TabsTrigger>
          <TabsTrigger value="comparison">Bid Tab</TabsTrigger>
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
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bid Tab - Combined Comparison and Analysis */}
        <TabsContent value="comparison" className="space-y-6">
          {/* Analysis Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Lowest Bid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(analysisData.lowestBid?.includedTotal || 0)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{analysisData.lowestBid?.bidderName}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Highest Bid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(analysisData.highestBid?.includedTotal || 0)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{analysisData.highestBid?.bidderName}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Average Bid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(analysisData.avgBid || 0)}</div>
                <p className="text-sm text-muted-foreground mt-1">3 bidders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Plug Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(calculatePlugTotal())}</div>
                <p className="text-sm text-muted-foreground mt-1">Selected values</p>
              </CardContent>
            </Card>
          </div>

          {/* Bidder Analysis Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bidder Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left p-3 font-semibold">Bidder</th>
                      <th className="text-left p-3 font-semibold">Status</th>
                      <th className="text-center p-3 font-semibold">Total Bid</th>
                      <th className="text-center p-3 font-semibold">Included</th>
                      <th className="text-center p-3 font-semibold">Excluded</th>
                      <th className="text-center p-3 font-semibold">Clarifications</th>
                      <th className="text-center p-3 font-semibold">Markup</th>
                      <th className="text-center p-3 font-semibold">Prequal Status</th>
                      <th className="text-center p-3 font-semibold">Risk</th>
                      <th className="text-center p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisData.bidders.map((bidder) => (
                      <tr key={bidder.bidderId} className="border-b hover:bg-muted/20">
                        <td className="p-3">
                          <div className="font-medium">{bidder.bidderName}</div>
                          <div className="text-sm text-muted-foreground">Submitted: {bidder.submitDate}</div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className={getStatusColor(bidder.status)}>
                            {bidder.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          <span className="font-medium">{formatCurrency(bidder.totalAmount)}</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-green-700 font-medium">{formatCurrency(bidder.includedTotal)}</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-red-700 font-medium">{formatCurrency(bidder.excludedTotal)}</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-yellow-700 font-medium">
                            {formatCurrency(bidder.clarificationTotal)}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-sm">{bidder.generalConditions?.markup || 0}%</span>
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className={getPrequalStatus(bidder).color}>
                            {getPrequalStatus(bidder).status}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className={getRiskScore(bidder).color}>
                            {getRiskScore(bidder).score.toFixed(1)}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleBidderAction(bidder.bidderId, "include")}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Include in Estimate
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleBidderAction(bidder.bidderId, "bench")}>
                                <Users className="h-4 w-4 mr-2" />
                                Bench
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleBidderAction(bidder.bidderId, "disqualify")}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Disqualify
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Bid Comparison Matrix */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Bid Comparison Matrix</CardTitle>
                <div className="flex items-center gap-2">
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
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left p-3 font-semibold min-w-64">Scope Item</th>
                      <th className="text-left p-3 font-semibold">Qty</th>
                      <th className="text-left p-3 font-semibold">Unit</th>
                      {bidderProposals.map((bidder) => (
                        <th key={bidder.bidderId} className="text-center p-3 font-semibold min-w-32">
                          <div className="flex flex-col">
                            <span className="font-medium">{bidder.bidderName}</span>
                            <Badge variant="outline" className={`${getStatusColor(bidder.status)} text-xs mt-1`}>
                              {bidder.status}
                            </Badge>
                          </div>
                        </th>
                      ))}
                      <th className="text-center p-3 font-semibold min-w-32">
                        <div className="flex flex-col">
                          <span className="font-medium">Plug Value</span>
                          <span className="text-xs text-muted-foreground mt-1">Selected</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {scopeItems.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-muted/20">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                            <div>
                              <div className="font-medium">{item.description}</div>
                              <div className="text-sm text-muted-foreground">{item.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <span className="font-medium">{item.quantity}</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-sm text-muted-foreground">{item.unit}</span>
                        </td>
                        {bidderProposals.map((bidder) => {
                          const lineItem = bidder.lineItems[item.id]
                          return (
                            <td key={bidder.bidderId} className="p-3 text-center">
                              {lineItem ? (
                                <div className="flex flex-col items-center gap-1">
                                  <div className="font-medium">
                                    {lineItem.included ? (
                                      <span className="text-green-700">{formatCurrency(lineItem.totalPrice)}</span>
                                    ) : lineItem.excluded ? (
                                      <span className="text-red-700">Excluded</span>
                                    ) : (
                                      <span className="text-gray-500">-</span>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {lineItem.included && formatCurrency(lineItem.unitPrice)}/{item.unit}
                                  </div>
                                  {lineItem.clarificationNeeded && (
                                    <Badge variant="destructive" className="text-xs">
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                      Clarification
                                    </Badge>
                                  )}
                                  {lineItem.notes && (
                                    <div
                                      className="text-xs text-muted-foreground max-w-32 truncate"
                                      title={lineItem.notes}
                                    >
                                      {lineItem.notes}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400">No bid</span>
                              )}
                            </td>
                          )
                        })}
                        <td className="p-3">
                          <div className="flex flex-col items-center gap-2">
                            <Select
                              value={plugValues[item.id]?.source || "none"}
                              onValueChange={(value) => handlePlugValueChange(item.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="manual">Manual</SelectItem>
                                {bidderProposals.map((bidder) => (
                                  <SelectItem key={bidder.bidderId} value={bidder.bidderId}>
                                    {bidder.bidderName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {plugValues[item.id]?.source === "manual" && (
                              <Input
                                type="number"
                                placeholder="Enter amount"
                                className="w-32"
                                value={plugValues[item.id]?.manualAmount || ""}
                                onChange={(e) => handleManualPlugChange(item.id, e.target.value)}
                              />
                            )}
                            {plugValues[item.id]?.amount && (
                              <div className="text-sm font-medium text-green-700">
                                {formatCurrency(plugValues[item.id].amount)}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-muted bg-muted/50">
                      <td className="p-3 font-semibold" colSpan={3}>
                        Total Plugged Value:
                      </td>
                      {bidderProposals.map((bidder) => (
                        <td key={bidder.bidderId} className="p-3 text-center font-semibold">
                          {formatCurrency(bidder.totalAmount)}
                        </td>
                      ))}
                      <td className="p-3 text-center font-semibold text-green-700">
                        {formatCurrency(calculatePlugTotal())}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
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
  const [formData, setFormData] = useState<Omit<ScopeLineItem, "id">>({
    category: initialData?.category || "",
    description: initialData?.description || "",
    unit: initialData?.unit || "",
    quantity: initialData?.quantity || 1,
    specifications: initialData?.specifications || "",
    inclusions: initialData?.inclusions || [],
    exclusions: initialData?.exclusions || [],
    notes: initialData?.notes || "",
    priority: initialData?.priority || "standard",
    status: initialData?.status || "active",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Site Preparation">Site Preparation</SelectItem>
              <SelectItem value="Concrete">Concrete</SelectItem>
              <SelectItem value="Structural Steel">Structural Steel</SelectItem>
              <SelectItem value="Roofing">Roofing</SelectItem>
              <SelectItem value="Mechanical">Mechanical</SelectItem>
              <SelectItem value="Electrical">Electrical</SelectItem>
              <SelectItem value="Finishes">Finishes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
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

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter scope item description"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
            min="1"
            required
          />
        </div>

        <div>
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            placeholder="e.g., SF, CY, LS"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="specifications">Specifications</Label>
        <Textarea
          id="specifications"
          value={formData.specifications}
          onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
          placeholder="Enter detailed specifications"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes or comments"
          rows={2}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Scope Item</Button>
      </div>
    </form>
  )
}

export { BidLeveling }
export default BidLeveling
