"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Button } from "./button"
import { Badge } from "./badge"
import { Switch } from "./switch"
import { Label } from "./label"
import { Building2, DollarSign, Calendar, Users, CheckCircle, Clock } from "lucide-react"
import { ProtectedGrid, ProtectedColDef, GridRow, createGridWithTotalsAndSticky } from "./protected-grid"

const ProtectedGridExample = () => {
  const [protectionMode, setProtectionMode] = useState(true)
  const [betaMode, setBetaMode] = useState(false)

  // Sample data
  const sampleData: GridRow[] = [
    {
      id: "1",
      projectNumber: "HBC-2024-001",
      name: "Downtown Office Complex",
      client: "ABC Development",
      budget: 2500000,
      startDate: "2024-02-01",
      status: "Active",
      progress: 65,
      estimator: "John Smith",
      sensitive: "Confidential pricing data",
    },
    {
      id: "2",
      projectNumber: "HBC-2024-002",
      name: "Retail Shopping Center",
      client: "XYZ Properties",
      budget: 3200000,
      startDate: "2024-03-15",
      status: "Planning",
      progress: 25,
      estimator: "Sarah Johnson",
      sensitive: "Client negotiations pending",
    },
    {
      id: "3",
      projectNumber: "HBC-2024-003",
      name: "Industrial Warehouse",
      client: "Manufacturing Corp",
      budget: 1800000,
      startDate: "2024-01-20",
      status: "Complete",
      progress: 100,
      estimator: "Mike Davis",
      sensitive: "Final cost overruns",
    },
    {
      id: "4",
      projectNumber: "HBC-2024-004",
      name: "Healthcare Facility",
      client: "Regional Health",
      budget: 4500000,
      startDate: "2024-04-01",
      status: "Bidding",
      progress: 10,
      estimator: "Lisa Chen",
      sensitive: "Competitive pricing strategy",
    },
    {
      id: "5",
      projectNumber: "HBC-2024-005",
      name: "Educational Campus",
      client: "State University",
      budget: 8200000,
      startDate: "2024-05-10",
      status: "Active",
      progress: 45,
      estimator: "David Wilson",
      sensitive: "State budget constraints",
    },
  ]

  // Enhanced cell renderers
  const StatusCellRenderer = ({ value }: { value: any }) => {
    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case "complete":
          return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        case "active":
          return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        case "planning":
          return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
        case "bidding":
          return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      }
    }

    return <Badge className={`text-xs ${getStatusColor(value)}`}>{value}</Badge>
  }

  const ProgressCellRenderer = ({ value }: { value: any }) => {
    const getProgressColor = (progress: number) => {
      if (progress >= 80) return "bg-green-500"
      if (progress >= 50) return "bg-blue-500"
      if (progress >= 25) return "bg-yellow-500"
      return "bg-red-500"
    }

    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getProgressColor(value)}`}
            style={{ width: `${value}%` }}
          />
        </div>
        <span className="text-xs font-medium">{value}%</span>
      </div>
    )
  }

  // Column definitions
  const columns: ProtectedColDef[] = [
    {
      field: "projectNumber",
      headerName: "Project #",
      width: 140,
      pinned: "left",
      cellRenderer: ({ value }) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          <span className="font-medium">{value}</span>
        </div>
      ),
      protection: { level: "read-only", message: "Project numbers are system-generated" },
    },
    {
      field: "name",
      headerName: "Project Name",
      width: 200,
      pinned: "left",
      cellRenderer: ({ value }) => <span className="font-medium">{value}</span>,
    },
    {
      field: "client",
      headerName: "Client",
      width: 150,
      cellRenderer: ({ value }) => (
        <div className="flex items-center gap-2">
          <Users className="h-3 w-3 text-muted-foreground" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      field: "budget",
      headerName: "Budget",
      width: 140,
      cellRenderer: ({ value }) => (
        <div className="flex items-center gap-2 font-medium">
          <DollarSign className="h-3 w-3 text-green-600" />
          <span>
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(
              value
            )}
          </span>
        </div>
      ),
      protection: {
        level: "none",
        validator: (value) => {
          const num = parseFloat(value)
          if (isNaN(num) || num < 0) return "Budget must be a positive number"
          if (num > 100000000) return "Budget cannot exceed $100M"
          return true
        },
      },
    },
    {
      field: "startDate",
      headerName: "Start Date",
      width: 120,
      cellRenderer: ({ value }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span>{new Date(value).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      cellRenderer: StatusCellRenderer,
    },
    {
      field: "progress",
      headerName: "Progress",
      width: 120,
      cellRenderer: ProgressCellRenderer,
      protection: { level: "read-only", message: "Progress is calculated automatically" },
    },
    {
      field: "estimator",
      headerName: "Estimator",
      width: 130,
      cellRenderer: ({ value }) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium">
              {value
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      field: "sensitive",
      headerName: "Sensitive Data",
      width: 180,
      protection: {
        level: "hidden",
        allowedRoles: ["admin", "executive"],
        message: "This data is restricted to senior management",
      },
    },
  ]

  const gridConfig = createGridWithTotalsAndSticky(2, true, {
    allowExport: true,
    allowRowSelection: true,
    allowMultiSelection: false,
    protectionEnabled: protectionMode,
    userRole: "estimator",
    theme: "quartz",
  })

  const totalsCalculator = (data: GridRow[], columnField: string): number | string => {
    if (columnField === "budget") {
      const total = data.reduce((sum, row) => sum + (row.budget as number), 0)
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(
        total
      )
    }
    if (columnField === "progress") {
      const values = data.map((row) => row.progress as number)
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length
      return `${Math.round(avg)}%`
    }
    return ""
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Protected Grid Example</h2>
          <p className="text-muted-foreground">
            Demonstration of the enhanced protected grid component with role-based access control
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="beta-mode">Beta Mode</Label>
            <Switch id="beta-mode" checked={betaMode} onCheckedChange={setBetaMode} />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="protection-mode">Protection Mode</Label>
            <Switch id="protection-mode" checked={protectionMode} onCheckedChange={setProtectionMode} />
          </div>
        </div>
      </div>

      {betaMode && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-800 dark:text-blue-200">Beta Mode Active</span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            Enhanced grid features enabled including advanced protection, export capabilities, and Excel-like
            functionality
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Project Data Grid</CardTitle>
        </CardHeader>
        <CardContent>
          <ProtectedGrid
            columnDefs={columns}
            rowData={sampleData}
            config={gridConfig}
            height="500px"
            title="Project Management Dashboard"
            enableSearch={true}
            totalsCalculator={totalsCalculator}
            events={{
              onCellValueChanged: (event) => {
                console.log("Cell value changed:", event.column.getId(), event.newValue)
              },
              onProtectionViolation: (message) => {
                console.log("Protection violation:", message)
              },
            }}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleData.length}</div>
            <p className="text-sm text-muted-foreground">Active projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(
                sampleData.reduce((sum, project) => sum + (project.budget as number), 0)
              )}
            </div>
            <p className="text-sm text-muted-foreground">Combined value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Avg Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                sampleData.reduce((sum, project) => sum + (project.progress as number), 0) / sampleData.length
              )}
              %
            </div>
            <p className="text-sm text-muted-foreground">Overall completion</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProtectedGridExample
