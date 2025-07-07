/**
 * @fileoverview Project Control Center Content Component
 * @module ProjectControlCenterContent
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Enhanced project control center with:
 * - Dynamic sidebar panels (Key Metrics, HBI Insights)
 * - Tab-based navigation system
 * - Content components for each tool
 * - Role-based access control
 * - Responsive layout with three-column design
 */

"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChevronRight,
  RefreshCw,
  Upload,
  ArrowRight,
  DollarSign,
  TrendingUp,
  Package,
  Clock,
  Calendar,
  Activity,
  FileText,
  CheckCircle,
  AlertTriangle,
  Users,
  Building2,
  BarChart3,
  Brain,
  Monitor,
  Target,
  Zap,
  GitBranch,
  Calculator,
  CreditCard,
  Receipt,
  Percent,
  Settings,
  Info,
} from "lucide-react"
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights"

// Content Components
import { FinancialHubContent } from "./content/FinancialHubContent"
import { ProcurementContent } from "./content/ProcurementContent"
import { SchedulerContent } from "./content/SchedulerContent"

interface ProjectControlCenterContentProps {
  projectId: string
  projectData: any
  userRole: string
  user: any
}

interface NavigationState {
  category: string | null
  tool: string | null
  subTool: string | null
}

const ProjectControlCenterContent: React.FC<ProjectControlCenterContentProps> = ({
  projectId,
  projectData,
  userRole,
  user,
}) => {
  const [navigation, setNavigation] = useState<NavigationState>({
    category: null,
    tool: null,
    subTool: null,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Extract project name from project data
  const projectName = projectData?.name || `Project ${projectId}`

  // Define navigation categories and tools
  const navigationCategories = [
    {
      name: "Core",
      tools: [
        { name: "Project Overview", href: "#" },
        { name: "Dashboard", href: "#" },
        { name: "Team Management", href: "#" },
      ],
    },
    {
      name: "Pre-Construction",
      tools: [
        { name: "Estimating", href: "#" },
        { name: "Bidding", href: "#" },
        { name: "Contract Review", href: "#" },
      ],
    },
    {
      name: "Financial Management",
      tools: [
        { name: "Financial Hub", href: "#" },
        { name: "Budget Analysis", href: "#" },
        { name: "Cost Tracking", href: "#" },
      ],
    },
    {
      name: "Field Management",
      tools: [
        { name: "Procurement", href: "#" },
        { name: "Scheduler", href: "#" },
        { name: "Field Reports", href: "#" },
        { name: "Constraints Log", href: "#" },
      ],
    },
    {
      name: "Compliance",
      tools: [
        { name: "Permit Log", href: "#" },
        { name: "Safety Reports", href: "#" },
        { name: "Quality Control", href: "#" },
      ],
    },
    {
      name: "Warranty",
      tools: [
        { name: "Warranty Tracking", href: "#" },
        { name: "Closeout", href: "#" },
        { name: "Maintenance", href: "#" },
      ],
    },
  ]

  // Get key metrics based on selected tool
  const getKeyMetrics = () => {
    if (navigation.tool === "Financial Hub") {
      return [
        {
          label: "Contract Value",
          value: `$${projectData?.contract_value?.toLocaleString() || "57,235,491"}`,
          color: "blue",
        },
        { label: "Net Cash Flow", value: "$8,215,007", color: "green" },
        { label: "Profit Margin", value: "6.8%", color: "purple" },
        { label: "Pending Approvals", value: "3", color: "orange" },
        { label: "Financial Health", value: "88%", color: "emerald" },
      ]
    } else if (navigation.tool === "Procurement") {
      return [
        { label: "Total Contract Value", value: "$2.63M", color: "green" },
        { label: "Active Procurements", value: "1", color: "blue" },
        { label: "Avg Cycle Time", value: "28 days", color: "purple" },
        { label: "Compliance Rate", value: "75%", color: "emerald" },
        { label: "Vendor Count", value: "2", color: "indigo" },
      ]
    } else if (navigation.tool === "Scheduler") {
      return [
        { label: "Schedule Health", value: "87%", color: "green" },
        { label: "Critical Path", value: "10m 12d", color: "purple" },
        { label: "Schedule Variance", value: "-8d", color: "amber" },
        { label: "Total Activities", value: "1,247", color: "blue" },
        { label: "AI Score", value: "8.7/10", color: "orange" },
      ]
    } else if (navigation.tool === "Constraints Log") {
      return [
        { label: "Total Constraints", value: "3", color: "blue" },
        { label: "Open", value: "2", color: "orange" },
        { label: "Closed", value: "1", color: "green" },
        { label: "Overdue", value: "1", color: "red" },
        { label: "Avg Resolution Time", value: "12 days", color: "purple" },
      ]
    } else if (navigation.tool === "Permit Log") {
      return [
        { label: "Total Permits", value: "3", color: "blue" },
        { label: "Approved", value: "1", color: "green" },
        { label: "Pending", value: "1", color: "orange" },
        { label: "Expired", value: "1", color: "red" },
        { label: "Pass Rate", value: "50%", color: "purple" },
      ]
    } else if (navigation.tool === "Field Reports") {
      return [
        { label: "Total Logs", value: "15", color: "blue" },
        { label: "Compliance Rate", value: "92.3%", color: "green" },
        { label: "Total Workers", value: "184", color: "purple" },
        { label: "Safety Score", value: "96.7%", color: "orange" },
        { label: "Quality Pass Rate", value: "88.9%", color: "emerald" },
      ]
    }

    // Default project metrics
    return [
      { label: "Milestones", value: "8/12", color: "green" },
      { label: "Active RFIs", value: "5", color: "blue" },
      { label: "Change Orders", value: "3", color: "orange" },
      { label: "Risk Items", value: "2", color: "red" },
    ]
  }

  // Get HBI insights based on selected tool
  const getHBIInsights = () => {
    if (navigation.tool === "Financial Hub") {
      return [
        {
          id: "financial-1",
          type: "alert",
          severity: "medium",
          title: "Budget Variance Detected",
          text: "Current spending rate suggests potential budget overrun by 2.8% if trends continue.",
          action: "Review budget allocation",
          timestamp: "2 hours ago",
        },
        {
          id: "financial-2",
          type: "recommendation",
          severity: "low",
          title: "Cash Flow Optimization",
          text: "Consider accelerating AR collection to improve cash flow by 15%.",
          action: "Review AR aging",
          timestamp: "1 day ago",
        },
      ]
    } else if (navigation.tool === "Procurement") {
      return [
        {
          id: "procurement-1",
          type: "alert",
          severity: "high",
          title: "Vendor Performance Issue",
          text: "Vendor compliance rate below target. Review vendor performance metrics.",
          action: "Schedule vendor review",
          timestamp: "1 hour ago",
        },
      ]
    } else if (navigation.tool === "Scheduler") {
      return [
        {
          id: "scheduler-1",
          type: "recommendation",
          severity: "medium",
          title: "Schedule Optimization",
          text: "AI analysis suggests 3 activities can be optimized to recover 5 days.",
          action: "Review schedule",
          timestamp: "3 hours ago",
        },
      ]
    }

    return [
      {
        id: "project-1",
        type: "info",
        severity: "low",
        title: "Project Status Update",
        text: "Project is progressing well with all major milestones on track.",
        action: "View details",
        timestamp: "1 day ago",
      },
    ]
  }

  // Handle tool selection
  const handleToolSelect = (toolName: string) => {
    setNavigation((prev) => ({
      ...prev,
      tool: toolName,
      subTool: null,
    }))
  }

  // Handle category selection
  const handleCategorySelect = (categoryName: string) => {
    setNavigation((prev) => ({
      ...prev,
      category: prev.category === categoryName ? null : categoryName,
      tool: null,
      subTool: null,
    }))
  }

  // Handle refresh
  const handleRefresh = () => {
    // Implement refresh logic
  }

  // Render main content based on selected tool
  const renderMainContent = () => {
    if (!navigation.tool) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Project Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Project Type</p>
                      <p className="font-medium">{projectData?.project_type_name || "Commercial"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">{projectData?.duration || "365"} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Contract Value</p>
                      <p className="font-medium">${projectData?.contract_value?.toLocaleString() || "57,235,491"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Stage</p>
                      <p className="font-medium">{projectData?.project_stage_name || "Construction"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Metrics Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Project Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Schedule Progress</p>
                    <p className="font-medium">72%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Budget Progress</p>
                    <p className="font-medium">68%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Team</p>
                    <p className="font-medium">24 members</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Milestones</p>
                    <p className="font-medium">8/12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    // Render specific tool content
    switch (navigation.tool) {
      case "Financial Hub":
        return (
          <FinancialHubContent
            selectedSubTool={navigation.subTool || ""}
            projectData={projectData}
            userRole={userRole}
          />
        )
      case "Procurement":
        return (
          <ProcurementContent
            selectedSubTool={navigation.subTool || ""}
            projectData={projectData}
            userRole={userRole}
          />
        )
      case "Scheduler":
        return (
          <SchedulerContent selectedSubTool={navigation.subTool || ""} projectData={projectData} userRole={userRole} />
        )
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{navigation.tool}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{navigation.tool} content will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          {user.firstName} {user.lastName}
        </span>
        <ChevronRight className="h-4 w-4" />
        <span>{projectName} Control Center</span>
        {navigation.tool && (
          <>
            <ChevronRight className="h-4 w-4" />
            <span>{navigation.tool}</span>
          </>
        )}
      </div>

      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{projectName} Control Center</h1>
          <p className="text-muted-foreground">
            Comprehensive project management and tracking with integrated workflow optimization
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-medium">
              Contract Value: ${projectData?.contract_value?.toLocaleString() || "57,235,491"}
            </div>
            <div className="text-xs text-muted-foreground">
              {projectData?.project_stage_name || "Construction Phase"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
          {/* HB Logo - Static across all project navigation */}
          <div className="flex-shrink-0">
            <img src="/images/HB_Logo_Large.png" alt="Hedrick Brothers Construction" className="h-12 w-auto" />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-card border border-border rounded-lg">
        <div className="border-b border-border">
          <div className="flex">
            {navigationCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategorySelect(category.name)}
                className={`flex-1 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  navigation.category === category.name
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Sidebar Panels */}
        <div className="xl:col-span-3 space-y-4">
          {/* Tools for Selected Category */}
          {navigation.category && (
            <div className="bg-card border border-border rounded-lg p-3">
              <h3 className="font-semibold text-sm mb-3 text-foreground">{navigation.category} Tools</h3>
              <div className="space-y-1">
                {navigationCategories
                  .find((cat) => cat.name === navigation.category)
                  ?.tools.map((tool) => (
                    <Button
                      key={tool.name}
                      variant={navigation.tool === tool.name ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => handleToolSelect(tool.name)}
                    >
                      {tool.name}
                    </Button>
                  ))}
              </div>
            </div>
          )}

          {/* Key Metrics Panel */}
          <div className="bg-card border border-border rounded-lg">
            <div className="p-3 border-b border-border">
              <h3 className="font-semibold text-sm text-foreground">Key Metrics</h3>
            </div>
            <div className="p-3 space-y-3">
              {getKeyMetrics().map((metric, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className={`font-medium text-${metric.color}-600`}>{metric.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* HBI Insights Panel */}
          <div className="bg-card border border-border rounded-lg">
            <div className="p-3 border-b border-border">
              <h3 className="font-semibold text-sm text-foreground">
                {navigation.tool ? `HBI ${navigation.tool} Insights` : "HBI Project Insights"}
              </h3>
            </div>
            <div className="p-0 h-80">
              <EnhancedHBIInsights config={getHBIInsights()} />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="xl:col-span-9 space-y-4 lg:space-y-6">
          {/* Module Header */}
          <div className="bg-card rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{navigation.tool || "Project Overview"}</h2>
                <p className="text-sm text-muted-foreground">
                  {navigation.tool ? `${navigation.tool} management and tracking` : "Project overview and key metrics"}
                </p>
              </div>
            </div>

            {/* Dynamic Content */}
            <div className="w-full">{renderMainContent()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectControlCenterContent
