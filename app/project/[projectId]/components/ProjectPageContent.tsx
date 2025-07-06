/**
 * @fileoverview Project Page Content component
 * @module ProjectPageContent
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Main content component that integrates existing page functionality
 * with the new layout and navigation systems.
 */

"use client"

import React, { useEffect, useState, useMemo } from "react"
import { useNavigation } from "../hooks/useNavigation"
import { useLayout } from "../hooks/useLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Calendar, DollarSign, Brain, Users, TrendingUp, FileText, Activity } from "lucide-react"
import type { ProjectData, UserRole } from "../types/project"

/**
 * Props for the ProjectPageContent component
 */
export interface ProjectPageContentProps {
  /** Project ID */
  projectId: string

  /** Current user role */
  userRole: UserRole

  /** Project data */
  projectData?: ProjectData

  /** Existing page content components */
  contentComponents?: {
    FinancialHubContent?: React.ComponentType<any>
    ProcurementContent?: React.ComponentType<any>
    SchedulerContent?: React.ComponentType<any>
    ConstraintsContent?: React.ComponentType<any>
    PermitLogContent?: React.ComponentType<any>
    FieldReportsContent?: React.ComponentType<any>
    ReportsContent?: React.ComponentType<any>
    ChecklistsContent?: React.ComponentType<any>
  }

  /** Additional props for legacy content */
  legacyProps?: Record<string, any>
}

/**
 * ProjectPageContent component - Main content integration
 */
export function ProjectPageContent({
  projectId,
  userRole,
  projectData,
  contentComponents,
  legacyProps = {},
}: ProjectPageContentProps) {
  // Get navigation state from provider
  const { state: navState } = useNavigation()

  // Get layout utilities
  const { state: layoutState } = useLayout()

  // State for content loading
  const [isLoading, setIsLoading] = useState(false)

  // Project metrics calculation
  const projectMetrics = useMemo(() => {
    if (!projectData) return null

    return {
      totalBudget: projectData.contract_value || 0,
      spentToDate: Math.round((projectData.contract_value || 0) * 0.65),
      remainingBudget: Math.round((projectData.contract_value || 0) * 0.35),
      scheduleProgress: calculateScheduleProgress(projectData),
      budgetProgress: 65,
      activeTeamMembers: calculateTeamSize(projectData),
      completedMilestones: 8,
      totalMilestones: 12,
      riskItems: 3,
      activeRFIs: 7,
      changeOrders: 2,
    }
  }, [projectData])

  // Handle content loading
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [navState.committed.tool, navState.committed.subTool])

  // Render tool-specific content
  const renderToolContent = () => {
    if (!navState.committed.tool) return null

    const toolProps = {
      selectedSubTool: navState.committed.subTool || "",
      projectData,
      userRole,
      projectId,
      ...legacyProps,
    }

    switch (navState.committed.tool) {
      case "Financial Hub":
        return contentComponents?.FinancialHubContent ? (
          <contentComponents.FinancialHubContent {...toolProps} />
        ) : (
          <PlaceholderContent tool="Financial Hub" />
        )

      case "Procurement":
        return contentComponents?.ProcurementContent ? (
          <contentComponents.ProcurementContent {...toolProps} />
        ) : (
          <PlaceholderContent tool="Procurement" />
        )

      case "Scheduler":
        return contentComponents?.SchedulerContent ? (
          <contentComponents.SchedulerContent {...toolProps} />
        ) : (
          <PlaceholderContent tool="Scheduler" />
        )

      case "Constraints Log":
        return contentComponents?.ConstraintsContent ? (
          <contentComponents.ConstraintsContent {...toolProps} />
        ) : (
          <PlaceholderContent tool="Constraints Log" />
        )

      case "Permit Log":
        return contentComponents?.PermitLogContent ? (
          <contentComponents.PermitLogContent {...toolProps} />
        ) : (
          <PlaceholderContent tool="Permit Log" />
        )

      case "Field Reports":
        return contentComponents?.FieldReportsContent ? (
          <contentComponents.FieldReportsContent {...toolProps} />
        ) : (
          <PlaceholderContent tool="Field Reports" />
        )

      case "Reports":
        return contentComponents?.ReportsContent ? (
          <contentComponents.ReportsContent {...toolProps} />
        ) : (
          <PlaceholderContent tool="Reports" />
        )

      case "Checklists":
        return contentComponents?.ChecklistsContent ? (
          <contentComponents.ChecklistsContent {...toolProps} />
        ) : (
          <PlaceholderContent tool="Checklists" />
        )

      default:
        return <PlaceholderContent tool={navState.committed.tool || "Unknown Tool"} />
    }
  }

  // Render category dashboard content
  const renderCategoryContent = () => {
    if (!navState.committed.category) return null

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Category Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{navState.committed.category}</div>
              <p className="text-xs text-muted-foreground">Dashboard for {navState.committed.category} management</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Tools available in this category</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Active items requiring attention</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Category Tools</CardTitle>
            <CardDescription>Select a tool from the navigation to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getToolsForCategory(navState.committed.category || "").map((tool) => (
                <div key={tool.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <tool.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{tool.name}</div>
                    <div className="text-sm text-muted-foreground">{tool.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render overview content
  const renderOverviewContent = () => {
    if (!projectData) return null

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project Summary</CardTitle>
              <CardDescription>Key project information and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Project Type</p>
                    <p className="font-medium">{projectData.project_type_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{projectData.duration} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contract Value</p>
                    <p className="font-medium">${projectData.contract_value.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Stage</p>
                    <Badge variant="secondary">{projectData.project_stage_name}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Metrics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project Metrics</CardTitle>
              <CardDescription>Current progress and performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Schedule Progress</p>
                  <p className="font-medium">{projectMetrics?.scheduleProgress}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget Progress</p>
                  <p className="font-medium">{projectMetrics?.budgetProgress}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Team</p>
                  <p className="font-medium">{projectMetrics?.activeTeamMembers} members</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Milestones</p>
                  <p className="font-medium">
                    {projectMetrics?.completedMilestones}/{projectMetrics?.totalMilestones}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration Capabilities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Integration Capabilities</CardTitle>
            <CardDescription>Project management system integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <span className="text-sm">SharePoint Integration</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <span className="text-sm">HBI AI Insights</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="text-sm">Schedule Management</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Financial Tracking</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main content render
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      {/* Tool Content */}
      {navState.committed.tool && renderToolContent()}

      {/* Category Content */}
      {navState.committed.category && !navState.committed.tool && renderCategoryContent()}

      {/* Overview Content */}
      {!navState.committed.category && !navState.committed.tool && renderOverviewContent()}
    </div>
  )
}

/**
 * Placeholder content for tools without implementations
 */
function PlaceholderContent({ tool }: { tool: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{tool}</CardTitle>
        <CardDescription>Tool content will be implemented here</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{tool} content will be displayed here once implemented.</p>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Helper function to calculate schedule progress
 */
function calculateScheduleProgress(projectData: ProjectData): number {
  const stage = projectData.project_stage_name?.toLowerCase()

  switch (stage) {
    case "bidding":
      return 10
    case "pre-construction":
      return 25
    case "construction":
      return 65
    case "closeout":
      return 90
    case "warranty":
      return 95
    case "closed":
      return 100
    default:
      return 50
  }
}

/**
 * Helper function to calculate team size
 */
function calculateTeamSize(projectData: ProjectData): number {
  const baseSize = projectData.contract_value ? Math.floor(projectData.contract_value / 100000) : 10
  return Math.min(Math.max(baseSize, 5), 50)
}

/**
 * Helper function to get tools for a category
 */
function getToolsForCategory(category: string) {
  const categoryTools = {
    "Financial Management": [
      {
        id: "financial-hub",
        name: "Financial Hub",
        description: "Comprehensive financial management",
        icon: DollarSign,
      },
      { id: "procurement", name: "Procurement", description: "Procurement and vendor management", icon: FileText },
    ],
    "Schedule Management": [
      { id: "scheduler", name: "Scheduler", description: "Project scheduling and timeline management", icon: Calendar },
      {
        id: "constraints",
        name: "Constraints Log",
        description: "Track and manage project constraints",
        icon: TrendingUp,
      },
    ],
    "Field Operations": [
      {
        id: "field-reports",
        name: "Field Reports",
        description: "Daily field reports and documentation",
        icon: FileText,
      },
      { id: "permits", name: "Permit Log", description: "Permit tracking and management", icon: Building2 },
    ],
    "Project Management": [
      { id: "reports", name: "Reports", description: "Project reports and documentation", icon: FileText },
      { id: "checklists", name: "Checklists", description: "Project checklists and workflows", icon: Users },
    ],
  }

  return categoryTools[category as keyof typeof categoryTools] || []
}

export default ProjectPageContent
