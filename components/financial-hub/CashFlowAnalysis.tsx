"use client";

import { useState, useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Droplets,
  PieChart as PieChartIcon,
  BarChart3,
  Target,
  Activity,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  Building2,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FullscreenToggle } from "@/components/ui/fullscreen-toggle";
import { CollapseWrapper } from "@/components/ui/collapse-wrapper";
import { useFinancialHubStore } from "@/hooks/use-financial-hub-store";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart,
} from "recharts";

interface CashFlowAnalysisProps {
  userRole: string;
  projectData: any;
}

// Mock cash flow data - in production this would come from the API
const cashFlowData = {
  projects: [
    {
      project_id: 2525840,
      name: "Palm Beach Luxury Estate",
      cashFlowData: {
        summary: {
          totalInflows: 53476271.19,
          totalOutflows: 45261264.55,
          netCashFlow: 8215006.64,
          peakCashRequirement: 132675.42,
          cashFlowAtRisk: 0,
          workingCapital: 9732503.32,
          lastUpdated: "2025-06-24T07:24:59Z"
        },
        monthlyData: [
          {
            month: "2024-06",
            inflows: { ownerPayments: 133320.63, loans: 0.0, changeOrders: 0.0, retentionRelease: 0.0, other: 14813.4, total: 148134.03 },
            outflows: { subcontractorPayments: 112323.78, materialCosts: 84242.84, laborCosts: 42121.42, equipmentCosts: 28080.95, overhead: 14040.47, other: -0.01, total: 280809.45 },
            netCashFlow: -132675.42,
            cumulativeCashFlow: -132675.42,
            workingCapital: 5558662.29,
            retentionHeld: 6666.03,
            forecastAccuracy: 0.86
          },
          {
            month: "2024-07",
            inflows: { ownerPayments: 316085.54, loans: 0.0, changeOrders: 0.0, retentionRelease: 0.0, other: 35120.61, total: 351206.15 },
            outflows: { subcontractorPayments: 99730.83, materialCosts: 74798.12, laborCosts: 37399.06, equipmentCosts: 24932.71, overhead: 12466.35, other: 0.01, total: 249327.08 },
            netCashFlow: 101879.07,
            cumulativeCashFlow: -30796.35,
            workingCapital: 5609601.83,
            retentionHeld: 22470.31,
            forecastAccuracy: 0.92
          },
          {
            month: "2024-08",
            inflows: { ownerPayments: 617104.99, loans: 0.0, changeOrders: 0.0, retentionRelease: 0.0, other: 68567.22, total: 685672.21 },
            outflows: { subcontractorPayments: 189872.59, materialCosts: 142404.44, laborCosts: 71202.22, equipmentCosts: 47468.15, overhead: 23734.07, other: 0.01, total: 474681.48 },
            netCashFlow: 210990.73,
            cumulativeCashFlow: 180194.38,
            workingCapital: 5715097.19,
            retentionHeld: 53325.56,
            forecastAccuracy: 0.92
          },
          {
            month: "2024-09",
            inflows: { ownerPayments: 825770.46, loans: 0.0, changeOrders: 0.0, retentionRelease: 0.0, other: 91752.27, total: 917522.73 },
            outflows: { subcontractorPayments: 284976.9, materialCosts: 213732.67, laborCosts: 106866.34, equipmentCosts: 71244.22, overhead: 35622.11, other: 0.0, total: 712442.24 },
            netCashFlow: 205080.49,
            cumulativeCashFlow: 385274.87,
            workingCapital: 5817637.44,
            retentionHeld: 94614.08,
            forecastAccuracy: 0.93
          },
          {
            month: "2024-10",
            inflows: { ownerPayments: 987607.7, loans: 0.0, changeOrders: 0.0, retentionRelease: 0.0, other: 109734.19, total: 1097341.89 },
            outflows: { subcontractorPayments: 409038.98, materialCosts: 306779.24, laborCosts: 153389.62, equipmentCosts: 102259.75, overhead: 51129.87, other: 0.0, total: 1022597.46 },
            netCashFlow: 74744.43,
            cumulativeCashFlow: 460019.3,
            workingCapital: 5855009.65,
            retentionHeld: 143994.47,
            forecastAccuracy: 0.94
          },
          {
            month: "2024-11",
            inflows: { ownerPayments: 1140582.92, loans: 0.0, changeOrders: 10595.76, retentionRelease: 0.0, other: 116135.67, total: 1267314.35 },
            outflows: { subcontractorPayments: 453275.24, materialCosts: 339956.43, laborCosts: 169978.21, equipmentCosts: 113318.81, overhead: 56659.41, other: 0.0, total: 1133188.1 },
            netCashFlow: 134126.25,
            cumulativeCashFlow: 594145.55,
            workingCapital: 5922072.78,
            retentionHeld: 201023.62,
            forecastAccuracy: 0.94
          }
        ]
      }
    }
  ]
};

// Advanced analytics data for insights
const advancedMetrics = {
  forecastAccuracy: {
    current: 0.92,
    trend: "improving",
    target: 0.95
  },
  liquidityRatio: 4.2,
  daysOfCashOnHand: 45,
  burnRate: 850000,
  riskFactors: [
    { factor: "Seasonal Fluctuations", impact: "medium", probability: 0.6 },
    { factor: "Payment Delays", impact: "high", probability: 0.3 },
    { factor: "Cost Overruns", impact: "medium", probability: 0.4 }
  ]
};

const inflowBreakdown = [
  { name: "Owner Payments", value: 4719691.76, color: "#3b82f6", percentage: 88.2 },
  { name: "Change Orders", value: 10595.76, color: "#10b981", percentage: 0.2 },
  { name: "Other", value: 614351.98, color: "#f59e0b", percentage: 11.6 },
];

const outflowBreakdown = [
  { name: "Subcontractors", value: 2023661.32, color: "#ef4444", percentage: 45.2 },
  { name: "Materials", value: 1591761.76, color: "#8b5cf6", percentage: 35.6 },
  { name: "Labor", value: 795880.88, color: "#06b6d4", percentage: 17.8 },
  { name: "Equipment", value: 530587.25, color: "#f97316", percentage: 11.9 },
  { name: "Overhead", value: 265293.62, color: "#84cc16", percentage: 5.9 },
];

type ViewMode = "overview" | "inflow" | "outflow" | "forecast";

export default function CashFlowAnalysis({ userRole, projectData }: CashFlowAnalysisProps) {
  const { isFullscreen, toggleFullscreen } = useFinancialHubStore();
  
  const [viewMode, setViewMode] = useState<ViewMode>("overview");

  // Get project-specific data
  const projectCashFlow = cashFlowData.projects[0]; // In production, filter by project
  const summary = projectCashFlow.cashFlowData.summary;
  const monthlyData = projectCashFlow.cashFlowData.monthlyData;

  // Calculate key metrics
  const totalInflows = summary.totalInflows;
  const totalOutflows = summary.totalOutflows;
  const netCashFlow = summary.netCashFlow;
  const workingCapital = summary.workingCapital;
  const peakRequirement = summary.peakCashRequirement;

  // Calculate performance metrics
  const cashFlowMargin = ((netCashFlow / totalInflows) * 100);
  const averageMonthlyInflow = totalInflows / monthlyData.length;
  const averageMonthlyOutflow = totalOutflows / monthlyData.length;
  const forecastAccuracy = monthlyData.reduce((sum, m) => sum + m.forecastAccuracy, 0) / monthlyData.length;

  // Transform data for charts
  const chartData = monthlyData.map(month => ({
    month: month.month,
    inflows: month.inflows.total,
    outflows: month.outflows.total,
    net: month.netCashFlow,
    cumulative: month.cumulativeCashFlow,
    workingCapital: month.workingCapital
  }));

  const ViewToggle = () => (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      {[
        { key: "overview", label: "Overview", icon: BarChart3 },
        { key: "inflow", label: "Inflows", icon: TrendingUp },
        { key: "outflow", label: "Outflows", icon: TrendingDown },
        { key: "forecast", label: "Forecast", icon: Calendar }
      ].map((item) => (
        <Button
          key={item.key}
          variant={viewMode === item.key ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode(item.key as ViewMode)}
          className="flex items-center gap-2"
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Button>
      ))}
    </div>
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const renderContent = () => {
    switch (viewMode) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Cash Flow Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-600" />
                  Cash Flow Performance
                </CardTitle>
                <CardDescription>Monthly cash flow analysis and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [`$${(value / 1000000).toFixed(2)}M`, name]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="inflows" 
                      stackId="1"
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.6}
                      name="Inflows"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="outflows" 
                      stackId="2"
                      stroke="#ef4444" 
                      fill="#ef4444" 
                      fillOpacity={0.6}
                      name="Outflows"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="net" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Net Cash Flow"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Working Capital Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-purple-600" />
                    Working Capital
                  </CardTitle>
                  <CardDescription>Working capital trend analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                      <Tooltip formatter={(value: number, name: string) => [`$${(value / 1000000).toFixed(2)}M`, name]} />
                      <Line 
                        type="monotone" 
                        dataKey="workingCapital" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        name="Working Capital"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>Key cash flow performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cash Flow Margin</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={cashFlowMargin >= 10 ? "default" : "secondary"}>
                          {cashFlowMargin.toFixed(1)}%
                        </Badge>
                        {cashFlowMargin >= 10 ? 
                          <TrendingUp className="h-4 w-4 text-green-600" /> :
                          <TrendingDown className="h-4 w-4 text-yellow-600" />
                        }
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Forecast Accuracy</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={forecastAccuracy >= 0.9 ? "default" : "secondary"}>
                          {(forecastAccuracy * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Liquidity Ratio</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={advancedMetrics.liquidityRatio >= 2 ? "default" : "destructive"}>
                          {advancedMetrics.liquidityRatio.toFixed(1)}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Days Cash on Hand</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={advancedMetrics.daysOfCashOnHand >= 30 ? "default" : "destructive"}>
                          {advancedMetrics.daysOfCashOnHand} days
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "inflow":
        return (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Inflow Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-green-600" />
                    Inflow Sources
                  </CardTitle>
                  <CardDescription>Revenue stream breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={inflowBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {inflowBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number, name: string) => [`$${(value / 1000000).toFixed(1)}M`, name]} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {inflowBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span>{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(item.value)}</div>
                          <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Inflow Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Monthly Inflows
                  </CardTitle>
                  <CardDescription>Revenue trend over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
                      <Tooltip formatter={(value: number, name: string) => [`$${(value / 1000000).toFixed(2)}M`, name]} />
                      <Area 
                        type="monotone" 
                        dataKey="inflows" 
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.6}
                        name="Inflows"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "outflow":
        return (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Outflow Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-red-600" />
                    Expense Categories
                  </CardTitle>
                  <CardDescription>Cost breakdown analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={outflowBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {outflowBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number, name: string) => [`$${(value / 1000000).toFixed(1)}M`, name]} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {outflowBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span>{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(item.value)}</div>
                          <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Outflow Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    Monthly Outflows
                  </CardTitle>
                  <CardDescription>Expense trend over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
                      <Tooltip formatter={(value: number, name: string) => [`$${(value / 1000000).toFixed(2)}M`, name]} />
                      <Area 
                        type="monotone" 
                        dataKey="outflows" 
                        stroke="#ef4444" 
                        fill="#ef4444" 
                        fillOpacity={0.6}
                        name="Outflows"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "forecast":
        return (
          <div className="space-y-6">
            {/* Cumulative Cash Flow */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Cash Flow Forecast
                </CardTitle>
                <CardDescription>Projected cash flow performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value: number, name: string) => [`$${(value / 1000000).toFixed(2)}M`, name]} />
                    <Area 
                      type="monotone" 
                      dataKey="cumulative" 
                      stroke="#8b5cf6" 
                      fill="#8b5cf6" 
                      fillOpacity={0.3}
                      name="Cumulative Cash Flow"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="net" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Net Cash Flow"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Risk Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Cash Flow Risks
                  </CardTitle>
                  <CardDescription>Potential risks and mitigation strategies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {advancedMetrics.riskFactors.map((risk, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{risk.factor}</span>
                          <Badge variant={risk.impact === "high" ? "destructive" : risk.impact === "medium" ? "secondary" : "default"}>
                            {risk.impact}
                          </Badge>
                        </div>
                        <Progress value={risk.probability * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {(risk.probability * 100).toFixed(0)}% probability
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Forecast Accuracy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Forecast Performance
                  </CardTitle>
                  <CardDescription>Cash flow forecasting accuracy</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {(advancedMetrics.forecastAccuracy.current * 100).toFixed(1)}%
                      </div>
                      <p className="text-sm text-muted-foreground">Current Accuracy</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-semibold">
                          {(advancedMetrics.forecastAccuracy.target * 100).toFixed(0)}%
                        </div>
                        <p className="text-xs text-muted-foreground">Target</p>
                      </div>
                      <div className="text-center">
                        <Badge variant="default" className="capitalize">
                          {advancedMetrics.forecastAccuracy.trend}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">Trend</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-6 ${isFullscreen.cashFlow ? 'fixed inset-0 z-[9999] bg-background p-6 overflow-auto' : ''}`}>
      {/* Controls Bar */}
      <div className="flex items-center justify-between">
        <ViewToggle />
        <FullscreenToggle
          isFullscreen={isFullscreen.cashFlow}
          onToggle={() => toggleFullscreen('cashFlow')}
        />
      </div>



      {/* Collapsible HBI Intelligence */}
      <CollapseWrapper
        title="HBI Cash Flow Intelligence"
        subtitle="AI-powered cash flow insights and analysis"
        defaultCollapsed={false}
      >
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Liquidity Status</p>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300">
                    Strong liquidity ratio of {advancedMetrics.liquidityRatio} with {advancedMetrics.daysOfCashOnHand} days cash on hand
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Activity className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Forecast Accuracy</p>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300">
                    {(forecastAccuracy * 100).toFixed(1)}% accuracy with {advancedMetrics.forecastAccuracy.trend} trend
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Banknote className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Burn Rate</p>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300">
                    Current burn rate: {formatCurrency(advancedMetrics.burnRate)}/month
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CollapseWrapper>

      {/* Main Content Area */}
      {renderContent()}
    </div>
  );
} 