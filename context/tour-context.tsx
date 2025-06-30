'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useMemo, useCallback } from 'react'
import { useAuth } from './auth-context'
import { TOUR_DEFINITIONS, TourStep, TourDefinition } from '@/data/tours/tour-definitions'
import { TOUR_CONSTANTS } from '@/lib/tour-constants'
import { tourLogger, tourStorage, tourErrorUtils } from '@/lib/tour-utils'

interface TourContextType {
  isActive: boolean
  currentTour: string | null
  currentStep: number
  availableTours: TourDefinition[]
  startTour: (tourId: string, isAutoStart?: boolean) => void
  stopTour: () => void
  nextStep: () => void
  prevStep: () => void
  skipTour: () => void
  goToStep: (stepIndex: number) => void
  toggleTourAvailability: () => void
  isTourAvailable: boolean
  getCurrentTourDefinition: () => TourDefinition | null
  getCurrentStep: () => TourStep | null
  resetTourState: () => void
  isLoading: boolean
  error: string | null
}

const TourContext = createContext<TourContextType | undefined>(undefined)

export const TourProvider = ({ children }: { children: ReactNode }) => {
  const [isActive, setIsActive] = useState(false)
  const [currentTour, setCurrentTour] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isTourAvailable, setIsTourAvailable] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { user } = useAuth()

  // Load tour availability preference with error handling
  useEffect(() => {
    const loadTourPreferences = async () => {
      try {
        const available = tourStorage.getTourAvailability()
      setIsTourAvailable(available)
        tourLogger.debug('Tour preferences loaded:', { available })
      } catch (err) {
        tourLogger.error('Failed to load tour preferences:', err)
        setIsTourAvailable(true) // Default to true on error
      }
    }

    loadTourPreferences()
  }, [])

  // Get available tours based on user role and current page with memoization
  const availableTours = useMemo(() => {
    try {
      return TOUR_DEFINITIONS.filter(tour => {
    if (tour.userRoles && user) {
      return tour.userRoles.includes(user.role)
    }
    return true
  })
    } catch (err) {
      tourLogger.error('Error filtering available tours:', err)
      return []
    }
  }, [user?.role])

  // Memoized helper functions
  const getCurrentTourDefinition = useCallback((): TourDefinition | null => {
    if (!currentTour) return null
    return TOUR_DEFINITIONS.find(tour => tour.id === currentTour) || null
  }, [currentTour])

  const getCurrentStep = useCallback((): TourStep | null => {
    const tour = getCurrentTourDefinition()
    if (!tour || currentStep >= tour.steps.length) return null
    return tour.steps[currentStep]
  }, [getCurrentTourDefinition, currentStep])

  // Enhanced start tour function with better error handling and performance
  const startTour = useCallback(async (tourId: string, isAutoStart: boolean = false) => {
    try {
      setIsLoading(true)
      setError(null)
      
      tourLogger.info('Starting tour:', { tourId, isAutoStart })
    
      // Check if tour was already shown in this session for auto-starts
      if (isAutoStart && tourStorage.hasTourBeenShownInSession(tourId)) {
        tourLogger.debug(`Tour ${tourId} already shown in session, skipping auto-start`)
        return
      }

      // Validate tour exists
      const tour = TOUR_DEFINITIONS.find(t => t.id === tourId)
      if (!tour) {
        const errorMsg = `Tour not found: ${tourId}`
        tourLogger.error(errorMsg)
        setError(errorMsg)
        return
      }

      // Validate tour definition
      const validationErrors = tourErrorUtils.safeExecute(
        () => {
          // Simple validation - could be expanded
          if (!tour.steps || tour.steps.length === 0) {
            return ['Tour has no steps']
          }
          return []
        },
        ['Unknown validation error'],
        'Tour validation failed'
      )
      
      if ((await validationErrors).length > 0) {
        const errorMsg = `Tour validation failed: ${(await validationErrors).join(', ')}`
        tourLogger.error(errorMsg)
        setError(errorMsg)
        return
      }
      
      // Mark as shown if auto-start
      if (isAutoStart) {
        tourStorage.markTourAsShown(tourId)
    }
    
      // Start the tour
      setCurrentTour(tourId)
      setCurrentStep(0)
      setIsActive(true)
      
      tourLogger.info('Tour started successfully:', tourId)
    } catch (err) {
      const errorMsg = `Failed to start tour: ${err}`
      tourLogger.error(errorMsg, err)
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Enhanced stop tour function
  const stopTour = useCallback(async () => {
    try {
      tourLogger.info('Stopping tour:', currentTour)
      
    setIsActive(false)
      
      // Clean up any tour-specific DOM modifications
      await tourErrorUtils.safeExecute(
        () => {
          // Close demo accounts dropdown if it was opened by tour
          const button = document.querySelector('[data-tour="demo-accounts-toggle"]') as HTMLButtonElement
          const dropdown = document.querySelector('[data-tour="demo-accounts-list"]')
          if (button && dropdown) {
            button.click()
          }
        },
        undefined,
        'Failed to clean up tour DOM modifications'
      )

      // Reset state after a delay to allow animations to complete
      setTimeout(() => {
    setCurrentTour(null)
    setCurrentStep(0)
        setError(null)
      }, TOUR_CONSTANTS.TOUR_CLEANUP_DELAY)

    } catch (err) {
      tourLogger.error('Error stopping tour:', err)
      // Force reset even if cleanup failed
      setCurrentTour(null)
      setCurrentStep(0)
      setError(null)
    }
  }, [currentTour])

  // Enhanced navigation functions with error handling
  const nextStep = useCallback(async () => {
    try {
    const tour = getCurrentTourDefinition()
    if (!tour) return

    const step = getCurrentStep()
      
      // Execute step's onNext callback if it exists
    if (step?.onNext) {
        await tourErrorUtils.safeExecute(
          () => step.onNext!(),
          undefined,
          'Error executing step onNext callback'
        )
    }

    if (currentStep < tour.steps.length - 1) {
      setCurrentStep(currentStep + 1)
        tourLogger.debug('Advanced to next step:', currentStep + 1)
    } else {
        tourLogger.info('Tour completed')
        await stopTour()
    }
    } catch (err) {
      tourLogger.error('Error advancing to next step:', err)
      setError('Failed to advance to next step')
    }
  }, [getCurrentTourDefinition, getCurrentStep, currentStep, stopTour])

  const prevStep = useCallback(async () => {
    try {
    const step = getCurrentStep()
      
      // Execute step's onPrev callback if it exists
    if (step?.onPrev) {
        await tourErrorUtils.safeExecute(
          () => step.onPrev!(),
          undefined,
          'Error executing step onPrev callback'
        )
    }

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
        tourLogger.debug('Returned to previous step:', currentStep - 1)
      }
    } catch (err) {
      tourLogger.error('Error returning to previous step:', err)
      setError('Failed to return to previous step')
    }
  }, [getCurrentStep, currentStep])

  const skipTour = useCallback(async () => {
    try {
      tourLogger.info('Skipping tour:', currentTour)
      
    const step = getCurrentStep()
      
      // Execute step's onSkip callback if it exists
    if (step?.onSkip) {
        await tourErrorUtils.safeExecute(
          () => step.onSkip!(),
          undefined,
          'Error executing step onSkip callback'
        )
      }

      await stopTour()
    } catch (err) {
      tourLogger.error('Error skipping tour:', err)
      // Force stop even if skip callback failed
      await stopTour()
  }
  }, [getCurrentStep, currentTour, stopTour])

  const goToStep = useCallback((stepIndex: number) => {
    try {
    const tour = getCurrentTourDefinition()
    if (tour && stepIndex >= 0 && stepIndex < tour.steps.length) {
      setCurrentStep(stepIndex)
        tourLogger.debug('Jumped to step:', stepIndex)
      } else {
        tourLogger.warn('Invalid step index:', stepIndex)
      }
    } catch (err) {
      tourLogger.error('Error jumping to step:', err)
      setError('Failed to navigate to step')
    }
  }, [getCurrentTourDefinition])

  const toggleTourAvailability = useCallback(() => {
    try {
    const newAvailability = !isTourAvailable
    setIsTourAvailable(newAvailability)
      tourStorage.setTourAvailability(newAvailability)
    
    if (!newAvailability && isActive) {
      stopTour()
    }
      
      tourLogger.info('Tour availability toggled:', newAvailability)
    } catch (err) {
      tourLogger.error('Error toggling tour availability:', err)
      setError('Failed to update tour preferences')
  }
  }, [isTourAvailable, isActive, stopTour])

  const resetTourState = useCallback(() => {
    try {
      tourLogger.info('Resetting all tour state')

    setIsActive(false)
    setCurrentTour(null)
    setCurrentStep(0)
      setError(null)
      
      // Clear all tour data
      tourStorage.clearAllTourData()
      setIsTourAvailable(true)
      
      tourLogger.info('Tour state reset complete')
    } catch (err) {
      tourLogger.error('Error resetting tour state:', err)
      // Force reset critical state even if storage cleanup failed
      setIsActive(false)
      setCurrentTour(null)
      setCurrentStep(0)
      setIsTourAvailable(true)
    }
  }, [])

  // Clear error after a delay
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 5000) // Clear error after 5 seconds

      return () => clearTimeout(timer)
      }
  }, [error])

  // Debug logging for state changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      tourLogger.debug('Tour state changed:', {
        isActive,
        currentTour,
        currentStep,
        isTourAvailable,
        availableToursCount: availableTours.length,
        userRole: user?.role
      })
    }
  }, [isActive, currentTour, currentStep, isTourAvailable, availableTours.length, user?.role])

  const contextValue = useMemo(() => ({
    isActive,
    currentTour,
    currentStep,
    availableTours,
    startTour,
    stopTour,
    nextStep,
    prevStep,
    skipTour,
    goToStep,
    toggleTourAvailability,
    isTourAvailable,
    getCurrentTourDefinition,
    getCurrentStep,
    resetTourState,
    isLoading,
    error
  }), [
        isActive,
        currentTour,
        currentStep,
        availableTours,
        startTour,
        stopTour,
        nextStep,
        prevStep,
        skipTour,
        goToStep,
        toggleTourAvailability,
        isTourAvailable,
        getCurrentTourDefinition,
        getCurrentStep,
        resetTourState,
    isLoading,
    error
  ])

  return (
    <TourContext.Provider value={contextValue}>
      {children}
    </TourContext.Provider>
  )
}

export const useTour = (): TourContextType => {
  const context = useContext(TourContext)
  if (!context) {
    throw new Error('useTour must be used within a TourProvider')
  }
  return context
} 