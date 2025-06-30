"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Plus, 
  FileText, 
  Calculator, 
  Send, 
  Save, 
  AlertTriangle,
  Info,
  DollarSign,
  Calendar,
  User
} from 'lucide-react'
import { useStaffingStore, type SPCR } from '../store/useStaffingStore'

interface SPCRCreatorPanelProps {
  projectId?: number
  onSuccess?: () => void
}

export const SPCRCreatorPanel: React.FC<SPCRCreatorPanelProps> = ({
  projectId = 2525840, // Default to Palm Beach project for PM
  onSuccess
}) => {
  const {
    spcrDraft,
    setSPCRDraft,
    saveSPCRDraft,
    clearSPCRDraft,
    calculateLaborCost,
    getStaffByProject,
    projects
  } = useStaffingStore()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const project = projects.find(p => p.project_id === projectId)
  const currentProjectStaff = getStaffByProject(projectId)

  // Common position options for construction projects
  const positionOptions = [
    'Project Manager I',
    'Project Manager II',
    'Project Manager III',
    'Senior Project Manager',
    'Assistant Project Manager',
    'Superintendent I',
    'Superintendent II',
    'Superintendent III',
    'General Superintendent',
    'Assistant Superintendent',
    'Project Executive',
    'Field Engineer',
    'Safety Manager',
    'Quality Manager'
  ]

  // Update draft function
  const updateDraft = (updates: Partial<SPCR>) => {
    setSPCRDraft({
      ...spcrDraft,
      project_id: projectId,
      createdBy: 'current-user', // Would use actual user ID
      status: 'pending',
      ...updates
    })
  }

  // Calculate impact preview
  const impactPreview = useMemo(() => {
    if (!spcrDraft || !spcrDraft.position || !spcrDraft.startDate || !spcrDraft.endDate) {
      return null
    }

    // Calculate duration
    const startDate = new Date(spcrDraft.startDate)
    const endDate = new Date(spcrDraft.endDate)
    const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const durationWeeks = Math.ceil(durationDays / 7)

    // Estimate labor rate based on position (mock calculation)
    const estimatedRate = getEstimatedRateForPosition(spcrDraft.position)
    const weeklyHours = 40
    const totalCost = estimatedRate * weeklyHours * durationWeeks

    // Check for potential conflicts
    const conflicts = currentProjectStaff.filter(staff => 
      staff.position === spcrDraft.position &&
      staff.assignments.some(assignment => {
        const assignStart = new Date(assignment.startDate)
        const assignEnd = new Date(assignment.endDate)
        return (startDate <= assignEnd && endDate >= assignStart)
      })
    )

    return {
      durationDays,
      durationWeeks,
      estimatedRate,
      totalCost,
      conflicts: conflicts.length,
      conflictNames: conflicts.map(staff => staff.name)
    }
  }, [spcrDraft, currentProjectStaff])

  // Helper function to estimate labor rate
  const getEstimatedRateForPosition = (position: string): number => {
    const rateMap: Record<string, number> = {
      'Project Executive': 85,
      'Senior Project Manager': 75,
      'Project Manager III': 70,
      'Project Manager II': 65,
      'Project Manager I': 60,
      'Assistant Project Manager': 50,
      'General Superintendent': 80,
      'Superintendent III': 75,
      'Superintendent II': 65,
      'Superintendent I': 55,
      'Assistant Superintendent': 45,
      'Field Engineer': 58,
      'Safety Manager': 62,
      'Quality Manager': 60
    }
    return rateMap[position] || 55
  }

  // Submit SPCR
  const handleSubmit = async () => {
    if (!spcrDraft || !validateDraft()) return

    setIsSubmitting(true)
    try {
      // Add calculated values to draft
      const finalDraft = {
        ...spcrDraft,
        budget: impactPreview?.totalCost || 0,
        scheduleRef: spcrDraft.scheduleRef || `${project?.name} - ${spcrDraft.position} Assignment`
      }
      
      setSPCRDraft(finalDraft)
      saveSPCRDraft()
      
      // Success callback
      onSuccess?.()
      
      // Reset form
      clearSPCRDraft()
      setShowPreview(false)
    } catch (error) {
      console.error('Failed to submit SPCR:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Validate draft
  const validateDraft = (): boolean => {
    return !!(spcrDraft?.type && spcrDraft?.position && spcrDraft?.startDate && spcrDraft?.endDate && spcrDraft?.explanation)
  }

  // Save as draft
  const handleSaveDraft = () => {
    if (spcrDraft) {
      // In a real implementation, this would save to a drafts collection
      console.log('Saving draft:', spcrDraft)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600 dark:text-green-400" />
            Create Staffing Plan Change Request
          </CardTitle>
          <Badge variant="outline">
            {project?.name || 'Project'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Request Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Request Type *</Label>
            <Select 
              value={spcrDraft?.type || ''} 
              onValueChange={(value) => updateDraft({ type: value as 'increase' | 'decrease' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select request type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="increase">Add Staff Member</SelectItem>
                <SelectItem value="decrease">Remove Staff Member</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position *</Label>
            <Select 
              value={spcrDraft?.position || ''} 
              onValueChange={(value) => updateDraft({ position: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {positionOptions.map(position => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={spcrDraft?.startDate?.split('T')[0] || ''}
              onChange={(e) => updateDraft({ startDate: e.target.value + 'T00:00:00Z' })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date *</Label>
            <Input
              id="endDate"
              type="date"
              value={spcrDraft?.endDate?.split('T')[0] || ''}
              onChange={(e) => updateDraft({ endDate: e.target.value + 'T23:59:59Z' })}
            />
          </div>
        </div>

        {/* Schedule Reference */}
        <div className="space-y-2">
          <Label htmlFor="scheduleRef">Schedule Activity Reference</Label>
          <Input
            id="scheduleRef"
            placeholder="e.g., Foundation Work - Task 152, MEP Rough-In - Phase 3"
            value={spcrDraft?.scheduleRef || ''}
            onChange={(e) => updateDraft({ scheduleRef: e.target.value })}
          />
        </div>

        {/* Justification */}
        <div className="space-y-2">
          <Label htmlFor="explanation">Justification *</Label>
          <Textarea
            id="explanation"
            placeholder="Provide detailed justification for this staffing change..."
            value={spcrDraft?.explanation || ''}
            onChange={(e) => updateDraft({ explanation: e.target.value })}
            rows={4}
          />
        </div>

        {/* Impact Preview */}
        {impactPreview && (
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Impact Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {impactPreview.durationWeeks}
                  </div>
                  <div className="text-xs text-muted-foreground">Weeks</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    ${impactPreview.estimatedRate}/hr
                  </div>
                  <div className="text-xs text-muted-foreground">Est. Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    ${impactPreview.totalCost.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Cost</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${impactPreview.conflicts > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {impactPreview.conflicts}
                  </div>
                  <div className="text-xs text-muted-foreground">Conflicts</div>
                </div>
              </div>

              {impactPreview.conflicts > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Potential scheduling conflicts with: {impactPreview.conflictNames.join(', ')}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Validation Messages */}
        {!validateDraft() && spcrDraft && Object.keys(spcrDraft).length > 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Please fill in all required fields to proceed with submission.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              disabled={!spcrDraft || Object.keys(spcrDraft).length === 0}
            >
              <Save className="h-4 w-4 mr-1" />
              Save Draft
            </Button>
            <Button 
              variant="outline" 
              onClick={clearSPCRDraft}
              disabled={!spcrDraft}
            >
              Clear
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              disabled={!validateDraft()}
            >
              <FileText className="h-4 w-4 mr-1" />
              {showPreview ? 'Hide' : 'Preview'}
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!validateDraft() || isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4 mr-1" />
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </div>

        {/* Preview Section */}
        {showPreview && validateDraft() && (
          <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Request Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Type:</strong> {spcrDraft?.type === 'increase' ? 'Add Staff' : 'Remove Staff'}
                </div>
                <div>
                  <strong>Position:</strong> {spcrDraft?.position}
                </div>
                <div>
                  <strong>Duration:</strong> {spcrDraft?.startDate && spcrDraft?.endDate && 
                    `${new Date(spcrDraft.startDate).toLocaleDateString()} - ${new Date(spcrDraft.endDate).toLocaleDateString()}`}
                </div>
                <div>
                  <strong>Estimated Cost:</strong> ${impactPreview?.totalCost.toLocaleString()}
                </div>
              </div>
              <div>
                <strong>Justification:</strong>
                <p className="text-sm text-muted-foreground mt-1">{spcrDraft?.explanation}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
} 