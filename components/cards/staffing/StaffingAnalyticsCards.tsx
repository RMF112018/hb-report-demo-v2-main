"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Target,
  BarChart3,
  Activity,
  UserCheck,
  Building2,
  Zap,
  FileText,
  Award,
  Timer,
  PieChart,
  Briefcase,
  UserPlus,
  UserMinus,
  ChevronUp,
  ChevronDown,
  Minus,
} from "lucide-react"
import { useStaffingStore } from "@/app/dashboard/staff-planning/store/useStaffingStore"

// Team Utilization Card
export const TeamUtilizationCard = ({
  className,
  isCompact = false,
  projectId,
}: {
  className?: string
  isCompact?: boolean
  projectId?: string
}) => {
  const { staffMembers, projects } = useStaffingStore()

  const utilization = useMemo(() => {
    const projectIdNum = projectId ? parseInt(projectId) : null
    const relevantStaff = projectIdNum
      ? staffMembers.filter((s) => s.assignments.some((a) => a.project_id === projectIdNum))
      : staffMembers

    const totalStaff = relevantStaff.length
    const assignedStaff = relevantStaff.filter((s) => s.assignments.length > 0).length
    const rate = totalStaff > 0 ? (assignedStaff / totalStaff) * 100 : 0

    return {
      total: totalStaff,
      assigned: assignedStaff,
      available: totalStaff - assignedStaff,
      rate: rate,
      trend: rate > 85 ? "high" : rate > 65 ? "medium" : "low",
    }
  }, [staffMembers, projectId])

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className={cn("pb-3", isCompact && "pb-2")}>
        <CardTitle className={cn("text-base flex items-center gap-2", isCompact && "text-sm")}>
          <Users className="h-4 w-4 text-blue-600" />
          Team Utilization
        </CardTitle>
      </CardHeader>
      <CardContent className={cn("space-y-4", isCompact && "space-y-3")}>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Utilization Rate</span>
            <span className="text-2xl font-bold text-blue-600">{utilization.rate.toFixed(0)}%</span>
          </div>
          <Progress value={utilization.rate} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <div className="text-lg font-semibold text-green-600">{utilization.assigned}</div>
            <div className="text-xs text-muted-foreground">Assigned</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-semibold text-orange-600">{utilization.available}</div>
            <div className="text-xs text-muted-foreground">Available</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-semibold">{utilization.total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Badge
            variant={
              utilization.trend === "high" ? "destructive" : utilization.trend === "medium" ? "default" : "secondary"
            }
          >
            {utilization.trend === "high"
              ? "High Utilization"
              : utilization.trend === "medium"
              ? "Optimal"
              : "Low Utilization"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

// Labor Cost Analysis Card
export const LaborCostAnalysisCard = ({
  className,
  isCompact = false,
  projectId,
}: {
  className?: string
  isCompact?: boolean
  projectId?: string
}) => {
  const { staffMembers, projects } = useStaffingStore()

  const costAnalysis = useMemo(() => {
    const projectIdNum = projectId ? parseInt(projectId) : null
    const relevantStaff = projectIdNum
      ? staffMembers.filter((s) => s.assignments.some((a) => a.project_id === projectIdNum))
      : staffMembers

    const totalLaborCost = relevantStaff.reduce((sum, staff) => sum + staff.laborRate, 0)
    const totalBillableRate = relevantStaff.reduce((sum, staff) => sum + staff.billableRate, 0)
    const monthlyLaborCost = totalLaborCost * 40 * 4.33 // Weekly to monthly
    const monthlyBillableRate = totalBillableRate * 40 * 4.33
    const margin = monthlyBillableRate > 0 ? ((monthlyBillableRate - monthlyLaborCost) / monthlyBillableRate) * 100 : 0

    return {
      monthlyLabor: monthlyLaborCost,
      monthlyBillable: monthlyBillableRate,
      margin: margin,
      avgLaborRate: relevantStaff.length > 0 ? totalLaborCost / relevantStaff.length : 0,
      avgBillableRate: relevantStaff.length > 0 ? totalBillableRate / relevantStaff.length : 0,
    }
  }, [staffMembers, projectId])

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className={cn("pb-3", isCompact && "pb-2")}>
        <CardTitle className={cn("text-base flex items-center gap-2", isCompact && "text-sm")}>
          <DollarSign className="h-4 w-4 text-green-600" />
          Labor Cost Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className={cn("space-y-4", isCompact && "space-y-3")}>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Monthly Labor</span>
            <span className="text-lg font-semibold">${(costAnalysis.monthlyLabor / 1000).toFixed(0)}K</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Monthly Billable</span>
            <span className="text-lg font-semibold text-green-600">
              ${(costAnalysis.monthlyBillable / 1000).toFixed(0)}K
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Margin</span>
            <div className="flex items-center gap-1">
              <span
                className={cn("text-lg font-semibold", costAnalysis.margin > 20 ? "text-green-600" : "text-orange-600")}
              >
                {costAnalysis.margin.toFixed(1)}%
              </span>
              {costAnalysis.margin > 20 ? (
                <ChevronUp className="h-4 w-4 text-green-600" />
              ) : (
                <ChevronDown className="h-4 w-4 text-orange-600" />
              )}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="space-y-1">
              <div className="text-sm font-medium">${costAnalysis.avgLaborRate.toFixed(0)}</div>
              <div className="text-xs text-muted-foreground">Avg Labor Rate</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-green-600">${costAnalysis.avgBillableRate.toFixed(0)}</div>
              <div className="text-xs text-muted-foreground">Avg Billable Rate</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// SPCR Activity Card
export const SPCRActivityCard = ({
  className,
  isCompact = false,
  projectId,
}: {
  className?: string
  isCompact?: boolean
  projectId?: string
}) => {
  const { spcrs } = useStaffingStore()

  const spcrStats = useMemo(() => {
    const projectIdNum = projectId ? parseInt(projectId) : null
    const relevantSPCRs = projectIdNum ? spcrs.filter((s) => s.project_id === projectIdNum) : spcrs

    const pending = relevantSPCRs.filter((s) =>
      ["submitted", "pe-review", "executive-review"].includes(s.workflowStage)
    ).length
    const approved = relevantSPCRs.filter((s) => ["pe-approved", "final-approved"].includes(s.workflowStage)).length
    const rejected = relevantSPCRs.filter((s) => ["pe-rejected", "final-rejected"].includes(s.workflowStage)).length
    const total = relevantSPCRs.length

    const approvalRate = total > 0 ? (approved / total) * 100 : 0
    const increases = relevantSPCRs.filter((s) => s.type === "increase").length
    const decreases = relevantSPCRs.filter((s) => s.type === "decrease").length

    return {
      total,
      pending,
      approved,
      rejected,
      approvalRate,
      increases,
      decreases,
    }
  }, [spcrs, projectId])

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className={cn("pb-3", isCompact && "pb-2")}>
        <CardTitle className={cn("text-base flex items-center gap-2", isCompact && "text-sm")}>
          <FileText className="h-4 w-4 text-purple-600" />
          SPCR Activity
        </CardTitle>
      </CardHeader>
      <CardContent className={cn("space-y-4", isCompact && "space-y-3")}>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <div className="text-lg font-semibold text-orange-600">{spcrStats.pending}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-semibold text-green-600">{spcrStats.approved}</div>
            <div className="text-xs text-muted-foreground">Approved</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-semibold text-red-600">{spcrStats.rejected}</div>
            <div className="text-xs text-muted-foreground">Rejected</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Approval Rate</span>
            <span className="text-lg font-semibold text-green-600">{spcrStats.approvalRate.toFixed(0)}%</span>
          </div>
          <Progress value={spcrStats.approvalRate} className="h-2" />
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <div className="flex items-center gap-1">
            <UserPlus className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">{spcrStats.increases}</span>
            <span className="text-xs text-muted-foreground">Increases</span>
          </div>
          <div className="flex items-center gap-1">
            <UserMinus className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium">{spcrStats.decreases}</span>
            <span className="text-xs text-muted-foreground">Decreases</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Team Experience Card
export const TeamExperienceCard = ({
  className,
  isCompact = false,
  projectId,
}: {
  className?: string
  isCompact?: boolean
  projectId?: string
}) => {
  const { staffMembers } = useStaffingStore()

  const experienceStats = useMemo(() => {
    const projectIdNum = projectId ? parseInt(projectId) : null
    const relevantStaff = projectIdNum
      ? staffMembers.filter((s) => s.assignments.some((a) => a.project_id === projectIdNum))
      : staffMembers

    const totalExperience = relevantStaff.reduce((sum, staff) => sum + staff.experience, 0)
    const avgExperience = relevantStaff.length > 0 ? totalExperience / relevantStaff.length : 0

    const junior = relevantStaff.filter((s) => s.experience < 3).length
    const mid = relevantStaff.filter((s) => s.experience >= 3 && s.experience < 8).length
    const senior = relevantStaff.filter((s) => s.experience >= 8).length

    const experienceDistribution = [
      { level: "Junior", count: junior, color: "text-blue-600" },
      { level: "Mid", count: mid, color: "text-yellow-600" },
      { level: "Senior", count: senior, color: "text-green-600" },
    ]

    return {
      avgExperience,
      distribution: experienceDistribution,
      total: relevantStaff.length,
    }
  }, [staffMembers, projectId])

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className={cn("pb-3", isCompact && "pb-2")}>
        <CardTitle className={cn("text-base flex items-center gap-2", isCompact && "text-sm")}>
          <Award className="h-4 w-4 text-yellow-600" />
          Team Experience
        </CardTitle>
      </CardHeader>
      <CardContent className={cn("space-y-4", isCompact && "space-y-3")}>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{experienceStats.avgExperience.toFixed(1)}</div>
          <div className="text-sm text-muted-foreground">Average Years</div>
        </div>

        <div className="space-y-2">
          {experienceStats.distribution.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{item.level}</span>
              <div className="flex items-center gap-2">
                <span className={cn("text-sm font-medium", item.color)}>{item.count}</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className={cn("h-2 rounded-full", item.color.replace("text-", "bg-"))}
                    style={{ width: `${(item.count / experienceStats.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t text-center">
          <Badge variant="outline" className="text-xs">
            {experienceStats.total} Team Members
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

// Project Staffing Overview Card
export const ProjectStaffingOverviewCard = ({
  className,
  isCompact = false,
  projectId,
}: {
  className?: string
  isCompact?: boolean
  projectId?: string
}) => {
  const { staffMembers, projects } = useStaffingStore()

  const projectStats = useMemo(() => {
    const projectIdNum = projectId ? parseInt(projectId) : null
    const project = projectIdNum ? projects.find((p) => p.project_id === projectIdNum) : null
    const projectStaff = projectIdNum
      ? staffMembers.filter((s) => s.assignments.some((a) => a.project_id === projectIdNum))
      : []

    const positions = projectStaff.reduce((acc, staff) => {
      acc[staff.position] = (acc[staff.position] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topPositions = Object.entries(positions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)

    const totalCost = projectStaff.reduce((sum, staff) => sum + staff.laborRate * 40 * 4.33, 0)

    return {
      project,
      staffCount: projectStaff.length,
      positions: topPositions,
      totalMonthlyCost: totalCost,
      avgRate:
        projectStaff.length > 0 ? projectStaff.reduce((sum, s) => sum + s.laborRate, 0) / projectStaff.length : 0,
    }
  }, [staffMembers, projects, projectId])

  if (!projectStats.project) {
    return (
      <Card className={cn("h-full", className)}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground">
            <Building2 className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">No project selected</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className={cn("pb-3", isCompact && "pb-2")}>
        <CardTitle className={cn("text-base flex items-center gap-2", isCompact && "text-sm")}>
          <Building2 className="h-4 w-4 text-blue-600" />
          Project Staffing
        </CardTitle>
      </CardHeader>
      <CardContent className={cn("space-y-4", isCompact && "space-y-3")}>
        <div className="space-y-2">
          <div className="text-sm font-medium truncate">{projectStats.project.name}</div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {projectStats.project.project_stage_name}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {projectStats.staffCount} Staff
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Key Positions</div>
          {projectStats.positions.map(([position, count], index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-xs truncate">{position}</span>
              <Badge variant="outline" className="text-xs">
                {count}
              </Badge>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Monthly Cost</span>
            <span className="text-sm font-medium">${(projectStats.totalMonthlyCost / 1000).toFixed(0)}K</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Avg Rate</span>
            <span className="text-sm font-medium">${projectStats.avgRate.toFixed(0)}/hr</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Staffing Alerts Card
export const StaffingAlertsCard = ({
  className,
  isCompact = false,
  projectId,
}: {
  className?: string
  isCompact?: boolean
  projectId?: string
}) => {
  const { staffMembers, spcrs } = useStaffingStore()

  const alerts = useMemo(() => {
    const projectIdNum = projectId ? parseInt(projectId) : null
    const relevantStaff = projectIdNum
      ? staffMembers.filter((s) => s.assignments.some((a) => a.project_id === projectIdNum))
      : staffMembers

    const relevantSPCRs = projectIdNum ? spcrs.filter((s) => s.project_id === projectIdNum) : spcrs

    const alertList = []

    // High utilization alert
    const totalStaff = relevantStaff.length
    const assignedStaff = relevantStaff.filter((s) => s.assignments.length > 0).length
    const utilization = totalStaff > 0 ? (assignedStaff / totalStaff) * 100 : 0

    if (utilization > 90) {
      alertList.push({
        type: "warning",
        message: "High team utilization",
        detail: `${utilization.toFixed(0)}% utilization rate`,
        icon: AlertTriangle,
      })
    }

    // Pending SPCR alerts
    const pendingSPCRs = relevantSPCRs.filter((s) => ["submitted", "pe-review"].includes(s.workflowStage)).length
    if (pendingSPCRs > 0) {
      alertList.push({
        type: "info",
        message: "Pending SPCR approvals",
        detail: `${pendingSPCRs} requests awaiting review`,
        icon: FileText,
      })
    }

    // Experience imbalance
    const juniorCount = relevantStaff.filter((s) => s.experience < 3).length
    const seniorCount = relevantStaff.filter((s) => s.experience >= 8).length
    const ratio = seniorCount > 0 ? juniorCount / seniorCount : juniorCount

    if (ratio > 2) {
      alertList.push({
        type: "warning",
        message: "Experience imbalance",
        detail: `${ratio.toFixed(1)}:1 junior to senior ratio`,
        icon: Users,
      })
    }

    // Recent SPCR activity
    const recentSPCRs = relevantSPCRs.filter((s) => {
      const createdDate = new Date(s.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return createdDate > weekAgo
    }).length

    if (recentSPCRs > 3) {
      alertList.push({
        type: "info",
        message: "High SPCR activity",
        detail: `${recentSPCRs} requests this week`,
        icon: Activity,
      })
    }

    return alertList.slice(0, 3) // Limit to 3 alerts
  }, [staffMembers, spcrs, projectId])

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className={cn("pb-3", isCompact && "pb-2")}>
        <CardTitle className={cn("text-base flex items-center gap-2", isCompact && "text-sm")}>
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          Staffing Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className={cn("space-y-3", isCompact && "space-y-2")}>
        {alerts.length === 0 ? (
          <div className="text-center py-4">
            <CheckCircle2 className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <p className="text-sm text-muted-foreground">No active alerts</p>
          </div>
        ) : (
          alerts.map((alert, index) => (
            <div key={index} className="flex items-start gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
              <alert.icon
                className={cn(
                  "h-4 w-4 mt-0.5 flex-shrink-0",
                  alert.type === "warning" ? "text-orange-600" : "text-blue-600"
                )}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{alert.message}</div>
                <div className="text-xs text-muted-foreground">{alert.detail}</div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
