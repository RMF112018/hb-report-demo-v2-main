"use client";

import { useState, useEffect } from "react";
import { Play, Clock, AlertCircle, FileCheck, Building2, ClipboardCheck, Users, CalendarCheck, ChevronRight, TrendingUp, Target, Award, FileText, Shield, Wrench, Settings, Users2, Clipboard, Activity, Brain, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { DashboardCard } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface StartupCardProps {
  card: DashboardCard;
  config?: any;
  span?: any;
  isCompact?: boolean;
  userRole?: string;
}

export default function StartupCard({ card, config, span, isCompact, userRole }: StartupCardProps) {
  const [showDrillDown, setShowDrillDown] = useState(false);

  // Listen for drill down events from DashboardCardWrapper
  useEffect(() => {
    const handleDrillDownEvent = (event: CustomEvent) => {
      if (event.detail.cardId === card.id || event.detail.cardType === 'startup') {
        const shouldShow = event.detail.action === 'show'
        setShowDrillDown(shouldShow)
        
        // Notify wrapper of state change
        const stateEvent = new CustomEvent('cardDrillDownStateChange', {
          detail: {
            cardId: card.id,
            cardType: 'startup',
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
        cardType: 'startup',
        isActive: false
      }
    })
    window.dispatchEvent(stateEvent)
  }
  
  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case 'project-manager':
        // Single project view
        return {
          overallCompletion: 85.5,
          totalItems: 55,
          completedItems: 47,
          pendingItems: 6,
          criticalItems: 2,
          daysToMobilization: 5,
          lastActivity: "1 hour ago",
          projectPhase: "Pre-Construction",
          riskLevel: "Low",
          categories: [
            { name: "Contract Review", total: 4, completed: 4, pending: 0, critical: 0, completion: 100 },
            { name: "Job Start-up", total: 33, completed: 28, pending: 4, critical: 1, completion: 84.8 },
            { name: "Services & Equipment", total: 6, completed: 5, pending: 1, critical: 0, completion: 83.3 },
            { name: "Permits", total: 12, completed: 10, pending: 1, critical: 1, completion: 83.3 }
          ],
          drillDown: {
            projectDetails: {
              name: "Tropical World Nursery",
              phase: "Pre-Construction",
              mobDate: "2025-01-20",
              contractValue: 57235491,
              noticeSentDate: "2025-01-08"
            },
            criticalTasks: [
              { task: "Fire Sprinklers permit", category: "Permits", daysOverdue: 2 },
              { task: "Prepare Project Schedule", category: "Job Start-up", daysOverdue: 0 }
            ],
            recentActivity: [
              { date: "2025-01-10", action: "Notice of Commencement recorded", status: "completed" },
              { date: "2025-01-09", action: "Project signs ordered", status: "completed" },
              { date: "2025-01-08", action: "Bond application submitted", status: "completed" }
            ],
            upcomingMilestones: [
              { milestone: "Mobilization", dueDate: "2025-01-20", status: "pending" },
              { milestone: "Pre-Construction Meeting", dueDate: "2025-01-18", status: "scheduled" },
              { milestone: "Final Permit Approval", dueDate: "2025-01-15", status: "pending" }
            ]
          }
        };
      case 'project-executive':
        // Limited to 6 projects
        return {
          overallCompletion: 78.2,
          totalItems: 330, // 55 items × 6 projects
          completedItems: 258,
          pendingItems: 52,
          criticalItems: 20,
          daysToMobilization: 12,
          lastActivity: "45 minutes ago",
          projectPhase: "Mixed",
          riskLevel: "Medium",
          categories: [
            { name: "Contract Review", total: 24, completed: 22, pending: 2, critical: 0, completion: 91.7 },
            { name: "Job Start-up", total: 198, completed: 155, pending: 30, critical: 13, completion: 78.3 },
            { name: "Services & Equipment", total: 36, completed: 28, pending: 6, critical: 2, completion: 77.8 },
            { name: "Permits", total: 72, completed: 53, pending: 14, critical: 5, completion: 73.6 }
          ],
          drillDown: {
            projectPerformance: [
              { project: "Medical Center East", completion: 95.2, status: "Excellent", phase: "Ready to Mobilize", critical: 0 },
              { project: "Tech Campus Phase 2", completion: 89.1, status: "Good", phase: "Permits Pending", critical: 2 },
              { project: "Marina Bay Plaza", completion: 83.6, status: "Good", phase: "Pre-Construction", critical: 1 },
              { project: "Tropical World", completion: 85.5, status: "Good", phase: "Pre-Construction", critical: 2 },
              { project: "Grandview Heights", completion: 67.3, status: "Attention", phase: "Contract Review", critical: 8 },
              { project: "Riverside Plaza", completion: 58.2, status: "Behind", phase: "Setup", critical: 7 }
            ],
            portfolioRisks: [
              "2 projects behind schedule on mobilization",
              "8 permits pending approval across portfolio",
              "Contract review delays on newer awards",
              "Subcontractor insurance compliance lagging"
            ],
            upcomingDeadlines: [
              { project: "Medical Center East", milestone: "Mobilization", dueDate: "2025-01-15" },
              { project: "Tech Campus", milestone: "Final Permits", dueDate: "2025-01-18" },
              { project: "Tropical World", milestone: "Pre-Con Meeting", dueDate: "2025-01-18" }
            ]
          }
        };
      default:
        // Executive - all projects view
        return {
          overallCompletion: 73.8,
          totalItems: 660, // 55 items × 12 projects
          completedItems: 487,
          pendingItems: 125,
          criticalItems: 48,
          daysToMobilization: 18,
          lastActivity: "15 minutes ago",
          projectPhase: "Mixed",
          riskLevel: "High",
          categories: [
            { name: "Contract Review", total: 48, completed: 42, pending: 4, critical: 2, completion: 87.5 },
            { name: "Job Start-up", total: 396, completed: 285, pending: 75, critical: 36, completion: 72.0 },
            { name: "Services & Equipment", total: 72, completed: 52, pending: 15, critical: 5, completion: 72.2 },
            { name: "Permits", total: 144, completed: 108, pending: 31, critical: 5, completion: 75.0 }
          ],
          drillDown: {
            portfolioMetrics: {
              avgMobilizationTime: 21, // days
              onTimeStartups: 67, // percentage
              permitSuccess: 89, // percentage
              contractCompliance: 94 // percentage
            },
            topPerformers: [
              { project: "Corporate Headquarters", completion: 98.2 },
              { project: "Retail Complex West", completion: 95.5 },
              { project: "Office Tower Downtown", completion: 92.7 }
            ],
            riskProjects: [
              { project: "Manufacturing Facility", completion: 45.5, critical: 12 },
              { project: "Hospital Wing B", completion: 52.7, critical: 10 },
              { project: "School District Admin", completion: 58.2, critical: 8 }
            ],
            portfolioRisks: [
              "5 projects significantly behind startup timeline",
              "18 permits pending approval across portfolio",
              "Contract review bottleneck on new awards",
              "Subcontractor insurance processing delays",
              "Resource constraints in pre-construction phase"
            ]
          }
        };
    }
  };

  const data = getDataByRole();

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (completion: number) => {
    if (completion >= 90) return "text-green-600 dark:text-green-400";
    if (completion >= 75) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getStatusBadge = (completion: number) => {
    if (completion >= 90) return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    if (completion >= 75) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
    return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-red-600 dark:text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  // Chart data
  const categoryData = data.categories.map(cat => ({
    name: cat.name.split(' ')[0], // Shorten for display
    completion: cat.completion,
    completed: cat.completed,
    pending: cat.pending,
    critical: cat.critical
  }));

  const statusData = [
    { name: "Completed", value: data.completedItems, color: "hsl(var(--chart-1))" },
    { name: "Pending", value: data.pendingItems, color: "hsl(var(--chart-3))" },
    { name: "Critical", value: data.criticalItems, color: "hsl(var(--chart-4))" },
  ];

  return (
    <div 
      className="relative h-full"
      data-tour="startup-card"
    >
      <div className="h-full flex flex-col bg-transparent overflow-hidden">
        {/* Startup Stats Header */}
        <div className="flex-shrink-0 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2 mb-1 sm:mb-1.5 lg:mb-2">
            <Badge className="bg-gray-600 text-white border-gray-600 text-xs">
              <Activity className="h-3 w-3 mr-1" />
              Startup Monitor
            </Badge>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {formatPercentage(data.overallCompletion)} Ready
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <Badge className={cn("text-xs", getRiskColor(data.riskLevel), "bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-500")}>
                {data.riskLevel} Risk
              </Badge>
            </div>
          </div>
          
          {/* Compact Stats - Darker Background */}
          <div className="grid grid-cols-3 gap-1 sm:gap-1.5 lg:gap-2">
            <div className="text-center p-1.5 sm:p-2 lg:p-2.5 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
              <div className="font-bold text-lg text-green-700 dark:text-green-400">{data.completedItems}</div>
              <div className="text-xs text-green-600 dark:text-green-400">Complete</div>
            </div>
            <div className="text-center p-1.5 sm:p-2 lg:p-2.5 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
              <div className="font-bold text-lg text-red-700 dark:text-red-400">{data.criticalItems}</div>
              <div className="text-xs text-red-600 dark:text-red-400">Critical</div>
            </div>
            <div className="text-center p-1.5 sm:p-2 lg:p-2.5 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
              <div className="font-bold text-lg text-blue-700 dark:text-blue-400">{data.daysToMobilization}</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Days to Mob</div>
            </div>
          </div>
        </div>

        {/* Startup Content */}
        <div className="flex-1 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 overflow-y-auto">
          <div className="space-y-3">
            {/* Status Overview */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-2 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <Play className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-foreground">Status Overview</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={12}
                        outerRadius={28}
                        dataKey="value"
                      >
                        {statusData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={statusData[index].color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Items:</span>
                    <span className="font-medium">{data.totalItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pending:</span>
                    <span className="font-medium text-yellow-600 dark:text-yellow-400">{data.pendingItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phase:</span>
                    <span className="font-medium">{data.projectPhase}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Progress */}
            <div className="space-y-2">
              {data.categories.slice(0, 4).map((category) => (
                <div key={category.name} className="flex items-center justify-between p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: category.completion >= 90 ? '#10b981' : category.completion >= 75 ? '#f59e0b' : '#ef4444' }}
                    />
                    <span className="text-xs text-muted-foreground font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={category.completion} className="h-1.5 w-16" />
                    <span className={cn("text-xs font-semibold min-w-[2rem]", getStatusColor(category.completion))}>
                      {formatPercentage(category.completion)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                <div className={cn("text-sm font-medium", getStatusColor(data.overallCompletion))}>
                  {formatPercentage(data.overallCompletion)}
                </div>
                <div className="text-xs text-muted-foreground">Completion</div>
              </div>
              <div className="text-center p-2 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                <div className="text-sm font-medium text-foreground">
                  {data.lastActivity}
                </div>
                <div className="text-xs text-muted-foreground">Last Activity</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Drill-Down Overlay */}
      {showDrillDown && (
        <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm rounded-lg p-2 sm:p-1.5 sm:p-2 lg:p-2.5 lg:p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 text-white transition-all duration-300 ease-in-out overflow-y-auto z-50">
          <div className="h-full">
            <h3 className="text-base sm:text-lg lg:text-base sm:text-lg lg:text-xl font-medium mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2 text-center">Startup Analytics Deep Dive</h3>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-1 sm:gap-1.5 lg:gap-2 lg:gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2 h-[calc(100%-60px)]">
              {/* Category Breakdown */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Category Progress
                  </h4>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                        <XAxis dataKey="name" fontSize={9} stroke="white" />
                        <YAxis domain={[0, 100]} fontSize={9} stroke="white" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            border: '1px solid #ffffff40',
                            borderRadius: '6px',
                            fontSize: '12px',
                            color: 'white'
                          }}
                        />
                        <Bar dataKey="completion" fill="#60a5fa" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Brain className="w-4 h-4 mr-2" />
                    Startup Metrics
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Overall Completion:</span>
                      <span className="font-medium text-blue-300">{formatPercentage(data.overallCompletion)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk Level:</span>
                      <span className={cn("font-medium", getRiskColor(data.riskLevel))}>{data.riskLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Days to Mobilization:</span>
                      <span className="font-medium text-green-400">{data.daysToMobilization} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Phase:</span>
                      <span className="font-medium text-purple-300">{data.projectPhase}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Details or Portfolio View */}
              <div className="space-y-4">
                {userRole === 'project-manager' ? (
                  <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                    <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      Project Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Project:</span>
                        <span className="font-medium text-blue-300">{data.drillDown.projectDetails?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mobilization:</span>
                        <span className="font-medium text-green-400">{data.drillDown.projectDetails?.mobDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Contract Value:</span>
                        <span className="font-medium text-purple-300">{formatCurrency(data.drillDown.projectDetails?.contractValue)}</span>
                      </div>
                      <div className="pt-2 border-t border-white/20">
                        <div className="text-sm font-medium mb-1">Critical Tasks:</div>
                        {data.drillDown.criticalTasks?.map((task, index) => (
                          <div key={index} className="text-xs text-red-300">
                            • {task.task} {task.daysOverdue > 0 && `(${task.daysOverdue}d overdue)`}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : userRole === 'project-executive' ? (
                  <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                    <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      Portfolio Status
                    </h4>
                    <div className="space-y-1 text-xs max-h-32 overflow-y-auto">
                      {data.drillDown.projectPerformance?.slice(0, 4).map((project, index) => (
                        <div key={index} className="flex justify-between items-center border-b border-white/20 pb-1">
                          <div className="flex-1">
                            <div className="font-medium text-blue-300">{project.project}</div>
                            <div className="text-white/70">{formatPercentage(project.completion)} • {project.phase}</div>
                          </div>
                          <Badge className={cn("text-xs", 
                            project.status === 'Excellent' ? 'bg-green-200 text-green-800' :
                            project.status === 'Good' ? 'bg-blue-200 text-blue-800' :
                            project.status === 'Attention' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-red-200 text-red-800'
                          )}>
                            {project.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                    <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Portfolio Metrics
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Avg Mobilization:</span>
                        <span className="font-medium text-blue-300">{data.drillDown.portfolioMetrics?.avgMobilizationTime} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>On-Time Startups:</span>
                        <span className="font-medium text-green-400">{data.drillDown.portfolioMetrics?.onTimeStartups}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Permit Success:</span>
                        <span className="font-medium text-purple-300">{data.drillDown.portfolioMetrics?.permitSuccess}%</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    Key Insights
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Startup Health:</span>
                      <span className={cn("font-medium", getStatusColor(data.overallCompletion))}>
                        {data.overallCompletion >= 90 ? 'Excellent' : data.overallCompletion >= 75 ? 'Good' : 'Needs Attention'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Critical Items:</span>
                      <span className="font-medium text-red-400">{data.criticalItems} items</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completion Rate:</span>
                      <span className="font-medium text-green-400">{Math.round((data.completedItems / data.totalItems) * 100)}%</span>
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
  );
}