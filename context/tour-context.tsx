"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react"
import { useAuth } from "./auth-context"
// import { TourStep, TourDefinition, TOUR_DEFINITIONS } from '@/data/tours/tour-definitions'

// Temporary interface definitions to avoid webpack issues
interface TourStep {
  id: string
  title: string
  description: string
  screenshotUrl: string
  highlightRect?: { x: number; y: number; width: number; height: number }
  nextButton?: string
  prevButton?: string
  showSkip?: boolean
}

interface TourDefinition {
  id: string
  name: string
  description: string
  steps: TourStep[]
  userRoles?: string[]
  page?: string
}

// Temporary empty definitions to avoid webpack issues
const TOUR_DEFINITIONS: TourDefinition[] = []
import { tourLogger, tourStorage } from "@/lib/tour-utils"

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

  // Load tour availability preference
  useEffect(() => {
    try {
      const available = tourStorage.getTourAvailability()
      setIsTourAvailable(available)
      tourLogger.debug("Tour preferences loaded:", { available })
    } catch (err) {
      tourLogger.error("Failed to load tour preferences:", err)
      setIsTourAvailable(true)
    }
  }, [])

  // Get available tours based on user role
  const availableTours = TOUR_DEFINITIONS.filter((tour) => {
    if (tour.userRoles && user) {
      return tour.userRoles.includes(user.role)
    }
    return true
  })

  // Helper functions
  const getCurrentTourDefinition = useCallback((): TourDefinition | null => {
    if (!currentTour) return null
    return TOUR_DEFINITIONS.find((tour) => tour.id === currentTour) || null
  }, [currentTour])

  const getCurrentStep = useCallback((): TourStep | null => {
    const tour = getCurrentTourDefinition()
    if (!tour || currentStep >= tour.steps.length) return null
    return tour.steps[currentStep]
  }, [getCurrentTourDefinition, currentStep])

  // Start tour function
  const startTour = useCallback(async (tourId: string, isAutoStart: boolean = false) => {
    try {
      setIsLoading(true)
      setError(null)

      tourLogger.info("Starting tour:", { tourId, isAutoStart })

      // Check if tour was already shown in this session for auto-starts
      if (isAutoStart && tourStorage.hasTourBeenShownInSession(tourId)) {
        tourLogger.debug(`Tour ${tourId} already shown in session, skipping auto-start`)
        return
      }

      const tour = TOUR_DEFINITIONS.find((t) => t.id === tourId)
      if (!tour) {
        const errorMsg = `Tour "${tourId}" not found`
        setError(errorMsg)
        tourLogger.error(errorMsg)
        return
      }

      setCurrentTour(tourId)
      setCurrentStep(0)
      setIsActive(true)

      // Mark tour as shown in session
      tourStorage.markTourAsShown(tourId)

      tourLogger.info(`Tour "${tourId}" started successfully`)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error starting tour"
      setError(errorMsg)
      tourLogger.error("Error starting tour:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Stop tour function
  const stopTour = useCallback(() => {
    try {
      tourLogger.info("Stopping tour:", { currentTour })
      setIsActive(false)
      setCurrentTour(null)
      setCurrentStep(0)
      setError(null)
    } catch (err) {
      tourLogger.error("Error stopping tour:", err)
    }
  }, [currentTour])

  // Navigation functions
  const nextStep = useCallback(() => {
    const tour = getCurrentTourDefinition()
    if (!tour) return

    const nextStepIndex = currentStep + 1
    if (nextStepIndex >= tour.steps.length) {
      stopTour()
    } else {
      setCurrentStep(nextStepIndex)
      tourLogger.debug("Moved to next step:", { currentStep: nextStepIndex })
    }
  }, [currentStep, getCurrentTourDefinition, stopTour])

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1
      setCurrentStep(prevStepIndex)
      tourLogger.debug("Moved to previous step:", { currentStep: prevStepIndex })
    }
  }, [currentStep])

  const goToStep = useCallback(
    (stepIndex: number) => {
      const tour = getCurrentTourDefinition()
      if (!tour || stepIndex < 0 || stepIndex >= tour.steps.length) return

      setCurrentStep(stepIndex)
      tourLogger.debug("Jumped to step:", { stepIndex })
    },
    [getCurrentTourDefinition]
  )

  const skipTour = useCallback(() => {
    tourLogger.info("Tour skipped by user:", { currentTour })
    stopTour()
  }, [currentTour, stopTour])

  // Toggle tour availability
  const toggleTourAvailability = useCallback(() => {
    const newAvailability = !isTourAvailable
    setIsTourAvailable(newAvailability)
    tourStorage.setTourAvailability(newAvailability)
    tourLogger.info("Tour availability toggled:", { newAvailability })
  }, [isTourAvailable])

  // Reset tour state
  const resetTourState = useCallback(() => {
    setIsActive(false)
    setCurrentTour(null)
    setCurrentStep(0)
    setError(null)
    setIsLoading(false)
    tourLogger.info("Tour state reset")
  }, [])

  const contextValue: TourContextType = {
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
    error,
  }

  return <TourContext.Provider value={contextValue}>{children}</TourContext.Provider>
}

export const useTour = (): TourContextType => {
  const context = useContext(TourContext)
  if (context === undefined) {
    throw new Error("useTour must be used within a TourProvider")
  }
  return context
}
