/**
 * Optimized MyProjects Component
 * Extracted from main-app page with performance optimizations
 *
 * @module MyProjects
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-29
 */

import React, { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Building, MapPin, DollarSign, Calendar } from "lucide-react"
import { useDeepMemo, useDeepCallback } from "@/lib/performance-utils"
import type { UserRole } from "@/app/project/[projectId]/types/project"

export interface Project {
  id: string
  name: string
  status: string
  project_stage_name: string
  budget: number
  start_date: string
  end_date: string
  location?: string
  [key: string]: unknown
}

export interface MyProjectsProps {
  projects: Project[]
  userRole: UserRole
  onProjectSelect: (projectId: string) => void
  selectedProject: string | null
}

/**
 * Optimized MyProjects component with performance enhancements
 */
export const MyProjects: React.FC<MyProjectsProps> = React.memo(
  ({ projects, userRole, onProjectSelect, selectedProject }) => {
    const [isCollapsed, setIsCollapsed] = useState(false)

    // Optimized project filtering with deep memoization
    const userProjects = useDeepMemo(() => {
      const activeProjects = projects.filter((p) => p.status === "active")

      switch (userRole) {
        case "project-executive":
          return activeProjects.slice(0, 6) // First 6 active projects
        case "project-manager":
          // For PM, prioritize construction stage projects
          const constructionProjects = activeProjects.filter((p) => p.project_stage_name === "Construction")
          const otherProjects = activeProjects.filter((p) => p.project_stage_name !== "Construction")
          return [...constructionProjects, ...otherProjects].slice(0, 4) // Up to 4 projects
        default:
          return []
      }
    }, [projects, userRole])

    // Optimized currency formatting
    const formatCurrency = useCallback((value: number): string => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    }, [])

    // Optimized status color mapping
    const getProjectStatusColor = useCallback((project: Project): string => {
      switch (project.status) {
        case "active":
          return "bg-green-100 text-green-800 border-green-200"
        case "on-hold":
          return "bg-yellow-100 text-yellow-800 border-yellow-200"
        case "completed":
          return "bg-blue-100 text-blue-800 border-blue-200"
        default:
          return "bg-gray-100 text-gray-800 border-gray-200"
      }
    }, [])

    // Optimized collapse toggle
    const handleToggleCollapse = useDeepCallback(() => {
      setIsCollapsed((prev) => !prev)
    }, [])

    // Optimized project selection
    const handleProjectClick = useCallback(
      (projectId: string) => {
        onProjectSelect(projectId)
      },
      [onProjectSelect]
    )

    if (userProjects.length === 0) {
      return (
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">My Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No projects assigned</p>
              <p className="text-sm text-muted-foreground">Projects will appear here when assigned</p>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">My Projects</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleToggleCollapse} className="h-6 w-6 p-0">
              {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>

        {!isCollapsed && (
          <CardContent className="space-y-3">
            {userProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isSelected={selectedProject === project.id}
                onSelect={handleProjectClick}
                formatCurrency={formatCurrency}
                getStatusColor={getProjectStatusColor}
              />
            ))}
          </CardContent>
        )}
      </Card>
    )
  }
)

MyProjects.displayName = "MyProjects"

/**
 * Optimized ProjectCard component with memoization
 */
interface ProjectCardProps {
  project: Project
  isSelected: boolean
  onSelect: (projectId: string) => void
  formatCurrency: (value: number) => string
  getStatusColor: (project: Project) => string
}

const ProjectCard: React.FC<ProjectCardProps> = React.memo(
  ({ project, isSelected, onSelect, formatCurrency, getStatusColor }) => {
    const handleClick = useCallback(() => {
      onSelect(project.id)
    }, [project.id, onSelect])

    return (
      <div
        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
          isSelected ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={handleClick}
      >
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{project.name}</h4>
              <p className="text-xs text-muted-foreground">{project.project_stage_name}</p>
            </div>
            <Badge variant="outline" className={`text-xs ${getStatusColor(project)}`}>
              {project.status}
            </Badge>
          </div>

          <div className="space-y-1 text-xs text-muted-foreground">
            {project.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{project.location}</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span>{formatCurrency(project.budget)}</span>
            </div>

            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {project.start_date} - {project.end_date}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

ProjectCard.displayName = "ProjectCard"
