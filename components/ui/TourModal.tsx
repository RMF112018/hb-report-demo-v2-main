'use client'

import React, { useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, SkipForward } from 'lucide-react'
import { useTour } from '@/context/tour-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TourStepImage } from '@/components/ui/TourStepImage'
import { cn } from '@/lib/utils'

/**
 * TourModal - Modal-based tour interface
 * 
 * Features:
 * - Centered modal with semi-transparent backdrop
 * - Screenshot display with highlight support
 * - Navigation controls (Back/Next/Skip/Done)
 * - Progress indicator
 * - Keyboard navigation
 * - Dark/light theme support
 * - Responsive design
 */
export const TourModal: React.FC = () => {
  const {
    isActive: isTourActive,
    currentTour,
    currentStep: currentStepIndex,
    getCurrentTourDefinition,
    getCurrentStep,
    nextStep,
    prevStep,
    skipTour,
    stopTour
  } = useTour()

  // Get current tour and step data
  const tourDefinition = getCurrentTourDefinition()
  const currentStepData = getCurrentStep()
  const totalSteps = tourDefinition?.steps.length || 0

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isTourActive) return

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault()
        nextStep()
        break
      case 'ArrowLeft':
        event.preventDefault()
        prevStep()
        break
      case 'Escape':
        event.preventDefault()
        skipTour()
        break
      default:
        break
    }
  }, [isTourActive, nextStep, prevStep, skipTour])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  // Don't render if tour is not active
  if (!isTourActive || !currentTour || !currentStepData || !tourDefinition) {
    return null
  }

  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === totalSteps - 1
  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100

  const handleNext = () => {
    if (isLastStep) {
      stopTour() // Use stopTour instead of completeTour
    } else {
      nextStep()
    }
  }

  const handleImageError = () => {
    console.warn(`Failed to load tour image: ${currentStepData.screenshotUrl}`)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      {/* Modal Card */}
      <Card className="w-full max-w-4xl max-h-[90vh] bg-background border shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              {currentStepData.title}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={skipTour}
              className="h-8 w-8 p-0"
              aria-label="Close tour"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStepIndex + 1} of {totalSteps}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Screenshot Display */}
          {currentStepData.screenshotUrl && (
            <div className="relative">
              <TourStepImage
                src={currentStepData.screenshotUrl}
                alt={`${currentStepData.title} - Step ${currentStepIndex + 1}`}
                highlightRect={currentStepData.highlightRect}
                onError={handleImageError}
                className="rounded-lg border"
              />
            </div>
          )}

          {/* Step Description */}
          <div className="space-y-4">
            <div 
              className="text-sm text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: currentStepData.description }}
            />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              {/* Back Button */}
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={isFirstStep}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>{currentStepData.prevButton || 'Back'}</span>
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              {/* Skip Button */}
              {currentStepData.showSkip !== false && !isLastStep && (
                <Button
                  variant="ghost"
                  onClick={skipTour}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
                >
                  <SkipForward className="h-4 w-4" />
                  <span>Skip Tour</span>
                </Button>
              )}

              {/* Next/Done Button */}
              <Button
                onClick={handleNext}
                className="flex items-center space-x-2"
              >
                <span>
                  {isLastStep 
                    ? 'Finish Tour' 
                    : currentStepData.nextButton || 'Next'
                  }
                </span>
                {!isLastStep && <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
