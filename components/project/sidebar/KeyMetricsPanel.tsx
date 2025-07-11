"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface KeyMetricsPanelProps {
  projectId: string
  projectData: any
  user: any
  userRole: string
  navigation: any
  projectMetrics: any
}

export default function KeyMetricsPanel({
  projectId,
  projectData,
  user,
  userRole,
  navigation,
  projectMetrics,
}: KeyMetricsPanelProps) {
  const getKeyMetrics = () => {
    if (navigation.coreTab === "reports") {
      return [
        { label: "Total Reports", value: "0", color: "blue" },
        { label: "Pending Approval", value: "0", color: "yellow" },
        { label: "Approved", value: "0", color: "green" },
        { label: "Approval Rate", value: "0%", color: "emerald" },
      ]
    } else if (navigation.coreTab === "checklists") {
      return [
        { label: "StartUp Items", value: "65", color: "blue" },
        { label: "StartUp Complete", value: "78%", color: "green" },
        { label: "Closeout Items", value: "35", color: "purple" },
        { label: "Closeout Complete", value: "12%", color: "orange" },
      ]
    } else if (navigation.coreTab === "productivity") {
      return [
        { label: "Active Tasks", value: "12", color: "blue" },
        { label: "Completed Today", value: "8", color: "green" },
        { label: "Unread Messages", value: "4", color: "orange" },
        { label: "Team Activity", value: "92%", color: "purple" },
      ]
    } else if (navigation.coreTab === "staffing") {
      return [
        { label: "Active Staff", value: "12", color: "blue" },
        { label: "Assignments", value: "18", color: "green" },
        { label: "Positions", value: "8", color: "purple" },
        { label: "Avg Duration", value: "45d", color: "orange" },
      ]
    } else if (navigation.coreTab === "responsibility-matrix") {
      return [
        { label: "Total Roles", value: "15", color: "blue" },
        { label: "Assigned", value: "13", color: "green" },
        { label: "Unassigned", value: "2", color: "orange" },
        { label: "Coverage", value: "87%", color: "purple" },
      ]
    }

    // Default project metrics
    return [
      {
        label: "Milestones",
        value: `${projectMetrics.completedMilestones}/${projectMetrics.totalMilestones}`,
        color: "green",
      },
      { label: "Active RFIs", value: projectMetrics.activeRFIs.toString(), color: "blue" },
      { label: "Change Orders", value: projectMetrics.changeOrders.toString(), color: "orange" },
      { label: "Risk Items", value: projectMetrics.riskItems.toString(), color: "red" },
    ]
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Key Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {getKeyMetrics().map((metric, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{metric.label}</span>
            <span className={`font-medium text-${metric.color}-600`}>{metric.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
