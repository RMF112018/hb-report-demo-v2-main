"use client"

import React from "react"
import { StageViewProps } from "@/types/project-stage-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  HardHat,
  Activity,
  Calendar,
  Users,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Truck,
  Wrench,
  Shield,
  BarChart3,
  PieChart,
  Download,
  Upload,
  Edit,
  Plus,
  MapPin,
  Camera,
  Thermometer,
  Zap,
} from "lucide-react"

export const ConstructionStageView = ({ project, projectData, stageConfig }: StageViewProps) => {
  // Mock Construction data
  const constructionData = {
    dailyProgress: {
      scheduleVariance: -3.2,
      completionPercentage: 67.8,
      workersOnSite: 124,
      activeTrades: 8,
      weatherConditions: "Sunny, 74°F",
      hoursWorked: 992,
      productivityIndex: 94.2,
      milestoneProgress: [
        { name: "Foundation", completion: 100, status: "Complete" },
        { name: "Framing", completion: 100, status: "Complete" },
        { name: "Roofing", completion: 95, status: "In Progress" },
        { name: "MEP Rough-In", completion: 78, status: "In Progress" },
        { name: "Drywall", completion: 45, status: "In Progress" },
        { name: "Finishes", completion: 12, status: "Started" },
        { name: "Final Inspections", completion: 0, status: "Not Started" },
      ],
    },
    fieldReports: [
      { date: "2024-01-15", type: "Daily Log", status: "Submitted", issues: 2, crew: "A-Team" },
      { date: "2024-01-14", type: "Daily Log", status: "Submitted", issues: 0, crew: "B-Team" },
      { date: "2024-01-13", type: "Weekly Report", status: "Submitted", issues: 1, crew: "All Teams" },
      { date: "2024-01-12", type: "Daily Log", status: "Pending", issues: 3, crew: "C-Team" },
    ],
    safetyMetrics: {
      daysSinceIncident: 47,
      totalIncidents: 3,
      nearMisses: 12,
      safetyScore: 92.5,
      trainingCompliance: 88.2,
      ppeCompliance: 96.8,
      inspectionsPassed: 23,
      inspectionsFailed: 2,
      recentIncidents: [
        { date: "2024-01-10", type: "Near Miss", description: "Slippery surface", severity: "Low" },
        { date: "2024-01-08", type: "Minor Injury", description: "Cut finger", severity: "Low" },
        { date: "2024-01-05", type: "Equipment Issue", description: "Crane inspection", severity: "Medium" },
      ],
    },
    qualityControl: {
      inspectionsPassed: 89,
      inspectionsFailed: 8,
      deficiencyReports: 15,
      reworkCost: 125000,
      qualityScore: 91.8,
      activeNonCompliance: 3,
      categories: [
        { name: "Structural", passed: 22, failed: 1, score: 95.7 },
        { name: "MEP", passed: 18, failed: 3, score: 85.7 },
        { name: "Architectural", passed: 25, failed: 2, score: 92.6 },
        { name: "Civil", passed: 15, failed: 1, score: 93.8 },
        { name: "Finishes", passed: 9, failed: 1, score: 90.0 },
      ],
    },
    materialManagement: {
      totalDeliveries: 1247,
      scheduledDeliveries: 34,
      lateDeliveries: 89,
      onTimeRate: 92.9,
      wastePercentage: 3.7,
      storageUtilization: 78.5,
      criticalMaterials: [
        { name: "Steel Reinforcement", status: "On Schedule", arriving: "2024-01-16", quantity: "45 tons" },
        { name: "Concrete", status: "On Schedule", arriving: "2024-01-17", quantity: "180 yds³" },
        { name: "Electrical Fixtures", status: "Delayed", arriving: "2024-01-20", quantity: "200 units" },
        { name: "HVAC Units", status: "Early", arriving: "2024-01-15", quantity: "8 units" },
      ],
    },
    manpower: {
      totalWorkers: 124,
      directHire: 45,
      subcontractors: 79,
      attendance: 96.2,
      efficiency: 88.9,
      overtimeHours: 245,
      trades: [
        { name: "Electricians", count: 18, efficiency: 92.3, utilization: 89.5 },
        { name: "Plumbers", count: 12, efficiency: 87.6, utilization: 85.2 },
        { name: "Carpenters", count: 22, efficiency: 91.1, utilization: 94.8 },
        { name: "Concrete Workers", count: 15, efficiency: 88.4, utilization: 92.1 },
        { name: "Roofers", count: 8, efficiency: 93.7, utilization: 78.9 },
      ],
    },
  }

  const scheduleHealth = constructionData.dailyProgress.scheduleVariance >= 0 ? "On Track" : "Behind Schedule"
  const avgQualityScore =
    constructionData.qualityControl.categories.reduce((sum, cat) => sum + cat.score, 0) /
    constructionData.qualityControl.categories.length

  return (
    <div className="space-y-6">
      {/* Stage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{constructionData.dailyProgress.completionPercentage}%</div>
            <p className="text-xs text-muted-foreground">
              {constructionData.dailyProgress.scheduleVariance >= 0 ? "+" : ""}
              {constructionData.dailyProgress.scheduleVariance}% vs schedule
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workers On Site</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{constructionData.dailyProgress.workersOnSite}</div>
            <p className="text-xs text-muted-foreground">{constructionData.dailyProgress.activeTrades} active trades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{constructionData.safetyMetrics.safetyScore}%</div>
            <p className="text-xs text-muted-foreground">
              {constructionData.safetyMetrics.daysSinceIncident} days since incident
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgQualityScore)}%</div>
            <p className="text-xs text-muted-foreground">
              {constructionData.qualityControl.activeNonCompliance} active issues
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="manpower">Manpower</TabsTrigger>
        </TabsList>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Daily Progress Overview
                <Badge variant={scheduleHealth === "On Track" ? "default" : "destructive"} className="ml-2">
                  {scheduleHealth}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Overall Progress */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Completion</span>
                      <span>{constructionData.dailyProgress.completionPercentage}%</span>
                    </div>
                    <Progress value={constructionData.dailyProgress.completionPercentage} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Productivity Index</span>
                      <span>{constructionData.dailyProgress.productivityIndex}%</span>
                    </div>
                    <Progress value={constructionData.dailyProgress.productivityIndex} className="w-full" />
                  </div>
                </div>

                {/* Milestone Progress */}
                <div className="space-y-3">
                  <h4 className="font-medium">Milestone Progress</h4>
                  {constructionData.dailyProgress.milestoneProgress.map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{milestone.name}</span>
                          <span className="text-sm text-muted-foreground">{milestone.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            milestone.status === "Complete"
                              ? "default"
                              : milestone.status === "In Progress"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {milestone.completion}%
                        </Badge>
                        <Progress value={milestone.completion} className="w-20" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Update Progress
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Progress Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Safety Tab */}
        <TabsContent value="safety" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Safety Management
                <Badge variant="default" className="ml-2">
                  {constructionData.safetyMetrics.daysSinceIncident} Days Safe
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Safety Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Safety Score</span>
                      <span>{constructionData.safetyMetrics.safetyScore}%</span>
                    </div>
                    <Progress value={constructionData.safetyMetrics.safetyScore} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Training Compliance</span>
                      <span>{constructionData.safetyMetrics.trainingCompliance}%</span>
                    </div>
                    <Progress value={constructionData.safetyMetrics.trainingCompliance} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>PPE Compliance</span>
                      <span>{constructionData.safetyMetrics.ppeCompliance}%</span>
                    </div>
                    <Progress value={constructionData.safetyMetrics.ppeCompliance} className="w-full" />
                  </div>
                </div>

                {/* Recent Incidents */}
                <div className="space-y-3">
                  <h4 className="font-medium">Recent Safety Events</h4>
                  {constructionData.safetyMetrics.recentIncidents.map((incident, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{incident.type}</span>
                          <span className="text-sm text-muted-foreground">{incident.description}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            incident.severity === "High"
                              ? "destructive"
                              : incident.severity === "Medium"
                              ? "secondary"
                              : "default"
                          }
                          className="text-xs"
                        >
                          {incident.severity}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(incident.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Report Incident
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Safety Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quality Tab */}
        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Quality Control
                {constructionData.qualityControl.activeNonCompliance > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {constructionData.qualityControl.activeNonCompliance} Active Issues
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Quality Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Quality Score</span>
                      <span>{constructionData.qualityControl.qualityScore}%</span>
                    </div>
                    <Progress value={constructionData.qualityControl.qualityScore} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Inspection Pass Rate</span>
                      <span>
                        {Math.round(
                          (constructionData.qualityControl.inspectionsPassed /
                            (constructionData.qualityControl.inspectionsPassed +
                              constructionData.qualityControl.inspectionsFailed)) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        (constructionData.qualityControl.inspectionsPassed /
                          (constructionData.qualityControl.inspectionsPassed +
                            constructionData.qualityControl.inspectionsFailed)) *
                        100
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Categories Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-medium">Quality by Category</h4>
                  {constructionData.qualityControl.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {category.passed} passed, {category.failed} failed
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            category.score >= 95 ? "default" : category.score >= 85 ? "secondary" : "destructive"
                          }
                          className="text-xs"
                        >
                          {category.score.toFixed(1)}%
                        </Badge>
                        <Progress value={category.score} className="w-20" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Log Inspection
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Quality Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Material Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Material Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>On-Time Delivery</span>
                      <span>{constructionData.materialManagement.onTimeRate}%</span>
                    </div>
                    <Progress value={constructionData.materialManagement.onTimeRate} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Storage Utilization</span>
                      <span>{constructionData.materialManagement.storageUtilization}%</span>
                    </div>
                    <Progress value={constructionData.materialManagement.storageUtilization} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Waste Percentage</span>
                      <span>{constructionData.materialManagement.wastePercentage}%</span>
                    </div>
                    <Progress value={constructionData.materialManagement.wastePercentage} className="w-full" />
                  </div>
                </div>

                {/* Critical Materials */}
                <div className="space-y-3">
                  <h4 className="font-medium">Critical Materials Tracking</h4>
                  {constructionData.materialManagement.criticalMaterials.map((material, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{material.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {material.quantity} - Arriving {new Date(material.arriving).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            material.status === "On Schedule"
                              ? "default"
                              : material.status === "Early"
                              ? "secondary"
                              : "destructive"
                          }
                          className="text-xs"
                        >
                          {material.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Log Delivery
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Material Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manpower Tab */}
        <TabsContent value="manpower" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardHat className="h-5 w-5" />
                Workforce Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Workforce Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Attendance Rate</span>
                      <span>{constructionData.manpower.attendance}%</span>
                    </div>
                    <Progress value={constructionData.manpower.attendance} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Efficiency Rate</span>
                      <span>{constructionData.manpower.efficiency}%</span>
                    </div>
                    <Progress value={constructionData.manpower.efficiency} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overtime Hours</span>
                      <span>{constructionData.manpower.overtimeHours}h</span>
                    </div>
                    <Progress
                      value={Math.min((constructionData.manpower.overtimeHours / 500) * 100, 100)}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Trade Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-medium">Trade Performance</h4>
                  {constructionData.manpower.trades.map((trade, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{trade.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {trade.count} workers - {trade.utilization}% utilization
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            trade.efficiency >= 90 ? "default" : trade.efficiency >= 80 ? "secondary" : "destructive"
                          }
                          className="text-xs"
                        >
                          {trade.efficiency}% Efficiency
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Log Attendance
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Workforce Report
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
