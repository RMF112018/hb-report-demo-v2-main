"use client";

import { useState, useEffect } from "react";
import { Shield, AlertTriangle, ChevronRight, Clock, Users, TrendingDown, Eye, CheckCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line } from "recharts";

interface DashboardCard {
  id: string;
  type: string;
  title: string;
  config?: any;
}

interface SafetyCardProps {
  card: DashboardCard;
  config?: any;
  span?: any;
  isCompact?: boolean;
  userRole?: string;
}

export default function SafetyCard({ card, config, span, isCompact, userRole }: SafetyCardProps) {
  const [showDrillDown, setShowDrillDown] = useState(false);
  
  // Listen for drill-down events
  useEffect(() => {
    const handleCardDrillDown = (event: CustomEvent) => {
      if (event.detail.cardId === card.id) {
        setShowDrillDown(true);
      }
    };

    const handleCardDrillDownStateChange = (event: CustomEvent) => {
      if (event.detail.cardId === card.id) {
        setShowDrillDown(event.detail.isOpen);
      }
    };

    window.addEventListener('cardDrillDown', handleCardDrillDown as EventListener);
    window.addEventListener('cardDrillDownStateChange', handleCardDrillDownStateChange as EventListener);

    return () => {
      window.removeEventListener('cardDrillDown', handleCardDrillDown as EventListener);
      window.removeEventListener('cardDrillDownStateChange', handleCardDrillDownStateChange as EventListener);
    };
  }, [card.id]);
  
  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case 'project-manager':
        // Single project view
        return {
          totalInspections: 45,
          openInspections: 8,
          closedInspections: 37,
          safetyScore: 91.2,
          atRiskItems: 3,
          incidentRate: 0.0,
          daysWithoutIncident: 124,
          oshaCompliance: 96.8,
          trainingCurrent: 94.2,
          tradeBreakdown: {
            concrete: 12,
            electrical: 8,
            flooring: 9,
            plumbing: 7,
            framing: 9
          },
          drillDown: {
            safestTrade: { name: "Concrete", score: 95.8 },
            riskiestTrade: { name: "Flooring", score: 86.3 },
            recentInspection: "Safety Audit - Electrical",
            lastIncident: "None",
            safetyTrend: "Excellent",
            upcomingAudits: 3
          }
        };
      case 'project-executive':
        // Limited to 7 projects
        return {
          totalInspections: 248,
          openInspections: 35,
          closedInspections: 213,
          safetyScore: 88.5,
          atRiskItems: 12,
          incidentRate: 0.8,
          daysWithoutIncident: 45,
          oshaCompliance: 92.3,
          trainingCurrent: 89.7,
          tradeBreakdown: {
            concrete: 52,
            electrical: 38,
            flooring: 42,
            plumbing: 35,
            framing: 38,
            steel: 28,
            hvac: 15
          },
          drillDown: {
            safestTrade: { name: "HVAC", score: 94.2 },
            riskiestTrade: { name: "Steel", score: 82.1 },
            recentInspection: "Safety Audit - Steel Work",
            lastIncident: "Minor - Hand injury",
            safetyTrend: "Good",
            upcomingAudits: 12
          }
        };
      default:
        // Executive - all projects
        return {
          totalInspections: 485,
          openInspections: 68,
          closedInspections: 417,
          safetyScore: 86.8,
          atRiskItems: 25,
          incidentRate: 1.2,
          daysWithoutIncident: 28,
          oshaCompliance: 88.9,
          trainingCurrent: 85.4,
          tradeBreakdown: {
            concrete: 85,
            electrical: 72,
            flooring: 68,
            plumbing: 58,
            framing: 62,
            steel: 48,
            hvac: 35,
            excavation: 28,
            roofing: 29
          },
          drillDown: {
            safestTrade: { name: "HVAC", score: 93.5 },
            riskiestTrade: { name: "Roofing", score: 79.8 },
            recentInspection: "Safety Audit - Roofing Work",
            lastIncident: "OSHA Recordable - Fall protection",
            safetyTrend: "Needs Improvement",
            upcomingAudits: 24
          }
        };
    }
  };

  const data = getDataByRole();

  const formatPercentage = (value: number | undefined) => {
    return `${(value ?? 0).toFixed(1)}%`;
  };

  const getSafetyScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 85) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getIncidentRateColor = (rate: number) => {
    if (rate === 0) return "text-green-600 dark:text-green-400";
    if (rate <= 1.0) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getRiskLevelColor = (count: number) => {
    if (count <= 5) return "text-green-600 dark:text-green-400";
    if (count <= 15) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const chartData = [
    { name: "Safety Score", value: data.safetyScore },
    { name: "Incident Rate", value: data.incidentRate },
    { name: "Days Without Incident", value: data.daysWithoutIncident },
    { name: "At Risk Items", value: data.atRiskItems },
    { name: "Safety Trend", value: data.safetyScore },
  ];

  return (
    <div className="h-full flex flex-col bg-transparent overflow-hidden relative">
      {/* Header Section with Badge */}
      <div className="flex-shrink-0 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 pb-3 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-2 mb-3">
          <Badge className="bg-gray-600 text-white border-gray-600 text-xs">
            <Shield className="w-3 h-3 mr-1" />
            Safety Monitor
          </Badge>
        </div>

        {/* Compact Stats */}
        <div className="grid grid-cols-3 gap-1 sm:gap-1.5 lg:gap-2">
          <div className="bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-1.5 text-center">
            <div className={`text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium ${getSafetyScoreColor(data.safetyScore)}`}>
              {formatPercentage(data.safetyScore)}
            </div>
            <div className="text-xs text-muted-foreground dark:text-gray-400">Safety Score</div>
          </div>
          <div className="bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-1.5 text-center">
            <div className={`text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium ${getIncidentRateColor(data.incidentRate)}`}>
              {data.incidentRate}
            </div>
            <div className="text-xs text-muted-foreground dark:text-gray-400">Incident Rate</div>
          </div>
          <div className="bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-1.5 text-center">
            <div className={`text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium ${getRiskLevelColor(data.atRiskItems)}`}>
              {data.atRiskItems}
            </div>
            <div className="text-xs text-muted-foreground dark:text-gray-400">At Risk</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 overflow-y-auto space-y-2">
        {/* Chart */}
        <div className="bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-1.5 sm:p-2 lg:p-2.5">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-foreground" />
            <span className="text-sm font-medium text-foreground">Safety Trend</span>
          </div>
          <div className="h-24 sm:h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Safety Performance */}
        <div className="bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-1.5 sm:p-2 lg:p-2.5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-foreground" />
            <span className="text-sm font-medium text-foreground">Safety Performance</span>
          </div>
          <div className="space-y-2">
            <Progress value={data.safetyScore} className="h-2" />
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Overall Score</span>
              <Badge className={`${getSafetyScoreColor(data.safetyScore) === 'text-green-600 dark:text-green-400' ? 'bg-green-100 text-green-700' : 
                getSafetyScoreColor(data.safetyScore) === 'text-yellow-600 dark:text-yellow-400' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                {formatPercentage(data.safetyScore)}
              </Badge>
            </div>
          </div>
        </div>

        {/* At Risk Items */}
        <div className="bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-1.5 sm:p-2 lg:p-2.5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-foreground" />
            <span className="text-sm font-medium text-foreground">Risk Assessment</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-gray-300 dark:bg-gray-700 rounded border border-gray-400 dark:border-gray-600">
              <div className="text-sm font-bold text-red-700 dark:text-red-400">{data.atRiskItems}</div>
              <div className="text-xs text-red-600 dark:text-red-300">At Risk Items</div>
            </div>
            <div className="text-center p-2 bg-gray-300 dark:bg-gray-700 rounded border border-gray-400 dark:border-gray-600">
              <Badge className={`${getRiskLevelColor(data.atRiskItems) === 'text-green-600 dark:text-green-400' ? 'bg-green-100 text-green-700' : 
                getRiskLevelColor(data.atRiskItems) === 'text-yellow-600 dark:text-yellow-400' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                {data.atRiskItems <= 5 ? 'Low Risk' : data.atRiskItems <= 15 ? 'Medium Risk' : 'High Risk'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Compliance Status */}
        <div className="bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-1.5 sm:p-2 lg:p-2.5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-foreground" />
            <span className="text-sm font-medium text-foreground">Compliance</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">OSHA Compliance</span>
              <span className={`font-medium ${data.oshaCompliance >= 95 ? 'text-green-600 dark:text-green-400' : 
                data.oshaCompliance >= 80 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatPercentage(data.oshaCompliance)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Training Current</span>
              <span className={`font-medium ${data.trainingCurrent >= 95 ? 'text-green-600 dark:text-green-400' : 
                data.trainingCurrent >= 80 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatPercentage(data.trainingCurrent)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Event-Driven Drill-Down Overlay */}
      {showDrillDown && (
        <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 flex flex-col justify-center text-white animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4" />
              <span className="font-semibold text-lg">Safety Analysis</span>
            </div>
            <button
              onClick={() => {
                setShowDrillDown(false);
                window.dispatchEvent(new CustomEvent('cardDrillDownStateChange', { 
                  detail: { cardId: card.id, isOpen: false } 
                }));
              }}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-200">Safest Trade:</span>
                <span className="font-medium text-green-300">{data.drillDown.safestTrade.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-200">Score:</span>
                <span className="font-medium">{formatPercentage(data.drillDown.safestTrade.score)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-200">Needs Focus:</span>
                <span className="font-medium text-red-300">{data.drillDown.riskiestTrade.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-200">Score:</span>
                <span className="font-medium">{formatPercentage(data.drillDown.riskiestTrade.score)}</span>
              </div>
            </div>

            <div className="mt-1.5 sm:mt-2 lg:mt-1 sm:mt-1.5 lg:mt-2 pt-3 border-t border-gray-700">
              <div className="text-xs font-medium text-gray-200 mb-2">Safety Status</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-300">Last Incident:</span>
                  <span className="font-medium">{data.drillDown.lastIncident}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Trend:</span>
                  <span className="font-medium">{data.drillDown.safetyTrend}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Upcoming Audits:</span>
                  <span className="font-medium text-gray-300">{data.drillDown.upcomingAudits} scheduled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 