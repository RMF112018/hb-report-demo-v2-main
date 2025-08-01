"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  Search,
  MoreHorizontal,
  UserCheck,
  AlertTriangle,
  Calendar,
  FileText,
  Settings,
  Plus,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Eye,
  RefreshCw,
  Download,
  Target,
  History,
  Zap,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// Import components
import { SPCRCreatorPanel } from "@/app/dashboard/staff-planning/components/SPCRCreatorPanel"
import { StaffTimelineChart } from "@/app/dashboard/staff-planning/components/StaffTimelineChart"
import { LaborVsRevenuePanel } from "@/app/dashboard/staff-planning/components/LaborVsRevenuePanel"
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights"

// Import mock data
import staffingData from "@/data/mock/staffing/staffing.json"
import projectsData from "@/data/mock/projects.json"
import spcrData from "@/data/mock/staffing/spcr.json"

interface ProjectManagerStaffingViewProps {
  userRole?: string
  projectId?: number
}

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

export const ProjectManagerStaffingView = ({ userRole, projectId: propProjectId }: ProjectManagerStaffingViewProps) => {
  const { toast } = useToast()

  // State management
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [activeTab, setActiveTab] = useState("team")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null)
  const [isTeamExpanded, setIsTeamExpanded] = useState(true)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Use the prop projectId, or fall back to Palm Beach Luxury Estate (project_id: 2525840)
  const projectId = propProjectId || 2525840
  const project = projectsData.find((p) => p.project_id === projectId)

  useEffect(() => {
    // Filter staff for this specific project
    const projectStaff = staffingData.filter(
      (staff) => staff.assignments && staff.assignments.some((assignment) => assignment.project_id === projectId)
    )
    setStaffMembers(projectStaff)
  }, [])

  const filteredStaff = useMemo(() => {
    if (!searchTerm) return staffMembers
    return staffMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.position.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [staffMembers, searchTerm])

  const teamAnalytics = useMemo(() => {
    const totalMembers = staffMembers.length
    const totalLaborCost = staffMembers.reduce((sum, member) => sum + (member.laborRate || 0), 0)
    const weeklyLaborCost = totalLaborCost * 40
    const avgExperience =
      staffMembers.length > 0
        ? staffMembers.reduce((sum, member) => sum + (member.experience || 0), 0) / staffMembers.length
        : 0
    const seniorMembers = staffMembers.filter((member) => (member.experience || 0) >= 5).length

    return {
      totalMembers,
      weeklyLaborCost,
      avgExperience,
      seniorMembers,
    }
  }, [staffMembers])

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Data Refreshed",
        description: "Team data has been updated",
      })
    }, 1000)
  }

  // Handle export
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Team report is being prepared",
    })
  }

  // Toggle fullscreen
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  const getExperienceBadge = (experience: number) => {
    if (experience >= 10)
      return (
        <Badge variant="default" className="bg-purple-500">
          Senior
        </Badge>
      )
    if (experience >= 5)
      return (
        <Badge variant="default" className="bg-blue-500">
          Mid-Level
        </Badge>
      )
    if (experience >= 2) return <Badge variant="secondary">Junior</Badge>
    return <Badge variant="outline">Entry</Badge>
  }

  const pendingSpcrs = spcrData.filter((spcr) => spcr.project_id === projectId && spcr.status === "draft").length

  // PM-specific insights
  const pmInsights = [
    {
      id: "pm-1",
      type: "alert",
      severity: "medium",
      title: "Team Performance Opportunity",
      text: "Junior team members showing 15% productivity increase with additional mentoring support.",
      action: "Consider pairing junior staff with senior mentors for knowledge transfer.",
      confidence: 88,
      relatedMetrics: ["Team Development", "Productivity", "Knowledge Transfer"],
    },
    {
      id: "pm-2",
      type: "opportunity",
      severity: "low",
      title: "Skill Development Path",
      text: "3 team members eligible for certification advancement in Q2 2025.",
      action: "Coordinate with HR to schedule certification training programs.",
      confidence: 92,
      relatedMetrics: ["Skill Development", "Career Growth", "Team Capabilities"],
    },
    {
      id: "pm-3",
      type: "performance",
      severity: "high",
      title: "Project Delivery Excellence",
      text: "Current team configuration delivering 12% ahead of schedule with quality metrics exceeding targets.",
      action: "Document successful practices for replication in future projects.",
      confidence: 95,
      relatedMetrics: ["Schedule Performance", "Quality Metrics", "Team Efficiency"],
    },
  ]

  return (
    <div className={cn("space-y-6", isFullScreen && "fixed inset-0 z-[9999] bg-background p-6 overflow-auto")}>
      {/* Main Content with Sidebar Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
        {/* Sidebar - Hidden for project page integration */}
        <div className="hidden space-y-4">
          {/* Team Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Team Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Team Size</span>
                <span className="font-medium">{teamAnalytics.totalMembers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Senior Members</span>
                <span className="font-medium text-purple-600">{teamAnalytics.seniorMembers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg Experience</span>
                <span className="font-medium text-green-600">{teamAnalytics.avgExperience.toFixed(1)} years</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Weekly Cost</span>
                <span className="font-medium">${(teamAnalytics.weeklyLaborCost / 1000).toFixed(0)}K</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("spcr")}>
                <FileText className="h-4 w-4 mr-2" />
                Create SPCR
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("timeline")}>
                <Calendar className="h-4 w-4 mr-2" />
                View Timeline
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("analytics")}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Performance Analytics
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("team")}>
                <Users className="h-4 w-4 mr-2" />
                Manage Team
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-muted-foreground">Team member added</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-muted-foreground">SPCR submitted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-muted-foreground">Timeline updated</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Key Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Team Productivity</span>
                <span className="font-medium text-green-600">94%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Schedule Adherence</span>
                <span className="font-medium text-blue-600">97%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Quality Score</span>
                <span className="font-medium text-purple-600">91%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Team Management Tabs - Full Width */}
        <div className="col-span-full">
          {/* Team Management Header */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Team Management</h3>
            <p className="text-sm text-muted-foreground">Project team and resource allocation</p>
          </div>

          {/* Statistics Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Team Size</span>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{teamAnalytics.totalMembers}</div>
                  <div className="text-xs text-muted-foreground">{teamAnalytics.seniorMembers} senior members</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Weekly Labor Cost</span>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">${(teamAnalytics.weeklyLaborCost / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-muted-foreground">Base rate only</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Avg Experience</span>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{teamAnalytics.avgExperience.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">Years in industry</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">SPCR Drafts</span>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{pendingSpcrs}</div>
                  <div className="text-xs text-muted-foreground">Ready to submit</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* HBI Insights Panel - Hidden for project page integration */}
          <Card className="hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
                Team Management Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedHBIInsights config={pmInsights} cardId="pm-staffing" />
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Team Management Tab */}
            <TabsContent value="team" className="space-y-6">
              <Collapsible open={isTeamExpanded} onOpenChange={setIsTeamExpanded}>
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Team Members
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <Search className="h-4 w-4 absolute left-2 top-2.5 text-muted-foreground" />
                            <Input
                              placeholder="Search team..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-8 w-64"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          {isTeamExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      {filteredStaff.length > 0 ? (
                        filteredStaff.map((member) => (
                          <Card key={member.id} className="border-l-4 border-l-blue-500">
                            <CardContent className="pt-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarFallback>
                                      {member.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{member.name}</div>
                                    <div className="text-sm text-muted-foreground">{member.position}</div>
                                  </div>
                                  {getExperienceBadge(member.experience)}
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedMember(member)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <div className="text-muted-foreground">Experience</div>
                                  <div className="font-medium">{member.experience} years</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">Labor Rate</div>
                                  <div className="font-medium">${member.laborRate}/hr</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">Current Role</div>
                                  <div className="font-medium">{member.assignments?.[0]?.role || "Unassigned"}</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">Key Strengths</div>
                                  <div className="font-medium">
                                    {member.strengths?.slice(0, 2).join(", ") || "Various"}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <div className="text-sm">No team members found</div>
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </TabsContent>

            {/* Timeline View Tab */}
            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Project Staffing Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StaffTimelineChart userRole="project-manager" />
                </CardContent>
              </Card>
            </TabsContent>

            {/* SPCR Creation Tab */}
            <TabsContent value="spcr" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Staffing Plan Change Request
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SPCRCreatorPanel />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Team Performance Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LaborVsRevenuePanel userRole="project-manager" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
