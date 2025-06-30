"use client"

import React from 'react'
import { StandardPageLayout } from '@/components/layout/StandardPageLayout'
import { StaffTimelineChart } from '../components/StaffTimelineChart'
import { SPCRCreatorPanel } from '../components/SPCRCreatorPanel'
import { SPCRInboxPanel } from '../components/SPCRInboxPanel'
import { LaborVsRevenuePanel } from '../components/LaborVsRevenuePanel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  DollarSign, 
  Calendar, 
  AlertTriangle,
  FileText,
  Plus,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  Building,
  Wrench
} from 'lucide-react'
import { useStaffingStore } from '../store/useStaffingStore'

export default function ProjectManagerStaffingPage() {
  const { staffMembers, projects, getSPCRsByRole, getStaffByProject } = useStaffingStore()

  // PM manages Palm Beach Resort project (hardcoded to project ID 2525840)
  const managedProjectId = 2525840
  const project = projects.find(p => p.project_id === managedProjectId)
  
  // Calculate project-specific metrics
  const pmSPCRs = getSPCRsByRole('project-manager')
  const projectStaff = getStaffByProject(managedProjectId)
  const pendingSPCRs = pmSPCRs.filter(spcr => ['submitted', 'pe-review'].includes(spcr.workflowStage))
  const approvedSPCRs = pmSPCRs.filter(spcr => ['pe-approved', 'final-approved'].includes(spcr.workflowStage))
  
  // Mock project performance metrics
  const projectMetrics = {
    schedulePerformance: 94, // % on track
    budgetPerformance: 98, // % of budget used appropriately
    qualityScore: 96.8,
    safetyDays: 127, // days without incident
    completion: 65 // % complete
  }

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">
        <FileText className="h-4 w-4 mr-1" />
        Project Report
      </Button>
      <Button variant="outline" size="sm">
        <Calendar className="h-4 w-4 mr-1" />
        Schedule
      </Button>
    </div>
  )

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Staffing', href: '/dashboard/staff-planning' },
    { label: 'Project Manager', href: '/dashboard/staff-planning/project-manager' }
  ]

  return (
    <StandardPageLayout
      title="Project Manager Staffing"
      description={`Staffing management for ${project?.name || 'Your Project'} with SPCR creation and team oversight`}
      headerActions={headerActions}
      breadcrumbItems={breadcrumbItems}
    >
      {/* Project Overview */}
      {project && (
        <div className="mb-6">
          <Card className="border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    {project.name}
                  </h2>
                  <div className="text-sm text-muted-foreground mt-1">
                    Project #{project.project_number} • {project.project_stage_name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${(project.contract_value / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-muted-foreground">Contract Value</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/50 rounded">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {projectMetrics.completion}%
                  </div>
                  <div className="text-xs text-muted-foreground">Complete</div>
                  <Progress value={projectMetrics.completion} className="h-1 mt-1" />
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-950/50 rounded">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {projectMetrics.schedulePerformance}%
                  </div>
                  <div className="text-xs text-muted-foreground">On Schedule</div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/50 rounded">
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {projectMetrics.budgetPerformance}%
                  </div>
                  <div className="text-xs text-muted-foreground">Budget Health</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950/50 rounded">
                  <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    {projectMetrics.qualityScore}
                  </div>
                  <div className="text-xs text-muted-foreground">Quality Score</div>
                </div>
                <div className="text-center p-3 bg-red-50 dark:bg-red-950/50 rounded">
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">
                    {projectMetrics.safetyDays}
                  </div>
                  <div className="text-xs text-muted-foreground">Safety Days</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {projectStaff.length}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">Team Members</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
              87% utilization
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {pmSPCRs.length}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">Total SPCRs</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {approvedSPCRs.length} approved
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
              <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                In review
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                23.5%
              </span>
            </div>
            <div className="text-sm text-muted-foreground">Project Margin</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
              Above target
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Timeline and Financial */}
        <div className="xl:col-span-2 space-y-6">
          <StaffTimelineChart userRole="project-manager" title="Project Team Timeline" />
          <LaborVsRevenuePanel userRole="project-manager" />
        </div>

        {/* Right Column - SPCR Management */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Request Additional Staff
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Team Meeting
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Generate Staff Report
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Review Performance
              </Button>
            </CardContent>
          </Card>

          {/* Team Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                Team Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {projectStaff.slice(0, 6).map((staff) => (
                <div key={staff.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{staff.name}</div>
                    <div className="text-xs text-muted-foreground">{staff.position}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">${staff.laborRate}/hr</div>
                    <div className="text-xs text-muted-foreground">
                      {staff.experience}y exp
                    </div>
                  </div>
                </div>
              ))}
              
              {projectStaff.length > 6 && (
                <div className="text-center pt-2">
                  <Button variant="outline" size="sm">
                    View All {projectStaff.length} Members
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Health Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Project Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Overall Health</span>
                    <span className="text-green-600 dark:text-green-400 font-bold">Excellent</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Schedule</span>
                    <span className="text-green-600 dark:text-green-400">{projectMetrics.schedulePerformance}%</span>
                  </div>
                  <Progress value={projectMetrics.schedulePerformance} className="h-2" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Budget</span>
                    <span className="text-blue-600 dark:text-blue-400">{projectMetrics.budgetPerformance}%</span>
                  </div>
                  <Progress value={projectMetrics.budgetPerformance} className="h-2" />
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="text-xs text-muted-foreground mb-2">Recent Updates:</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Foundation work completed ahead of schedule</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>New concrete crew member onboarded</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3 w-3 text-yellow-500" />
                    <span>MEP coordination meeting scheduled</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Row - SPCR Management */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SPCRCreatorPanel 
          projectId={managedProjectId}
          onSuccess={() => {
            console.log('SPCR created successfully!')
          }}
        />
        <SPCRInboxPanel userRole="project-manager" />
      </div>
    </StandardPageLayout>
  )
} 