"use client"

import React, { useState, useMemo, useCallback, useRef } from "react"
import { useTheme } from "next-themes"

// Bryntum & helper imports
import scheduleData from "@/data/mock/schedule/schedule.json"
import { DateHelper } from "@bryntum/gantt"
import { buildGanttConfig } from "@/lib/gantt-config"
import HBGanttComponent from "@/components/charts/HBGanttBeta"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Save, Send } from "lucide-react"

// Types
interface ProjectScheduleProps {
  userRole: string
  projectData: any
  projectId: string
}

// Updated interface to match actual data structure
interface ScheduleActivity {
  project_id: number
  activity_id: string
  activity_name: string
  wbs_code: string
  activity_type: string
  status: string
  primary_base_start_date: string
  primary_base_end_date: string
  start_date: string
  end_date: string
  free_float: number
}

// --- Component ---

const ProjectSchedule: React.FC<ProjectScheduleProps> = ({ userRole, projectData, projectId }) => {
  const { theme: currentTheme } = useTheme()
  const ganttRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // UI state
  const [selectedUpdate, setSelectedUpdate] = useState("Current")
  const [activityFilter, setActivityFilter] = useState<"all" | "milestones" | "tasks" | "critical">("all")
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [aiQuery, setAiQuery] = useState("")
  const [showPreviousUpdate, setShowPreviousUpdate] = useState(false)
  const [showVersionsOnly, setShowVersionsOnly] = useState(false)
  const [showChangesOnly, setShowChangesOnly] = useState(false)

  // Process schedule data for Gantt
  const ganttTasks = useMemo(() => {
    // Filter activities for the current project
    const projectActivities = scheduleData.filter((activity: any) => activity.project_id.toString() === projectId)

    return projectActivities.map((activity: any) => {
      const startDate = new Date(activity.start_date)
      const endDate = new Date(activity.end_date)
      const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

      return {
        id: activity.activity_id,
        name: activity.activity_name,
        startDate: startDate,
        endDate: endDate,
        duration: duration,
        percentDone: 0, // Default to 0, can be calculated based on status
        isProject: activity.activity_type === "project",
        prio: activity.status === "critical" ? "High" : activity.status === "normal" ? "Normal" : "Low",
        expanded: true,
        wbsCode: activity.wbs_code,
        status: activity.status,
        activityType: activity.activity_type,
        freeFloat: activity.free_float,
      }
    })
  }, [projectId])

  const ganttDependencies = useMemo(() => {
    // For now, create basic dependencies based on WBS codes
    // In a real implementation, you would have actual dependency data
    const dependencies: any[] = []

    ganttTasks.forEach((task, index) => {
      if (index > 0) {
        // Create a simple dependency chain for demo purposes
        dependencies.push({
          from: ganttTasks[index - 1].id,
          to: task.id,
          type: 0, // Finish-to-Start
          lag: 0,
          lagUnit: "d",
        })
      }
    })

    return dependencies
  }, [ganttTasks])

  // Gantt configuration
  const ganttProject = useMemo(
    () => ({
      taskStore: {
        data: ganttTasks,
        fields: ["isProject", "prio", "wbsCode", "status", "activityType", "freeFloat"],
      },
      dependencyStore: {
        data: ganttDependencies,
      },
      stm: {
        autoRecord: true,
      },
      autoLoad: false,
    }),
    [ganttTasks, ganttDependencies]
  )

  const ganttColumns = useMemo(
    () => [
      { type: "wbs" },
      { type: "name", width: 350 },
      { type: "startdate" },
      { type: "duration", abbreviatedUnit: true },
      { type: "percentdone", mode: "circle", width: 70 },
      { type: "resourceassignment", width: 120, showAvatars: true },
    ],
    []
  )

  const ganttFeatures = useMemo(
    () => ({
      projectLines: false,
      rollups: true,
      dependencies: {
        radius: 10,
        clickWidth: 5,
      },
      labels: {
        right: {
          field: "name",
          renderer: ({ taskRecord, domConfig }: any) => {
            domConfig.children = [taskRecord.name]
            if (taskRecord.prio) {
              domConfig.children.push({
                class: "b-prio-tag",
                dataset: { btip: "Priority " + taskRecord.prio },
                text: taskRecord.prio,
              })
            }
          },
        },
      },
      taskTooltip: {
        template: ({ taskRecord }: any) => {
          const startDate = taskRecord.startDate ? new Date(taskRecord.startDate).toLocaleDateString() : "Unknown"
          const duration = taskRecord.duration || taskRecord.fullDuration || "Unknown"
          return `<div class="field"><label>Task</label><span>${taskRecord.name || "Unknown"}</span></div>
                <div class="field"><label>Priority</label><span class="b-prio-tag">${
                  taskRecord.prio || "Normal"
                }</span></div>
                <div class="field"><label>Start</label><span>${startDate}</span></div>
                <div class="field"><label>Duration</label><span>${duration}</span></div>
                <div class="field"><label>Status</label><span>${taskRecord.status || "Unknown"}</span></div>`
        },
      },
    }),
    []
  )

  const ganttResponsiveLevels = useMemo(
    () => ({
      small: {
        levelWidth: 600,
        rowHeight: 30,
        barMargin: 0,
      },
      normal: {
        levelWidth: "*",
        rowHeight: 38,
        barMargin: 9,
      },
    }),
    []
  )

  // Handle filter change with proper typing
  const handleActivityFilterChange = useCallback((value: string) => {
    setActivityFilter(value as "all" | "milestones" | "tasks" | "critical")
  }, [])

  return (
    <div className="h-full flex flex-col space-y-4 p-4 min-h-0">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="update-select" className="text-sm font-medium">
              Update:
            </Label>
            <Select value={selectedUpdate} onValueChange={setSelectedUpdate}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Current">Current</SelectItem>
                <SelectItem value="Previous">Previous</SelectItem>
                <SelectItem value="Baseline">Baseline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="activity-filter" className="text-sm font-medium">
              Filter:
            </Label>
            <Select value={activityFilter} onValueChange={handleActivityFilterChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="milestones">Milestones</SelectItem>
                <SelectItem value="tasks">Tasks</SelectItem>
                <SelectItem value="critical">Critical Path</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch checked={showPreviousUpdate} onCheckedChange={setShowPreviousUpdate} />
            <Label htmlFor="show-previous" className="text-sm">
              Show Previous Update
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch checked={showVersionsOnly} onCheckedChange={setShowVersionsOnly} />
            <Label htmlFor="show-versions" className="text-sm">
              Named Versions Only
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch checked={showChangesOnly} onCheckedChange={setShowChangesOnly} />
            <Label htmlFor="show-changes" className="text-sm">
              Changes Only
            </Label>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setAiPanelOpen(!aiPanelOpen)}
            className="flex items-center space-x-2"
          >
            <Brain className="h-4 w-4" />
            <span>AI Assistant</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex space-x-4 min-h-0">
        {/* Gantt Chart Container */}
        <div
          ref={containerRef}
          className="flex-1 relative overflow-hidden border rounded-lg min-h-0"
          style={{ maxWidth: "100%", minWidth: 0 }}
        >
          <HBGanttComponent
            key={`gantt-${projectId}-${currentTheme}`}
            ref={ganttRef}
            project={ganttProject}
            columns={ganttColumns}
            features={ganttFeatures}
            responsiveLevels={ganttResponsiveLevels}
            theme={currentTheme === "dark" ? "classic-dark" : "classic"}
            enableUndoRedoKeys={true}
            dependencyIdField="sequenceNumber"
            resourceImageFolderPath="/images/users/"
            loadMask="Loading tasks..."
            rowHeight={38}
            tickSize={120}
            barMargin={9}
            viewPreset="monthAndYear"
            columnLines={false}
            tbar={[
              "Gantt view",
              "->",
              {
                ref: "undoredoTool",
                type: "undoredo",
                text: true,
                items: {
                  transactionsCombo: null,
                },
              },
            ]}
          />
        </div>

        {/* Version Grid Panel */}
        {showVersionsOnly && (
          <div className="w-80 border rounded-lg overflow-hidden">
            <div className="p-4 border-b bg-muted/50">
              <h3 className="font-semibold text-sm">Version History</h3>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    if (ganttRef.current?.features?.versions) {
                      ganttRef.current.features.versions.saveVersion()
                    }
                  }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Version
                </Button>

                <div className="text-xs text-muted-foreground">
                  <p>Track changes and save project versions</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Assistant Panel */}
      {aiPanelOpen && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>AI Schedule Assistant</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask about schedule optimization, risk analysis, or resource allocation..."
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Examples:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>"Identify critical path delays"</li>
                  <li>"Optimize resource allocation"</li>
                  <li>"Analyze schedule risks"</li>
                  <li>"Suggest schedule improvements"</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ProjectSchedule
