"use client"

import { BuyoutRecord } from "@/types/procurement"
import type { ProcurementStats } from "./ProcurementWidgets"

export class ProcurementExportUtils {
  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

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

  static exportToPDF(
    buyouts: BuyoutRecord[],
    stats: ProcurementStats,
    projectName: string,
    fileName: string = "ProcurementReport"
  ): void {
    try {
      // In a real implementation, this would use a PDF library like jsPDF
      const reportData = {
        title: `Procurement Report - ${projectName}`,
        generatedAt: new Date().toLocaleString(),
        summary: {
          totalValue: this.formatCurrency(stats.totalValue),
          activeBuyouts: stats.activeBuyouts,
          completedBuyouts: stats.completedBuyouts,
          vendorCount: stats.vendorCount,
          complianceRate: this.formatPercentage(stats.complianceRate),
          avgSavings: this.formatPercentage(stats.avgSavings),
        },
        buyouts: buyouts.map(buyout => ({
          name: buyout.name,
          vendor: buyout.vendorName,
          category: buyout.category,
          status: buyout.status,
          budgetAmount: this.formatCurrency(buyout.budgetAmount),
          currentAmount: this.formatCurrency(buyout.currentAmount),
          variance: this.formatCurrency(buyout.variance),
          variancePercentage: this.formatPercentage(buyout.variancePercentage),
          startDate: this.formatDate(buyout.startDate),
          endDate: this.formatDate(buyout.endDate),
          complianceStatus: buyout.complianceStatus,
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
    buyouts: BuyoutRecord[],
    stats: ProcurementStats,
    projectName: string,
    fileName: string = "ProcurementData"
  ): void {
    try {
      // In a real implementation, this would use a library like xlsx
      const worksheetData = [
        // Header row
        [
          "Buyout Name",
          "Vendor",
          "Category",
          "Status",
          "Budget Amount",
          "Current Amount",
          "Variance",
          "Variance %",
          "Start Date",
          "End Date",
          "Compliance Status",
          "Procurement Method",
          "Created By",
          "Created Date"
        ],
        // Data rows
        ...buyouts.map(buyout => [
          buyout.name,
          buyout.vendorName,
          buyout.category,
          buyout.status,
          buyout.budgetAmount,
          buyout.currentAmount,
          buyout.variance,
          buyout.variancePercentage,
          buyout.startDate,
          buyout.endDate,
          buyout.complianceStatus,
          buyout.procurementMethod,
          buyout.createdBy,
          buyout.createdAt,
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
    buyouts: BuyoutRecord[],
    projectName: string,
    fileName: string = "ProcurementData"
  ): void {
    try {
      const csvData = [
        // Header
        [
          "Buyout Name",
          "Vendor",
          "Category",
          "Status",
          "Budget Amount",
          "Current Amount",
          "Variance",
          "Variance %",
          "Start Date",
          "End Date",
          "Compliance Status",
          "Procurement Method",
          "Description",
          "Cost Code"
        ],
        // Data rows
        ...buyouts.map(buyout => [
          buyout.name,
          buyout.vendorName,
          buyout.category,
          buyout.status,
          buyout.budgetAmount.toString(),
          buyout.currentAmount.toString(),
          buyout.variance.toString(),
          buyout.variancePercentage.toString(),
          buyout.startDate,
          buyout.endDate,
          buyout.complianceStatus,
          buyout.procurementMethod,
          buyout.description,
          buyout.costCode
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

  static generateSummaryReport(stats: ProcurementStats, projectName: string): string {
    return `
PROCUREMENT SUMMARY REPORT
Project: ${projectName}
Generated: ${new Date().toLocaleString()}

FINANCIAL OVERVIEW
Total Procurement Value: ${this.formatCurrency(stats.totalValue)}
Average Savings: ${this.formatPercentage(stats.avgSavings)}

BUYOUT STATUS
Active Buyouts: ${stats.activeBuyouts}
Completed Buyouts: ${stats.completedBuyouts}
Pending Contracts: ${stats.pendingContracts}

VENDOR MANAGEMENT
Total Vendors: ${stats.vendorCount}
Compliance Rate: ${this.formatPercentage(stats.complianceRate)}
On-Time Delivery: ${this.formatPercentage(stats.onTimeDelivery)}

CATEGORY BREAKDOWN
${Object.entries(stats.byCategory)
  .map(([category, count]) => `${category}: ${count}`)
  .join('\n')}

STATUS BREAKDOWN
${Object.entries(stats.byStatus)
  .map(([status, count]) => `${status}: ${count}`)
  .join('\n')}
    `.trim()
  }
} 