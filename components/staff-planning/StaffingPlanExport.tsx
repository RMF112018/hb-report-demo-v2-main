'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  FileText, 
  FileSpreadsheet, 
  FileImage, 
  Download,
  Calendar,
  Grid3X3,
  Target,
  X
} from 'lucide-react'
import { format } from 'date-fns'
import type { StaffingPlan } from '@/types/staff-planning'

interface StaffingPlanExportProps {
  plan: StaffingPlan
  onExport: (format: 'json' | 'excel' | 'pdf') => void
  onClose: () => void
}

export const StaffingPlanExport: React.FC<StaffingPlanExportProps> = ({
  plan,
  onExport,
  onClose
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'json' | 'excel' | 'pdf'>('excel')
  const [includeGantt, setIncludeGantt] = useState(true)
  const [includeMatrix, setIncludeMatrix] = useState(true)
  const [includeDetails, setIncludeDetails] = useState(true)

  const exportOptions = [
    {
      format: 'json' as const,
      label: 'JSON',
      description: 'Raw data format for system integration',
      icon: FileText,
      color: 'text-blue-600',
      badge: 'Data'
    },
    {
      format: 'excel' as const,
      label: 'Excel',
      description: 'Spreadsheet format with multiple sheets',
      icon: FileSpreadsheet,
      color: 'text-green-600',
      badge: 'Popular'
    },
    {
      format: 'pdf' as const,
      label: 'PDF',
      description: 'Formatted report for presentation',
      icon: FileImage,
      color: 'text-red-600',
      badge: 'Report'
    }
  ]

  const handleExport = () => {
    onExport(selectedFormat)
  }

  const totalActivities = plan.activities.length
  const totalAllocations = plan.allocations.reduce((sum, allocation) => 
    sum + Object.values(allocation.monthlyAllocations).reduce((a, b) => a + b, 0), 0
  )
  const estimatedSize = selectedFormat === 'pdf' ? '2-5 MB' : 
                        selectedFormat === 'excel' ? '500 KB - 2 MB' : '< 100 KB'

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Staffing Plan
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Summary */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-3">Plan Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <span className="ml-2 font-medium">{plan.name || 'Untitled Plan'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Project:</span>
                <span className="ml-2 font-medium">{plan.projectName || 'No Project'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <span className="ml-2 font-medium">
                  {format(plan.startDate, 'MMM d, yyyy')} - {format(plan.endDate, 'MMM d, yyyy')}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={plan.status === 'active' ? 'default' : 'secondary'} className="ml-2">
                  {plan.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Export Format Selection */}
          <div>
            <h3 className="font-medium mb-3">Export Format</h3>
            <div className="grid grid-cols-1 gap-3">
              {exportOptions.map(option => (
                <div
                  key={option.format}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedFormat === option.format 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                      : 'border-border hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedFormat(option.format)}
                >
                  <div className="flex items-center gap-3">
                    <option.icon className={`h-5 w-5 ${option.color}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{option.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {option.badge}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <div className="w-4 h-4 border-2 rounded-full flex items-center justify-center">
                      {selectedFormat === option.format && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div>
            <h3 className="font-medium mb-3">Include in Export</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="include-gantt" 
                  checked={includeGantt}
                  onCheckedChange={(checked) => setIncludeGantt(checked as boolean)}
                />
                <Label htmlFor="include-gantt" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Activity Timeline ({totalActivities} activities)
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="include-matrix" 
                  checked={includeMatrix}
                  onCheckedChange={(checked) => setIncludeMatrix(checked as boolean)}
                />
                <Label htmlFor="include-matrix" className="flex items-center gap-2">
                  <Grid3X3 className="h-4 w-4" />
                  Allocation Matrix ({totalAllocations} total FTE)
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="include-details" 
                  checked={includeDetails}
                  onCheckedChange={(checked) => setIncludeDetails(checked as boolean)}
                />
                <Label htmlFor="include-details" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Plan Details & Metadata
                </Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Export Preview */}
          <div className="p-4 bg-muted/25 rounded-lg">
            <h4 className="font-medium mb-2">Export Preview</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>• Format: {exportOptions.find(opt => opt.format === selectedFormat)?.label}</div>
              <div>• Estimated size: {estimatedSize}</div>
              <div>• Components: {[
                includeGantt && 'Timeline',
                includeMatrix && 'Matrix',
                includeDetails && 'Details'
              ].filter(Boolean).join(', ')}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleExport} 
              disabled={!includeGantt && !includeMatrix && !includeDetails}
            >
              <Download className="h-4 w-4 mr-2" />
              Export {selectedFormat.toUpperCase()}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 