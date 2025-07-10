"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Handshake,
  FileText,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Calendar,
  Building2,
  Phone,
  Mail,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Eye,
  Star,
  MessageSquare,
  Target,
  BarChart3,
  Activity,
  Award,
  Briefcase,
  MapPin,
  Timer,
  Percent,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Send,
  FileCheck,
  AlertCircle,
} from "lucide-react"

interface BidData {
  id: string
  projectId: string
  projectName: string
  tradeCategory: string
  vendorName: string
  vendorContact: {
    name: string
    email: string
    phone: string
  }
  bidAmount: number
  status: "received" | "reviewed" | "selected" | "rejected" | "pending"
  submissionDate: string
  validUntil: string
  notes: string
  rating: number
  lineItems: {
    description: string
    quantity: number
    unit: string
    unitPrice: number
    totalPrice: number
  }[]
  attachments: string[]
  evaluationScore: number
  riskLevel: "low" | "medium" | "high"
  pastPerformance: {
    projectsCompleted: number
    avgRating: number
    onTimeDelivery: number
  }
}

interface RFPData {
  id: string
  projectId: string
  title: string
  description: string
  tradeCategory: string
  status: "draft" | "sent" | "responses-due" | "under-review" | "awarded"
  issueDate: string
  dueDate: string
  bidders: string[]
  responseCount: number
  estimatedValue: number
  requirements: string[]
  attachments: string[]
}

interface ProjectBidManagementProps {
  projectId: string
  projectData: any
  userRole: string
  className?: string
}

// Project-specific mock data
const getProjectBidData = (projectId: string): BidData[] => [
  {
    id: `bid-${projectId}-001`,
    projectId,
    projectName: "Current Project",
    tradeCategory: "Concrete",
    vendorName: "Superior Concrete Solutions",
    vendorContact: {
      name: "John Martinez",
      email: "j.martinez@superiorconcrete.com",
      phone: "(555) 123-4567",
    },
    bidAmount: 2450000,
    status: "received",
    submissionDate: "2025-01-20",
    validUntil: "2025-02-20",
    notes: "Excellent past performance, competitive pricing",
    rating: 4.5,
    lineItems: [
      { description: "Concrete footings", quantity: 450, unit: "CY", unitPrice: 180, totalPrice: 81000 },
      { description: "Slab on grade", quantity: 12500, unit: "SF", unitPrice: 8.5, totalPrice: 106250 },
    ],
    attachments: ["concrete-specs.pdf", "material-list.xlsx"],
    evaluationScore: 92,
    riskLevel: "low",
    pastPerformance: {
      projectsCompleted: 24,
      avgRating: 4.5,
      onTimeDelivery: 96,
    },
  },
  {
    id: `bid-${projectId}-002`,
    projectId,
    projectName: "Current Project",
    tradeCategory: "Steel",
    vendorName: "American Steel Fabricators",
    vendorContact: {
      name: "Sarah Williams",
      email: "s.williams@amsteelfab.com",
      phone: "(555) 234-5678",
    },
    bidAmount: 1950000,
    status: "reviewed",
    submissionDate: "2025-01-18",
    validUntil: "2025-02-18",
    notes: "Competitive bid, good timeline",
    rating: 4.2,
    lineItems: [
      { description: "Structural steel framing", quantity: 85, unit: "TON", unitPrice: 2400, totalPrice: 204000 },
    ],
    attachments: ["steel-drawings.pdf"],
    evaluationScore: 88,
    riskLevel: "low",
    pastPerformance: {
      projectsCompleted: 18,
      avgRating: 4.2,
      onTimeDelivery: 94,
    },
  },
  {
    id: `bid-${projectId}-003`,
    projectId,
    projectName: "Current Project",
    tradeCategory: "MEP",
    vendorName: "Elite Mechanical Systems",
    vendorContact: {
      name: "Michael Chen",
      email: "m.chen@elitemech.com",
      phone: "(555) 345-6789",
    },
    bidAmount: 4900000,
    status: "pending",
    submissionDate: "2025-01-22",
    validUntil: "2025-02-22",
    notes: "Specialized equipment experience",
    rating: 4.8,
    lineItems: [
      { description: "HVAC systems", quantity: 1, unit: "LS", unitPrice: 2500000, totalPrice: 2500000 },
      { description: "Electrical work", quantity: 1, unit: "LS", unitPrice: 2400000, totalPrice: 2400000 },
    ],
    attachments: ["mep-specifications.pdf", "equipment-catalog.pdf"],
    evaluationScore: 95,
    riskLevel: "medium",
    pastPerformance: {
      projectsCompleted: 12,
      avgRating: 4.8,
      onTimeDelivery: 92,
    },
  },
]

const getProjectRFPData = (projectId: string): RFPData[] => [
  {
    id: `rfp-${projectId}-001`,
    projectId,
    title: "Masonry Work - Exterior Walls",
    description: "Brick and stone masonry work for exterior walls including foundations and decorative elements",
    tradeCategory: "Masonry",
    status: "responses-due",
    issueDate: "2025-01-15",
    dueDate: "2025-02-01",
    bidders: ["Premium Masonry Inc", "Craftsman Stone Works", "Heritage Brick & Stone"],
    responseCount: 2,
    estimatedValue: 780000,
    requirements: ["Licensed masonry contractor", "Minimum 5 years experience", "Bonded and insured"],
    attachments: ["masonry-plans.pdf", "material-specifications.pdf"],
  },
  {
    id: `rfp-${projectId}-002`,
    projectId,
    title: "Roofing System Installation",
    description: "Complete roofing system including membrane, insulation, and accessories",
    tradeCategory: "Roofing",
    status: "draft",
    issueDate: "2025-01-25",
    dueDate: "2025-02-15",
    bidders: ["All Weather Roofing", "Premium Roof Systems", "Commercial Roofing Solutions"],
    responseCount: 0,
    estimatedValue: 650000,
    requirements: ["Commercial roofing experience", "Manufacturer certifications", "Warranty minimum 10 years"],
    attachments: ["roofing-specifications.pdf"],
  },
]

export function ProjectBidManagement({ projectId, projectData, userRole, className = "" }: ProjectBidManagementProps) {
  const [activeTab, setActiveTab] = useState("bids")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedBid, setSelectedBid] = useState<BidData | null>(null)
  const [selectedRFP, setSelectedRFP] = useState<RFPData | null>(null)
  const [showBidDetail, setShowBidDetail] = useState(false)
  const [showRFPDetail, setShowRFPDetail] = useState(false)

  // Get project-specific data
  const projectBids = useMemo(() => getProjectBidData(projectId), [projectId])
  const projectRFPs = useMemo(() => getProjectRFPData(projectId), [projectId])

  // Filter bids
  const filteredBids = useMemo(() => {
    return projectBids.filter((bid) => {
      const matchesSearch =
        bid.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.tradeCategory.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || bid.status === statusFilter
      const matchesCategory = categoryFilter === "all" || bid.tradeCategory === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [projectBids, searchTerm, statusFilter, categoryFilter])

  // Calculate project-specific metrics
  const projectMetrics = useMemo(() => {
    const totalBids = projectBids.length
    const pendingBids = projectBids.filter((bid) => bid.status === "received" || bid.status === "pending").length
    const selectedBids = projectBids.filter((bid) => bid.status === "selected").length
    const totalValue = projectBids.reduce((sum, bid) => sum + bid.bidAmount, 0)
    const avgBidValue = totalBids > 0 ? totalValue / totalBids : 0
    const avgEvaluationScore = projectBids.reduce((sum, bid) => sum + bid.evaluationScore, 0) / totalBids
    const activeRFPs = projectRFPs.filter((rfp) => rfp.status === "responses-due").length
    const draftRFPs = projectRFPs.filter((rfp) => rfp.status === "draft").length

    return {
      totalBids,
      pendingBids,
      selectedBids,
      totalValue,
      avgBidValue,
      avgEvaluationScore,
      activeRFPs,
      draftRFPs,
    }
  }, [projectBids, projectRFPs])

  // Get unique categories for this project
  const uniqueCategories = useMemo(() => {
    return [...new Set(projectBids.map((bid) => bid.tradeCategory))]
  }, [projectBids])

  // Utility functions
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      received: { variant: "secondary" as const, label: "Received", color: "bg-blue-100 text-blue-800" },
      reviewed: { variant: "default" as const, label: "Reviewed", color: "bg-yellow-100 text-yellow-800" },
      selected: { variant: "default" as const, label: "Selected", color: "bg-green-100 text-green-800" },
      rejected: { variant: "destructive" as const, label: "Rejected", color: "bg-red-100 text-red-800" },
      pending: { variant: "outline" as const, label: "Pending", color: "bg-gray-100 text-gray-800" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      variant: "outline" as const,
      label: status,
      color: "",
    }
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getRFPStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: "secondary" as const, label: "Draft", color: "bg-gray-100 text-gray-800" },
      sent: { variant: "default" as const, label: "Sent", color: "bg-blue-100 text-blue-800" },
      "responses-due": { variant: "default" as const, label: "Responses Due", color: "bg-orange-100 text-orange-800" },
      "under-review": { variant: "secondary" as const, label: "Under Review", color: "bg-purple-100 text-purple-800" },
      awarded: { variant: "default" as const, label: "Awarded", color: "bg-green-100 text-green-800" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      variant: "outline" as const,
      label: status,
      color: "",
    }
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getRiskBadge = (risk: string) => {
    const riskConfig = {
      low: { variant: "default" as const, label: "Low Risk", color: "bg-green-100 text-green-800" },
      medium: { variant: "secondary" as const, label: "Medium Risk", color: "bg-yellow-100 text-yellow-800" },
      high: { variant: "destructive" as const, label: "High Risk", color: "bg-red-100 text-red-800" },
    }

    const config = riskConfig[risk as keyof typeof riskConfig] || {
      variant: "outline" as const,
      label: risk,
      color: "",
    }
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="text-sm ml-1">{rating.toFixed(1)}</span>
      </div>
    )
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

  return (
    <div className={`project-bid-management ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Handshake className="h-5 w-5" />
                Bid Management
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage bids and RFPs for {projectData?.name || `Project ${projectId}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Bid Center
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New RFP
              </Button>
            </div>
          </div>
        </div>

        {/* Project Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bids</p>
                  <p className="text-2xl font-bold">{projectMetrics.totalBids}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Review</p>
                  <p className="text-2xl font-bold text-orange-600">{projectMetrics.pendingBids}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(projectMetrics.totalValue)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active RFPs</p>
                  <p className="text-2xl font-bold text-purple-600">{projectMetrics.activeRFPs}</p>
                </div>
                <Briefcase className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bids">Bids</TabsTrigger>
            <TabsTrigger value="rfps">RFPs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="bids" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search bids..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="selected">Selected</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bids Table */}
            <Card>
              <CardHeader>
                <CardTitle>Project Bids ({filteredBids.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Bid Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Risk</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBids.map((bid) => (
                        <TableRow key={bid.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{bid.vendorName}</div>
                              <div className="text-sm text-gray-500">{bid.vendorContact.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>{bid.tradeCategory}</TableCell>
                          <TableCell className="text-right font-semibold">{formatCurrency(bid.bidAmount)}</TableCell>
                          <TableCell>{getStatusBadge(bid.status)}</TableCell>
                          <TableCell>{getRiskBadge(bid.riskLevel)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-12 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${bid.evaluationScore}%` }}
                                />
                              </div>
                              <span className="text-sm">{bid.evaluationScore}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">{formatDate(bid.validUntil)}</div>
                              <div
                                className={`text-xs ${
                                  getDaysUntilDue(bid.validUntil) < 7 ? "text-red-600" : "text-gray-500"
                                }`}
                              >
                                {getDaysUntilDue(bid.validUntil) > 0
                                  ? `${getDaysUntilDue(bid.validUntil)} days left`
                                  : "Expired"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedBid(bid)
                                  setShowBidDetail(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Download className="h-4 w-4" />
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
          </TabsContent>

          <TabsContent value="rfps" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {projectRFPs.map((rfp) => (
                <Card key={rfp.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{rfp.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{rfp.tradeCategory}</p>
                      </div>
                      {getRFPStatusBadge(rfp.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{rfp.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">Estimated Value:</span>
                        <p className="font-semibold">{formatCurrency(rfp.estimatedValue)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Due Date:</span>
                        <p className="font-medium">{formatDate(rfp.dueDate)}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-medium">Responses</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(rfp.responseCount / rfp.bidders.length) * 100} className="flex-1" />
                        <span className="text-sm">
                          {rfp.responseCount}/{rfp.bidders.length}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{getDaysUntilDue(rfp.dueDate)} days left</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Bid Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{projectMetrics.avgEvaluationScore.toFixed(1)}</div>
                      <p className="text-muted-foreground">Average Evaluation Score</p>
                    </div>
                    <div className="space-y-3">
                      {projectBids.map((bid) => (
                        <div key={bid.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{bid.vendorName}</div>
                            <div className="text-sm text-muted-foreground">{bid.tradeCategory}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{bid.evaluationScore}</div>
                            <div className="text-sm text-muted-foreground">{formatCurrency(bid.bidAmount)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uniqueCategories.map((category) => {
                      const categoryBids = projectBids.filter((bid) => bid.tradeCategory === category)
                      const categoryValue = categoryBids.reduce((sum, bid) => sum + bid.bidAmount, 0)
                      const percentage = (categoryValue / projectMetrics.totalValue) * 100

                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{category}</span>
                            <span className="text-sm">{percentage.toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={percentage} className="h-2 flex-1" />
                            <span className="text-sm font-medium w-24 text-right">{formatCurrency(categoryValue)}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Bid Detail Modal */}
        {selectedBid && (
          <Dialog open={showBidDetail} onOpenChange={setShowBidDetail}>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>
                  {selectedBid.vendorName} - {selectedBid.tradeCategory}
                </DialogTitle>
                <DialogDescription>Bid Amount: {formatCurrency(selectedBid.bidAmount)}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <div className="mt-1">{getStatusBadge(selectedBid.status)}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Evaluation Score</Label>
                      <div className="mt-1 flex items-center gap-2">
                        <Progress value={selectedBid.evaluationScore} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{selectedBid.evaluationScore}/100</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Risk Level</Label>
                      <div className="mt-1">{getRiskBadge(selectedBid.riskLevel)}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Vendor Rating</Label>
                      <div className="mt-1">{renderStarRating(selectedBid.rating)}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Valid Until</Label>
                      <p className="text-sm mt-1">{formatDate(selectedBid.validUntil)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Past Performance</Label>
                      <div className="text-sm mt-1 space-y-1">
                        <p>Projects: {selectedBid.pastPerformance.projectsCompleted}</p>
                        <p>On-time Delivery: {selectedBid.pastPerformance.onTimeDelivery}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedBid.lineItems.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Line Items</Label>
                    <div className="mt-2 rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Unit Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedBid.lineItems.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.description}</TableCell>
                              <TableCell className="text-right">
                                {item.quantity.toLocaleString()} {item.unit}
                              </TableCell>
                              <TableCell className="text-right">${item.unitPrice.toLocaleString()}</TableCell>
                              <TableCell className="text-right font-semibold">
                                {formatCurrency(item.totalPrice)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {selectedBid.notes && (
                  <div>
                    <Label className="text-sm font-medium">Notes</Label>
                    <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{selectedBid.notes}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBidDetail(false)}>
                  Close
                </Button>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Vendor
                </Button>
                <Button>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Select Bid
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

export default ProjectBidManagement
