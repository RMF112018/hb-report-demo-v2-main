/**
 * @fileoverview Enhanced Contract Documents Component
 * @module EnhancedContractDocuments
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-29
 *
 * Comprehensive contract document management with:
 * - AI-guided contract document review
 * - Contract section/article/word tagging
 * - Association with other application components
 * - Prime Contract and Subcontract responsibility matrix tasks
 * - Enhanced functionality for document analysis
 */

"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  Plus,
  Edit3,
  Share2,
  Bookmark,
  MessageSquare,
  Target,
  Link,
  Hash,
  Sparkles,
  Bot,
  UserCheck,
  ClipboardList,
  ArrowRight,
  CheckSquare2,
  FileX,
  Globe,
} from "lucide-react"

interface ContractDocument {
  id: string
  name: string
  type: "Prime Contract" | "Subcontract" | "Regulatory" | "Amendment" | "Specification"
  status: "Under Review" | "Approved" | "Action Required" | "Draft" | "Expired"
  uploadDate: string
  reviewer: string
  priority: "High" | "Medium" | "Low"
  complianceScore: number
  riskLevel: "High" | "Medium" | "Low"
  aiAnalysisStatus: "Complete" | "In Progress" | "Pending" | "Failed"
  tags: string[]
  size: string
  pages: number
  keyRisks: string[]
  opportunities: string[]
  project: {
    name: string
    id: string
  }
  sections: ContractSection[]
  responsibilityTasks: ResponsibilityTask[]
  linkedComponents: LinkedComponent[]
}

interface ContractSection {
  id: string
  title: string
  content: string
  page: number
  riskLevel: "High" | "Medium" | "Low"
  tags: string[]
  comments: Comment[]
  highlightedTerms: HighlightedTerm[]
}

interface HighlightedTerm {
  id: string
  text: string
  type: "risk" | "opportunity" | "compliance" | "financial" | "timeline"
  explanation: string
  associatedComponents: string[]
}

interface Comment {
  id: string
  userId: string
  userName: string
  text: string
  timestamp: string
  type: "review" | "question" | "suggestion" | "approval"
}

interface ResponsibilityTask {
  id: string
  title: string
  type: "Prime Contract" | "Subcontract"
  assignee: string
  dueDate: string
  status: "Pending" | "In Progress" | "Completed" | "Overdue"
  priority: "High" | "Medium" | "Low"
  description: string
  linkedSection: string
}

interface LinkedComponent {
  id: string
  type: "schedule" | "financial" | "procurement" | "safety" | "quality"
  name: string
  relationship: string
  status: "Active" | "Pending" | "Completed"
}

interface EnhancedContractDocumentsProps {
  projectId: string
  projectData: any
  userRole: string
  user: any
}

// Enhanced mock data with comprehensive features
const mockDocuments: ContractDocument[] = [
  {
    id: "doc-001",
    name: "Prime Contract - Wilshire Tower",
    type: "Prime Contract",
    status: "Under Review",
    uploadDate: "2024-01-15",
    reviewer: "Sarah Chen",
    priority: "High",
    complianceScore: 85,
    riskLevel: "Medium",
    aiAnalysisStatus: "Complete",
    tags: ["Contract", "High Value", "Risk Assessment", "Payment Terms"],
    size: "2.3 MB",
    pages: 47,
    keyRisks: ["Payment Terms", "Change Order Process", "Liquidated Damages"],
    opportunities: ["Early Completion Bonus", "Material Escalation"],
    project: {
      name: "Wilshire Tower Construction",
      id: "proj-001",
    },
    sections: [
      {
        id: "sec-001",
        title: "General Conditions",
        content: "This contract establishes the general terms...",
        page: 1,
        riskLevel: "Low",
        tags: ["General", "Terms"],
        comments: [],
        highlightedTerms: [
          {
            id: "term-001",
            text: "liquidated damages",
            type: "risk",
            explanation: "Potential financial penalty for delays",
            associatedComponents: ["schedule", "financial"],
          },
        ],
      },
    ],
    responsibilityTasks: [
      {
        id: "task-001",
        title: "Review Payment Schedule Compliance",
        type: "Prime Contract",
        assignee: "Sarah Chen",
        dueDate: "2024-02-01",
        status: "In Progress",
        priority: "High",
        description: "Ensure payment schedule aligns with project milestones",
        linkedSection: "sec-003",
      },
    ],
    linkedComponents: [
      {
        id: "comp-001",
        type: "schedule",
        name: "Project Schedule",
        relationship: "Payment milestones linked to schedule completion",
        status: "Active",
      },
    ],
  },
  {
    id: "doc-002",
    name: "Electrical Subcontract Agreement",
    type: "Subcontract",
    status: "Approved",
    uploadDate: "2024-01-12",
    reviewer: "Mike Johnson",
    priority: "Medium",
    complianceScore: 92,
    riskLevel: "Low",
    aiAnalysisStatus: "Complete",
    tags: ["Subcontract", "Electrical", "Approved", "Performance Bond"],
    size: "1.8 MB",
    pages: 32,
    keyRisks: ["Performance Bond", "Insurance Requirements"],
    opportunities: ["Volume Discount", "Extended Warranty"],
    project: {
      name: "Downtown Office Complex",
      id: "proj-002",
    },
    sections: [],
    responsibilityTasks: [
      {
        id: "task-002",
        title: "Verify Insurance Coverage",
        type: "Subcontract",
        assignee: "Mike Johnson",
        dueDate: "2024-01-25",
        status: "Completed",
        priority: "Medium",
        description: "Confirm adequate insurance coverage per contract requirements",
        linkedSection: "sec-002",
      },
    ],
    linkedComponents: [
      {
        id: "comp-002",
        type: "procurement",
        name: "Electrical Procurement Plan",
        relationship: "Subcontract deliverables tied to procurement schedule",
        status: "Active",
      },
    ],
  },
]

const mockAnalytics = {
  totalDocuments: 247,
  pendingReview: 18,
  highRiskDocuments: 12,
  complianceRate: 94,
  avgReviewTime: 3.2,
  aiInsightsGenerated: 156,
  costSavingsIdentified: 485000,
  riskItemsResolved: 89,
  responsibilityTasks: 45,
  linkedComponents: 128,
  taggedSections: 234,
}

export const EnhancedContractDocuments: React.FC<EnhancedContractDocumentsProps> = ({
  projectId,
  projectData,
  userRole,
  user,
}) => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedDocument, setSelectedDocument] = useState<ContractDocument | null>(null)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showTaggingModal, setShowTaggingModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [selectedSection, setSelectedSection] = useState<ContractSection | null>(null)
  const [newTag, setNewTag] = useState("")
  const [newTask, setNewTask] = useState({
    title: "",
    type: "Prime Contract" as "Prime Contract" | "Subcontract",
    assignee: "",
    dueDate: "",
    priority: "Medium" as "High" | "Medium" | "Low",
    description: "",
  })

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
        doc.project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = filterStatus === "all" || doc.status === filterStatus
      const matchesType = filterType === "all" || doc.type === filterType
      return matchesSearch && matchesStatus && matchesType
    })
  }, [searchTerm, filterStatus, filterType])

  const openDocumentModal = useCallback((document: ContractDocument) => {
    setSelectedDocument(document)
    setShowDocumentModal(true)
  }, [])

  const handleAddTag = useCallback(() => {
    if (newTag.trim() && selectedSection) {
      // Logic to add tag to section
      setNewTag("")
    }
  }, [newTag, selectedSection])

  const handleCreateTask = useCallback(() => {
    if (newTask.title.trim()) {
      // Logic to create responsibility task
      setNewTask({
        title: "",
        type: "Prime Contract",
        assignee: "",
        dueDate: "",
        priority: "Medium",
        description: "",
      })
      setShowTaskModal(false)
    }
  }, [newTask])

  // Utility functions
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

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "Overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading contract documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Contract Documents
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered document compliance and risk analysis platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowUploadModal(true)} className="bg-orange-600 hover:bg-orange-700 text-white">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
          <Button variant="outline" onClick={() => setShowTaskModal(true)}>
            <ClipboardList className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </div>
      </div>

      {/* Enhanced Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{mockAnalytics.totalDocuments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{mockAnalytics.aiInsightsGenerated}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Brain className="h-3 w-3 inline mr-1" />
              Auto-generated
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tagged Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockAnalytics.taggedSections}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Tag className="h-3 w-3 inline mr-1" />
              Organized content
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{mockAnalytics.responsibilityTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Users className="h-3 w-3 inline mr-1" />
              Responsibility matrix
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="ai-review">AI Review</TabsTrigger>
          <TabsTrigger value="tagging">Tagging</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDocuments.slice(0, 3).map((doc) => (
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

            {/* HBI AI Insights */}
            <Card className="border-l-4 border-l-orange-600">
              <CardHeader>
                <CardTitle className="text-blue-600 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-orange-600" />
                  HBI AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-l-blue-500">
                    <div className="font-medium text-sm text-blue-800 dark:text-blue-300 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Cost Optimization Opportunity
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      3 contracts show potential for $125K savings through renegotiation
                    </div>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-l-red-500">
                    <div className="font-medium text-sm text-red-800 dark:text-red-300 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Risk Alert
                    </div>
                    <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                      New building code changes affect 5 active contracts
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-l-green-500">
                    <div className="font-medium text-sm text-green-800 dark:text-green-300 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
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
              <CardTitle className="text-blue-600">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    ${(mockAnalytics.costSavingsIdentified / 1000).toFixed(0)}K
                  </div>
                  <p className="text-sm text-muted-foreground">Cost Savings Identified</p>
                  <Progress value={75} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{mockAnalytics.linkedComponents}</div>
                  <p className="text-sm text-muted-foreground">Linked Components</p>
                  <Progress value={85} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{mockAnalytics.riskItemsResolved}</div>
                  <p className="text-sm text-muted-foreground">Risk Items Resolved</p>
                  <Progress value={92} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{mockAnalytics.complianceRate}%</div>
                  <p className="text-sm text-muted-foreground">Compliance Rate</p>
                  <Progress value={mockAnalytics.complianceRate} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab - Enhanced */}
        <TabsContent value="documents" className="space-y-6">
          {/* Enhanced Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents, tags, or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Action Required">Action Required</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Prime Contract">Prime Contract</SelectItem>
                    <SelectItem value="Subcontract">Subcontract</SelectItem>
                    <SelectItem value="Regulatory">Regulatory</SelectItem>
                    <SelectItem value="Amendment">Amendment</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setShowTaggingModal(true)}>
                  <Tag className="h-4 w-4 mr-2" />
                  Manage Tags
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Documents Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Document Library</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>HBI Analysis</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Tasks</TableHead>
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
                          <Badge
                            variant="outline"
                            className={doc.aiAnalysisStatus === "Complete" ? "border-green-500 text-green-700" : ""}
                          >
                            {doc.aiAnalysisStatus}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {doc.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{doc.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">
                            {doc.responsibilityTasks.length} tasks
                          </Badge>
                          <Badge variant="outline" className="text-xs text-blue-600">
                            {doc.linkedComponents.length} links
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openDocumentModal(doc)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Tag className="h-4 w-4" />
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

        {/* AI Review Tab */}
        <TabsContent value="ai-review" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-orange-600">
              <CardHeader>
                <CardTitle className="text-blue-600 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-orange-600" />
                  HBI Analysis Engine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Bot className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-800 dark:text-blue-300">Real-time Analysis</span>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Our HBI engine continuously monitors document changes and provides instant risk assessments with
                      smart tagging and component linking.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Risk Detection</span>
                      <span className="text-sm font-medium">98.5% Accuracy</span>
                    </div>
                    <Progress value={98.5} />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tag Suggestion</span>
                      <span className="text-sm font-medium">95.8% Accuracy</span>
                    </div>
                    <Progress value={95.8} />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Component Linking</span>
                      <span className="text-sm font-medium">92.3% Accuracy</span>
                    </div>
                    <Progress value={92.3} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Analysis Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
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

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Smart Tagging Suggestion</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Contract section 12.3 should be tagged with "Payment Terms" and "Milestone Dependencies"
                  </p>
                  <Button size="sm" variant="outline">
                    Apply Tags
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Link className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Component Linking</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Payment schedule can be linked to Project Schedule milestones
                  </p>
                  <Button size="sm" variant="outline">
                    Create Link
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tagging Tab */}
        <TabsContent value="tagging" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Document Tagging & Organization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Tag Categories */}
                <div>
                  <h4 className="font-medium mb-3">Tag Categories</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 border rounded-lg text-center">
                      <AlertTriangle className="h-5 w-5 mx-auto mb-2 text-red-600" />
                      <span className="text-sm font-medium">Risk</span>
                      <div className="text-xs text-muted-foreground">45 tags</div>
                    </div>
                    <div className="p-3 border rounded-lg text-center">
                      <TrendingUp className="h-5 w-5 mx-auto mb-2 text-green-600" />
                      <span className="text-sm font-medium">Opportunity</span>
                      <div className="text-xs text-muted-foreground">23 tags</div>
                    </div>
                    <div className="p-3 border rounded-lg text-center">
                      <Shield className="h-5 w-5 mx-auto mb-2 text-blue-600" />
                      <span className="text-sm font-medium">Compliance</span>
                      <div className="text-xs text-muted-foreground">67 tags</div>
                    </div>
                    <div className="p-3 border rounded-lg text-center">
                      <Clock className="h-5 w-5 mx-auto mb-2 text-yellow-600" />
                      <span className="text-sm font-medium">Timeline</span>
                      <div className="text-xs text-muted-foreground">34 tags</div>
                    </div>
                  </div>
                </div>

                {/* Popular Tags */}
                <div>
                  <h4 className="font-medium mb-3">Popular Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Payment Terms",
                      "Change Orders",
                      "Performance Bond",
                      "Insurance",
                      "Liquidated Damages",
                      "Warranty",
                      "Compliance",
                      "Safety Requirements",
                    ].map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-blue-100">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tagged Sections */}
                <div>
                  <h4 className="font-medium mb-3">Recently Tagged Sections</h4>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">Section 12.3 - Payment Schedule</p>
                          <p className="text-xs text-muted-foreground">Prime Contract - Wilshire Tower</p>
                          <div className="flex gap-1 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              Payment Terms
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              Milestones
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-blue-600 flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Responsibility Matrix Tasks
              </CardTitle>
              <Button onClick={() => setShowTaskModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDocuments
                  .flatMap((doc) => doc.responsibilityTasks)
                  .map((task) => (
                    <div key={task.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className={
                                task.type === "Prime Contract"
                                  ? "border-blue-500 text-blue-700"
                                  : "border-green-500 text-green-700"
                              }
                            >
                              {task.type}
                            </Badge>
                            <Badge variant="secondary" className={getTaskStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={
                                task.priority === "High"
                                  ? "border-red-500 text-red-700"
                                  : "border-yellow-500 text-yellow-700"
                              }
                            >
                              {task.priority}
                            </Badge>
                          </div>
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Assigned to: {task.assignee}</span>
                            <span>Due: {task.dueDate}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Component Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Schedule Integration</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Contract milestones automatically sync with project schedule
                  </p>
                  <div className="text-xs text-muted-foreground">12 active connections</div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Procurement Integration</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Subcontract terms linked to procurement commitments
                  </p>
                  <div className="text-xs text-muted-foreground">8 active connections</div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium">Safety Integration</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Pending
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Safety requirements from contracts sync with safety protocols
                  </p>
                  <div className="text-xs text-muted-foreground">3 pending connections</div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckSquare2 className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Quality Integration</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Quality standards from contracts create inspection checklists
                  </p>
                  <div className="text-xs text-muted-foreground">15 active connections</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Document Detail Modal - Enhanced */}
      {selectedDocument && (
        <Dialog open={showDocumentModal} onOpenChange={setShowDocumentModal}>
          <DialogContent className="w-[90vw] max-w-none max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-blue-600 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {selectedDocument.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Enhanced Document Header */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <Badge variant="outline">{selectedDocument.type}</Badge>
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
                <div>
                  <p className="text-sm text-muted-foreground">HBI Analysis</p>
                  <Badge variant="outline" className="border-green-500 text-green-700">
                    {selectedDocument.aiAnalysisStatus}
                  </Badge>
                </div>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="sections">Sections & Tags</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="integrations">Integrations</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Key Risks */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-blue-600 flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          Key Risks
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedDocument.keyRisks.map((risk: string, index: number) => (
                            <div
                              key={index}
                              className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-l-red-500"
                            >
                              <p className="text-sm font-medium text-red-800 dark:text-red-300">{risk}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Opportunities */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-blue-600 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                          Opportunities
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedDocument.opportunities.map((opportunity: string, index: number) => (
                            <div
                              key={index}
                              className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-l-green-500"
                            >
                              <p className="text-sm font-medium text-green-800 dark:text-green-300">{opportunity}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="sections" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-blue-600">Tagged Sections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedDocument.sections.map((section) => (
                          <div key={section.id} className="p-3 border rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium">{section.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">Page {section.page}</p>
                                <div className="flex gap-1 mt-2">
                                  {section.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <Badge variant="outline" className={`${getRiskColor(section.riskLevel)}`}>
                                {section.riskLevel}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tasks" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-blue-600">Related Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedDocument.responsibilityTasks.map((task) => (
                          <div key={task.id} className="p-3 border rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge
                                    variant="outline"
                                    className={
                                      task.type === "Prime Contract"
                                        ? "border-blue-500 text-blue-700"
                                        : "border-green-500 text-green-700"
                                    }
                                  >
                                    {task.type}
                                  </Badge>
                                  <Badge variant="secondary" className={getTaskStatusColor(task.status)}>
                                    {task.status}
                                  </Badge>
                                </div>
                                <h4 className="font-medium">{task.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="integrations" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-blue-600">Linked Components</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedDocument.linkedComponents.map((component) => (
                          <div key={component.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Link className="h-4 w-4 text-blue-600" />
                                <div>
                                  <p className="font-medium">{component.name}</p>
                                  <p className="text-sm text-muted-foreground">{component.relationship}</p>
                                </div>
                              </div>
                              <Badge
                                variant="secondary"
                                className={component.status === "Active" ? "bg-green-100 text-green-800" : ""}
                              >
                                {component.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowDocumentModal(false)}>
                  Close
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={() => setShowTaggingModal(true)}>
                  <Tag className="h-4 w-4 mr-2" />
                  Add Tags
                </Button>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  <FileCheck className="h-4 w-4 mr-2" />
                  Mark Reviewed
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Upload Modal - Enhanced */}
      {showUploadModal && (
        <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-blue-600">Upload Document</DialogTitle>
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

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Document Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prime">Prime Contract</SelectItem>
                      <SelectItem value="subcontract">Subcontract</SelectItem>
                      <SelectItem value="specification">Specification</SelectItem>
                      <SelectItem value="regulatory">Regulatory Document</SelectItem>
                      <SelectItem value="amendment">Amendment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="auto-tag" />
                <label htmlFor="auto-tag" className="text-sm">
                  Enable AI auto-tagging
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="auto-link" />
                <label htmlFor="auto-link" className="text-sm">
                  Auto-link to project components
                </label>
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">Upload & Analyze</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Task Modal */}
      {showTaskModal && (
        <Dialog open={showTaskModal} onOpenChange={setShowTaskModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-blue-600">Create Responsibility Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Task Title</label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task title"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={newTask.type}
                    onValueChange={(value: "Prime Contract" | "Subcontract") => setNewTask({ ...newTask, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Prime Contract">Prime Contract</SelectItem>
                      <SelectItem value="Subcontract">Subcontract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: "High" | "Medium" | "Low") => setNewTask({ ...newTask, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assignee</label>
                  <Input
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                    placeholder="Assign to..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task description..."
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button variant="outline" onClick={() => setShowTaskModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTask} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Create Task
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
