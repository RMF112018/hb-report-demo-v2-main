import React from "react"
import { Card, CardContent } from "../../../ui/card"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  icon: LucideIcon
  value: string | number
  description: string
  className?: string
}

const getIconColor = (title: string) => {
  const titleLower = title.toLowerCase()
  if (titleLower.includes("total") || titleLower.includes("projects")) {
    return "text-blue-600 dark:text-blue-400"
  }
  if (titleLower.includes("open") || titleLower.includes("bids")) {
    return "text-green-600 dark:text-green-400"
  }
  if (titleLower.includes("complete") || titleLower.includes("awarded")) {
    return "text-emerald-600 dark:text-emerald-400"
  }
  if (titleLower.includes("progress") || titleLower.includes("active")) {
    return "text-amber-600 dark:text-amber-400"
  }
  if (titleLower.includes("value") || titleLower.includes("cost")) {
    return "text-violet-600 dark:text-violet-400"
  }
  if (titleLower.includes("estimate") || titleLower.includes("average")) {
    return "text-cyan-600 dark:text-cyan-400"
  }
  return "text-gray-500 dark:text-gray-400"
}

const MetricCard: React.FC<MetricCardProps> = ({ title, icon: Icon, value, description, className = "" }) => {
  const iconColor = getIconColor(title)

  return (
    <Card className={`${className} border-l-2 border-l-transparent hover:border-l-current transition-colors`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground truncate mb-1">{title}</p>
            <p className="text-lg font-bold text-foreground mb-0.5">{value}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className={`ml-2 flex-shrink-0 ${iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MetricCard
