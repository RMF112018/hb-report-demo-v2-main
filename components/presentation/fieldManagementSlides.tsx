/**
 * @fileoverview Field Management Tab Presentation Slide Definitions
 * @module fieldManagementSlides
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Complete sequence of slides for the Field Management tab presentation covering:
 * - Field Management Overview
 * - Procurement Management with Procore integration
 * - Project Scheduler with look-ahead planning
 * - Constraints Log Management
 * - Permit Log & Inspection Management
 * - Field Reports & Documentation
 */

"use client"

import React from "react"
import { motion } from "framer-motion"
import { PresentationSlide } from "./PresentationCarousel"
import {
  Building2,
  Calendar,
  AlertTriangle,
  Shield,
  ClipboardList,
  Package,
  Brain,
  BarChart3,
  Clock,
  Users,
  CheckCircle,
  TrendingUp,
  Activity,
  Target,
  Zap,
  GitBranch,
  Eye,
  Settings,
  Monitor,
  FileText,
  MapPin,
  Wrench,
} from "lucide-react"

export const fieldManagementSlides: PresentationSlide[] = [
  {
    id: "overview",
    title: "Field Management Overview",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Building2 className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Field Management</strong> unifies scheduling, constraints, inspections, and reporting into one
            platform—<strong>eliminating fragmented systems and manual workflows</strong> across the jobsite.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-blue-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Rather than switching between siloed tools and paper-based processes,{" "}
            <strong>HB's integrated field suite</strong> centralizes critical operations from procurement through daily
            reporting for streamlined execution and full project oversight.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📋</div>
              <div className="font-medium text-white">Integrated Operations</div>
              <div className="text-xs text-blue-200">Unified field management vs scattered tools</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">⚡</div>
              <div className="font-medium text-white">Real-Time Visibility</div>
              <div className="text-xs text-blue-200">Live field updates and instant reporting</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🎯</div>
              <div className="font-medium text-white">Streamlined Workflows</div>
              <div className="text-xs text-blue-200">Automated processes for maximum efficiency</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "procurement",
    title: "Procurement Management",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Package className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-green-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Procurement Management</strong> centralizes commitment tracking, vendor coordination, and{" "}
            <strong>seamless Procore integration</strong>—delivering full visibility into procurement workflows and
            eliminating manual entry.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-green-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            With real-time commitment monitoring and intelligent insights,{" "}
            <strong>procurement decisions are faster, clearer, and aligned with project budgets</strong>, all within a
            unified system.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">Commitment Tracking</div>
              <div className="text-xs text-green-200">Real-time procurement commitments and spending</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔄</div>
              <div className="font-medium text-white">Procore Integration</div>
              <div className="text-xs text-green-200">Seamless synchronization with Procore systems</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🧠</div>
              <div className="font-medium text-white">AI Insights</div>
              <div className="text-xs text-green-200">Intelligent procurement analytics and recommendations</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "scheduler",
    title: "Project Scheduler",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Calendar className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-purple-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>HBI-Integrated Project Scheduler</strong> enhances scheduling with{" "}
            <strong>real-time variance analysis, critical path monitoring, and predictive insights</strong>—delivering
            actionable schedule intelligence in one view.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-purple-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            With continuous evaluation of health metrics across 1,247 activities, HBI provides{" "}
            <strong>AI-powered forecasts, variance flags, and an AI Score (8.7/10)</strong> that highlight risks and
            optimization opportunities before delays occur.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🧠</div>
              <div className="font-medium text-white">HBI Critical Analysis</div>
              <div className="text-xs text-purple-200">AI-powered health metrics and critical path intelligence</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">Schedule Health Monitoring</div>
              <div className="text-xs text-purple-200">Real-time variance tracking and performance analytics</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">⚡</div>
              <div className="font-medium text-white">Predictive Insights</div>
              <div className="text-xs text-purple-200">AI Score (8.7/10) with proactive risk identification</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "constraints-log",
    title: "Constraints Log Management",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <AlertTriangle className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-red-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Constraints Log Management</strong> brings visibility and control to project obstacles through{" "}
            <strong>centralized issue tracking, automated escalation, and visual impact timelines</strong>.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-red-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            No more chasing emails or buried notes—
            <strong>all constraints are logged, categorized, and monitored</strong> to ensure timely resolution and
            uninterrupted progress.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🚨</div>
              <div className="font-medium text-white">Issue Tracking</div>
              <div className="text-xs text-red-200">Centralized constraint logging and categorization</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔄</div>
              <div className="font-medium text-white">Resolution Management</div>
              <div className="text-xs text-red-200">Automated workflow and escalation processes</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">Timeline Visualization</div>
              <div className="text-xs text-red-200">Visual constraint timeline and impact analysis</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "permit-log",
    title: "Permit Log & Inspection Management",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Shield className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-cyan-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Permit & Inspection Management</strong> simplifies compliance by automating{" "}
            <strong>permit tracking, inspection scheduling, and calendar integration</strong>—reducing delays and risk
            of non-compliance.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-cyan-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Say goodbye to paper files.{" "}
            <strong>Every permit and inspection is tracked, scheduled, and monitored in real-time</strong>, keeping your
            project aligned with regulatory deadlines.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📋</div>
              <div className="font-medium text-white">Permit Tracking</div>
              <div className="text-xs text-cyan-200">Comprehensive permit status and deadline management</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔍</div>
              <div className="font-medium text-white">Inspection Management</div>
              <div className="text-xs text-cyan-200">Automated inspection scheduling and tracking</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📅</div>
              <div className="font-medium text-white">Calendar Integration</div>
              <div className="text-xs text-cyan-200">Visual permit and inspection calendar management</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "field-reports",
    title: "Field Reports & Documentation",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <ClipboardList className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-orange-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Field Reports & Documentation</strong> digitizes jobsite records with{" "}
            <strong>real-time daily logs, safety tracking, and quality audits</strong>—replacing paper-based reporting
            with smart, searchable documentation.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-orange-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            With <strong>automated compliance tracking and field analytics</strong>, HB's system empowers teams to make
            faster, data-informed decisions and maintain full field transparency.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📝</div>
              <div className="font-medium text-white">Daily Logs</div>
              <div className="text-xs text-orange-200">Digital daily reporting and manpower tracking</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🛡️</div>
              <div className="font-medium text-white">Safety Audits</div>
              <div className="text-xs text-orange-200">Comprehensive safety compliance and audit tracking</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">✅</div>
              <div className="font-medium text-white">Quality Control</div>
              <div className="text-xs text-orange-200">Automated quality inspections and defect tracking</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
    isFinalSlide: true,
  },
]

export default fieldManagementSlides
