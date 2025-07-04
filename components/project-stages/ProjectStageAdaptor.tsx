"use client"

import React, { useState, useEffect } from "react"
import { getStageConfig } from "@/types/project-stage-config"
import { StageTransitionManager } from "./StageTransitionManager"
import { BIMCoordinationStageView } from "./BIMCoordinationStageView"
import { BiddingStageView } from "./BiddingStageView"
import { PreConstructionStageView } from "./PreConstructionStageView"
import { ConstructionStageView } from "./ConstructionStageView"
import { CloseoutStageView } from "./CloseoutStageView"
import { WarrantyStageView } from "./WarrantyStageView"
import { ClosedStageView } from "./ClosedStageView"
import { PredictiveAnalytics } from "./PredictiveAnalytics"
import { WorkflowAutomation } from "./WorkflowAutomation"
import { MobileOptimizedExperience } from "./MobileOptimizedExperience"
import { AdvancedDashboardBuilder } from "./AdvancedDashboardBuilder"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Settings, Info, Brain, Smartphone, Zap } from "lucide-react"

interface ProjectStageAdaptorProps {
  project: any
  projectData?: any
  showStageManager?: boolean
  userRole?: string
  onStageChange?: (newStage: string) => void
}

export const ProjectStageAdaptor = ({
  project,
  projectData,
  showStageManager = true,
  userRole = "team_member",
  onStageChange,
}: ProjectStageAdaptorProps) => {
  const [currentStage, setCurrentStage] = useState<string>(project?.project_stage_name || "Construction")
  const [stageData, setStageData] = useState<any>(projectData)

  // Update stage when project changes
  useEffect(() => {
    if (project?.project_stage_name) {
      setCurrentStage(project.project_stage_name)
    }
  }, [project])

  const handleStageChange = (newStage: string) => {
    setCurrentStage(newStage)

    // Update project data for the new stage
    if (onStageChange) {
      onStageChange(newStage)
    }

    // Mock: Update project stage in the project object
    if (project) {
      project.project_stage_name = newStage
    }
  }

  // Get stage configuration
  const stageConfig = getStageConfig(currentStage)

  if (!stageConfig) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Invalid project stage: {currentStage}. Please contact support.</AlertDescription>
      </Alert>
    )
  }

  // Stage view component mapping
  const getStageViewComponent = (stageName: string) => {
    const stageProps = { project, projectData: stageData, stageConfig }

    switch (stageName) {
      case "BIM Coordination":
        return <BIMCoordinationStageView {...stageProps} />
      case "Bidding":
        return <BiddingStageView {...stageProps} />
      case "Pre-Construction":
        return <PreConstructionStageView {...stageProps} />
      case "Construction":
        return <ConstructionStageView {...stageProps} />
      case "Closeout":
        return <CloseoutStageView {...stageProps} />
      case "Warranty":
        return <WarrantyStageView {...stageProps} />
      case "Closed":
        return <ClosedStageView {...stageProps} />
      default:
        return (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>Stage view for "{stageName}" is not yet implemented.</AlertDescription>
          </Alert>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {project?.project_name || "Project"}
                <Badge className={stageConfig.stageColor}>{stageConfig.stageName}</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{stageConfig.primaryFocus}</p>
            </div>
            {project?.project_location && (
              <div className="text-right">
                <p className="text-sm font-medium">{project.project_location}</p>
                <p className="text-xs text-muted-foreground">{project.project_type || "Construction Project"}</p>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Stage-specific Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Stage Overview</TabsTrigger>
          <TabsTrigger value="ai-analytics">
            <Brain className="h-4 w-4 mr-2" />
            AI Analytics
          </TabsTrigger>
          <TabsTrigger value="mobile">
            <Smartphone className="h-4 w-4 mr-2" />
            Mobile
          </TabsTrigger>
          <TabsTrigger value="automation">
            <Zap className="h-4 w-4 mr-2" />
            Automation
          </TabsTrigger>
          {showStageManager && <TabsTrigger value="management">Stage Management</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stage-specific View */}
          {getStageViewComponent(currentStage)}
        </TabsContent>

        <TabsContent value="ai-analytics" className="space-y-6">
          <PredictiveAnalytics project={project} currentStage={currentStage} userRole={userRole} />
        </TabsContent>

        <TabsContent value="mobile" className="space-y-6">
          <MobileOptimizedExperience project={project} currentStage={currentStage} userRole={userRole} />
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <WorkflowAutomation project={project} currentStage={currentStage} userRole={userRole} />
          <div className="mt-6">
            <AdvancedDashboardBuilder project={project} userRole={userRole} />
          </div>
        </TabsContent>

        {showStageManager && (
          <TabsContent value="management" className="space-y-6">
            <StageTransitionManager
              project={project}
              currentStage={currentStage}
              userRole={userRole}
              onStageChange={handleStageChange}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
