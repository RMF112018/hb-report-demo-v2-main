// components/charts/HBGanttChart.tsx
"use client"

import React, { useRef, useEffect, useMemo, useState } from "react"
import { format, isToday } from "date-fns"

export interface HBTask {
  id: string | number
  text: string
  start: Date
  end: Date
  progress?: number
  isSummary?: boolean
  isCritical?: boolean
  isMilestone?: boolean
  baselineStart?: Date
  baselineEnd?: Date
  parentId?: string | number
  depth?: number
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
}

const HBGanttChart: React.FC<HBGanttChartProps> = ({
  tasks,
  links = [],
  height = "600px",
  width: chartWidth = "100%",
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [collapsed, setCollapsed] = useState<Record<string | number, boolean>>({})

  const dayWidth = 28
  const rowHeight = 32

  const visibleTasks = useMemo(() => {
    const visible: HBTask[] = []
    const taskMap = Object.fromEntries(tasks.map((t) => [t.id, t]))

    const isVisible = (task: HBTask): boolean => {
      if (!task.parentId) return true
      return !collapsed[task.parentId] && isVisible(taskMap[task.parentId])
    }

    for (const task of tasks) {
      if (isVisible(task)) visible.push(task)
    }

    return visible
  }, [tasks, collapsed])

  const { chartStart, chartEnd, daysArray, months } = useMemo(() => {
    const validStartDates = tasks.map((t) => t.start).filter((d) => d instanceof Date && !isNaN(d.getTime()))
    const validEndDates = tasks.map((t) => t.end).filter((d) => d instanceof Date && !isNaN(d.getTime()))

    if (!validStartDates.length || !validEndDates.length) {
      console.error("🚫 No valid task dates found.", tasks)
      return { chartStart: null, chartEnd: null, daysArray: [], months: [] }
    }

    const chartStart = new Date(Math.min(...validStartDates.map((d) => d.getTime())))
    const chartEnd = new Date(Math.max(...validEndDates.map((d) => d.getTime())))
    const totalDays = Math.ceil((chartEnd.getTime() - chartStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const daysArray = Array.from({ length: totalDays }, (_, i) => new Date(chartStart.getTime() + i * 86400000))

    const months: { label: string; width: number }[] = []
    let currentMonth = format(daysArray[0], "MMMM yyyy")
    let monthWidth = 0

    for (let i = 0; i < daysArray.length; i++) {
      const m = format(daysArray[i], "MMMM yyyy")
      if (m === currentMonth) {
        monthWidth++
      } else {
        months.push({ label: currentMonth, width: monthWidth })
        currentMonth = m
        monthWidth = 1
      }
    }
    months.push({ label: currentMonth, width: monthWidth })

    console.log("📆 Gantt Chart Range", {
      chartStart,
      chartEnd,
      days: daysArray.length,
      start: format(chartStart, "yyyy-MM-dd"),
      end: format(chartEnd, "yyyy-MM-dd"),
    })

    return { chartStart, chartEnd, daysArray, months }
  }, [tasks])

  useEffect(() => {
    if (containerRef.current && tasks.length) {
      containerRef.current.scrollLeft = 0
    }
  }, [tasks.length])

  if (!chartStart || !chartEnd) {
    return <div className="text-sm p-4 text-red-500">Invalid or missing task dates.</div>
  }

  const totalDays = daysArray.length

  const getTaskOffset = (start: Date) => {
    return Math.floor((start.getTime() - chartStart.getTime()) / (1000 * 60 * 60 * 24)) * dayWidth
  }

  const getTaskWidth = (start: Date, end: Date) => {
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) * dayWidth)
  }

  const toggleCollapse = (id: string | number) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-x-auto border rounded bg-white dark:bg-zinc-900"
      style={{ width: chartWidth, height }}
    >
      <div className="relative" style={{ width: totalDays * dayWidth + 240 }}>
        {/* Header Row: Months */}
        <div className="sticky top-0 z-30 flex text-xs text-gray-700 dark:text-gray-200 bg-muted/50 backdrop-blur border-b border-muted">
          <div style={{ width: 240 }} className="border-r px-2 py-1 font-medium text-left">
            Task
          </div>
          <div className="flex-1 flex">
            {months.map((month, index) => (
              <div
                key={index}
                className="border-r border-muted text-center font-semibold"
                style={{ width: month.width * dayWidth }}
              >
                {month.label}
              </div>
            ))}
          </div>
        </div>

        {/* Header Row: Days */}
        <div className="sticky top-7 z-20 flex text-[10px] text-muted-foreground bg-muted border-b border-muted">
          <div style={{ width: 240 }} className="border-r px-2 py-1">
            &nbsp;
          </div>
          <div className="flex-1 flex relative">
            {daysArray.map((d, i) => (
              <div
                key={i}
                className={`text-center border-r border-muted flex items-center justify-center h-full ${
                  isToday(d) ? "bg-blue-100 dark:bg-blue-900" : ""
                }`}
                style={{ width: dayWidth }}
                title={format(d, "eeee, MMMM d")}
              >
                {format(d, "d")}
              </div>
            ))}
            {isToday(new Date()) && (
              <div
                className="absolute top-0 bottom-0 w-[1px] bg-blue-500 z-10"
                style={{ left: getTaskOffset(new Date()) }}
              />
            )}
          </div>
        </div>

        {/* SVG for links */}
        <svg
          ref={svgRef}
          className="absolute left-[240px] top-[64px] pointer-events-none"
          height={visibleTasks.length * rowHeight}
          width={totalDays * dayWidth}
        >
          {links.map((link, i) => {
            const fromIndex = visibleTasks.findIndex((t) => t.id === link.source)
            const toIndex = visibleTasks.findIndex((t) => t.id === link.target)
            const from = visibleTasks[fromIndex]
            const to = visibleTasks[toIndex]
            if (!from || !to) return null

            const x1 = getTaskOffset(from.end)
            const y1 = fromIndex * rowHeight + rowHeight / 2
            const x2 = getTaskOffset(to.start)
            const y2 = toIndex * rowHeight + rowHeight / 2

            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="gray" strokeWidth={1} />
          })}
        </svg>

        {/* Task Rows */}
        {visibleTasks.map((task, rowIndex) => (
          <div
            key={task.id}
            className={`flex items-center border-b h-8 text-xs dark:text-white ${
              task.isSummary ? "bg-gray-50 dark:bg-zinc-800 font-medium" : ""
            }`}
          >
            <div style={{ width: 240 }} className="px-2 border-r truncate text-sm">
              <span style={{ marginLeft: (task.depth || 0) * 12 }}>
                {task.isSummary && (
                  <button onClick={() => toggleCollapse(task.id)} className="mr-1 text-xs">
                    {collapsed[task.id] ? "▶" : "▼"}
                  </button>
                )}
                {task.isMilestone ? "⏺️ " : ""}
                {task.text}
              </span>
            </div>
            <div className="relative flex-1 h-full">
              {task.baselineStart && task.baselineEnd && (
                <div
                  className="absolute top-3 h-2 bg-yellow-300/60 rounded"
                  style={{
                    left: getTaskOffset(task.baselineStart),
                    width: getTaskWidth(task.baselineStart, task.baselineEnd),
                  }}
                />
              )}
              {task.isMilestone ? (
                <div
                  className="absolute top-[6px] w-2 h-2 bg-emerald-400 rounded-full shadow"
                  style={{ left: getTaskOffset(task.start) }}
                  title={task.text}
                />
              ) : (
                <div
                  className={`absolute top-1 h-6 rounded text-white text-[10px] px-1 flex items-center justify-center shadow-sm whitespace-nowrap overflow-hidden ${
                    task.isSummary ? "bg-gray-500" : task.isCritical ? "bg-red-500" : "bg-blue-500"
                  }`}
                  style={{
                    left: getTaskOffset(task.start),
                    width: getTaskWidth(task.start, task.end),
                  }}
                >
                  {task.progress != null ? `${Math.round(task.progress * 100)}%` : ""}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HBGanttChart
