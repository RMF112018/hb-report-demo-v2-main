'use client'

import React from 'react'
import { useTour } from '@/context/tour-context'
import { tourLogger } from '@/lib/tour-utils'

interface TourControlsProps {
  className?: string
}

/**
 * Tour controls component - provides core tour management functions
 * 
 * This component now serves as a utility component for programmatic tour control
 * rather than providing UI. The UI has been moved to TakeTourButton.
 * 
 * @param className Optional CSS classes (preserved for backward compatibility)
 * @returns null (no UI rendered)
 */
export const TourControls: React.FC<TourControlsProps> = ({ className = '' }) => {
  const {
    isActive,
    isTourAvailable,
    stopTour,
    currentTour,
    isLoading
  } = useTour()

  /**
   * Programmatically stops the current tour
   * This function can be called from other components
   */
  const handleStopTour = React.useCallback(() => {
    try {
      if (isActive && currentTour) {
        tourLogger.info('Stopping tour programmatically from TourControls')
        stopTour()
      }
    } catch (err) {
      tourLogger.error('Error stopping tour from TourControls:', err)
    }
  }, [isActive, currentTour, stopTour])

  // Expose the stop function via useImperativeHandle if needed
  React.useEffect(() => {
    // This allows other components to access the stop function
    // by importing TourControls and calling the exposed method
    if (typeof window !== 'undefined') {
      (window as any).__tourControls = {
        stopTour: handleStopTour,
        isActive,
        currentTour,
        isLoading,
        isTourAvailable
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__tourControls
      }
    }
  }, [handleStopTour, isActive, currentTour, isLoading, isTourAvailable])

  // No UI is rendered - functionality is provided programmatically
  return null
}

/**
 * Hook to access tour control functions programmatically
 * 
 * @returns Object containing tour control functions
 */
export const useTourControls = () => {
  const {
    isActive,
    isTourAvailable,
    stopTour,
    currentTour,
    isLoading,
    availableTours,
    startTour
  } = useTour()

  const stopCurrentTour = React.useCallback(() => {
    try {
      if (isActive && currentTour) {
        tourLogger.info('Stopping tour via useTourControls hook')
        stopTour()
      }
    } catch (err) {
      tourLogger.error('Error stopping tour via hook:', err)
    }
  }, [isActive, currentTour, stopTour])

  return {
    stopTour: stopCurrentTour,
    startTour,
    isActive,
    currentTour,
    isLoading,
    isTourAvailable,
    availableTours
  }
} 