"use client"

import React from "react"
import { StageViewProps } from "@/types/project-stage-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Archive,
  Award,
  BarChart3,
  Book,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  TrendingUp,
  Users,
  Target,
  Star,
  Shield,
  AlertTriangle,
  Download,
  Upload,
  Edit,
  Plus,
  ExternalLink,
  Building2,
  Wrench,
  Heart,
  ThumbsUp,
  MessageSquare,
  Lightbulb,
} from "lucide-react"

export const ClosedStageView = ({ project, projectData, stageConfig }: StageViewProps) => {
  // Mock Closed Project data
  const closedData = {
    projectSummary: {
      completionDate: "2024-08-31",
      finalDuration: 914,
      originalDuration: 884,
      finalCost: 25750000,
      originalCost: 25000000,
      changeOrders: 15,
      totalChangeValue: 750000,
      finalSqFt: 110000,
      clientSatisfaction: 4.8,
      teamSatisfaction: 4.6,
      safetyRecord: "Excellent",
      qualityRating: 4.7,
    },
    performanceMetrics: {
      schedulePerformance: {
        planned: 884,
        actual: 914,
        variance: 30,
        performanceIndex: 96.7,
      },
      costPerformance: {
        budgeted: 25000000,
        actual: 25750000,
        variance: 750000,
        performanceIndex: 97.1,
      },
      qualityMetrics: {
        defectRate: 0.8,
        reworkCost: 125000,
        clientApprovalRate: 98.5,
        inspectionPassRate: 95.2,
      },
      safetyMetrics: {
        totalIncidents: 3,
        lostTimeIncidents: 0,
        nearMisses: 12,
        safetyScore: 92.5,
        trainingCompliance: 98.2,
      },
    },
    warrantyTracking: {
      totalWarranties: 47,
      activeWarranties: 42,
      expiredWarranties: 5,
      claimsSubmitted: 8,
      claimsResolved: 6,
      claimsPending: 2,
      categories: [
        { name: "Structural", warranties: 8, active: 8, claims: 0, status: "Active" },
        { name: "Roofing", warranties: 6, active: 5, claims: 2, status: "Active" },
        { name: "HVAC", warranties: 12, active: 11, claims: 3, status: "Active" },
        { name: "Electrical", warranties: 8, active: 7, claims: 1, status: "Active" },
        { name: "Plumbing", warranties: 6, active: 5, claims: 1, status: "Active" },
        { name: "Finishes", warranties: 4, active: 3, claims: 1, status: "Mixed" },
        { name: "Equipment", warranties: 3, active: 3, claims: 0, status: "Active" },
      ],
      recentClaims: [
        {
          id: "WC-001",
          category: "HVAC",
          description: "Unit not heating properly",
          status: "Resolved",
          date: "2024-01-15",
        },
        {
          id: "WC-002",
          category: "Roofing",
          description: "Minor leak in section A",
          status: "Pending",
          date: "2024-01-10",
        },
        {
          id: "WC-003",
          category: "Electrical",
          description: "Outlet not working",
          status: "Resolved",
          date: "2024-01-08",
        },
        {
          id: "WC-004",
          category: "Finishes",
          description: "Paint peeling in lobby",
          status: "Pending",
          date: "2024-01-05",
        },
      ],
    },
    lessonsLearned: {
      totalLessons: 23,
      categorizedLessons: [
        { category: "Design", count: 6, impact: "High" },
        { category: "Construction", count: 8, impact: "Medium" },
        { category: "Communication", count: 4, impact: "High" },
        { category: "Materials", count: 3, impact: "Medium" },
        { category: "Safety", count: 2, impact: "Low" },
      ],
      keyLessons: [
        {
          title: "Early MEP Coordination Critical",
          category: "Design",
          impact: "High",
          description: "Earlier MEP coordination would have prevented costly rework during construction",
          recommendation: "Implement mandatory BIM clash detection before 60% design milestone",
        },
        {
          title: "Weather Protection Planning",
          category: "Construction",
          impact: "Medium",
          description: "Weather delays could have been minimized with better protection planning",
          recommendation: "Develop comprehensive weather protection plans during pre-construction",
        },
        {
          title: "Client Communication Process",
          category: "Communication",
          impact: "High",
          description: "Weekly client meetings improved satisfaction and reduced change orders",
          recommendation: "Establish formal weekly client communication protocol for all projects",
        },
        {
          title: "Local Material Sourcing",
          category: "Materials",
          impact: "Medium",
          description: "Local sourcing reduced delivery times and transportation costs",
          recommendation: "Prioritize local suppliers during procurement planning",
        },
      ],
    },
    projectArchival: {
      documentsArchived: 1247,
      totalDocuments: 1283,
      archivalProgress: 97.2,
      categories: [
        { name: "Design Documents", total: 234, archived: 234, status: "Complete" },
        { name: "Construction Drawings", total: 156, archived: 156, status: "Complete" },
        { name: "Specifications", total: 89, archived: 89, status: "Complete" },
        { name: "Field Reports", total: 312, archived: 298, status: "In Progress" },
        { name: "Meeting Minutes", total: 127, archived: 125, status: "In Progress" },
        { name: "Correspondence", total: 201, archived: 195, status: "In Progress" },
        { name: "Financial Records", total: 98, archived: 98, status: "Complete" },
        { name: "Photos & Videos", total: 66, archived: 52, status: "In Progress" },
      ],
      retentionSchedule: [
        { category: "Legal Documents", retention: "Permanent", status: "Archived" },
        { category: "Financial Records", retention: "7 Years", status: "Archived" },
        { category: "Design Documents", retention: "10 Years", status: "Archived" },
        { category: "Correspondence", retention: "3 Years", status: "In Progress" },
      ],
    },
    teamFeedback: {
      responsesCollected: 24,
      totalTeamMembers: 28,
      responseRate: 85.7,
      averageRatings: {
        projectManagement: 4.6,
        communication: 4.4,
        resources: 4.2,
        timeline: 4.1,
        overallSatisfaction: 4.5,
      },
      keyFeedback: [
        { aspect: "Excellent project communication", sentiment: "Positive", frequency: 12 },
        { aspect: "Well-organized planning", sentiment: "Positive", frequency: 10 },
        { aspect: "Need better material tracking", sentiment: "Improvement", frequency: 6 },
        { aspect: "Schedule was too tight", sentiment: "Concern", frequency: 4 },
      ],
    },
  }

  const scheduleVariance =
    ((closedData.projectSummary.finalDuration - closedData.projectSummary.originalDuration) /
      closedData.projectSummary.originalDuration) *
    100
  const costVariance =
    ((closedData.projectSummary.finalCost - closedData.projectSummary.originalCost) /
      closedData.projectSummary.originalCost) *
    100
  const warrantyHealth =
    (closedData.warrantyTracking.activeWarranties / closedData.warrantyTracking.totalWarranties) * 100

  return (
    <div className="space-y-6">
      {/* Stage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Performance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(closedData.performanceMetrics.schedulePerformance.performanceIndex)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {scheduleVariance >= 0 ? "+" : ""}
              {Math.round(scheduleVariance)}% schedule variance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{closedData.projectSummary.clientSatisfaction}/5.0</div>
            <p className="text-xs text-muted-foreground">
              {closedData.projectSummary.qualityRating}/5.0 quality rating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Warranties</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{closedData.warrantyTracking.activeWarranties}</div>
            <p className="text-xs text-muted-foreground">{closedData.warrantyTracking.claimsPending} pending claims</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archive Progress</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(closedData.projectArchival.archivalProgress)}%</div>
            <p className="text-xs text-muted-foreground">
              {closedData.projectArchival.documentsArchived} of {closedData.projectArchival.totalDocuments} docs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="warranty">Warranty</TabsTrigger>
          <TabsTrigger value="lessons">Lessons Learned</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
          <TabsTrigger value="feedback">Team Feedback</TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Project Performance Analytics
                <Badge variant="default" className="ml-2">
                  Completed {new Date(closedData.projectSummary.completionDate).toLocaleDateString()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Performance Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Schedule Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Performance Index</span>
                        <span>{closedData.performanceMetrics.schedulePerformance.performanceIndex}%</span>
                      </div>
                      <Progress
                        value={closedData.performanceMetrics.schedulePerformance.performanceIndex}
                        className="w-full"
                      />
                      <div className="text-xs text-muted-foreground">
                        {closedData.performanceMetrics.schedulePerformance.actual} days actual vs{" "}
                        {closedData.performanceMetrics.schedulePerformance.planned} planned
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Cost Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Performance Index</span>
                        <span>{closedData.performanceMetrics.costPerformance.performanceIndex}%</span>
                      </div>
                      <Progress
                        value={closedData.performanceMetrics.costPerformance.performanceIndex}
                        className="w-full"
                      />
                      <div className="text-xs text-muted-foreground">
                        ${(closedData.performanceMetrics.costPerformance.variance / 1000000).toFixed(1)}M variance from
                        budget
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="text-lg font-semibold">
                      {closedData.performanceMetrics.qualityMetrics.defectRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">Defect Rate</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-lg font-semibold">
                      {closedData.performanceMetrics.qualityMetrics.inspectionPassRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">Inspection Pass Rate</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-lg font-semibold">
                      {closedData.performanceMetrics.safetyMetrics.totalIncidents}
                    </div>
                    <div className="text-sm text-muted-foreground">Safety Incidents</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-lg font-semibold">{closedData.projectSummary.changeOrders}</div>
                    <div className="text-sm text-muted-foreground">Change Orders</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Performance Report
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    View Detailed Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Warranty Tab */}
        <TabsContent value="warranty" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Warranty Management
                {closedData.warrantyTracking.claimsPending > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {closedData.warrantyTracking.claimsPending} Pending Claims
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Warranty Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Active Warranties</span>
                      <span>{Math.round(warrantyHealth)}%</span>
                    </div>
                    <Progress value={warrantyHealth} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Claims Resolved</span>
                      <span>
                        {Math.round(
                          (closedData.warrantyTracking.claimsResolved / closedData.warrantyTracking.claimsSubmitted) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        (closedData.warrantyTracking.claimsResolved / closedData.warrantyTracking.claimsSubmitted) * 100
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <div className="text-lg font-semibold">{closedData.warrantyTracking.totalWarranties}</div>
                    <div className="text-sm text-muted-foreground">Total Warranties</div>
                  </div>
                </div>

                {/* Warranty Categories */}
                <div className="space-y-3">
                  <h4 className="font-medium">Warranty Categories</h4>
                  {closedData.warrantyTracking.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {category.active} active, {category.claims} claims
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={category.status === "Active" ? "default" : "secondary"} className="text-xs">
                          {category.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{category.warranties} total</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Claims */}
                <div className="space-y-3">
                  <h4 className="font-medium">Recent Warranty Claims</h4>
                  {closedData.warrantyTracking.recentClaims.map((claim, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{claim.id}</span>
                          <span className="text-sm text-muted-foreground">{claim.description}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={claim.status === "Resolved" ? "default" : "secondary"} className="text-xs">
                          {claim.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(claim.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Log Warranty Claim
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Warranty Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lessons Learned Tab */}
        <TabsContent value="lessons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Lessons Learned
                <Badge variant="default" className="ml-2">
                  {closedData.lessonsLearned.totalLessons} Lessons
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Lessons by Category */}
                <div className="space-y-3">
                  <h4 className="font-medium">Lessons by Category</h4>
                  {closedData.lessonsLearned.categorizedLessons.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{category.category}</span>
                          <span className="text-sm text-muted-foreground">{category.count} lessons documented</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            category.impact === "High"
                              ? "destructive"
                              : category.impact === "Medium"
                              ? "secondary"
                              : "default"
                          }
                          className="text-xs"
                        >
                          {category.impact} Impact
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Key Lessons */}
                <div className="space-y-3">
                  <h4 className="font-medium">Key Lessons Learned</h4>
                  {closedData.lessonsLearned.keyLessons.map((lesson, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">{lesson.title}</h5>
                        <Badge
                          variant={
                            lesson.impact === "High"
                              ? "destructive"
                              : lesson.impact === "Medium"
                              ? "secondary"
                              : "default"
                          }
                          className="text-xs"
                        >
                          {lesson.impact} Impact
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{lesson.description}</p>
                      <div className="bg-muted/50 p-2 rounded text-sm">
                        <strong>Recommendation:</strong> {lesson.recommendation}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Lesson
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Lessons Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Archive Tab */}
        <TabsContent value="archive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5" />
                Project Archive Management
                <Badge variant="default" className="ml-2">
                  {Math.round(closedData.projectArchival.archivalProgress)}% Complete
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Archive Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Archival Progress</span>
                    <span>{Math.round(closedData.projectArchival.archivalProgress)}%</span>
                  </div>
                  <Progress value={closedData.projectArchival.archivalProgress} className="w-full" />
                </div>

                {/* Document Categories */}
                <div className="space-y-3">
                  <h4 className="font-medium">Document Categories</h4>
                  {closedData.projectArchival.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {category.archived} of {category.total} archived
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={category.status === "Complete" ? "default" : "secondary"} className="text-xs">
                          {category.status}
                        </Badge>
                        <Progress value={(category.archived / category.total) * 100} className="w-20" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Retention Schedule */}
                <div className="space-y-3">
                  <h4 className="font-medium">Retention Schedule</h4>
                  {closedData.projectArchival.retentionSchedule.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{item.category}</span>
                          <span className="text-sm text-muted-foreground">Retain for {item.retention}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={item.status === "Archived" ? "default" : "secondary"} className="text-xs">
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Archive Documents
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Archive Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Team Feedback & Satisfaction
                <Badge variant="default" className="ml-2">
                  {Math.round(closedData.teamFeedback.responseRate)}% Response Rate
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Satisfaction Ratings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(closedData.teamFeedback.averageRatings).map(([key, value], index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                        <span>{value}/5.0</span>
                      </div>
                      <Progress value={(value / 5) * 100} className="w-full" />
                    </div>
                  ))}
                </div>

                {/* Key Feedback Themes */}
                <div className="space-y-3">
                  <h4 className="font-medium">Key Feedback Themes</h4>
                  {closedData.teamFeedback.keyFeedback.map((feedback, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{feedback.aspect}</span>
                          <span className="text-sm text-muted-foreground">Mentioned {feedback.frequency} times</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            feedback.sentiment === "Positive"
                              ? "default"
                              : feedback.sentiment === "Improvement"
                              ? "secondary"
                              : "destructive"
                          }
                          className="text-xs"
                        >
                          {feedback.sentiment}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Collect Additional Feedback
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Feedback Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
