'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTour } from '@/context/tour-context'
import { useAuth } from '@/context/auth-context'

import { tourLogger } from '@/lib/tour-utils'

interface TakeTourButtonProps {
  className?: string
}

/**
 * Floating "Take the Tour" button component
 * 
 * Features:
 * - Fixed positioning in bottom-left corner
 * - Page-specific tour detection using usePathname
 * - Intelligent tour selection based on page and user role
 * - WCAG compliant with proper aria labels and focus states
 * - Theme-aware styling for light/dark modes
 * - Minimal CLS with optimized rendering
 * 
 * @param className Optional additional CSS classes
 * @returns JSX.Element The floating tour button
 */
export const TakeTourButton: React.FC<TakeTourButtonProps> = ({ className = '' }) => {
  const {
    startTour,
    isActive,
    isTourAvailable,
    availableTours,
    isLoading,
    stopTour,
    currentTour
  } = useTour()

  const { user } = useAuth()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Handle component mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render if tours are not available or not mounted
  if (!mounted || !isTourAvailable || availableTours.length === 0) {
    return null
  }

  /**
   * Determines the most relevant tour for the current page
   * Uses pathname-based detection with fallback to role-based selection
   */
  const getPageSpecificTour = () => {
    tourLogger.debug('Determining page-specific tour', { pathname, userRole: user?.role })

    // Priority 1: Direct page-specific mapping
    const pageToTourMap: Record<string, string> = {
      '/login': 'login-demo-accounts',
      '/dashboard': 'dashboard-overview',
      '/dashboard/staff-planning': 'executive-staffing-overview',
      '/dashboard/staff-planning/executive': 'executive-staffing-overview',
      '/dashboard/staff-planning/project-executive': 'project-executive-staffing-overview',
      '/dashboard/staff-planning/project-manager': 'project-manager-staffing-overview',
    }

    // Check for exact path match
    const exactTourId = pageToTourMap[pathname]
    if (exactTourId) {
      const exactTour = availableTours.find(tour => tour.id === exactTourId)
      if (exactTour && (!exactTour.userRoles || (user?.role && exactTour.userRoles.includes(user.role)))) {
        tourLogger.debug('Found exact page-specific tour', { tourId: exactTourId, pathname })
        return exactTour
      }
    }

    // Priority 2: Partial path matching for nested routes
    const pathSegments = pathname.split('/').filter(Boolean)
    
    for (const tour of availableTours) {
      if (!tour.page) continue
      
      // Check if current path contains the tour's page
      if (pathSegments.includes(tour.page) || pathname.includes(`/${tour.page}`)) {
        // Verify role permissions if specified
        if (!tour.userRoles || (user?.role && tour.userRoles.includes(user.role))) {
          tourLogger.debug('Found path-segment tour', { tourId: tour.id, tourPage: tour.page, pathname })
          return tour
        }
      }
    }

    // Priority 3: Role-specific tours for staff-planning pages
    if (pathname.includes('/staff-planning') && user?.role) {
      const roleToTourMap: Record<string, string> = {
        'executive': 'executive-staffing-overview',
        'project-executive': 'project-executive-staffing-overview',
        'project-manager': 'project-manager-staffing-overview',
      }
      
      const roleTourId = roleToTourMap[user.role]
      if (roleTourId) {
        const roleTour = availableTours.find(tour => tour.id === roleTourId)
        if (roleTour) {
          tourLogger.debug('Found role-specific staffing tour', { tourId: roleTourId, userRole: user.role })
          return roleTour
        }
      }
    }

    // Priority 4: General role-based fallback
    if (user?.role) {
      const roleTour = availableTours.find(tour => 
        tour.userRoles?.includes(user.role)
      )
      if (roleTour) {
        tourLogger.debug('Found general role-based tour', { tourId: roleTour.id, userRole: user.role })
        return roleTour
      }
    }

    // Priority 5: First available tour
    const fallbackTour = availableTours[0]
    if (fallbackTour) {
      tourLogger.debug('Using fallback tour', { tourId: fallbackTour.id })
      return fallbackTour
    }

    tourLogger.warn('No suitable tour found', { pathname, userRole: user?.role, availableToursCount: availableTours.length })
    return null
  }

  /**
   * Handles tour button click
   * Starts the most relevant tour based on current page and user role
   */
  const handleTakeTour = () => {
    try {
      tourLogger.info('TakeTourButton clicked', { 
        isActive, 
        currentTour, 
        pathname,
        availableToursCount: availableTours.length,
        userRole: user?.role 
      })

      // If tour is already active, stop it first
      if (isActive) {
        tourLogger.debug('Stopping current tour before starting new one')
        stopTour()
        return
      }

      // Find the most relevant tour for current page and user role
      const selectedTour = getPageSpecificTour()

      if (selectedTour) {
        tourLogger.info('Starting page-specific tour', { 
          tourId: selectedTour.id, 
          tourName: selectedTour.name,
          pathname,
          userRole: user?.role
        })
        startTour(selectedTour.id)
      } else {
        tourLogger.warn('No suitable tour found for current context', { 
          pathname, 
          userRole: user?.role, 
          availableToursCount: availableTours.length 
        })
      }
    } catch (error) {
      tourLogger.error('Error starting tour from TakeTourButton', error)
    }
  }

  /**
   * Handles keyboard navigation
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleTakeTour()
    }
  }

  /**
   * Gets appropriate button text based on tour availability and page
   */
  const getButtonText = (): string => {
    if (isActive) return 'Stop Tour'
    
    const selectedTour = getPageSpecificTour()
    if (selectedTour) {
      // Customize button text based on tour type
      if (selectedTour.id.includes('login')) return 'Take Login Tour'
      if (selectedTour.id.includes('dashboard')) return 'Take Dashboard Tour'
      if (selectedTour.id.includes('staffing')) return 'Take Staffing Tour'
    }
    
    return 'Take the Tour'
  }

  /**
   * Gets appropriate aria-label based on current state and available tour
   */
  const getAriaLabel = (): string => {
    if (isActive) return 'Stop the current tour'
    
    const selectedTour = getPageSpecificTour()
    if (selectedTour) {
      return `Take the ${selectedTour.name} tour`
    }
    
    return 'Take the tour'
  }

  const buttonText = getButtonText()
  const ariaLabel = getAriaLabel()

  return (
    <Button
      onClick={handleTakeTour}
      onKeyDown={handleKeyDown}
      disabled={isLoading}
      aria-label={ariaLabel}
      className={`
        fixed bottom-4 left-4 z-[10001] rounded-full px-6 py-3 shadow-lg
        bg-white dark:bg-gray-800 
        text-gray-900 dark:text-white
        border border-gray-200 dark:border-gray-700
        hover:bg-gray-50 dark:hover:bg-gray-700
        focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
        transition-all duration-200 ease-in-out
        transform hover:scale-105 active:scale-95
        ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : ''}
        ${className}
      `}
      size="sm"
      type="button"
    >
      <div className="flex items-center gap-2">
        {isLoading ? (
          <div 
            className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"
            data-testid="loading-spinner"
            aria-hidden="true"
          />
        ) : (
          <Play 
            className={`h-4 w-4 ${isActive ? 'hidden' : ''}`}
            aria-hidden="true"
          />
        )}
        <span className="text-sm font-medium">{buttonText}</span>
      </div>
    </Button>
  )
} 