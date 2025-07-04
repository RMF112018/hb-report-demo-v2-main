'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/context/auth-context'
import { useRouter } from 'next/navigation'
import { AppHeader } from '@/components/layout/app-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { 
  Users, 
  Calendar, 
  AlertTriangle, 
  TrendingUp, 
  Building2, 
  FileText, 
  CheckCircle2, 
  Clock,
  Home,
  RefreshCw,
  Download,
  Plus,
  DollarSign,
  BarChart3,
  EllipsisVertical
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Import role-specific components
import { ExecutiveStaffingView } from '@/components/staffing/ExecutiveStaffingView'
import { ProjectExecutiveStaffingView } from '@/components/staffing/ProjectExecutiveStaffingView'
import { ProjectManagerStaffingView } from '@/components/staffing/ProjectManagerStaffingView'

// Import mock data for statistics
import staffingData from '@/data/mock/staffing/staffing.json'
import projectsData from '@/data/mock/projects.json'
import spcrData from '@/data/mock/staffing/spcr.json'

export default function StaffPlanningPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading staffing data...</p>
        </div>
      </div>
    )
  }

  // Calculate role-specific statistics
  const stats = useMemo(() => {
    const totalStaff = staffingData.length
    const assignedStaff = staffingData.filter(staff => staff.assignments && staff.assignments.length > 0).length
    const utilization = totalStaff > 0 ? (assignedStaff / totalStaff) * 100 : 0
    
    const totalLaborCost = staffingData.reduce((sum, staff) => sum + (staff.laborRate || 0), 0)
    const monthlyLaborCost = totalLaborCost * 40 * 4.33 // Weekly to monthly
    
    const pendingSpcrs = spcrData.filter(spcr => spcr.status === 'submitted').length
    const approvedSpcrs = spcrData.filter(spcr => spcr.status === 'approved').length
    
    // Role-specific project counts
    let projectCount = 0
    let projectScope = "All Projects"
    
    switch (user.role) {
      case 'executive':
        projectCount = projectsData.length
        projectScope = "Enterprise View"
        break
      case 'project-executive':
        projectCount = 6
        projectScope = "Portfolio View"
        break
      case 'project-manager':
        projectCount = 1
        projectScope = "Single Project"
        break
      default:
        projectCount = projectsData.length
        projectScope = "All Projects"
    }

    return {
      totalStaff,
      assignedStaff,
      utilization,
      monthlyLaborCost,
      pendingSpcrs,
      approvedSpcrs,
      projectCount,
      projectScope
    }
  }, [user.role, staffingData, spcrData, projectsData])

  const getPageTitle = () => {
    switch (user.role) {
      case 'executive':
        return 'Portfolio Staffing Management'
      case 'project-executive':
        return 'Portfolio Staffing Dashboard'
      case 'project-manager':
        return 'Project Staffing Dashboard'
      default:
        return 'Staff Planning'
    }
  }

  const getPageDescription = () => {
    switch (user.role) {
      case 'executive':
        return 'Comprehensive staffing oversight across all projects and resources with strategic planning capabilities'
      case 'project-executive':
        return 'Manage staffing for your portfolio of projects with performance analytics and resource optimization'
      case 'project-manager':
        return 'Detailed team management for your assigned project with responsibility tracking and SPCR workflows'
      default:
        return 'Staff planning and resource management system'
    }
  }

  const getRoleBadge = () => {
    switch (user.role) {
      case 'executive':
        return <Badge variant="default" className="bg-purple-600 hover:bg-purple-700">Executive</Badge>
      case 'project-executive':
        return <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">Project Executive</Badge>
      case 'project-manager':
        return <Badge variant="default" className="bg-green-600 hover:bg-green-700">Project Manager</Badge>
      default:
        return <Badge variant="outline">{user.role}</Badge>
    }
  }

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Data Refreshed",
        description: "Staffing data has been updated",
      })
    }, 1000)
  }

  // Handle export
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Staffing report is being prepared",
    })
  }

  // Handle create SPCR
  const handleCreateSpcr = () => {
    toast({
      title: "SPCR Creation",
      description: "Redirecting to SPCR creation form",
    })
  }

  // Handle create staffing plan
  const handleCreateStaffingPlan = () => {
    router.push('/dashboard/staff-planning/staffing-plan')
  }

  // Statistics widgets
  const StaffingWidgets = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card data-tour="utilization-widget">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Staff Utilization</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{stats.utilization.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">
              {stats.assignedStaff} of {stats.totalStaff} assigned
            </div>
          </div>
        </CardContent>
      </Card>

      <Card data-tour="labor-cost-widget">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Monthly Labor Cost</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">${(stats.monthlyLaborCost / 1000).toFixed(0)}K</div>
            <div className="text-xs text-muted-foreground">
              Including burden & benefits
            </div>
          </div>
        </CardContent>
      </Card>

      <Card data-tour="project-scope-widget">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Project Scope</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{stats.projectCount}</div>
            <div className="text-xs text-muted-foreground">
              {stats.projectScope}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card data-tour="spcr-widget">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium">SPCR Status</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{stats.pendingSpcrs}</div>
            <div className="text-xs text-muted-foreground">
              {stats.approvedSpcrs} approved this month
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderRoleSpecificContent = () => {
    switch (user.role) {
      case 'executive':
        return <ExecutiveStaffingView />
      case 'project-executive':
        return <ProjectExecutiveStaffingView />
      case 'project-manager':
        return <ProjectManagerStaffingView />
      default:
        return (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Limited Access</h3>
                <p className="text-muted-foreground">
                  Your current role has limited access to staffing management features. 
                  Contact your administrator for additional permissions.
                </p>
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <>
      <AppHeader />
      <div className="space-y-6 p-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb data-tour="breadcrumb-nav">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="flex items-center gap-1">
                <Home className="h-3 w-3" />
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Staff Planning</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header Section - Made Sticky */}
        <div className="sticky top-20 z-40 bg-white dark:bg-gray-950 border-b border-border/40 -mx-6 px-6 pb-4 backdrop-blur-sm">
          <div className="flex flex-col gap-4 pt-3" data-tour="staffing-header">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">{getPageTitle()}</h1>
                <p className="text-muted-foreground mt-1">{getPageDescription()}</p>
              </div>
              <div className="flex items-center gap-3" data-tour="action-controls">
                {(user.role === 'project-manager' || user.role === 'project-executive') && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button className="bg-[#FF6B35] hover:bg-[#E55A2B]">
                        <Plus className="h-4 w-4 mr-2" />
                        Create
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-0" align="end">
                      <div className="p-1">
                        <button
                          onClick={handleCreateStaffingPlan}
                          className="w-full text-left px-3 py-2 rounded text-sm hover:bg-muted transition-colors flex items-center gap-2"
                        >
                          <Calendar className="h-4 w-4" />
                          Staffing Plan
                        </button>
                        <button
                          onClick={handleCreateSpcr}
                          className="w-full text-left px-3 py-2 rounded text-sm hover:bg-muted transition-colors flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          SPCR
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
                
                {/* More Actions Menu */}
                <Popover open={moreMenuOpen} onOpenChange={setMoreMenuOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="px-2" data-tour="more-actions-menu">
                      <EllipsisVertical className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-0" align="end">
                    <div className="p-1">
                      <button
                        onClick={() => {
                          handleRefresh();
                          setMoreMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded text-sm hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                      </button>
                      <button
                        onClick={() => {
                          handleExport();
                          setMoreMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded text-sm hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Export
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Statistics Widgets */}
            <StaffingWidgets />
          </div>
        </div>

        {/* Main Content */}
        <div data-tour="role-content">
          {renderRoleSpecificContent()}
        </div>

        {/* Help Section */}
        <Card data-tour="help-section">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Staff Planning Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Resource Planning
                </h4>
                <p className="text-muted-foreground">
                  Optimize staff allocation across projects with data-driven insights and forecasting tools.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  SPCR Workflow
                </h4>
                <p className="text-muted-foreground">
                  Manage Staffing Plan Change Requests through the approval workflow with automated notifications.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Performance Analytics
                </h4>
                <p className="text-muted-foreground">
                  Track team productivity, utilization rates, and cost management across your project portfolio.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
} 