"use client"

import React from "react"
import { StageViewProps } from "@/types/project-stage-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  User,
  FileText,
  Settings,
  Star,
} from "lucide-react"

export const WarrantyStageView = ({ project, projectData, stageConfig }: StageViewProps) => {
  // Mock warranty data
  const warrantyData = {
    warrantyPeriodMonths: 24,
    monthsRemaining: 18,
    totalClaims: 23,
    activeClaims: 7,
    resolvedClaims: 16,
    averageResolutionTime: 4.2,
    clientSatisfactionScore: 4.3,
    totalWarrantyCosts: 38750,
    preventiveMaintenance: 89.5,
    recentClaims: [
      {
        id: "WC-2024-001",
        type: "HVAC",
        severity: "Medium",
        status: "Open",
        submitted: "2024-01-08",
        assignedTo: "Mike Johnson",
        description: "Temperature inconsistency in west wing",
        estimatedCost: 1200,
      },
      {
        id: "WC-2024-002",
        type: "Plumbing",
        severity: "High",
        status: "In Progress",
        submitted: "2024-01-10",
        assignedTo: "Sarah Wilson",
        description: "Leak in second floor bathroom",
        estimatedCost: 2800,
      },
      {
        id: "WC-2024-003",
        type: "Electrical",
        severity: "Low",
        status: "Resolved",
        submitted: "2024-01-05",
        assignedTo: "John Smith",
        description: "Outlet not working in master bedroom",
        estimatedCost: 450,
      },
    ],
    maintenanceSchedule: [
      { task: "HVAC System Inspection", due: "2024-02-15", status: "scheduled", priority: "High" },
      { task: "Plumbing System Check", due: "2024-02-20", status: "completed", priority: "Medium" },
      { task: "Electrical Panel Inspection", due: "2024-02-25", status: "scheduled", priority: "Medium" },
      { task: "Roof Inspection", due: "2024-03-01", status: "pending", priority: "Low" },
    ],
    clientCommunications: [
      { date: "2024-01-10", type: "Email", subject: "Warranty Claim Status Update", from: "warranty@company.com" },
      { date: "2024-01-08", type: "Phone", subject: "New warranty claim discussion", from: "Mike Johnson" },
      { date: "2024-01-05", type: "Email", subject: "Resolved claim notification", from: "warranty@company.com" },
    ],
    warrantyCategories: [
      { category: "HVAC", claims: 8, totalCost: 12400, avgResolutionDays: 5.2 },
      { category: "Plumbing", claims: 6, totalCost: 15600, avgResolutionDays: 3.8 },
      { category: "Electrical", claims: 4, totalCost: 4200, avgResolutionDays: 2.1 },
      { category: "Structural", claims: 2, totalCost: 4800, avgResolutionDays: 7.5 },
      { category: "Finishes", claims: 3, totalCost: 1750, avgResolutionDays: 4.0 },
    ],
  }

  const warrantyProgress =
    ((warrantyData.warrantyPeriodMonths - warrantyData.monthsRemaining) / warrantyData.warrantyPeriodMonths) * 100
  const resolutionRate = Math.round((warrantyData.resolvedClaims / warrantyData.totalClaims) * 100)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "in_progress":
      case "scheduled":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "open":
      case "pending":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Stage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warranty Period</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warrantyData.monthsRemaining}</div>
            <p className="text-xs text-muted-foreground">months remaining</p>
            <Progress value={warrantyProgress} className="w-full mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Claims</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warrantyData.activeClaims}</div>
            <p className="text-xs text-muted-foreground">{warrantyData.totalClaims} total claims</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolutionRate}%</div>
            <p className="text-xs text-muted-foreground">{warrantyData.resolvedClaims} resolved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warrantyData.clientSatisfactionScore}</div>
            <p className="text-xs text-muted-foreground">out of 5.0</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Claims Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Active Warranty Claims
            {warrantyData.activeClaims > 0 && (
              <Badge variant="destructive" className="ml-2">
                {warrantyData.activeClaims} Active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {warrantyData.recentClaims.map((claim) => (
              <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="font-medium">{claim.id}</span>
                    <span className="text-sm text-muted-foreground">{claim.type}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{claim.description}</span>
                    <span className="text-xs text-muted-foreground">
                      Submitted: {new Date(claim.submitted).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatCurrency(claim.estimatedCost)}</div>
                    <div className="text-xs text-muted-foreground">{claim.assignedTo}</div>
                  </div>
                  <Badge variant="outline" className={`text-xs ${getSeverityColor(claim.severity)}`}>
                    {claim.severity}
                  </Badge>
                  <Badge
                    variant={claim.status === "Resolved" ? "default" : "secondary"}
                    className={`text-xs ${getStatusColor(claim.status.toLowerCase())}`}
                  >
                    {claim.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Button className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Log New Claim
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              View All Claims
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Warranty Categories Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Warranty Categories Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {warrantyData.warrantyCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{category.category}</span>
                    <span className="text-sm text-muted-foreground">{category.claims} claims</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatCurrency(category.totalCost)}</div>
                    <div className="text-xs text-muted-foreground">Total cost</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{category.avgResolutionDays} days</div>
                    <div className="text-xs text-muted-foreground">Avg resolution</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preventive Maintenance & Client Communications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Preventive Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Maintenance Compliance</span>
                <span className="text-sm font-medium">{warrantyData.preventiveMaintenance}%</span>
              </div>
              <Progress value={warrantyData.preventiveMaintenance} className="w-full" />

              <div className="space-y-3 mt-4">
                <h4 className="font-medium text-sm">Upcoming Tasks</h4>
                {warrantyData.maintenanceSchedule.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{task.task}</span>
                      <span className="text-xs text-muted-foreground">
                        Due: {new Date(task.due).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </Badge>
                      <Badge
                        variant={task.status === "completed" ? "default" : "secondary"}
                        className={`text-xs ${getStatusColor(task.status)}`}
                      >
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Maintenance
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Client Communications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {warrantyData.clientCommunications.map((comm, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{comm.subject}</span>
                      <span className="text-xs text-muted-foreground">{comm.from}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {comm.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{new Date(comm.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Send Update
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Schedule Call
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warranty Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Warranty Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Total Warranty Costs</div>
              <div className="text-2xl font-bold">{formatCurrency(warrantyData.totalWarrantyCosts)}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Avg Resolution Time</div>
              <div className="text-2xl font-bold">{warrantyData.averageResolutionTime} days</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Client Satisfaction</div>
              <div className="text-2xl font-bold">{warrantyData.clientSatisfactionScore}/5.0</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Prevention Rate</div>
              <div className="text-2xl font-bold">{warrantyData.preventiveMaintenance}%</div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Client Survey
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
