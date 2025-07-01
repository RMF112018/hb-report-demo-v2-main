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
  Users,
  HandCoins,
  Timer,
  Zap,
} from "lucide-react";

// Import actual cash flow data
import cashFlowDataImport from "@/data/mock/financial/cash-flow.json";

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

// Use imported cash flow data
const cashFlowData = cashFlowDataImport;

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

// Payment timing analysis metrics
const paymentTimingMetrics = {
  averageOwnerDelayDays: 19,
  averageVendorPaymentLagDays: 11,
  onTimePaymentRate: 82.5 // percentage
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
  const projectCashFlow = cashFlowData.projects.find(p => p.project_id === 2525840) || cashFlowData.projects[0];
  const summary = projectCashFlow.cashFlowData.summary;
  const monthlyData = projectCashFlow.cashFlowData.monthlyData;

  // Calculate Owner vs Vendor comparison data
  const ownerVendorComparison = useMemo(() => {
    return monthlyData.map(month => {
      const ownerPayments = month.inflows.ownerPayments;
      const vendorSubPayments = month.outflows.subcontractorPayments + month.outflows.materialCosts;
      const netDelta = ownerPayments - vendorSubPayments;
      const percentVariance = vendorSubPayments > 0 ? ((netDelta / vendorSubPayments) * 100) : 0;
      
      return {
        month: month.month,
        ownerPayments,
        vendorSubPayments,
        netDelta,
        percentVariance,
        isSignificantSpread: Math.abs(percentVariance) > 20
      };
    });
  }, [monthlyData]);

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
            {/* 1. Owner vs Vendor Payment Trends (Chart) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Owner vs Vendor Payment Trends
                </CardTitle>
                <CardDescription>Visual comparison of payment flows over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={ownerVendorComparison}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value: number, name: string) => [`$${(value / 1000000).toFixed(2)}M`, name]} />
                    <Bar dataKey="ownerPayments" fill="#10b981" name="Owner Payments" />
                    <Bar dataKey="vendorSubPayments" fill="#ef4444" name="Vendor/Sub Payments" />
                    <Line 
                      type="monotone" 
                      dataKey="netDelta" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      name="Net Delta"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* 2. Payment Timing Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-orange-600" />
                    Payment Timing Metrics
                  </CardTitle>
                  <CardDescription>Average processing and delay times</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                          {paymentTimingMetrics.averageOwnerDelayDays}
                        </div>
                        <p className="text-sm text-muted-foreground">Days</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Avg Owner Payment Delay
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                          {paymentTimingMetrics.averageVendorPaymentLagDays}
                        </div>
                        <p className="text-sm text-muted-foreground">Days</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Avg Vendor Payment Lag
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {paymentTimingMetrics.onTimePaymentRate}%
                      </div>
                      <p className="text-sm text-muted-foreground">On-Time Payment Rate</p>
                      <Progress value={paymentTimingMetrics.onTimePaymentRate} className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 3. Payment Performance Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-indigo-600" />
                    Payment Performance Insights
                  </CardTitle>
                  <CardDescription>Key insights and recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <HandCoins className="h-5 w-5 text-indigo-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Cash Flow Gap</p>
                        <p className="text-xs text-indigo-700 dark:text-indigo-300">
                          {paymentTimingMetrics.averageOwnerDelayDays - paymentTimingMetrics.averageVendorPaymentLagDays} day gap between receiving owner payments and paying vendors
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-indigo-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Payment Efficiency</p>
                        <p className="text-xs text-indigo-700 dark:text-indigo-300">
                          {paymentTimingMetrics.onTimePaymentRate >= 80 ? 'Good' : 'Needs Improvement'} payment performance with {paymentTimingMetrics.onTimePaymentRate}% on-time rate
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-indigo-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Working Capital Impact</p>
                        <p className="text-xs text-indigo-700 dark:text-indigo-300">
                          Payment timing affects working capital by approximately {formatCurrency(workingCapital * 0.15)} monthly
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 4. Monthly Owner vs Vendor Payments Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Monthly Owner vs Vendor Payments
                </CardTitle>
                <CardDescription>
                  Comparison of owner payments received vs vendor/subcontractor payments made
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-medium">Month</th>
                        <th className="text-right p-3 font-medium">Owner Payments</th>
                        <th className="text-right p-3 font-medium">Vendor/Sub Payments</th>
                        <th className="text-right p-3 font-medium">Net Delta</th>
                        <th className="text-right p-3 font-medium">% Variance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ownerVendorComparison.map((row, index) => (
                        <tr 
                          key={index} 
                          className={`border-b border-border/50 ${
                            row.isSignificantSpread ? 'bg-amber-50 dark:bg-amber-950/20' : ''
                          }`}
                        >
                          <td className="p-3 font-medium">{row.month}</td>
                          <td className="p-3 text-right text-green-600 dark:text-green-400">
                            {formatCurrency(row.ownerPayments)}
                          </td>
                          <td className="p-3 text-right text-red-600 dark:text-red-400">
                            {formatCurrency(row.vendorSubPayments)}
                          </td>
                          <td className={`p-3 text-right font-medium ${
                            row.netDelta >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {row.netDelta >= 0 ? '+' : ''}{formatCurrency(row.netDelta)}
                          </td>
                          <td className={`p-3 text-right font-medium ${
                            row.percentVariance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {row.percentVariance >= 0 ? '+' : ''}{row.percentVariance.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(ownerVendorComparison.reduce((sum, row) => sum + row.ownerPayments, 0))}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Owner Payments</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(ownerVendorComparison.reduce((sum, row) => sum + row.vendorSubPayments, 0))}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Vendor/Sub Payments</p>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      ownerVendorComparison.reduce((sum, row) => sum + row.netDelta, 0) >= 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatCurrency(ownerVendorComparison.reduce((sum, row) => sum + row.netDelta, 0))}
                    </div>
                    <p className="text-sm text-muted-foreground">Net Delta</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rest remains unchanged - Cash Flow Performance Chart */}
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