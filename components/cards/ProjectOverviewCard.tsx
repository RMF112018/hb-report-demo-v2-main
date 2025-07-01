"use client";

import { useState } from "react";
import { Building2, Calendar, DollarSign, TrendingUp, ChevronRight, MapPin, Eye, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProjectOverviewCardProps {
  config?: any;
  span?: any;
  isCompact?: boolean;
  userRole?: string;
}

export default function ProjectOverviewCard({ config, span, isCompact, userRole }: ProjectOverviewCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case 'project-manager':
        // Single project view
        return {
          totalProjects: 1,
          activeProjects: 1,
          completedThisMonth: 0,
          totalContractValue: 57235491,
          avgProjectSize: 57235491,
          projectTypes: {
            newConstruction: 1,
            renovation: 0,
            expansion: 0
          },
          drillDown: {
            largestProject: { name: "Tropical World Nursery", value: 57235491 },
            riskProjects: 0,
            upcomingMilestones: 3,
            regionBreakdown: { north: 0, central: 1, spaceCoast: 0, southeast: 0, southwest: 0 },
            avgDuration: 24, // months
            onTimePct: 85
          }
        };
      case 'project-executive':
        // Limited to 7 projects
        return {
          totalProjects: 7,
          activeProjects: 5,
          completedThisMonth: 1,
          totalContractValue: 285480000,
          avgProjectSize: 40782857,
          projectTypes: {
            newConstruction: 4,
            renovation: 2,
            expansion: 1
          },
          drillDown: {
            largestProject: { name: "Tropical World Nursery", value: 57235491 },
            riskProjects: 1,
            upcomingMilestones: 4,
            regionBreakdown: { north: 2, central: 2, spaceCoast: 1, southeast: 1, southwest: 1 },
            avgDuration: 20, // months
            onTimePct: 78
          }
        };
      default:
        // Executive - all projects
        return {
          totalProjects: 12,
          activeProjects: 8,
          completedThisMonth: 2,
          totalContractValue: 485280000,
          avgProjectSize: 40440000,
          projectTypes: {
            newConstruction: 7,
            renovation: 3,
            expansion: 2
          },
          drillDown: {
            largestProject: { name: "Tropical World Nursery", value: 57235491 },
            riskProjects: 2,
            upcomingMilestones: 5,
            regionBreakdown: { north: 3, central: 4, spaceCoast: 2, southeast: 2, southwest: 1 },
            avgDuration: 18, // months
            onTimePct: 75
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

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="h-full flex flex-col bg-transparent overflow-hidden relative transition-all duration-300 backdrop-blur-sm border border-gray-300 dark:border-gray-500">
      {/* Enhanced Header with better contrast */}
      <div className="flex-shrink-0 p-3 sm:p-4 lg:p-5 bg-gray-200 dark:bg-gray-600 backdrop-blur-md border-b border-gray-300 dark:border-gray-500 shadow-sm">
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div className="text-center p-2 rounded-lg bg-gray-300 dark:bg-gray-500 border-2 border-gray-400 dark:border-gray-400">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-700 dark:text-blue-300">{data.totalProjects}</div>
            <div className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-200 mt-1">Total Projects</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-gray-300 dark:bg-gray-500 border-2 border-gray-400 dark:border-gray-400">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-700 dark:text-green-300">{data.activeProjects}</div>
            <div className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-200 mt-1">Active</div>
          </div>
        </div>
      </div>

      {/* Enhanced Content with better contrast */}
      <div className="flex-1 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 overflow-y-auto">
        {/* Contract Values - Improved spacing */}
        <div className="bg-gray-200 dark:bg-gray-600 rounded-lg p-2 border border-gray-300 dark:border-gray-500 mb-2 sm:mb-3 lg:mb-2 sm:mb-2 lg:mb-3">
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2">
            <Building2 className="h-4 w-4 text-foreground" />
            <span className="text-sm font-medium text-foreground">Portfolio Value</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Total Contracted</span>
              <span className="font-medium text-foreground">{formatCurrency(data.totalContractValue)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Remaining Work</span>
              <span className="font-medium text-foreground">{formatCurrency(data.remainingContractValue)}</span>
            </div>
          </div>
        </div>

        {/* Status Distribution - Improved styling */}
        <div className="bg-gray-200 dark:bg-gray-600 rounded-lg p-2 border border-gray-300 dark:border-gray-500 mb-2 sm:mb-3 lg:mb-2 sm:mb-2 lg:mb-3">
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2">
            <BarChart3 className="h-4 w-4 text-foreground" />
            <span className="text-sm font-medium text-foreground">Project Status</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2 text-center">
            <div className="p-1.5 sm:p-2 lg:p-1 sm:p-1.5 lg:p-2 bg-gray-300 dark:bg-gray-500 rounded border border-gray-400 dark:border-gray-400">
              <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-green-700 dark:text-green-400">{data.onScheduleProjects}</div>
              <div className="text-xs text-green-600 dark:text-green-300">On Track</div>
            </div>
            <div className="p-1.5 sm:p-2 lg:p-1 sm:p-1.5 lg:p-2 bg-gray-300 dark:bg-gray-500 rounded border border-gray-400 dark:border-gray-400">
              <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-yellow-700 dark:text-yellow-400">{data.atRiskProjects}</div>
              <div className="text-xs text-yellow-600 dark:text-yellow-300">At Risk</div>
            </div>
            <div className="p-1.5 sm:p-2 lg:p-1 sm:p-1.5 lg:p-2 bg-gray-300 dark:bg-gray-500 rounded border border-gray-400 dark:border-gray-400">
              <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-red-700 dark:text-red-400">{data.behindScheduleProjects}</div>
              <div className="text-xs text-red-600 dark:text-red-300">Behind</div>
            </div>
          </div>
        </div>

        {/* Financial Summary - Improved layout */}
        <div className="bg-gray-200 dark:bg-gray-600 rounded-lg p-2 border border-gray-300 dark:border-gray-500">
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2">
            <DollarSign className="h-4 w-4 text-foreground" />
            <span className="text-sm font-medium text-foreground">Financial Health</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2">
            <div className="text-center p-1.5 sm:p-2 lg:p-1 sm:p-1.5 lg:p-2 bg-gray-300 dark:bg-gray-500 rounded border border-gray-400 dark:border-gray-400">
              <div className="text-sm font-bold text-green-700 dark:text-green-400">{formatPercentage(data.avgProfitMargin)}</div>
              <div className="text-xs text-green-600 dark:text-green-300">Avg Margin</div>
            </div>
            <div className="text-center p-1.5 sm:p-2 lg:p-1 sm:p-1.5 lg:p-2 bg-gray-300 dark:bg-gray-500 rounded border border-gray-400 dark:border-gray-400">
              <div className="text-sm font-bold text-blue-700 dark:text-blue-400">{data.overallHealthScore}</div>
              <div className="text-xs text-blue-600 dark:text-blue-300">Health Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Click-triggered Detail Overlay */}
      {showDetails && (
        <div className="absolute inset-0 bg-blue-900/96 dark:bg-blue-950/96 backdrop-blur-sm p-2 sm:p-3 flex flex-col justify-center text-white animate-in fade-in duration-200 border border-blue-700/50">
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
    </div>
  );
} 