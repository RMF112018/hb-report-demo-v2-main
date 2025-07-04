"use client"

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

interface AreaChartProps {
  data: { name: string; value: number }[]
  title?: string
  color?: string
  compact?: boolean
  showGrid?: boolean
  showDots?: boolean
  animated?: boolean
  height?: number
}

/**
 * Enhanced AreaChart
 * ------------------
 * Professional area chart with advanced styling, animations, and responsive design
 * Optimized for executive dashboards with smooth curves and elegant gradients
 */
export function AreaChart({
  data,
  title,
  color = "hsl(var(--chart-1))",
  compact = false,
  showGrid = true,
  showDots = false,
  animated = true,
  height,
}: AreaChartProps) {
  // Generate gradient ID to avoid conflicts
  const gradientId = `colorValue-${Math.random().toString(36).substr(2, 9)}`

  // Calculate value range for better Y-axis scaling
  const values = data.map((d) => d.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const padding = (maxValue - minValue) * 0.1
  const yAxisDomain = [Math.max(0, minValue - padding), maxValue + padding]

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }} />
            Value: <span className="font-semibold">{payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      )
    }
    return null
  }

  // Custom dot component for data points
  const CustomDot = (props: any) => {
    const { cx, cy } = props
    if (!showDots) return null
    return <circle cx={cx} cy={cy} r={3} fill={color} stroke="white" strokeWidth={2} className="drop-shadow-sm" />
  }

  const margins = compact ? { top: 5, right: 10, bottom: 5, left: 0 } : { top: 20, right: 30, bottom: 20, left: 20 }

  return (
    <div className={compact ? "h-full w-full" : "h-full w-full"} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data} margin={margins}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="25%" stopColor={color} stopOpacity={0.6} />
              <stop offset="50%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0.05} />
            </linearGradient>
          </defs>

          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} vertical={false} />
          )}

          <XAxis
            dataKey="name"
            tick={{
              fontSize: compact ? 10 : 12,
              fill: "hsl(var(--muted-foreground))",
            }}
            tickLine={false}
            axisLine={false}
            dy={5}
          />

          <YAxis
            tick={{
              fontSize: compact ? 10 : 12,
              fill: "hsl(var(--muted-foreground))",
            }}
            tickLine={false}
            axisLine={false}
            dx={-5}
            domain={yAxisDomain}
            tickFormatter={(value) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
              if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
              return value.toString()
            }}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: color, strokeWidth: 1, strokeOpacity: 0.5 }} />

          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            dot={<CustomDot />}
            activeDot={{
              r: 5,
              fill: color,
              stroke: "white",
              strokeWidth: 2,
              className: "drop-shadow-md",
            }}
            animationDuration={animated ? 1500 : 0}
            animationEasing="ease-in-out"
          />

          {/* Optional reference line for average */}
          {data.length > 0 && (
            <ReferenceLine
              y={values.reduce((a, b) => a + b, 0) / values.length}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="5 5"
              strokeOpacity={0.4}
            />
          )}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  )
}
