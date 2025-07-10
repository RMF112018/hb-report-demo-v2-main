/**
 * @fileoverview Scheduler Content Component
 * @module SchedulerContent
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Project scheduling and timeline management
 * Extracted from page-legacy.tsx and adapted for modular architecture
 */

"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  BarChart3,
  Activity,
  Zap,
  Brain,
  Monitor,
  GitBranch,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

// Scheduler Components
import SchedulerOverview from "@/components/scheduler/SchedulerOverview"
import ScheduleUpdate from "@/components/scheduler/ScheduleUpdate"
import LookAhead from "@/components/scheduler/LookAhead"
import ScheduleGenerator from "@/components/scheduler/ScheduleGenerator"
import ProjectSchedule from "@/components/scheduler/ProjectSchedule"

// AIAssistantCoach for left sidebar integration
import { AIAssistantCoach } from "@/components/scheduler/update-components/AIAssistantCoach"

// Look Ahead History Manager for left sidebar integration
import LookAheadHistoryManager from "@/components/scheduler/LookAheadHistoryManager"

// Expandable Description Component (same as in ProjectControlCenterContent)
const ExpandableDescription: React.FC<{ description: string }> = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div>
      <div
        className={`text-xs text-foreground leading-relaxed ${isExpanded ? "overflow-visible" : "overflow-hidden"}`}
        style={{
          display: "-webkit-box",
          WebkitLineClamp: isExpanded ? "none" : 3,
          WebkitBoxOrient: "vertical",
          ...(isExpanded ? {} : { maxHeight: "none" }),
        }}
      >
        {description}
      </div>
      <button
        onClick={toggleExpanded}
        className="flex items-center justify-center w-full mt-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
    </div>
  )
}

interface SchedulerContentProps {
  selectedSubTool: string
  projectData: any
  userRole: string
  projectId?: string
  onSubToolChange?: (subTool: string) => void
  onSidebarContentChange?: (content: React.ReactNode) => void
  [key: string]: any
}

export const SchedulerContent: React.FC<SchedulerContentProps> = ({
  selectedSubTool,
  projectData,
  userRole,
  projectId,
  onSubToolChange,
  onSidebarContentChange,
  ...props
}) => {
  const [updatePackage, setUpdatePackage] = useState<any>(null)
  const [aiInsights, setAiInsights] = useState<any[]>([])
  const [filteredActivities, setFilteredActivities] = useState<any[]>([])

  const getProjectScope = () => {
    const scheduleHealth = 87
    const criticalPathDays = 312 // 10m 12d
    const scheduleVarianceDays = -8
    const totalActivities = 1247
    const aiScore = 8.7

    return {
      scheduleHealth,
      criticalPathDays,
      scheduleVarianceDays,
      totalActivities,
      aiScore,
    }
  }

  const schedulerData = getProjectScope()

  // Get dynamic KPIs based on selected sub-tool
  const getSchedulerKPIs = (subTool: string) => {
    const baseKPIs = [
      {
        icon: TrendingUp,
        value: `${schedulerData.scheduleHealth}%`,
        label: "Schedule Health",
        color: "green",
      },
      {
        icon: GitBranch,
        value: `${Math.floor(schedulerData.criticalPathDays / 30)}m ${schedulerData.criticalPathDays % 30}d`,
        label: "Critical Path",
        color: "purple",
      },
      {
        icon: AlertTriangle,
        value: `${schedulerData.scheduleVarianceDays}d`,
        label: "Schedule Variance",
        color: "amber",
      },
    ]

    const subToolKPIs: Record<string, any[]> = {
      overview: [
        {
          icon: Activity,
          value: schedulerData.totalActivities.toLocaleString(),
          label: "Total Activities",
          color: "blue",
        },
        {
          icon: Brain,
          value: `${schedulerData.aiScore}/10`,
          label: "AI Score",
          color: "orange",
        },
        {
          icon: CheckCircle,
          value: "94%",
          label: "On Schedule",
          color: "emerald",
        },
      ],
      "project-schedule": [
        {
          icon: Calendar,
          value: "20",
          label: "Total Activities",
          color: "blue",
        },
        {
          icon: GitBranch,
          value: "10",
          label: "Critical Activities",
          color: "red",
        },
        {
          icon: TrendingUp,
          value: "+2d",
          label: "Schedule Variance",
          color: "orange",
        },
      ],
      update: [
        {
          icon: RefreshCw,
          value: "Latest",
          label: "Update Status",
          color: "blue",
        },
        {
          icon: Clock,
          value: "2h ago",
          label: "Last Update",
          color: "gray",
        },
        {
          icon: CheckCircle,
          value: "Synced",
          label: "Data Status",
          color: "green",
        },
      ],
      "look-ahead": [
        {
          icon: Calendar,
          value: "23",
          label: "Next 2 Weeks",
          color: "blue",
        },
        {
          icon: AlertTriangle,
          value: "5",
          label: "Potential Issues",
          color: "amber",
        },
        {
          icon: CheckCircle,
          value: "18",
          label: "Ready to Start",
          color: "green",
        },
      ],
      generator: [
        {
          icon: Brain,
          value: "AI",
          label: "Auto-Generate",
          color: "purple",
        },
        {
          icon: Clock,
          value: "< 5min",
          label: "Generation Time",
          color: "blue",
        },
        {
          icon: Target,
          value: "98%",
          label: "Accuracy Rate",
          color: "green",
        },
      ],
    }

    return [...baseKPIs, ...(subToolKPIs[subTool] || [])]
  }

  // Generate sidebar content based on selected sub-tool
  React.useEffect(() => {
    if (onSidebarContentChange) {
      if (selectedSubTool === "update") {
        // When Update tab is selected, create custom sidebar content with AIAssistantCoach
        const customSidebarContent = (
          <div className="space-y-4">
            {/* Project Overview Panel - Always visible */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Project Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {/* Project Description with collapsible logic */}
                <div className="pb-3 border-b border-border">
                  <p className="text-xs text-muted-foreground mb-2">Description</p>
                  <ExpandableDescription description={projectData?.description || "No description available"} />
                </div>

                {/* Project Metrics */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contract Value</span>
                    <span className="font-medium">${(projectData?.contract_value || 75000000).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Spent to Date</span>
                    <span className="font-medium">
                      ${((projectData?.contract_value || 75000000) * 0.68).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Schedule Progress</span>
                    <span className="font-medium text-blue-600">72%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Budget Progress</span>
                    <span className="font-medium text-green-600">68%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Team Members</span>
                    <span className="font-medium">24</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* HBI Scheduler Panel - AIAssistantCoach integration */}
            <AIAssistantCoach
              insights={aiInsights}
              activities={filteredActivities}
              onInsightAction={(insightId, action) => {
                console.log("AI insight action:", insightId, action)
              }}
              updatePackage={updatePackage}
              onExport={(format) => {
                console.log("Export format:", format)
              }}
              onDistribute={(recipients) => {
                console.log("Distribute to:", recipients)
              }}
            />
          </div>
        )

        onSidebarContentChange(customSidebarContent)
      } else if (selectedSubTool === "look-ahead") {
        // When Look Ahead tab is selected, create custom sidebar content with Look Ahead History
        const customSidebarContent = (
          <div className="space-y-4">
            {/* Project Overview Panel - Always visible */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Project Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {/* Project Description with collapsible logic */}
                <div className="pb-3 border-b border-border">
                  <p className="text-xs text-muted-foreground mb-2">Description</p>
                  <ExpandableDescription description={projectData?.description || "No description available"} />
                </div>

                {/* Project Metrics */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contract Value</span>
                    <span className="font-medium">${(projectData?.contract_value || 75000000).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Spent to Date</span>
                    <span className="font-medium">
                      ${((projectData?.contract_value || 75000000) * 0.68).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Schedule Progress</span>
                    <span className="font-medium text-blue-600">72%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Budget Progress</span>
                    <span className="font-medium text-green-600">68%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Team Members</span>
                    <span className="font-medium">24</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Look Ahead History Panel */}
            <LookAheadHistoryManager
              projectId={projectId || "default"}
              onCopyEntry={(entry) => {
                console.log("Copy entry:", entry)
              }}
              onViewEntry={(entry) => {
                console.log("View entry:", entry)
              }}
              onDeleteEntry={(entryId) => {
                console.log("Delete entry:", entryId)
              }}
              currentWeek={new Date()}
            />
          </div>
        )

        onSidebarContentChange(customSidebarContent)
      } else {
        // For other tabs, show default sidebar content (null means use default)
        onSidebarContentChange(null)
      }
    }
  }, [selectedSubTool, updatePackage, aiInsights, filteredActivities, onSidebarContentChange, projectData, projectId])

  const renderContent = () => {
    if (!selectedSubTool || selectedSubTool === "overview") {
      return <SchedulerOverview userRole={userRole} projectData={projectData} />
    }

    switch (selectedSubTool) {
      case "project-schedule":
        return <ProjectSchedule userRole={userRole} projectData={projectData} projectId={projectId} />
      case "update":
        return (
          <ScheduleUpdate
            userRole={userRole}
            projectData={projectData}
            projectId={projectId}
            hideAISidebar={true}
            onUpdatePackageChange={setUpdatePackage}
            onAIInsightsChange={setAiInsights}
            onActivitiesChange={setFilteredActivities}
          />
        )
      case "look-ahead":
        return <LookAhead userRole={userRole} projectData={projectData} />
      case "generator":
        return <ScheduleGenerator userRole={userRole} projectData={projectData} />
      default:
        return <SchedulerOverview userRole={userRole} projectData={projectData} />
    }
  }

  // Define available tabs - all tabs shown to all roles for consistent experience
  const getTabsForRole = () => {
    const allTabs = [
      { id: "overview", label: "Overview", icon: BarChart3 },
      { id: "project-schedule", label: "Project Schedule", icon: Calendar },
      { id: "update", label: "Update", icon: RefreshCw },
      { id: "look-ahead", label: "Look Ahead", icon: Calendar },
      { id: "generator", label: "Generator", icon: Brain },
    ]

    // All roles now see all tabs (matching project-manager access)
    return allTabs
  }

  const availableTabs = getTabsForRole()
  const activeTab = selectedSubTool || "overview"

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={onSubToolChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
          {availableTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2 text-sm">
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {availableTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-6 w-full max-w-full overflow-hidden">
            <div className="space-y-4 w-full max-w-full overflow-hidden">
              {/* Tab Content */}
              {renderContent()}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default SchedulerContent
