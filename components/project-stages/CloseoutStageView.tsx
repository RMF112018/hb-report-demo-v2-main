"use client"

import React from "react"
import { StageViewProps } from "@/types/project-stage-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  ClipboardList,
  FileText,
  Users,
  Calendar,
  AlertTriangle,
  Clock,
  Target,
  Award,
  Key,
  Clipboard,
  Book,
  Camera,
  Download,
  Upload,
  Edit,
  Plus,
  ExternalLink,
  Archive,
  HandHeart,
  Building2,
  Wrench,
} from "lucide-react"

export const CloseoutStageView = ({ project, projectData, stageConfig }: StageViewProps) => {
  // Mock Closeout data
  const closeoutData = {
    overallProgress: {
      completionPercentage: 89.7,
      finalInspectionsPassed: 18,
      finalInspectionsPending: 3,
      punchListItems: 47,
      punchListCompleted: 38,
      documentationComplete: 85.2,
      clientApprovalsPending: 6,
      readyForHandover: false,
      targetCloseDate: "2024-02-15",
    },
    inspections: {
      totalInspections: 21,
      passedInspections: 18,
      failedInspections: 0,
      pendingInspections: 3,
      categories: [
        { name: "Building Department", inspections: 5, passed: 5, pending: 0, status: "Complete" },
        { name: "Fire Marshal", inspections: 3, passed: 3, pending: 0, status: "Complete" },
        { name: "Electrical", inspections: 4, passed: 4, pending: 0, status: "Complete" },
        { name: "Plumbing", inspections: 3, passed: 3, pending: 0, status: "Complete" },
        { name: "HVAC", inspections: 2, passed: 1, pending: 1, status: "In Progress" },
        { name: "Elevator", inspections: 2, passed: 1, pending: 1, status: "In Progress" },
        { name: "Accessibility", inspections: 1, passed: 0, pending: 1, status: "Scheduled" },
        { name: "Environmental", inspections: 1, passed: 1, pending: 0, status: "Complete" },
      ],
    },
    punchList: {
      totalItems: 47,
      completedItems: 38,
      inProgressItems: 6,
      pendingItems: 3,
      categories: [
        { name: "Architectural", total: 18, completed: 15, inProgress: 2, pending: 1, priority: "Medium" },
        { name: "MEP", total: 12, completed: 10, inProgress: 2, pending: 0, priority: "High" },
        { name: "Structural", total: 3, completed: 3, inProgress: 0, pending: 0, priority: "Low" },
        { name: "Finishes", total: 8, completed: 6, inProgress: 1, pending: 1, priority: "Medium" },
        { name: "Exterior", total: 4, completed: 3, inProgress: 1, pending: 0, priority: "High" },
        { name: "Site Work", total: 2, completed: 1, inProgress: 0, pending: 1, priority: "Low" },
      ],
      recentItems: [
        {
          id: "PL-001",
          description: "Touch up paint in lobby",
          category: "Architectural",
          priority: "Low",
          status: "Complete",
          assignedTo: "Painting Crew",
        },
        {
          id: "PL-002",
          description: "Fix HVAC control panel",
          category: "MEP",
          priority: "High",
          status: "In Progress",
          assignedTo: "HVAC Tech",
        },
        {
          id: "PL-003",
          description: "Install missing door hardware",
          category: "Architectural",
          priority: "Medium",
          status: "Pending",
          assignedTo: "Carpenter",
        },
        {
          id: "PL-004",
          description: "Clean exterior windows",
          category: "Exterior",
          priority: "Low",
          status: "Complete",
          assignedTo: "Cleaning Crew",
        },
      ],
    },
    documentation: {
      totalDocuments: 156,
      completedDocuments: 133,
      pendingDocuments: 23,
      categories: [
        { name: "As-Built Drawings", total: 45, completed: 40, pending: 5, status: "In Progress" },
        { name: "Operating Manuals", total: 28, completed: 25, pending: 3, status: "In Progress" },
        { name: "Warranties", total: 34, completed: 32, pending: 2, status: "In Progress" },
        { name: "Maintenance Records", total: 18, completed: 15, pending: 3, status: "In Progress" },
        { name: "Training Materials", total: 12, completed: 8, pending: 4, status: "In Progress" },
        { name: "Permits & Approvals", total: 8, completed: 6, pending: 2, status: "In Progress" },
        { name: "Test Reports", total: 11, completed: 7, pending: 4, status: "In Progress" },
      ],
      criticalDocuments: [
        { name: "Certificate of Occupancy", status: "Pending", dueDate: "2024-02-10", responsible: "Building Dept" },
        { name: "Fire Safety Certificate", status: "Pending", dueDate: "2024-02-08", responsible: "Fire Marshal" },
        { name: "Elevator Certificate", status: "Pending", dueDate: "2024-02-12", responsible: "Elevator Inspector" },
        { name: "Final As-Built Package", status: "In Progress", dueDate: "2024-02-14", responsible: "Design Team" },
      ],
    },
    handover: {
      totalActivities: 24,
      completedActivities: 18,
      pendingActivities: 6,
      clientTrainingSessions: 8,
      completedTraining: 5,
      pendingTraining: 3,
      categories: [
        { name: "System Training", total: 8, completed: 5, pending: 3, status: "In Progress" },
        { name: "Documentation Transfer", total: 6, completed: 5, pending: 1, status: "In Progress" },
        { name: "Key Handover", total: 4, completed: 4, pending: 0, status: "Complete" },
        { name: "Walk-through", total: 3, completed: 2, pending: 1, status: "In Progress" },
        { name: "Final Approvals", total: 3, completed: 2, pending: 1, status: "In Progress" },
      ],
      upcomingActivities: [
        { name: "HVAC System Training", date: "2024-02-02", attendees: 6, status: "Scheduled" },
        { name: "Security System Training", date: "2024-02-05", attendees: 4, status: "Scheduled" },
        { name: "Final Walk-through", date: "2024-02-08", attendees: 12, status: "Scheduled" },
        { name: "Client Acceptance", date: "2024-02-12", attendees: 8, status: "Pending" },
      ],
    },
  }

  const inspectionProgress =
    (closeoutData.inspections.passedInspections / closeoutData.inspections.totalInspections) * 100
  const punchListProgress = (closeoutData.punchList.completedItems / closeoutData.punchList.totalItems) * 100
  const documentationProgress =
    (closeoutData.documentation.completedDocuments / closeoutData.documentation.totalDocuments) * 100
  const handoverProgress = (closeoutData.handover.completedActivities / closeoutData.handover.totalActivities) * 100

  return (
    <div className="space-y-6">
      {/* Stage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Final Inspections</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(inspectionProgress)}%</div>
            <p className="text-xs text-muted-foreground">
              {closeoutData.inspections.passedInspections} of {closeoutData.inspections.totalInspections} complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Punch List</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(punchListProgress)}%</div>
            <p className="text-xs text-muted-foreground">
              {closeoutData.punchList.completedItems} of {closeoutData.punchList.totalItems} items complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentation</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(documentationProgress)}%</div>
            <p className="text-xs text-muted-foreground">
              {closeoutData.documentation.completedDocuments} of {closeoutData.documentation.totalDocuments} documents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Handover Progress</CardTitle>
            <HandHeart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(handoverProgress)}%</div>
            <p className="text-xs text-muted-foreground">
              {closeoutData.handover.completedActivities} of {closeoutData.handover.totalActivities} activities
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="inspections" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="punchlist">Punch List</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="handover">Handover</TabsTrigger>
        </TabsList>

        {/* Inspections Tab */}
        <TabsContent value="inspections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Final Inspections Status
                {closeoutData.inspections.pendingInspections > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {closeoutData.inspections.pendingInspections} Pending
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress Overview */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Inspection Progress</span>
                    <span>{Math.round(inspectionProgress)}%</span>
                  </div>
                  <Progress value={inspectionProgress} className="w-full" />
                </div>

                {/* Inspection Categories */}
                <div className="space-y-3">
                  <h4 className="font-medium">Inspection Categories</h4>
                  {closeoutData.inspections.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {category.passed} passed, {category.pending} pending
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            category.status === "Complete"
                              ? "default"
                              : category.status === "In Progress"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {category.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{category.inspections} total</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule Inspection
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Inspection Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Punch List Tab */}
        <TabsContent value="punchlist" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Punch List Management
                {closeoutData.punchList.pendingItems > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {closeoutData.punchList.pendingItems + closeoutData.punchList.inProgressItems} Remaining
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress Overview */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Punch List Progress</span>
                    <span>{Math.round(punchListProgress)}%</span>
                  </div>
                  <Progress value={punchListProgress} className="w-full" />
                </div>

                {/* Categories Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-medium">Punch List by Category</h4>
                  {closeoutData.punchList.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {category.completed} completed, {category.inProgress} in progress, {category.pending}{" "}
                            pending
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            category.priority === "High"
                              ? "destructive"
                              : category.priority === "Medium"
                              ? "secondary"
                              : "default"
                          }
                          className="text-xs"
                        >
                          {category.priority}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{category.total} total</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Items */}
                <div className="space-y-3">
                  <h4 className="font-medium">Recent Punch List Items</h4>
                  {closeoutData.punchList.recentItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{item.id}</span>
                          <span className="text-sm text-muted-foreground">{item.description}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            item.status === "Complete"
                              ? "default"
                              : item.status === "In Progress"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {item.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{item.assignedTo}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Punch Item
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Punch List
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentation Tab */}
        <TabsContent value="documentation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Project Documentation
                {closeoutData.documentation.pendingDocuments > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {closeoutData.documentation.pendingDocuments} Pending
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress Overview */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Documentation Progress</span>
                    <span>{Math.round(documentationProgress)}%</span>
                  </div>
                  <Progress value={documentationProgress} className="w-full" />
                </div>

                {/* Document Categories */}
                <div className="space-y-3">
                  <h4 className="font-medium">Document Categories</h4>
                  {closeoutData.documentation.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {category.completed} of {category.total} complete
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={category.status === "Complete" ? "default" : "secondary"} className="text-xs">
                          {category.status}
                        </Badge>
                        <Progress value={(category.completed / category.total) * 100} className="w-20" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Critical Documents */}
                <div className="space-y-3">
                  <h4 className="font-medium">Critical Documents</h4>
                  {closeoutData.documentation.criticalDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{doc.name}</span>
                          <span className="text-sm text-muted-foreground">
                            Due: {new Date(doc.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            doc.status === "Complete"
                              ? "default"
                              : doc.status === "In Progress"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {doc.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{doc.responsible}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Document
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Document List
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Handover Tab */}
        <TabsContent value="handover" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HandHeart className="h-5 w-5" />
                Project Handover
                {closeoutData.handover.pendingActivities > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {closeoutData.handover.pendingActivities} Pending
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Handover Progress</span>
                      <span>{Math.round(handoverProgress)}%</span>
                    </div>
                    <Progress value={handoverProgress} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Training Sessions</span>
                      <span>
                        {Math.round(
                          (closeoutData.handover.completedTraining / closeoutData.handover.clientTrainingSessions) * 100
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        (closeoutData.handover.completedTraining / closeoutData.handover.clientTrainingSessions) * 100
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Handover Categories */}
                <div className="space-y-3">
                  <h4 className="font-medium">Handover Categories</h4>
                  {closeoutData.handover.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {category.completed} of {category.total} complete
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            category.status === "Complete"
                              ? "default"
                              : category.status === "In Progress"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {category.status}
                        </Badge>
                        <Progress value={(category.completed / category.total) * 100} className="w-20" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upcoming Activities */}
                <div className="space-y-3">
                  <h4 className="font-medium">Upcoming Handover Activities</h4>
                  {closeoutData.handover.upcomingActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{activity.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString()} - {activity.attendees} attendees
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={activity.status === "Scheduled" ? "default" : "secondary"} className="text-xs">
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule Training
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Handover Plan
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
