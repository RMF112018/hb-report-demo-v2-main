"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronUp, Building2, Eye, Clock, Users, DollarSign, TrendingUp } from "lucide-react"

// Import mock data
import staffingData from "@/data/mock/staffing/staffing.json"
import projectsData from "@/data/mock/projects.json"
import spcrData from "@/data/mock/staffing/spcr.json"

interface ProjectStaffing {
  project: {
    project_id: number
    name: string
    project_stage_name: string
    contract_value: number
    project_number: string
  }
  staffCount: number
  totalLaborCost: number
  avgExperience: number
  productivity: number
  pendingSpcrCount: number
  staffMembers: any[]
}

interface ExecutivePortfolioOverviewProps {
  userRole: "executive" | "project-executive" | "project-manager"
}

export const ExecutivePortfolioOverview: React.FC<ExecutivePortfolioOverviewProps> = ({ userRole }) => {
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(true)
  const [selectedProject, setSelectedProject] = useState<number | null>(null)

  // Calculate project data based on user role
  const projectStaffing = useMemo(() => {
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
        } as ProjectStaffing
      })
      .filter((p): p is NonNullable<typeof p> => p !== null)

    return projectsWithStaffing
  }, [userRole])

  const getProductivityBadge = (productivity: number) => {
    if (productivity >= 90)
      return (
        <Badge variant="default" className="bg-green-500">
          Excellent
        </Badge>
      )
    if (productivity >= 80)
      return (
        <Badge variant="default" className="bg-blue-500">
          Good
        </Badge>
      )
    if (productivity >= 70) return <Badge variant="secondary">Average</Badge>
    return <Badge variant="destructive">Needs Attention</Badge>
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Construction":
        return "#3b82f6"
      case "Bidding":
        return "#eab308"
      case "Pre-Construction":
        return "#f97316"
      case "Closeout":
        return "#22c55e"
      case "Warranty":
        return "#8b5cf6"
      default:
        return "#6b7280"
    }
  }

  const getPortfolioTitle = () => {
    switch (userRole) {
      case "executive":
        return "Enterprise Portfolio Overview"
      case "project-executive":
        return "Project Portfolio Overview"
      case "project-manager":
        return "Project Overview"
      default:
        return "Portfolio Overview"
    }
  }

  return (
    <Collapsible open={isOverviewExpanded} onOpenChange={setIsOverviewExpanded}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {getPortfolioTitle()}
              </CardTitle>
              {isOverviewExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Project</TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-4 w-4" />
                      Staff
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      Weekly Cost
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      Productivity
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectStaffing.map((project) => (
                  <TableRow
                    key={project.project.project_id}
                    className="hover:bg-muted/50 h-12"
                    style={{
                      borderLeft: `4px solid ${getStageColor(project.project.project_stage_name)}`,
                      borderLeftWidth: "4px",
                    }}
                  >
                    <TableCell className="py-2">
                      <div className="space-y-0.5">
                        <div className="font-medium text-sm leading-tight">{project.project.name}</div>
                        <div className="text-xs text-muted-foreground">{project.project.project_number}</div>
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-5">
                          {project.project.project_stage_name}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell className="text-center py-2">
                      <div className="font-bold text-base">{project.staffCount}</div>
                    </TableCell>

                    <TableCell className="text-center py-2">
                      <div className="font-bold text-base">${((project.totalLaborCost * 40) / 1000).toFixed(0)}K</div>
                    </TableCell>

                    <TableCell className="text-center py-2">
                      <div className="space-y-0.5">
                        <div className="font-bold text-base">{project.productivity.toFixed(0)}%</div>
                        <div className="scale-90 origin-center">{getProductivityBadge(project.productivity)}</div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center py-2">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => setSelectedProject(project.project.project_id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        {project.pendingSpcrCount > 0 && (
                          <Badge variant="secondary" className="flex items-center gap-1 text-xs px-1.5 py-0.5 h-5">
                            <Clock className="h-2.5 w-2.5" />
                            {project.pendingSpcrCount}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
