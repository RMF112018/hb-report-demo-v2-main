'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/context/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
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
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Building2,
  DollarSign,
  Calendar,
  UserCheck,
  Download,
  RefreshCw,
  Home,
  ChevronDown,
  ChevronUp,
  BarChart3,
  FileText,
  Maximize,
  Minimize,
  Eye,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

// Import components
import { InteractiveStaffingGantt } from '@/app/dashboard/staff-planning/components/InteractiveStaffingGantt'
import { EnhancedHBIInsights } from '@/components/cards/EnhancedHBIInsights'
import { ExportModal } from '@/components/constraints/ExportModal'

// Import mock data
import staffingData from '@/data/mock/staffing/staffing.json'
import projectsData from '@/data/mock/projects.json'
import spcrData from '@/data/mock/staffing/spcr.json'
import cashFlowData from '@/data/mock/financial/cash-flow.json'

// Types
interface StaffMember {
  id: string
  name: string
  position: string
  laborRate: number
  billableRate: number
  experience: number
  strengths: string[]
  weaknesses: string[]
  assignments: Array<{
    project_id: number
    role: string
    startDate: string
    endDate: string
  }>
}

interface Project {
  project_id: number
  name: string
  project_stage_name: string
  active: boolean
}

interface SPCR {
  id: string
  type: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  projectId: number
  position: string
  requestedBy: string
  submittedDate: string
  targetStartDate: string
  duration: number
  justification: string
  comments: Array<{
    id: string
    author: string
    date: string
    text: string
  }>
}

export const ExecutiveStaffingView = () => {
  const { user } = useAuth()
  const { toast } = useToast()

  // State management
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [spcrs, setSpcrs] = useState<SPCR[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [spcrFilter, setSpcrFilter] = useState<'approved' | 'rejected' | 'pending'>('approved')
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(true)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize data
  useEffect(() => {
    setStaffMembers(staffingData as StaffMember[])
    setProjects(projectsData as Project[])
    setSpcrs(spcrData as SPCR[])
  }, [])

  // Calculate overview analytics
  const overviewAnalytics = useMemo(() => {
    const totalStaff = staffMembers.length
    const assignedStaff = staffMembers.filter(staff => staff.assignments.length > 0).length
    const utilizationRate = totalStaff > 0 ? (assignedStaff / totalStaff) * 100 : 0
    
    // Labor cost calculations
    const totalLaborCost = staffMembers.reduce((sum, staff) => sum + staff.laborRate, 0)
    const weeklyLaborCost = totalLaborCost * 40
    const monthlyLaborCost = weeklyLaborCost * 4.33
    const burden = monthlyLaborCost * 0.35 // 35% burden rate
    const totalMonthlyWithBurden = monthlyLaborCost + burden
    
    // Cash flow inflows (from first project as sample)
    const firstProject = cashFlowData.projects[0]
    const totalInflows = firstProject?.cashFlowData?.summary?.totalInflows || 0
    const lastInflow = firstProject?.cashFlowData?.monthlyData?.[0]?.inflows?.total || 0
    
    // SPCR analytics
    const approvedSpcrs = spcrs.filter(spcr => spcr.status === 'approved').length
    const pendingSpcrs = spcrs.filter(spcr => spcr.status === 'submitted').length
    
    return {
      totalStaff,
      assignedStaff,
      utilizationRate,
      weeklyLaborCost,
      monthlyLaborCost: totalMonthlyWithBurden,
      burden,
      totalInflows,
      lastInflow,
      approvedSpcrs,
      pendingSpcrs
    }
  }, [staffMembers, spcrs])

  // Filter SPCRs based on selected filter
  const filteredSpcrs = useMemo(() => {
    switch (spcrFilter) {
      case 'approved':
        return spcrs.filter(spcr => spcr.status === 'approved')
      case 'rejected':
        return spcrs.filter(spcr => spcr.status === 'rejected')
      case 'pending':
        return spcrs.filter(spcr => spcr.status === 'submitted')
      default:
        return spcrs
    }
  }, [spcrs, spcrFilter])

  // Handle export
  const handleExportSubmit = (options: { format: "pdf" | "excel" | "csv"; fileName: string; filePath: string }) => {
    setIsLoading(true)
    // Simulate export process
    setTimeout(() => {
      setIsLoading(false)
      setIsExportModalOpen(false)
      toast({
        title: "Export Successful",
        description: `Staffing data exported as ${options.format.toUpperCase()}`,
      })
    }, 2000)
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

  // Toggle fullscreen
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  // HBI Insights config for staffing
  const staffingInsights = [
    {
      id: "staff-1",
      type: "alert",
      severity: "high",
      title: "Critical Staffing Gap",
      text: "Senior Project Manager shortage across 3 active projects by Q2 2025.",
      action: "Accelerate hiring or consider contractor augmentation.",
      confidence: 94,
      relatedMetrics: ["Staff Utilization", "Project Delivery", "Resource Planning"]
    },
    {
      id: "staff-2",
      type: "opportunity",
      severity: "medium", 
      title: "Cross-Training Opportunity",
      text: "AI identifies 5 junior staff ready for advanced role transitions.",
      action: "Implement structured mentoring and certification programs.",
      confidence: 87,
      relatedMetrics: ["Career Development", "Skills Matrix", "Knowledge Transfer"]
    },
    {
      id: "staff-3",
      type: "performance",
      severity: "low",
      title: "Utilization Optimization",
      text: "Current staffing efficiency at 89% - exceeding industry benchmark.",
      action: "Maintain current allocation strategy and monitor for seasonal adjustments.",
      confidence: 92,
      relatedMetrics: ["Utilization Rate", "Productivity", "Cost Control"]
    }
  ]

  const getSpcrStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'submitted':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getSpcrStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      case 'submitted':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="outline">Draft</Badge>
    }
  }

  return (
    <div className={cn("space-y-6", isFullScreen && "fixed inset-0 z-50 bg-background p-6 overflow-auto")}>
      {/* Header with Breadcrumbs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/staff-planning">Staff Planning</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbPage>Executive View</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullScreen}
          >
            {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Segmented Control */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="spcr">SPCR Review</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Overview Collapsible Section */}
          <Collapsible open={isOverviewExpanded} onOpenChange={setIsOverviewExpanded}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Staffing Overview
                    </CardTitle>
                    {isOverviewExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Staff Utilization</span>
                        </div>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold">{overviewAnalytics.utilizationRate.toFixed(1)}%</div>
                          <Progress value={overviewAnalytics.utilizationRate} className="h-2" />
                          <div className="text-xs text-muted-foreground">
                            {overviewAnalytics.assignedStaff} of {overviewAnalytics.totalStaff} assigned
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Monthly Labor Cost</span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-2xl font-bold">${(overviewAnalytics.monthlyLaborCost / 1000).toFixed(0)}K</div>
                          <div className="text-xs text-muted-foreground">
                            +${(overviewAnalytics.burden / 1000).toFixed(0)}K burden
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">Cash Inflow</span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-2xl font-bold">${(overviewAnalytics.totalInflows / 1000000).toFixed(1)}M</div>
                          <div className="text-xs text-muted-foreground">
                            Last: ${(overviewAnalytics.lastInflow / 1000).toFixed(0)}K
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium">SPCR Status</span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-2xl font-bold">{overviewAnalytics.approvedSpcrs}</div>
                          <div className="text-xs text-muted-foreground">
                            {overviewAnalytics.pendingSpcrs} pending review
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* HBI Insights */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-blue-600" />
                      HBI Staffing Insights
                    </h3>
                    <EnhancedHBIInsights config={staffingInsights} cardId="staffing-executive" />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-6">
          <InteractiveStaffingGantt />
        </TabsContent>

        {/* SPCR Review Tab */}
        <TabsContent value="spcr" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Staff Planning Change Requests (SPCR)
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Tabs value={spcrFilter} onValueChange={(value: any) => setSpcrFilter(value)} className="w-auto">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="approved">Approved</TabsTrigger>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                      <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSpcrs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No {spcrFilter} SPCRs found
                  </div>
                ) : (
                  filteredSpcrs.map((spcr) => (
                    <Card key={spcr.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {getSpcrStatusIcon(spcr.status)}
                              <span className="font-medium">{spcr.type}</span>
                              {getSpcrStatusBadge(spcr.status)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <div>Position: {spcr.position}</div>
                              <div>Requested by: {spcr.requestedBy}</div>
                              <div>Target Start: {new Date(spcr.targetStartDate).toLocaleDateString()}</div>
                              <div>Duration: {spcr.duration} weeks</div>
                            </div>
                            <div className="text-sm">
                              <strong>Justification:</strong> {spcr.justification}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Modal */}
      <ExportModal
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        onExport={handleExportSubmit}
        defaultFileName="staffing-export"
      />
    </div>
  )
} 