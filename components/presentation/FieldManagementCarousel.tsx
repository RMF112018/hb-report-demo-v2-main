/**
 * @fileoverview Field Management Carousel Component
 * @module FieldManagementCarousel
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Professional carousel component for field management tools presentation
 */

"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X, Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { fieldManagementSlides, type FieldManagementSlide } from "./fieldManagementSlides"

interface FieldManagementCarouselProps {
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
  autoPlay?: boolean
  slideInterval?: number
}

export const FieldManagementCarousel: React.FC<FieldManagementCarouselProps> = ({
  isOpen,
  onClose,
  onComplete,
  autoPlay = true,
  slideInterval = 8000,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [progress, setProgress] = useState(0)

  const totalSlides = fieldManagementSlides.length

  // Auto-advance slides
  useEffect(() => {
    if (!isOpen || !isPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % totalSlides
        if (next === 0) {
          // Completed full cycle
          onComplete?.()
        }
        return next
      })
    }, slideInterval)

    return () => clearInterval(interval)
  }, [isOpen, isPlaying, slideInterval, totalSlides, onComplete])

  // Progress bar animation
  useEffect(() => {
    if (!isOpen || !isPlaying) return

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const increment = 100 / (slideInterval / 100)
        const newProgress = prev + increment
        if (newProgress >= 100) {
          return 0 // Reset progress for next slide
        }
        return newProgress
      })
    }, 100)

    return () => clearInterval(progressInterval)
  }, [isOpen, isPlaying, slideInterval, currentSlide])

  // Reset progress when slide changes
  useEffect(() => {
    setProgress(0)
  }, [currentSlide])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          handlePrevious()
          break
        case "ArrowRight":
          handleNext()
          break
        case " ":
          e.preventDefault()
          setIsPlaying(!isPlaying)
          break
        case "Escape":
          onClose()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, isPlaying])

  const handleNext = () => {
    setCurrentSlide((prev) => {
      const next = (prev + 1) % totalSlides
      if (next === 0) {
        onComplete?.()
      }
      return next
    })
  }

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const handleSlideSelect = (index: number) => {
    setCurrentSlide(index)
  }

  const handleRestart = () => {
    setCurrentSlide(0)
    setIsPlaying(true)
    setProgress(0)
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  if (!isOpen) return null

  const currentSlideData = fieldManagementSlides[currentSlide]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
    >
      <div className="h-full w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Field Management Tools
            </Badge>
            <div className="text-sm">
              Slide {currentSlide + 1} of {totalSlides}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleRestart} className="text-white hover:bg-white/20">
              <RotateCcw className="h-4 w-4 mr-2" />
              Restart
            </Button>
            <Button variant="ghost" size="sm" onClick={handlePlayPause} className="text-white hover:bg-white/20">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600">
          <Progress value={progress} className="h-1" />
        </div>

        {/* Main Content */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"
            >
              {currentSlideData.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            disabled={currentSlide === 0}
            className="text-white hover:bg-white/20 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {/* Slide Indicators */}
          <div className="flex items-center space-x-2">
            {fieldManagementSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideSelect(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-white" : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          <Button variant="ghost" size="sm" onClick={handleNext} className="text-white hover:bg-white/20">
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Slide Title */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
          <h2 className="text-xl font-semibold">{currentSlideData.title}</h2>
        </div>
      </div>
    </motion.div>
  )
}

export default FieldManagementCarousel
