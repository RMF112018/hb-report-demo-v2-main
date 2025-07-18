/**
 * @fileoverview Project Page Presentation Slide Definitions
 * @module ProjectPageSlides
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Complete sequence of slides for the Project Page presentation.
 * Introduces users to the unified project workspace and its capabilities.
 */

"use client"

import React from "react"
import { motion } from "framer-motion"
import { PresentationSlide } from "./PresentationCarousel"
import { Building, Layers, Users, Target, Zap, Eye, ArrowRight, CheckCircle, Sparkles } from "lucide-react"

export const projectPageSlides: PresentationSlide[] = [
  {
    id: "project-page-overview",
    title: "The Central Hub for Project Continuity",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Building className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full px-4 sm:px-6">
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Our Project Page replaces fragmented tools and siloed systems with a unified interface—providing continuous
            visibility, team alignment, and decision-making clarity from preconstruction to closeout. HB Intel ensures
            that every project stakeholder sees the right information at the right time, tailored to their role and
            responsibilities.
          </motion.p>

          <motion.p
            className="text-xs sm:text-sm md:text-base text-blue-200 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            No more jumping between SharePoint folders, spreadsheets, and legacy software. This intelligent workspace
            brings everything together into one secure, role-aware environment—designed to evolve with our project's
            lifecycle and our team's needs.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🏗️</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Unified Workspace</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Manage the full project lifecycle—precon to closeout—in one centralized location.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🎯</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Role-Based Views</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Every user sees what matters most to them, based on their responsibilities.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">⚡</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Smart Navigation</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Move effortlessly across phases with workflows that stay connected and context-aware.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
    isFinalSlide: true,
  },
]
