/**
 * @fileoverview Presentation Carousel Component
 * @module PresentationCarousel
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Full-screen presentation carousel with sophisticated animations:
 * - Framer Motion entrance and slide transitions
 * - Spring-based easing and direction-aware animations
 * - Keyboard navigation and progress indicators
 * - Professional v3.0 styling with HB branding
 * - Responsive design and accessibility compliance
 */

"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Play, ArrowRight, Building2, Sparkles, Target, TrendingUp } from "lucide-react"
import Image from "next/image"

export interface PresentationSlide {
  id: string
  title: string
  content: React.ReactNode
  image?: string
  background?: string
  backgroundGradient?: string
  isFinalSlide?: boolean
}

export interface PresentationCarouselProps {
  slides: PresentationSlide[]
  onComplete?: () => void
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
  ctaText?: string
  ctaIcon?: React.ComponentType<any>
}

export const PresentationCarousel: React.FC<PresentationCarouselProps> = ({
  slides,
  onComplete,
  autoPlay = false,
  autoPlayInterval = 5000,
  className = "",
  ctaText = "Explore what continuity looks like",
  ctaIcon: CTAIcon = Sparkles,
}) => {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [direction, setDirection] = useState(0) // 1 for next, -1 for previous
  const controls = useAnimation()

  // Initialize component with entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
      controls.start("visible")
    }, 100)

    return () => clearTimeout(timer)
  }, [controls])

  // Keyboard navigation
  useEffect(() => {
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
  }, [currentSlide])

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      if (currentSlide < slides.length - 1) {
        handleNext()
      }
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, currentSlide, slides.length])

  const handleNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setDirection(1)
      setCurrentSlide((prev) => prev + 1)
    }
  }, [currentSlide, slides.length])

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

  const handleCTAClick = useCallback(async () => {
    setIsExiting(true)
    await controls.start("exit")

    // Let parent component handle navigation via onComplete callback
    if (onComplete) {
      onComplete()
    }
  }, [controls, onComplete])

  const handleExit = useCallback(async () => {
    setIsExiting(true)
    await controls.start("exit")

    // Call onComplete if provided, otherwise fallback to login redirect
    if (onComplete) {
      onComplete()
    } else {
      router.push("/login")
    }
  }, [controls, router, onComplete])

  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 1.05,
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

  const current = slides[currentSlide]
  const isLastSlide = currentSlide === slides.length - 1

  return (
    <motion.div
      className={`fixed z-[9999] overflow-hidden ${className}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        zIndex: 9999,
        background:
          current?.backgroundGradient ||
          current?.background ||
          "linear-gradient(135deg, #003087 0%, #1e3a8a 50%, #1e40af 100%)",
      }}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.1))]"
        aria-hidden="true"
      />

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          className="absolute bg-white/10 rounded-full"
          style={{
            top: "15%",
            left: "5%",
            width: "120px",
            height: "120px",
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bg-white/5 rounded-full"
          style={{
            top: "25%",
            right: "10%",
            width: "200px",
            height: "200px",
          }}
          animate={{
            y: [0, 30, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bg-orange-400/20 rounded-full"
          style={{
            bottom: "15%",
            left: "8%",
            width: "100px",
            height: "100px",
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Header with Logo, Progress, and Exit */}
      <motion.header className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-6 lg:p-8" variants={contentVariants}>
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="bg-white p-2 sm:p-3 rounded-xl shadow-2xl">
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-[#003087]" />
            </div>
            <div>
              <h1 className="text-sm sm:text-xl lg:text-2xl font-bold text-white">Hedrick Brothers Construction</h1>
            </div>
          </div>

          {/* Progress Indicator and Exit Button */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium"
            >
              {currentSlide + 1} of {slides.length}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExit}
              disabled={isExiting}
              className="text-white hover:bg-white/20 text-xs sm:text-sm font-medium px-2 sm:px-4 py-1 sm:py-2 border border-white/30 hover:border-white/50 transition-all duration-200"
              aria-label="Exit presentation"
            >
              Exit
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-12 pt-16 sm:pt-20 lg:pt-24 pb-20 sm:pb-24 lg:pb-32">
        <div className="w-full max-w-7xl mx-auto">
          {/* Slide Container */}
          <div className="relative min-h-[50vh] sm:min-h-[55vh] lg:min-h-[60vh] flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-full max-w-5xl mx-auto text-center px-4 sm:px-6 pb-4 sm:pb-6">
                  {/* Slide Image */}
                  {current?.image && (
                    <motion.div
                      className="mb-4 sm:mb-6 lg:mb-8"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                    >
                      <div className="relative w-full h-48 sm:h-64 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                        <Image src={current.image} alt="" fill className="object-cover" priority />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    </motion.div>
                  )}

                  {/* Slide Title */}
                  <motion.h2
                    className="text-xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    {current?.title}
                  </motion.h2>

                  {/* Slide Content */}
                  <motion.div
                    className="text-sm sm:text-base lg:text-lg xl:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    {current?.content}
                  </motion.div>

                  {/* CTA Button for Final Slide */}
                  {current?.isFinalSlide && (
                    <motion.div
                      className="mt-3 sm:mt-4 lg:mt-6"
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.6, duration: 0.7, type: "spring" }}
                    >
                      <Button
                        onClick={handleCTAClick}
                        size="lg"
                        className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] hover:from-[#E55A2B] hover:to-[#D14D20] text-white font-semibold px-3 sm:px-6 lg:px-10 py-2 sm:py-3 lg:py-5 text-sm sm:text-base lg:text-lg shadow-2xl transform transition-all duration-300 hover:scale-105 group"
                        disabled={isExiting}
                      >
                        <CTAIcon className="h-3 w-3 sm:h-5 sm:w-5 mr-2 sm:mr-3 group-hover:rotate-12 transition-transform" />
                        {ctaText}
                        <ArrowRight className="h-3 w-3 sm:h-5 sm:w-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <motion.div
        className="absolute bottom-6 sm:bottom-8 lg:bottom-12 inset-x-0 z-20 flex justify-center"
        variants={contentVariants}
      >
        <div className="flex items-center justify-center space-x-4 sm:space-x-6">
          {/* Previous Button */}
          <Button
            variant="ghost"
            size="lg"
            onClick={handlePrevious}
            disabled={currentSlide === 0 || isExiting}
            className="text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
          </Button>

          {/* Slide Dots */}
          <div className="flex items-center justify-center space-x-2 sm:space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideSelect(index)}
                disabled={isExiting}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white shadow-lg scale-125" : "bg-white/40 hover:bg-white/60"
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
            className="text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
          </Button>
        </div>
      </motion.div>

      {/* Auto-play indicator */}
      {autoPlay && !isLastSlide && (
        <motion.div
          className="absolute bottom-24 sm:bottom-28 left-1/2 transform -translate-x-1/2 z-10"
          variants={contentVariants}
        >
          <div className="flex items-center space-x-2 text-white/70 text-sm">
            <Play className="h-4 w-4" />
            <span>Auto-advancing...</span>
          </div>
        </motion.div>
      )}

      {/* Loading overlay during exit */}
      {isExiting && (
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center text-white">
            <motion.div
              className="w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-lg font-medium">Launching HB Intel...</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
