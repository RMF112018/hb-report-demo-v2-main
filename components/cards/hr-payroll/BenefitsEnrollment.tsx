"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Heart,
  Eye,
  Stethoscope,
  CreditCard,
  Users,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  Building2,
  FileText,
  UserCheck,
  UserX,
  Award,
  Shield,
  Activity,
  BarChart3,
  PieChart,
} from "lucide-react"

interface BenefitsData {
  enrollmentRates: {
    health: number
    dental: number
    vision: number
    retirement: number
    overall: number
  }
  planDistribution: {
    healthPlans: {
      name: string
      enrolled: number
      percentage: number
      cost: number
    }[]
    dentalPlans: {
      name: string
      enrolled: number
      percentage: number
      cost: number
    }[]
    visionPlans: {
      name: string
      enrolled: number
      percentage: number
      cost: number
    }[]
  }
  costAnalysis: {
    totalMonthlyCost: number
    employerContribution: number
    employeeContribution: number
    averagePerEmployee: number
    costTrend: number
  }
  eligibilityStatus: {
    eligible: number
    enrolled: number
    pending: number
    declined: number
    ineligible: number
  }
  enrollmentTrends: {
    month: string
    newEnrollments: number
    cancellations: number
    netChange: number
  }[]
}

const BenefitsEnrollment: React.FC = () => {
  // Mock benefits data
  const benefitsData: BenefitsData = {
    enrollmentRates: {
      health: 89.2,
      dental: 76.8,
      vision: 68.4,
      retirement: 82.1,
      overall: 79.1,
    },
    planDistribution: {
      healthPlans: [
        { name: "Premium Health Plan", enrolled: 456, percentage: 65.2, cost: 450 },
        { name: "Standard Health Plan", enrolled: 243, percentage: 34.8, cost: 350 },
      ],
      dentalPlans: [{ name: "Comprehensive Dental", enrolled: 567, percentage: 100, cost: 120 }],
      visionPlans: [{ name: "Vision Plus", enrolled: 478, percentage: 84.3, cost: 80 }],
    },
    costAnalysis: {
      totalMonthlyCost: 284750,
      employerContribution: 227800,
      employeeContribution: 56950,
      averagePerEmployee: 228.5,
      costTrend: 3.2,
    },
    eligibilityStatus: {
      eligible: 1247,
      enrolled: 986,
      pending: 45,
      declined: 23,
      ineligible: 193,
    },
    enrollmentTrends: [
      { month: "Jan", newEnrollments: 23, cancellations: 5, netChange: 18 },
      { month: "Feb", newEnrollments: 18, cancellations: 3, netChange: 15 },
      { month: "Mar", newEnrollments: 25, cancellations: 7, netChange: 18 },
      { month: "Apr", newEnrollments: 21, cancellations: 4, netChange: 17 },
      { month: "May", newEnrollments: 28, cancellations: 6, netChange: 22 },
      { month: "Jun", newEnrollments: 24, cancellations: 5, netChange: 19 },
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
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Overall Enrollment</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {benefitsData.enrollmentRates.overall}%
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">+2.1% from last month</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Health Plans</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {benefitsData.enrollmentRates.health}%
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">699 employees enrolled</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Heart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Monthly Cost</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {formatCurrency(benefitsData.costAnalysis.totalMonthlyCost)}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  {formatCurrency(benefitsData.costAnalysis.averagePerEmployee)} per employee
                </p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Eligible Employees</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {benefitsData.eligibilityStatus.eligible}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  {benefitsData.eligibilityStatus.enrolled} enrolled
                </p>
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                <UserCheck className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrollment Rates by Plan Type */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5" />
            Enrollment Rates by Plan Type
          </CardTitle>
          <CardDescription>Current enrollment percentages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">Health Plans</span>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={benefitsData.enrollmentRates.health} className="w-24 h-2" />
                <span className="text-sm font-medium">{benefitsData.enrollmentRates.health}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Stethoscope className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Dental Plans</span>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={benefitsData.enrollmentRates.dental} className="w-24 h-2" />
                <span className="text-sm font-medium">{benefitsData.enrollmentRates.dental}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Vision Plans</span>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={benefitsData.enrollmentRates.vision} className="w-24 h-2" />
                <span className="text-sm font-medium">{benefitsData.enrollmentRates.vision}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Retirement Plans</span>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={benefitsData.enrollmentRates.retirement} className="w-24 h-2" />
                <span className="text-sm font-medium">{benefitsData.enrollmentRates.retirement}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Analysis & Enrollment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5" />
              Cost Analysis
            </CardTitle>
            <CardDescription>Monthly benefit costs breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Monthly Cost</span>
                <span className="text-sm font-medium">
                  {formatCurrency(benefitsData.costAnalysis.totalMonthlyCost)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Employer Contribution</span>
                <span className="text-sm font-medium">
                  {formatCurrency(benefitsData.costAnalysis.employerContribution)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Employee Contribution</span>
                <span className="text-sm font-medium">
                  {formatCurrency(benefitsData.costAnalysis.employeeContribution)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg per Employee</span>
                <span className="text-sm font-medium">
                  {formatCurrency(benefitsData.costAnalysis.averagePerEmployee)}
                </span>
              </div>
              <div className="border-t pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cost Trend</span>
                  <div className={`flex items-center gap-1 ${getTrendColor(benefitsData.costAnalysis.costTrend)}`}>
                    {getTrendIcon(benefitsData.costAnalysis.costTrend)}
                    <span className="text-sm font-medium">
                      {benefitsData.costAnalysis.costTrend > 0 ? "+" : ""}
                      {benefitsData.costAnalysis.costTrend}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserCheck className="h-5 w-5" />
              Enrollment Status
            </CardTitle>
            <CardDescription>Current enrollment breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Enrolled</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{benefitsData.eligibilityStatus.enrolled}</span>
                  <Badge variant="default" className="text-xs">
                    {(
                      (benefitsData.eligibilityStatus.enrolled / benefitsData.eligibilityStatus.eligible) *
                      100
                    ).toFixed(1)}
                    %
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{benefitsData.eligibilityStatus.pending}</span>
                  <Badge variant="secondary" className="text-xs">
                    {((benefitsData.eligibilityStatus.pending / benefitsData.eligibilityStatus.eligible) * 100).toFixed(
                      1
                    )}
                    %
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserX className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Declined</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{benefitsData.eligibilityStatus.declined}</span>
                  <Badge variant="outline" className="text-xs">
                    {(
                      (benefitsData.eligibilityStatus.declined / benefitsData.eligibilityStatus.eligible) *
                      100
                    ).toFixed(1)}
                    %
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">Ineligible</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{benefitsData.eligibilityStatus.ineligible}</span>
                  <Badge variant="outline" className="text-xs">
                    {(
                      (benefitsData.eligibilityStatus.ineligible / benefitsData.eligibilityStatus.eligible) *
                      100
                    ).toFixed(1)}
                    %
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default BenefitsEnrollment
