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
  ChevronRight,
  Home,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface HRPayrollLayoutProps {
  children: React.ReactNode
}

interface NavigationItem {
  title: string
  href: string
  icon: React.ReactNode
  description: string
}

const HRPayrollLayout: React.FC<HRPayrollLayoutProps> = ({ children }) => {
  const pathname = usePathname()

  const navigationItems: NavigationItem[] = [
    {
      title: "Personnel",
      href: "/hr-payroll/personnel",
      icon: <Users className="h-4 w-4" />,
      description: "Employee records & management",
    },
    {
      title: "Recruiting",
      href: "/hr-payroll/recruiting",
      icon: <UserPlus className="h-4 w-4" />,
      description: "Hiring & talent acquisition",
    },
    {
      title: "Timesheets",
      href: "/hr-payroll/timesheets",
      icon: <Clock className="h-4 w-4" />,
      description: "Time tracking & schedules",
    },
    {
      title: "Expenses",
      href: "/hr-payroll/expenses",
      icon: <DollarSign className="h-4 w-4" />,
      description: "Expense reports & reimbursement",
    },
    {
      title: "Payroll",
      href: "/hr-payroll/payroll",
      icon: <Building2 className="h-4 w-4" />,
      description: "Payroll processing & reports",
    },
    {
      title: "Benefits",
      href: "/hr-payroll/benefits",
      icon: <Heart className="h-4 w-4" />,
      description: "Health plans & retirement",
    },
    {
      title: "Training",
      href: "/hr-payroll/training",
      icon: <GraduationCap className="h-4 w-4" />,
      description: "Certifications & development",
    },
    {
      title: "Compliance",
      href: "/hr-payroll/compliance",
      icon: <Shield className="h-4 w-4" />,
      description: "Regulatory requirements",
    },
    {
      title: "Performance",
      href: "/hr-payroll/performance",
      icon: <TrendingUp className="h-4 w-4" />,
      description: "Reviews & goal tracking",
    },
    {
      title: "Settings",
      href: "/hr-payroll/settings",
      icon: <Settings className="h-4 w-4" />,
      description: "System configuration",
    },
  ]

  const getCurrentPageTitle = () => {
    const currentItem = navigationItems.find((item) => pathname === item.href)
    return currentItem?.title || "HR & Payroll Suite"
  }

  const isActivePage = (href: string) => {
    return pathname === href
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/hr-payroll" className="flex items-center space-x-2 text-gray-900 hover:text-gray-700">
                <Home className="h-5 w-5" />
                <span className="font-semibold">HR & Payroll</span>
              </Link>
              {pathname !== "/hr-payroll" && (
                <>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 font-medium">{getCurrentPageTitle()}</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                System Status: Online
              </Badge>
              <Button variant="outline" size="sm">
                Help
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigation</CardTitle>
                <CardDescription>HR & Payroll modules</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                        isActivePage(item.href)
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <div className={`p-1 rounded ${isActivePage(item.href) ? "text-blue-700" : "text-gray-400"}`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </nav>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Employees</span>
                  <Badge variant="outline">1,247</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending Approvals</span>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    23
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">This Pay Period</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    $2.1M
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default HRPayrollLayout
