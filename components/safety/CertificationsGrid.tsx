/**
 * @fileoverview Safety Certifications Grid Component
 * @module CertificationsGrid
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Grid component for displaying employee certifications and training records
 * Uses protected-grid.tsx for data security and role-based access
 */

"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { ProtectedGrid, createProtectedColumn, type GridRow } from "../ui/protected-grid"
import { Award, Calendar, User, AlertTriangle, CheckCircle, Clock, Download, Plus, RefreshCw } from "lucide-react"

export const CertificationsGrid: React.FC = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock certifications data
  const certificationsData: GridRow[] = [
    {
      id: 1,
      employee: "John Smith",
      role: "Project Manager",
      certification: "OSHA 30-Hour Construction",
      issuedDate: "2023-03-15",
      expiryDate: "2026-03-15",
      status: "Active",
      issuer: "OSHA",
      certificateNumber: "OSH-2023-001",
      reminderSent: false,
    },
    {
      id: 2,
      employee: "Sarah Johnson",
      role: "Safety Manager",
      certification: "Certified Safety Professional (CSP)",
      issuedDate: "2022-06-20",
      expiryDate: "2025-06-20",
      status: "Active",
      issuer: "BCSP",
      certificateNumber: "CSP-2022-045",
      reminderSent: false,
    },
    {
      id: 3,
      employee: "Mike Wilson",
      role: "Site Supervisor",
      certification: "First Aid/CPR",
      issuedDate: "2024-01-10",
      expiryDate: "2025-01-10",
      status: "Expiring Soon",
      issuer: "Red Cross",
      certificateNumber: "RC-2024-123",
      reminderSent: true,
    },
    {
      id: 4,
      employee: "Lisa Davis",
      role: "Quality Inspector",
      certification: "Competent Person - Fall Protection",
      issuedDate: "2023-09-05",
      expiryDate: "2025-09-05",
      status: "Active",
      issuer: "OSHA",
      certificateNumber: "OSH-2023-089",
      reminderSent: false,
    },
    {
      id: 5,
      employee: "Robert Brown",
      role: "Equipment Operator",
      certification: "Crane Operator Certification",
      issuedDate: "2022-12-01",
      expiryDate: "2024-12-01",
      status: "Expired",
      issuer: "NCCCO",
      certificateNumber: "CCO-2022-456",
      reminderSent: true,
    },
    {
      id: 6,
      employee: "Jennifer Lee",
      role: "Safety Coordinator",
      certification: "OSHA 10-Hour Construction",
      issuedDate: "2023-11-15",
      expiryDate: "2027-11-15",
      status: "Active",
      issuer: "OSHA",
      certificateNumber: "OSH-2023-156",
      reminderSent: false,
    },
    {
      id: 7,
      employee: "David Martinez",
      role: "Foreman",
      certification: "Hazmat Transportation",
      issuedDate: "2024-02-20",
      expiryDate: "2026-02-20",
      status: "Active",
      issuer: "DOT",
      certificateNumber: "DOT-2024-789",
      reminderSent: false,
    },
    {
      id: 8,
      employee: "Amanda Taylor",
      role: "Environmental Manager",
      certification: "Environmental Compliance",
      issuedDate: "2023-08-10",
      expiryDate: "2025-08-10",
      status: "Active",
      issuer: "EPA",
      certificateNumber: "EPA-2023-234",
      reminderSent: false,
    },
  ]

  // Column definitions using protected-grid
  const columnDefs = [
    createProtectedColumn("employee", "Employee", { level: "none" }, { width: 150, pinned: "left" }),
    createProtectedColumn("role", "Role", { level: "none" }, { width: 130 }),
    createProtectedColumn("certification", "Certification", { level: "none" }, { width: 200 }),
    createProtectedColumn("issuedDate", "Issued Date", { level: "none" }, { width: 120 }),
    createProtectedColumn("expiryDate", "Expiry Date", { level: "none" }, { width: 120 }),
    createProtectedColumn(
      "status",
      "Status",
      { level: "none" },
      {
        width: 130,
        cellRenderer: (params: any) => {
          const status = params.value
          let variant: "default" | "secondary" | "destructive" | "outline" = "default"
          let className = ""

          switch (status) {
            case "Active":
              variant = "default"
              className = "bg-green-100 text-green-800 border-green-200"
              break
            case "Expiring Soon":
              variant = "destructive"
              className = "bg-orange-100 text-orange-800 border-orange-200"
              break
            case "Expired":
              variant = "destructive"
              className = "bg-red-100 text-red-800 border-red-200"
              break
            default:
              variant = "secondary"
          }

          return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}">${status}</span>`
        },
      }
    ),
    createProtectedColumn("issuer", "Issuer", { level: "none" }, { width: 100 }),
    createProtectedColumn("certificateNumber", "Certificate #", { level: "read-only" }, { width: 130 }),
    createProtectedColumn(
      "reminderSent",
      "Reminder",
      { level: "none" },
      {
        width: 100,
        cellRenderer: (params: any) => {
          const sent = params.value
          return sent
            ? `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Sent</span>`
            : `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">None</span>`
        },
      }
    ),
  ]

  // Grid configuration
  const gridConfig = {
    allowExport: true,
    allowImport: false,
    allowRowSelection: true,
    allowMultiSelection: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    allowSorting: true,
    allowFiltering: true,
    allowCellEditing: false,
    showToolbar: true,
    showStatusBar: true,
    enableRangeSelection: true,
    protectionEnabled: true,
    userRole: "executive",
    theme: "alpine" as const,
    enableTotalsRow: false,
    stickyColumnsCount: 2,
  }

  // Grid events
  const gridEvents = {
    onRowSelected: (event: any) => {
      console.log("Row selected:", event.data)
    },
    onFilterChanged: (event: any) => {
      console.log("Filter changed:", event)
    },
    onProtectionViolation: (message: string, cell: any) => {
      console.warn("Protection violation:", message, cell)
    },
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Employee Certifications</h3>
          <p className="text-sm text-muted-foreground">
            Track and manage employee safety certifications and training records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Certificate
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Certifications</p>
                <p className="text-2xl font-bold text-blue-600">{certificationsData.length}</p>
              </div>
              <Award className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {certificationsData.filter((cert) => cert.status === "Active").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-600">
                  {certificationsData.filter((cert) => cert.status === "Expiring Soon").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Expired</p>
                <p className="text-2xl font-bold text-red-600">
                  {certificationsData.filter((cert) => cert.status === "Expired").length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certifications Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certifications Database
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProtectedGrid
            columnDefs={columnDefs}
            rowData={certificationsData}
            config={gridConfig}
            events={gridEvents}
            height="600px"
            enableSearch={true}
            defaultSearch=""
            title="Employee Certifications"
          />
        </CardContent>
      </Card>
    </div>
  )
}
