// components/charts/BarChart.tsx
"use client"

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts"

interface BarChartProps {
  data: { name: string; value: number }[]
  title?: string
  color?: string
  colors?: string[]
  compact?: boolean
  showGrid?: boolean
  showValues?: boolean
  animated?: boolean
  height?: number
  horizontal?: boolean
}

/**
 * Enhanced CustomBarChart
 * -----------------------
 * Professional bar chart with advanced styling, animations, and responsive design
 * Optimized for executive dashboards with smooth animations and elegant gradients
 */
export function CustomBarChart({
  data,
  title,
  color = "hsl(var(--chart-1))",
  colors,
  compact = false,
  showGrid = true,
  showValues = false,
  animated = true,
  height,
  horizontal = false,
}: BarChartProps) {
  // Generate gradient ID to avoid conflicts
  const gradientId = `colorBar-${Math.random().toString(36).substr(2, 9)}`

  // Default color palette for multiple bars
  const defaultColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  const barColors = colors || defaultColors

  // Calculate value range for better axis scaling
  const values = data.map((d) => d.value)
  const maxValue = Math.max(...values)
  const padding = maxValue * 0.1
  const axisDomain = [0, maxValue + padding]

  console.log("📊 Value range:", { values, maxValue, padding, axisDomain })

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: payload[0].color }} />
            Value: <span className="font-semibold">{payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      )
    }
    return null
  }

  // Custom label component for values on bars
  const CustomLabel = (props: any) => {
    const { x, y, width, height, value } = props
    if (!showValues) return null

    return (
      <text
        x={horizontal ? x + width + 5 : x + width / 2}
        y={horizontal ? y + height / 2 : y - 5}
        textAnchor={horizontal ? "start" : "middle"}
        dominantBaseline={horizontal ? "middle" : "auto"}
        className="text-xs font-medium fill-gray-600 dark:fill-gray-400"
      >
        {value.toLocaleString()}
      </text>
    )
  }

  const margins = compact ? { top: 5, right: 10, bottom: 5, left: 0 } : { top: 20, right: 30, bottom: 20, left: 20 }

  // Debug logging
  console.log("📊 CustomBarChart rendering with:", { data, colors, height, compact })
  console.log(
    "📊 Data values:",
    data.map((d) => `${d.name}: ${d.value}`)
  )

  // Early return if no data
  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
        <span className="text-sm">No data available</span>
      </div>
    )
  }

  return (
    <div className={compact ? "h-full w-full" : "h-full w-full"} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={margins}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2={horizontal ? "1" : "0"} y2={horizontal ? "0" : "1"}>
              <stop offset="5%" stopColor={color} stopOpacity={0.9} />
              <stop offset="95%" stopColor={color} stopOpacity={0.6} />
            </linearGradient>
          </defs>

          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              strokeOpacity={0.3}
              horizontal={!horizontal}
              vertical={horizontal}
            />
          )}

          {horizontal ? (
            <>
              <XAxis
                type="number"
                tick={{
                  fontSize: compact ? 10 : 12,
                  fill: "hsl(var(--muted-foreground))",
                }}
                tickLine={false}
                axisLine={false}
                domain={axisDomain}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                  return value.toString()
                }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{
                  fontSize: compact ? 10 : 12,
                  fill: "hsl(var(--muted-foreground))",
                }}
                tickLine={false}
                axisLine={false}
                width={compact ? 60 : 80}
              />
            </>
          ) : (
            <>
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
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                  return value.toString()
                }}
              />
            </>
          )}

          <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.1 }} />

          <Bar
            dataKey="value"
            fill={colors ? barColors[0] : `url(#${gradientId})`}
            radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
            animationDuration={animated ? 1000 : 0}
            animationEasing="ease-out"
          >
            {colors &&
              data.map((_, index) => <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />)}
            {showValues && <LabelList content={<CustomLabel />} />}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
