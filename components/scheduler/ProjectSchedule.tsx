// components/scheduler/ProjectSchedule.tsx
"use client"

import React, { useMemo, useState, useEffect } from "react"
import HBGanttChart from "@/components/charts/HBGanttChart"
import type { HBTask, HBLink } from "@/components/charts/HBGanttChart"
import scheduleData from "@/data/mock/schedule/schedule.json"

const ProjectSchedule: React.FC = () => {
  const [tasks, setTasks] = useState<HBTask[]>([])
  const [links, setLinks] = useState<HBLink[]>([])

  const toolbar = useMemo(
    () => [
      "undo",
      "redo",
      "zoomIn",
      "zoomOut",
      "zoomToFit",
      "addTask",
      "deleteTask",
      "expandAll",
      "collapseAll",
      "fullscreen",
      "exportPdf",
      "exportPng",
      "exportExcel",
    ],
    []
  )

  useEffect(() => {
    const loadedTasks: HBTask[] = scheduleData.map((item: any) => {
      const type = item.activity_type?.toLowerCase()
      return {
        id: item.activity_id,
        text: item.activity_name,
        start: new Date(item.start_date),
        end: new Date(item.end_date),
        type: type === "milestone" ? "milestone" : "task",
        progress: item.status === "Completed" ? 100 : item.status === "In Progress" ? 50 : 0,
        blStart: new Date(item.primary_base_start_date),
        blEnd: new Date(item.primary_base_end_date),
      }
    })

    const loadedLinks: HBLink[] = scheduleData.flatMap((item: any) =>
      (item.successors || []).map((succ: string) => ({
        source: item.activity_id,
        target: succ,
        type: 2,
      }))
    )

    setTasks(loadedTasks)
    setLinks(loadedLinks)
  }, [])

  return (
    <div className="w-full h-full">
      <HBGanttChart tasks={tasks} links={links} height="80vh" toolbar={toolbar} />
    </div>
  )
}

export default ProjectSchedule
