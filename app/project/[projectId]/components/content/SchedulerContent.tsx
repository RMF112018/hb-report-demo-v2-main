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

import React, { useState } from "react"
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
} from "lucide-react"

// Scheduler Components
import SchedulerOverview from "@/components/scheduler/SchedulerOverview"
import ScheduleUpdate from "@/components/scheduler/ScheduleUpdate"
import LookAhead from "@/components/scheduler/LookAhead"
import ScheduleGenerator from "@/components/scheduler/ScheduleGenerator"
import ProjectSchedule from "@/components/scheduler/ProjectSchedule"

interface SchedulerContentProps {
  selectedSubTool: string
  projectData: any
  userRole: string
  projectId?: string
  onSubToolChange?: (subTool: string) => void
  [key: string]: any
}

export const SchedulerContent: React.FC<SchedulerContentProps> = ({
  selectedSubTool,
  projectData,
  userRole,
  projectId,
  onSubToolChange,
  ...props
}) => {
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

  const renderContent = () => {
    if (!selectedSubTool || selectedSubTool === "overview") {
      return <SchedulerOverview userRole={userRole} projectData={projectData} />
    }

    switch (selectedSubTool) {
      case "project-schedule":
        return <ProjectSchedule userRole={userRole} projectData={projectData} projectId={projectId} />
      case "update":
        return <ScheduleUpdate userRole={userRole} projectData={projectData} projectId={projectId} />
      case "look-ahead":
        return <LookAhead userRole={userRole} projectData={projectData} />
      case "generator":
        return <ScheduleGenerator userRole={userRole} projectData={projectData} />
      default:
        return <SchedulerOverview userRole={userRole} projectData={projectData} />
    }
  }

  // Define available tabs based on user role
  const getTabsForRole = () => {
    const allTabs = [
      { id: "overview", label: "Overview", icon: BarChart3 },
      { id: "project-schedule", label: "Project Schedule", icon: Calendar },
      { id: "update", label: "Update", icon: RefreshCw },
      { id: "look-ahead", label: "Look Ahead", icon: Calendar },
      { id: "generator", label: "Generator", icon: Brain },
    ]

    // Filter tabs based on user role
    if (userRole === "executive") {
      return allTabs.filter((tab) => ["overview", "project-schedule", "look-ahead"].includes(tab.id))
    } else if (userRole === "project-executive") {
      return allTabs.filter((tab) => !["generator"].includes(tab.id))
    }

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
