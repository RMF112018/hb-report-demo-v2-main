"use client"

import { useState } from "react"
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  ChevronRight,
  Activity,
  TrendingUp,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface SchedulePerformanceCardProps {
  config?: any
  span?: any
  isCompact?: boolean
  userRole?: string
}

export default function SchedulePerformanceCard({ config, span, isCompact, userRole }: SchedulePerformanceCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case "project-manager":
        // Single project view
        return {
          projectsAhead: 0,
          projectsOnTime: 1,
          projectsBehind: 0,
          avgVarianceDays: -3, // negative means ahead
          totalDamagesRealized: 0,
          totalDamagesForecasted: 0,
          criticalProjects: 0,
          scheduleHealthScore: 85,
          drillDown: {
            criticalPath: ["MEP Rough-in", "Exterior Finishing", "Final Inspections"],
            weatherDelays: 1,
            permitDelays: 0,
            materialDelays: 1,
            topPerformer: "Tropical World Nursery",
            worstPerformer: "N/A",
            avgRecoveryTime: 5, // days
            milestoneHits: 92, // percentage
          },
        }
      case "project-executive":
        // Limited to 7 projects
        return {
          projectsAhead: 3,
          projectsOnTime: 2,
          projectsBehind: 2,
          avgVarianceDays: -8, // negative means ahead
          totalDamagesRealized: 0,
          totalDamagesForecasted: 75000,
          criticalProjects: 1,
          scheduleHealthScore: 81,
          drillDown: {
            criticalPath: ["Foundation Pour", "Steel Erection", "MEP Rough-in"],
            weatherDelays: 2,
            permitDelays: 1,
            materialDelays: 1,
            topPerformer: "Riverside Plaza",
            worstPerformer: "Tech Campus Phase 2",
            avgRecoveryTime: 7, // days
            milestoneHits: 88, // percentage
          },
        }
      default:
        // Executive - all projects
        return {
          projectsAhead: 5,
          projectsOnTime: 2,
          projectsBehind: 3,
          avgVarianceDays: -12, // negative means ahead
          totalDamagesRealized: 0,
          totalDamagesForecasted: 125000,
          criticalProjects: 2,
          scheduleHealthScore: 78,
          drillDown: {
            criticalPath: ["Foundation Pour", "Steel Erection", "MEP Rough-in"],
            weatherDelays: 3,
            permitDelays: 1,
            materialDelays: 2,
            topPerformer: "Riverside Plaza",
            worstPerformer: "Tech Campus Phase 2",
            avgRecoveryTime: 8, // days
            milestoneHits: 85, // percentage
          },
        }
    }
  }

  const data = getDataByRole()

  const getVarianceColor = (days: number) => {
    if (days <= -7) return "text-emerald-600 dark:text-emerald-400"
    if (days <= 7) return "text-amber-600 dark:text-amber-400"
    return "text-red-600 dark:text-red-400"
  }

  const getVarianceBadge = (days: number) => {
    if (days <= -7)
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
    if (days <= 7)
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800"
    return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800"
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 85) return "bg-emerald-500"
    if (score >= 70) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className="h-full overflow-hidden relative group">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-b border-gray-200 dark:border-gray-700">
        {/* Top Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{data.projectsAhead}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Ahead</div>
          </div>
          <div className="text-center p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{data.projectsOnTime}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">On Time</div>
          </div>
          <div className="text-center p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{data.projectsBehind}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Behind</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 bg-white dark:bg-gray-900">
        {/* Schedule Health Score */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Schedule Health</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Overall Score</span>
              <div className="px-2 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded">
                {data.scheduleHealthScore}%
              </div>
            </div>
          </div>
          <div className="relative">
            <Progress value={data.scheduleHealthScore} className="h-3 bg-gray-200 dark:bg-gray-700" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${getHealthScoreColor(
                  data.scheduleHealthScore
                )}`}
                style={{ width: `${data.scheduleHealthScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Average Variance */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Avg Variance</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className={`text-2xl font-bold ${getVarianceColor(data.avgVarianceDays)}`}>
              {Math.abs(data.avgVarianceDays)} Days
            </div>
            <Badge variant="outline" className={getVarianceBadge(data.avgVarianceDays)}>
              {data.avgVarianceDays < 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Ahead
                </>
              ) : data.avgVarianceDays > 0 ? (
                <>
                  <TrendingDown className="h-3 w-3 mr-1" />
                  Behind
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  On Time
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* Damages */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Damages</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Realized</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                ${data.totalDamagesRealized.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Forecasted</span>
              <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                ${data.totalDamagesForecasted.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Critical Projects */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Critical Projects</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">{data.criticalProjects}</span>
              <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
                Needs Attention
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Overlay */}
      <div
        className={`absolute inset-0 bg-gray-900/95 backdrop-blur-sm transition-all duration-300 ${
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="h-full flex flex-col justify-center text-white overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <ChevronRight className="h-5 w-5 text-orange-400" />
              <span className="font-semibold text-lg text-orange-400">Schedule Deep Analysis</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-300 mb-1">Best Performer</div>
                <div className="font-semibold text-emerald-300">{data.drillDown.topPerformer}</div>
              </div>
              <div>
                <div className="text-gray-300 mb-1">Needs Attention</div>
                <div className="font-semibold text-red-300">{data.drillDown.worstPerformer}</div>
              </div>
              <div>
                <div className="text-gray-300 mb-1">Milestone Hit Rate</div>
                <div className="font-semibold text-white">{data.drillDown.milestoneHits}%</div>
              </div>
              <div>
                <div className="text-gray-300 mb-1">Avg Recovery Time</div>
                <div className="font-semibold text-white">{data.drillDown.avgRecoveryTime} days</div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-4 w-4 text-orange-400" />
                <span className="text-sm font-medium text-orange-400">Delay Analysis</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="text-center p-3 bg-white/10 rounded-lg">
                  <div className="text-xl font-bold text-white">{data.drillDown.weatherDelays}</div>
                  <div className="text-gray-300">Weather</div>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-lg">
                  <div className="text-xl font-bold text-white">{data.drillDown.permitDelays}</div>
                  <div className="text-gray-300">Permits</div>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-lg">
                  <div className="text-xl font-bold text-white">{data.drillDown.materialDelays}</div>
                  <div className="text-gray-300">Materials</div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="text-sm font-medium text-orange-400 mb-3">Critical Path Activities</div>
              <div className="space-y-2">
                {data.drillDown.criticalPath.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-white/10 rounded">
                    <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-white">{activity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover trigger area */}
      <div
        className="absolute inset-0 z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    </div>
  )
}
