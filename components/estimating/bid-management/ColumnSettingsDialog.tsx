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
  { id: "projectNumber", label: "Project #", defaultVisible: true },
  { id: "projectName", label: "Project Name", defaultVisible: true },
  { id: "source", label: "Source", defaultVisible: true },
  { id: "deliverable", label: "Deliverable", defaultVisible: true },
  { id: "subBidsDue", label: "Sub Bids Due", defaultVisible: true },
  { id: "presubmissionReview", label: "Presubmission Review", defaultVisible: true },
  { id: "winStrategyMeeting", label: "Win Strategy Meeting", defaultVisible: true },
  { id: "dueDateOutTheDoor", label: "Due Date (Out The Door)", defaultVisible: true },
  { id: "leadEstimator", label: "Lead Estimator", defaultVisible: true },
  { id: "contributors", label: "Contributors", defaultVisible: true },
  { id: "px", label: "PX", defaultVisible: true },
  { id: "bidBondWanda", label: "Bid Bond (Wanda)", defaultVisible: true },
  { id: "ppBond", label: "P&P Bond", defaultVisible: true },
  { id: "schedule", label: "Schedule", defaultVisible: true },
  { id: "logistics", label: "Logistics", defaultVisible: true },
  { id: "bimProposal", label: "BIM Proposal", defaultVisible: true },
  { id: "preconProposalRyan", label: "Precon Proposal (Ryan)", defaultVisible: true },
  { id: "proposalTabsWanda", label: "Proposal Tabs (Wanda)", defaultVisible: true },
  { id: "coordWithMarketing", label: "Coor. w/ Marketing Prior to Sending", defaultVisible: true },
  { id: "actions", label: "Actions", defaultVisible: true },
]

export const STAGE_COLUMNS: ColumnDefinition[] = [
  { id: "projectNumber", label: "Project #", defaultVisible: true },
  { id: "projectName", label: "Project Name", defaultVisible: true },
  { id: "currentStage", label: "Current Stage", defaultVisible: true },
  { id: "preconBudget", label: "Precon Budget", defaultVisible: true },
  { id: "designBudget", label: "Design Budget", defaultVisible: true },
  { id: "billedToDate", label: "Billed to Date", defaultVisible: true },
  { id: "leadEstimator", label: "Lead Estimator", defaultVisible: true },
  { id: "px", label: "PX", defaultVisible: true },
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
  open?: boolean
  onOpenChange?: (open: boolean) => void
  showTrigger?: boolean
}

const getStorageKey = (tabId: string) => `columnSettings_${tabId}`

const getDefaultVisibility = (columns: ColumnDefinition[]): ColumnVisibility => {
  return columns.reduce((acc, col) => {
    acc[col.id] = col.defaultVisible
    return acc
  }, {} as ColumnVisibility)
}

const ColumnSettingsDialog: React.FC<ColumnSettingsDialogProps> = ({
  columns,
  tabId,
  onVisibilityChange,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  showTrigger = true,
}) => {
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

  const [internalOpen, setInternalOpen] = useState(false)

  // Use external open state if provided, otherwise use internal state
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen
  const setIsOpen = externalOnOpenChange || setInternalOpen

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
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Columns ({visibleCount}/{totalCount})
          </Button>
        </DialogTrigger>
      )}
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
