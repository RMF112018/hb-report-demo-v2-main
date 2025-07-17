// components/charts/HBGanttChart.tsx
"use client"

import React, { forwardRef, useRef, useState, useEffect } from "react"
import { Gantt, Willow, WillowDark } from "wx-react-gantt"
import "wx-react-gantt/dist/gantt.css"

export interface HBTask {
  id: string | number
  text: string
  start: Date
  end: Date
  type?: "task" | "milestone"
  progress?: number
  blStart?: Date
  blEnd?: Date
}

export interface HBLink {
  source: string | number
  target: string | number
  type?: number
}

export interface HBGanttChartProps {
  tasks: HBTask[]
  links?: HBLink[]
  height?: string | number
  width?: string | number
  theme?: "light" | "dark"
}

const HBGanttChart = forwardRef<HTMLDivElement, HBGanttChartProps>(
  ({ tasks, links = [], height = "100%", width = "100%", theme = "light" }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [ready, setReady] = useState(false)

    useEffect(() => {
      if (tasks.length && !ready) {
        setTimeout(() => setReady(true), 50)
      }
    }, [tasks, ready])

    const ThemeWrapper = theme === "dark" ? WillowDark : Willow

    return (
      <div
        ref={(el) => {
          if (ref && typeof ref === "function") ref(el)
          else if (ref) ref.current = el
          containerRef.current = el
        }}
        style={{ height, width }}
        className="relative overflow-hidden"
      >
        {ready ? (
          <ThemeWrapper>
            <Gantt
              tasks={tasks.map((task) => ({
                ...task,
                type: task.type === "milestone" ? "milestone" : "task",
              }))}
              links={links}
              scales={[
                { unit: "month", step: 1, format: "MMM yyyy" },
                { unit: "day", step: 1, format: "d" },
              ]}
            />
          </ThemeWrapper>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-sm text-muted-foreground">Loading schedule…</span>
          </div>
        )}
      </div>
    )
  }
)

HBGanttChart.displayName = "HBGanttChart"

export default HBGanttChart
