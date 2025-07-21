import React from "react"
import { Button } from "../../ui/button"
import { Download } from "lucide-react"
import type { ProjectPursuit } from "../../../types/estimating"
import ExcelJS from "exceljs"

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

  const handleExport = async () => {
    if (!data || data.length === 0) {
      alert("No data to export")
      return
    }

    try {
      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet("Bid Tracking")

      // Define columns
      worksheet.columns = [
        { header: "Project Name", key: "projectName", width: 25 },
        { header: "Project Number", key: "projectNumber", width: 15 },
        { header: "Client", key: "client", width: 20 },
        { header: "Location", key: "location", width: 15 },
        { header: "Status", key: "status", width: 10 },
        { header: "Schedule", key: "schedule", width: 12 },
        { header: "Current Stage", key: "currentStage", width: 12 },
        { header: "Deliverable", key: "deliverable", width: 15 },
        { header: "Bid Book Log", key: "bidBookLog", width: 12 },
        { header: "Review", key: "review", width: 10 },
        { header: "Programming", key: "programming", width: 12 },
        { header: "Pricing (%)", key: "pricing", width: 10 },
        { header: "Lean Estimating", key: "leanEstimating", width: 15 },
        { header: "Final Estimate", key: "finalEstimate", width: 15 },
        { header: "Contributors", key: "contributors", width: 12 },
        { header: "Bid Bond", key: "bidBond", width: 12 },
        { header: "Project Budget", key: "projectBudget", width: 15 },
        { header: "Original Budget", key: "originalBudget", width: 15 },
        { header: "Billed to Date", key: "billedToDate", width: 15 },
        { header: "Remaining Budget", key: "remainingBudget", width: 15 },
        { header: "Estimate Type", key: "estimateType", width: 18 },
        { header: "Estimated Cost", key: "estimatedCost", width: 15 },
        { header: "Cost per SqFt", key: "costPerSqf", width: 12 },
        { header: "Cost per LF", key: "costPerLft", width: 12 },
        { header: "Square Footage", key: "sqft", width: 15 },
        { header: "Submitted Date", key: "submitted", width: 12 },
        { header: "Bid Due Date", key: "bidDueDate", width: 12 },
        { header: "Awarded", key: "awarded", width: 8 },
        { header: "Precon Awarded", key: "awardedPrecon", width: 12 },
        { header: "Lead", key: "lead", width: 15 },
        { header: "Confidence (%)", key: "confidence", width: 12 },
        { header: "Risk Level", key: "riskLevel", width: 12 },
      ]

      // Add data rows
      data.forEach((project) => {
        worksheet.addRow({
          projectName: project.name,
          projectNumber: project.projectNumber,
          client: project.client,
          location: project.location,
          status: project.status,
          schedule: project.schedule,
          currentStage: project.currentStage,
          deliverable: project.deliverable,
          bidBookLog: project.bidBookLog,
          review: project.review,
          programming: project.programming,
          pricing: project.pricing,
          leanEstimating: project.leanEstimating,
          finalEstimate: project.finalEstimate,
          contributors: project.contributors,
          bidBond: project.bidBond,
          projectBudget: formatCurrency(project.projectBudget),
          originalBudget: formatCurrency(project.originalBudget),
          billedToDate: formatCurrency(project.billedToDate),
          remainingBudget: formatCurrency(project.remainingBudget),
          estimateType: project.estimateType,
          estimatedCost: formatCurrency(project.estimatedCost),
          costPerSqf: `$${project.costPerSqf.toFixed(2)}`,
          costPerLft: `$${project.costPerLft.toFixed(2)}`,
          sqft: project.sqft.toLocaleString(),
          submitted: formatDate(project.submitted),
          bidDueDate: formatDate(project.bidDueDate),
          awarded: project.awarded ? "Yes" : "No",
          awardedPrecon: project.awardedPrecon ? "Yes" : "No",
          lead: project.lead,
          confidence: project.confidence,
          riskLevel: project.riskLevel,
        })
      })

      // Style the header row
      const headerRow = worksheet.getRow(1)
      headerRow.font = { bold: true }
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      }

      // Add metadata sheet
      const metadataSheet = workbook.addWorksheet("Export Info")
      metadataSheet.columns = [
        { header: "Field", key: "field", width: 15 },
        { header: "Value", key: "value", width: 25 },
      ]

      const metadata = [
        { field: "Export Date", value: new Date().toLocaleString() },
        { field: "Total Projects", value: data.length.toString() },
        { field: "File Name", value: `${fileName}.xlsx` },
        { field: "Exported By", value: "HB Report Demo v3.0" },
      ]

      metadata.forEach((item) => {
        metadataSheet.addRow(item)
      })

      // Style metadata header
      const metadataHeaderRow = metadataSheet.getRow(1)
      metadataHeaderRow.font = { bold: true }
      metadataHeaderRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      }

      // Generate timestamp for unique filename
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "")
      const finalFileName = `${fileName}_${timestamp}.xlsx`

      // Generate and download the file
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = finalFileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
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
