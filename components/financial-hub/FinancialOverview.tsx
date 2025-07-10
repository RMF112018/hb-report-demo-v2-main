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
} from "recharts"

interface FinancialOverviewProps {
  userRole: string
  projectData: any
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

const expenseBreakdown = [
  { name: "Labor", value: 2350000, color: "#3b82f6" },
  { name: "Materials", value: 1950000, color: "#10b981" },
  { name: "Equipment", value: 750000, color: "#f59e0b" },
  { name: "Subcontractors", value: 1180000, color: "#ef4444" },
]

// Cost Control Data
const costControlCategories = [
  { id: 1, name: "Labor", budgeted: 2500000, actual: 2350000, progress: 94 },
  { id: 2, name: "Materials", budgeted: 1800000, actual: 1950000, progress: 108 },
  { id: 3, name: "Equipment", budgeted: 800000, actual: 750000, progress: 94 },
  { id: 4, name: "Subcontractors", budgeted: 1200000, actual: 1180000, progress: 98 },
]

// Payment Performance Analytics Data
const paymentPerformanceData = {
  onTimeApplications: {
    total: 24,
    onTime: 22,
    late: 2,
    percentage: 91.7,
  },
  approvalTimes: {
    averageDays: 3.2,
    pmApprovalAvg: 1.8,
    pxApprovalAvg: 1.4,
    trend: "improving",
  },
  paymentTimes: {
    approvalToPaymentAvg: 12.5,
    contractualDays: 15,
    variance: -2.5,
    trend: "ahead",
  },
  paymentCompliance: {
    totalPayments: 18,
    onTimePayments: 16,
    latePayments: 2,
    averageVariance: -1.2, // negative means early
    complianceRate: 88.9,
  },
  monthlyTrends: [
    { month: "Jan", onTimeApps: 95, avgApproval: 3.5, avgPayment: 13.2, compliance: 85 },
    { month: "Feb", onTimeApps: 88, avgApproval: 4.1, avgPayment: 14.8, compliance: 82 },
    { month: "Mar", onTimeApps: 92, avgApproval: 3.8, avgPayment: 11.5, compliance: 90 },
    { month: "Apr", onTimeApps: 96, avgApproval: 2.9, avgPayment: 10.8, compliance: 94 },
    { month: "May", onTimeApps: 89, avgApproval: 3.2, avgPayment: 12.1, compliance: 87 },
    { month: "Jun", onTimeApps: 94, avgApproval: 2.8, avgPayment: 11.9, compliance: 91 },
  ],
}

const recentPaymentActivity = [
  {
    type: "application_submitted",
    description: "Pay Application #024 submitted",
    amount: 285000,
    date: "2 hours ago",
    status: "on_time",
    daysFromDue: -2,
  },
  {
    type: "payment_received",
    description: "Payment for Application #022 received",
    amount: 195000,
    date: "1 day ago",
    status: "early",
    daysFromDue: -3,
  },
  {
    type: "approval_completed",
    description: "Application #023 approved by PX",
    amount: 167000,
    date: "2 days ago",
    status: "on_time",
    daysFromDue: 0,
  },
  {
    type: "payment_overdue",
    description: "Payment for Application #020 overdue",
    amount: 142000,
    date: "5 days ago",
    status: "late",
    daysFromDue: 5,
  },
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
 * - Recent financial activities
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

  return (
    <div className="space-y-6">
      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2" data-tour="overview-charts">
        {/* Cash Flow Chart */}
        <Card className="col-span-1" data-tour="overview-cash-flow-chart">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
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
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Inflow"
                />
                <Area
                  type="monotone"
                  dataKey="outflow"
                  stackId="2"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                  name="Outflow"
                />
                <Area
                  type="monotone"
                  dataKey="net"
                  stackId="3"
                  stroke="#3b82f6"
                  fill="#3b82f6"
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
              <BarChart3 className="h-5 w-5 text-green-600" />
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
                <Bar dataKey="budgeted" fill="#94a3b8" name="Budgeted" />
                <Bar dataKey="actual" fill="#3b82f6" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
