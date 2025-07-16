/**
 * @fileoverview Schedule Computation Settings Audit Display
 * @module ComputationSettings
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Displays current computation settings and configuration audit for schedule analysis
 */

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import {
  Settings,
  CheckCircle,
  Clock,
  Target,
  GitBranch,
  Calculator,
  List,
  Grid3X3,
  Eye,
  MoreVertical,
  Download,
  RefreshCw,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Types
interface ComputationSetting {
  id: string
  label: string
  value: string | number | boolean
  type: "boolean" | "number" | "text" | "status"
  description: string
  status: "enabled" | "disabled" | "configured" | "default"
  icon: any
}

interface ComputationSettingsProps {
  className?: string
  showActions?: boolean
  viewMode?: "summary" | "checklist"
}

// Mock computation settings data
const computationSettings: ComputationSetting[] = [
  {
    id: "auto-calc",
    label: "Auto Calculation",
    value: true,
    type: "boolean",
    description: "Automatic schedule recalculation when changes are made",
    status: "enabled",
    icon: Calculator,
  },
  {
    id: "deadlines",
    label: "Project Deadlines",
    value: 15,
    type: "number",
    description: "Number of configured project deadlines and milestones",
    status: "configured",
    icon: Target,
  },
  {
    id: "task-types",
    label: "Task Types",
    value: 3,
    type: "number",
    description: "Defined task types for schedule categorization",
    status: "configured",
    icon: Grid3X3,
  },
  {
    id: "longest-path",
    label: "Path Analysis Method",
    value: "Longest Path",
    type: "text",
    description: "Critical path calculation methodology",
    status: "configured",
    icon: GitBranch,
  },
  {
    id: "multiple-float-paths",
    label: "Multiple Float Paths",
    value: true,
    type: "boolean",
    description: "Enable analysis of multiple float path scenarios",
    status: "enabled",
    icon: Clock,
  },
]

// Components
const SettingItem: React.FC<{
  setting: ComputationSetting
  viewMode: "summary" | "checklist"
  showDescription?: boolean
}> = ({ setting, viewMode, showDescription = true }) => {
  const IconComponent = setting.icon

  const getStatusColor = (status: string) => {
    switch (status) {
      case "enabled":
        return "bg-green-100 text-green-800 border-green-200"
      case "configured":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "disabled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const renderValue = () => {
    if (setting.type === "boolean") {
      return setting.value ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
      )
    }
    return <span className="font-medium">{setting.value}</span>
  }

  if (viewMode === "checklist") {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
        <div className="flex items-center gap-3">
          <IconComponent className="h-4 w-4 text-muted-foreground" />
          <div className="space-y-1">
            <div className="font-medium">{setting.label}</div>
            {showDescription && <div className="text-sm text-muted-foreground">{setting.description}</div>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {renderValue()}
          <Badge variant="outline" className={cn("text-xs", getStatusColor(setting.status))}>
            {setting.status.toUpperCase()}
          </Badge>
        </div>
      </div>
    )
  }

  // Summary view
  return (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-2">
        <IconComponent className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{setting.label}</span>
      </div>
      <div className="flex items-center justify-center">{renderValue()}</div>
      <div className="flex justify-end">
        <Badge variant="outline" className={cn("text-xs", getStatusColor(setting.status))}>
          {setting.status.toUpperCase()}
        </Badge>
      </div>
    </div>
  )
}

const ComputationSettings: React.FC<ComputationSettingsProps> = ({
  className,
  showActions = true,
  viewMode: initialViewMode = "summary",
}) => {
  const [viewMode, setViewMode] = useState<"summary" | "checklist">(initialViewMode)
  const [showDescriptions, setShowDescriptions] = useState(true)

  const enabledCount = computationSettings.filter((s) => s.status === "enabled").length
  const configuredCount = computationSettings.filter((s) => s.status === "configured").length
  const totalCount = computationSettings.length

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <div>
              <CardTitle>Computation Settings</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Schedule calculation configuration audit</p>
            </div>
          </div>

          {showActions && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>
                  {enabledCount + configuredCount}/{totalCount}
                </span>
                <span>configured</span>
              </div>

              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "summary" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("summary")}
                  className="rounded-r-none border-0"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "checklist" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("checklist")}
                  className="rounded-l-none border-0"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowDescriptions(!showDescriptions)}>
                    <Eye className="h-4 w-4 mr-2" />
                    {showDescriptions ? "Hide" : "Show"} Descriptions
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Export Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Audit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{enabledCount}</div>
              <div className="text-sm text-muted-foreground">Enabled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{configuredCount}</div>
              <div className="text-sm text-muted-foreground">Configured</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalCount}</div>
              <div className="text-sm text-muted-foreground">Total Settings</div>
            </div>
          </div>

          {/* Settings List */}
          {viewMode === "summary" && (
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-4 py-2 border-b font-medium text-sm text-muted-foreground">
                <div>Setting</div>
                <div className="text-center">Value</div>
                <div className="text-right">Status</div>
              </div>
              {computationSettings.map((setting) => (
                <SettingItem
                  key={setting.id}
                  setting={setting}
                  viewMode={viewMode}
                  showDescription={showDescriptions}
                />
              ))}
            </div>
          )}

          {viewMode === "checklist" && (
            <div className="space-y-3">
              {computationSettings.map((setting) => (
                <SettingItem
                  key={setting.id}
                  setting={setting}
                  viewMode={viewMode}
                  showDescription={showDescriptions}
                />
              ))}
            </div>
          )}

          {/* Configuration Summary */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last Updated</span>
              <span className="font-medium">Dec 30, 2025 at 2:30 PM</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-muted-foreground">Computation Engine</span>
              <Badge variant="secondary">SmartPM v3.2.1</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ComputationSettings
