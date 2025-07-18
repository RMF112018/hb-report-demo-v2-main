"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProtectedGrid, ProtectedColDef, GridRow, createGridWithTotalsAndSticky } from "@/components/ui/protected-grid"
import {
  Users,
  Target,
  TrendingUp,
  Calendar,
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  Plus,
  Settings,
  Eye,
  Edit,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Circle,
  AlertTriangle,
  UserCheck,
  UserX,
  Building2,
  MapPin,
  Bell,
  FileCheck,
  FileX,
  CalendarDays,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Trash2,
  Copy,
  ExternalLink,
  Printer,
  BarChart3,
  PieChart,
  LineChart,
  Award,
  Trophy,
  Flag,
  Zap,
  Brain,
} from "lucide-react"
import AskHBIChat from "../AskHBIChat"
import BehavioralInsightsPanel from "../BehavioralInsightsPanel"
import { format, addDays, isAfter, isBefore, parseISO, differenceInDays, startOfYear, endOfYear } from "date-fns"

interface PerformanceReview {
  id: string
  employeeId: string
  employeeName: string
  department: string
  position: string
  reviewCycle: "annual" | "quarterly" | "probationary"
  reviewPeriod: string
  reviewDate: string
  reviewerId: string
  reviewerName: string
  status: "draft" | "in_progress" | "completed" | "approved"
  overallRating: number
  selfRating?: number
  managerRating?: number
  selfComments?: string
  managerComments?: string
  strengths: string[]
  areasForImprovement: string[]
  goals: PerformanceGoal[]
  nextReviewDate: string
  isPrintable: boolean
  discProfile?: {
    type: string
    primaryStyle: string
    secondaryStyle: string
    summary: string
    strengths: string[]
    growthAreas: string[]
    communicationTips: string[]
    stressResponse: string
    motivators: string[]
    deMotivators: string[]
  }
  integrusProfile?: {
    leadershipType: string
    color: string
    profile: {
      type: string
      description: string
      leadershipStrengths: string[]
      developmentAreas: string[]
      communicationStyle: string
      conflictResolution: string
      teamMotivation: string
      stressManagement: string
    }
  }
  previousReviewDate?: string
}

interface PerformanceGoal {
  id: string
  title: string
  description: string
  category: "performance" | "development" | "project" | "leadership"
  status: "not_started" | "in_progress" | "completed" | "overdue"
  priority: "high" | "medium" | "low"
  startDate: string
  dueDate: string
  completionDate?: string
  progress: number
  notes?: string
}

interface ReviewCycle {
  id: string
  name: string
  type: "annual" | "quarterly" | "probationary"
  startDate: string
  endDate: string
  status: "upcoming" | "active" | "completed"
  totalEmployees: number
  completedReviews: number
  pendingReviews: number
}

interface PerformanceMetric {
  id: string
  name: string
  category: "quality" | "productivity" | "leadership" | "teamwork" | "innovation"
  weight: number
  description: string
}

const PerformancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"reviews" | "goals" | "cycles" | "reports">("reviews")
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null)
  const [selectedGoal, setSelectedGoal] = useState<PerformanceGoal | null>(null)
  const [showBehavioralInsights, setShowBehavioralInsights] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [cycleFilter, setCycleFilter] = useState<string>("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")

  // Mock data for performance reviews
  const performanceReviews: PerformanceReview[] = [
    {
      id: "1",
      employeeId: "EMP001",
      employeeName: "Sarah Johnson",
      department: "Project Management",
      position: "Senior Project Manager",
      reviewCycle: "annual",
      reviewPeriod: "2024 Annual Review",
      reviewDate: "2024-12-15",
      reviewerId: "MGR001",
      reviewerName: "Alex Singh",
      status: "completed",
      overallRating: 4.2,
      selfRating: 4.0,
      managerRating: 4.2,
      selfComments:
        "I have successfully led multiple high-profile projects this year and improved team collaboration. I would like to focus on developing my strategic planning skills in the coming year.",
      managerComments:
        "Sarah has demonstrated exceptional leadership and project management skills. Her ability to deliver projects on time and within budget is outstanding. Recommended for promotion consideration.",
      strengths: ["Project Management", "Team Leadership", "Client Communication", "Problem Solving"],
      areasForImprovement: ["Strategic Planning", "Risk Management"],
      goals: [
        {
          id: "goal-1",
          title: "Lead Strategic Initiative",
          description: "Take ownership of a major strategic project",
          category: "leadership",
          status: "in_progress",
          priority: "high",
          startDate: "2024-01-15",
          dueDate: "2024-06-30",
          progress: 75,
          notes: "Making good progress on the strategic initiative",
        },
        {
          id: "goal-2",
          title: "Mentor Junior Team Members",
          description: "Provide guidance and support to 3 junior project managers",
          category: "development",
          status: "completed",
          priority: "medium",
          startDate: "2024-01-15",
          dueDate: "2024-12-31",
          completionDate: "2024-11-15",
          progress: 100,
          notes: "Successfully mentored 3 team members",
        },
      ],
      nextReviewDate: "2025-12-15",
      isPrintable: true,
      discProfile: {
        type: "DC",
        primaryStyle: "Dominant",
        secondaryStyle: "Conscientious",
        summary:
          "Results-driven leader who values accuracy and quality. Combines direct communication with attention to detail.",
        strengths: ["Goal-oriented", "Analytical thinking", "High standards", "Direct communication"],
        growthAreas: ["Patience with others", "Emotional intelligence", "Team collaboration"],
        communicationTips: [
          "Be direct and specific about expectations",
          "Provide data and facts to support feedback",
          "Focus on results and outcomes",
          "Allow time for questions and clarification",
        ],
        stressResponse: "Becomes more direct and task-focused",
        motivators: ["Achievement", "Quality", "Efficiency", "Recognition"],
        deMotivators: ["Inconsistency", "Lack of direction", "Poor quality work"],
      },
      integrusProfile: {
        leadershipType: "Driver",
        color: "#DC2626",
        profile: {
          type: "Driver",
          description:
            "Action-oriented leader who focuses on results and achievement. Direct and decisive in approach.",
          leadershipStrengths: ["Goal achievement", "Decision making", "Results focus", "High energy"],
          developmentAreas: ["Relationship building", "Strategic thinking", "Patience with others"],
          communicationStyle: "Direct and concise",
          conflictResolution: "Confronts issues directly",
          teamMotivation: "Sets clear goals and expectations",
          stressManagement: "Takes action to resolve issues",
        },
      },
      previousReviewDate: "2023-12-15",
    },
    {
      id: "2",
      employeeId: "EMP002",
      employeeName: "Michael Chen",
      department: "Estimating",
      position: "Senior Estimator",
      reviewCycle: "quarterly",
      reviewPeriod: "Q4 2024 Review",
      reviewDate: "2024-12-10",
      reviewerId: "MGR002",
      reviewerName: "Jennifer Lee",
      status: "in_progress",
      overallRating: 3.8,
      selfRating: 3.5,
      managerRating: 3.8,
      selfComments:
        "I have improved my accuracy in cost estimation and reduced errors by 15%. I need to work on my presentation skills for client meetings.",
      managerComments:
        "Michael has shown significant improvement in estimation accuracy. His analytical skills are excellent. Needs to develop presentation and client interaction skills.",
      strengths: ["Analytical Skills", "Cost Estimation", "Attention to Detail"],
      areasForImprovement: ["Presentation Skills", "Client Interaction"],
      goals: [
        {
          id: "goal-3",
          title: "Improve Presentation Skills",
          description: "Lead 5 client presentations independently",
          category: "development",
          status: "in_progress",
          priority: "high",
          startDate: "2024-10-01",
          dueDate: "2025-03-31",
          progress: 40,
          notes: "Completed 2 presentations, 3 more to go",
        },
      ],
      nextReviewDate: "2025-03-15",
      isPrintable: false,
      discProfile: {
        type: "SC",
        primaryStyle: "Steady",
        secondaryStyle: "Conscientious",
        summary: "Reliable team player who values accuracy and consistency. Patient and thorough in approach.",
        strengths: ["Reliability", "Attention to detail", "Team collaboration", "Consistency"],
        growthAreas: ["Initiative taking", "Self-promotion", "Risk taking"],
        communicationTips: [
          "Create a comfortable, supportive environment",
          "Provide detailed explanations and context",
          "Focus on stability and consistency",
          "Give time to process information",
        ],
        stressResponse: "Becomes more withdrawn and cautious",
        motivators: ["Stability", "Quality", "Team harmony", "Recognition"],
        deMotivators: ["Change", "Conflict", "Unclear expectations"],
      },
      integrusProfile: {
        leadershipType: "Supporter",
        color: "#2563EB",
        profile: {
          type: "Supporter",
          description: "Relationship-focused leader who builds strong teams through collaboration and support.",
          leadershipStrengths: [
            "Team building",
            "Relationship management",
            "Supportive leadership",
            "Conflict resolution",
          ],
          developmentAreas: ["Strategic decision making", "Direct communication", "Risk taking"],
          communicationStyle: "Supportive and encouraging",
          conflictResolution: "Seeks consensus and harmony",
          teamMotivation: "Creates supportive environment",
          stressManagement: "Seeks support from others",
        },
      },
      previousReviewDate: "2024-09-15",
    },
    {
      id: "3",
      employeeId: "EMP003",
      employeeName: "Emily Davis",
      department: "Human Resources",
      position: "HR Specialist",
      reviewCycle: "probationary",
      reviewPeriod: "90-Day Probation Review",
      reviewDate: "2024-12-05",
      reviewerId: "MGR003",
      reviewerName: "David Wilson",
      status: "completed",
      overallRating: 4.5,
      selfRating: 4.3,
      managerRating: 4.5,
      selfComments:
        "I have quickly adapted to the company culture and processes. I have successfully implemented new HR procedures and improved employee satisfaction scores.",
      managerComments:
        "Emily has exceeded expectations during her probation period. She has shown initiative, professionalism, and strong HR skills. Highly recommend for permanent position.",
      strengths: ["Adaptability", "Process Improvement", "Employee Relations", "Communication"],
      areasForImprovement: ["Advanced HR Systems", "Strategic HR Planning"],
      goals: [
        {
          id: "goal-4",
          title: "Master HR Systems",
          description: "Become proficient in all HR software platforms",
          category: "development",
          status: "completed",
          priority: "high",
          startDate: "2024-09-01",
          dueDate: "2024-12-01",
          completionDate: "2024-11-30",
          progress: 100,
          notes: "Successfully completed all HR system training",
        },
      ],
      nextReviewDate: "2025-03-05",
      isPrintable: true,
      discProfile: {
        type: "IS",
        primaryStyle: "Influential",
        secondaryStyle: "Steady",
        summary:
          "Enthusiastic team player who builds relationships and motivates others. Optimistic and people-oriented.",
        strengths: ["Relationship building", "Motivation", "Communication", "Team collaboration"],
        growthAreas: ["Attention to detail", "Follow-through", "Time management"],
        communicationTips: [
          "Start with positive recognition and enthusiasm",
          "Use encouraging and motivational language",
          "Focus on team collaboration and relationships",
          "Provide opportunities for social interaction",
        ],
        stressResponse: "Becomes more talkative and seeks support",
        motivators: ["Recognition", "Social interaction", "Achievement", "Positive feedback"],
        deMotivators: ["Isolation", "Criticism", "Routine tasks"],
      },
      integrusProfile: {
        leadershipType: "Creator",
        color: "#F59E0B",
        profile: {
          type: "Creator",
          description:
            "Innovative leader who inspires others through creativity and vision. Enthusiastic and relationship-focused.",
          leadershipStrengths: ["Innovation", "Inspiration", "Relationship building", "Creative problem solving"],
          developmentAreas: ["Execution", "Process management", "Attention to detail"],
          communicationStyle: "Enthusiastic and inspiring",
          conflictResolution: "Seeks creative solutions",
          teamMotivation: "Inspires through vision and enthusiasm",
          stressManagement: "Uses creativity to solve problems",
        },
      },
      previousReviewDate: "2024-09-05",
    },
  ]

  // Mock data for review cycles
  const reviewCycles: ReviewCycle[] = [
    {
      id: "cycle-1",
      name: "2024 Annual Review",
      type: "annual",
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      status: "active",
      totalEmployees: 120,
      completedReviews: 85,
      pendingReviews: 35,
    },
    {
      id: "cycle-2",
      name: "Q4 2024 Quarterly Review",
      type: "quarterly",
      startDate: "2024-10-01",
      endDate: "2024-12-31",
      status: "active",
      totalEmployees: 45,
      completedReviews: 32,
      pendingReviews: 13,
    },
    {
      id: "cycle-3",
      name: "Q1 2025 Quarterly Review",
      type: "quarterly",
      startDate: "2025-01-01",
      endDate: "2025-03-31",
      status: "upcoming",
      totalEmployees: 45,
      completedReviews: 0,
      pendingReviews: 45,
    },
  ]

  // Mock data for performance metrics
  const performanceMetrics: PerformanceMetric[] = [
    {
      id: "metric-1",
      name: "Quality of Work",
      category: "quality",
      weight: 25,
      description: "Accuracy, thoroughness, and attention to detail",
    },
    {
      id: "metric-2",
      name: "Productivity",
      category: "productivity",
      weight: 20,
      description: "Efficiency and output in completing tasks",
    },
    {
      id: "metric-3",
      name: "Leadership",
      category: "leadership",
      weight: 20,
      description: "Ability to lead and motivate others",
    },
    {
      id: "metric-4",
      name: "Teamwork",
      category: "teamwork",
      weight: 15,
      description: "Collaboration and contribution to team success",
    },
    {
      id: "metric-5",
      name: "Innovation",
      category: "innovation",
      weight: 20,
      description: "Creativity and process improvement",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "not_started":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "draft":
        return <FileText className="h-4 w-4" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4" />
      case "not_started":
        return <Circle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getCycleStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600 dark:text-green-400"
    if (rating >= 4.0) return "text-blue-600 dark:text-blue-400"
    if (rating >= 3.5) return "text-yellow-600 dark:text-yellow-400"
    if (rating >= 3.0) return "text-orange-600 dark:text-orange-400"
    return "text-red-600 dark:text-red-400"
  }

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return "Outstanding"
    if (rating >= 4.0) return "Exceeds Expectations"
    if (rating >= 3.5) return "Meets Expectations"
    if (rating >= 3.0) return "Needs Improvement"
    return "Unsatisfactory"
  }

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    let filtered = performanceReviews

    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.reviewPeriod.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((review) => review.status === statusFilter)
    }

    if (cycleFilter !== "all") {
      filtered = filtered.filter((review) => review.reviewCycle === cycleFilter)
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter((review) => review.department === departmentFilter)
    }

    return filtered
  }, [performanceReviews, searchTerm, statusFilter, cycleFilter, departmentFilter])

  // Calculate stats
  const stats = useMemo(() => {
    const total = performanceReviews.length
    const completed = performanceReviews.filter((review) => review.status === "completed").length
    const inProgress = performanceReviews.filter((review) => review.status === "in_progress").length
    const draft = performanceReviews.filter((review) => review.status === "draft").length
    const averageRating =
      performanceReviews.length > 0
        ? performanceReviews.reduce((sum, review) => sum + review.overallRating, 0) / performanceReviews.length
        : 0

    return {
      total,
      completed,
      inProgress,
      draft,
      averageRating: Math.round(averageRating * 10) / 10,
    }
  }, [performanceReviews])

  // Grid column definitions for performance reviews
  const performanceReviewColumns: ProtectedColDef[] = [
    {
      field: "employeeName",
      headerName: "Employee",
      width: 150,
      cellRenderer: ({ value }: { value: string }) => (
        <div className="flex items-center gap-2">
          <Users className="h-3 w-3 text-muted-foreground" />
          <span className="font-medium">{value}</span>
        </div>
      ),
      protection: { level: "read-only" },
    },
    {
      field: "department",
      headerName: "Department",
      width: 150,
      protection: { level: "read-only" },
    },
    {
      field: "reviewPeriod",
      headerName: "Review Period",
      width: 180,
      cellRenderer: ({ value, data }: { value: string; data: PerformanceReview }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span>{value}</span>
          <Badge variant="outline" className="text-xs">
            {data.reviewCycle}
          </Badge>
        </div>
      ),
      protection: { level: "read-only" },
    },
    {
      field: "reviewDate",
      headerName: "Review Date",
      width: 120,
      cellRenderer: ({ value }: { value: string }) => <span>{format(new Date(value), "MMM d, yyyy")}</span>,
      protection: { level: "read-only" },
    },
    {
      field: "overallRating",
      headerName: "Overall Rating",
      width: 140,
      cellRenderer: ({ value }: { value: number }) => (
        <div className="flex items-center gap-2">
          <div className={`font-medium ${getRatingColor(value)}`}>{value.toFixed(1)}</div>
          <div className="text-xs text-muted-foreground">{getRatingLabel(value)}</div>
        </div>
      ),
      protection: { level: "read-only" },
    },
    {
      field: "discProfile",
      headerName: "Behavioral Insights",
      width: 120,
      cellRenderer: ({ data }: { data: PerformanceReview }) => (
        <div className="flex items-center gap-2">
          {data.discProfile && data.integrusProfile ? (
            <Badge variant="outline" className="text-xs">
              <Brain className="h-3 w-3 mr-1" />
              Available
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              Not Available
            </Badge>
          )}
        </div>
      ),
      protection: { level: "read-only" },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      cellRenderer: ({ value }: { value: string }) => (
        <Badge className={getStatusColor(value)}>
          {getStatusIcon(value)}
          <span className="ml-1 capitalize">{value.replace("_", " ")}</span>
        </Badge>
      ),
      protection: { level: "read-only" },
    },
    {
      field: "reviewerName",
      headerName: "Reviewer",
      width: 150,
      protection: { level: "read-only" },
    },
  ]

  const handleCreateReview = () => {
    setShowReviewModal(true)
  }

  const handleViewReview = (review: PerformanceReview) => {
    setSelectedReview(review)
    setShowReviewModal(true)
  }

  const handleCreateGoal = () => {
    setShowGoalModal(true)
  }

  const handleViewGoal = (goal: PerformanceGoal) => {
    setSelectedGoal(goal)
    setShowGoalModal(true)
  }

  const handlePrintReview = (review: PerformanceReview) => {
    // Implementation for printing review
    console.log("Printing review:", review.id)
  }

  const handleExportReport = () => {
    // Implementation for exporting performance report
    console.log("Exporting performance report...")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Performance Management</h1>
          <p className="text-muted-foreground mt-1">Track performance reviews, goals, and development progress</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button onClick={handleCreateReview}>
            <Plus className="h-4 w-4 mr-2" />
            New Review
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">Performance reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getRatingColor(stats.averageRating)}`}>{stats.averageRating}</div>
            <p className="text-xs text-green-600 dark:text-green-400">Overall performance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-green-600 dark:text-green-400">Reviews completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">Pending reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="cycles">Review Cycles</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Performance Reviews</CardTitle>
                  <CardDescription>Manage employee performance reviews and evaluations</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Search reviews..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={cycleFilter} onValueChange={setCycleFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cycles</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="probationary">Probationary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ProtectedGrid
                columnDefs={performanceReviewColumns}
                rowData={filteredReviews}
                config={createGridWithTotalsAndSticky(2, true, {
                  allowExport: true,
                  allowRowSelection: true,
                  allowColumnResizing: true,
                  allowSorting: true,
                  allowFiltering: true,
                  allowCellEditing: false,
                  showToolbar: true,
                  showStatusBar: true,
                  protectionEnabled: true,
                  userRole: "manager",
                  theme: "quartz",
                  enableTotalsRow: true,
                  stickyColumnsCount: 2,
                })}
                height="500px"
                title="Performance Reviews"
                enableSearch={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Performance Goals</CardTitle>
                  <CardDescription>Track employee goals and development objectives</CardDescription>
                </div>
                <Button onClick={handleCreateGoal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceReviews
                  .flatMap((review) => review.goals)
                  .map((goal) => (
                    <div
                      key={goal.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(
                            goal.status
                          )}`}
                        >
                          <Target className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-foreground">{goal.title}</h3>
                            <Badge className={getStatusColor(goal.status)}>
                              {getStatusIcon(goal.status)}
                              <span className="ml-1 capitalize">{goal.status.replace("_", " ")}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-muted-foreground">
                              Due: {format(new Date(goal.dueDate), "MMM d, yyyy")}
                            </span>
                            <span className="text-xs text-muted-foreground">Progress: {goal.progress}%</span>
                            <span className="text-xs text-muted-foreground capitalize">{goal.priority} priority</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${goal.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewGoal(goal)}>
                          <Eye className="h-4 w-4" />
                        </Button>
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

        {/* Review Cycles Tab */}
        <TabsContent value="cycles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Cycles</CardTitle>
              <CardDescription>Manage performance review cycles and schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviewCycles.map((cycle) => (
                  <Card key={cycle.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{cycle.name}</CardTitle>
                        <Badge className={getCycleStatusColor(cycle.status)}>{cycle.status}</Badge>
                      </div>
                      <CardDescription className="text-xs">
                        {format(new Date(cycle.startDate), "MMM d")} - {format(new Date(cycle.endDate), "MMM d, yyyy")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total Employees:</span>
                          <span className="font-medium">{cycle.totalEmployees}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Completed:</span>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            {cycle.completedReviews}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Pending:</span>
                          <span className="font-medium text-yellow-600 dark:text-yellow-400">
                            {cycle.pendingReviews}
                          </span>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{Math.round((cycle.completedReviews / cycle.totalEmployees) * 100)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(cycle.completedReviews / cycle.totalEmployees) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Performance Reports</CardTitle>
                  <CardDescription>Generate and export performance analytics</CardDescription>
                </div>
                <Button onClick={handleExportReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  <span>Rating Distribution</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <PieChart className="h-6 w-6 mb-2" />
                  <span>Department Performance</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <LineChart className="h-6 w-6 mb-2" />
                  <span>Trend Analysis</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Target className="h-6 w-6 mb-2" />
                  <span>Goal Completion</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Award className="h-6 w-6 mb-2" />
                  <span>Top Performers</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Printer className="h-6 w-6 mb-2" />
                  <span>Printable Reviews</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Performance Review</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-6">
              {/* Employee Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Employee</Label>
                  <p className="text-sm text-muted-foreground">{selectedReview.employeeName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Department</Label>
                  <p className="text-sm text-muted-foreground">{selectedReview.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Position</Label>
                  <p className="text-sm text-muted-foreground">{selectedReview.position}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Review Period</Label>
                  <p className="text-sm text-muted-foreground">{selectedReview.reviewPeriod}</p>
                </div>
              </div>

              {/* Ratings */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Label className="text-sm font-medium">Overall Rating</Label>
                  <div className={`text-2xl font-bold mt-2 ${getRatingColor(selectedReview.overallRating)}`}>
                    {selectedReview.overallRating.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {getRatingLabel(selectedReview.overallRating)}
                  </div>
                </div>
                {selectedReview.selfRating && (
                  <div className="text-center p-4 border rounded-lg">
                    <Label className="text-sm font-medium">Self Rating</Label>
                    <div className={`text-2xl font-bold mt-2 ${getRatingColor(selectedReview.selfRating)}`}>
                      {selectedReview.selfRating.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {getRatingLabel(selectedReview.selfRating)}
                    </div>
                  </div>
                )}
                {selectedReview.managerRating && (
                  <div className="text-center p-4 border rounded-lg">
                    <Label className="text-sm font-medium">Manager Rating</Label>
                    <div className={`text-2xl font-bold mt-2 ${getRatingColor(selectedReview.managerRating)}`}>
                      {selectedReview.managerRating.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {getRatingLabel(selectedReview.managerRating)}
                    </div>
                  </div>
                )}
              </div>

              {/* Comments */}
              <div className="space-y-4">
                {selectedReview.selfComments && (
                  <div>
                    <Label className="text-sm font-medium">Self Assessment</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedReview.selfComments}</p>
                  </div>
                )}
                {selectedReview.managerComments && (
                  <div>
                    <Label className="text-sm font-medium">Manager Comments</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedReview.managerComments}</p>
                  </div>
                )}
              </div>

              {/* Strengths and Areas for Improvement */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Strengths</Label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedReview.strengths.map((strength, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Areas for Improvement</Label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedReview.areasForImprovement.map((area, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Goals */}
              {selectedReview.goals.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Performance Goals</Label>
                  <div className="space-y-2 mt-2">
                    {selectedReview.goals.map((goal) => (
                      <div key={goal.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{goal.title}</h4>
                          <Badge className={getStatusColor(goal.status)}>
                            {getStatusIcon(goal.status)}
                            <span className="ml-1 capitalize">{goal.status.replace("_", " ")}</span>
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{goal.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-muted-foreground">Progress: {goal.progress}%</span>
                          <span className="text-xs text-muted-foreground">
                            Due: {format(new Date(goal.dueDate), "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 mt-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Behavioral Insights Panel */}
              {showBehavioralInsights && selectedReview.discProfile && selectedReview.integrusProfile && (
                <div className="border-t pt-6">
                  <BehavioralInsightsPanel
                    employeeId={selectedReview.employeeId}
                    employeeName={selectedReview.employeeName}
                    discProfile={selectedReview.discProfile}
                    integrusProfile={selectedReview.integrusProfile}
                    reviewType={selectedReview.reviewCycle}
                    previousReviewDate={selectedReview.previousReviewDate}
                    onTrackChanges={(changes) => {
                      console.log("Behavioral changes tracked:", changes)
                    }}
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewModal(false)}>
              Close
            </Button>
            {selectedReview?.discProfile && selectedReview?.integrusProfile && (
              <Button variant="outline" onClick={() => setShowBehavioralInsights(!showBehavioralInsights)}>
                <Brain className="h-4 w-4 mr-2" />
                {showBehavioralInsights ? "Hide" : "Show"} Behavioral Insights
              </Button>
            )}
            {selectedReview?.isPrintable && (
              <Button onClick={() => handlePrintReview(selectedReview)}>
                <Printer className="h-4 w-4 mr-2" />
                Print Review
              </Button>
            )}
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Goal Modal */}
      <Dialog open={showGoalModal} onOpenChange={setShowGoalModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Performance Goal</DialogTitle>
          </DialogHeader>
          {selectedGoal && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Goal Title</Label>
                  <p className="text-sm text-muted-foreground">{selectedGoal.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p className="text-sm text-muted-foreground capitalize">{selectedGoal.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedGoal.status)}>
                    {getStatusIcon(selectedGoal.status)}
                    <span className="ml-1 capitalize">{selectedGoal.status.replace("_", " ")}</span>
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <p className="text-sm text-muted-foreground capitalize">{selectedGoal.priority}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Start Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedGoal.startDate), "MMM d, yyyy")}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Due Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedGoal.dueDate), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedGoal.description}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Progress</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${selectedGoal.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{selectedGoal.progress}%</span>
                </div>
              </div>
              {selectedGoal.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedGoal.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGoalModal(false)}>
              Close
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ask HBI Chat */}
      <AskHBIChat />
    </div>
  )
}

export default PerformancePage
