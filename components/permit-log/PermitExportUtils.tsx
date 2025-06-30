"use client"

import { Permit, Inspection } from "@/types/permit-log"
import type { PermitStats } from "./PermitWidgets"

export class PermitExportUtils {
  private static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  private static formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`
  }

  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  static exportToPDF(
    permits: Permit[],
    stats: PermitStats,
    projectName: string,
    fileName: string = "PermitReport"
  ): void {
    try {
      // In a real implementation, this would use a PDF library like jsPDF
      const reportData = {
        title: `Permit Log Report - ${projectName}`,
        generatedAt: new Date().toLocaleString(),
        summary: {
          totalPermits: stats.totalPermits,
          approvalRate: this.formatPercentage(stats.approvalRate),
          inspectionPassRate: this.formatPercentage(stats.inspectionPassRate),
          pendingActions: stats.pendingPermits + stats.pendingInspections,
          expiringPermits: stats.expiringPermits,
        },
        permits: permits.map(permit => ({
          number: permit.number,
          type: permit.type,
          status: permit.status,
          authority: permit.authority,
          applicationDate: this.formatDate(permit.applicationDate),
          approvalDate: permit.approvalDate ? this.formatDate(permit.approvalDate) : "N/A",
          expirationDate: this.formatDate(permit.expirationDate),
          cost: permit.cost ? this.formatCurrency(permit.cost) : "N/A",
          description: permit.description,
          inspectionCount: permit.inspections?.length || 0,
          passedInspections: permit.inspections?.filter(i => i.result === "passed").length || 0,
        })),
        inspections: permits.flatMap(permit => 
          permit.inspections?.map(inspection => ({
            permitNumber: permit.number,
            type: inspection.type,
            scheduledDate: inspection.scheduledDate ? this.formatDate(inspection.scheduledDate) : "N/A",
            completedDate: inspection.completedDate ? this.formatDate(inspection.completedDate) : "N/A",
            inspector: inspection.inspector,
            result: inspection.result,
            complianceScore: inspection.complianceScore || "N/A",
            issues: Array.isArray(inspection.issues) ? inspection.issues.length : 0,
          })) || []
        ),
      }

      // Simulate PDF generation
      console.log("PDF Export Data:", reportData)
      
      // Create a downloadable blob (simplified)
      const content = JSON.stringify(reportData, null, 2)
      const blob = new Blob([content], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement("a")
      link.href = url
      link.download = `${fileName}.json` // Would be .pdf in real implementation
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("PDF export failed:", error)
      throw new Error("Failed to export PDF")
    }
  }

  static exportToExcel(
    permits: Permit[],
    stats: PermitStats,
    projectName: string,
    fileName: string = "PermitData"
  ): void {
    try {
      // In a real implementation, this would use a library like xlsx
      const worksheetData = [
        // Header row
        [
          "Permit Number",
          "Type",
          "Status",
          "Authority",
          "Application Date",
          "Approval Date",
          "Expiration Date",
          "Cost",
          "Bond Amount",
          "Description",
          "Priority",
          "Total Inspections",
          "Passed Inspections",
          "Failed Inspections",
          "Pending Inspections",
          "Created By",
          "Created Date"
        ],
        // Data rows
        ...permits.map(permit => [
          permit.number,
          permit.type,
          permit.status,
          permit.authority,
          permit.applicationDate,
          permit.approvalDate || "",
          permit.expirationDate,
          permit.cost || 0,
          permit.bondAmount || 0,
          permit.description,
          permit.priority || "medium",
          permit.inspections?.length || 0,
          permit.inspections?.filter(i => i.result === "passed").length || 0,
          permit.inspections?.filter(i => i.result === "failed").length || 0,
          permit.inspections?.filter(i => i.result === "pending").length || 0,
          permit.createdBy,
          permit.createdAt,
        ])
      ]

      // Create CSV content (would be Excel in real implementation)
      const csvContent = worksheetData
        .map(row => row.map(cell => `"${cell}"`).join(","))
        .join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement("a")
      link.href = url
      link.download = `${fileName}.csv` // Would be .xlsx in real implementation
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Excel export failed:", error)
      throw new Error("Failed to export Excel")
    }
  }

  static exportToCSV(
    permits: Permit[],
    projectName: string,
    fileName: string = "PermitData"
  ): void {
    try {
      const csvData = [
        // Header
        [
          "Permit Number",
          "Type",
          "Status",
          "Authority",
          "Application Date",
          "Approval Date",
          "Expiration Date",
          "Cost",
          "Bond Amount",
          "Description",
          "Priority",
          "Comments",
          "Conditions Count",
          "Tags",
          "Inspection Count"
        ],
        // Data rows
        ...permits.map(permit => [
          permit.number,
          permit.type,
          permit.status,
          permit.authority,
          permit.applicationDate,
          permit.approvalDate || "",
          permit.expirationDate,
          permit.cost?.toString() || "0",
          permit.bondAmount?.toString() || "0",
          permit.description,
          permit.priority || "medium",
          permit.comments || "",
          permit.conditions?.length.toString() || "0",
          permit.tags?.join("; ") || "",
          permit.inspections?.length.toString() || "0"
        ])
      ]

      const csvContent = csvData
        .map(row => row.map(cell => `"${cell}"`).join(","))
        .join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement("a")
      link.href = url
      link.download = `${fileName}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("CSV export failed:", error)
      throw new Error("Failed to export CSV")
    }
  }

  static exportInspectionsToCSV(
    permits: Permit[],
    projectName: string,
    fileName: string = "InspectionData"
  ): void {
    try {
      const inspections = permits.flatMap(permit => 
        permit.inspections?.map(inspection => ({
          permit,
          inspection
        })) || []
      )

      const csvData = [
        // Header
        [
          "Permit Number",
          "Permit Type",
          "Inspection Type",
          "Scheduled Date",
          "Completed Date",
          "Inspector",
          "Result",
          "Compliance Score",
          "Issues Count",
          "Comments",
          "Follow-up Required",
          "Duration (hours)"
        ],
        // Data rows
        ...inspections.map(({ permit, inspection }) => [
          permit.number,
          permit.type,
          inspection.type,
          inspection.scheduledDate || "",
          inspection.completedDate || "",
          inspection.inspector,
          inspection.result,
          inspection.complianceScore?.toString() || "",
          Array.isArray(inspection.issues) ? inspection.issues.length.toString() : "0",
          inspection.comments || "",
          inspection.followUpRequired ? "Yes" : "No",
          inspection.duration?.toString() || ""
        ])
      ]

      const csvContent = csvData
        .map(row => row.map(cell => `"${cell}"`).join(","))
        .join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement("a")
      link.href = url
      link.download = `${fileName}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Inspections CSV export failed:", error)
      throw new Error("Failed to export inspections CSV")
    }
  }

  static generateSummaryReport(stats: PermitStats, projectName: string): string {
    return `
PERMIT LOG SUMMARY REPORT
Project: ${projectName}
Generated: ${new Date().toLocaleString()}

PERMIT OVERVIEW
Total Permits: ${stats.totalPermits}
Approved Permits: ${stats.approvedPermits}
Pending Permits: ${stats.pendingPermits}
Expired Permits: ${stats.expiredPermits}
Rejected Permits: ${stats.rejectedPermits}
Expiring Soon: ${stats.expiringPermits}

PERFORMANCE METRICS
Approval Rate: ${this.formatPercentage(stats.approvalRate)}
Inspection Pass Rate: ${this.formatPercentage(stats.inspectionPassRate)}

INSPECTION SUMMARY
Total Inspections: ${stats.totalInspections}
Passed Inspections: ${stats.passedInspections}
Failed Inspections: ${stats.failedInspections}
Pending Inspections: ${stats.pendingInspections}

PERMIT TYPES
${Object.entries(stats.byType)
  .map(([type, count]) => `${type}: ${count}`)
  .join('\n')}

PERMIT AUTHORITIES
${Object.entries(stats.byAuthority)
  .map(([authority, count]) => `${authority}: ${count}`)
  .join('\n')}

STATUS BREAKDOWN
${Object.entries(stats.byStatus)
  .map(([status, count]) => `${status}: ${count}`)
  .join('\n')}
    `.trim()
  }
} 