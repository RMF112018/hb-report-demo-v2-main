/**
 * @fileoverview Simple Project Metrics Card Component
 * @module SimpleProjectMetricsCard
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-31
 *
 * Simplified Power BI embedded visualization showing key project metrics
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Building2, TrendingUp, RefreshCw, Play, Pause, DollarSign, Calendar, Users } from "lucide-react"

interface SimpleProjectMetricsCardProps {
  className?: string
  userRole?: string
  config?: {
    userRole?: string
    showRealTime?: boolean
    headerMode?: boolean
  }
}

// Generate role-based project data
const generateProjectData = (userRole: string) => {
  const projectCounts = {
    executive: { total: 24, active: 18, completed: 6 },
    "project-executive": { total: 12, active: 8, completed: 4 },
    "project-manager": { total: 3, active: 2, completed: 1 },
    estimator: { total: 8, active: 5, completed: 3 },
    admin: { total: 0, active: 0, completed: 0 },
  }

  const roleData = projectCounts[userRole as keyof typeof projectCounts] || projectCounts.estimator

  const monthlyData = [
    { month: "Jan", projects: Math.floor(roleData.total * 0.6), value: roleData.total * 2500000 },
    { month: "Feb", projects: Math.floor(roleData.total * 0.7), value: roleData.total * 2800000 },
    { month: "Mar", projects: Math.floor(roleData.total * 0.8), value: roleData.total * 3200000 },
    { month: "Apr", projects: Math.floor(roleData.total * 0.9), value: roleData.total * 3600000 },
    { month: "May", projects: roleData.total, value: roleData.total * 4000000 },
    { month: "Jun", projects: Math.floor(roleData.total * 1.1), value: roleData.total * 4200000 },
  ]

  return {
    ...roleData,
    totalValue: roleData.total * 4200000,
    completionRate: Math.round((roleData.completed / roleData.total) * 100),
    monthlyData,
  }
}

export default function SimpleProjectMetricsCard({ className, userRole, config }: SimpleProjectMetricsCardProps) {
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(config?.showRealTime || false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)

  const projectData = useMemo(() => generateProjectData(userRole || "estimator"), [userRole])

  // Simulate real-time updates
  useEffect(() => {
    if (isRealTimeEnabled) {
      const interval = setInterval(() => {
        setLastUpdated(new Date())
      }, 15000) // Update every 15 seconds

      return () => clearInterval(interval)
    }
  }, [isRealTimeEnabled])

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const isHeaderMode = config?.headerMode || false

  return (
    <Card
      className={`${className} bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50 dark:border-blue-800/50 h-full`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                {isHeaderMode ? "Project Metrics Overview" : "Project Metrics"}
              </CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-950/50">
              Power BI
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
              className="h-8 px-3"
            >
              {isRealTimeEnabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading} className="h-8 px-3">
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Real-time Status */}
        {isRealTimeEnabled && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live data • Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {isHeaderMode ? (
          /* Header Mode - Horizontal Layout */
          <div className="grid grid-cols-8 gap-4 h-full">
            {/* Left Side - Key Metrics */}
            <div className="col-span-5 grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Projects</p>
                    <p className="text-3xl font-bold text-blue-600">{projectData.total}</p>
                  </div>
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Active</p>
                    <p className="text-3xl font-bold text-green-600">{projectData.active}</p>
                  </div>
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Value</p>
                    <p className="text-xl font-bold text-purple-600">{formatCurrency(projectData.totalValue)}</p>
                  </div>
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Right Side - Chart and Progress */}
            <div className="col-span-3 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Portfolio Completion</span>
                  <span className="text-sm text-muted-foreground">{projectData.completionRate}%</span>
                </div>
                <Progress value={projectData.completionRate} className="h-2" />
              </div>
              <div className="flex-1 h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "projects" ? `${value} projects` : formatCurrency(value as number),
                        name === "projects" ? "Projects" : "Value",
                      ]}
                    />
                    <Bar dataKey="projects" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          /* Standard Mode - Vertical Layout */
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Projects</p>
                    <p className="text-2xl font-bold text-blue-600">{projectData.total}</p>
                  </div>
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-green-600">{projectData.active}</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Value</p>
                    <p className="text-lg font-bold text-purple-600">{formatCurrency(projectData.totalValue)}</p>
                  </div>
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Completion Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Portfolio Completion</span>
                <span className="text-sm text-muted-foreground">{projectData.completionRate}%</span>
              </div>
              <Progress value={projectData.completionRate} className="h-2" />
            </div>

            {/* Monthly Project Chart */}
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectData.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "projects" ? `${value} projects` : formatCurrency(value as number),
                      name === "projects" ? "Projects" : "Value",
                    ]}
                  />
                  <Bar dataKey="projects" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
