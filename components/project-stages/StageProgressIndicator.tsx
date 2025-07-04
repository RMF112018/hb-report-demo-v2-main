"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getStageOrder, getStageProgress, getStageConfig } from "@/types/project-stage-config"
import { CheckCircle, Circle } from "lucide-react"

interface StageProgressIndicatorProps {
  currentStage: string
  variant?: "full" | "compact"
  showProgress?: boolean
}

export const StageProgressIndicator = ({
  currentStage,
  variant = "full",
  showProgress = true,
}: StageProgressIndicatorProps) => {
  const stageOrder = getStageOrder()
  const currentStageIndex = stageOrder.indexOf(currentStage)
  const progressPercentage = getStageProgress(currentStage)

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-xs border-border">
          Stage {currentStageIndex + 1} of {stageOrder.length}
        </Badge>
        <span className="text-sm font-medium text-foreground">{currentStage}</span>
        {showProgress && (
          <div className="flex items-center gap-2">
            <Progress value={progressPercentage} className="w-20 h-2" />
            <span className="text-xs text-muted-foreground">{progressPercentage}%</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {showProgress && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground">Project Progress</span>
            <span className="text-foreground">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </div>
      )}

      <div className="flex items-center justify-between">
        {stageOrder.map((stage, index) => {
          const stageConfig = getStageConfig(stage)
          const isCompleted = index < currentStageIndex
          const isCurrent = index === currentStageIndex
          const isUpcoming = index > currentStageIndex

          return (
            <div key={stage} className="flex flex-col items-center space-y-2 flex-1">
              {/* Stage Icon */}
              <div
                className={`
                flex items-center justify-center w-8 h-8 rounded-full border-2 
                ${
                  isCompleted
                    ? "bg-green-600 dark:bg-green-500 border-green-600 dark:border-green-500 text-white"
                    : isCurrent
                    ? "bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500 text-white"
                    : "bg-background dark:bg-background border-border text-muted-foreground"
                }
              `}
              >
                {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              </div>

              {/* Stage Label */}
              <div className="text-center">
                <div
                  className={`
                  text-xs font-medium 
                  ${isCurrent ? "text-foreground" : "text-muted-foreground"}
                `}
                >
                  {stage}
                </div>
                {stageConfig && <div className="text-xs text-muted-foreground mt-1">{stageConfig.primaryFocus}</div>}
              </div>

              {/* Connector Line */}
              {index < stageOrder.length - 1 && (
                <div
                  className={`
                  absolute top-4 left-8 w-full h-0.5 
                  ${isCompleted ? "bg-green-600 dark:bg-green-500" : "bg-border"}
                `}
                  style={{
                    width: `calc(100% / ${stageOrder.length} - 32px)`,
                    marginLeft: "16px",
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
