"use client"

import React from 'react'
import { StandardPageLayout } from '@/components/layout/StandardPageLayout'
import { EnhancedHBIInsights } from '@/components/cards/EnhancedHBIInsights'
import { InteractiveStaffingGantt } from '../components/InteractiveStaffingGantt'
import { SPCRInboxPanel } from '../components/SPCRInboxPanel'
import { LaborVsRevenuePanel } from '../components/LaborVsRevenuePanel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  FileText,
  Calendar,
  Settings
} from 'lucide-react'
import { useStaffingStore } from '../store/useStaffingStore'

export default function ExecutiveStaffingPage() {
  const { staffMembers, projects, spcrs, getSPCRsByRole } = useStaffingStore()

  // Calculate key metrics for executive overview
  const executiveSPCRs = getSPCRsByRole('executive')
  const pendingSPCRs = executiveSPCRs.filter(spcr => spcr.workflowStage === 'executive-review')
  const totalStaffCount = staffMembers.length
  const activeProjects = projects.filter(p => p.active).length
  
  // Mock financial metrics
  const totalContractValue = projects.reduce((sum, p) => sum + p.contract_value, 0)
  const quarterlyGrowth = 12.5 // Mock percentage

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">
        <FileText className="h-4 w-4 mr-1" />
        Export Report
      </Button>
      <Button variant="outline" size="sm">
        <Settings className="h-4 w-4 mr-1" />
        Configure
      </Button>
    </div>
  )

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Staffing', href: '/dashboard/staff-planning' },
    { label: 'Executive View', href: '/dashboard/staff-planning/executive' }
  ]

  return (
    <StandardPageLayout
      title="Executive Staffing Management"
      description="Enterprise-wide staffing oversight with interactive timeline management and SPCR review"
      actions={headerActions}
      breadcrumbs={breadcrumbs}
    >
      {/* KPI Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {totalStaffCount}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">Total Staff</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
              +8% vs LQ
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${(totalContractValue / 1000000).toFixed(0)}M
              </span>
            </div>
            <div className="text-sm text-muted-foreground">Contract Value</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
              +{quarterlyGrowth}% vs LQ
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {activeProjects}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">Active Projects</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {projects.length - activeProjects} in pipeline
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {pendingSPCRs.length}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">Pending SPCRs</div>
            {pendingSPCRs.length > 0 && (
              <Badge variant="destructive" className="text-xs mt-1 animate-pulse">
                Needs Review
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Interactive Gantt */}
        <div className="xl:col-span-2 space-y-6">
          <InteractiveStaffingGantt userRole="executive" />
          
          {/* HBI Insights Integration */}
          <EnhancedHBIInsights
            config={[
              {
                id: '1',
                type: 'opportunity',
                severity: 'high',
                title: 'Resource Reallocation Opportunity', 
                text: 'Analysis shows 15% efficiency gain possible by reallocating 3 superintendents from Beach Commons to Palm Beach Resort project.',
                action: 'Consider reassigning Superintendents Johnson, Miller, and Davis to optimize project timelines.',
                confidence: 92,
                relatedMetrics: ['Staff Utilization', 'Project Timeline', 'Resource Allocation'],
                project_id: 'PB-2024'
              },
              {
                id: '2',
                type: 'risk',
                severity: 'medium',
                title: 'Labor Cost Variance Alert',
                text: 'Q3 labor costs are trending 8% above budget across portfolio. Key drivers: overtime in mechanical trades.',
                action: 'Implement staggered shift strategy and consider additional HVAC personnel.',
                confidence: 87,
                relatedMetrics: ['Labor Cost', 'Overtime Hours', 'Budget Variance'],
                project_id: 'global'
              },
              {
                id: '3',
                type: 'forecast',
                severity: 'high',
                title: 'Pipeline Staffing Readiness',
                text: 'Upcoming Q4 project starts require 25% staff increase. Current talent pipeline can support 18% growth.',
                action: 'Accelerate recruitment in Project Manager II and Superintendent I roles.',
                confidence: 91,
                relatedMetrics: ['Staffing Capacity', 'Recruitment Pipeline', 'Project Starts'],
                project_id: 'global'
              }
            ]}
            cardId="executive-staffing"
          />
        </div>

        {/* Right Column - SPCR Inbox and Financial Overview */}
        <div className="space-y-6">
          <SPCRInboxPanel userRole="executive" />
          
          {/* Executive Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                Portfolio Health Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 dark:bg-green-950/50 rounded">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">87%</div>
                  <div className="text-xs text-muted-foreground">Utilization Rate</div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/50 rounded">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">22.3%</div>
                  <div className="text-xs text-muted-foreground">Avg Margin</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Schedule Performance</span>
                  <span className="text-green-600 dark:text-green-400">+2.1% ahead</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Quality Score</span>
                  <span className="text-blue-600 dark:text-blue-400">94.2/100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Safety Record</span>
                  <span className="text-green-600 dark:text-green-400">0 incidents</span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground mb-1">Key Actions Needed:</div>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Review {pendingSPCRs.length} pending SPCR{pendingSPCRs.length !== 1 ? 's' : ''}</li>
                  <li>• Approve Q4 staffing plan</li>
                  <li>• Review high-risk project margins</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Row - Financial Analysis */}
      <div className="mt-6">
        <LaborVsRevenuePanel userRole="executive" />
      </div>
    </StandardPageLayout>
  )
} 