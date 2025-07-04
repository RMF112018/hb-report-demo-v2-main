"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useAuth } from "@/context/auth-context"
import { ContractDocumentsWidgets } from "@/components/contract-documents/ContractDocumentsWidgets"
import { HbiContractDocumentsInsights } from "@/components/contract-documents/HbiContractDocumentsInsights"
import { ContractDocumentsExportUtils } from "@/components/contract-documents/ContractDocumentsExportUtils"
import { useToast } from "@/hooks/use-toast"
import {
  Upload,
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Zap,
  Shield,
  BookOpen,
  Building,
  FileCheck,
  TrendingUp,
  Users,
  Calendar,
  Tag,
  Archive,
  Settings,
  MoreHorizontal,
  ChevronRight,
  AlertCircle,
  XCircle,
  Home,
  RefreshCw,
  Plus,
} from "lucide-react"
import { format } from "date-fns"
import type {
  ContractDocument,
  ContractDocumentsStats,
} from "@/components/contract-documents/ContractDocumentsExportUtils"

// Mock data for documents
const mockDocuments: ContractDocument[] = [
  {
    id: "doc-001",
    name: "Prime Contract - Wilshire Tower",
    type: "Prime Contract",
    status: "Under Review",
    uploadDate: "2024-01-15T08:30:00Z",
    reviewer: "Sarah Chen",
    priority: "High",
    complianceScore: 85,
    riskLevel: "Medium",
    aiAnalysisStatus: "Complete",
    tags: ["Contract", "High Value", "Risk Assessment"],
    size: "2.3 MB",
    pages: 47,
    project: {
      id: "proj-001",
      name: "Wilshire Tower Construction",
      projectNumber: "WT-2024-001",
    },
    keyRisks: [
      {
        category: "Payment Terms",
        description: "Complex milestone payment schedule",
        severity: "High",
        recommendation: "Define specific measurable completion criteria",
        clauseReference: "Section 12.3",
      },
    ],
    opportunities: [
      {
        category: "Early Completion Bonus",
        description: "Substantial bonus for early project completion",
        value: "$125,000",
        probability: "High",
        clauseReference: "Section 14.2",
      },
    ],
    complianceChecks: {
      buildingCodes: {
        status: "Compliant",
        lastChecked: "2024-01-15T10:00:00Z",
        nextReview: "2024-04-15T10:00:00Z",
      },
    },
    aiInsights: {
      overallRisk: "Medium",
      costSavingsPotential: 45000,
      recommendedActions: ["Renegotiate payment milestone criteria"],
      similarContracts: 3,
      industryBenchmark: {
        riskScore: "15% lower than industry average",
        complianceScore: "8% higher than industry average",
      },
    },
  },
  {
    id: "doc-002",
    name: "Electrical Subcontract Agreement",
    type: "Subcontract",
    status: "Approved",
    uploadDate: "2024-01-12T14:20:00Z",
    reviewer: "Mike Johnson",
    priority: "Medium",
    complianceScore: 92,
    riskLevel: "Low",
    aiAnalysisStatus: "Complete",
    tags: ["Subcontract", "Electrical", "Approved"],
    size: "1.8 MB",
    pages: 32,
    project: {
      id: "proj-002",
      name: "Downtown Office Complex",
      projectNumber: "DOC-2024-005",
    },
    keyRisks: [
      {
        category: "Performance Bond",
        description: "Required performance bond may impact cash flow",
        severity: "Low",
        recommendation: "Verify bond capacity before project start",
        clauseReference: "Section 6.1",
      },
    ],
    opportunities: [
      {
        category: "Volume Discount",
        description: "Additional discount for material orders over $100K",
        value: "3% discount",
        probability: "High",
        clauseReference: "Section 4.5",
      },
    ],
    complianceChecks: {
      buildingCodes: {
        status: "Compliant",
        lastChecked: "2024-01-12T15:00:00Z",
        nextReview: "2024-04-12T15:00:00Z",
      },
    },
    aiInsights: {
      overallRisk: "Low",
      costSavingsPotential: 15000,
      recommendedActions: ["Execute volume discount opportunities"],
      similarContracts: 12,
      industryBenchmark: {
        riskScore: "25% lower than industry average",
        complianceScore: "12% higher than industry average",
      },
    },
  },
  {
    id: "doc-003",
    name: "Building Code Updates - 2024",
    type: "Regulatory",
    status: "Action Required",
    uploadDate: "2024-01-10T09:15:00Z",
    reviewer: "Alex Rodriguez",
    priority: "High",
    complianceScore: 78,
    riskLevel: "High",
    aiAnalysisStatus: "In Progress",
    tags: ["Building Code", "Regulatory", "Compliance"],
    size: "5.2 MB",
    pages: 156,
    project: {
      id: "proj-multiple",
      name: "Multiple Projects",
      projectNumber: "MULTI-2024",
    },
    keyRisks: [
      {
        category: "Code Compliance",
        description: "New building code requirements may require retrofits",
        severity: "High",
        recommendation: "Review all active projects for compliance gaps",
        clauseReference: "Section 4.2",
      },
    ],
    opportunities: [
      {
        category: "Energy Efficiency Credits",
        description: "New code provides energy efficiency tax incentives",
        value: "Up to $50,000 per project",
        probability: "Medium",
        clauseReference: "Appendix C",
      },
    ],
    complianceChecks: {
      environmentalRegs: {
        status: "Requires Review",
        lastChecked: "2024-01-10T10:00:00Z",
        nextReview: "2024-02-15T10:00:00Z",
      },
    },
    aiInsights: {
      overallRisk: "High",
      costSavingsPotential: 125000,
      recommendedActions: ["Prioritize compliance review", "Leverage efficiency credits"],
      similarContracts: 8,
      industryBenchmark: {
        riskScore: "40% higher than industry average",
        complianceScore: "2% lower than industry average",
      },
    },
  },
]

const mockAnalytics: ContractDocumentsStats = {
  totalDocuments: 247,
  pendingReview: 18,
  highRiskDocuments: 12,
  complianceRate: 94,
  avgReviewTime: 3.2,
  aiInsightsGenerated: 156,
  costSavingsIdentified: 485000,
  riskItemsResolved: 89,
}

export default function ContractDocumentsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedDocument, setSelectedDocument] = useState<ContractDocument | null>(null)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState<"pdf" | "excel" | "csv">("pdf")
  const [exportFileName, setExportFileName] = useState("contract-documents-export")

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setLoading(false)
    }
    loadData()
  }, [])

  const filteredDocuments = useMemo(() => {
    return mockDocuments.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.project.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === "all" || doc.status === filterStatus
      const matchesType = filterType === "all" || doc.type === filterType
      return matchesSearch && matchesStatus && matchesType
    })
  }, [searchTerm, filterStatus, filterType])

  const openDocumentModal = useCallback((document: ContractDocument) => {
    setSelectedDocument(document)
    setShowDocumentModal(true)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "Under Review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "Action Required":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "Draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "text-red-600 dark:text-red-400"
      case "Medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "Low":
        return "text-green-600 dark:text-green-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  // Get role-specific scope
  const getProjectScope = () => {
    if (!user) return { scope: "all", projectCount: 0, description: "All Projects" }

    switch (user.role) {
      case "project-manager":
        return {
          scope: "single",
          projectCount: 1,
          description: "Single Project View",
        }
      case "project-executive":
        return {
          scope: "portfolio",
          projectCount: 6,
          description: "Portfolio View (6 Projects)",
        }
      default:
        return {
          scope: "enterprise",
          projectCount: 12,
          description: "Enterprise View (All Projects)",
        }
    }
  }

  const projectScope = getProjectScope()

  // Handle refresh
  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Refreshed",
        description: "Contract documents have been refreshed",
      })
    }, 1000)
  }

  // Handle export
  const handleExportSubmit = (options: { format: "pdf" | "excel" | "csv"; fileName: string }) => {
    try {
      switch (options.format) {
        case "pdf":
          ContractDocumentsExportUtils.exportToPDF(
            mockDocuments,
            mockAnalytics,
            "Enterprise Portfolio",
            options.fileName
          )
          break
        case "excel":
          ContractDocumentsExportUtils.exportToExcel(
            mockDocuments,
            mockAnalytics,
            "Enterprise Portfolio",
            options.fileName
          )
          break
        case "csv":
          ContractDocumentsExportUtils.exportToCSV(mockDocuments, "Enterprise Portfolio", options.fileName)
          break
      }
      toast({
        title: "Export Successful",
        description: `Contract documents exported as ${options.format.toUpperCase()}`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export contract documents",
        variant: "destructive",
      })
    }
    setIsExportModalOpen(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading document compliance platform...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <AppHeader />
      <div className="space-y-6 p-6">
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
              <BreadcrumbPage>Contract Documents</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Contract Documents</h1>
              <p className="text-muted-foreground mt-1">
                Manage and analyze contract documents with AI-powered insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" onClick={() => setIsExportModalOpen(true)}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button className="bg-hb-orange hover:bg-hb-orange/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>

          {/* Statistics Widgets */}
          <ContractDocumentsWidgets stats={mockAnalytics} />
        </div>

        {/* HBI Insights Panel */}
        <HbiContractDocumentsInsights documents={mockDocuments} stats={mockAnalytics} />

        {/* Main Content Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Document Library
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
              </TabsList>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockDocuments.slice(0, 3).map((doc, index) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-sm">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">{doc.type}</p>
                              </div>
                            </div>
                            <Badge variant="secondary" className={getStatusColor(doc.status)}>
                              {doc.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Insights Summary */}
                  <Card className="border-l-4 border-l-orange-600 dark:border-l-orange-400">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <Brain className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        HBI AI Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-l-blue-500">
                          <div className="font-medium text-sm text-blue-800 dark:text-blue-300">
                            Cost Optimization Opportunity
                          </div>
                          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            3 contracts show potential for $125K savings through renegotiation
                          </div>
                        </div>
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-l-red-500">
                          <div className="font-medium text-sm text-red-800 dark:text-red-300">Risk Alert</div>
                          <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                            New building code changes affect 5 active contracts
                          </div>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-l-green-500">
                          <div className="font-medium text-sm text-green-800 dark:text-green-300">
                            Compliance Achievement
                          </div>
                          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                            All safety documentation is up to date
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-foreground">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-foreground mb-2">
                          ${(mockAnalytics.costSavingsIdentified / 1000).toFixed(0)}K
                        </div>
                        <p className="text-sm text-muted-foreground">Cost Savings Identified</p>
                        <Progress value={75} className="mt-2" />
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                          {mockAnalytics.aiInsightsGenerated}
                        </div>
                        <p className="text-sm text-muted-foreground">AI Insights Generated</p>
                        <Progress value={85} className="mt-2" />
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                          {mockAnalytics.riskItemsResolved}
                        </div>
                        <p className="text-sm text-muted-foreground">Risk Items Resolved</p>
                        <Progress value={92} className="mt-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6">
                {/* Filters */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search documents..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border rounded-md bg-background"
                      >
                        <option value="all">All Status</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Action Required">Action Required</option>
                      </select>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 border rounded-md bg-background"
                      >
                        <option value="all">All Types</option>
                        <option value="Prime Contract">Prime Contract</option>
                        <option value="Subcontract">Subcontract</option>
                        <option value="Regulatory">Regulatory</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                {/* Documents Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-foreground">Document Library</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Document</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Risk Level</TableHead>
                          <TableHead>Compliance</TableHead>
                          <TableHead>Reviewer</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDocuments.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">{doc.project.name}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{doc.type}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={getStatusColor(doc.status)}>
                                {doc.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className={`font-medium ${getRiskColor(doc.riskLevel)}`}>{doc.riskLevel}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress value={doc.complianceScore} className="w-16" />
                                <span className="text-sm">{doc.complianceScore}%</span>
                              </div>
                            </TableCell>
                            <TableCell>{doc.reviewer}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" onClick={() => openDocumentModal(doc)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
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

              {/* AI Analysis Tab */}
              <TabsContent value="analysis" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-l-4 border-l-orange-600 dark:border-l-orange-400">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <Brain className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        HBI Analysis Engine
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                          <div className="flex items-center gap-3 mb-3">
                            <Zap className="h-5 w-5 text-blue-600" />
                            <span className="font-medium text-blue-800 dark:text-blue-300">Real-time Analysis</span>
                          </div>
                          <p className="text-sm text-blue-700 dark:text-blue-400">
                            Our HBI engine continuously monitors document changes and provides instant risk assessments.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Risk Detection</span>
                            <span className="text-sm font-medium">98.5% Accuracy</span>
                          </div>
                          <Progress value={98.5} />

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Compliance Checking</span>
                            <span className="text-sm font-medium">96.2% Accuracy</span>
                          </div>
                          <Progress value={96.2} />

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Cost Analysis</span>
                            <span className="text-sm font-medium">94.8% Accuracy</span>
                          </div>
                          <Progress value={94.8} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-foreground">Analysis Queue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 dark:border-orange-400"></div>
                            <span className="text-sm">Analyzing Building Code Updates</span>
                          </div>
                          <Badge variant="secondary">In Progress</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">HVAC Subcontract Review</span>
                          </div>
                          <Badge variant="outline">Queued</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Prime Contract Analysis</span>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          >
                            Complete
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Compliance Tab */}
              <TabsContent value="compliance" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Regulatory Compliance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Building Codes</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Safety Standards</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Environmental</span>
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Labor Laws</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <FileCheck className="h-5 w-5" />
                        Contract Compliance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Payment Terms</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Performance Bonds</span>
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Insurance Requirements</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Change Orders</span>
                          <XCircle className="h-4 w-4 text-red-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Documentation Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Contract Signing</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Legal Review</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Final Approval</span>
                          <Clock className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Archive</span>
                          <Clock className="h-4 w-4 text-blue-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Contract Documents Help
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-foreground">Document Management</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Upload and organize contract documents by type and project
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Track review status and compliance scores
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Set up automated compliance monitoring
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-foreground">AI Analysis</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    Identify risks and opportunities automatically
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    Generate compliance and performance insights
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    Benchmark against industry standards
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Detail Modal */}
      {selectedDocument && (
        <Dialog open={showDocumentModal} onOpenChange={setShowDocumentModal}>
          <DialogContent className="w-[60vw] max-w-none max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {selectedDocument.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Document Header */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-medium">{selectedDocument.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant="secondary" className={getStatusColor(selectedDocument.status)}>
                        {selectedDocument.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Risk Level</p>
                      <span className={`font-medium ${getRiskColor(selectedDocument.riskLevel)}`}>
                        {selectedDocument.riskLevel}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Key Risks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Key Risks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedDocument.keyRisks.map((risk, index) => (
                        <div
                          key={index}
                          className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-l-red-500"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-red-800 dark:text-red-300">{risk.category}</p>
                            <p className="text-xs text-red-700 dark:text-red-400">{risk.description}</p>
                            <p className="text-xs text-red-600 dark:text-red-500">
                              <span className="font-medium">Recommendation:</span> {risk.recommendation}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-500">
                              <span className="font-medium">Reference:</span> {risk.clauseReference}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Opportunities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedDocument.opportunities.map((opportunity, index) => (
                        <div
                          key={index}
                          className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-l-green-500"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-green-800 dark:text-green-300">
                              {opportunity.category}
                            </p>
                            <p className="text-xs text-green-700 dark:text-green-400">{opportunity.description}</p>
                            <p className="text-xs text-green-600 dark:text-green-500">
                              <span className="font-medium">Value:</span> {opportunity.value}
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-500">
                              <span className="font-medium">Probability:</span> {opportunity.probability}
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-500">
                              <span className="font-medium">Reference:</span> {opportunity.clauseReference}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* HBI Analysis */}
              <Card className="border-l-4 border-l-orange-600 dark:border-l-orange-400">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Brain className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    HBI AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Compliance Score</p>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedDocument.complianceScore} className="flex-1" />
                        <span className="text-sm font-medium">{selectedDocument.complianceScore}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Analysis Status</p>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      >
                        {selectedDocument.aiAnalysisStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>AI Recommendation:</strong> This document shows medium risk due to payment term
                      complexity. Consider renegotiating clause 12.3 for clearer milestone definitions. Potential cost
                      savings of $45K identified through early completion incentives.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowDocumentModal(false)}>
                  Close
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button className="bg-hb-orange hover:bg-hb-orange/90 text-white">
                  <FileCheck className="h-4 w-4 mr-2" />
                  Mark Reviewed
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground">Upload Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop your documents here, or click to browse
                </p>
                <Button variant="outline" size="sm">
                  Choose Files
                </Button>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Document Type</label>
                <select className="w-full px-3 py-2 border rounded-md bg-background">
                  <option>Prime Contract</option>
                  <option>Subcontract</option>
                  <option>Specification</option>
                  <option>Regulatory Document</option>
                  <option>Building Code</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3">
                <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
                <Button className="bg-hb-orange hover:bg-hb-orange/90 text-white">Upload & Analyze</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Export Modal */}
      <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Export Contract Documents</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Export Format</label>
              <select
                className="w-full px-3 py-2 border rounded-md bg-background"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as "pdf" | "excel" | "csv")}
              >
                <option value="pdf">PDF Report</option>
                <option value="excel">Excel Spreadsheet</option>
                <option value="csv">CSV Data</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">File Name</label>
              <Input
                placeholder="contract-documents-export"
                value={exportFileName}
                onChange={(e) => setExportFileName(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={() => setIsExportModalOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-hb-orange hover:bg-hb-orange/90 text-white"
                onClick={() => handleExportSubmit({ format: exportFormat, fileName: exportFileName })}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
