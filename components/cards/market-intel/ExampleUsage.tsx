/**
 * @fileoverview Example Usage for Market Intelligence Cards
 * @module ExampleUsage
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-31
 *
 * Example component showing how to use the reusable market intelligence cards
 */

"use client"

import React, { useState } from "react"
import { ActivityTrendsCard, EstimatingProgressCard, PowerBIEmbedCard } from "./index"
import { TrendingUp, BarChart3, Monitor, DollarSign, Target, Users, CheckCircle, Brain, Zap, Play } from "lucide-react"
import { Button } from "../../ui/button"
import { Badge } from "../../ui/badge"
import { useHBIAnalysis } from "../../../hooks/use-hbi-analysis"

// Example data for ActivityTrendsCard
const marketGrowthData = [
  { period: "Jan", value: 125000 },
  { period: "Feb", value: 132000 },
  { period: "Mar", value: 128000 },
  { period: "Apr", value: 145000 },
  { period: "May", value: 138000 },
  { period: "Jun", value: 152000 },
]

// Example data for EstimatingProgressCard
const sentimentData = {
  metrics: [
    {
      label: "Sentiment Score",
      value: 72,
      format: "percentage" as const,
      trend: "up" as const,
      color: "text-green-600",
      icon: TrendingUp,
    },
    {
      label: "Total Projects",
      value: 45,
      format: "number" as const,
      trend: "stable" as const,
      color: "text-blue-600",
      icon: Target,
    },
    {
      label: "Market Value",
      value: 459000000,
      format: "currency" as const,
      trend: "up" as const,
      color: "text-purple-600",
      icon: DollarSign,
    },
    {
      label: "Active Developers",
      value: 28,
      format: "number" as const,
      trend: "up" as const,
      color: "text-emerald-600",
      icon: Users,
    },
  ],
  progressData: [
    { category: "Market Confidence", value: 75, target: 80, color: "#10b981" },
    { category: "Risk Assessment", value: 60, target: 70, color: "#f59e0b" },
    { category: "Growth Potential", value: 85, target: 90, color: "#3b82f6" },
  ],
  distributionData: [
    { name: "Positive", value: 45, color: "#10b981" },
    { name: "Neutral", value: 35, color: "#f59e0b" },
    { name: "Negative", value: 20, color: "#ef4444" },
  ],
}

// Example data for PowerBIEmbedCard
const regionalData = [
  { name: "Southeast", value: 3000000000, secondary: 125 },
  { name: "Southwest", value: 1800000000, secondary: 89 },
  { name: "Central", value: 2200000000, secondary: 102 },
  { name: "North", value: 1200000000, secondary: 67 },
]

const tabsData = [
  {
    label: "Southeast",
    value: "se",
    data: [
      { name: "Miami-Dade", value: 1500000000 },
      { name: "Broward", value: 900000000 },
      { name: "Palm Beach", value: 600000000 },
    ],
  },
  {
    label: "Southwest",
    value: "sw",
    data: [
      { name: "Tampa", value: 800000000 },
      { name: "Naples", value: 600000000 },
      { name: "Fort Myers", value: 400000000 },
    ],
  },
  {
    label: "Central",
    value: "central",
    data: [
      { name: "Orlando", value: 1200000000 },
      { name: "Lakeland", value: 600000000 },
      { name: "Ocala", value: 400000000 },
    ],
  },
]

export default function ExampleUsage() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Market Intelligence Cards - Example Usage
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Demonstration of the three reusable market intelligence card components
        </p>
      </div>

      <div className="grid gap-6">
        {/* ActivityTrendsCard Example */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            1. ActivityTrendsCard - Time-based Charts
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <ActivityTrendsCard
              title="Florida Market Growth"
              description="Monthly nonresidential construction trends"
              data={marketGrowthData}
              config={{
                chartType: "area",
                showRealTime: true,
                trendIndicator: true,
                primaryColor: "#3b82f6",
                gradientColors: ["#3b82f6", "#1d4ed8"],
                formatValue: (val) => `$${val.toLocaleString()}`,
                icon: TrendingUp,
              }}
              hbiSummary={{
                insight:
                  "HBI trajectory analysis shows consistent expansion with Q2 2025 moderating to stabilize around 5% growth rate",
                confidence: 87,
                trend: "up",
                recommendation: "Consider increasing capacity in high-growth regions",
                keyFactors: ["Population Growth", "Infrastructure Investment", "Corporate Relocations"],
                dataQuality: 94,
              }}
            />

            <ActivityTrendsCard
              title="Construction Activity"
              description="Weekly project starts"
              data={marketGrowthData.map((d) => ({ ...d, value: d.value / 10000 }))}
              config={{
                chartType: "bar",
                showRealTime: false,
                trendIndicator: true,
                primaryColor: "#10b981",
                formatValue: (val) => `${val.toFixed(0)} projects`,
                icon: BarChart3,
              }}
              hbiSummary={{
                insight: "HBI analysis shows project starts maintaining steady pace with seasonal variations",
                confidence: 92,
                trend: "stable",
                recommendation: "Monitor Q3 seasonal adjustments",
                keyFactors: ["Seasonal Patterns", "Market Stability", "Permit Activity"],
                dataQuality: 91,
              }}
            />
          </div>
        </div>

        {/* EstimatingProgressCard Example */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            2. EstimatingProgressCard - Summary + AI Insights
          </h2>
          <div className="grid gap-4">
            <EstimatingProgressCard
              title="Developer Sentiment Index"
              description="Market sentiment analysis with key indicators"
              data={sentimentData}
              config={{
                showProgress: true,
                showDistribution: true,
                primaryColor: "#8b5cf6",
                icon: Target,
              }}
              hbiSummary={{
                insight:
                  "HBI sentiment analysis reveals mixed developer confidence with rising insurance costs offset by positive job growth and GDP expansion",
                confidence: 82,
                trend: "up",
                keyMetrics: ["Insurance Impact", "Job Growth", "GDP Correlation"],
                recommendation: "Focus on risk mitigation strategies for insurance cost volatility",
                keyFactors: ["Insurance Costs", "Economic Growth", "Market Confidence"],
                dataQuality: 89,
              }}
            />
          </div>
        </div>

        {/* PowerBIEmbedCard Example */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            3. PowerBIEmbedCard - Complex External Visualizations
          </h2>
          <div className="grid gap-4">
            <PowerBIEmbedCard
              title="Regional Hotspots Analysis"
              description="Deal activity by region with Power BI integration"
              reportId="market-intel-regional-001"
              workspaceId="hb-construction-analytics"
              data={regionalData}
              config={{
                chartType: "composed",
                showPowerBIBadge: true,
                showExternalLink: true,
                showTabs: true,
                tabsData: tabsData,
                primaryColor: "#0ea5e9",
                secondaryColor: "#10b981",
                icon: Monitor,
              }}
              aiSummary={{
                insight:
                  "Southeast Florida dominates commercial construction with $3B in Q1-Q2 2025 deals, outpacing all other regions",
                confidence: 94,
                trend: "up",
                keyFindings: [
                  "SE Florida: $3B in Q1-Q2 2025 deals",
                  "Miami-Dade leads commercial development",
                  "Office vacancy rates stabilizing at 10-15%",
                  "Multifamily sector showing strong growth",
                ],
                dataQuality: 96,
                recommendation: "Consider strategic expansion in Southeast region",
              }}
            />

            <PowerBIEmbedCard
              title="Competitive Analysis"
              description="Market positioning and competitor benchmarking"
              data={[
                { name: "Ultra-Luxury", value: 85, color: "#8b5cf6" },
                { name: "Commercial", value: 72, color: "#3b82f6" },
                { name: "Multifamily", value: 68, color: "#10b981" },
                { name: "Mixed-Use", value: 75, color: "#f59e0b" },
              ]}
              config={{
                chartType: "radar",
                showPowerBIBadge: true,
                showExternalLink: false,
                primaryColor: "#8b5cf6",
                icon: BarChart3,
              }}
              aiSummary={{
                insight:
                  "Strong positioning in ultra-luxury segment with opportunities in commercial and multifamily sectors",
                confidence: 88,
                trend: "stable",
                keyFindings: [
                  "Ultra-luxury: Market leader position",
                  "Commercial: Competitive but growing",
                  "Multifamily: Emerging opportunity",
                ],
                dataQuality: 92,
                recommendation: "Diversify portfolio across commercial and multifamily segments",
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Integration Notes
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• All components support role-based content filtering via the `userRole` prop</li>
          <li>• Real-time updates can be enabled/disabled per component</li>
          <li>• AI insights are optional and can be toggled via configuration</li>
          <li>• Components are fully responsive and support dark/light themes</li>
          <li>• TypeScript interfaces ensure type safety for all props</li>
        </ul>
      </div>
    </div>
  )
}
