export const TOUR_CONSTANTS = {
  // Timing constants
  ELEMENT_SEARCH_DELAY: 30, // Further reduced for faster response
  ELEMENT_SEARCH_MAX_RETRIES: 30, // Increased for dashboard elements that may need more time
  POSITION_DEBOUNCE_DELAY: 80, // Reduced for snappier response
  TOUR_CLEANUP_DELAY: 300, // Reduced cleanup delay
  SMOOTH_SCROLL_DELAY: 400, // Increased for better dashboard scroll completion
  DASHBOARD_SCROLL_DELAY: 500, // Special delay for dashboard elements
  
  // Layout constants
  MAX_TOOLTIP_WIDTH: 400,
  MIN_TOOLTIP_WIDTH: 300,
  VIEWPORT_MARGIN: 20, // Reduced for better mobile experience
  TOOLTIP_MARGIN: 16,
  MOBILE_BREAKPOINT: 768,
  
  // Tooltip dimensions
  HEADER_HEIGHT: 120,
  BUTTON_HEIGHT: 80,
  CONTENT_BASE_HEIGHT: 120,
  MIN_TOOLTIP_HEIGHT: 280, // Reduced minimum height
  MAX_TOOLTIP_HEIGHT_RATIO: 0.8, // 80% of viewport height
  
  // Animation constants
  FADE_DURATION: 150, // Faster animations
  SLIDE_DURATION: 100, // Faster slide animations
  
  // Z-index constants
  OVERLAY_Z_INDEX: 9999,
  TOOLTIP_Z_INDEX: 10000,
  DROPDOWN_INTERACTION_Z_INDEX: 9990,
  
  // Storage keys
  TOUR_AVAILABILITY_KEY: 'hb-tour-available',
  TOUR_SESSION_PREFIX: 'hb-tour-shown-',
  TOUR_WELCOME_PREFIX: 'hb-welcome-',
  
  // Accessibility
  FOCUS_TRAP_SELECTOR: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  
  // Error handling
  MAX_POSITIONING_RETRIES: 3,
  ERROR_FALLBACK_PLACEMENT: 'center' as const,
} as const

export type TourPlacement = 'top' | 'bottom' | 'left' | 'right' | 'center'

export const TOUR_THEMES = {
  light: {
    overlayColor: 'rgba(0, 0, 0, 0.5)',
    dropdownOverlayColor: 'rgba(0, 0, 0, 0.2)',
  },
  dark: {
    overlayColor: 'rgba(0, 0, 0, 0.7)',
    dropdownOverlayColor: 'rgba(0, 0, 0, 0.3)',
  }
} as const 