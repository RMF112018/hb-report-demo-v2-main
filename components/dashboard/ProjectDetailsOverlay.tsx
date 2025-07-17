"use client"

import React, { useState, useEffect } from "react"
import {
  X,
  MapPin,
  Calendar,
  DollarSign,
  Building,
  Users,
  Clock,
  TrendingUp,
  FileText,
  CheckCircle,
  BarChart3,
  AlertTriangle,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface ProjectDetailsOverlayProps {
  cardId: string
  cardType: string
  cardTitle: string
  onClose: () => void
}

interface ProjectData {
  project_id: number
  name: string
  display_name: string
  project_number: string
  project_type_name: string
  delivery_method: string
  address: string
  city: string
  state_code: string
  zip: string
  county: string
  active: boolean
  start_date: string
  actual_start_date: string | null
  completion_date: string | null
  projected_finish_date: string
  duration: number
  contract_value: number
  approved_changes: number
  contingency_original: number
  contingency_approved: number
  total_value: number
  square_feet: number
  sector: string
  work_scope: string
  project_stage_name: string
  description: string
  phone: string
  created_by_name: string
  created_at: string
  updated_at: string
}

// Mock associations between card types and project IDs
const getProjectAssociations = (cardType: string): number[] => {
  const associations: Record<string, number[]> = {
    "portfolio-overview": [2525840, 2525841, 2525842, 2525843],
    "project-overview": [2525840, 2525841],
    "financial-status": [2525840, 2525841, 2525842],
    "financial-review-panel": [2525840, 2525841, 2525842, 2525843],
    "cash-flow": [2525840, 2525841, 2525842],
    procurement: [2525840, 2525841, 2525842, 2525843],
    "schedule-performance": [2525840, 2525841, 2525842],
    "critical-dates": [2525840, 2525841, 2525842],
    "bd-opportunities": [2525841, 2525842, 2525843],
    "staffing-distribution": [2525840, 2525841, 2525842],
    "field-reports": [2525840, 2525841, 2525842],
    safety: [2525840, 2525841, 2525842],
    "quality-control": [2525840, 2525841, 2525842],
    "change-order-analysis": [2525840, 2525841, 2525842],
    "general-conditions": [2525840, 2525841, 2525842, 2525843],
    "contingency-analysis": [2525840, 2525841, 2525842, 2525843],
    "draw-forecast": [2525840, 2525841, 2525842],
    "enhanced-hbi-insights": [2525840, 2525841, 2525842, 2525843],
    "pipeline-analytics": [2525841, 2525842, 2525843],
    "market-intelligence": [2525840, 2525841, 2525842, 2525843],
    "schedule-monitor": [2525840, 2525841, 2525842],
    closeout: [2525842, 2525843],
    startup: [2525840, 2525841],
    rfi: [2525840, 2525841, 2525842],
    submittal: [2525840, 2525841, 2525842],
    health: [2525840, 2525841, 2525842, 2525843],
  }

  return associations[cardType] || [2525840, 2525841] // Default fallback
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const getStageColor = (stage: string): string => {
  switch (stage.toLowerCase()) {
    case "preconstruction":
      return "bg-blue-100 text-blue-700 border-blue-200"
    case "bidding":
      return "bg-yellow-100 text-yellow-700 border-yellow-200"
    case "construction":
      return "bg-green-100 text-green-700 border-green-200"
    case "closeout":
      return "bg-purple-100 text-purple-700 border-purple-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

// Card-specific insight configurations
const getCardInsights = (cardType: string, cardTitle: string) => {
  const insights = {
    "portfolio-overview": {
      title: "Portfolio Analytics",
      description: "Comprehensive portfolio performance metrics and trends",
      metrics: [
        { label: "Total Active Projects", value: "17", trend: "+2 from last month", icon: Building },
        { label: "Portfolio Value", value: "$420M", trend: "+12.5% YoY", icon: DollarSign },
        { label: "Average Project Duration", value: "8.5 months", trend: "-0.3 months", icon: Calendar },
        { label: "Success Rate", value: "94%", trend: "+2% from last year", icon: CheckCircle },
      ],
      insights: [
        "Strong performance in commercial sector projects",
        "Residential projects showing increased profit margins",
        "Schedule adherence improved by 15% this quarter",
        "Customer satisfaction ratings at all-time high",
      ],
    },
    "financial-status": {
      title: "Financial Performance Analytics",
      description: "Real-time financial metrics and cash flow analysis",
      metrics: [
        { label: "Monthly Revenue", value: "$12.3M", trend: "+8.2% vs target", icon: DollarSign },
        { label: "Gross Margin", value: "18.5%", trend: "+1.2% from last month", icon: TrendingUp },
        { label: "Working Capital", value: "$8.7M", trend: "Healthy position", icon: BarChart3 },
        { label: "Invoice Processing", value: "4.2 days", trend: "2 days faster", icon: Calendar },
      ],
      insights: [
        "Cash flow positive across all active projects",
        "Reduced overhead costs by 6% through efficiency gains",
        "Improved collection times contributing to better margins",
        "Strong financial position for upcoming opportunities",
      ],
    },
    "schedule-performance": {
      title: "Schedule Performance Analytics",
      description: "Project timeline analysis and critical path insights",
      metrics: [
        { label: "On-Time Delivery", value: "89%", trend: "+5% improvement", icon: CheckCircle },
        { label: "Average Delay", value: "2.1 days", trend: "-1.3 days improved", icon: Calendar },
        { label: "Critical Path Items", value: "12", trend: "3 resolved this week", icon: AlertTriangle },
        { label: "Schedule Variance", value: "-3%", trend: "Ahead of schedule", icon: TrendingUp },
      ],
      insights: [
        "Weather delays decreased significantly this quarter",
        "Improved coordination with trade partners reducing conflicts",
        "Early material procurement preventing schedule impacts",
        "Proactive issue resolution keeping projects on track",
      ],
    },
    "cash-flow": {
      title: "Cash Flow Analytics",
      description: "Detailed cash flow patterns and forecasting",
      metrics: [
        { label: "Current Cash Position", value: "$6.2M", trend: "+$1.1M from last month", icon: DollarSign },
        { label: "Monthly Burn Rate", value: "$2.8M", trend: "Within projections", icon: TrendingUp },
        { label: "Days Cash on Hand", value: "67 days", trend: "+12 days buffer", icon: Calendar },
        { label: "Collection Efficiency", value: "92%", trend: "+3% improvement", icon: CheckCircle },
      ],
      insights: [
        "Strong cash generation from completed projects",
        "Improved payment terms with major clients",
        "Reduced accounts receivable aging",
        "Adequate liquidity for growth opportunities",
      ],
    },
    "enhanced-hbi-insights": {
      title: "HBI Analytics Dashboard",
      description: "AI-powered insights and predictive analytics",
      metrics: [
        { label: "Risk Score", value: "Low", trend: "Improved from medium", icon: CheckCircle },
        { label: "Opportunity Score", value: "High", trend: "3 new opportunities", icon: TrendingUp },
        { label: "Efficiency Index", value: "87%", trend: "+4% this quarter", icon: BarChart3 },
        { label: "Predictive Accuracy", value: "94%", trend: "Model performing well", icon: CheckCircle },
      ],
      insights: [
        "AI models identify cost-saving opportunities worth $2.3M",
        "Predictive maintenance reducing equipment downtime",
        "Resource optimization improving project margins",
        "Market intelligence driving strategic decisions",
      ],
    },
  }

  return (
    insights[cardType as keyof typeof insights] || {
      title: `${cardTitle} Analytics`,
      description: "Detailed analytics and performance insights",
      metrics: [
        { label: "Performance Score", value: "Good", trend: "Stable", icon: TrendingUp },
        { label: "Key Metrics", value: "Tracking", trend: "On target", icon: BarChart3 },
        { label: "Status", value: "Active", trend: "Operational", icon: CheckCircle },
        { label: "Data Quality", value: "High", trend: "Validated", icon: CheckCircle },
      ],
      insights: [
        "Data collection and analysis in progress",
        "Performance tracking across key indicators",
        "Trend analysis showing positive direction",
        "Insights generated from historical patterns",
      ],
    }
  )
}

export const ProjectDetailsOverlay: React.FC<ProjectDetailsOverlayProps> = ({
  cardId,
  cardType,
  cardTitle,
  onClose,
}) => {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [headerOffset, setHeaderOffset] = useState(220) // Default conservative estimate

  const cardInsights = getCardInsights(cardType, cardTitle)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/data/mock/projects.json")
        if (!response.ok) {
          throw new Error("Failed to fetch projects")
        }
        const allProjects: ProjectData[] = await response.json()

        // Filter projects based on card type associations
        const associatedProjectIds = getProjectAssociations(cardType)
        const filteredProjects = allProjects.filter((project) => associatedProjectIds.includes(project.project_id))

        setProjects(filteredProjects)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [cardType])

  // Calculate dynamic header offset
  useEffect(() => {
    const calculateHeaderOffset = () => {
      if (typeof window !== "undefined") {
        // Look for the sticky page header element
        const stickyHeader = document.querySelector('[data-tour="dashboard-page-header"]') as HTMLElement
        if (stickyHeader) {
          const rect = stickyHeader.getBoundingClientRect()
          const offset = rect.bottom + window.scrollY
          setHeaderOffset(offset)
        } else {
          // Fallback: look for any sticky header in the dashboard
          const fallbackHeader = document.querySelector(".sticky") as HTMLElement
          if (fallbackHeader) {
            const rect = fallbackHeader.getBoundingClientRect()
            const offset = rect.bottom + window.scrollY
            setHeaderOffset(offset)
          }
        }
      }
    }

    // Calculate immediately
    calculateHeaderOffset()

    // Recalculate on scroll (for sticky behavior)
    const handleScroll = () => calculateHeaderOffset()
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = "unset"
      }
    }
  }, [])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Loading state with maximum z-index
  if (loading) {
    return (
      <>
        {/* Backdrop that covers area below page header */}
        <div
          className="fixed left-0 right-0 bottom-0 z-[999998] bg-black/70 backdrop-blur-sm"
          style={{ top: `${headerOffset}px` }}
        />

        {/* Loading Content - centered in remaining space */}
        <div
          className="fixed left-4 right-4 bottom-4 z-[999999] flex justify-center items-center"
          style={{ top: `${headerOffset}px` }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 max-w-sm mx-4">
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-gray-900 dark:text-gray-100 font-medium text-lg">Loading analytics...</span>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Error state with maximum z-index
  if (error) {
    return (
      <>
        {/* Backdrop that covers area below page header */}
        <div
          className="fixed left-0 right-0 bottom-0 z-[999998] bg-black/70 backdrop-blur-sm"
          style={{ top: `${headerOffset}px` }}
          onClick={onClose}
        />

        {/* Error Content - centered in remaining space */}
        <div
          className="fixed left-4 right-4 bottom-4 z-[999999] flex justify-center items-center"
          style={{ top: `${headerOffset}px` }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Error Loading Analytics</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{error}</p>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button onClick={onClose} className="w-full">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Main overlay with maximum z-index
  return (
    <>
      {/* Backdrop that covers area below page header */}
      <div
        className="fixed left-0 right-0 bottom-0 z-[999998] bg-black/70 backdrop-blur-sm"
        style={{ top: `${headerOffset}px` }}
        onClick={handleOverlayClick}
      />

      {/* Modal Content - centered in remaining space with equal padding */}
      <div
        className="fixed left-4 right-4 bottom-4 z-[999999] flex justify-center items-center p-4"
        style={{ top: `${headerOffset}px` }}
      >
        <div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-5xl h-full flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Fixed */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{cardInsights.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{cardInsights.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-10 w-10 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-8">
              {/* Production Version Notice */}
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>Production Version:</strong> This application will display the underlying data relevant to the{" "}
                  <strong>{cardTitle}</strong> metric broken down by project, including detailed analytics, trends, and
                  actionable insights.
                </AlertDescription>
              </Alert>

              {/* Key Metrics */}
              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold">Key Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {cardInsights.metrics.map((metric, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                      >
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center shrink-0">
                          <metric.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                              {metric.label}
                            </span>
                            <span className="text-xl font-bold text-gray-900 dark:text-gray-100 ml-2">
                              {metric.value}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{metric.trend}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Key Insights */}
              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold">Analytics Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cardInsights.insights.map((insight, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{insight}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Associated Projects */}
              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold">Associated Projects</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Projects contributing to these metrics</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <div
                        key={project.project_id}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center shrink-0">
                            <Building className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {project.display_name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {project.city}, {project.state_code}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 shrink-0">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs font-medium",
                              project.project_stage_name === "Construction"
                                ? "border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-400 dark:bg-green-900/20"
                                : project.project_stage_name === "Bidding"
                                ? "border-yellow-200 text-yellow-700 bg-yellow-50 dark:border-yellow-800 dark:text-yellow-400 dark:bg-yellow-900/20"
                                : "border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:bg-blue-900/20"
                            )}
                          >
                            {project.project_stage_name}
                          </Badge>
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            ${(project.total_value / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Footer Message */}
              <div className="text-center py-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  This is a demonstration view. The production version will include detailed drill-down capabilities,
                  interactive charts, and comprehensive project-level breakdowns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
