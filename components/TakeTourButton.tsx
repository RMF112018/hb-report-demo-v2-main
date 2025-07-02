'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Compass, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTour } from '@/context/tour-context'
import { useAuth } from '@/context/auth-context'

import { tourLogger } from '@/lib/tour-utils'

interface TakeTourButtonProps {
  className?: string
}

/**
 * Enhanced floating "Explore This Page" button component
 * 
 * Features:
 * - Fixed positioning in top-right corner for better visibility
 * - Page-specific tour detection using usePathname
 * - Intelligent tour selection based on page and user role
 * - Engaging visual design with compass icon and pulsing animation
 * - WCAG compliant with proper aria labels and focus states
 * - High contrast colors for better visibility
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
  const [shouldPulse, setShouldPulse] = useState(false)

  // Handle component mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true)
    
    // Check if user is new to tours (for pulsing animation)
    const checkNewUser = () => {
      try {
        const hasSeenTours = localStorage.getItem('hb-tours-completed')
        const hasDisabledTours = localStorage.getItem('hb-tour-available') === 'false'
        
        // Pulse if user hasn't seen tours and tours aren't disabled
        if (!hasSeenTours && !hasDisabledTours && isTourAvailable) {
          setShouldPulse(true)
          
          // Stop pulsing after 10 seconds to avoid being annoying
          setTimeout(() => setShouldPulse(false), 10000)
        }
      } catch (error) {
        // Silently handle localStorage errors
        tourLogger.debug('Error checking tour completion status', error)
      }
    }
    
    checkNewUser()
  }, [isTourAvailable])

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
      '/dashboard/financial-hub': 'financial-hub-overview',
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
      // Handle both exact matches and nested paths (e.g., financial-hub within dashboard)
      const tourPageSegments = tour.page.split('-')
      const matchesPath = pathSegments.includes(tour.page) || 
                         pathname.includes(`/${tour.page}`) ||
                         tourPageSegments.every(segment => pathSegments.includes(segment))
      
      if (matchesPath) {
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
    if (isActive) return 'Exit Tour'
    
    const selectedTour = getPageSpecificTour()
    if (selectedTour) {
      // Customize button text based on tour type with engaging language
      if (selectedTour.id.includes('login')) return 'Explore Login Options'
      if (selectedTour.id.includes('dashboard')) return 'Explore Dashboard'
      if (selectedTour.id.includes('financial-hub')) return 'Explore Financial Hub'
      if (selectedTour.id.includes('staffing')) return 'Explore Staffing Tools'
    }
    
    return 'Explore This Page'
  }

  /**
   * Gets appropriate aria-label based on current state and available tour
   */
  const getAriaLabel = (): string => {
    if (isActive) return 'Exit the current page tour'
    
    const selectedTour = getPageSpecificTour()
    if (selectedTour) {
      return `Start interactive tour: ${selectedTour.name}`
    }
    
    return 'Start interactive tour of this page'
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
        fixed bottom-4 left-4 z-[10001] rounded-full px-4 py-2.5 shadow-xl
        bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600
        text-white font-semibold
        border-0 
        hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700
        focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900
        transition-all duration-300 ease-out
        transform hover:scale-105 active:scale-95 hover:shadow-2xl
        ${isActive ? 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' : ''}
        ${shouldPulse && !isActive ? 'animate-pulse' : ''}
        ${className}
      `}
      size="sm"
      type="button"
    >
      <div className="flex items-center gap-2.5">
        {isLoading ? (
          <Loader2 
            className="animate-spin h-4 w-4" 
            data-testid="loading-spinner"
            aria-hidden="true"
          />
        ) : isActive ? (
          <X 
            className="h-4 w-4"
            aria-hidden="true"
          />
        ) : (
          <Compass 
            className="h-4 w-4"
            aria-hidden="true"
          />
        )}
        <span className="text-sm font-semibold tracking-wide">{buttonText}</span>
        {shouldPulse && !isActive && (
          <div 
            className="absolute -inset-1 bg-blue-400 rounded-full opacity-75 animate-ping" 
            aria-hidden="true"
          />
        )}
      </div>
    </Button>
  )
} 