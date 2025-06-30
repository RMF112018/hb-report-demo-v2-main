'use client'

import React, { useEffect, useRef, useState } from 'react'
import { X, ArrowLeft, ArrowRight, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTour } from '@/context/tour-context'
import { useTourPositioning } from '@/hooks/useTourPositioning'
import { TOUR_CONSTANTS } from '@/lib/tour-constants'
import { tourLogger, tourDOMUtils, tourAnimations, tourEventUtils } from '@/lib/tour-utils'

interface TourProps {
  className?: string
}

export const Tour: React.FC<TourProps> = ({ className = '' }) => {
  const {
    isActive,
    currentStep,
    nextStep,
    prevStep,
    skipTour,
    stopTour,
    getCurrentStep,
    getCurrentTourDefinition,
    error
  } = useTour()

  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const tooltipRef = useRef<HTMLDivElement>(null)
  const focusTrapRef = useRef<(() => void) | null>(null)

  const currentStepData = getCurrentStep()
  const tourDefinition = getCurrentTourDefinition()

  // Use improved positioning hook
  const { positions, targetElement, isPositioning, error: positionError } = useTourPositioning({
    target: currentStepData?.target || '',
    placement: currentStepData?.placement || 'center',
    isActive: isActive && !!currentStepData
  })

  // Handle component mounting
  useEffect(() => {
    if (isActive && currentStepData) {
      setIsMounted(true)
      // Small delay before showing to allow positioning to complete
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 50)
      
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => {
        setIsMounted(false)
      }, TOUR_CONSTANTS.FADE_DURATION)
      
      return () => clearTimeout(timer)
    }
  }, [isActive, currentStepData])

  // Enhanced keyboard navigation
  useEffect(() => {
    if (!isActive || !isVisible) return

    const keyboardHandler = tourEventUtils.createKeyboardHandler({
      'Escape': () => {
        tourLogger.debug('Escape key pressed, stopping tour')
        stopTour()
      },
      'ArrowRight': () => {
        if (!isTransitioning) {
          tourLogger.debug('Arrow right pressed, next step')
          nextStep()
        }
      },
      'ArrowLeft': () => {
        if (!isTransitioning && currentStep > 0) {
          tourLogger.debug('Arrow left pressed, previous step')
          prevStep()
        }
      },
      'Enter': () => {
        if (!isTransitioning) {
          tourLogger.debug('Enter key pressed, next step')
          nextStep()
        }
      }
    })

    document.addEventListener('keydown', keyboardHandler)
    return () => document.removeEventListener('keydown', keyboardHandler)
  }, [isActive, isVisible, currentStep, nextStep, prevStep, stopTour, isTransitioning])

  // Enhanced focus management
  useEffect(() => {
    if (!isVisible || !tooltipRef.current) return

    // Clean up previous focus trap
    if (focusTrapRef.current) {
      focusTrapRef.current()
    }

    // Set up new focus trap
    focusTrapRef.current = tourDOMUtils.trapFocus(tooltipRef.current)

    return () => {
      if (focusTrapRef.current) {
        focusTrapRef.current()
        focusTrapRef.current = null
      }
    }
  }, [isVisible, currentStep])

  // Handle step transitions with animation
  const handleStepTransition = async (transitionFn: () => void) => {
    if (isTransitioning) return

    try {
      setIsTransitioning(true)
      
      // Fade out tooltip
      if (tooltipRef.current) {
        await tourAnimations.fadeOut(tooltipRef.current, TOUR_CONSTANTS.FADE_DURATION / 2)
      }
      
      // Execute transition
      transitionFn()
      
      // Small delay for positioning to complete
      setTimeout(() => {
        // Fade in new tooltip
        if (tooltipRef.current) {
          tourAnimations.fadeIn(tooltipRef.current, TOUR_CONSTANTS.FADE_DURATION / 2)
        }
        setIsTransitioning(false)
      }, 100)
      
    } catch (err) {
      tourLogger.error('Error during step transition:', err)
      setIsTransitioning(false)
    }
  }

  // Enhanced navigation handlers
  const handleNext = () => handleStepTransition(nextStep)
  const handlePrev = () => handleStepTransition(prevStep)
  const handleSkip = () => handleStepTransition(skipTour)

  // Handle clicks outside tooltip
  useEffect(() => {
    if (!isVisible) return

    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        // Don't close if clicking on the target element
        if (targetElement && targetElement.contains(event.target as Node)) {
          return
        }
        tourLogger.debug('Clicked outside tooltip, stopping tour')
        stopTour()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isVisible, targetElement, stopTour])

  // Error handling
  useEffect(() => {
    if (error || positionError) {
      tourLogger.error('Tour error detected:', error || positionError)
      // Don't automatically stop on error - let user decide
    }
  }, [error, positionError])

  // Don't render if not mounted or no current step
  if (!isMounted || !currentStepData || !tourDefinition) {
    return null
  }

  // Loading state
  if (isPositioning) {
    return (
      <div style={{ ...positions.overlayStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-sm">Loading tour...</span>
          </div>
        </div>
      </div>
    )
  }

  const totalSteps = tourDefinition.steps.length
  const stepNumber = currentStep + 1
  const progressPercentage = (stepNumber / totalSteps) * 100

  return (
    <>
      {/* Overlay */}
      <div style={positions.overlayStyle} className="tour-overlay" />
      
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        style={positions.tooltipStyle}
        className={`
          tour-tooltip bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700
          ${isVisible ? 'opacity-100' : 'opacity-0'}
          ${isTransitioning ? 'pointer-events-none' : 'pointer-events-auto'}
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        aria-describedby="tour-content"
        data-tour-tooltip
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
        {/* Header */}
        <div className="flex items-start justify-between p-4 pb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 id="tour-title" className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {currentStepData.title}
              </h3>
              {currentStepData.showSkip && (
                <Badge variant="secondary" className="text-xs">
                  Optional
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{tourDefinition.name}</span>
              <span>•</span>
              <span>Step {stepNumber} of {totalSteps}</span>
            </div>
          </div>
      <Button
        variant="ghost"
        size="sm"
            onClick={stopTour}
            className="flex-shrink-0 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close tour"
      >
            <X className="h-4 w-4" />
      </Button>
        </div>

        {/* Content */}
        <div 
          className="px-4 pb-4 overflow-y-auto scrollbar-thin"
          style={{ maxHeight: `${positions.contentAreaHeight}px` }}
        >
          <div
            id="tour-content"
            className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
            data-tour-content
            dangerouslySetInnerHTML={{ __html: currentStepData.content }}
          />
            </div>
            
        {/* Footer */}
        <div className="flex items-center justify-between p-4 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {/* Previous button */}
                <Button
                  variant="outline"
                  size="sm"
              onClick={handlePrev}
              disabled={currentStep === 0 || isTransitioning}
              className="h-8 px-3"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              {currentStepData.prevButton || 'Back'}
                </Button>
            
            {/* Skip button */}
            {currentStepData.showSkip && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                disabled={isTransitioning}
                className="h-8 px-3 text-gray-500 hover:text-gray-700"
              >
                <SkipForward className="h-3 w-3 mr-1" />
                Skip
              </Button>
            )}
          </div>

          {/* Next/Finish button */}
          <Button
            size="sm"
            onClick={handleNext}
            disabled={isTransitioning}
            className="h-8 px-4"
          >
            {currentStepData.nextButton || (stepNumber === totalSteps ? 'Finish' : 'Next')}
            {stepNumber < totalSteps && <ArrowRight className="h-3 w-3 ml-1" />}
          </Button>
        </div>

        {/* Error message */}
        {(error || positionError) && (
          <div className="mx-4 mb-4 p-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs rounded border border-red-200 dark:border-red-800">
            {error || positionError}
            </div>
      )}
    </div>
    </>
  )
} 

// Re-export TourControls for convenience
export { TourControls } from '@/components/ui/tour-controls' 