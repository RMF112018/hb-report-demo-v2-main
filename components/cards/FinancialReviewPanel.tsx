"use client";

import { useEffect, useState } from "react";
import { AreaChart } from "@/components/charts/AreaChart";
import { TrendingUp, DollarSign, CalendarCheck, BarChart3, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { CustomBarChart } from "@/components/charts/BarChart";

// Props: pass in all relevant data already filtered for stage 4 projects and month 2024-12
export function FinancialReviewPanel({
  card,
  forecastIndex,
  budgetHealth,
  cashflowData,
  scheduleHealth,
  cashflowChartData,
  cashflowMetrics,
  scheduleMetrics,
}: {
  card?: { id: string; type: string; title: string };
  forecastIndex: number;
  budgetHealth: number;
  cashflowData: any;
  scheduleHealth: number;
  cashflowChartData: { name: string; value: number }[];
  cashflowMetrics: { label: string; value: string | number }[];
  scheduleMetrics: { label: string; value: string | number }[];
}) {
  const [showDrillDown, setShowDrillDown] = useState(false);
  
  // Listen for drill down events from DashboardCardWrapper
  useEffect(() => {
    if (!card) return;
    
    const handleDrillDownEvent = (event: CustomEvent) => {
      if (event.detail.cardId === card.id || event.detail.cardType === 'financial-review') {
        const shouldShow = event.detail.action === 'show'
        setShowDrillDown(shouldShow)
        
        // Notify wrapper of state change
        const stateEvent = new CustomEvent('cardDrillDownStateChange', {
          detail: {
            cardId: card.id,
            cardType: 'financial-review',
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
  }, [card]);

  // Function to handle closing the drill down overlay
  const handleCloseDrillDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDrillDown(false)
    
    if (!card) return;
    
    // Notify wrapper that drill down is closed
    const stateEvent = new CustomEvent('cardDrillDownStateChange', {
      detail: {
        cardId: card.id,
        cardType: 'financial-review',
        isActive: false
      }
    })
    window.dispatchEvent(stateEvent)
  }
  // Determine trends (mock logic)
  const trends = {
    forecast: forecastIndex > 8.5 ? ArrowUpRight : forecastIndex < 7.5 ? ArrowDownRight : Minus,
    budget: budgetHealth > 8.0 ? ArrowUpRight : budgetHealth < 7.0 ? ArrowDownRight : Minus,
    schedule: scheduleHealth > 9.0 ? ArrowUpRight : scheduleHealth < 8.0 ? ArrowDownRight : Minus,
  };

  const trendColors = {
    forecast: forecastIndex > 8.5 ? "text-green-600 dark:text-green-400" : forecastIndex < 7.5 ? "text-red-600 dark:text-red-400" : "text-muted-foreground",
    budget: budgetHealth > 8.0 ? "text-green-600 dark:text-green-400" : budgetHealth < 7.0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground",
    schedule: scheduleHealth > 9.0 ? "text-green-600 dark:text-green-400" : scheduleHealth < 8.0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground",
  };

  // Create simplified chart data for schedule
  const scheduleChartData = [
    { name: 'Jan', value: 85 },
    { name: 'Feb', value: 88 },
    { name: 'Mar', value: 82 },
    { name: 'Apr', value: 89 },
    { name: 'May', value: 91 },
    { name: 'Jun', value: scheduleHealth * 10 },
  ];

  return (
    <div className="relative h-full w-full flex flex-col bg-gray-200 dark:bg-gray-800 overflow-hidden">
      {/* Key Metrics Row */}
      <div className="p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
        <div className="grid grid-cols-4 gap-1 sm:gap-1.5 lg:gap-2">
          {/* Forecast Index */}
          <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-1.5 sm:p-2 lg:p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Forecast</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-blue-900 dark:text-blue-100">{forecastIndex.toFixed(1)}</span>
              <trends.forecast className={`h-3 w-3 ${trendColors.forecast}`} />
            </div>
            <span className="text-xs text-blue-600 dark:text-blue-400">Index</span>
          </div>

          {/* Budget Health */}
          <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-1.5 sm:p-2 lg:p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-700 dark:text-green-300">Budget</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-green-900 dark:text-green-100">{budgetHealth.toFixed(1)}</span>
              <trends.budget className={`h-3 w-3 ${trendColors.budget}`} />
            </div>
            <span className="text-xs text-green-600 dark:text-green-400">Health</span>
          </div>

          {/* Schedule Health */}
          <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-1.5 sm:p-2 lg:p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CalendarCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Schedule</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-indigo-900 dark:text-indigo-100">{scheduleHealth.toFixed(1)}</span>
              <trends.schedule className={`h-3 w-3 ${trendColors.schedule}`} />
            </div>
            <span className="text-xs text-indigo-600 dark:text-indigo-400">Score</span>
          </div>

          {/* Net Cash Flow */}
          <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-1.5 sm:p-2 lg:p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Cash Flow</span>
            </div>
            <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-purple-900 dark:text-purple-100">
              {cashflowMetrics[0]?.value || '$0'}
            </div>
            <span className="text-xs text-purple-600">Net</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="flex-1 px-2 sm:px-2.5 lg:px-1.5 sm:px-2 lg:px-2.5 pb-4 min-h-0">
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2 h-full">
          {/* Cashflow Trend */}
          <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-1.5 sm:p-2 lg:p-2.5 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-sm text-foreground">Cash Flow Trend</span>
            </div>
            <div className="flex-1 min-h-20">
              <AreaChart data={cashflowChartData} color="hsl(var(--chart-2))" compact />
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {cashflowMetrics.slice(1, 3).map((metric, i) => (
                <div key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 rounded text-xs text-blue-800 dark:text-blue-200">
                  <span className="font-semibold">{metric.value}</span> {metric.label}
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Performance */}
          <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-1.5 sm:p-2 lg:p-2.5 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <CalendarCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-medium text-sm text-foreground">Schedule Performance</span>
            </div>
            <div className="flex-1 min-h-20">
              <AreaChart data={scheduleChartData} color="hsl(var(--chart-1))" compact />
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {scheduleMetrics.slice(0, 2).map((metric, i) => (
                <div key={i} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 rounded text-xs text-indigo-800 dark:text-indigo-200">
                  <span className="font-semibold">{metric.value}</span> {metric.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Click-Based Drill-Down Overlay */}
      {showDrillDown && (
        <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm rounded-lg p-2 sm:p-1.5 sm:p-2 lg:p-2.5 lg:p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 text-white transition-all duration-300 ease-in-out overflow-y-auto z-50">
          <div className="h-full">
            {/* Close Button */}
            <button
              onClick={handleCloseDrillDown}
              className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close drill down"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-base sm:text-lg lg:text-base sm:text-lg lg:text-xl font-medium mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2 text-center">Financial Review Deep Dive</h3>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-1 sm:gap-1.5 lg:gap-2 lg:gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2 h-[calc(100%-60px)]">
              {/* Financial Health */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Budget Performance
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Budget Health Score:</span>
                      <span className="font-medium text-green-400">{budgetHealth.toFixed(1)}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Forecast Accuracy:</span>
                      <span className="font-medium text-blue-400">{forecastIndex.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Variance Trend:</span>
                      <span className="font-medium text-yellow-400">Improving</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk Level:</span>
                      <span className="font-medium text-green-400">Low</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Cash Flow Analysis
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Current Flow:</span>
                      <span className="font-medium text-green-400">{cashflowMetrics[0]?.value || '$0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Average:</span>
                      <span className="font-medium">$2.1M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Projection Accuracy:</span>
                      <span className="font-medium text-green-400">94%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Working Capital:</span>
                      <span className="font-medium text-blue-400">$8.5M</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule & Risk */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <CalendarCheck className="w-4 h-4 mr-2" />
                    Schedule Performance
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Schedule Health:</span>
                      <span className="font-medium text-green-400">{scheduleHealth.toFixed(1)}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>On-Time Rate:</span>
                      <span className="font-medium text-green-400">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Critical Path Risk:</span>
                      <span className="font-medium text-yellow-400">Medium</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Milestone Adherence:</span>
                      <span className="font-medium text-green-400">92%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Key Insights
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="border-b border-white/20 dark:border-black/20 pb-2">
                      <div className="font-medium">Budget variance trending positive</div>
                      <div className="text-xs text-blue-200">3% improvement over last quarter</div>
                    </div>
                    <div className="border-b border-white/20 dark:border-black/20 pb-2">
                      <div className="font-medium">Schedule optimization opportunities</div>
                      <div className="text-xs text-blue-200">2 activities can be accelerated</div>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-blue-200">
                        Overall financial health is strong with room for schedule optimization.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 