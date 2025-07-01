"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Clock, AlertCircle, FileCheck, Building2, ClipboardCheck, Users, CalendarCheck, ChevronRight, TrendingUp, Target, Award, FileText, Shield, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { DashboardCard } from "@/types/dashboard"

interface CloseoutCardProps {
  card: DashboardCard
  config?: any;
  span?: any;
  isCompact?: boolean;
  userRole?: string;
}

export default function CloseoutCard({ card, config, span, isCompact, userRole }: CloseoutCardProps) {
  const [showDrillDown, setShowDrillDown] = useState(false);

  // Listen for drill down events from DashboardCardWrapper
  useEffect(() => {
    const handleDrillDownEvent = (event: CustomEvent) => {
      if (event.detail.cardId === card.id || event.detail.cardType === 'closeout') {
        const shouldShow = event.detail.action === 'show'
        setShowDrillDown(shouldShow)
        
        // Notify wrapper of state change
        const stateEvent = new CustomEvent('cardDrillDownStateChange', {
          detail: {
            cardId: card.id,
            cardType: 'closeout',
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
        cardType: 'closeout',
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
          overallCompletion: 78.5,
          totalItems: 48,
          completedItems: 38,
          pendingItems: 7,
          criticalItems: 3,
          daysToCompletion: 12,
          lastActivity: "2 hours ago",
          projectPhase: "Turnover",
          riskLevel: "Medium",
          categories: [
            { name: "Tasks", total: 5, completed: 5, pending: 0, critical: 0, completion: 100 },
            { name: "Document Tracking", total: 13, completed: 11, pending: 1, critical: 1, completion: 84.6 },
            { name: "Inspections", total: 11, completed: 9, pending: 2, critical: 0, completion: 81.8 },
            { name: "Turnover", total: 15, completed: 10, pending: 3, critical: 2, completion: 66.7 },
            { name: "Post Turnover", total: 5, completed: 3, pending: 1, critical: 0, completion: 60.0 },
            { name: "Project Documents", total: 5, completed: 0, pending: 0, critical: 0, completion: 0 }
          ],
          drillDown: {
            projectDetails: {
              name: "Tropical World Nursery",
              phase: "Turnover",
              coDate: "2025-01-15",
              punchListItems: 12,
              warrantyStatus: "Pending"
            },
            criticalTasks: [
              { task: "Final Survey & Elevation Certificate", category: "Document Tracking", daysOverdue: 3 },
              { task: "Complete punch list", category: "Turnover", daysOverdue: 1 },
              { task: "Give Owner all Maintenance Manuals", category: "Turnover", daysOverdue: 0 }
            ],
            recentActivity: [
              { date: "2025-01-10", action: "Building Final inspection passed", status: "completed" },
              { date: "2025-01-09", action: "HVAC Final inspection scheduled", status: "pending" },
              { date: "2025-01-08", action: "All RFI's closed", status: "completed" }
            ],
            upcomingMilestones: [
              { milestone: "Certificate of Occupancy", dueDate: "2025-01-15", status: "pending" },
              { milestone: "Owner Turnover Meeting", dueDate: "2025-01-18", status: "scheduled" },
              { milestone: "Final Payment Processing", dueDate: "2025-01-25", status: "pending" }
            ]
          }
        };
      case 'project-executive':
        // Limited to 6 projects
        return {
          overallCompletion: 82.3,
          totalItems: 288, // 48 items × 6 projects
          completedItems: 237,
          pendingItems: 38,
          criticalItems: 13,
          daysToCompletion: 18,
          lastActivity: "1 hour ago",
          projectPhase: "Mixed",
          riskLevel: "Medium",
          categories: [
            { name: "Tasks", total: 30, completed: 28, pending: 2, critical: 0, completion: 93.3 },
            { name: "Document Tracking", total: 78, completed: 65, pending: 8, critical: 5, completion: 83.3 },
            { name: "Inspections", total: 66, completed: 55, pending: 8, critical: 3, completion: 83.3 },
            { name: "Turnover", total: 90, completed: 70, pending: 15, critical: 5, completion: 77.8 },
            { name: "Post Turnover", total: 30, completed: 19, pending: 5, critical: 0, completion: 63.3 },
            { name: "Project Documents", total: 30, completed: 0, pending: 0, critical: 0, completion: 0 }
          ],
          drillDown: {
            projectPerformance: [
              { project: "Medical Center East", completion: 95.8, status: "Excellent", phase: "Post Turnover", critical: 0 },
              { project: "Tech Campus Phase 2", completion: 88.5, status: "Good", phase: "Turnover", critical: 2 },
              { project: "Marina Bay Plaza", completion: 91.7, status: "Good", phase: "Post Turnover", critical: 1 },
              { project: "Tropical World", completion: 78.5, status: "Attention", phase: "Turnover", critical: 3 },
              { project: "Grandview Heights", completion: 72.9, status: "Attention", phase: "Inspections", critical: 4 },
              { project: "Riverside Plaza", completion: 65.6, status: "Behind", phase: "Inspections", critical: 3 }
            ],
            portfolioRisks: [
              "3 projects with critical items overdue",
              "2 projects behind schedule on CO",
              "5 pending final inspections",
              "Document tracking lagging on newer projects"
            ],
            upcomingDeadlines: [
              { project: "Medical Center East", milestone: "Final Payment", dueDate: "2025-01-12" },
              { project: "Tropical World", milestone: "Certificate of Occupancy", dueDate: "2025-01-15" },
              { project: "Tech Campus", milestone: "Owner Turnover", dueDate: "2025-01-20" }
            ]
          }
        };
      default:
        // Executive - all projects view
        return {
          overallCompletion: 79.8,
          totalItems: 576, // 48 items × 12 projects
          completedItems: 459,
          pendingItems: 85,
          criticalItems: 32,
          daysToCompletion: 25,
          lastActivity: "30 minutes ago",
          projectPhase: "Mixed",
          riskLevel: "High",
          categories: [
            { name: "Tasks", total: 60, completed: 55, pending: 4, critical: 1, completion: 91.7 },
            { name: "Document Tracking", total: 156, completed: 125, pending: 20, critical: 11, completion: 80.1 },
            { name: "Inspections", total: 132, completed: 105, pending: 18, critical: 9, completion: 79.5 },
            { name: "Turnover", total: 180, completed: 135, pending: 32, critical: 13, completion: 75.0 },
            { name: "Post Turnover", total: 60, completed: 39, pending: 11, critical: 0, completion: 65.0 },
            { name: "Project Documents", total: 60, completed: 0, pending: 0, critical: 0, completion: 0 }
          ],
          drillDown: {
            portfolioMetrics: {
              avgCompletionTime: 89, // days
              onTimeCloseouts: 75, // percentage
              documentAccuracy: 92, // percentage
              clientSatisfaction: 4.6 // out of 5
            },
            topPerformers: [
              { project: "Corporate Headquarters", completion: 98.9 },
              { project: "Retail Complex West", completion: 96.4 },
              { project: "Office Tower Downtown", completion: 94.8 }
            ],
            riskProjects: [
              { project: "Manufacturing Facility", completion: 58.3, critical: 8 },
              { project: "Hospital Wing B", completion: 62.5, critical: 6 },
              { project: "School District Admin", completion: 67.2, critical: 5 }
            ],
            portfolioRisks: [
              "8 projects with critical items overdue >7 days",
              "5 projects behind schedule on final inspections",
              "12 pending Certificates of Occupancy",
              "Document management system needs attention",
              "Resource constraints in inspection scheduling"
            ]
          }
        };
    }
  };

  const data = getDataByRole();

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getStatusColor = (completion: number) => {
    if (completion >= 90) return "text-green-600 dark:text-green-400";
    if (completion >= 75) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getStatusBadge = (completion: number) => {
    if (completion >= 90) return "bg-green-100 text-green-700";
    if (completion >= 75) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
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
      data-tour="closeout-card"
    >
      <div className="h-full flex flex-col bg-transparent overflow-hidden">
        {/* Closeout Stats Header */}
        <div className="flex-shrink-0 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2 mb-1 sm:mb-1.5 lg:mb-2">
            <Badge className="bg-gray-600 text-white border-gray-600 text-xs">
              <ClipboardCheck className="h-3 w-3 mr-1" />
              Closeout Monitor
            </Badge>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {formatPercentage(data.overallCompletion)} Complete
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <div className={`text-sm font-medium ${getRiskColor(data.riskLevel)}`}>
                {data.riskLevel}
              </div>
              <Badge className="bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-xs">
                {data.daysToCompletion}d
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
              <div className="font-bold text-lg text-yellow-700 dark:text-yellow-400">{data.pendingItems}</div>
              <div className="text-xs text-yellow-600 dark:text-yellow-400">Pending</div>
            </div>
            <div className="text-center p-1.5 sm:p-2 lg:p-2.5 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
              <div className="font-bold text-lg text-red-700 dark:text-red-400">{data.criticalItems}</div>
              <div className="text-xs text-red-600 dark:text-red-400">Critical</div>
            </div>
          </div>
        </div>

        {/* Closeout Content */}
        <div className="flex-1 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 overflow-y-auto">
          <div className="space-y-3">
            {/* Status Overview */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-2 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium text-foreground">Closeout Status</span>
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
                <div className="flex-1 grid grid-cols-3 gap-1 text-xs">
                  <div className="text-center p-1.5 bg-green-50 dark:bg-green-950/30 rounded border border-green-200 dark:border-green-700">
                    <div className="font-bold text-green-600 dark:text-green-400">{data.completedItems}</div>
                    <div className="text-muted-foreground">Complete</div>
                  </div>
                  <div className="text-center p-1.5 bg-yellow-50 dark:bg-yellow-950/30 rounded border border-yellow-200 dark:border-yellow-700">
                    <div className="font-bold text-yellow-600 dark:text-yellow-400">{data.pendingItems}</div>
                    <div className="text-muted-foreground">Pending</div>
                  </div>
                  <div className="text-center p-1.5 bg-red-50 dark:bg-red-950/30 rounded border border-red-200 dark:border-red-700">
                    <div className="font-bold text-red-600 dark:text-red-400">{data.criticalItems}</div>
                    <div className="text-muted-foreground">Critical</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress by Category */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-2 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium text-foreground">Category Progress</span>
              </div>
              <div className="space-y-2">
                {data.categories.slice(0, 3).map((category) => (
                  <div key={category.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{category.name}</span>
                      <span className="font-medium">{formatPercentage(category.completion)}</span>
                    </div>
                    <Progress value={category.completion} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-2 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <CalendarCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium text-foreground">Timeline</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Est. Completion</span>
                  <Badge variant="outline" className="text-xs">{data.daysToCompletion} days</Badge>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Current Phase</span>
                  <Badge className={`${getStatusBadge(data.overallCompletion)} text-xs border border-gray-300 dark:border-gray-600`}>
                    {data.projectPhase}
                  </Badge>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Last Activity</span>
                  <span className="font-medium">{data.lastActivity}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Drill-Down Overlay */}
      {showDrillDown && (
        <div className="absolute inset-0 bg-indigo-900/95 backdrop-blur-sm rounded-lg p-2 sm:p-1.5 sm:p-2 lg:p-2.5 lg:p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 text-white transition-all duration-300 ease-in-out overflow-y-auto z-50">
          <div className="h-full">
            <h3 className="text-base sm:text-lg lg:text-base sm:text-lg lg:text-xl font-medium mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2 text-center">Closeout Deep Dive</h3>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-1 sm:gap-1.5 lg:gap-2 lg:gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2 h-[calc(100%-60px)]">
              {/* Categories Breakdown */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <FileCheck className="w-4 h-4 mr-2" />
                    Category Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    {data.categories.map((cat) => (
                      <div key={cat.name} className="flex justify-between items-center">
                        <span className="text-indigo-200">{cat.name}:</span>
                        <div className="text-right">
                          <div className="font-medium">{cat.completed}/{cat.total}</div>
                          {cat.critical > 0 && (
                            <div className="text-red-300 text-xs">⚠ {cat.critical} critical</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <CalendarCheck className="w-4 h-4 mr-2" />
                    Status Metrics
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Overall Progress:</span>
                      <span className="font-medium text-indigo-300">{formatPercentage(data.overallCompletion)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Phase:</span>
                      <span className="font-medium text-yellow-300">{data.projectPhase}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk Level:</span>
                      <span className="font-medium text-purple-300">{data.riskLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Days to Target:</span>
                      <span className="font-medium text-green-400">{data.daysToCompletion} days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts and Details */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Category Completion
                  </h4>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryData}>
                        <Bar dataKey="completion" fill="hsl(var(--chart-1))" radius={[2, 2, 0, 0]} />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#c7d2fe' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#c7d2fe' }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0,0,0,0.8)', 
                            border: 'none', 
                            borderRadius: '6px',
                            fontSize: '12px'
                          }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    Key Insights
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Overall Health:</span>
                      <span className="font-medium text-indigo-300">
                        {data.overallCompletion >= 90 ? 'Excellent' : data.overallCompletion >= 75 ? 'Good' : 'Needs Attention'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Items:</span>
                      <span className="font-medium text-green-400">{data.totalItems} total</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Critical Items:</span>
                      <span className="font-medium text-red-400">{data.criticalItems} need attention</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Update:</span>
                      <span className="font-medium text-blue-300">{data.lastActivity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Close Button */}
            <div className="absolute bottom-4 right-4">
              <button
                onClick={handleCloseDrillDown}
                className="bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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