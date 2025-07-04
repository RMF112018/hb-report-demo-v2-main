"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  FileText,
  ArrowRight,
  Lock,
  Unlock,
  Settings,
  Bell,
} from "lucide-react"
import { getStageConfig, getNextStages, isStageTransitionValid } from "@/types/project-stage-config"

interface StageTransitionManagerProps {
  project: any
  currentStage: string
  userRole: string
  onStageChange: (newStage: string) => void
  showNotifications?: boolean
}

export const StageTransitionManager = ({
  project,
  currentStage,
  userRole,
  onStageChange,
  showNotifications = true,
}: StageTransitionManagerProps) => {
  const [selectedStage, setSelectedStage] = useState<string>("")
  const [transitionDialogOpen, setTransitionDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const currentStageConfig = getStageConfig(currentStage)
  const nextStages = getNextStages(currentStage)

  // Check if user can manage stage transitions
  const canManageTransitions = userRole === "admin" || userRole === "project_manager"

  // Mock completion requirements check
  const getCompletionStatus = (stage: string) => {
    const mockCompletionData = {
      "BIM Coordination": {
        completed: 8,
        total: 10,
        requirements: [
          { name: "All major clashes resolved", completed: true },
          { name: "Design documentation complete", completed: true },
          { name: "Coordination sign-off", completed: false },
          { name: "BIM model validation", completed: true },
          { name: "Final design review", completed: false },
        ],
      },
      Bidding: {
        completed: 12,
        total: 15,
        requirements: [
          { name: "Final estimate complete", completed: true },
          { name: "All sub-bids received", completed: true },
          { name: "Bid package submitted", completed: false },
          { name: "Market analysis complete", completed: true },
          { name: "Risk assessment", completed: false },
        ],
      },
      "Pre-Construction": {
        completed: 6,
        total: 8,
        requirements: [
          { name: "Contract executed", completed: true },
          { name: "Major permits obtained", completed: false },
          { name: "Value engineering complete", completed: true },
          { name: "Site preparation approved", completed: false },
        ],
      },
      Construction: {
        completed: 45,
        total: 50,
        requirements: [
          { name: "Construction substantially complete", completed: true },
          { name: "All inspections passed", completed: true },
          { name: "Punch list started", completed: false },
          { name: "Final systems testing", completed: true },
          { name: "Client walkthrough", completed: false },
        ],
      },
      Closeout: {
        completed: 18,
        total: 20,
        requirements: [
          { name: "Punch list complete", completed: true },
          { name: "All documentation finalized", completed: false },
          { name: "Final billing processed", completed: true },
          { name: "Client training complete", completed: false },
        ],
      },
      Warranty: {
        completed: 12,
        total: 15,
        requirements: [
          { name: "Warranty period expired", completed: false },
          { name: "All claims resolved", completed: true },
          { name: "Client sign-off received", completed: false },
          { name: "Final inspection complete", completed: true },
        ],
      },
    }

    return mockCompletionData[stage as keyof typeof mockCompletionData] || { completed: 0, total: 0, requirements: [] }
  }

  const currentStageStatus = getCompletionStatus(currentStage)
  const completionPercentage = Math.round((currentStageStatus.completed / currentStageStatus.total) * 100)

  const handleTransition = async (newStage: string) => {
    if (!canManageTransitions) return

    setLoading(true)
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onStageChange(newStage)
      setTransitionDialogOpen(false)
      setSelectedStage("")

      // In production, this would:
      // - Send notifications to team members
      // - Update project timeline
      // - Trigger workflow automation
      // - Log the transition
    } catch (error) {
      console.error("Stage transition error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStageIcon = (stage: string, isCompleted: boolean) => {
    if (isCompleted) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (stage === currentStage) return <Clock className="h-4 w-4 text-blue-600" />
    return <AlertCircle className="h-4 w-4 text-muted-foreground" />
  }

  const getStageColor = (stage: string) => {
    const config = getStageConfig(stage)
    return config?.stageColor || "bg-gray-100 text-gray-800"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Stage Management
            </CardTitle>
            <CardDescription>Current stage completion and transition controls</CardDescription>
          </div>
          {showNotifications && (
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Stage Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{currentStage}</h3>
            <Badge className={getStageColor(currentStage)}>{completionPercentage}% Complete</Badge>
          </div>

          <Progress value={completionPercentage} className="w-full" />

          <div className="text-sm text-muted-foreground">
            {currentStageStatus.completed} of {currentStageStatus.total} requirements completed
          </div>
        </div>

        <Separator />

        {/* Completion Requirements */}
        <div className="space-y-3">
          <h4 className="font-medium">Completion Requirements</h4>
          <div className="space-y-2">
            {currentStageStatus.requirements.map((req, index) => (
              <div key={index} className="flex items-center gap-2">
                {req.completed ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                )}
                <span className={`text-sm ${req.completed ? "line-through text-muted-foreground" : ""}`}>
                  {req.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Available Transitions */}
        {canManageTransitions && nextStages.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium">Available Transitions</h4>
              <div className="grid grid-cols-1 gap-2">
                {nextStages.map((stage) => {
                  const stageConfig = getStageConfig(stage)
                  const isValid = isStageTransitionValid(currentStage, stage)

                  return (
                    <Dialog key={stage} open={transitionDialogOpen && selectedStage === stage}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-start"
                          disabled={!isValid}
                          onClick={() => {
                            setSelectedStage(stage)
                            setTransitionDialogOpen(true)
                          }}
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Transition to {stage}
                          {!isValid && <Lock className="h-4 w-4 ml-2 text-muted-foreground" />}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Transition to {stage}</DialogTitle>
                          <DialogDescription>Confirm stage transition for {project.name}</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Stage Transition</AlertTitle>
                            <AlertDescription>
                              This will transition the project from {currentStage} to {stage}. This action cannot be
                              undone and will notify all team members.
                            </AlertDescription>
                          </Alert>

                          <div className="space-y-2">
                            <h4 className="font-medium">What happens next:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• Team members will be notified of the stage change</li>
                              <li>• Project timeline will be updated</li>
                              <li>• Stage-specific workflows will be activated</li>
                              <li>• Reporting requirements will be updated</li>
                            </ul>
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setTransitionDialogOpen(false)
                                setSelectedStage("")
                              }}
                            >
                              Cancel
                            </Button>
                            <Button onClick={() => handleTransition(stage)} disabled={loading}>
                              {loading ? "Transitioning..." : "Confirm Transition"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* Access Control Information */}
        {!canManageTransitions && (
          <>
            <Separator />
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertTitle>Limited Access</AlertTitle>
              <AlertDescription>
                Your role ({userRole}) does not have permissions to manage stage transitions. Contact your project
                manager to request stage changes.
              </AlertDescription>
            </Alert>
          </>
        )}
      </CardContent>
    </Card>
  )
}
