"use client"

import { useState } from "react"
import { Building2, Calendar, DollarSign, TrendingUp, ChevronRight, MapPin, Eye, BarChart3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface BetaProjectOverviewProps {
  config?: any
  span?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaProjectOverview({ config, span, isCompact, userRole }: BetaProjectOverviewProps) {
  // Scale classes based on isCompact prop for 50% size reduction
  const compactScale = {
    iconSize: isCompact ? "h-3 w-3" : "h-5 w-5",
    iconSizeSmall: isCompact ? "h-2 w-2" : "h-3 w-3",
    textTitle: isCompact ? "text-sm" : "text-lg",
    textSmall: isCompact ? "text-[10px]" : "text-xs",
    textMedium: isCompact ? "text-xs" : "text-sm",
    padding: isCompact ? "p-1" : "p-2",
    paddingCard: isCompact ? "pb-1" : "pb-2",
    gap: isCompact ? "gap-1" : "gap-2",
    marginTop: isCompact ? "mt-0.5" : "mt-1",
    chartHeight: isCompact ? "h-32" : "h-48",
  }

  const [showDetails, setShowDetails] = useState(false)

  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case "project-manager":
        // Single project view
        return {
          totalProjects: 1,
          activeProjects: 1,
          completedThisMonth: 0,
          totalContractValue: 57235491,
          remainingContractValue: 35000000,
          avgProjectSize: 57235491,
          avgProfitMargin: 12.5,
          onScheduleProjects: 1,
          atRiskProjects: 0,
          behindScheduleProjects: 0,
          overallHealthScore: 8.5,
          projectTypes: {
            newConstruction: 1,
            renovation: 0,
            expansion: 0,
          },
          drillDown: {
            largestProject: { name: "Tropical World Nursery", value: 57235491 },
            riskProjects: 0,
            upcomingMilestones: 3,
            regionBreakdown: { north: 0, central: 1, spaceCoast: 0, southeast: 0, southwest: 0 },
            avgDuration: 24, // months
            onTimePct: 85,
          },
        }
      case "project-executive":
        // Limited to 7 projects
        return {
          totalProjects: 7,
          activeProjects: 5,
          completedThisMonth: 1,
          totalContractValue: 285480000,
          remainingContractValue: 180000000,
          avgProjectSize: 40782857,
          avgProfitMargin: 14.2,
          onScheduleProjects: 4,
          atRiskProjects: 1,
          behindScheduleProjects: 0,
          overallHealthScore: 7.8,
          projectTypes: {
            newConstruction: 4,
            renovation: 2,
            expansion: 1,
          },
          drillDown: {
            largestProject: { name: "Tropical World Nursery", value: 57235491 },
            riskProjects: 1,
            upcomingMilestones: 4,
            regionBreakdown: { north: 2, central: 2, spaceCoast: 1, southeast: 1, southwest: 1 },
            avgDuration: 20, // months
            onTimePct: 78,
          },
        }
      default:
        // Executive - all projects
        return {
          totalProjects: 12,
          activeProjects: 8,
          completedThisMonth: 2,
          totalContractValue: 485280000,
          remainingContractValue: 320000000,
          avgProjectSize: 40440000,
          avgProfitMargin: 16.8,
          onScheduleProjects: 6,
          atRiskProjects: 2,
          behindScheduleProjects: 0,
          overallHealthScore: 8.3,
          projectTypes: {
            newConstruction: 7,
            renovation: 3,
            expansion: 2,
          },
          drillDown: {
            largestProject: { name: "Tropical World Nursery", value: 57235491 },
            riskProjects: 2,
            upcomingMilestones: 5,
            regionBreakdown: { north: 3, central: 4, spaceCoast: 2, southeast: 2, southwest: 1 },
            avgDuration: 18, // months
            onTimePct: 75,
          },
        }
    }
  }

  const data = getDataByRole()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100)
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden relative transition-all duration-300">
      {/* Compact Header with HB Blue Theme */}
      <div className="flex-shrink-0 px-4 pt-3 pb-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-b border-blue-200 dark:border-blue-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" style={{ color: "#0021A5" }} />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Project Overview</span>
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            {userRole === "project-manager" ? "Current Project" : "Portfolio Summary"}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-hidden">
        {/* Header Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300" style={{ color: "#0021A5" }}>
              {data.totalProjects}
            </div>
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-1">Total Projects</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">{data.activeProjects}</div>
            <div className="text-xs font-medium text-green-600 dark:text-green-400 mt-1">Active</div>
          </div>
        </div>

        {/* Contract Values */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" style={{ color: "#0021A5" }} />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Portfolio Value</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-blue-600 dark:text-blue-400">Total Contracted</span>
              <span className="font-medium text-blue-800 dark:text-blue-200">
                {formatCurrency(data.totalContractValue)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-blue-600 dark:text-blue-400">Remaining Work</span>
              <span className="font-medium text-blue-800 dark:text-blue-200">
                {formatCurrency(data.remainingContractValue)}
              </span>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" style={{ color: "#0021A5" }} />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Project Status</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded border border-blue-300 dark:border-blue-600">
              <div className="text-sm font-medium text-green-700 dark:text-green-400">{data.onScheduleProjects}</div>
              <div className="text-xs text-green-600 dark:text-green-400">On Track</div>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded border border-blue-300 dark:border-blue-600">
              <div className="text-sm font-medium text-yellow-700 dark:text-yellow-400">{data.atRiskProjects}</div>
              <div className="text-xs text-yellow-600 dark:text-yellow-400">At Risk</div>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded border border-blue-300 dark:border-blue-600">
              <div className="text-sm font-medium text-red-700 dark:text-red-400">{data.behindScheduleProjects}</div>
              <div className="text-xs text-red-600 dark:text-red-400">Behind</div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" style={{ color: "#0021A5" }} />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Financial Health</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="text-center p-2 bg-blue-100 dark:bg-blue-800/30 rounded border border-blue-300 dark:border-blue-600">
              <div className="text-sm font-bold text-green-700 dark:text-green-400">
                {formatPercentage(data.avgProfitMargin)}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">Avg Margin</div>
            </div>
            <div className="text-center p-2 bg-blue-100 dark:bg-blue-800/30 rounded border border-blue-300 dark:border-blue-600">
              <div className="text-sm font-bold text-blue-700 dark:text-blue-400" style={{ color: "#0021A5" }}>
                {data.overallHealthScore}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Health Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Click-triggered Detail Overlay */}
      {showDetails && (
        <div className="absolute inset-0 bg-blue-900/96 dark:bg-blue-950/96 backdrop-blur-sm p-4 flex flex-col justify-center text-white animate-in fade-in duration-200 border border-blue-700/50">
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-blue-200" />
                <span className="font-semibold text-sm text-blue-100">Portfolio Deep Dive</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDetails}
                className="h-6 w-6 p-0 text-blue-200 hover:text-white"
              >
                ×
              </Button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-blue-700/30 pb-1">
                <span className="text-blue-200">Largest Project:</span>
                <span className="font-medium text-blue-100">{data.drillDown.largestProject.name}</span>
              </div>
              <div className="flex justify-between border-b border-blue-700/30 pb-1">
                <span className="text-blue-200">Value:</span>
                <span className="font-medium text-blue-100">{formatCurrency(data.drillDown.largestProject.value)}</span>
              </div>
              <div className="flex justify-between border-b border-blue-700/30 pb-1">
                <span className="text-blue-200">Risk Projects:</span>
                <span className="font-medium text-yellow-200">{data.drillDown.riskProjects}</span>
              </div>
              <div className="flex justify-between border-b border-blue-700/30 pb-1">
                <span className="text-blue-200">Upcoming Milestones:</span>
                <span className="font-medium text-blue-100">{data.drillDown.upcomingMilestones}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Avg Duration:</span>
                <span className="font-medium text-blue-100">{data.drillDown.avgDuration} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">On-Time Performance:</span>
                <span className="font-medium text-blue-100">{data.drillDown.onTimePct}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click to expand indicator */}
      <div className="absolute bottom-2 right-2">
        <button
          onClick={toggleDetails}
          className="p-1 rounded-full bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
        >
          <Eye className="h-3 w-3 text-blue-600 dark:text-blue-400" style={{ color: "#0021A5" }} />
        </button>
      </div>
    </div>
  )
}
