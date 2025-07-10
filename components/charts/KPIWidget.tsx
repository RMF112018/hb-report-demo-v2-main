"use client"

import { cn } from "@/lib/utils"

interface KPIWidgetProps {
  icon?: React.ElementType
  label?: string
  value: string | number
  sublabel?: string
  unit?: string
  trend?: "up" | "down" | "stable"
  caption?: string
  emphasisColor?: string
  compact?: boolean
  performance?: "good" | "ok" | "warning" | "bad"
}

/**
 * KPIWidget
 * ---------
 * Displays a KPI metric in a compact, modern tile. Supports a 'compact' mode for smaller font and padding.
 */
export function KPIWidget({
  icon: Icon,
  label,
  value,
  sublabel,
  unit,
  trend,
  caption,
  emphasisColor = "text-primary",
  compact = false,
  performance = "ok",
}: KPIWidgetProps) {
  const trendSymbol = trend === "up" ? "\u25b2" : trend === "down" ? "\u25bc" : "\u25cf"
  const trendColor =
    trend === "up"
      ? "text-green-500 dark:text-green-400"
      : trend === "down"
      ? "text-red-500 dark:text-red-400"
      : "text-muted-foreground"

  // Performance-based color coding
  const getPerformanceStyles = () => {
    switch (performance) {
      case "good":
        return "bg-green-50/30 dark:bg-green-950/20 border-green-200/50 dark:border-green-800/30 shadow-green-100/50 dark:shadow-green-900/10"
      case "warning":
        return "bg-amber-50/30 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-800/30 shadow-amber-100/50 dark:shadow-amber-900/10"
      case "bad":
        return "bg-red-50/30 dark:bg-red-950/20 border-red-200/50 dark:border-red-800/30 shadow-red-100/50 dark:shadow-red-900/10"
      default: // 'ok'
        return "bg-gray-50/30 dark:bg-gray-950/20 border-gray-200/50 dark:border-gray-800/30 shadow-gray-100/50 dark:shadow-gray-900/10"
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-lg shadow-sm border w-full",
        getPerformanceStyles(),
        compact
          ? "p-1 sm:p-1.5 text-xs min-h-[48px] sm:min-h-[52px]"
          : "p-2.5 sm:p-3 text-base min-h-[70px] sm:min-h-[75px]"
      )}
    >
      {Icon && (
        <div className={compact ? "mb-0.5" : "mb-1"}>
          <Icon className={compact ? "h-2.5 w-2.5 sm:h-3 sm:w-3" : "h-3.5 w-3.5 sm:h-4 sm:w-4"} />
        </div>
      )}

      <div
        className={
          compact
            ? "text-[10px] sm:text-[11px] text-muted-foreground truncate"
            : "text-xs sm:text-sm text-muted-foreground"
        }
      >
        {label}
      </div>

      <div
        className={cn(
          compact ? "text-sm sm:text-base lg:text-lg" : "text-xl sm:text-2xl lg:text-3xl",
          "font-semibold leading-tight",
          emphasisColor
        )}
      >
        {value}
        {unit && (
          <span className={compact ? "text-[10px] sm:text-xs ml-0.5" : "text-sm sm:text-base ml-1"}>{unit}</span>
        )}
      </div>

      {sublabel && <div className={compact ? "text-[9px] sm:text-[10px] mt-0.5" : "text-xs mt-1"}>{sublabel}</div>}

      {caption && (
        <div
          className={compact ? "flex items-center mt-0.5 text-[9px] sm:text-[10px]" : "flex items-center mt-1 text-xs"}
        >
          <span className={`${trendColor} mr-0.5 sm:mr-1`}>{trendSymbol}</span>
          <span className="text-muted-foreground truncate">{caption}</span>
        </div>
      )}
    </div>
  )
}
