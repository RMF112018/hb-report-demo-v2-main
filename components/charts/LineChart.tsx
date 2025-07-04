// components/charts/LineChart.tsx
"use client"

import {
  LineChart as RechartsLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"

interface CustomLineChartProps {
  data: { name: string; value: number; [key: string]: any }[]
  title?: string
  color?: string
  colors?: string[]
  compact?: boolean
  showGrid?: boolean
  showDots?: boolean
  animated?: boolean
  height?: number
  showLegend?: boolean
  dataKeys?: string[]
}

/**
 * Enhanced LineChart
 * ------------------
 * Professional line chart with advanced styling, animations, and responsive design
 * Optimized for executive dashboards with smooth curves and elegant presentation
 */
export function CustomLineChart({
  data,
  title,
  color = "hsl(var(--chart-2))",
  colors,
  compact = false,
  showGrid = true,
  showDots = true,
  animated = true,
  height,
  showLegend = false,
  dataKeys = ["value"],
}: CustomLineChartProps) {
  // Default color palette for multiple lines
  const defaultColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  const lineColors = colors || defaultColors

  // Calculate value range for better Y-axis scaling
  const allValues = data.flatMap((d) => dataKeys.map((key) => d[key] || 0))
  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)
  const padding = (maxValue - minValue) * 0.1
  const yAxisDomain = [Math.max(0, minValue - padding), maxValue + padding]

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
              <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
              {entry.dataKey}: <span className="font-semibold">{entry.value.toLocaleString()}</span>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Custom dot component
  const CustomDot = (props: any) => {
    const { cx, cy, stroke } = props
    if (!showDots) return null
    return <circle cx={cx} cy={cy} r={3} fill={stroke} stroke="white" strokeWidth={2} className="drop-shadow-sm" />
  }

  const margins = compact ? { top: 5, right: 10, bottom: 5, left: 0 } : { top: 20, right: 30, bottom: 20, left: 20 }

  return (
    <Card className="h-full">
      <CardContent className="h-full p-4">
        <h3 className="text-md font-semibold mb-2">{title}</h3>
        <div className={compact ? "h-full w-full" : "h-full w-full"} style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={data} margin={margins}>
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

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeOpacity: 0.5 }}
              />

              {showLegend && <Legend />}

              {dataKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={lineColors[index % lineColors.length]}
                  strokeWidth={2.5}
                  dot={<CustomDot />}
                  activeDot={{
                    r: 5,
                    fill: lineColors[index % lineColors.length],
                    stroke: "white",
                    strokeWidth: 2,
                    className: "drop-shadow-md",
                  }}
                  animationDuration={animated ? 1500 : 0}
                  animationEasing="ease-in-out"
                />
              ))}

              {/* Optional reference line for average */}
              {data.length > 0 && (
                <ReferenceLine
                  y={allValues.reduce((a, b) => a + b, 0) / allValues.length}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="5 5"
                  strokeOpacity={0.4}
                />
              )}
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
