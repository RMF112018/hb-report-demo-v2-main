/**
 * @fileoverview Safety Programs Library Component
 * @module SafetyProgramsLibrary
 * @version 2.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Enhanced library component for managing safety programs with AI-powered recommendations,
 * compliance checking, review workflows, and publish capabilities
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Progress } from "../ui/progress"
import { Checkbox } from "../ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { toast } from "sonner"
import {
  BookOpen,
  Play,
  Download,
  Upload,
  Eye,
  Edit,
  Plus,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Award,
  Video,
  FileText,
  Headphones,
  Monitor,
  Presentation,
  GraduationCap,
  Star,
  Brain,
  AlertTriangle,
  Shield,
  TrendingUp,
  History,
  ChevronRight,
  ChevronDown,
  X,
  Check,
  Settings,
  UserCheck,
  AlertCircle,
  RotateCcw,
  Send,
  Archive,
  Lightbulb,
  Zap,
  Target,
  Flag,
  Link,
  Paperclip,
  MessageSquare,
  GitBranch,
  ExternalLink,
} from "lucide-react"

// Existing interfaces
interface SafetyProgram {
  id: string
  title: string
  category: string
  description: string
  duration: number // in minutes
  format: "Video" | "Interactive" | "Document" | "Presentation" | "Assessment"
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  completionRate: number
  enrollments: number
  rating: number
  lastUpdated: string
  requirements: string[]
  isRequired: boolean
  certificationOffered: boolean
  validityPeriod?: number // in months
}

interface TrainingSession {
  id: string
  programId: string
  programTitle: string
  instructor: string
  scheduledDate: string
  duration: number
  location: string
  maxAttendees: number
  currentAttendees: number
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled"
  materials: string[]
}

interface UserProgress {
  id: string
  userId: string
  userName: string
  programId: string
  programTitle: string
  progress: number
  startDate: string
  completionDate?: string
  status: "Not Started" | "In Progress" | "Completed" | "Expired"
  score?: number
  certificateUrl?: string
}

// New enhanced interfaces for Review + Publish functionality
interface SafetyDocument {
  id: string
  title: string
  type: "Policy" | "Procedure" | "Program" | "Training Material" | "Form" | "Checklist"
  category: string
  version: string
  status: "Draft" | "Under Review" | "Approved" | "Published" | "Archived" | "Needs Update"
  description: string
  filePath: string
  fileSize: number
  uploadDate: string
  lastModified: string
  lastEditor: string
  reviewDueDate: string
  nextReviewDate: string
  reviewHistory: ReviewRecord[]
  compliance: ComplianceCheck
  aiRecommendations: AIRecommendation[]
  tags: string[]
  attachments: string[]
  isRequired: boolean
  effectiveDate: string
  expiryDate?: string
}

interface ReviewRecord {
  id: string
  reviewerId: string
  reviewerName: string
  reviewDate: string
  status: "Pending" | "Approved" | "Rejected" | "Needs Changes"
  comments: string
  changes: ChangeRecord[]
}

interface ChangeRecord {
  id: string
  type: "Addition" | "Deletion" | "Modification" | "Format Change"
  section: string
  oldContent: string
  newContent: string
  reason: string
  timestamp: string
  author: string
}

interface ComplianceCheck {
  oshaCompliant: boolean
  ansiCompliant: boolean
  localCodeCompliant: boolean
  lastChecked: string
  issues: ComplianceIssue[]
  score: number
}

interface ComplianceIssue {
  id: string
  type: "OSHA" | "ANSI" | "Local Code" | "Industry Standard"
  severity: "Critical" | "High" | "Medium" | "Low"
  section: string
  description: string
  recommendation: string
  regulation: string
  status: "Open" | "In Progress" | "Resolved"
}

interface AIRecommendation {
  id: string
  type: "Content Update" | "Compliance Gap" | "Best Practice" | "Technology Update" | "Industry Trend"
  priority: "Critical" | "High" | "Medium" | "Low"
  title: string
  description: string
  suggestedChanges: string[]
  reasoning: string
  confidence: number
  sources: string[]
  estimatedEffort: string
  potentialImpact: string
  status: "New" | "Under Review" | "Accepted" | "Rejected" | "Implemented"
}

interface WorkflowStep {
  id: string
  name: string
  assignedTo: string[]
  status: "Pending" | "In Progress" | "Completed" | "Skipped"
  completedBy?: string
  completedDate?: string
  comments?: string
  required: boolean
}

export const SafetyProgramsLibrary: React.FC = () => {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("documents")
  const [selectedDocument, setSelectedDocument] = useState<SafetyDocument | null>(null)
  const [showPDFPreview, setShowPDFPreview] = useState(false)
  const [showWorkflow, setShowWorkflow] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [showAIRecommendations, setShowAIRecommendations] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock safety documents data
  const safetyDocuments: SafetyDocument[] = [
    {
      id: "SD-001",
      title: "Fall Protection Program",
      type: "Program",
      category: "Fall Protection",
      version: "2.1",
      status: "Published",
      description: "Comprehensive fall protection program covering equipment, procedures, and training requirements",
      filePath: "/documents/fall-protection-program-v2.1.pdf",
      fileSize: 2500000,
      uploadDate: "2024-01-10",
      lastModified: "2024-01-15",
      lastEditor: "Sarah Johnson",
      reviewDueDate: "2024-03-15",
      nextReviewDate: "2024-09-15",
      reviewHistory: [],
      compliance: {
        oshaCompliant: true,
        ansiCompliant: true,
        localCodeCompliant: false,
        lastChecked: "2024-01-20",
        issues: [
          {
            id: "CI-001",
            type: "Local Code",
            severity: "Medium",
            section: "Section 4.2",
            description: "Local building code requires additional anchor point specifications",
            recommendation: "Update anchor point requirements to include local specifications",
            regulation: "Local Building Code 12.5.3",
            status: "Open",
          },
        ],
        score: 85,
      },
      aiRecommendations: [
        {
          id: "AI-001",
          type: "Technology Update",
          priority: "Medium",
          title: "Smart Harness Technology Integration",
          description:
            "Consider updating program to include new IoT-enabled safety harnesses with real-time monitoring",
          suggestedChanges: [
            "Add section on smart harness technology",
            "Update equipment specifications",
            "Include training requirements for new technology",
          ],
          reasoning: "Industry trend towards IoT safety equipment with proven reduction in incidents",
          confidence: 78,
          sources: ["OSHA Tech Update 2024", "NIOSH Research Report"],
          estimatedEffort: "2-3 days",
          potentialImpact: "15% reduction in fall incidents",
          status: "New",
        },
      ],
      tags: ["OSHA", "Fall Protection", "Training", "Equipment"],
      attachments: ["fall-protection-checklist.pdf", "equipment-inspection-form.pdf"],
      isRequired: true,
      effectiveDate: "2024-01-01",
      expiryDate: "2024-12-31",
    },
    {
      id: "SD-002",
      title: "Hazard Communication Program",
      type: "Program",
      category: "Chemical Safety",
      version: "1.8",
      status: "Under Review",
      description: "Chemical hazard communication program including SDS management and labeling requirements",
      filePath: "/documents/hazcom-program-v1.8.pdf",
      fileSize: 1800000,
      uploadDate: "2024-01-05",
      lastModified: "2024-01-18",
      lastEditor: "Mike Wilson",
      reviewDueDate: "2024-02-05",
      nextReviewDate: "2024-08-05",
      reviewHistory: [
        {
          id: "RR-001",
          reviewerId: "R-001",
          reviewerName: "Lisa Davis",
          reviewDate: "2024-01-18",
          status: "Needs Changes",
          comments: "Update required for new GHS labeling requirements",
          changes: [],
        },
      ],
      compliance: {
        oshaCompliant: false,
        ansiCompliant: true,
        localCodeCompliant: true,
        lastChecked: "2024-01-18",
        issues: [
          {
            id: "CI-002",
            type: "OSHA",
            severity: "High",
            section: "Section 3.1",
            description: "GHS labeling requirements updated in OSHA 29 CFR 1910.1200",
            recommendation: "Update labeling section to reflect current GHS Rev. 8 requirements",
            regulation: "OSHA 29 CFR 1910.1200",
            status: "In Progress",
          },
        ],
        score: 72,
      },
      aiRecommendations: [
        {
          id: "AI-002",
          type: "Compliance Gap",
          priority: "High",
          title: "GHS Rev. 8 Compliance Update",
          description: "Program needs updates for latest GHS revision requirements",
          suggestedChanges: [
            "Update Section 3.1 with GHS Rev. 8 labeling requirements",
            "Revise training materials for new pictograms",
            "Update SDS template references",
          ],
          reasoning: "OSHA enforcement of GHS Rev. 8 begins March 2024",
          confidence: 95,
          sources: ["OSHA Final Rule", "GHS Rev. 8 Standard"],
          estimatedEffort: "1-2 weeks",
          potentialImpact: "Ensures regulatory compliance",
          status: "Accepted",
        },
      ],
      tags: ["OSHA", "GHS", "Chemical Safety", "Training"],
      attachments: ["sds-template.pdf", "chemical-inventory.xlsx"],
      isRequired: true,
      effectiveDate: "2024-01-01",
    },
    {
      id: "SD-003",
      title: "Lockout/Tagout Procedures",
      type: "Procedure",
      category: "Energy Control",
      version: "3.2",
      status: "Needs Update",
      description: "Energy control procedures for equipment maintenance and servicing",
      filePath: "/documents/loto-procedures-v3.2.pdf",
      fileSize: 3200000,
      uploadDate: "2023-11-15",
      lastModified: "2023-12-20",
      lastEditor: "Robert Brown",
      reviewDueDate: "2024-01-15",
      nextReviewDate: "2024-07-15",
      reviewHistory: [],
      compliance: {
        oshaCompliant: true,
        ansiCompliant: false,
        localCodeCompliant: true,
        lastChecked: "2024-01-10",
        issues: [
          {
            id: "CI-003",
            type: "ANSI",
            severity: "Medium",
            section: "Section 2.3",
            description: "ANSI Z244.1 requires additional verification steps",
            recommendation: "Add ANSI-compliant verification procedures",
            regulation: "ANSI Z244.1-2016",
            status: "Open",
          },
        ],
        score: 78,
      },
      aiRecommendations: [
        {
          id: "AI-003",
          type: "Best Practice",
          priority: "Medium",
          title: "Digital LOTO Management",
          description: "Consider implementing digital LOTO tracking system",
          suggestedChanges: [
            "Add digital permit tracking",
            "Include QR code verification",
            "Implement real-time monitoring",
          ],
          reasoning: "Digital systems show 40% improvement in compliance rates",
          confidence: 82,
          sources: ["Industry Best Practices Study", "NIOSH Research"],
          estimatedEffort: "3-4 weeks",
          potentialImpact: "Improved compliance tracking",
          status: "New",
        },
      ],
      tags: ["OSHA", "LOTO", "Energy Control", "Maintenance"],
      attachments: ["loto-device-list.pdf", "energy-source-inventory.xlsx"],
      isRequired: true,
      effectiveDate: "2023-11-01",
    },
    {
      id: "SD-004",
      title: "Respiratory Protection Program",
      type: "Program",
      category: "PPE",
      version: "2.5",
      status: "Draft",
      description: "Comprehensive respiratory protection program including fit testing and medical evaluations",
      filePath: "/documents/respiratory-program-v2.5.pdf",
      fileSize: 2100000,
      uploadDate: "2024-01-20",
      lastModified: "2024-01-22",
      lastEditor: "Jennifer Lee",
      reviewDueDate: "2024-02-20",
      nextReviewDate: "2024-08-20",
      reviewHistory: [],
      compliance: {
        oshaCompliant: true,
        ansiCompliant: true,
        localCodeCompliant: true,
        lastChecked: "2024-01-22",
        issues: [],
        score: 95,
      },
      aiRecommendations: [
        {
          id: "AI-004",
          type: "Content Update",
          priority: "Low",
          title: "Powered Air-Purifying Respirator Section",
          description: "Consider adding section on PAPR technology advances",
          suggestedChanges: [
            "Add PAPR selection criteria",
            "Include battery life considerations",
            "Update maintenance schedules",
          ],
          reasoning: "Increased PAPR usage in construction industry",
          confidence: 68,
          sources: ["Industry Survey 2024"],
          estimatedEffort: "1 week",
          potentialImpact: "Enhanced worker protection options",
          status: "New",
        },
      ],
      tags: ["OSHA", "Respiratory", "PPE", "Medical"],
      attachments: ["fit-test-form.pdf", "medical-eval-form.pdf"],
      isRequired: true,
      effectiveDate: "2024-02-01",
    },
    {
      id: "SD-005",
      title: "Emergency Action Plan",
      type: "Program",
      category: "Emergency Response",
      version: "4.1",
      status: "Approved",
      description: "Emergency response procedures for workplace incidents and evacuations",
      filePath: "/documents/emergency-action-plan-v4.1.pdf",
      fileSize: 4500000,
      uploadDate: "2024-01-12",
      lastModified: "2024-01-16",
      lastEditor: "Amanda Taylor",
      reviewDueDate: "2024-04-12",
      nextReviewDate: "2024-10-12",
      reviewHistory: [
        {
          id: "RR-002",
          reviewerId: "R-002",
          reviewerName: "David Martinez",
          reviewDate: "2024-01-16",
          status: "Approved",
          comments: "Comprehensive plan meets all requirements",
          changes: [],
        },
      ],
      compliance: {
        oshaCompliant: true,
        ansiCompliant: true,
        localCodeCompliant: true,
        lastChecked: "2024-01-16",
        issues: [],
        score: 98,
      },
      aiRecommendations: [],
      tags: ["OSHA", "Emergency", "Evacuation", "Response"],
      attachments: ["evacuation-routes.pdf", "emergency-contacts.pdf"],
      isRequired: true,
      effectiveDate: "2024-01-01",
    },
  ]

  // Mock training programs data (existing)
  const safetyPrograms: SafetyProgram[] = [
    {
      id: "SP-001",
      title: "OSHA 30-Hour Construction Safety",
      category: "General Safety",
      description: "Comprehensive 30-hour OSHA training for construction workers and supervisors",
      duration: 1800, // 30 hours
      format: "Interactive",
      difficulty: "Intermediate",
      completionRate: 85,
      enrollments: 45,
      rating: 4.8,
      lastUpdated: "2024-01-10",
      requirements: ["Basic construction experience", "Supervisor approval"],
      isRequired: true,
      certificationOffered: true,
      validityPeriod: 60,
    },
    {
      id: "SP-002",
      title: "Fall Protection Training",
      category: "Fall Protection",
      description: "Essential training on fall protection systems, equipment, and procedures",
      duration: 240, // 4 hours
      format: "Video",
      difficulty: "Beginner",
      completionRate: 92,
      enrollments: 78,
      rating: 4.9,
      lastUpdated: "2024-01-05",
      requirements: ["None"],
      isRequired: true,
      certificationOffered: true,
      validityPeriod: 24,
    },
  ]

  // Existing training sessions and user progress data
  const trainingSessions: TrainingSession[] = []
  const userProgress: UserProgress[] = []

  // Filter and search functionality
  const filteredDocuments = useMemo(() => {
    return safetyDocuments.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = filterStatus === "all" || doc.status === filterStatus
      const matchesCategory = filterCategory === "all" || doc.category === filterCategory

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [searchTerm, filterStatus, filterCategory])

  // Helper functions with theme compatibility
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800"
      case "Approved":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-800"
      case "Draft":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950 dark:text-gray-200 dark:border-gray-800"
      case "Needs Update":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800"
      case "Archived":
        return "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-950 dark:text-gray-400 dark:border-gray-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950 dark:text-gray-200 dark:border-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950 dark:text-gray-200 dark:border-gray-800"
    }
  }

  const getComplianceColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400"
    if (score >= 80) return "text-yellow-600 dark:text-yellow-400"
    if (score >= 70) return "text-orange-600 dark:text-orange-400"
    return "text-red-600 dark:text-red-400"
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "Video":
        return <Video className="h-4 w-4 text-muted-foreground" />
      case "Interactive":
        return <Monitor className="h-4 w-4 text-muted-foreground" />
      case "Document":
        return <FileText className="h-4 w-4 text-muted-foreground" />
      case "Presentation":
        return <Presentation className="h-4 w-4 text-muted-foreground" />
      case "Assessment":
        return <GraduationCap className="h-4 w-4 text-muted-foreground" />
      default:
        return <BookOpen className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950 dark:text-gray-200 dark:border-gray-800"
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
    }
    return `${mins}m`
  }

  // Action handlers
  const handleDocumentAction = (action: string, document: SafetyDocument) => {
    switch (action) {
      case "preview":
        setSelectedDocument(document)
        setShowPDFPreview(true)
        break
      case "review":
        setSelectedDocument(document)
        setShowWorkflow(true)
        break
      case "publish":
        toast.success(`${document.title} published successfully`)
        break
      case "download":
        toast.success(`Downloading ${document.title}`)
        break
      default:
        console.log(`Action ${action} for document ${document.id}`)
    }
  }

  const handleApplyAIRecommendation = (recommendation: AIRecommendation) => {
    toast.success("AI recommendation applied to document")
    // Implementation would update the document with the recommendation
  }

  const handleAcceptChanges = (documentId: string, changes: ChangeRecord[]) => {
    toast.success("Changes accepted and applied")
    // Implementation would apply the changes to the document
  }

  const handleRejectChanges = (documentId: string, changes: ChangeRecord[]) => {
    toast.success("Changes rejected")
    // Implementation would reject the proposed changes
  }

  // Render functions
  const renderDocumentsTab = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search documents, descriptions, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Needs Update">Needs Update</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Fall Protection">Fall Protection</SelectItem>
              <SelectItem value="Chemical Safety">Chemical Safety</SelectItem>
              <SelectItem value="Energy Control">Energy Control</SelectItem>
              <SelectItem value="PPE">PPE</SelectItem>
              <SelectItem value="Emergency Response">Emergency Response</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* AI Recommendations Panel */}
      {showAIRecommendations && (
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                AI-Enhanced Document Recommendations
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAIRecommendations(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDocuments
                .filter((doc) => doc.aiRecommendations.length > 0)
                .slice(0, 3)
                .map((document) =>
                  document.aiRecommendations.map((rec) => (
                    <div key={rec.id} className="bg-card border-border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Lightbulb className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                            <h4 className="font-semibold text-foreground">{rec.title}</h4>
                            <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                              {rec.priority}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200"
                            >
                              {rec.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            For: <span className="font-medium text-foreground">{document.title}</span>
                          </p>
                          <p className="text-sm text-foreground mb-3">{rec.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-foreground">Suggested Changes:</span>
                              <ul className="mt-1 space-y-1">
                                {rec.suggestedChanges.slice(0, 2).map((change, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                                    <span className="text-foreground">{change}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Confidence:</span>
                                <Progress value={rec.confidence} className="w-20 h-2" />
                                <span className="text-xs font-medium text-foreground">{rec.confidence}%</span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Impact: <span className="font-medium text-foreground">{rec.potentialImpact}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="outline" size="sm" onClick={() => handleApplyAIRecommendation(rec)}>
                            <Check className="h-4 w-4 mr-1" />
                            Apply
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Safety Documents Library
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Document
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Review Due</TableHead>
                  <TableHead>AI Insights</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-foreground">{document.title}</div>
                        <div className="text-sm text-muted-foreground">
                          v{document.version} • {formatFileSize(document.fileSize)}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {document.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200"
                      >
                        {document.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(document.status)}>
                        {document.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${getComplianceColor(document.compliance.score)}`}>
                            {document.compliance.score}%
                          </span>
                          <Progress value={document.compliance.score} className="w-16 h-2" />
                        </div>
                        <div className="flex gap-1">
                          {document.compliance.oshaCompliant && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
                            >
                              OSHA
                            </Badge>
                          )}
                          {document.compliance.ansiCompliant && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
                            >
                              ANSI
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm text-foreground">{document.lastModified}</div>
                        <div className="text-xs text-muted-foreground">by {document.lastEditor}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-foreground">{document.reviewDueDate}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {document.aiRecommendations.length > 0 && (
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200"
                          >
                            <Brain className="h-3 w-3 mr-1" />
                            {document.aiRecommendations.length}
                          </Badge>
                        )}
                        {document.compliance.issues.length > 0 && (
                          <Badge
                            variant="outline"
                            className="bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200"
                          >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {document.compliance.issues.length}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleDocumentAction("preview", document)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDocumentAction("review", document)}>
                          <UserCheck className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDocumentAction("download", document)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        {(document.status === "Approved" || document.status === "Under Review") && (
                          <Button variant="ghost" size="sm" onClick={() => handleDocumentAction("publish", document)}>
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Existing render functions (simplified for space)
  const renderProgramsTab = () => (
    <div className="space-y-6">
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground">Training Programs</h3>
        <p className="text-muted-foreground">Training program management interface</p>
      </div>
    </div>
  )

  const renderScheduleTab = () => (
    <div className="space-y-6">
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground">Training Schedule</h3>
        <p className="text-muted-foreground">Schedule management interface</p>
      </div>
    </div>
  )

  const renderProgressTab = () => (
    <div className="space-y-6">
      <div className="text-center py-12">
        <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground">Progress Tracking</h3>
        <p className="text-muted-foreground">Progress tracking interface</p>
      </div>
    </div>
  )

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
          <h3 className="text-lg font-semibold text-foreground">Safety Programs Library</h3>
          <p className="text-sm text-muted-foreground">
            Review, publish, and manage safety documents with AI-enhanced recommendations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" className="bg-[#FA4616] hover:bg-[#FA4616]/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Document
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="programs">Training Programs</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>
        <TabsContent value="documents" className="space-y-4">
          {renderDocumentsTab()}
        </TabsContent>
        <TabsContent value="programs" className="space-y-4">
          {renderProgramsTab()}
        </TabsContent>
        <TabsContent value="schedule" className="space-y-4">
          {renderScheduleTab()}
        </TabsContent>
        <TabsContent value="progress" className="space-y-4">
          {renderProgressTab()}
        </TabsContent>
      </Tabs>

      {/* PDF Preview Dialog */}
      <Dialog open={showPDFPreview} onOpenChange={setShowPDFPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedDocument ? `Preview: ${selectedDocument.title}` : "Document Preview"}</DialogTitle>
          </DialogHeader>
          <div className="h-96 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">PDF preview would be displayed here</p>
              <p className="text-sm text-muted-foreground mt-2">Integration with PDF.js or similar viewer</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Workflow Dialog */}
      <Dialog open={showWorkflow} onOpenChange={setShowWorkflow}>
        <DialogContent className="max-w-6xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedDocument ? `Review Workflow: ${selectedDocument.title}` : "Document Review"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-center py-8">
              <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Review workflow interface would be displayed here</p>
              <p className="text-sm text-muted-foreground mt-2">
                Including accept/reject workflow, comments, and change tracking
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
