"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  Calculator,
  CreditCard,
  Building2,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Target,
  Award,
  FileText,
  Download,
  Upload,
} from "lucide-react"

interface PayrollData {
  currentCycle: {
    grossPay: number
    netPay: number
    totalDeductions: number
    headcount: number
    status: string
  }
  departmentCosts: {
    name: string
    totalCost: number
    employeeCount: number
    averageSalary: number
    overtimeCost: number
  }[]
  overtimeAnalysis: {
    totalHours: number
    regularHours: number
    overtimeHours: number
    overtimeCost: number
    averageOvertime: number
  }
  taxBreakdown: {
    federalTax: number
    stateTax: number
    socialSecurity: number
    medicare: number
    benefits: number
    other: number
  }
  payrollTrends: {
    month: string
    grossPay: number
    netPay: number
    headcount: number
  }[]
  expenseData: {
    totalExpenses: number
    approvedExpenses: number
    pendingExpenses: number
    averagePerEmployee: number
  }
}

const PayrollAnalytics: React.FC = () => {
  // Mock payroll data
  const payrollData: PayrollData = {
    currentCycle: {
      grossPay: 284750.0,
      netPay: 198925.0,
      totalDeductions: 85825.0,
      headcount: 47,
      status: "Processing",
    },
    departmentCosts: [
      { name: "Construction", totalCost: 125000, employeeCount: 15, averageSalary: 8333, overtimeCost: 18500 },
      { name: "Engineering", totalCost: 98000, employeeCount: 12, averageSalary: 8167, overtimeCost: 12400 },
      { name: "Project Management", totalCost: 85000, employeeCount: 10, averageSalary: 8500, overtimeCost: 9800 },
      { name: "Safety", totalCost: 65000, employeeCount: 8, averageSalary: 8125, overtimeCost: 7200 },
      { name: "Administration", totalCost: 45000, employeeCount: 6, averageSalary: 7500, overtimeCost: 3200 },
    ],
    overtimeAnalysis: {
      totalHours: 3640,
      regularHours: 3296,
      overtimeHours: 344,
      overtimeCost: 25800,
      averageOvertime: 7.3,
    },
    taxBreakdown: {
      federalTax: 56950.0,
      stateTax: 14237.5,
      socialSecurity: 17654.5,
      medicare: 4131.88,
      benefits: 28475.0,
      other: 2847.5,
    },
    payrollTrends: [
      { month: "Jan", grossPay: 265000, netPay: 185500, headcount: 45 },
      { month: "Feb", grossPay: 268000, netPay: 187600, headcount: 46 },
      { month: "Mar", grossPay: 272000, netPay: 190400, headcount: 46 },
      { month: "Apr", grossPay: 275000, netPay: 192500, headcount: 47 },
      { month: "May", grossPay: 280000, netPay: 196000, headcount: 47 },
      { month: "Jun", grossPay: 284750, netPay: 198925, headcount: 47 },
    ],
    expenseData: {
      totalExpenses: 45620.0,
      approvedExpenses: 42350.0,
      pendingExpenses: 3270.0,
      averagePerEmployee: 970.64,
    },
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "text-yellow-600 dark:text-yellow-400"
      case "completed":
        return "text-green-600 dark:text-green-400"
      case "pending":
        return "text-orange-600 dark:text-orange-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return <Activity className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <>
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Gross Pay</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {formatCurrency(payrollData.currentCycle.grossPay)}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">Current cycle</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Net Pay</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {formatCurrency(payrollData.currentCycle.netPay)}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {((payrollData.currentCycle.netPay / payrollData.currentCycle.grossPay) * 100).toFixed(1)}% of gross
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Overtime Cost</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {formatCurrency(payrollData.overtimeAnalysis.overtimeCost)}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  {payrollData.overtimeAnalysis.overtimeHours} hours
                </p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Payroll Status</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {payrollData.currentCycle.headcount}
                  </p>
                  <div className={`flex items-center gap-1 ${getStatusColor(payrollData.currentCycle.status)}`}>
                    {getStatusIcon(payrollData.currentCycle.status)}
                    <span className="text-xs">{payrollData.currentCycle.status}</span>
                  </div>
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400">Employees</p>
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Costs */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5" />
            Department Payroll Costs
          </CardTitle>
          <CardDescription>Total payroll costs and overtime by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payrollData.departmentCosts.map((dept, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium">{dept.name}</span>
                  <span className="text-sm text-muted-foreground">({dept.employeeCount} employees)</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(dept.totalCost)}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(dept.averageSalary)}</p>
                    <p className="text-xs text-muted-foreground">Avg Salary</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600">{formatCurrency(dept.overtimeCost)}</p>
                    <p className="text-xs text-muted-foreground">OT Cost</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tax Breakdown & Expense Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5" />
              Tax & Deductions
            </CardTitle>
            <CardDescription>Current cycle breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Federal Tax</span>
                <span className="text-sm font-medium">{formatCurrency(payrollData.taxBreakdown.federalTax)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">State Tax</span>
                <span className="text-sm font-medium">{formatCurrency(payrollData.taxBreakdown.stateTax)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Social Security</span>
                <span className="text-sm font-medium">{formatCurrency(payrollData.taxBreakdown.socialSecurity)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Medicare</span>
                <span className="text-sm font-medium">{formatCurrency(payrollData.taxBreakdown.medicare)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Benefits</span>
                <span className="text-sm font-medium">{formatCurrency(payrollData.taxBreakdown.benefits)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Other</span>
                <span className="text-sm font-medium">{formatCurrency(payrollData.taxBreakdown.other)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Deductions</span>
                  <span className="text-sm font-bold">{formatCurrency(payrollData.currentCycle.totalDeductions)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Expense Analysis
            </CardTitle>
            <CardDescription>Employee expense tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Expenses</span>
                <span className="text-sm font-medium">{formatCurrency(payrollData.expenseData.totalExpenses)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Approved</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {formatCurrency(payrollData.expenseData.approvedExpenses)}
                  </span>
                  <Badge variant="default" className="text-xs">
                    {((payrollData.expenseData.approvedExpenses / payrollData.expenseData.totalExpenses) * 100).toFixed(
                      1
                    )}
                    %
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{formatCurrency(payrollData.expenseData.pendingExpenses)}</span>
                  <Badge variant="secondary" className="text-xs">
                    {((payrollData.expenseData.pendingExpenses / payrollData.expenseData.totalExpenses) * 100).toFixed(
                      1
                    )}
                    %
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg per Employee</span>
                <span className="text-sm font-medium">
                  {formatCurrency(payrollData.expenseData.averagePerEmployee)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default PayrollAnalytics
