"use client"

import React, { useEffect, useState, useMemo } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/layout/app-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Building2, Share2, Settings, Activity, Eye } from "lucide-react"

// Import the stage-adaptive system
import { ProjectStageAdaptor } from "@/components/project-stages"
import { getStageConfig } from "@/types/project-stage-config"

// Mock data imports
import projectsData from "@/data/mock/projects.json"

interface ProjectStageDemoProps {
  params: {
    projectId: string
  }
}

/**
 * Project Stage Adaptive Demo Page
 * --------------------------------
 * Demonstrates how the existing project page can be enhanced with the stage-adaptive system.
 * This shows how projects transform their interface based on their current lifecycle stage.
 */
export default function ProjectStageDemo({ params }: ProjectStageDemoProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProjectId, setSelectedProjectId] = useState<string>(params.projectId)
  const [currentView, setCurrentView] = useState<"stage-adaptive" | "current">("stage-adaptive")

  const projectId = selectedProjectId

  // Find the specific project from projects data
  const project = useMemo(() => {
    // First try to find by project_number (string ID)
    const projectByNumber = projectsData.find((p: any) => p.project_number === projectId)
    if (projectByNumber) return projectByNumber

    // Then try to find by project_id (integer ID)
    const projectById = projectsData.find((p: any) => p.project_id === parseInt(projectId))
    if (projectById) return projectById

    return null
  }, [projectId])

  // Get stage configuration for current project
  const stageConfig = useMemo(() => {
    if (!project?.project_stage_name) return null
    return getStageConfig(project.project_stage_name)
  }, [project])

  // Sample projects for demonstration - use first 8 projects from different stages
  const sampleProjects = projectsData.slice(0, 8)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const handleStageChange = (newStage: string) => {
    console.log(`Project ${projectId} stage changed to: ${newStage}`)
    // In a real implementation, this would update the project in the database
    if (project) {
      project.project_stage_name = newStage
    }
  }

  const handleProjectSelect = (newProjectId: string) => {
    setSelectedProjectId(newProjectId)
    router.push(`/project/${newProjectId}/stage-demo`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading project data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <Building2 className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Project Not Found</h1>
            <p className="text-muted-foreground mb-4">The project with ID {projectId} could not be found.</p>
            <Button onClick={() => router.push("/dashboard")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Demo Header */}
      <div className="sticky top-16 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3">
          <div className="max-w-[1920px] mx-auto">
            {/* Breadcrumb Navigation */}
            <Breadcrumb className="mb-3">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard" className="text-muted-foreground hover:text-foreground text-sm">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/projects" className="text-muted-foreground hover:text-foreground text-sm">
                    Projects
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbPage className="font-medium text-sm">Stage-Adaptive Demo</BreadcrumbPage>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Demo Title and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">
                  Stage-Adaptive Project System
                </h1>
                <Badge variant="secondary" className="text-xs whitespace-nowrap">
                  Demo
                </Badge>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <Button variant="ghost" size="sm" className="text-sm">
                  <Share2 className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        {/* Demo Introduction */}
        <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
          <h2 className="text-lg font-semibold mb-2">Project Stage-Adaptive Control Center</h2>
          <p className="text-sm text-muted-foreground mb-4">
            This demonstration shows how the project page adapts its interface and functionality based on the project's
            current lifecycle stage. Each stage presents relevant tools, data, and workflows specific to that phase of
            the project.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              BIM Coordination
            </Badge>
            <Badge variant="outline" className="text-xs">
              Bidding
            </Badge>
            <Badge variant="outline" className="text-xs">
              Pre-Construction
            </Badge>
            <Badge variant="outline" className="text-xs">
              Construction
            </Badge>
            <Badge variant="outline" className="text-xs">
              Closeout
            </Badge>
            <Badge variant="outline" className="text-xs">
              Warranty
            </Badge>
            <Badge variant="outline" className="text-xs">
              Closed
            </Badge>
          </div>
        </div>

        {/* Project Selector */}
        <div className="mb-6 p-4 bg-card border rounded-lg">
          <h3 className="text-md font-semibold mb-3">Select Project to View</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sampleProjects.map((proj: any) => {
              const projStageConfig = getStageConfig(proj.project_stage_name)
              const isSelected = proj.project_number === projectId

              return (
                <div
                  key={proj.project_id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                  onClick={() => handleProjectSelect(proj.project_number)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm line-clamp-1">{proj.name}</h4>
                    {isSelected && <Eye className="h-4 w-4 text-primary flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                    {proj.project_type_name} • {proj.city}, {proj.state_code}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className={`text-xs ${projStageConfig?.stageColor || ""}`}>
                      {proj.project_stage_name}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      ${(proj.contract_value / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Current Project Display */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Currently Viewing: {project.name}</h3>

          {/* Stage-Adaptive Project Interface */}
          <ProjectStageAdaptor
            project={project}
            projectData={undefined}
            showStageManager={true}
            onStageChange={handleStageChange}
          />
        </div>

        {/* Implementation Notes */}
        <div className="mt-8 p-4 bg-muted/30 rounded-lg border">
          <h3 className="text-md font-semibold mb-3">Implementation Notes</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Each project stage has its own specialized view with relevant tools and data</p>
            <p>• Stage transitions include validation checks and requirements verification</p>
            <p>• Stage-specific navigation items and document categories are dynamically filtered</p>
            <p>• Progress indicators show project advancement through the lifecycle</p>
            <p>• Existing project data is preserved and enhanced with stage-specific context</p>
          </div>
        </div>
      </div>
    </div>
  )
}
