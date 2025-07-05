"use client"

import { FunnelChart as ReFunnelChart, Funnel, Tooltip, LabelList, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

interface ChartProps {
  title?: string
  data: any[]
  xKey: string
  yKey: string
}

// Professional color palette for funnel chart
const FUNNEL_COLORS = [
  "#dc2626", // Red for Lead stage
  "#d97706", // Orange for Proposal stage
  "#2563eb", // Blue for Negotiation stage
  "#059669", // Green for Award stage
  "#7c3aed", // Purple for additional stages
  "#0891b2", // Cyan for additional stages
]

export function FunnelChart({ title = "Funnel Chart", data, xKey, yKey }: ChartProps) {
  // Format currency for display
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toLocaleString()}`
  }

  return (
    <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="h-full p-5">
        <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <ReFunnelChart>
            <defs>
              <filter id="funnel-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.15" />
              </filter>
            </defs>
            <Funnel dataKey={yKey} data={data} isAnimationActive animationDuration={1000} filter="url(#funnel-shadow)">
              <LabelList
                position="center"
                fill="white"
                fontSize={12}
                fontWeight="600"
                content={({ value, name, x, y }) => (
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={12}
                    fontWeight="600"
                  >
                    <tspan x={x} dy="-6">
                      {name}
                    </tspan>
                    <tspan x={x} dy="16">
                      {formatCurrency(Number(value) || 0)}
                    </tspan>
                  </text>
                )}
              />
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill || FUNNEL_COLORS[index % FUNNEL_COLORS.length]}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </Funnel>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                color: "hsl(var(--popover-foreground))",
                fontSize: "14px",
              }}
              formatter={(value: number, name: string) => [formatCurrency(value), "Pipeline Value"]}
              labelFormatter={(label: string) => `${label} Stage`}
              itemStyle={{ color: "hsl(var(--popover-foreground))" }}
            />
          </ReFunnelChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
