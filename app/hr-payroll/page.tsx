/**
 * @fileoverview HR & Payroll Suite Main Page
 * @module HRPayrollSuitePage
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-29
 *
 * Main HR & Payroll Suite page with integrated sidebar navigation,
 * modular content injection, and consistent layout using existing components.
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useAuth } from "../../context/auth-context"
import { ProjectSidebar } from "../main-app/components/ProjectSidebar"
import { PageHeader } from "../main-app/components/PageHeader"
import type { PageHeaderTab } from "../main-app/components/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
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
  ChevronRight,
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import AskHBIChat from "../../components/hr-payroll/AskHBIChat"

// Lazy-load HR & Payroll components
const PersonnelPage = React.lazy(() =>
  import("../../components/hr-payroll/personnel/page").then((module) => ({
    default: module.default,
  }))
)
const RecruitingPage = React.lazy(() =>
  import("../../components/hr-payroll/recruiting/page").then((module) => ({
    default: module.default,
  }))
)
const TimesheetsPage = React.lazy(() =>
  import("../../components/hr-payroll/timesheets/page").then((module) => ({
    default: module.default,
  }))
)
const ExpensesPage = React.lazy(() =>
  import("../../components/hr-payroll/expenses/page").then((module) => ({
    default: module.default,
  }))
)
const PayrollPage = React.lazy(() =>
  import("../../components/hr-payroll/payroll/page").then((module) => ({
    default: module.default,
  }))
)
const BenefitsPage = React.lazy(() =>
  import("../../components/hr-payroll/benefits/page").then((module) => ({
    default: module.default,
  }))
)
const TrainingPage = React.lazy(() =>
  import("../../components/hr-payroll/training/page").then((module) => ({
    default: module.default,
  }))
)
const CompliancePage = React.lazy(() =>
  import("../../components/hr-payroll/compliance/page").then((module) => ({
    default: module.default,
  }))
)
const SettingsPage = React.lazy(() =>
  import("../../components/hr-payroll/settings/page").then((module) => ({
    default: module.default,
  }))
)

// Mock data imports
import projectsData from "../../data/mock/projects.json"
import type { UserRole } from "../project/[projectId]/types/project"

interface HRMetric {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
}

interface HRModule {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  count?: string
  status?: string
  statusColor?: string
}

export default function HRPayrollSuitePage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [sidebarWidth, setSidebarWidth] = useState(64)
  const [headerHeight, setHeaderHeight] = useState(140)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Get module from URL params or default to overview
  useEffect(() => {
    const moduleParam = searchParams.get("module")
    if (moduleParam) {
      setSelectedModule(moduleParam)
      setActiveTab(moduleParam)
    } else {
      setSelectedModule(null)
      setActiveTab("overview")
    }
  }, [searchParams])

  // Transform project data for sidebar
  const projects = useMemo(() => {
    return projectsData.map((project: any) => ({
      id: project.project_id.toString(),
      name: project.name,
      description: project.description || "",
      stage: project.project_stage_name,
      project_stage_name: project.project_stage_name,
      project_type_name: project.project_type_name,
      contract_value: project.contract_value,
      duration: project.duration,
      start_date: (project as Record<string, unknown>).start_date as string | undefined,
      end_date: (project as Record<string, unknown>).end_date as string | undefined,
      location: (project as Record<string, unknown>).location as string | undefined,
      project_manager: (project as Record<string, unknown>).project_manager as string | undefined,
      client: (project as Record<string, unknown>).client as string | undefined,
      active: project.active,
      project_number: project.project_number,
      metadata: {
        originalData: project,
      },
    }))
  }, [])

  // HR Metrics for overview
  const hrMetrics: HRMetric[] = [
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

  // HR Modules for sidebar
  const hrModules: HRModule[] = [
    {
      id: "personnel",
      label: "Employee Management",
      description: "Employee records, profiles, and management",
      icon: <Users className="h-4 w-4" />,
      count: "1,247",
    },
    {
      id: "recruiting",
      label: "Recruitment",
      description: "Hiring, talent acquisition, and onboarding",
      icon: <UserPlus className="h-4 w-4" />,
      count: "12",
    },
    {
      id: "timesheets",
      label: "Time Tracking",
      description: "Timesheets, schedules, and attendance",
      icon: <Clock className="h-4 w-4" />,
      status: "Pending",
      statusColor: "bg-red-100 text-red-800",
    },
    {
      id: "expenses",
      label: "Expenses",
      description: "Expense reports and reimbursement",
      icon: <DollarSign className="h-4 w-4" />,
      count: "23",
    },
    {
      id: "payroll",
      label: "Payroll Processing",
      description: "Payroll processing and reporting",
      icon: <Building2 className="h-4 w-4" />,
      count: "$2.1M",
    },
    {
      id: "benefits",
      label: "Benefits Administration",
      description: "Health plans, retirement, and benefits",
      icon: <Heart className="h-4 w-4" />,
    },
    {
      id: "training",
      label: "Training & Development",
      description: "Certifications, training, and development",
      icon: <GraduationCap className="h-4 w-4" />,
      count: "45",
    },
    {
      id: "compliance",
      label: "Compliance & Reporting",
      description: "Regulatory requirements and reporting",
      icon: <Shield className="h-4 w-4" />,
      status: "Compliant",
      statusColor: "bg-gray-100 text-gray-800",
    },
    {
      id: "settings",
      label: "Settings",
      description: "System configuration and preferences",
      icon: <Settings className="h-4 w-4" />,
    },
  ]

  // Handle sidebar panel state changes
  const handleSidebarPanelStateChange = (isExpanded: boolean, totalWidth: number) => {
    setSidebarWidth(totalWidth)
  }

  // Handle module selection from sidebar
  const handleModuleSelect = (moduleId: string | null) => {
    setSelectedModule(moduleId)
    if (moduleId) {
      setActiveTab(moduleId)
      // Update URL with module parameter
      const url = new URL(window.location.href)
      url.searchParams.set("module", moduleId)
      window.history.pushState({}, "", url.toString())
    } else {
      setActiveTab("overview")
      // Remove module parameter from URL
      const url = new URL(window.location.href)
      url.searchParams.delete("module")
      window.history.pushState({}, "", url.toString())
    }
  }

  // Handle tool selection (not used in HR context)
  const handleToolSelect = (toolName: string | null) => {
    // Not applicable for HR & Payroll
  }

  // Handle project selection (not used in HR context)
  const handleProjectSelect = (projectId: string | null) => {
    // Not applicable for HR & Payroll
  }

  // Get tabs for different content types
  const getTabsForContent = (): PageHeaderTab[] => {
    if (selectedModule) {
      return [{ id: selectedModule, label: hrModules.find((m) => m.id === selectedModule)?.label || selectedModule }]
    }

    return [
      { id: "overview", label: "HR Overview" },
      { id: "modules", label: "HR Modules" },
      { id: "reports", label: "Reports" },
      { id: "settings", label: "Settings" },
    ]
  }

  // Get header configuration
  const getHeaderConfig = () => {
    const userName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || "User"
    const selectedModuleData = hrModules.find((m) => m.id === selectedModule)

    return {
      userName,
      moduleTitle: selectedModule ? selectedModuleData?.label || "HR Module" : "HR & Payroll Suite",
      subHead: selectedModule
        ? selectedModuleData?.description || "HR & Payroll management"
        : "Comprehensive human resources and payroll management system",
      tabs: getTabsForContent(),
      navigationState: {
        selectedModule,
        activeTab,
        isModuleView: !!selectedModule,
        isDashboardView: !selectedModule,
      },
      onNavigateToHome: () => {
        setSelectedModule(null)
        setActiveTab("overview")
        // Remove module parameter from URL
        const url = new URL(window.location.href)
        url.searchParams.delete("module")
        window.history.pushState({}, "", url.toString())
      },
      onNavigateToModule: (moduleId: string) => {
        setSelectedModule(moduleId)
        setActiveTab(moduleId)
        // Update URL with module parameter
        const url = new URL(window.location.href)
        url.searchParams.set("module", moduleId)
        window.history.pushState({}, "", url.toString())
      },
      onNavigateToTab: (tabId: string) => {
        setActiveTab(tabId)
      },
    }
  }

  // Render module content
  const renderModuleContent = () => {
    if (!selectedModule) return null

    const ModuleComponent = {
      personnel: PersonnelPage,
      recruiting: RecruitingPage,
      timesheets: TimesheetsPage,
      expenses: ExpensesPage,
      payroll: PayrollPage,
      benefits: BenefitsPage,
      training: TrainingPage,
      compliance: CompliancePage,
      settings: SettingsPage,
    }[selectedModule]

    if (!ModuleComponent) return null

    return (
      <React.Suspense
        fallback={<div className="flex items-center justify-center p-8">Loading {selectedModule}...</div>}
      >
        <ModuleComponent />
      </React.Suspense>
    )
  }

  // Render overview content
  const renderOverviewContent = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">HR & Payroll Suite</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Comprehensive human resources and payroll management
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
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
          {hrMetrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.title}</CardTitle>
                <div className="text-gray-400">{metric.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p
                  className={`text-xs flex items-center mt-1 ${
                    metric.trend === "up"
                      ? "text-green-600"
                      : metric.trend === "down"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  <span className="mr-1">{metric.trend === "up" ? "↗" : metric.trend === "down" ? "↘" : "→"}</span>
                  {metric.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* HR Modules Grid */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">HR & Payroll Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {hrModules.map((module, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => handleModuleSelect(module.id)}
              >
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform">
                    {module.icon}
                  </div>
                  <CardTitle className="text-sm font-semibold">{module.label}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{module.description}</p>
                  <div className="flex items-center justify-between">
                    {module.count && (
                      <Badge variant="secondary" className="text-xs">
                        {module.count}
                      </Badge>
                    )}
                    {module.status && (
                      <Badge variant="secondary" className={`text-xs ${module.statusColor}`}>
                        {module.status}
                      </Badge>
                    )}
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (!mounted || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading HR & Payroll Suite...</p>
        </div>
      </div>
    )
  }

  const headerConfig = getHeaderConfig()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col overflow-hidden">
      {/* Enhanced Project Sidebar with HR & Payroll modules */}
      <ProjectSidebar
        projects={projects}
        selectedProject={null}
        onProjectSelect={handleProjectSelect}
        collapsed={false}
        onToggleCollapsed={() => {}}
        userRole="hr-payroll"
        onPanelStateChange={handleSidebarPanelStateChange}
        onModuleSelect={handleModuleSelect}
        onToolSelect={handleToolSelect}
        selectedModule={selectedModule}
        selectedTool={null}
        onLaunchProjectPageCarousel={() => {}}
      />

      {/* Sticky Page Header */}
      <div
        className="fixed top-0 right-0 z-40 transition-all duration-300 ease-in-out shadow-sm"
        style={{ left: `${sidebarWidth}px` }}
      >
        <PageHeader
          userName={headerConfig.userName}
          moduleTitle={headerConfig.moduleTitle}
          subHead={headerConfig.subHead}
          tabs={headerConfig.tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          navigationState={headerConfig.navigationState}
          onNavigateToHome={headerConfig.onNavigateToHome}
          onNavigateToModule={headerConfig.onNavigateToModule}
          onNavigateToTab={headerConfig.onNavigateToTab}
          isSticky={true}
        />
      </div>

      {/* Main Content Area */}
      <main
        className="flex-1 overflow-hidden flex flex-col transition-all duration-300 ease-in-out"
        style={{
          marginLeft: `${sidebarWidth}px`,
          paddingTop: `${headerHeight}px`,
          width: `calc(100vw - ${sidebarWidth}px)`,
          maxWidth: `calc(100vw - ${sidebarWidth}px)`,
        }}
      >
        {/* Main Content Container */}
        <div className="flex-1 flex overflow-hidden min-w-0 max-w-full">
          {/* Content Area */}
          <div className="w-full overflow-hidden min-w-0 max-w-full flex-shrink bg-white dark:bg-gray-950 flex flex-col scrollbar-hide">
            <div className="flex-1 p-4 min-w-0 w-full max-w-full overflow-y-auto overflow-x-hidden flex flex-col">
              <div className="flex-1 min-w-0 w-full max-w-full overflow-hidden">
                {selectedModule ? renderModuleContent() : renderOverviewContent()}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Container */}
        <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 overflow-hidden min-w-0 max-w-full">
          <div className="px-6 py-4 min-w-0 max-w-full overflow-hidden">
            <div className="flex items-center justify-between min-w-0">
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 min-w-0 flex-shrink">
                <span className="truncate">© 2025 Hedrick Brothers Construction</span>
                <span className="text-gray-400 flex-shrink-0">•</span>
                <span className="text-[#0021A5] font-medium flex-shrink-0">HB Report Demo v3.0</span>
                <span className="text-gray-400 flex-shrink-0">•</span>
                <span className="flex items-center gap-1 flex-shrink-0">
                  <AlertCircle className="h-3 w-3 text-[#FA4616]" />
                  System Status: <span className="text-[#FA4616] font-medium">Operational</span>
                </span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400 flex-shrink-0">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-[#0021A5]" />
                  {projects.length} Projects
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-[#0021A5]" />
                  Last Updated: {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Ask HBI Chat */}
      <AskHBIChat />
    </div>
  )
}
