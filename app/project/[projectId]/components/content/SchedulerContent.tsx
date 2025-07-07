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
} from "lucide-react"

// Scheduler Components
import SchedulerOverview from "@/components/scheduler/SchedulerOverview"
import ScheduleMonitor from "@/components/scheduler/ScheduleMonitor"
import HealthAnalysis from "@/components/scheduler/HealthAnalysis"
import LookAhead from "@/components/scheduler/LookAhead"
import ScheduleGenerator from "@/components/scheduler/ScheduleGenerator"

interface SchedulerContentProps {
  selectedSubTool: string
  projectData: any
  userRole: string
}

export const SchedulerContent: React.FC<SchedulerContentProps> = ({ selectedSubTool, projectData, userRole }) => {
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
      "health-analysis": [
        {
          icon: Target,
          value: "92%",
          label: "Progress Accuracy",
          color: "green",
        },
        {
          icon: Zap,
          value: "3",
          label: "Critical Issues",
          color: "red",
        },
        {
          icon: Monitor,
          value: "15",
          label: "Monitored Tasks",
          color: "blue",
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
      "schedule-generator": [
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
      case "schedule-monitor":
        return <ScheduleMonitor userRole={userRole} projectData={projectData} />
      case "health-analysis":
        return <HealthAnalysis userRole={userRole} projectData={projectData} />
      case "look-ahead":
        return <LookAhead userRole={userRole} projectData={projectData} />
      case "schedule-generator":
        return <ScheduleGenerator userRole={userRole} projectData={projectData} />
      default:
        return <SchedulerOverview userRole={userRole} projectData={projectData} />
    }
  }

  // Define available tabs based on user role
  const getTabsForRole = () => {
    const allTabs = [
      { id: "overview", label: "Overview", icon: BarChart3 },
      { id: "schedule-monitor", label: "Monitor", icon: Monitor },
      { id: "health-analysis", label: "Health Analysis", icon: Activity },
      { id: "look-ahead", label: "Look Ahead", icon: Calendar },
      { id: "schedule-generator", label: "Generator", icon: Brain },
    ]

    // Filter tabs based on user role
    if (userRole === "executive") {
      return allTabs.filter((tab) => ["overview", "health-analysis", "look-ahead"].includes(tab.id))
    } else if (userRole === "project-executive") {
      return allTabs.filter((tab) => !["schedule-generator"].includes(tab.id))
    }

    return allTabs
  }

  const availableTabs = getTabsForRole()
  const activeTab = selectedSubTool || "overview"

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
          {availableTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2 text-sm">
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {availableTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-6">
            <div className="space-y-4">
              {/* Tab-specific KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {getSchedulerKPIs(tab.id).map((kpi, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <kpi.icon className={`h-5 w-5 text-${kpi.color}-600`} />
                        <div>
                          <p className="text-sm font-medium">{kpi.value}</p>
                          <p className="text-xs text-muted-foreground">{kpi.label}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

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
