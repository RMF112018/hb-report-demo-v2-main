"use client";

import { useState } from "react";
import { Wrench, TrendingUp, TrendingDown, Calculator, Target, ChevronRight, Settings, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line } from "recharts";

interface GeneralConditionsCardProps {
  config?: any;
  span?: any;
  isCompact?: boolean;
  userRole?: string;
}

export default function GeneralConditionsCard({ config, span, isCompact, userRole }: GeneralConditionsCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case 'project-manager':
        // Single project view
        return {
          originalGCEstimate: 2294000, // single project
          currentGCEstimate: 2050000,
          gcVariance: -244000, // savings
          gcUtilizationRate: 89,
          projectsWithSavings: 1,
          projectsOverBudget: 0,
          avgSavingsPercent: 10.6,
          totalSavings: 244000,
          drillDown: {
            categories: {
              supervision: { budget: 850000, actual: 760000, variance: -90000 },
              equipment: { budget: 620000, actual: 580000, variance: -40000 },
              temporary: { budget: 480000, actual: 420000, variance: -60000 }
            },
            topSavingsProject: "Tropical World Nursery",
            biggestOverrun: "N/A",
            efficiencyGains: ["Prefab temporary structures", "Efficient supervision", "Equipment sharing"],
            avgCostPerSqFt: 11.80,
            benchmarkComparison: 15.2 // industry average
          }
        };
      case 'project-executive':
        // Limited to 7 projects
        return {
          originalGCEstimate: 10654000, // 7 projects
          currentGCEstimate: 9250000,
          gcVariance: -1404000, // savings
          gcUtilizationRate: 87,
          projectsWithSavings: 5,
          projectsOverBudget: 1,
          avgSavingsPercent: 13.2,
          totalSavings: 1404000,
          drillDown: {
            categories: {
              supervision: { budget: 2650000, actual: 2400000, variance: -250000 },
              equipment: { budget: 1850000, actual: 1700000, variance: -150000 },
              temporary: { budget: 1600000, actual: 1450000, variance: -150000 }
            },
            topSavingsProject: "Medical Center East",
            biggestOverrun: "Tech Campus Phase 2",
            efficiencyGains: ["Prefab temporary structures", "Shared equipment fleet", "Optimized supervision"],
            avgCostPerSqFt: 12.20,
            benchmarkComparison: 15.2 // industry average
          }
        };
      default:
        // Executive - all projects
        return {
          originalGCEstimate: 18364000, // sum across projects
          currentGCEstimate: 15943000,
          gcVariance: -2421000, // savings
          gcUtilizationRate: 87,
          projectsWithSavings: 7,
          projectsOverBudget: 2,
          avgSavingsPercent: 13.2,
          totalSavings: 2421000,
          drillDown: {
            categories: {
              supervision: { budget: 4500000, actual: 4200000, variance: -300000 },
              equipment: { budget: 3200000, actual: 2950000, variance: -250000 },
              temporary: { budget: 2800000, actual: 2600000, variance: -200000 }
            },
            topSavingsProject: "Medical Center East",
            biggestOverrun: "Tech Campus Phase 2",
            efficiencyGains: ["Prefab temporary structures", "Shared equipment fleet", "Optimized supervision"],
            avgCostPerSqFt: 12.50,
            benchmarkComparison: 15.2 // industry average
          }
        };
    }
  };

  const data = getDataByRole();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getVarianceIcon = (variance: number) => {
    return variance < 0 ? <TrendingDown className="h-3 w-3 text-green-600 dark:text-green-400" /> : <TrendingUp className="h-3 w-3 text-red-600 dark:text-red-400" />;
  };

  const getVarianceColor = (variance: number) => {
    return variance < 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
  };

  const getVarianceBadge = (variance: number) => {
    return variance < 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  };

  const chartData = [
    { name: 'Original', value: data.originalGCEstimate },
    { name: 'Current', value: data.currentGCEstimate },
  ];

  return (
    <div 
      className="h-full flex flex-col bg-transparent overflow-hidden relative transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Stats */}
      <div className="flex-shrink-0 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 bg-gray-200 dark:bg-gray-600 backdrop-blur-sm border-b border-gray-300 dark:border-gray-500">
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2">
          <div className="text-center">
            <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-green-700">{formatPercentage(data.avgSavingsPercent)}</div>
            <div className="text-xs text-green-600 dark:text-green-400">Avg Savings</div>
          </div>
          <div className="text-center">
            <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-blue-700">{data.gcUtilizationRate}%</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Utilization</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 overflow-y-auto space-y-2">
        {/* Cost Chart */}
        <div className="bg-gray-200 dark:bg-gray-600 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-gray-300 dark:border-gray-500">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-foreground" />
            <span className="text-sm font-medium text-foreground">Cost Overview</span>
          </div>
          <div className="h-24 sm:h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Variance Analysis */}
        <div className="bg-gray-200 dark:bg-gray-600 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-gray-300 dark:border-gray-500">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-foreground" />
            <span className="text-sm font-medium text-foreground">Variance Analysis</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {getVarianceIcon(data.gcVariance)}
              <span className={`text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium ${getVarianceColor(data.gcVariance)}`}>
                {formatCurrency(Math.abs(data.gcVariance))}
              </span>
            </div>
            <Badge className={getVarianceBadge(data.gcVariance)}>
              {data.gcVariance < 0 ? 'Savings' : 'Overrun'}
            </Badge>
          </div>
          <div className="mt-2">
            <Progress value={data.gcUtilizationRate} className="h-2" />
          </div>
        </div>

        {/* Project Performance */}
        <div className="bg-gray-200 dark:bg-gray-600 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-gray-300 dark:border-gray-500">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="h-4 w-4 text-foreground" />
            <span className="text-sm font-medium text-foreground">Project Performance</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-gray-300 dark:bg-gray-500 rounded border border-gray-400 dark:border-gray-400">
              <div className="text-sm font-bold text-green-700">{data.projectsWithSavings}</div>
              <div className="text-xs text-green-600 dark:text-green-400">Under Budget</div>
            </div>
            <div className="text-center p-2 bg-gray-300 dark:bg-gray-500 rounded border border-gray-400 dark:border-gray-400">
              <div className="text-sm font-bold text-red-700">{data.projectsOverBudget}</div>
              <div className="text-xs text-red-600 dark:text-red-400">Over Budget</div>
            </div>
          </div>
        </div>

        {/* Total Impact */}
        <div className="bg-gray-200 dark:bg-gray-600 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-gray-300 dark:border-gray-500">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-foreground" />
            <span className="text-sm font-medium text-foreground">Total Impact</span>
          </div>
          <div className="text-center">
            <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-green-700">
              {formatCurrency(data.totalSavings)}
            </div>
            <div className="text-xs text-muted-foreground">Total Portfolio Savings</div>
            <Badge className="bg-gray-300 dark:bg-gray-500 text-green-700 text-xs mt-1">
              {formatPercentage((Math.abs(data.gcVariance) / data.originalGCEstimate) * 100)} Reduction
            </Badge>
          </div>
        </div>
      </div>

      {/* Hover Drill-Down Overlay - using gray theme */}
      {isHovered && (
        <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm rounded-lg p-2 sm:p-3 flex flex-col justify-center text-white animate-in fade-in duration-200 z-10">
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4" style={{ color: '#FA4616' }} />
                <span className="font-semibold text-sm">GC/GR Deep Analysis</span>
              </div>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-gray-700/30 pb-1">
                <span className="text-gray-200">Original GC Budget:</span>
                <span className="font-medium">{formatCurrency(data.originalGCEstimate)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700/30 pb-1">
                <span className="text-gray-200">Current GC Forecast:</span>
                <span className="font-medium">{formatCurrency(data.currentGCEstimate)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700/30 pb-1">
                <span className="text-gray-200">Projects Under Budget:</span>
                <span className="font-medium text-green-400">{data.projectsWithSavings}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700/30 pb-1">
                <span className="text-gray-200">Projects Over Budget:</span>
                <span className="font-medium text-red-400">{data.projectsOverBudget}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700/30 pb-1">
                <span className="text-gray-200">Utilization Rate:</span>
                <span className="font-medium">{data.gcUtilizationRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-200">Net Savings:</span>
                <span className="font-medium text-green-400">{formatCurrency(Math.abs(data.gcVariance))}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 