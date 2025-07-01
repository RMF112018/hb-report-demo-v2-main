'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { useAuth } from './auth-context'
import { TourStep, TourDefinition } from '@/data/tours/tour-definitions'
import { tourLogger, tourStorage } from '@/lib/tour-utils'

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

// Simple tour definitions to avoid circular dependencies
const SIMPLE_TOUR_DEFINITIONS: TourDefinition[] = [
  {
    id: 'login-demo-accounts',
    name: 'Demo Account Login',
    description: 'Learn how to use the demo accounts to explore the application',
    page: 'login',
    steps: [
      {
        id: 'demo-accounts-intro',
        title: 'Welcome to HB-Report Demo',
        content: 'Welcome to the HB-Report demo platform! This interactive demonstration showcases our comprehensive construction project management solution. Let\'s explore the demo accounts available to you.',
        target: 'body',
        placement: 'center',
        nextButton: 'Start Tour'
      },
      {
        id: 'demo-accounts-toggle',
        title: 'Demo Accounts Access',
        content: 'Click the "Demo Accounts" button to see all available demo user accounts. Each account demonstrates different role permissions and dashboard views.',
        target: '[data-tour="demo-accounts-toggle"]',
        placement: 'bottom',
        nextButton: 'Continue'
      },
      {
        id: 'demo-accounts-list',
        title: 'Choose Your Role',
        content: 'Select from different user roles to experience the platform from various perspectives:<br/><br/>• <strong>Executive</strong> - High-level analytics and strategic overview<br/>• <strong>Project Manager</strong> - Detailed project control and management<br/>• <strong>Field Supervisor</strong> - Field operations and reporting<br/>• <strong>Estimator</strong> - Cost analysis and bidding tools',
        target: '[data-tour="demo-accounts-list"]',
        placement: 'left',
        nextButton: 'Next'
      },
      {
        id: 'role-based-experience',
        title: 'Role-Based Experience',
        content: 'Each demo account provides a customized experience with role-specific dashboards, tools, and permissions. This demonstrates how HB-Report adapts to different user needs and responsibilities.',
        target: '[data-tour="demo-accounts-list"]',
        placement: 'left',
        nextButton: 'Continue'
      },
      {
        id: 'login-process',
        title: 'Getting Started',
        content: 'Simply click on any demo account to automatically log in and begin exploring. No passwords required for the demo! Each account contains realistic project data to showcase the platform\'s capabilities.',
        target: '[data-tour="demo-accounts-list"]',
        placement: 'left',
        nextButton: 'Finish Tour'
      }
    ]
  },
  {
    id: 'dashboard-overview',
    name: 'Complete Dashboard Tour',
    description: 'Comprehensive guide to all dashboard features and navigation elements',
    page: 'dashboard',
    steps: [
      {
        id: 'dashboard-welcome',
        title: 'Welcome to Your Dashboard!',
        content: 'This dashboard is customized for your role and provides the most relevant information and tools for your daily work. Let\'s explore all the features available to you.',
        target: '[data-tour="dashboard-content"]',
        placement: 'center',
        nextButton: 'Start Tour'
      },
      {
        id: 'environment-menu',
        title: 'Environment Navigation',
        content: 'Switch between different work environments:<br/><br/><strong>📊 Operations</strong> - Active project management<br/><strong>🏗️ Pre-Construction</strong> - Planning and estimation<br/><strong>📁 Archive</strong> - Completed projects<br/><br/>Each environment provides specialized tools and views for different phases of work.',
        target: '[data-tour="environment-menu"]',
        placement: 'bottom',
        nextButton: 'Continue'
      },
      {
        id: 'projects-menu',
        title: 'Project Selection',
        content: 'Access and switch between your active projects. This dropdown shows all projects you have permissions to view and manage. Click to change your current project context.',
        target: '[data-tour="projects-menu"]',
        placement: 'bottom',
        nextButton: 'Next'
      },
      {
        id: 'tools-menu',
        title: 'Tools & Utilities',
        content: 'Access powerful tools and utilities for project management:<br/><br/>• Document management<br/>• Reporting tools<br/>• Import/export functions<br/>• Integration settings<br/>• Custom workflows',
        target: '[data-tour="tools-menu"]',
        placement: 'bottom',
        nextButton: 'Continue'
      },
      {
        id: 'search-bar',
        title: 'Global Search',
        content: 'Quickly find projects, documents, contacts, or any information across the platform. Use keywords, project names, or specific data to locate what you need instantly.',
        target: '[data-tour="search-bar"]',
        placement: 'bottom',
        nextButton: 'Next'
      },
      {
        id: 'tours-menu',
        title: 'Guided Tours',
        content: 'Access interactive tours and help resources. Tours are contextual - different tours are available based on your current page and role permissions.',
        target: '[data-tour="tour-controls"]',
        placement: 'bottom',
        nextButton: 'Continue'
      },
      {
        id: 'dashboard-selector',
        title: 'Dashboard Views',
        content: 'Switch between different dashboard layouts optimized for your role:<br/><br/>• Executive summary view<br/>• Detailed project controls<br/>• Financial overview<br/>• Custom layouts<br/><br/>Each view presents the most relevant information for your workflow.',
        target: '[data-tour="dashboard-selector"]',
        placement: 'left',
        nextButton: 'Next'
      },
      {
        id: 'dashboard-controls',
        title: 'Dashboard Controls',
        content: 'Customize your dashboard experience:<br/><br/><strong>✏️ Edit</strong> - Modify card layouts and content<br/><strong>📐 Layout</strong> - Adjust spacing and arrangement<br/><strong>⛶ Fullscreen</strong> - Maximize dashboard view<br/><br/>Make your dashboard work exactly how you need it.',
        target: '[data-tour="dashboard-controls"]',
        placement: 'right',
        nextButton: 'Continue'
      },
      {
        id: 'kpi-widgets',
        title: 'Key Performance Indicators',
        content: 'Monitor critical project metrics at a glance. These KPI widgets show real-time data for budget health, schedule performance, safety metrics, and other key indicators relevant to your role.',
        target: '[data-tour="kpi-widgets"]',
        placement: 'bottom',
        nextButton: 'Next'
      },
      {
        id: 'hbi-insights',
        title: 'HB Intelligence Insights',
        content: 'AI-powered insights and recommendations based on your project data. Get predictive analytics, risk assessments, and actionable recommendations to improve project outcomes.',
        target: '[data-tour="hbi-insights"]',
        placement: 'left',
        nextButton: 'Finish Tour'
      }
    ]
  }
]

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
      tourLogger.debug('Tour preferences loaded:', { available })
    } catch (err) {
      tourLogger.error('Failed to load tour preferences:', err)
      setIsTourAvailable(true)
    }
  }, [])

  // Get available tours based on user role
  const availableTours = SIMPLE_TOUR_DEFINITIONS.filter(tour => {
    if (tour.userRoles && user) {
      return tour.userRoles.includes(user.role)
    }
    return true
  })

  // Helper functions
  const getCurrentTourDefinition = useCallback((): TourDefinition | null => {
    if (!currentTour) return null
    return SIMPLE_TOUR_DEFINITIONS.find(tour => tour.id === currentTour) || null
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
      
      tourLogger.info('Starting tour:', { tourId, isAutoStart })
    
      // Check if tour was already shown in this session for auto-starts
      if (isAutoStart && tourStorage.hasTourBeenShownInSession(tourId)) {
        tourLogger.debug(`Tour ${tourId} already shown in session, skipping auto-start`)
        return
      }

      const tour = SIMPLE_TOUR_DEFINITIONS.find(t => t.id === tourId)
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
      const errorMsg = err instanceof Error ? err.message : 'Unknown error starting tour'
      setError(errorMsg)
      tourLogger.error('Error starting tour:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Stop tour function
  const stopTour = useCallback(() => {
    try {
      tourLogger.info('Stopping tour:', { currentTour })
      setIsActive(false)
      setCurrentTour(null)
      setCurrentStep(0)
      setError(null)
    } catch (err) {
      tourLogger.error('Error stopping tour:', err)
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
      tourLogger.debug('Moved to next step:', { currentStep: nextStepIndex })
    }
  }, [currentStep, getCurrentTourDefinition, stopTour])

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1
      setCurrentStep(prevStepIndex)
      tourLogger.debug('Moved to previous step:', { currentStep: prevStepIndex })
    }
  }, [currentStep])

  const goToStep = useCallback((stepIndex: number) => {
    const tour = getCurrentTourDefinition()
    if (!tour || stepIndex < 0 || stepIndex >= tour.steps.length) return

    setCurrentStep(stepIndex)
    tourLogger.debug('Jumped to step:', { stepIndex })
  }, [getCurrentTourDefinition])

  const skipTour = useCallback(() => {
    tourLogger.info('Tour skipped by user:', { currentTour })
    stopTour()
  }, [currentTour, stopTour])

  // Toggle tour availability
  const toggleTourAvailability = useCallback(() => {
    const newAvailability = !isTourAvailable
    setIsTourAvailable(newAvailability)
    tourStorage.setTourAvailability(newAvailability)
    tourLogger.info('Tour availability toggled:', { newAvailability })
  }, [isTourAvailable])

  // Reset tour state
  const resetTourState = useCallback(() => {
    setIsActive(false)
    setCurrentTour(null)
    setCurrentStep(0)
    setError(null)
    setIsLoading(false)
    tourLogger.info('Tour state reset')
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
    error
  }

  return (
    <TourContext.Provider value={contextValue}>
      {children}
    </TourContext.Provider>
  )
}

export const useTour = (): TourContextType => {
  const context = useContext(TourContext)
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider')
  }
  return context
} 