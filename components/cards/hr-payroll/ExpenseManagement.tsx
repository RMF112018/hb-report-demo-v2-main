"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Users,
  Building2,
  FileText,
  Eye,
  Activity,
  BarChart3,
  PieChart,
  Download,
  Upload,
  Filter,
} from "lucide-react"

interface ExpenseData {
  monthlyOverview: {
    totalExpenses: number
    approvedExpenses: number
    pendingExpenses: number
    rejectedExpenses: number
    averagePerEmployee: number
    trend: number
  }
  expenseCategories: {
    category: string
    totalAmount: number
    count: number
    averageAmount: number
    percentage: number
  }[]
  approvalStatus: {
    status: string
    count: number
    amount: number
    percentage: number
  }[]
  departmentExpenses: {
    department: string
    totalAmount: number
    employeeCount: number
    averagePerEmployee: number
    trend: number
  }[]
  expenseTrends: {
    month: string
    totalAmount: number
    approvedAmount: number
    pendingAmount: number
    employeeCount: number
  }[]
}

const ExpenseManagement: React.FC = () => {
  // Mock expense data
  const expenseData: ExpenseData = {
    monthlyOverview: {
      totalExpenses: 45620.0,
      approvedExpenses: 42350.0,
      pendingExpenses: 3270.0,
      rejectedExpenses: 0.0,
      averagePerEmployee: 970.64,
      trend: 5.2,
    },
    expenseCategories: [
      { category: "Travel & Transportation", totalAmount: 15680.0, count: 234, averageAmount: 67.0, percentage: 34.4 },
      { category: "Meals & Entertainment", totalAmount: 12340.0, count: 456, averageAmount: 27.1, percentage: 27.1 },
      { category: "Office Supplies", totalAmount: 5670.0, count: 89, averageAmount: 63.7, percentage: 12.4 },
      { category: "Training & Development", totalAmount: 4560.0, count: 67, averageAmount: 68.1, percentage: 10.0 },
      { category: "Equipment & Tools", totalAmount: 4230.0, count: 45, averageAmount: 94.0, percentage: 9.3 },
      { category: "Other", totalAmount: 3140.0, count: 78, averageAmount: 40.3, percentage: 6.9 },
    ],
    approvalStatus: [
      { status: "Approved", count: 567, amount: 42350.0, percentage: 92.8 },
      { status: "Pending", count: 45, amount: 3270.0, percentage: 7.2 },
      { status: "Rejected", count: 0, amount: 0.0, percentage: 0.0 },
    ],
    departmentExpenses: [
      { department: "Construction", totalAmount: 18900.0, employeeCount: 234, averagePerEmployee: 80.8, trend: 3.2 },
      { department: "Engineering", totalAmount: 12340.0, employeeCount: 156, averagePerEmployee: 79.1, trend: -1.5 },
      {
        department: "Project Management",
        totalAmount: 9870.0,
        employeeCount: 123,
        averagePerEmployee: 80.2,
        trend: 2.8,
      },
      { department: "Safety", totalAmount: 3450.0, employeeCount: 45, averagePerEmployee: 76.7, trend: 1.9 },
      { department: "Administration", totalAmount: 1060.0, employeeCount: 23, averagePerEmployee: 46.1, trend: -0.8 },
    ],
    expenseTrends: [
      { month: "Jan", totalAmount: 42350, approvedAmount: 39890, pendingAmount: 2460, employeeCount: 47 },
      { month: "Feb", totalAmount: 44560, approvedAmount: 41230, pendingAmount: 3330, employeeCount: 47 },
      { month: "Mar", totalAmount: 43210, approvedAmount: 40120, pendingAmount: 3090, employeeCount: 47 },
      { month: "Apr", totalAmount: 45620, approvedAmount: 42350, pendingAmount: 3270, employeeCount: 47 },
    ],
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-green-600 dark:text-green-400"
    if (trend < 0) return "text-red-600 dark:text-red-400"
    return "text-gray-600 dark:text-gray-400"
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4" />
    if (trend < 0) return <TrendingDown className="h-4 w-4" />
    return <Activity className="h-4 w-4" />
  }

  return (
    <>
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Expenses</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {formatCurrency(expenseData.monthlyOverview.totalExpenses)}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {expenseData.monthlyOverview.trend > 0 ? "+" : ""}
                  {expenseData.monthlyOverview.trend}% from last month
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Approved Expenses</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {formatCurrency(expenseData.monthlyOverview.approvedExpenses)}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {(
                    (expenseData.monthlyOverview.approvedExpenses / expenseData.monthlyOverview.totalExpenses) *
                    100
                  ).toFixed(1)}
                  % approval rate
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Pending Expenses</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {formatCurrency(expenseData.monthlyOverview.pendingExpenses)}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  {expenseData.approvalStatus.find((s) => s.status === "Pending")?.count || 0} submissions
                </p>
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Avg per Employee</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {formatCurrency(expenseData.monthlyOverview.averagePerEmployee)}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">Monthly average</p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expense Categories */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <PieChart className="h-5 w-5" />
            Expense Categories
          </CardTitle>
          <CardDescription>Monthly expense breakdown by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {expenseData.expenseCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium">{category.category}</span>
                  <span className="text-sm text-muted-foreground">({category.count})</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(category.totalAmount)}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(category.averageAmount)}</p>
                    <p className="text-xs text-muted-foreground">Average</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{category.percentage}%</p>
                    <p className="text-xs text-muted-foreground">Share</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Expenses & Approval Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5" />
              Department Expenses
            </CardTitle>
            <CardDescription>Expense distribution by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenseData.departmentExpenses.map((dept, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium">{dept.department}</span>
                    <span className="text-sm text-muted-foreground">({dept.employeeCount})</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(dept.totalAmount)}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(dept.averagePerEmployee)}</p>
                      <p className="text-xs text-muted-foreground">Per Employee</p>
                    </div>
                    <div className={`flex items-center gap-1 ${getTrendColor(dept.trend)}`}>
                      {getTrendIcon(dept.trend)}
                      <span className="text-sm font-medium">
                        {dept.trend > 0 ? "+" : ""}
                        {dept.trend}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Approval Status
            </CardTitle>
            <CardDescription>Expense approval breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenseData.approvalStatus.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium">{status.status}</span>
                    <span className="text-sm text-muted-foreground">({status.count})</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(status.amount)}</p>
                      <p className="text-xs text-muted-foreground">Amount</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{status.percentage}%</p>
                      <p className="text-xs text-muted-foreground">Share</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default ExpenseManagement
