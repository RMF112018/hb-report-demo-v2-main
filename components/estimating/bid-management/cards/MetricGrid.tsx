import React from "react"
import { LucideIcon } from "lucide-react"
import MetricCard from "./MetricCard"

interface MetricData {
  title: string
  icon: LucideIcon
  value: string | number
  description: string
  id: string
}

interface MetricGridProps {
  metrics: MetricData[]
  className?: string
}

const MetricGrid: React.FC<MetricGridProps> = ({ metrics, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {metrics.map((metric) => (
        <MetricCard
          key={metric.id}
          title={metric.title}
          icon={metric.icon}
          value={metric.value}
          description={metric.description}
        />
      ))}
    </div>
  )
}

export default MetricGrid
export type { MetricData }
