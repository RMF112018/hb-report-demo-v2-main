"use client"

import React, { Component, forwardRef, Suspense, useEffect, useRef, useState, useCallback, useMemo } from "react"
import type { BryntumGanttProps } from "@bryntum/gantt-react"
import dynamic from "next/dynamic"

// Import Bryntum styles for themes
import "@bryntum/gantt/gantt.classic.css"
import "@bryntum/gantt/gantt.classic-dark.css"

// Import custom Gantt sizing styles
import "../../styles/gantt.css"

// Extend BryntumGanttProps to include additional properties
interface HBGanttBetaProps extends BryntumGanttProps {
  theme?: string
  enableUndoRedoKeys?: boolean
  loadMask?: string
}

// Dynamically import BryntumGantt to prevent SSR issues
const BryntumGantt = dynamic(() => import("@bryntum/gantt-react").then((mod) => ({ default: mod.BryntumGantt })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <div className="text-sm text-muted-foreground">Loading Gantt Chart...</div>
      </div>
    </div>
  ),
})

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
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-red-600 mb-2">Gantt Chart Error</div>
            <div className="text-sm text-muted-foreground">Please refresh the page to try again</div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * HBGantt component exactly aligned with Bryntum baselines example
 */
const HBGanttComponent = forwardRef<any, HBGanttBetaProps>((props, ref) => {
  const [isMounted, setIsMounted] = useState(false)
  const uniqueId = useRef(`hb-gantt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`).current
  const ganttInstanceRef = useRef<any>(null)

  // Mount check for client-side only rendering
  useEffect(() => {
    setIsMounted(true)

    // Cleanup function to destroy Gantt instance on unmount
    return () => {
      if (ganttInstanceRef.current) {
        try {
          ganttInstanceRef.current.destroy()
        } catch (error) {
          console.warn("Error destroying Gantt instance:", error)
        }
        ganttInstanceRef.current = null
      }
    }
  }, [])

  // Baseline functions
  const setBaseline = useCallback((baselineIndex: number) => {
    if (ganttInstanceRef.current?.features?.baselines) {
      ganttInstanceRef.current.features.baselines.setBaseline(baselineIndex)
    }
  }, [])

  const toggleBaselineVisible = useCallback((baselineIndex: number, visible: boolean) => {
    if (ganttInstanceRef.current?.features?.baselines) {
      ganttInstanceRef.current.features.baselines.toggleBaselineVisible(baselineIndex, visible)
    }
  }, [])

  // Baseline renderer exactly as in the example
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

  // Configuration exactly matching the baselines example
  const baseConfig = useMemo(
    () => ({
      id: uniqueId,
      dependencyIdField: "wbsCode",
      rowHeight: 36, // Standard Gantt row height
      height: "100%",
      width: "100%",
      maxWidth: "100%",
      subGridConfigs: {
        locked: {
          flex: 1,
          width: "40%",
          maxWidth: "400px",
        },
        normal: {
          flex: 1,
          width: "60%",
        },
      },
      columns: [
        { type: "wbs", width: 60 },
        { type: "name", width: 200 },
        { type: "startdate", width: 100 },
        { type: "enddate", width: 100 },
        { type: "duration", width: 80 },
        {
          text: "Baseline 1",
          collapsible: true,
          width: 200,
          children: [
            { type: "baselinestartdate", text: "Start", field: "baselines[0].startDate", width: 80 },
            { type: "baselineenddate", text: "Finish", field: "baselines[0].endDate", width: 80 },
            { type: "baselineduration", text: "Duration", field: "baselines[0].fullDuration", width: 80 },
          ],
        },
      ],
      features: {
        baselines: {
          // Custom tooltip template exactly as in the example
          template(data: any): string {
            const { baseline } = data
            const { task } = baseline
            const delayed = task.startDate > baseline.startDate
            const overrun = task.durationMS > baseline.durationMS

            let { decimalPrecision } = this as any
            if (decimalPrecision == null) {
              decimalPrecision = (this as any).client.durationDisplayPrecision
            }

            const multiplier = Math.pow(10, decimalPrecision)
            const displayDuration = Math.round(baseline.duration * multiplier) / multiplier

            return `
            <div class="b-gantt-task-title">${task.name} (Baseline 1)</div>
            <table>
            <tr><td>Start:</td><td>${data.startClockHtml}</td></tr>
            ${
              baseline.milestone
                ? ""
                : `
              <tr><td>End:</td><td>${data.endClockHtml}</td></tr>
              <tr><td>Duration:</td><td class="b-right">${
                displayDuration + " " + baseline.durationUnit + (baseline.duration !== 1 ? "s" : "")
              }</td></tr>
            `
            }
            </table>
            ${
              delayed
                ? `
              <h4 class="statusmessage b-baseline-delay"><i class="statusicon b-fa b-fa-exclamation-triangle"></i>Delayed start by ${Math.round(
                (task.startDate - baseline.startDate) / (1000 * 60 * 60 * 24)
              )} days</h4>
            `
                : ""
            }
            ${
              overrun
                ? `
              <h4 class="statusmessage b-baseline-overrun"><i class="statusicon b-fa b-fa-exclamation-triangle"></i>Overrun by ${Math.round(
                (task.durationMS - baseline.durationMS) / (1000 * 60 * 60 * 24)
              )} days</h4>
            `
                : ""
            }
          `
          },
          renderer: baselineRenderer,
        },
        columnLines: false,
        filter: true,
        summary: {
          // Configure summary bars to have consistent height
          renderer: ({ taskRecord, renderData }: any) => {
            // Ensure summary bars respect row height
            renderData.style = renderData.style || {}
            renderData.style.height = "18px"
            renderData.style.minHeight = "18px"
            renderData.style.maxHeight = "18px"
            renderData.style.marginTop = "9px"
            renderData.style.marginBottom = "9px"
            renderData.style.position = "relative"
            renderData.style.top = "auto"
            renderData.style.bottom = "auto"
          },
        },
        labels: {
          before: {
            field: "name",
            editor: {
              type: "textfield",
            },
          },
        },
      },
      tbar: {
        items: {
          setBaseline: {
            type: "button" as const,
            text: "Set baseline",
            iconAlign: "end" as const,
            menu: [
              {
                text: "Set baseline 1",
                onItem() {
                  setBaseline(1)
                },
              },
            ],
          },
          showBaseline: {
            type: "button" as const,
            text: "Show baseline",
            iconAlign: "end" as const,
            menu: [
              {
                checked: true,
                text: "Baseline 1",
                onToggle({ checked }: any) {
                  toggleBaselineVisible(1, checked)
                },
              },
            ],
          },
          showBaselines: {
            type: "checkbox" as const,
            text: "Show baselines",
            checked: true,
            toggleable: true,
            onAction({ checked }: any) {
              if (ganttInstanceRef.current?.features?.baselines) {
                ganttInstanceRef.current.features.baselines.disabled = !checked
              }
            },
          },
          enableRenderer: {
            type: "checkbox" as const,
            text: "Enable baseline renderer",
            cls: "b-baseline-toggle",
            checked: true,
            toggleable: true,
            onAction({ checked }: any) {
              if (ganttInstanceRef.current?.features?.baselines) {
                ganttInstanceRef.current.features.baselines.renderer = checked ? baselineRenderer : () => {}
              }
            },
          },
        },
      },
    }),
    [uniqueId, baselineRenderer, setBaseline, toggleBaselineVisible]
  )

  // Merge props with base config
  const config = useMemo(
    () => ({
      ...baseConfig,
      ...props,
    }),
    [baseConfig, props]
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
      <div
        className="hb-gantt-parent w-full h-full min-h-0 max-w-full overflow-hidden"
        style={{ height: "100%", maxWidth: "100%" }}
      >
        <div
          className="w-full h-full flex flex-col max-w-full overflow-hidden"
          style={{ height: "100%", minHeight: "400px", maxWidth: "100%" }}
        >
          <BryntumGantt {...config} />
        </div>
      </div>
    </GanttErrorBoundary>
  )
})

HBGanttComponent.displayName = "HBGanttComponent"

export default HBGanttComponent
