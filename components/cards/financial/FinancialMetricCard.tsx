"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react"
import { cn } from "@/lib/utils"

interface FinancialMetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  change?: {
    value: number
    period: string
    trend: "up" | "down" | "neutral"
  }
  icon?: React.ReactNode
  variant?: "default" | "success" | "warning" | "danger"
  className?: string
  projectId?: string
}

export function FinancialMetricCard({
  title,
  value,
  subtitle,
  change,
  icon,
  variant = "default",
  className,
  projectId,
}: FinancialMetricCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
      case "warning":
        return "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950"
      case "danger":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
      default:
        return "border-border bg-card"
    }
  }

  return (
    <Card className={cn("h-full", getVariantStyles(), className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        {change && (
          <div className="flex items-center pt-2">
            {change.trend === "up" ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : change.trend === "down" ? (
              <TrendingDown className="h-4 w-4 text-red-600" />
            ) : null}
            <span
              className={cn(
                "text-xs ml-1",
                change.trend === "up"
                  ? "text-green-600"
                  : change.trend === "down"
                  ? "text-red-600"
                  : "text-muted-foreground"
              )}
            >
              {change.value > 0 ? "+" : ""}
              {change.value}% from {change.period}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
