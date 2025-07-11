"use client"

import { useState } from "react"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  FileText,
  CheckCircle,
  BarChart3,
  PieChart,
  Target,
  Activity,
  Clock,
  Calendar,
  CheckCircle2,
  Gauge,
  LineChart,
  TimerIcon,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  ComposedChart,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts"

interface FinancialOverviewProps {
  userRole: string
  projectData: any
}

// HB Branded Colors
const HB_COLORS = {
  blue: "#0021A5", // RGB(0, 33, 165)
  orange: "#FA4616", // RGB(250, 70, 22)
  blueLight: "#1E40AF", // Lighter blue variant
  orangeLight: "#FB923C", // Lighter orange variant
  gray: "#6B7280",
  grayLight: "#9CA3AF",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
}

// Mock data for financial overview
const cashFlowData = [
  { month: "Jan", inflow: 450000, outflow: 380000, net: 70000 },
  { month: "Feb", inflow: 520000, outflow: 420000, net: 100000 },
  { month: "Mar", inflow: 480000, outflow: 450000, net: 30000 },
  { month: "Apr", inflow: 600000, outflow: 480000, net: 120000 },
  { month: "May", inflow: 580000, outflow: 520000, net: 60000 },
  { month: "Jun", inflow: 650000, outflow: 580000, net: 70000 },
]

const budgetData = [
  { category: "Labor", budgeted: 2500000, actual: 2350000, variance: -150000 },
  { category: "Materials", budgeted: 1800000, actual: 1950000, variance: 150000 },
  { category: "Equipment", budgeted: 800000, actual: 750000, variance: -50000 },
  { category: "Subcontractors", budgeted: 1200000, actual: 1180000, variance: -20000 },
]

// Updated with branded colors
const expenseBreakdown = [
  { name: "Labor", value: 2350000, color: HB_COLORS.blue },
  { name: "Materials", value: 1950000, color: HB_COLORS.orange },
  { name: "Equipment", value: 750000, color: HB_COLORS.blueLight },
  { name: "Subcontractors", value: 1180000, color: HB_COLORS.orangeLight },
]

// Cost Control Data with enhanced metrics
const costControlCategories = [
  {
    name: "Labor",
    budgeted: 2500000,
    actual: 2350000,
    progress: 94,
    status: "good",
    fill: HB_COLORS.blue,
  },
  {
    name: "Materials",
    budgeted: 1800000,
    actual: 1950000,
    progress: 108,
    status: "warning",
    fill: HB_COLORS.orange,
  },
  {
    name: "Equipment",
    budgeted: 800000,
    actual: 750000,
    progress: 94,
    status: "good",
    fill: HB_COLORS.blueLight,
  },
  {
    name: "Subcontractors",
    budgeted: 1200000,
    actual: 1180000,
    progress: 98,
    status: "good",
    fill: HB_COLORS.orangeLight,
  },
]

// Payment Performance Analytics Data
const paymentPerformanceData = {
  monthlyTrends: [
    { month: "Jan", onTimeApps: 95, avgApproval: 3.5, avgPayment: 13.2, compliance: 85 },
    { month: "Feb", onTimeApps: 88, avgApproval: 4.1, avgPayment: 14.8, compliance: 82 },
    { month: "Mar", onTimeApps: 92, avgApproval: 3.8, avgPayment: 11.5, compliance: 90 },
    { month: "Apr", onTimeApps: 96, avgApproval: 2.9, avgPayment: 10.8, compliance: 94 },
    { month: "May", onTimeApps: 89, avgApproval: 3.2, avgPayment: 12.1, compliance: 87 },
    { month: "Jun", onTimeApps: 94, avgApproval: 2.8, avgPayment: 11.9, compliance: 91 },
  ],
}

// Budget Variance Analysis Data
const budgetVarianceData = [
  { month: "Jan", variance: 50000, cumulative: 50000 },
  { month: "Feb", variance: -25000, cumulative: 25000 },
  { month: "Mar", variance: 75000, cumulative: 100000 },
  { month: "Apr", variance: -30000, cumulative: 70000 },
  { month: "May", variance: 45000, cumulative: 115000 },
  { month: "Jun", variance: -20000, cumulative: 95000 },
]

// Project Performance KPIs
const performanceKPIs = [
  { name: "Schedule", value: 85, color: HB_COLORS.blue },
  { name: "Budget", value: 92, color: HB_COLORS.orange },
  { name: "Quality", value: 88, color: HB_COLORS.blueLight },
  { name: "Safety", value: 96, color: HB_COLORS.success },
]

/**
 * Financial Hub Overview Component
 *
 * Provides a comprehensive financial overview of the project including:
 * - Key financial metrics and KPIs
 * - Cash flow visualization
 * - Budget vs actual analysis
 * - Expense breakdown
 * - Cost control analysis
 * - Payment performance trends
 * - Budget variance analysis
 * - Project performance metrics
 *
 * @param userRole - Current user role
 * @param projectData - Current project scope data
 */
export default function FinancialOverview({ userRole, projectData }: FinancialOverviewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")

  // Calculate key metrics
  const totalBudget = budgetData.reduce((sum, item) => sum + item.budgeted, 0)
  const totalActual = budgetData.reduce((sum, item) => sum + item.actual, 0)
  const totalVariance = totalBudget - totalActual
  const variancePercentage = ((totalVariance / totalBudget) * 100).toFixed(1)

  const currentCashFlow = cashFlowData[cashFlowData.length - 1]?.net || 0
  const avgCashFlow = cashFlowData.reduce((sum, item) => sum + item.net, 0) / cashFlowData.length

  // Cost Control Metrics
  const totalCostControlBudget = costControlCategories.reduce((sum, cat) => sum + cat.budgeted, 0)
  const totalCostControlActual = costControlCategories.reduce((sum, cat) => sum + cat.actual, 0)
  const costControlVariance = totalCostControlBudget - totalCostControlActual
  const avgProgress = costControlCategories.reduce((sum, cat) => sum + cat.progress, 0) / costControlCategories.length

  // Custom label function for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="space-y-6">
      {/* First Row: Existing Charts */}
      <div className="grid gap-6 lg:grid-cols-2" data-tour="overview-charts">
        {/* Cash Flow Chart */}
        <Card className="col-span-1" data-tour="overview-cash-flow-chart">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" style={{ color: HB_COLORS.blue }} />
              Cash Flow Trend
            </CardTitle>
            <CardDescription>Monthly cash inflow, outflow, and net position</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                <Tooltip
                  formatter={(value: number, name: string) => [`$${(value / 1000).toFixed(0)}K`, name]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="inflow"
                  stackId="1"
                  stroke={HB_COLORS.success}
                  fill={HB_COLORS.success}
                  fillOpacity={0.6}
                  name="Inflow"
                />
                <Area
                  type="monotone"
                  dataKey="outflow"
                  stackId="2"
                  stroke={HB_COLORS.error}
                  fill={HB_COLORS.error}
                  fillOpacity={0.6}
                  name="Outflow"
                />
                <Area
                  type="monotone"
                  dataKey="net"
                  stackId="3"
                  stroke={HB_COLORS.blue}
                  fill={HB_COLORS.blue}
                  fillOpacity={0.8}
                  name="Net Flow"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Budget vs Actual */}
        <Card className="col-span-1" data-tour="overview-budget-chart">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" style={{ color: HB_COLORS.orange }} />
              Budget vs Actual
            </CardTitle>
            <CardDescription>Comparison by cost category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="category" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(value: number, name: string) => [`$${(value / 1000).toFixed(0)}K`, name]} />
                <Bar dataKey="budgeted" fill={HB_COLORS.gray} name="Budgeted" />
                <Bar dataKey="actual" fill={HB_COLORS.blue} name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second Row: New Visualizations */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Expense Breakdown Pie Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" style={{ color: HB_COLORS.orange }} />
              Expense Breakdown
            </CardTitle>
            <CardDescription>Distribution of project expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`$${(value / 1000).toFixed(0)}K`, "Amount"]} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost Control Progress Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" style={{ color: HB_COLORS.blue }} />
              Cost Control Progress
            </CardTitle>
            <CardDescription>Budget utilization by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={costControlCategories}>
                <RadialBar background dataKey="progress" />
                <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" />
                <Tooltip formatter={(value: number) => [`${value}%`, "Progress"]} />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Performance Trends */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" style={{ color: HB_COLORS.orange }} />
              Payment Performance
            </CardTitle>
            <CardDescription>Monthly payment compliance trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={paymentPerformanceData.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="onTimeApps"
                  stroke={HB_COLORS.blue}
                  strokeWidth={2}
                  name="On-Time Apps (%)"
                />
                <Line
                  type="monotone"
                  dataKey="compliance"
                  stroke={HB_COLORS.orange}
                  strokeWidth={2}
                  name="Compliance (%)"
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Third Row: Additional Analysis */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Budget Variance Analysis */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" style={{ color: HB_COLORS.blue }} />
              Budget Variance Analysis
            </CardTitle>
            <CardDescription>Monthly variance and cumulative impact</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={budgetVarianceData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(value: number, name: string) => [`$${(value / 1000).toFixed(0)}K`, name]} />
                <Bar dataKey="variance" fill={HB_COLORS.orange} name="Monthly Variance" />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke={HB_COLORS.blue}
                  strokeWidth={2}
                  name="Cumulative Variance"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Performance KPIs */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" style={{ color: HB_COLORS.orange }} />
              Project Performance KPIs
            </CardTitle>
            <CardDescription>Key performance indicators across all areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceKPIs.map((kpi, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: kpi.color }} />
                    <span className="text-sm font-medium">{kpi.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={kpi.value} className="w-20" />
                    <span className="text-sm font-medium w-10">{kpi.value}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Performance</span>
                <Badge variant="outline" style={{ color: HB_COLORS.blue }}>
                  {Math.round(performanceKPIs.reduce((sum, kpi) => sum + kpi.value, 0) / performanceKPIs.length)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
