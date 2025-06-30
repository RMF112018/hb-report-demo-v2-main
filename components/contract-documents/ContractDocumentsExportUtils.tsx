"use client"

import type { ContractDocumentsStats } from "./ContractDocumentsWidgets"

export interface ContractDocument {
  id: string
  name: string
  type: string
  status: string
  uploadDate: string
  reviewer: string
  priority: string
  complianceScore: number
  riskLevel: string
  aiAnalysisStatus: string
  tags: string[]
  size: string
  pages: number
  project: {
    id: string
    name: string
    projectNumber: string
  }
  keyRisks: Array<{
    category: string
    description: string
    severity: string
    recommendation: string
    clauseReference: string
  }>
  opportunities: Array<{
    category: string
    description: string
    value: string
    probability: string
    clauseReference: string
  }>
  complianceChecks: Record<string, {
    status: string
    lastChecked: string
    nextReview: string
  }>
  aiInsights: {
    overallRisk: string
    costSavingsPotential: number
    recommendedActions: string[]
    similarContracts: number
    industryBenchmark: {
      riskScore: string
      complianceScore: string
    }
  }
  attachments?: string[]
}

export class ContractDocumentsExportUtils {
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
    documents: ContractDocument[],
    stats: ContractDocumentsStats,
    projectName: string,
    fileName: string = "ContractDocumentsReport"
  ): void {
    try {
      // In a real implementation, this would use a PDF library like jsPDF
      const reportData = {
        title: `Contract Documents Report - ${projectName}`,
        generatedAt: new Date().toLocaleString(),
        summary: {
          totalDocuments: stats.totalDocuments,
          pendingReview: stats.pendingReview,
          highRiskDocuments: stats.highRiskDocuments,
          complianceRate: this.formatPercentage(stats.complianceRate),
          avgReviewTime: `${stats.avgReviewTime.toFixed(1)} days`,
          aiInsightsGenerated: stats.aiInsightsGenerated,
          costSavingsIdentified: this.formatCurrency(stats.costSavingsIdentified),
          riskItemsResolved: stats.riskItemsResolved,
        },
        documents: documents.map(doc => ({
          id: doc.id,
          name: doc.name,
          type: doc.type,
          status: doc.status,
          uploadDate: this.formatDate(doc.uploadDate),
          reviewer: doc.reviewer,
          priority: doc.priority,
          complianceScore: doc.complianceScore,
          riskLevel: doc.riskLevel,
          projectName: doc.project.name,
          pages: doc.pages,
          size: doc.size,
          keyRisksCount: doc.keyRisks?.length || 0,
          opportunitiesCount: doc.opportunities?.length || 0,
          costSavingsPotential: this.formatCurrency(doc.aiInsights?.costSavingsPotential || 0),
        })),
        riskAnalysis: {
          highRiskDocs: documents.filter(doc => doc.riskLevel === "High").length,
          mediumRiskDocs: documents.filter(doc => doc.riskLevel === "Medium").length,
          lowRiskDocs: documents.filter(doc => doc.riskLevel === "Low").length,
        },
        complianceAnalysis: {
          compliantDocs: documents.filter(doc => doc.complianceScore >= 90).length,
          needsAttentionDocs: documents.filter(doc => doc.complianceScore < 90).length,
          avgComplianceScore: documents.reduce((sum, doc) => sum + doc.complianceScore, 0) / documents.length,
        },
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
    documents: ContractDocument[],
    stats: ContractDocumentsStats,
    projectName: string,
    fileName: string = "ContractDocumentsData"
  ): void {
    try {
      // In a real implementation, this would use a library like xlsx
      const worksheetData = [
        // Header row
        [
          "Document ID",
          "Document Name",
          "Type",
          "Status",
          "Upload Date",
          "Reviewer",
          "Priority",
          "Compliance Score",
          "Risk Level",
          "Project Name",
          "Pages",
          "Size",
          "Key Risks",
          "Opportunities",
          "Cost Savings Potential",
          "AI Analysis Status",
          "Tags"
        ],
        // Data rows
        ...documents.map(doc => [
          doc.id,
          doc.name,
          doc.type,
          doc.status,
          this.formatDate(doc.uploadDate),
          doc.reviewer,
          doc.priority,
          doc.complianceScore,
          doc.riskLevel,
          doc.project.name,
          doc.pages,
          doc.size,
          doc.keyRisks?.length || 0,
          doc.opportunities?.length || 0,
          doc.aiInsights?.costSavingsPotential || 0,
          doc.aiAnalysisStatus,
          doc.tags.join(", ")
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
    documents: ContractDocument[],
    projectName: string,
    fileName: string = "ContractDocumentsData"
  ): void {
    try {
      const csvData = [
        // Header
        [
          "Document ID",
          "Document Name",
          "Type",
          "Status",
          "Upload Date",
          "Reviewer",
          "Priority",
          "Compliance Score",
          "Risk Level",
          "Project Name",
          "Project Number",
          "Pages",
          "File Size",
          "AI Analysis Status",
          "Key Risks Count",
          "Opportunities Count",
          "Cost Savings Potential",
          "Tags"
        ],
        // Data rows
        ...documents.map(doc => [
          doc.id,
          doc.name,
          doc.type,
          doc.status,
          this.formatDate(doc.uploadDate),
          doc.reviewer,
          doc.priority,
          doc.complianceScore.toString(),
          doc.riskLevel,
          doc.project.name,
          doc.project.projectNumber,
          doc.pages.toString(),
          doc.size,
          doc.aiAnalysisStatus,
          (doc.keyRisks?.length || 0).toString(),
          (doc.opportunities?.length || 0).toString(),
          (doc.aiInsights?.costSavingsPotential || 0).toString(),
          doc.tags.join("; ")
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

  static exportRiskAnalysisToCSV(
    documents: ContractDocument[],
    projectName: string,
    fileName: string = "ContractRiskAnalysis"
  ): void {
    try {
      const riskData = documents.flatMap(doc => 
        doc.keyRisks?.map(risk => [
          doc.id,
          doc.name,
          doc.type,
          doc.project.name,
          risk.category,
          risk.description,
          risk.severity,
          risk.recommendation,
          risk.clauseReference
        ]) || []
      )

      const csvData = [
        // Header
        [
          "Document ID",
          "Document Name",
          "Document Type",
          "Project Name",
          "Risk Category",
          "Risk Description",
          "Severity",
          "Recommendation",
          "Clause Reference"
        ],
        // Risk data
        ...riskData
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
      console.error("Risk analysis CSV export failed:", error)
      throw new Error("Failed to export risk analysis CSV")
    }
  }

  static exportOpportunitiesToCSV(
    documents: ContractDocument[],
    projectName: string,
    fileName: string = "ContractOpportunities"
  ): void {
    try {
      const opportunityData = documents.flatMap(doc => 
        doc.opportunities?.map(opp => [
          doc.id,
          doc.name,
          doc.type,
          doc.project.name,
          opp.category,
          opp.description,
          opp.value,
          opp.probability,
          opp.clauseReference
        ]) || []
      )

      const csvData = [
        // Header
        [
          "Document ID",
          "Document Name",
          "Document Type",
          "Project Name",
          "Opportunity Category",
          "Description",
          "Value",
          "Probability",
          "Clause Reference"
        ],
        // Opportunity data
        ...opportunityData
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
      console.error("Opportunities CSV export failed:", error)
      throw new Error("Failed to export opportunities CSV")
    }
  }

  static generateSummaryReport(stats: ContractDocumentsStats, projectName: string): string {
    return `
CONTRACT DOCUMENTS SUMMARY
Project: ${projectName}
Generated: ${new Date().toLocaleString()}

DOCUMENT PORTFOLIO
Total Documents: ${stats.totalDocuments}
Pending Review: ${stats.pendingReview}
High Risk Documents: ${stats.highRiskDocuments}
Average Review Time: ${stats.avgReviewTime.toFixed(1)} days

COMPLIANCE & RISK
Compliance Rate: ${this.formatPercentage(stats.complianceRate)}
Risk Items Resolved: ${stats.riskItemsResolved}

AI ANALYSIS
Insights Generated: ${stats.aiInsightsGenerated}
Cost Savings Identified: ${this.formatCurrency(stats.costSavingsIdentified)}

PERFORMANCE INDICATORS
- Document compliance exceeds industry standards
- AI-powered risk identification reducing review time
- Proactive opportunity identification driving cost savings
- Automated compliance monitoring ensuring regulatory adherence
    `.trim()
  }
} 