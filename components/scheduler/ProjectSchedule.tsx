"use client"

import React, { useEffect, useMemo, useState } from "react"
import HBGanttChart from "@/components/charts/HBGanttChart"
import type { HBTask, HBLink } from "@/components/charts/HBGanttChart"
import scheduleData from "@/data/mock/schedule/schedule.json"
import { parseISO, isValid } from "date-fns"

interface ProjectScheduleProps {
  userRole?: string
  projectData?: any
  projectId?: string
}

const ProjectSchedule: React.FC<ProjectScheduleProps> = ({ userRole, projectData, projectId }) => {
  const [tasks, setTasks] = useState<HBTask[]>([])
  const [links, setLinks] = useState<HBLink[]>([])

  useEffect(() => {
    const loadedTasks: HBTask[] = []
    const tempLinks: HBLink[] = []

    for (const item of scheduleData) {
      const parsedStart = item.start_date ? parseISO(item.start_date) : null
      const parsedEnd = item.end_date ? parseISO(item.end_date) : null
      const baselineStart = item.primary_base_start_date ? parseISO(item.primary_base_start_date) : undefined
      const baselineEnd = item.primary_base_end_date ? parseISO(item.primary_base_end_date) : undefined

      if (!parsedStart || !parsedEnd || !isValid(parsedStart) || !isValid(parsedEnd)) {
        console.warn("❌ Skipping invalid task:", item.activity_id, item.start_date, item.end_date)
        continue
      }

      loadedTasks.push({
        id: item.activity_id,
        text: item.activity_name,
        start: parsedStart,
        end: parsedEnd,
        progress: item.status === "Completed" ? 1 : item.status === "In Progress" ? 0.5 : 0,
        isSummary: item.activity_type?.toLowerCase() === "summary",
        isCritical: item.total_float === 0,
        isMilestone: item.activity_type?.toLowerCase() === "milestone",
        baselineStart,
        baselineEnd,
      })

      if (Array.isArray(item.predecessors)) {
        for (const predId of item.predecessors) {
          tempLinks.push({ source: predId, target: item.activity_id })
        }
      }
    }

    console.log("✅ Loaded Tasks:", loadedTasks.slice(0, 5))
    console.log("🔗 Generated Links:", tempLinks.slice(0, 5))

    setTasks(loadedTasks)
    setLinks(tempLinks)
  }, [])

  const memoizedTasks = useMemo(() => tasks, [tasks])
  const memoizedLinks = useMemo(() => links, [links])

  if (!tasks.length) {
    return <div className="p-4 text-muted-foreground text-sm">Loading schedule...</div>
  }

  return (
    <div className="w-full h-full">
      <HBGanttChart tasks={memoizedTasks} links={memoizedLinks} height="80vh" />
    </div>
  )
}

export default ProjectSchedule
