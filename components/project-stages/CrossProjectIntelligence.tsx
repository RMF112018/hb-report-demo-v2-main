"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Building2,
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  PieChart,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Calendar,
  Users,
  Gauge,
  Filter,
  Download,
  RefreshCw,
  Zap,
  Brain,
} from "lucide-react"

interface CrossProjectIntelligenceProps {
  currentProject: any
  userRole: string
}

interface ProjectComparison {
  projectId: string
  name: string
  stage: string
  schedulePerformance: number
  costPerformance: number
  qualityScore: number
  riskLevel: "low" | "medium" | "high" | "critical"
  completionPercentage: number
  projectType: string
  size: string
  startDate: Date
  predictedCompletion: Date
}

interface BenchmarkMetrics {
  industryAverage: {
    schedulePerformance: number
    costPerformance: number
    qualityScore: number
    safetyScore: number
  }
  companyAverage: {
    schedulePerformance: number
    costPerformance: number
    qualityScore: number
    safetyScore: number
  }
  topPerformers: {
    schedulePerformance: number
    costPerformance: number
    qualityScore: number
    safetyScore: number
  }
}

interface CrossProjectInsight {
  id: string
  type: "pattern" | "benchmark" | "best_practice" | "risk_correlation"
  title: string
  description: string
  affectedProjects: string[]
  confidence: number
  impact: "low" | "medium" | "high" | "critical"
  recommendation: string
  potentialSavings?: number
}

export const CrossProjectIntelligence = ({ currentProject, userRole }: CrossProjectIntelligenceProps) => {
  const [activeTab, setActiveTab] = useState("overview")
  const [projectComparisons, setProjectComparisons] = useState<ProjectComparison[]>([])
  const [benchmarkMetrics, setBenchmarkMetrics] = useState<BenchmarkMetrics | null>(null)
  const [crossProjectInsights, setCrossProjectInsights] = useState<CrossProjectInsight[]>([])
  const [filterStage, setFilterStage] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPortfolioData()
    generateBenchmarkMetrics()
    generateCrossProjectInsights()
    setLoading(false)
  }, [currentProject])

  const loadPortfolioData = () => {
    // Mock portfolio data - in production this would come from API
    const mockProjects: ProjectComparison[] = [
      {
        projectId: "2525840",
        name: "Luxury Beach House - Palm Beach",
        stage: "Construction",
        schedulePerformance: 87.3,
        costPerformance: 82.1,
        qualityScore: 94.7,
        riskLevel: "medium",
        completionPercentage: 67.8,
        projectType: "Residential",
        size: "Large",
        startDate: new Date(2024, 0, 15),
        predictedCompletion: new Date(2024, 11, 15),
      },
      {
        projectId: "2525841",
        name: "Downtown Office Complex",
        stage: "Pre-Construction",
        schedulePerformance: 91.5,
        costPerformance: 88.3,
        qualityScore: 92.1,
        riskLevel: "low",
        completionPercentage: 23.4,
        projectType: "Commercial",
        size: "Extra Large",
        startDate: new Date(2024, 1, 1),
        predictedCompletion: new Date(2025, 5, 30),
      },
      {
        projectId: "2525842",
        name: "Healthcare Facility Renovation",
        stage: "Closeout",
        schedulePerformance: 78.9,
        costPerformance: 85.7,
        qualityScore: 96.3,
        riskLevel: "low",
        completionPercentage: 94.2,
        projectType: "Healthcare",
        size: "Medium",
        startDate: new Date(2023, 8, 1),
        predictedCompletion: new Date(2024, 3, 15),
      },
      {
        projectId: "2525843",
        name: "Retail Shopping Center",
        stage: "Bidding",
        schedulePerformance: 89.2,
        costPerformance: 79.4,
        qualityScore: 88.6,
        riskLevel: "high",
        completionPercentage: 12.1,
        projectType: "Retail",
        size: "Large",
        startDate: new Date(2024, 2, 15),
        predictedCompletion: new Date(2024, 10, 30),
      },
      {
        projectId: "2525844",
        name: "Educational Campus Expansion",
        stage: "Warranty",
        schedulePerformance: 95.1,
        costPerformance: 92.8,
        qualityScore: 97.4,
        riskLevel: "low",
        completionPercentage: 100,
        projectType: "Educational",
        size: "Extra Large",
        startDate: new Date(2023, 3, 1),
        predictedCompletion: new Date(2024, 1, 15),
      },
    ]

    setProjectComparisons(mockProjects)
  }

  const generateBenchmarkMetrics = () => {
    const mockBenchmarks: BenchmarkMetrics = {
      industryAverage: {
        schedulePerformance: 76.2,
        costPerformance: 71.8,
        qualityScore: 84.3,
        safetyScore: 88.9,
      },
      companyAverage: {
        schedulePerformance: 88.4,
        costPerformance: 85.7,
        qualityScore: 93.8,
        safetyScore: 95.2,
      },
      topPerformers: {
        schedulePerformance: 95.1,
        costPerformance: 92.8,
        qualityScore: 97.4,
        safetyScore: 98.6,
      },
    }

    setBenchmarkMetrics(mockBenchmarks)
  }

  const generateCrossProjectInsights = () => {
    const mockInsights: CrossProjectInsight[] = [
      {
        id: "cp-1",
        type: "pattern",
        title: "Weather Impact Pattern Identified",
        description: "Projects starting in Q1 show 15% higher weather-related delays compared to Q2 starts.",
        affectedProjects: ["2525840", "2525841"],
        confidence: 89,
        impact: "medium",
        recommendation:
          "Consider Q2 start dates for future projects when possible, or increase weather contingency for Q1 starts.",
        potentialSavings: 125000,
      },
      {
        id: "cp-2",
        type: "best_practice",
        title: "Quality Protocol Success",
        description:
          "Enhanced inspection protocols from Educational Campus project resulted in 8.3% quality improvement.",
        affectedProjects: ["2525844"],
        confidence: 94,
        impact: "high",
        recommendation: "Implement enhanced inspection protocols across all active projects.",
        potentialSavings: 200000,
      },
      {
        id: "cp-3",
        type: "benchmark",
        title: "Above Industry Performance",
        description:
          "Portfolio performance exceeds industry benchmarks by 12.2% in schedule and 13.9% in cost management.",
        affectedProjects: ["2525840", "2525841", "2525842", "2525843", "2525844"],
        confidence: 97,
        impact: "high",
        recommendation: "Document and standardize current processes for replication across future projects.",
      },
      {
        id: "cp-4",
        type: "risk_correlation",
        title: "Subcontractor Performance Correlation",
        description: "Projects using Contractor A show 23% better schedule performance but 7% higher costs.",
        affectedProjects: ["2525842", "2525844"],
        confidence: 86,
        impact: "medium",
        recommendation: "Optimize contractor selection based on project priorities: schedule vs. cost.",
        potentialSavings: 85000,
      },
    ]

    setCrossProjectInsights(mockInsights)
  }

  const getFilteredProjects = () => {
    return projectComparisons.filter((project) => {
      const stageMatch = filterStage === "all" || project.stage === filterStage
      const typeMatch = filterType === "all" || project.projectType === filterType
      return stageMatch && typeMatch
    })
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "pattern":
        return <TrendingUp className="h-4 w-4 text-blue-600" />
      case "benchmark":
        return <Award className="h-4 w-4 text-purple-600" />
      case "best_practice":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "risk_correlation":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      default:
        return <Brain className="h-4 w-4 text-gray-600" />
    }
  }

  const canAccessPortfolioData = userRole === "admin" || userRole === "executive" || userRole === "project_manager"

  if (!canAccessPortfolioData) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Access Restricted</AlertTitle>
            <AlertDescription>Portfolio-level analytics require executive or admin permissions.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (loading || !benchmarkMetrics) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-4"></div>
            <p className="text-muted-foreground">Loading portfolio analytics...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Cross-Project Intelligence
            </CardTitle>
            <CardDescription>Portfolio-level analytics and cross-project insights</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Badge variant="secondary">{projectComparisons.length} Projects</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
            <TabsTrigger value="insights">Cross-Project Insights</TabsTrigger>
            <TabsTrigger value="comparison">Project Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Portfolio Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Projects</p>
                      <p className="text-2xl font-bold">{projectComparisons.length}</p>
                      <p className="text-xs text-muted-foreground">Portfolio Value: $12.5M</p>
                    </div>
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Schedule Performance</p>
                      <p className="text-2xl font-bold">
                        {Math.round(
                          projectComparisons.reduce((sum, p) => sum + p.schedulePerformance, 0) /
                            projectComparisons.length
                        )}
                        %
                      </p>
                      <p className="text-xs text-green-600">+12.2% vs Industry</p>
                    </div>
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Cost Performance</p>
                      <p className="text-2xl font-bold">
                        {Math.round(
                          projectComparisons.reduce((sum, p) => sum + p.costPerformance, 0) / projectComparisons.length
                        )}
                        %
                      </p>
                      <p className="text-xs text-green-600">+13.9% vs Industry</p>
                    </div>
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                      <DollarSign className="h-5 w-5 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Quality Score</p>
                      <p className="text-2xl font-bold">
                        {Math.round(
                          projectComparisons.reduce((sum, p) => sum + p.qualityScore, 0) / projectComparisons.length
                        )}
                        %
                      </p>
                      <p className="text-xs text-green-600">+9.5% vs Industry</p>
                    </div>
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                      <Award className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Portfolio Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectComparisons.map((project) => (
                    <div key={project.projectId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {project.stage} • {project.projectType} • {project.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Progress</p>
                          <p className="font-medium">{project.completionPercentage}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Schedule</p>
                          <p className="font-medium">{project.schedulePerformance}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Cost</p>
                          <p className="font-medium">{project.costPerformance}%</p>
                        </div>
                        <Badge className={getRiskColor(project.riskLevel)}>{project.riskLevel}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="benchmarks" className="space-y-6">
            {/* Benchmark Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance vs Industry</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Schedule Performance</span>
                        <span>
                          {benchmarkMetrics.companyAverage.schedulePerformance}% vs{" "}
                          {benchmarkMetrics.industryAverage.schedulePerformance}%
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Progress value={benchmarkMetrics.companyAverage.schedulePerformance} className="flex-1" />
                        <Progress
                          value={benchmarkMetrics.industryAverage.schedulePerformance}
                          className="flex-1 opacity-50"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Cost Performance</span>
                        <span>
                          {benchmarkMetrics.companyAverage.costPerformance}% vs{" "}
                          {benchmarkMetrics.industryAverage.costPerformance}%
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Progress value={benchmarkMetrics.companyAverage.costPerformance} className="flex-1" />
                        <Progress
                          value={benchmarkMetrics.industryAverage.costPerformance}
                          className="flex-1 opacity-50"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Quality Score</span>
                        <span>
                          {benchmarkMetrics.companyAverage.qualityScore}% vs{" "}
                          {benchmarkMetrics.industryAverage.qualityScore}%
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Progress value={benchmarkMetrics.companyAverage.qualityScore} className="flex-1" />
                        <Progress value={benchmarkMetrics.industryAverage.qualityScore} className="flex-1 opacity-50" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Safety Score</span>
                        <span>
                          {benchmarkMetrics.companyAverage.safetyScore}% vs{" "}
                          {benchmarkMetrics.industryAverage.safetyScore}%
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Progress value={benchmarkMetrics.companyAverage.safetyScore} className="flex-1" />
                        <Progress value={benchmarkMetrics.industryAverage.safetyScore} className="flex-1 opacity-50" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Performer Comparison</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Schedule Performance</span>
                        <span>
                          {benchmarkMetrics.companyAverage.schedulePerformance}% vs{" "}
                          {benchmarkMetrics.topPerformers.schedulePerformance}%
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Progress value={benchmarkMetrics.companyAverage.schedulePerformance} className="flex-1" />
                        <Progress
                          value={benchmarkMetrics.topPerformers.schedulePerformance}
                          className="flex-1 opacity-50"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Cost Performance</span>
                        <span>
                          {benchmarkMetrics.companyAverage.costPerformance}% vs{" "}
                          {benchmarkMetrics.topPerformers.costPerformance}%
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Progress value={benchmarkMetrics.companyAverage.costPerformance} className="flex-1" />
                        <Progress
                          value={benchmarkMetrics.topPerformers.costPerformance}
                          className="flex-1 opacity-50"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Quality Score</span>
                        <span>
                          {benchmarkMetrics.companyAverage.qualityScore}% vs{" "}
                          {benchmarkMetrics.topPerformers.qualityScore}%
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Progress value={benchmarkMetrics.companyAverage.qualityScore} className="flex-1" />
                        <Progress value={benchmarkMetrics.topPerformers.qualityScore} className="flex-1 opacity-50" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Safety Score</span>
                        <span>
                          {benchmarkMetrics.companyAverage.safetyScore}% vs {benchmarkMetrics.topPerformers.safetyScore}
                          %
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Progress value={benchmarkMetrics.companyAverage.safetyScore} className="flex-1" />
                        <Progress value={benchmarkMetrics.topPerformers.safetyScore} className="flex-1 opacity-50" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="space-y-4">
              {crossProjectInsights.map((insight) => (
                <Card key={insight.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{insight.title}</h4>
                          <Badge variant="outline">{insight.confidence}% confidence</Badge>
                          {insight.potentialSavings && (
                            <Badge variant="secondary">${(insight.potentialSavings / 1000).toFixed(0)}K savings</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>

                        <div className="p-3 bg-muted rounded-lg mb-3">
                          <h5 className="text-sm font-medium mb-1">Recommendation:</h5>
                          <p className="text-sm">{insight.recommendation}</p>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Type: {insight.type}</span>
                          <span>Affected Projects: {insight.affectedProjects.length}</span>
                          <span>Impact: {insight.impact}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <Label>Filters:</Label>
              </div>
              <Select value={filterStage} onValueChange={setFilterStage}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="Bidding">Bidding</SelectItem>
                  <SelectItem value="Pre-Construction">Pre-Construction</SelectItem>
                  <SelectItem value="Construction">Construction</SelectItem>
                  <SelectItem value="Closeout">Closeout</SelectItem>
                  <SelectItem value="Warranty">Warranty</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Educational">Educational</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Detailed Project Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getFilteredProjects().map((project) => (
                    <div key={project.projectId} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {project.stage} • {project.projectType} • Started {project.startDate.toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getRiskColor(project.riskLevel)}>{project.riskLevel} risk</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Completion</p>
                          <div className="flex items-center gap-2">
                            <Progress value={project.completionPercentage} className="flex-1" />
                            <span className="text-sm font-medium">{project.completionPercentage}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Schedule</p>
                          <div className="flex items-center gap-2">
                            <Progress value={project.schedulePerformance} className="flex-1" />
                            <span className="text-sm font-medium">{project.schedulePerformance}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Cost</p>
                          <div className="flex items-center gap-2">
                            <Progress value={project.costPerformance} className="flex-1" />
                            <span className="text-sm font-medium">{project.costPerformance}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Quality</p>
                          <div className="flex items-center gap-2">
                            <Progress value={project.qualityScore} className="flex-1" />
                            <span className="text-sm font-medium">{project.qualityScore}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
