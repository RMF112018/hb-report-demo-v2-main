/**
 * @fileoverview Safety Management Presentation Slide Definitions
 * @module SafetySlides
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Complete sequence of slides for the Safety Management presentation.
 * Based on safety components including CertificationTracker, EmergencyLocator,
 * SafetyFormsPanel, SafetyProgramsLibrary, and SafetyAnnouncements.
 *
 * Updated to follow HB Intel presentation carousel animation guidelines:
 * - Framer Motion fade/zoom transitions
 * - Consistent slide classes and styling
 * - CTA button on final slide
 * - Optional ShieldCheck icon overlay
 */

"use client"

import React from "react"
import { motion } from "framer-motion"
import { PresentationSlide } from "./PresentationCarousel"
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  Users,
  FileText,
  CheckCircle,
  Zap,
  Target,
  Clock,
  MapPin,
  Award,
  TrendingUp,
  Eye,
  Settings,
  Building2,
  UserCheck,
  Sparkles,
  Bell,
  Calendar,
  BarChart3,
  Search,
  Database,
  Smartphone,
  Clipboard,
  BookOpen,
  Megaphone,
  Activity,
  Brain,
  Monitor,
  HardHat,
  Construction,
  AlertCircle,
  Wrench,
  Building,
  Layers,
  Send,
  MessageSquare,
  Lightbulb,
  Headphones,
  ClipboardCheck,
  HeartHandshake,
  LifeBuoy,
  Stethoscope,
  Plus,
  Truck,
  Flame,
} from "lucide-react"

export const safetySlides: PresentationSlide[] = [
  {
    id: "from-paper-to-platform",
    title: "Unified Safety. Company-Wide Clarity.",
    content: (
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <motion.p
          className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Our SiteMate safety platform now feeds directly into HB Intel, giving our Safety team real-time access to
          inspection reports, incident logs, and field metrics. HBI, our intelligent assistant, auto-generates safety
          procedures and content—establishing a single source of truth for safety leadership across the company.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto w-full px-2 sm:px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-white/20">
            <Activity className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-300 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-blue-300 mb-1 sm:mb-2">
              SiteMate Integration
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Live dashboards, incident reporting, and inspection tracking—direct from the field.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-white/20">
            <Brain className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-yellow-300 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-yellow-300 mb-1 sm:mb-2">
              HBI AI Content
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Proprietary AI models craft custom safety procedures and hazard briefings.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-white/20">
            <Users className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-green-300 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-green-300 mb-1 sm:mb-2">
              Safety Committee
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Central hub for collaboration and strategic safety oversight.
            </p>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "certifications-that-dont-expire",
    title: "Certifications That Don't Expire",
    content: (
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <motion.p
          className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Our Certifications Tracker monitors every employee's safety credentials with automated alerts and renewal
          workflows—keeping teams compliant and projects uninterrupted.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto w-full px-2 sm:px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-white/20">
            <Settings className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-purple-300 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-purple-300 mb-1 sm:mb-2">Optimization</h3>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Auto-syncs with employee directories; real-time status indicators.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-white/20">
            <Bell className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-yellow-300 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-yellow-300 mb-1 sm:mb-2">Productivity</h3>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Prevent lapses with automated renewal reminders and team-wide visibility.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-white/20">
            <Shield className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-green-300 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-green-300 mb-1 sm:mb-2">Benefit</h3>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Fewer delays, safer sites, and audit-ready compliance at all times.
            </p>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "incident-logs-without-gaps",
    title: "Incident Logs Without Gaps",
    content: (
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <motion.p
          className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Every incident, every inspection—logged in real-time with photos, videos, and follow-up actions. No more
          disconnected PDFs or forgotten details. Everything is tracked, searchable, and actionable.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto w-full px-2 sm:px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-white/20">
            <FileText className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-300 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-blue-300 mb-1 sm:mb-2">Optimization</h3>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Structured digital forms eliminate data loss and inconsistency.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-white/20">
            <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-yellow-300 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-yellow-300 mb-1 sm:mb-2">Productivity</h3>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Trend analysis by trade, project, or root cause—fully integrated.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-white/20">
            <Brain className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-green-300 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-green-300 mb-1 sm:mb-2">Benefit</h3>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Actionable insights help prevent repeat incidents and drive safety culture.
            </p>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "hbi-generated-toolbox-talks",
    title: "HBI-Generated Tool Box Talks",
    content: (
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <motion.p
          className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Our HB Intel generates project-specific Tool Box Talks based on the upcoming schedule, delivering safety
          briefings before high-risk activities. Failed inspections trigger automatic follow-up content tailored to
          lessons learned and regulatory standards.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto w-full px-2 sm:px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-white/20">
            <Calendar className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-purple-300 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-purple-300 mb-1 sm:mb-2">
              Schedule Integration
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Tool Box Talks tailored to the project's evolving timeline.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-white/20">
            <Send className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-yellow-300 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-yellow-300 mb-1 sm:mb-2">
              Auto-Distribution
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Briefings auto-delivered to each project team, ahead of time.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-white/20">
            <Lightbulb className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-green-300 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-green-300 mb-1 sm:mb-2">
              Lessons Learned
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Dynamic content responds to inspection failures and recurring issues.
            </p>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "compliance-you-can-see",
    title: "Compliance You Can See",
    content: (
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <motion.p
          className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Our safety dashboards offer real-time insight into compliance status across all jobsites. Certification
          expirations, missed inspections, and incident follow-ups are surfaced immediately—empowering field leaders to
          act before risks escalate.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto w-full px-2 sm:px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-white/20">
            <Monitor className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-300 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-blue-300 mb-1 sm:mb-2">
              Real-Time Dashboards
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Always-current compliance data across all job locations.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-white/20">
            <Users className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-yellow-300 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-yellow-300 mb-1 sm:mb-2">
              Proactive Management
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Field leaders spot issues early and prevent downstream risk.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-white/20">
            <MapPin className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-green-300 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-green-300 mb-1 sm:mb-2">
              Emergency Response
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Emergency Locator integration ensures rapid response when it counts.
            </p>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "smarter-safer-sites",
    title: "Smarter, Safer Sites",
    content: (
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <motion.p
          className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Our Safety Control Center unifies safety tracking, certification oversight, and emergency response in one
          intelligent ecosystem. With HBI guidance, we can move from reactive reporting to proactive safety
          leadership—powered by data.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-3xl mx-auto mb-4 sm:mb-6 md:mb-8 w-full px-2 sm:px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-white/20">
            <Database className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-purple-300 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-purple-300 mb-1 sm:mb-2">
              Integrated Ecosystem
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Unified safety management across all HB Intel components
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-white/20">
            <Activity className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-yellow-300 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-yellow-300 mb-1 sm:mb-2">
              AI-Powered Intelligence
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              HBI analysis drives predictive safety management and prevention
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 md:p-8 border border-white/20 max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 w-full px-2 sm:px-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center mb-3 sm:mb-4">
            <Shield className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-green-300 mr-0 sm:mr-3 mb-2 sm:mb-0" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-green-300 text-center sm:text-left">
              Comprehensive Safety Leadership
            </h3>
          </div>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 mb-3 sm:mb-4 text-center leading-relaxed">
            <strong>Data-driven. AI-powered. Built for safety excellence.</strong>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-yellow-300 mr-0 sm:mr-2 mb-1 sm:mb-0" />
            <span className="text-sm sm:text-base md:text-lg font-bold text-yellow-300 text-center">
              Creating a culture of proactive safety management.
            </span>
          </div>
        </motion.div>
      </div>
    ),
    isFinalSlide: true,
  },
]

export default safetySlides
