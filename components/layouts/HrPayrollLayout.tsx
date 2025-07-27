"use client"

import React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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
  Home,
  ChevronRight,
  Building2,
  FileText,
  Calendar,
  CreditCard,
  Award,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface HrPayrollLayoutProps {
  children: React.ReactNode
}

interface NavigationTab {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string
  description: string
  badge?: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
}

const HrPayrollLayout: React.FC<HrPayrollLayoutProps> = ({ children }) => {
  const pathname = usePathname()
  const router = useRouter()

  const navigationTabs: NavigationTab[] = [
    {
      id: "employee-management",
      label: "Employee Management",
      icon: Users,
      path: "/hr-payroll/employee-management",
      description: "Employee records, profiles, and management",
      badge: "1,247",
      badgeVariant: "outline",
    },
    {
      id: "recruitment",
      label: "Recruitment",
      icon: UserPlus,
      path: "/hr-payroll/recruitment",
      description: "Hiring, talent acquisition, and onboarding",
      badge: "12",
      badgeVariant: "secondary",
    },
    {
      id: "time-tracking",
      label: "Time Tracking",
      icon: Clock,
      path: "/hr-payroll/time-tracking",
      description: "Timesheets, schedules, and attendance",
      badge: "Pending",
      badgeVariant: "destructive",
    },
    {
      id: "expenses",
      label: "Expenses",
      icon: DollarSign,
      path: "/hr-payroll/expenses",
      description: "Expense reports and reimbursement",
      badge: "23",
      badgeVariant: "secondary",
    },
    {
      id: "payroll-processing",
      label: "Payroll Processing",
      icon: CreditCard,
      path: "/hr-payroll/payroll-processing",
      description: "Payroll processing and reporting",
      badge: "$2.1M",
      badgeVariant: "outline",
    },
    {
      id: "benefits-administration",
      label: "Benefits Administration",
      icon: Heart,
      path: "/hr-payroll/benefits-administration",
      description: "Health plans, retirement, and benefits",
    },
    {
      id: "training-development",
      label: "Training & Development",
      icon: GraduationCap,
      path: "/hr-payroll/training-development",
      description: "Certifications, training, and development",
      badge: "45",
      badgeVariant: "secondary",
    },
    {
      id: "compliance-reporting",
      label: "Compliance & Reporting",
      icon: Shield,
      path: "/hr-payroll/compliance-reporting",
      description: "Regulatory requirements and reporting",
      badge: "Compliant",
      badgeVariant: "outline",
    },
    {
      id: "performance-management",
      label: "Performance Management",
      icon: TrendingUp,
      path: "/hr-payroll/performance-management",
      description: "Reviews, goals, and performance tracking",
      badge: "Due",
      badgeVariant: "destructive",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/hr-payroll/settings",
      description: "System configuration and preferences",
    },
  ]

  const getCurrentTab = () => {
    return navigationTabs.find((tab) => pathname.startsWith(tab.path)) || navigationTabs[0]
  }

  const isActiveTab = (tabPath: string) => {
    return pathname.startsWith(tabPath)
  }

  const getBreadcrumbItems = () => {
    const currentTab = getCurrentTab()
    const items = [
      { label: "HR & Payroll", href: "/hr-payroll" },
      { label: currentTab.label, href: currentTab.path },
    ]

    // Add additional breadcrumb items based on current path
    if (pathname !== currentTab.path) {
      const pathSegments = pathname.split("/").filter(Boolean)
      if (pathSegments.length > 2) {
        const additionalSegment = pathSegments[2]
        items.push({
          label: additionalSegment.charAt(0).toUpperCase() + additionalSegment.slice(1).replace(/-/g, " "),
          href: pathname,
        })
      }
    }

    return items
  }

  const handleTabClick = (tab: NavigationTab) => {
    router.push(tab.path)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Breadcrumbs */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Home className="h-5 w-5 text-muted-foreground" />
                <span className="text-lg font-semibold">HR & Payroll</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Breadcrumb>
                <BreadcrumbList>
                  {getBreadcrumbItems().map((item, index) => (
                    <React.Fragment key={item.href}>
                      <BreadcrumbItem>
                        {index === getBreadcrumbItems().length - 1 ? (
                          <BreadcrumbPage>{item.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index < getBreadcrumbItems().length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                System Online
              </Badge>
              <Button variant="outline" size="sm">
                Help
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Vertical Sidebar */}
          <div className="w-80 flex-shrink-0">
            <Card className="sticky top-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">HR & Payroll Modules</CardTitle>
                <CardDescription>Manage all HR and payroll functions</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <nav className="space-y-1 p-2">
                    {navigationTabs.map((tab) => {
                      const IconComponent = tab.icon
                      const isActive = isActiveTab(tab.path)

                      return (
                        <button
                          key={tab.id}
                          onClick={() => handleTabClick(tab)}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-muted/50",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={cn("p-2 rounded-md", isActive ? "bg-primary-foreground/20" : "bg-muted")}>
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="text-left">
                              <div className="font-medium">{tab.label}</div>
                              <div className="text-xs opacity-70">{tab.description}</div>
                            </div>
                          </div>
                          {tab.badge && (
                            <Badge
                              variant={tab.badgeVariant || "secondary"}
                              className={cn("ml-2", isActive && "bg-primary-foreground/20 text-primary-foreground")}
                            >
                              {tab.badge}
                            </Badge>
                          )}
                        </button>
                      )
                    })}
                  </nav>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Quick Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Employees</span>
                  <Badge variant="outline">1,247</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pending Approvals</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    23
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">This Pay Period</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    $2.1M
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">System Status</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Online
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="space-y-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{getCurrentTab().label}</h1>
                  <p className="text-muted-foreground mt-1">{getCurrentTab().description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="bg-card border rounded-lg">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HrPayrollLayout
