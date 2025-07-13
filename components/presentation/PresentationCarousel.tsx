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
}

export const PresentationCarousel: React.FC<PresentationCarouselProps> = ({
  slides,
  onComplete,
  autoPlay = false,
  autoPlayInterval = 5000,
  className = "",
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

    // Navigate to dashboard after exit animation
    router.push("/main-app")

    if (onComplete) {
      onComplete()
    }
  }, [controls, router, onComplete])

  const handleExit = useCallback(async () => {
    setIsExiting(true)
    await controls.start("exit")
    router.push("/login")
  }, [controls, router])

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
      className={`fixed inset-0 h-screen w-screen z-[9999] overflow-hidden ${className}`}
      style={{
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

      {/* Header with Logo and Progress */}
      <motion.header className="absolute top-0 left-0 right-0 z-20 p-6 lg:p-8" variants={contentVariants}>
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="bg-white p-3 rounded-xl shadow-2xl">
              <Building2 className="h-8 w-8 text-[#003087]" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-white">Hedrick Brothers Construction</h1>
              <p className="text-blue-200 text-sm lg:text-base">HB Report Presentation</p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-3 py-1">
              {currentSlide + 1} of {slides.length}
            </Badge>
          </div>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <div className="relative h-full flex items-center justify-center px-6 lg:px-12">
        <div className="w-full max-w-7xl mx-auto">
          {/* Slide Container */}
          <div className="relative h-[70vh] flex items-center justify-center">
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
                <div className="w-full max-w-5xl mx-auto text-center">
                  {/* Slide Image */}
                  {current?.image && (
                    <motion.div
                      className="mb-8 lg:mb-12"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                    >
                      <div className="relative w-full h-64 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                        <Image src={current.image} alt="" fill className="object-cover" priority />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    </motion.div>
                  )}

                  {/* Slide Title */}
                  <motion.h2
                    className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 lg:mb-8 leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    {current?.title}
                  </motion.h2>

                  {/* Slide Content */}
                  <motion.div
                    className="text-lg lg:text-xl xl:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    {current?.content}
                  </motion.div>

                  {/* CTA Button for Final Slide */}
                  {current?.isFinalSlide && (
                    <motion.div
                      className="mt-12"
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.6, duration: 0.7, type: "spring" }}
                    >
                      <Button
                        onClick={handleCTAClick}
                        size="lg"
                        className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] hover:from-[#E55A2B] hover:to-[#D14D20] text-white font-semibold px-8 lg:px-12 py-4 lg:py-6 text-lg lg:text-xl shadow-2xl transform transition-all duration-300 hover:scale-105 group"
                        disabled={isExiting}
                      >
                        <Sparkles className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                        Explore what continuity looks like
                        <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
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
      <motion.div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20" variants={contentVariants}>
        <div className="flex items-center space-x-6">
          {/* Previous Button */}
          <Button
            variant="ghost"
            size="lg"
            onClick={handlePrevious}
            disabled={currentSlide === 0 || isExiting}
            className="text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Slide Dots */}
          <div className="flex items-center space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideSelect(index)}
                disabled={isExiting}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
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
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </motion.div>

      {/* Exit Button */}
      <motion.div className="absolute top-6 right-6 lg:top-8 lg:right-8 z-20" variants={contentVariants}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExit}
          disabled={isExiting}
          className="text-white hover:bg-white/20 text-sm"
          aria-label="Exit presentation"
        >
          Exit
        </Button>
      </motion.div>

      {/* Auto-play indicator */}
      {autoPlay && !isLastSlide && (
        <motion.div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10" variants={contentVariants}>
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
            <p className="text-lg font-medium">Launching HB Report...</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
