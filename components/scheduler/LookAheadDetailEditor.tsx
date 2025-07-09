/**
 * @fileoverview Look Ahead Detail Editor Component
 * @module LookAheadDetailEditor
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Structured form for defining sub-steps, responsible party, crew size, estimated durations, constraints
 */

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Users,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  Brain,
  Copy,
  Archive,
} from "lucide-react"

interface SubStep {
  id: string
  description: string
  startDate: Date
  endDate: Date
  assignedParty: string
  crewSize: number
  estimatedHours: number
  notes: string
  constraints: string[]
  status: "not-started" | "in-progress" | "completed"
  actualStartDate?: Date
  actualEndDate?: Date
  actualHours?: number
}

interface LookAheadEntry {
  id: string
  activityId: string
  activityName: string
  subSteps: SubStep[]
  createdBy: string
  createdDate: Date
  lastUpdated: Date
  week: number
  status: "draft" | "committed" | "completed"
  notes: string
}

interface LookAheadDetailEditorProps {
  entry: LookAheadEntry | null
  activityId?: string
  activityName?: string
  onSave: (entry: LookAheadEntry) => void
  onCancel: () => void
  onDelete?: (entryId: string) => void
  onAIAssist?: (activityId: string, context: any) => void
  className?: string
}

const LookAheadDetailEditor: React.FC<LookAheadDetailEditorProps> = ({
  entry,
  activityId,
  activityName,
  onSave,
  onCancel,
  onDelete,
  onAIAssist,
  className = "",
}) => {
  const [currentEntry, setCurrentEntry] = useState<LookAheadEntry>(
    entry || {
      id: `la-${Date.now()}`,
      activityId: activityId || "",
      activityName: activityName || "",
      subSteps: [],
      createdBy: "Current User",
      createdDate: new Date(),
      lastUpdated: new Date(),
      week: 1,
      status: "draft",
      notes: "",
    }
  )

  const [editingSubStep, setEditingSubStep] = useState<SubStep | null>(null)
  const [isAddingSubStep, setIsAddingSubStep] = useState(false)
  const [showAIDialog, setShowAIDialog] = useState(false)

  const crewOptions = [
    "Electrical Crew A",
    "Electrical Crew B",
    "Plumbing Crew A",
    "Plumbing Crew B",
    "HVAC Crew A",
    "HVAC Crew B",
    "Carpentry Crew A",
    "Carpentry Crew B",
    "Masonry Crew",
    "Concrete Crew",
    "Steel Crew",
    "Roofing Crew",
    "Insulation Crew",
    "Drywall Crew A",
    "Drywall Crew B",
    "Paint Crew",
    "Flooring Crew",
    "General Labor",
  ]

  const commonConstraints = [
    "Material delivery required",
    "Inspection required before start",
    "Equipment availability",
    "Weather dependent",
    "Prerequisite work completion",
    "Access restrictions",
    "Safety clearance required",
    "Permit required",
  ]

  const createNewSubStep = (): SubStep => ({
    id: `ss-${Date.now()}`,
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    assignedParty: "",
    crewSize: 1,
    estimatedHours: 8,
    notes: "",
    constraints: [],
    status: "not-started",
  })

  const handleAddSubStep = () => {
    setEditingSubStep(createNewSubStep())
    setIsAddingSubStep(true)
  }

  const handleEditSubStep = (subStep: SubStep) => {
    setEditingSubStep({ ...subStep })
    setIsAddingSubStep(false)
  }

  const handleSaveSubStep = () => {
    if (!editingSubStep) return

    const updatedSubSteps = isAddingSubStep
      ? [...currentEntry.subSteps, editingSubStep]
      : currentEntry.subSteps.map((ss) => (ss.id === editingSubStep.id ? editingSubStep : ss))

    setCurrentEntry({
      ...currentEntry,
      subSteps: updatedSubSteps,
      lastUpdated: new Date(),
    })

    setEditingSubStep(null)
    setIsAddingSubStep(false)
  }

  const handleDeleteSubStep = (subStepId: string) => {
    setCurrentEntry({
      ...currentEntry,
      subSteps: currentEntry.subSteps.filter((ss) => ss.id !== subStepId),
      lastUpdated: new Date(),
    })
  }

  const handleAIAssistance = () => {
    if (onAIAssist) {
      onAIAssist(currentEntry.activityId, {
        activityName: currentEntry.activityName,
        existingSubSteps: currentEntry.subSteps,
        week: currentEntry.week,
      })
    }
    setShowAIDialog(true)
  }

  const handleSaveEntry = () => {
    onSave({
      ...currentEntry,
      lastUpdated: new Date(),
    })
  }

  const handleCopyFromPreviousWeek = () => {
    // Logic to copy from previous week's look ahead
    console.log("Copy from previous week")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "not-started":
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30"
      case "in-progress":
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30"
      case "completed":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "not-started":
        return <PlayCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <PlayCircle className="h-4 w-4" />
    }
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const totalEstimatedHours = currentEntry.subSteps.reduce((sum, ss) => sum + ss.estimatedHours, 0)
  const totalCrewSize = currentEntry.subSteps.reduce((sum, ss) => sum + ss.crewSize, 0)

  return (
    <Card className={`border-border ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold">Look Ahead Detail Editor</span>
            <Badge variant="outline" className="ml-2">
              {currentEntry.activityName}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleAIAssistance} className="h-8 px-3 text-xs">
              <Brain className="h-3 w-3 mr-1" />
              AI Assist
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyFromPreviousWeek} className="h-8 px-3 text-xs">
              <Copy className="h-3 w-3 mr-1" />
              Copy Previous
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Entry Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="week">Week</Label>
            <Select
              value={currentEntry.week.toString()}
              onValueChange={(value) => setCurrentEntry({ ...currentEntry, week: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Week 1</SelectItem>
                <SelectItem value="2">Week 2</SelectItem>
                <SelectItem value="3">Week 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={currentEntry.status}
              onValueChange={(value: any) => setCurrentEntry({ ...currentEntry, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="committed">Committed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Last Updated</Label>
            <div className="text-sm text-muted-foreground">{formatDate(currentEntry.lastUpdated)}</div>
          </div>
        </div>

        {/* Entry Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Entry Notes</Label>
          <Textarea
            id="notes"
            value={currentEntry.notes}
            onChange={(e) => setCurrentEntry({ ...currentEntry, notes: e.target.value })}
            placeholder="General notes about this look ahead entry..."
            className="min-h-[60px]"
          />
        </div>

        {/* Sub-Steps Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Sub-Steps</h3>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                {currentEntry.subSteps.length} steps • {totalEstimatedHours}h • {totalCrewSize} crew
              </div>
              <Button variant="outline" size="sm" onClick={handleAddSubStep} className="h-8 px-3 text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Add Step
              </Button>
            </div>
          </div>

          {/* Sub-Steps List */}
          <div className="space-y-3">
            {currentEntry.subSteps.map((subStep, index) => (
              <Card key={subStep.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(subStep.status)}
                      <span className="font-medium text-sm">Step {index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{subStep.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {subStep.assignedParty} • {subStep.crewSize} crew • {subStep.estimatedHours}h
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getStatusColor(subStep.status)}`}>
                      {subStep.status.replace("-", " ")}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSubStep(subStep)}
                      className="h-6 px-2 text-xs"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSubStep(subStep.id)}
                      className="h-6 px-2 text-xs text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {currentEntry.subSteps.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <PlayCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No sub-steps defined yet</p>
                <p className="text-sm">Click "Add Step" to break down this activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            {entry && onDelete && (
              <Button variant="destructive" size="sm" onClick={() => onDelete(entry.id)} className="h-8 px-3 text-xs">
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentEntry({ ...currentEntry, status: "draft" })}
              className="h-8 px-3 text-xs"
            >
              <Archive className="h-3 w-3 mr-1" />
              Save as Draft
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onCancel} className="h-8 px-3 text-xs">
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveEntry} className="h-8 px-3 text-xs">
              <Save className="h-3 w-3 mr-1" />
              Save & Commit
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Sub-Step Edit Dialog */}
      {editingSubStep && (
        <Dialog open={true} onOpenChange={() => setEditingSubStep(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isAddingSubStep ? "Add New Sub-Step" : "Edit Sub-Step"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={editingSubStep.description}
                  onChange={(e) => setEditingSubStep({ ...editingSubStep, description: e.target.value })}
                  placeholder="Describe the specific work to be done..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={editingSubStep.startDate.toISOString().split("T")[0]}
                    onChange={(e) => setEditingSubStep({ ...editingSubStep, startDate: new Date(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={editingSubStep.endDate.toISOString().split("T")[0]}
                    onChange={(e) => setEditingSubStep({ ...editingSubStep, endDate: new Date(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assignedParty">Assigned Party</Label>
                  <Select
                    value={editingSubStep.assignedParty}
                    onValueChange={(value) => setEditingSubStep({ ...editingSubStep, assignedParty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select crew..." />
                    </SelectTrigger>
                    <SelectContent>
                      {crewOptions.map((crew) => (
                        <SelectItem key={crew} value={crew}>
                          {crew}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editingSubStep.status}
                    onValueChange={(value: any) => setEditingSubStep({ ...editingSubStep, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-started">Not Started</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="crewSize">Crew Size</Label>
                  <Input
                    id="crewSize"
                    type="number"
                    min="1"
                    value={editingSubStep.crewSize}
                    onChange={(e) => setEditingSubStep({ ...editingSubStep, crewSize: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedHours">Estimated Hours</Label>
                  <Input
                    id="estimatedHours"
                    type="number"
                    min="0"
                    step="0.5"
                    value={editingSubStep.estimatedHours}
                    onChange={(e) =>
                      setEditingSubStep({ ...editingSubStep, estimatedHours: parseFloat(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={editingSubStep.notes}
                  onChange={(e) => setEditingSubStep({ ...editingSubStep, notes: e.target.value })}
                  placeholder="Additional notes or specific instructions..."
                />
              </div>

              <div className="space-y-2">
                <Label>Constraints</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {commonConstraints.map((constraint) => (
                    <label key={constraint} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingSubStep.constraints.includes(constraint)}
                        onChange={(e) => {
                          const constraints = e.target.checked
                            ? [...editingSubStep.constraints, constraint]
                            : editingSubStep.constraints.filter((c) => c !== constraint)
                          setEditingSubStep({ ...editingSubStep, constraints })
                        }}
                      />
                      <span className="text-sm">{constraint}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingSubStep(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveSubStep}>Save Sub-Step</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* AI Assistance Dialog */}
      {showAIDialog && (
        <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>AI Assistant</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">AI suggestions for "{currentEntry.activityName}":</div>
              <div className="space-y-2">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <p className="text-sm font-medium">Suggested Sub-Steps:</p>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>• Material preparation and layout</li>
                    <li>• Equipment setup and safety check</li>
                    <li>• Primary work execution</li>
                    <li>• Quality control and inspection</li>
                    <li>• Cleanup and next phase prep</li>
                  </ul>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                  <p className="text-sm font-medium">Potential Issues:</p>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>• Weather dependency for outdoor work</li>
                    <li>• Material delivery timing</li>
                    <li>• Crew availability conflicts</li>
                  </ul>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setShowAIDialog(false)}>Close</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}

export default LookAheadDetailEditor
