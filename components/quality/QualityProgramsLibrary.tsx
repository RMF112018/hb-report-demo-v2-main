/**
 * @fileoverview Enhanced Quality Programs Library Component
 * @module QualityProgramsLibrary
 * @version 2.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Component for comprehensive quality programs and procedures library management
 * Features: Document hosting, upload management, draft system, approval workflows, AI-powered revision suggestions
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import { Progress } from "../ui/progress"
import { Alert, AlertDescription } from "../ui/alert"
import {
  BookOpen,
  FileText,
  Star,
  Clock,
  Download,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Users,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Award,
  Target,
  Upload,
  FileCheck,
  FileX,
  FilePen,
  Workflow,
  MessageSquare,
  History,
  TrendingUp,
  Brain,
  Shield,
  Zap,
  MoreHorizontal,
  ArrowRight,
  FileIcon,
  Paperclip,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Lightbulb,
} from "lucide-react"

// Types
interface QualityDocument {
  id: string
  title: string
  category: "qc_guidelines" | "submittal_procedures" | "warranty_manuals" | "general"
  type: "standard" | "procedure" | "protocol" | "manual" | "guideline"
  description: string
  version: string
  status: "draft" | "under_review" | "approved" | "active" | "archived"
  author: string
  lastUpdated: string
  approvedBy?: string
  approvedDate?: string
  fileSize: string
  pages: number
  estimatedReadTime: string
  rating: number
  downloads: number
  tags: string[]
  aiSuggestions: AISuggestion[]
  adherenceScore: number
  revisionHistory: DocumentRevision[]
  comments: DocumentComment[]
  attachments: DocumentAttachment[]
}

interface AISuggestion {
  id: string
  type: "code_update" | "lesson_learned" | "field_trend" | "compliance"
  priority: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  suggestedChange: string
  impact: string
  confidence: number
  source: string
  createdDate: string
  status: "pending" | "reviewed" | "implemented" | "rejected"
}

interface DocumentRevision {
  id: string
  version: string
  changes: string
  author: string
  date: string
  approved: boolean
  approvedBy?: string
}

interface DocumentComment {
  id: string
  author: string
  message: string
  timestamp: string
  isInternal: boolean
  resolved: boolean
}

interface DocumentAttachment {
  id: string
  name: string
  size: string
  type: string
  uploadedBy: string
  uploadedDate: string
  url: string
}

interface AdherenceIssue {
  id: string
  documentId: string
  documentTitle: string
  issueType: "non_compliance" | "outdated_procedure" | "missing_training" | "field_deviation"
  description: string
  severity: "low" | "medium" | "high" | "critical"
  projectId: string
  projectName: string
  reportedBy: string
  reportedDate: string
  status: "open" | "investigating" | "resolved" | "closed"
  resolution?: string
}

export const QualityProgramsLibrary: React.FC = () => {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDocument, setSelectedDocument] = useState<QualityDocument | null>(null)
  const [activeTab, setActiveTab] = useState("library")
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isNewDocOpen, setIsNewDocOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFilter, setSelectedFilter] = useState({
    status: "all",
    type: "all",
    rating: "all",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock quality documents data
  const qualityDocuments: QualityDocument[] = [
    {
      id: "QD-001",
      title: "Construction Quality Control Guidelines",
      category: "qc_guidelines",
      type: "guideline",
      description:
        "Comprehensive quality control guidelines for construction projects including inspection protocols, documentation requirements, and corrective action procedures.",
      version: "3.2",
      status: "active",
      author: "Quality Control Team",
      lastUpdated: "2024-11-15",
      approvedBy: "John Smith",
      approvedDate: "2024-11-16",
      fileSize: "2.4 MB",
      pages: 45,
      estimatedReadTime: "35 min",
      rating: 4.8,
      downloads: 1247,
      tags: ["Quality", "Guidelines", "Construction", "Inspection"],
      adherenceScore: 92,
      aiSuggestions: [
        {
          id: "AS-001",
          type: "code_update",
          priority: "high",
          title: "Updated IBC 2024 Requirements",
          description: "New International Building Code requirements for structural inspections",
          suggestedChange: "Add section 4.2.3 for enhanced structural inspection protocols",
          impact: "Improves compliance with latest building codes",
          confidence: 87,
          source: "IBC 2024 Updates",
          createdDate: "2025-01-10",
          status: "pending",
        },
        {
          id: "AS-002",
          type: "lesson_learned",
          priority: "medium",
          title: "Concrete Curing Documentation",
          description: "Recent project showed importance of detailed curing documentation",
          suggestedChange: "Enhance section 3.1.4 with photographic evidence requirements",
          impact: "Reduces concrete quality issues by 15%",
          confidence: 78,
          source: "Project ABC-2024",
          createdDate: "2025-01-08",
          status: "reviewed",
        },
      ],
      revisionHistory: [
        {
          id: "RH-001",
          version: "3.2",
          changes: "Updated inspection frequency requirements",
          author: "Quality Control Team",
          date: "2024-11-15",
          approved: true,
          approvedBy: "John Smith",
        },
        {
          id: "RH-002",
          version: "3.1",
          changes: "Added digital documentation requirements",
          author: "Quality Control Team",
          date: "2024-09-20",
          approved: true,
          approvedBy: "John Smith",
        },
      ],
      comments: [
        {
          id: "DC-001",
          author: "Mike Johnson",
          message: "Should we add specific requirements for prefab components?",
          timestamp: "2025-01-12T10:30:00",
          isInternal: true,
          resolved: false,
        },
      ],
      attachments: [
        {
          id: "DA-001",
          name: "QC_Checklist_Template.xlsx",
          size: "245 KB",
          type: "Excel",
          uploadedBy: "Quality Control Team",
          uploadedDate: "2024-11-15",
          url: "/attachments/qc-checklist.xlsx",
        },
      ],
    },
    {
      id: "QD-002",
      title: "Submittal Review and Approval Procedures",
      category: "submittal_procedures",
      type: "procedure",
      description:
        "Detailed procedures for submittal review, approval processes, and documentation requirements for all construction submittals.",
      version: "2.8",
      status: "active",
      author: "Project Management Team",
      lastUpdated: "2024-12-05",
      approvedBy: "Sarah Wilson",
      approvedDate: "2024-12-06",
      fileSize: "1.9 MB",
      pages: 38,
      estimatedReadTime: "28 min",
      rating: 4.6,
      downloads: 892,
      tags: ["Submittals", "Approval", "Documentation", "Review"],
      adherenceScore: 88,
      aiSuggestions: [
        {
          id: "AS-003",
          type: "field_trend",
          priority: "medium",
          title: "Digital Submittal Platform Integration",
          description: "Industry trend toward fully digital submittal processes",
          suggestedChange: "Add section on digital platform requirements and workflows",
          impact: "Reduces submittal processing time by 30%",
          confidence: 82,
          source: "Industry Analysis 2024",
          createdDate: "2025-01-09",
          status: "pending",
        },
      ],
      revisionHistory: [
        {
          id: "RH-003",
          version: "2.8",
          changes: "Updated approval timelines and escalation procedures",
          author: "Project Management Team",
          date: "2024-12-05",
          approved: true,
          approvedBy: "Sarah Wilson",
        },
      ],
      comments: [],
      attachments: [
        {
          id: "DA-002",
          name: "Submittal_Review_Form.pdf",
          size: "180 KB",
          type: "PDF",
          uploadedBy: "Project Management Team",
          uploadedDate: "2024-12-05",
          url: "/attachments/submittal-review-form.pdf",
        },
      ],
    },
    {
      id: "QD-003",
      title: "Warranty Management and Claims Processing Manual",
      category: "warranty_manuals",
      type: "manual",
      description:
        "Comprehensive manual for warranty management, claims processing, vendor coordination, and closeout procedures.",
      version: "1.6",
      status: "active",
      author: "Quality Assurance Team",
      lastUpdated: "2024-10-28",
      approvedBy: "Robert Chen",
      approvedDate: "2024-10-30",
      fileSize: "3.2 MB",
      pages: 52,
      estimatedReadTime: "40 min",
      rating: 4.7,
      downloads: 654,
      tags: ["Warranty", "Claims", "Vendor Management", "Closeout"],
      adherenceScore: 85,
      aiSuggestions: [
        {
          id: "AS-004",
          type: "compliance",
          priority: "high",
          title: "Updated Consumer Protection Laws",
          description: "New state regulations affecting warranty claim procedures",
          suggestedChange: "Update section 5.3 with new legal requirements",
          impact: "Ensures compliance with state regulations",
          confidence: 94,
          source: "State Legal Updates",
          createdDate: "2025-01-11",
          status: "pending",
        },
      ],
      revisionHistory: [
        {
          id: "RH-004",
          version: "1.6",
          changes: "Enhanced vendor communication protocols",
          author: "Quality Assurance Team",
          date: "2024-10-28",
          approved: true,
          approvedBy: "Robert Chen",
        },
      ],
      comments: [
        {
          id: "DC-002",
          author: "Lisa Johnson",
          message: "Consider adding digital signature requirements for warranty claims",
          timestamp: "2025-01-10T14:20:00",
          isInternal: true,
          resolved: false,
        },
      ],
      attachments: [
        {
          id: "DA-003",
          name: "Warranty_Claim_Form.pdf",
          size: "320 KB",
          type: "PDF",
          uploadedBy: "Quality Assurance Team",
          uploadedDate: "2024-10-28",
          url: "/attachments/warranty-claim-form.pdf",
        },
      ],
    },
    {
      id: "QD-004",
      title: "Material Testing and Inspection Standards",
      category: "qc_guidelines",
      type: "standard",
      description:
        "Detailed standards for material testing and inspection including concrete, steel, and MEP components with sampling methods and acceptance criteria.",
      version: "2.4",
      status: "under_review",
      author: "Materials Engineering",
      lastUpdated: "2024-12-15",
      fileSize: "2.1 MB",
      pages: 41,
      estimatedReadTime: "32 min",
      rating: 4.5,
      downloads: 543,
      tags: ["Testing", "Materials", "Standards", "Inspection"],
      adherenceScore: 90,
      aiSuggestions: [
        {
          id: "AS-005",
          type: "lesson_learned",
          priority: "critical",
          title: "Welding Inspection Frequency",
          description: "Recent structural failures highlight need for increased welding inspections",
          suggestedChange: "Increase welding inspection frequency from 25% to 50% of welds",
          impact: "Reduces structural defects by 40%",
          confidence: 91,
          source: "Failure Analysis Report",
          createdDate: "2025-01-13",
          status: "pending",
        },
      ],
      revisionHistory: [
        {
          id: "RH-005",
          version: "2.4",
          changes: "Updated concrete testing protocols",
          author: "Materials Engineering",
          date: "2024-12-15",
          approved: false,
        },
      ],
      comments: [],
      attachments: [],
    },
    {
      id: "QD-005",
      title: "Subcontractor Quality Requirements",
      category: "general",
      type: "procedure",
      description:
        "Quality requirements and expectations for subcontractors including prequalification criteria, performance monitoring, and evaluation processes.",
      version: "1.3",
      status: "draft",
      author: "Procurement Team",
      lastUpdated: "2024-12-20",
      fileSize: "1.8 MB",
      pages: 29,
      estimatedReadTime: "22 min",
      rating: 4.3,
      downloads: 287,
      tags: ["Subcontractors", "Requirements", "Performance", "Quality"],
      adherenceScore: 76,
      aiSuggestions: [
        {
          id: "AS-006",
          type: "field_trend",
          priority: "medium",
          title: "Digital Performance Monitoring",
          description: "Industry moving toward real-time digital performance tracking",
          suggestedChange: "Add requirements for digital performance dashboards",
          impact: "Improves subcontractor performance tracking by 25%",
          confidence: 75,
          source: "Industry Trends 2024",
          createdDate: "2025-01-12",
          status: "pending",
        },
      ],
      revisionHistory: [
        {
          id: "RH-006",
          version: "1.3",
          changes: "Added digital documentation requirements",
          author: "Procurement Team",
          date: "2024-12-20",
          approved: false,
        },
      ],
      comments: [],
      attachments: [],
    },
  ]

  // Mock adherence issues data
  const adherenceIssues: AdherenceIssue[] = [
    {
      id: "AI-001",
      documentId: "QD-001",
      documentTitle: "Construction Quality Control Guidelines",
      issueType: "non_compliance",
      description: "Concrete testing frequency not following documented procedures",
      severity: "high",
      projectId: "P-001",
      projectName: "Downtown Office Complex",
      reportedBy: "Mike Johnson",
      reportedDate: "2025-01-10",
      status: "open",
    },
    {
      id: "AI-002",
      documentId: "QD-002",
      documentTitle: "Submittal Review and Approval Procedures",
      issueType: "outdated_procedure",
      description: "Approval timelines not aligned with current digital platform capabilities",
      severity: "medium",
      projectId: "P-002",
      projectName: "Retail Shopping Center",
      reportedBy: "Sarah Wilson",
      reportedDate: "2025-01-08",
      status: "investigating",
    },
    {
      id: "AI-003",
      documentId: "QD-003",
      documentTitle: "Warranty Management and Claims Processing Manual",
      issueType: "field_deviation",
      description: "Field teams not following proper warranty claim documentation procedures",
      severity: "medium",
      projectId: "P-003",
      projectName: "Medical Center Expansion",
      reportedBy: "Robert Chen",
      reportedDate: "2025-01-12",
      status: "resolved",
      resolution: "Conducted additional training session and updated field procedures",
    },
  ]

  // Filter and search logic
  const filteredDocuments = useMemo(() => {
    return qualityDocuments.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
      const matchesStatus = selectedFilter.status === "all" || doc.status === selectedFilter.status
      const matchesType = selectedFilter.type === "all" || doc.type === selectedFilter.type
      const matchesRating =
        selectedFilter.rating === "all" ||
        (selectedFilter.rating === "4+" && doc.rating >= 4) ||
        (selectedFilter.rating === "3-4" && doc.rating >= 3 && doc.rating < 4)

      return matchesSearch && matchesCategory && matchesStatus && matchesType && matchesRating
    })
  }, [searchQuery, selectedCategory, selectedFilter, qualityDocuments])

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "under_review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "archived":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "standard":
        return <Award className="h-4 w-4 text-blue-600" />
      case "procedure":
        return <FileText className="h-4 w-4 text-green-600" />
      case "protocol":
        return <Target className="h-4 w-4 text-purple-600" />
      case "manual":
        return <BookOpen className="h-4 w-4 text-orange-600" />
      case "guideline":
        return <CheckCircle className="h-4 w-4 text-teal-600" />
      default:
        return <FileIcon className="h-4 w-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "qc_guidelines":
        return <Shield className="h-4 w-4 text-blue-600" />
      case "submittal_procedures":
        return <Workflow className="h-4 w-4 text-green-600" />
      case "warranty_manuals":
        return <FileCheck className="h-4 w-4 text-purple-600" />
      default:
        return <FileIcon className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getAdherenceColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-yellow-600"
    if (score >= 70) return "text-orange-600"
    return "text-red-600"
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-3 w-3 fill-yellow-400 text-yellow-400" style={{ clipPath: "inset(0 50% 0 0)" }} />
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />)
    }

    return stars
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      // Simulate upload progress
      setUploadProgress(0)
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 200)
    }
  }

  // Statistics
  const stats = {
    totalDocuments: qualityDocuments.length,
    activeDocuments: qualityDocuments.filter((d) => d.status === "active").length,
    drafts: qualityDocuments.filter((d) => d.status === "draft").length,
    underReview: qualityDocuments.filter((d) => d.status === "under_review").length,
    totalDownloads: qualityDocuments.reduce((sum, doc) => sum + doc.downloads, 0),
    averageRating: qualityDocuments.reduce((sum, doc) => sum + doc.rating, 0) / qualityDocuments.length,
    averageAdherence: qualityDocuments.reduce((sum, doc) => sum + doc.adherenceScore, 0) / qualityDocuments.length,
    criticalSuggestions: qualityDocuments.reduce(
      (sum, doc) => sum + doc.aiSuggestions.filter((s) => s.priority === "critical").length,
      0
    ),
    openIssues: adherenceIssues.filter((i) => i.status === "open").length,
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Quality Programs & Procedures Library</h3>
          <p className="text-sm text-muted-foreground">
            Comprehensive document management with AI-powered insights and adherence tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Quality Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop files here or click to browse</p>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xlsx,.xls"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" size="sm">
                      Choose Files
                    </Button>
                  </Label>
                </div>
                {uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="doc-title">Document Title</Label>
                    <Input id="doc-title" placeholder="Enter document title" />
                  </div>
                  <div>
                    <Label htmlFor="doc-category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="qc_guidelines">QC Guidelines</SelectItem>
                        <SelectItem value="submittal_procedures">Submittal Procedures</SelectItem>
                        <SelectItem value="warranty_manuals">Warranty Manuals</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="doc-description">Description</Label>
                  <Textarea id="doc-description" placeholder="Enter document description" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsUploadOpen(false)}>Upload Document</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isNewDocOpen} onOpenChange={setIsNewDocOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new-title">Document Title</Label>
                    <Input id="new-title" placeholder="Enter document title" />
                  </div>
                  <div>
                    <Label htmlFor="new-type">Document Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="procedure">Procedure</SelectItem>
                        <SelectItem value="protocol">Protocol</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="guideline">Guideline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="new-category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="qc_guidelines">QC Guidelines</SelectItem>
                      <SelectItem value="submittal_procedures">Submittal Procedures</SelectItem>
                      <SelectItem value="warranty_manuals">Warranty Manuals</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="new-description">Description</Label>
                  <Textarea id="new-description" placeholder="Enter document description" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsNewDocOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsNewDocOpen(false)}>Create Document</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Documents</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalDocuments}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeDocuments}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Under Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.underReview}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Rating</p>
                <p className="text-2xl font-bold text-purple-600">{stats.averageRating.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Adherence</p>
                <p className={`text-2xl font-bold ${getAdherenceColor(stats.averageAdherence)}`}>
                  {stats.averageAdherence.toFixed(0)}%
                </p>
              </div>
              <Shield className="h-8 w-8 text-teal-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">AI Alerts</p>
                <p className="text-2xl font-bold text-orange-600">{stats.criticalSuggestions}</p>
              </div>
              <Brain className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="library">Document Library</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="adherence">Adherence Tracking</TabsTrigger>
          <TabsTrigger value="approvals">Approval Workflow</TabsTrigger>
        </TabsList>

        {/* Document Library Tab */}
        <TabsContent value="library" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Search & Filter Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents, descriptions, tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="qc_guidelines">QC Guidelines</SelectItem>
                    <SelectItem value="submittal_procedures">Submittal Procedures</SelectItem>
                    <SelectItem value="warranty_manuals">Warranty Manuals</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedFilter.status}
                  onValueChange={(value) => setSelectedFilter({ ...selectedFilter, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedFilter.type}
                  onValueChange={(value) => setSelectedFilter({ ...selectedFilter, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="procedure">Procedure</SelectItem>
                    <SelectItem value="protocol">Protocol</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="guideline">Guideline</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedFilter.rating}
                  onValueChange={(value) => setSelectedFilter({ ...selectedFilter, rating: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="4+">4+ Stars</SelectItem>
                    <SelectItem value="3-4">3-4 Stars</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                    setSelectedFilter({ status: "all", type: "all", rating: "all" })
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Document Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <Card
                key={doc.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedDocument(doc)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(doc.category)}
                      <div>
                        <h4 className="font-semibold text-sm line-clamp-1">{doc.title}</h4>
                        <p className="text-xs text-muted-foreground">v{doc.version}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {getTypeIcon(doc.type)}
                      <Badge className={`text-xs ${getStatusColor(doc.status)}`}>
                        {doc.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{doc.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Adherence Score</span>
                      <span className={`font-medium ${getAdherenceColor(doc.adherenceScore)}`}>
                        {doc.adherenceScore}%
                      </span>
                    </div>
                    <Progress value={doc.adherenceScore} className="h-1" />
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                      {renderStars(doc.rating)}
                      <span className="text-xs text-muted-foreground ml-1">({doc.rating})</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{doc.downloads} downloads</span>
                      <span>•</span>
                      <span>{doc.estimatedReadTime}</span>
                    </div>
                  </div>

                  {doc.aiSuggestions.length > 0 && (
                    <div className="mt-3 p-2 bg-amber-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Brain className="h-3 w-3 text-amber-600" />
                        <span className="text-xs text-amber-800">
                          {doc.aiSuggestions.length} AI suggestions available
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 mt-3">
                    {doc.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {doc.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{doc.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai-insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Powered Document Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualityDocuments.flatMap((doc) =>
                  doc.aiSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium text-sm">{suggestion.title}</span>
                          <Badge className={`text-xs ${getPriorityColor(suggestion.priority)}`}>
                            {suggestion.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {suggestion.type.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{suggestion.description}</p>
                      <div className="bg-blue-50 p-3 rounded-lg mb-2">
                        <p className="text-sm font-medium mb-1">Suggested Change:</p>
                        <p className="text-sm">{suggestion.suggestedChange}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Impact: {suggestion.impact}</span>
                        <span className="text-muted-foreground">
                          Confidence: {suggestion.confidence}% • Source: {suggestion.source}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          Review
                        </Button>
                        <Button size="sm" variant="outline">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Implement
                        </Button>
                        <Button size="sm" variant="outline">
                          <XCircle className="h-3 w-3 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Adherence Tracking Tab */}
        <TabsContent value="adherence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Program Adherence Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adherenceIssues.map((issue) => (
                  <div key={issue.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="font-medium text-sm">{issue.documentTitle}</span>
                        <Badge className={`text-xs ${getSeverityColor(issue.severity)}`}>
                          {issue.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {issue.issueType.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-muted-foreground">Project: {issue.projectName}</span>
                      <span className="text-muted-foreground">
                        Reported by: {issue.reportedBy} • {formatDate(issue.reportedDate)}
                      </span>
                    </div>
                    {issue.resolution && (
                      <div className="bg-green-50 p-3 rounded-lg mb-2">
                        <p className="text-sm font-medium mb-1">Resolution:</p>
                        <p className="text-sm">{issue.resolution}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      {issue.status !== "resolved" && (
                        <Button size="sm" variant="outline">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approval Workflow Tab */}
        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Workflow className="h-5 w-5" />
                Document Approval Workflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualityDocuments
                  .filter((doc) => doc.status === "under_review" || doc.status === "draft")
                  .map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(doc.type)}
                          <span className="font-medium text-sm">{doc.title}</span>
                          <Badge className={`text-xs ${getStatusColor(doc.status)}`}>
                            {doc.status.replace("_", " ").toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">v{doc.version}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="text-muted-foreground">Author: {doc.author}</span>
                        <span className="text-muted-foreground">Last Updated: {formatDate(doc.lastUpdated)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          Review
                        </Button>
                        <Button size="sm" variant="outline">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline">
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Comment
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Document Detail Modal */}
      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedDocument && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getCategoryIcon(selectedDocument.category)}
                  {selectedDocument.title}
                  <Badge className={`ml-2 ${getStatusColor(selectedDocument.status)}`}>
                    {selectedDocument.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="ai-suggestions">
                    AI Suggestions ({selectedDocument.aiSuggestions.length})
                  </TabsTrigger>
                  <TabsTrigger value="revisions">Revisions</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Document ID</Label>
                      <p className="text-sm">{selectedDocument.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Version</Label>
                      <p className="text-sm">{selectedDocument.version}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Category</Label>
                      <p className="text-sm">{selectedDocument.category.replace("_", " ")}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Type</Label>
                      <p className="text-sm">{selectedDocument.type}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Author</Label>
                      <p className="text-sm">{selectedDocument.author}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Last Updated</Label>
                      <p className="text-sm">{formatDate(selectedDocument.lastUpdated)}</p>
                    </div>
                    {selectedDocument.approvedBy && (
                      <div>
                        <Label className="text-sm font-medium">Approved By</Label>
                        <p className="text-sm">{selectedDocument.approvedBy}</p>
                      </div>
                    )}
                    {selectedDocument.approvedDate && (
                      <div>
                        <Label className="text-sm font-medium">Approved Date</Label>
                        <p className="text-sm">{formatDate(selectedDocument.approvedDate)}</p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm mt-1">{selectedDocument.description}</p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">File Size</Label>
                      <p className="text-sm">{selectedDocument.fileSize}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Pages</Label>
                      <p className="text-sm">{selectedDocument.pages}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Read Time</Label>
                      <p className="text-sm">{selectedDocument.estimatedReadTime}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium">Adherence Score</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={selectedDocument.adherenceScore} className="flex-1" />
                      <span className={`text-sm font-medium ${getAdherenceColor(selectedDocument.adherenceScore)}`}>
                        {selectedDocument.adherenceScore}%
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {selectedDocument.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="ai-suggestions">
                  <div className="space-y-4">
                    {selectedDocument.aiSuggestions.map((suggestion) => (
                      <div key={suggestion.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium text-sm">{suggestion.title}</span>
                            <Badge className={`text-xs ${getPriorityColor(suggestion.priority)}`}>
                              {suggestion.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {suggestion.type.replace("_", " ").toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{suggestion.description}</p>
                        <div className="bg-blue-50 p-3 rounded-lg mb-2">
                          <p className="text-sm font-medium mb-1">Suggested Change:</p>
                          <p className="text-sm">{suggestion.suggestedChange}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-muted-foreground">Impact: {suggestion.impact}</span>
                          <span className="text-muted-foreground">
                            Confidence: {suggestion.confidence}% • Source: {suggestion.source}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Implement
                          </Button>
                          <Button size="sm" variant="outline">
                            <XCircle className="h-3 w-3 mr-1" />
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="revisions">
                  <div className="space-y-4">
                    {selectedDocument.revisionHistory.map((revision) => (
                      <div key={revision.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <History className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">Version {revision.version}</span>
                            {revision.approved && (
                              <Badge className="text-xs bg-green-100 text-green-800">Approved</Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">{formatDate(revision.date)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{revision.changes}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Author: {revision.author}</span>
                          {revision.approvedBy && (
                            <span className="text-muted-foreground">Approved by: {revision.approvedBy}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="comments">
                  <div className="space-y-4">
                    {selectedDocument.comments.map((comment) => (
                      <div key={comment.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="text-sm font-medium">{comment.author}</span>
                            {comment.isInternal && (
                              <Badge variant="secondary" className="text-xs">
                                Internal
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.message}</p>
                        {comment.resolved && (
                          <Badge className="text-xs bg-green-100 text-green-800 mt-2">Resolved</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="attachments">
                  <div className="space-y-4">
                    {selectedDocument.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Paperclip className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{attachment.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {attachment.size} • {attachment.type} • Uploaded by {attachment.uploadedBy}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
