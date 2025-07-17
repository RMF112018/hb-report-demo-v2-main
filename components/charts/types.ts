export interface HBTask {
  id: string
  text: string
  start: Date
  end: Date
  baselineStart?: Date
  baselineEnd?: Date
  progress?: number
  isSummary?: boolean
  isCritical?: boolean
}

export interface HBGanttChartProps {
  tasks: HBTask[]
  height?: string
  width?: string
}
