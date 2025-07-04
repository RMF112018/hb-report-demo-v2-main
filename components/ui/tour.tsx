'use client'

import React, { useEffect, useRef, useState, Suspense } from 'react'
import { X, ArrowLeft, ArrowRight, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTour } from '@/context/tour-context'
import { useTourPositioning } from '@/hooks/useTourPositioning'
import { TOUR_CONSTANTS, TOUR_THEMES } from '@/lib/tour-constants'
import { tourLogger, tourDOMUtils, tourAnimations, tourEventUtils, tourPerformance } from '@/lib/tour-utils'

interface TourProps {
  className?: string
}

/**
 * @deprecated This component is deprecated in favor of TourModal
 * 
 * LEGACY: Standardized Tour component with Shadcn UI Card-based tooltips
 * 
 * This component has been replaced by TourModal which uses a modal-based approach
 * instead of DOM positioning. This component is kept for compatibility during migration.
 * 
 * Features:
 * - Standardized tooltip structure using Shadcn UI Card
 * - Enhanced anchoring for target visibility
 * - Performance optimized for Web Vitals (LCP <1s, CLS <0.1)
 * - WCAG-compliant accessibility
 * - Consistent theming for light/dark modes
 */
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

  // Enhanced positioning with performance measurement
  const { positions, targetElement, isPositioning, error: positionError } = useTourPositioning({
    target: currentStepData?.target || '',
    placement: currentStepData?.placement || 'center',
    isActive: isActive && !!currentStepData
  })

  // Performance-optimized mounting with Suspense support
  useEffect(() => {
    const mountTour = tourPerformance.measureExecutionTime(() => {
      if (isActive && currentStepData) {
        setIsMounted(true)
        
        // Enhanced element visibility check
        if (targetElement) {
          tourDOMUtils.ensureElementVisibility(targetElement)
            .then(() => {
              tourLogger.debug('Target element visibility ensured')
              setIsVisible(true)
            })
            .catch((err) => {
              tourLogger.error('Failed to ensure element visibility:', err)
              // Still show tooltip but log the issue
              setIsVisible(true)
            })
        } else {
          // Small delay for positioning to complete
          setTimeout(() => setIsVisible(true), 50)
        }
      } else {
        setIsVisible(false)
        const timer = setTimeout(() => {
          setIsMounted(false)
        }, TOUR_CONSTANTS.FADE_DURATION)
        
        return () => clearTimeout(timer)
      }
    }, 'Tour Mount')

    return mountTour()
  }, [isActive, currentStepData, targetElement])

  // Enhanced keyboard navigation with debouncing
  useEffect(() => {
    if (!isActive || !isVisible) return

    const debouncedKeyboardHandler = tourEventUtils.debounce(
      tourEventUtils.createKeyboardHandler({
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
      }),
      TOUR_CONSTANTS.ELEMENT_SEARCH_DELAY
    )

    document.addEventListener('keydown', debouncedKeyboardHandler)
    return () => document.removeEventListener('keydown', debouncedKeyboardHandler)
  }, [isActive, isVisible, currentStep, nextStep, prevStep, stopTour, isTransitioning])

  // Enhanced focus management with WCAG compliance
  useEffect(() => {
    if (!isVisible || !tooltipRef.current) return

    const setupFocusTrap = tourPerformance.measureExecutionTime(() => {
      // Clean up previous focus trap
      if (focusTrapRef.current) {
        focusTrapRef.current()
      }

      // Set up new focus trap
      focusTrapRef.current = tourDOMUtils.trapFocus(tooltipRef.current!)

      return () => {
        if (focusTrapRef.current) {
          focusTrapRef.current()
          focusTrapRef.current = null
        }
      }
    }, 'Focus Trap Setup')

    return setupFocusTrap()
  }, [isVisible, currentStep])

  // Optimized step transitions with CLS prevention
  const handleStepTransition = async (transitionFn: () => void) => {
    if (isTransitioning) return

    try {
      setIsTransitioning(true)
      
      // Fade out with hardware acceleration
      if (tooltipRef.current) {
        tooltipRef.current.style.transform = 'translate3d(0, 0, 0)'
        tooltipRef.current.style.willChange = 'transform, opacity'
        await tourAnimations.fadeOut(tooltipRef.current, TOUR_CONSTANTS.FADE_DURATION)
      }
      
      // Execute transition
      transitionFn()
      
      // Small delay for positioning to complete
      setTimeout(() => {
        // Fade in new tooltip with hardware acceleration
        if (tooltipRef.current) {
          tourAnimations.fadeIn(tooltipRef.current, TOUR_CONSTANTS.FADE_DURATION)
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

  // Enhanced error handling with logging
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

  // Optimized loading state with Suspense
  if (isPositioning) {
    return (
      <div 
        style={{ 
          ...positions.overlayStyle, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'fixed',
          zIndex: TOUR_CONSTANTS.OVERLAY_Z_INDEX
        }}
      >
        <Card className="p-4 max-w-sm">
          <CardContent className="flex items-center space-x-2 p-0">
            <div 
              className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"
              data-testid="loading-spinner"
              aria-hidden="true"
            />
            <span className="text-sm">Loading tour...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalSteps = tourDefinition.steps.length
  const stepNumber = currentStep + 1
  const progressPercentage = (stepNumber / totalSteps) * 100

  return (
    <Suspense fallback={<div>Loading tour...</div>}>
      {/* Overlay with theme support */}
      <div 
        style={{
          ...positions.overlayStyle,
          backgroundColor: TOUR_THEMES.light.overlayColor,
          position: 'fixed',
          zIndex: TOUR_CONSTANTS.OVERLAY_Z_INDEX
        }}
        className="tour-overlay"
      />
      
      {/* Standardized Tooltip using Shadcn UI Card */}
      <Card
        ref={tooltipRef}
        style={{
          ...positions.tooltipStyle,
          maxWidth: `${TOUR_CONSTANTS.MAX_TOOLTIP_WIDTH}px`,
          minWidth: `${TOUR_CONSTANTS.MIN_TOOLTIP_WIDTH}px`,
          position: 'fixed',
          zIndex: TOUR_CONSTANTS.TOOLTIP_Z_INDEX,
          transform: 'translate3d(0, 0, 0)', // Hardware acceleration for CLS
          willChange: 'transform, opacity' // Optimized for animations
        }}
        className={`
          tour-tooltip
          ${isVisible ? 'opacity-100' : 'opacity-0'}
          ${isTransitioning ? 'pointer-events-none' : 'pointer-events-auto'}
          transition-opacity duration-150 ease-in-out
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          border-gray-200 dark:border-gray-700
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
        
        {/* Standardized Card Header */}
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 
                  id="tour-title" 
                  className="text-lg font-semibold text-gray-900 dark:text-white truncate"
                >
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
        </CardHeader>

        {/* Standardized Card Content */}
        <CardContent 
          className="overflow-y-auto scrollbar-thin"
          style={{ maxHeight: `${positions.contentAreaHeight}px` }}
        >
          <div
            id="tour-content"
            className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
            data-tour-content
            dangerouslySetInnerHTML={{ __html: currentStepData.content }}
          />
        </CardContent>
            
        {/* Standardized Card Footer */}
        <CardFooter className="flex items-center justify-between pt-2">
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
        </CardFooter>

        {/* Enhanced error display */}
        {(error || positionError) && (
          <div className="mx-4 mb-4 p-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs rounded border border-red-200 dark:border-red-800">
            <strong>Tour Error:</strong> {error || positionError}
          </div>
        )}
      </Card>
    </Suspense>
  )
}

// Re-export TourControls for convenience
export { TourControls } from '@/components/ui/tour-controls' 