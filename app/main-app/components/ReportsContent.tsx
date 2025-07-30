/**
 * @fileoverview Reports Content Component for Main Application
 * @module ReportsContent
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Renders reports-specific content with standardized layout:
 * - Breadcrumb navigation
 * - Module title and description
 * - Tab navigation
 * - Two-column layout with detail panels and main content
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Progress } from "../../../components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../../components/ui/collapsible"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover"
import {
  ChevronRight,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  FileText,
  Calendar,
  CalendarDays,
  Settings,
  Building2,
  UserCheck,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Download,
  Target,
  Zap,
  CheckCircle2,
  XCircle,
  Eye,
  Calculator,
  Receipt,
  CreditCard,
  GitBranch,
  Banknote,
  Percent,
  TrendingDown,
  RefreshCw,
  Package,
  PieChart,
  Scale,
  Activity,
  Shield,
  Plus,
  Maximize,
  Minimize,
  Edit,
  Search,
  Filter,
  RotateCcw,
  Monitor,
  Brain,
  MoreVertical,
  Import,
  ArrowRight,
  Home,
  Ruler,
  Gavel,
  UserPlus,
  Heart,
  GraduationCap,
  History,
  Timer,
  Send,
  Building,
} from "lucide-react"
import type { UserRole } from "../../project/[projectId]/types/project"
import { useToast } from "../../../hooks/use-toast"
import { useAuth } from "../../../context/auth-context"
import { cn } from "../../../lib/utils"

// Import the ReportsDashboard component
import { ReportsDashboard } from "../../../components/reports/ReportsDashboard"

interface User {
  firstName: string
  lastName: string
  email: string
  role: string
  avatar?: string
}

interface ReportsContentProps {
  userRole: UserRole
  user: User
  onNavigateBack?: () => void
  activeTab?: string
  onTabChange?: (tabId: string) => void
  renderMode?: "leftContent" | "rightContent"
  projectId?: string
  projectData?: any
}

interface ReportsModuleTab {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  component: React.ComponentType<{
    userRole: string
    user: any
    projectId?: string
    projectData?: any
    onTabChange?: (tabId: string) => void
    renderMode?: "leftContent" | "rightContent"
  }>
  requiredRoles?: string[]
}

const ReportsContent: React.FC<ReportsContentProps> = ({
  userRole,
  user,
  onNavigateBack,
  activeTab = "overview",
  onTabChange,
  renderMode = "rightContent",
  projectId,
  projectData,
}) => {
  const { toast } = useToast()
  const router = useRouter()

  // Define available tabs based on user role
  const getAvailableTabs = (): ReportsModuleTab[] => {
    const baseTabs: ReportsModuleTab[] = [
      {
        id: "overview",
        label: "Overview",
        icon: BarChart3,
        description: "Reports dashboard with key metrics and recent activity",
        component: ReportsDashboard,
      },
      {
        id: "project-reports",
        label: "Project Reports",
        icon: FileText,
        description: "Create and manage project-specific reports",
        component: ReportsDashboard,
      },
      {
        id: "financial-reports",
        label: "Financial Reports",
        icon: DollarSign,
        description: "Financial review and analysis reports",
        component: ReportsDashboard,
        requiredRoles: ["executive", "project-executive", "project-manager"],
      },
      {
        id: "progress-reports",
        label: "Progress Reports",
        icon: TrendingUp,
        description: "Monthly progress and milestone reports",
        component: ReportsDashboard,
        requiredRoles: ["project-executive", "project-manager"],
      },
      {
        id: "owner-reports",
        label: "Owner Reports",
        icon: Building,
        description: "Client-facing owner reports and communications",
        component: ReportsDashboard,
        requiredRoles: ["project-executive", "project-manager"],
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: PieChart,
        description: "Report analytics and performance insights",
        component: ReportsDashboard,
        requiredRoles: ["executive", "project-executive"],
      },
    ]

    // Filter tabs based on user role
    return baseTabs.filter((tab) => {
      if (!tab.requiredRoles) return true
      return tab.requiredRoles.includes(userRole)
    })
  }

  const availableTabs = getAvailableTabs()

  // Get current tab configuration
  const currentTab = availableTabs.find((tab) => tab.id === activeTab) || availableTabs[0]

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    onTabChange?.(tabId)
  }

  // Render content based on renderMode
  if (renderMode === "leftContent") {
    return (
      <div className="space-y-4">
        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleTabChange("project-reports")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleTabChange("financial-reports")}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Financial Reports
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleTabChange("progress-reports")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Progress Reports
            </Button>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Report Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {availableTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-lg text-sm transition-colors",
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Financial Review Approved</div>
                  <div className="text-xs text-muted-foreground">2 hours ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Send className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Owner Report Distributed</div>
                  <div className="text-xs text-muted-foreground">4 hours ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                  <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Progress Report Pending</div>
                  <div className="text-xs text-muted-foreground">1 day ago</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main content (rightContent)
  return (
    <div className="space-y-6">
      {/* Breadcrumb and Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" onClick={onNavigateBack} className="h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span>/</span>
          <span className="text-foreground font-medium">Reports</span>
          {activeTab !== "overview" && (
            <>
              <span>/</span>
              <span className="text-foreground font-medium">
                {availableTabs.find((tab) => tab.id === activeTab)?.label}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            {availableTabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2 text-xs">
                <tab.icon className="h-3 w-3" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {currentTab && (
          <currentTab.component
            userRole={userRole}
            user={user}
            projectId={projectId}
            projectData={projectData}
            onTabChange={handleTabChange}
            renderMode="rightContent"
          />
        )}
      </div>
    </div>
  )
}

export { ReportsContent }
