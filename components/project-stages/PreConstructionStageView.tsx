"use client"

import React from "react"
import { StageViewProps } from "@/types/project-stage-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  DollarSign,
  Calendar,
  Users,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Wrench,
  PieChart,
  BarChart3,
  Download,
  Upload,
  Edit,
} from "lucide-react"

export const PreConstructionStageView = ({ project, projectData, stageConfig }: StageViewProps) => {
  // Mock Pre-Construction data
  const preconData = {
    valueEngineering: {
      totalSavings: 1245000,
      proposalsSubmitted: 47,
      proposalsAccepted: 23,
      proposalsUnderReview: 8,
      proposalsRejected: 16,
      completionRate: 68.1,
      targetSavings: 2000000,
      categories: [
        { name: "Structural Systems", savings: 485000, proposals: 12, status: "In Progress" },
        { name: "MEP Systems", savings: 325000, proposals: 8, status: "Approved" },
        { name: "Architectural Finishes", savings: 275000, proposals: 6, status: "Under Review" },
        { name: "Site Work", savings: 160000, proposals: 4, status: "Approved" },
      ],
    },
    constructibilityAnalysis: {
      totalIssues: 34,
      resolvedIssues: 28,
      criticalIssues: 2,
      mediumIssues: 4,
      lowIssues: 0,
      completionRate: 82.4,
      categories: [
        { name: "Sequencing", issues: 12, resolved: 10, risk: "Medium" },
        { name: "Access & Logistics", issues: 8, resolved: 7, risk: "Low" },
        { name: "Material Handling", issues: 6, resolved: 5, risk: "High" },
        { name: "Safety Considerations", issues: 5, resolved: 3, risk: "High" },
        { name: "Equipment Requirements", issues: 3, resolved: 3, risk: "Low" },
      ],
    },
    contractNegotiation: {
      totalContracts: 28,
      negotiatedContracts: 19,
      pendingContracts: 6,
      rejectedContracts: 3,
      completionRate: 67.9,
      totalValue: 45600000,
      negotiatedValue: 31200000,
      pendingValue: 10800000,
      categories: [
        { name: "Major Subcontractors", contracts: 8, negotiated: 6, value: 22400000 },
        { name: "Specialty Contractors", contracts: 12, negotiated: 8, value: 15200000 },
        { name: "Material Suppliers", contracts: 8, negotiated: 5, value: 8000000 },
      ],
    },
    milestones: [
      { name: "Design Development Complete", date: "2024-02-15", status: "Completed", completion: 100 },
      { name: "Value Engineering Phase 1", date: "2024-02-28", status: "Completed", completion: 100 },
      { name: "Constructibility Review", date: "2024-03-15", status: "In Progress", completion: 75 },
      { name: "Contract Negotiations", date: "2024-03-30", status: "In Progress", completion: 60 },
      { name: "Permit Submissions", date: "2024-04-15", status: "Upcoming", completion: 0 },
      { name: "Final Contract Package", date: "2024-04-30", status: "Upcoming", completion: 0 },
    ],
  }

  const veProgress =
    (preconData.valueEngineering.proposalsAccepted / preconData.valueEngineering.proposalsSubmitted) * 100
  const caProgress =
    (preconData.constructibilityAnalysis.resolvedIssues / preconData.constructibilityAnalysis.totalIssues) * 100
  const cnProgress =
    (preconData.contractNegotiation.negotiatedContracts / preconData.contractNegotiation.totalContracts) * 100
  const savingsProgress = (preconData.valueEngineering.totalSavings / preconData.valueEngineering.targetSavings) * 100

  return (
    <div className="space-y-6">
      {/* Stage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Value Engineering</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(preconData.valueEngineering.totalSavings / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              {preconData.valueEngineering.proposalsAccepted} of {preconData.valueEngineering.proposalsSubmitted}{" "}
              proposals accepted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Constructibility Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {preconData.constructibilityAnalysis.totalIssues - preconData.constructibilityAnalysis.resolvedIssues}
            </div>
            <p className="text-xs text-muted-foreground">
              {preconData.constructibilityAnalysis.resolvedIssues} of {preconData.constructibilityAnalysis.totalIssues}{" "}
              resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contract Progress</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(cnProgress)}%</div>
            <p className="text-xs text-muted-foreground">
              {preconData.contractNegotiation.negotiatedContracts} of {preconData.contractNegotiation.totalContracts}{" "}
              contracts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Milestone Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                preconData.milestones.reduce((sum, m) => sum + m.completion, 0) / preconData.milestones.length
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground">Overall stage completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="value-engineering" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="value-engineering">Value Engineering</TabsTrigger>
          <TabsTrigger value="constructibility">Constructibility</TabsTrigger>
          <TabsTrigger value="contracts">Contract Negotiation</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>

        {/* Value Engineering Tab */}
        <TabsContent value="value-engineering" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Value Engineering Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Savings Achievement</span>
                      <span>{Math.round(savingsProgress)}% of target</span>
                    </div>
                    <Progress value={savingsProgress} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Proposal Approval Rate</span>
                      <span>{Math.round(veProgress)}%</span>
                    </div>
                    <Progress value={veProgress} className="w-full" />
                  </div>
                </div>

                {/* Categories Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-medium">Value Engineering Categories</h4>
                  {preconData.valueEngineering.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-sm text-muted-foreground">{category.proposals} proposals</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={category.status === "Approved" ? "default" : "secondary"} className="text-xs">
                          {category.status}
                        </Badge>
                        <span className="text-sm font-medium">${(category.savings / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Create VE Proposal
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export VE Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Constructibility Tab */}
        <TabsContent value="constructibility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Constructibility Analysis
                {preconData.constructibilityAnalysis.criticalIssues > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {preconData.constructibilityAnalysis.criticalIssues} Critical
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress Overview */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Issues Resolution Progress</span>
                    <span>{Math.round(caProgress)}%</span>
                  </div>
                  <Progress value={caProgress} className="w-full" />
                </div>

                {/* Categories Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-medium">Analysis Categories</h4>
                  {preconData.constructibilityAnalysis.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {category.resolved} of {category.issues} issues resolved
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            category.risk === "High"
                              ? "destructive"
                              : category.risk === "Medium"
                              ? "secondary"
                              : "default"
                          }
                          className="text-xs"
                        >
                          {category.risk} Risk
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {category.issues - category.resolved} pending
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Log New Issue
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Analysis Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contract Negotiation Tab */}
        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Contract Negotiation Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Contract Completion</span>
                      <span>{Math.round(cnProgress)}%</span>
                    </div>
                    <Progress value={cnProgress} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Value Negotiated</span>
                      <span>${(preconData.contractNegotiation.negotiatedValue / 1000000).toFixed(1)}M</span>
                    </div>
                    <Progress
                      value={
                        (preconData.contractNegotiation.negotiatedValue / preconData.contractNegotiation.totalValue) *
                        100
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Categories Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-medium">Contract Categories</h4>
                  {preconData.contractNegotiation.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {category.negotiated} of {category.contracts} contracts
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={category.negotiated === category.contracts ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {Math.round((category.negotiated / category.contracts) * 100)}%
                        </Badge>
                        <span className="text-sm font-medium">${(category.value / 1000000).toFixed(1)}M</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Create Contract
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Contract Summary
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Milestones Tab */}
        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Pre-Construction Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {preconData.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{milestone.name}</span>
                        <span className="text-sm text-muted-foreground">
                          Due: {new Date(milestone.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          milestone.status === "Completed"
                            ? "default"
                            : milestone.status === "In Progress"
                            ? "secondary"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {milestone.status}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Progress value={milestone.completion} className="w-20" />
                        <span className="text-sm text-muted-foreground min-w-0">{milestone.completion}%</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Update Milestone
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
