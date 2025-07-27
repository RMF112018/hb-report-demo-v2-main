/**
 * QC Review Workflow - HB Report Demo v3.0.0
 *
 * Comprehensive review and approval workflow for QC programs
 * Features:
 * - Multi-stage review process (technical, compliance, executive)
 * - Reviewer assignment and notification system
 * - Approval tracking and status management
 * - Publishing workflow with distribution controls
 * - Comment and revision management
 * - Escalation and deadline monitoring
 */

"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Send,
  Edit,
  Eye,
  MessageSquare,
  UserCheck,
  FileText,
  Shield,
  Award,
  Bell,
  Calendar,
  Mail,
  Phone,
  ExternalLink,
  Download,
  Upload,
  Share2,
  Settings,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  RotateCcw,
  CheckSquare,
  X,
  ArrowRight,
  Flag,
  Target,
  Zap,
  Globe,
  Lock,
  Unlock,
  Archive,
  RefreshCw,
  BarChart3,
} from "lucide-react"

// Review Workflow Interfaces
interface ReviewStage {
  id: string
  name: string
  description: string
  order: number
  reviewType: "technical" | "compliance" | "executive" | "stakeholder"
  required: boolean
  parallelReview: boolean
  deadline: number // days from stage start
  escalationRules: EscalationRule[]
  completionCriteria: string[]
}

interface EscalationRule {
  id: string
  triggerCondition: "deadline_missed" | "no_response" | "rejection" | "custom"
  delayDays: number
  escalateTo: string[]
  notificationMethod: "email" | "slack" | "teams" | "phone"
  automaticAction?: "assign_backup" | "auto_approve" | "skip_stage"
}

interface ReviewAssignment {
  id: string
  reviewStageId: string
  reviewerId: string
  reviewerName: string
  reviewerRole: string
  reviewerEmail: string
  assignedDate: string
  dueDate: string
  status: "pending" | "in_progress" | "completed" | "overdue" | "escalated"
  priority: "low" | "medium" | "high" | "urgent"
  estimatedHours: number
  actualHours?: number
  completedDate?: string
  lastActivityDate?: string
}

interface ReviewSubmission {
  id: string
  assignmentId: string
  reviewerId: string
  submittedDate: string
  decision: "approved" | "approved_with_conditions" | "rejected" | "needs_revision"
  overallRating: number // 1-5 scale
  comments: ReviewComment[]
  attachments: ReviewAttachment[]
  conditions: string[]
  recommendations: string[]
  nextSteps: string[]
  signoffRequired: boolean
  digitalSignature?: string
}

interface ReviewComment {
  id: string
  section: string
  lineNumber?: number
  comment: string
  severity: "info" | "warning" | "error" | "critical"
  category: "technical" | "compliance" | "editorial" | "formatting"
  status: "open" | "addressed" | "resolved" | "deferred"
  createdBy: string
  createdDate: string
  responses: CommentResponse[]
}

interface CommentResponse {
  id: string
  responseText: string
  createdBy: string
  createdDate: string
  actionTaken?: string
}

interface ReviewAttachment {
  id: string
  filename: string
  fileType: string
  fileSize: number
  uploadedBy: string
  uploadedDate: string
  description: string
  category: "reference" | "markup" | "revision" | "evidence"
}

interface PublishingWorkflow {
  id: string
  qcProgramId: string
  initiatedBy: string
  initiatedDate: string
  status: "pending" | "in_progress" | "approved" | "published" | "rejected"
  publishingSettings: PublishingSettings
  approvalTrail: PublishingApproval[]
  distributionList: DistributionTarget[]
  scheduledPublishDate?: string
  actualPublishDate?: string
  revisionHistory: PublishingRevision[]
}

interface PublishingSettings {
  accessLevel: "project_only" | "company_wide" | "public" | "restricted"
  restrictedGroups?: string[]
  effectiveDate: string
  expirationDate?: string
  notificationSettings: {
    email: boolean
    slack: boolean
    teams: boolean
    inApp: boolean
  }
  distributionChannels: string[]
  requiresTraining: boolean
  versioning: {
    majorVersion: number
    minorVersion: number
    patchVersion: number
    versionNotes: string
  }
}

interface PublishingApproval {
  id: string
  approverName: string
  approverRole: string
  approvalDate: string
  approvalType: "content" | "distribution" | "access" | "final"
  status: "approved" | "rejected" | "pending"
  comments: string
  conditions: string[]
}

interface DistributionTarget {
  id: string
  targetType: "individual" | "team" | "role" | "project" | "company"
  targetId: string
  targetName: string
  distributionMethod: "email" | "portal" | "download" | "print"
  priority: "high" | "medium" | "low"
  requiresAcknowledgment: boolean
  acknowledgedDate?: string
  deliveryStatus: "pending" | "sent" | "delivered" | "failed" | "acknowledged"
}

interface PublishingRevision {
  id: string
  revisionNumber: string
  revisionDate: string
  revisedBy: string
  revisionReason: string
  changesDescription: string
  impactedSections: string[]
  requiresReReview: boolean
  reReviewers: string[]
}

interface QCReviewWorkflowProps {
  qcProgramId: string
  qcProgram: any // QC Program object
  onReviewSubmit: (submission: ReviewSubmission) => void
  onWorkflowComplete: (workflow: PublishingWorkflow) => void
  onStatusChange: (status: string) => void
}

export const QCReviewWorkflow: React.FC<QCReviewWorkflowProps> = ({
  qcProgramId,
  qcProgram,
  onReviewSubmit,
  onWorkflowComplete,
  onStatusChange,
}) => {
  // State Management
  const [reviewStages, setReviewStages] = useState<ReviewStage[]>([])
  const [reviewAssignments, setReviewAssignments] = useState<ReviewAssignment[]>([])
  const [reviewSubmissions, setReviewSubmissions] = useState<ReviewSubmission[]>([])
  const [publishingWorkflow, setPublishingWorkflow] = useState<PublishingWorkflow | null>(null)
  const [currentStage, setCurrentStage] = useState<ReviewStage | null>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "assignments" | "reviews" | "comments" | "publishing">(
    "overview"
  )
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<ReviewAssignment | null>(null)
  const [reviewFormData, setReviewFormData] = useState({
    decision: "",
    overallRating: 5,
    comments: "",
    conditions: "",
    recommendations: "",
    nextSteps: "",
  })

  // Load workflow data
  useEffect(() => {
    loadReviewStages()
    loadReviewAssignments()
    loadReviewSubmissions()
    loadPublishingWorkflow()
  }, [qcProgramId])

  const loadReviewStages = async () => {
    // Mock review stages data
    const mockStages: ReviewStage[] = [
      {
        id: "STAGE-001",
        name: "Technical Review",
        description: "Technical accuracy and completeness review",
        order: 1,
        reviewType: "technical",
        required: true,
        parallelReview: false,
        deadline: 3,
        escalationRules: [
          {
            id: "ESC-001",
            triggerCondition: "deadline_missed",
            delayDays: 1,
            escalateTo: ["technical.lead@company.com"],
            notificationMethod: "email",
            automaticAction: "assign_backup",
          },
        ],
        completionCriteria: [
          "All technical requirements validated",
          "Compliance with industry standards verified",
          "Testing protocols approved",
        ],
      },
      {
        id: "STAGE-002",
        name: "Compliance Review",
        description: "Regulatory and code compliance verification",
        order: 2,
        reviewType: "compliance",
        required: true,
        parallelReview: false,
        deadline: 2,
        escalationRules: [
          {
            id: "ESC-002",
            triggerCondition: "deadline_missed",
            delayDays: 1,
            escalateTo: ["compliance.manager@company.com"],
            notificationMethod: "email",
          },
        ],
        completionCriteria: [
          "Building code compliance verified",
          "Safety requirements met",
          "Documentation standards followed",
        ],
      },
      {
        id: "STAGE-003",
        name: "Executive Approval",
        description: "Final executive sign-off",
        order: 3,
        reviewType: "executive",
        required: true,
        parallelReview: false,
        deadline: 1,
        escalationRules: [],
        completionCriteria: [
          "Executive approval received",
          "Budget and resource allocation approved",
          "Publishing authorization granted",
        ],
      },
    ]

    setReviewStages(mockStages)
    setCurrentStage(mockStages[0])
  }

  const loadReviewAssignments = async () => {
    // Mock review assignments data
    const mockAssignments: ReviewAssignment[] = [
      {
        id: "ASSIGN-001",
        reviewStageId: "STAGE-001",
        reviewerId: "REV-001",
        reviewerName: "Sarah Johnson",
        reviewerRole: "Senior QC Engineer",
        reviewerEmail: "sarah.johnson@company.com",
        assignedDate: "2025-01-15",
        dueDate: "2025-01-18",
        status: "in_progress",
        priority: "high",
        estimatedHours: 8,
        actualHours: 6,
        lastActivityDate: "2025-01-16",
      },
      {
        id: "ASSIGN-002",
        reviewStageId: "STAGE-001",
        reviewerId: "REV-002",
        reviewerName: "Michael Chen",
        reviewerRole: "Technical Lead",
        reviewerEmail: "michael.chen@company.com",
        assignedDate: "2025-01-15",
        dueDate: "2025-01-18",
        status: "completed",
        priority: "high",
        estimatedHours: 6,
        actualHours: 5,
        completedDate: "2025-01-17",
        lastActivityDate: "2025-01-17",
      },
      {
        id: "ASSIGN-003",
        reviewStageId: "STAGE-002",
        reviewerId: "REV-003",
        reviewerName: "Jennifer Davis",
        reviewerRole: "Compliance Manager",
        reviewerEmail: "jennifer.davis@company.com",
        assignedDate: "2025-01-18",
        dueDate: "2025-01-20",
        status: "pending",
        priority: "medium",
        estimatedHours: 4,
      },
    ]

    setReviewAssignments(mockAssignments)
  }

  const loadReviewSubmissions = async () => {
    // Mock review submissions data
    const mockSubmissions: ReviewSubmission[] = [
      {
        id: "SUB-001",
        assignmentId: "ASSIGN-002",
        reviewerId: "REV-002",
        submittedDate: "2025-01-17",
        decision: "approved_with_conditions",
        overallRating: 4,
        comments: [
          {
            id: "COM-001",
            section: "Testing Protocols",
            lineNumber: 145,
            comment: "Consider adding ultrasonic testing for structural welds",
            severity: "warning",
            category: "technical",
            status: "open",
            createdBy: "Michael Chen",
            createdDate: "2025-01-17",
            responses: [],
          },
        ],
        attachments: [],
        conditions: [
          "Add ultrasonic testing requirements to structural welding procedures",
          "Update frequency of concrete testing per ACI standards",
        ],
        recommendations: [
          "Consider implementing digital inspection forms",
          "Add photo documentation requirements for all critical inspections",
        ],
        nextSteps: ["Revise testing protocols per comments", "Submit revised document for final approval"],
        signoffRequired: true,
        digitalSignature: "Michael Chen - 2025-01-17 14:30:00",
      },
    ]

    setReviewSubmissions(mockSubmissions)
  }

  const loadPublishingWorkflow = async () => {
    // Mock publishing workflow data
    const mockWorkflow: PublishingWorkflow = {
      id: "PUB-001",
      qcProgramId: qcProgramId,
      initiatedBy: "Quality Manager",
      initiatedDate: "2025-01-15",
      status: "in_progress",
      publishingSettings: {
        accessLevel: "project_only",
        effectiveDate: "2025-01-20",
        notificationSettings: {
          email: true,
          slack: true,
          teams: false,
          inApp: true,
        },
        distributionChannels: ["Project Portal", "QC Dashboard"],
        requiresTraining: false,
        versioning: {
          majorVersion: 1,
          minorVersion: 0,
          patchVersion: 0,
          versionNotes: "Initial release of QC program",
        },
      },
      approvalTrail: [],
      distributionList: [
        {
          id: "DIST-001",
          targetType: "team",
          targetId: "QC-TEAM",
          targetName: "Quality Control Team",
          distributionMethod: "portal",
          priority: "high",
          requiresAcknowledgment: true,
          deliveryStatus: "pending",
        },
        {
          id: "DIST-002",
          targetType: "role",
          targetId: "PROJECT-MANAGER",
          targetName: "Project Managers",
          distributionMethod: "email",
          priority: "medium",
          requiresAcknowledgment: false,
          deliveryStatus: "pending",
        },
      ],
      revisionHistory: [],
    }

    setPublishingWorkflow(mockWorkflow)
  }

  // Helper functions
  const getStageProgress = (stageId: string) => {
    const stageAssignments = reviewAssignments.filter((a) => a.reviewStageId === stageId)
    if (stageAssignments.length === 0) return 0

    const completedAssignments = stageAssignments.filter((a) => a.status === "completed")
    return (completedAssignments.length / stageAssignments.length) * 100
  }

  const getOverallProgress = () => {
    const totalStages = reviewStages.length
    const completedStages = reviewStages.filter((stage) => getStageProgress(stage.id) === 100)
    return (completedStages.length / totalStages) * 100
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "escalated":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4" />
      case "escalated":
        return <Flag className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleReviewSubmit = () => {
    if (!selectedAssignment) return

    const newSubmission: ReviewSubmission = {
      id: `SUB-${Date.now()}`,
      assignmentId: selectedAssignment.id,
      reviewerId: selectedAssignment.reviewerId,
      submittedDate: new Date().toISOString().split("T")[0],
      decision: reviewFormData.decision as any,
      overallRating: reviewFormData.overallRating,
      comments: [], // Would be populated from form
      attachments: [],
      conditions: reviewFormData.conditions ? [reviewFormData.conditions] : [],
      recommendations: reviewFormData.recommendations ? [reviewFormData.recommendations] : [],
      nextSteps: reviewFormData.nextSteps ? [reviewFormData.nextSteps] : [],
      signoffRequired: true,
    }

    setReviewSubmissions((prev) => [...prev, newSubmission])
    setShowReviewDialog(false)
    setSelectedAssignment(null)
    setReviewFormData({
      decision: "",
      overallRating: 5,
      comments: "",
      conditions: "",
      recommendations: "",
      nextSteps: "",
    })

    onReviewSubmit(newSubmission)
  }

  const handlePublish = () => {
    if (!publishingWorkflow) return

    const updatedWorkflow = {
      ...publishingWorkflow,
      status: "published" as const,
      actualPublishDate: new Date().toISOString().split("T")[0],
    }

    setPublishingWorkflow(updatedWorkflow)
    setShowPublishDialog(false)
    onWorkflowComplete(updatedWorkflow)
    onStatusChange("published")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Review Workflow
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage review assignments, approvals, and publishing for QC programs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowAssignDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Reviewer
          </Button>
          <Button size="sm" onClick={() => setShowPublishDialog(true)}>
            <Send className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Overall Progress</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{Math.round(getOverallProgress())}%</span>
                <Badge variant="outline">{reviewStages.length} Stages</Badge>
              </div>
              <Progress value={getOverallProgress()} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Active Reviewers</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {reviewAssignments.filter((a) => a.status === "in_progress").length}
                </span>
                <Badge variant="outline">{reviewAssignments.length} Total</Badge>
              </div>
              <div className="text-sm text-muted-foreground">Currently reviewing</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Completed Reviews</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {reviewAssignments.filter((a) => a.status === "completed").length}
                </span>
                <Badge variant="outline">Reviews</Badge>
              </div>
              <div className="text-sm text-muted-foreground">Finished assignments</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Overdue Items</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {reviewAssignments.filter((a) => a.status === "overdue").length}
                </span>
                <Badge variant="outline">Items</Badge>
              </div>
              <div className="text-sm text-muted-foreground">Require attention</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "assignments", label: "Assignments", icon: Users },
            { id: "reviews", label: "Reviews", icon: FileText },
            { id: "comments", label: "Comments", icon: MessageSquare },
            { id: "publishing", label: "Publishing", icon: Send },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {/* Review Stages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Review Stages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviewStages.map((stage, index) => (
                  <div key={stage.id} className="relative">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {getStageProgress(stage.id) === 100 ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{stage.name}</h4>
                            <Badge variant="outline">{stage.reviewType}</Badge>
                            {stage.required && (
                              <Badge variant="destructive" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{stage.deadline} days deadline</div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">{stage.description}</p>

                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Stage Progress</span>
                            <span>{Math.round(getStageProgress(stage.id))}%</span>
                          </div>
                          <Progress value={getStageProgress(stage.id)} className="h-2" />
                        </div>

                        {/* Stage Assignments */}
                        <div className="space-y-2">
                          {reviewAssignments
                            .filter((assignment) => assignment.reviewStageId === stage.id)
                            .map((assignment) => (
                              <div key={assignment.id} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{assignment.reviewerName}</span>
                                    <Badge variant="outline">{assignment.reviewerRole}</Badge>
                                    <Badge className={getStatusColor(assignment.status)}>
                                      {assignment.status.replace("_", " ")}
                                    </Badge>
                                    <Badge className={getPriorityColor(assignment.priority)}>
                                      {assignment.priority}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-muted-foreground">Due: {assignment.dueDate}</div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Connection line to next stage */}
                    {index < reviewStages.length - 1 && (
                      <div className="absolute left-4 top-12 w-0.5 h-8 bg-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "assignments" && (
        <div className="space-y-4">
          {reviewAssignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{assignment.reviewerName}</h4>
                      <p className="text-sm text-muted-foreground">{assignment.reviewerRole}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(assignment.status)}>
                      {getStatusIcon(assignment.status)}
                      {assignment.status.replace("_", " ")}
                    </Badge>
                    <Badge className={getPriorityColor(assignment.priority)}>{assignment.priority}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label className="text-xs">Assigned Date</Label>
                    <p className="text-sm">{assignment.assignedDate}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Due Date</Label>
                    <p className="text-sm">{assignment.dueDate}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Estimated Hours</Label>
                    <p className="text-sm">{assignment.estimatedHours}h</p>
                  </div>
                  <div>
                    <Label className="text-xs">Actual Hours</Label>
                    <p className="text-sm">{assignment.actualHours || 0}h</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{assignment.reviewerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAssignment(assignment)
                        setShowReviewDialog(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="space-y-4">
          {reviewSubmissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Review Submission
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        submission.decision === "approved"
                          ? "bg-green-100 text-green-800"
                          : submission.decision === "approved_with_conditions"
                          ? "bg-yellow-100 text-yellow-800"
                          : submission.decision === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {submission.decision.replace("_", " ")}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Award
                          key={i}
                          className={`h-4 w-4 ${i < submission.overallRating ? "text-yellow-500" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Reviewer</Label>
                      <p className="text-sm">{submission.reviewerId}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Submitted</Label>
                      <p className="text-sm">{submission.submittedDate}</p>
                    </div>
                  </div>

                  {submission.conditions.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Conditions</Label>
                      <ul className="text-sm space-y-1 mt-1">
                        {submission.conditions.map((condition, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                            {condition}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {submission.recommendations.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Recommendations</Label>
                      <ul className="text-sm space-y-1 mt-1">
                        {submission.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {submission.nextSteps.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Next Steps</Label>
                      <ul className="text-sm space-y-1 mt-1">
                        {submission.nextSteps.map((step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-green-500 mt-0.5" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "comments" && (
        <div className="space-y-4">
          {reviewSubmissions.flatMap((submission) =>
            submission.comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{comment.section}</span>
                      {comment.lineNumber && (
                        <Badge variant="outline" className="text-xs">
                          Line {comment.lineNumber}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          comment.severity === "critical"
                            ? "bg-red-100 text-red-800"
                            : comment.severity === "error"
                            ? "bg-red-100 text-red-800"
                            : comment.severity === "warning"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {comment.severity}
                      </Badge>
                      <Badge variant="outline">{comment.category}</Badge>
                      <Badge
                        className={
                          comment.status === "resolved"
                            ? "bg-green-100 text-green-800"
                            : comment.status === "addressed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {comment.status}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm mb-3">{comment.comment}</p>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {comment.createdBy} • {comment.createdDate}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === "publishing" && publishingWorkflow && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Publishing Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Publishing Workflow</span>
                  </div>
                  <Badge className={getStatusColor(publishingWorkflow.status)}>
                    {publishingWorkflow.status.replace("_", " ")}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Initiated By</Label>
                    <p className="text-sm">{publishingWorkflow.initiatedBy}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Initiated Date</Label>
                    <p className="text-sm">{publishingWorkflow.initiatedDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Effective Date</Label>
                    <p className="text-sm">{publishingWorkflow.publishingSettings.effectiveDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Access Level</Label>
                    <p className="text-sm">{publishingWorkflow.publishingSettings.accessLevel.replace("_", " ")}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium mb-2 block">Distribution List</Label>
                  <div className="space-y-2">
                    {publishingWorkflow.distributionList.map((target) => (
                      <div key={target.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{target.targetName}</span>
                          <Badge variant="outline">{target.targetType}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(target.deliveryStatus)}>{target.deliveryStatus}</Badge>
                          <Badge className={getPriorityColor(target.priority)}>{target.priority}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm" onClick={handlePublish}>
                    <Send className="h-4 w-4 mr-2" />
                    Publish Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="decision">Decision</Label>
              <Select
                value={reviewFormData.decision}
                onValueChange={(value) => setReviewFormData({ ...reviewFormData, decision: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select decision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="approved_with_conditions">Approved with Conditions</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="needs_revision">Needs Revision</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="rating">Overall Rating</Label>
              <div className="flex items-center gap-2 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Award
                    key={i}
                    className={`h-6 w-6 cursor-pointer ${
                      i < reviewFormData.overallRating ? "text-yellow-500" : "text-gray-300"
                    }`}
                    onClick={() => setReviewFormData({ ...reviewFormData, overallRating: i + 1 })}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                value={reviewFormData.comments}
                onChange={(e) => setReviewFormData({ ...reviewFormData, comments: e.target.value })}
                placeholder="Enter your review comments..."
                className="min-h-20"
              />
            </div>

            <div>
              <Label htmlFor="conditions">Conditions (if any)</Label>
              <Textarea
                id="conditions"
                value={reviewFormData.conditions}
                onChange={(e) => setReviewFormData({ ...reviewFormData, conditions: e.target.value })}
                placeholder="Enter any conditions..."
                className="min-h-16"
              />
            </div>

            <div>
              <Label htmlFor="recommendations">Recommendations</Label>
              <Textarea
                id="recommendations"
                value={reviewFormData.recommendations}
                onChange={(e) => setReviewFormData({ ...reviewFormData, recommendations: e.target.value })}
                placeholder="Enter your recommendations..."
                className="min-h-16"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleReviewSubmit}>
                <Send className="h-4 w-4 mr-2" />
                Submit Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
