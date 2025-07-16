/**
 * @fileoverview Constructability Review Dashboard Component
 * @module ConstructabilityReviewDashboard
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-12-20
 */

"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Target,
  Users,
  Calendar,
  Award,
  Download,
  RefreshCw,
  Filter,
  Eye,
  Plus,
  Settings,
  ArrowUp,
  ArrowDown,
  Minus,
  Activity,
  MoreHorizontal,
  ChevronRight,
  Star,
  Zap,
  Building,
  GitBranch,
  AlertCircle,
  Info,
  Lightbulb,
  Shield,
  DollarSign,
  Percent,
  Timer,
  CheckSquare,
  XCircle,
  AlertOctagon,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  FileImage,
  Paperclip,
  Search,
  ArrowRight,
  ExternalLink,
  History,
  Bookmark,
  Share,
  Bell,
  Archive,
  Edit,
  Trash2,
  Copy,
  Send,
  Mail,
  Phone,
  MapPin,
  Globe,
  Link,
  Database,
  Folder,
  Image,
  Upload,
  Save,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

import type { ReviewData, ConstructabilityReviewDashboardProps } from "@/types/constructability"

const ConstructabilityReviewDashboard: React.FC<ConstructabilityReviewDashboardProps> = ({
  projectId,
  projectData,
  userRole,
  user,
  reviews: externalReviews,
  onEditReview,
}) => {
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState<"7d" | "30d" | "90d" | "all">("30d")
  const [selectedStage, setSelectedStage] = useState<string>("all")
  const [selectedReviewer, setSelectedReviewer] = useState<string>("all")
  const [refreshing, setRefreshing] = useState(false)

  // Load mock data
  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Load mock review data
        const mockReviews: ReviewData[] = [
          {
            id: "CR-001",
            reviewType: "100% DD Review",
            projectStage: "Design Development",
            reviewDate: "2024-01-15",
            reviewerName: "Sarah Johnson",
            reviewerRole: "Senior Project Manager",
            overallScore: 8.5,
            status: "completed",
            scoring: {
              designFeasibility: 9,
              coordinationClarity: 8,
              codeCompliance: 9,
              costScheduleImpact: 8,
              constructabilityRisk: 8,
              bimReviewQuality: 9,
            },
            comments: "Excellent design coordination with minimal constructability issues identified.",
            recommendations: [
              "Consider precast concrete for improved schedule",
              "Review MEP coordination in mechanical room",
            ],
            attachments: ["review_report.pdf", "marked_drawings.pdf"],
          },
          {
            id: "CR-002",
            reviewType: "80% CD Review",
            projectStage: "Construction Documents",
            reviewDate: "2024-01-20",
            reviewerName: "Mike Chen",
            reviewerRole: "Construction Manager",
            overallScore: 7.8,
            status: "completed",
            scoring: {
              designFeasibility: 8,
              coordinationClarity: 7,
              codeCompliance: 8,
              costScheduleImpact: 8,
              constructabilityRisk: 7,
              bimReviewQuality: 8,
            },
            comments: "Good progress with some coordination issues requiring attention.",
            recommendations: ["Resolve structural-MEP conflicts", "Clarify construction sequencing"],
            attachments: ["cd_review.pdf", "clash_report.pdf"],
          },
          {
            id: "CR-003",
            reviewType: "95% CD Review",
            projectStage: "Construction Documents",
            reviewDate: "2024-01-25",
            reviewerName: "Lisa Rodriguez",
            reviewerRole: "Quality Manager",
            overallScore: 8.8,
            status: "completed",
            scoring: {
              designFeasibility: 9,
              coordinationClarity: 9,
              codeCompliance: 9,
              costScheduleImpact: 8,
              constructabilityRisk: 9,
              bimReviewQuality: 9,
            },
            comments: "Outstanding coordination and constructability. Ready for construction.",
            recommendations: ["Minor detail refinements", "Final specification review"],
            attachments: ["final_review.pdf", "specs_comments.pdf"],
          },
        ]

        setReviews(mockReviews)
      } catch (error) {
        console.error("Error loading reviews:", error)
      } finally {
        setLoading(false)
      }
    }

    loadReviews()
  }, [projectId])

  // Calculate metrics
  const calculateMetrics = () => {
    if (reviews.length === 0)
      return {
        totalReviews: 0,
        averageScore: 0,
        completedReviews: 0,
        inProgressReviews: 0,
        pendingReviews: 0,
        completionRate: 0,
        trends: {
          scoreImprovement: 0,
          reviewFrequency: 0,
        },
      }

    const totalReviews = reviews.length
    const averageScore = reviews.reduce((sum, review) => sum + review.overallScore, 0) / totalReviews
    const completedReviews = reviews.filter((r) => r.status === "completed").length
    const inProgressReviews = reviews.filter((r) => r.status === "in-progress").length
    const pendingReviews = reviews.filter((r) => r.status === "pending").length
    const completionRate = (completedReviews / totalReviews) * 100

    // Calculate trends
    const sortedReviews = [...reviews].sort(
      (a, b) => new Date(a.reviewDate).getTime() - new Date(b.reviewDate).getTime()
    )
    const firstHalf = sortedReviews.slice(0, Math.ceil(sortedReviews.length / 2))
    const secondHalf = sortedReviews.slice(Math.ceil(sortedReviews.length / 2))

    const firstHalfAvg = firstHalf.reduce((sum, r) => sum + r.overallScore, 0) / firstHalf.length
    const secondHalfAvg = secondHalf.reduce((sum, r) => sum + r.overallScore, 0) / secondHalf.length
    const scoreImprovement = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100

    return {
      totalReviews,
      averageScore,
      completedReviews,
      inProgressReviews,
      pendingReviews,
      completionRate,
      trends: {
        scoreImprovement,
        reviewFrequency: totalReviews / 30, // reviews per month
      },
    }
  }

  const metrics = calculateMetrics()

  // Prepare chart data
  const scoreDistributionData = [
    {
      name: "Design Feasibility",
      value: reviews.reduce((sum, r) => sum + r.scoring.designFeasibility, 0) / reviews.length || 0,
    },
    {
      name: "Coordination Clarity",
      value: reviews.reduce((sum, r) => sum + r.scoring.coordinationClarity, 0) / reviews.length || 0,
    },
    {
      name: "Code Compliance",
      value: reviews.reduce((sum, r) => sum + r.scoring.codeCompliance, 0) / reviews.length || 0,
    },
    {
      name: "Cost/Schedule Impact",
      value: reviews.reduce((sum, r) => sum + r.scoring.costScheduleImpact, 0) / reviews.length || 0,
    },
    {
      name: "Constructability Risk",
      value: reviews.reduce((sum, r) => sum + r.scoring.constructabilityRisk, 0) / reviews.length || 0,
    },
    {
      name: "BIM Review Quality",
      value: reviews.reduce((sum, r) => sum + r.scoring.bimReviewQuality, 0) / reviews.length || 0,
    },
  ]

  const trendsData = reviews.map((review) => ({
    date: new Date(review.reviewDate).toLocaleDateString(),
    score: review.overallScore,
    review: review.reviewType,
  }))

  const stageDistributionData = [
    {
      name: "Schematic Design",
      value: reviews.filter((r) => r.projectStage === "Schematic Design").length,
      color: "#8B5CF6",
    },
    {
      name: "Design Development",
      value: reviews.filter((r) => r.projectStage === "Design Development").length,
      color: "#06B6D4",
    },
    {
      name: "Construction Documents",
      value: reviews.filter((r) => r.projectStage === "Construction Documents").length,
      color: "#10B981",
    },
    {
      name: "Pre-Construction",
      value: reviews.filter((r) => r.projectStage === "Pre-Construction").length,
      color: "#F59E0B",
    },
  ]

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return "text-green-600 dark:text-green-400"
    if (score >= 7.0) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8.5) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    if (score >= 7.0) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (value < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading review dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Review Dashboard</h3>
          <p className="text-sm text-muted-foreground">
            Live metrics and performance tracking for constructability reviews
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedTimeframe} onValueChange={(value: any) => setSelectedTimeframe(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
                <p className="text-2xl font-bold">{metrics.totalReviews}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                {metrics.completedReviews} completed, {metrics.inProgressReviews} in progress
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(metrics.averageScore)}`}>
                  {metrics.averageScore.toFixed(1)}
                </p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2 flex items-center">
              {getTrendIcon(metrics.trends.scoreImprovement)}
              <p className="text-xs text-muted-foreground ml-1">
                {metrics.trends.scoreImprovement > 0 ? "+" : ""}
                {metrics.trends.scoreImprovement.toFixed(1)}% from last period
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold text-green-600">{metrics.completionRate.toFixed(0)}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Progress value={metrics.completionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Review Frequency</p>
                <p className="text-2xl font-bold">{metrics.trends.reviewFrequency.toFixed(1)}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">reviews per month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Score Distribution by Category</CardTitle>
            <CardDescription>Average scores across all review categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Score Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Score Trends Over Time</CardTitle>
            <CardDescription>Review scores progression</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stage Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reviews by Project Stage</CardTitle>
            <CardDescription>Distribution of reviews across project phases</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stageDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stageDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Reviews</CardTitle>
            <CardDescription>Latest constructability reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{review.reviewType}</span>
                      <Badge className={getScoreBadgeColor(review.overallScore)}>{review.overallScore}/10</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {review.reviewerName} • {new Date(review.reviewDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={review.status === "completed" ? "default" : "secondary"}>{review.status}</Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance Analysis</CardTitle>
          <CardDescription>Detailed breakdown of review performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="categories" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="reviewers">Reviewers</TabsTrigger>
              <TabsTrigger value="stages">Stages</TabsTrigger>
            </TabsList>

            <TabsContent value="categories" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scoreDistributionData.map((category, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{category.name}</p>
                          <p className={`text-xl font-bold ${getScoreColor(category.value)}`}>
                            {category.value.toFixed(1)}
                          </p>
                        </div>
                        <div className="w-16 h-16">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[{ value: category.value }, { value: 10 - category.value }]}
                                cx="50%"
                                cy="50%"
                                innerRadius={20}
                                outerRadius={30}
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                              >
                                <Cell fill="#3B82F6" />
                                <Cell fill="#E5E7EB" />
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Progress value={(category.value / 10) * 100} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviewers" className="space-y-4">
              <div className="space-y-3">
                {Array.from(new Set(reviews.map((r) => r.reviewerName))).map((reviewer, index) => {
                  const reviewerReviews = reviews.filter((r) => r.reviewerName === reviewer)
                  const avgScore = reviewerReviews.reduce((sum, r) => sum + r.overallScore, 0) / reviewerReviews.length

                  return (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{reviewer}</p>
                          <p className="text-sm text-muted-foreground">{reviewerReviews.length} reviews</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getScoreColor(avgScore)}`}>{avgScore.toFixed(1)}</p>
                        <p className="text-sm text-muted-foreground">avg score</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="stages" className="space-y-4">
              <div className="space-y-3">
                {Array.from(new Set(reviews.map((r) => r.projectStage))).map((stage, index) => {
                  const stageReviews = reviews.filter((r) => r.projectStage === stage)
                  const avgScore = stageReviews.reduce((sum, r) => sum + r.overallScore, 0) / stageReviews.length

                  return (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Building className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">{stage}</p>
                          <p className="text-sm text-muted-foreground">{stageReviews.length} reviews</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getScoreColor(avgScore)}`}>{avgScore.toFixed(1)}</p>
                        <p className="text-sm text-muted-foreground">avg score</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default ConstructabilityReviewDashboard
