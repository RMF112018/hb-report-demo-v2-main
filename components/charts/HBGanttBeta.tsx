"use client"

import React, { Component, forwardRef, Suspense, useEffect, useRef, useState, useCallback, useMemo } from "react"
import type { BryntumGanttProps } from "@bryntum/gantt-react"
import { BryntumGantt } from "@bryntum/gantt-react"

// Import Bryntum styles for themes
import "@bryntum/gantt/gantt.classic.css"
import "@bryntum/gantt/gantt.classic-dark.css"

// Import custom Gantt sizing styles
import "../../styles/gantt.css"

/**
 * Error boundary to catch and display errors from the Bryntum Gantt component.
 */
class GanttErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Gantt Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <div className="text-red-500 font-semibold mb-2">Gantt Chart Error</div>
          <div className="text-sm text-gray-600">
            There was an error loading the Gantt chart. Please refresh the page.
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Enhanced HBGantt component aligned with Bryntum baselines example
 */
const HBGanttComponent = forwardRef<any, any>((props, ref) => {
  const [isMounted, setIsMounted] = useState(false)
  const ganttInstanceRef = useRef<any>(null)

  // Generate unique ID to prevent conflicts
  const uniqueId = useMemo(() => {
    return `hb-gantt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }, [])

  const handleGanttRef = useCallback(
    (instance: any) => {
      ganttInstanceRef.current = instance
      if (ref) {
        if (typeof ref === "function") {
          ref(instance)
        } else {
          ref.current = instance
        }
      }
    },
    [ref]
  )

  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])

  // Baseline renderer function aligned with baselines example
  const baselineRenderer = useCallback(({ baselineRecord, taskRecord, renderData }: any) => {
    if (
      baselineRecord.isScheduled &&
      taskRecord.isScheduled &&
      baselineRecord.endDate.getTime() + 24 * 3600 * 1000 < taskRecord.endDate.getTime()
    ) {
      renderData.className["b-baseline-behind"] = 1
    } else if (taskRecord.endDate < baselineRecord.endDate) {
      renderData.className["b-baseline-ahead"] = 1
    } else {
      renderData.className["b-baseline-on-time"] = 1
    }
  }, [])

  // Enhanced configuration aligned with baselines example
  const enhancedConfig = useMemo(
    () => ({
      ...props,
      id: uniqueId,
      dependencyIdField: "wbsCode",
      rowHeight: 60, // Allow extra space for baselines
      tickSize: 120,
      barMargin: 9,
      viewPreset: "monthAndYear",
      resourceImageFolderPath: "/images/users/",
      columnLines: false,
      // Let CSS handle sizing per Bryntum documentation
      autoHeight: false, // Use flex sizing instead
      subGridConfigs: {
        locked: {
          flex: 1,
        },
        normal: {
          flex: 1,
        },
      },
      features: {
        baselines: {
          // Custom tooltip template for baselines aligned with example
          template(data: any): string {
            const { baseline } = data
            const { task } = baseline
            const delayed = task.startDate > baseline.startDate
            const overrun = task.durationMS > baseline.durationMS

            // Calculate duration display
            const displayDuration = baseline.duration + " " + baseline.durationUnit

            // Calculate time differences in days
            const delayedDays = delayed ? Math.round((task.startDate - baseline.startDate) / (1000 * 60 * 60 * 24)) : 0
            const overrunDays = overrun
              ? Math.round((task.durationMS - baseline.durationMS) / (1000 * 60 * 60 * 24))
              : 0

            return `
              <div class="b-gantt-task-title">${task.name} (Baseline ${baseline.parentIndex + 1})</div>
              <table>
              <tr><td>Start:</td><td>${data.startClockHtml}</td></tr>
              ${
                baseline.milestone
                  ? ""
                  : `
                <tr><td>End:</td><td>${data.endClockHtml}</td></tr>
                <tr><td>Duration:</td><td class="b-right">${displayDuration}</td></tr>
              `
              }
              </table>
              ${
                delayed
                  ? `
                <h4 class="statusmessage b-baseline-delay"><i class="statusicon b-fa b-fa-exclamation-triangle"></i>Delayed start by ${delayedDays} days</h4>
              `
                  : ""
              }
              ${
                overrun
                  ? `
                <h4 class="statusmessage b-baseline-overrun"><i class="statusicon b-fa b-fa-exclamation-triangle"></i>Overrun by ${overrunDays} days</h4>
              `
                  : ""
              }
            `
          },
          renderer: baselineRenderer,
        },
        projectLines: false,
        rollups: true,
        dependencies: {
          radius: 10,
          clickWidth: 5,
          renderer({ domConfig, dependencyRecord }: any) {
            // Add custom CSS class to cross-project dependencies
            if (dependencyRecord.fromTask && dependencyRecord.toTask) {
              const fromTaskProject = dependencyRecord.fromTask.findAncestor?.((task: any) => task.isProject)
              const toTaskProject = dependencyRecord.toTask.findAncestor?.((task: any) => task.isProject)
              const isCrossProject = fromTaskProject && toTaskProject && fromTaskProject !== toTaskProject
              domConfig.class.crossProject = isCrossProject
            }
          },
          tooltipTemplate(dependencyRecord: any) {
            return [
              { tag: "label", text: "From" },
              { text: dependencyRecord.fromEvent?.name || "Unknown" },
              { tag: "label", text: "To" },
              { text: dependencyRecord.toEvent?.name || "Unknown" },
              { tag: "label", text: "Lag" },
              { text: `${dependencyRecord.lag || 0} ${dependencyRecord.lagUnit || "days"}` },
              // Check for cross-project dependency
              (() => {
                if (dependencyRecord.fromTask && dependencyRecord.toTask) {
                  const fromTaskProject = dependencyRecord.fromTask.findAncestor?.((task: any) => task.isProject)
                  const toTaskProject = dependencyRecord.toTask.findAncestor?.((task: any) => task.isProject)
                  const isCrossProject = fromTaskProject && toTaskProject && fromTaskProject !== toTaskProject
                  return isCrossProject ? { tag: "label", text: "Cross project dependency" } : undefined
                }
                return undefined
              })(),
            ]
          },
        },
        labels: {
          before: {
            field: "name",
            editor: {
              type: "textfield",
            },
          },
          right: {
            field: "name",
            renderer({ taskRecord, domConfig }: any) {
              domConfig.children = [taskRecord.name]

              if (taskRecord.prio) {
                domConfig.children.push({
                  class: "b-prio-tag",
                  dataset: {
                    btip: "Priority " + taskRecord.prio,
                  },
                  text: taskRecord.prio,
                })
              }
            },
            editor: {
              type: "textfield",
            },
          },
        },
        taskTooltip: {
          template({ taskRecord }: any) {
            const startDate = taskRecord.startDate ? new Date(taskRecord.startDate).toLocaleDateString() : "Unknown"
            const duration = taskRecord.duration || taskRecord.fullDuration || "Unknown"
            return `<div class="field"><label>Task</label><span>${taskRecord.name || "Unknown"}</span></div>
                  <div class="field"><label>Priority</label><span class="b-prio-tag">${
                    taskRecord.prio || "Normal"
                  }</span></div>
                  <div class="field"><label>Start</label><span>${startDate}</span></div>
                  <div class="field"><label>Duration</label><span>${duration}</span></div>`
          },
        },
        filter: true,
        // Include all other features from props
        ...props.features,
      },
      columns: [
        { type: "wbs" },
        { type: "name", width: 300 },
        { type: "startdate" },
        { type: "enddate" },
        { type: "duration" },
        {
          text: "Baseline 1",
          collapsible: true,
          children: [
            { type: "baselinestartdate", text: "Start", field: "baselines[0].startDate" },
            { type: "baselineenddate", text: "Finish", field: "baselines[0].endDate" },
            { type: "baselineduration", text: "Duration", field: "baselines[0].fullDuration" },
            { type: "baselinestartvariance", field: "baselines[0].startVariance" },
            { type: "baselineendvariance", field: "baselines[0].endVariance" },
            { type: "baselinedurationvariance", field: "baselines[0].durationVariance" },
          ],
        },
        {
          text: "Baseline 2",
          collapsible: true,
          collapsed: true,
          children: [
            { type: "baselinestartdate", text: "Start", field: "baselines[1].startDate" },
            { type: "baselineenddate", text: "Finish", field: "baselines[1].endDate" },
            { type: "baselineduration", text: "Duration", field: "baselines[1].fullDuration" },
            { type: "baselinestartvariance", field: "baselines[1].startVariance" },
            { type: "baselineendvariance", field: "baselines[1].endVariance" },
            { type: "baselinedurationvariance", field: "baselines[1].durationVariance" },
          ],
        },
        {
          text: "Baseline 3",
          collapsible: true,
          collapsed: true,
          children: [
            { type: "baselinestartdate", text: "Start", field: "baselines[2].startDate" },
            { type: "baselineenddate", text: "Finish", field: "baselines[2].endDate" },
            { type: "baselineduration", text: "Duration", field: "baselines[2].fullDuration" },
            { type: "baselinestartvariance", field: "baselines[2].startVariance" },
            { type: "baselineendvariance", field: "baselines[2].endVariance" },
            { type: "baselinedurationvariance", field: "baselines[2].durationVariance" },
          ],
        },
        ...(props.columns || []),
      ],
      project: {
        // Add custom fields to the project configuration
        taskStore: {
          ...props.project?.taskStore,
          fields: ["isProject", "prio", "baselines", ...(props.project?.taskStore?.fields || [])],
        },
        dependencyStore: {
          ...props.project?.dependencyStore,
        },
        ...props.project,
      },
      listeners: {
        // Add error handling for subgrid creation
        beforeSubGridCreate: ({ subGridConfig }: any) => {
          // Ensure unique IDs for subgrids
          if (subGridConfig.id) {
            subGridConfig.id = `${uniqueId}-${subGridConfig.id}-${Date.now()}`
          }
          return true
        },
        // Add listeners for enhanced functionality
        taskDrop: ({ taskRecords }: any) => {
          if (ganttInstanceRef.current?.features?.versions) {
            ganttInstanceRef.current.features.versions.transactionDescription =
              taskRecords.length === 1 ? `Dragged task ${taskRecords[0].name}` : `Dragged ${taskRecords.length} tasks`
          }
        },
        taskResizeEnd: ({ taskRecord }: any) => {
          if (ganttInstanceRef.current?.features?.versions) {
            ganttInstanceRef.current.features.versions.transactionDescription = `Resized task ${taskRecord.name}`
          }
        },
        afterDependencyCreateDrop: () => {
          if (ganttInstanceRef.current?.features?.versions) {
            ganttInstanceRef.current.features.versions.transactionDescription = `Drew a link`
          }
        },
        transactionChange: ({ hasUnattachedTransactions }: any) => {
          // Handle transaction changes
          console.log("Transaction change:", hasUnattachedTransactions)
        },
        ...props.listeners,
      },
    }),
    [props, uniqueId, baselineRenderer]
  )

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <div className="text-sm text-muted-foreground">Loading Gantt Chart...</div>
        </div>
      </div>
    )
  }

  return (
    <GanttErrorBoundary>
      <div className="hb-gantt-parent w-full h-full min-h-0">
        <div className="w-full h-full flex flex-col" style={{ minHeight: "400px" }}>
          <BryntumGantt ref={handleGanttRef} {...enhancedConfig} />
        </div>
      </div>
    </GanttErrorBoundary>
  )
})

HBGanttComponent.displayName = "HBGanttComponent"

export default HBGanttComponent
