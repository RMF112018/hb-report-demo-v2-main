"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Zap, History, Target, Users, FileText, Calendar, BarChart3 } from "lucide-react"

// Import mock data
import staffingData from "@/data/mock/staffing/staffing.json"
import projectsData from "@/data/mock/projects.json"
import spcrData from "@/data/mock/staffing/spcr.json"

interface ExecutivePortfolioSidebarProps {
  userRole: "executive" | "project-executive" | "project-manager"
  onTabChange: (tab: string) => void
}

export const ExecutivePortfolioSidebar: React.FC<ExecutivePortfolioSidebarProps> = ({ userRole, onTabChange }) => {
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

        return {
          project,
          staffCount: projectStaff.length,
          totalLaborCost: projectStaff.reduce((sum, staff) => sum + (staff.laborRate || 0), 0),
        }
      })
      .filter((p): p is NonNullable<typeof p> => p !== null)

    const totalStaff = projectsWithStaffing.reduce((sum, project) => sum + project.staffCount, 0)
    const totalContractValue = projectsWithStaffing.reduce(
      (sum, project) => sum + (project.project?.contract_value || 0),
      0
    )

    return {
      totalStaff,
      totalContractValue,
      projectCount: projectsWithStaffing.length,
    }
  }, [userRole])

  const getPortfolioTitle = () => {
    switch (userRole) {
      case "executive":
        return "Enterprise Portfolio"
      case "project-executive":
        return "Project Portfolio"
      case "project-manager":
        return "Project Overview"
      default:
        return "Portfolio"
    }
  }

  return (
    <div className="hidden xl:block xl:col-span-3 space-y-4">
      {/* Portfolio Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            {getPortfolioTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Projects</span>
            <span className="font-medium">{portfolioAnalytics.projectCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Staff</span>
            <span className="font-medium text-blue-600">{portfolioAnalytics.totalStaff}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Avg Productivity</span>
            <span className="font-medium text-green-600">89.2%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Value</span>
            <span className="font-medium">${(portfolioAnalytics.totalContractValue / 1000000).toFixed(1)}M</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start" variant="outline" onClick={() => onTabChange("spcr")}>
            <FileText className="h-4 w-4 mr-2" />
            SPCR Management
          </Button>
          <Button className="w-full justify-start" variant="outline" onClick={() => onTabChange("timeline")}>
            <Calendar className="h-4 w-4 mr-2" />
            Timeline View
          </Button>
          <Button className="w-full justify-start" variant="outline" onClick={() => onTabChange("analytics")}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Labor Analytics
          </Button>
          <Button className="w-full justify-start" variant="outline" onClick={() => onTabChange("portfolio")}>
            <Building2 className="h-4 w-4 mr-2" />
            Portfolio Overview
          </Button>
        </CardContent>
      </Card>

      {/* Project Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            Project Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Construction</span>
              <span className="font-medium">
                {userRole === "executive" ? "8" : userRole === "project-executive" ? "4" : "1"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Pre-Construction</span>
              <span className="font-medium">
                {userRole === "executive" ? "3" : userRole === "project-executive" ? "2" : "0"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Closeout</span>
              <span className="font-medium">
                {userRole === "executive" ? "2" : userRole === "project-executive" ? "0" : "0"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Key Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Resource Utilization</span>
            <span className="font-medium text-green-600">
              {userRole === "executive" ? "91%" : userRole === "project-executive" ? "89%" : "94%"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Schedule Health</span>
            <span className="font-medium text-blue-600">
              {userRole === "executive" ? "88%" : userRole === "project-executive" ? "92%" : "96%"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Cost Efficiency</span>
            <span className="font-medium text-purple-600">
              {userRole === "executive" ? "93%" : userRole === "project-executive" ? "96%" : "98%"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
