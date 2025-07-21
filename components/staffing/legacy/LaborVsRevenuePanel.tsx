"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Building,
  ArrowRight,
  Target,
  Zap,
} from "lucide-react"
import { useStaffingStore } from "./useStaffingStore"

interface LaborVsRevenuePanelProps {
  userRole: "executive" | "project-executive" | "project-manager"
}

interface ProjectFinancials {
  projectId: number
  projectName: string
  contractValue: number
  laborCost: number
  grossMargin: number
  marginPercent: number
  staffCount: number
  utilizationRate: number
  riskLevel: "low" | "medium" | "high"
}

export const LaborVsRevenuePanel: React.FC<LaborVsRevenuePanelProps> = ({ userRole }) => {
  const { staffMembers, projects, calculateLaborCost, getStaffByProject } = useStaffingStore()

  // Calculate financial metrics based on role
  const financialData = useMemo((): ProjectFinancials[] => {
    let targetProjects = projects

    // Filter projects based on role
    if (userRole === "project-executive") {
      // PE oversees 6 projects in portfolio
      const portfolioProjects = [2525840, 2525841, 2525842, 2525843, 2525844, 2525845]
      targetProjects = projects.filter((p) => portfolioProjects.includes(p.project_id))
    } else if (userRole === "project-manager") {
      // PM manages one project
      targetProjects = projects.filter((p) => p.project_id === 2525840)
    }

    return targetProjects.map((project) => {
      const projectStaff = getStaffByProject(project.project_id)
      const staffIds = projectStaff.map((s) => s.id)

      // Calculate labor cost (weekly hours * rate * estimated project duration in weeks)
      const weeklyLaborCost = calculateLaborCost(staffIds, 40)
      const projectDurationWeeks = 52 // Estimate 1 year project duration
      const totalLaborCost = weeklyLaborCost * projectDurationWeeks

      // Calculate gross margin
      const grossMargin = project.contract_value - totalLaborCost
      const marginPercent = (grossMargin / project.contract_value) * 100

      // Calculate utilization rate (mock calculation)
      const utilizationRate = Math.min(95, Math.max(65, 80 + Math.random() * 20))

      // Determine risk level
      let riskLevel: "low" | "medium" | "high" = "low"
      if (marginPercent < 10) riskLevel = "high"
      else if (marginPercent < 20) riskLevel = "medium"

      return {
        projectId: project.project_id,
        projectName: project.name,
        contractValue: project.contract_value,
        laborCost: totalLaborCost,
        grossMargin,
        marginPercent,
        staffCount: projectStaff.length,
        utilizationRate,
        riskLevel,
      }
    })
  }, [projects, userRole, staffMembers, calculateLaborCost, getStaffByProject])

  // Calculate aggregate metrics
  const aggregateMetrics = useMemo(() => {
    const totalContractValue = financialData.reduce((sum, p) => sum + p.contractValue, 0)
    const totalLaborCost = financialData.reduce((sum, p) => sum + p.laborCost, 0)
    const totalGrossMargin = totalContractValue - totalLaborCost
    const avgMarginPercent = (totalGrossMargin / totalContractValue) * 100
    const totalStaffCount = financialData.reduce((sum, p) => sum + p.staffCount, 0)
    const avgUtilization = financialData.reduce((sum, p) => sum + p.utilizationRate, 0) / financialData.length

    return {
      totalContractValue,
      totalLaborCost,
      totalGrossMargin,
      avgMarginPercent,
      totalStaffCount,
      avgUtilization,
      projectCount: financialData.length,
    }
  }, [financialData])

  // Get risk color
  const getRiskColor = (riskLevel: "low" | "medium" | "high") => {
    switch (riskLevel) {
      case "low":
        return "text-green-600 dark:text-green-400"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "high":
        return "text-red-600 dark:text-red-400"
    }
  }

  // Get margin color
  const getMarginColor = (marginPercent: number) => {
    if (marginPercent >= 20) return "text-green-600 dark:text-green-400"
    if (marginPercent >= 10) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getTitle = () => {
    switch (userRole) {
      case "executive":
        return "Enterprise Labor vs Revenue Analysis"
      case "project-executive":
        return "Portfolio Financial Performance"
      case "project-manager":
        return "Project Financial Dashboard"
      default:
        return "Labor vs Revenue Analysis"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            {getTitle()}
          </CardTitle>

          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {aggregateMetrics.projectCount} Project{aggregateMetrics.projectCount !== 1 ? "s" : ""}
            </Badge>
            <Badge variant="outline">{aggregateMetrics.totalStaffCount} Staff</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Aggregate Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${(aggregateMetrics.totalContractValue / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Contract Value</div>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              ${(aggregateMetrics.totalLaborCost / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400">Labor Cost</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-950/50 rounded-lg">
            <div className={`text-2xl font-bold ${getMarginColor(aggregateMetrics.avgMarginPercent)}`}>
              {aggregateMetrics.avgMarginPercent.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Avg Margin</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {aggregateMetrics.avgUtilization.toFixed(0)}%
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400">Utilization</div>
          </div>
        </div>

        {/* Margin vs Target Visualization */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Margin Performance vs Target (25%)
            </h4>
            <div className="text-sm text-muted-foreground">
              ${(aggregateMetrics.totalGrossMargin / 1000000).toFixed(1)}M Gross Margin
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current: {aggregateMetrics.avgMarginPercent.toFixed(1)}%</span>
              <span>Target: 25%</span>
            </div>
            <Progress value={Math.min(100, (aggregateMetrics.avgMarginPercent / 25) * 100)} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>25% Target</span>
              <span>50%</span>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Project Breakdown</h4>
            {userRole === "executive" && (
              <Button variant="outline" size="sm">
                View All Projects
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {financialData.map((project) => (
              <Card key={project.projectId} className="border hover:bg-accent/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{project.projectName}</span>
                        <Badge variant="outline" className={`${getRiskColor(project.riskLevel)} border-current`}>
                          {project.riskLevel.toUpperCase()} RISK
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Contract Value</div>
                          <div className="font-medium">${(project.contractValue / 1000000).toFixed(1)}M</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Labor Cost</div>
                          <div className="font-medium">${(project.laborCost / 1000000).toFixed(1)}M</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Gross Margin</div>
                          <div className={`font-medium ${getMarginColor(project.marginPercent)}`}>
                            {project.marginPercent.toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Staff Count</div>
                          <div className="font-medium flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {project.staffCount}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 text-right">
                      <div className="text-sm text-muted-foreground">Utilization</div>
                      <div className="text-lg font-bold">{project.utilizationRate.toFixed(0)}%</div>
                      <div className="w-12 mt-1">
                        <Progress value={project.utilizationRate} className="h-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Financial Health Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-green-200 dark:border-green-800">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <div className="text-sm text-muted-foreground">Margin Trend</div>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">+2.3%</div>
              <div className="text-xs text-muted-foreground">vs Last Quarter</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-800">
            <CardContent className="p-4 text-center">
              <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <div className="text-sm text-muted-foreground">Efficiency Rating</div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">A-</div>
              <div className="text-xs text-muted-foreground">Labor Efficiency</div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
              <div className="text-sm text-muted-foreground">Risk Score</div>
              <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {financialData.filter((p) => p.riskLevel === "high").length}
              </div>
              <div className="text-xs text-muted-foreground">High Risk Projects</div>
            </CardContent>
          </Card>
        </div>

        {/* Key Insights */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Key Insights
          </h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>
              • Average margin is {aggregateMetrics.avgMarginPercent.toFixed(1)}%{" "}
              {aggregateMetrics.avgMarginPercent >= 25 ? "above" : "below"} target
            </li>
            <li>
              • Staff utilization at {aggregateMetrics.avgUtilization.toFixed(0)}% indicates{" "}
              {aggregateMetrics.avgUtilization >= 80 ? "optimal" : "underutilized"} capacity
            </li>
            <li>
              • {financialData.filter((p) => p.riskLevel === "high").length} project
              {financialData.filter((p) => p.riskLevel === "high").length !== 1 ? "s" : ""} require
              {financialData.filter((p) => p.riskLevel === "high").length === 1 ? "s" : ""} immediate attention
            </li>
            <li>
              • Total gross margin: ${(aggregateMetrics.totalGrossMargin / 1000000).toFixed(1)}M across{" "}
              {aggregateMetrics.projectCount} projects
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
