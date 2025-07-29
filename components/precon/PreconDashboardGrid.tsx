"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building,
  TrendingUp,
  DollarSign,
  Target,
  Calendar,
  Clock,
  Users,
  Activity,
  BarChart3,
  PieChart,
  FileText,
  CheckCircle,
  AlertTriangle,
  Star,
  Award,
  Zap,
  Lightbulb,
  Brain,
  Sparkles,
  Rocket,
  Shield,
  Gavel,
  Database,
  RefreshCw,
  ExternalLink,
} from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Area,
  AreaChart,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart,
  ScatterChart,
  Scatter,
  FunnelChart,
  Funnel,
} from "recharts"
import BetaBDPipelineSummaryCard from "@/components/cards/beta/BetaBDPipelineSummaryCard"
import { BetaEstimatePerformanceCard } from "@/components/cards/beta/BetaEstimatePerformanceCard"
import BetaEstimateVolumeTrendCard from "@/components/cards/beta/BetaEstimateVolumeTrendCard"
import BetaPreconAgreementsCard from "@/components/cards/beta/BetaPreconAgreementsCard"
import BetaPreconMilestonesCard from "@/components/cards/beta/BetaPreconMilestonesCard"
import BetaInnovationActivityCard from "@/components/cards/beta/BetaInnovationActivityCard"
import { BetaBDClientEngagementCard } from "@/components/cards/beta/BetaBDClientEngagementCard"
import BetaBDPursuitConversionTrendsCard from "@/components/cards/beta/BetaBDPursuitConversionTrendsCard"
import BetaBDStrategicFocusMapCard from "@/components/cards/beta/BetaBDStrategicFocusMapCard"
import BetaTurnoverScheduleCard from "@/components/cards/beta/BetaTurnoverScheduleCard"

interface PreconDashboardGridProps {
  className?: string
  isCompact?: boolean
}

export function PreconDashboardGrid({ className, isCompact = false }: PreconDashboardGridProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for the dashboard cards
  const pipelineData = [
    { month: "Jan", value: 12.5, projects: 8, winRate: 75 },
    { month: "Feb", value: 15.2, projects: 12, winRate: 78 },
    { month: "Mar", value: 18.8, projects: 15, winRate: 82 },
    { month: "Apr", value: 22.1, projects: 18, winRate: 85 },
    { month: "May", value: 25.6, projects: 22, winRate: 88 },
    { month: "Jun", value: 28.3, projects: 25, winRate: 90 },
  ]

  const estimatePerformanceData = [
    { month: "Jan", accuracy: 92, speed: 85, cost: 78 },
    { month: "Feb", accuracy: 94, speed: 88, cost: 82 },
    { month: "Mar", accuracy: 96, speed: 91, cost: 85 },
    { month: "Apr", accuracy: 95, speed: 93, cost: 88 },
    { month: "May", accuracy: 97, speed: 95, cost: 90 },
    { month: "Jun", accuracy: 98, speed: 96, cost: 92 },
  ]

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toLocaleString()}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Pre-Construction Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pre-Construction Summary Dashboard</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive overview of all pre-construction activities and metrics
          </p>
        </div>
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
        >
          <Database className="h-3 w-3 mr-1" />
          Live Data
        </Badge>
      </div>

      {/* Masonry Grid Layout with Beta Cards */}
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {/* BetaBDPipelineSummaryCard */}
        <div className="break-inside-avoid">
          <BetaBDPipelineSummaryCard />
        </div>

        {/* BetaEstimatePerformanceCard */}
        <div className="break-inside-avoid">
          <BetaEstimatePerformanceCard />
        </div>

        {/* BetaEstimateVolumeTrendCard */}
        <div className="break-inside-avoid">
          <BetaEstimateVolumeTrendCard />
        </div>

        {/* BetaPreconAgreementsCard */}
        <div className="break-inside-avoid">
          <BetaPreconAgreementsCard />
        </div>

        {/* BetaPreconMilestonesCard */}
        <div className="break-inside-avoid">
          <BetaPreconMilestonesCard />
        </div>

        {/* BetaInnovationActivityCard */}
        <div className="break-inside-avoid">
          <BetaInnovationActivityCard />
        </div>

        {/* BetaBDClientEngagementCard */}
        <div className="break-inside-avoid">
          <BetaBDClientEngagementCard />
        </div>

        {/* BetaBDPursuitConversionTrendsCard */}
        <div className="break-inside-avoid">
          <BetaBDPursuitConversionTrendsCard />
        </div>

        {/* BetaBDStrategicFocusMapCard */}
        <div className="break-inside-avoid">
          <BetaBDStrategicFocusMapCard />
        </div>

        {/* Turnover Schedule Card - Replaced with BetaTurnoverScheduleCard */}
        <div className="break-inside-avoid">
          <BetaTurnoverScheduleCard />
        </div>
      </div>
    </div>
  )
}
