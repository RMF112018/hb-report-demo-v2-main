"use client"

import React from "react"
import { StageViewProps } from "@/types/project-stage-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Building2, AlertTriangle, CheckCircle, Clock, Users, FileText, Upload, Download, Eye } from "lucide-react"

export const BIMCoordinationStageView = ({ project, projectData, stageConfig }: StageViewProps) => {
  // Mock BIM coordination data
  const bimData = {
    modelAccuracy: 94.2,
    clashesDetected: 127,
    clashesResolved: 98,
    designCompletion: 87.5,
    coordinationMeetings: 12,
    lastModelUpdate: "2024-01-15T10:30:00Z",
    activeModels: [
      { name: "Architectural Model", version: "Rev 3.2", status: "current", lastUpdate: "2024-01-15" },
      { name: "Structural Model", version: "Rev 2.8", status: "current", lastUpdate: "2024-01-14" },
      { name: "MEP Model", version: "Rev 1.9", status: "needs_update", lastUpdate: "2024-01-10" },
      { name: "Civil Model", version: "Rev 1.4", status: "current", lastUpdate: "2024-01-13" },
    ],
    recentClashes: [
      { id: "CL-001", type: "MEP-Structural", severity: "High", status: "Open", assigned: "John Smith" },
      { id: "CL-002", type: "Arch-MEP", severity: "Medium", status: "In Progress", assigned: "Sarah Wilson" },
      { id: "CL-003", type: "Civil-Structural", severity: "Low", status: "Resolved", assigned: "Mike Johnson" },
    ],
  }

  const clashResolutionRate = Math.round((bimData.clashesResolved / bimData.clashesDetected) * 100)
  const pendingClashes = bimData.clashesDetected - bimData.clashesResolved

  return (
    <div className="space-y-6">
      {/* Stage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bimData.modelAccuracy}%</div>
            <p className="text-xs text-muted-foreground">Overall coordination accuracy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clash Resolution</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clashResolutionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {bimData.clashesResolved} of {bimData.clashesDetected} resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Design Completion</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bimData.designCompletion}%</div>
            <p className="text-xs text-muted-foreground">Design documentation progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coordination Meetings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bimData.coordinationMeetings}</div>
            <p className="text-xs text-muted-foreground">Meetings held to date</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Models Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Active BIM Models
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bimData.activeModels.map((model, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{model.name}</span>
                    <span className="text-sm text-muted-foreground">{model.version}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={model.status === "current" ? "default" : "secondary"} className="text-xs">
                    {model.status === "current" ? "Current" : "Needs Update"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(model.lastUpdate).toLocaleDateString()}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Button className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Model
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Run Clash Detection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clash Management Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Clash Management
            {pendingClashes > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingClashes} Pending
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Clash Resolution Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Clash Resolution Progress</span>
                <span>{clashResolutionRate}%</span>
              </div>
              <Progress value={clashResolutionRate} className="w-full" />
            </div>

            {/* Recent Clashes */}
            <div className="space-y-3">
              <h4 className="font-medium">Recent Clashes</h4>
              {bimData.recentClashes.map((clash) => (
                <div key={clash.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{clash.id}</span>
                      <span className="text-sm text-muted-foreground">{clash.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        clash.severity === "High"
                          ? "destructive"
                          : clash.severity === "Medium"
                          ? "secondary"
                          : "default"
                      }
                      className="text-xs"
                    >
                      {clash.severity}
                    </Badge>
                    <Badge
                      variant={
                        clash.status === "Open"
                          ? "destructive"
                          : clash.status === "In Progress"
                          ? "secondary"
                          : "default"
                      }
                      className="text-xs"
                    >
                      {clash.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground min-w-0">{clash.assigned}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coordination Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Coordination Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Upcoming Meetings</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Weekly Coordination</span>
                    <span className="text-sm text-muted-foreground">Jan 18, 2024</span>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">MEP Clash Review</span>
                    <span className="text-sm text-muted-foreground">Jan 20, 2024</span>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Design Review</span>
                    <span className="text-sm text-muted-foreground">Jan 22, 2024</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Key Milestones</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Design Development Complete</span>
                    <Badge variant="secondary">85%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Major Clashes Resolved</span>
                    <Badge variant="secondary">77%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Coordination Sign-off</span>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Schedule Meeting
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                View Meeting Notes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
