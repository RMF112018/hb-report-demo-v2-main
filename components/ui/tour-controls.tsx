'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Play, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTour } from '@/context/tour-context'
import { tourLogger } from '@/lib/tour-utils'

interface TourControlsProps {
  className?: string
}

export const TourControls: React.FC<TourControlsProps> = ({ className = '' }) => {
  const {
    isActive,
    isTourAvailable,
    availableTours,
    startTour,
    stopTour,
    toggleTourAvailability,
    currentTour,
    isLoading
  } = useTour()

  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showMenu) {
        setShowMenu(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [showMenu])

  const handleStartTour = (tourId: string) => {
    try {
      tourLogger.info('Starting tour from controls:', tourId)
      startTour(tourId)
      setShowMenu(false)
    } catch (err) {
      tourLogger.error('Error starting tour from controls:', err)
    }
  }

  const handleStopTour = () => {
    try {
      tourLogger.info('Stopping tour from controls')
      stopTour()
      setShowMenu(false)
    } catch (err) {
      tourLogger.error('Error stopping tour from controls:', err)
    }
  }

  const handleToggleAvailability = () => {
    try {
      tourLogger.info('Toggling tour availability from controls')
      toggleTourAvailability()
      setShowMenu(false)
    } catch (err) {
      tourLogger.error('Error toggling tour availability:', err)
    }
  }

  // Don't render if tours are disabled
  if (!isTourAvailable) return null

  return (
    <div 
      className={`relative ${className}`} 
      data-tour="tour-controls" 
      ref={menuRef}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowMenu(!showMenu)}
        disabled={isLoading}
        className="flex items-center gap-2 hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
        aria-label="Open tours menu"
        aria-expanded={showMenu}
        aria-haspopup="true"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        Tours
      </Button>

      {showMenu && (
        <Card className="absolute right-0 top-full mt-2 w-80 shadow-lg z-50 bg-background text-foreground border border-border dark:shadow-black/50 dark:border-border">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm text-foreground">Guided Tours</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Interactive guides to help you explore the application
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(false)}
                className="h-8 w-8 p-0"
                aria-label="Close tours menu"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-3">
            {availableTours.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No tours available for your current page
              </div>
            ) : (
              <div className="space-y-2">
                {availableTours.map((tour) => (
                  <Button
                    key={tour.id}
                    variant={currentTour === tour.id ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => handleStartTour(tour.id)}
                    className="w-full justify-start text-left h-auto p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                    disabled={(isActive && currentTour === tour.id) || isLoading}
                  >
                    <div className="text-left w-full">
                      <div className="font-medium text-sm text-foreground">{tour.name}</div>
                      <div className="text-xs text-muted-foreground mt-1 whitespace-normal">
                        {tour.description}
                      </div>
                      {currentTour === tour.id && isActive && (
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          Currently active
                        </div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            )}

            {/* Active tour controls */}
            {isActive && (
              <div className="pt-3 mt-3 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStopTour}
                  disabled={isLoading}
                  className="w-full border-border hover:bg-accent hover:text-accent-foreground"
                >
                  Stop Current Tour
                </Button>
              </div>
            )}

            {/* Tour settings */}
            <div className="pt-3 mt-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleAvailability}
                disabled={isLoading}
                className="w-full text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Disable All Tours
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 