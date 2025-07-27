import React from "react"
import { Button } from "../../ui/button"
import { Download } from "lucide-react"
import { ProjectPursuit } from "../../../types/estimating"
import * as XLSX from "xlsx"

interface ExportButtonProps {
  data: ProjectPursuit[]
  fileName?: string
  className?: string
  disabled?: boolean
}

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  fileName = "BidTracking2025",
  className = "",
  disabled = false,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleExport = () => {
    if (!data || data.length === 0) {
      alert("No data to export")
      return
    }

    // Transform data for Excel export
    const exportData = data.map((project) => ({
      "Project Name": project.name,
      "Project Number": project.projectNumber,
      Client: project.client,
      Location: project.location,
      Status: project.status,
      Schedule: project.schedule,
      "Current Stage": project.currentStage,
      Deliverable: project.deliverable,
      "Bid Book Log": project.bidBookLog,
      Review: project.review,
      Programming: project.programming,
      "Pricing (%)": project.pricing,
      "Lean Estimating": project.leanEstimating,
      "Final Estimate": project.finalEstimate,
      Contributors: project.contributors,
      "Bid Bond": project.bidBond,
      "Project Budget": formatCurrency(project.projectBudget),
      "Original Budget": formatCurrency(project.originalBudget),
      "Billed to Date": formatCurrency(project.billedToDate),
      "Remaining Budget": formatCurrency(project.remainingBudget),
      "Estimate Type": project.estimateType,
      "Estimated Cost": formatCurrency(project.estimatedCost),
      "Cost per SqFt": `$${project.costPerSqf.toFixed(2)}`,
      "Cost per LF": `$${project.costPerLft.toFixed(2)}`,
      "Square Footage": project.sqft.toLocaleString(),
      "Submitted Date": formatDate(project.submitted),
      "Bid Due Date": formatDate(project.bidDueDate),
      Awarded: project.awarded ? "Yes" : "No",
      "Precon Awarded": project.awardedPrecon ? "Yes" : "No",
      Lead: project.lead,
      "Confidence (%)": project.confidence,
      "Risk Level": project.riskLevel,
    }))

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)

    // Set column widths for better readability
    const colWidths = [
      { wch: 25 }, // Project Name
      { wch: 15 }, // Project Number
      { wch: 20 }, // Client
      { wch: 15 }, // Location
      { wch: 10 }, // Status
      { wch: 12 }, // Schedule
      { wch: 12 }, // Current Stage
      { wch: 15 }, // Deliverable
      { wch: 12 }, // Bid Book Log
      { wch: 10 }, // Review
      { wch: 12 }, // Programming
      { wch: 10 }, // Pricing
      { wch: 15 }, // Lean Estimating
      { wch: 15 }, // Final Estimate
      { wch: 12 }, // Contributors
      { wch: 12 }, // Bid Bond
      { wch: 15 }, // Project Budget
      { wch: 15 }, // Original Budget
      { wch: 15 }, // Billed to Date
      { wch: 15 }, // Remaining Budget
      { wch: 18 }, // Estimate Type
      { wch: 15 }, // Estimated Cost
      { wch: 12 }, // Cost per SqFt
      { wch: 12 }, // Cost per LF
      { wch: 15 }, // Square Footage
      { wch: 12 }, // Submitted Date
      { wch: 12 }, // Bid Due Date
      { wch: 8 }, // Awarded
      { wch: 12 }, // Precon Awarded
      { wch: 15 }, // Lead
      { wch: 12 }, // Confidence
      { wch: 12 }, // Risk Level
    ]

    ws["!cols"] = colWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Bid Tracking")

    // Add metadata sheet
    const metadata = [
      { Field: "Export Date", Value: new Date().toLocaleString() },
      { Field: "Total Projects", Value: data.length },
      { Field: "File Name", Value: `${fileName}.xlsx` },
      { Field: "Exported By", Value: "HB Report Demo v3.0" },
    ]

    const metaWs = XLSX.utils.json_to_sheet(metadata)
    metaWs["!cols"] = [{ wch: 15 }, { wch: 25 }]
    XLSX.utils.book_append_sheet(wb, metaWs, "Export Info")

    // Generate timestamp for unique filename
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "")
    const finalFileName = `${fileName}_${timestamp}.xlsx`

    // Write and download file
    try {
      XLSX.writeFile(wb, finalFileName)
    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed. Please try again.")
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={disabled || !data || data.length === 0}
      className={className}
    >
      <Download className="h-4 w-4 mr-2" />
      Export Excel ({data?.length || 0})
    </Button>
  )
}

export default ExportButton
