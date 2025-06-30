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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          Open Constraints by Project
        </CardTitle>
        {selectedProject !== "all" && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearFilter}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear Filter
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground">
              Total Open Constraints Across All Projects
            </div>
            <Badge variant="secondary" className="text-base font-semibold px-3 py-1">
              {totalOpenConstraints}
            </Badge>
          </div>

          {/* Project List */}
          <div className="grid gap-3">
            {projectSummary.map(project => (
              <div
                key={project.project_id}
                className={`
                  group p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md
                  ${selectedProject === project.project_id.toString() 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-border hover:border-blue-300'
                  }
                `}
                onClick={() => onProjectSelect(project.project_id.toString())}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground group-hover:text-blue-600 transition-colors">
                      {project.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.department}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="text-xs text-muted-foreground">
                        Total: {project.totalConstraints}
                      </div>
                      {project.overdueConstraints > 0 && (
                        <div className="flex items-center gap-1 text-xs text-red-600">
                          <AlertCircle className="h-3 w-3" />
                          {project.overdueConstraints} overdue
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge 
                      variant={project.openConstraints === 0 ? "default" : "secondary"}
                      className={`
                        font-semibold px-3 py-1
                        ${project.openConstraints === 0 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                          : project.openConstraints > 5 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                            : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100'
                        }
                      `}
                    >
                      {project.openConstraints} Open
                    </Badge>
                    {selectedProject === project.project_id.toString() && (
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        <Filter className="h-3 w-3" />
                        Filtered
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {projectSummary.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No projects with constraints found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 