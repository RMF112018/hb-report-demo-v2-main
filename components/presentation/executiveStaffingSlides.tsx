/* eslint-disable react/no-unescaped-entities */
/**
 * @fileoverview Executive Staffing Presentation Slide Definitions
 * @module ExecutiveStaffingSlides
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Complete sequence of slides for the Executive Staffing presentation.
 * Based on ExecutiveStaffingView.tsx component features including SPCR management,
 * drag-and-drop Gantt chart scheduling, Needing Assignment panel, and executive insights.
 *
 * Updated to follow PresentationCarousel.tsx conventions:
 * - Proper typography hierarchy with responsive text sizing
 * - Simplified layouts optimized for full-screen presentation
 * - Consistent styling with carousel background and animations
 * - Content structured for carousel's motion animation system
 */

"use client"

import React from "react"
import { motion } from "framer-motion"
import { PresentationSlide } from "./PresentationCarousel"
import {
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Zap,
  Target,
  Clock,
  CheckCircle,
  ArrowRight,
  FileText,
  Eye,
  Settings,
  Building2,
  UserCheck,
  Sparkles,
} from "lucide-react"

export const executiveStaffingSlides: PresentationSlide[] = [
  // Slide 1: From Fragmentation to Focus
  {
    id: "from-spreadsheets-to-strategy",
    title: "From Fragmentation to Focus: Advancing Workforce Planning",
    content: (
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-4 sm:mb-6 md:mb-8 text-center px-2 sm:px-4">
          Modernize our current spreadsheet-based process with{" "}
          <span style={{ color: "rgb(250, 70, 22)" }} className="font-semibold">
            connected workforce intelligence
          </span>
          —enabling scale, clarity, and long-term continuity without disrupting what works today.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-6xl w-full mx-auto px-2 sm:px-4">
          <motion.div
            className="flex flex-col justify-start text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 min-h-[200px] sm:min-h-[240px] md:min-h-[260px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center mb-2">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3" style={{ color: "rgb(250, 70, 22)" }}>
              Current Challenges
            </h3>
            <ul className="space-y-1 text-xs sm:text-sm text-blue-100 leading-relaxed">
              <li>• Time-intensive manual updates</li>
              <li>• Coordination gaps between departments</li>
              <li>• Limited forecasting due to fragmented data</li>
              <li>• Version inconsistencies across platforms</li>
            </ul>
          </motion.div>

          <motion.div
            className="flex flex-col justify-start text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 min-h-[200px] sm:min-h-[240px] md:min-h-[260px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-center mb-2">
              <Zap className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3" style={{ color: "rgb(250, 70, 22)" }}>
              Modernization
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              A <strong>centralized staffing platform</strong> enhances coordination and continuity—building on existing
              strengths while solving long-standing limitations.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col justify-start text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 min-h-[200px] sm:min-h-[240px] md:min-h-[260px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-center mb-2">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3" style={{ color: "rgb(250, 70, 22)" }}>
              Tangible Outcomes
            </h3>
            <div className="space-y-1 text-xs sm:text-sm text-blue-100 leading-relaxed">
              <p>
                <strong>Efficiency:</strong> Reclaim 5–10 hours per week
              </p>
              <p>
                <strong>Continuity:</strong> Enable confident decision-making with real-time staffing insight
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "visualizing-workforce",
    title: "Organizational Clarity through Visual Continuity",
    content: (
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4">
          Gain top-down visibility across our workforce—structured by{" "}
          <span style={{ color: "rgb(250, 70, 22)" }} className="font-semibold">
            Project Executive → Project → Role
          </span>
          —for informed planning.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto px-2 sm:px-4">
          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center mb-2">
              <Eye className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3" style={{ color: "rgb(250, 70, 22)" }}>
              Description
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              <strong>Executive matrix</strong> reveals organizational structure, enabling proactive workforce alignment
            </p>
          </motion.div>

          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-center mb-2">
              <Settings className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3" style={{ color: "rgb(250, 70, 22)" }}>
              Optimization
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Interactive <strong>drag-and-drop Gantt</strong> ensures scheduling continuity and eliminates timeline
              silos
            </p>
          </motion.div>

          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-center mb-2">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3" style={{ color: "rgb(250, 70, 22)" }}>
              Impact
            </h3>
            <div className="space-y-1 text-xs sm:text-sm text-blue-100 leading-relaxed">
              <p>
                <strong>Efficiency:</strong> Real-time staffing insight
              </p>
              <p>
                <strong>Continuity Benefit:</strong> Smarter load balancing across all projects
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="bg-gradient-to-r from-purple-500/30 to-blue-500/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 mt-4 sm:mt-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-sm sm:text-base font-semibold text-white text-center leading-relaxed">
            Visual workforce planning at executive scale—see the big picture, drill down to details.
          </p>
        </motion.div>
      </div>
    ),
  },
  {
    id: "predicting-gaps-before-they-happen",
    title: "Continuity Guardrails: Forecasting Workforce Risk",
    content: (
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4">
          Our{" "}
          <span style={{ color: "rgb(250, 70, 22)" }} className="font-semibold">
            "Needing Assignment"
          </span>{" "}
          panel maintains staffing continuity by identifying upcoming gaps before they occur.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto px-2 sm:px-4">
          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center mb-2">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3" style={{ color: "rgb(250, 70, 22)" }}>
              Description
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              <strong>Smart logic</strong> highlights staff whose assignments end within the next 30 days, color-coded
              by urgency
            </p>
          </motion.div>

          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-center mb-2">
              <Target className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3" style={{ color: "rgb(250, 70, 22)" }}>
              Optimization
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              <strong>Auto-flagging logic</strong> enhances planning continuity, filterable by role or impact
            </p>
          </motion.div>

          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-center mb-2">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3" style={{ color: "rgb(250, 70, 22)" }}>
              Results
            </h3>
            <div className="space-y-1 text-xs sm:text-sm text-blue-100 leading-relaxed">
              <p>
                <strong>Efficiency:</strong> Fill staffing gaps weeks in advance
              </p>
              <p>
                <strong>Continuity Benefit:</strong> Safeguard against project disruptions and idle labor
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 mt-4 sm:mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-sm sm:text-base lg:text-lg font-bold text-center mb-3 sm:mb-4 text-white">
            Color-Coded Early Warning System
          </h3>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6">
            <div className="text-center">
              <div className="bg-red-500/30 text-red-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold mb-1">
                ≤14 days
              </div>
              <p className="text-xs text-blue-100">Critical</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-500/30 text-yellow-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold mb-1">
                15-30 days
              </div>
              <p className="text-xs text-blue-100">Warning</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500/30 text-green-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold mb-1">
                31+ days
              </div>
              <p className="text-xs text-blue-100">Planning</p>
            </div>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "assignment-flow-refined",
    title: "Structured Assignment Flow for Seamless Continuity",
    content: (
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4">
          Simplify our workforce planning with an intuitive modal that supports{" "}
          <span style={{ color: "rgb(250, 70, 22)" }} className="font-semibold">
            consistent assignment logic
          </span>{" "}
          and decision continuity.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto px-2 sm:px-4">
          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center mb-2">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3" style={{ color: "rgb(250, 70, 22)" }}>
              Description
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              <strong>Position-grouped selectors</strong> and dual search paths (by staff or date) minimize errors and
              streamline workflows
            </p>
          </motion.div>

          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-center mb-2">
              <Zap className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3" style={{ color: "rgb(250, 70, 22)" }}>
              Optimization
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              <strong>Dynamic filtering</strong> maintains focus and continuity in critical staffing actions
            </p>
          </motion.div>

          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-center mb-2">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3" style={{ color: "rgb(250, 70, 22)" }}>
              Results
            </h3>
            <div className="space-y-1 text-xs sm:text-sm text-blue-100 leading-relaxed">
              <p>
                <strong>Efficiency:</strong> Assign roles in under 30 seconds
              </p>
              <p>
                <strong>Continuity Benefit:</strong> Fewer errors, faster transitions
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 mt-4 sm:mt-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3 text-white">Smart Features</h3>
              <ul className="space-y-1 text-xs sm:text-sm text-blue-100 leading-relaxed">
                <li>• DISC compatibility for better team fit</li>
                <li>• Position-based grouping</li>
                <li>• Availability filters</li>
                <li>• Conflict and budget checks</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3 text-white">Workflow Steps</h3>
              <ol className="space-y-1 text-xs sm:text-sm text-blue-100 leading-relaxed">
                <li>1. Select SPCR requirement</li>
                <li>2. Choose qualified staff</li>
                <li>3. Set assignment dates</li>
                <li>4. Confirm and deploy</li>
              </ol>
            </div>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "insights-in-context",
    title: "Real-Time Oversight with Strategic Continuity",
    content: (
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4">
          Gain contextual insights across our projects, with{" "}
          <span style={{ color: "rgb(250, 70, 22)" }} className="font-semibold">
            system-generated alerts
          </span>{" "}
          for misalignment, overuse, or scheduling threats.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto px-2 sm:px-4">
          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center mb-2">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3" style={{ color: "rgb(250, 70, 22)" }}>
              Description
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              <strong>Live dashboard</strong> reveals real-time trends and alerts to support continuity in workforce
              health and planning
            </p>
          </motion.div>

          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-center mb-2">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3" style={{ color: "rgb(250, 70, 22)" }}>
              Optimization
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Moves beyond static reports to <strong>living data environments</strong> for fast executive triage
            </p>
          </motion.div>

          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-center mb-2">
              <Target className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3" style={{ color: "rgb(250, 70, 22)" }}>
              Results
            </h3>
            <div className="space-y-1 text-xs sm:text-sm text-blue-100 leading-relaxed">
              <p>
                <strong>Efficiency:</strong> Direct decision-making at executive level
              </p>
              <p>
                <strong>Continuity Benefit:</strong> Connect planning, action, and oversight in one place
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 mt-4 sm:mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-sm sm:text-base lg:text-lg font-bold text-center mb-3 sm:mb-4 text-white">
            Executive Alert System
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2 sm:space-y-3">
              <h4 className="text-sm sm:text-base font-semibold" style={{ color: "rgb(250, 70, 22)" }}>
                Critical Alerts
              </h4>
              <ul className="space-y-1 text-xs sm:text-sm text-blue-100 leading-relaxed">
                <li>• Staff overallocation warnings</li>
                <li>• Schedule conflict detection</li>
                <li>• Budget variance alerts</li>
                <li>• Resource shortage notices</li>
              </ul>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <h4 className="text-sm sm:text-base font-semibold" style={{ color: "rgb(250, 70, 22)" }}>
                Trend Analysis
              </h4>
              <ul className="space-y-1 text-xs sm:text-sm text-blue-100 leading-relaxed">
                <li>• Utilization rate trends</li>
                <li>• Project timeline health</li>
                <li>• Cost performance metrics</li>
                <li>• Resource optimization opportunities</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "your-staffing-plan-elevated",
    title: "Scaling with Continuity at the Core",
    content: (
      <div className="space-y-3 sm:space-y-4 md:space-y-5">
        <p className="text-sm sm:text-base md:text-lg lg:text-lg text-blue-100 max-w-4xl mx-auto leading-relaxed mb-4 sm:mb-6 px-2 sm:px-4">
          <span style={{ color: "rgb(250, 70, 22)" }} className="font-semibold">
            Our HB Intel unified staffing platform
          </span>{" "}
          enables sustainable growth—maintaining operational continuity while expanding capacity.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto px-2 sm:px-4">
          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center mb-2">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h3 className="text-xs sm:text-sm font-bold mb-2" style={{ color: "rgb(250, 70, 22)" }}>
              Platform Integration
            </h3>
            <p className="text-xs text-blue-100 leading-relaxed">
              Seamlessly connects to <strong>HB Intel's cross-functional tools</strong>, ensuring visibility across all
              initiatives
            </p>
          </motion.div>

          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-center mb-2">
              <Settings className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h3 className="text-xs sm:text-sm font-bold mb-2" style={{ color: "rgb(250, 70, 22)" }}>
              Unified Operations
            </h3>
            <p className="text-xs text-blue-100 leading-relaxed">
              Combines <strong>dashboards, planning tools, and insights</strong> into a single strategic staffing
              ecosystem
            </p>
          </motion.div>

          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-center mb-2">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h3 className="text-xs sm:text-sm font-bold mb-2" style={{ color: "rgb(250, 70, 22)" }}>
              Scale Results
            </h3>
            <div className="space-y-1 text-xs text-blue-100 leading-relaxed">
              <p>
                <strong>Support 4× growth</strong> without 4× headcount
              </p>
              <p>Maintain planning accuracy and continuity at scale</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="bg-gradient-to-r from-orange-500/30 to-red-500/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 mt-4 sm:mt-5"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-center space-y-2 sm:space-y-3">
            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white">
              Transform Our Workforce Strategy Today
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold" style={{ color: "rgb(250, 70, 22)" }}>
                  Strategic Impact
                </h4>
                <ul className="space-y-1 text-xs text-blue-100 leading-relaxed">
                  <li>• 85% reduction in planning cycles</li>
                  <li>• 60% resource utilization improvement</li>
                  <li>• Real-time visibility with executive oversight</li>
                </ul>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold" style={{ color: "rgb(250, 70, 22)" }}>
                  Platform Integration
                </h4>
                <ul className="space-y-1 text-xs text-blue-100 leading-relaxed">
                  <li>• Unified with project dashboards</li>
                  <li>• Connected to scheduling tools</li>
                  <li>• Seamless HB Intel ecosystem</li>
                </ul>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 mt-2 sm:mt-3">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: "rgb(250, 70, 22)" }} />
              <span className="text-sm sm:text-base font-bold text-white">Ready to Scale Smart?</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
          </div>
        </motion.div>
      </div>
    ),
    isFinalSlide: true,
  },
]

export default executiveStaffingSlides
