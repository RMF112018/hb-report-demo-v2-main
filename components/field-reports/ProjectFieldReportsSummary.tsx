"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, FileText, Shield, CheckCircle, Filter, X, Users, Clock, AlertTriangle } from "lucide-react"
import type { DashboardData } from "@/types/field-reports"

interface ProjectFieldReportsSummaryProps {
  data: DashboardData
  selectedProject: string
  onProjectSelect: (projectId: string) => void
  onClearFilter: () => void
}

interface ProjectSummary {
  projectId: string
  projectName: string
  totalLogs: number
  overdueLogs: number
  totalWorkers: number
  safetyViolations: number
  qualityDefects: number
  complianceScore: number
  lastLogDate: string
}

export function ProjectFieldReportsSummary({
  data,
  selectedProject,
  onProjectSelect,
  onClearFilter
}: ProjectFieldReportsSummaryProps) {
  // Calculate project summaries from field data
  const projectSummaries = React.useMemo(() => {
    const projectMap = new Map<string, ProjectSummary>()

    // Process daily logs
    data.dailyLogs.forEach(log => {
      if (!projectMap.has(log.projectId)) {
        projectMap.set(log.projectId, {
          projectId: log.projectId,
          projectName: log.projectName,
          totalLogs: 0,
          overdueLogs: 0,
          totalWorkers: 0,
          safetyViolations: 0,
          qualityDefects: 0,
          complianceScore: 100,
          lastLogDate: log.date
        })
      }

      const project = projectMap.get(log.projectId)!
      project.totalLogs++
      project.totalWorkers += log.totalWorkers
      if (log.status === 'overdue') {
        project.overdueLogs++
      }
      
      // Update last log date if this is more recent
      if (new Date(log.date) > new Date(project.lastLogDate)) {
        project.lastLogDate = log.date
      }
    })

    // Process safety data
    data.safety.forEach(safety => {
      const project = projectMap.get(safety.projectId)
      if (project) {
        project.safetyViolations += safety.violations
        // Update compliance score (weighted average)
        project.complianceScore = Math.round(
          (project.complianceScore + safety.complianceScore) / 2
        )
      }
    })

    // Process quality control data
    data.qualityControl.forEach(qc => {
      const project = projectMap.get(qc.projectId)
      if (project) {
        project.qualityDefects += qc.defects
      }
    })

    // Convert to array and sort by total activity (logs + inspections)
    return Array.from(projectMap.values()).sort((a, b) => {
      const aActivity = a.totalLogs + a.safetyViolations + a.qualityDefects
      const bActivity = b.totalLogs + b.safetyViolations + b.qualityDefects
      return bActivity - aActivity
    })
  }, [data])

  const totalProjects = projectSummaries.length
  const totalLogs = projectSummaries.reduce((sum, p) => sum + p.totalLogs, 0)
  const totalOverdue = projectSummaries.reduce((sum, p) => sum + p.overdueLogs, 0)

  const getActivityBadgeVariant = (logs: number, violations: number, defects: number) => {
    const totalIssues = violations + defects
    if (totalIssues === 0) return "default"
    if (totalIssues <= 2) return "secondary" 
    return "destructive"
  }

  const getComplianceBadgeVariant = (score: number) => {
    if (score >= 90) return "default"
    if (score >= 75) return "secondary"
    return "destructive"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2 className="h-4 w-4 text-blue-600" />
          Field Reports by Project
        </CardTitle>
        {selectedProject !== "all" && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearFilter}
            className="flex items-center gap-1 h-7 text-xs"
          >
            <X className="h-3 w-3" />
            Clear Filter
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Summary Stats */}
        <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg text-xs">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              {totalProjects} Projects
            </span>
            <span className="text-muted-foreground">
              {totalLogs} Total Logs
            </span>
            {totalOverdue > 0 && (
              <span className="text-red-600 font-medium">
                {totalOverdue} Overdue
              </span>
            )}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {projectSummaries.map(project => (
            <div
              key={project.projectId}
              className={`
                group p-2 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md text-xs
                ${selectedProject === project.projectId 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-border hover:border-blue-300'
                }
              `}
              onClick={() => onProjectSelect(project.projectId)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate" title={project.projectName}>
                    {project.projectName}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Last Log: {new Date(project.lastLogDate).toLocaleDateString()}
                  </div>
                </div>
                {selectedProject === project.projectId && (
                  <div className="flex items-center gap-1 text-xs text-blue-600 ml-2">
                    <Filter className="h-3 w-3" />
                    <span>Active</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3 text-gray-500" />
                  <span className="text-xs">{project.totalLogs} Logs</span>
                  {project.overdueLogs > 0 && (
                    <Badge variant="destructive" className="text-xs px-1 py-0 h-4">
                      {project.overdueLogs}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-gray-500" />
                  <span className="text-xs">{project.totalWorkers} Workers</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {project.safetyViolations > 0 && (
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3 text-red-500" />
                      <Badge variant="destructive" className="text-xs px-1 py-0 h-4">
                        {project.safetyViolations}
                      </Badge>
                    </div>
                  )}
                  
                  {project.qualityDefects > 0 && (
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-orange-500" />
                      <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                        {project.qualityDefects}
                      </Badge>
                    </div>
                  )}
                </div>

                <Badge 
                  variant={getComplianceBadgeVariant(project.complianceScore)} 
                  className="text-xs px-1 py-0 h-4"
                >
                  {project.complianceScore}%
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {projectSummaries.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No field report data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 