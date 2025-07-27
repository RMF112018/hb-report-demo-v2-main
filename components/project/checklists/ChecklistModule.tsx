"use client"

/**
 * @fileoverview Checklist Module Component
 * @module ChecklistModule
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Main module component for project checklists following v-3.0.mdc standards:
 * - Modular architecture with separated concerns
 * - Dynamic loading of checklist components
 * - TypeScript type safety
 * - Error boundaries and loading states
 * - Role-based access control
 * - Progress tracking across all checklists
 */

import React, { useState, useMemo, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { CheckSquare, PlayCircle, Archive, AlertCircle, Download, Settings, Activity, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

// Import checklist components
import { StartupChecklist } from "./StartupChecklist"
import { CloseoutChecklist } from "./CloseoutChecklist"
import { PreCOChecklist } from "./PreCOChecklist"

type ChecklistTab = "startup" | "preco" | "closeout"

interface ChecklistModuleProps {
  projectId: string
  projectData?: any
  user?: any
  userRole?: string
  className?: string
  initialTab?: ChecklistTab
  onProgressChange?: (type: string, progress: number) => void
}

// Checklist configuration
const checklistTabs = [
  {
    id: "startup" as ChecklistTab,
    label: "StartUp Checklist",
    description: "Essential startup tasks and documentation",
    icon: PlayCircle,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "preco" as ChecklistTab,
    label: "PreCO Checklist",
    description: "Pre-construction activities and preparations",
    icon: Settings,
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    id: "closeout" as ChecklistTab,
    label: "Closeout Checklist",
    description: "Project completion and closure activities",
    icon: Archive,
    color: "text-green-600 dark:text-green-400",
  },
]

// Intersection observer removed to prevent flashing

// Progress Summary Component
const ProgressSummary: React.FC<{
  startupProgress: number
  precoProgress: number
  closeoutProgress: number
}> = React.memo(({ startupProgress, precoProgress, closeoutProgress }) => {
  const overallProgress = (startupProgress + precoProgress + closeoutProgress) / 3

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Activity className="h-4 w-4" />
          Checklist Progress Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Overall Progress</span>
            <span className="text-muted-foreground">{overallProgress.toFixed(1)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "StartUp", progress: startupProgress, color: "text-blue-600" },
            { label: "PreCO", progress: precoProgress, color: "text-orange-600" },
            { label: "Closeout", progress: closeoutProgress, color: "text-green-600" },
          ].map((item) => (
            <div key={item.label} className="text-center space-y-1">
              <div className={`text-xs font-medium ${item.color}`}>{item.label}</div>
              <div className="text-xs text-muted-foreground">{item.progress.toFixed(0)}%</div>
              <Progress value={item.progress} className="h-1" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
})

ProgressSummary.displayName = "ProgressSummary"

// Main ChecklistModule Component
const ChecklistModule: React.FC<ChecklistModuleProps> = React.memo(
  ({ projectId, projectData, user, userRole = "pm", className = "", initialTab = "startup", onProgressChange }) => {
    const [activeTab, setActiveTab] = useState<ChecklistTab>(initialTab)
    const [startupProgress, setStartupProgress] = useState(0)
    const [precoProgress, setPrecoProgress] = useState(0)
    const [closeoutProgress, setCloseoutProgress] = useState(0)

    // Project name from projectData
    const projectName = useMemo(() => {
      return projectData?.project_name || projectData?.name || `Project ${projectId}`
    }, [projectData, projectId])

    // Handle tab change
    const handleTabChange = useCallback((tabId: string) => {
      if (tabId === "startup" || tabId === "preco" || tabId === "closeout") {
        setActiveTab(tabId)
      }
    }, [])

    // Progress change handlers
    const handleStartupProgressChange = useCallback(
      (progress: number) => {
        setStartupProgress(progress)
        onProgressChange?.("startup", progress)
      },
      [onProgressChange]
    )

    const handlePrecoProgressChange = useCallback(
      (progress: number) => {
        setPrecoProgress(progress)
        onProgressChange?.("preco", progress)
      },
      [onProgressChange]
    )

    const handleCloseoutProgressChange = useCallback(
      (progress: number) => {
        setCloseoutProgress(progress)
        onProgressChange?.("closeout", progress)
      },
      [onProgressChange]
    )

    // Remove progressive rendering - it causes flashing
    // Just render the content directly

    // Render checklist content based on active tab
    const renderChecklistContent = () => {
      switch (activeTab) {
        case "startup":
          return (
            <StartupChecklist
              projectId={projectId}
              projectName={projectName}
              mode={userRole === "viewer" ? "review" : "editable"}
              onProgressChange={handleStartupProgressChange}
              className="w-full"
            />
          )
        case "preco":
          return (
            <PreCOChecklist
              projectId={projectId}
              projectName={projectName}
              mode={userRole === "viewer" ? "review" : "editable"}
              onProgressChange={handlePrecoProgressChange}
              className="w-full"
            />
          )
        case "closeout":
          return (
            <CloseoutChecklist
              projectId={projectId}
              mode="full"
              userRole={userRole as any}
              onProgressChange={handleCloseoutProgressChange}
              className="w-full"
            />
          )
        default:
          return (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Checklist Not Found</h3>
                <p className="text-muted-foreground">The requested checklist could not be loaded.</p>
              </div>
            </div>
          )
      }
    }

    return (
      <div className={cn("space-y-4 w-full max-w-full overflow-hidden", className)}>
        {/* Header with Progress Summary */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Project Checklists</h3>
            <p className="text-sm text-muted-foreground">Track project milestones and completion requirements</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
              <Download className="h-4 w-4 mr-1" />
              Export All
            </Button>
          </div>
        </div>

        {/* Progress Summary */}
        <ProgressSummary
          startupProgress={startupProgress}
          precoProgress={precoProgress}
          closeoutProgress={closeoutProgress}
        />

        {/* Checklist Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-10">
            {checklistTabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
                <tab.icon className="h-4 w-4 mr-1" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {checklistTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <tab.icon className={`h-4 w-4 ${tab.color}`} />
                    {tab.label}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{tab.description}</p>
                </CardHeader>
                <CardContent className="p-0">{renderChecklistContent()}</CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    )
  }
)

ChecklistModule.displayName = "ChecklistModule"

export default React.memo(ChecklistModule)
