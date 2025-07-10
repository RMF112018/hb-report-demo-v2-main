"use client"

import React, { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Users, TrendingUp, Clock, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

// Import mock data
import staffingData from "@/data/mock/staffing/staffing.json"
import projectsData from "@/data/mock/projects.json"
import spcrData from "@/data/mock/staffing/spcr.json"

interface ExecutivePortfolioStatsProps {
  userRole: "executive" | "project-executive" | "project-manager"
}

export const ExecutivePortfolioStats: React.FC<ExecutivePortfolioStatsProps> = ({ userRole }) => {
  // Calculate portfolio analytics
  const portfolioAnalytics = useMemo(() => {
    // Define project scope based on user role
    let demoProjectIds: number[] = []

    switch (userRole) {
      case "executive":
        demoProjectIds = projectsData.map((p) => p.project_id) // All projects
        break
      case "project-executive":
        demoProjectIds = [2525840, 2525841, 2525842, 2525843, 2525844, 2525845] // 6 projects
        break
      case "project-manager":
        demoProjectIds = [2525840] // Single project
        break
      default:
        demoProjectIds = []
    }

    const projectsWithStaffing = demoProjectIds
      .map((projectId) => {
        const project = projectsData.find((p) => p.project_id === projectId)
        if (!project) return null

        const projectStaff = staffingData.filter(
          (staff) => staff.assignments && staff.assignments.some((assignment) => assignment.project_id === projectId)
        )

        const totalLaborCost = projectStaff.reduce((sum, staff) => sum + (staff.laborRate || 0), 0)
        const avgExperience =
          projectStaff.length > 0
            ? projectStaff.reduce((sum, staff) => sum + (staff.experience || 0), 0) / projectStaff.length
            : 0

        const pendingSpcrCount = spcrData.filter(
          (spcr) => spcr.project_id === projectId && spcr.status === "submitted"
        ).length

        // Simulate productivity based on project stage and staff experience
        const productivity = Math.min(100, 75 + avgExperience * 2 + Math.random() * 10)

        return {
          project,
          staffCount: projectStaff.length,
          totalLaborCost,
          avgExperience,
          productivity,
          pendingSpcrCount,
          staffMembers: projectStaff,
        }
      })
      .filter((p): p is NonNullable<typeof p> => p !== null)

    const totalStaff = projectsWithStaffing.reduce((sum, project) => sum + project.staffCount, 0)
    const avgProductivity =
      projectsWithStaffing.length > 0
        ? projectsWithStaffing.reduce((sum, project) => sum + project.productivity, 0) / projectsWithStaffing.length
        : 0
    const totalPendingSpcrCount = projectsWithStaffing.reduce((sum, project) => sum + project.pendingSpcrCount, 0)
    const totalContractValue = projectsWithStaffing.reduce(
      (sum, project) => sum + (project.project?.contract_value || 0),
      0
    )

    return {
      totalStaff,
      avgProductivity,
      totalPendingSpcrCount,
      totalContractValue,
      projectCount: projectsWithStaffing.length,
    }
  }, [userRole])

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="h-3 w-3 text-green-500" />
    if (value < 0) return <ArrowDownRight className="h-3 w-3 text-red-500" />
    return <Minus className="h-3 w-3 text-gray-500" />
  }

  const getPortfolioTitle = () => {
    switch (userRole) {
      case "executive":
        return "Enterprise Portfolio"
      case "project-executive":
        return "Project Portfolio"
      case "project-manager":
        return "Project"
      default:
        return "Portfolio"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">{getPortfolioTitle()} Size</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{portfolioAnalytics.projectCount}</div>
            <div className="text-xs text-muted-foreground">
              ${(portfolioAnalytics.totalContractValue / 1000000).toFixed(1)}M Total Value
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Team Size</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{portfolioAnalytics.totalStaff}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              {getTrendIcon(3)}
              +3 this month
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Avg Productivity</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{portfolioAnalytics.avgProductivity.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              {getTrendIcon(2.1)}
              +2.1% vs last month
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium">SPCR Reviews</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{portfolioAnalytics.totalPendingSpcrCount}</div>
            <div className="text-xs text-muted-foreground">Pending approval</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
