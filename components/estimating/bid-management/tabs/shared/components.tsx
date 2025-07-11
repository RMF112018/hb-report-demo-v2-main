"use client"

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle, Edit, ChevronRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency } from "./utils"
import { ProjectPursuit } from "@/types/estimating"

interface EditableFieldProps {
  projectId: string
  field: string
  value: any
  type?: "text" | "number" | "currency" | "select"
  className?: string
  displayComponent?: React.ReactNode
  isEditMode: boolean
}

export const EditableField: React.FC<EditableFieldProps> = ({
  projectId,
  field,
  value,
  type = "text",
  className = "",
  displayComponent,
  isEditMode,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const { toast } = useToast()

  const handleStartEdit = useCallback(() => {
    if (!isEditMode) return
    setIsEditing(true)
    setEditValue(value)
  }, [isEditMode, value])

  const handleSaveEdit = useCallback(async () => {
    try {
      // In a real application, this would make an API call to update the project
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "Field Updated",
        description: `${field} has been updated successfully.`,
      })

      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update the field. Please try again.",
        variant: "destructive",
      })
    }
  }, [field, toast])

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false)
    setEditValue(value)
  }, [value])

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        {type === "currency" ? (
          <Input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(parseFloat(e.target.value) || 0)}
            className="w-32"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveEdit()
              if (e.key === "Escape") handleCancelEdit()
            }}
            autoFocus
          />
        ) : type === "number" ? (
          <Input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(parseFloat(e.target.value) || 0)}
            className="w-24"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveEdit()
              if (e.key === "Escape") handleCancelEdit()
            }}
            autoFocus
          />
        ) : (
          <Input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-32"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveEdit()
              if (e.key === "Escape") handleCancelEdit()
            }}
            autoFocus
          />
        )}
        <Button size="sm" onClick={handleSaveEdit}>
          <CheckCircle className="h-3 w-3" />
        </Button>
        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
          <XCircle className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  return (
    <div className={`group flex items-center gap-2 ${className}`}>
      {displayComponent || (
        <span className={type === "currency" ? "font-medium" : ""}>
          {type === "currency" ? formatCurrency(value) : value}
        </span>
      )}
      {isEditMode && (
        <Button
          size="sm"
          variant="ghost"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
          onClick={handleStartEdit}
        >
          <Edit className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}

interface ProjectNameLinkProps {
  project: ProjectPursuit
  onProjectNavigation: (projectId: string) => void
}

export const ProjectNameLink: React.FC<ProjectNameLinkProps> = ({ project, onProjectNavigation }) => (
  <div className="space-y-1">
    <Button
      variant="link"
      className="p-0 text-left justify-start font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
      onClick={() => onProjectNavigation(project.id)}
    >
      {project.name}
    </Button>
    <div className="text-sm text-muted-foreground">
      {project.projectNumber} • {project.client}
    </div>
    <div className="text-sm text-muted-foreground">{project.location}</div>
  </div>
)

interface ControlsRowProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
  isLoading: boolean
  onSync: () => void
  statusOptions: { value: string; label: string }[]
  additionalControls?: React.ReactNode
}

export const ControlsRow: React.FC<ControlsRowProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  isLoading,
  onSync,
  statusOptions,
  additionalControls,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onSync} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync
            </>
          )}
        </Button>
        {additionalControls}
      </div>
    </div>
  )
}

// Missing imports
import { Search, RefreshCw, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
