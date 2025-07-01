"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Shield, Clock, DollarSign, Activity, Brain, Zap, Target } from "lucide-react"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import type { DashboardCard } from "@/types/dashboard"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface HealthCardProps {
  card: DashboardCard
  config?: any
  span?: any
  isCompact?: boolean
  userRole?: string
}

const HEALTH_COLORS = [
  'hsl(var(--chart-1))', 
  'hsl(var(--chart-2))', 
  'hsl(var(--chart-3))', 
  'hsl(var(--chart-4))', 
  'hsl(var(--chart-5))'
]

export function HealthCard({ card, config, span, isCompact, userRole }: HealthCardProps) {
  const [showDrillDown, setShowDrillDown] = useState(false)

  // Listen for drill down events from DashboardCardWrapper
  useEffect(() => {
    const handleDrillDownEvent = (event: CustomEvent) => {
      if (event.detail.cardId === card.id || event.detail.cardType === 'health') {
        const shouldShow = event.detail.action === 'show'
        setShowDrillDown(shouldShow)
        
        // Notify wrapper of state change
        const stateEvent = new CustomEvent('cardDrillDownStateChange', {
          detail: {
            cardId: card.id,
            cardType: 'health',
            isActive: shouldShow
          }
        })
        window.dispatchEvent(stateEvent)
      }
    };

    window.addEventListener('cardDrillDown', handleDrillDownEvent as EventListener);
    
    return () => {
      window.removeEventListener('cardDrillDown', handleDrillDownEvent as EventListener);
    };
  }, [card.id]);

  // Function to handle closing the drill down overlay
  const handleCloseDrillDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDrillDown(false)
    
    // Notify wrapper that drill down is closed
    const stateEvent = new CustomEvent('cardDrillDownStateChange', {
      detail: {
        cardId: card.id,
        cardType: 'health',
        isActive: false
      }
    })
    window.dispatchEvent(stateEvent)
  }

  // Mock data based on role
  const getRoleBasedData = () => {
    const role = userRole || 'project-manager'
    
    const baseData = {
      'project-manager': {
        overallHealth: 84.2,
        healthGrade: 'B+',
        trendDirection: 'up',
        trendValue: 2.3,
        healthDimensions: {
          schedule: 87.5,
          budget: 82.1,
          quality: 91.2,
          safety: 95.8,
          risk: 76.4,
          communication: 88.9
        },
        healthTrend: [
          { month: 'Jan', overall: 78.2, schedule: 82.1, budget: 85.3, quality: 89.1, safety: 94.2, risk: 71.8 },
          { month: 'Feb', overall: 80.5, schedule: 84.3, budget: 83.7, quality: 90.2, safety: 95.1, risk: 73.5 },
          { month: 'Mar', overall: 82.8, schedule: 86.1, budget: 81.9, quality: 90.8, safety: 95.6, risk: 74.9 },
          { month: 'Apr', overall: 83.6, schedule: 87.2, budget: 82.0, quality: 91.0, safety: 95.7, risk: 75.8 },
          { month: 'May', overall: 84.2, schedule: 87.5, budget: 82.1, quality: 91.2, safety: 95.8, risk: 76.4 }
        ],
        alerts: [
          { type: 'warning', category: 'Budget', message: 'Labor costs trending 3% over forecast', severity: 'medium' },
          { type: 'info', category: 'Schedule', message: 'Weather delays resolved, back on track', severity: 'low' },
          { type: 'success', category: 'Quality', message: '15 consecutive days without rework', severity: 'positive' }
        ],
        keyMetrics: {
          scheduleVariance: -2.1, // days behind
          budgetVariance: 1.8, // % over
          qualityScore: 91.2,
          safetyDays: 127, // days without incident
          riskExposure: 245000,
          stakeholderSatisfaction: 88.9
        },
        projectName: "Tropical World Nursery"
      },
      'project-executive': {
        overallHealth: 81.7,
        healthGrade: 'B',
        trendDirection: 'down',
        trendValue: -1.2,
        healthDimensions: {
          schedule: 83.2,
          budget: 79.8,
          quality: 88.5,
          safety: 92.1,
          risk: 74.8,
          communication: 85.6
        },
        healthTrend: [
          { month: 'Jan', overall: 84.1, schedule: 85.8, budget: 82.3, quality: 87.9, safety: 91.2, risk: 76.8 },
          { month: 'Feb', overall: 83.5, schedule: 84.6, budget: 81.1, quality: 88.2, safety: 91.8, risk: 75.9 },
          { month: 'Mar', overall: 82.9, schedule: 83.9, budget: 80.5, quality: 88.6, safety: 92.0, risk: 75.2 },
          { month: 'Apr', overall: 82.1, schedule: 83.4, budget: 79.9, quality: 88.4, safety: 92.1, risk: 74.9 },
          { month: 'May', overall: 81.7, schedule: 83.2, budget: 79.8, quality: 88.5, safety: 92.1, risk: 74.8 }
        ],
        portfolioBreakdown: [
          { project: 'Medical Center East', health: 89.3, schedule: 92.1, budget: 87.5, quality: 94.2, risk: 82.1, trend: 'up' },
          { project: 'Tech Campus Phase 2', health: 85.7, schedule: 88.9, budget: 83.2, quality: 91.1, risk: 78.5, trend: 'stable' },
          { project: 'Marina Bay Plaza', health: 78.2, schedule: 76.8, budget: 74.9, quality: 85.3, risk: 71.2, trend: 'down' },
          { project: 'Tropical World', health: 84.2, schedule: 87.5, budget: 82.1, quality: 91.2, risk: 76.4, trend: 'up' },
          { project: 'Grandview Heights', health: 76.9, schedule: 73.2, budget: 75.8, quality: 82.4, risk: 69.8, trend: 'down' },
          { project: 'Riverside Plaza', health: 82.8, schedule: 85.1, budget: 81.2, quality: 87.6, risk: 77.3, trend: 'stable' }
        ],
        keyMetrics: {
          avgScheduleVariance: -3.8,
          avgBudgetVariance: 2.4,
          portfolioRisk: 1850000,
          criticalProjects: 2,
          onTrackProjects: 4,
          stakeholderSatisfaction: 85.6
        }
      },
      'executive': {
        overallHealth: 79.4,
        healthGrade: 'B-',
        trendDirection: 'stable',
        trendValue: 0.2,
        healthDimensions: {
          schedule: 81.5,
          budget: 77.2,
          quality: 85.8,
          safety: 89.7,
          risk: 72.1,
          communication: 82.9
        },
        healthTrend: [
          { month: 'Jan', overall: 78.9, schedule: 81.2, budget: 76.8, quality: 85.1, safety: 89.2, risk: 71.5 },
          { month: 'Feb', overall: 79.1, schedule: 81.3, budget: 77.0, quality: 85.4, safety: 89.5, risk: 71.8 },
          { month: 'Mar', overall: 79.3, schedule: 81.4, budget: 77.1, quality: 85.6, safety: 89.6, risk: 72.0 },
          { month: 'Apr', overall: 79.2, schedule: 81.4, budget: 77.0, quality: 85.7, safety: 89.7, risk: 72.1 },
          { month: 'May', overall: 79.4, schedule: 81.5, budget: 77.2, quality: 85.8, safety: 89.7, risk: 72.1 }
        ],
        companyMetrics: {
          totalProjects: 12,
          healthyProjects: 7,
          atRiskProjects: 4,
          criticalProjects: 1,
          totalRiskExposure: 5240000,
          avgStakeholderSatisfaction: 82.9,
          avgProjectHealth: 79.4,
          companyReputation: 87.2
        }
      }
    }

    return baseData[role as keyof typeof baseData]
  }

  const data = getRoleBasedData()
  const role = userRole || 'project-manager'
  
  const healthGradeColor = data.overallHealth >= 90 ? 'text-green-600 dark:text-green-400' : 
                          data.overallHealth >= 80 ? 'text-blue-600 dark:text-blue-400' : 
                          data.overallHealth >= 70 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'

  // Color-coded radar data with health-based colors
  const radarData = Object.entries(data.healthDimensions).map(([key, value]) => ({
    dimension: key.charAt(0).toUpperCase() + key.slice(1),
    value: value,
    fullMark: 100,
    color: value >= 90 ? '#10b981' : value >= 80 ? '#3b82f6' : value >= 70 ? '#f59e0b' : '#ef4444'
  }))

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
      default:
        return <div className="h-4 w-4 rounded-full bg-muted-foreground" />
    }
  }

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-600 dark:text-green-400'
    if (health >= 80) return 'text-blue-600 dark:text-blue-400'
    if (health >= 70) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getHealthBgColor = (health: number) => {
    if (health >= 90) return '#10b981'
    if (health >= 80) return '#3b82f6'
    if (health >= 70) return '#f59e0b'
    return '#ef4444'
  }

  // Count critical health dimensions (below 80%)
  const criticalDimensions = Object.values(data.healthDimensions).filter(v => v < 80).length
  const healthyDimensions = Object.values(data.healthDimensions).filter(v => v >= 90).length

  return (
    <div 
      className="relative h-full"
      data-tour="health-card"
    >
      <div className="h-full flex flex-col bg-transparent overflow-hidden">
        {/* Health Stats Header */}
        <div className="flex-shrink-0 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2 mb-1 sm:mb-1.5 lg:mb-2">
            <Badge className="bg-gray-600 text-white border-gray-600 text-xs">
              <Activity className="h-3 w-3 mr-1" />
              Health Monitor
            </Badge>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {data.overallHealth.toFixed(0)}% Overall Health
            </div>
            <div className="flex items-center gap-1 ml-auto">
              {getTrendIcon(data.trendDirection)}
              <Badge className={cn("text-xs", healthGradeColor, "bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-500")}>
                {data.healthGrade}
              </Badge>
            </div>
          </div>
          
          {/* Compact Stats - Darker Background */}
          <div className="grid grid-cols-3 gap-1 sm:gap-1.5 lg:gap-2">
            <div className="text-center p-1.5 sm:p-2 lg:p-2.5 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
              <div className="font-bold text-lg text-green-700 dark:text-green-400">{healthyDimensions}</div>
              <div className="text-xs text-green-600 dark:text-green-400">Excellent</div>
            </div>
            <div className="text-center p-1.5 sm:p-2 lg:p-2.5 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
              <div className="font-bold text-lg text-red-700 dark:text-red-400">{criticalDimensions}</div>
              <div className="text-xs text-red-600 dark:text-red-400">Critical</div>
            </div>
            <div className="text-center p-1.5 sm:p-2 lg:p-2.5 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
              <div className="font-bold text-lg text-blue-700 dark:text-blue-400">
                {Math.abs(data.trendValue).toFixed(1)}%
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Trend</div>
            </div>
          </div>
        </div>

        {/* Health Content */}
        <div className="flex-1 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 overflow-y-auto">
          <div className="space-y-3">
            {/* Health Score Circle */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center border-3 border-gray-300 dark:border-gray-500">
                  <div className="text-center">
                    <div className={cn("text-lg font-bold", healthGradeColor)}>{data.overallHealth.toFixed(0)}</div>
                    <div className="text-xs text-muted-foreground">Health</div>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1">
                  {getTrendIcon(data.trendDirection)}
                </div>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {data.trendDirection === 'up' ? '+' : data.trendDirection === 'down' ? '-' : '±'}{Math.abs(data.trendValue)}% vs last month
              </div>
            </div>

            {/* Top Health Dimensions */}
            <div className="space-y-2">
              {Object.entries(data.healthDimensions).slice(0, 4).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: getHealthBgColor(value) }}
                    />
                    <span className="text-xs text-muted-foreground capitalize font-medium">{key}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={value} className="h-1.5 w-16" />
                    <span className={cn("text-xs font-semibold min-w-[2rem]", getHealthColor(value))}>
                      {(value ?? 0).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                <div className="text-sm font-medium text-foreground">
                  {role === 'executive' ? ((data as any).companyMetrics?.avgProjectHealth ?? 0).toFixed(0) : 
                   role === 'project-executive' ? ((data as any).keyMetrics?.projectHealth ?? data.overallHealth).toFixed(0) : 
                   data.overallHealth.toFixed(0)}%
                </div>
                <div className="text-xs text-muted-foreground">Project Health</div>
              </div>
              <div className="text-center p-2 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                <div className="text-sm font-medium text-foreground">
                  {role === 'executive' ? ((data as any).companyMetrics?.avgStakeholderSatisfaction ?? 0).toFixed(0) : 
                   role === 'project-executive' ? ((data as any).keyMetrics?.stakeholderSatisfaction ?? 0).toFixed(0) : 
                   ((data as any).keyMetrics?.stakeholderSatisfaction ?? 0).toFixed(0)}%
                </div>
                <div className="text-xs text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Drill-Down Overlay */}
      {showDrillDown && (
        <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm rounded-lg p-2 sm:p-1.5 sm:p-2 lg:p-2.5 lg:p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 text-white transition-all duration-300 ease-in-out overflow-y-auto z-50">
          <div className="h-full">
            <h3 className="text-base sm:text-lg lg:text-base sm:text-lg lg:text-xl font-medium mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2 text-center">Health Analytics Deep Dive</h3>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-1 sm:gap-1.5 lg:gap-2 lg:gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2 h-[calc(100%-60px)]">
              {/* Health Radar */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Health Dimensions
                  </h4>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#ffffff40" />
                        <PolarAngleAxis dataKey="dimension" fontSize={9} fill="white" />
                        <PolarRadiusAxis domain={[0, 100]} tick={false} />
                        <Radar
                          name="Health"
                          dataKey="value"
                          stroke="#60a5fa"
                          fill="#60a5fa"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            border: '1px solid #ffffff40',
                            borderRadius: '6px',
                            fontSize: '12px',
                            color: 'white'
                          }}
                          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Health']}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Color-coded dimension indicators */}
                  <div className="grid grid-cols-2 gap-1 text-xs mt-2">
                    {radarData.map((item) => (
                      <div key={item.dimension} className="flex items-center gap-1">
                        <div 
                          className="w-2 h-2 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-white truncate">{item.dimension}: {item.value.toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Brain className="w-4 h-4 mr-2" />
                    Health Metrics
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Overall Health:</span>
                      <span className="font-medium text-blue-300">{data.overallHealth.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Health Grade:</span>
                      <span className="font-medium text-green-400">{data.healthGrade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trend Direction:</span>
                      <span className={cn("font-medium", 
                        data.trendDirection === 'up' ? 'text-green-400' : 
                        data.trendDirection === 'down' ? 'text-red-400' : 'text-yellow-400'
                      )}>
                        {data.trendDirection === 'up' ? 'Improving' : 
                         data.trendDirection === 'down' ? 'Declining' : 'Stable'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Change:</span>
                      <span className="font-medium text-purple-300">{data.trendValue > 0 ? '+' : ''}{data.trendValue}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Trend */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Health Trend
                  </h4>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.healthTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                        <XAxis dataKey="month" fontSize={9} stroke="white" />
                        <YAxis domain={[60, 100]} fontSize={9} stroke="white" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0,0,0,0.8)', 
                            border: '1px solid #ffffff40',
                            borderRadius: '6px',
                            fontSize: '12px',
                            color: 'white'
                          }} 
                        />
                        <Line type="monotone" dataKey="overall" stroke="#60a5fa" strokeWidth={3} name="Overall Health" />
                        <Line type="monotone" dataKey="schedule" stroke="#10b981" strokeWidth={2} name="Schedule" />
                        <Line type="monotone" dataKey="budget" stroke="#f59e0b" strokeWidth={2} name="Budget" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    Health Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Excellent (90%+):</span>
                      <span className="font-medium text-green-400">{healthyDimensions} dimensions</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Good (80-89%):</span>
                      <span className="font-medium text-blue-400">
                        {Object.values(data.healthDimensions).filter(v => v >= 80 && v < 90).length} dimensions
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Needs Attention:</span>
                      <span className="font-medium text-red-400">{criticalDimensions} dimensions</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Project Status:</span>
                      <span className="font-medium text-purple-300">
                        {role === 'project-manager' ? ((data as any).projectName ?? 'Project View') : 
                         role === 'project-executive' ? 'Portfolio View' : 'Company View'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Close Button */}
            <div className="absolute bottom-4 right-4">
              <button
                onClick={handleCloseDrillDown}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 