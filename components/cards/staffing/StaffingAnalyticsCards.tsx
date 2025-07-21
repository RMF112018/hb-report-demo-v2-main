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
  Eye,
} from "lucide-react"
import { useStaffingStore } from "@/components/staffing/legacy/useStaffingStore"

// Power BI Visualization Component
const PowerBIVisualization = ({
  title,
  type,
  data,
  className,
}: {
  title: string
  type: "chart" | "gauge" | "radar" | "funnel"
  data: any
  className?: string
}) => {
  const getVisualizationContent = () => {
    switch (type) {
      case "chart":
        return (
          <div className="h-full w-full">
            {/* DiSC Distribution Bar Chart */}
            <div className="flex items-end justify-between h-24 gap-2 px-2">
              {data.discProfiles?.map((profile: any, index: number) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full rounded-t-sm transition-all duration-300 hover:opacity-80 min-h-2"
                    style={{
                      height: `${Math.max((profile.count / 13) * 80, 8)}px`,
                      backgroundColor: profile.color.replace("text-", ""),
                    }}
                  />
                  <div className="text-xs font-medium mt-1 text-center">{profile.type}</div>
                  <div className="text-xs text-muted-foreground">{profile.count}</div>
                </div>
              ))}
            </div>
            <div className="text-center mt-2">
              <div className="text-xs font-medium text-blue-600">DiSC Distribution</div>
              <div className="text-xs text-muted-foreground">13 Staff Members</div>
            </div>
          </div>
        )
      case "gauge":
        return (
          <div className="h-full w-full">
            {/* Team Dynamics Gauge */}
            <div className="relative h-24 w-24 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  strokeDasharray={`${(data.teamDynamics?.communication || 0) * 2.5} 250`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{data.teamDynamics?.communication || 0}%</div>
                  <div className="text-xs text-muted-foreground">Communication</div>
                </div>
              </div>
            </div>
            <div className="text-center mt-2">
              <div className="text-xs font-medium text-green-600">Team Dynamics</div>
              <div className="text-xs text-muted-foreground">Gauge Visualization</div>
            </div>
          </div>
        )
      case "radar":
        return (
          <div className="h-full w-full">
            {/* Leadership Styles Radar Chart */}
            <div className="relative h-24 w-24 mx-auto">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Radar grid lines */}
                <polygon points="50,5 75,25 75,75 50,95 25,75 25,25" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                <polygon points="50,15 65,30 65,70 50,85 35,70 35,30" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                <polygon points="50,25 55,35 55,65 50,75 45,65 45,35" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                {/* Data polygon with more realistic values */}
                <polygon
                  points="50,20 70,35 72,65 50,80 30,65 28,35"
                  fill="rgba(147, 51, 234, 0.3)"
                  stroke="#9333ea"
                  strokeWidth="2"
                />
                {/* Data points with labels */}
                {[
                  { x: 50, y: 20, label: "Analytical", value: "85%" },
                  { x: 70, y: 35, label: "Directive", value: "78%" },
                  { x: 72, y: 65, label: "Conceptual", value: "92%" },
                  { x: 50, y: 80, label: "Behavioral", value: "81%" },
                  { x: 30, y: 65, label: "Adaptive", value: "88%" },
                  { x: 28, y: 35, label: "Strategic", value: "76%" },
                ].map((point, index) => (
                  <g key={index}>
                    <circle cx={point.x} cy={point.y} r="3" fill="#9333ea" stroke="white" strokeWidth="1" />
                    <text x={point.x} y={point.y - 5} fontSize="6" fill="#9333ea" textAnchor="middle" fontWeight="bold">
                      {point.value}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <div className="text-center mt-2">
              <div className="text-xs font-medium text-purple-600">Leadership Styles</div>
              <div className="text-xs text-muted-foreground">Radar Chart</div>
            </div>
          </div>
        )
      case "funnel":
        return (
          <div className="h-full w-full">
            {/* Team Compatibility Funnel */}
            <div className="flex flex-col items-center h-24 justify-center gap-2">
              <div className="w-28 h-5 bg-blue-500 rounded-sm flex items-center justify-center">
                <span className="text-xs text-white font-medium">13 Staff</span>
              </div>
              <div className="w-24 h-4 bg-blue-400 rounded-sm flex items-center justify-center">
                <span className="text-xs text-white font-medium">11 Compatible</span>
              </div>
              <div className="w-20 h-4 bg-blue-300 rounded-sm flex items-center justify-center">
                <span className="text-xs text-white font-medium">9 Optimal</span>
              </div>
              <div className="w-16 h-4 bg-blue-200 rounded-sm flex items-center justify-center">
                <span className="text-xs text-white font-medium">7 High</span>
              </div>
            </div>
            <div className="text-center mt-2">
              <div className="text-xs font-medium text-orange-600">Compatibility Flow</div>
              <div className="text-xs text-muted-foreground">Funnel Analysis</div>
            </div>
          </div>
        )
      default:
        return (
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">Power BI</div>
            <div className="text-xs text-muted-foreground">{title}</div>
          </div>
        )
    }
  }

  const getGradientClass = () => {
    switch (type) {
      case "chart":
        return "bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200"
      case "gauge":
        return "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200"
      case "radar":
        return "bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200"
      case "funnel":
        return "bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200"
      default:
        return "bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200"
    }
  }

  return (
    <div className={cn("relative h-32 rounded-lg p-3", getGradientClass(), className)}>
      <div className="absolute inset-0 flex items-center justify-center">{getVisualizationContent()}</div>
      <div className="absolute top-2 right-2">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  )
}

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

// Team Compatibility Card
export const TeamCompatibilityCard = ({
  className,
  isCompact = false,
  projectId,
}: {
  className?: string
  isCompact?: boolean
  projectId?: string
}) => {
  // Mock data for DiSC and Integrus 360 assessments
  const compatibilityData = useMemo(() => {
    const discProfiles = [
      { type: "D", count: 2, description: "Dominance", color: "text-red-600", bgColor: "bg-red-100" },
      { type: "i", count: 5, description: "Influence", color: "text-yellow-600", bgColor: "bg-yellow-100" },
      { type: "S", count: 4, description: "Steadiness", color: "text-green-600", bgColor: "bg-green-100" },
      { type: "C", count: 2, description: "Conscientiousness", color: "text-blue-600", bgColor: "bg-blue-100" },
    ]

    const integrusProfiles = [
      { type: "Analytical", count: 3, description: "Data-driven decision makers", color: "text-blue-600" },
      { type: "Directive", count: 2, description: "Results-oriented leaders", color: "text-red-600" },
      { type: "Conceptual", count: 4, description: "Innovative problem solvers", color: "text-purple-600" },
      { type: "Behavioral", count: 3, description: "Relationship-focused", color: "text-green-600" },
      { type: "Adaptive", count: 1, description: "Flexible communicators", color: "text-orange-600" },
    ]

    const teamDynamics = {
      communication: 87,
      collaboration: 82,
      conflict: 91,
      innovation: 79,
    }

    const compatibilityScore = Math.round(
      (teamDynamics.communication + teamDynamics.collaboration + teamDynamics.conflict + teamDynamics.innovation) / 4
    )

    return {
      discProfiles,
      integrusProfiles,
      teamDynamics,
      compatibilityScore,
    }
  }, [])

  return (
    <Card className={cn("h-full", className)}>
      <CardContent className={cn("p-4 h-full", isCompact && "p-3")}>
        {/* Quadrant Layout */}
        <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full">
          {/* Top-Left: KPI Score */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="text-center h-full flex flex-col justify-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {compatibilityData.compatibilityScore}%
              </div>
              <div className="text-sm text-muted-foreground mt-1">Team Compatibility</div>
              <div className="text-xs text-muted-foreground mt-1">13 Staff Members</div>
            </div>
          </div>

          {/* Top-Right: DiSC Distribution */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="h-full flex flex-col">
              <div className="text-xs font-medium text-green-600 dark:text-green-400 mb-2">DiSC Distribution</div>
              <div className="flex items-end justify-between flex-1 gap-2">
                {compatibilityData.discProfiles.map((profile, index) => {
                  // Map DiSC colors to actual CSS colors
                  const getBarColor = (type: string) => {
                    switch (type) {
                      case "D":
                        return "#dc2626" // red-600
                      case "i":
                        return "#ca8a04" // yellow-600
                      case "S":
                        return "#16a34a" // green-600
                      case "C":
                        return "#2563eb" // blue-600
                      default:
                        return "#6b7280" // gray-500
                    }
                  }

                  return (
                    <div key={index} className="flex flex-col items-center flex-1 group relative">
                      <div
                        className="w-full rounded-t-sm transition-all duration-300 hover:opacity-80 min-h-4 cursor-pointer hover:scale-105"
                        style={{
                          height: `${Math.max((profile.count / 5) * 60, 16)}px`,
                          backgroundColor: getBarColor(profile.type),
                        }}
                        title={`${profile.type}: ${profile.count} staff members (${profile.description})`}
                      />
                      <div className="text-xs font-medium mt-1 text-center">{profile.type}</div>
                      <div className="text-xs text-muted-foreground">{profile.count}</div>

                      {/* Interactive Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                        {profile.count} staff members
                        <div className="text-xs text-gray-300">{profile.description}</div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Bottom-Left: Leadership Radar */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <div className="h-full flex flex-col">
              <div className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-2">Leadership Styles</div>
              <div className="flex-1 flex items-center justify-center relative">
                <div className="relative h-20 w-20">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Radar grid lines */}
                    <polygon
                      points="50,5 75,25 75,75 50,95 25,75 25,25"
                      fill="none"
                      stroke="currentColor"
                      className="text-gray-300 dark:text-gray-600"
                      strokeWidth="1"
                    />
                    <polygon
                      points="50,15 65,30 65,70 50,85 35,70 35,30"
                      fill="none"
                      stroke="currentColor"
                      className="text-gray-300 dark:text-gray-600"
                      strokeWidth="1"
                    />
                    <polygon
                      points="50,25 55,35 55,65 50,75 45,65 45,35"
                      fill="none"
                      stroke="currentColor"
                      className="text-gray-300 dark:text-gray-600"
                      strokeWidth="1"
                    />

                    {/* Axis Labels */}
                    <text x="50" y="3" fontSize="4" fill="#9333ea" textAnchor="middle" fontWeight="bold">
                      Analytical
                    </text>
                    <text x="78" y="25" fontSize="4" fill="#9333ea" textAnchor="middle" fontWeight="bold">
                      Directive
                    </text>
                    <text x="78" y="75" fontSize="4" fill="#9333ea" textAnchor="middle" fontWeight="bold">
                      Conceptual
                    </text>
                    <text x="50" y="98" fontSize="4" fill="#9333ea" textAnchor="middle" fontWeight="bold">
                      Behavioral
                    </text>
                    <text x="22" y="75" fontSize="4" fill="#9333ea" textAnchor="middle" fontWeight="bold">
                      Adaptive
                    </text>
                    <text x="22" y="25" fontSize="4" fill="#9333ea" textAnchor="middle" fontWeight="bold">
                      Strategic
                    </text>

                    {/* Data polygon with realistic leadership style scores */}
                    <polygon
                      points="50,20 70,35 75,60 50,80 25,60 30,35"
                      fill="rgba(147, 51, 234, 0.6)"
                      stroke="#9333ea"
                      strokeWidth="2"
                      className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
                    />

                    {/* Data points with better positioning and larger size */}
                    {[
                      { x: 50, y: 20, label: "Analytical", value: "85%", description: "Data-driven decision makers" },
                      { x: 70, y: 35, label: "Directive", value: "78%", description: "Results-oriented leaders" },
                      { x: 75, y: 60, label: "Conceptual", value: "92%", description: "Innovative problem solvers" },
                      { x: 50, y: 80, label: "Behavioral", value: "81%", description: "Relationship-focused" },
                      { x: 25, y: 60, label: "Adaptive", value: "88%", description: "Flexible communicators" },
                      { x: 30, y: 35, label: "Strategic", value: "76%", description: "Long-term planners" },
                    ].map((point, index) => (
                      <g key={index} className="cursor-pointer">
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="3"
                          fill="#9333ea"
                          stroke="white"
                          strokeWidth="1.5"
                          className="hover:r-4 transition-all duration-200"
                        />
                        <text
                          x={point.x}
                          y={point.y - 6}
                          fontSize="6"
                          fill="#9333ea"
                          textAnchor="middle"
                          fontWeight="bold"
                          className="pointer-events-none"
                        >
                          {point.value}
                        </text>

                        {/* Interactive tooltip for each data point */}
                        <title>
                          {point.label}: {point.value} - {point.description}
                        </title>
                      </g>
                    ))}
                  </svg>
                </div>

                {/* Legend */}
                <div className="absolute bottom-0 left-0 right-0 text-center">
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                    Leadership Style Distribution
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Hover over points for details</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom-Right: Team Dynamics */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
            <div className="h-full flex flex-col">
              <div className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-2">Team Dynamics</div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Communication</span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${compatibilityData.teamDynamics.communication}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{compatibilityData.teamDynamics.communication}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Collaboration</span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${compatibilityData.teamDynamics.collaboration}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{compatibilityData.teamDynamics.collaboration}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Conflict Resolution</span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-purple-500 h-1.5 rounded-full"
                        style={{ width: `${compatibilityData.teamDynamics.conflict}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{compatibilityData.teamDynamics.conflict}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Innovation</span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-orange-500 h-1.5 rounded-full"
                        style={{ width: `${compatibilityData.teamDynamics.innovation}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{compatibilityData.teamDynamics.innovation}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Status */}
        <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Eye className="h-3 w-3" />
            <span>Anonymous assessment results</span>
          </div>
          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
            <span>Power BI Connected</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
