/**
 * @fileoverview HBI Intel Tour Carousel Component
 * @module HbiIntelTourCarousel
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Full-screen Intel tour carousel with sophisticated animations:
 * - 10s delayed entrance with fade-in + slide-up animations
 * - Framer Motion transitions with spring-based easing
 * - Keyboard navigation and progress indicators
 * - Professional v3.0 styling with HB branding
 * - Session-based localStorage management
 * - Only appears for Presentation users once per session
 */

"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, ArrowRight, Building2, Brain } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { HBI_INTEL_TOUR_SLIDES, type IntelTourSlide } from "./hbiIntelTourSlides"

export interface HbiIntelTourCarouselProps {
  onComplete?: () => void
  className?: string
  forceShow?: boolean // Allow parent to force show carousel
}

export const HbiIntelTourCarousel: React.FC<HbiIntelTourCarouselProps> = ({
  onComplete,
  className = "",
  forceShow = false,
}) => {
  const router = useRouter()
  const { user, isPresentationMode } = useAuth()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [direction, setDirection] = useState(0) // 1 for next, -1 for previous
  const [showCarousel, setShowCarousel] = useState(false)
  const controls = useAnimation()

  // Check if should show carousel (Presentation mode + not completed OR forced by parent)
  useEffect(() => {
    if (forceShow) {
      // Parent is forcing show (manual trigger)
      setShowCarousel(true)
    } else if (isPresentationMode) {
      // Automatic show for presentation users if not completed
      const intelTourCompleted = localStorage.getItem("intelTourCompleted")
      if (!intelTourCompleted) {
        setShowCarousel(true)
      }
    }
  }, [isPresentationMode, forceShow])

  // Initialize component with entrance animation (no delay - main app handles timing)
  useEffect(() => {
    if (!showCarousel) return

    // Show immediately with smooth entrance animation since main app already handled the delay
    // Animation is now controlled by the animate prop using isVisible state
    setIsVisible(true)
  }, [showCarousel])

  // Keyboard navigation
  useEffect(() => {
    if (!showCarousel) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        handlePrevious()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        handleNext()
      } else if (event.key === "Escape") {
        event.preventDefault()
        handleExit()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showCarousel, currentSlide])

  const handleNext = useCallback(() => {
    if (currentSlide < HBI_INTEL_TOUR_SLIDES.length - 1) {
      setDirection(1)
      setCurrentSlide((prev) => prev + 1)
    }
  }, [currentSlide])

  const handlePrevious = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1)
      setCurrentSlide((prev) => prev - 1)
    }
  }, [currentSlide])

  const handleSlideSelect = useCallback(
    (index: number) => {
      if (index !== currentSlide) {
        setDirection(index > currentSlide ? 1 : -1)
        setCurrentSlide(index)
      }
    },
    [currentSlide]
  )

  const handleExplorePlatform = useCallback(async () => {
    setIsExiting(true)

    // Mark tour as completed
    localStorage.setItem("intelTourCompleted", "true")

    // Start exit animation - component cleanup will be handled by onAnimationComplete
    setIsVisible(false)
    await controls.start("exit")

    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" })

    // Optional: Highlight suggested feature (Executive Dashboard)
    setTimeout(() => {
      const executiveDashboardElement = document.querySelector('[data-tour-highlight="executive-dashboard"]')
      if (executiveDashboardElement) {
        executiveDashboardElement.classList.add(
          "ring-4",
          "ring-blue-500",
          "ring-opacity-50",
          "rounded-lg",
          "transition-all",
          "duration-300"
        )
        setTimeout(() => {
          executiveDashboardElement.classList.remove(
            "ring-4",
            "ring-blue-500",
            "ring-opacity-50",
            "rounded-lg",
            "transition-all",
            "duration-300"
          )
        }, 3000)
      }
    }, 500)

    if (onComplete) {
      onComplete()
    }
  }, [controls, onComplete])

  const handleExit = useCallback(async () => {
    setIsExiting(true)

    // Mark tour as completed even if exited early
    localStorage.setItem("intelTourCompleted", "true")

    // Start exit animation - component cleanup will be handled by onAnimationComplete
    setIsVisible(false)
    await controls.start("exit")

    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [controls])

  // Don't render if not showing carousel
  if (!showCarousel) {
    return null
  }

  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.96,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 20,
        duration: 0.8,
        staggerChildren: 0.15,
      },
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 1.02,
      transition: {
        duration: 0.6,
      },
    },
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.5,
      },
    }),
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  const current = HBI_INTEL_TOUR_SLIDES[currentSlide]
  const isLastSlide = currentSlide === HBI_INTEL_TOUR_SLIDES.length - 1

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="intel-tour-carousel"
        className={`h-screen w-screen fixed top-0 left-0 z-[150] bg-gradient-to-tr from-slate-50 to-blue-100 overflow-hidden ${className}`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 150,
        }}
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        exit="exit"
        onAnimationComplete={() => {
          if (isExiting) {
            setShowCarousel(false)
            setIsVisible(false)
          }
        }}
      >
        {/* Header with Logo, Progress, and Exit */}
        <header className="absolute top-0 left-0 right-0 z-20 p-6 lg:p-8">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-xl shadow-lg">
                <Building2 className="h-8 w-8 text-[#003087]" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-slate-800">HBI Intel Tour</h1>
                <p className="text-muted-foreground text-sm lg:text-base">
                  Discover AI-Powered Construction Intelligence
                </p>
              </div>
            </div>

            {/* Progress Indicator and Exit Button */}
            <div className="flex items-center space-x-4">
              <Badge
                variant="secondary"
                className="bg-slate-100 text-slate-800 border-slate-200 px-4 py-2 text-sm font-medium"
              >
                {currentSlide + 1} of {HBI_INTEL_TOUR_SLIDES.length}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExit}
                disabled={isExiting}
                className="text-slate-700 hover:bg-slate-100 text-sm font-medium px-4 py-2 border border-slate-200 hover:border-slate-300 transition-all duration-200"
                aria-label="Exit Intel tour"
              >
                Skip Tour
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="relative h-full flex items-center justify-center">
          <div className="w-full max-w-4xl mx-auto px-6 py-12">
            {/* Slide Container */}
            <div className="relative h-[70vh] flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full text-center">
                  {/* Slide Icon */}
                  <div className="mb-8 lg:mb-12 flex justify-center">
                    <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">{current?.icon}</div>
                  </div>

                  {/* Slide Title */}
                  <h2 className="text-3xl md:text-5xl font-semibold text-slate-800 mb-6 lg:mb-8 leading-tight">
                    {current?.title}
                  </h2>

                  {/* Slide Content */}
                  <div className="text-muted-foreground leading-relaxed">{current?.content}</div>

                  {/* CTA Button for Final Slide */}
                  {current?.isFinalSlide && (
                    <div className="mt-12">
                      <Button
                        onClick={handleExplorePlatform}
                        size="lg"
                        className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] hover:from-[#E55A2B] hover:to-[#D14D20] text-white font-semibold px-8 lg:px-12 py-4 lg:py-6 text-lg lg:text-xl shadow-lg transform transition-all duration-300 hover:scale-105 group"
                        disabled={isExiting}
                      >
                        <Brain className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                        Explore the Platform
                        <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-8 inset-x-0 z-20 flex justify-center">
          <div className="flex items-center justify-center space-x-6">
            {/* Previous Button */}
            <Button
              variant="ghost"
              size="lg"
              onClick={handlePrevious}
              disabled={currentSlide === 0 || isExiting}
              className="text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* Slide Dots */}
            <div className="flex items-center justify-center space-x-3">
              {HBI_INTEL_TOUR_SLIDES.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => handleSlideSelect(index)}
                  disabled={isExiting}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "bg-slate-600 shadow-lg scale-125" : "bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <Button
              variant="ghost"
              size="lg"
              onClick={handleNext}
              disabled={isLastSlide || isExiting}
              className="text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Loading overlay during exit */}
        {isExiting && (
          <div className="absolute inset-0 bg-slate-100/80 backdrop-blur-sm z-30 flex items-center justify-center">
            <div className="text-center text-slate-800">
              <div className="w-8 h-8 border-2 border-slate-600 border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
              <p className="text-lg font-medium">Loading HBI Intel...</p>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
