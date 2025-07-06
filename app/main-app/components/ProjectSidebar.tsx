/**
 * @fileoverview Project Sidebar Component
 * @module ProjectSidebar
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Sidebar navigation with project tree menu organized by stage
 */

"use client"

import React, { useState, useMemo } from "react"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Input } from "../../../components/ui/input"
import {
  Building,
  ChevronDown,
  ChevronRight,
  Search,
  Home,
  Folder,
  FolderOpen,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"
import type { UserRole } from "../../project/[projectId]/types/project"

interface ProjectData {
  id: string
  name: string
  description: string
  stage: string
  project_stage_name: string
  project_type_name: string
  contract_value: number
  duration: number
  start_date?: string
  end_date?: string
  location?: string
  project_manager?: string
  client?: string
  active: boolean
  project_number: string
  metadata: {
    originalData: any
  }
}

interface ProjectSidebarProps {
  projects: ProjectData[]
  selectedProject: string | null
  onProjectSelect: (projectId: string | null) => void
  collapsed: boolean
  onToggleCollapsed: () => void
  userRole: UserRole
}

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  projects,
  selectedProject,
  onProjectSelect,
  collapsed,
  onToggleCollapsed,
  userRole,
}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set(["Construction", "Pre-Construction"]))

  // Get project status color
  const getProjectStatusColor = (project: ProjectData) => {
    if (!project.active) {
      return "bg-gray-100 dark:bg-gray-950/30 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800"
    }

    switch (project.project_stage_name) {
      case "Pre-Construction":
      case "Bidding":
        return "bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800"
      case "BIM Coordination":
        return "bg-purple-100 dark:bg-purple-950/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800"
      case "Construction":
        return "bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800"
      case "Closeout":
        return "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800"
      case "Warranty":
        return "bg-orange-100 dark:bg-orange-950/30 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800"
      case "Closed":
        return "bg-gray-100 dark:bg-gray-950/30 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800"
      default:
        return "bg-gray-100 dark:bg-gray-950/30 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800"
    }
  }

  // Group projects by stage
  const projectsByStage = useMemo(() => {
    const filtered = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.project_number.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const stages = new Map<string, ProjectData[]>()

    filtered.forEach((project) => {
      const stage = project.project_stage_name
      if (!stages.has(stage)) {
        stages.set(stage, [])
      }
      stages.get(stage)!.push(project)
    })

    // Sort projects within each stage by name
    stages.forEach((projects) => {
      projects.sort((a, b) => a.name.localeCompare(b.name))
    })

    return stages
  }, [projects, searchQuery])

  // Role-based stage visibility
  const getVisibleStages = () => {
    switch (userRole) {
      case "estimator":
        return ["Pre-Construction", "BIM Coordination", "Bidding"]
      case "executive":
      case "project-executive":
      case "admin":
        return Array.from(projectsByStage.keys())
      case "project-manager":
        return ["Construction", "Closeout", "Warranty", "Pre-Construction", "BIM Coordination"]
      default:
        return ["Construction", "Closeout", "Warranty"]
    }
  }

  const visibleStages = getVisibleStages()
  const filteredStages = Array.from(projectsByStage.entries())
    .filter(([stage]) => visibleStages.includes(stage))
    .sort(([a], [b]) => {
      const stageOrder = [
        "Pre-Construction",
        "BIM Coordination",
        "Bidding",
        "Construction",
        "Closeout",
        "Warranty",
        "Closed",
      ]
      return stageOrder.indexOf(a) - stageOrder.indexOf(b)
    })

  const toggleStageExpansion = (stage: string) => {
    const newExpanded = new Set(expandedStages)
    if (newExpanded.has(stage)) {
      newExpanded.delete(stage)
    } else {
      newExpanded.add(stage)
    }
    setExpandedStages(newExpanded)
  }

  if (collapsed) {
    return (
      <aside className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-16 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-20 transition-all duration-300 ease-in-out">
        <div className="p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapsed}
            className="w-full h-10 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Expand sidebar"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-2 space-y-1">
          <Button
            variant={selectedProject === null ? "default" : "ghost"}
            size="sm"
            onClick={() => onProjectSelect(null)}
            className="w-full h-10 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Dashboard"
          >
            <Home className="h-4 w-4" />
          </Button>

          {filteredStages.slice(0, 3).map(([stage, stageProjects]) => (
            <Button
              key={stage}
              variant="ghost"
              size="sm"
              className="w-full h-10 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
              title={`${stage} (${stageProjects.length} projects)`}
              onClick={() => {
                onToggleCollapsed()
                toggleStageExpansion(stage)
              }}
            >
              <Folder className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </aside>
    )
  }

  return (
    <aside className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-20 transition-all duration-300 ease-in-out shadow-lg md:shadow-none">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Projects</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapsed}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>

        {/* Dashboard Button */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Button
            variant={selectedProject === null ? "default" : "ghost"}
            size="sm"
            onClick={() => onProjectSelect(null)}
            className="w-full justify-start"
          >
            <Home className="h-4 w-4 mr-3" />
            Dashboard
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Project Tree */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {filteredStages.map(([stage, stageProjects]) => (
              <div key={stage}>
                {/* Stage Header */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleStageExpansion(stage)}
                  className="w-full justify-start px-2 py-1.5 h-auto font-medium text-gray-700 dark:text-gray-300"
                >
                  {expandedStages.has(stage) ? (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-2" />
                  )}
                  {expandedStages.has(stage) ? (
                    <FolderOpen className="h-4 w-4 mr-2" />
                  ) : (
                    <Folder className="h-4 w-4 mr-2" />
                  )}
                  <span className="flex-1 text-left">{stage}</span>
                  <Badge variant="secondary" className="text-xs">
                    {stageProjects.length}
                  </Badge>
                </Button>

                {/* Stage Projects */}
                {expandedStages.has(stage) && (
                  <div className="ml-4 space-y-1">
                    {stageProjects.map((project) => (
                      <Button
                        key={project.id}
                        variant={selectedProject === project.id ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onProjectSelect(project.id)}
                        className="w-full justify-start px-3 py-2 h-auto text-left"
                      >
                        <Building className="h-4 w-4 mr-3 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{project.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">#{project.project_number}</div>
                        </div>
                        <Badge variant="secondary" className={`text-xs ml-2 ${getProjectStatusColor(project)}`}>
                          {project.active ? "Active" : "Inactive"}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {filteredStages.reduce((acc, [, projects]) => acc + projects.length, 0)} projects
            {searchQuery && " (filtered)"}
          </div>
        </div>
      </div>
    </aside>
  )
}
