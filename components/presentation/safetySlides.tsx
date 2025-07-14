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
    title: "From Paper to Platform",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <HardHat className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            SiteMate safety management platform overlay aggregates report and inspection data for quick access and
            review. HBI (proprietary AI models) generate safety content and procedures, creating a centralized platform
            for Safety Committee collaboration.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Activity className="h-8 w-8 text-blue-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-blue-300 mb-2">SiteMate Integration</h3>
              <p className="text-blue-100 text-sm">
                Live safety metrics, incident tracking, and inspection aggregation
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Brain className="h-8 w-8 text-yellow-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">HBI AI Content</h3>
              <p className="text-blue-100 text-sm">AI-generated safety procedures and automated content creation</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Users className="h-8 w-8 text-green-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-300 mb-2">Safety Committee</h3>
              <p className="text-blue-100 text-sm">Centralized collaboration platform for safety leadership</p>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "certifications-that-dont-expire",
    title: "Certifications That Don't Expire",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Award className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The Certifications Tracker monitors every employee's safety credentials (e.g., OSHA 30, First Aid, CPR),
            with visual expiration warnings and automated renewal reminders.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Settings className="h-8 w-8 text-purple-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Optimization</h3>
              <p className="text-blue-100 text-sm">
                Auto-sync with workforce directory and color-coded status tracking
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Bell className="h-8 w-8 text-yellow-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">Productivity</h3>
              <p className="text-blue-100 text-sm">Automated reminders reduce site exposure due to expired certs</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Shield className="h-8 w-8 text-green-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-300 mb-2">Benefit</h3>
              <p className="text-blue-100 text-sm">Safer jobsites, fewer violations, no last-minute scramble</p>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "incident-logs-without-gaps",
    title: "Incident Logs Without Gaps",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <ClipboardCheck className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The Safety Forms Panel offers real-time, structured entry of safety incidents with timestamps, media upload,
            and comprehensive follow-up tracking integrated with project workflows.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <FileText className="h-8 w-8 text-blue-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-blue-300 mb-2">Optimization</h3>
              <p className="text-blue-100 text-sm">No more unfiled PDFs or follow-up falling through cracks</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <BarChart3 className="h-8 w-8 text-yellow-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">Productivity</h3>
              <p className="text-blue-100 text-sm">Supports trend analysis by trade, project, or root cause</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Brain className="h-8 w-8 text-green-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-300 mb-2">Benefit</h3>
              <p className="text-blue-100 text-sm">Turns safety logs into strategic insight and preventive action</p>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "hbi-generated-toolbox-talks",
    title: "HBI-Generated Tool Box Talks",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <MessageSquare className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            HBI generates Tool Box Talks aligning with project schedules, automatically distributed to project teams
            prior to scheduled activities. Following failed safety inspections, HBI generates notices with lessons
            learned and refreshers on appropriate standards and regulations.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Calendar className="h-8 w-8 text-purple-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Schedule Integration</h3>
              <p className="text-blue-100 text-sm">
                AI analyzes upcoming activities and generates relevant safety content
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Send className="h-8 w-8 text-yellow-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">Auto-Distribution</h3>
              <p className="text-blue-100 text-sm">Talks automatically distributed prior to scheduled activities</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Lightbulb className="h-8 w-8 text-green-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-300 mb-2">Lessons Learned</h3>
              <p className="text-blue-100 text-sm">
                HBI generates notices following failed inspections with regulatory refreshers
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "compliance-you-can-see",
    title: "Compliance You Can See",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <CheckCircle className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Live safety dashboards surface missed inspections, upcoming certification expirations, open incident
            follow-ups, and risk hotspots with Emergency Locator integration for immediate response.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Monitor className="h-8 w-8 text-blue-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-blue-300 mb-2">Real-Time Dashboards</h3>
              <p className="text-blue-100 text-sm">
                Live compliance tracking with instant visibility into safety metrics
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Users className="h-8 w-8 text-yellow-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">Proactive Management</h3>
              <p className="text-blue-100 text-sm">Enables proactive mitigation by superintendents and executives</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <MapPin className="h-8 w-8 text-green-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-300 mb-2">Emergency Response</h3>
              <p className="text-blue-100 text-sm">Integrated Emergency Locator for immediate incident response</p>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "smarter-safer-sites",
    title: "Smarter, Safer Sites",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Construction className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The Safety Control Center integrates CertificationTracker, SafetyAnnouncements, SafetyPrograms, and
            EmergencyLocator into a unified safety management ecosystem powered by HBI intelligence.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-8 w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Database className="h-8 w-8 text-purple-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Integrated Ecosystem</h3>
              <p className="text-blue-100 text-sm">Unified safety management across all HB Intel components</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Activity className="h-8 w-8 text-yellow-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">AI-Powered Intelligence</h3>
              <p className="text-blue-100 text-sm">HBI analysis drives predictive safety management and prevention</p>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 max-w-2xl mx-auto mb-8 w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-10 w-10 text-green-300 mr-3" />
              <h3 className="text-2xl font-bold text-green-300">Comprehensive Safety Leadership</h3>
            </div>
            <p className="text-xl text-blue-100 mb-4">
              <strong>Data-driven. AI-powered. Built for safety excellence.</strong>
            </p>
            <div className="flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-yellow-300 mr-2" />
              <span className="text-lg font-bold text-yellow-300">
                Creating a culture of proactive safety management
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    ),
    isFinalSlide: true,
  },
]
