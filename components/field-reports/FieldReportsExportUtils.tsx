"use client"

import { DailyLog, ManpowerRecord, SafetyAudit, QualityInspection } from "@/types/field-reports"
import type { FieldReportsStats } from "./FieldReportsWidgets"

export class FieldReportsExportUtils {
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
    data: {
      dailyLogs: DailyLog[]
      manpower: ManpowerRecord[]
      safetyAudits: SafetyAudit[]
      qualityInspections: QualityInspection[]
    },
    stats: FieldReportsStats,
    projectName: string,
    fileName: string = "FieldReportsData"
  ): void {
    try {
      // In a real implementation, this would use a PDF library like jsPDF
      const reportData = {
        title: `Field Reports Summary - ${projectName}`,
        generatedAt: new Date().toLocaleString(),
        summary: {
          totalLogs: stats.totalLogs,
          logComplianceRate: this.formatPercentage(stats.logComplianceRate),
          safetyComplianceRate: this.formatPercentage(stats.safetyComplianceRate),
          qualityPassRate: this.formatPercentage(stats.qualityPassRate),
          totalWorkers: stats.totalWorkers,
          averageEfficiency: this.formatPercentage(stats.averageEfficiency),
          safetyViolations: stats.safetyViolations,
          atRiskItems: stats.atRiskSafetyItems,
        },
        dailyLogs: data.dailyLogs.map(log => ({
          id: log.id,
          projectName: log.projectName,
          date: this.formatDate(log.date),
          submittedBy: log.submittedBy,
          status: log.status,
          totalWorkers: log.totalWorkers,
          totalHours: log.totalHours,
          activitiesCount: log.activities?.length || 0,
          manpowerEntriesCount: log.manpowerEntries?.length || 0,
        })),
        safetyAudits: data.safetyAudits.map(audit => ({
          id: audit.id,
          projectName: audit.projectName,
          date: this.formatDate(audit.date),
          type: audit.type,
          status: audit.status,
          location: audit.location,
          violations: audit.violations,
          atRiskItems: audit.atRiskItems,
          complianceScore: audit.complianceScore,
          createdBy: audit.createdBy,
        })),
        qualityInspections: data.qualityInspections.map(inspection => ({
          id: inspection.id,
          projectName: inspection.projectName,
          date: this.formatDate(inspection.date),
          type: inspection.type,
          status: inspection.status,
          location: inspection.location,
          defects: inspection.defects,
          issuesCount: inspection.issues?.length || 0,
          createdBy: inspection.createdBy,
        })),
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
    data: {
      dailyLogs: DailyLog[]
      manpower: ManpowerRecord[]
      safetyAudits: SafetyAudit[]
      qualityInspections: QualityInspection[]
    },
    stats: FieldReportsStats,
    projectName: string,
    fileName: string = "FieldReportsData"
  ): void {
    try {
      // In a real implementation, this would use a library like xlsx
      const worksheetData = [
        // Header row
        [
          "Type",
          "ID",
          "Project Name",
          "Date",
          "Status",
          "Created By",
          "Location",
          "Workers",
          "Hours",
          "Violations",
          "Defects",
          "Score/Efficiency",
          "Comments"
        ],
        // Daily logs
        ...data.dailyLogs.map(log => [
          "Daily Log",
          log.id,
          log.projectName,
          log.date,
          log.status,
          log.submittedBy,
          "",
          log.totalWorkers,
          log.totalHours,
          0,
          0,
          "",
          log.comments
        ]),
        // Safety audits
        ...data.safetyAudits.map(audit => [
          "Safety Audit",
          audit.id,
          audit.projectName,
          audit.date,
          audit.status,
          audit.createdBy,
          audit.location,
          0,
          0,
          audit.violations,
          0,
          audit.complianceScore,
          audit.description
        ]),
        // Quality inspections
        ...data.qualityInspections.map(inspection => [
          "Quality Inspection",
          inspection.id,
          inspection.projectName,
          inspection.date,
          inspection.status,
          inspection.createdBy,
          inspection.location,
          0,
          0,
          0,
          inspection.defects,
          "",
          inspection.description
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
    data: {
      dailyLogs: DailyLog[]
      manpower: ManpowerRecord[]
      safetyAudits: SafetyAudit[]
      qualityInspections: QualityInspection[]
    },
    projectName: string,
    fileName: string = "FieldReportsData"
  ): void {
    try {
      const csvData = [
        // Header
        [
          "Report Type",
          "ID",
          "Project Name",
          "Date",
          "Status",
          "Created By",
          "Location",
          "Total Workers",
          "Total Hours",
          "Safety Violations",
          "Quality Defects",
          "Score/Efficiency",
          "Description/Comments"
        ],
        // Daily logs
        ...data.dailyLogs.map(log => [
          "Daily Log",
          log.id,
          log.projectName,
          log.date,
          log.status,
          log.submittedBy,
          "",
          log.totalWorkers.toString(),
          log.totalHours.toString(),
          "0",
          "0",
          "",
          log.comments || ""
        ]),
        // Safety audits
        ...data.safetyAudits.map(audit => [
          "Safety Audit",
          audit.id,
          audit.projectName,
          audit.date,
          audit.status,
          audit.createdBy,
          audit.location,
          "0",
          "0",
          audit.violations.toString(),
          "0",
          audit.complianceScore.toString(),
          audit.description
        ]),
        // Quality inspections
        ...data.qualityInspections.map(inspection => [
          "Quality Inspection",
          inspection.id,
          inspection.projectName,
          inspection.date,
          inspection.status,
          inspection.createdBy,
          inspection.location,
          "0",
          "0",
          "0",
          inspection.defects.toString(),
          "",
          inspection.description
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

  static exportDailyLogsToCSV(
    dailyLogs: DailyLog[],
    projectName: string,
    fileName: string = "DailyLogsData"
  ): void {
    try {
      const csvData = [
        // Header
        [
          "Log ID",
          "Project Name",
          "Date",
          "Submitted By",
          "Status",
          "Total Workers",
          "Total Hours",
          "Activities Count",
          "Manpower Entries",
          "Comments"
        ],
        // Data rows
        ...dailyLogs.map(log => [
          log.id,
          log.projectName,
          log.date,
          log.submittedBy,
          log.status,
          log.totalWorkers.toString(),
          log.totalHours.toString(),
          (log.activities?.length || 0).toString(),
          (log.manpowerEntries?.length || 0).toString(),
          log.comments || ""
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
      console.error("Daily logs CSV export failed:", error)
      throw new Error("Failed to export daily logs CSV")
    }
  }

  static exportSafetyAuditsToCSV(
    safetyAudits: SafetyAudit[],
    projectName: string,
    fileName: string = "SafetyAuditsData"
  ): void {
    try {
      const csvData = [
        // Header
        [
          "Audit ID",
          "Project Name",
          "Date",
          "Type",
          "Trade",
          "Status",
          "Location",
          "Created By",
          "Violations",
          "At-Risk Items",
          "Compliance Score",
          "Description"
        ],
        // Data rows
        ...safetyAudits.map(audit => [
          audit.id,
          audit.projectName,
          audit.date,
          audit.type,
          audit.trade,
          audit.status,
          audit.location,
          audit.createdBy,
          audit.violations.toString(),
          audit.atRiskItems.toString(),
          audit.complianceScore.toString(),
          audit.description
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
      console.error("Safety audits CSV export failed:", error)
      throw new Error("Failed to export safety audits CSV")
    }
  }

  static generateSummaryReport(stats: FieldReportsStats, projectName: string): string {
    return `
FIELD REPORTS SUMMARY
Project: ${projectName}
Generated: ${new Date().toLocaleString()}

DAILY LOGS OVERVIEW
Total Logs: ${stats.totalLogs}
Expected Logs: ${stats.expectedLogs}
Completed Logs: ${stats.completedLogs}
Log Compliance Rate: ${this.formatPercentage(stats.logComplianceRate)}

WORKFORCE METRICS
Total Workers: ${stats.totalWorkers}
Average Efficiency: ${this.formatPercentage(stats.averageEfficiency)}

SAFETY PERFORMANCE
Safety Compliance Rate: ${this.formatPercentage(stats.safetyComplianceRate)}
Safety Violations: ${stats.safetyViolations}
At-Risk Safety Items: ${stats.atRiskSafetyItems}

QUALITY PERFORMANCE
Quality Pass Rate: ${this.formatPercentage(stats.qualityPassRate)}
Quality Defects: ${stats.qualityDefects}
Total Inspections: ${stats.totalInspections}

REPORTING PERIOD
Business Days in Month: ${stats.businessDaysInMonth}
Business Days to Date: ${stats.businessDaysToDate}
    `.trim()
  }
} 