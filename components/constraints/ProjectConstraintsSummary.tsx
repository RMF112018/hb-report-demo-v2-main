"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, AlertCircle, Filter, X } from "lucide-react"
import type { ConstraintProject } from "@/types/constraint"

interface ProjectConstraintsSummaryProps {
  projects: ConstraintProject[]
  selectedProject: string
  onProjectSelect: (projectId: string) => void
  onClearFilter: () => void
}

export function ProjectConstraintsSummary({
  projects,
  selectedProject,
  onProjectSelect,
  onClearFilter
}: ProjectConstraintsSummaryProps) {
  // Calculate open constraints per project
  const projectSummary = projects.map(project => {
    const openConstraints = project.constraints.filter(
      constraint => constraint.completionStatus !== "Closed"
    ).length
    
    const overdueConstraints = project.constraints.filter(constraint => {
      if (constraint.completionStatus === "Closed") return false
      if (!constraint.dueDate) return false
      return new Date(constraint.dueDate) < new Date()
    }).length

    return {
      ...project,
      openConstraints,
      overdueConstraints,
      totalConstraints: project.constraints.length
    }
  }).sort((a, b) => b.openConstraints - a.openConstraints) // Sort by open constraints descending

  const totalOpenConstraints = projectSummary.reduce((sum, project) => sum + project.openConstraints, 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2 className="h-4 w-4 text-blue-600" />
          Open Constraints by Project
        </CardTitle>
        {selectedProject !== "all" && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearFilter}
            className="flex items-center gap-1 h-7 px-2 text-xs"
          >
            <X className="h-3 w-3" />
            Clear Filter
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Summary Stats */}
          <div className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
            <span className="text-muted-foreground">Total Open Constraints</span>
            <Badge variant="secondary" className="font-semibold px-2 py-0.5">
              {totalOpenConstraints}
            </Badge>
          </div>

          {/* Project List - Multiple Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {projectSummary.map(project => (
              <div
                key={project.project_id}
                className={`
                  group p-2 rounded border transition-all cursor-pointer hover:shadow-sm
                  ${selectedProject === project.project_id.toString() 
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' 
                    : 'border-border/50 hover:border-blue-300 hover:bg-muted/30'
                  }
                `}
                onClick={() => onProjectSelect(project.project_id.toString())}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-foreground group-hover:text-blue-600 transition-colors truncate">
                      {project.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground truncate">
                        {project.department}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({project.totalConstraints} total)
                      </span>
                    </div>
                    {project.overdueConstraints > 0 && (
                      <div className="flex items-center gap-1 text-xs text-red-600 mt-0.5">
                        <AlertCircle className="h-3 w-3 flex-shrink-0" />
                        <span>{project.overdueConstraints} overdue</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-2">
                    <Badge 
                      variant="secondary"
                      className={`
                        font-semibold px-2 py-0.5 text-xs
                        ${project.openConstraints === 0 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                          : project.openConstraints > 5 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                            : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100'
                        }
                      `}
                    >
                      {project.openConstraints}
                    </Badge>
                    {selectedProject === project.project_id.toString() && (
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        <Filter className="h-2.5 w-2.5" />
                        <span className="text-xs">Active</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {projectSummary.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <Building2 className="h-8 w-8 mx-auto mb-1 opacity-50" />
              <p className="text-sm">No projects with constraints found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 