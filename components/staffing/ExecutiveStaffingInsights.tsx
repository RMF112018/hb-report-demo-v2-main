"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights"

interface ExecutiveStaffingInsightsProps {
  userRole: "executive" | "project-executive" | "project-manager"
}

export const ExecutiveStaffingInsights: React.FC<ExecutiveStaffingInsightsProps> = ({ userRole }) => {
  // Define insights based on user role
  const getInsights = () => {
    switch (userRole) {
      case "executive":
        return [
          {
            id: "exec-1",
            type: "opportunity",
            severity: "medium",
            title: "Enterprise Resource Optimization",
            text: "Opportunity to optimize resource allocation across all projects, reducing overall costs by 15%.",
            action: "Implement enterprise-wide resource sharing strategy with coordinated project scheduling.",
            confidence: 88,
            relatedMetrics: ["Resource Utilization", "Cost Optimization", "Project Coordination"],
          },
          {
            id: "exec-2",
            type: "alert",
            severity: "high",
            title: "Enterprise Capacity Planning",
            text: "Multiple projects showing resource constraints in Q2-Q3 2025 based on current pipeline.",
            action: "Accelerate strategic hiring plan and evaluate contractor partnerships for critical roles.",
            confidence: 93,
            relatedMetrics: ["Resource Planning", "Strategic Hiring", "Project Delivery"],
          },
          {
            id: "exec-3",
            type: "performance",
            severity: "low",
            title: "Enterprise Performance Trend",
            text: "Overall enterprise productivity increased 12.5% compared to last quarter.",
            action: "Document and standardize successful practices across all business units.",
            confidence: 96,
            relatedMetrics: ["Productivity", "Best Practices", "Performance Management"],
          },
        ]
      case "project-executive":
        return [
          {
            id: "pe-1",
            type: "opportunity",
            severity: "medium",
            title: "Cross-Project Resource Sharing",
            text: "Opportunity to share specialized resources between Palm Beach and Downtown projects, reducing costs by 12%.",
            action: "Coordinate with project managers to establish shared resource schedule.",
            confidence: 86,
            relatedMetrics: ["Resource Utilization", "Cost Optimization", "Schedule Coordination"],
          },
          {
            id: "pe-2",
            type: "alert",
            severity: "high",
            title: "Portfolio Capacity Risk",
            text: "3 projects showing potential resource constraints in Q2 2025 based on current hiring pipeline.",
            action: "Review hiring plans and consider contractor augmentation for critical roles.",
            confidence: 91,
            relatedMetrics: ["Resource Planning", "Hiring Pipeline", "Project Delivery"],
          },
          {
            id: "pe-3",
            type: "performance",
            severity: "low",
            title: "Portfolio Productivity Trend",
            text: "Overall portfolio productivity increased 8.3% compared to last quarter.",
            action: "Document and replicate successful practices across remaining projects.",
            confidence: 94,
            relatedMetrics: ["Productivity", "Best Practices", "Performance Management"],
          },
        ]
      case "project-manager":
        return [
          {
            id: "pm-1",
            type: "opportunity",
            severity: "medium",
            title: "Team Efficiency Optimization",
            text: "Opportunity to optimize team structure and reduce project timeline by 3 weeks.",
            action: "Reallocate senior resources to critical path activities and cross-train team members.",
            confidence: 84,
            relatedMetrics: ["Team Efficiency", "Schedule Optimization", "Resource Allocation"],
          },
          {
            id: "pm-2",
            type: "alert",
            severity: "high",
            title: "Skilled Labor Shortage",
            text: "Critical skilled trades shortage identified for Phase 2 construction activities.",
            action: "Initiate early recruitment for skilled trades and evaluate subcontractor options.",
            confidence: 89,
            relatedMetrics: ["Resource Planning", "Skilled Trades", "Project Schedule"],
          },
          {
            id: "pm-3",
            type: "performance",
            severity: "low",
            title: "Project Team Performance",
            text: "Team productivity increased 6.2% this month with improved coordination.",
            action: "Continue current management approach and document successful practices.",
            confidence: 91,
            relatedMetrics: ["Team Productivity", "Coordination", "Performance Management"],
          },
        ]
      default:
        return []
    }
  }

  const getInsightsTitle = () => {
    switch (userRole) {
      case "executive":
        return "Enterprise Intelligence Insights"
      case "project-executive":
        return "Portfolio Intelligence Insights"
      case "project-manager":
        return "Project Intelligence Insights"
      default:
        return "Staffing Intelligence Insights"
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-blue-600" />
          {getInsightsTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EnhancedHBIInsights config={getInsights()} cardId={`${userRole}-staffing`} />
      </CardContent>
    </Card>
  )
}
