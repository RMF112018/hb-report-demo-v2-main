"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  UserPlus,
  Clock,
  DollarSign,
  Heart,
  GraduationCap,
  Shield,
  TrendingUp,
  Settings,
  Building2,
  Calendar,
  AlertCircle,
} from "lucide-react"

interface HRMetric {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
}

interface QuickAction {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
}

const HRPayrollHomePage: React.FC = () => {
  const metrics: HRMetric[] = [
    {
      title: "Total Employees",
      value: "1,247",
      change: "+12 this month",
      trend: "up",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Active Recruits",
      value: "23",
      change: "+5 this week",
      trend: "up",
      icon: <UserPlus className="h-4 w-4" />,
    },
    {
      title: "Pending Timesheets",
      value: "156",
      change: "-8 from yesterday",
      trend: "down",
      icon: <Clock className="h-4 w-4" />,
    },
    {
      title: "Expense Claims",
      value: "$12,450",
      change: "+$2,100 this week",
      trend: "up",
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      title: "Benefits Enrollment",
      value: "89%",
      change: "+3% this quarter",
      trend: "up",
      icon: <Heart className="h-4 w-4" />,
    },
    {
      title: "Training Completion",
      value: "76%",
      change: "+12% this month",
      trend: "up",
      icon: <GraduationCap className="h-4 w-4" />,
    },
  ]

  const quickActions: QuickAction[] = [
    {
      title: "Personnel Management",
      description: "Manage employee records, contracts, and organizational structure",
      icon: <Users className="h-5 w-5" />,
      href: "/hr-payroll/personnel",
      color: "bg-blue-500",
    },
    {
      title: "Recruiting",
      description: "Post jobs, review applications, and manage the hiring process",
      icon: <UserPlus className="h-5 w-5" />,
      href: "/hr-payroll/recruiting",
      color: "bg-green-500",
    },
    {
      title: "Timesheets",
      description: "Track time, manage schedules, and approve timesheets",
      icon: <Clock className="h-5 w-5" />,
      href: "/hr-payroll/timesheets",
      color: "bg-purple-500",
    },
    {
      title: "Expenses",
      description: "Process expense reports and manage reimbursement",
      icon: <DollarSign className="h-5 w-5" />,
      href: "/hr-payroll/expenses",
      color: "bg-yellow-500",
    },
    {
      title: "Payroll",
      description: "Process payroll, manage deductions, and generate reports",
      icon: <Building2 className="h-5 w-5" />,
      href: "/hr-payroll/payroll",
      color: "bg-indigo-500",
    },
    {
      title: "Benefits",
      description: "Manage health plans, retirement, and employee benefits",
      icon: <Heart className="h-5 w-5" />,
      href: "/hr-payroll/benefits",
      color: "bg-pink-500",
    },
    {
      title: "Training",
      description: "Track certifications, manage training programs",
      icon: <GraduationCap className="h-5 w-5" />,
      href: "/hr-payroll/training",
      color: "bg-teal-500",
    },
    {
      title: "Compliance",
      description: "Monitor regulatory requirements and audit trails",
      icon: <Shield className="h-5 w-5" />,
      href: "/hr-payroll/compliance",
      color: "bg-red-500",
    },
    {
      title: "Performance",
      description: "Conduct reviews, set goals, and track performance",
      icon: <TrendingUp className="h-5 w-5" />,
      href: "/hr-payroll/performance",
      color: "bg-orange-500",
    },
    {
      title: "Settings",
      description: "Configure system preferences and user permissions",
      icon: <Settings className="h-5 w-5" />,
      href: "/hr-payroll/settings",
      color: "bg-gray-500",
    },
  ]

  const getTrendColor = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "↗"
      case "down":
        return "↘"
      default:
        return "→"
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HR & Payroll Suite</h1>
          <p className="text-gray-600 mt-2">Comprehensive human resources and payroll management</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Calendar className="h-3 w-3 mr-1" />
            Pay Period: Dec 1-15, 2024
          </Badge>
          <Button variant="outline" size="sm">
            <AlertCircle className="h-4 w-4 mr-2" />
            Alerts (3)
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
              <div className="text-gray-400">{metric.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={`text-xs ${getTrendColor(metric.trend)} flex items-center mt-1`}>
                <span className="mr-1">{getTrendIcon(metric.trend)}</span>
                {metric.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader className="pb-3">
                <div
                  className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}
                >
                  {action.icon}
                </div>
                <CardTitle className="text-sm font-semibold">{action.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs text-gray-600">{action.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your HR & Payroll system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New employee onboarding completed</p>
                <p className="text-xs text-gray-500">Sarah Johnson - Project Manager II</p>
              </div>
              <span className="text-xs text-gray-400">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Payroll processed successfully</p>
                <p className="text-xs text-gray-500">1,247 employees paid</p>
              </div>
              <span className="text-xs text-gray-400">1 day ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Training deadline approaching</p>
                <p className="text-xs text-gray-500">Safety certification due for 23 employees</p>
              </div>
              <span className="text-xs text-gray-400">3 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HRPayrollHomePage
