/**
 * @fileoverview Constructability Review Center - Main Container Component
 * @module ConstructabilityReviewCenter
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-12-20
 *
 * Main container component for constructability reviews with:
 * - Dashboard view for live scores and metrics
 * - Review log for historical reviews
 * - Review creator for new assessments
 * - Role-based access control
 * - Responsive design following v3.0 standards
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  FileText,
  Plus,
  CheckCircle,
  Clock,
  TrendingUp,
  Filter,
  Download,
  Eye,
  Edit,
  ArrowLeft,
} from "lucide-react"

// Import mock data
import reviewLogData from "@/data/mock/precon/reviewLog.json"
import reviewTemplatesData from "@/data/mock/precon/reviewTemplates.json"

// Import modular components (to be created)
import { ConstructabilityReviewDashboard } from "./ConstructabilityReviewDashboard"
import { ConstructabilityReviewLog } from "./ConstructabilityReviewLog"
import { ConstructabilityReviewCreator } from "./ConstructabilityReviewCreator"

interface ConstructabilityReviewCenterProps {
  projectId: string
  projectData: any
  userRole: string
  user: any
  onNavigateBack?: () => void
}

type ViewMode = "overview" | "dashboard" | "log" | "create" | "edit"

interface ReviewData {
  id: string
  project_id: string
  project_name: string
  stage: string
  date: string
  reviewer: string
  reviewer_role: string
  status: "completed" | "in-progress" | "draft"
  scores: Record<string, number>
  overall_score: number
  weighted_score: number
  comments: Record<string, string>
  report_url: string | null
  created_at: string
  updated_at: string
}

export const ConstructabilityReviewCenter: React.FC<ConstructabilityReviewCenterProps> = ({
  projectId,
  projectData,
  userRole,
  user,
  onNavigateBack,
}) => {
  const [activeView, setActiveView] = useState<ViewMode>("overview")
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load review data on mount
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoading(true)
        // Filter reviews for current project
        const projectReviews = reviewLogData.filter((review: any) => review.project_id === projectId) as ReviewData[]
        setReviews(projectReviews)
      } catch (error) {
        console.error("Error loading reviews:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadReviews()
  }, [projectId])

  // Calculate dashboard metrics
  const dashboardMetrics = useMemo(() => {
    if (reviews.length === 0) {
      return {
        totalReviews: 0,
        averageScore: 0,
        completedReviews: 0,
        inProgressReviews: 0,
        latestReview: null,
        stageDistribution: {},
      }
    }

    const completed = reviews.filter((r) => r.status === "completed")
    const inProgress = reviews.filter((r) => r.status === "in-progress" || r.status === "draft")

    const totalScore = completed.reduce((sum, review) => sum + review.weighted_score, 0)
    const averageScore = completed.length > 0 ? totalScore / completed.length : 0

    const stageDistribution = reviews.reduce((acc, review) => {
      acc[review.stage] = (acc[review.stage] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const latestReview =
      reviews.length > 0 ? reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null

    return {
      totalReviews: reviews.length,
      averageScore: Math.round(averageScore * 10) / 10,
      completedReviews: completed.length,
      inProgressReviews: inProgress.length,
      latestReview,
      stageDistribution,
    }
  }, [reviews])

  // Handle navigation
  const handleViewChange = (view: ViewMode, reviewId?: string) => {
    setActiveView(view)
    if (reviewId) {
      setSelectedReviewId(reviewId)
    }
  }

  const handleCreateReview = () => {
    setSelectedReviewId(null)
    setActiveView("create")
  }

  const handleEditReview = (reviewId: string) => {
    setSelectedReviewId(reviewId)
    setActiveView("edit")
  }

  const handleBackToOverview = () => {
    setActiveView("overview")
    setSelectedReviewId(null)
  }

  // Render overview cards
  const renderOverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Reviews Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          <FileText className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{dashboardMetrics.totalReviews}</div>
          <p className="text-xs text-muted-foreground">
            {dashboardMetrics.completedReviews} completed, {dashboardMetrics.inProgressReviews} in progress
          </p>
        </CardContent>
      </Card>

      {/* Average Score Card */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{dashboardMetrics.averageScore}</div>
          <p className="text-xs text-muted-foreground">
            Based on {dashboardMetrics.completedReviews} completed reviews
          </p>
        </CardContent>
      </Card>

      {/* Latest Review Card */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Latest Review</CardTitle>
          <Clock className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold text-purple-600">{dashboardMetrics.latestReview?.stage || "None"}</div>
          <p className="text-xs text-muted-foreground">
            {dashboardMetrics.latestReview
              ? new Date(dashboardMetrics.latestReview.date).toLocaleDateString()
              : "No reviews yet"}
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          <CheckCircle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button size="sm" className="w-full justify-start" onClick={handleCreateReview}>
              <Plus className="h-3 w-3 mr-2" />
              New Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Render navigation tabs
  const renderNavigationTabs = () => (
    <Tabs value={activeView} onValueChange={(value) => setActiveView(value as ViewMode)} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="dashboard" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Dashboard
        </TabsTrigger>
        <TabsTrigger value="log" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Review Log
        </TabsTrigger>
        <TabsTrigger value="create" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Review
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="mt-6">
        <ConstructabilityReviewDashboard
          reviews={reviews}
          projectId={projectId}
          projectData={projectData}
          userRole={userRole}
          onEditReview={handleEditReview}
        />
      </TabsContent>

      <TabsContent value="log" className="mt-6">
        <ConstructabilityReviewLog
          reviews={reviews}
          projectId={projectId}
          projectData={projectData}
          userRole={userRole}
          onEditReview={handleEditReview}
          onCreateReview={handleCreateReview}
        />
      </TabsContent>

      <TabsContent value="create" className="mt-6">
        <ConstructabilityReviewCreator
          projectId={projectId}
          projectData={projectData}
          userRole={userRole}
          user={user}
          reviewId={activeView === "edit" ? selectedReviewId : null}
          onSave={(reviewData: any) => {
            // Handle save logic
            setReviews((prev) => [...prev, reviewData as ReviewData])
            setActiveView("log")
          }}
          onCancel={() => setActiveView("overview")}
        />
      </TabsContent>
    </Tabs>
  )

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      </div>
    )
  }

  // Render specific views
  if (activeView === "create" || activeView === "edit") {
    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleBackToOverview}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Overview
            </Button>
            <div>
              <h2 className="text-xl font-semibold">{activeView === "create" ? "Create New Review" : "Edit Review"}</h2>
              <p className="text-sm text-muted-foreground">Constructability assessment for {projectData?.name}</p>
            </div>
          </div>
        </div>

        <ConstructabilityReviewCreator
          projectId={projectId}
          projectData={projectData}
          userRole={userRole}
          user={user}
          reviewId={activeView === "edit" ? selectedReviewId : null}
          onSave={(reviewData: any) => {
            // Handle save logic
            if (activeView === "edit") {
              setReviews((prev) => prev.map((r) => (r.id === selectedReviewId ? (reviewData as ReviewData) : r)))
            } else {
              setReviews((prev) => [...prev, reviewData as ReviewData])
            }
            setActiveView("overview")
          }}
          onCancel={handleBackToOverview}
        />
      </div>
    )
  }

  // Main overview layout
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-purple-600" />
            Constructability Reviews
          </h2>
          <p className="text-sm text-muted-foreground">Design review and constructability assessment center</p>
        </div>
        {onNavigateBack && (
          <Button variant="outline" onClick={onNavigateBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pre-Construction
          </Button>
        )}
      </div>

      {/* Overview Cards */}
      {activeView === "overview" && renderOverviewCards()}

      {/* Navigation Tabs */}
      {activeView === "overview" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => setActiveView("dashboard")}
            >
              <BarChart3 className="h-6 w-6" />
              <span>Dashboard</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => setActiveView("log")}
            >
              <FileText className="h-6 w-6" />
              <span>Review Log</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={handleCreateReview}
            >
              <Plus className="h-6 w-6" />
              <span>Create Review</span>
            </Button>
          </div>
        </div>
      ) : (
        renderNavigationTabs()
      )}
    </div>
  )
}

export default ConstructabilityReviewCenter
