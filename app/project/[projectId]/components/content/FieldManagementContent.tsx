/**
 * @fileoverview Field Management Content Component
 * @module FieldManagementContent
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Field operations management with sub-tools for Scheduler, Constraints Log, Permit Log, and Field Reports
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
  Shield,
  ClipboardList,
  Users,
  Building2,
  FileText,
  MapPin,
  Wrench,
} from "lucide-react"

interface FieldManagementContentProps {
  selectedSubTool: string
  projectData: any
  userRole: string
  projectId?: string
  [key: string]: any
}

export const FieldManagementContent: React.FC<FieldManagementContentProps> = ({
  selectedSubTool,
  projectData,
  userRole,
  projectId,
  ...props
}) => {
  const [activeTab, setActiveTab] = useState("overview")

  const getProjectScope = () => {
    const fieldOperationsScore = 92
    const activeConstraints = 7
    const pendingPermits = 3
    const dailyReports = 145
    const fieldEfficiency = 87.5

    return {
      fieldOperationsScore,
      activeConstraints,
      pendingPermits,
      dailyReports,
      fieldEfficiency,
    }
  }

  const fieldData = getProjectScope()

  // Get dynamic KPIs based on selected sub-tool
  const getFieldManagementKPIs = (subTool: string) => {
    const baseKPIs = [
      {
        icon: TrendingUp,
        value: `${fieldData.fieldOperationsScore}%`,
        label: "Field Operations Score",
        color: "green",
      },
      {
        icon: AlertTriangle,
        value: fieldData.activeConstraints,
        label: "Active Constraints",
        color: "amber",
      },
      {
        icon: Shield,
        value: fieldData.pendingPermits,
        label: "Pending Permits",
        color: "blue",
      },
    ]

    const subToolKPIs: Record<string, any[]> = {
      scheduler: [
        {
          icon: Calendar,
          value: "87%",
          label: "Schedule Health",
          color: "green",
        },
        {
          icon: Clock,
          value: "312d",
          label: "Critical Path",
          color: "purple",
        },
        {
          icon: Activity,
          value: "1,247",
          label: "Total Activities",
          color: "blue",
        },
      ],
      "constraints-log": [
        {
          icon: MapPin,
          value: "15",
          label: "Open Constraints",
          color: "red",
        },
        {
          icon: CheckCircle,
          value: "28",
          label: "Resolved This Month",
          color: "green",
        },
        {
          icon: Clock,
          value: "3.2d",
          label: "Avg Resolution Time",
          color: "blue",
        },
      ],
      "permit-log": [
        {
          icon: FileText,
          value: "42",
          label: "Total Permits",
          color: "blue",
        },
        {
          icon: CheckCircle,
          value: "39",
          label: "Approved",
          color: "green",
        },
        {
          icon: Clock,
          value: "12d",
          label: "Avg Approval Time",
          color: "amber",
        },
      ],
      "field-reports": [
        {
          icon: ClipboardList,
          value: fieldData.dailyReports,
          label: "Daily Reports",
          color: "blue",
        },
        {
          icon: Users,
          value: "847",
          label: "Total Manpower",
          color: "purple",
        },
        {
          icon: Target,
          value: `${fieldData.fieldEfficiency}%`,
          label: "Field Efficiency",
          color: "green",
        },
      ],
    }

    return [...baseKPIs, ...(subToolKPIs[subTool] || [])]
  }

  const renderContent = () => {
    if (!selectedSubTool || selectedSubTool === "overview") {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Field Operations Overview
                </CardTitle>
                <CardDescription>Comprehensive view of field management activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Field Score</p>
                      <p className="font-medium text-lg text-foreground">{fieldData.fieldOperationsScore}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Efficiency</p>
                      <p className="font-medium text-lg text-foreground">{fieldData.fieldEfficiency}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Key Metrics
                </CardTitle>
                <CardDescription>Current field management status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Constraints</p>
                      <p className="font-medium text-lg text-foreground">{fieldData.activeConstraints}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Pending Permits</p>
                      <p className="font-medium text-lg text-foreground">{fieldData.pendingPermits}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Field Management Tools
            </CardTitle>
            <CardDescription>Content for {selectedSubTool} will be displayed here</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This content will be populated with specific components for {selectedSubTool} in future development
              phases.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Define available tabs based on user role
  const getTabsForRole = () => {
    const allTabs = [
      { id: "scheduler", label: "Scheduler", icon: Calendar },
      { id: "constraints-log", label: "Constraints Log", icon: AlertTriangle },
      { id: "permit-log", label: "Permit Log", icon: Shield },
      { id: "field-reports", label: "Field Reports", icon: ClipboardList },
    ]

    // Filter tabs based on user role
    return allTabs.filter((tab) => {
      if (userRole === "viewer") return ["scheduler", "field-reports"].includes(tab.id)
      if (userRole === "team-member") return ["scheduler", "constraints-log", "field-reports"].includes(tab.id)
      return true // All other roles can see all tabs
    })
  }

  const availableTabs = getTabsForRole()
  const kpis = getFieldManagementKPIs(selectedSubTool)

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Field Management Tools</h3>
          <p className="text-sm text-muted-foreground">
            Manage field operations, scheduling, constraints, permits, and reporting
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Sub-tool Tabs */}
      <Tabs value={selectedSubTool || "overview"} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {availableTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* KPIs Row */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-6">
          {kpis.map((kpi, index) => (
            <Card key={index} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{kpi.label}</p>
                    <p className="font-semibold text-lg text-foreground">{kpi.value}</p>
                  </div>
                  <kpi.icon className={`h-5 w-5 text-${kpi.color}-500`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content */}
        <div className="w-full max-w-full overflow-hidden">{renderContent()}</div>
      </Tabs>
    </div>
  )
}

export default FieldManagementContent
