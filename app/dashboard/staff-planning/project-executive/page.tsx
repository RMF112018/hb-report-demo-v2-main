"use client"

import React from 'react'
import { StandardPageLayout } from '@/components/layout/StandardPageLayout'
import { StaffTimelineChart } from '../components/StaffTimelineChart'
import { SPCRInboxPanel } from '../components/SPCRInboxPanel'
import { LaborVsRevenuePanel } from '../components/LaborVsRevenuePanel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  DollarSign, 
  Building, 
  AlertTriangle,
  FileText,
  Calendar,
  TrendingUp,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react'
import { useStaffingStore } from '../store/useStaffingStore'

export default function ProjectExecutiveStaffingPage() {
  const { staffMembers, projects, getSPCRsByRole, getStaffByProject } = useStaffingStore()

  // Portfolio projects for PE (6 projects)
  const portfolioProjects = [2525840, 2525841, 2525842, 2525843, 2525844, 2525845]
  const portfolioProjectData = projects.filter(p => portfolioProjects.includes(p.project_id))
  
  // Calculate portfolio metrics
  const peSPCRs = getSPCRsByRole('project-executive')
  const pendingSPCRs = peSPCRs.filter(spcr => spcr.workflowStage === 'pe-review')
  const portfolioStaffCount = portfolioProjects.reduce((total, projectId) => 
    total + getStaffByProject(projectId).length, 0
  )
  const portfolioContractValue = portfolioProjectData.reduce((sum, p) => sum + p.contract_value, 0)
  const activePortfolioProjects = portfolioProjectData.filter(p => p.active).length

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">
        <FileText className="h-4 w-4 mr-1" />
        Portfolio Report
      </Button>
      <Button variant="outline" size="sm">
        <Calendar className="h-4 w-4 mr-1" />
        Schedule View
      </Button>
    </div>
  )

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Staffing', href: '/dashboard/staff-planning' },
    { label: 'Project Executive', href: '/dashboard/staff-planning/project-executive' }
  ]

  return (
    <StandardPageLayout
      title="Project Executive Staffing"
      description="Portfolio staffing management with SPCR review and resource allocation oversight"
      headerActions={headerActions}
      breadcrumbItems={breadcrumbItems}
    >
      {/* Portfolio Overview KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Building className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {activePortfolioProjects}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">Active Projects</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {portfolioProjectData.length} total portfolio
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {portfolioStaffCount}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">Portfolio Staff</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
              85% utilization
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ${(portfolioContractValue / 1000000).toFixed(0)}M
              </span>
            </div>
            <div className="text-sm text-muted-foreground">Portfolio Value</div>
            <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              23.1% avg margin
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {pendingSPCRs.length}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">Pending SPCRs</div>
            {pendingSPCRs.length > 0 && (
              <Badge variant="destructive" className="text-xs mt-1 animate-pulse">
                Action Required
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Project Cards */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Portfolio Projects</h3>
          <Button variant="outline" size="sm">
            View All Details
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolioProjectData.slice(0, 6).map((project) => {
            const projectStaff = getStaffByProject(project.project_id)
            const projectSPCRs = peSPCRs.filter(spcr => spcr.project_id === project.project_id)
            
            return (
              <Card key={project.project_id} className="border hover:bg-accent/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm truncate">{project.name}</h4>
                    <Badge variant={project.active ? "default" : "secondary"} className="text-xs">
                      {project.active ? "Active" : "Pipeline"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contract:</span>
                      <span className="font-medium">${(project.contract_value / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Staff:</span>
                      <span className="font-medium">{projectStaff.length} assigned</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SPCRs:</span>
                      <span className="font-medium">
                        {projectSPCRs.length} 
                        {projectSPCRs.filter(s => s.workflowStage === 'pe-review').length > 0 && (
                          <span className="text-red-500"> (pending)</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stage:</span>
                      <span className="font-medium">{project.project_stage_name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Timeline and Financial Analysis */}
        <div className="xl:col-span-2 space-y-6">
          <StaffTimelineChart userRole="project-executive" />
          <LaborVsRevenuePanel userRole="project-executive" />
        </div>

        {/* Right Column - SPCR Inbox and Portfolio Insights */}
        <div className="space-y-6">
          <SPCRInboxPanel userRole="project-executive" />
          
          {/* Portfolio Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Portfolio Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 dark:bg-green-950/50 rounded">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">91%</div>
                  <div className="text-xs text-muted-foreground">On Schedule</div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/50 rounded">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">96.8</div>
                  <div className="text-xs text-muted-foreground">Quality Score</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Schedule Performance</span>
                    <span className="text-green-600 dark:text-green-400">+1.2% ahead</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Budget Performance</span>
                    <span className="text-blue-600 dark:text-blue-400">-0.8% under</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Resource Utilization</span>
                    <span className="text-green-600 dark:text-green-400">85.2%</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="text-xs text-muted-foreground mb-2">This Week's Actions:</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Approved 2 SPCRs for Palm Beach Resort</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3 w-3 text-yellow-500" />
                    <span>{pendingSPCRs.length} SPCR{pendingSPCRs.length !== 1 ? 's' : ''} awaiting review</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <TrendingUp className="h-3 w-3 text-blue-500" />
                    <span>Q4 staffing plan review due</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resource Allocation Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                Resource Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {portfolioProjectData.slice(0, 4).map((project) => {
                const projectStaff = getStaffByProject(project.project_id)
                const utilization = Math.min(95, Math.max(70, 75 + Math.random() * 20))
                
                return (
                  <div key={project.project_id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div className="flex-1">
                      <div className="text-sm font-medium truncate">{project.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {projectStaff.length} staff • {utilization.toFixed(0)}% utilized
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">
                        ${(project.contract_value / 1000000).toFixed(1)}M
                      </div>
                    </div>
                  </div>
                )
              })}
              
              <div className="pt-2 border-t text-center">
                <Button variant="outline" size="sm" className="w-full">
                  Optimize Allocation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </StandardPageLayout>
  )
} 