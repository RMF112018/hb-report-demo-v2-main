"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ChevronDown,
  Calendar,
  DollarSign,
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
  FileText,
  BarChart3,
  Wrench,
  ClipboardList,
  Award,
  Archive,
  Smartphone,
  Brain,
  Activity,
  TrendingUp,
  Shield,
} from "lucide-react"
import { getStageConfig } from "@/types/project-stage-config"

interface StageAdaptiveContentProps {
  project: any
  currentStage: string
  userRole: string
}

interface StageContentSection {
  id: string
  title: string
  icon: React.ComponentType<any>
  priority: "high" | "medium" | "low"
  isCollapsible: boolean
  defaultOpen: boolean
  content: React.ReactNode
}

export const StageAdaptiveContent = ({ project, currentStage, userRole }: StageAdaptiveContentProps) => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())
  const stageConfig = getStageConfig(currentStage)

  useEffect(() => {
    // Initialize open sections based on stage and user role
    const defaultOpenSections = new Set<string>()

    // Always open high priority sections
    getStageContentSections().forEach((section) => {
      if (section.defaultOpen || section.priority === "high") {
        defaultOpenSections.add(section.id)
      }
    })

    setOpenSections(defaultOpenSections)
  }, [currentStage, userRole])

  const toggleSection = (sectionId: string) => {
    const newOpenSections = new Set(openSections)
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId)
    } else {
      newOpenSections.add(sectionId)
    }
    setOpenSections(newOpenSections)
  }

  const getStageContentSections = (): StageContentSection[] => {
    const sections: StageContentSection[] = []

    // Stage-specific sections based on current stage
    switch (currentStage) {
      case "BIM Coordination":
        sections.push(
          {
            id: "bim-models",
            title: "BIM Models & Coordination",
            icon: BarChart3,
            priority: "high",
            isCollapsible: true,
            defaultOpen: true,
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-background dark:bg-background border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Active Models</p>
                          <p className="text-2xl font-bold text-foreground">12</p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-background dark:bg-background border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Clash Issues</p>
                          <p className="text-2xl font-bold text-red-600 dark:text-red-400">23</p>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-background dark:bg-background border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Resolved</p>
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">187</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Alert className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30">
                  <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <AlertDescription className="text-orange-800 dark:text-orange-200">
                    23 new clash detection issues require coordination. Next meeting scheduled for tomorrow at 2 PM.
                  </AlertDescription>
                </Alert>
              </div>
            ),
          },
          {
            id: "design-coordination",
            title: "Design Coordination",
            icon: Users,
            priority: "high",
            isCollapsible: true,
            defaultOpen: true,
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-foreground">Upcoming Meetings</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-muted dark:bg-muted/50 rounded border border-border">
                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm text-foreground">MEP Coordination - Tomorrow 2:00 PM</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-muted dark:bg-muted/50 rounded border border-border">
                        <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm text-foreground">Structural Review - Friday 10:00 AM</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-foreground">Recent Updates</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-muted dark:bg-muted/50 rounded border border-border">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm text-foreground">Architectural model updated</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-muted dark:bg-muted/50 rounded border border-border">
                        <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        <span className="text-sm text-foreground">HVAC conflicts identified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ),
          }
        )
        break

      case "Bidding":
        sections.push(
          {
            id: "bid-management",
            title: "Bid Management",
            icon: DollarSign,
            priority: "high",
            isCollapsible: true,
            defaultOpen: true,
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-background dark:bg-background border-border">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">$2.75M</p>
                        <p className="text-sm text-muted-foreground">Current Bid</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-background dark:bg-background border-border">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">47</p>
                        <p className="text-sm text-muted-foreground">Sub Bids</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-background dark:bg-background border-border">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">12</p>
                        <p className="text-sm text-muted-foreground">Pending</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-background dark:bg-background border-border">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">85%</p>
                        <p className="text-sm text-muted-foreground">Complete</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
                  <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    Bid submission deadline: 3 days remaining. 12 subcontractor bids still pending.
                  </AlertDescription>
                </Alert>
              </div>
            ),
          },
          {
            id: "subcontractor-coordination",
            title: "Subcontractor Coordination",
            icon: Users,
            priority: "high",
            isCollapsible: true,
            defaultOpen: true,
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-foreground">Recently Submitted</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-muted dark:bg-muted/50 rounded">
                        <span className="text-sm text-foreground">Electrical Systems Inc.</span>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          $125K
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted dark:bg-muted/50 rounded">
                        <span className="text-sm text-foreground">Premium Plumbing Co.</span>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          $89K
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-foreground">Pending Bids</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-muted dark:bg-muted/50 rounded">
                        <span className="text-sm text-foreground">HVAC Solutions LLC</span>
                        <Badge variant="outline" className="text-orange-600 dark:text-orange-400">
                          Due Today
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted dark:bg-muted/50 rounded">
                        <span className="text-sm text-foreground">Concrete Masters</span>
                        <Badge variant="outline" className="text-blue-600 dark:text-blue-400">
                          Due Tomorrow
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ),
          }
        )
        break

      case "Pre-Construction":
        sections.push(
          {
            id: "value-engineering",
            title: "Value Engineering",
            icon: Target,
            priority: "high",
            isCollapsible: true,
            defaultOpen: true,
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-background dark:bg-background border-border">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">$1.245M</p>
                        <p className="text-sm text-muted-foreground">Savings Achieved</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-background dark:bg-background border-border">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">47</p>
                        <p className="text-sm text-muted-foreground">Proposals</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-background dark:bg-background border-border">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">62%</p>
                        <p className="text-sm text-muted-foreground">Target Progress</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">Value Engineering Progress</span>
                    <span className="text-muted-foreground">$1.245M of $2M target</span>
                  </div>
                  <Progress value={62.25} className="h-2" />
                </div>
              </div>
            ),
          },
          {
            id: "constructibility",
            title: "Constructibility Analysis",
            icon: Wrench,
            priority: "medium",
            isCollapsible: true,
            defaultOpen: false,
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-foreground">Issues by Category</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">Access & Sequencing</span>
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        >
                          8
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">Material Handling</span>
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        >
                          5
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">Safety Concerns</span>
                        <Badge
                          variant="secondary"
                          className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                        >
                          3
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-foreground">Resolution Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">Resolved</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">28</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">In Progress</span>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">12</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">Pending</span>
                        <span className="text-sm font-medium text-orange-600 dark:text-orange-400">6</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ),
          }
        )
        break

      case "Construction":
        sections.push(
          {
            id: "daily-progress",
            title: "Daily Progress Tracking",
            icon: Activity,
            priority: "high",
            isCollapsible: true,
            defaultOpen: true,
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-background dark:bg-background border-border">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">67.8%</p>
                        <p className="text-sm text-muted-foreground">Overall Progress</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-background dark:bg-background border-border">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">92.5%</p>
                        <p className="text-sm text-muted-foreground">Safety Score</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-background dark:bg-background border-border">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">124</p>
                        <p className="text-sm text-muted-foreground">Workers Today</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-background dark:bg-background border-border">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">91.8%</p>
                        <p className="text-sm text-muted-foreground">Quality Score</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Alert className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30">
                  <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Concrete pour scheduled for Zone A tomorrow. Weather forecast shows clear conditions.
                  </AlertDescription>
                </Alert>
              </div>
            ),
          },
          {
            id: "safety-quality",
            title: "Safety & Quality Management",
            icon: Shield,
            priority: "high",
            isCollapsible: true,
            defaultOpen: true,
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-foreground">Safety Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-muted dark:bg-muted/50 rounded border border-border">
                        <span className="text-sm text-foreground">Days without incident</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">47</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted dark:bg-muted/50 rounded border border-border">
                        <span className="text-sm text-foreground">Safety training completion</span>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">96%</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted dark:bg-muted/50 rounded border border-border">
                        <span className="text-sm text-foreground">PPE compliance</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">98%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-foreground">Quality Inspections</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-muted dark:bg-muted/50 rounded border border-border">
                        <span className="text-sm text-foreground">Passed today</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">12/13</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted dark:bg-muted/50 rounded border border-border">
                        <span className="text-sm text-foreground">Deficiency rate</span>
                        <span className="text-sm font-medium text-orange-600 dark:text-orange-400">2.1%</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted dark:bg-muted/50 rounded border border-border">
                        <span className="text-sm text-foreground">Pending inspections</span>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">8</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ),
          }
        )
        break

      case "Closeout":
        sections.push(
          {
            id: "closeout-progress",
            title: "Closeout Progress",
            icon: ClipboardList,
            priority: "high",
            isCollapsible: true,
            defaultOpen: true,
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-background dark:bg-background border-border">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">18/21</p>
                        <p className="text-sm text-muted-foreground">Inspections Passed</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-background dark:bg-background border-border">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">38/47</p>
                        <p className="text-sm text-muted-foreground">Punch List Items</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-background dark:bg-background border-border">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">133/156</p>
                        <p className="text-sm text-muted-foreground">Documents Complete</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">Closeout Progress</span>
                    <span className="text-muted-foreground">85% Complete</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </div>
            ),
          },
          {
            id: "handover",
            title: "Project Handover",
            icon: FileText,
            priority: "medium",
            isCollapsible: true,
            defaultOpen: false,
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-foreground">Training Sessions</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-muted dark:bg-muted/50 rounded">
                        <span className="text-sm text-foreground">Building Systems</span>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          Complete
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted dark:bg-muted/50 rounded">
                        <span className="text-sm text-foreground">Maintenance Procedures</span>
                        <Badge variant="outline" className="text-blue-600 dark:text-blue-400">
                          In Progress
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-foreground">Client Acceptance</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">System walkthrough</span>
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">Final documentation</span>
                        <div className="w-4 h-4 border-2 border-blue-600 dark:border-blue-400 rounded-sm animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ),
          }
        )
        break

      case "Warranty":
        sections.push({
          id: "warranty-management",
          title: "Warranty Management",
          icon: Award,
          priority: "high",
          isCollapsible: true,
          defaultOpen: true,
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-background dark:bg-background border-border">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">42/47</p>
                      <p className="text-sm text-muted-foreground">Active Warranties</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-background dark:bg-background border-border">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">23</p>
                      <p className="text-sm text-muted-foreground">Claims Resolved</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-background dark:bg-background border-border">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">5</p>
                      <p className="text-sm text-muted-foreground">Open Claims</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Alert className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/30">
                <Calendar className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                  3 warranties expiring in the next 30 days. Schedule final inspections with client.
                </AlertDescription>
              </Alert>
            </div>
          ),
        })
        break

      case "Closed":
        sections.push(
          {
            id: "performance-analytics",
            title: "Performance Analytics",
            icon: BarChart3,
            priority: "high",
            isCollapsible: true,
            defaultOpen: true,
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-background dark:bg-background border-border">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">96.7%</p>
                        <p className="text-sm text-muted-foreground">Schedule Performance</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-background dark:bg-background border-border">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">102.3%</p>
                        <p className="text-sm text-muted-foreground">Cost Performance</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-background dark:bg-background border-border">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">97.8%</p>
                        <p className="text-sm text-muted-foreground">Client Satisfaction</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ),
          },
          {
            id: "lessons-learned",
            title: "Lessons Learned & Archive",
            icon: Archive,
            priority: "medium",
            isCollapsible: true,
            defaultOpen: false,
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-foreground">Key Insights</h4>
                    <div className="space-y-2">
                      <div className="p-2 bg-muted dark:bg-muted/50 rounded">
                        <p className="text-sm font-medium text-foreground">Early contractor engagement</p>
                        <p className="text-xs text-muted-foreground">Reduced change orders by 23%</p>
                      </div>
                      <div className="p-2 bg-muted dark:bg-muted/50 rounded">
                        <p className="text-sm font-medium text-foreground">Enhanced safety protocols</p>
                        <p className="text-xs text-muted-foreground">Zero incidents throughout project</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-foreground">Archive Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">Documents archived</span>
                        <span className="text-muted-foreground">97.2%</span>
                      </div>
                      <Progress value={97.2} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            ),
          }
        )
        break

      default:
        sections.push({
          id: "general-project-info",
          title: "Project Information",
          icon: FileText,
          priority: "high",
          isCollapsible: false,
          defaultOpen: true,
          content: (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Stage-specific content for "{currentStage}" is being developed.</p>
            </div>
          ),
        })
    }

    // Add AI insights section for eligible users
    if (userRole === "admin" || userRole === "executive" || userRole === "project_manager") {
      sections.push({
        id: "ai-insights",
        title: "AI Insights & Predictions",
        icon: Brain,
        priority: "medium",
        isCollapsible: true,
        defaultOpen: false,
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-background dark:bg-background border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-foreground">Schedule Prediction</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">87% confident</p>
                  <p className="text-sm text-muted-foreground">On-time completion likely</p>
                </CardContent>
              </Card>
              <Card className="bg-background dark:bg-background border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="font-medium text-foreground">Cost Optimization</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">$125K</p>
                  <p className="text-sm text-muted-foreground">Potential savings identified</p>
                </CardContent>
              </Card>
            </div>
            <Alert className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30">
              <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <AlertDescription className="text-purple-800 dark:text-purple-200">
                HBI Analysis suggests accelerating electrical work to optimize critical path. Estimated 5-day
                improvement possible.
              </AlertDescription>
            </Alert>
          </div>
        ),
      })
    }

    // Add mobile tools section for field users
    if (userRole === "superintendent" || userRole === "team_member" || userRole === "project_manager") {
      sections.push({
        id: "mobile-tools",
        title: "Mobile Field Tools",
        icon: Smartphone,
        priority: "low",
        isCollapsible: true,
        defaultOpen: false,
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 border-border hover:bg-muted dark:hover:bg-muted/50"
              >
                <Smartphone className="h-6 w-6" />
                <span className="text-xs">Quick Inspection</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 border-border hover:bg-muted dark:hover:bg-muted/50"
              >
                <AlertTriangle className="h-6 w-6" />
                <span className="text-xs">Report Issue</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 border-border hover:bg-muted dark:hover:bg-muted/50"
              >
                <FileText className="h-6 w-6" />
                <span className="text-xs">Daily Log</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 border-border hover:bg-muted dark:hover:bg-muted/50"
              >
                <Users className="h-6 w-6" />
                <span className="text-xs">Team Chat</span>
              </Button>
            </div>
          </div>
        ),
      })
    }

    return sections
  }

  const contentSections = getStageContentSections()

  if (!stageConfig) {
    return (
      <Alert className="border-destructive bg-destructive/10 dark:bg-destructive/20">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertDescription className="text-destructive">
          Stage configuration not found for "{currentStage}". Please contact support.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {contentSections.map((section) => {
        const isOpen = openSections.has(section.id)

        if (!section.isCollapsible) {
          return (
            <Card key={section.id} className="border-border bg-card dark:bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <section.icon className="h-5 w-5" />
                  {section.title}
                  <Badge
                    variant="outline"
                    className={
                      section.priority === "high"
                        ? "border-red-300 text-red-700 dark:border-red-700 dark:text-red-300"
                        : section.priority === "medium"
                        ? "border-yellow-300 text-yellow-700 dark:border-yellow-700 dark:text-yellow-300"
                        : "border-green-300 text-green-700 dark:border-green-700 dark:text-green-300"
                    }
                  >
                    {section.priority}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>{section.content}</CardContent>
            </Card>
          )
        }

        return (
          <Card key={section.id} className="border-border bg-card dark:bg-card">
            <Collapsible open={isOpen} onOpenChange={() => toggleSection(section.id)}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors pb-4">
                  <CardTitle className="flex items-center justify-between text-foreground">
                    <div className="flex items-center gap-2">
                      <section.icon className="h-5 w-5" />
                      {section.title}
                      <Badge
                        variant="outline"
                        className={
                          section.priority === "high"
                            ? "border-red-300 text-red-700 dark:border-red-700 dark:text-red-300"
                            : section.priority === "medium"
                            ? "border-yellow-300 text-yellow-700 dark:border-yellow-700 dark:text-yellow-300"
                            : "border-green-300 text-green-700 dark:border-green-700 dark:text-green-300"
                        }
                      >
                        {section.priority}
                      </Badge>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>{section.content}</CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )
      })}
    </div>
  )
}
