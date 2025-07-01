"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Target, BarChart3, Activity, Brain, Zap } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, BarChart, Bar, ComposedChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"
import type { DashboardCard } from "@/types/dashboard"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ScheduleMonitorCardProps {
  card: DashboardCard
  config?: any
  span?: any
  isCompact?: boolean
  userRole?: string
}

export function ScheduleMonitorCard({ card, config, span, isCompact, userRole }: ScheduleMonitorCardProps) {
  const [showDrillDown, setShowDrillDown] = useState(false)

  // Listen for drill down events from DashboardCardWrapper
  useEffect(() => {
    const handleDrillDownEvent = (event: CustomEvent) => {
      if (event.detail.cardId === card.id || event.detail.cardType === 'schedule-monitor') {
        const shouldShow = event.detail.action === 'show'
        setShowDrillDown(shouldShow)
        
        // Notify wrapper of state change
        const stateEvent = new CustomEvent('cardDrillDownStateChange', {
          detail: {
            cardId: card.id,
            cardType: 'schedule-monitor',
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
        cardType: 'schedule-monitor',
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
        scheduleHealth: 82.4,
        scheduleGrade: 'B',
        totalActivities: 1847,
        criticalPath: {
          duration: 284,
          activities: 47,
          float: 0,
          health: 78.5
        },
        variance: {
          scheduleVariance: -12.3, // days behind
          schedulePerformanceIndex: 0.89,
          costScheduleIndex: 0.92
        },
        logicHealth: {
          score: 85.2,
          issues: 8,
          missingLogic: 3,
          danglingActivities: 2,
          invalidConstraints: 3
        },
        updateMetrics: {
          lastUpdate: '2024-01-15',
          frequency: 'Weekly',
          dataQuality: 91.7,
          progressUpdates: 156,
          missedUpdates: 4
        },
        delayAnalysis: {
          totalDelay: 18,
          weatherDelay: 12,
          permitDelay: 4,
          designDelay: 2,
          recoveryPlan: 'Accelerated schedule with overtime'
        },
        monthlyTrends: [
          { month: 'Sep', health: 88.2, spi: 0.94, variance: -8.1, activities: 1823, updates: 38 },
          { month: 'Oct', health: 86.7, spi: 0.91, variance: -9.7, activities: 1834, updates: 41 },
          { month: 'Nov', health: 84.9, spi: 0.89, variance: -11.2, activities: 1841, updates: 39 },
          { month: 'Dec', health: 83.1, spi: 0.88, variance: -12.8, activities: 1845, updates: 42 },
          { month: 'Jan', health: 82.4, spi: 0.89, variance: -12.3, activities: 1847, updates: 40 }
        ],
        milestones: [
          { name: 'Foundation Complete', status: 'completed', date: '2024-01-10', variance: 2 },
          { name: 'Steel Erection', status: 'in-progress', date: '2024-02-15', variance: -3 },
          { name: 'Envelope Complete', status: 'upcoming', date: '2024-04-20', variance: -5 },
          { name: 'MEP Rough-in', status: 'upcoming', date: '2024-06-15', variance: -8 }
        ],
        alerts: [
          { type: 'critical', message: 'Critical path delayed by weather - 12 days impact', category: 'Weather' },
          { type: 'warning', message: 'Steel delivery behind schedule - monitoring vendor', category: 'Procurement' },
          { type: 'info', message: 'Foundation work ahead of schedule by 2 days', category: 'Progress' }
        ],
        projectName: "Tropical World Nursery"
      },
      'project-executive': {
        scheduleHealth: 79.8,
        scheduleGrade: 'B-',
        totalProjects: 6,
        portfolioMetrics: {
          onSchedule: 2,
          slightlyBehind: 3,
          criticallyBehind: 1,
          avgVariance: -15.7,
          avgSPI: 0.85
        },
        criticalPath: {
          avgDuration: 312,
          avgFloat: 2.3,
          healthScore: 75.8
        },
        logicHealth: {
          avgScore: 81.4,
          totalIssues: 42,
          projectsWithIssues: 4
        },
        monthlyTrends: [
          { month: 'Sep', health: 83.2, avgSPI: 0.91, variance: -11.4, totalActivities: 8947, updates: 224 },
          { month: 'Oct', health: 81.8, avgSPI: 0.88, variance: -13.2, totalActivities: 9156, updates: 238 },
          { month: 'Nov', health: 80.5, avgSPI: 0.86, variance: -14.8, totalActivities: 9298, updates: 241 },
          { month: 'Dec', health: 79.9, avgSPI: 0.85, variance: -15.9, totalActivities: 9412, updates: 247 },
          { month: 'Jan', health: 79.8, avgSPI: 0.85, variance: -15.7, totalActivities: 9456, updates: 251 }
        ],
        projectBreakdown: [
          { project: 'Medical Center East', health: 91.2, spi: 0.98, variance: -2.1, activities: 2156, status: 'on-track' },
          { project: 'Tech Campus Phase 2', health: 87.4, spi: 0.93, variance: -6.8, activities: 1876, status: 'slight-delay' },
          { project: 'Marina Bay Plaza', health: 71.3, spi: 0.78, variance: -28.4, activities: 1654, status: 'critical' },
          { project: 'Tropical World', health: 82.4, spi: 0.89, variance: -12.3, activities: 1847, status: 'slight-delay' },
          { project: 'Grandview Heights', health: 74.2, spi: 0.81, variance: -24.7, activities: 1423, status: 'behind' },
          { project: 'Riverside Plaza', health: 86.8, spi: 0.91, variance: -8.9, activities: 1500, status: 'slight-delay' }
        ],
        riskProjects: [
          { project: 'Marina Bay Plaza', risk: 'High', issue: 'Foundation redesign required' },
          { project: 'Grandview Heights', risk: 'Medium', issue: 'Permit approval delays' }
        ]
      },
      'executive': {
        scheduleHealth: 77.6,
        scheduleGrade: 'C+',
        totalProjects: 12,
        companyMetrics: {
          onSchedule: 4,
          slightlyBehind: 6,
          criticallyBehind: 2,
          avgVariance: -18.9,
          avgSPI: 0.82,
          totalActivities: 18947
        },
        logicHealth: {
          companyScore: 78.9,
          totalIssues: 89,
          projectsWithIssues: 8
        },
        monthlyTrends: [
          { month: 'Sep', health: 81.2, avgSPI: 0.88, variance: -14.2, projects: 12, updates: 445 },
          { month: 'Oct', health: 79.8, avgSPI: 0.85, variance: -16.1, projects: 12, updates: 468 },
          { month: 'Nov', health: 78.5, avgSPI: 0.83, variance: -17.8, projects: 12, updates: 471 },
          { month: 'Dec', health: 77.9, avgSPI: 0.82, variance: -18.5, projects: 12, updates: 489 },
          { month: 'Jan', health: 77.6, avgSPI: 0.82, variance: -18.9, projects: 12, updates: 495 }
        ],
        regionalPerformance: [
          { region: 'West Coast', health: 84.2, projects: 4, variance: -8.3 },
          { region: 'Southeast', health: 76.8, projects: 5, variance: -22.1 },
          { region: 'Northeast', health: 71.4, projects: 3, variance: -28.7 }
        ]
      }
    }

    return baseData[role as keyof typeof baseData]
  }

  const data = getRoleBasedData()
  
  const getHealthColor = (health: number) => {
    if (health >= 85) return 'text-green-600 dark:text-green-400'
    if (health >= 70) return 'text-blue-600 dark:text-blue-400'
    if (health >= 55) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getHealthBadgeColor = (health: number) => {
    if (health >= 85) return 'bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800'
    if (health >= 70) return 'bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800'
    if (health >= 55) return 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800'
    return 'bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800'
  }

  const getBackgroundGradient = (health: number) => {
    if (health >= 85) return 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800'
    if (health >= 70) return 'from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800'
    if (health >= 55) return 'from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-yellow-200 dark:border-yellow-800'
    return 'from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border-red-200 dark:border-red-800'
  }

  const getTrendIcon = (variance: number) => {
    if (variance > -5) return <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
    if (variance > -15) return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
    return <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-track':
        return <Badge className="bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-200">On Track</Badge>
      case 'slight-delay':
        return <Badge className="bg-yellow-100 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-200">Slight Delay</Badge>
      case 'behind':
        return <Badge className="bg-orange-100 dark:bg-orange-950/30 text-orange-800 dark:text-orange-200">Behind</Badge>
      case 'critical':
        return <Badge className="bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-200">Critical</Badge>
      default:
        return <Badge className="bg-muted text-foreground">Unknown</Badge>
    }
  }

  const role = userRole || 'project-manager'

  // Radar chart data for schedule health dimensions
  // @ts-ignore - Complex data structure with role-based properties
  const radarData = [
    { dimension: 'Logic Health', value: data.logicHealth?.score || data.logicHealth?.avgScore || data.logicHealth?.companyScore || 80 },
    { dimension: 'Progress Updates', value: role === 'project-manager' ? data.updateMetrics?.dataQuality || 90 : 85 },
    { dimension: 'Critical Path', value: data.criticalPath?.health || data.criticalPath?.healthScore || 78 },
    { dimension: 'Milestone Performance', value: Math.max(0, 100 + (data.variance?.scheduleVariance || data.portfolioMetrics?.avgVariance || data.companyMetrics?.avgVariance || -10) * 2) },
    { dimension: 'Schedule Adherence', value: (data.variance?.schedulePerformanceIndex || data.portfolioMetrics?.avgSPI || data.companyMetrics?.avgSPI || 0.85) * 100 }
  ]

  // Count stats for compact display with type-safe access
  const onScheduleCount = role === 'executive' ? (data as any).companyMetrics?.onSchedule || 12 : 
                         role === 'project-executive' ? (data as any).portfolioMetrics?.onSchedule || 4 : 
                         ((data as any).milestones?.filter((m: any) => m.status === 'completed').length || 2)
  
  const criticalCount = role === 'executive' ? (data as any).companyMetrics?.criticallyBehind || 3 : 
                       role === 'project-executive' ? (data as any).portfolioMetrics?.criticallyBehind || 2 : 
                       ((data as any).logicHealth?.issues || 1)

  return (
    <div 
      className="relative h-full"
      data-tour="schedule-monitor-card"
    >
      <div className="h-full flex flex-col bg-transparent overflow-hidden">
        {/* Schedule Stats Header */}
        <div className="flex-shrink-0 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2 mb-1 sm:mb-1.5 lg:mb-2">
            <Badge className="bg-gray-600 text-white border-gray-600 text-xs">
              <Activity className="h-3 w-3 mr-1" />
              Schedule Monitor
            </Badge>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {data.scheduleHealth.toFixed(0)}% Health
            </div>
            <div className="flex items-center gap-1 ml-auto">
              {/* @ts-ignore - Role-based data structure */}
              {getTrendIcon(data.variance?.scheduleVariance || data.portfolioMetrics?.avgVariance || data.companyMetrics?.avgVariance || -10)}
              <Badge className={cn("text-xs", "bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-500")}>
                {data.scheduleGrade}
              </Badge>
            </div>
          </div>
          
          {/* Compact Stats - Darker Background */}
          <div className="grid grid-cols-3 gap-1 sm:gap-1.5 lg:gap-2">
            <div className="text-center p-1.5 sm:p-2 lg:p-2.5 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
              <div className="font-bold text-lg text-green-700 dark:text-green-400">{onScheduleCount}</div>
              <div className="text-xs text-green-600 dark:text-green-400">On Track</div>
            </div>
            <div className="text-center p-1.5 sm:p-2 lg:p-2.5 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
              <div className="font-bold text-lg text-red-700 dark:text-red-400">{criticalCount}</div>
              <div className="text-xs text-red-600 dark:text-red-400">Issues</div>
            </div>
            <div className="text-center p-1.5 sm:p-2 lg:p-2.5 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
              <div className="font-bold text-lg text-blue-700 dark:text-blue-400">
                {((data.variance?.schedulePerformanceIndex || data.portfolioMetrics?.avgSPI || data.companyMetrics?.avgSPI || 0.85) * 100).toFixed(0)}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">SPI %</div>
            </div>
          </div>
        </div>

        {/* Schedule Content */}
        <div className="flex-1 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 overflow-y-auto">
          <div className="space-y-3">
            {/* Schedule Health Score */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center border-3 border-gray-300 dark:border-gray-500">
                  <div className="text-center">
                    <div className={cn("text-lg font-bold", getHealthColor(data.scheduleHealth))}>{data.scheduleHealth.toFixed(0)}</div>
                    <div className="text-xs text-muted-foreground">Health</div>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1">
                  {getTrendIcon(data.variance?.scheduleVariance || data.portfolioMetrics?.avgVariance || data.companyMetrics?.avgVariance || -10)}
                </div>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Grade: {data.scheduleGrade}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-2 border border-gray-200 dark:border-gray-600">
              <h4 className="font-semibold mb-2 text-foreground text-sm">Key Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Schedule Variance</span>
                  <span className={`text-xs font-semibold ${
                    (data.variance?.scheduleVariance || data.portfolioMetrics?.avgVariance || data.companyMetrics?.avgVariance || 0) > -5 
                      ? 'text-green-600 dark:text-green-400' 
                      : (data.variance?.scheduleVariance || data.portfolioMetrics?.avgVariance || data.companyMetrics?.avgVariance || 0) > -15 
                        ? 'text-yellow-600 dark:text-yellow-400' 
                        : 'text-red-600 dark:text-red-400'
                  }`}>
                    {(data.variance?.scheduleVariance || data.portfolioMetrics?.avgVariance || data.companyMetrics?.avgVariance || 0).toFixed(1)} days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Performance Index</span>
                  <span className={`text-xs font-semibold ${
                    (data.variance?.schedulePerformanceIndex || data.portfolioMetrics?.avgSPI || data.companyMetrics?.avgSPI || 0) >= 0.95 
                      ? 'text-green-600 dark:text-green-400' 
                      : (data.variance?.schedulePerformanceIndex || data.portfolioMetrics?.avgSPI || data.companyMetrics?.avgSPI || 0) >= 0.85 
                        ? 'text-yellow-600 dark:text-yellow-400' 
                        : 'text-red-600 dark:text-red-400'
                  }`}>
                    {(data.variance?.schedulePerformanceIndex || data.portfolioMetrics?.avgSPI || data.companyMetrics?.avgSPI || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Logic Health</span>
                  <span className={`text-xs font-semibold ${getHealthColor(data.logicHealth?.score || data.logicHealth?.avgScore || data.logicHealth?.companyScore || 80)}`}>
                    {(data.logicHealth?.score || data.logicHealth?.avgScore || data.logicHealth?.companyScore || 80).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                <div className="text-sm font-medium text-foreground">
                  {role === 'project-manager' ? data.totalActivities : 
                   role === 'project-executive' ? data.totalProjects : 
                   data.totalProjects}
                </div>
                <div className="text-xs text-muted-foreground">
                  {role === 'project-manager' ? 'Activities' : 'Projects'}
                </div>
              </div>
              <div className="text-center p-2 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                <div className="text-sm font-medium text-foreground">
                  {role === 'project-manager' ? `${data.criticalPath?.activities} acts` : 
                   role === 'project-executive' ? `${data.portfolioMetrics?.onSchedule}/${data.totalProjects}` : 
                   `${data.companyMetrics?.onSchedule}/${data.totalProjects}`}
                </div>
                <div className="text-xs text-muted-foreground">
                  {role === 'project-manager' ? 'Critical Path' : 'On Schedule'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Drill-Down Overlay */}
      {showDrillDown && (
        <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm rounded-lg p-2 sm:p-1.5 sm:p-2 lg:p-2.5 lg:p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 text-white transition-all duration-300 ease-in-out overflow-y-auto z-50">
          <div className="h-full">
            <h3 className="text-base sm:text-lg lg:text-base sm:text-lg lg:text-xl font-medium mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2 text-center">Schedule Analytics Deep Dive</h3>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-1 sm:gap-1.5 lg:gap-2 lg:gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2 h-[calc(100%-60px)]">
              {/* Schedule Health Radar */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Schedule Health Dimensions
                  </h4>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#bfdbfe" />
                        <PolarAngleAxis dataKey="dimension" fontSize={10} />
                        <PolarRadiusAxis domain={[0, 100]} tick={false} />
                        <Radar
                          name="Schedule Health"
                          dataKey="value"
                          stroke="hsl(var(--chart-2))"
                          fill="hsl(var(--chart-2))"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #bfdbfe',
                            borderRadius: '6px',
                            fontSize: '12px'
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Brain className="w-4 h-4 mr-2" />
                    Schedule Metrics
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Schedule Health:</span>
                      <span className="font-medium text-blue-300">{data.scheduleHealth.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Grade:</span>
                      <span className="font-medium text-green-400">{data.scheduleGrade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Variance:</span>
                      <span className="font-medium text-purple-300">
                        {(data.variance?.scheduleVariance || data.portfolioMetrics?.avgVariance || data.companyMetrics?.avgVariance || 0).toFixed(1)} days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Performance Index:</span>
                      <span className="font-medium text-yellow-300">
                        {(data.variance?.schedulePerformanceIndex || data.portfolioMetrics?.avgSPI || data.companyMetrics?.avgSPI || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Trends */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Performance Trends
                  </h4>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={data.monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#bfdbfe" />
                        <XAxis dataKey="month" fontSize={10} stroke="hsl(var(--chart-2))" />
                        <YAxis fontSize={10} stroke="hsl(var(--chart-2))" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #bfdbfe',
                            borderRadius: '6px',
                            fontSize: '12px'
                          }} 
                        />
                        <Area
                          type="monotone"
                          dataKey="health"
                          fill="hsl(var(--chart-2))"
                          fillOpacity={0.3}
                          stroke="hsl(var(--chart-2))"
                          strokeWidth={2}
                          name="Schedule Health"
                        />
                        <Line
                          type="monotone"
                          dataKey={role === 'project-manager' ? 'spi' : 'avgSPI'}
                          stroke="hsl(var(--chart-1))"
                          strokeWidth={2}
                          name="Performance Index"
                          yAxisId="right"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    Key Insights
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Schedule Status:</span>
                      <span className={cn("font-medium", getHealthColor(data.scheduleHealth))}>
                        {data.scheduleHealth >= 85 ? 'Excellent' : data.scheduleHealth >= 70 ? 'Good' : data.scheduleHealth >= 55 ? 'Fair' : 'Poor'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Logic Issues:</span>
                      <span className="font-medium text-red-400">{criticalCount} items</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Status:</span>
                      <span className="font-medium text-green-400">
                        {role === 'project-manager' ? data.updateMetrics?.frequency || 'Weekly' : 
                         `${onScheduleCount} on track`}
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