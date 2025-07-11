import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog"
import { Button } from "../../ui/button"
import { Checkbox } from "../../ui/checkbox"
import { Label } from "../../ui/label"
import { ScrollArea } from "../../ui/scroll-area"
import { Separator } from "../../ui/separator"
import { Settings, RotateCcw } from "lucide-react"

// Column definitions for each tab
export interface ColumnDefinition {
  id: string
  label: string
  defaultVisible: boolean
}

export const DELIVERY_COLUMNS: ColumnDefinition[] = [
  { id: "project", label: "Project", defaultVisible: true },
  { id: "schedule", label: "Schedule", defaultVisible: true },
  { id: "deliverable", label: "Deliverable", defaultVisible: true },
  { id: "bidBookLog", label: "Bid Book Log", defaultVisible: true },
  { id: "review", label: "Review", defaultVisible: true },
  { id: "programming", label: "Programming", defaultVisible: true },
  { id: "pricing", label: "Pricing", defaultVisible: true },
  { id: "leanEstimating", label: "Lean Estimating", defaultVisible: true },
  { id: "finalEstimate", label: "Final Estimate", defaultVisible: true },
  { id: "contributors", label: "Contributors", defaultVisible: true },
  { id: "bidBond", label: "Bid Bond", defaultVisible: true },
  { id: "actions", label: "Actions", defaultVisible: true },
]

export const STAGE_COLUMNS: ColumnDefinition[] = [
  { id: "project", label: "Project", defaultVisible: true },
  { id: "currentStage", label: "Current Stage", defaultVisible: true },
  { id: "projectBudget", label: "Project Budget", defaultVisible: true },
  { id: "originalBudget", label: "Original Budget", defaultVisible: true },
  { id: "billedToDate", label: "Billed to Date", defaultVisible: true },
  { id: "remainingBudget", label: "Remaining Budget", defaultVisible: true },
  { id: "budgetVariance", label: "Budget Variance", defaultVisible: true },
  { id: "actions", label: "Actions", defaultVisible: true },
]

export const ESTIMATES_COLUMNS: ColumnDefinition[] = [
  { id: "project", label: "Project", defaultVisible: true },
  { id: "estimateType", label: "Estimate Type", defaultVisible: true },
  { id: "estimatedCost", label: "Estimated Cost", defaultVisible: true },
  { id: "costPerSqf", label: "Cost per SqFt", defaultVisible: true },
  { id: "costPerLft", label: "Cost per LF", defaultVisible: true },
  { id: "squareFootage", label: "Square Footage", defaultVisible: true },
  { id: "submittedDate", label: "Submitted Date", defaultVisible: true },
  { id: "awarded", label: "Awarded", defaultVisible: true },
  { id: "precon", label: "Precon", defaultVisible: true },
  { id: "actions", label: "Actions", defaultVisible: true },
]

interface ColumnVisibility {
  [key: string]: boolean
}

interface ColumnSettingsDialogProps {
  columns: ColumnDefinition[]
  tabId: string
  onVisibilityChange: (visibility: ColumnVisibility) => void
}

const getStorageKey = (tabId: string) => `columnSettings_${tabId}`

const getDefaultVisibility = (columns: ColumnDefinition[]): ColumnVisibility => {
  return columns.reduce((acc, col) => {
    acc[col.id] = col.defaultVisible
    return acc
  }, {} as ColumnVisibility)
}

const ColumnSettingsDialog: React.FC<ColumnSettingsDialogProps> = ({ columns, tabId, onVisibilityChange }) => {
  const [visibility, setVisibility] = useState<ColumnVisibility>(() => {
    try {
      const stored = localStorage.getItem(getStorageKey(tabId))
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error("Error loading column settings:", error)
    }
    return getDefaultVisibility(columns)
  })

  const [isOpen, setIsOpen] = useState(false)

  // Update parent when visibility changes
  useEffect(() => {
    onVisibilityChange(visibility)
  }, [visibility, onVisibilityChange])

  const handleToggleColumn = (columnId: string, checked: boolean) => {
    const newVisibility = { ...visibility, [columnId]: checked }
    setVisibility(newVisibility)

    try {
      localStorage.setItem(getStorageKey(tabId), JSON.stringify(newVisibility))
    } catch (error) {
      console.error("Error saving column settings:", error)
    }
  }

  const handleResetToDefaults = () => {
    const defaultVisibility = getDefaultVisibility(columns)
    setVisibility(defaultVisibility)

    try {
      localStorage.setItem(getStorageKey(tabId), JSON.stringify(defaultVisibility))
    } catch (error) {
      console.error("Error saving column settings:", error)
    }
  }

  const visibleCount = Object.values(visibility).filter(Boolean).length
  const totalCount = columns.length

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Columns ({visibleCount}/{totalCount})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Column Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Choose which columns to display in the table</p>
            <Button variant="ghost" size="sm" onClick={handleResetToDefaults} className="h-8 px-2">
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>

          <Separator />

          <ScrollArea className="h-72">
            <div className="space-y-3">
              {columns.map((column) => (
                <div key={column.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={column.id}
                    checked={visibility[column.id] || false}
                    onCheckedChange={(checked) => handleToggleColumn(column.id, Boolean(checked))}
                  />
                  <Label htmlFor={column.id} className="text-sm font-normal cursor-pointer flex-1">
                    {column.label}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Separator />

          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>
              Showing {visibleCount} of {totalCount} columns
            </span>
            <span>Settings saved automatically</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ColumnSettingsDialog
export type { ColumnVisibility }
